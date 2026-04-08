import Common "../types/common";
import CalTypes "../types/calendar";
import Calendar "../lib/calendar";

module {
  public type EventStore = [(Common.EntityId, CalTypes.Event)];
  public type CalendarDefStore = [(Common.EntityId, CalTypes.CalendarDef)];
  public type RsvpStore = [(Common.EntityId, CalTypes.EventRsvp)];
  public type ExceptionStore = [(Common.EntityId, CalTypes.EventException)];

  // ── Event API (preserved signatures) ─────────────────────────────────────────

  public func createEvent(
    events : EventStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : CalTypes.EventInput,
  ) : ({ #ok : CalTypes.Event; #err : Text }, EventStore) {
    let (event, newStore) = Calendar.createEvent(events, tenantId, workspaceId, caller, input);
    (#ok event, newStore)
  };

  public func getEvent(
    events : EventStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { #ok : CalTypes.Event; #err : Text } {
    switch (Calendar.getEvent(events, tenantId, workspaceId, id)) {
      case (?ev) #ok ev;
      case null #err "Event not found";
    }
  };

  public func listEvents(
    events : EventStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    from : Common.Timestamp,
    to : Common.Timestamp,
  ) : [CalTypes.Event] {
    Calendar.listEvents(events, tenantId, workspaceId, from, to)
  };

  public func listEventsWithExceptions(
    events : EventStore,
    exceptions : ExceptionStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    from : Common.Timestamp,
    to : Common.Timestamp,
  ) : [CalTypes.Event] {
    Calendar.listEventsWithExceptions(events, exceptions, tenantId, workspaceId, from, to)
  };

  public func updateEvent(
    events : EventStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    id : Common.EntityId,
    input : CalTypes.EventInput,
  ) : ({ #ok : CalTypes.Event; #err : Text }, EventStore) {
    let (result, newStore) = Calendar.updateEvent(events, tenantId, workspaceId, id, caller, input);
    switch (result) {
      case (?ev) (#ok ev, newStore);
      case null (#err "Event not found or access denied", events);
    }
  };

  public func deleteEvent(
    events : EventStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    id : Common.EntityId,
  ) : ({ #ok : Bool; #err : Text }, EventStore) {
    let (deleted, newStore) = Calendar.deleteEvent(events, tenantId, workspaceId, id, caller);
    if (deleted) (#ok true, newStore)
    else (#err "Event not found or access denied", events)
  };

  public func listMyEvents(
    events : EventStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
  ) : [CalTypes.Event] {
    Calendar.listMyEvents(events, tenantId, workspaceId, caller)
  };

  // ── Calendar Management API ───────────────────────────────────────────────────

  public func createCalendar(
    calDefs : CalendarDefStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : CalTypes.CalendarDefInput,
  ) : ({ #ok : CalTypes.CalendarDef; #err : Text }, CalendarDefStore) {
    let (cal, newStore) = Calendar.createCalendar(calDefs, tenantId, workspaceId, caller, input);
    (#ok cal, newStore)
  };

  public func getCalendar(
    calDefs : CalendarDefStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { #ok : CalTypes.CalendarDef; #err : Text } {
    switch (Calendar.getCalendar(calDefs, tenantId, workspaceId, id)) {
      case (?c) #ok c;
      case null #err "Calendar not found";
    }
  };

  public func listCalendars(
    calDefs : CalendarDefStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    ownerId : ?Common.UserId,
  ) : [CalTypes.CalendarDef] {
    Calendar.listCalendars(calDefs, tenantId, workspaceId, ownerId)
  };

  public func updateCalendar(
    calDefs : CalendarDefStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    id : Common.EntityId,
    input : CalTypes.CalendarDefInput,
  ) : ({ #ok : CalTypes.CalendarDef; #err : Text }, CalendarDefStore) {
    let (result, newStore) = Calendar.updateCalendar(calDefs, tenantId, workspaceId, id, caller, input);
    switch (result) {
      case (?c) (#ok c, newStore);
      case null (#err "Calendar not found or access denied", calDefs);
    }
  };

  public func deleteCalendar(
    calDefs : CalendarDefStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    id : Common.EntityId,
  ) : ({ #ok : Bool; #err : Text }, CalendarDefStore) {
    let (deleted, newStore) = Calendar.deleteCalendar(calDefs, tenantId, workspaceId, id, caller);
    if (deleted) (#ok true, newStore)
    else (#err "Calendar not found or access denied", calDefs)
  };

  // ── RSVP API ──────────────────────────────────────────────────────────────────

  public func respondToEvent(
    rsvps : RsvpStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : CalTypes.EventRsvpInput,
  ) : ({ #ok : CalTypes.EventRsvp; #err : Text }, RsvpStore) {
    let (rsvp, newStore) = Calendar.respondToEvent(rsvps, tenantId, workspaceId, caller, input);
    (#ok rsvp, newStore)
  };

  public func getEventRsvps(
    rsvps : RsvpStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    eventId : Text,
  ) : [CalTypes.EventRsvp] {
    Calendar.getEventRsvps(rsvps, tenantId, workspaceId, eventId)
  };

  public func listEventRsvps(
    rsvps : RsvpStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    userId : Common.UserId,
  ) : [CalTypes.EventRsvp] {
    Calendar.listEventRsvps(rsvps, tenantId, workspaceId, userId)
  };

  // ── Event Exception API ───────────────────────────────────────────────────────

  public func createEventException(
    exceptions : ExceptionStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : CalTypes.EventExceptionInput,
  ) : ({ #ok : CalTypes.EventException; #err : Text }, ExceptionStore) {
    let (exc, newStore) = Calendar.createEventException(exceptions, tenantId, workspaceId, caller, input);
    (#ok exc, newStore)
  };

  public func getEventException(
    exceptions : ExceptionStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { #ok : CalTypes.EventException; #err : Text } {
    switch (Calendar.getEventException(exceptions, tenantId, workspaceId, id)) {
      case (?e) #ok e;
      case null #err "Event exception not found";
    }
  };

  public func listEventExceptions(
    exceptions : ExceptionStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    eventId : Text,
  ) : [CalTypes.EventException] {
    Calendar.listEventExceptions(exceptions, tenantId, workspaceId, eventId)
  };

  // ── Availability API ──────────────────────────────────────────────────────────

  public func getAvailability(
    events : EventStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    userIds : [Common.UserId],
    date : Text,
    timeZone : Text,
  ) : [CalTypes.AvailabilitySlot] {
    Calendar.getAvailability(events, tenantId, workspaceId, userIds, date, timeZone)
  };

  // ── Project Deadlines API ─────────────────────────────────────────────────────

  public func listProjectDeadlines(
    events : EventStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [CalTypes.Event] {
    Calendar.listProjectDeadlines(events, tenantId, workspaceId)
  };
};
