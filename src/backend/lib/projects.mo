import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Types "../types/projects";
import Common "../types/common";

module {

  func toProjectMap(store : [(Common.EntityId, Types.Project)]) : Map.Map<Common.EntityId, Types.Project> {
    Map.fromArray(store)
  };

  func toTaskMap(store : [(Common.EntityId, Types.Task)]) : Map.Map<Common.EntityId, Types.Task> {
    Map.fromArray(store)
  };

  func genId(salt : Text) : Common.EntityId {
    let ts = Time.now();
    ts.toText() # "-" # salt
  };

  // ── Project CRUD ─────────────────────────────────────────────────────────────

  public func createProject(
    store : [(Common.EntityId, Types.Project)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : Types.ProjectInput,
  ) : (Types.Project, [(Common.EntityId, Types.Project)]) {
    let now = Time.now();
    let id = genId(caller.toText());
    let project : Types.Project = {
      id;
      tenantId;
      workspaceId;
      name = input.name;
      description = input.description;
      status = #Active;
      ownerId = caller;
      memberIds = input.memberIds;
      crossLinks = [];
      createdAt = now;
      updatedAt = now;
    };
    let m = toProjectMap(store);
    m.add(id, project);
    (project, m.toArray())
  };

  public func getProject(
    store : [(Common.EntityId, Types.Project)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : ?Types.Project {
    let m = toProjectMap(store);
    switch (m.get(id)) {
      case (?p) { if (p.tenantId == tenantId and p.workspaceId == workspaceId) ?p else null };
      case null null;
    }
  };

  public func listProjects(
    store : [(Common.EntityId, Types.Project)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.Project] {
    let m = toProjectMap(store);
    m.values().filter(func(p : Types.Project) : Bool {
      p.tenantId == tenantId and p.workspaceId == workspaceId
    }).toArray()
  };

  public func updateProject(
    store : [(Common.EntityId, Types.Project)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : Types.ProjectInput,
  ) : (?Types.Project, [(Common.EntityId, Types.Project)]) {
    let m = toProjectMap(store);
    switch (m.get(id)) {
      case (?existing) {
        if (existing.tenantId != tenantId or existing.workspaceId != workspaceId) return (null, store);
        let updated : Types.Project = {
          existing with
          name = input.name;
          description = input.description;
          memberIds = input.memberIds;
          updatedAt = Time.now();
        };
        m.add(id, updated);
        (?updated, m.toArray())
      };
      case null (null, store);
    }
  };

  public func archiveProject(
    store : [(Common.EntityId, Types.Project)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : (?Types.Project, [(Common.EntityId, Types.Project)]) {
    let m = toProjectMap(store);
    switch (m.get(id)) {
      case (?existing) {
        if (existing.tenantId != tenantId or existing.workspaceId != workspaceId) return (null, store);
        let archived : Types.Project = {
          existing with
          status = #Archived;
          updatedAt = Time.now();
        };
        m.add(id, archived);
        (?archived, m.toArray())
      };
      case null (null, store);
    }
  };

  // ── Task CRUD ─────────────────────────────────────────────────────────────────

  public func createTask(
    store : [(Common.EntityId, Types.Task)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : Types.TaskInput,
  ) : (Types.Task, [(Common.EntityId, Types.Task)]) {
    let now = Time.now();
    let id = genId(caller.toText() # input.projectId);
    let task : Types.Task = {
      id;
      tenantId;
      workspaceId;
      projectId = input.projectId;
      title = input.title;
      description = input.description;
      status = #Todo;
      priority = input.priority;
      assigneeId = input.assigneeId;
      dueDate = input.dueDate;
      crossLinks = input.crossLinks;
      createdAt = now;
      updatedAt = now;
    };
    let m = toTaskMap(store);
    m.add(id, task);
    (task, m.toArray())
  };

  public func getTask(
    store : [(Common.EntityId, Types.Task)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : ?Types.Task {
    let m = toTaskMap(store);
    switch (m.get(id)) {
      case (?t) { if (t.tenantId == tenantId and t.workspaceId == workspaceId) ?t else null };
      case null null;
    }
  };

  public func listTasks(
    store : [(Common.EntityId, Types.Task)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    projectId : Common.EntityId,
  ) : [Types.Task] {
    let m = toTaskMap(store);
    m.values().filter(
        func(t : Types.Task) : Bool {
          t.tenantId == tenantId and t.workspaceId == workspaceId and t.projectId == projectId
        },
      ).toArray()
  };

  public func updateTask(
    store : [(Common.EntityId, Types.Task)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : Types.TaskInput,
  ) : (?Types.Task, [(Common.EntityId, Types.Task)]) {
    let m = toTaskMap(store);
    switch (m.get(id)) {
      case (?existing) {
        if (existing.tenantId != tenantId or existing.workspaceId != workspaceId) return (null, store);
        let updated : Types.Task = {
          existing with
          title = input.title;
          description = input.description;
          priority = input.priority;
          assigneeId = input.assigneeId;
          dueDate = input.dueDate;
          crossLinks = input.crossLinks;
          updatedAt = Time.now();
        };
        m.add(id, updated);
        (?updated, m.toArray())
      };
      case null (null, store);
    }
  };

  public func deleteTask(
    store : [(Common.EntityId, Types.Task)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : (Bool, [(Common.EntityId, Types.Task)]) {
    let m = toTaskMap(store);
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
