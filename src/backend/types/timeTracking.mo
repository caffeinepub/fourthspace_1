import C "common";

module {
  public type TimeEntry = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    projectId : C.EntityId;
    taskId : ?C.EntityId;
    userId : C.UserId;
    startTime : C.Timestamp;
    endTime : ?C.Timestamp;
    durationMinutes : Nat;
    notes : Text;
    billable : Bool;
    createdAt : C.Timestamp;
  };

  public type TimeReport = {
    totalHours : Float;
    billableHours : Float;
    nonBillableHours : Float;
    entries : [TimeEntry];
    byProject : [(C.EntityId, Float)];
    byUser : [(C.UserId, Float)];
  };

  public type TimeReportFilter = {
    projectId : ?C.EntityId;
    userId : ?C.UserId;
    fromDate : ?C.Timestamp;
    toDate : ?C.Timestamp;
    billable : ?Bool;
  };

  public type DailyTimesheetEntry = {
    date : C.Timestamp;
    entries : [TimeEntry];
    totalHours : Float;
  };

  public type TimeEntryInput = {
    projectId : C.EntityId;
    taskId : ?C.EntityId;
    startTime : C.Timestamp;
    endTime : ?C.Timestamp;
    durationMinutes : Nat;
    notes : Text;
    billable : Bool;
  };
};
