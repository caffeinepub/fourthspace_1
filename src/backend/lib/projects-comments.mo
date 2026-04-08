import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/projects";
import Common "../types/common";

module {

  func toCommentMap(store : [(Common.EntityId, Types.TaskComment)]) : Map.Map<Common.EntityId, Types.TaskComment> {
    Map.fromArray(store)
  };

  func toActivityMap(store : [(Common.EntityId, Types.ActivityEvent)]) : Map.Map<Common.EntityId, Types.ActivityEvent> {
    Map.fromArray(store)
  };

  func genId(prefix : Text, salt : Text) : Common.EntityId {
    Time.now().toText() # "-" # prefix # "-" # salt
  };

  public func addComment(
    commentStore : [(Common.EntityId, Types.TaskComment)],
    activityStore : [(Common.EntityId, Types.ActivityEvent)],
    input : Types.TaskCommentInput,
    authorId : Common.UserId,
    projectId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Types.TaskComment, [(Common.EntityId, Types.TaskComment)], [(Common.EntityId, Types.ActivityEvent)]) {
    let now = Time.now();
    let id = genId("cmt", authorId.toText());
    let comment : Types.TaskComment = {
      id;
      tenantId;
      workspaceId;
      taskId = input.taskId;
      authorId;
      content = input.content;
      editedAt = null;
      createdAt = now;
      updatedAt = now;
    };
    let cm = toCommentMap(commentStore);
    cm.add(id, comment);
    let actId = genId("act", id);
    let event : Types.ActivityEvent = {
      id = actId;
      tenantId;
      workspaceId;
      taskId = input.taskId;
      projectId;
      actorId = authorId;
      eventType = #commentAdded;
      description = "Comment added";
      metadata = id;
      createdAt = now;
    };
    let am = toActivityMap(activityStore);
    am.add(actId, event);
    (comment, cm.toArray(), am.toArray())
  };

  public func editComment(
    commentStore : [(Common.EntityId, Types.TaskComment)],
    activityStore : [(Common.EntityId, Types.ActivityEvent)],
    commentId : Common.EntityId,
    content : Text,
    actorId : Common.UserId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (?Types.TaskComment, [(Common.EntityId, Types.TaskComment)], [(Common.EntityId, Types.ActivityEvent)]) {
    let cm = toCommentMap(commentStore);
    switch (cm.get(commentId)) {
      case (?existing) {
        if (existing.tenantId != tenantId or existing.workspaceId != workspaceId) return (null, commentStore, activityStore);
        let now = Time.now();
        let updated : Types.TaskComment = { existing with content; editedAt = ?now; updatedAt = now };
        cm.add(commentId, updated);
        let actId = genId("act", commentId);
        let event : Types.ActivityEvent = {
          id = actId;
          tenantId;
          workspaceId;
          taskId = existing.taskId;
          projectId = "";
          actorId;
          eventType = #commentEdited;
          description = "Comment edited";
          metadata = commentId;
          createdAt = now;
        };
        let am = toActivityMap(activityStore);
        am.add(actId, event);
        (?updated, cm.toArray(), am.toArray())
      };
      case null (null, commentStore, activityStore);
    }
  };

  public func deleteComment(
    commentStore : [(Common.EntityId, Types.TaskComment)],
    commentId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Bool, [(Common.EntityId, Types.TaskComment)]) {
    let cm = toCommentMap(commentStore);
    switch (cm.get(commentId)) {
      case (?c) {
        if (c.tenantId != tenantId or c.workspaceId != workspaceId) return (false, commentStore);
        cm.remove(commentId);
        (true, cm.toArray())
      };
      case null (false, commentStore);
    }
  };

  public func listComments(
    store : [(Common.EntityId, Types.TaskComment)],
    taskId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.TaskComment] {
    let m = toCommentMap(store);
    m.values().filter(func(c : Types.TaskComment) : Bool {
      c.tenantId == tenantId and c.workspaceId == workspaceId and c.taskId == taskId
    }).toArray()
  };

  public func listActivityEvents(
    store : [(Common.EntityId, Types.ActivityEvent)],
    taskId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.ActivityEvent] {
    let m = toActivityMap(store);
    m.values().filter(func(e : Types.ActivityEvent) : Bool {
      e.tenantId == tenantId and e.workspaceId == workspaceId and e.taskId == taskId
    }).toArray()
  };

  public func addActivityEvent(
    store : [(Common.EntityId, Types.ActivityEvent)],
    event : Types.ActivityEvent,
  ) : [(Common.EntityId, Types.ActivityEvent)] {
    let m = toActivityMap(store);
    m.add(event.id, event);
    m.toArray()
  };
};
