import type { backendInterface } from "../backend";
import {
  AIPromptType,
  AIProvider,
  AssetType,
  AutomationAction,
  AutomationTrigger,
  BackupStatus,
  CalendarType,
  ContractorPaymentReason,
  ContractorPaymentStatus,
  DeductionFrequency,
  DeductionType,
  DisputeStatus,
  EscrowStatus,
  EventCategory,
  ExceptionType,
  FormFieldType,
  FormStatus,
  GoalStatus,
  GuestStatus,
  IntegrationProvider,
  IntegrationStatus,
  KRStatus,
  MilestoneStatus,
  MilestoneStatus__1,
  OffCycleReason,
  PayFrequency,
  PayrollStatus,
  ProjectStatus,
  RecurrenceRule,
  RecurrenceType,
  Role,
  RsvpStatus,
  SprintStatus,
  TaskPriority,
  TaskRelationshipType,
  TaskStatus,
  TransactionStatus,
  TransactionType,
  Variant_away_offline_online,
  WorkspaceRole,
} from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);
const TENANT_ID = "tenant-1";
const WS_ID = "ws-1";
const USER_ID = { _isPrincipal: true, toText: () => "user-1" } as any;

const ok = <T>(v: T) => ({ __kind__: "ok" as const, ok: v });

export const mockBackend: backendInterface = {
  // Workspace
  createWorkspace: async () => ok({ id: WS_ID, name: "", ownerId: USER_ID, createdAt: now, tenantId: TENANT_ID, members: [] as any }),
  getWorkspace: async () => ok({ id: WS_ID, name: "", ownerId: USER_ID, createdAt: now, tenantId: TENANT_ID, members: [] as any }),
  listWorkspaces: async () => [],
  getWorkspaceMember: async () => ({ displayName: "", userId: USER_ID, joinedAt: now, role: WorkspaceRole.Admin, email: "", workspaceId: WS_ID }),
  listWorkspaceMembers: async () => [],
  addWorkspaceMember: async () => ok({ displayName: "", userId: USER_ID, joinedAt: now, role: WorkspaceRole.TeamMember, email: "", workspaceId: WS_ID }),
  removeWorkspaceMember: async () => ok(null),
  getWorkspaceStats: async () => ({ walletAccountCount: BigInt(0), employeeCount: BigInt(0), noteCount: BigInt(0), escrowCount: BigInt(0), projectCount: BigInt(0) }),
  getWorkspaceDashboardStats: async () => ({ memberCount: BigInt(0), goalCount: BigInt(0), noteCount: BigInt(0), taskCount: BigInt(0), projectCount: BigInt(0) }),
  getWorkspaceRecentActivity: async () => [],
  getWorkspaceTreasury: async () => null,

  // Profile
  getMyProfile: async () => null,
  listProfiles: async () => [],

  // Projects
  createProject: async () => ok({ id: "", name: "", description: "", status: ProjectStatus.Active, ownerId: USER_ID, createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, memberIds: [], crossLinks: [] }),
  getProject: async () => ok({ id: "", name: "", description: "", status: ProjectStatus.Active, ownerId: USER_ID, createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, memberIds: [], crossLinks: [] }),
  listProjects: async () => [],
  archiveProject: async () => ok({ id: "", name: "", description: "", status: ProjectStatus.Archived, ownerId: USER_ID, createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, memberIds: [], crossLinks: [] }),

  // Tasks
  createTask: async () => ok({ id: "", title: "", description: "", status: TaskStatus.Todo, priority: TaskPriority.Medium, projectId: "", createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [] }),
  getTask: async () => ok({ id: "", title: "", description: "", status: TaskStatus.Todo, priority: TaskPriority.Medium, projectId: "", createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [] }),
  listTasks: async () => [],
  deleteTask: async () => ok(true),
  createSubtask: async () => ok({ id: "", status: TaskStatus.Todo, title: "", order: BigInt(0), description: "", priority: TaskPriority.Medium, projectId: "", parentTaskId: "", createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  listSubtasks: async () => [],
  deleteSubtask: async () => ok(true),
  addComment: async () => ok({ id: "", content: "", authorId: USER_ID, taskId: "", createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  listComments: async () => [],
  editComment: async () => ok({ id: "", content: "", authorId: USER_ID, taskId: "", createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  deleteComment: async () => ok(true),
  addTaskWatcher: async () => ok({ userId: USER_ID, taskId: "", addedAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  removeTaskWatcher: async () => ok(true),
  listTaskWatchers: async () => [],
  isWatching: async () => false,
  listActivityEvents: async () => [],
  addChecklistItem: async () => ok({ id: "", content: "", completed: false, order: BigInt(0), taskId: "", createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  updateChecklistItem: async () => ok({ id: "", content: "", completed: true, order: BigInt(0), taskId: "", createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  deleteChecklistItem: async () => ok(true),
  listChecklistItems: async () => [],
  addTaskRelationship: async () => ok({ id: "", sourceTaskId: "", targetTaskId: "", relationshipType: TaskRelationshipType.relatedTo, createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, workspaceId: WS_ID }),
  removeTaskRelationship: async () => ok(true),
  listTaskRelationships: async () => [],
  createSprint: async () => ok({ id: "", name: "", goal: "", status: SprintStatus.active, taskIds: [], startDate: now, endDate: now, projectId: "", createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  getSprint: async () => ok({ id: "", name: "", goal: "", status: SprintStatus.active, taskIds: [], startDate: now, endDate: now, projectId: "", createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  listSprints: async () => [],
  deleteSprint: async () => ok(true),
  addTaskToSprint: async () => ok({ id: "", name: "", goal: "", status: SprintStatus.planned, taskIds: [], startDate: now, endDate: now, projectId: "", createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  removeTaskFromSprint: async () => ok({ id: "", name: "", goal: "", status: SprintStatus.planned, taskIds: [], startDate: now, endDate: now, projectId: "", createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  createMilestone: async () => ok({ id: "", title: "", description: "", status: MilestoneStatus.upcoming, dueDate: now, projectId: "", linkedTaskIds: [], createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  deleteMilestone: async () => ok(true),
  listMilestones: async () => [],
  createRecurringTask: async () => ok({ id: "", title: "", description: "", priority: TaskPriority.Medium, recurrenceType: RecurrenceType.weekly, projectId: "", nextDueAt: now, createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  listRecurringTasks: async () => [],
  deleteRecurringTask: async () => ok(true),
  listTaskTemplates: async () => [],
  createTaskTemplate: async () => ok({ id: "", name: "", description: "", defaultPriority: TaskPriority.Medium, checklistItems: [], createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  getTaskTemplate: async () => ok({ id: "", name: "", description: "", defaultPriority: TaskPriority.Medium, checklistItems: [], createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  deleteTaskTemplate: async () => ok(true),

  // Notes / Pages
  createNote: async () => ok({ id: "", title: "", content: "", authorId: USER_ID, createdAt: now, tags: [], tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [] }),
  getNote: async () => ok({ id: "", title: "", content: "", authorId: USER_ID, createdAt: now, tags: [], tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [] }),
  listNotes: async () => [],
  deleteNote: async () => ok(true),
  searchNotes: async () => [],
  createPage: async () => ok({ id: "", title: "", icon: "📄", blocks: [], authorId: USER_ID, createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [], watchers: [] }),
  getPage: async () => ok({ id: "", title: "", icon: "📄", blocks: [], authorId: USER_ID, createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [], watchers: [] }),
  listPages: async () => [],
  deletePage: async () => ok(true),
  getPageHierarchy: async () => [],
  getBacklinks: async () => [],
  createNoteTemplate: async () => ok({ id: "", name: "", description: "", icon: "📝", blocksJson: "[]", authorId: USER_ID, createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  listNoteTemplates: async () => [],
  deleteNoteTemplate: async () => ok(true),

  // Chat
  createChannel: async () => ok({ id: "", name: "", description: "", createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, workspaceId: WS_ID, memberIds: [], isPublic: true, topic: "", pinnedMessageIds: [], mentionFlags: [], unreadCounts: [] }),
  getChannel: async () => ok({ id: "", name: "", description: "", createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, workspaceId: WS_ID, memberIds: [], isPublic: true, topic: "", pinnedMessageIds: [], mentionFlags: [], unreadCounts: [] }),
  listChannels: async () => [],
  updateChannel: async () => ok({ id: "", name: "", description: "", createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, workspaceId: WS_ID, memberIds: [], isPublic: true, topic: "", pinnedMessageIds: [], mentionFlags: [], unreadCounts: [] }),
  updateChannelTopic: async () => ok({ id: "", name: "", description: "", createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, workspaceId: WS_ID, memberIds: [], isPublic: true, topic: "", pinnedMessageIds: [], mentionFlags: [], unreadCounts: [] }),
  deleteChannel: async () => ok(true),
  joinChannel: async () => ok({ id: "", name: "", description: "", createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, workspaceId: WS_ID, memberIds: [], isPublic: true, topic: "", pinnedMessageIds: [], mentionFlags: [], unreadCounts: [] }),
  leaveChannel: async () => ok({ id: "", name: "", description: "", createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, workspaceId: WS_ID, memberIds: [], isPublic: true, topic: "", pinnedMessageIds: [], mentionFlags: [], unreadCounts: [] }),
  sendMessage: async () => ok({ id: "", content: "", channelId: "", senderId: USER_ID, createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [], reactions: [] }),
  getMessages: async () => [],
  listMessages: async () => [],
  deleteMessage: async () => ok(true),
  searchMessages: async () => [],
  addReaction: async () => ok({ id: "", content: "", channelId: "", senderId: USER_ID, createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [], reactions: [] }),
  removeReaction: async () => ok({ id: "", content: "", channelId: "", senderId: USER_ID, createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [], reactions: [] }),
  pinMessage: async () => ok({ id: "", name: "", description: "", createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, workspaceId: WS_ID, memberIds: [], isPublic: true, topic: "", pinnedMessageIds: [], mentionFlags: [], unreadCounts: [] }),
  unpinMessage: async () => ok({ id: "", name: "", description: "", createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, workspaceId: WS_ID, memberIds: [], isPublic: true, topic: "", pinnedMessageIds: [], mentionFlags: [], unreadCounts: [] }),
  getChannelPins: async () => [],
  getThreadMessages: async () => [],
  markChannelRead: async () => ok(true),
  getUnreadCounts: async () => [],
  setUserStatus: async () => ok({ id: USER_ID, status: Variant_away_offline_online.online, customStatus: "", tenantId: TENANT_ID, workspaceId: WS_ID, lastSeen: now }),
  getUserStatus: async () => ({ id: USER_ID, status: Variant_away_offline_online.online, customStatus: "", tenantId: TENANT_ID, workspaceId: WS_ID, lastSeen: now }),

  // Calendar
  createCalendar: async () => ok({ id: "", name: "", color: "#6366f1", calendarType: CalendarType.team, ownerId: USER_ID, isVisible: true, createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  getCalendar: async () => ok({ id: "", name: "", color: "#6366f1", calendarType: CalendarType.team, ownerId: USER_ID, isVisible: true, createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  listCalendars: async () => [],
  updateCalendar: async () => ok({ id: "", name: "", color: "#6366f1", calendarType: CalendarType.team, ownerId: USER_ID, isVisible: true, createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  deleteCalendar: async () => ok(true),
  createEvent: async () => ok({ id: "", title: "", description: "", startTime: now, endTime: now, attendeeIds: [], calendarId: "", category: EventCategory.meeting, categoryColor: "", createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [], recurrence: RecurrenceRule.None, isRecurringSeries: false, rsvpRequired: false, timeZone: "UTC", isProjectDeadline: false }),
  getEvent: async () => ok({ id: "", title: "", description: "", startTime: now, endTime: now, attendeeIds: [], calendarId: "", category: EventCategory.meeting, categoryColor: "", createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [], recurrence: RecurrenceRule.None, isRecurringSeries: false, rsvpRequired: false, timeZone: "UTC", isProjectDeadline: false }),
  listEvents: async () => [],
  listMyEvents: async () => [],
  deleteEvent: async () => ok(true),
  respondToEvent: async () => ok({ id: "", status: RsvpStatus.accepted, eventId: "", userId: USER_ID, tenantId: TENANT_ID, workspaceId: WS_ID }),
  getEventRsvps: async () => [],
  listEventRsvps: async () => [],
  createEventException: async () => ok({ id: "", eventId: "", originalDate: "", exceptionType: ExceptionType.modified, createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  getEventException: async () => ok({ id: "", eventId: "", originalDate: "", exceptionType: ExceptionType.modified, createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  listEventExceptions: async () => [],
  getAvailability: async () => [],
  listProjectDeadlines: async () => [],

  // Payroll
  addEmployee: async () => ok({ id: "", firstName: "", lastName: "", email: "", userId: USER_ID, salary: BigInt(0), payFrequency: PayFrequency.BiWeekly, payScheduleId: "", currency: "USD", taxRate: BigInt(0), contractorFlag: false, isActive: true, startDate: now, timeZone: "UTC", createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  getEmployee: async () => ok({ id: "", firstName: "", lastName: "", email: "", userId: USER_ID, salary: BigInt(0), payFrequency: PayFrequency.BiWeekly, payScheduleId: "", currency: "USD", taxRate: BigInt(0), contractorFlag: false, isActive: true, startDate: now, timeZone: "UTC", createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  listEmployees: async () => [],
  deactivateEmployee: async () => ok({ id: "", firstName: "", lastName: "", email: "", userId: USER_ID, salary: BigInt(0), payFrequency: PayFrequency.BiWeekly, payScheduleId: "", currency: "USD", taxRate: BigInt(0), contractorFlag: false, isActive: false, startDate: now, timeZone: "UTC", createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  addPaySchedule: async () => ok({ id: "", name: "", description: "", frequency: PayFrequency.BiWeekly, isDefault: false, createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  listPaySchedules: async () => [],
  processPayroll: async () => ok({ id: "", status: PayrollStatus.PendingApproval, netAmount: 0, period: "", grossAmount: 0, deductionAmount: 0, taxAmount: 0, amount: BigInt(0), currency: "USD", employeeId: "", createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  listPayrollRecords: async () => [],
  bulkApprovePayroll: async () => ok(true),
  rejectPayrollRecord: async () => ok({ id: "", status: PayrollStatus.Rejected, netAmount: 0, period: "", grossAmount: 0, deductionAmount: 0, taxAmount: 0, amount: BigInt(0), currency: "USD", employeeId: "", createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  listPayStubs: async () => [],
  addContractor: async () => ok({ id: "", name: "", email: "", taxId: "", rate: 0, currency: "USD", isActive: true, createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  getContractor: async () => ok({ id: "", name: "", email: "", taxId: "", rate: 0, currency: "USD", isActive: true, createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  listContractors: async () => [],
  updateContractor: async () => ok({ id: "", name: "", email: "", taxId: "", rate: 0, currency: "USD", isActive: true, createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  addContractorPayment: async () => ok({ id: "", contractorId: "", amount: 0, reason: ContractorPaymentReason.freelanceInvoice, status: ContractorPaymentStatus.pending, notes: "", paymentDate: "", createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  listContractorPayments: async () => [],
  addBenefit: async () => ok({ id: "", name: "", monthlyCost: 0, employeeId: "", startDate: "", isActive: true, tenantId: TENANT_ID, workspaceId: WS_ID }),
  listBenefits: async () => [],
  addDeduction: async () => ok({ id: "", name: "", amount: 0, employeeId: "", deductionType: DeductionType.preTax, frequency: DeductionFrequency.perRun, isActive: true, createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  updateDeduction: async () => ok({ id: "", name: "", amount: 0, employeeId: "", deductionType: DeductionType.preTax, frequency: DeductionFrequency.perRun, isActive: true, createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  listDeductions: async () => [],
  addOffCyclePayment: async () => ok({ id: "", employeeId: "", amount: 0, reason: OffCycleReason.bonus, status: "pending" as any, notes: "", processImmediately: false, createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  listOffCyclePayments: async () => [],
  listPayrollAuditLog: async () => [],

  // Wallet
  createWalletAccount: async () => ok({ id: "", accountId: "", displayName: "", btcBalance: BigInt(0), userId: USER_ID, createdAt: now, icrc1Account: "", icpBalance: BigInt(0), tenantId: TENANT_ID, updatedAt: now, accountType: "personal" as any, workspaceId: WS_ID, principalId: "" }),
  getWalletAccount: async () => ok({ id: "", accountId: "", displayName: "", btcBalance: BigInt(0), userId: USER_ID, createdAt: now, icrc1Account: "", icpBalance: BigInt(0), tenantId: TENANT_ID, updatedAt: now, accountType: "personal" as any, workspaceId: WS_ID, principalId: "" }),
  getMyWalletAccount: async () => null,
  sendAsset: async () => ok({ id: "", status: TransactionStatus.Completed, asset: AssetType.ICP, accountId: "", amount: BigInt(0), txType: TransactionType.Send, createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID, requiredApprovals: BigInt(0), approvals: [] }),
  listTransactions: async () => [],
  createRecurringPayment: async () => ok({ id: "", accountId: "", toAddress: "", amount: BigInt(0), asset: AssetType.ICP, frequency: PayFrequency.Monthly, isActive: true, nextRunAt: now, createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  listRecurringPayments: async () => [],
  cancelRecurringPayment: async () => ok({ id: "", accountId: "", toAddress: "", amount: BigInt(0), asset: AssetType.ICP, frequency: PayFrequency.Monthly, isActive: false, nextRunAt: now, createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  createWorkspaceTreasury: async () => ok({ id: "", accountId: "", displayName: "", btcBalance: BigInt(0), userId: USER_ID, createdAt: now, icrc1Account: "", icpBalance: BigInt(0), tenantId: TENANT_ID, updatedAt: now, accountType: "treasury" as any, workspaceId: WS_ID, principalId: "" }),
  approveTransaction: async () => ok({ id: "", status: TransactionStatus.Completed, asset: AssetType.ICP, accountId: "", amount: BigInt(0), txType: TransactionType.Send, createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID, requiredApprovals: BigInt(0), approvals: [] }),
  exportTransactions: async () => "",
  getPendingApprovals: async () => [],
  getSpendingLimit: async () => null,
  setSpendingLimit: async () => ok({ id: "", maxAmount: 0, createdAt: now, role: Role.Admin, tenantId: TENANT_ID, updatedAt: now, currency: "ICP", workspaceId: WS_ID }),
  checkSpendingLimit: async () => true,
  getReceiveAddress: async () => ok(""),

  // Escrow
  createEscrow: async () => ok({ id: "", title: "", description: "", status: EscrowStatus.Pending, amount: BigInt(0), currency: "ICP", payerId: USER_ID, payeeId: USER_ID, conditions: [], createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [], statusHistory: [] }),
  getEscrow: async () => ok({ id: "", title: "", description: "", status: EscrowStatus.Pending, amount: BigInt(0), currency: "ICP", payerId: USER_ID, payeeId: USER_ID, conditions: [], createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [], statusHistory: [] }),
  listEscrows: async () => [],
  fundEscrow: async () => ok({ id: "", title: "", description: "", status: EscrowStatus.Funded, amount: BigInt(0), currency: "ICP", payerId: USER_ID, payeeId: USER_ID, conditions: [], createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [], statusHistory: [] }),
  releaseEscrow: async () => ok({ id: "", title: "", description: "", status: EscrowStatus.Released, amount: BigInt(0), currency: "ICP", payerId: USER_ID, payeeId: USER_ID, conditions: [], createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [], statusHistory: [] }),
  cancelEscrow: async () => ok({ id: "", title: "", description: "", status: EscrowStatus.Cancelled, amount: BigInt(0), currency: "ICP", payerId: USER_ID, payeeId: USER_ID, conditions: [], createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [], statusHistory: [] }),
  disputeEscrow: async () => ok({ id: "", title: "", description: "", status: EscrowStatus.Disputed, amount: BigInt(0), currency: "ICP", payerId: USER_ID, payeeId: USER_ID, conditions: [], createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [], statusHistory: [] }),
  getEscrowSummary: async () => ok({ id: "", status: EscrowStatus.Pending, title: "", createdAt: now, statusHistory: [], currency: "ICP", conditions: [], amount: BigInt(0), payeeId: "", payerId: "", milestoneCount: BigInt(0) }),
  listEscrowMilestones: async () => [],
  addEscrowMilestone: async () => ok({ id: "", status: MilestoneStatus__1.Pending, title: "", createdAt: now, description: "", tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, escrowId: "", amount: BigInt(0) }),
  updateEscrowMilestone: async () => ok({ id: "", status: MilestoneStatus__1.Pending, title: "", createdAt: now, description: "", tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, escrowId: "", amount: BigInt(0) }),
  approveMilestone: async () => ok({ id: "", status: MilestoneStatus__1.Approved, title: "", createdAt: now, description: "", tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, escrowId: "", amount: BigInt(0) }),
  releaseMilestoneFunds: async () => ok({ id: "", status: MilestoneStatus__1.Released, title: "", createdAt: now, description: "", tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, escrowId: "", amount: BigInt(0) }),
  listEscrowDisputes: async () => [],
  raiseEscrowDispute: async () => ok({ id: "", status: DisputeStatus.Open, createdAt: now, tenantId: TENANT_ID, updatedAt: now, raisedBy: USER_ID, workspaceId: WS_ID, escrowId: "", reason: "" }),
  resolveDispute: async () => ok({ id: "", status: DisputeStatus.Resolved, createdAt: now, tenantId: TENANT_ID, updatedAt: now, raisedBy: USER_ID, workspaceId: WS_ID, escrowId: "", reason: "" }),
  getEscrowDispute: async () => ok({ id: "", status: DisputeStatus.Open, createdAt: now, tenantId: TENANT_ID, updatedAt: now, raisedBy: USER_ID, workspaceId: WS_ID, escrowId: "", reason: "" }),
  assignArbiter: async () => ok({ id: "", status: DisputeStatus.Open, createdAt: now, tenantId: TENANT_ID, updatedAt: now, raisedBy: USER_ID, workspaceId: WS_ID, escrowId: "", reason: "" }),

  // Forms
  createForm: async () => ok({ id: "", title: "", description: "", status: FormStatus.Draft, publicUrl: "", fields: [], createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  getForm: async () => ok({ id: "", title: "", description: "", status: FormStatus.Draft, publicUrl: "", fields: [], createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  listForms: async () => [],
  deleteForm: async () => ok(true),
  getPublicForm: async () => null,
  submitFormResponse: async () => ok({ id: "", formId: "", data: [], submitterEmail: "", submittedAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  listFormSubmissions: async () => [],

  // Whiteboards
  createWhiteboard: async () => ok({ id: "", title: "", elements: [], createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  getWhiteboard: async () => ok({ id: "", title: "", elements: [], createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  listWhiteboards: async () => [],
  deleteWhiteboard: async () => ok(true),

  // AI
  saveAIConfig: async () => ok({ id: "", provider: AIProvider.OpenAI, model: "", apiKey: "", createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  getAIConfig: async () => null,
  submitAIPrompt: async () => ok({ id: "", content: "", model: "", tokensUsed: BigInt(0), promptId: "", createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  getPromptHistory: async () => [],

  // Integrations
  saveIntegration: async () => ok({ id: "", provider: IntegrationProvider.Slack, status: IntegrationStatus.Connected, accessToken: "", config: "{}", createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  getIntegrations: async () => [],
  deleteIntegration: async () => ok(true),
  addIntegrationEvent: async () => ok({ id: "", integrationId: "", eventType: "", payload: "{}", timestamp: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  getIntegrationEvents: async () => [],

  // Time tracking
  createTimeEntry: async () => ok({ id: "", projectId: "", userId: USER_ID, startTime: now, durationMinutes: BigInt(0), billable: false, notes: "", createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  deleteTimeEntry: async () => ok(true),
  getProjectTimeEntries: async () => [],
  getTaskTimeEntries: async () => [],
  getUserTimeEntries: async () => [],

  // Guest access
  createGuestInvitation: async () => ok({ id: "", inviteToken: "", inviteeEmail: "", projectId: "", expiresAt: now, accepted: false, invitedBy: USER_ID, createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  acceptGuestInvitation: async () => ok({ id: "", email: "", status: GuestStatus.Active, projectIds: [], createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  getGuestUser: async () => null,
  listGuestUsers: async () => [],

  // Automation
  createAutomationRule: async () => ok({ id: "", name: "", description: "", trigger: AutomationTrigger.OnTaskStatusChange, action: AutomationAction.SendNotification, isActive: true, createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, workspaceId: WS_ID }),
  listAutomationRules: async () => [],
  toggleAutomationRule: async () => ok({ id: "", name: "", description: "", trigger: AutomationTrigger.OnTaskStatusChange, action: AutomationAction.SendNotification, isActive: false, createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, workspaceId: WS_ID }),

  // Backup
  createBackup: async () => ok({ id: "", backupLabel: "", status: BackupStatus.Completed, createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, workspaceId: WS_ID }),
  getBackup: async () => ok({ id: "", backupLabel: "", status: BackupStatus.Completed, createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, workspaceId: WS_ID }),
  listBackups: async () => [],

  // Time tracking (extended)
  updateTimeEntry: async () => ok({ id: "", projectId: "", userId: USER_ID, startTime: now, durationMinutes: BigInt(0), billable: false, notes: "", createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),
  getTimeReport: async () => ({ byUser: [], totalHours: 0, entries: [], byProject: [], billableHours: 0, nonBillableHours: 0 }),
  exportTimeEntries: async () => "",
  getWeeklyTimesheet: async () => [],

  // Goals / OKR
  createGoal: async () => ok({ id: "", status: GoalStatus.Active, title: "", endDate: now, ownerId: USER_ID, period: "", createdAt: now, tenantId: TENANT_ID, updatedAt: now, progress: 0, workspaceId: WS_ID, isPublic: false, contributorIds: [], keyResults: [], startDate: now }),
  getGoal: async () => ok({ id: "", status: GoalStatus.Active, title: "", endDate: now, ownerId: USER_ID, period: "", createdAt: now, tenantId: TENANT_ID, updatedAt: now, progress: 0, workspaceId: WS_ID, isPublic: false, contributorIds: [], keyResults: [], startDate: now }),
  updateGoal: async () => ok({ id: "", status: GoalStatus.Active, title: "", endDate: now, ownerId: USER_ID, period: "", createdAt: now, tenantId: TENANT_ID, updatedAt: now, progress: 0, workspaceId: WS_ID, isPublic: false, contributorIds: [], keyResults: [], startDate: now }),
  deleteGoal: async () => ok(true),
  listGoals: async () => [],
  toggleGoalPublic: async () => ok({ id: "", status: GoalStatus.Active, title: "", endDate: now, ownerId: USER_ID, period: "", createdAt: now, tenantId: TENANT_ID, updatedAt: now, progress: 0, workspaceId: WS_ID, isPublic: true, contributorIds: [], keyResults: [], startDate: now }),
  addKeyResult: async () => ok({ id: "", status: KRStatus.OnTrack, title: "", createdAt: now, unit: "", goalId: "", tenantId: TENANT_ID, currentValue: 0, updatedAt: now, linkedTaskIds: [], workspaceId: WS_ID, targetValue: 0 }),
  updateKeyResult: async () => ok({ id: "", status: KRStatus.OnTrack, title: "", createdAt: now, unit: "", goalId: "", tenantId: TENANT_ID, currentValue: 0, updatedAt: now, linkedTaskIds: [], workspaceId: WS_ID, targetValue: 0 }),
  deleteKeyResult: async () => ok(true),
  listKeyResults: async () => [],
  linkTaskToKR: async () => ok({ id: "", status: KRStatus.OnTrack, title: "", createdAt: now, unit: "", goalId: "", tenantId: TENANT_ID, currentValue: 0, updatedAt: now, linkedTaskIds: [], workspaceId: WS_ID, targetValue: 0 }),
  unlinkTaskFromKR: async () => ok({ id: "", status: KRStatus.OnTrack, title: "", createdAt: now, unit: "", goalId: "", tenantId: TENANT_ID, currentValue: 0, updatedAt: now, linkedTaskIds: [], workspaceId: WS_ID, targetValue: 0 }),
  recordCheckIn: async () => ok({ id: "", userId: USER_ID, note: "", newValue: 0, goalId: "", previousValue: 0, tenantId: TENANT_ID, timestamp: now, workspaceId: WS_ID }),
  listCheckIns: async () => [],
  getOrCreateWorkspaceShareToken: async () => "",
  regenerateWorkspaceShareToken: async () => "",
  getPublicGoals: async () => ok([]),

  // Integrations (extended)
  processIntegrationTrigger: async () => ok({ id: "", integrationId: "", tenantId: TENANT_ID, timestamp: now, workspaceId: WS_ID, payload: "{}", eventType: "" }),
  getIntegrationActivityLog: async () => [],
  updateIntegrationSyncStatus: async () => ok(true),

  // Whiteboard (extended)
  updateWhiteboardElements: async () => ok({ id: "", title: "", elements: [], createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  convertWhiteboardElementToTask: async () => ok({ id: "", title: "", elements: [], createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  listWhiteboardTemplates: async () => [],

  // Projects (extended)
  createProjectFromTemplate: async () => ok(""),
  updateProject: async () => ok({ id: "", name: "", description: "", status: ProjectStatus.Active, ownerId: USER_ID, createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, memberIds: [], crossLinks: [] }),

  // Guest access (extended)
  updateGuestStatus: async () => ok({ id: "", email: "", status: GuestStatus.Active, projectIds: [], createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),

  // Employee (extended)
  updateEmployee: async () => ok({ id: "", firstName: "", lastName: "", email: "", userId: USER_ID, salary: BigInt(0), payFrequency: PayFrequency.BiWeekly, payScheduleId: "", currency: "USD", taxRate: BigInt(0), contractorFlag: false, isActive: true, startDate: now, timeZone: "UTC", createdAt: now, tenantId: TENANT_ID, workspaceId: WS_ID }),

  // Forms (extended)
  updateForm: async () => ok({ id: "", title: "", description: "", status: FormStatus.Draft, publicUrl: "", fields: [], createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
  getFormAnalytics: async () => ({ recentSubmissions: [], fieldCompletionRates: [], submissionCount: BigInt(0) }),

  // Calendar (extended)
  updateEvent: async () => ok({ id: "", title: "", description: "", startTime: now, endTime: now, attendeeIds: [], calendarId: "", category: EventCategory.meeting, categoryColor: "", createdAt: now, createdBy: USER_ID, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [], recurrence: RecurrenceRule.None, isRecurringSeries: false, rsvpRequired: false, timeZone: "UTC", isProjectDeadline: false }),

  // AI (extended)
  getAIResponses: async () => [],

  // Pages (extended)
  updatePage: async () => ok({ id: "", title: "", icon: "📄", blocks: [], authorId: USER_ID, createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [], watchers: [] }),

  // Workspace (extended)
  updateWorkspace: async () => ok({ id: WS_ID, name: "", ownerId: USER_ID, createdAt: now, tenantId: TENANT_ID, members: [] as any }),
  updateWorkspaceMemberRole: async () => ok({ displayName: "", userId: USER_ID, joinedAt: now, role: WorkspaceRole.Admin, email: "", workspaceId: WS_ID }),
  upsertProfile: async () => ok({ displayName: "", userId: USER_ID, createdAt: now, role: Role.Admin, email: "", tenantId: TENANT_ID, workspaceId: WS_ID }),

  // Audit logs
  listAuditLogs: async () => [],

  // Sprint (extended)
  updateSprint: async () => ok({ id: "", name: "", goal: "", status: SprintStatus.active, taskIds: [], startDate: now, endDate: now, projectId: "", createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),

  // Subtask (extended)
  updateSubtask: async () => ok({ id: "", status: TaskStatus.Todo, title: "", order: BigInt(0), description: "", priority: TaskPriority.Medium, projectId: "", parentTaskId: "", createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),

  // Task (extended)
  updateTask: async () => ok({ id: "", title: "", description: "", status: TaskStatus.Todo, priority: TaskPriority.Medium, projectId: "", createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [] }),

  // Note (extended)
  updateNote: async () => ok({ id: "", title: "", content: "", authorId: USER_ID, createdAt: now, tags: [], tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID, crossLinks: [] }),

  // Milestone (extended)
  updateMilestone: async () => ok({ id: "", title: "", description: "", status: MilestoneStatus.upcoming, dueDate: now, projectId: "", linkedTaskIds: [], createdAt: now, tenantId: TENANT_ID, updatedAt: now, workspaceId: WS_ID }),
} as any;
