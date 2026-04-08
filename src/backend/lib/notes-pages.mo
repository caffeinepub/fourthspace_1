import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/notes";
import Common "../types/common";

module {

  func toMap(store : [(Common.EntityId, Types.PageNode)]) : Map.Map<Common.EntityId, Types.PageNode> {
    Map.fromArray(store)
  };

  func toStore(m : Map.Map<Common.EntityId, Types.PageNode>) : [(Common.EntityId, Types.PageNode)] {
    m.toArray()
  };

  func genId(salt : Text) : Common.EntityId {
    let ts = Time.now();
    ts.toText() # "-" # salt
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────

  public func createPage(
    store : [(Common.EntityId, Types.PageNode)],
    input : Types.PageInput,
    authorId : Common.UserId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Types.PageNode, [(Common.EntityId, Types.PageNode)]) {
    let now = Time.now();
    let id = genId(authorId.toText());
    let page : Types.PageNode = {
      id;
      tenantId;
      workspaceId;
      title = input.title;
      parentPageId = input.parentPageId;
      icon = input.icon;
      coverUrl = input.coverUrl;
      blocks = [];
      authorId;
      crossLinks = [];
      watchers = [];
      createdAt = now;
      updatedAt = now;
    };
    let m = toMap(store);
    m.add(id, page);
    (page, toStore(m))
  };

  public func getPage(
    store : [(Common.EntityId, Types.PageNode)],
    pageId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : ?Types.PageNode {
    let m = toMap(store);
    switch (m.get(pageId)) {
      case (?p) { if (p.tenantId == tenantId and p.workspaceId == workspaceId) ?p else null };
      case null null;
    }
  };

  public func listPages(
    store : [(Common.EntityId, Types.PageNode)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    parentPageId : ?Common.EntityId,
  ) : [Types.PageNode] {
    let m = toMap(store);
    m.values().filter(
      func(p : Types.PageNode) : Bool {
        p.tenantId == tenantId and p.workspaceId == workspaceId and p.parentPageId == parentPageId
      }
    ).toArray()
  };

  public func updatePage(
    store : [(Common.EntityId, Types.PageNode)],
    pageId : Common.EntityId,
    title : Text,
    icon : Text,
    coverUrl : ?Text,
    blocks : [Types.Block],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (?Types.PageNode, [(Common.EntityId, Types.PageNode)]) {
    let m = toMap(store);
    switch (m.get(pageId)) {
      case (?existing) {
        if (existing.tenantId != tenantId or existing.workspaceId != workspaceId) return (null, store);
        let updated : Types.PageNode = {
          existing with
          title;
          icon;
          coverUrl;
          blocks;
          updatedAt = Time.now();
        };
        m.add(pageId, updated);
        (?updated, toStore(m))
      };
      case null (null, store);
    }
  };

  public func deletePage(
    store : [(Common.EntityId, Types.PageNode)],
    pageId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Bool, [(Common.EntityId, Types.PageNode)]) {
    let m = toMap(store);
    switch (m.get(pageId)) {
      case (?p) {
        if (p.tenantId != tenantId or p.workspaceId != workspaceId) return (false, store);
        m.remove(pageId);
        (true, toStore(m))
      };
      case null (false, store);
    }
  };

  public func getPageHierarchy(
    store : [(Common.EntityId, Types.PageNode)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.PageNode] {
    let m = toMap(store);
    m.values().filter(func(p : Types.PageNode) : Bool {
      p.tenantId == tenantId and p.workspaceId == workspaceId
    }).toArray()
  };

  public func getBacklinks(
    store : [(Common.EntityId, Types.PageNode)],
    targetPageId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.PageNode] {
    let m = toMap(store);
    m.values().filter(
      func(p : Types.PageNode) : Bool {
        if (p.tenantId != tenantId or p.workspaceId != workspaceId) return false;
        var found = false;
        for (link in p.crossLinks.vals()) {
          if (link.entityId == targetPageId) { found := true };
        };
        found
      }
    ).toArray()
  };
};
