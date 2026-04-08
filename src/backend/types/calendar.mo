import C "common";

module {
  public type RecurrenceRule = {
    #None;
    #Daily;
    #Weekly;
    #Monthly;
    #Yearly;
  };

  public type EventCategory = {
    #meeting;
    #deadline;
    #pto;
    #internal;
    #external;
    #other;
  };

  public type CalendarType = {
    #personal;
    #team;
    #project;
    #company;
  };

  public type RsvpStatus = {
    #accepted;
    #declined;
    #noResponse;
    #tentative;
  };

  public type ExceptionType = {
    #modified;
    #deleted;
  };

  // ── Core entity types ─────────────────────────────────────────────────────────

  public type CalendarDef = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    name : Text;
    ownerId : C.UserId;
    calendarType : CalendarType;
    color : Text;
    isVisible : Bool;
    projectId : ?Text;
    createdAt : C.Timestamp;
  };

  public type Event = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    title : Text;
    description : Text;
    startTime : C.Timestamp;
    endTime : C.Timestamp;
    recurrence : RecurrenceRule;
    attendeeIds : [C.UserId];
    crossLinks : [C.CrossLink];
    createdBy : C.UserId;
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
    // new fields
    calendarId : Text;
    category : EventCategory;
    categoryColor : Text;
    isRecurringSeries : Bool;
    seriesId : ?Text;
    timeZone : Text;
    rsvpRequired : Bool;
    linkedNoteId : ?Text;
    isProjectDeadline : Bool;
    projectId : ?Text;
  };

  public type EventRsvp = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    eventId : Text;
    userId : C.UserId;
    status : RsvpStatus;
    respondedAt : ?C.Timestamp;
  };

  public type EventException = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    eventId : Text;
    originalDate : Text;
    exceptionType : ExceptionType;
    overrideData : ?EventInput;
    createdAt : C.Timestamp;
  };

  public type AvailabilitySlot = {
    userId : C.UserId;
    date : Text;
    busyPeriods : [(Text, Text)];
    timeZone : Text;
  };

  // ── Input types ───────────────────────────────────────────────────────────────

  public type CalendarDefInput = {
    name : Text;
    calendarType : CalendarType;
    color : Text;
    isVisible : Bool;
    projectId : ?Text;
  };

  public type EventInput = {
    title : Text;
    description : Text;
    startTime : C.Timestamp;
    endTime : C.Timestamp;
    recurrence : RecurrenceRule;
    attendeeIds : [C.UserId];
    crossLinks : [C.CrossLink];
    // new optional fields
    calendarId : ?Text;
    category : ?EventCategory;
    categoryColor : ?Text;
    timeZone : ?Text;
    rsvpRequired : ?Bool;
    linkedNoteId : ?Text;
    isProjectDeadline : ?Bool;
    projectId : ?Text;
  };

  public type EventRsvpInput = {
    eventId : Text;
    status : RsvpStatus;
  };

  public type EventExceptionInput = {
    eventId : Text;
    originalDate : Text;
    exceptionType : ExceptionType;
    overrideData : ?EventInput;
  };
};
