import Common "types/common";
import WorkspaceApi "mixins/workspace-api";
import NotesApi "mixins/notes-api";
import ProjApi "mixins/projects-api";
import ChatApi "mixins/chat-api";
import CalApi "mixins/calendar-api";
import PayApi "mixins/payroll-api";
import EscApi "mixins/escrow-api";
import WalletApi "mixins/wallet-api";
import AdminApi "mixins/admin-api";
import WTypes "types/workspace";
import NTypes "types/notes";
import PTypes "types/projects";
import CTypes "types/chat";
import CalTypes "types/calendar";
import PayTypes "types/payroll";
import EscTypes "types/escrow";
import WalTypes "types/wallet";
import AdmTypes "types/admin";

actor {
  let workspacesRef = { var val : [(Common.EntityId, WTypes.Workspace)] = [] };
  let profilesRef   = { var val : [(Common.UserId, WTypes.UserProfile)] = [] };
  var notes          : [(Common.EntityId, NTypes.Note)]               = [];
  var projects       : [(Common.EntityId, PTypes.Project)]             = [];
  var tasks          : [(Common.EntityId, PTypes.Task)]                = [];
  var channels       : [(Common.EntityId, CTypes.Channel)]             = [];
  var messages       : [(Common.EntityId, CTypes.Message)]             = [];
  var events         : [(Common.EntityId, CalTypes.Event)]             = [];
  var employees      : [(Common.EntityId, PayTypes.Employee)]          = [];
  var payrollRecords : [(Common.EntityId, PayTypes.PayrollRecord)]     = [];
  var escrowContracts: [(Common.EntityId, EscTypes.EscrowContract)]    = [];
  var walletAccounts : [(Common.EntityId, WalTypes.WalletAccount)]     = [];
  var walletTxs      : [(Common.EntityId, WalTypes.WalletTransaction)] = [];
  var recurringPmts  : [(Common.EntityId, WalTypes.RecurringPayment)]  = [];
  var backups        : [(Common.EntityId, AdmTypes.Backup)]            = [];
  var auditLogs      : [(Common.EntityId, AdmTypes.AuditLog)]          = [];
  var automationRules: [(Common.EntityId, AdmTypes.AutomationRule)]    = [];
  var idCounter      : Nat = 0;

  include WorkspaceApi(workspacesRef, profilesRef);

  // Notes
  public shared ({ caller }) func createNote(tenantId : Common.TenantId, input : NTypes.NoteInput) : async { #ok : NTypes.Note; #err : Text } {
    let r = NotesApi.createNote(notes, tenantId, caller, input); notes := r.store; r.result
  };
  public shared query ({ caller }) func getNote(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : NTypes.Note; #err : Text } { NotesApi.getNote(notes, tenantId, id) };
  public shared query ({ caller }) func listNotes(tenantId : Common.TenantId) : async [NTypes.Note] { NotesApi.listNotes(notes, tenantId) };
  public shared ({ caller }) func updateNote(tenantId : Common.TenantId, id : Common.EntityId, input : NTypes.NoteInput) : async { #ok : NTypes.Note; #err : Text } {
    let r = NotesApi.updateNote(notes, tenantId, id, caller, input); notes := r.store; r.result
  };
  public shared ({ caller }) func deleteNote(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : Bool; #err : Text } {
    let r = NotesApi.deleteNote(notes, tenantId, id, caller); notes := r.store; r.result
  };
  public shared query ({ caller }) func searchNotes(tenantId : Common.TenantId, searchQuery : Text) : async [NTypes.Note] { NotesApi.searchNotes(notes, tenantId, searchQuery) };

  // Projects
  public shared ({ caller }) func createProject(tenantId : Common.TenantId, input : PTypes.ProjectInput) : async { #ok : PTypes.Project; #err : Text } {
    let r = ProjApi.createProject(projects, tenantId, caller, input); projects := r.store; r.result
  };
  public shared query ({ caller }) func getProject(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : PTypes.Project; #err : Text } { ProjApi.getProject(projects, tenantId, id) };
  public shared query ({ caller }) func listProjects(tenantId : Common.TenantId) : async [PTypes.Project] { ProjApi.listProjects(projects, tenantId) };
  public shared ({ caller }) func updateProject(tenantId : Common.TenantId, id : Common.EntityId, input : PTypes.ProjectInput) : async { #ok : PTypes.Project; #err : Text } {
    let r = ProjApi.updateProject(projects, tenantId, id, caller, input); projects := r.store; r.result
  };
  public shared ({ caller }) func archiveProject(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : PTypes.Project; #err : Text } {
    let r = ProjApi.archiveProject(projects, tenantId, id, caller); projects := r.store; r.result
  };
  public shared ({ caller }) func createTask(tenantId : Common.TenantId, input : PTypes.TaskInput) : async { #ok : PTypes.Task; #err : Text } {
    let r = ProjApi.createTask(tasks, tenantId, caller, input); tasks := r.store; r.result
  };
  public shared query ({ caller }) func getTask(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : PTypes.Task; #err : Text } { ProjApi.getTask(tasks, tenantId, id) };
  public shared query ({ caller }) func listTasks(tenantId : Common.TenantId, projectId : Common.EntityId) : async [PTypes.Task] { ProjApi.listTasks(tasks, tenantId, projectId) };
  public shared ({ caller }) func updateTask(tenantId : Common.TenantId, id : Common.EntityId, input : PTypes.TaskInput) : async { #ok : PTypes.Task; #err : Text } {
    let r = ProjApi.updateTask(tasks, tenantId, id, caller, input); tasks := r.store; r.result
  };
  public shared ({ caller }) func deleteTask(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : Bool; #err : Text } {
    let r = ProjApi.deleteTask(tasks, tenantId, id, caller); tasks := r.store; r.result
  };

  // Chat
  public shared ({ caller }) func createChannel(tenantId : Common.TenantId, input : CTypes.ChannelInput) : async { #ok : CTypes.Channel; #err : Text } {
    let (res, s) = ChatApi.createChannel(channels, tenantId, caller, input); channels := s; res
  };
  public shared query ({ caller }) func getChannel(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : CTypes.Channel; #err : Text } { ChatApi.getChannel(channels, tenantId, id) };
  public shared query ({ caller }) func listChannels(tenantId : Common.TenantId) : async [CTypes.Channel] { ChatApi.listChannels(channels, tenantId, caller) };
  public shared ({ caller }) func joinChannel(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : CTypes.Channel; #err : Text } {
    let (res, s) = ChatApi.joinChannel(channels, tenantId, caller, id); channels := s; res
  };
  public shared ({ caller }) func sendMessage(tenantId : Common.TenantId, input : CTypes.MessageInput) : async { #ok : CTypes.Message; #err : Text } {
    let (res, s) = ChatApi.sendMessage(channels, messages, tenantId, caller, input); messages := s; res
  };
  public shared query ({ caller }) func getMessages(tenantId : Common.TenantId, channelId : Common.EntityId, limit : Nat, before : ?Common.Timestamp) : async [CTypes.Message] { ChatApi.getMessages(messages, tenantId, channelId, limit, before) };
  public shared ({ caller }) func deleteMessage(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : Bool; #err : Text } {
    let (res, s) = ChatApi.deleteMessage(messages, tenantId, caller, id); messages := s; res
  };

  // Calendar
  public shared ({ caller }) func createEvent(tenantId : Common.TenantId, input : CalTypes.EventInput) : async { #ok : CalTypes.Event; #err : Text } {
    let (res, s) = CalApi.createEvent(events, tenantId, caller, input); events := s; res
  };
  public shared query ({ caller }) func getEvent(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : CalTypes.Event; #err : Text } { CalApi.getEvent(events, tenantId, id) };
  public shared query ({ caller }) func listEvents(tenantId : Common.TenantId, from : Common.Timestamp, to : Common.Timestamp) : async [CalTypes.Event] { CalApi.listEvents(events, tenantId, from, to) };
  public shared ({ caller }) func updateEvent(tenantId : Common.TenantId, id : Common.EntityId, input : CalTypes.EventInput) : async { #ok : CalTypes.Event; #err : Text } {
    let (res, s) = CalApi.updateEvent(events, tenantId, caller, id, input); events := s; res
  };
  public shared ({ caller }) func deleteEvent(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : Bool; #err : Text } {
    let (res, s) = CalApi.deleteEvent(events, tenantId, caller, id); events := s; res
  };
  public shared query ({ caller }) func listMyEvents(tenantId : Common.TenantId) : async [CalTypes.Event] { CalApi.listMyEvents(events, tenantId, caller) };

  // Payroll
  public shared ({ caller }) func addEmployee(tenantId : Common.TenantId, input : PayTypes.EmployeeInput) : async { #ok : PayTypes.Employee; #err : Text } {
    switch (PayApi.addEmployee(employees, idCounter, tenantId, caller, input)) { case (#err e) #err e; case (#ok(v, s, n)) { employees := s; idCounter := n; #ok v } }
  };
  public shared query ({ caller }) func getEmployee(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : PayTypes.Employee; #err : Text } { PayApi.getEmployee(employees, tenantId, id) };
  public shared query ({ caller }) func listEmployees(tenantId : Common.TenantId) : async [PayTypes.Employee] { PayApi.listEmployees(employees, tenantId) };
  public shared ({ caller }) func updateEmployee(tenantId : Common.TenantId, id : Common.EntityId, input : PayTypes.EmployeeInput) : async { #ok : PayTypes.Employee; #err : Text } {
    switch (PayApi.updateEmployee(employees, tenantId, id, caller, input)) { case (#err e) #err e; case (#ok(v, s)) { employees := s; #ok v } }
  };
  public shared ({ caller }) func deactivateEmployee(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : PayTypes.Employee; #err : Text } {
    switch (PayApi.deactivateEmployee(employees, tenantId, id, caller)) { case (#err e) #err e; case (#ok(v, s)) { employees := s; #ok v } }
  };
  public shared ({ caller }) func processPayroll(tenantId : Common.TenantId, employeeId : Common.EntityId, period : Text) : async { #ok : PayTypes.PayrollRecord; #err : Text } {
    switch (PayApi.processPayroll(employees, payrollRecords, idCounter, tenantId, caller, employeeId, period)) { case (#err e) #err e; case (#ok(v, s, n)) { payrollRecords := s; idCounter := n; #ok v } }
  };
  public shared query ({ caller }) func listPayrollRecords(tenantId : Common.TenantId, employeeId : ?Common.EntityId) : async [PayTypes.PayrollRecord] { PayApi.listPayrollRecords(payrollRecords, tenantId, employeeId) };

  // Escrow
  public shared ({ caller }) func createEscrow(tenantId : Common.TenantId, input : EscTypes.EscrowInput) : async { #ok : EscTypes.EscrowContract; #err : Text } {
    switch (EscApi.createEscrow(escrowContracts, idCounter, tenantId, caller, input)) { case (#err e) #err e; case (#ok(v, s, n)) { escrowContracts := s; idCounter := n; #ok v } }
  };
  public shared query ({ caller }) func getEscrow(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : EscTypes.EscrowContract; #err : Text } { EscApi.getEscrow(escrowContracts, tenantId, id) };
  public shared query ({ caller }) func listEscrows(tenantId : Common.TenantId) : async [EscTypes.EscrowContract] { EscApi.listEscrows(escrowContracts, tenantId, caller) };
  public shared ({ caller }) func fundEscrow(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : EscTypes.EscrowContract; #err : Text } {
    switch (EscApi.fundEscrow(escrowContracts, tenantId, id, caller)) { case (#err e) #err e; case (#ok(v, s)) { escrowContracts := s; #ok v } }
  };
  public shared ({ caller }) func releaseEscrow(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : EscTypes.EscrowContract; #err : Text } {
    switch (EscApi.releaseEscrow(escrowContracts, tenantId, id, caller)) { case (#err e) #err e; case (#ok(v, s)) { escrowContracts := s; #ok v } }
  };
  public shared ({ caller }) func disputeEscrow(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : EscTypes.EscrowContract; #err : Text } {
    switch (EscApi.disputeEscrow(escrowContracts, tenantId, id, caller)) { case (#err e) #err e; case (#ok(v, s)) { escrowContracts := s; #ok v } }
  };
  public shared ({ caller }) func cancelEscrow(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : EscTypes.EscrowContract; #err : Text } {
    switch (EscApi.cancelEscrow(escrowContracts, tenantId, id, caller)) { case (#err e) #err e; case (#ok(v, s)) { escrowContracts := s; #ok v } }
  };

  // Wallet
  public shared ({ caller }) func createWalletAccount(tenantId : Common.TenantId, displayName : Text) : async { #ok : WalTypes.WalletAccount; #err : Text } {
    switch (WalletApi.createWalletAccount(walletAccounts, tenantId, caller, displayName)) { case (#err e) #err e; case (#ok(v, s)) { walletAccounts := s; #ok v } }
  };
  public shared query ({ caller }) func getWalletAccount(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : WalTypes.WalletAccount; #err : Text } { WalletApi.getWalletAccount(walletAccounts, tenantId, id) };
  public shared query ({ caller }) func getMyWalletAccount(tenantId : Common.TenantId) : async ?WalTypes.WalletAccount { WalletApi.getMyWalletAccount(walletAccounts, tenantId, caller) };
  public shared ({ caller }) func sendAsset(tenantId : Common.TenantId, accountId : Common.EntityId, asset : WalTypes.AssetType, amount : Nat, toAddress : Text, memo : ?Text) : async { #ok : WalTypes.WalletTransaction; #err : Text } {
    switch (WalletApi.sendAsset(walletAccounts, walletTxs, tenantId, caller, accountId, asset, amount, toAddress, memo)) { case (#err e) #err e; case (#ok(v, sa, st)) { walletAccounts := sa; walletTxs := st; #ok v } }
  };
  public shared query ({ caller }) func listTransactions(tenantId : Common.TenantId, accountId : Common.EntityId) : async [WalTypes.WalletTransaction] { WalletApi.listTransactions(walletTxs, tenantId, accountId) };
  public shared ({ caller }) func createRecurringPayment(tenantId : Common.TenantId, accountId : Common.EntityId, toAddress : Text, amount : Nat, asset : WalTypes.AssetType, frequency : Common.PayFrequency) : async { #ok : WalTypes.RecurringPayment; #err : Text } {
    switch (WalletApi.createRecurringPayment(recurringPmts, tenantId, caller, accountId, toAddress, amount, asset, frequency)) { case (#err e) #err e; case (#ok(v, s)) { recurringPmts := s; #ok v } }
  };
  public shared query ({ caller }) func listRecurringPayments(tenantId : Common.TenantId, accountId : Common.EntityId) : async [WalTypes.RecurringPayment] { WalletApi.listRecurringPayments(recurringPmts, tenantId, accountId) };
  public shared ({ caller }) func cancelRecurringPayment(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : WalTypes.RecurringPayment; #err : Text } {
    switch (WalletApi.cancelRecurringPayment(recurringPmts, tenantId, id, caller)) { case (#err e) #err e; case (#ok(v, s)) { recurringPmts := s; #ok v } }
  };

  // Admin
  public shared ({ caller }) func createBackup(tenantId : Common.TenantId, backupLabel : Text) : async { #ok : AdmTypes.Backup; #err : Text } {
    switch (AdminApi.createBackup(backups, tenantId, caller, backupLabel)) { case (#err e) #err e; case (#ok(v, s)) { backups := s; #ok v } }
  };
  public shared query ({ caller }) func getBackup(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : AdmTypes.Backup; #err : Text } { AdminApi.getBackup(backups, tenantId, id) };
  public shared query ({ caller }) func listBackups(tenantId : Common.TenantId) : async [AdmTypes.Backup] { AdminApi.listBackups(backups, tenantId) };
  public shared query ({ caller }) func listAuditLogs(tenantId : Common.TenantId, limit : Nat) : async [AdmTypes.AuditLog] { AdminApi.listAuditLogs(auditLogs, tenantId, limit) };
  public shared ({ caller }) func createAutomationRule(tenantId : Common.TenantId, name : Text, description : Text, trigger : AdmTypes.AutomationTrigger, action : AdmTypes.AutomationAction) : async { #ok : AdmTypes.AutomationRule; #err : Text } {
    switch (AdminApi.createAutomationRule(automationRules, tenantId, caller, name, description, trigger, action)) { case (#err e) #err e; case (#ok(v, s)) { automationRules := s; #ok v } }
  };
  public shared query ({ caller }) func listAutomationRules(tenantId : Common.TenantId) : async [AdmTypes.AutomationRule] { AdminApi.listAutomationRules(automationRules, tenantId) };
  public shared ({ caller }) func toggleAutomationRule(tenantId : Common.TenantId, id : Common.EntityId) : async { #ok : AdmTypes.AutomationRule; #err : Text } {
    switch (AdminApi.toggleAutomationRule(automationRules, tenantId, id)) { case (#err e) #err e; case (#ok(v, s)) { automationRules := s; #ok v } }
  };
  public shared query ({ caller }) func getWorkspaceStats(tenantId : Common.TenantId) : async { noteCount : Nat; projectCount : Nat; employeeCount : Nat; escrowCount : Nat; walletAccountCount : Nat } {
    AdminApi.getWorkspaceStats(tenantId, notes, projects, employees, escrowContracts, walletAccounts)
  };
};
