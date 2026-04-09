/// lib/dashboard.mo
/// Real-data dashboard statistics aggregated from workspace entities.

import Common "../types/common";
import NTypes "../types/notes";
import PTypes "../types/projects";
import GTypes "../types/goals";
import WTypes "../types/workspace";
import WalTypes "../types/wallet";
import PayTypes "../types/payroll";
import Int "mo:core/Int";

module {

  public type DashboardStats = {
    noteCount : Nat;
    projectCount : Nat;
    activeProjectCount : Nat;  // projects with status #Active (for "1 active project" pluralization)
    memberCount : Nat;
    goalCount : Nat;
    taskCount : Nat;
    completedTaskCount : Nat;  // tasks with status #Done
    walletBalance : Nat;       // treasury ICP balance in e8s (bigint-compatible Nat)
    payrollTotal : Float;      // sum of approved/processed payroll record gross amounts
  };

  public type ActivityEntry = {
    actorId : Text;
    action : Text;
    entityType : Text;
    entityTitle : Text;
    timestamp : Int;
  };

  /// Aggregate real counts from workspace entities.
  public func getWorkspaceDashboardStats(
    workspaceId : Common.WorkspaceId,
    tenantId : Common.TenantId,
    notes : [(Common.EntityId, NTypes.Note)],
    projects : [(Common.EntityId, PTypes.Project)],
    tasks : [(Common.EntityId, PTypes.Task)],
    goals : [(Common.EntityId, GTypes.Goal)],
    workspaces : [(Common.EntityId, WTypes.Workspace)],
    walletAccounts : [(Common.EntityId, WalTypes.WalletAccount)],
    payrollRecords : [(Common.EntityId, PayTypes.PayrollRecord)],
  ) : DashboardStats {
    let noteCount = notes.filter(
      func((_, n)) { n.tenantId == tenantId and n.workspaceId == workspaceId },
    ).size();
    let wsProjects = projects.filter(
      func((_, p)) { p.tenantId == tenantId and p.workspaceId == workspaceId },
    );
    let projectCount = wsProjects.size();
    let activeProjectCount = wsProjects.filter(
      func((_, p)) { p.status == #Active },
    ).size();
    let wsTasks = tasks.filter(
      func((_, t)) { t.tenantId == tenantId and t.workspaceId == workspaceId },
    );
    let taskCount = wsTasks.size();
    let completedTaskCount = wsTasks.filter(
      func((_, t)) { t.status == #Done },
    ).size();
    let goalCount = goals.filter(
      func((_, g)) { g.tenantId == tenantId and g.workspaceId == workspaceId },
    ).size();
    let memberCount = switch (workspaces.find(func((_, w)) { w.id == workspaceId and w.tenantId == tenantId })) {
      case null 0;
      case (?(_, ws)) ws.members.size();
    };
    // Treasury ICP balance from stored wallet account (updated live by getWorkspaceTreasury)
    let walletBalance = switch (walletAccounts.find(
      func((_, a)) { a.tenantId == tenantId and a.workspaceId == workspaceId and a.accountType == #treasury }
    )) {
      case null 0;
      case (?(_, a)) a.icpBalance;
    };
    // Sum approved/processed payroll records gross amounts
    let payrollFiltered = payrollRecords.filter(
      func((_, r)) {
        r.tenantId == tenantId and r.workspaceId == workspaceId and
        (r.status == #Approved or r.status == #Processed)
      }
    );
    var payrollTotal : Float = 0.0;
    for ((_, r) in payrollFiltered.values()) {
      payrollTotal += r.grossAmount;
    };
    { noteCount; projectCount; activeProjectCount; memberCount; goalCount; taskCount; completedTaskCount; walletBalance; payrollTotal }
  };

  /// Build a recent activity feed from notes, tasks, and projects (most recent first, up to limit).
  public func getWorkspaceRecentActivity(
    workspaceId : Common.WorkspaceId,
    tenantId : Common.TenantId,
    limit : Nat,
    notes : [(Common.EntityId, NTypes.Note)],
    projects : [(Common.EntityId, PTypes.Project)],
    tasks : [(Common.EntityId, PTypes.Task)],
    goals : [(Common.EntityId, GTypes.Goal)],
  ) : [ActivityEntry] {
    var entries : [ActivityEntry] = [];

    // Notes — creation events
    let wsNotes = notes.filter(func((_, n)) { n.tenantId == tenantId and n.workspaceId == workspaceId });
    for ((_, n) in wsNotes.values()) {
      entries := entries.concat([{
        actorId = n.authorId.toText();
        action = "created note";
        entityType = "note";
        entityTitle = n.title;
        timestamp = n.createdAt;
      }]);
    };

    // Projects — creation events
    let wsProjects = projects.filter(func((_, p)) { p.tenantId == tenantId and p.workspaceId == workspaceId });
    for ((_, p) in wsProjects.values()) {
      entries := entries.concat([{
        actorId = p.ownerId.toText();
        action = "created project";
        entityType = "project";
        entityTitle = p.name;
        timestamp = p.createdAt;
      }]);
    };

    // Tasks — update events
    let wsTasks = tasks.filter(func((_, t)) { t.tenantId == tenantId and t.workspaceId == workspaceId });
    for ((_, t) in wsTasks.values()) {
      entries := entries.concat([{
        actorId = switch (t.assigneeId) { case null ""; case (?a) a.toText() };
        action = "updated task";
        entityType = "task";
        entityTitle = t.title;
        timestamp = t.updatedAt;
      }]);
    };

    // Goals — creation events
    let wsGoals = goals.filter(func((_, g)) { g.tenantId == tenantId and g.workspaceId == workspaceId });
    for ((_, g) in wsGoals.values()) {
      entries := entries.concat([{
        actorId = g.ownerId.toText();
        action = "created goal";
        entityType = "goal";
        entityTitle = g.title;
        timestamp = g.createdAt;
      }]);
    };

    // Sort by timestamp descending (newest first)
    let sorted = entries.sort(func(a : ActivityEntry, b : ActivityEntry) : { #less; #equal; #greater } {
      Int.compare(b.timestamp, a.timestamp)
    });

    // Return up to limit entries
    if (sorted.size() <= limit) sorted
    else sorted.sliceToArray(0, limit)
  };
};
