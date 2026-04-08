import Common "../types/common";
import NTypes "../types/notes";
import Notes "../lib/notes";

/// Public-API module for Notes.
/// Each function receives the current store, performs the operation,
/// and returns the result plus the updated store (for state-mutating operations).
module {

  public func createNote(
    store : [(Common.EntityId, NTypes.Note)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : NTypes.NoteInput,
  ) : { result : { #ok : NTypes.Note; #err : Text }; store : [(Common.EntityId, NTypes.Note)] } {
    let (note, updated) = Notes.createNote(store, tenantId, workspaceId, caller, input);
    { result = #ok note; store = updated }
  };

  public func getNote(
    store : [(Common.EntityId, NTypes.Note)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { #ok : NTypes.Note; #err : Text } {
    switch (Notes.getNote(store, tenantId, workspaceId, id)) {
      case (?n) #ok n;
      case null #err "Note not found";
    }
  };

  public func listNotes(
    store : [(Common.EntityId, NTypes.Note)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [NTypes.Note] {
    Notes.listNotes(store, tenantId, workspaceId)
  };

  public func updateNote(
    store : [(Common.EntityId, NTypes.Note)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : NTypes.NoteInput,
  ) : { result : { #ok : NTypes.Note; #err : Text }; store : [(Common.EntityId, NTypes.Note)] } {
    let (maybeNote, updated) = Notes.updateNote(store, tenantId, workspaceId, id, caller, input);
    switch (maybeNote) {
      case (?n) ({ result = #ok(n); store = updated });
      case null ({ result = #err("Note not found or access denied"); store = store });
    }
  };

  public func deleteNote(
    store : [(Common.EntityId, NTypes.Note)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { result : { #ok : Bool; #err : Text }; store : [(Common.EntityId, NTypes.Note)] } {
    let (ok, updated) = Notes.deleteNote(store, tenantId, workspaceId, id, caller);
    if (ok) {
      { result = #ok true; store = updated }
    } else {
      { result = #err "Note not found or access denied"; store = store }
    }
  };

  public func searchNotes(
    store : [(Common.EntityId, NTypes.Note)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    searchQuery : Text,
  ) : [NTypes.Note] {
    Notes.searchNotes(store, tenantId, workspaceId, searchQuery)
  };

  // ── Presence API ──────────────────────────────────────────────────────────────

  public func updateNotePresence(
    presenceStore : [(Text, NTypes.NotePresenceEntry)],
    noteId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    displayName : Text,
  ) : [(Text, NTypes.NotePresenceEntry)] {
    Notes.updateNotePresence(presenceStore, noteId, tenantId, workspaceId, caller, displayName)
  };

  public func getNoteActiveEditors(
    presenceStore : [(Text, NTypes.NotePresenceEntry)],
    noteId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [NTypes.NoteEditorPresence] {
    Notes.getNoteActiveEditors(presenceStore, noteId, tenantId, workspaceId)
  };

  public func updateLastEdit(
    lastEditStore : [(Text, NTypes.NoteLastEditEntry)],
    noteId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    displayName : Text,
  ) : [(Text, NTypes.NoteLastEditEntry)] {
    Notes.updateLastEdit(lastEditStore, noteId, tenantId, workspaceId, caller, displayName)
  };

  public func getLastNoteEdit(
    lastEditStore : [(Text, NTypes.NoteLastEditEntry)],
    noteId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : ?NTypes.NoteLastEdit {
    Notes.getLastNoteEdit(lastEditStore, noteId, tenantId, workspaceId)
  };
};
