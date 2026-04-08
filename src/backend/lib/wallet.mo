import Time "mo:core/Time";
import Types "../types/wallet";
import Common "../types/common";
import Ledger "ledger";
import Principal "mo:core/Principal";
import Blob "mo:core/Blob";
import Array "mo:core/Array";
import Nat8 "mo:core/Nat8";
import Nat32 "mo:core/Nat32";
import Text "mo:core/Text";

module {

  // ── Helpers ──────────────────────────────────────────────────────────────────

  func genId(seed : Text) : Common.EntityId {
    let t = Time.now();
    seed # "-" # debug_show(t)
  };

  func timeNow() : Common.Timestamp { Time.now() };

  // ── Account Management ───────────────────────────────────────────────────────

  /// Derive a 32-byte subaccount blob from a workspace ID text string.
  /// Encodes the text as UTF-8 bytes, takes up to 32 bytes, and zero-pads to exactly 32 bytes.
  /// This ensures every workspace treasury has a unique subaccount distinct from the
  /// personal wallet default subaccount (all-zeros).
  public func workspaceSubaccount(workspaceId : Common.WorkspaceId) : Blob {
    let textBytes = workspaceId.toArray();
    let subBytes = Array.tabulate(32, func(i : Nat) : Nat8 {
      if (i < textBytes.size()) {
        Nat8.fromNat(textBytes[i].toNat32().toNat() % 256)
      } else {
        0 : Nat8
      }
    });
    Blob.fromArray(subBytes)
  };

  /// Internal helper — create a wallet account with an explicit subaccount blob.
  /// subaccount = null  → personal wallet (default all-zeros subaccount)
  /// subaccount = ?blob → treasury (non-zero subaccount derived from workspace)
  func createAccountInternal(
    accounts : [(Common.EntityId, Types.WalletAccount)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    displayName : Text,
    accountType : Types.AccountType,
    subaccount : ?Blob,
  ) : (Types.WalletAccount, [(Common.EntityId, Types.WalletAccount)]) {
    let principalId = caller.toText();
    // Derive canonical ICP account ID using SHA-224 + CRC32, with the given subaccount
    let accountIdBlob = Ledger.deriveAccountId(caller, subaccount);
    let accountId = Ledger.accountIdToHex(accountIdBlob);
    // ICRC-1 format: "principal" for default subaccount, "principal.subhex" for treasury
    let icrc1Account = switch (subaccount) {
      case null { Ledger.formatIcrc1Account(caller, null) };
      case (?sub) {
        let subBytes = sub.toArray();
        Ledger.formatIcrc1Account(caller, ?subBytes)
      };
    };
    let id = genId("wallet-" # principalId # debug_show(accountType));
    let now = timeNow();
    let account : Types.WalletAccount = {
      id;
      tenantId;
      workspaceId;
      userId = caller;
      displayName;
      principalId;
      accountId;
      icrc1Account;
      accountType;
      icpBalance = 0;  // Real balance fetched live from ledger — start at 0
      btcBalance = 0;  // Real balance fetched live from ledger — start at 0
      createdAt = now;
      updatedAt = now;
    };
    let updated = accounts.concat([(id, account)]);
    (account, updated)
  };

  /// Create a personal wallet account with real ICP account ID derived from the caller's principal.
  /// Uses the default subaccount (all-zeros) — standard ICP personal wallet address.
  /// principalId  = caller.toText() (canonical text form)
  /// accountId    = 64-char hex of CRC32(SHA-224(0x0A|"account-id"|principal_bytes|subaccount_zeros))
  /// icrc1Account = principal text only (default subaccount)
  public func createWalletAccount(
    accounts : [(Common.EntityId, Types.WalletAccount)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    displayName : Text,
    accountType : Types.AccountType,
  ) : (Types.WalletAccount, [(Common.EntityId, Types.WalletAccount)]) {
    // Personal wallet always uses default (null) subaccount — all-zeros
    createAccountInternal(accounts, tenantId, workspaceId, caller, displayName, accountType, null)
  };

  /// Create a workspace treasury account with a workspace-derived subaccount.
  /// The address is derived from the CANISTER's own principal + workspace subaccount,
  /// which guarantees the treasury address is ALWAYS distinct from any user's personal
  /// wallet address (personal uses the user's principal + all-zeros subaccount).
  ///
  /// Parameters:
  ///   canisterPrincipal - Principal.fromActor(this) passed from main.mo
  ///   caller            - the user creating the treasury (stored as userId only)
  ///
  /// accountId    = 64-char hex derived from canisterPrincipal + workspaceId subaccount
  /// icrc1Account = "canisterPrincipal.subhex" format
  /// principalId  = canisterPrincipal.toText() (the address owner for receiving)
  public func createTreasuryAccount(
    accounts : [(Common.EntityId, Types.WalletAccount)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    displayName : Text,
    canisterPrincipal : Principal,
  ) : (Types.WalletAccount, [(Common.EntityId, Types.WalletAccount)]) {
    // Treasury uses a workspace-derived subaccount AND the canister's own principal.
    // This guarantees a different address from any user personal wallet.
    let sub = workspaceSubaccount(workspaceId);
    // Derive account ID from canister principal (not caller) so treasury != personal wallet
    let accountIdBlob = Ledger.deriveAccountId(canisterPrincipal, ?sub);
    let accountId = Ledger.accountIdToHex(accountIdBlob);
    let subBytes = sub.toArray();
    let icrc1Account = Ledger.formatIcrc1Account(canisterPrincipal, ?subBytes);
    let principalId = canisterPrincipal.toText();
    let id = genId("wallet-" # principalId # debug_show(#treasury : Types.AccountType));
    let now = timeNow();
    let account : Types.WalletAccount = {
      id;
      tenantId;
      workspaceId;
      userId = caller;        // who created/manages the treasury
      displayName;
      principalId;            // canister principal text (the receiving address owner)
      accountId;              // 64-char hex ICP account ID (canister + workspace subaccount)
      icrc1Account;           // ICRC-1 format: "canisterPrincipal.subhex"
      accountType = #treasury;
      icpBalance = 0;
      btcBalance = 0;
      createdAt = now;
      updatedAt = now;
    };
    let updated = accounts.concat([(id, account)]);
    (account, updated)
  };

  public func getWalletAccount(
    accounts : [(Common.EntityId, Types.WalletAccount)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : ?Types.WalletAccount {
    let found = accounts.find(
      func((k, a)) { k == id and a.tenantId == tenantId and a.workspaceId == workspaceId },
    );
    switch (found) {
      case (?(_, a)) ?a;
      case null null;
    };
  };

  public func getMyWalletAccount(
    accounts : [(Common.EntityId, Types.WalletAccount)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    userId : Common.UserId,
  ) : ?Types.WalletAccount {
    let found = accounts.find(
      func((_, a)) {
        a.tenantId == tenantId and a.workspaceId == workspaceId and a.userId == userId and a.accountType == #personal
      },
    );
    switch (found) {
      case (?(_, a)) ?a;
      case null null;
    };
  };

  public func getWorkspaceTreasury(
    accounts : [(Common.EntityId, Types.WalletAccount)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : ?Types.WalletAccount {
    let found = accounts.find(
      func((_, a)) { a.tenantId == tenantId and a.workspaceId == workspaceId and a.accountType == #treasury },
    );
    switch (found) {
      case (?(_, a)) ?a;
      case null null;
    };
  };

  public func getReceiveAddress(
    accounts : [(Common.EntityId, Types.WalletAccount)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    accountId : Common.EntityId,
  ) : ?Text {
    switch (getWalletAccount(accounts, tenantId, workspaceId, accountId)) {
      case null null;
      case (?a) ?a.accountId;
    };
  };

  // ── Transactions ─────────────────────────────────────────────────────────────

  /// Validate a send request and create a pending transaction record.
  /// The actual ledger transfer is performed by main.mo after calling this.
  /// If requiredApprovals > 0, the transaction stays #AwaitingApproval until approved.
  /// If requiredApprovals == 0, the transaction is set to #Pending (ledger call pending in main.mo).
  /// memoCounter: a unique Nat64 to be used as the ledger deduplication memo for this transfer.
  public func prepareSendAsset(
    accounts : [(Common.EntityId, Types.WalletAccount)],
    txs : [(Common.EntityId, Types.WalletTransaction)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    accountId : Common.EntityId,
    asset : Types.AssetType,
    amount : Nat,
    toAddress : Text,
    memo : ?Text,
    requiredApprovals : Nat,
    memoCounter : Nat64,
  ) : { #ok : (Types.WalletTransaction, Types.WalletAccount, [(Common.EntityId, Types.WalletAccount)], [(Common.EntityId, Types.WalletTransaction)]); #err : Text } {
    let maybeAccount = accounts.find(
      func((k, a)) { k == accountId and a.tenantId == tenantId and a.workspaceId == workspaceId and a.userId == caller },
    );
    switch (maybeAccount) {
      case null { #err("Account not found or not authorized") };
      case (?(_, account)) {
        let txStatus : Types.TransactionStatus = if (requiredApprovals > 0) #AwaitingApproval else #Pending;
        let txId = genId("tx-" # accountId);
        let tx : Types.WalletTransaction = {
          id = txId;
          tenantId;
          workspaceId;
          accountId;
          txType = #Send;
          asset;
          amount;
          toAddress = ?toAddress;
          fromAddress = ?account.accountId;
          status = txStatus;
          memo;
          memoValue = ?memoCounter;
          requiredApprovals;
          approvals = [];
          ledgerBlockHeight = null;
          ledgerTxHash = null;
          createdAt = timeNow();
        };
        let updatedTxs = txs.concat([(txId, tx)]);
        // Don't deduct balance here — balance is live from ledger
        #ok((tx, account, accounts, updatedTxs))
      };
    };
  };

  /// Mark a pending transaction as completed with the ledger block height.
  public func completeSendAsset(
    txs : [(Common.EntityId, Types.WalletTransaction)],
    txId : Common.EntityId,
    blockHeight : Nat,
  ) : [(Common.EntityId, Types.WalletTransaction)] {
    txs.map(
      func((k, t)) {
        if (k == txId) {
          (k, { t with status = #Completed; ledgerBlockHeight = ?blockHeight })
        } else { (k, t) }
      },
    )
  };

  /// Mark a pending transaction as failed.
  public func failSendAsset(
    txs : [(Common.EntityId, Types.WalletTransaction)],
    txId : Common.EntityId,
  ) : [(Common.EntityId, Types.WalletTransaction)] {
    txs.map(
      func((k, t)) {
        if (k == txId) (k, { t with status = #Failed })
        else (k, t)
      },
    )
  };

  // Keep the original sendAsset signature for backward compatibility with the mixin
  // This path is used when requiredApprovals > 0 (approval workflow, no immediate ledger call)
  public func sendAsset(
    accounts : [(Common.EntityId, Types.WalletAccount)],
    txs : [(Common.EntityId, Types.WalletTransaction)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    accountId : Common.EntityId,
    asset : Types.AssetType,
    amount : Nat,
    toAddress : Text,
    memo : ?Text,
    requiredApprovals : Nat,
  ) : { #ok : (Types.WalletTransaction, [(Common.EntityId, Types.WalletAccount)], [(Common.EntityId, Types.WalletTransaction)]); #err : Text } {
    // memoCounter 0 is fine here — approval-queued txs don't hit the ledger until approved in main.mo
    switch (prepareSendAsset(accounts, txs, tenantId, workspaceId, caller, accountId, asset, amount, toAddress, memo, requiredApprovals, (0 : Nat64))) {
      case (#err e) #err e;
      case (#ok(tx, _, updatedAccounts, updatedTxs)) #ok((tx, updatedAccounts, updatedTxs));
    }
  };

  public func listTransactions(
    txs : [(Common.EntityId, Types.WalletTransaction)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    accountId : Common.EntityId,
    filter : ?Types.TxFilter,
  ) : [Types.WalletTransaction] {
    txs.filter<(Common.EntityId, Types.WalletTransaction)>(
      func((_, t)) {
        if (not (t.tenantId == tenantId and t.workspaceId == workspaceId and t.accountId == accountId)) {
          return false;
        };
        switch (filter) {
          case null true;
          case (?f) {
            let typeOk = switch (f.txType) {
              case null true;
              case (?ty) { t.txType == ty };
            };
            let fromOk = switch (f.fromDate) {
              case null true;
              case (?d) { t.createdAt >= d };
            };
            let toOk = switch (f.toDate) {
              case null true;
              case (?d) { t.createdAt <= d };
            };
            let minOk = switch (f.minAmount) {
              case null true;
              case (?min) { t.amount.toFloat() >= min };
            };
            let maxOk = switch (f.maxAmount) {
              case null true;
              case (?max) { t.amount.toFloat() <= max };
            };
            let statusOk = switch (f.status) {
              case null true;
              case (?s) { t.status == s };
            };
            typeOk and fromOk and toOk and minOk and maxOk and statusOk
          };
        };
      },
    ).map<(Common.EntityId, Types.WalletTransaction), Types.WalletTransaction>(
      func((_, t)) { t },
    )
  };

  // ── Transaction Approvals ─────────────────────────────────────────────────────

  public func requestTransactionApproval(
    txs : [(Common.EntityId, Types.WalletTransaction)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    txId : Common.EntityId,
  ) : ?Types.WalletTransaction {
    let found = txs.find(
      func((k, t)) { k == txId and t.tenantId == tenantId and t.workspaceId == workspaceId },
    );
    switch (found) {
      case (?(_, t)) ?t;
      case null null;
    };
  };

  public func approveTransaction(
    accounts : [(Common.EntityId, Types.WalletAccount)],
    txs : [(Common.EntityId, Types.WalletTransaction)],
    approvals : [(Common.EntityId, Types.TransactionApproval)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    txId : Common.EntityId,
    approver : Principal,
    approved : Bool,
    approvalsCounter : Nat,
  ) : { #ok : (Types.WalletTransaction, [(Common.EntityId, Types.WalletAccount)], [(Common.EntityId, Types.WalletTransaction)], [(Common.EntityId, Types.TransactionApproval)], Nat); #err : Text } {
    let maybeTx = txs.find(
      func((k, t)) { k == txId and t.tenantId == tenantId and t.workspaceId == workspaceId and t.status == #AwaitingApproval },
    );
    switch (maybeTx) {
      case null { #err("Transaction not found or not awaiting approval") };
      case (?(_, tx)) {
        let now = timeNow();
        let newCounter = approvalsCounter + 1;
        let approvalId = "appr-" # newCounter.toText();
        let newApproval : Types.TransactionApproval = {
          id = approvalId;
          tenantId;
          workspaceId;
          txId;
          approver;
          approved;
          timestamp = now;
        };
        let updatedApprovalsStore = approvals.concat([(approvalId, newApproval)]);
        let txApprovals = updatedApprovalsStore.filter(
          func((_, a)) { a.txId == txId and a.approved },
        );
        let approvalCount = txApprovals.size();
        let newStatus : Types.TransactionStatus = if (not approved) {
          #Cancelled
        } else if (approvalCount >= tx.requiredApprovals) {
          // When all approvals are in, set to Pending — ledger call will happen in main.mo
          #Pending
        } else {
          #AwaitingApproval
        };
        let allTxApprovals = updatedApprovalsStore.filter(
          func((_, a)) { a.txId == txId },
        ).map(func((_, a) : (Common.EntityId, Types.TransactionApproval)) : Types.TransactionApproval { a });
        let updatedTxs = txs.map(
          func((k, t)) {
            if (k == txId) {
              (k, { t with status = newStatus; approvals = allTxApprovals })
            } else { (k, t) }
          },
        );
        #ok((
          { tx with status = newStatus; approvals = allTxApprovals },
          accounts,
          updatedTxs,
          updatedApprovalsStore,
          newCounter,
        ))
      };
    };
  };

  public func getPendingApprovals(
    txs : [(Common.EntityId, Types.WalletTransaction)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.WalletTransaction] {
    txs.filter(
      func((_, t)) { t.tenantId == tenantId and t.workspaceId == workspaceId and t.status == #AwaitingApproval },
    ).map<(Common.EntityId, Types.WalletTransaction), Types.WalletTransaction>(
      func((_, t)) { t },
    )
  };

  // ── Spending Limits ───────────────────────────────────────────────────────────

  public func setSpendingLimit(
    limits : [(Common.EntityId, Types.WorkspaceSpendingLimit)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    role : Common.Role,
    maxAmount : Float,
    currency : Text,
    counter : Nat,
  ) : (Types.WorkspaceSpendingLimit, [(Common.EntityId, Types.WorkspaceSpendingLimit)]) {
    let now = timeNow();
    let id = "spl-" # counter.toText();
    let existing = limits.filter(
      func((_, l)) { not (l.tenantId == tenantId and l.workspaceId == workspaceId and l.role == role) },
    );
    let limit : Types.WorkspaceSpendingLimit = {
      id;
      tenantId;
      workspaceId;
      role;
      maxAmount;
      currency;
      createdAt = now;
      updatedAt = now;
    };
    let updated = existing.concat([(id, limit)]);
    (limit, updated);
  };

  public func getSpendingLimit(
    limits : [(Common.EntityId, Types.WorkspaceSpendingLimit)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    role : Common.Role,
  ) : ?Types.WorkspaceSpendingLimit {
    let found = limits.find(
      func((_, l)) { l.tenantId == tenantId and l.workspaceId == workspaceId and l.role == role },
    );
    switch (found) {
      case (?(_, l)) ?l;
      case null null;
    };
  };

  public func checkSpendingLimit(
    limits : [(Common.EntityId, Types.WorkspaceSpendingLimit)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    role : Common.Role,
    amount : Float,
  ) : Bool {
    switch (getSpendingLimit(limits, tenantId, workspaceId, role)) {
      case null true;
      case (?l) { amount <= l.maxAmount };
    };
  };

  // ── Export ────────────────────────────────────────────────────────────────────

  func txTypeText(t : Types.TransactionType) : Text {
    switch (t) {
      case (#Send) "Send";
      case (#Receive) "Receive";
      case (#Swap) "Swap";
      case (#Stake) "Stake";
      case (#Unstake) "Unstake";
    };
  };

  func assetText(a : Types.AssetType) : Text {
    switch (a) {
      case (#ICP) "ICP";
      case (#BTC) "BTC";
    };
  };

  func statusText(s : Types.TransactionStatus) : Text {
    switch (s) {
      case (#Pending) "Pending";
      case (#Completed) "Completed";
      case (#Failed) "Failed";
      case (#Cancelled) "Cancelled";
      case (#AwaitingApproval) "AwaitingApproval";
    };
  };

  public func exportTransactions(
    txs : [(Common.EntityId, Types.WalletTransaction)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    accountId : Common.EntityId,
    filter : ?Types.TxFilter,
  ) : Text {
    let rows = listTransactions(txs, tenantId, workspaceId, accountId, filter);
    let header = "id,type,asset,amount,toAddress,fromAddress,status,memo,ledgerBlockHeight,createdAt\n";
    let body = rows.foldLeft(
      "",
      func(acc : Text, t : Types.WalletTransaction) : Text {
        let row = t.id # ","
          # txTypeText(t.txType) # ","
          # assetText(t.asset) # ","
          # t.amount.toText() # ","
          # (switch (t.toAddress) { case null ""; case (?v) v }) # ","
          # (switch (t.fromAddress) { case null ""; case (?v) v }) # ","
          # statusText(t.status) # ","
          # (switch (t.memo) { case null ""; case (?v) v }) # ","
          # (switch (t.ledgerBlockHeight) { case null ""; case (?b) b.toText() }) # ","
          # t.createdAt.toText() # "\n";
        acc # row
      },
    );
    header # body
  };

  // ── Recurring Payments ───────────────────────────────────────────────────────

  public func createRecurringPayment(
    payments : [(Common.EntityId, Types.RecurringPayment)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    accountId : Common.EntityId,
    toAddress : Text,
    amount : Nat,
    asset : Types.AssetType,
    frequency : Common.PayFrequency,
  ) : (Types.RecurringPayment, [(Common.EntityId, Types.RecurringPayment)]) {
    let id = genId("rp-" # accountId);
    let now = timeNow();
    let nextRunAt = now + 86_400_000_000_000;
    let payment : Types.RecurringPayment = {
      id;
      tenantId;
      workspaceId;
      accountId;
      toAddress;
      amount;
      asset;
      frequency;
      nextRunAt;
      isActive = true;
      createdAt = now;
    };
    let updated = payments.concat([(id, payment)]);
    (payment, updated)
  };

  public func listRecurringPayments(
    payments : [(Common.EntityId, Types.RecurringPayment)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    accountId : Common.EntityId,
  ) : [Types.RecurringPayment] {
    payments.filter<(Common.EntityId, Types.RecurringPayment)>(
        func((_, p)) { p.tenantId == tenantId and p.workspaceId == workspaceId and p.accountId == accountId },
      ).map<(Common.EntityId, Types.RecurringPayment), Types.RecurringPayment>(
        func((_, p)) { p },
      )
  };

  public func cancelRecurringPayment(
    payments : [(Common.EntityId, Types.RecurringPayment)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : (?Types.RecurringPayment, [(Common.EntityId, Types.RecurringPayment)]) {
    var found : ?Types.RecurringPayment = null;
    let updated = payments.map(
      func((k, p)) {
        if (k == id and p.tenantId == tenantId and p.workspaceId == workspaceId) {
          let cancelled = { p with isActive = false };
          found := ?cancelled;
          (k, cancelled)
        } else {
          (k, p)
        }
      },
    );
    (found, updated)
  };
};
