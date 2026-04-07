import C "common";

module {
  public type BackupStatus = {
    #Pending;
    #Running;
    #Completed;
    #Failed;
  };

  public type Backup = {
    id : C.EntityId;
    tenantId : C.TenantId;
    backupLabel : Text;
    status : BackupStatus;
    createdBy : C.UserId;
    createdAt : C.Timestamp;
    completedAt : ?C.Timestamp;
    sizeBytes : ?Nat;
  };

  public type AuditLog = {
    id : C.EntityId;
    tenantId : C.TenantId;
    userId : C.UserId;
    action : Text;
    entityType : Text;
    entityId : C.EntityId;
    details : Text;
    timestamp : C.Timestamp;
  };

  public type AutomationTrigger = {
    #OnNoteCreated;
    #OnTaskStatusChange;
    #OnEventReminder;
    #OnPaymentDue;
    #OnEscrowUpdate;
    #Scheduled;
  };

  public type AutomationAction = {
    #SendNotification;
    #CreateTask;
    #UpdateStatus;
    #RunPayroll;
  };

  public type AutomationRule = {
    id : C.EntityId;
    tenantId : C.TenantId;
    name : Text;
    description : Text;
    trigger : AutomationTrigger;
    action : AutomationAction;
    isActive : Bool;
    createdBy : C.UserId;
    createdAt : C.Timestamp;
  };
};
