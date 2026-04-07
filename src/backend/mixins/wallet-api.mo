import Common "../types/common";
import WalTypes "../types/wallet";
import WalletLib "../lib/wallet";

module {

  public func createWalletAccount(
    accounts : [(Common.EntityId, WalTypes.WalletAccount)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
    displayName : Text,
  ) : { #ok : (WalTypes.WalletAccount, [(Common.EntityId, WalTypes.WalletAccount)]); #err : Text } {
    // Prevent duplicate accounts per user per tenant
    switch (WalletLib.getMyWalletAccount(accounts, tenantId, caller)) {
      case (?_) { #err("Wallet account already exists for this user") };
      case null {
        let (account, updated) = WalletLib.createWalletAccount(accounts, tenantId, caller, displayName);
        #ok((account, updated))
      };
    }
  };

  public func getWalletAccount(
    accounts : [(Common.EntityId, WalTypes.WalletAccount)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
  ) : { #ok : WalTypes.WalletAccount; #err : Text } {
    switch (WalletLib.getWalletAccount(accounts, tenantId, id)) {
      case (?a) #ok(a);
      case null #err("Wallet account not found");
    }
  };

  public func getMyWalletAccount(
    accounts : [(Common.EntityId, WalTypes.WalletAccount)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
  ) : ?WalTypes.WalletAccount {
    WalletLib.getMyWalletAccount(accounts, tenantId, caller)
  };

  public func sendAsset(
    accounts : [(Common.EntityId, WalTypes.WalletAccount)],
    txs : [(Common.EntityId, WalTypes.WalletTransaction)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
    accountId : Common.EntityId,
    asset : WalTypes.AssetType,
    amount : Nat,
    toAddress : Text,
    memo : ?Text,
  ) : { #ok : (WalTypes.WalletTransaction, [(Common.EntityId, WalTypes.WalletAccount)], [(Common.EntityId, WalTypes.WalletTransaction)]); #err : Text } {
    WalletLib.sendAsset(accounts, txs, tenantId, caller, accountId, asset, amount, toAddress, memo)
  };

  public func listTransactions(
    txs : [(Common.EntityId, WalTypes.WalletTransaction)],
    tenantId : Common.TenantId,
    accountId : Common.EntityId,
  ) : [WalTypes.WalletTransaction] {
    WalletLib.listTransactions(txs, tenantId, accountId)
  };

  public func createRecurringPayment(
    payments : [(Common.EntityId, WalTypes.RecurringPayment)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
    accountId : Common.EntityId,
    toAddress : Text,
    amount : Nat,
    asset : WalTypes.AssetType,
    frequency : Common.PayFrequency,
  ) : { #ok : (WalTypes.RecurringPayment, [(Common.EntityId, WalTypes.RecurringPayment)]); #err : Text } {
    let (payment, updated) = WalletLib.createRecurringPayment(
      payments,
      tenantId,
      caller,
      accountId,
      toAddress,
      amount,
      asset,
      frequency,
    );
    #ok((payment, updated))
  };

  public func listRecurringPayments(
    payments : [(Common.EntityId, WalTypes.RecurringPayment)],
    tenantId : Common.TenantId,
    accountId : Common.EntityId,
  ) : [WalTypes.RecurringPayment] {
    WalletLib.listRecurringPayments(payments, tenantId, accountId)
  };

  public func cancelRecurringPayment(
    payments : [(Common.EntityId, WalTypes.RecurringPayment)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { #ok : (WalTypes.RecurringPayment, [(Common.EntityId, WalTypes.RecurringPayment)]); #err : Text } {
    switch (WalletLib.cancelRecurringPayment(payments, tenantId, id, caller)) {
      case (null, _) { #err("Recurring payment not found") };
      case (?payment, updated) { #ok((payment, updated)) };
    }
  };
};
