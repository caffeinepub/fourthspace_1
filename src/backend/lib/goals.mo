import Common "../types/common";
import GTypes "../types/goals";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Float "mo:core/Float";

module {

  func genId(prefix : Text, now : Int) : Common.EntityId {
    prefix # "-" # debug_show(now)
  };

  // --- Goals ---

  public func createGoal(
    store : [(Common.EntityId, GTypes.Goal)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : GTypes.GoalInput,
  ) : (GTypes.Goal, [(Common.EntityId, GTypes.Goal)]) {
    let now = Time.now();
    let id = genId("goal", now);
    let goal : GTypes.Goal = {
      id;
      title = input.title;
      description = input.description;
      ownerId = caller;
      contributorIds = input.contributorIds;
      status = #Active;
      startDate = input.startDate;
      endDate = input.endDate;
      period = input.period;
      progress = 0.0;
      keyResults = [];
      isPublic = false;
      workspaceId;
      tenantId;
      createdAt = now;
      updatedAt = now;
    };
    (goal, store.concat([(id, goal)]))
  };

  public func getGoal(
    store : [(Common.EntityId, GTypes.Goal)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : ?GTypes.Goal {
    switch (store.find(func((k, g)) { k == id and g.tenantId == tenantId and g.workspaceId == workspaceId })) {
      case (?(_, g)) ?g;
      case null null;
    }
  };

  public func listGoals(
    store : [(Common.EntityId, GTypes.Goal)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [GTypes.Goal] {
    store.filter(func((_, g)) { g.tenantId == tenantId and g.workspaceId == workspaceId })
      .map(func((_, g)) { g })
  };

  public func updateGoal(
    store : [(Common.EntityId, GTypes.Goal)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : GTypes.GoalInput,
    status : GTypes.GoalStatus,
  ) : (?GTypes.Goal, [(Common.EntityId, GTypes.Goal)]) {
    switch (store.find(func((k, g)) { k == id and g.tenantId == tenantId and g.workspaceId == workspaceId })) {
      case null (null, store);
      case (?(_, prev)) {
        let now = Time.now();
        let updated : GTypes.Goal = { prev with
          title = input.title;
          description = input.description;
          contributorIds = input.contributorIds;
          startDate = input.startDate;
          endDate = input.endDate;
          period = input.period;
          status;
          updatedAt = now;
        };
        let newStore = store.map(func((k, v)) { if (k == id) { (k, updated) } else { (k, v) } });
        (?updated, newStore)
      };
    }
  };

  public func deleteGoal(
    store : [(Common.EntityId, GTypes.Goal)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : (Bool, [(Common.EntityId, GTypes.Goal)]) {
    switch (store.find(func((k, g)) { k == id and g.tenantId == tenantId and g.workspaceId == workspaceId })) {
      case null (false, store);
      case _ (true, store.filter(func((k, _)) { k != id }));
    }
  };

  // --- Key Results ---

  public func addKeyResult(
    goalStore : [(Common.EntityId, GTypes.Goal)],
    krStore : [(Common.EntityId, GTypes.KeyResult)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : GTypes.KeyResultInput,
  ) : (?GTypes.KeyResult, [(Common.EntityId, GTypes.Goal)], [(Common.EntityId, GTypes.KeyResult)]) {
    // Verify goal exists
    switch (goalStore.find(func((k, g)) { k == input.goalId and g.tenantId == tenantId and g.workspaceId == workspaceId })) {
      case null (null, goalStore, krStore);
      case (?(_, goal)) {
        let now = Time.now();
        let id = genId("kr", now);
        let kr : GTypes.KeyResult = {
          id;
          goalId = input.goalId;
          title = input.title;
          description = input.description;
          targetValue = input.targetValue;
          currentValue = 0.0;
          unit = input.unit;
          status = #OnTrack;
          linkedTaskIds = [];
          workspaceId;
          tenantId;
          createdAt = now;
          updatedAt = now;
        };
        let newKrStore = krStore.concat([(id, kr)]);
        // Append kr id to goal's keyResults list
        let updatedGoal : GTypes.Goal = { goal with
          keyResults = goal.keyResults.concat([id]);
          updatedAt = now;
        };
        let newGoalStore = goalStore.map(func((k, v)) {
          if (k == input.goalId) { (k, updatedGoal) } else { (k, v) }
        });
        (?kr, newGoalStore, newKrStore)
      };
    }
  };

  public func updateKeyResult(
    goalStore : [(Common.EntityId, GTypes.Goal)],
    krStore : [(Common.EntityId, GTypes.KeyResult)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    krId : Common.EntityId,
    currentValue : Float,
    status : GTypes.KRStatus,
  ) : (?GTypes.KeyResult, [(Common.EntityId, GTypes.Goal)], [(Common.EntityId, GTypes.KeyResult)]) {
    switch (krStore.find(func((k, kr)) { k == krId and kr.tenantId == tenantId and kr.workspaceId == workspaceId })) {
      case null (null, goalStore, krStore);
      case (?(_, prev)) {
        let now = Time.now();
        let updated : GTypes.KeyResult = { prev with
          currentValue;
          status;
          updatedAt = now;
        };
        let newKrStore = krStore.map(func((k, v)) { if (k == krId) { (k, updated) } else { (k, v) } });
        // Recalculate goal progress
        let newGoalStore = recalcGoalProgress(goalStore, newKrStore, prev.goalId, now);
        (?updated, newGoalStore, newKrStore)
      };
    }
  };

  public func deleteKeyResult(
    goalStore : [(Common.EntityId, GTypes.Goal)],
    krStore : [(Common.EntityId, GTypes.KeyResult)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    krId : Common.EntityId,
  ) : (Bool, [(Common.EntityId, GTypes.Goal)], [(Common.EntityId, GTypes.KeyResult)]) {
    switch (krStore.find(func((k, kr)) { k == krId and kr.tenantId == tenantId and kr.workspaceId == workspaceId })) {
      case null (false, goalStore, krStore);
      case (?(_, kr)) {
        let newKrStore = krStore.filter(func((k, _)) { k != krId });
        // Remove kr from goal's keyResults list
        let newGoalStore = goalStore.map(func((gk, g)) {
          if (gk == kr.goalId) {
            let newKrs = g.keyResults.filter(func(kid) { kid != krId });
            (gk, { g with keyResults = newKrs; updatedAt = Time.now() })
          } else { (gk, g) }
        });
        (true, newGoalStore, newKrStore)
      };
    }
  };

  // Helper: recalculate goal progress from its KRs
  func recalcGoalProgress(
    goalStore : [(Common.EntityId, GTypes.Goal)],
    krStore : [(Common.EntityId, GTypes.KeyResult)],
    goalId : Common.EntityId,
    now : Int,
  ) : [(Common.EntityId, GTypes.Goal)] {
    goalStore.map(func((gk, g)) {
      if (gk == goalId) {
        let goalKrs = krStore.filter(func((_, kr)) { kr.goalId == goalId }).map(func((_, kr)) { kr });
        let progress = calculateGoalProgress(goalKrs);
        (gk, { g with progress; updatedAt = now })
      } else { (gk, g) }
    })
  };

  public func calculateGoalProgress(krs : [GTypes.KeyResult]) : Float {
    if (krs.size() == 0) { return 0.0 };
    var total : Float = 0.0;
    for (kr in krs.values()) {
      if (kr.targetValue > 0.0) {
        let pct = (kr.currentValue / kr.targetValue) * 100.0;
        total += if (pct > 100.0) { 100.0 } else { pct };
      } else {
        total += 0.0;
      };
    };
    total / krs.size().toFloat()
  };

  // --- Check-ins ---

  public func recordCheckIn(
    goalStore : [(Common.EntityId, GTypes.Goal)],
    krStore : [(Common.EntityId, GTypes.KeyResult)],
    checkInStore : [(Common.EntityId, GTypes.GoalCheckIn)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : GTypes.CheckInInput,
  ) : (?GTypes.GoalCheckIn, [(Common.EntityId, GTypes.Goal)], [(Common.EntityId, GTypes.KeyResult)], [(Common.EntityId, GTypes.GoalCheckIn)]) {
    let now = Time.now();
    let id = genId("ci", now);

    // Determine previousValue from KR if krId provided
    let previousValue : Float = switch (input.krId) {
      case null 0.0;
      case (?kid) {
        switch (krStore.find(func((k, _)) { k == kid })) {
          case (?(_, kr)) kr.currentValue;
          case null 0.0;
        }
      };
    };

    let checkIn : GTypes.GoalCheckIn = {
      id;
      goalId = input.goalId;
      krId = input.krId;
      userId = caller;
      previousValue;
      newValue = input.newValue;
      note = input.note;
      timestamp = now;
      workspaceId;
      tenantId;
    };

    let newCheckInStore = checkInStore.concat([(id, checkIn)]);

    // Update KR current value if krId is given
    let (newKrStore, newGoalStore) = switch (input.krId) {
      case null (krStore, goalStore);
      case (?kid) {
        switch (krStore.find(func((k, _)) { k == kid })) {
          case null (krStore, goalStore);
          case (?(_, kr)) {
            let newStatus : GTypes.KRStatus = if (input.newValue >= kr.targetValue) { #Completed } else { kr.status };
            let updatedKr : GTypes.KeyResult = { kr with
              currentValue = input.newValue;
              status = newStatus;
              updatedAt = now;
            };
            let updKrStore = krStore.map(func((k, v)) { if (k == kid) { (k, updatedKr) } else { (k, v) } });
            let updGoalStore = recalcGoalProgress(goalStore, updKrStore, input.goalId, now);
            (updKrStore, updGoalStore)
          };
        }
      };
    };

    (?checkIn, newGoalStore, newKrStore, newCheckInStore)
  };

  public func listCheckIns(
    store : [(Common.EntityId, GTypes.GoalCheckIn)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    goalId : Common.EntityId,
  ) : [GTypes.GoalCheckIn] {
    store.filter(func((_, ci)) {
      ci.tenantId == tenantId and ci.workspaceId == workspaceId and ci.goalId == goalId
    }).map(func((_, ci)) { ci })
  };

  // --- Task linking ---

  public func linkTaskToKR(
    krStore : [(Common.EntityId, GTypes.KeyResult)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    krId : Common.EntityId,
    taskId : Common.EntityId,
  ) : (?GTypes.KeyResult, [(Common.EntityId, GTypes.KeyResult)]) {
    switch (krStore.find(func((k, kr)) { k == krId and kr.tenantId == tenantId and kr.workspaceId == workspaceId })) {
      case null (null, krStore);
      case (?(_, kr)) {
        // Avoid duplicates
        if (kr.linkedTaskIds.find(func(t) { t == taskId }) != null) {
          (?kr, krStore)
        } else {
          let now = Time.now();
          let updated : GTypes.KeyResult = { kr with
            linkedTaskIds = kr.linkedTaskIds.concat([taskId]);
            updatedAt = now;
          };
          let newStore = krStore.map(func((k, v)) { if (k == krId) { (k, updated) } else { (k, v) } });
          (?updated, newStore)
        }
      };
    }
  };

  public func unlinkTaskFromKR(
    krStore : [(Common.EntityId, GTypes.KeyResult)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    krId : Common.EntityId,
    taskId : Common.EntityId,
  ) : (?GTypes.KeyResult, [(Common.EntityId, GTypes.KeyResult)]) {
    switch (krStore.find(func((k, kr)) { k == krId and kr.tenantId == tenantId and kr.workspaceId == workspaceId })) {
      case null (null, krStore);
      case (?(_, kr)) {
        let now = Time.now();
        let updated : GTypes.KeyResult = { kr with
          linkedTaskIds = kr.linkedTaskIds.filter(func(t) { t != taskId });
          updatedAt = now;
        };
        let newStore = krStore.map(func((k, v)) { if (k == krId) { (k, updated) } else { (k, v) } });
        (?updated, newStore)
      };
    }
  };

  // --- Public Goals ---

  /// Look up workspaceId from a share token; returns null if not found
  public func workspaceIdFromToken(
    tokenStore : [(Text, Text)],
    shareToken : Text,
  ) : ?Text {
    switch (tokenStore.find(func((t, _)) { t == shareToken })) {
      case (?(_, wsId)) ?wsId;
      case null null;
    }
  };

  /// Build a PublicKeyResult from a full KeyResult
  public func toPublicKeyResult(kr : GTypes.KeyResult) : GTypes.PublicKeyResult {
    {
      id = kr.id;
      title = kr.title;
      description = kr.description;
      targetValue = kr.targetValue;
      currentValue = kr.currentValue;
      unit = kr.unit;
      status = kr.status;
    }
  };

  /// Return all public goals for a workspace, enriched with their KRs and check-in count
  public func getPublicGoals(
    goalStore : [(Common.EntityId, GTypes.Goal)],
    krStore : [(Common.EntityId, GTypes.KeyResult)],
    checkInStore : [(Common.EntityId, GTypes.GoalCheckIn)],
    workspaceId : Text,
  ) : [GTypes.PublicGoal] {
    let publicGoals = goalStore.filter(func((_, g)) {
      g.workspaceId == workspaceId and g.isPublic
    });
    publicGoals.map(func((_, g)) {
      let goalKrs = krStore
        .filter(func((_, kr)) { kr.goalId == g.id })
        .map(func((_, kr)) { toPublicKeyResult(kr) });
      let checkInCount = checkInStore
        .filter(func((_, ci)) { ci.goalId == g.id })
        .size();
      let pub : GTypes.PublicGoal = {
        id = g.id;
        title = g.title;
        description = g.description;
        period = g.period;
        status = g.status;
        progress = g.progress;
        startDate = g.startDate;
        endDate = g.endDate;
        keyResults = goalKrs;
        checkInCount;
      };
      pub
    })
  };

  /// Flip isPublic on a goal; returns updated goal or null if not found
  public func toggleGoalPublic(
    store : [(Common.EntityId, GTypes.Goal)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    goalId : Common.EntityId,
  ) : (?GTypes.Goal, [(Common.EntityId, GTypes.Goal)]) {
    switch (store.find(func((k, g)) { k == goalId and g.tenantId == tenantId and g.workspaceId == workspaceId })) {
      case null (null, store);
      case (?(_, prev)) {
        let now = Time.now();
        let updated : GTypes.Goal = { prev with isPublic = not prev.isPublic; updatedAt = now };
        let newStore = store.map(func((k, v)) { if (k == goalId) { (k, updated) } else { (k, v) } });
        (?updated, newStore)
      };
    }
  };

  /// Return the existing share token for a workspace, or null if none exists
  public func getShareToken(
    tokenStore : [(Text, Text)],
    workspaceId : Text,
  ) : ?Text {
    switch (tokenStore.find(func((_, wsId)) { wsId == workspaceId })) {
      case (?(token, _)) ?token;
      case null null;
    }
  };

  /// Generate a new share token for a workspace (simple deterministic token from time + workspaceId)
  public func generateShareToken(workspaceId : Text, now : Int) : Text {
    "shr-" # workspaceId # "-" # debug_show(now)
  };

  /// Upsert a share token for workspaceId; replaces existing entry if present
  public func upsertShareToken(
    tokenStore : [(Text, Text)],
    workspaceId : Text,
    token : Text,
  ) : [(Text, Text)] {
    // Remove old entry for this workspaceId if any
    let filtered = tokenStore.filter(func((_, wsId)) { wsId != workspaceId });
    filtered.concat([(token, workspaceId)])
  };
};
