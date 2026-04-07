import C "common";

module {
  public type EscrowStatus = {
    #Pending;
    #Funded;
    #Released;
    #Disputed;
    #Cancelled;
  };

  public type EscrowContract = {
    id : C.EntityId;
    tenantId : C.TenantId;
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
};
