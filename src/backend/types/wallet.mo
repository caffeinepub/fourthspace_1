import C "common";

module {
  public type AssetType = {
    #ICP;
    #BTC;
  };

  public type AccountType = {
    #personal;
    #treasury;
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
    #AwaitingApproval;
  };

  public type TransactionApproval = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    txId : C.EntityId;
    approver : Principal;
    approved : Bool;
    timestamp : C.Timestamp;
  };

  public type WalletAccount = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    userId : C.UserId;
    displayName : Text;
    principalId : Text;
    accountId : Text;          // Legacy ICP hex account ID (64 chars, CRC32 + SHA-224)
    icrc1Account : Text;       // ICRC-1 format: "principal" or "principal.subaccount"
    accountType : AccountType;
    icpBalance : Nat;          // Live ICP balance in e8s (from ledger)
    btcBalance : Nat;          // Live ckBTC balance in satoshis (from ledger)
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type WalletTransaction = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    accountId : C.EntityId;
    txType : TransactionType;
    asset : AssetType;
    amount : Nat;
    toAddress : ?Text;
    fromAddress : ?Text;
    status : TransactionStatus;
    memo : ?Text;
    memoValue : ?Nat64;         // Unique Nat64 memo used for ledger deduplication (auditing)
    requiredApprovals : Nat;
    approvals : [TransactionApproval];
    ledgerBlockHeight : ?Nat;  // Block height returned by ICP ledger on success
    ledgerTxHash : ?Text;      // Optional tx hash / identifier from ledger
    createdAt : C.Timestamp;
  };

  public type RecurringPayment = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    accountId : C.EntityId;
    toAddress : Text;
    amount : Nat;
    asset : AssetType;
    frequency : C.PayFrequency;
    nextRunAt : C.Timestamp;
    isActive : Bool;
    createdAt : C.Timestamp;
  };

  public type WorkspaceSpendingLimit = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    role : C.Role;
    maxAmount : Float;
    currency : Text;
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type TxFilter = {
    txType : ?TransactionType;
    fromDate : ?C.Timestamp;
    toDate : ?C.Timestamp;
    minAmount : ?Float;
    maxAmount : ?Float;
    status : ?TransactionStatus;
  };
};
