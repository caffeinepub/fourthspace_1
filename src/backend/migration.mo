// Migration: adds lastEditedBy and lastEditedAt fields to Note type.
// Old Note did not have these fields; new Note has them as optional (?Principal, ?Int).
module {

  // ── Old types (inline — do not import from .old/) ─────────────────────────
  type EntityId  = Text;
  type TenantId  = Text;
  type WorkspaceId = Text;
  type UserId    = Principal;
  type Timestamp = Int;

  type CrossLink = {
    entityType  : Text;
    entityId    : EntityId;
    tenantId    : TenantId;
    linkLabel   : Text;
  };

  type OldNote = {
    id          : EntityId;
    tenantId    : TenantId;
    workspaceId : WorkspaceId;
    title       : Text;
    content     : Text;
    tags        : [Text];
    authorId    : UserId;
    crossLinks  : [CrossLink];
    createdAt   : Timestamp;
    updatedAt   : Timestamp;
  };

  type NewNote = {
    id             : EntityId;
    tenantId       : TenantId;
    workspaceId    : WorkspaceId;
    title          : Text;
    content        : Text;
    tags           : [Text];
    authorId       : UserId;
    crossLinks     : [CrossLink];
    createdAt      : Timestamp;
    updatedAt      : Timestamp;
    lastEditedBy   : ?UserId;
    lastEditedAt   : ?Timestamp;
    coverGradient  : ?Text;
    iconEmoji      : ?Text;
  };

  // ── Migration state types ─────────────────────────────────────────────────
  type OldActor = {
    var notes : [(EntityId, OldNote)];
  };

  type NewActor = {
    var notes : [(EntityId, NewNote)];
  };

  // ── Migration function ────────────────────────────────────────────────────
  public func run(old : OldActor) : NewActor {
    let newNotes : [(EntityId, NewNote)] = old.notes.map<(EntityId, OldNote), (EntityId, NewNote)>(
      func(entry) {
        let id = entry.0;
        let n  = entry.1;
        (id, {
          id          = n.id;
          tenantId    = n.tenantId;
          workspaceId = n.workspaceId;
          title       = n.title;
          content     = n.content;
          tags        = n.tags;
          authorId    = n.authorId;
          crossLinks  = n.crossLinks;
          createdAt   = n.createdAt;
          updatedAt   = n.updatedAt;
          lastEditedBy  = null;
          lastEditedAt  = null;
          coverGradient = null;
          iconEmoji     = null;
        })
      }
    );
    { var notes = newNotes }
  };
};
