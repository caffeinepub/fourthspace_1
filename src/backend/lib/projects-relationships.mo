import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/projects";
import Common "../types/common";

module {

  func toRelMap(store : [(Common.EntityId, Types.TaskRelationship)]) : Map.Map<Common.EntityId, Types.TaskRelationship> {
    Map.fromArray(store)
  };

  func genId(prefix : Text, salt : Text) : Common.EntityId {
    Time.now().toText() # "-" # prefix # "-" # salt
  };

  public func addTaskRelationship(
    store : [(Common.EntityId, Types.TaskRelationship)],
    sourceTaskId : Common.EntityId,
    targetTaskId : Common.EntityId,
    relType : Types.TaskRelationshipType,
    actorId : Common.UserId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Types.TaskRelationship, [(Common.EntityId, Types.TaskRelationship)]) {
    let now = Time.now();
    let id = genId("rel", sourceTaskId # targetTaskId);
    let rel : Types.TaskRelationship = {
      id;
      tenantId;
      workspaceId;
      sourceTaskId;
      targetTaskId;
      relationshipType = relType;
      createdAt = now;
      createdBy = actorId;
    };
    let m = toRelMap(store);
    m.add(id, rel);
    (rel, m.toArray())
  };

  public func removeTaskRelationship(
    store : [(Common.EntityId, Types.TaskRelationship)],
    relationshipId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Bool, [(Common.EntityId, Types.TaskRelationship)]) {
    let m = toRelMap(store);
    switch (m.get(relationshipId)) {
      case (?r) {
        if (r.tenantId != tenantId or r.workspaceId != workspaceId) return (false, store);
        m.remove(relationshipId);
        (true, m.toArray())
      };
      case null (false, store);
    }
  };

  public func listTaskRelationships(
    store : [(Common.EntityId, Types.TaskRelationship)],
    taskId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.TaskRelationship] {
    let m = toRelMap(store);
    m.values().filter(func(r : Types.TaskRelationship) : Bool {
      r.tenantId == tenantId and r.workspaceId == workspaceId and (r.sourceTaskId == taskId or r.targetTaskId == taskId)
    }).toArray()
  };

  // ── Task Watchers ─────────────────────────────────────────────────────────────

  public func addTaskWatcher(
    watcherStore : [Types.TaskWatcher],
    taskId : Common.EntityId,
    userId : Common.UserId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Types.TaskWatcher, [Types.TaskWatcher]) {
    let existing = watcherStore.find(func(w : Types.TaskWatcher) : Bool {
      w.tenantId == tenantId and w.workspaceId == workspaceId and w.taskId == taskId and w.userId == userId
    });
    switch (existing) {
      case (?w) (w, watcherStore);
      case null {
        let watcher : Types.TaskWatcher = {
          taskId;
          tenantId;
          workspaceId;
          userId;
          addedAt = Time.now();
        };
        (watcher, watcherStore.concat([watcher]))
      };
    }
  };

  public func removeTaskWatcher(
    watcherStore : [Types.TaskWatcher],
    taskId : Common.EntityId,
    userId : Common.UserId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Bool, [Types.TaskWatcher]) {
    let before = watcherStore.size();
    let filtered = watcherStore.filter(func(w : Types.TaskWatcher) : Bool {
      not (w.tenantId == tenantId and w.workspaceId == workspaceId and w.taskId == taskId and w.userId == userId)
    });
    (filtered.size() < before, filtered)
  };

  public func listTaskWatchers(
    watcherStore : [Types.TaskWatcher],
    taskId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.TaskWatcher] {
    watcherStore.filter(func(w : Types.TaskWatcher) : Bool {
      w.tenantId == tenantId and w.workspaceId == workspaceId and w.taskId == taskId
    })
  };

  public func isWatching(
    watcherStore : [Types.TaskWatcher],
    taskId : Common.EntityId,
    userId : Common.UserId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : Bool {
    watcherStore.find(func(w : Types.TaskWatcher) : Bool {
      w.tenantId == tenantId and w.workspaceId == workspaceId and w.taskId == taskId and w.userId == userId
    }) != null
  };
};
