import C "common";

module {
  public type ProjectStatus = {
    #Active;
    #Completed;
    #Archived;
    #OnHold;
  };

  public type TaskStatus = {
    #Todo;
    #InProgress;
    #Done;
    #Blocked;
  };

  public type TaskPriority = {
    #Low;
    #Medium;
    #High;
    #Critical;
  };

  public type Project = {
    id : C.EntityId;
    tenantId : C.TenantId;
    name : Text;
    description : Text;
    status : ProjectStatus;
    ownerId : C.UserId;
    memberIds : [C.UserId];
    crossLinks : [C.CrossLink];
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type Task = {
    id : C.EntityId;
    tenantId : C.TenantId;
    projectId : C.EntityId;
    title : Text;
    description : Text;
    status : TaskStatus;
    priority : TaskPriority;
    assigneeId : ?C.UserId;
    dueDate : ?C.Timestamp;
    crossLinks : [C.CrossLink];
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type ProjectInput = {
    name : Text;
    description : Text;
    memberIds : [C.UserId];
  };

  public type TaskInput = {
    projectId : C.EntityId;
    title : Text;
    description : Text;
    priority : TaskPriority;
    assigneeId : ?C.UserId;
    dueDate : ?C.Timestamp;
    crossLinks : [C.CrossLink];
  };
};
