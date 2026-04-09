import C "common";

module {
  // ── Legacy types (preserved unchanged) ──────────────────────────────────
  public type Note = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    title : Text;
    content : Text;
    tags : [Text];
    authorId : C.UserId;
    crossLinks : [C.CrossLink];
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
    // Presence/edit tracking fields
    lastEditedBy : ?C.UserId;
    lastEditedAt : ?C.Timestamp;
    // Cover and icon customisation
    coverGradient : ?Text;
    iconEmoji : ?Text;
  };

  public type NoteInput = {
    title : Text;
    content : Text;
    tags : [Text];
    crossLinks : [C.CrossLink];
    coverGradient : ?Text;
    iconEmoji : ?Text;
  };

  // ── Block system (flat list approach — avoids recursive type limitation) ─
  // BlockTypeTag is a plain Text tag: "paragraph" | "heading1" | "heading2"
  // | "heading3" | "bulletList" | "numberedList" | "toggle" | "callout"
  // | "code" | "divider" | "quote" | "table" | "image"
  public type BlockTypeTag = Text;

  // Flat block — parentId links children without recursive self-reference.
  // metadata holds JSON for type-specific fields (language, emoji, headers, etc.)
  public type Block = {
    id : C.EntityId;
    parentId : ?C.EntityId;
    order : Nat;
    blockType : BlockTypeTag;
    content : Text;
    metadata : Text; // JSON string: { language, emoji, headers, rows, url, caption }
  };

  // ── Page (Notion-style nested pages) ────────────────────────────────────
  public type PageNode = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    title : Text;
    parentPageId : ?C.EntityId;
    icon : Text;
    coverUrl : ?Text;
    blocks : [Block];
    authorId : C.UserId;
    crossLinks : [C.CrossLink];
    watchers : [C.UserId];
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  // blocks stored as serialized JSON strings in the input for simplicity
  public type PageInput = {
    title : Text;
    parentPageId : ?C.EntityId;
    icon : Text;
    coverUrl : ?Text;
    blocks : [Text];
  };

  // ── Templates ────────────────────────────────────────────────────────────
  public type NoteTemplate = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    name : Text;
    description : Text;
    icon : Text;
    blocksJson : Text; // JSON representation of [Block]
    authorId : C.UserId;
    createdAt : C.Timestamp;
  };

  public type NoteTemplateInput = {
    name : Text;
    description : Text;
    icon : Text;
    blocksJson : Text;
  };

  // ── Backlinks ────────────────────────────────────────────────────────────
  public type Backlink = {
    sourcePageId : C.EntityId;
    sourcePageTitle : Text;
    targetPageId : C.EntityId;
    createdAt : C.Timestamp;
  };

  // ── Presence tracking ────────────────────────────────────────────────────
  // Stored in a separate stable var keyed by "noteId:userId"
  public type NoteEditorPresence = {
    userId : C.UserId;
    displayName : Text;
    isEditing : Bool;
    lastSeen : Int;
  };

  public type NoteLastEdit = {
    userId : C.UserId;
    displayName : Text;
    editedAt : Int;
  };

  // Internal record for the presence store (includes noteId + workspaceId for filtering)
  public type NotePresenceEntry = {
    noteId : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    userId : C.UserId;
    displayName : Text;
    isEditing : Bool;
    lastSeen : Int;
  };

  // Internal record for last-edit store
  public type NoteLastEditEntry = {
    noteId : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    userId : C.UserId;
    displayName : Text;
    editedAt : Int;
  };
};
