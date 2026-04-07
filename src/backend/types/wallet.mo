import C "common";

module {
  public type AssetType = {
    #ICP;
    #BTC;
  };

  public type TransactionType = {
    #Send;
    #Receive;
    #Swap;
    #Stake;
    #Unstake;
  };

  public type TransactionStatus = {
    #Pending;
    #Completed;
    #Failed;
    #Cancelled;
  };

  public type WalletAccount = {
    id : C.EntityId;
    tenantId : C.TenantId;
    userId : C.UserId;
    displayName : Text;
    principalId : Text;
    accountId : Text;
    icpBalance : Nat;
    btcBalance : Nat;
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type WalletTransaction = {
    id : C.EntityId;
    tenantId : C.TenantId;
    accountId : C.EntityId;
    txType : TransactionType;
    asset : AssetType;
    amount : Nat;
    toAddress : ?Text;
    fromAddress : ?Text;
    status : TransactionStatus;
    memo : ?Text;
    createdAt : C.Timestamp;
  };

  public type RecurringPayment = {
    id : C.EntityId;
    tenantId : C.TenantId;
    accountId : C.EntityId;
    toAddress : Text;
    amount : Nat;
    asset : AssetType;
    frequency : C.PayFrequency;
    nextRunAt : C.Timestamp;
    isActive : Bool;
    createdAt : C.Timestamp;
  };
};
