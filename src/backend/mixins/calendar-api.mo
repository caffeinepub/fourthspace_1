import Common "../types/common";
import CalTypes "../types/calendar";
import Calendar "../lib/calendar";

module {
  public type EventStore = [(Common.EntityId, CalTypes.Event)];

  // ── Event API ─────────────────────────────────────────────────────────────────

  public func createEvent(
    events : EventStore,
    tenantId : Common.TenantId,
    caller : Common.UserId,
    input : CalTypes.EventInput,
  ) : ({ #ok : CalTypes.Event; #err : Text }, EventStore) {
    let (event, newStore) = Calendar.createEvent(events, tenantId, caller, input);
    (#ok event, newStore)
  };

  public func getEvent(
    events : EventStore,
    tenantId : Common.TenantId,
    id : Common.EntityId,
  ) : { #ok : CalTypes.Event; #err : Text } {
    switch (Calendar.getEvent(events, tenantId, id)) {
      case (?ev) #ok ev;
      case null #err "Event not found";
    }
  };

  public func listEvents(
    events : EventStore,
    tenantId : Common.TenantId,
    from : Common.Timestamp,
    to : Common.Timestamp,
  ) : [CalTypes.Event] {
    Calendar.listEvents(events, tenantId, from, to)
  };

  public func updateEvent(
    events : EventStore,
    tenantId : Common.TenantId,
    caller : Common.UserId,
    id : Common.EntityId,
    input : CalTypes.EventInput,
  ) : ({ #ok : CalTypes.Event; #err : Text }, EventStore) {
    let (result, newStore) = Calendar.updateEvent(events, tenantId, id, caller, input);
    switch (result) {
      case (?ev) (#ok ev, newStore);
      case null (#err "Event not found or access denied", events);
    }
  };

  public func deleteEvent(
    events : EventStore,
    tenantId : Common.TenantId,
    caller : Common.UserId,
    id : Common.EntityId,
  ) : ({ #ok : Bool; #err : Text }, EventStore) {
    let (deleted, newStore) = Calendar.deleteEvent(events, tenantId, id, caller);
    if (deleted) (#ok true, newStore)
    else (#err "Event not found or access denied", events)
  };

  public func listMyEvents(
    events : EventStore,
    tenantId : Common.TenantId,
    caller : Common.UserId,
  ) : [CalTypes.Event] {
    Calendar.listMyEvents(events, tenantId, caller)
  };
};
