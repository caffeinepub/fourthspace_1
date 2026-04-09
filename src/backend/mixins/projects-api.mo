import Array "mo:core/Array";
import Common "../types/common";
import PTypes "../types/projects";
import WBTypes "../types/whiteboards";
import Projects "../lib/projects";
import Milestones "../lib/projects-milestones";
import Templates "../lib/project-templates";
import WBLib "../lib/whiteboards";
import Time "mo:core/Time";

/// Public-API module for Projects & Tasks.
/// Each function receives the current store(s), performs the operation,
/// and returns the result plus the updated store (for state-mutating operations).
module {

  // ── Projects ──────────────────────────────────────────────────────────────────

  public func createProject(
    store : [(Common.EntityId, PTypes.Project)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : PTypes.ProjectInput,
  ) : { result : { #ok : PTypes.Project; #err : Text }; store : [(Common.EntityId, PTypes.Project)] } {
    let (project, updated) = Projects.createProject(store, tenantId, workspaceId, caller, input);
    { result = #ok project; store = updated }
  };

  public func getProject(
    store : [(Common.EntityId, PTypes.Project)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { #ok : PTypes.Project; #err : Text } {
    switch (Projects.getProject(store, tenantId, workspaceId, id)) {
      case (?p) #ok p;
      case null #err "Project not found";
    }
  };

  public func listProjects(
    store : [(Common.EntityId, PTypes.Project)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [PTypes.Project] {
    Projects.listProjects(store, tenantId, workspaceId)
  };

  public func updateProject(
    store : [(Common.EntityId, PTypes.Project)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : PTypes.ProjectInput,
  ) : { result : { #ok : PTypes.Project; #err : Text }; store : [(Common.EntityId, PTypes.Project)] } {
    let (maybeProject, updated) = Projects.updateProject(store, tenantId, workspaceId, id, caller, input);
    switch (maybeProject) {
      case (?p) ({ result = #ok(p); store = updated });
      case null ({ result = #err("Project not found or access denied"); store = store });
    }
  };

  public func archiveProject(
    store : [(Common.EntityId, PTypes.Project)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { result : { #ok : PTypes.Project; #err : Text }; store : [(Common.EntityId, PTypes.Project)] } {
    let (maybeProject, updated) = Projects.archiveProject(store, tenantId, workspaceId, id, caller);
    switch (maybeProject) {
      case (?p) ({ result = #ok(p); store = updated });
      case null ({ result = #err("Project not found or access denied"); store = store });
    }
  };

  // ── Tasks ─────────────────────────────────────────────────────────────────────

  public func createTask(
    store : [(Common.EntityId, PTypes.Task)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : PTypes.TaskInput,
  ) : { result : { #ok : PTypes.Task; #err : Text }; store : [(Common.EntityId, PTypes.Task)] } {
    let (task, updated) = Projects.createTask(store, tenantId, workspaceId, caller, input);
    { result = #ok task; store = updated }
  };

  public func getTask(
    store : [(Common.EntityId, PTypes.Task)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { #ok : PTypes.Task; #err : Text } {
    switch (Projects.getTask(store, tenantId, workspaceId, id)) {
      case (?t) #ok t;
      case null #err "Task not found";
    }
  };

  public func listTasks(
    store : [(Common.EntityId, PTypes.Task)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    projectId : Common.EntityId,
  ) : [PTypes.Task] {
    Projects.listTasks(store, tenantId, workspaceId, projectId)
  };

  public func updateTask(
    store : [(Common.EntityId, PTypes.Task)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : PTypes.TaskInput,
  ) : { result : { #ok : PTypes.Task; #err : Text }; store : [(Common.EntityId, PTypes.Task)] } {
    let (maybeTask, updated) = Projects.updateTask(store, tenantId, workspaceId, id, caller, input);
    switch (maybeTask) {
      case (?t) ({ result = #ok(t); store = updated });
      case null ({ result = #err("Task not found or access denied"); store = store });
    }
  };

  public func updateTaskStatus(
    taskStore : [(Common.EntityId, PTypes.Task)],
    milestoneStore : [(Common.EntityId, PTypes.Milestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    status : PTypes.TaskStatus,
  ) : {
    result : { #ok : PTypes.Task; #err : Text };
    taskStore : [(Common.EntityId, PTypes.Task)];
    milestoneStore : [(Common.EntityId, PTypes.Milestone)];
  } {
    let (maybeTask, updatedTasks) = Projects.updateTaskStatus(taskStore, tenantId, workspaceId, id, status);
    switch (maybeTask) {
      case (?t) {
        // Auto-advance milestones that link this task when status changes
        let updatedMilestones = Milestones.onTaskStatusChanged(milestoneStore, updatedTasks, tenantId, workspaceId, id, status);
        { result = #ok t; taskStore = updatedTasks; milestoneStore = updatedMilestones }
      };
      case null ({ result = #err("Task not found or access denied"); taskStore = taskStore; milestoneStore = milestoneStore });
    }
  };

  public func deleteTask(
    store : [(Common.EntityId, PTypes.Task)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { result : { #ok : Bool; #err : Text }; store : [(Common.EntityId, PTypes.Task)] } {
    let (ok, updated) = Projects.deleteTask(store, tenantId, workspaceId, id, caller);
    if (ok) {
      { result = #ok true; store = updated }
    } else {
      { result = #err "Task not found or access denied"; store = store }
    }
  };

  // ── Create Project From Template ──────────────────────────────────────────────

  /// Creates a project and populates it with pre-filled tasks, milestones, and
  /// optionally a linked whiteboard based on the given templateId.
  /// Returns: { projectId, taskStore, milestoneStore, whiteboardStore }.
  public func createProjectFromTemplate(
    projectStore : [(Common.EntityId, PTypes.Project)],
    taskStore : [(Common.EntityId, PTypes.Task)],
    milestoneStore : [(Common.EntityId, PTypes.Milestone)],
    whiteboardStore : [(Common.EntityId, WBTypes.Whiteboard)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    templateId : Text,
    projectName : Text,
    projectDescription : Text,
  ) : {
    result : { #ok : Common.EntityId; #err : Text };
    projectStore : [(Common.EntityId, PTypes.Project)];
    taskStore : [(Common.EntityId, PTypes.Task)];
    milestoneStore : [(Common.EntityId, PTypes.Milestone)];
    whiteboardStore : [(Common.EntityId, WBTypes.Whiteboard)];
  } {
    // Validate template exists
    let tmpl = switch (Templates.findTemplate(templateId)) {
      case null {
        return {
          result = #err("Unknown template id: " # templateId);
          projectStore;
          taskStore;
          milestoneStore;
          whiteboardStore;
        }
      };
      case (?t) t;
    };

    // Build description — may append whiteboard id later
    let input : PTypes.ProjectInput = {
      name = projectName;
      description = projectDescription;
      memberIds = [];
    };

    // Create the project
    let (project, updatedProjects) = Projects.createProject(projectStore, tenantId, workspaceId, caller, input);
    let projectId = project.id;
    let now = Time.now();

    // Create tasks
    var currentTaskStore = taskStore;
    for (tmplTask in tmpl.tasks.values()) {
      let taskInput : PTypes.TaskInput = {
          projectId;
          title = tmplTask.title;
          description = tmplTask.description;
          priority = tmplTask.priority;
          assigneeId = null;
          dueDate = null;
          tags = [];
          crossLinks = [];
        };
      let (createdTask, newTaskStore) = Projects.createTask(currentTaskStore, tenantId, workspaceId, caller, taskInput);
      // Set the task status — createTask always sets #Todo, so update if different
      let finalTaskStore = if (tmplTask.status != #Todo) {
        // Patch status directly in the store since updateTask requires a full input
        newTaskStore.map<(Common.EntityId, PTypes.Task), (Common.EntityId, PTypes.Task)>(func(entry : (Common.EntityId, PTypes.Task)) : (Common.EntityId, PTypes.Task) {
          let (k, t) = entry;
          if (k == createdTask.id) {
            (k, { t with status = tmplTask.status })
          } else {
            (k, t)
          }
        })
      } else {
        newTaskStore
      };
      currentTaskStore := finalTaskStore;
    };

    // Create milestones
    var currentMilestoneStore = milestoneStore;
    for (tmplMs in tmpl.milestones.values()) {
      let dueDate : Common.Timestamp = now + Templates.daysToNs(tmplMs.dayOffset);
      let msInput : PTypes.MilestoneInput = {
        projectId;
        title = tmplMs.title;
        description = tmplMs.description;
        dueDate;
        linkedTaskIds = [];
      };
      let (_, newMilestoneStore) = Milestones.createMilestone(currentMilestoneStore, msInput, tenantId, workspaceId);
      currentMilestoneStore := newMilestoneStore;
    };

    // Create linked whiteboard if template specifies one
    var currentWhiteboardStore = whiteboardStore;
    switch (tmpl.linkedWhiteboard) {
      case null {};
      case (?wbSpec) {
        let wbInput : WBTypes.WhiteboardInput = {
          projectId = ?projectId;
          title = projectName # wbSpec.nameSuffix;
          templateId = ?wbSpec.templateId;
          templateName = null;
        };
        let (_, newWbStore) = WBLib.createWhiteboard(currentWhiteboardStore, tenantId, workspaceId, caller, wbInput);
        currentWhiteboardStore := newWbStore;
      };
    };

    {
      result = #ok projectId;
      projectStore = updatedProjects;
      taskStore = currentTaskStore;
      milestoneStore = currentMilestoneStore;
      whiteboardStore = currentWhiteboardStore;
    }
  };
};
