import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Types "../types/calendar";
import Common "../types/common";

module {

  // ── Helpers ───────────────────────────────────────────────────────────────────

  func toEventMap(store : [(Common.EntityId, Types.Event)]) : Map.Map<Common.EntityId, Types.Event> {
    Map.fromArray(store)
  };

  func toEventStore(m : Map.Map<Common.EntityId, Types.Event>) : [(Common.EntityId, Types.Event)] {
    m.toArray()
  };

  func toCalMap(store : [(Common.EntityId, Types.CalendarDef)]) : Map.Map<Common.EntityId, Types.CalendarDef> {
    Map.fromArray(store)
  };

  func toCalStore(m : Map.Map<Common.EntityId, Types.CalendarDef>) : [(Common.EntityId, Types.CalendarDef)] {
    m.toArray()
  };

  func toRsvpMap(store : [(Common.EntityId, Types.EventRsvp)]) : Map.Map<Common.EntityId, Types.EventRsvp> {
    Map.fromArray(store)
  };

  func toRsvpStore(m : Map.Map<Common.EntityId, Types.EventRsvp>) : [(Common.EntityId, Types.EventRsvp)] {
    m.toArray()
  };

  func toExcMap(store : [(Common.EntityId, Types.EventException)]) : Map.Map<Common.EntityId, Types.EventException> {
    Map.fromArray(store)
  };

  func toExcStore(m : Map.Map<Common.EntityId, Types.EventException>) : [(Common.EntityId, Types.EventException)] {
    m.toArray()
  };

  func genId(salt : Text) : Common.EntityId {
    let ts = Time.now();
    ts.toText() # "-" # salt
  };

  func hasAttendee(event : Types.Event, userId : Common.UserId) : Bool {
    event.attendeeIds.any(func(id : Common.UserId) : Bool { Principal.equal(id, userId) })
  };

  func resolveCategory(cat : ?Types.EventCategory) : Types.EventCategory {
    switch (cat) { case (?c) c; case null #other }
  };

  func resolveText(t : ?Text, def : Text) : Text {
    switch (t) { case (?v) v; case null def }
  };

  func resolveBool(b : ?Bool, def : Bool) : Bool {
    switch (b) { case (?v) v; case null def }
  };

  // ── Calendar CRUD ─────────────────────────────────────────────────────────────

  public func createCalendar(
    store : [(Common.EntityId, Types.CalendarDef)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : Types.CalendarDefInput,
  ) : (Types.CalendarDef, [(Common.EntityId, Types.CalendarDef)]) {
    let id = genId(caller.toText() # "cal");
    let cal : Types.CalendarDef = {
      id;
      tenantId;
      workspaceId;
      name = input.name;
      ownerId = caller;
      calendarType = input.calendarType;
      color = input.color;
      isVisible = input.isVisible;
      projectId = input.projectId;
      createdAt = Time.now();
    };
    let m = toCalMap(store);
    m.add(id, cal);
    (cal, toCalStore(m))
  };

  public func getCalendar(
    store : [(Common.EntityId, Types.CalendarDef)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : ?Types.CalendarDef {
    let m = toCalMap(store);
    switch (m.get(id)) {
      case (?c) { if (c.tenantId == tenantId and c.workspaceId == workspaceId) ?c else null };
      case null null;
    }
  };

  public func listCalendars(
    store : [(Common.EntityId, Types.CalendarDef)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    ownerId : ?Common.UserId,
  ) : [Types.CalendarDef] {
    let m = toCalMap(store);
    m.values().filter(
      func(c : Types.CalendarDef) : Bool {
        if (c.tenantId != tenantId or c.workspaceId != workspaceId) return false;
        switch (ownerId) {
          case (?uid) Principal.equal(c.ownerId, uid);
          case null true;
        }
      }
    ).toArray()
  };

  public func updateCalendar(
    store : [(Common.EntityId, Types.CalendarDef)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : Types.CalendarDefInput,
  ) : (?Types.CalendarDef, [(Common.EntityId, Types.CalendarDef)]) {
    let m = toCalMap(store);
    switch (m.get(id)) {
      case (?existing) {
        if (existing.tenantId != tenantId or existing.workspaceId != workspaceId) return (null, store);
        let updated : Types.CalendarDef = {
          existing with
          name = input.name;
          calendarType = input.calendarType;
          color = input.color;
          isVisible = input.isVisible;
          projectId = input.projectId;
        };
        m.add(id, updated);
        (?updated, toCalStore(m))
      };
      case null (null, store);
    }
  };

  public func deleteCalendar(
    store : [(Common.EntityId, Types.CalendarDef)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : (Bool, [(Common.EntityId, Types.CalendarDef)]) {
    let m = toCalMap(store);
    switch (m.get(id)) {
      case (?c) {
        if (c.tenantId != tenantId or c.workspaceId != workspaceId) return (false, store);
        m.remove(id);
        (true, toCalStore(m))
      };
      case null (false, store);
    }
  };

  // ── Event CRUD ────────────────────────────────────────────────────────────────

  public func createEvent(
    store : [(Common.EntityId, Types.Event)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : Types.EventInput,
  ) : (Types.Event, [(Common.EntityId, Types.Event)]) {
    let now = Time.now();
    let id = genId(caller.toText() # "ev");
    let isRecurring = input.recurrence != #None;
    // Ensure creator is in attendeeIds
    let attendees : [Common.UserId] = if (input.attendeeIds.any(func(uid : Common.UserId) : Bool { Principal.equal(uid, caller) })) {
      input.attendeeIds
    } else {
      input.attendeeIds.concat([caller])
    };
    let event : Types.Event = {
      id;
      tenantId;
      workspaceId;
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
      calendarId = resolveText(input.calendarId, "");
      category = resolveCategory(input.category);
      categoryColor = resolveText(input.categoryColor, "#6366f1");
      isRecurringSeries = isRecurring;
      seriesId = if (isRecurring) ?id else null;
      timeZone = resolveText(input.timeZone, "UTC");
      rsvpRequired = resolveBool(input.rsvpRequired, false);
      linkedNoteId = input.linkedNoteId;
      isProjectDeadline = resolveBool(input.isProjectDeadline, false);
      projectId = input.projectId;
    };
    let m = toEventMap(store);
    m.add(id, event);
    (event, toEventStore(m))
  };

  public func getEvent(
    store : [(Common.EntityId, Types.Event)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : ?Types.Event {
    let m = toEventMap(store);
    switch (m.get(id)) {
      case (?ev) { if (ev.tenantId == tenantId and ev.workspaceId == workspaceId) ?ev else null };
      case null null;
    }
  };

  public func listEvents(
    store : [(Common.EntityId, Types.Event)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    from : Common.Timestamp,
    to : Common.Timestamp,
  ) : [Types.Event] {
    let m = toEventMap(store);
    m.values().filter(
      func(ev : Types.Event) : Bool {
        ev.tenantId == tenantId and ev.workspaceId == workspaceId and ev.startTime >= from and ev.startTime <= to
      }
    ).toArray()
  };

  /// List events in date range, applying recurring event exceptions:
  /// - #deleted exceptions are filtered out
  /// - #modified exceptions replace the base event data for that occurrence
  public func listEventsWithExceptions(
    store : [(Common.EntityId, Types.Event)],
    excStore : [(Common.EntityId, Types.EventException)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    from : Common.Timestamp,
    to : Common.Timestamp,
  ) : [Types.Event] {
    let m = toEventMap(store);
    let events = m.values().filter(
      func(ev : Types.Event) : Bool {
        ev.tenantId == tenantId and ev.workspaceId == workspaceId and ev.startTime >= from and ev.startTime <= to
      }
    ).toArray();

    // Build a set of (eventId, originalDate) pairs that are deleted, and a map for modified overrides
    let excMap = toExcMap(excStore);
    let deletedExceptions = excMap.values().filter(
      func(e : Types.EventException) : Bool {
        e.tenantId == tenantId and e.workspaceId == workspaceId and e.exceptionType == #deleted
      }
    ).toArray();
    let modifiedExceptions = excMap.values().filter(
      func(e : Types.EventException) : Bool {
        e.tenantId == tenantId and e.workspaceId == workspaceId and e.exceptionType == #modified
      }
    ).toArray();

    events.filterMap<Types.Event, Types.Event>(
      func(ev : Types.Event) : ?Types.Event {
        let evDate = timestampToDate(ev.startTime);
        // Check if this occurrence is deleted
        let isDeleted = deletedExceptions.any(
          func(exc : Types.EventException) : Bool {
            exc.eventId == ev.id and exc.originalDate == evDate
          }
        );
        if (isDeleted) { null } else {
          // Check if this occurrence has a modified override
          let maybeModified = modifiedExceptions.find(
            func(exc : Types.EventException) : Bool {
              exc.eventId == ev.id and exc.originalDate == evDate
            }
          );
          switch (maybeModified) {
            case null ?ev;
            case (?exc) {
              // Apply override data if present, otherwise return original
              switch (exc.overrideData) {
                case null ?ev;
                case (?override) {
                  ?{
                    ev with
                    title = override.title;
                    description = override.description;
                    startTime = override.startTime;
                    endTime = override.endTime;
                    attendeeIds = override.attendeeIds;
                  }
                };
              }
            };
          }
        }
      }
    )
  };

  public func updateEvent(
    store : [(Common.EntityId, Types.Event)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : Types.EventInput,
  ) : (?Types.Event, [(Common.EntityId, Types.Event)]) {
    let m = toEventMap(store);
    switch (m.get(id)) {
      case (?existing) {
        if (existing.tenantId != tenantId or existing.workspaceId != workspaceId) return (null, store);
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
          calendarId = resolveText(input.calendarId, existing.calendarId);
          category = resolveCategory(input.category);
          categoryColor = resolveText(input.categoryColor, existing.categoryColor);
          timeZone = resolveText(input.timeZone, existing.timeZone);
          rsvpRequired = resolveBool(input.rsvpRequired, existing.rsvpRequired);
          linkedNoteId = switch (input.linkedNoteId) { case (?v) ?v; case null existing.linkedNoteId };
          isProjectDeadline = resolveBool(input.isProjectDeadline, existing.isProjectDeadline);
          projectId = switch (input.projectId) { case (?v) ?v; case null existing.projectId };
        };
        m.add(id, updated);
        (?updated, toEventStore(m))
      };
      case null (null, store);
    }
  };

  public func deleteEvent(
    store : [(Common.EntityId, Types.Event)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : (Bool, [(Common.EntityId, Types.Event)]) {
    let m = toEventMap(store);
    switch (m.get(id)) {
      case (?ev) {
        if (ev.tenantId != tenantId or ev.workspaceId != workspaceId) return (false, store);
        m.remove(id);
        (true, toEventStore(m))
      };
      case null (false, store);
    }
  };

  public func listMyEvents(
    store : [(Common.EntityId, Types.Event)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    userId : Common.UserId,
  ) : [Types.Event] {
    let m = toEventMap(store);
    m.values().filter(
      func(ev : Types.Event) : Bool {
        ev.tenantId == tenantId and ev.workspaceId == workspaceId and hasAttendee(ev, userId)
      }
    ).toArray()
  };

  // ── RSVP ─────────────────────────────────────────────────────────────────────

  public func respondToEvent(
    store : [(Common.EntityId, Types.EventRsvp)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : Types.EventRsvpInput,
  ) : (Types.EventRsvp, [(Common.EntityId, Types.EventRsvp)]) {
    let now = Time.now();
    let m = toRsvpMap(store);
    // Upsert: find existing rsvp for same event+user
    var existingId : ?Common.EntityId = null;
    for ((k, v) in m.entries()) {
      if (v.eventId == input.eventId and Principal.equal(v.userId, caller) and v.tenantId == tenantId and v.workspaceId == workspaceId) {
        existingId := ?k;
      };
    };
    let id = switch (existingId) {
      case (?eid) eid;
      case null genId(caller.toText() # "rsvp");
    };
    let rsvp : Types.EventRsvp = {
      id;
      tenantId;
      workspaceId;
      eventId = input.eventId;
      userId = caller;
      status = input.status;
      respondedAt = ?now;
    };
    m.add(id, rsvp);
    (rsvp, toRsvpStore(m))
  };

  public func getEventRsvps(
    store : [(Common.EntityId, Types.EventRsvp)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    eventId : Text,
  ) : [Types.EventRsvp] {
    let m = toRsvpMap(store);
    m.values().filter(
      func(r : Types.EventRsvp) : Bool {
        r.tenantId == tenantId and r.workspaceId == workspaceId and r.eventId == eventId
      }
    ).toArray()
  };

  public func listEventRsvps(
    store : [(Common.EntityId, Types.EventRsvp)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    userId : Common.UserId,
  ) : [Types.EventRsvp] {
    let m = toRsvpMap(store);
    m.values().filter(
      func(r : Types.EventRsvp) : Bool {
        r.tenantId == tenantId and r.workspaceId == workspaceId and Principal.equal(r.userId, userId)
      }
    ).toArray()
  };

  // ── Event Exceptions ──────────────────────────────────────────────────────────

  public func createEventException(
    store : [(Common.EntityId, Types.EventException)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : Types.EventExceptionInput,
  ) : (Types.EventException, [(Common.EntityId, Types.EventException)]) {
    let id = genId(caller.toText() # "exc");
    let exc : Types.EventException = {
      id;
      tenantId;
      workspaceId;
      eventId = input.eventId;
      originalDate = input.originalDate;
      exceptionType = input.exceptionType;
      overrideData = input.overrideData;
      createdAt = Time.now();
    };
    let m = toExcMap(store);
    m.add(id, exc);
    (exc, toExcStore(m))
  };

  public func getEventException(
    store : [(Common.EntityId, Types.EventException)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : ?Types.EventException {
    let m = toExcMap(store);
    switch (m.get(id)) {
      case (?e) { if (e.tenantId == tenantId and e.workspaceId == workspaceId) ?e else null };
      case null null;
    }
  };

  public func listEventExceptions(
    store : [(Common.EntityId, Types.EventException)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    eventId : Text,
  ) : [Types.EventException] {
    let m = toExcMap(store);
    m.values().filter(
      func(e : Types.EventException) : Bool {
        e.tenantId == tenantId and e.workspaceId == workspaceId and e.eventId == eventId
      }
    ).toArray()
  };

  // ── Availability ──────────────────────────────────────────────────────────────

  // Converts a Timestamp (Int nanoseconds) to a simple date string "YYYY-MM-DD"
  // using a simple approximation (days since epoch). Used for date matching.
  func timestampToDate(ts : Common.Timestamp) : Text {
    // ts is nanoseconds; seconds since unix epoch
    let secs : Int = ts / 1_000_000_000;
    let days : Int = secs / 86400;
    // Gregorian calendar approximation
    let z : Int = days + 719468;
    let era : Int = (if (z >= 0) z else z - 146096) / 146097;
    let doe : Int = z - era * 146097;
    let yoe : Int = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y : Int = yoe + era * 400;
    let doy : Int = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp : Int = (5 * doy + 2) / 153;
    let d : Int = doy - (153 * mp + 2) / 5 + 1;
    let m : Int = mp + (if (mp < 10) 3 else -9);
    let yr : Int = y + (if (m <= 2) 1 else 0);
    // pad helpers
    let ys = yr.toText();
    let ms = if (m < 10) "0" # m.toText() else m.toText();
    let ds = if (d < 10) "0" # d.toText() else d.toText();
    ys # "-" # ms # "-" # ds
  };

  // Returns HH:MM text from nanosecond timestamp
  func timestampToTimeText(ts : Common.Timestamp) : Text {
    let secs : Int = ts / 1_000_000_000;
    let hour : Int = (secs % 86400) / 3600;
    let minute : Int = (secs % 3600) / 60;
    let hs = if (hour < 10) "0" # hour.toText() else hour.toText();
    let ms = if (minute < 10) "0" # minute.toText() else minute.toText();
    hs # ":" # ms
  };

  public func getAvailability(
    eventStore : [(Common.EntityId, Types.Event)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    userIds : [Common.UserId],
    date : Text,
    timeZone : Text,
  ) : [Types.AvailabilitySlot] {
    let m = toEventMap(eventStore);
    // For each userId, collect events on the requested date where they are an attendee
    userIds.map<Common.UserId, Types.AvailabilitySlot>(
      func(userId : Common.UserId) : Types.AvailabilitySlot {
        let busyPeriods : [(Text, Text)] = m.values().filter(
          func(ev : Types.Event) : Bool {
            ev.tenantId == tenantId and
            ev.workspaceId == workspaceId and
            hasAttendee(ev, userId) and
            timestampToDate(ev.startTime) == date
          }
        ).map<Types.Event, (Text, Text)>(
          func(ev : Types.Event) : (Text, Text) {
            (timestampToTimeText(ev.startTime), timestampToTimeText(ev.endTime))
          }
        ).toArray();
        {
          userId;
          date;
          busyPeriods;
          timeZone;
        }
      }
    )
  };

  // ── Project Deadlines ─────────────────────────────────────────────────────────

  public func listProjectDeadlines(
    store : [(Common.EntityId, Types.Event)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.Event] {
    let m = toEventMap(store);
    let deadlines = m.values().filter(
      func(ev : Types.Event) : Bool {
        ev.tenantId == tenantId and ev.workspaceId == workspaceId and ev.isProjectDeadline
      }
    ).toArray();
    // Sort by startTime ascending
    deadlines.sort(func(a : Types.Event, b : Types.Event) : { #less; #equal; #greater } {
      Int.compare(a.startTime, b.startTime)
    })
  };
};
