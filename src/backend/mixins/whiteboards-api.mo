import Common "../types/common";
import WBTypes "../types/whiteboards";
import WBLib "../lib/whiteboards";

module {

  public func createWhiteboard(
    store : [(Common.EntityId, WBTypes.Whiteboard)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : WBTypes.WhiteboardInput,
  ) : { result : { #ok : WBTypes.Whiteboard; #err : Text }; store : [(Common.EntityId, WBTypes.Whiteboard)] } {
    let (wb, newStore) = WBLib.createWhiteboard(store, tenantId, workspaceId, caller, input);
    { result = #ok wb; store = newStore }
  };

  public func updateWhiteboardElements(
    store : [(Common.EntityId, WBTypes.Whiteboard)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    elements : [WBTypes.WhiteboardElement],
  ) : { result : { #ok : WBTypes.Whiteboard; #err : Text }; store : [(Common.EntityId, WBTypes.Whiteboard)] } {
    let (opt, newStore) = WBLib.updateWhiteboardElements(store, tenantId, workspaceId, id, caller, elements);
    switch opt {
      case (?wb) { { result = #ok wb; store = newStore } };
      case null { { result = #err "Whiteboard not found"; store } };
    }
  };

  public func getWhiteboard(
    store : [(Common.EntityId, WBTypes.Whiteboard)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { #ok : WBTypes.Whiteboard; #err : Text } {
    switch (WBLib.getWhiteboard(store, tenantId, workspaceId, id)) {
      case (?wb) #ok wb;
      case null #err "Whiteboard not found";
    }
  };

  public func listWhiteboards(
    store : [(Common.EntityId, WBTypes.Whiteboard)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [WBTypes.Whiteboard] {
    WBLib.listWhiteboards(store, tenantId, workspaceId)
  };

  public func deleteWhiteboard(
    store : [(Common.EntityId, WBTypes.Whiteboard)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { result : { #ok : Bool; #err : Text }; store : [(Common.EntityId, WBTypes.Whiteboard)] } {
    let (ok, newStore) = WBLib.deleteWhiteboard(store, tenantId, workspaceId, id, caller);
    if (ok) { { result = #ok true; store = newStore } } else {
      { result = #err "Whiteboard not found"; store }
    }
  };

  public func listWhiteboardTemplates() : [WBTypes.WhiteboardTemplate] {
    WBLib.listWhiteboardTemplates()
  };

  public func convertElementToTask(
    store : [(Common.EntityId, WBTypes.Whiteboard)],
    whiteboardId : Common.EntityId,
    elementId : Common.EntityId,
    projectId : Common.EntityId,
    workspaceId : Common.WorkspaceId,
    tenantId : Common.TenantId,
  ) : {
    result : { #ok : (WBTypes.Whiteboard, Text, Text, Text, ?Principal); #err : Text };
    store : [(Common.EntityId, WBTypes.Whiteboard)];
  } {
    let res = WBLib.convertWhiteboardElementToTask(store, whiteboardId, elementId, projectId, workspaceId, tenantId);
    switch (res.result) {
      case (#err e) { { result = #err e; store } };
      case (#ok(wb, taskInput)) {
        {
          result = #ok(wb, taskInput.projectId, taskInput.title, taskInput.description, taskInput.assigneeId);
          store = res.store;
        }
      };
    }
  };

  public func linkElementToTask(
    store : [(Common.EntityId, WBTypes.Whiteboard)],
    whiteboardId : Common.EntityId,
    elementId : Common.EntityId,
    taskId : Text,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [(Common.EntityId, WBTypes.Whiteboard)] {
    WBLib.linkElementToTask(store, whiteboardId, elementId, taskId, tenantId, workspaceId)
  };
};
