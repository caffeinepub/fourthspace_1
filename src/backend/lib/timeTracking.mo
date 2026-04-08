import Common "../types/common";
import TTTypes "../types/timeTracking";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

module {

  func genId(prefix : Text, now : Int) : Common.EntityId {
    prefix # "-" # debug_show(now)
  };

  func calcDuration(startTime : Common.Timestamp, endTime : Common.Timestamp) : Nat {
    let diffNs : Int = endTime - startTime;
    if (diffNs <= 0) { 0 } else {
      Int.abs(diffNs / 60_000_000_000)
    }
  };

  func minutesToHours(minutes : Nat) : Float {
    minutes.toFloat() / 60.0
  };

  // One day in nanoseconds
  let oneDayNs : Int = 86_400_000_000_000;

  public func createTimeEntry(
    store : [(Common.EntityId, TTTypes.TimeEntry)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : TTTypes.TimeEntryInput,
  ) : (TTTypes.TimeEntry, [(Common.EntityId, TTTypes.TimeEntry)]) {
    let now = Time.now();
    let id = genId("te", now);
    let duration = switch (input.endTime) {
      case null input.durationMinutes;
      case (?et) {
        let calc = calcDuration(input.startTime, et);
        if (calc > 0) { calc } else { input.durationMinutes }
      };
    };
    let entry : TTTypes.TimeEntry = {
      id;
      tenantId;
      workspaceId;
      projectId = input.projectId;
      taskId = input.taskId;
      userId = caller;
      startTime = input.startTime;
      endTime = input.endTime;
      durationMinutes = duration;
      notes = input.notes;
      billable = input.billable;
      createdAt = now;
    };
    (entry, store.concat([(id, entry)]))
  };

  public func updateTimeEntry(
    store : [(Common.EntityId, TTTypes.TimeEntry)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : TTTypes.TimeEntryInput,
  ) : (?TTTypes.TimeEntry, [(Common.EntityId, TTTypes.TimeEntry)]) {
    let found = store.find(
      func((k, e)) { k == id and e.tenantId == tenantId and e.workspaceId == workspaceId and e.userId == caller },
    );
    switch found {
      case null (null, store);
      case (?(_, prev)) {
        let duration = switch (input.endTime) {
          case null input.durationMinutes;
          case (?et) {
            let calc = calcDuration(input.startTime, et);
            if (calc > 0) { calc } else { input.durationMinutes }
          };
        };
        let updated : TTTypes.TimeEntry = {
          id;
          tenantId;
          workspaceId;
          projectId = input.projectId;
          taskId = input.taskId;
          userId = caller;
          startTime = input.startTime;
          endTime = input.endTime;
          durationMinutes = duration;
          notes = input.notes;
          billable = input.billable;
          createdAt = prev.createdAt;
        };
        let newStore = store.map(
          func((k, v)) { if (k == id) { (k, updated) } else { (k, v) } },
        );
        (?updated, newStore)
      };
    }
  };

  public func deleteTimeEntry(
    store : [(Common.EntityId, TTTypes.TimeEntry)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : (Bool, [(Common.EntityId, TTTypes.TimeEntry)]) {
    let found = store.find(
      func((k, e)) { k == id and e.tenantId == tenantId and e.workspaceId == workspaceId and e.userId == caller },
    );
    switch found {
      case null (false, store);
      case (?(_, _)) {
        (true, store.filter<(Common.EntityId, TTTypes.TimeEntry)>(func((k, _)) { k != id }))
      };
    }
  };

  public func getTaskTimeEntries(
    store : [(Common.EntityId, TTTypes.TimeEntry)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    taskId : Common.EntityId,
  ) : [TTTypes.TimeEntry] {
    store.filter(
      func((_, e)) {
        e.tenantId == tenantId and e.workspaceId == workspaceId and (switch (e.taskId) { case (?t) t == taskId; case null false })
      },
    ).map(func((_, e)) { e })
  };

  public func getProjectTimeEntries(
    store : [(Common.EntityId, TTTypes.TimeEntry)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    projectId : Common.EntityId,
  ) : [TTTypes.TimeEntry] {
    store.filter(
      func((_, e)) { e.tenantId == tenantId and e.workspaceId == workspaceId and e.projectId == projectId },
    ).map(func((_, e)) { e })
  };

  public func getUserTimeEntries(
    store : [(Common.EntityId, TTTypes.TimeEntry)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    userId : Common.UserId,
  ) : [TTTypes.TimeEntry] {
    store.filter(
      func((_, e)) { e.tenantId == tenantId and e.workspaceId == workspaceId and e.userId == userId },
    ).map(func((_, e)) { e })
  };

  public func getTimeReport(
    store : [(Common.EntityId, TTTypes.TimeEntry)],
    workspaceId : Common.WorkspaceId,
    tenantId : Common.TenantId,
    filter : TTTypes.TimeReportFilter,
  ) : TTTypes.TimeReport {
    // Apply all filters
    let filtered = store.filter(func((_, e)) {
      e.tenantId == tenantId and
      e.workspaceId == workspaceId and
      (switch (filter.projectId) { case (?pid) e.projectId == pid; case null true }) and
      (switch (filter.userId) { case (?uid) e.userId == uid; case null true }) and
      (switch (filter.fromDate) { case (?from) e.startTime >= from; case null true }) and
      (switch (filter.toDate) { case (?to) e.startTime <= to; case null true }) and
      (switch (filter.billable) { case (?b) e.billable == b; case null true })
    }).map(func((_, e)) { e });

    var totalMinutes : Nat = 0;
    var billableMinutes : Nat = 0;

    // Accumulate totals
    for (e in filtered.values()) {
      totalMinutes += e.durationMinutes;
      if (e.billable) { billableMinutes += e.durationMinutes };
    };

    let nonBillableMinutes : Nat = if (totalMinutes >= billableMinutes) { totalMinutes - billableMinutes } else { 0 };

    // Build byProject map: projectId -> total minutes
    let projectMap = Map.empty<Common.EntityId, Nat>();
    for (e in filtered.values()) {
      let prev = switch (projectMap.get(e.projectId)) {
        case (?v) v;
        case null 0;
      };
      projectMap.add(e.projectId, prev + e.durationMinutes);
    };

    // Build byUser map: userId -> total minutes
    let userMap = Map.empty<Common.UserId, Nat>();
    for (e in filtered.values()) {
      let prev = switch (userMap.get(e.userId)) {
        case (?v) v;
        case null 0;
      };
      userMap.add(e.userId, prev + e.durationMinutes);
    };

    let byProject : [(Common.EntityId, Float)] = do {
      let result = List.empty<(Common.EntityId, Float)>();
      for ((pid, mins) in projectMap.entries()) {
        result.add((pid, minutesToHours(mins)));
      };
      result.toArray()
    };

    let byUser : [(Common.UserId, Float)] = do {
      let result = List.empty<(Common.UserId, Float)>();
      for ((uid, mins) in userMap.entries()) {
        result.add((uid, minutesToHours(mins)));
      };
      result.toArray()
    };

    {
      totalHours = minutesToHours(totalMinutes);
      billableHours = minutesToHours(billableMinutes);
      nonBillableHours = minutesToHours(nonBillableMinutes);
      entries = filtered;
      byProject;
      byUser;
    }
  };

  public func getWeeklyTimesheet(
    store : [(Common.EntityId, TTTypes.TimeEntry)],
    workspaceId : Common.WorkspaceId,
    tenantId : Common.TenantId,
    userId : Common.UserId,
    weekStart : Common.Timestamp,
  ) : [TTTypes.DailyTimesheetEntry] {
    // Build 7-day array
    let days = Array.tabulate(7, func(i : Nat) : TTTypes.DailyTimesheetEntry {
      let dayStart : Int = weekStart + (oneDayNs * i);
      let dayEnd : Int = dayStart + oneDayNs;
      let dayEntries = store.filter(func((_, e)) {
        e.tenantId == tenantId and
        e.workspaceId == workspaceId and
        e.userId == userId and
        e.startTime >= dayStart and
        e.startTime < dayEnd
      }).map(func((_, e)) { e });

      var totalMins : Nat = 0;
      for (e in dayEntries.values()) {
        totalMins += e.durationMinutes;
      };
      {
        date = dayStart;
        entries = dayEntries;
        totalHours = minutesToHours(totalMins);
      }
    });
    days
  };

  public func exportTimeEntries(
    store : [(Common.EntityId, TTTypes.TimeEntry)],
    workspaceId : Common.WorkspaceId,
    tenantId : Common.TenantId,
    filter : TTTypes.TimeReportFilter,
  ) : Text {
    let filtered = store.filter(func((_, e)) {
      e.tenantId == tenantId and
      e.workspaceId == workspaceId and
      (switch (filter.projectId) { case (?pid) e.projectId == pid; case null true }) and
      (switch (filter.userId) { case (?uid) e.userId == uid; case null true }) and
      (switch (filter.fromDate) { case (?from) e.startTime >= from; case null true }) and
      (switch (filter.toDate) { case (?to) e.startTime <= to; case null true }) and
      (switch (filter.billable) { case (?b) e.billable == b; case null true })
    }).map(func((_, e)) { e });

    let header = "date,user,project,task,hours,billable,description\n";
    let rows = List.empty<Text>();
    for (e in filtered.values()) {
      let dateMs = e.startTime / 1_000_000;
      let dateStr = dateMs.toText();
      let userStr = e.userId.toText();
      let projectStr = e.projectId;
      let taskStr = switch (e.taskId) { case (?t) t; case null "" };
      let hoursStr = debug_show(minutesToHours(e.durationMinutes));
      let billableStr = if (e.billable) { "true" } else { "false" };
      let descStr = e.notes;
      rows.add(dateStr # "," # userStr # "," # projectStr # "," # taskStr # "," # hoursStr # "," # billableStr # "," # descStr # "\n");
    };
    let body = rows.foldLeft("", func(acc, row) { acc # row });
    header # body
  };
};
