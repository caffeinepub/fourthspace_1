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
    workspaceId : C.WorkspaceId;
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
    workspaceId : C.WorkspaceId;
    projectId : C.EntityId;
    title : Text;
    description : Text;
    status : TaskStatus;
    priority : TaskPriority;
    assigneeId : ?C.UserId;
    dueDate : ?C.Timestamp;
    tags : [Text];
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
    tags : [Text];
    crossLinks : [C.CrossLink];
  };

  // Task relationships
  public type TaskRelationshipType = {
    #relatedTo;
    #duplicateOf;
    #blocks;
    #blockedBy;
  };

  public type TaskRelationship = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    sourceTaskId : C.EntityId;
    targetTaskId : C.EntityId;
    relationshipType : TaskRelationshipType;
    createdAt : C.Timestamp;
    createdBy : C.UserId;
  };

  // Checklist items
  public type ChecklistItem = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    taskId : C.EntityId;
    content : Text;
    completed : Bool;
    order : Nat;
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type ChecklistItemInput = {
    taskId : C.EntityId;
    content : Text;
    completed : Bool;
    order : Nat;
  };

  // Task comments
  public type TaskComment = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    taskId : C.EntityId;
    authorId : C.UserId;
    content : Text;
    editedAt : ?C.Timestamp;
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type TaskCommentInput = {
    taskId : C.EntityId;
    content : Text;
  };

  // Activity feed
  public type ActivityEventType = {
    #taskCreated;
    #taskUpdated;
    #taskStatusChanged;
    #taskAssigned;
    #commentAdded;
    #commentEdited;
    #checklistItemAdded;
    #checklistItemCompleted;
    #dependencyAdded;
    #watcherAdded;
    #subtaskAdded;
    #milestoneCreated;
    #sprintStarted;
    #sprintCompleted;
  };

  public type ActivityEvent = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    taskId : C.EntityId;
    projectId : C.EntityId;
    actorId : C.UserId;
    eventType : ActivityEventType;
    description : Text;
    metadata : Text;
    createdAt : C.Timestamp;
  };

  // Task watchers
  public type TaskWatcher = {
    taskId : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    userId : C.UserId;
    addedAt : C.Timestamp;
  };

  // Subtasks
  public type Subtask = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    parentTaskId : C.EntityId;
    projectId : C.EntityId;
    title : Text;
    description : Text;
    status : TaskStatus;
    priority : TaskPriority;
    assigneeId : ?C.UserId;
    dueDate : ?C.Timestamp;
    order : Nat;
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type SubtaskInput = {
    parentTaskId : C.EntityId;
    projectId : C.EntityId;
    title : Text;
    description : Text;
    status : TaskStatus;
    priority : TaskPriority;
    assigneeId : ?C.UserId;
    dueDate : ?C.Timestamp;
    order : Nat;
  };

  // Sprints
  public type SprintStatus = {
    #planned;
    #active;
    #completed;
  };

  public type Sprint = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    projectId : C.EntityId;
    name : Text;
    goal : Text;
    startDate : C.Timestamp;
    endDate : C.Timestamp;
    status : SprintStatus;
    taskIds : [C.EntityId];
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type SprintInput = {
    projectId : C.EntityId;
    name : Text;
    goal : Text;
    startDate : C.Timestamp;
    endDate : C.Timestamp;
    taskIds : [C.EntityId];
  };

  // Milestones
  public type MilestoneStatus = {
    #upcoming;
    #reached;
    #missed;
  };

  public type Milestone = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    projectId : C.EntityId;
    title : Text;
    description : Text;
    dueDate : C.Timestamp;
    status : MilestoneStatus;
    linkedTaskIds : [C.EntityId];
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type MilestoneInput = {
    projectId : C.EntityId;
    title : Text;
    description : Text;
    dueDate : C.Timestamp;
    linkedTaskIds : [C.EntityId];
  };

  // Recurring tasks
  public type RecurrenceType = {
    #daily;
    #weekly;
    #monthly;
  };

  public type RecurringTask = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    projectId : C.EntityId;
    title : Text;
    description : Text;
    priority : TaskPriority;
    assigneeId : ?C.UserId;
    recurrenceType : RecurrenceType;
    lastCreatedAt : ?C.Timestamp;
    nextDueAt : C.Timestamp;
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type RecurringTaskInput = {
    projectId : C.EntityId;
    title : Text;
    description : Text;
    priority : TaskPriority;
    assigneeId : ?C.UserId;
    recurrenceType : RecurrenceType;
    startDate : C.Timestamp;
  };

  // Task templates
  public type TaskTemplate = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    projectId : ?C.EntityId;
    name : Text;
    description : Text;
    defaultPriority : TaskPriority;
    defaultAssigneeId : ?C.UserId;
    checklistItems : [Text];
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type TaskTemplateInput = {
    projectId : ?C.EntityId;
    name : Text;
    description : Text;
    defaultPriority : TaskPriority;
    defaultAssigneeId : ?C.UserId;
    checklistItems : [Text];
  };
};
