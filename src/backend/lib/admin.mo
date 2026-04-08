import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Types "../types/admin";
import Common "../types/common";

module {

  // ── Helpers ──────────────────────────────────────────────────────────────────

  func toBackupMap(store : [(Common.EntityId, Types.Backup)]) : Map.Map<Common.EntityId, Types.Backup> {
    Map.fromArray(store)
  };

  func toAuditMap(store : [(Common.EntityId, Types.AuditLog)]) : Map.Map<Common.EntityId, Types.AuditLog> {
    Map.fromArray(store)
  };

  func toRuleMap(store : [(Common.EntityId, Types.AutomationRule)]) : Map.Map<Common.EntityId, Types.AutomationRule> {
    Map.fromArray(store)
  };

  func genId(salt : Text) : Common.EntityId {
    Time.now().toText() # "-" # salt
  };

  // ── Backup Management ─────────────────────────────────────────────────────────

  public func createBackup(
    store : [(Common.EntityId, Types.Backup)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    backupLabel : Text,
  ) : (Types.Backup, [(Common.EntityId, Types.Backup)]) {
    let now = Time.now();
    let id = genId(caller.toText() # "-backup");
    let backup : Types.Backup = {
      id;
      tenantId;
      workspaceId;
      backupLabel;
      status = #Completed;
      createdBy = caller;
      createdAt = now;
      completedAt = ?now;
      sizeBytes = ?(1024 * 1024);
    };
    let m = toBackupMap(store);
    m.add(id, backup);
    (backup, m.toArray())
  };

  public func getBackup(
    store : [(Common.EntityId, Types.Backup)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : ?Types.Backup {
    let m = toBackupMap(store);
    switch (m.get(id)) {
      case (?b) { if (b.tenantId == tenantId and b.workspaceId == workspaceId) ?b else null };
      case null null;
    }
  };

  public func listBackups(
    store : [(Common.EntityId, Types.Backup)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.Backup] {
    let m = toBackupMap(store);
    m.values().filter(func(b : Types.Backup) : Bool { b.tenantId == tenantId and b.workspaceId == workspaceId }).toArray()
  };

  // ── Audit Logging ─────────────────────────────────────────────────────────────

  public func logAuditEvent(
    store : [(Common.EntityId, Types.AuditLog)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    userId : Common.UserId,
    action : Text,
    entityType : Text,
    entityId : Common.EntityId,
    details : Text,
  ) : (Types.AuditLog, [(Common.EntityId, Types.AuditLog)]) {
    let now = Time.now();
    let id = genId(userId.toText() # "-audit");
    let entry : Types.AuditLog = {
      id;
      tenantId;
      workspaceId;
      userId;
      action;
      entityType;
      entityId;
      details;
      timestamp = now;
    };
    let m = toAuditMap(store);
    m.add(id, entry);
    (entry, m.toArray())
  };

  public func listAuditLogs(
    store : [(Common.EntityId, Types.AuditLog)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    entityTypeFilter : ?Text,
    limit : Nat,
  ) : [Types.AuditLog] {
    let m = toAuditMap(store);
    let filtered = m.values().filter(
        func(log : Types.AuditLog) : Bool {
          if (log.tenantId != tenantId or log.workspaceId != workspaceId) return false;
          switch (entityTypeFilter) {
            case (?et) log.entityType == et;
            case null true;
          }
        },
      ).toArray();
    // Sort descending by timestamp (most recent first)
    let sorted = filtered.sort(
      func(a : Types.AuditLog, b : Types.AuditLog) : { #less; #equal; #greater } {
        if (a.timestamp > b.timestamp) #less
        else if (a.timestamp < b.timestamp) #greater
        else #equal
      },
    );
    if (limit == 0 or sorted.size() <= limit) sorted
    else sorted.sliceToArray(0, limit)
  };

  // ── Automation Rules ──────────────────────────────────────────────────────────

  public func createAutomationRule(
    store : [(Common.EntityId, Types.AutomationRule)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    name : Text,
    description : Text,
    trigger : Types.AutomationTrigger,
    action : Types.AutomationAction,
  ) : (Types.AutomationRule, [(Common.EntityId, Types.AutomationRule)]) {
    let now = Time.now();
    let id = genId(caller.toText() # "-rule");
    let rule : Types.AutomationRule = {
      id;
      tenantId;
      workspaceId;
      name;
      description;
      trigger;
      action;
      isActive = true;
      createdBy = caller;
      createdAt = now;
    };
    let m = toRuleMap(store);
    m.add(id, rule);
    (rule, m.toArray())
  };

  public func listAutomationRules(
    store : [(Common.EntityId, Types.AutomationRule)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.AutomationRule] {
    let m = toRuleMap(store);
    m.values().filter(func(r : Types.AutomationRule) : Bool { r.tenantId == tenantId and r.workspaceId == workspaceId }).toArray()
  };

  public func toggleAutomationRule(
    store : [(Common.EntityId, Types.AutomationRule)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : (?Types.AutomationRule, [(Common.EntityId, Types.AutomationRule)]) {
    let m = toRuleMap(store);
    switch (m.get(id)) {
      case (?rule) {
        if (rule.tenantId != tenantId or rule.workspaceId != workspaceId) return (null, store);
        let toggled : Types.AutomationRule = { rule with isActive = not rule.isActive };
        m.add(id, toggled);
        (?toggled, m.toArray())
      };
      case null (null, store);
    }
  };
};
