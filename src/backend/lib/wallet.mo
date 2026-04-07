import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Types "../types/wallet";
import Common "../types/common";

module {

  // ── Helpers ──────────────────────────────────────────────────────────────────

  func genId(seed : Text) : Common.EntityId {
    let t = Time.now();
    seed # "-" # debug_show(t)
  };

  func timeNow() : Common.Timestamp { Time.now() };

  // ── Account Management ───────────────────────────────────────────────────────

  public func createWalletAccount(
    accounts : [(Common.EntityId, Types.WalletAccount)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
    displayName : Text,
  ) : (Types.WalletAccount, [(Common.EntityId, Types.WalletAccount)]) {
    let principalId = caller.toText();
    let accountId = tenantId # principalId;
    let id = genId("wallet-" # principalId);
    let now = timeNow();
    let account : Types.WalletAccount = {
      id;
      tenantId;
      userId = caller;
      displayName;
      principalId;
      accountId;
      icpBalance = 10_000_000_000; // 100 ICP in e8s
      btcBalance = 100_000;        // 0.001 BTC in satoshis
      createdAt = now;
      updatedAt = now;
    };
    let updated = accounts.concat([(id, account)]);
    (account, updated)
  };

  public func getWalletAccount(
    accounts : [(Common.EntityId, Types.WalletAccount)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
  ) : ?Types.WalletAccount {
    let found = accounts.find(
      func((k, a)) { k == id and a.tenantId == tenantId },
    );
    switch (found) {
      case (?(_, a)) ?a;
      case null null;
    };
  };

  public func getMyWalletAccount(
    accounts : [(Common.EntityId, Types.WalletAccount)],
    tenantId : Common.TenantId,
    userId : Common.UserId,
  ) : ?Types.WalletAccount {
    let found = accounts.find(
      func((_, a)) { a.tenantId == tenantId and a.userId == userId },
    );
    switch (found) {
      case (?(_, a)) ?a;
      case null null;
    };
  };

  // ── Transactions ─────────────────────────────────────────────────────────────

  public func sendAsset(
    accounts : [(Common.EntityId, Types.WalletAccount)],
    txs : [(Common.EntityId, Types.WalletTransaction)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
    accountId : Common.EntityId,
    asset : Types.AssetType,
    amount : Nat,
    toAddress : Text,
    memo : ?Text,
  ) : { #ok : (Types.WalletTransaction, [(Common.EntityId, Types.WalletAccount)], [(Common.EntityId, Types.WalletTransaction)]); #err : Text } {
    // Find the account
    let maybeAccount = accounts.find(
      func((k, a)) { k == accountId and a.tenantId == tenantId and a.userId == caller },
    );
    switch (maybeAccount) {
      case null { #err("Account not found or not authorized") };
      case (?(_, account)) {
        // Check balance
        let hasBalance = switch (asset) {
          case (#ICP) account.icpBalance >= amount;
          case (#BTC) account.btcBalance >= amount;
        };
        if (not hasBalance) {
          #err("Insufficient balance")
        } else {
          // Deduct balance
          let updatedAccount = switch (asset) {
            case (#ICP) {
              { account with icpBalance = account.icpBalance - amount; updatedAt = timeNow() }
            };
            case (#BTC) {
              { account with btcBalance = account.btcBalance - amount; updatedAt = timeNow() }
            };
          };
          let updatedAccounts = accounts.map(
            func((k, a)) {
              if (k == accountId) (k, updatedAccount) else (k, a)
            },
          );
          // Create transaction record
          let txId = genId("tx-" # accountId);
          let tx : Types.WalletTransaction = {
            id = txId;
            tenantId;
            accountId;
            txType = #Send;
            asset;
            amount;
            toAddress = ?toAddress;
            fromAddress = ?account.principalId;
            status = #Completed;
            memo;
            createdAt = timeNow();
          };
          let updatedTxs = txs.concat([(txId, tx)]);
          #ok((tx, updatedAccounts, updatedTxs))
        };
      };
    };
  };

  public func listTransactions(
    txs : [(Common.EntityId, Types.WalletTransaction)],
    tenantId : Common.TenantId,
    accountId : Common.EntityId,
  ) : [Types.WalletTransaction] {
    txs.filter<(Common.EntityId, Types.WalletTransaction)>(
        func((_, t)) { t.tenantId == tenantId and t.accountId == accountId },
      ).map<(Common.EntityId, Types.WalletTransaction), Types.WalletTransaction>(
        func((_, t)) { t },
      )
  };

  // ── Recurring Payments ───────────────────────────────────────────────────────

  public func createRecurringPayment(
    payments : [(Common.EntityId, Types.RecurringPayment)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
    accountId : Common.EntityId,
    toAddress : Text,
    amount : Nat,
    asset : Types.AssetType,
    frequency : Common.PayFrequency,
  ) : (Types.RecurringPayment, [(Common.EntityId, Types.RecurringPayment)]) {
    let id = genId("rp-" # accountId);
    let now = timeNow();
    // nextRunAt = 1 day from now (in nanoseconds)
    let nextRunAt = now + 86_400_000_000_000;
    let payment : Types.RecurringPayment = {
      id;
      tenantId;
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
    accountId : Common.EntityId,
  ) : [Types.RecurringPayment] {
    payments.filter<(Common.EntityId, Types.RecurringPayment)>(
        func((_, p)) { p.tenantId == tenantId and p.accountId == accountId },
      ).map<(Common.EntityId, Types.RecurringPayment), Types.RecurringPayment>(
        func((_, p)) { p },
      )
  };

  public func cancelRecurringPayment(
    payments : [(Common.EntityId, Types.RecurringPayment)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : (?Types.RecurringPayment, [(Common.EntityId, Types.RecurringPayment)]) {
    var found : ?Types.RecurringPayment = null;
    let updated = payments.map(
      func((k, p)) {
        if (k == id and p.tenantId == tenantId) {
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
