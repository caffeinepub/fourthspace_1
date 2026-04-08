import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/projects";
import Common "../types/common";

module {

  func toMap(store : [(Common.EntityId, Types.ChecklistItem)]) : Map.Map<Common.EntityId, Types.ChecklistItem> {
    Map.fromArray(store)
  };

  func genId(salt : Text) : Common.EntityId {
    Time.now().toText() # "-cl-" # salt
  };

  public func addChecklistItem(
    store : [(Common.EntityId, Types.ChecklistItem)],
    input : Types.ChecklistItemInput,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Types.ChecklistItem, [(Common.EntityId, Types.ChecklistItem)]) {
    let now = Time.now();
    let id = genId(input.taskId);
    let item : Types.ChecklistItem = {
      id;
      tenantId;
      workspaceId;
      taskId = input.taskId;
      content = input.content;
      completed = input.completed;
      order = input.order;
      createdAt = now;
      updatedAt = now;
    };
    let m = toMap(store);
    m.add(id, item);
    (item, m.toArray())
  };

  public func updateChecklistItem(
    store : [(Common.EntityId, Types.ChecklistItem)],
    itemId : Common.EntityId,
    content : Text,
    completed : Bool,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (?Types.ChecklistItem, [(Common.EntityId, Types.ChecklistItem)]) {
    let m = toMap(store);
    switch (m.get(itemId)) {
      case (?existing) {
        if (existing.tenantId != tenantId or existing.workspaceId != workspaceId) return (null, store);
        let updated : Types.ChecklistItem = { existing with content; completed; updatedAt = Time.now() };
        m.add(itemId, updated);
        (?updated, m.toArray())
      };
      case null (null, store);
    }
  };

  public func deleteChecklistItem(
    store : [(Common.EntityId, Types.ChecklistItem)],
    itemId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Bool, [(Common.EntityId, Types.ChecklistItem)]) {
    let m = toMap(store);
    switch (m.get(itemId)) {
      case (?item) {
        if (item.tenantId != tenantId or item.workspaceId != workspaceId) return (false, store);
        m.remove(itemId);
        (true, m.toArray())
      };
      case null (false, store);
    }
  };

  public func listChecklistItems(
    store : [(Common.EntityId, Types.ChecklistItem)],
    taskId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.ChecklistItem] {
    let m = toMap(store);
    m.values().filter(func(item : Types.ChecklistItem) : Bool {
      item.tenantId == tenantId and item.workspaceId == workspaceId and item.taskId == taskId
    }).toArray()
  };
};
