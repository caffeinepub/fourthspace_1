import C "common";

module {
  public type EscrowStatus = {
    #Pending;
    #Funded;
    #Released;
    #Disputed;
    #Cancelled;
  };

  public type MilestoneStatus = {
    #Pending;
    #Approved;
    #Releasing;  // Interim: ledger call in-flight, state recorded before transfer
    #Released;
  };

  public type EscrowMilestone = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    escrowId : C.EntityId;
    title : Text;
    description : Text;
    amount : Nat;
    status : MilestoneStatus;
    ledgerBlockHeight : ?Nat;  // Block height from ICP ledger when funds were released
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type EscrowMilestoneInput = {
    title : Text;
    description : Text;
    amount : Nat;
  };

  public type DisputeStatus = {
    #Open;
    #Resolved;
  };

  public type EscrowDispute = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    escrowId : C.EntityId;
    raisedBy : Principal;
    reason : Text;
    arbiter : ?Principal;
    resolution : ?Text;
    status : DisputeStatus;
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type StatusHistoryEntry = {
    status : EscrowStatus;
    timestamp : C.Timestamp;
    changedBy : Principal;
    note : ?Text;
  };

  public type EscrowContract = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    title : Text;
    description : Text;
    amount : Nat;
    currency : Text;
    payerId : C.UserId;
    payeeId : C.UserId;
    status : EscrowStatus;
    conditions : [Text];
    dueDate : ?C.Timestamp;
    crossLinks : [C.CrossLink];
    statusHistory : [StatusHistoryEntry];
    fundedAmount : ?Nat;         // Actual amount received (may differ from agreed due to fees)
    fundingBlockHeight : ?Nat;   // Ledger block height when funded via depositEscrow
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type EscrowInput = {
    title : Text;
    description : Text;
    amount : Nat;
    currency : Text;
    payeeId : C.UserId;
    conditions : [Text];
    dueDate : ?C.Timestamp;
    crossLinks : [C.CrossLink];
  };

  public type EscrowFilter = {
    status : ?EscrowStatus;
    fromDate : ?C.Timestamp;
    toDate : ?C.Timestamp;
  };

  public type EscrowSummary = {
    id : C.EntityId;
    title : Text;
    payerId : Text;
    payeeId : Text;
    amount : Nat;
    currency : Text;
    status : EscrowStatus;
    conditions : [Text];
    milestoneCount : Nat;
    statusHistory : [StatusHistoryEntry];
    createdAt : C.Timestamp;
  };
};
