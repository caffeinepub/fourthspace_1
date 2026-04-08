import Common "../types/common";
import AdmTypes "../types/admin";
import NTypes "../types/notes";
import PTypes "../types/projects";
import PayTypes "../types/payroll";
import EscTypes "../types/escrow";
import WalTypes "../types/wallet";
import AdminLib "../lib/admin";

module {

  public func createBackup(
    store : [(Common.EntityId, AdmTypes.Backup)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    backupLabel : Text,
  ) : { #ok : (AdmTypes.Backup, [(Common.EntityId, AdmTypes.Backup)]); #err : Text } {
    let (backup, updated) = AdminLib.createBackup(store, tenantId, workspaceId, caller, backupLabel);
    #ok((backup, updated))
  };

  public func getBackup(
    store : [(Common.EntityId, AdmTypes.Backup)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { #ok : AdmTypes.Backup; #err : Text } {
    switch (AdminLib.getBackup(store, tenantId, workspaceId, id)) {
      case (?b) #ok(b);
      case null #err("Backup not found");
    }
  };

  public func listBackups(
    store : [(Common.EntityId, AdmTypes.Backup)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [AdmTypes.Backup] {
    AdminLib.listBackups(store, tenantId, workspaceId)
  };

  public func listAuditLogs(
    store : [(Common.EntityId, AdmTypes.AuditLog)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    limit : Nat,
  ) : [AdmTypes.AuditLog] {
    AdminLib.listAuditLogs(store, tenantId, workspaceId, null, limit)
  };

  public func createAutomationRule(
    store : [(Common.EntityId, AdmTypes.AutomationRule)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    name : Text,
    description : Text,
    trigger : AdmTypes.AutomationTrigger,
    action : AdmTypes.AutomationAction,
  ) : { #ok : (AdmTypes.AutomationRule, [(Common.EntityId, AdmTypes.AutomationRule)]); #err : Text } {
    let (rule, updated) = AdminLib.createAutomationRule(store, tenantId, workspaceId, caller, name, description, trigger, action);
    #ok((rule, updated))
  };

  public func listAutomationRules(
    store : [(Common.EntityId, AdmTypes.AutomationRule)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [AdmTypes.AutomationRule] {
    AdminLib.listAutomationRules(store, tenantId, workspaceId)
  };

  public func toggleAutomationRule(
    store : [(Common.EntityId, AdmTypes.AutomationRule)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { #ok : (AdmTypes.AutomationRule, [(Common.EntityId, AdmTypes.AutomationRule)]); #err : Text } {
    let (result, updated) = AdminLib.toggleAutomationRule(store, tenantId, workspaceId, id);
    switch (result) {
      case (?rule) #ok((rule, updated));
      case null #err("Automation rule not found");
    }
  };

  public func getWorkspaceStats(
    _tenantId : Common.TenantId,
    _workspaceId : Common.WorkspaceId,
    notes : [(Common.EntityId, NTypes.Note)],
    projects : [(Common.EntityId, PTypes.Project)],
    employees : [(Common.EntityId, PayTypes.Employee)],
    escrowContracts : [(Common.EntityId, EscTypes.EscrowContract)],
    walletAccounts : [(Common.EntityId, WalTypes.WalletAccount)],
  ) : {
    noteCount : Nat;
    projectCount : Nat;
    employeeCount : Nat;
    escrowCount : Nat;
    walletAccountCount : Nat;
  } {
    {
      noteCount = notes.size();
      projectCount = projects.size();
      employeeCount = employees.size();
      escrowCount = escrowContracts.size();
      walletAccountCount = walletAccounts.size();
    }
  };

};
