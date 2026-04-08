import C "common";

module {
  public type GoalStatus = {
    #Active;
    #Completed;
    #Cancelled;
    #OnHold;
  };

  public type KRStatus = {
    #OnTrack;
    #AtRisk;
    #Behind;
    #Completed;
  };

  public type KeyResult = {
    id : C.EntityId;
    goalId : C.EntityId;
    title : Text;
    description : ?Text;
    targetValue : Float;
    currentValue : Float;
    unit : Text;
    status : KRStatus;
    linkedTaskIds : [C.EntityId];
    workspaceId : C.WorkspaceId;
    tenantId : C.TenantId;
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type Goal = {
    id : C.EntityId;
    title : Text;
    description : ?Text;
    ownerId : C.UserId;
    contributorIds : [C.UserId];
    status : GoalStatus;
    startDate : C.Timestamp;
    endDate : C.Timestamp;
    period : Text;
    progress : Float;
    keyResults : [C.EntityId];
    isPublic : Bool;
    workspaceId : C.WorkspaceId;
    tenantId : C.TenantId;
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type GoalCheckIn = {
    id : C.EntityId;
    goalId : C.EntityId;
    krId : ?C.EntityId;
    userId : C.UserId;
    previousValue : Float;
    newValue : Float;
    note : Text;
    timestamp : C.Timestamp;
    workspaceId : C.WorkspaceId;
    tenantId : C.TenantId;
  };

  public type GoalInput = {
    title : Text;
    description : ?Text;
    contributorIds : [C.UserId];
    startDate : C.Timestamp;
    endDate : C.Timestamp;
    period : Text;
  };

  public type KeyResultInput = {
    goalId : C.EntityId;
    title : Text;
    description : ?Text;
    targetValue : Float;
    unit : Text;
  };

  public type CheckInInput = {
    goalId : C.EntityId;
    krId : ?C.EntityId;
    newValue : Float;
    note : Text;
  };

  // Public-facing types (no internal/sensitive fields)
  public type PublicKeyResult = {
    id : C.EntityId;
    title : Text;
    description : ?Text;
    targetValue : Float;
    currentValue : Float;
    unit : Text;
    status : KRStatus;
  };

  public type PublicGoal = {
    id : C.EntityId;
    title : Text;
    description : ?Text;
    period : Text;
    status : GoalStatus;
    progress : Float;
    startDate : C.Timestamp;
    endDate : C.Timestamp;
    keyResults : [PublicKeyResult];
    checkInCount : Nat;
  };
};
