import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/projects";
import Common "../types/common";

module {

  func toMap(store : [(Common.EntityId, Types.Sprint)]) : Map.Map<Common.EntityId, Types.Sprint> {
    Map.fromArray(store)
  };

  func genId(salt : Text) : Common.EntityId {
    Time.now().toText() # "-sp-" # salt
  };

  public func createSprint(
    store : [(Common.EntityId, Types.Sprint)],
    input : Types.SprintInput,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Types.Sprint, [(Common.EntityId, Types.Sprint)]) {
    let now = Time.now();
    let id = genId(input.projectId);
    let sprint : Types.Sprint = {
      id;
      tenantId;
      workspaceId;
      projectId = input.projectId;
      name = input.name;
      goal = input.goal;
      startDate = input.startDate;
      endDate = input.endDate;
      status = #planned;
      taskIds = input.taskIds;
      createdAt = now;
      updatedAt = now;
    };
    let m = toMap(store);
    m.add(id, sprint);
    (sprint, m.toArray())
  };

  public func getSprint(
    store : [(Common.EntityId, Types.Sprint)],
    sprintId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : ?Types.Sprint {
    let m = toMap(store);
    switch (m.get(sprintId)) {
      case (?s) { if (s.tenantId == tenantId and s.workspaceId == workspaceId) ?s else null };
      case null null;
    }
  };

  public func listSprints(
    store : [(Common.EntityId, Types.Sprint)],
    projectId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.Sprint] {
    let m = toMap(store);
    m.values().filter(func(s : Types.Sprint) : Bool {
      s.tenantId == tenantId and s.workspaceId == workspaceId and s.projectId == projectId
    }).toArray()
  };

  public func updateSprint(
    store : [(Common.EntityId, Types.Sprint)],
    sprintId : Common.EntityId,
    name : Text,
    goal : Text,
    status : Types.SprintStatus,
    taskIds : [Common.EntityId],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (?Types.Sprint, [(Common.EntityId, Types.Sprint)]) {
    let m = toMap(store);
    switch (m.get(sprintId)) {
      case (?existing) {
        if (existing.tenantId != tenantId or existing.workspaceId != workspaceId) return (null, store);
        let updated : Types.Sprint = { existing with name; goal; status; taskIds; updatedAt = Time.now() };
        m.add(sprintId, updated);
        (?updated, m.toArray())
      };
      case null (null, store);
    }
  };

  public func deleteSprint(
    store : [(Common.EntityId, Types.Sprint)],
    sprintId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Bool, [(Common.EntityId, Types.Sprint)]) {
    let m = toMap(store);
    switch (m.get(sprintId)) {
      case (?s) {
        if (s.tenantId != tenantId or s.workspaceId != workspaceId) return (false, store);
        m.remove(sprintId);
        (true, m.toArray())
      };
      case null (false, store);
    }
  };

  public func addTaskToSprint(
    store : [(Common.EntityId, Types.Sprint)],
    sprintId : Common.EntityId,
    taskId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (?Types.Sprint, [(Common.EntityId, Types.Sprint)]) {
    let m = toMap(store);
    switch (m.get(sprintId)) {
      case (?existing) {
        if (existing.tenantId != tenantId or existing.workspaceId != workspaceId) return (null, store);
        let alreadyIn = existing.taskIds.find(func(id : Common.EntityId) : Bool { id == taskId });
        if (alreadyIn != null) return (?existing, store);
        let newIds = existing.taskIds.concat([taskId]);
        let updated : Types.Sprint = { existing with taskIds = newIds; updatedAt = Time.now() };
        m.add(sprintId, updated);
        (?updated, m.toArray())
      };
      case null (null, store);
    }
  };

  public func removeTaskFromSprint(
    store : [(Common.EntityId, Types.Sprint)],
    sprintId : Common.EntityId,
    taskId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (?Types.Sprint, [(Common.EntityId, Types.Sprint)]) {
    let m = toMap(store);
    switch (m.get(sprintId)) {
      case (?existing) {
        if (existing.tenantId != tenantId or existing.workspaceId != workspaceId) return (null, store);
        let newIds = existing.taskIds.filter(func(id : Common.EntityId) : Bool { id != taskId });
        let updated : Types.Sprint = { existing with taskIds = newIds; updatedAt = Time.now() };
        m.add(sprintId, updated);
        (?updated, m.toArray())
      };
      case null (null, store);
    }
  };
};
