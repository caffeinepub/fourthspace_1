import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/projects";
import Common "../types/common";

module {

  func toMap(store : [(Common.EntityId, Types.Subtask)]) : Map.Map<Common.EntityId, Types.Subtask> {
    Map.fromArray(store)
  };

  func genId(salt : Text) : Common.EntityId {
    Time.now().toText() # "-st-" # salt
  };

  public func createSubtask(
    store : [(Common.EntityId, Types.Subtask)],
    input : Types.SubtaskInput,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Types.Subtask, [(Common.EntityId, Types.Subtask)]) {
    let now = Time.now();
    let id = genId(input.parentTaskId);
    let subtask : Types.Subtask = {
      id;
      tenantId;
      workspaceId;
      parentTaskId = input.parentTaskId;
      projectId = input.projectId;
      title = input.title;
      description = input.description;
      status = input.status;
      priority = input.priority;
      assigneeId = input.assigneeId;
      dueDate = input.dueDate;
      order = input.order;
      createdAt = now;
      updatedAt = now;
    };
    let m = toMap(store);
    m.add(id, subtask);
    (subtask, m.toArray())
  };

  public func getSubtask(
    store : [(Common.EntityId, Types.Subtask)],
    subtaskId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : ?Types.Subtask {
    let m = toMap(store);
    switch (m.get(subtaskId)) {
      case (?s) { if (s.tenantId == tenantId and s.workspaceId == workspaceId) ?s else null };
      case null null;
    }
  };

  public func listSubtasks(
    store : [(Common.EntityId, Types.Subtask)],
    parentTaskId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.Subtask] {
    let m = toMap(store);
    m.values().filter(func(s : Types.Subtask) : Bool {
      s.tenantId == tenantId and s.workspaceId == workspaceId and s.parentTaskId == parentTaskId
    }).toArray()
  };

  public func updateSubtask(
    store : [(Common.EntityId, Types.Subtask)],
    subtaskId : Common.EntityId,
    title : Text,
    status : Types.TaskStatus,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (?Types.Subtask, [(Common.EntityId, Types.Subtask)]) {
    let m = toMap(store);
    switch (m.get(subtaskId)) {
      case (?existing) {
        if (existing.tenantId != tenantId or existing.workspaceId != workspaceId) return (null, store);
        let updated : Types.Subtask = { existing with title; status; updatedAt = Time.now() };
        m.add(subtaskId, updated);
        (?updated, m.toArray())
      };
      case null (null, store);
    }
  };

  public func deleteSubtask(
    store : [(Common.EntityId, Types.Subtask)],
    subtaskId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Bool, [(Common.EntityId, Types.Subtask)]) {
    let m = toMap(store);
    switch (m.get(subtaskId)) {
      case (?s) {
        if (s.tenantId != tenantId or s.workspaceId != workspaceId) return (false, store);
        m.remove(subtaskId);
        (true, m.toArray())
      };
      case null (false, store);
    }
  };
};
