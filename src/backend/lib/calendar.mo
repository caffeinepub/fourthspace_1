import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Types "../types/calendar";
import Common "../types/common";

module {

  // ── Helpers ───────────────────────────────────────────────────────────────────

  func toMap(store : [(Common.EntityId, Types.Event)]) : Map.Map<Common.EntityId, Types.Event> {
    Map.fromArray(store)
  };

  func toStore(m : Map.Map<Common.EntityId, Types.Event>) : [(Common.EntityId, Types.Event)] {
    m.toArray()
  };

  func genId(salt : Text) : Common.EntityId {
    let ts = Time.now();
    ts.toText() # "-" # salt
  };

  func hasAttendee(event : Types.Event, userId : Common.UserId) : Bool {
    event.attendeeIds.any(func(id : Common.UserId) : Bool { Principal.equal(id, userId) })
  };

  // ── Event CRUD ────────────────────────────────────────────────────────────────

  public func createEvent(
    store : [(Common.EntityId, Types.Event)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
    input : Types.EventInput,
  ) : (Types.Event, [(Common.EntityId, Types.Event)]) {
    let now = Time.now();
    let id = genId(caller.toText() # "ev");
    // Ensure creator is in attendeeIds
    let attendees : [Common.UserId] = if (input.attendeeIds.any(func(id : Common.UserId) : Bool { Principal.equal(id, caller) })) {
      input.attendeeIds
    } else {
      input.attendeeIds.concat([caller])
    };
    let event : Types.Event = {
      id;
      tenantId;
      title = input.title;
      description = input.description;
      startTime = input.startTime;
      endTime = input.endTime;
      recurrence = input.recurrence;
      attendeeIds = attendees;
      crossLinks = input.crossLinks;
      createdBy = caller;
      createdAt = now;
      updatedAt = now;
    };
    let m = toMap(store);
    m.add(id, event);
    (event, toStore(m))
  };

  public func getEvent(
    store : [(Common.EntityId, Types.Event)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
  ) : ?Types.Event {
    let m = toMap(store);
    switch (m.get(id)) {
      case (?ev) { if (ev.tenantId == tenantId) ?ev else null };
      case null null;
    }
  };

  public func listEvents(
    store : [(Common.EntityId, Types.Event)],
    tenantId : Common.TenantId,
    from : Common.Timestamp,
    to : Common.Timestamp,
  ) : [Types.Event] {
    let m = toMap(store);
    m.values().filter(
        func(ev : Types.Event) : Bool {
          ev.tenantId == tenantId and ev.startTime >= from and ev.startTime <= to
        },
      ).toArray()
  };

  public func updateEvent(
    store : [(Common.EntityId, Types.Event)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : Types.EventInput,
  ) : (?Types.Event, [(Common.EntityId, Types.Event)]) {
    let m = toMap(store);
    switch (m.get(id)) {
      case (?existing) {
        if (existing.tenantId != tenantId) return (null, store);
        let updated : Types.Event = {
          existing with
          title = input.title;
          description = input.description;
          startTime = input.startTime;
          endTime = input.endTime;
          recurrence = input.recurrence;
          attendeeIds = input.attendeeIds;
          crossLinks = input.crossLinks;
          updatedAt = Time.now();
        };
        m.add(id, updated);
        (?updated, toStore(m))
      };
      case null (null, store);
    }
  };

  public func deleteEvent(
    store : [(Common.EntityId, Types.Event)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : (Bool, [(Common.EntityId, Types.Event)]) {
    let m = toMap(store);
    switch (m.get(id)) {
      case (?ev) {
        if (ev.tenantId != tenantId) return (false, store);
        m.remove(id);
        (true, toStore(m))
      };
      case null (false, store);
    }
  };

  public func listMyEvents(
    store : [(Common.EntityId, Types.Event)],
    tenantId : Common.TenantId,
    userId : Common.UserId,
  ) : [Types.Event] {
    let m = toMap(store);
    m.values().filter(
        func(ev : Types.Event) : Bool {
          ev.tenantId == tenantId and hasAttendee(ev, userId)
        },
      ).toArray()
  };
};
