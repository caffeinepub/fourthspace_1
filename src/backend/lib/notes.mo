import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
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

  // ── CRUD ─────────────────────────────────────────────────────────────────────

  public func createNote(
    store : [(Common.EntityId, Types.Note)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
    input : Types.NoteInput,
  ) : (Types.Note, [(Common.EntityId, Types.Note)]) {
    let now = Time.now();
    let id = genId(caller.toText());
    let note : Types.Note = {
      id;
      tenantId;
      title = input.title;
      content = input.content;
      tags = input.tags;
      authorId = caller;
      crossLinks = input.crossLinks;
      createdAt = now;
      updatedAt = now;
    };
    let m = toMap(store);
    m.add(id, note);
    (note, toStore(m))
  };

  public func getNote(
    store : [(Common.EntityId, Types.Note)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
  ) : ?Types.Note {
    let m = toMap(store);
    switch (m.get(id)) {
      case (?note) {
        if (note.tenantId == tenantId) ?note else null
      };
      case null null;
    }
  };

  public func listNotes(
    store : [(Common.EntityId, Types.Note)],
    tenantId : Common.TenantId,
  ) : [Types.Note] {
    let m = toMap(store);
    m.values().filter(func(n : Types.Note) : Bool { n.tenantId == tenantId }).toArray(
      
    )
  };

  public func updateNote(
    store : [(Common.EntityId, Types.Note)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : Types.NoteInput,
  ) : (?Types.Note, [(Common.EntityId, Types.Note)]) {
    let m = toMap(store);
    switch (m.get(id)) {
      case (?existing) {
        if (existing.tenantId != tenantId) return (null, store);
        let updated : Types.Note = {
          existing with
          title = input.title;
          content = input.content;
          tags = input.tags;
          crossLinks = input.crossLinks;
          updatedAt = Time.now();
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
    id : Common.EntityId,
    caller : Common.UserId,
  ) : (Bool, [(Common.EntityId, Types.Note)]) {
    let m = toMap(store);
    switch (m.get(id)) {
      case (?note) {
        if (note.tenantId != tenantId) return (false, store);
        m.remove(id);
        (true, toStore(m))
      };
      case null (false, store);
    }
  };

  public func searchNotes(
    store : [(Common.EntityId, Types.Note)],
    tenantId : Common.TenantId,
    searchQuery : Text,
  ) : [Types.Note] {
    let lower = searchQuery.toLower();
    let m = toMap(store);
    m.values().filter(
        func(n : Types.Note) : Bool {
          n.tenantId == tenantId and (
            n.title.toLower().contains(#text lower) or
            n.content.toLower().contains(#text lower)
          )
        },
      ).toArray()
  };
};
