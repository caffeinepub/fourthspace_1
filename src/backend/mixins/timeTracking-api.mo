import Common "../types/common";
import TTTypes "../types/timeTracking";
import TTLib "../lib/timeTracking";

module {

  public func createTimeEntry(
    store : [(Common.EntityId, TTTypes.TimeEntry)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : TTTypes.TimeEntryInput,
  ) : { result : { #ok : TTTypes.TimeEntry; #err : Text }; store : [(Common.EntityId, TTTypes.TimeEntry)] } {
    let (entry, newStore) = TTLib.createTimeEntry(store, tenantId, workspaceId, caller, input);
    { result = #ok entry; store = newStore }
  };

  public func updateTimeEntry(
    store : [(Common.EntityId, TTTypes.TimeEntry)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : TTTypes.TimeEntryInput,
  ) : { result : { #ok : TTTypes.TimeEntry; #err : Text }; store : [(Common.EntityId, TTTypes.TimeEntry)] } {
    let (opt, newStore) = TTLib.updateTimeEntry(store, tenantId, workspaceId, id, caller, input);
    switch opt {
      case (?entry) { { result = #ok entry; store = newStore } };
      case null { { result = #err "Time entry not found"; store } };
    }
  };

  public func deleteTimeEntry(
    store : [(Common.EntityId, TTTypes.TimeEntry)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { result : { #ok : Bool; #err : Text }; store : [(Common.EntityId, TTTypes.TimeEntry)] } {
    let (ok, newStore) = TTLib.deleteTimeEntry(store, tenantId, workspaceId, id, caller);
    if (ok) { { result = #ok true; store = newStore } } else {
      { result = #err "Time entry not found"; store }
    }
  };

  public func getTaskTimeEntries(
    store : [(Common.EntityId, TTTypes.TimeEntry)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    taskId : Common.EntityId,
  ) : [TTTypes.TimeEntry] {
    TTLib.getTaskTimeEntries(store, tenantId, workspaceId, taskId)
  };

  public func getProjectTimeEntries(
    store : [(Common.EntityId, TTTypes.TimeEntry)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    projectId : Common.EntityId,
  ) : [TTTypes.TimeEntry] {
    TTLib.getProjectTimeEntries(store, tenantId, workspaceId, projectId)
  };

  public func getUserTimeEntries(
    store : [(Common.EntityId, TTTypes.TimeEntry)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    userId : Common.UserId,
  ) : [TTTypes.TimeEntry] {
    TTLib.getUserTimeEntries(store, tenantId, workspaceId, userId)
  };

  public func getTimeReport(
    store : [(Common.EntityId, TTTypes.TimeEntry)],
    workspaceId : Common.WorkspaceId,
    tenantId : Common.TenantId,
    filter : TTTypes.TimeReportFilter,
  ) : TTTypes.TimeReport {
    TTLib.getTimeReport(store, workspaceId, tenantId, filter)
  };

  public func getWeeklyTimesheet(
    store : [(Common.EntityId, TTTypes.TimeEntry)],
    workspaceId : Common.WorkspaceId,
    tenantId : Common.TenantId,
    userId : Common.UserId,
    weekStart : Common.Timestamp,
  ) : [TTTypes.DailyTimesheetEntry] {
    TTLib.getWeeklyTimesheet(store, workspaceId, tenantId, userId, weekStart)
  };

  public func exportTimeEntries(
    store : [(Common.EntityId, TTTypes.TimeEntry)],
    workspaceId : Common.WorkspaceId,
    tenantId : Common.TenantId,
    filter : TTTypes.TimeReportFilter,
  ) : Text {
    TTLib.exportTimeEntries(store, workspaceId, tenantId, filter)
  };
};
