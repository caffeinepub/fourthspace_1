import Common "../types/common";
import PTypes "../types/projects";
import Projects "../lib/projects";

/// Public-API module for Projects & Tasks.
/// Each function receives the current store(s), performs the operation,
/// and returns the result plus the updated store (for state-mutating operations).
module {

  // ── Projects ──────────────────────────────────────────────────────────────────

  public func createProject(
    store : [(Common.EntityId, PTypes.Project)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
    input : PTypes.ProjectInput,
  ) : { result : { #ok : PTypes.Project; #err : Text }; store : [(Common.EntityId, PTypes.Project)] } {
    let (project, updated) = Projects.createProject(store, tenantId, caller, input);
    { result = #ok project; store = updated }
  };

  public func getProject(
    store : [(Common.EntityId, PTypes.Project)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
  ) : { #ok : PTypes.Project; #err : Text } {
    switch (Projects.getProject(store, tenantId, id)) {
      case (?p) #ok p;
      case null #err "Project not found";
    }
  };

  public func listProjects(
    store : [(Common.EntityId, PTypes.Project)],
    tenantId : Common.TenantId,
  ) : [PTypes.Project] {
    Projects.listProjects(store, tenantId)
  };

  public func updateProject(
    store : [(Common.EntityId, PTypes.Project)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : PTypes.ProjectInput,
  ) : { result : { #ok : PTypes.Project; #err : Text }; store : [(Common.EntityId, PTypes.Project)] } {
    let (maybeProject, updated) = Projects.updateProject(store, tenantId, id, caller, input);
    switch (maybeProject) {
      case (?p) ({ result = #ok(p); store = updated });
      case null ({ result = #err("Project not found or access denied"); store = store });
    }
  };

  public func archiveProject(
    store : [(Common.EntityId, PTypes.Project)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { result : { #ok : PTypes.Project; #err : Text }; store : [(Common.EntityId, PTypes.Project)] } {
    let (maybeProject, updated) = Projects.archiveProject(store, tenantId, id, caller);
    switch (maybeProject) {
      case (?p) ({ result = #ok(p); store = updated });
      case null ({ result = #err("Project not found or access denied"); store = store });
    }
  };

  // ── Tasks ─────────────────────────────────────────────────────────────────────

  public func createTask(
    store : [(Common.EntityId, PTypes.Task)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
    input : PTypes.TaskInput,
  ) : { result : { #ok : PTypes.Task; #err : Text }; store : [(Common.EntityId, PTypes.Task)] } {
    let (task, updated) = Projects.createTask(store, tenantId, caller, input);
    { result = #ok task; store = updated }
  };

  public func getTask(
    store : [(Common.EntityId, PTypes.Task)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
  ) : { #ok : PTypes.Task; #err : Text } {
    switch (Projects.getTask(store, tenantId, id)) {
      case (?t) #ok t;
      case null #err "Task not found";
    }
  };

  public func listTasks(
    store : [(Common.EntityId, PTypes.Task)],
    tenantId : Common.TenantId,
    projectId : Common.EntityId,
  ) : [PTypes.Task] {
    Projects.listTasks(store, tenantId, projectId)
  };

  public func updateTask(
    store : [(Common.EntityId, PTypes.Task)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : PTypes.TaskInput,
  ) : { result : { #ok : PTypes.Task; #err : Text }; store : [(Common.EntityId, PTypes.Task)] } {
    let (maybeTask, updated) = Projects.updateTask(store, tenantId, id, caller, input);
    switch (maybeTask) {
      case (?t) ({ result = #ok(t); store = updated });
      case null ({ result = #err("Task not found or access denied"); store = store });
    }
  };

  public func deleteTask(
    store : [(Common.EntityId, PTypes.Task)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { result : { #ok : Bool; #err : Text }; store : [(Common.EntityId, PTypes.Task)] } {
    let (ok, updated) = Projects.deleteTask(store, tenantId, id, caller);
    if (ok) {
      { result = #ok true; store = updated }
    } else {
      { result = #err "Task not found or access denied"; store = store }
    }
  };
};
