import Common "types/common";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Nat64 "mo:core/Nat64";
import Int "mo:core/Int";
import Principal "mo:core/Principal";




import WorkspaceApi "mixins/workspace-api";
import NotesApi "mixins/notes-api";
import ProjApi "mixins/projects-api";
import ChatApi "mixins/chat-api";
import CalApi "mixins/calendar-api";
import PayApi "mixins/payroll-api";
import EscApi "mixins/escrow-api";
import WalletApi "mixins/wallet-api";
import AdminApi "mixins/admin-api";
import AIApi "mixins/ai-api";
import IntApi "mixins/integration-api";
import TTApi "mixins/timeTracking-api";
import GoalsApi "mixins/goals-api";
import GAApi "mixins/guestAccess-api";
import FormsApi "mixins/forms-api";
import WBApi "mixins/whiteboards-api";
import NPApi "mixins/notes-pages-api";
import PAdvApi "mixins/projects-advanced-api";
import WTypes "types/workspace";
import NTypes "types/notes";
import PTypes "types/projects";
import CTypes "types/chat";
import CalTypes "types/calendar";
import PayTypes "types/payroll";
import EscTypes "types/escrow";
import WalTypes "types/wallet";
import AdmTypes "types/admin";
import AITypes "types/ai";
import ITypes "types/integration";
import TTTypes "types/timeTracking";
import GATypes "types/guestAccess";
import GTypes "types/goals";
import FTypes "types/forms";
import WBTypes "types/whiteboards";
import LedgerLib "lib/ledger";
import EscLib "lib/escrow";
import WalletLib "lib/wallet";
import DashboardLib "lib/dashboard";









actor self {
  let workspacesRef = { var val : [(Common.EntityId, WTypes.Workspace)] = [] };
  let profilesRef   = { var val : [(Common.UserId, WTypes.UserProfile)] = [] };
  stable var notes            : [(Common.EntityId, NTypes.Note)]               = [];
  stable var projects         : [(Common.EntityId, PTypes.Project)]             = [];
  stable var tasks            : [(Common.EntityId, PTypes.Task)]                = [];
  stable var channels         : [(Common.EntityId, CTypes.Channel)]             = [];
  stable var messages         : [(Common.EntityId, CTypes.Message)]             = [];
  stable var events           : [(Common.EntityId, CalTypes.Event)]             = [];
  stable var calendarDefs     : [(Common.EntityId, CalTypes.CalendarDef)]        = [];
  stable var eventRsvps       : [(Common.EntityId, CalTypes.EventRsvp)]          = [];
  stable var eventExceptions  : [(Common.EntityId, CalTypes.EventException)]     = [];
  stable var employees          : [(Common.EntityId, PayTypes.Employee)]            = [];
  stable var payrollRecords     : [(Common.EntityId, PayTypes.PayrollRecord)]       = [];
  stable var contractors        : [(Common.EntityId, PayTypes.Contractor)]           = [];
  stable var contractorPayments : [(Common.EntityId, PayTypes.ContractorPayment)]   = [];
  stable var paySchedules       : [(Common.EntityId, PayTypes.PaySchedule)]          = [];
  stable var payDeductions      : [(Common.EntityId, PayTypes.Deduction)]            = [];
  stable var payBenefits        : [(Common.EntityId, PayTypes.Benefit)]              = [];
  stable var payStubs           : [(Common.EntityId, PayTypes.PayStub)]              = [];
  stable var offCyclePayments   : [(Common.EntityId, PayTypes.OffCyclePayment)]      = [];
  stable var payAuditLog        : [(Common.EntityId, PayTypes.AuditLogEntry)]        = [];
  stable var escrowContracts        : [(Common.EntityId, EscTypes.EscrowContract)]        = [];
  stable var escrowMilestones       : [(Common.EntityId, EscTypes.EscrowMilestone)]       = [];
  stable var escrowDisputes         : [(Common.EntityId, EscTypes.EscrowDispute)]          = [];
  stable var walletAccounts         : [(Common.EntityId, WalTypes.WalletAccount)]          = [];
  stable var walletTxs              : [(Common.EntityId, WalTypes.WalletTransaction)]      = [];
  stable var walletApprovals        : [(Common.EntityId, WalTypes.TransactionApproval)]    = [];
  stable var walletApprovalsCounter : Nat                                                   = 0;
  stable var txMemoCounter          : Nat64                                                 = 0;  // Unique memo counter for ledger deduplication
  stable var spendingLimits         : [(Common.EntityId, WalTypes.WorkspaceSpendingLimit)] = [];
  stable var recurringPmts          : [(Common.EntityId, WalTypes.RecurringPayment)]       = [];
  stable var backups          : [(Common.EntityId, AdmTypes.Backup)]            = [];
  stable var auditLogs        : [(Common.EntityId, AdmTypes.AuditLog)]          = [];
  stable var automationRules  : [(Common.EntityId, AdmTypes.AutomationRule)]    = [];
  stable var idCounter        : Nat = 0;
  stable var aiConfigs        : [(Common.EntityId, AITypes.AIConfig)]           = [];
  stable var aiPrompts        : [(Common.EntityId, AITypes.AIPrompt)]           = [];
  stable var aiResponses      : [(Common.EntityId, AITypes.AIResponse)]         = [];
  stable var integrations     : [(Common.EntityId, ITypes.Integration)]         = [];
  stable var integrationEvents: [(Common.EntityId, ITypes.IntegrationEvent)]    = [];
  stable var timeEntries      : [(Common.EntityId, TTTypes.TimeEntry)]          = [];
  stable var goals            : [(Common.EntityId, GTypes.Goal)]                = [];
  stable var keyResults       : [(Common.EntityId, GTypes.KeyResult)]           = [];
  stable var goalCheckIns     : [(Common.EntityId, GTypes.GoalCheckIn)]         = [];
  stable var workspaceShareTokens : [(Text, Text)]                              = [];
  stable var guestUsers       : [(Common.EntityId, GATypes.GuestUser)]          = [];
  stable var guestInvitations : [(Common.EntityId, GATypes.GuestInvitation)]    = [];
  stable var forms            : [(Common.EntityId, FTypes.Form)]                = [];
  stable var formSubmissions  : [(Common.EntityId, FTypes.FormSubmission)]      = [];
  stable var whiteboards      : [(Common.EntityId, WBTypes.Whiteboard)]         = [];
  stable var pages            : [(Common.EntityId, NTypes.PageNode)]             = [];
  stable var noteTemplates    : [(Common.EntityId, NTypes.NoteTemplate)]         = [];
  stable var subtasks         : [(Common.EntityId, PTypes.Subtask)]              = [];
  stable var sprints          : [(Common.EntityId, PTypes.Sprint)]               = [];
  stable var milestones       : [(Common.EntityId, PTypes.Milestone)]            = [];
  stable var taskComments     : [(Common.EntityId, PTypes.TaskComment)]          = [];
  stable var activityEvents   : [(Common.EntityId, PTypes.ActivityEvent)]        = [];
  stable var checklistItems   : [(Common.EntityId, PTypes.ChecklistItem)]        = [];
  stable var taskRelationships: [(Common.EntityId, PTypes.TaskRelationship)]     = [];
  stable var taskWatchers     : [PTypes.TaskWatcher]                             = [];
  stable var recurringTasks   : [(Common.EntityId, PTypes.RecurringTask)]        = [];
  stable var taskTemplates    : [(Common.EntityId, PTypes.TaskTemplate)]         = [];
  stable var statusStore      : [(Text, CTypes.UserStatus)]                       = [];
  stable var threadNotifications : [(Text, CTypes.ThreadNotification)]            = [];
  stable var notePresenceStore : [(Text, NTypes.NotePresenceEntry)]               = [];
  stable var noteLastEditStore : [(Text, NTypes.NoteLastEditEntry)]               = [];

  include WorkspaceApi(workspacesRef, profilesRef);

  // Notes
  public shared ({ caller }) func createNote(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : NTypes.NoteInput) : async { #ok : NTypes.Note; #err : Text } { let r = NotesApi.createNote(notes, tenantId, workspaceId, caller, input); notes := r.store; r.result };
  public shared query ({ caller }) func getNote(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : NTypes.Note; #err : Text } { NotesApi.getNote(notes, tenantId, workspaceId, id) };
  public shared query ({ caller }) func listNotes(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [NTypes.Note] { NotesApi.listNotes(notes, tenantId, workspaceId) };
  public shared ({ caller }) func updateNote(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId, input : NTypes.NoteInput) : async { #ok : NTypes.Note; #err : Text } {
    let r = NotesApi.updateNote(notes, tenantId, workspaceId, id, caller, input);
    notes := r.store;
    switch (r.result) {
      case (#ok _) {
        noteLastEditStore := NotesApi.updateLastEdit(noteLastEditStore, id, tenantId, workspaceId, caller, caller.toText());
      };
      case (#err _) {};
    };
    r.result
  };
  public shared ({ caller }) func deleteNote(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : Bool; #err : Text } { let r = NotesApi.deleteNote(notes, tenantId, workspaceId, id, caller); notes := r.store; r.result };
  public shared query ({ caller }) func searchNotes(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, searchQuery : Text) : async [NTypes.Note] { NotesApi.searchNotes(notes, tenantId, workspaceId, searchQuery) };
  public shared ({ caller }) func updateNotePresence(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, noteId : Common.EntityId, displayName : Text) : async () { notePresenceStore := NotesApi.updateNotePresence(notePresenceStore, noteId, tenantId, workspaceId, caller, displayName) };
  public shared query ({ caller }) func getNoteActiveEditors(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, noteId : Common.EntityId) : async [NTypes.NoteEditorPresence] { NotesApi.getNoteActiveEditors(notePresenceStore, noteId, tenantId, workspaceId) };
  public shared query ({ caller }) func getLastNoteEdit(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, noteId : Common.EntityId) : async ?NTypes.NoteLastEdit { NotesApi.getLastNoteEdit(noteLastEditStore, noteId, tenantId, workspaceId) };

  // Projects
  public shared ({ caller }) func createProject(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : PTypes.ProjectInput) : async { #ok : PTypes.Project; #err : Text } { let r = ProjApi.createProject(projects, tenantId, workspaceId, caller, input); projects := r.store; r.result };
  public shared query ({ caller }) func getProject(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : PTypes.Project; #err : Text } { ProjApi.getProject(projects, tenantId, workspaceId, id) };
  public shared query ({ caller }) func listProjects(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [PTypes.Project] { ProjApi.listProjects(projects, tenantId, workspaceId) };
  public shared ({ caller }) func updateProject(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId, input : PTypes.ProjectInput) : async { #ok : PTypes.Project; #err : Text } { let r = ProjApi.updateProject(projects, tenantId, workspaceId, id, caller, input); projects := r.store; r.result };
  public shared ({ caller }) func archiveProject(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : PTypes.Project; #err : Text } { let r = ProjApi.archiveProject(projects, tenantId, workspaceId, id, caller); projects := r.store; r.result };
  public shared ({ caller }) func createTask(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : PTypes.TaskInput) : async { #ok : PTypes.Task; #err : Text } { let r = ProjApi.createTask(tasks, tenantId, workspaceId, caller, input); tasks := r.store; r.result };
  public shared query ({ caller }) func getTask(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : PTypes.Task; #err : Text } { ProjApi.getTask(tasks, tenantId, workspaceId, id) };
  public shared query ({ caller }) func listTasks(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, projectId : Common.EntityId) : async [PTypes.Task] { ProjApi.listTasks(tasks, tenantId, workspaceId, projectId) };
  public shared ({ caller }) func updateTask(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId, input : PTypes.TaskInput) : async { #ok : PTypes.Task; #err : Text } { let r = ProjApi.updateTask(tasks, tenantId, workspaceId, id, caller, input); tasks := r.store; r.result };
  public shared ({ caller }) func updateTaskStatus(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId, status : PTypes.TaskStatus) : async { #ok : PTypes.Task; #err : Text } {
    let r = ProjApi.updateTaskStatus(tasks, milestones, tenantId, workspaceId, id, status);
    tasks := r.taskStore;
    milestones := r.milestoneStore;
    r.result
  };
  public shared ({ caller }) func deleteTask(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : Bool; #err : Text } { let r = ProjApi.deleteTask(tasks, tenantId, workspaceId, id, caller); tasks := r.store; r.result };
  public shared ({ caller }) func createProjectFromTemplate(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, templateId : Text, projectName : Text, projectDescription : Text) : async { #ok : Common.EntityId; #err : Text } {
    let r = ProjApi.createProjectFromTemplate(projects, tasks, milestones, whiteboards, tenantId, workspaceId, caller, templateId, projectName, projectDescription);
    projects := r.projectStore;
    tasks := r.taskStore;
    milestones := r.milestoneStore;
    whiteboards := r.whiteboardStore;
    r.result
  };

  // Chat
  public shared ({ caller }) func createChannel(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : CTypes.ChannelInput) : async { #ok : CTypes.Channel; #err : Text } { let (res, s) = ChatApi.createChannel(channels, tenantId, workspaceId, caller, input); channels := s; res };
  public shared query ({ caller }) func getChannel(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : CTypes.Channel; #err : Text } { ChatApi.getChannel(channels, tenantId, workspaceId, id) };
  public shared query ({ caller }) func listChannels(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [CTypes.Channel] { ChatApi.listChannels(channels, tenantId, workspaceId, caller) };
  public shared ({ caller }) func joinChannel(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : CTypes.Channel; #err : Text } { let (res, s) = ChatApi.joinChannel(channels, tenantId, workspaceId, caller, id); channels := s; res };
  public shared ({ caller }) func leaveChannel(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : CTypes.Channel; #err : Text } { let (res, s) = ChatApi.leaveChannel(channels, tenantId, workspaceId, caller, id); channels := s; res };
  public shared ({ caller }) func deleteChannel(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : Bool; #err : Text } { let (res, s) = ChatApi.deleteChannel(channels, tenantId, workspaceId, caller, id); channels := s; res };
  public shared ({ caller }) func updateChannel(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, channelId : Common.EntityId, name : Text, description : Text, topic : Text) : async { #ok : CTypes.Channel; #err : Text } { let (res, s) = ChatApi.updateChannel(channels, tenantId, workspaceId, channelId, name, description, topic); channels := s; res };
  public shared ({ caller }) func updateChannelTopic(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, channelId : Common.EntityId, topic : Text) : async { #ok : CTypes.Channel; #err : Text } { let (res, s) = ChatApi.updateChannelTopic(channels, tenantId, workspaceId, channelId, topic); channels := s; res };
  public shared ({ caller }) func sendMessage(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : CTypes.MessageInput) : async { #ok : CTypes.Message; #err : Text } { let (res, ms, cs, ns) = ChatApi.sendMessage(channels, messages, threadNotifications, tenantId, workspaceId, caller, input); messages := ms; channels := cs; threadNotifications := ns; res };
  public shared query ({ caller }) func getMessages(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, channelId : Common.EntityId, limit : Nat, before : ?Common.Timestamp) : async [CTypes.Message] { ChatApi.getMessages(messages, tenantId, workspaceId, channelId, limit, before) };
  public shared query ({ caller }) func listMessages(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, channelId : Common.EntityId, limit : Nat, before : ?Common.Timestamp) : async [CTypes.Message] { ChatApi.listMessages(messages, tenantId, workspaceId, channelId, limit, before) };
  public shared ({ caller }) func deleteMessage(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : Bool; #err : Text } { let (res, s) = ChatApi.deleteMessage(messages, tenantId, workspaceId, caller, id); messages := s; res };
  public shared query ({ caller }) func getThreadMessages(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, parentMessageId : Common.EntityId) : async [CTypes.Message] { ChatApi.getThreadMessages(messages, tenantId, workspaceId, parentMessageId) };
  public shared query ({ caller }) func searchMessages(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, searchQuery : Text, channelId : ?Common.EntityId, senderId : ?Principal, fromTime : ?Int, toTime : ?Int) : async [CTypes.Message] { ChatApi.searchMessages(messages, tenantId, workspaceId, searchQuery, channelId, senderId, fromTime, toTime) };
  public shared ({ caller }) func addReaction(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, messageId : Common.EntityId, emoji : Text) : async { #ok : CTypes.Message; #err : Text } { let (res, s) = ChatApi.addReaction(messages, tenantId, workspaceId, messageId, emoji, caller); messages := s; res };
  public shared ({ caller }) func removeReaction(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, messageId : Common.EntityId, emoji : Text) : async { #ok : CTypes.Message; #err : Text } { let (res, s) = ChatApi.removeReaction(messages, tenantId, workspaceId, messageId, emoji, caller); messages := s; res };
  public shared ({ caller }) func pinMessage(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, channelId : Common.EntityId, messageId : Text) : async { #ok : CTypes.Channel; #err : Text } { let (res, s) = ChatApi.pinMessage(channels, tenantId, workspaceId, channelId, messageId); channels := s; res };
  public shared ({ caller }) func unpinMessage(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, channelId : Common.EntityId, messageId : Text) : async { #ok : CTypes.Channel; #err : Text } { let (res, s) = ChatApi.unpinMessage(channels, tenantId, workspaceId, channelId, messageId); channels := s; res };
  public shared query ({ caller }) func getChannelPins(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, channelId : Common.EntityId) : async [CTypes.Message] { ChatApi.getChannelPins(channels, messages, tenantId, workspaceId, channelId) };
  public shared ({ caller }) func setUserStatus(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, status : { #online; #away; #offline }, customStatus : Text) : async { #ok : CTypes.UserStatus; #err : Text } { let (res, s) = ChatApi.setUserStatus(statusStore, tenantId, workspaceId, caller, status, customStatus); statusStore := s; res };
  public shared ({ caller }) func updatePresence(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async { #ok : CTypes.UserStatus; #err : Text } { let (res, s) = ChatApi.updatePresence(statusStore, tenantId, workspaceId, caller); statusStore := s; res };
  public shared query ({ caller }) func getUserStatus(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, userId : Principal) : async ?CTypes.UserStatus { ChatApi.getUserStatus(statusStore, tenantId, workspaceId, userId) };
  public shared query ({ caller }) func listWorkspaceStatuses(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [CTypes.UserStatus] { ChatApi.listWorkspaceStatuses(statusStore, tenantId, workspaceId) };
  public shared ({ caller }) func markChannelRead(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, channelId : Common.EntityId) : async { #ok : Bool; #err : Text } { let (res, s) = ChatApi.markChannelRead(channels, tenantId, workspaceId, channelId, caller); channels := s; res };
  public shared query ({ caller }) func getUnreadCounts(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [(Text, Nat)] { ChatApi.getUnreadCounts(channels, tenantId, workspaceId, caller) };
  public shared ({ caller }) func createOrGetDMChannel(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, targetUserId : Common.UserId) : async { #ok : CTypes.Channel; #err : Text } { let (res, s) = ChatApi.createOrGetDMChannel(channels, tenantId, workspaceId, caller, targetUserId); channels := s; res };

  // Calendar
  public shared ({ caller }) func createEvent(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : CalTypes.EventInput) : async { #ok : CalTypes.Event; #err : Text } { let (res, s) = CalApi.createEvent(events, tenantId, workspaceId, caller, input); events := s; res };
  public shared query ({ caller }) func getEvent(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : CalTypes.Event; #err : Text } { CalApi.getEvent(events, tenantId, workspaceId, id) };
  public shared query ({ caller }) func listEvents(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, from : Common.Timestamp, to : Common.Timestamp) : async [CalTypes.Event] { CalApi.listEvents(events, tenantId, workspaceId, from, to) };
  public shared ({ caller }) func updateEvent(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId, input : CalTypes.EventInput) : async { #ok : CalTypes.Event; #err : Text } { let (res, s) = CalApi.updateEvent(events, tenantId, workspaceId, caller, id, input); events := s; res };
  public shared ({ caller }) func deleteEvent(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : Bool; #err : Text } { let (res, s) = CalApi.deleteEvent(events, tenantId, workspaceId, caller, id); events := s; res };
  public shared query ({ caller }) func listMyEvents(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [CalTypes.Event] { CalApi.listMyEvents(events, tenantId, workspaceId, caller) };
  public shared ({ caller }) func createCalendar(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : CalTypes.CalendarDefInput) : async { #ok : CalTypes.CalendarDef; #err : Text } { let (res, s) = CalApi.createCalendar(calendarDefs, tenantId, workspaceId, caller, input); calendarDefs := s; res };
  public shared query ({ caller }) func getCalendar(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : CalTypes.CalendarDef; #err : Text } { CalApi.getCalendar(calendarDefs, tenantId, workspaceId, id) };
  public shared query ({ caller }) func listCalendars(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, ownerId : ?Common.UserId) : async [CalTypes.CalendarDef] { CalApi.listCalendars(calendarDefs, tenantId, workspaceId, ownerId) };
  public shared ({ caller }) func updateCalendar(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId, input : CalTypes.CalendarDefInput) : async { #ok : CalTypes.CalendarDef; #err : Text } { let (res, s) = CalApi.updateCalendar(calendarDefs, tenantId, workspaceId, caller, id, input); calendarDefs := s; res };
  public shared ({ caller }) func deleteCalendar(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : Bool; #err : Text } { let (res, s) = CalApi.deleteCalendar(calendarDefs, tenantId, workspaceId, caller, id); calendarDefs := s; res };
  public shared ({ caller }) func respondToEvent(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : CalTypes.EventRsvpInput) : async { #ok : CalTypes.EventRsvp; #err : Text } { let (res, s) = CalApi.respondToEvent(eventRsvps, tenantId, workspaceId, caller, input); eventRsvps := s; res };
  public shared query ({ caller }) func getEventRsvps(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, eventId : Text) : async [CalTypes.EventRsvp] { CalApi.getEventRsvps(eventRsvps, tenantId, workspaceId, eventId) };
  public shared query ({ caller }) func listEventRsvps(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, userId : Common.UserId) : async [CalTypes.EventRsvp] { CalApi.listEventRsvps(eventRsvps, tenantId, workspaceId, userId) };
  public shared ({ caller }) func createEventException(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : CalTypes.EventExceptionInput) : async { #ok : CalTypes.EventException; #err : Text } { let (res, s) = CalApi.createEventException(eventExceptions, tenantId, workspaceId, caller, input); eventExceptions := s; res };
  public shared query ({ caller }) func getEventException(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : CalTypes.EventException; #err : Text } { CalApi.getEventException(eventExceptions, tenantId, workspaceId, id) };
  public shared query ({ caller }) func listEventExceptions(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, eventId : Text) : async [CalTypes.EventException] { CalApi.listEventExceptions(eventExceptions, tenantId, workspaceId, eventId) };
  public shared query ({ caller }) func getAvailability(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, userIds : [Common.UserId], date : Text, timeZone : Text) : async [CalTypes.AvailabilitySlot] { CalApi.getAvailability(events, tenantId, workspaceId, userIds, date, timeZone) };
  public shared query ({ caller }) func listProjectDeadlines(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [CalTypes.Event] { CalApi.listProjectDeadlines(events, tenantId, workspaceId) };

  // Payroll
  public shared ({ caller }) func addEmployee(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : PayTypes.EmployeeInput) : async { #ok : PayTypes.Employee; #err : Text } { switch (PayApi.addEmployee(employees, idCounter, tenantId, workspaceId, caller, input)) { case (#err e) #err e; case (#ok(v, s, n)) { employees := s; idCounter := n; #ok v } } };
  public shared query ({ caller }) func getEmployee(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : PayTypes.Employee; #err : Text } { PayApi.getEmployee(employees, tenantId, workspaceId, id) };
  public shared query ({ caller }) func listEmployees(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [PayTypes.Employee] { PayApi.listEmployees(employees, tenantId, workspaceId) };
  public shared ({ caller }) func updateEmployee(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId, input : PayTypes.EmployeeInput) : async { #ok : PayTypes.Employee; #err : Text } { switch (PayApi.updateEmployee(employees, tenantId, workspaceId, id, caller, input)) { case (#err e) #err e; case (#ok(v, s)) { employees := s; #ok v } } };
  public shared ({ caller }) func deactivateEmployee(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : PayTypes.Employee; #err : Text } { switch (PayApi.deactivateEmployee(employees, tenantId, workspaceId, id, caller)) { case (#err e) #err e; case (#ok(v, s)) { employees := s; #ok v } } };

  /// Process payroll for one employee — requires sufficient treasury balance.
  public shared ({ caller }) func processPayroll(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, employeeId : Common.EntityId, period : Text) : async { #ok : PayTypes.PayrollRecord; #err : Text } {
    let canisterPrincipal = Principal.fromActor(self);
    let wsSub = WalletLib.workspaceSubaccount(workspaceId);
    let treasuryBalance : Nat = try {
      let accountIdBlob = LedgerLib.deriveAccountId(canisterPrincipal, ?wsSub);
      let bal = await LedgerLib.icpLedger.account_balance({ account = accountIdBlob });
      Nat.fromNat64(bal.e8s)
    } catch (_) { 0 };
    switch (PayApi.processPayroll(employees, payrollRecords, payDeductions, payStubs, payAuditLog, idCounter, tenantId, workspaceId, caller, employeeId, period, treasuryBalance)) { case (#err e) #err e; case (#ok(v, rs, ss, al, n)) { payrollRecords := rs; payStubs := ss; payAuditLog := al; idCounter := n; #ok v } }
  };

  public shared query ({ caller }) func listPayrollRecords(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, employeeId : ?Common.EntityId) : async [PayTypes.PayrollRecord] { PayApi.listPayrollRecords(payrollRecords, tenantId, workspaceId, employeeId) };

  /// Bulk approve payroll records — sums all amounts and checks treasury balance once BEFORE approving.
  public shared ({ caller }) func bulkApprovePayroll(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, recordIds : [Common.EntityId]) : async { #ok : Bool; #err : Text } {
    let canisterPrincipal = Principal.fromActor(self);
    let wsSub = WalletLib.workspaceSubaccount(workspaceId);
    let treasuryBalance : Nat = try {
      let accountIdBlob = LedgerLib.deriveAccountId(canisterPrincipal, ?wsSub);
      let bal = await LedgerLib.icpLedger.account_balance({ account = accountIdBlob });
      Nat.fromNat64(bal.e8s)
    } catch (_) { 0 };
    switch (PayApi.bulkApprovePayroll(payrollRecords, payAuditLog, idCounter, tenantId, workspaceId, caller, recordIds, treasuryBalance)) { case (#err e) #err e; case (#ok(rs, al, n)) { payrollRecords := rs; payAuditLog := al; idCounter := n; #ok true } }
  };
  public shared ({ caller }) func rejectPayrollRecord(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, recordId : Common.EntityId, reason : Text) : async { #ok : PayTypes.PayrollRecord; #err : Text } { switch (PayApi.rejectPayrollRecord(payrollRecords, payAuditLog, idCounter, tenantId, workspaceId, caller, recordId, reason)) { case (#err e) #err e; case (#ok(v, rs, al, n)) { payrollRecords := rs; payAuditLog := al; idCounter := n; #ok v } } };
  public shared ({ caller }) func addContractor(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : PayTypes.ContractorInput) : async { #ok : PayTypes.Contractor; #err : Text } { switch (PayApi.addContractor(contractors, idCounter, tenantId, workspaceId, input)) { case (#err e) #err e; case (#ok(v, s, n)) { contractors := s; idCounter := n; #ok v } } };
  public shared query ({ caller }) func getContractor(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : PayTypes.Contractor; #err : Text } { PayApi.getContractor(contractors, tenantId, workspaceId, id) };
  public shared query ({ caller }) func listContractors(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [PayTypes.Contractor] { PayApi.listContractors(contractors, tenantId, workspaceId) };
  public shared ({ caller }) func updateContractor(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId, input : PayTypes.ContractorInput) : async { #ok : PayTypes.Contractor; #err : Text } { switch (PayApi.updateContractor(contractors, tenantId, workspaceId, id, input)) { case (#err e) #err e; case (#ok(v, s)) { contractors := s; #ok v } } };
  /// Add a contractor payment — requires sufficient treasury balance.
  public shared ({ caller }) func addContractorPayment(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : PayTypes.ContractorPaymentInput) : async { #ok : PayTypes.ContractorPayment; #err : Text } {
    let canisterPrincipal = Principal.fromActor(self);
    let wsSub = WalletLib.workspaceSubaccount(workspaceId);
    let treasuryBalance : Nat = try {
      let accountIdBlob = LedgerLib.deriveAccountId(canisterPrincipal, ?wsSub);
      let bal = await LedgerLib.icpLedger.account_balance({ account = accountIdBlob });
      Nat.fromNat64(bal.e8s)
    } catch (_) { 0 };
    if (treasuryBalance.toFloat() < input.amount) {
      return #err("Insufficient treasury balance. Please fund your workspace wallet before processing contractor payments.");
    };
    switch (PayApi.addContractorPayment(contractorPayments, idCounter, tenantId, workspaceId, input)) { case (#err e) #err e; case (#ok(v, s, n)) { contractorPayments := s; idCounter := n; #ok v } }
  };
  public shared query ({ caller }) func listContractorPayments(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, contractorId : ?Common.EntityId) : async [PayTypes.ContractorPayment] { PayApi.listContractorPayments(contractorPayments, tenantId, workspaceId, contractorId) };
  public shared ({ caller }) func addPaySchedule(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : PayTypes.PayScheduleInput) : async { #ok : PayTypes.PaySchedule; #err : Text } { switch (PayApi.addPaySchedule(paySchedules, idCounter, tenantId, workspaceId, input)) { case (#err e) #err e; case (#ok(v, s, n)) { paySchedules := s; idCounter := n; #ok v } } };
  public shared query ({ caller }) func listPaySchedules(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [PayTypes.PaySchedule] { PayApi.listPaySchedules(paySchedules, tenantId, workspaceId) };
  public shared ({ caller }) func addDeduction(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : PayTypes.DeductionInput) : async { #ok : PayTypes.Deduction; #err : Text } { switch (PayApi.addDeduction(payDeductions, idCounter, tenantId, workspaceId, input)) { case (#err e) #err e; case (#ok(v, s, n)) { payDeductions := s; idCounter := n; #ok v } } };
  public shared query ({ caller }) func listDeductions(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, employeeId : ?Common.EntityId) : async [PayTypes.Deduction] { PayApi.listDeductions(payDeductions, tenantId, workspaceId, employeeId) };
  public shared ({ caller }) func updateDeduction(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId, isActive : Bool, amount : Float) : async { #ok : PayTypes.Deduction; #err : Text } { switch (PayApi.updateDeduction(payDeductions, tenantId, workspaceId, id, isActive, amount)) { case (#err e) #err e; case (#ok(v, s)) { payDeductions := s; #ok v } } };
  public shared ({ caller }) func addBenefit(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : PayTypes.BenefitInput) : async { #ok : PayTypes.Benefit; #err : Text } { switch (PayApi.addBenefit(payBenefits, idCounter, tenantId, workspaceId, input)) { case (#err e) #err e; case (#ok(v, s, n)) { payBenefits := s; idCounter := n; #ok v } } };
  public shared query ({ caller }) func listBenefits(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, employeeId : ?Common.EntityId) : async [PayTypes.Benefit] { PayApi.listBenefits(payBenefits, tenantId, workspaceId, employeeId) };
  public shared query ({ caller }) func listPayStubs(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, employeeId : ?Common.EntityId) : async [PayTypes.PayStub] { PayApi.listPayStubs(payStubs, tenantId, workspaceId, employeeId) };
  /// Add an off-cycle payment — requires non-zero treasury balance before processing.
  public shared ({ caller }) func addOffCyclePayment(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : PayTypes.OffCyclePaymentInput) : async { #ok : PayTypes.OffCyclePayment; #err : Text } {
    let canisterPrincipal = Principal.fromActor(self);
    let wsSub = WalletLib.workspaceSubaccount(workspaceId);
    let treasuryBalance : Nat = try {
      let accountIdBlob = LedgerLib.deriveAccountId(canisterPrincipal, ?wsSub);
      let bal = await LedgerLib.icpLedger.account_balance({ account = accountIdBlob });
      Nat.fromNat64(bal.e8s)
    } catch (_) { 0 };
    if (treasuryBalance == 0) {
      return #err("Insufficient treasury balance. Please fund your workspace wallet before creating off-cycle payments.");
    };
    if (input.processImmediately and treasuryBalance.toFloat() < input.amount) {
      return #err("Insufficient treasury balance to process this off-cycle payment immediately.");
    };
    switch (PayApi.addOffCyclePayment(offCyclePayments, idCounter, tenantId, workspaceId, input)) { case (#err e) #err e; case (#ok(v, s, n)) { offCyclePayments := s; idCounter := n; #ok v } }
  };
  public shared query ({ caller }) func listOffCyclePayments(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, employeeId : ?Common.EntityId) : async [PayTypes.OffCyclePayment] { PayApi.listOffCyclePayments(offCyclePayments, tenantId, workspaceId, employeeId) };
  public shared query ({ caller }) func listPayrollAuditLog(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, limit : Nat) : async [PayTypes.AuditLogEntry] { PayApi.listPayrollAuditLog(payAuditLog, tenantId, workspaceId, limit) };

  // Escrow
  /// Create an escrow — requires the caller (payer) to have a non-zero wallet balance (personal or treasury).
  /// Checks the caller's personal ICP/ckBTC balance > 0 BEFORE creating the record.
  /// The actual funding is done via depositEscrow (ICRC-2) or fundEscrow (direct transfer).
  public shared ({ caller }) func createEscrow(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : EscTypes.EscrowInput) : async { #ok : EscTypes.EscrowContract; #err : Text } {
    // Balance gate: check caller's personal wallet balance > 0 to prevent zero-balance users from creating escrows
    let callerBalance : Nat = try {
      if (input.currency == "ckBTC") {
        await LedgerLib.ckBTCLedger.icrc1_balance_of({ owner = caller; subaccount = null })
      } else {
        let accountIdBlob = LedgerLib.deriveAccountId(caller, null);
        let bal = await LedgerLib.icpLedger.account_balance({ account = accountIdBlob });
        Nat.fromNat64(bal.e8s)
      }
    } catch (_) { 0 };
    if (callerBalance == 0) {
      return #err("Insufficient balance. Please fund your wallet before creating an escrow.");
    };
    switch (EscApi.createEscrow(escrowContracts, idCounter, tenantId, workspaceId, caller, input)) { case (#err e) #err e; case (#ok(v, s, n)) { escrowContracts := s; idCounter := n; #ok v } }
  };
  public shared query ({ caller }) func getEscrow(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : EscTypes.EscrowContract; #err : Text } { EscApi.getEscrow(escrowContracts, tenantId, workspaceId, id) };
  public shared query ({ caller }) func listEscrows(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, filter : ?EscTypes.EscrowFilter) : async [EscTypes.EscrowContract] { EscApi.listEscrows(escrowContracts, tenantId, workspaceId, caller, filter) };

  /// Fund an escrow from the caller's personal wallet via direct ledger transfer.
  /// State-before-transfer: transitions escrow to #Funded in state BEFORE the async ledger call.
  /// On ledger failure, the contract remains #Funded in state — the admin can refund or resolve.
  /// For ICRC-2 approve/transfer_from flow, use depositEscrow instead.
  public shared ({ caller }) func fundEscrow(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : EscTypes.EscrowContract; #err : Text } {
    let maybeContract = EscApi.getEscrow(escrowContracts, tenantId, workspaceId, id);
    switch (maybeContract) {
      case (#err e) { #err e };
      case (#ok contract) {
        if (contract.payerId != caller) {
          return #err("Only the payer can fund this escrow.");
        };
        if (contract.status != #Pending) {
          return #err("Escrow must be in Pending status to fund.");
        };
        // Check caller's personal balance covers the escrow amount
        let callerBalance : Nat = try {
          if (contract.currency == "ckBTC") {
            await LedgerLib.ckBTCLedger.icrc1_balance_of({ owner = caller; subaccount = null })
          } else {
            let accountIdBlob = LedgerLib.deriveAccountId(caller, null);
            let bal = await LedgerLib.icpLedger.account_balance({ account = accountIdBlob });
            Nat.fromNat64(bal.e8s)
          }
        } catch (_) { 0 };
        if (callerBalance < contract.amount) {
          return #err("Insufficient balance to fund this escrow.");
        };
        // Protection 1 (state-before-transfer): record funded amount in state BEFORE the ledger call
        // Use fundedAmount to record the amount being transferred
        switch (EscApi.fundEscrow(escrowContracts, tenantId, workspaceId, id, caller)) {
          case (#err e) { #err e };
          case (#ok(fundedContract, fundedContracts)) {
            escrowContracts := fundedContracts;
            // Protection 2: unique memo per transfer
            txMemoCounter += 1;
            let uniqueMemo = txMemoCounter;
            let canisterPrincipal = Principal.fromActor(self);
            let wsSub = WalletLib.workspaceSubaccount(workspaceId);
            try {
              if (contract.currency == "ckBTC") {
                let memoBlob : Blob = uniqueMemo.toText().encodeUtf8();
                let result = await LedgerLib.ckBTCLedger.icrc1_transfer({
                  to = { owner = canisterPrincipal; subaccount = ?wsSub };
                  amount = contract.amount;
                  fee = null;
                  memo = ?memoBlob;
                  from_subaccount = null;
                  created_at_time = ?Int.abs(Time.now()).toNat64();
                });
                switch (result) {
                  case (#Ok blockHeight) {
                    // Record block height on the funded contract
                    let finalContracts = escrowContracts.map(func((k, c)) {
                      if (k == id) (k, { c with fundedAmount = ?contract.amount; fundingBlockHeight = ?blockHeight })
                      else (k, c)
                    });
                    escrowContracts := finalContracts;
                    #ok({ fundedContract with fundedAmount = ?contract.amount; fundingBlockHeight = ?blockHeight })
                  };
                  case (#Err transferErr) {
                    #err("ckBTC transfer failed: " # LedgerLib.icrc1TransferErrorText(transferErr))
                  };
                }
              } else {
                let treasuryAccountBlob = LedgerLib.deriveAccountId(canisterPrincipal, ?wsSub);
                let result = await LedgerLib.icpLedger.transfer({
                  to = treasuryAccountBlob;
                  amount = { e8s = contract.amount.toNat64() };
                  fee = { e8s = (10_000 : Nat64) };
                  memo = uniqueMemo;
                  from_subaccount = null;
                  created_at_time = ?{ timestamp_nanos = Int.abs(Time.now()).toNat64() };
                });
                switch (result) {
                  case (#Ok blockHeight) {
                    let bh = Nat.fromNat64(blockHeight);
                    let finalContracts = escrowContracts.map(func((k, c)) {
                      if (k == id) (k, { c with fundedAmount = ?contract.amount; fundingBlockHeight = ?bh })
                      else (k, c)
                    });
                    escrowContracts := finalContracts;
                    #ok({ fundedContract with fundedAmount = ?contract.amount; fundingBlockHeight = ?bh })
                  };
                  case (#Err transferErr) {
                    #err("ICP transfer failed: " # LedgerLib.icpTransferErrorText(transferErr))
                  };
                }
              }
            } catch (_) {
              #err("Ledger call failed — escrow is marked Funded in state but on-chain transfer was not confirmed. Use depositEscrow (ICRC-2) for a safer flow.")
            }
          };
        };
      };
    }
  };
  /// Release a funded escrow — transfers funds from workspace treasury to the payee via real ledger.
  /// State-before-transfer: transitions escrow to #Released in state BEFORE the async ledger call.
  /// On ledger failure, escrow remains #Released in state — admin must resolve manually.
  public shared ({ caller }) func releaseEscrow(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : EscTypes.EscrowContract; #err : Text } {
    let maybeContract = EscApi.getEscrow(escrowContracts, tenantId, workspaceId, id);
    switch (maybeContract) {
      case (#err e) { #err e };
      case (#ok contract) {
        if (contract.payeeId != caller) {
          return #err("Only the payee can release this escrow.");
        };
        if (contract.status != #Funded) {
          return #err("Escrow must be Funded to release.");
        };
        // Protection 1 (state-before-transfer): mark #Released in state BEFORE async ledger call
        switch (EscApi.releaseEscrow(escrowContracts, tenantId, workspaceId, id, caller)) {
          case (#err e) { #err e };
          case (#ok(releasedContract, releasedContracts)) {
            escrowContracts := releasedContracts;
            // Determine release amount
            let releaseAmount = switch (contract.fundedAmount) {
              case (?fa) fa;
              case null contract.amount;
            };
            if (releaseAmount == 0) { return #ok releasedContract };
            // Protection 2: unique memo per transfer
            txMemoCounter += 1;
            let uniqueMemo = txMemoCounter;
            let canisterPrincipal = Principal.fromActor(self);
            let wsSub = WalletLib.workspaceSubaccount(workspaceId);
            try {
              if (contract.currency == "ckBTC") {
                let memoBlob : Blob = uniqueMemo.toText().encodeUtf8();
                let result = await LedgerLib.ckBTCLedger.icrc1_transfer({
                  to = { owner = contract.payeeId; subaccount = null };
                  amount = releaseAmount;
                  fee = null;
                  memo = ?memoBlob;
                  from_subaccount = ?wsSub;
                  created_at_time = ?Int.abs(Time.now()).toNat64();
                });
                switch (result) {
                  case (#Ok _) { #ok releasedContract };
                  case (#Err e) { #err("Release transfer failed: " # LedgerLib.icrc1TransferErrorText(e)) };
                }
              } else {
                let payeeAccountBlob = LedgerLib.deriveAccountId(contract.payeeId, null);
                let result = await LedgerLib.icpLedger.transfer({
                  to = payeeAccountBlob;
                  amount = { e8s = releaseAmount.toNat64() };
                  fee = { e8s = (10_000 : Nat64) };
                  memo = uniqueMemo;
                  from_subaccount = ?wsSub;
                  created_at_time = ?{ timestamp_nanos = Int.abs(Time.now()).toNat64() };
                });
                switch (result) {
                  case (#Ok _) { #ok releasedContract };
                  case (#Err e) { #err("Release transfer failed: " # LedgerLib.icpTransferErrorText(e)) };
                }
              }
            } catch (_) {
              #err("Ledger call failed — escrow is marked Released in state but on-chain transfer was not confirmed. Contact support.")
            }
          };
        };
      };
    }
  };
  public shared ({ caller }) func disputeEscrow(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : EscTypes.EscrowContract; #err : Text } { switch (EscApi.disputeEscrow(escrowContracts, tenantId, workspaceId, id, caller)) { case (#err e) #err e; case (#ok(v, s)) { escrowContracts := s; #ok v } } };
  public shared ({ caller }) func cancelEscrow(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : EscTypes.EscrowContract; #err : Text } { switch (EscApi.cancelEscrow(escrowContracts, tenantId, workspaceId, id, caller)) { case (#err e) #err e; case (#ok(v, s)) { escrowContracts := s; #ok v } } };

  /// Refund a funded or disputed escrow back to the payer via the real ICP ledger.
  /// State-before-transfer: escrow is cancelled in state BEFORE the async ledger call.
  /// If the ledger transfer fails, escrow state is already cancelled — caller must retry or resolve manually.
  public shared ({ caller }) func refundEscrow(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : EscTypes.EscrowContract; #err : Text } {
    // Look up the escrow to verify status and get amount
    let maybeContract = EscApi.getEscrow(escrowContracts, tenantId, workspaceId, id);
    switch (maybeContract) {
      case (#err e) { #err e };
      case (#ok contract) {
        if (contract.payerId != caller) {
          return #err("Only the payer can refund this escrow.");
        };
        if (contract.status != #Funded and contract.status != #Disputed) {
          return #err("Escrow must be Funded or Disputed to refund.");
        };
        // Protection 1: update state to #Cancelled BEFORE the async ledger call
        switch (EscApi.refundEscrow(escrowContracts, tenantId, workspaceId, id, caller, ?"Refunded by payer")) {
          case (#err e) { #err e };
          case (#ok(updatedContract, updatedContracts)) {
            escrowContracts := updatedContracts;
            // Determine refund amount (use fundedAmount if available, otherwise agreed amount)
            let refundAmount = switch (updatedContract.fundedAmount) {
              case (?fa) fa;
              case null updatedContract.amount;
            };
            if (refundAmount == 0) { return #ok updatedContract };
            // Execute on-chain refund to payer
            txMemoCounter += 1;
            let uniqueMemo = txMemoCounter;
            try {
              if (updatedContract.currency == "ckBTC") {
                let memoBlob : Blob = uniqueMemo.toText().encodeUtf8();
                let result = await LedgerLib.ckBTCLedger.icrc1_transfer({
                  to = { owner = contract.payerId; subaccount = null };
                  amount = refundAmount;
                  fee = null;
                  memo = ?memoBlob;
                  from_subaccount = ?WalletLib.workspaceSubaccount(workspaceId);
                  created_at_time = ?Int.abs(Time.now()).toNat64();
                });
                switch (result) {
                  case (#Ok _) { #ok updatedContract };
                  case (#Err e) { #err("Refund transfer failed: " # LedgerLib.icrc1TransferErrorText(e)) };
                }
              } else {
                let payerAccountBlob = LedgerLib.deriveAccountId(contract.payerId, null);
                let result = await LedgerLib.icpLedger.transfer({
                  to = payerAccountBlob;
                  amount = { e8s = refundAmount.toNat64() };
                  fee = { e8s = (10_000 : Nat64) };
                  memo = uniqueMemo;
                  from_subaccount = ?WalletLib.workspaceSubaccount(workspaceId);
                  created_at_time = ?{ timestamp_nanos = Int.abs(Time.now()).toNat64() };
                });
                switch (result) {
                  case (#Ok _) { #ok updatedContract };
                  case (#Err e) { #err("Refund transfer failed: " # LedgerLib.icpTransferErrorText(e)) };
                }
              }
            } catch (_) {
              #err("Ledger call failed — escrow state is cancelled but on-chain refund was not completed. Contact support.")
            }
          };
        };
      };
    }
  };

  /// Deposit funds into an escrow using the ICRC-2 approve/transfer_from pattern (Protection 3).
  /// Flow: caller must first call icrc2_approve on the ICP or ckBTC ledger to authorize
  /// this canister to pull `contract.amount` tokens. Then call this method to execute the pull.
  /// On success: sets escrow status to #Funded with actual funded amount and block height.
  /// On failure: escrow remains #Pending, caller can retry after re-approving.
  public shared ({ caller }) func depositEscrow(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : EscTypes.EscrowContract; #err : Text } {
    // Look up the escrow to get amount and currency
    let maybeContract = EscApi.getEscrow(escrowContracts, tenantId, workspaceId, id);
    switch (maybeContract) {
      case (#err e) { #err e };
      case (#ok contract) {
        if (contract.payerId != caller) {
          return #err("Only the payer can deposit funds into this escrow");
        };
        if (contract.status != #Pending) {
          return #err("Escrow is not in Pending status — already funded or cancelled");
        };
        // Determine which ledger to use based on currency
        let ledgerCanisterId : Principal = if (contract.currency == "ckBTC") {
          LedgerLib.ckBTCLedgerCanisterId()
        } else {
          // Default to ICP for "ICP" and any other currency
          LedgerLib.icpLedgerCanisterId()
        };
        // The canister treasury receives the funds: use canister principal + workspace subaccount
        let canisterPrincipal = Principal.fromActor(self);
        let wsSub = WalletLib.workspaceSubaccount(workspaceId);
        // Protection 2: unique memo per deposit
        txMemoCounter += 1;
        let uniqueMemo = txMemoCounter;
        let memoBlob : Blob = uniqueMemo.toText().encodeUtf8();
        try {
          let result = await LedgerLib.icrc2TransferFrom(
            ledgerCanisterId,
            caller,           // from: the payer who approved
            null,             // from_subaccount: default
            canisterPrincipal, // to: the canister treasury
            ?wsSub,           // to_subaccount: workspace-specific treasury subaccount
            contract.amount,
            ?memoBlob,
          );
          switch (result) {
            case (#Ok blockHeight) {
              // Record the deposit: set status to #Funded with actual amount and block height
              switch (EscApi.depositEscrow(escrowContracts, tenantId, workspaceId, id, caller, contract.amount, blockHeight)) {
                case (#err e) { #err("Transfer succeeded but failed to update escrow state: " # e) };
                case (#ok(v, s)) { escrowContracts := s; #ok v };
              }
            };
            case (#Err transferErr) {
              #err("ICRC-2 deposit failed: " # LedgerLib.icrc2TransferFromErrorText(transferErr))
            };
          }
        } catch (_e) {
          #err("Ledger call failed — deposit not executed. Ensure you have approved the canister via icrc2_approve first.")
        }
      };
    }
  };
  public shared ({ caller }) func addEscrowMilestone(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, escrowId : Common.EntityId, input : EscTypes.EscrowMilestoneInput) : async { #ok : EscTypes.EscrowMilestone; #err : Text } { switch (EscApi.addEscrowMilestone(escrowMilestones, idCounter, tenantId, workspaceId, escrowId, input)) { case (#err e) #err e; case (#ok(v, s, n)) { escrowMilestones := s; idCounter := n; #ok v } } };
  public shared ({ caller }) func updateEscrowMilestone(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, milestoneId : Common.EntityId, input : EscTypes.EscrowMilestoneInput) : async { #ok : EscTypes.EscrowMilestone; #err : Text } { switch (EscApi.updateEscrowMilestone(escrowMilestones, tenantId, workspaceId, milestoneId, input)) { case (#err e) #err e; case (#ok(v, s)) { escrowMilestones := s; #ok v } } };
  public shared ({ caller }) func approveMilestone(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, milestoneId : Common.EntityId) : async { #ok : EscTypes.EscrowMilestone; #err : Text } { switch (EscApi.approveMilestone(escrowContracts, escrowMilestones, tenantId, workspaceId, milestoneId, caller)) { case (#err e) #err e; case (#ok(v, s)) { escrowMilestones := s; #ok v } } };
  public shared ({ caller }) func rejectMilestone(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, milestoneId : Common.EntityId) : async { #ok : EscTypes.EscrowMilestone; #err : Text } { switch (EscApi.rejectMilestone(escrowContracts, escrowMilestones, tenantId, workspaceId, milestoneId, caller)) { case (#err e) #err e; case (#ok(v, s)) { escrowMilestones := s; #ok v } } };

  /// Release milestone funds via the real ICP ledger.
  /// Protection 1 (state-before-transfer): sets milestone to #Releasing BEFORE the async ledger call.
  /// Protection 2 (unique memo): increments txMemoCounter and passes it as the ICP transfer memo.
  /// On ledger success: marks milestone #Released with block height.
  /// On ledger failure: reverts milestone back to #Approved so it can be retried.
  public shared ({ caller }) func releaseMilestoneFunds(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, milestoneId : Common.EntityId) : async { #ok : EscTypes.EscrowMilestone; #err : Text } {
    // Find the milestone and its parent escrow
    let maybeMilestone = EscLib.getMilestone(escrowMilestones, tenantId, workspaceId, milestoneId);
    switch (maybeMilestone) {
      case null { #err("Milestone not found") };
      case (?milestone) {
        if (milestone.status != #Approved) {
          return #err("Milestone is not approved — cannot release funds");
        };
        // Find escrow contract for this milestone
        let maybeContract = escrowContracts.find(
          func((k, c)) { k == milestone.escrowId and c.tenantId == tenantId and c.workspaceId == workspaceId },
        );
        switch (maybeContract) {
          case null { #err("Escrow contract not found") };
          case (?(_, contract)) {
            // Protection 1: set #Releasing in stable state BEFORE the async ledger call
            switch (EscLib.setMilestoneReleasing(escrowMilestones, tenantId, workspaceId, milestoneId)) {
              case null { #err("Failed to set milestone to Releasing state") };
              case (?(_, releasingMilestones)) {
                escrowMilestones := releasingMilestones;
                // Protection 2: unique memo per transfer — prevents duplicate execution on retry
                txMemoCounter += 1;
                let uniqueMemo = txMemoCounter;
                // Derive payee account ID for ICP transfer
                let payeeAccountBlob = LedgerLib.deriveAccountId(contract.payeeId, null);
                try {
                  let result = await LedgerLib.icpLedger.transfer({
                    to = payeeAccountBlob;
                    amount = { e8s = milestone.amount.toNat64() };
                    fee = { e8s = (10_000 : Nat64) };
                    memo = uniqueMemo;                                          // Protection 2: unique memo
                    from_subaccount = null;
                    created_at_time = ?{ timestamp_nanos = Int.abs(Time.now()).toNat64() };  // Protection 2: dedup window
                  });
                  switch (result) {
                    case (#Ok blockHeight) {
                      // Success: finalize as #Released with block height
                      switch (EscLib.releaseMilestoneFundsWithBlock(escrowMilestones, tenantId, workspaceId, milestoneId, Nat.fromNat64(blockHeight))) {
                        case null { #err("Failed to update milestone state after ledger transfer") };
                        case (?(m, updated)) {
                          escrowMilestones := updated;
                          #ok m
                        };
                      }
                    };
                    case (#Err transferErr) {
                      // Protection 1: revert to #Approved so caller can retry
                      escrowMilestones := EscLib.revertMilestoneReleasing(escrowMilestones, tenantId, workspaceId, milestoneId);
                      #err("ICP transfer failed: " # LedgerLib.icpTransferErrorText(transferErr))
                    };
                  }
                } catch (_e) {
                  // Protection 1: on trap/exception, revert to #Approved so caller can retry
                  escrowMilestones := EscLib.revertMilestoneReleasing(escrowMilestones, tenantId, workspaceId, milestoneId);
                  #err("ICP ledger call failed — funds not transferred, milestone reverted to Approved")
                }
              };
            }
          };
        }
      };
    }
  };
  public shared query ({ caller }) func listEscrowMilestones(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, escrowId : Common.EntityId) : async [EscTypes.EscrowMilestone] { EscApi.listEscrowMilestones(escrowMilestones, tenantId, workspaceId, escrowId) };
  public shared ({ caller }) func raiseEscrowDispute(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, escrowId : Common.EntityId, reason : Text) : async { #ok : EscTypes.EscrowDispute; #err : Text } { switch (EscApi.raiseEscrowDispute(escrowDisputes, idCounter, tenantId, workspaceId, escrowId, caller, reason)) { case (#err e) #err e; case (#ok(v, s, n)) { escrowDisputes := s; idCounter := n; #ok v } } };
  public shared ({ caller }) func assignArbiter(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, disputeId : Common.EntityId, arbiter : Principal) : async { #ok : EscTypes.EscrowDispute; #err : Text } { switch (EscApi.assignArbiter(escrowDisputes, tenantId, workspaceId, disputeId, arbiter)) { case (#err e) #err e; case (#ok(v, s)) { escrowDisputes := s; #ok v } } };
  /// Resolve a dispute — updates dispute status and also marks the parent escrow as #Cancelled.
  /// All workspace members can see the updated escrow status after resolution.
  public shared ({ caller }) func resolveDispute(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, disputeId : Common.EntityId, resolution : Text) : async { #ok : EscTypes.EscrowDispute; #err : Text } {
    switch (EscApi.resolveDispute(escrowDisputes, tenantId, workspaceId, disputeId, resolution)) {
      case (#err e) { #err e };
      case (#ok(resolvedDispute, updatedDisputes)) {
        escrowDisputes := updatedDisputes;
        // Also update the parent escrow contract status to #Cancelled (dispute settled) so workspace members can see it
        let now = Time.now();
        escrowContracts := escrowContracts.map(func((k, c)) {
          if (k == resolvedDispute.escrowId and c.tenantId == tenantId and c.workspaceId == workspaceId and c.status == #Disputed) {
            let entry : EscTypes.StatusHistoryEntry = {
              status = #Cancelled;
              timestamp = now;
              changedBy = caller;
              note = ?("Dispute resolved: " # resolution);
            };
            (k, { c with status = #Cancelled; statusHistory = c.statusHistory.concat([entry]); updatedAt = now })
          } else { (k, c) }
        });
        #ok resolvedDispute
      };
    }
  };
  public shared query ({ caller }) func getEscrowDispute(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, disputeId : Common.EntityId) : async { #ok : EscTypes.EscrowDispute; #err : Text } { EscApi.getEscrowDispute(escrowDisputes, tenantId, workspaceId, disputeId) };
  public shared query ({ caller }) func listEscrowDisputes(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, escrowId : Common.EntityId) : async [EscTypes.EscrowDispute] { EscApi.listEscrowDisputes(escrowDisputes, tenantId, workspaceId, escrowId) };
  public shared query ({ caller }) func getEscrowSummary(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : EscTypes.EscrowSummary; #err : Text } { EscApi.getEscrowSummary(escrowContracts, escrowMilestones, tenantId, workspaceId, id) };

  // Wallet
  public shared ({ caller }) func createWalletAccount(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, displayName : Text) : async { #ok : WalTypes.WalletAccount; #err : Text } { switch (WalletApi.createWalletAccount(walletAccounts, tenantId, workspaceId, caller, displayName)) { case (#err e) #err e; case (#ok(v, s)) { walletAccounts := s; #ok v } } };
  public shared ({ caller }) func createWorkspaceTreasury(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async { #ok : WalTypes.WalletAccount; #err : Text } { switch (WalletApi.createWorkspaceTreasury(walletAccounts, tenantId, workspaceId, caller, Principal.fromActor(self))) { case (#err e) #err e; case (#ok(v, s)) { walletAccounts := s; #ok v } } };
  public shared query ({ caller }) func getWalletAccount(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : WalTypes.WalletAccount; #err : Text } { WalletApi.getWalletAccount(walletAccounts, tenantId, workspaceId, id) };

  /// Returns wallet account with LIVE ICP and ckBTC balances from the real ledger.
  /// Includes lazy migration: if stored accountId is not a valid 64-char hex, re-derives it.
  public shared ({ caller }) func getMyWalletAccount(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async ?WalTypes.WalletAccount {
    switch (WalletApi.getMyWalletAccount(walletAccounts, tenantId, workspaceId, caller)) {
      case null null;
      case (?account) {
        // Lazy migration: re-derive accountId if:
        // (a) stored value is malformed (not 64 hex chars), OR
        // (b) principalId doesn't match caller — means account was stored with wrong principal
        let personalNeedsMigration = account.accountId.size() != 64 or account.principalId != caller.toText();
        let migratedAccount = if (personalNeedsMigration) {
          // Personal wallet always uses null (all-zeros) subaccount
          let correctedAccountIdBlob = LedgerLib.deriveAccountId(caller, null);
          let correctedAccountId = LedgerLib.accountIdToHex(correctedAccountIdBlob);
          let correctedIcrc1 = LedgerLib.formatIcrc1Account(caller, null);
          let corrected = { account with
            accountId = correctedAccountId;
            icrc1Account = correctedIcrc1;
            principalId = caller.toText();
          };
          walletAccounts := walletAccounts.map(func((k, a)) {
            if (k == account.id) (k, corrected) else (k, a)
          });
          corrected
        } else { account };

        // Derive account ID blob for ICP ledger query (personal: null subaccount)
        let accountIdBlob = LedgerLib.deriveAccountId(caller, null);
        let icpBalance : Nat = try {
          let bal = await LedgerLib.icpLedger.account_balance({ account = accountIdBlob });
          Nat.fromNat64(bal.e8s)
        } catch (_) { migratedAccount.icpBalance };
        let btcBalance : Nat = try {
          await LedgerLib.ckBTCLedger.icrc1_balance_of({ owner = caller; subaccount = null })
        } catch (_) { migratedAccount.btcBalance };
        let updated = { migratedAccount with icpBalance; btcBalance };
        // Persist updated balances
        walletAccounts := walletAccounts.map(func((k, a)) {
          if (k == migratedAccount.id) (k, updated) else (k, a)
        });
        ?updated
      };
    }
  };

  /// Returns workspace treasury account with LIVE ICP and ckBTC balances from the real ledger.
  /// Treasury address is derived from the CANISTER's own principal + workspace subaccount,
  /// guaranteeing it is always distinct from any user's personal wallet address.
  /// Includes lazy migration: if stored accountId is not a valid 64-char hex, re-derives it
  /// using the canister principal + workspace subaccount (the correct treasury derivation).
  public shared ({ caller }) func getWorkspaceTreasury(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async ?WalTypes.WalletAccount {
    switch (WalletApi.getWorkspaceTreasury(walletAccounts, tenantId, workspaceId)) {
      case null null;
      case (?account) {
        // Treasury address owner is the CANISTER, not the user who created it
        let canisterPrincipal = Principal.fromActor(self);
        // Treasury MUST use the workspace-derived subaccount — NOT null
        let wsSub = WalletLib.workspaceSubaccount(workspaceId);
        let wsSubBytes = wsSub.toArray();

        // Lazy migration: re-derive accountId if:
        // (a) stored value is malformed (not 64 hex chars), OR
        // (b) principalId does not match the canister principal — meaning old code derived
        //     the treasury from the caller/user principal instead of the canister principal.
        // This covers both the legacy "defaultprincipal#personal" strings AND the case where
        // a 64-char hex was generated but from the WRONG (user) principal.
        let needsMigration = account.accountId.size() != 64 or account.principalId != canisterPrincipal.toText();
        let migratedAccount = if (needsMigration) {
          // Correct derivation: canister principal + workspace subaccount (NOT the user principal)
          let correctedAccountIdBlob = LedgerLib.deriveAccountId(canisterPrincipal, ?wsSub);
          let correctedAccountId = LedgerLib.accountIdToHex(correctedAccountIdBlob);
          let correctedIcrc1 = LedgerLib.formatIcrc1Account(canisterPrincipal, ?wsSubBytes);
          let corrected = { account with
            accountId = correctedAccountId;
            icrc1Account = correctedIcrc1;
            principalId = canisterPrincipal.toText();
          };
          walletAccounts := walletAccounts.map(func((k, a)) {
            if (k == account.id) (k, corrected) else (k, a)
          });
          corrected
        } else { account };

        // Query ICP balance using canister principal + workspace-derived subaccount
        let accountIdBlob = LedgerLib.deriveAccountId(canisterPrincipal, ?wsSub);
        let icpBalance : Nat = try {
          let bal = await LedgerLib.icpLedger.account_balance({ account = accountIdBlob });
          Nat.fromNat64(bal.e8s)
        } catch (_) { migratedAccount.icpBalance };
        // Query ckBTC balance using canister principal + workspace-derived subaccount
        let btcBalance : Nat = try {
          await LedgerLib.ckBTCLedger.icrc1_balance_of({ owner = canisterPrincipal; subaccount = ?wsSub })
        } catch (_) { migratedAccount.btcBalance };
        let updated = { migratedAccount with icpBalance; btcBalance };
        walletAccounts := walletAccounts.map(func((k, a)) {
          if (k == migratedAccount.id) (k, updated) else (k, a)
        });
        ?updated
      };
    }
  };

  public shared query ({ caller }) func getReceiveAddress(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, accountId : Common.EntityId) : async { #ok : Text; #err : Text } { WalletApi.getReceiveAddress(walletAccounts, tenantId, workspaceId, accountId) };

  /// Send ICP or ckBTC via the real on-chain ledger.
  /// For ICP: calls icpLedger.transfer() with standard fee of 10_000 e8s.
  /// For ckBTC: calls ckBTCLedger.icrc1_transfer() to recipient principal.
  /// On ledger error: returns #err — transaction is NOT recorded.
  public shared ({ caller }) func sendAsset(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, accountId : Common.EntityId, asset : WalTypes.AssetType, amount : Nat, toAddress : Text, memo : ?Text, requiredApprovals : Nat) : async { #ok : WalTypes.WalletTransaction; #err : Text } {
    // If multi-sig approval is required, queue without ledger call
    if (requiredApprovals > 0) {
      switch (WalletApi.sendAsset(walletAccounts, walletTxs, tenantId, workspaceId, caller, accountId, asset, amount, toAddress, memo, requiredApprovals)) {
        case (#err e) #err e;
        case (#ok(v, sa, st)) { walletAccounts := sa; walletTxs := st; #ok v }
      }
    } else {
      // Protection 2: increment memo counter BEFORE ledger call for deduplication
      txMemoCounter += 1;
      let uniqueMemo = txMemoCounter;
      // Prepare transaction record (status = #Pending) — recorded in stable state BEFORE ledger call
      switch (WalletLib.prepareSendAsset(walletAccounts, walletTxs, tenantId, workspaceId, caller, accountId, asset, amount, toAddress, memo, 0, uniqueMemo)) {
        case (#err e) #err e;
        case (#ok(tx, account, updatedAccounts, updatedTxs)) {
          // Protection 1: write #Pending tx to stable state BEFORE the async ledger call
          walletAccounts := updatedAccounts;
          walletTxs := updatedTxs;
          // Execute real ledger transfer
          switch (asset) {
            case (#ICP) {
              switch (LedgerLib.hexToAccountBlob(toAddress)) {
                case null {
                  walletTxs := WalletLib.failSendAsset(walletTxs, tx.id);
                  #err("Invalid ICP account ID format")
                };
                case (?toBlob) {
                  try {
                    let result = await LedgerLib.icpLedger.transfer({
                      to = toBlob;
                      amount = { e8s = amount.toNat64() };
                      fee = { e8s = (10_000 : Nat64) };
                      memo = uniqueMemo;                          // Protection 2: unique memo per tx
                      from_subaccount = null;
                      created_at_time = ?{ timestamp_nanos = Int.abs(Time.now()).toNat64() };  // Protection 2: dedup window
                    });
                    switch (result) {
                      case (#Ok blockHeight) {
                        walletTxs := WalletLib.completeSendAsset(walletTxs, tx.id, Nat.fromNat64(blockHeight));
                        #ok({ tx with status = #Completed; ledgerBlockHeight = ?Nat.fromNat64(blockHeight) })
                      };
                      case (#Err transferErr) {
                        walletTxs := WalletLib.failSendAsset(walletTxs, tx.id);
                        #err("ICP transfer failed: " # LedgerLib.icpTransferErrorText(transferErr))
                      };
                    }
                  } catch (e) {
                    walletTxs := WalletLib.failSendAsset(walletTxs, tx.id);
                    #err("ICP ledger call failed")
                  }
                };
              }
            };
            case (#BTC) {
              // ckBTC: toAddress is a principal text
              // Build unique memo blob from counter for ICRC-1 deduplication
              let memoBlob : Blob = uniqueMemo.toText().encodeUtf8();
              try {
                let recipientPrincipal = Principal.fromText(toAddress);
                let result = await LedgerLib.ckBTCLedger.icrc1_transfer({
                  to = { owner = recipientPrincipal; subaccount = null };
                  amount;
                  fee = null;
                  memo = ?memoBlob;                               // Protection 2: unique memo per tx
                  from_subaccount = null;
                  created_at_time = ?Int.abs(Time.now()).toNat64();        // Protection 2: dedup window
                });
                switch (result) {
                  case (#Ok blockIdx) {
                    walletTxs := WalletLib.completeSendAsset(walletTxs, tx.id, blockIdx);
                    #ok({ tx with status = #Completed; ledgerBlockHeight = ?blockIdx })
                  };
                  case (#Err transferErr) {
                    walletTxs := WalletLib.failSendAsset(walletTxs, tx.id);
                    #err("ckBTC transfer failed: " # LedgerLib.icrc1TransferErrorText(transferErr))
                  };
                }
              } catch (e) {
                walletTxs := WalletLib.failSendAsset(walletTxs, tx.id);
                #err("ckBTC ledger call failed")
              }
            };
          }
        };
      }
    }
  };

  public shared query ({ caller }) func listTransactions(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, accountId : Common.EntityId, filter : ?WalTypes.TxFilter) : async [WalTypes.WalletTransaction] { WalletApi.listTransactions(walletTxs, tenantId, workspaceId, accountId, filter) };
  public shared query ({ caller }) func exportTransactions(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, accountId : Common.EntityId, filter : ?WalTypes.TxFilter) : async Text { WalletApi.exportTransactions(walletTxs, tenantId, workspaceId, accountId, filter) };
  public shared ({ caller }) func approveTransaction(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, txId : Common.EntityId, approved : Bool) : async { #ok : WalTypes.WalletTransaction; #err : Text } { switch (WalletApi.approveTransaction(walletAccounts, walletTxs, walletApprovals, tenantId, workspaceId, txId, caller, approved, walletApprovalsCounter)) { case (#err e) #err e; case (#ok(v, sa, st, ap, n)) { walletAccounts := sa; walletTxs := st; walletApprovals := ap; walletApprovalsCounter := n; #ok v } } };
  public shared query ({ caller }) func getPendingApprovals(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [WalTypes.WalletTransaction] { WalletApi.getPendingApprovals(walletTxs, tenantId, workspaceId) };
  public shared ({ caller }) func setSpendingLimit(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, role : Common.Role, maxAmount : Float, currency : Text) : async { #ok : WalTypes.WorkspaceSpendingLimit; #err : Text } { switch (WalletApi.setSpendingLimit(spendingLimits, tenantId, workspaceId, role, maxAmount, currency, idCounter)) { case (#err e) #err e; case (#ok(v, s, n)) { spendingLimits := s; idCounter := n; #ok v } } };
  public shared query ({ caller }) func getSpendingLimit(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, role : Common.Role) : async ?WalTypes.WorkspaceSpendingLimit { WalletApi.getSpendingLimit(spendingLimits, tenantId, workspaceId, role) };
  public shared query ({ caller }) func checkSpendingLimit(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, role : Common.Role, amount : Float) : async Bool { WalletApi.checkSpendingLimit(spendingLimits, tenantId, workspaceId, role, amount) };
  public shared ({ caller }) func createRecurringPayment(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, accountId : Common.EntityId, toAddress : Text, amount : Nat, asset : WalTypes.AssetType, frequency : Common.PayFrequency) : async { #ok : WalTypes.RecurringPayment; #err : Text } { switch (WalletApi.createRecurringPayment(recurringPmts, tenantId, workspaceId, caller, accountId, toAddress, amount, asset, frequency)) { case (#err e) #err e; case (#ok(v, s)) { recurringPmts := s; #ok v } } };
  public shared query ({ caller }) func listRecurringPayments(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, accountId : Common.EntityId) : async [WalTypes.RecurringPayment] { WalletApi.listRecurringPayments(recurringPmts, tenantId, workspaceId, accountId) };
  public shared ({ caller }) func cancelRecurringPayment(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : WalTypes.RecurringPayment; #err : Text } { switch (WalletApi.cancelRecurringPayment(recurringPmts, tenantId, workspaceId, id, caller)) { case (#err e) #err e; case (#ok(v, s)) { recurringPmts := s; #ok v } } };

  // Admin
  public shared ({ caller }) func createBackup(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, backupLabel : Text) : async { #ok : AdmTypes.Backup; #err : Text } { switch (AdminApi.createBackup(backups, tenantId, workspaceId, caller, backupLabel)) { case (#err e) #err e; case (#ok(v, s)) { backups := s; #ok v } } };
  public shared query ({ caller }) func getBackup(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : AdmTypes.Backup; #err : Text } { AdminApi.getBackup(backups, tenantId, workspaceId, id) };
  public shared query ({ caller }) func listBackups(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [AdmTypes.Backup] { AdminApi.listBackups(backups, tenantId, workspaceId) };
  public shared query ({ caller }) func listAuditLogs(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, limit : Nat) : async [AdmTypes.AuditLog] { AdminApi.listAuditLogs(auditLogs, tenantId, workspaceId, limit) };
  public shared ({ caller }) func createAutomationRule(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, name : Text, description : Text, trigger : AdmTypes.AutomationTrigger, action : AdmTypes.AutomationAction) : async { #ok : AdmTypes.AutomationRule; #err : Text } { switch (AdminApi.createAutomationRule(automationRules, tenantId, workspaceId, caller, name, description, trigger, action)) { case (#err e) #err e; case (#ok(v, s)) { automationRules := s; #ok v } } };
  public shared query ({ caller }) func listAutomationRules(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [AdmTypes.AutomationRule] { AdminApi.listAutomationRules(automationRules, tenantId, workspaceId) };
  public shared ({ caller }) func toggleAutomationRule(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : AdmTypes.AutomationRule; #err : Text } { switch (AdminApi.toggleAutomationRule(automationRules, tenantId, workspaceId, id)) { case (#err e) #err e; case (#ok(v, s)) { automationRules := s; #ok v } } };
  public shared query ({ caller }) func getWorkspaceStats(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async { noteCount : Nat; projectCount : Nat; employeeCount : Nat; escrowCount : Nat; walletAccountCount : Nat } { AdminApi.getWorkspaceStats(tenantId, workspaceId, notes, projects, employees, escrowContracts, walletAccounts) };

  // AI — management canister actor for HTTP outcalls
  let ic = actor "aaaaa-aa" : actor {
    http_request : ({
      url : Text;
      max_response_bytes : ?Nat64;
      method : { #get; #head; #post };
      headers : [{ name : Text; value : Text }];
      body : ?Blob;
      transform : ?{
        function : shared query ({ response : { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob }; context : Blob }) -> async { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob };
        context : Blob;
      };
      is_replicated : ?Bool;
    }) -> async { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob };
  };

  public shared ({ caller }) func saveAIConfig(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : AITypes.AIConfigInput) : async { #ok : AITypes.AIConfig; #err : Text } { let r = AIApi.saveAIConfig(aiConfigs, tenantId, workspaceId, caller, input); aiConfigs := r.store; r.result };
  public shared query ({ caller }) func getAIConfig(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async ?AITypes.AIConfig { AIApi.getAIConfig(aiConfigs, tenantId, workspaceId) };

  public shared ({ caller }) func submitAIPrompt(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : AITypes.AIPromptInput) : async { #ok : AITypes.AIResponse; #err : Text } {
    let cfg = switch (AIApi.getAIConfig(aiConfigs, tenantId, workspaceId)) {
      case null return #err "No AI configuration found. Please set up an AI provider first.";
      case (?c) c;
    };
    let ps = AIApi.storePrompt(aiPrompts, aiConfigs, tenantId, workspaceId, caller, input);
    aiPrompts := ps.promptStore;
    let prompt = ps.prompt;
    let promptText = AIApi.buildPromptText(input);
    let responseText : Text = try {
      switch (cfg.provider) {
        case (#OpenAI) {
          let reqBody = "{ \"model\": \"" # cfg.model # "\", \"messages\": [{ \"role\": \"user\", \"content\": \"" # promptText # "\" }] }";
          let res = await ic.http_request({
            url = "https://api.openai.com/v1/chat/completions";
            max_response_bytes = ?(8192 : Nat64);
            method = #post;
            headers = [
              { name = "Content-Type"; value = "application/json" },
              { name = "Authorization"; value = "Bearer " # cfg.apiKey },
            ];
            body = ?reqBody.encodeUtf8();
            transform = null;
            is_replicated = ?true;
          });
          switch (res.body.decodeUtf8()) {
            case null "AI response received (unable to decode)";
            case (?t) t;
          }
        };
        case (#Anthropic) {
          let reqBody = "{ \"model\": \"" # cfg.model # "\", \"messages\": [{ \"role\": \"user\", \"content\": \"" # promptText # "\" }], \"max_tokens\": 1024 }";
          let res = await ic.http_request({
            url = "https://api.anthropic.com/v1/messages";
            max_response_bytes = ?(8192 : Nat64);
            method = #post;
            headers = [
              { name = "Content-Type"; value = "application/json" },
              { name = "x-api-key"; value = cfg.apiKey },
              { name = "anthropic-version"; value = "2023-06-01" },
            ];
            body = ?reqBody.encodeUtf8();
            transform = null;
            is_replicated = ?true;
          });
          switch (res.body.decodeUtf8()) {
            case null "AI response received (unable to decode)";
            case (?t) t;
          }
        };
      }
    } catch (_e) {
      "AI request failed. Please check your API key and model configuration."
    };
    let rs = AIApi.storeResponse(aiResponses, tenantId, workspaceId, prompt.id, responseText, cfg.model);
    aiResponses := rs.responseStore;
    let finalResponse = rs.response;
    #ok finalResponse
  };

  public shared query ({ caller }) func getPromptHistory(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, userId : ?Common.UserId, limit : Nat) : async [AITypes.AIPrompt] { AIApi.getPromptHistory(aiPrompts, tenantId, workspaceId, userId, limit) };
  public shared query ({ caller }) func getAIResponses(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, promptId : ?Common.EntityId, limit : Nat) : async [AITypes.AIResponse] { AIApi.getAIResponses(aiResponses, tenantId, workspaceId, promptId, limit) };

  // Integrations
  public shared ({ caller }) func saveIntegration(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : ITypes.IntegrationInput) : async { #ok : ITypes.Integration; #err : Text } { let r = IntApi.saveIntegration(integrations, tenantId, workspaceId, caller, input); integrations := r.store; r.result };
  public shared query ({ caller }) func getIntegrations(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [ITypes.Integration] { IntApi.getIntegrations(integrations, tenantId, workspaceId) };
  public shared ({ caller }) func deleteIntegration(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : Bool; #err : Text } { let r = IntApi.deleteIntegration(integrations, tenantId, workspaceId, id, caller); integrations := r.store; r.result };
  public shared ({ caller }) func updateIntegrationSyncStatus(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId, status : Text, timestamp : Common.Timestamp) : async { #ok : Bool; #err : Text } { let r = IntApi.updateIntegrationSyncStatus(integrations, tenantId, workspaceId, id, status, timestamp); integrations := r.store; r.result };
  public shared ({ caller }) func addIntegrationEvent(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, integrationId : Common.EntityId, eventType : Text, payload : Text) : async { #ok : ITypes.IntegrationEvent; #err : Text } { let r = IntApi.addIntegrationEvent(integrationEvents, tenantId, workspaceId, integrationId, eventType, payload); integrationEvents := r.store; r.result };
  public shared ({ caller }) func processIntegrationTrigger(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, provider : ITypes.IntegrationProvider, eventType : Text, payload : Text, triggerAction : Text) : async { #ok : ITypes.IntegrationEvent; #err : Text } { let r = IntApi.processIntegrationTrigger(integrations, integrationEvents, tenantId, workspaceId, provider, eventType, payload, triggerAction); integrationEvents := r.store; r.result };
  public shared query ({ caller }) func getIntegrationEvents(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, integrationId : Common.EntityId, limit : Nat) : async [ITypes.IntegrationEvent] { IntApi.getIntegrationEvents(integrationEvents, tenantId, workspaceId, integrationId, limit) };
  public shared query ({ caller }) func getIntegrationActivityLog(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, provider : ?ITypes.IntegrationProvider, fromDate : ?Common.Timestamp, toDate : ?Common.Timestamp, limit : Nat) : async [ITypes.IntegrationEvent] { IntApi.getIntegrationActivityLog(integrationEvents, tenantId, workspaceId, provider, integrations, fromDate, toDate, limit) };

  // Time Tracking
  public shared ({ caller }) func createTimeEntry(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : TTTypes.TimeEntryInput) : async { #ok : TTTypes.TimeEntry; #err : Text } { let r = TTApi.createTimeEntry(timeEntries, tenantId, workspaceId, caller, input); timeEntries := r.store; r.result };
  public shared ({ caller }) func updateTimeEntry(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId, input : TTTypes.TimeEntryInput) : async { #ok : TTTypes.TimeEntry; #err : Text } { let r = TTApi.updateTimeEntry(timeEntries, tenantId, workspaceId, id, caller, input); timeEntries := r.store; r.result };
  public shared ({ caller }) func deleteTimeEntry(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : Bool; #err : Text } { let r = TTApi.deleteTimeEntry(timeEntries, tenantId, workspaceId, id, caller); timeEntries := r.store; r.result };
  public shared query ({ caller }) func getTaskTimeEntries(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, taskId : Common.EntityId) : async [TTTypes.TimeEntry] { TTApi.getTaskTimeEntries(timeEntries, tenantId, workspaceId, taskId) };
  public shared query ({ caller }) func getProjectTimeEntries(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, projectId : Common.EntityId) : async [TTTypes.TimeEntry] { TTApi.getProjectTimeEntries(timeEntries, tenantId, workspaceId, projectId) };
  public shared query ({ caller }) func getUserTimeEntries(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, userId : Common.UserId) : async [TTTypes.TimeEntry] { TTApi.getUserTimeEntries(timeEntries, tenantId, workspaceId, userId) };
  public shared query ({ caller }) func getTimeReport(workspaceId : Common.WorkspaceId, tenantId : Common.TenantId, filter : TTTypes.TimeReportFilter) : async TTTypes.TimeReport { TTApi.getTimeReport(timeEntries, workspaceId, tenantId, filter) };
  public shared query ({ caller }) func getWeeklyTimesheet(workspaceId : Common.WorkspaceId, tenantId : Common.TenantId, userId : Common.UserId, weekStart : Common.Timestamp) : async [TTTypes.DailyTimesheetEntry] { TTApi.getWeeklyTimesheet(timeEntries, workspaceId, tenantId, userId, weekStart) };
  public shared query ({ caller }) func exportTimeEntries(workspaceId : Common.WorkspaceId, tenantId : Common.TenantId, filter : TTTypes.TimeReportFilter) : async Text { TTApi.exportTimeEntries(timeEntries, workspaceId, tenantId, filter) };

  // Guest Access
  public shared ({ caller }) func createGuestInvitation(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : GATypes.GuestInvitationInput) : async { #ok : GATypes.GuestInvitation; #err : Text } { let r = GAApi.createGuestInvitation(guestInvitations, tenantId, workspaceId, caller, input); guestInvitations := r.store; r.result };
  public shared ({ caller }) func acceptGuestInvitation(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, token : Text) : async { #ok : GATypes.GuestUser; #err : Text } { let r = GAApi.acceptGuestInvitation(guestInvitations, guestUsers, tenantId, workspaceId, token, caller); guestInvitations := r.invitationStore; guestUsers := r.guestStore; r.result };
  public shared query ({ caller }) func listGuestUsers(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [GATypes.GuestUser] { GAApi.listGuestUsers(guestUsers, tenantId, workspaceId) };
  public shared ({ caller }) func updateGuestStatus(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId, status : GATypes.GuestStatus) : async { #ok : GATypes.GuestUser; #err : Text } { let r = GAApi.updateGuestStatus(guestUsers, tenantId, workspaceId, id, status, caller); guestUsers := r.store; r.result };
  public shared query ({ caller }) func getGuestUser(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async ?GATypes.GuestUser { GAApi.getGuestUser(guestUsers, tenantId, workspaceId, id) };

  // Forms
  public shared ({ caller }) func createForm(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : FTypes.FormInput) : async { #ok : FTypes.Form; #err : Text } { let r = FormsApi.createForm(forms, tenantId, workspaceId, caller, input); forms := r.store; r.result };
  public shared ({ caller }) func updateForm(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId, input : FTypes.FormInput) : async { #ok : FTypes.Form; #err : Text } { let r = FormsApi.updateForm(forms, tenantId, workspaceId, id, caller, input); forms := r.store; r.result };
  public shared ({ caller }) func deleteForm(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : Bool; #err : Text } { let r = FormsApi.deleteForm(forms, tenantId, workspaceId, id, caller); forms := r.store; r.result };
  public shared query ({ caller }) func getForm(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : FTypes.Form; #err : Text } { FormsApi.getForm(forms, tenantId, workspaceId, id) };
  public shared query ({ caller }) func listForms(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [FTypes.Form] { FormsApi.listForms(forms, tenantId, workspaceId) };
  public query func getPublicForm(publicUrl : Text) : async ?FTypes.Form { FormsApi.getPublicForm(forms, publicUrl) };
  public shared ({ caller }) func submitFormResponse(input : FTypes.FormSubmissionInput) : async { #ok : FTypes.FormSubmission; #err : Text } {
    let r = FormsApi.submitFormResponse(formSubmissions, forms, input);
    formSubmissions := r.store;
    switch (r.taskInput) {
      case null {};
      case (?ti) {
        let sub = switch (r.result) { case (#ok s) s; case (#err _) { return r.result } };
        let taskIn : PTypes.TaskInput = { projectId = ti.projectId; title = ti.title; description = ti.description; priority = #Medium; assigneeId = ti.assigneeId; dueDate = null; crossLinks = [] };
        let tr = ProjApi.createTask(tasks, sub.tenantId, sub.workspaceId, caller, taskIn);
        tasks := tr.store;
      };
    };
    r.result
  };
  public shared query ({ caller }) func listFormSubmissions(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, formId : Common.EntityId) : async [FTypes.FormSubmission] { FormsApi.listFormSubmissions(formSubmissions, tenantId, workspaceId, formId) };
  public shared query ({ caller }) func getFormAnalytics(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, formId : Common.EntityId) : async FTypes.FormAnalytics { FormsApi.getFormAnalytics(forms, formSubmissions, formId, workspaceId, tenantId) };

  // Whiteboards
  public shared ({ caller }) func createWhiteboard(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : WBTypes.WhiteboardInput) : async { #ok : WBTypes.Whiteboard; #err : Text } { let r = WBApi.createWhiteboard(whiteboards, tenantId, workspaceId, caller, input); whiteboards := r.store; r.result };
  public shared ({ caller }) func updateWhiteboardElements(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId, elements : [WBTypes.WhiteboardElement]) : async { #ok : WBTypes.Whiteboard; #err : Text } { let r = WBApi.updateWhiteboardElements(whiteboards, tenantId, workspaceId, id, caller, elements); whiteboards := r.store; r.result };
  public shared query ({ caller }) func getWhiteboard(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : WBTypes.Whiteboard; #err : Text } { WBApi.getWhiteboard(whiteboards, tenantId, workspaceId, id) };
  public shared query ({ caller }) func listWhiteboards(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [WBTypes.Whiteboard] { WBApi.listWhiteboards(whiteboards, tenantId, workspaceId) };
  public shared ({ caller }) func deleteWhiteboard(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : Bool; #err : Text } { let r = WBApi.deleteWhiteboard(whiteboards, tenantId, workspaceId, id, caller); whiteboards := r.store; r.result };
  public query func listWhiteboardTemplates() : async [WBTypes.WhiteboardTemplate] { WBApi.listWhiteboardTemplates() };
  public shared ({ caller }) func convertWhiteboardElementToTask(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, whiteboardId : Common.EntityId, elementId : Common.EntityId, projectId : Common.EntityId) : async { #ok : WBTypes.Whiteboard; #err : Text } {
    let r = WBApi.convertElementToTask(whiteboards, whiteboardId, elementId, projectId, workspaceId, tenantId);
    switch (r.result) {
      case (#err e) { #err e };
      case (#ok(wb, tProjectId, tTitle, tDesc, tAssignee)) {
        whiteboards := r.store;
        let taskIn : PTypes.TaskInput = { projectId = tProjectId; title = tTitle; description = tDesc; priority = #Medium; assigneeId = tAssignee; dueDate = null; crossLinks = [] };
        let tr = ProjApi.createTask(tasks, tenantId, workspaceId, caller, taskIn);
        tasks := tr.store;
        let createdTaskId = switch (tr.result) { case (#ok t) t.id; case (#err _) "" };
        if (createdTaskId != "") {
          whiteboards := WBApi.linkElementToTask(whiteboards, whiteboardId, elementId, createdTaskId, tenantId, workspaceId);
        };
        #ok wb
      };
    }
  };

  // Pages & Templates
  public shared ({ caller }) func createPage(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : NTypes.PageInput) : async { #ok : NTypes.PageNode; #err : Text } { let r = NPApi.createPage(pages, tenantId, workspaceId, caller, input); pages := r.store; r.result };
  public shared query ({ caller }) func getPage(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, pageId : Common.EntityId) : async { #ok : NTypes.PageNode; #err : Text } { NPApi.getPage(pages, tenantId, workspaceId, pageId) };
  public shared query ({ caller }) func listPages(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, parentPageId : ?Common.EntityId) : async [NTypes.PageNode] { NPApi.listPages(pages, tenantId, workspaceId, parentPageId) };
  public shared ({ caller }) func updatePage(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, pageId : Common.EntityId, title : Text, icon : Text, coverUrl : ?Text, blocks : [NTypes.Block]) : async { #ok : NTypes.PageNode; #err : Text } { let r = NPApi.updatePage(pages, tenantId, workspaceId, pageId, title, icon, coverUrl, blocks); pages := r.store; r.result };
  public shared ({ caller }) func deletePage(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, pageId : Common.EntityId) : async { #ok : Bool; #err : Text } { let r = NPApi.deletePage(pages, tenantId, workspaceId, pageId); pages := r.store; r.result };
  public shared query ({ caller }) func getPageHierarchy(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [NTypes.PageNode] { NPApi.getPageHierarchy(pages, tenantId, workspaceId) };
  public shared query ({ caller }) func getBacklinks(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, targetPageId : Common.EntityId) : async [NTypes.PageNode] { NPApi.getBacklinks(pages, tenantId, workspaceId, targetPageId) };
  public shared query ({ caller }) func listNoteTemplates(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [NTypes.NoteTemplate] { NPApi.listNoteTemplates(noteTemplates, tenantId, workspaceId) };
  public shared ({ caller }) func createNoteTemplate(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : NTypes.NoteTemplateInput) : async { #ok : NTypes.NoteTemplate; #err : Text } { let r = NPApi.createNoteTemplate(noteTemplates, tenantId, workspaceId, caller, input); noteTemplates := r.store; r.result };
  public shared ({ caller }) func deleteNoteTemplate(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, templateId : Common.EntityId) : async { #ok : Bool; #err : Text } { let r = NPApi.deleteNoteTemplate(noteTemplates, tenantId, workspaceId, templateId); noteTemplates := r.store; r.result };

  // Projects Advanced
  public shared ({ caller }) func createSubtask(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : PTypes.SubtaskInput) : async { #ok : PTypes.Subtask; #err : Text } { let r = PAdvApi.createSubtask(subtasks, tenantId, workspaceId, input); subtasks := r.store; r.result };
  public shared query ({ caller }) func listSubtasks(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, parentTaskId : Common.EntityId) : async [PTypes.Subtask] { PAdvApi.listSubtasks(subtasks, tenantId, workspaceId, parentTaskId) };
  public shared ({ caller }) func updateSubtask(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, subtaskId : Common.EntityId, title : Text, status : PTypes.TaskStatus) : async { #ok : PTypes.Subtask; #err : Text } { let r = PAdvApi.updateSubtask(subtasks, tenantId, workspaceId, subtaskId, title, status); subtasks := r.store; r.result };
  public shared ({ caller }) func deleteSubtask(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, subtaskId : Common.EntityId) : async { #ok : Bool; #err : Text } { let r = PAdvApi.deleteSubtask(subtasks, tenantId, workspaceId, subtaskId); subtasks := r.store; r.result };
  public shared ({ caller }) func createSprint(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : PTypes.SprintInput) : async { #ok : PTypes.Sprint; #err : Text } { let r = PAdvApi.createSprint(sprints, tenantId, workspaceId, input); sprints := r.store; r.result };
  public shared query ({ caller }) func getSprint(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, sprintId : Common.EntityId) : async { #ok : PTypes.Sprint; #err : Text } { PAdvApi.getSprint(sprints, tenantId, workspaceId, sprintId) };
  public shared query ({ caller }) func listSprints(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, projectId : Common.EntityId) : async [PTypes.Sprint] { PAdvApi.listSprints(sprints, tenantId, workspaceId, projectId) };
  public shared ({ caller }) func updateSprint(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, sprintId : Common.EntityId, name : Text, goal : Text, status : PTypes.SprintStatus, taskIds : [Common.EntityId]) : async { #ok : PTypes.Sprint; #err : Text } { let r = PAdvApi.updateSprint(sprints, tenantId, workspaceId, sprintId, name, goal, status, taskIds); sprints := r.store; r.result };
  public shared ({ caller }) func deleteSprint(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, sprintId : Common.EntityId) : async { #ok : Bool; #err : Text } { let r = PAdvApi.deleteSprint(sprints, tenantId, workspaceId, sprintId); sprints := r.store; r.result };
  public shared ({ caller }) func addTaskToSprint(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, sprintId : Common.EntityId, taskId : Common.EntityId) : async { #ok : PTypes.Sprint; #err : Text } { let r = PAdvApi.addTaskToSprint(sprints, tenantId, workspaceId, sprintId, taskId); sprints := r.store; r.result };
  public shared ({ caller }) func removeTaskFromSprint(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, sprintId : Common.EntityId, taskId : Common.EntityId) : async { #ok : PTypes.Sprint; #err : Text } { let r = PAdvApi.removeTaskFromSprint(sprints, tenantId, workspaceId, sprintId, taskId); sprints := r.store; r.result };
  public shared ({ caller }) func createMilestone(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : PTypes.MilestoneInput) : async { #ok : PTypes.Milestone; #err : Text } { let r = PAdvApi.createMilestone(milestones, tenantId, workspaceId, input); milestones := r.store; r.result };
  public shared query ({ caller }) func listMilestones(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, projectId : Common.EntityId) : async [PTypes.Milestone] { PAdvApi.listMilestones(milestones, tenantId, workspaceId, projectId) };
  public shared ({ caller }) func updateMilestone(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, milestoneId : Common.EntityId, title : Text, status : PTypes.MilestoneStatus, dueDate : Common.Timestamp) : async { #ok : PTypes.Milestone; #err : Text } { let r = PAdvApi.updateMilestone(milestones, tenantId, workspaceId, milestoneId, title, status, dueDate); milestones := r.store; r.result };
  public shared ({ caller }) func deleteMilestone(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, milestoneId : Common.EntityId) : async { #ok : Bool; #err : Text } { let r = PAdvApi.deleteMilestone(milestones, tenantId, workspaceId, milestoneId); milestones := r.store; r.result };
  public shared ({ caller }) func addComment(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, projectId : Common.EntityId, input : PTypes.TaskCommentInput) : async { #ok : PTypes.TaskComment; #err : Text } { let r = PAdvApi.addComment(taskComments, activityEvents, tenantId, workspaceId, caller, projectId, input); taskComments := r.commentStore; activityEvents := r.activityStore; r.result };
  public shared ({ caller }) func editComment(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, commentId : Common.EntityId, content : Text) : async { #ok : PTypes.TaskComment; #err : Text } { let r = PAdvApi.editComment(taskComments, activityEvents, tenantId, workspaceId, caller, commentId, content); taskComments := r.commentStore; activityEvents := r.activityStore; r.result };
  public shared ({ caller }) func deleteComment(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, commentId : Common.EntityId) : async { #ok : Bool; #err : Text } { let r = PAdvApi.deleteComment(taskComments, tenantId, workspaceId, commentId); taskComments := r.store; r.result };
  public shared query ({ caller }) func listComments(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, taskId : Common.EntityId) : async [PTypes.TaskComment] { PAdvApi.listComments(taskComments, tenantId, workspaceId, taskId) };
  public shared query ({ caller }) func listActivityEvents(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, taskId : Common.EntityId) : async [PTypes.ActivityEvent] { PAdvApi.listActivityEvents(activityEvents, tenantId, workspaceId, taskId) };
  public shared ({ caller }) func addChecklistItem(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : PTypes.ChecklistItemInput) : async { #ok : PTypes.ChecklistItem; #err : Text } { let r = PAdvApi.addChecklistItem(checklistItems, tenantId, workspaceId, input); checklistItems := r.store; r.result };
  public shared ({ caller }) func updateChecklistItem(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, itemId : Common.EntityId, content : Text, completed : Bool) : async { #ok : PTypes.ChecklistItem; #err : Text } { let r = PAdvApi.updateChecklistItem(checklistItems, tenantId, workspaceId, itemId, content, completed); checklistItems := r.store; r.result };
  public shared ({ caller }) func deleteChecklistItem(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, itemId : Common.EntityId) : async { #ok : Bool; #err : Text } { let r = PAdvApi.deleteChecklistItem(checklistItems, tenantId, workspaceId, itemId); checklistItems := r.store; r.result };
  public shared query ({ caller }) func listChecklistItems(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, taskId : Common.EntityId) : async [PTypes.ChecklistItem] { PAdvApi.listChecklistItems(checklistItems, tenantId, workspaceId, taskId) };
  public shared ({ caller }) func addTaskRelationship(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, sourceTaskId : Common.EntityId, targetTaskId : Common.EntityId, relType : PTypes.TaskRelationshipType) : async { #ok : PTypes.TaskRelationship; #err : Text } { let r = PAdvApi.addTaskRelationship(taskRelationships, tenantId, workspaceId, caller, sourceTaskId, targetTaskId, relType); taskRelationships := r.store; r.result };
  public shared ({ caller }) func removeTaskRelationship(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, relationshipId : Common.EntityId) : async { #ok : Bool; #err : Text } { let r = PAdvApi.removeTaskRelationship(taskRelationships, tenantId, workspaceId, relationshipId); taskRelationships := r.store; r.result };
  public shared query ({ caller }) func listTaskRelationships(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, taskId : Common.EntityId) : async [PTypes.TaskRelationship] { PAdvApi.listTaskRelationships(taskRelationships, tenantId, workspaceId, taskId) };
  public shared ({ caller }) func addTaskWatcher(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, taskId : Common.EntityId, userId : Common.UserId) : async { #ok : PTypes.TaskWatcher; #err : Text } { let r = PAdvApi.addTaskWatcher(taskWatchers, tenantId, workspaceId, taskId, userId); taskWatchers := r.store; r.result };
  public shared ({ caller }) func removeTaskWatcher(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, taskId : Common.EntityId, userId : Common.UserId) : async { #ok : Bool; #err : Text } { let r = PAdvApi.removeTaskWatcher(taskWatchers, tenantId, workspaceId, taskId, userId); taskWatchers := r.store; r.result };
  public shared query ({ caller }) func listTaskWatchers(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, taskId : Common.EntityId) : async [PTypes.TaskWatcher] { PAdvApi.listTaskWatchers(taskWatchers, tenantId, workspaceId, taskId) };
  public shared query ({ caller }) func isWatching(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, taskId : Common.EntityId, userId : Common.UserId) : async Bool { PAdvApi.isWatching(taskWatchers, tenantId, workspaceId, taskId, userId) };
  public shared ({ caller }) func createRecurringTask(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : PTypes.RecurringTaskInput) : async { #ok : PTypes.RecurringTask; #err : Text } { let r = PAdvApi.createRecurringTask(recurringTasks, tenantId, workspaceId, input); recurringTasks := r.store; r.result };
  public shared query ({ caller }) func listRecurringTasks(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, projectId : Common.EntityId) : async [PTypes.RecurringTask] { PAdvApi.listRecurringTasks(recurringTasks, tenantId, workspaceId, projectId) };
  public shared ({ caller }) func deleteRecurringTask(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : Bool; #err : Text } { let r = PAdvApi.deleteRecurringTask(recurringTasks, tenantId, workspaceId, id); recurringTasks := r.store; r.result };
  public shared ({ caller }) func createTaskTemplate(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : PTypes.TaskTemplateInput) : async { #ok : PTypes.TaskTemplate; #err : Text } { let r = PAdvApi.createTaskTemplate(taskTemplates, tenantId, workspaceId, input); taskTemplates := r.store; r.result };
  public shared query ({ caller }) func listTaskTemplates(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [PTypes.TaskTemplate] { PAdvApi.listTaskTemplates(taskTemplates, tenantId, workspaceId) };
  public shared query ({ caller }) func getTaskTemplate(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : PTypes.TaskTemplate; #err : Text } { PAdvApi.getTaskTemplate(taskTemplates, tenantId, workspaceId, id) };
  public shared ({ caller }) func deleteTaskTemplate(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : Bool; #err : Text } { let r = PAdvApi.deleteTaskTemplate(taskTemplates, tenantId, workspaceId, id); taskTemplates := r.store; r.result };

  // Goals / OKR
  public shared ({ caller }) func createGoal(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : GTypes.GoalInput) : async { #ok : GTypes.Goal; #err : Text } { let r = GoalsApi.createGoal(goals, tenantId, workspaceId, caller, input); goals := r.store; r.result };
  public shared query ({ caller }) func getGoal(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : GTypes.Goal; #err : Text } { GoalsApi.getGoal(goals, tenantId, workspaceId, id) };
  public shared query ({ caller }) func listGoals(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : async [GTypes.Goal] { GoalsApi.listGoals(goals, tenantId, workspaceId) };
  public shared ({ caller }) func updateGoal(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId, input : GTypes.GoalInput, status : GTypes.GoalStatus) : async { #ok : GTypes.Goal; #err : Text } { let r = GoalsApi.updateGoal(goals, tenantId, workspaceId, id, caller, input, status); goals := r.store; r.result };
  public shared ({ caller }) func deleteGoal(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, id : Common.EntityId) : async { #ok : Bool; #err : Text } { let r = GoalsApi.deleteGoal(goals, tenantId, workspaceId, id); goals := r.store; r.result };
  public shared ({ caller }) func addKeyResult(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : GTypes.KeyResultInput) : async { #ok : GTypes.KeyResult; #err : Text } { let r = GoalsApi.addKeyResult(goals, keyResults, tenantId, workspaceId, input); goals := r.goalStore; keyResults := r.krStore; r.result };
  public shared ({ caller }) func updateKeyResult(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, krId : Common.EntityId, currentValue : Float, status : GTypes.KRStatus) : async { #ok : GTypes.KeyResult; #err : Text } { let r = GoalsApi.updateKeyResult(goals, keyResults, tenantId, workspaceId, krId, currentValue, status); goals := r.goalStore; keyResults := r.krStore; r.result };
  public shared ({ caller }) func deleteKeyResult(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, krId : Common.EntityId) : async { #ok : Bool; #err : Text } { let r = GoalsApi.deleteKeyResult(goals, keyResults, tenantId, workspaceId, krId); goals := r.goalStore; keyResults := r.krStore; r.result };
  public shared query ({ caller }) func listKeyResults(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, goalId : Common.EntityId) : async [GTypes.KeyResult] { GoalsApi.listKeyResults(keyResults, tenantId, workspaceId, goalId) };
  public shared ({ caller }) func recordCheckIn(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, input : GTypes.CheckInInput) : async { #ok : GTypes.GoalCheckIn; #err : Text } { let r = GoalsApi.recordCheckIn(goals, keyResults, goalCheckIns, tenantId, workspaceId, caller, input); goals := r.goalStore; keyResults := r.krStore; goalCheckIns := r.checkInStore; r.result };
  public shared query ({ caller }) func listCheckIns(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, goalId : Common.EntityId) : async [GTypes.GoalCheckIn] { GoalsApi.listCheckIns(goalCheckIns, tenantId, workspaceId, goalId) };
  public shared ({ caller }) func linkTaskToKR(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, krId : Common.EntityId, taskId : Common.EntityId) : async { #ok : GTypes.KeyResult; #err : Text } { let r = GoalsApi.linkTaskToKR(keyResults, tenantId, workspaceId, krId, taskId); keyResults := r.store; r.result };
  public shared ({ caller }) func unlinkTaskFromKR(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, krId : Common.EntityId, taskId : Common.EntityId) : async { #ok : GTypes.KeyResult; #err : Text } { let r = GoalsApi.unlinkTaskFromKR(keyResults, tenantId, workspaceId, krId, taskId); keyResults := r.store; r.result };

  // Public Goals — unauthenticated read
  public query func getPublicGoals(shareToken : Text) : async { #ok : [GTypes.PublicGoal]; #err : Text } { GoalsApi.getPublicGoals(goals, keyResults, goalCheckIns, workspaceShareTokens, shareToken) };

  // Public Goals — authenticated mutations
  public shared ({ caller }) func toggleGoalPublic(goalId : Common.EntityId, workspaceId : Common.WorkspaceId, tenantId : Common.TenantId) : async { #ok : GTypes.Goal; #err : Text } { let r = GoalsApi.toggleGoalPublic(goals, tenantId, workspaceId, goalId); goals := r.store; r.result };
  public shared ({ caller }) func getOrCreateWorkspaceShareToken(workspaceId : Common.WorkspaceId, tenantId : Common.TenantId) : async Text { let r = GoalsApi.getOrCreateWorkspaceShareToken(workspaceShareTokens, workspaceId, Time.now()); workspaceShareTokens := r.store; r.token };
  public shared ({ caller }) func regenerateWorkspaceShareToken(workspaceId : Common.WorkspaceId, tenantId : Common.TenantId) : async Text { let r = GoalsApi.regenerateWorkspaceShareToken(workspaceShareTokens, workspaceId, Time.now()); workspaceShareTokens := r.store; r.token };

  // ── Calendar — exception-aware listing ───────────────────────────────────────

  /// List events in a date range with recurring event exceptions applied.
  /// Deleted exception occurrences are omitted; modified occurrences use override data.
  public shared query ({ caller }) func listEventsWithExceptions(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, from : Common.Timestamp, to : Common.Timestamp) : async [CalTypes.Event] {
    CalApi.listEventsWithExceptions(events, eventExceptions, tenantId, workspaceId, from, to)
  };

  // ── Dashboard ────────────────────────────────────────────────────────────────

  /// Returns real workspace statistics aggregated from live backend data.
  public shared query ({ caller }) func getWorkspaceDashboardStats(workspaceId : Common.WorkspaceId, tenantId : Common.TenantId) : async DashboardLib.DashboardStats {
    DashboardLib.getWorkspaceDashboardStats(workspaceId, tenantId, notes, projects, tasks, goals, workspacesRef.val, walletAccounts, payrollRecords)
  };

  /// Returns recent activity feed (up to `limit` entries) from real workspace events.
  public shared query ({ caller }) func getWorkspaceRecentActivity(workspaceId : Common.WorkspaceId, tenantId : Common.TenantId, limit : Nat) : async [DashboardLib.ActivityEntry] {
    DashboardLib.getWorkspaceRecentActivity(workspaceId, tenantId, limit, notes, projects, tasks, goals)
  };
};
