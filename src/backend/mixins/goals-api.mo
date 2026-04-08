import Common "../types/common";
import GTypes "../types/goals";
import GLib "../lib/goals";

module {

  public func createGoal(
    goalStore : [(Common.EntityId, GTypes.Goal)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : GTypes.GoalInput,
  ) : { result : { #ok : GTypes.Goal; #err : Text }; store : [(Common.EntityId, GTypes.Goal)] } {
    let (goal, newStore) = GLib.createGoal(goalStore, tenantId, workspaceId, caller, input);
    { result = #ok goal; store = newStore }
  };

  public func getGoal(
    goalStore : [(Common.EntityId, GTypes.Goal)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { #ok : GTypes.Goal; #err : Text } {
    switch (GLib.getGoal(goalStore, tenantId, workspaceId, id)) {
      case (?g) #ok g;
      case null #err "Goal not found";
    }
  };

  public func listGoals(
    goalStore : [(Common.EntityId, GTypes.Goal)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [GTypes.Goal] {
    GLib.listGoals(goalStore, tenantId, workspaceId)
  };

  public func updateGoal(
    goalStore : [(Common.EntityId, GTypes.Goal)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : GTypes.GoalInput,
    status : GTypes.GoalStatus,
  ) : { result : { #ok : GTypes.Goal; #err : Text }; store : [(Common.EntityId, GTypes.Goal)] } {
    let (opt, newStore) = GLib.updateGoal(goalStore, tenantId, workspaceId, id, caller, input, status);
    switch opt {
      case (?g) { { result = #ok g; store = newStore } };
      case null { { result = #err "Goal not found"; store = goalStore } };
    }
  };

  public func deleteGoal(
    goalStore : [(Common.EntityId, GTypes.Goal)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { result : { #ok : Bool; #err : Text }; store : [(Common.EntityId, GTypes.Goal)] } {
    let (ok, newStore) = GLib.deleteGoal(goalStore, tenantId, workspaceId, id);
    if (ok) { { result = #ok true; store = newStore } } else {
      { result = #err "Goal not found"; store = goalStore }
    }
  };

  public func addKeyResult(
    goalStore : [(Common.EntityId, GTypes.Goal)],
    krStore : [(Common.EntityId, GTypes.KeyResult)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : GTypes.KeyResultInput,
  ) : {
    result : { #ok : GTypes.KeyResult; #err : Text };
    goalStore : [(Common.EntityId, GTypes.Goal)];
    krStore : [(Common.EntityId, GTypes.KeyResult)];
  } {
    let (opt, newGoalStore, newKrStore) = GLib.addKeyResult(goalStore, krStore, tenantId, workspaceId, input);
    switch opt {
      case (?kr) { { result = #ok kr; goalStore = newGoalStore; krStore = newKrStore } };
      case null { { result = #err "Goal not found"; goalStore; krStore } };
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
  ) : {
    result : { #ok : GTypes.KeyResult; #err : Text };
    goalStore : [(Common.EntityId, GTypes.Goal)];
    krStore : [(Common.EntityId, GTypes.KeyResult)];
  } {
    let (opt, newGoalStore, newKrStore) = GLib.updateKeyResult(goalStore, krStore, tenantId, workspaceId, krId, currentValue, status);
    switch opt {
      case (?kr) { { result = #ok kr; goalStore = newGoalStore; krStore = newKrStore } };
      case null { { result = #err "Key result not found"; goalStore; krStore } };
    }
  };

  public func deleteKeyResult(
    goalStore : [(Common.EntityId, GTypes.Goal)],
    krStore : [(Common.EntityId, GTypes.KeyResult)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    krId : Common.EntityId,
  ) : {
    result : { #ok : Bool; #err : Text };
    goalStore : [(Common.EntityId, GTypes.Goal)];
    krStore : [(Common.EntityId, GTypes.KeyResult)];
  } {
    let (ok, newGoalStore, newKrStore) = GLib.deleteKeyResult(goalStore, krStore, tenantId, workspaceId, krId);
    if (ok) { { result = #ok true; goalStore = newGoalStore; krStore = newKrStore } } else {
      { result = #err "Key result not found"; goalStore; krStore }
    }
  };

  public func listKeyResults(
    krStore : [(Common.EntityId, GTypes.KeyResult)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    goalId : Common.EntityId,
  ) : [GTypes.KeyResult] {
    krStore.filter(func((_, kr)) {
      kr.tenantId == tenantId and kr.workspaceId == workspaceId and kr.goalId == goalId
    }).map(func((_, kr)) { kr })
  };

  public func recordCheckIn(
    goalStore : [(Common.EntityId, GTypes.Goal)],
    krStore : [(Common.EntityId, GTypes.KeyResult)],
    checkInStore : [(Common.EntityId, GTypes.GoalCheckIn)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : GTypes.CheckInInput,
  ) : {
    result : { #ok : GTypes.GoalCheckIn; #err : Text };
    goalStore : [(Common.EntityId, GTypes.Goal)];
    krStore : [(Common.EntityId, GTypes.KeyResult)];
    checkInStore : [(Common.EntityId, GTypes.GoalCheckIn)];
  } {
    let (opt, newGoalStore, newKrStore, newCheckInStore) = GLib.recordCheckIn(goalStore, krStore, checkInStore, tenantId, workspaceId, caller, input);
    switch opt {
      case (?ci) { { result = #ok ci; goalStore = newGoalStore; krStore = newKrStore; checkInStore = newCheckInStore } };
      case null { { result = #err "Check-in failed"; goalStore; krStore; checkInStore } };
    }
  };

  public func listCheckIns(
    checkInStore : [(Common.EntityId, GTypes.GoalCheckIn)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    goalId : Common.EntityId,
  ) : [GTypes.GoalCheckIn] {
    GLib.listCheckIns(checkInStore, tenantId, workspaceId, goalId)
  };

  public func linkTaskToKR(
    krStore : [(Common.EntityId, GTypes.KeyResult)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    krId : Common.EntityId,
    taskId : Common.EntityId,
  ) : { result : { #ok : GTypes.KeyResult; #err : Text }; store : [(Common.EntityId, GTypes.KeyResult)] } {
    let (opt, newStore) = GLib.linkTaskToKR(krStore, tenantId, workspaceId, krId, taskId);
    switch opt {
      case (?kr) { { result = #ok kr; store = newStore } };
      case null { { result = #err "Key result not found"; store = krStore } };
    }
  };

  public func unlinkTaskFromKR(
    krStore : [(Common.EntityId, GTypes.KeyResult)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    krId : Common.EntityId,
    taskId : Common.EntityId,
  ) : { result : { #ok : GTypes.KeyResult; #err : Text }; store : [(Common.EntityId, GTypes.KeyResult)] } {
    let (opt, newStore) = GLib.unlinkTaskFromKR(krStore, tenantId, workspaceId, krId, taskId);
    switch opt {
      case (?kr) { { result = #ok kr; store = newStore } };
      case null { { result = #err "Key result not found"; store = krStore } };
    }
  };

  // --- Public Goals API ---

  /// Unauthenticated: resolve token → workspaceId → return public goals
  public func getPublicGoals(
    goalStore : [(Common.EntityId, GTypes.Goal)],
    krStore : [(Common.EntityId, GTypes.KeyResult)],
    checkInStore : [(Common.EntityId, GTypes.GoalCheckIn)],
    tokenStore : [(Text, Text)],
    shareToken : Text,
  ) : { #ok : [GTypes.PublicGoal]; #err : Text } {
    switch (GLib.workspaceIdFromToken(tokenStore, shareToken)) {
      case null #err "Invalid or expired share token";
      case (?wsId) #ok (GLib.getPublicGoals(goalStore, krStore, checkInStore, wsId));
    }
  };

  /// Authenticated: flip isPublic on a goal
  public func toggleGoalPublic(
    goalStore : [(Common.EntityId, GTypes.Goal)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    goalId : Common.EntityId,
  ) : { result : { #ok : GTypes.Goal; #err : Text }; store : [(Common.EntityId, GTypes.Goal)] } {
    let (opt, newStore) = GLib.toggleGoalPublic(goalStore, tenantId, workspaceId, goalId);
    switch opt {
      case (?g) { { result = #ok g; store = newStore } };
      case null { { result = #err "Goal not found"; store = goalStore } };
    }
  };

  /// Authenticated: get or create a workspace share token
  public func getOrCreateWorkspaceShareToken(
    tokenStore : [(Text, Text)],
    workspaceId : Text,
    now : Int,
  ) : { token : Text; store : [(Text, Text)] } {
    switch (GLib.getShareToken(tokenStore, workspaceId)) {
      case (?existing) { { token = existing; store = tokenStore } };
      case null {
        let newToken = GLib.generateShareToken(workspaceId, now);
        let newStore = GLib.upsertShareToken(tokenStore, workspaceId, newToken);
        { token = newToken; store = newStore }
      };
    }
  };

  /// Authenticated: regenerate share token (invalidates the old one)
  public func regenerateWorkspaceShareToken(
    tokenStore : [(Text, Text)],
    workspaceId : Text,
    now : Int,
  ) : { token : Text; store : [(Text, Text)] } {
    let newToken = GLib.generateShareToken(workspaceId, now);
    let newStore = GLib.upsertShareToken(tokenStore, workspaceId, newToken);
    { token = newToken; store = newStore }
  };
};
