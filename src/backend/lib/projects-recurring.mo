import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/projects";
import Common "../types/common";

module {

  func toRTMap(store : [(Common.EntityId, Types.RecurringTask)]) : Map.Map<Common.EntityId, Types.RecurringTask> {
    Map.fromArray(store)
  };

  func toTTMap(store : [(Common.EntityId, Types.TaskTemplate)]) : Map.Map<Common.EntityId, Types.TaskTemplate> {
    Map.fromArray(store)
  };

  func genId(prefix : Text, salt : Text) : Common.EntityId {
    Time.now().toText() # "-" # prefix # "-" # salt
  };

  // ── Recurring Tasks ───────────────────────────────────────────────────────────

  public func createRecurringTask(
    store : [(Common.EntityId, Types.RecurringTask)],
    input : Types.RecurringTaskInput,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Types.RecurringTask, [(Common.EntityId, Types.RecurringTask)]) {
    let now = Time.now();
    let id = genId("rt", input.projectId);
    let rt : Types.RecurringTask = {
      id;
      tenantId;
      workspaceId;
      projectId = input.projectId;
      title = input.title;
      description = input.description;
      priority = input.priority;
      assigneeId = input.assigneeId;
      recurrenceType = input.recurrenceType;
      lastCreatedAt = null;
      nextDueAt = input.startDate;
      createdAt = now;
      updatedAt = now;
    };
    let m = toRTMap(store);
    m.add(id, rt);
    (rt, m.toArray())
  };

  public func listRecurringTasks(
    store : [(Common.EntityId, Types.RecurringTask)],
    projectId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.RecurringTask] {
    let m = toRTMap(store);
    m.values().filter(func(rt : Types.RecurringTask) : Bool {
      rt.tenantId == tenantId and rt.workspaceId == workspaceId and rt.projectId == projectId
    }).toArray()
  };

  public func deleteRecurringTask(
    store : [(Common.EntityId, Types.RecurringTask)],
    id : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Bool, [(Common.EntityId, Types.RecurringTask)]) {
    let m = toRTMap(store);
    switch (m.get(id)) {
      case (?rt) {
        if (rt.tenantId != tenantId or rt.workspaceId != workspaceId) return (false, store);
        m.remove(id);
        (true, m.toArray())
      };
      case null (false, store);
    }
  };

  // ── Task Templates ────────────────────────────────────────────────────────────

  public func createTaskTemplate(
    store : [(Common.EntityId, Types.TaskTemplate)],
    input : Types.TaskTemplateInput,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Types.TaskTemplate, [(Common.EntityId, Types.TaskTemplate)]) {
    let now = Time.now();
    let id = genId("tmpl", tenantId # workspaceId);
    let tmpl : Types.TaskTemplate = {
      id;
      tenantId;
      workspaceId;
      projectId = input.projectId;
      name = input.name;
      description = input.description;
      defaultPriority = input.defaultPriority;
      defaultAssigneeId = input.defaultAssigneeId;
      checklistItems = input.checklistItems;
      createdAt = now;
      updatedAt = now;
    };
    let m = toTTMap(store);
    m.add(id, tmpl);
    (tmpl, m.toArray())
  };

  public func listTaskTemplates(
    store : [(Common.EntityId, Types.TaskTemplate)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.TaskTemplate] {
    let m = toTTMap(store);
    m.values().filter(func(t : Types.TaskTemplate) : Bool {
      t.tenantId == tenantId and t.workspaceId == workspaceId
    }).toArray()
  };

  public func getTaskTemplate(
    store : [(Common.EntityId, Types.TaskTemplate)],
    id : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : ?Types.TaskTemplate {
    let m = toTTMap(store);
    switch (m.get(id)) {
      case (?t) { if (t.tenantId == tenantId and t.workspaceId == workspaceId) ?t else null };
      case null null;
    }
  };

  public func deleteTaskTemplate(
    store : [(Common.EntityId, Types.TaskTemplate)],
    id : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Bool, [(Common.EntityId, Types.TaskTemplate)]) {
    let m = toTTMap(store);
    switch (m.get(id)) {
      case (?t) {
        if (t.tenantId != tenantId or t.workspaceId != workspaceId) return (false, store);
        m.remove(id);
        (true, m.toArray())
      };
      case null (false, store);
    }
  };
};
