import Common "../types/common";
import PTypes "../types/projects";
import Subtasks "../lib/projects-subtasks";
import Sprints "../lib/projects-sprints";
import Milestones "../lib/projects-milestones";
import Comments "../lib/projects-comments";
import Checklists "../lib/projects-checklists";
import Relationships "../lib/projects-relationships";
import Recurring "../lib/projects-recurring";

module {

  // ── Subtasks ──────────────────────────────────────────────────────────────────

  public func createSubtask(
    store : [(Common.EntityId, PTypes.Subtask)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : PTypes.SubtaskInput,
  ) : { result : { #ok : PTypes.Subtask; #err : Text }; store : [(Common.EntityId, PTypes.Subtask)] } {
    let (s, updated) = Subtasks.createSubtask(store, input, tenantId, workspaceId);
    { result = #ok s; store = updated }
  };

  public func listSubtasks(
    store : [(Common.EntityId, PTypes.Subtask)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    parentTaskId : Common.EntityId,
  ) : [PTypes.Subtask] {
    Subtasks.listSubtasks(store, parentTaskId, tenantId, workspaceId)
  };

  public func updateSubtask(
    store : [(Common.EntityId, PTypes.Subtask)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    subtaskId : Common.EntityId,
    title : Text,
    status : PTypes.TaskStatus,
  ) : { result : { #ok : PTypes.Subtask; #err : Text }; store : [(Common.EntityId, PTypes.Subtask)] } {
    let (maybe, updated) = Subtasks.updateSubtask(store, subtaskId, title, status, tenantId, workspaceId);
    switch (maybe) {
      case (?s) ({ result = #ok s; store = updated });
      case null ({ result = #err "Subtask not found or access denied"; store = store });
    }
  };

  public func deleteSubtask(
    store : [(Common.EntityId, PTypes.Subtask)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    subtaskId : Common.EntityId,
  ) : { result : { #ok : Bool; #err : Text }; store : [(Common.EntityId, PTypes.Subtask)] } {
    let (ok, updated) = Subtasks.deleteSubtask(store, subtaskId, tenantId, workspaceId);
    if (ok) ({ result = #ok true; store = updated })
    else ({ result = #err "Subtask not found or access denied"; store = store })
  };

  // ── Sprints ───────────────────────────────────────────────────────────────────

  public func createSprint(
    store : [(Common.EntityId, PTypes.Sprint)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : PTypes.SprintInput,
  ) : { result : { #ok : PTypes.Sprint; #err : Text }; store : [(Common.EntityId, PTypes.Sprint)] } {
    let (s, updated) = Sprints.createSprint(store, input, tenantId, workspaceId);
    { result = #ok s; store = updated }
  };

  public func getSprint(
    store : [(Common.EntityId, PTypes.Sprint)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    sprintId : Common.EntityId,
  ) : { #ok : PTypes.Sprint; #err : Text } {
    switch (Sprints.getSprint(store, sprintId, tenantId, workspaceId)) {
      case (?s) #ok s;
      case null #err "Sprint not found";
    }
  };

  public func listSprints(
    store : [(Common.EntityId, PTypes.Sprint)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    projectId : Common.EntityId,
  ) : [PTypes.Sprint] {
    Sprints.listSprints(store, projectId, tenantId, workspaceId)
  };

  public func updateSprint(
    store : [(Common.EntityId, PTypes.Sprint)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    sprintId : Common.EntityId,
    name : Text,
    goal : Text,
    status : PTypes.SprintStatus,
    taskIds : [Common.EntityId],
  ) : { result : { #ok : PTypes.Sprint; #err : Text }; store : [(Common.EntityId, PTypes.Sprint)] } {
    let (maybe, updated) = Sprints.updateSprint(store, sprintId, name, goal, status, taskIds, tenantId, workspaceId);
    switch (maybe) {
      case (?s) ({ result = #ok s; store = updated });
      case null ({ result = #err "Sprint not found or access denied"; store = store });
    }
  };

  public func deleteSprint(
    store : [(Common.EntityId, PTypes.Sprint)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    sprintId : Common.EntityId,
  ) : { result : { #ok : Bool; #err : Text }; store : [(Common.EntityId, PTypes.Sprint)] } {
    let (ok, updated) = Sprints.deleteSprint(store, sprintId, tenantId, workspaceId);
    if (ok) ({ result = #ok true; store = updated })
    else ({ result = #err "Sprint not found or access denied"; store = store })
  };

  public func addTaskToSprint(
    store : [(Common.EntityId, PTypes.Sprint)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    sprintId : Common.EntityId,
    taskId : Common.EntityId,
  ) : { result : { #ok : PTypes.Sprint; #err : Text }; store : [(Common.EntityId, PTypes.Sprint)] } {
    let (maybe, updated) = Sprints.addTaskToSprint(store, sprintId, taskId, tenantId, workspaceId);
    switch (maybe) {
      case (?s) ({ result = #ok s; store = updated });
      case null ({ result = #err "Sprint not found or access denied"; store = store });
    }
  };

  public func removeTaskFromSprint(
    store : [(Common.EntityId, PTypes.Sprint)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    sprintId : Common.EntityId,
    taskId : Common.EntityId,
  ) : { result : { #ok : PTypes.Sprint; #err : Text }; store : [(Common.EntityId, PTypes.Sprint)] } {
    let (maybe, updated) = Sprints.removeTaskFromSprint(store, sprintId, taskId, tenantId, workspaceId);
    switch (maybe) {
      case (?s) ({ result = #ok s; store = updated });
      case null ({ result = #err "Sprint not found or access denied"; store = store });
    }
  };

  // ── Milestones ────────────────────────────────────────────────────────────────

  public func createMilestone(
    store : [(Common.EntityId, PTypes.Milestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : PTypes.MilestoneInput,
  ) : { result : { #ok : PTypes.Milestone; #err : Text }; store : [(Common.EntityId, PTypes.Milestone)] } {
    let (ms, updated) = Milestones.createMilestone(store, input, tenantId, workspaceId);
    { result = #ok ms; store = updated }
  };

  public func listMilestones(
    store : [(Common.EntityId, PTypes.Milestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    projectId : Common.EntityId,
  ) : [PTypes.Milestone] {
    Milestones.listMilestones(store, projectId, tenantId, workspaceId)
  };

  public func updateMilestone(
    store : [(Common.EntityId, PTypes.Milestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    milestoneId : Common.EntityId,
    title : Text,
    status : PTypes.MilestoneStatus,
    dueDate : Common.Timestamp,
  ) : { result : { #ok : PTypes.Milestone; #err : Text }; store : [(Common.EntityId, PTypes.Milestone)] } {
    let (maybe, updated) = Milestones.updateMilestone(store, milestoneId, title, status, dueDate, tenantId, workspaceId);
    switch (maybe) {
      case (?ms) ({ result = #ok ms; store = updated });
      case null ({ result = #err "Milestone not found or access denied"; store = store });
    }
  };

  public func deleteMilestone(
    store : [(Common.EntityId, PTypes.Milestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    milestoneId : Common.EntityId,
  ) : { result : { #ok : Bool; #err : Text }; store : [(Common.EntityId, PTypes.Milestone)] } {
    let (ok, updated) = Milestones.deleteMilestone(store, milestoneId, tenantId, workspaceId);
    if (ok) ({ result = #ok true; store = updated })
    else ({ result = #err "Milestone not found or access denied"; store = store })
  };

  // ── Comments & Activity ───────────────────────────────────────────────────────

  public func addComment(
    commentStore : [(Common.EntityId, PTypes.TaskComment)],
    activityStore : [(Common.EntityId, PTypes.ActivityEvent)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    projectId : Common.EntityId,
    input : PTypes.TaskCommentInput,
  ) : { result : { #ok : PTypes.TaskComment; #err : Text }; commentStore : [(Common.EntityId, PTypes.TaskComment)]; activityStore : [(Common.EntityId, PTypes.ActivityEvent)] } {
    let (c, cs, as_) = Comments.addComment(commentStore, activityStore, input, caller, projectId, tenantId, workspaceId);
    { result = #ok c; commentStore = cs; activityStore = as_ }
  };

  public func editComment(
    commentStore : [(Common.EntityId, PTypes.TaskComment)],
    activityStore : [(Common.EntityId, PTypes.ActivityEvent)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    commentId : Common.EntityId,
    content : Text,
  ) : { result : { #ok : PTypes.TaskComment; #err : Text }; commentStore : [(Common.EntityId, PTypes.TaskComment)]; activityStore : [(Common.EntityId, PTypes.ActivityEvent)] } {
    let (maybe, cs, as_) = Comments.editComment(commentStore, activityStore, commentId, content, caller, tenantId, workspaceId);
    switch (maybe) {
      case (?c) ({ result = #ok c; commentStore = cs; activityStore = as_ });
      case null ({ result = #err "Comment not found or access denied"; commentStore = commentStore; activityStore = activityStore });
    }
  };

  public func deleteComment(
    commentStore : [(Common.EntityId, PTypes.TaskComment)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    commentId : Common.EntityId,
  ) : { result : { #ok : Bool; #err : Text }; store : [(Common.EntityId, PTypes.TaskComment)] } {
    let (ok, updated) = Comments.deleteComment(commentStore, commentId, tenantId, workspaceId);
    if (ok) ({ result = #ok true; store = updated })
    else ({ result = #err "Comment not found or access denied"; store = commentStore })
  };

  public func listComments(
    store : [(Common.EntityId, PTypes.TaskComment)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    taskId : Common.EntityId,
  ) : [PTypes.TaskComment] {
    Comments.listComments(store, taskId, tenantId, workspaceId)
  };

  public func listActivityEvents(
    store : [(Common.EntityId, PTypes.ActivityEvent)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    taskId : Common.EntityId,
  ) : [PTypes.ActivityEvent] {
    Comments.listActivityEvents(store, taskId, tenantId, workspaceId)
  };

  // ── Checklists ────────────────────────────────────────────────────────────────

  public func addChecklistItem(
    store : [(Common.EntityId, PTypes.ChecklistItem)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : PTypes.ChecklistItemInput,
  ) : { result : { #ok : PTypes.ChecklistItem; #err : Text }; store : [(Common.EntityId, PTypes.ChecklistItem)] } {
    let (item, updated) = Checklists.addChecklistItem(store, input, tenantId, workspaceId);
    { result = #ok item; store = updated }
  };

  public func updateChecklistItem(
    store : [(Common.EntityId, PTypes.ChecklistItem)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    itemId : Common.EntityId,
    content : Text,
    completed : Bool,
  ) : { result : { #ok : PTypes.ChecklistItem; #err : Text }; store : [(Common.EntityId, PTypes.ChecklistItem)] } {
    let (maybe, updated) = Checklists.updateChecklistItem(store, itemId, content, completed, tenantId, workspaceId);
    switch (maybe) {
      case (?item) ({ result = #ok item; store = updated });
      case null ({ result = #err "Checklist item not found or access denied"; store = store });
    }
  };

  public func deleteChecklistItem(
    store : [(Common.EntityId, PTypes.ChecklistItem)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    itemId : Common.EntityId,
  ) : { result : { #ok : Bool; #err : Text }; store : [(Common.EntityId, PTypes.ChecklistItem)] } {
    let (ok, updated) = Checklists.deleteChecklistItem(store, itemId, tenantId, workspaceId);
    if (ok) ({ result = #ok true; store = updated })
    else ({ result = #err "Checklist item not found or access denied"; store = store })
  };

  public func listChecklistItems(
    store : [(Common.EntityId, PTypes.ChecklistItem)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    taskId : Common.EntityId,
  ) : [PTypes.ChecklistItem] {
    Checklists.listChecklistItems(store, taskId, tenantId, workspaceId)
  };

  // ── Task Relationships ────────────────────────────────────────────────────────

  public func addTaskRelationship(
    store : [(Common.EntityId, PTypes.TaskRelationship)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    sourceTaskId : Common.EntityId,
    targetTaskId : Common.EntityId,
    relType : PTypes.TaskRelationshipType,
  ) : { result : { #ok : PTypes.TaskRelationship; #err : Text }; store : [(Common.EntityId, PTypes.TaskRelationship)] } {
    let (r, updated) = Relationships.addTaskRelationship(store, sourceTaskId, targetTaskId, relType, caller, tenantId, workspaceId);
    { result = #ok r; store = updated }
  };

  public func removeTaskRelationship(
    store : [(Common.EntityId, PTypes.TaskRelationship)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    relationshipId : Common.EntityId,
  ) : { result : { #ok : Bool; #err : Text }; store : [(Common.EntityId, PTypes.TaskRelationship)] } {
    let (ok, updated) = Relationships.removeTaskRelationship(store, relationshipId, tenantId, workspaceId);
    if (ok) ({ result = #ok true; store = updated })
    else ({ result = #err "Relationship not found or access denied"; store = store })
  };

  public func listTaskRelationships(
    store : [(Common.EntityId, PTypes.TaskRelationship)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    taskId : Common.EntityId,
  ) : [PTypes.TaskRelationship] {
    Relationships.listTaskRelationships(store, taskId, tenantId, workspaceId)
  };

  // ── Task Watchers ─────────────────────────────────────────────────────────────

  public func addTaskWatcher(
    watcherStore : [PTypes.TaskWatcher],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    taskId : Common.EntityId,
    userId : Common.UserId,
  ) : { result : { #ok : PTypes.TaskWatcher; #err : Text }; store : [PTypes.TaskWatcher] } {
    let (w, updated) = Relationships.addTaskWatcher(watcherStore, taskId, userId, tenantId, workspaceId);
    { result = #ok w; store = updated }
  };

  public func removeTaskWatcher(
    watcherStore : [PTypes.TaskWatcher],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    taskId : Common.EntityId,
    userId : Common.UserId,
  ) : { result : { #ok : Bool; #err : Text }; store : [PTypes.TaskWatcher] } {
    let (ok, updated) = Relationships.removeTaskWatcher(watcherStore, taskId, userId, tenantId, workspaceId);
    if (ok) ({ result = #ok true; store = updated })
    else ({ result = #err "Watcher not found"; store = watcherStore })
  };

  public func listTaskWatchers(
    watcherStore : [PTypes.TaskWatcher],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    taskId : Common.EntityId,
  ) : [PTypes.TaskWatcher] {
    Relationships.listTaskWatchers(watcherStore, taskId, tenantId, workspaceId)
  };

  public func isWatching(
    watcherStore : [PTypes.TaskWatcher],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    taskId : Common.EntityId,
    userId : Common.UserId,
  ) : Bool {
    Relationships.isWatching(watcherStore, taskId, userId, tenantId, workspaceId)
  };

  // ── Recurring Tasks ───────────────────────────────────────────────────────────

  public func createRecurringTask(
    store : [(Common.EntityId, PTypes.RecurringTask)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : PTypes.RecurringTaskInput,
  ) : { result : { #ok : PTypes.RecurringTask; #err : Text }; store : [(Common.EntityId, PTypes.RecurringTask)] } {
    let (rt, updated) = Recurring.createRecurringTask(store, input, tenantId, workspaceId);
    { result = #ok rt; store = updated }
  };

  public func listRecurringTasks(
    store : [(Common.EntityId, PTypes.RecurringTask)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    projectId : Common.EntityId,
  ) : [PTypes.RecurringTask] {
    Recurring.listRecurringTasks(store, projectId, tenantId, workspaceId)
  };

  public func deleteRecurringTask(
    store : [(Common.EntityId, PTypes.RecurringTask)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { result : { #ok : Bool; #err : Text }; store : [(Common.EntityId, PTypes.RecurringTask)] } {
    let (ok, updated) = Recurring.deleteRecurringTask(store, id, tenantId, workspaceId);
    if (ok) ({ result = #ok true; store = updated })
    else ({ result = #err "Recurring task not found or access denied"; store = store })
  };

  // ── Task Templates ────────────────────────────────────────────────────────────

  public func createTaskTemplate(
    store : [(Common.EntityId, PTypes.TaskTemplate)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : PTypes.TaskTemplateInput,
  ) : { result : { #ok : PTypes.TaskTemplate; #err : Text }; store : [(Common.EntityId, PTypes.TaskTemplate)] } {
    let (tmpl, updated) = Recurring.createTaskTemplate(store, input, tenantId, workspaceId);
    { result = #ok tmpl; store = updated }
  };

  public func listTaskTemplates(
    store : [(Common.EntityId, PTypes.TaskTemplate)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [PTypes.TaskTemplate] {
    Recurring.listTaskTemplates(store, tenantId, workspaceId)
  };

  public func getTaskTemplate(
    store : [(Common.EntityId, PTypes.TaskTemplate)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { #ok : PTypes.TaskTemplate; #err : Text } {
    switch (Recurring.getTaskTemplate(store, id, tenantId, workspaceId)) {
      case (?t) #ok t;
      case null #err "Task template not found";
    }
  };

  public func deleteTaskTemplate(
    store : [(Common.EntityId, PTypes.TaskTemplate)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { result : { #ok : Bool; #err : Text }; store : [(Common.EntityId, PTypes.TaskTemplate)] } {
    let (ok, updated) = Recurring.deleteTaskTemplate(store, id, tenantId, workspaceId);
    if (ok) ({ result = #ok true; store = updated })
    else ({ result = #err "Task template not found or access denied"; store = store })
  };
};
