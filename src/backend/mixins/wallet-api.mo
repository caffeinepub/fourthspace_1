import Common "../types/common";
import WalTypes "../types/wallet";
import WalletLib "../lib/wallet";

module {

  public func createWalletAccount(
    accounts : [(Common.EntityId, WalTypes.WalletAccount)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    displayName : Text,
  ) : { #ok : (WalTypes.WalletAccount, [(Common.EntityId, WalTypes.WalletAccount)]); #err : Text } {
    switch (WalletLib.getMyWalletAccount(accounts, tenantId, workspaceId, caller)) {
      case (?_) { #err("Wallet account already exists for this user") };
      case null {
        let (account, updated) = WalletLib.createWalletAccount(accounts, tenantId, workspaceId, caller, displayName, #personal);
        #ok((account, updated))
      };
    }
  };

  public func createWorkspaceTreasury(
    accounts : [(Common.EntityId, WalTypes.WalletAccount)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    canisterPrincipal : Principal,
  ) : { #ok : (WalTypes.WalletAccount, [(Common.EntityId, WalTypes.WalletAccount)]); #err : Text } {
    switch (WalletLib.getWorkspaceTreasury(accounts, tenantId, workspaceId)) {
      case (?_) { #err("Workspace treasury already exists") };
      case null {
        // Treasury address is derived from the CANISTER's own principal + workspace subaccount.
        // This guarantees the treasury address is ALWAYS different from any user personal wallet.
        let (account, updated) = WalletLib.createTreasuryAccount(accounts, tenantId, workspaceId, caller, "Workspace Treasury", canisterPrincipal);
        #ok((account, updated))
      };
    }
  };

  public func getWalletAccount(
    accounts : [(Common.EntityId, WalTypes.WalletAccount)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { #ok : WalTypes.WalletAccount; #err : Text } {
    switch (WalletLib.getWalletAccount(accounts, tenantId, workspaceId, id)) {
      case (?a) #ok(a);
      case null #err("Wallet account not found");
    }
  };

  public func getMyWalletAccount(
    accounts : [(Common.EntityId, WalTypes.WalletAccount)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
  ) : ?WalTypes.WalletAccount {
    WalletLib.getMyWalletAccount(accounts, tenantId, workspaceId, caller)
  };

  public func getWorkspaceTreasury(
    accounts : [(Common.EntityId, WalTypes.WalletAccount)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : ?WalTypes.WalletAccount {
    WalletLib.getWorkspaceTreasury(accounts, tenantId, workspaceId)
  };

  public func getReceiveAddress(
    accounts : [(Common.EntityId, WalTypes.WalletAccount)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    accountId : Common.EntityId,
  ) : { #ok : Text; #err : Text } {
    switch (WalletLib.getReceiveAddress(accounts, tenantId, workspaceId, accountId)) {
      case (?addr) #ok(addr);
      case null #err("Account not found");
    }
  };

  public func sendAsset(
    accounts : [(Common.EntityId, WalTypes.WalletAccount)],
    txs : [(Common.EntityId, WalTypes.WalletTransaction)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    accountId : Common.EntityId,
    asset : WalTypes.AssetType,
    amount : Nat,
    toAddress : Text,
    memo : ?Text,
    requiredApprovals : Nat,
  ) : { #ok : (WalTypes.WalletTransaction, [(Common.EntityId, WalTypes.WalletAccount)], [(Common.EntityId, WalTypes.WalletTransaction)]); #err : Text } {
    WalletLib.sendAsset(accounts, txs, tenantId, workspaceId, caller, accountId, asset, amount, toAddress, memo, requiredApprovals)
  };

  public func listTransactions(
    txs : [(Common.EntityId, WalTypes.WalletTransaction)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    accountId : Common.EntityId,
    filter : ?WalTypes.TxFilter,
  ) : [WalTypes.WalletTransaction] {
    WalletLib.listTransactions(txs, tenantId, workspaceId, accountId, filter)
  };

  public func exportTransactions(
    txs : [(Common.EntityId, WalTypes.WalletTransaction)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    accountId : Common.EntityId,
    filter : ?WalTypes.TxFilter,
  ) : Text {
    WalletLib.exportTransactions(txs, tenantId, workspaceId, accountId, filter)
  };

  public func approveTransaction(
    accounts : [(Common.EntityId, WalTypes.WalletAccount)],
    txs : [(Common.EntityId, WalTypes.WalletTransaction)],
    approvals : [(Common.EntityId, WalTypes.TransactionApproval)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    txId : Common.EntityId,
    approver : Principal,
    approved : Bool,
    approvalsCounter : Nat,
  ) : { #ok : (WalTypes.WalletTransaction, [(Common.EntityId, WalTypes.WalletAccount)], [(Common.EntityId, WalTypes.WalletTransaction)], [(Common.EntityId, WalTypes.TransactionApproval)], Nat); #err : Text } {
    WalletLib.approveTransaction(accounts, txs, approvals, tenantId, workspaceId, txId, approver, approved, approvalsCounter)
  };

  public func getPendingApprovals(
    txs : [(Common.EntityId, WalTypes.WalletTransaction)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [WalTypes.WalletTransaction] {
    WalletLib.getPendingApprovals(txs, tenantId, workspaceId)
  };

  public func setSpendingLimit(
    limits : [(Common.EntityId, WalTypes.WorkspaceSpendingLimit)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    role : Common.Role,
    maxAmount : Float,
    currency : Text,
    counter : Nat,
  ) : { #ok : (WalTypes.WorkspaceSpendingLimit, [(Common.EntityId, WalTypes.WorkspaceSpendingLimit)], Nat); #err : Text } {
    let newCounter = counter + 1;
    let (limit, updated) = WalletLib.setSpendingLimit(limits, tenantId, workspaceId, role, maxAmount, currency, newCounter);
    #ok((limit, updated, newCounter))
  };

  public func getSpendingLimit(
    limits : [(Common.EntityId, WalTypes.WorkspaceSpendingLimit)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    role : Common.Role,
  ) : ?WalTypes.WorkspaceSpendingLimit {
    WalletLib.getSpendingLimit(limits, tenantId, workspaceId, role)
  };

  public func checkSpendingLimit(
    limits : [(Common.EntityId, WalTypes.WorkspaceSpendingLimit)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    role : Common.Role,
    amount : Float,
  ) : Bool {
    WalletLib.checkSpendingLimit(limits, tenantId, workspaceId, role, amount)
  };

  public func createRecurringPayment(
    payments : [(Common.EntityId, WalTypes.RecurringPayment)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    accountId : Common.EntityId,
    toAddress : Text,
    amount : Nat,
    asset : WalTypes.AssetType,
    frequency : Common.PayFrequency,
  ) : { #ok : (WalTypes.RecurringPayment, [(Common.EntityId, WalTypes.RecurringPayment)]); #err : Text } {
    let (payment, updated) = WalletLib.createRecurringPayment(
      payments, tenantId, workspaceId, caller, accountId, toAddress, amount, asset, frequency,
    );
    #ok((payment, updated))
  };

  public func listRecurringPayments(
    payments : [(Common.EntityId, WalTypes.RecurringPayment)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    accountId : Common.EntityId,
  ) : [WalTypes.RecurringPayment] {
    WalletLib.listRecurringPayments(payments, tenantId, workspaceId, accountId)
  };

  public func cancelRecurringPayment(
    payments : [(Common.EntityId, WalTypes.RecurringPayment)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { #ok : (WalTypes.RecurringPayment, [(Common.EntityId, WalTypes.RecurringPayment)]); #err : Text } {
    switch (WalletLib.cancelRecurringPayment(payments, tenantId, workspaceId, id, caller)) {
      case (null, _) { #err("Recurring payment not found") };
      case (?payment, updated) { #ok((payment, updated)) };
    }
  };
};
