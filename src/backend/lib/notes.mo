import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Types "../types/notes";
import Common "../types/common";

module {

  // Build an in-memory map from the stable array store.
  func toMap(store : [(Common.EntityId, Types.Note)]) : Map.Map<Common.EntityId, Types.Note> {
    Map.fromArray(store)
  };

  // Render the map back to the stable array form.
  func toStore(m : Map.Map<Common.EntityId, Types.Note>) : [(Common.EntityId, Types.Note)] {
    m.toArray()
  };

  // Generate a simple entity ID from the current time + a salt text.
  func genId(salt : Text) : Common.EntityId {
    let ts = Time.now();
    ts.toText() # "-" # salt
  };

  // Presence store key: "noteId:userId"
  func presenceKey(noteId : Common.EntityId, userId : Common.UserId) : Text {
    noteId # ":" # userId.toText()
  };

  // ── CRUD ─────────────────────────────────────────────────────────────────────

  public func createNote(
    store : [(Common.EntityId, Types.Note)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : Types.NoteInput,
  ) : (Types.Note, [(Common.EntityId, Types.Note)]) {
    let now = Time.now();
    let id = genId(caller.toText());
    let note : Types.Note = {
      id;
      tenantId;
      workspaceId;
      title = input.title;
      content = input.content;
      tags = input.tags;
      authorId = caller;
      crossLinks = input.crossLinks;
      createdAt = now;
      updatedAt = now;
      lastEditedBy = null;
      lastEditedAt = null;
      coverGradient = input.coverGradient;
      iconEmoji = input.iconEmoji;
    };
    let m = toMap(store);
    m.add(id, note);
    (note, toStore(m))
  };

  public func getNote(
    store : [(Common.EntityId, Types.Note)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : ?Types.Note {
    let m = toMap(store);
    switch (m.get(id)) {
      case (?note) {
        if (note.tenantId == tenantId and note.workspaceId == workspaceId) ?note else null
      };
      case null null;
    }
  };

  public func listNotes(
    store : [(Common.EntityId, Types.Note)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.Note] {
    let m = toMap(store);
    m.values().filter(func(n : Types.Note) : Bool {
      n.tenantId == tenantId and n.workspaceId == workspaceId
    }).toArray()
  };

  public func updateNote(
    store : [(Common.EntityId, Types.Note)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : Types.NoteInput,
  ) : (?Types.Note, [(Common.EntityId, Types.Note)]) {
    let m = toMap(store);
    switch (m.get(id)) {
      case (?existing) {
        if (existing.tenantId != tenantId or existing.workspaceId != workspaceId) return (null, store);
        let now = Time.now();
        let updated : Types.Note = {
          existing with
          title = input.title;
          content = input.content;
          tags = input.tags;
          crossLinks = input.crossLinks;
          updatedAt = now;
          lastEditedBy = ?caller;
          lastEditedAt = ?now;
          coverGradient = input.coverGradient;
          iconEmoji = input.iconEmoji;
        };
        m.add(id, updated);
        (?updated, toStore(m))
      };
      case null (null, store);
    }
  };

  public func deleteNote(
    store : [(Common.EntityId, Types.Note)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : (Bool, [(Common.EntityId, Types.Note)]) {
    let m = toMap(store);
    switch (m.get(id)) {
      case (?note) {
        if (note.tenantId != tenantId or note.workspaceId != workspaceId) return (false, store);
        m.remove(id);
        (true, toStore(m))
      };
      case null (false, store);
    }
  };

  public func searchNotes(
    store : [(Common.EntityId, Types.Note)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    searchQuery : Text,
  ) : [Types.Note] {
    let lower = searchQuery.toLower();
    let m = toMap(store);
    m.values().filter(
        func(n : Types.Note) : Bool {
          n.tenantId == tenantId and n.workspaceId == workspaceId and (
            n.title.toLower().contains(#text lower) or
            n.content.toLower().contains(#text lower)
          )
        },
      ).toArray()
  };

  // ── Presence Tracking ─────────────────────────────────────────────────────────

  // 30 seconds in nanoseconds
  let presenceWindowNs : Int = 30_000_000_000;

  public func updateNotePresence(
    presenceStore : [(Text, Types.NotePresenceEntry)],
    noteId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    displayName : Text,
  ) : [(Text, Types.NotePresenceEntry)] {
    let m : Map.Map<Text, Types.NotePresenceEntry> = Map.fromArray(presenceStore);
    let key = presenceKey(noteId, caller);
    let entry : Types.NotePresenceEntry = {
      noteId;
      tenantId;
      workspaceId;
      userId = caller;
      displayName;
      lastSeen = Time.now();
    };
    m.add(key, entry);
    m.toArray()
  };

  public func getNoteActiveEditors(
    presenceStore : [(Text, Types.NotePresenceEntry)],
    noteId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.NoteEditorPresence] {
    let m : Map.Map<Text, Types.NotePresenceEntry> = Map.fromArray(presenceStore);
    let now = Time.now();
    let cutoff = now - presenceWindowNs;
    m.values()
      .filter(func(e : Types.NotePresenceEntry) : Bool {
        e.noteId == noteId and e.tenantId == tenantId and e.workspaceId == workspaceId and e.lastSeen >= cutoff
      })
      .map<Types.NotePresenceEntry, Types.NoteEditorPresence>(func(e : Types.NotePresenceEntry) : Types.NoteEditorPresence {
        { userId = e.userId; displayName = e.displayName; lastSeen = e.lastSeen }
      })
      .toArray()
  };

  public func updateLastEdit(
    lastEditStore : [(Text, Types.NoteLastEditEntry)],
    noteId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    displayName : Text,
  ) : [(Text, Types.NoteLastEditEntry)] {
    let m : Map.Map<Text, Types.NoteLastEditEntry> = Map.fromArray(lastEditStore);
    let entry : Types.NoteLastEditEntry = {
      noteId;
      tenantId;
      workspaceId;
      userId = caller;
      displayName;
      editedAt = Time.now();
    };
    m.add(noteId, entry);
    m.toArray()
  };

  public func getLastNoteEdit(
    lastEditStore : [(Text, Types.NoteLastEditEntry)],
    noteId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : ?Types.NoteLastEdit {
    let m : Map.Map<Text, Types.NoteLastEditEntry> = Map.fromArray(lastEditStore);
    switch (m.get(noteId)) {
      case (?e) {
        if (e.tenantId == tenantId and e.workspaceId == workspaceId) {
          ?{ userId = e.userId; displayName = e.displayName; editedAt = e.editedAt }
        } else null
      };
      case null null;
    }
  };
};
