import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/projects";
import Common "../types/common";

module {

  func toMap(store : [(Common.EntityId, Types.Milestone)]) : Map.Map<Common.EntityId, Types.Milestone> {
    Map.fromArray(store)
  };

  func genId(salt : Text) : Common.EntityId {
    Time.now().toText() # "-ms-" # salt
  };

  public func createMilestone(
    store : [(Common.EntityId, Types.Milestone)],
    input : Types.MilestoneInput,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Types.Milestone, [(Common.EntityId, Types.Milestone)]) {
    let now = Time.now();
    let id = genId(input.projectId);
    let milestone : Types.Milestone = {
      id;
      tenantId;
      workspaceId;
      projectId = input.projectId;
      title = input.title;
      description = input.description;
      dueDate = input.dueDate;
      status = #upcoming;
      linkedTaskIds = input.linkedTaskIds;
      createdAt = now;
      updatedAt = now;
    };
    let m = toMap(store);
    m.add(id, milestone);
    (milestone, m.toArray())
  };

  public func getMilestone(
    store : [(Common.EntityId, Types.Milestone)],
    milestoneId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : ?Types.Milestone {
    let m = toMap(store);
    switch (m.get(milestoneId)) {
      case (?ms) { if (ms.tenantId == tenantId and ms.workspaceId == workspaceId) ?ms else null };
      case null null;
    }
  };

  public func listMilestones(
    store : [(Common.EntityId, Types.Milestone)],
    projectId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.Milestone] {
    let m = toMap(store);
    m.values().filter(func(ms : Types.Milestone) : Bool {
      ms.tenantId == tenantId and ms.workspaceId == workspaceId and ms.projectId == projectId
    }).toArray()
  };

  public func updateMilestone(
    store : [(Common.EntityId, Types.Milestone)],
    milestoneId : Common.EntityId,
    title : Text,
    status : Types.MilestoneStatus,
    dueDate : Common.Timestamp,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (?Types.Milestone, [(Common.EntityId, Types.Milestone)]) {
    let m = toMap(store);
    switch (m.get(milestoneId)) {
      case (?existing) {
        if (existing.tenantId != tenantId or existing.workspaceId != workspaceId) return (null, store);
        let updated : Types.Milestone = { existing with title; status; dueDate; updatedAt = Time.now() };
        m.add(milestoneId, updated);
        (?updated, m.toArray())
      };
      case null (null, store);
    }
  };

  public func deleteMilestone(
    store : [(Common.EntityId, Types.Milestone)],
    milestoneId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Bool, [(Common.EntityId, Types.Milestone)]) {
    let m = toMap(store);
    switch (m.get(milestoneId)) {
      case (?ms) {
        if (ms.tenantId != tenantId or ms.workspaceId != workspaceId) return (false, store);
        m.remove(milestoneId);
        (true, m.toArray())
      };
      case null (false, store);
    }
  };

  /// When a task transitions to Done, check all milestones that link this task.
  /// If all linked tasks in a milestone are Done or Blocked, auto-advance the milestone to #reached.
  public func onTaskStatusChanged(
    milestoneStore : [(Common.EntityId, Types.Milestone)],
    taskStore : [(Common.EntityId, Types.Task)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    changedTaskId : Common.EntityId,
    newTaskStatus : Types.TaskStatus,
  ) : [(Common.EntityId, Types.Milestone)] {
    // Only act when a task is completed
    if (newTaskStatus != #Done) return milestoneStore;
    let mMap = toMap(milestoneStore);
    let taskMap = Map.fromArray<Common.EntityId, Types.Task>(taskStore);
    // Check each milestone in this workspace that links the changed task
    mMap.forEach(func(msId : Common.EntityId, ms : Types.Milestone) {
      if (ms.tenantId != tenantId or ms.workspaceId != workspaceId) return;
      if (not ms.linkedTaskIds.any(func(tid : Common.EntityId) : Bool { tid == changedTaskId })) return;
      // Check if all linked tasks are now done
      let allDone = ms.linkedTaskIds.all(func(tid : Common.EntityId) : Bool {
        switch (taskMap.get(tid)) {
          case (?t) t.status == #Done;
          case null true; // treat missing/deleted tasks as done
        }
      });
      if (allDone and ms.status == #upcoming) {
        let updated : Types.Milestone = { ms with status = #reached; updatedAt = Time.now() };
        mMap.add(msId, updated);
      };
    });
    mMap.toArray()
  };
};
