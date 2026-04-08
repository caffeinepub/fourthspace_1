import Common "../types/common";
import NTypes "../types/notes";
import Pages "../lib/notes-pages";
import Templates "../lib/notes-templates";

/// Public-API mixin for PageNode and NoteTemplate operations.
/// State slices are passed in and the updated slices are returned alongside results.
module {

  // ── Pages ─────────────────────────────────────────────────────────────────

  public func createPage(
    store : [(Common.EntityId, NTypes.PageNode)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : NTypes.PageInput,
  ) : { result : { #ok : NTypes.PageNode; #err : Text }; store : [(Common.EntityId, NTypes.PageNode)] } {
    let (page, updated) = Pages.createPage(store, input, caller, tenantId, workspaceId);
    { result = #ok page; store = updated }
  };

  public func getPage(
    store : [(Common.EntityId, NTypes.PageNode)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    pageId : Common.EntityId,
  ) : { #ok : NTypes.PageNode; #err : Text } {
    switch (Pages.getPage(store, pageId, tenantId, workspaceId)) {
      case (?p) #ok p;
      case null #err "Page not found";
    }
  };

  public func listPages(
    store : [(Common.EntityId, NTypes.PageNode)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    parentPageId : ?Common.EntityId,
  ) : [NTypes.PageNode] {
    Pages.listPages(store, tenantId, workspaceId, parentPageId)
  };

  public func updatePage(
    store : [(Common.EntityId, NTypes.PageNode)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    pageId : Common.EntityId,
    title : Text,
    icon : Text,
    coverUrl : ?Text,
    blocks : [NTypes.Block],
  ) : { result : { #ok : NTypes.PageNode; #err : Text }; store : [(Common.EntityId, NTypes.PageNode)] } {
    let (maybeP, updated) = Pages.updatePage(store, pageId, title, icon, coverUrl, blocks, tenantId, workspaceId);
    switch (maybeP) {
      case (?p) ({ result = #ok p; store = updated });
      case null ({ result = #err "Page not found or access denied"; store = store });
    }
  };

  public func deletePage(
    store : [(Common.EntityId, NTypes.PageNode)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    pageId : Common.EntityId,
  ) : { result : { #ok : Bool; #err : Text }; store : [(Common.EntityId, NTypes.PageNode)] } {
    let (ok, updated) = Pages.deletePage(store, pageId, tenantId, workspaceId);
    if (ok) { { result = #ok true; store = updated } }
    else { { result = #err "Page not found or access denied"; store = store } }
  };

  public func getPageHierarchy(
    store : [(Common.EntityId, NTypes.PageNode)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [NTypes.PageNode] {
    Pages.getPageHierarchy(store, tenantId, workspaceId)
  };

  public func getBacklinks(
    store : [(Common.EntityId, NTypes.PageNode)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    targetPageId : Common.EntityId,
  ) : [NTypes.PageNode] {
    Pages.getBacklinks(store, targetPageId, tenantId, workspaceId)
  };

  // ── Templates ─────────────────────────────────────────────────────────────

  public func listNoteTemplates(
    store : [(Common.EntityId, NTypes.NoteTemplate)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [NTypes.NoteTemplate] {
    Templates.listTemplates(store, tenantId, workspaceId)
  };

  public func createNoteTemplate(
    store : [(Common.EntityId, NTypes.NoteTemplate)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : NTypes.NoteTemplateInput,
  ) : { result : { #ok : NTypes.NoteTemplate; #err : Text }; store : [(Common.EntityId, NTypes.NoteTemplate)] } {
    let (tmpl, updated) = Templates.createTemplate(store, input, caller, tenantId, workspaceId);
    { result = #ok tmpl; store = updated }
  };

  public func deleteNoteTemplate(
    store : [(Common.EntityId, NTypes.NoteTemplate)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    templateId : Common.EntityId,
  ) : { result : { #ok : Bool; #err : Text }; store : [(Common.EntityId, NTypes.NoteTemplate)] } {
    let (ok, updated) = Templates.deleteTemplate(store, templateId, tenantId, workspaceId);
    if (ok) { { result = #ok true; store = updated } }
    else { { result = #err "Template not found or access denied"; store = store } }
  };
};
