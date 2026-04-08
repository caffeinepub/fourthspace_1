import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Goal {
    id: EntityId;
    status: GoalStatus;
    title: string;
    endDate: Timestamp;
    ownerId: UserId;
    period: string;
    createdAt: Timestamp;
    description?: string;
    tenantId: TenantId;
    updatedAt: Timestamp;
    progress: number;
    workspaceId: WorkspaceId;
    isPublic: boolean;
    contributorIds: Array<UserId>;
    keyResults: Array<EntityId>;
    startDate: Timestamp;
}
export interface FormBranding {
    backgroundColor?: string;
    primaryColor?: string;
    logoUrl?: string;
}
export interface Reaction {
    userIds: Array<Principal>;
    emoji: string;
}
export interface EmployeeInput {
    salary: bigint;
    userId: UserId;
    email: string;
    payScheduleId: string;
    currency: string;
    payFrequency: PayFrequency;
    lastName: string;
    contractorFlag: boolean;
    taxRate: bigint;
    timeZone: string;
    startDate: Timestamp;
    firstName: string;
}
export interface EventRsvp {
    id: EntityId;
    status: RsvpStatus;
    eventId: string;
    userId: UserId;
    tenantId: TenantId;
    workspaceId: WorkspaceId;
    respondedAt?: Timestamp;
}
export interface PayStub {
    id: EntityId;
    taxDeductions: number;
    period: string;
    generatedAt: Timestamp;
    grossPay: number;
    netPay: number;
    tenantId: TenantId;
    employeeId: EntityId;
    details: string;
    workspaceId: WorkspaceId;
    payrollRecordId: EntityId;
    otherDeductions: number;
}
export interface ActivityEvent {
    id: EntityId;
    metadata: string;
    createdAt: Timestamp;
    description: string;
    actorId: UserId;
    tenantId: TenantId;
    taskId: EntityId;
    projectId: EntityId;
    workspaceId: WorkspaceId;
    eventType: ActivityEventType;
}
export interface Whiteboard {
    id: EntityId;
    title: string;
    templateId?: string;
    createdAt: Timestamp;
    createdBy: UserId;
    templateName?: string;
    tenantId: TenantId;
    updatedAt: Timestamp;
    elements: Array<WhiteboardElement>;
    projectId?: EntityId;
    workspaceId: WorkspaceId;
}
export interface PageInput {
    title: string;
    icon: string;
    blocks: Array<string>;
    coverUrl?: string;
    parentPageId?: EntityId;
}
export interface GoalInput {
    title: string;
    endDate: Timestamp;
    period: string;
    description?: string;
    contributorIds: Array<UserId>;
    startDate: Timestamp;
}
export interface UserStatus {
    id: Principal;
    customStatus: string;
    status: Variant_away_offline_online;
    tenantId: TenantId;
    workspaceId: WorkspaceId;
    lastSeen: bigint;
}
export interface TimeEntry {
    id: EntityId;
    startTime: Timestamp;
    endTime?: Timestamp;
    userId: UserId;
    createdAt: Timestamp;
    tenantId: TenantId;
    taskId?: EntityId;
    billable: boolean;
    durationMinutes: bigint;
    projectId: EntityId;
    notes: string;
    workspaceId: WorkspaceId;
}
export type TenantId = string;
export interface EscrowSummary {
    id: EntityId;
    status: EscrowStatus;
    title: string;
    createdAt: Timestamp;
    statusHistory: Array<StatusHistoryEntry>;
    currency: string;
    conditions: Array<string>;
    amount: bigint;
    payeeId: string;
    payerId: string;
    milestoneCount: bigint;
}
export interface AIPrompt {
    id: EntityId;
    model: string;
    content: string;
    userId: UserId;
    createdAt: Timestamp;
    promptType: AIPromptType;
    tenantId: TenantId;
    workspaceId: WorkspaceId;
}
export interface RecurringPayment {
    id: EntityId;
    asset: AssetType;
    accountId: EntityId;
    createdAt: Timestamp;
    isActive: boolean;
    tenantId: TenantId;
    nextRunAt: Timestamp;
    workspaceId: WorkspaceId;
    frequency: PayFrequency;
    toAddress: string;
    amount: bigint;
}
export interface Event {
    id: EntityId;
    startTime: Timestamp;
    title: string;
    endTime: Timestamp;
    isRecurringSeries: boolean;
    createdAt: Timestamp;
    createdBy: UserId;
    description: string;
    attendeeIds: Array<UserId>;
    seriesId?: string;
    tenantId: TenantId;
    recurrence: RecurrenceRule;
    updatedAt: Timestamp;
    categoryColor: string;
    projectId?: string;
    linkedNoteId?: string;
    rsvpRequired: boolean;
    calendarId: string;
    category: EventCategory;
    workspaceId: WorkspaceId;
    crossLinks: Array<CrossLink>;
    isProjectDeadline: boolean;
    timeZone: string;
}
export interface EscrowMilestoneInput {
    title: string;
    description: string;
    amount: bigint;
}
export interface WhiteboardTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    definition: string;
}
export interface EscrowDispute {
    id: EntityId;
    status: DisputeStatus;
    arbiter?: Principal;
    createdAt: Timestamp;
    resolution?: string;
    tenantId: TenantId;
    updatedAt: Timestamp;
    raisedBy: Principal;
    workspaceId: WorkspaceId;
    escrowId: EntityId;
    reason: string;
}
export interface DashboardStats {
    memberCount: bigint;
    goalCount: bigint;
    noteCount: bigint;
    taskCount: bigint;
    projectCount: bigint;
}
export interface AIConfig {
    id: EntityId;
    model: string;
    provider: AIProvider;
    createdAt: Timestamp;
    tenantId: TenantId;
    apiKey: string;
    workspaceId: WorkspaceId;
}
export type UserId = Principal;
export interface MentionEntry {
    userId: Principal;
    hasMention: boolean;
}
export interface PaySchedule {
    id: EntityId;
    name: string;
    createdAt: Timestamp;
    description: string;
    tenantId: TenantId;
    isDefault: boolean;
    workspaceId: WorkspaceId;
    frequency: PayFrequency;
}
export interface TransactionApproval {
    id: EntityId;
    txId: EntityId;
    tenantId: TenantId;
    approved: boolean;
    approver: Principal;
    timestamp: Timestamp;
    workspaceId: WorkspaceId;
}
export interface OffCyclePaymentInput {
    processImmediately: boolean;
    employeeId: EntityId;
    notes: string;
    amount: number;
    reason: OffCycleReason;
}
export interface TaskTemplateInput {
    name: string;
    description: string;
    projectId?: EntityId;
    checklistItems: Array<string>;
    defaultPriority: TaskPriority;
    defaultAssigneeId?: UserId;
}
export interface NoteEditorPresence {
    displayName: string;
    userId: UserId;
    lastSeen: bigint;
}
export interface ContractorInput {
    taxId: string;
    name: string;
    rate: number;
    email: string;
    currency: string;
}
export interface EventRsvpInput {
    status: RsvpStatus;
    eventId: string;
}
export interface Project {
    id: EntityId;
    status: ProjectStatus;
    ownerId: UserId;
    name: string;
    createdAt: Timestamp;
    description: string;
    tenantId: TenantId;
    updatedAt: Timestamp;
    workspaceId: WorkspaceId;
    memberIds: Array<UserId>;
    crossLinks: Array<CrossLink>;
}
export interface Block {
    id: EntityId;
    content: string;
    order: bigint;
    metadata: string;
    blockType: BlockTypeTag;
    parentId?: EntityId;
}
export interface TaskTemplate {
    id: EntityId;
    name: string;
    createdAt: Timestamp;
    description: string;
    tenantId: TenantId;
    updatedAt: Timestamp;
    projectId?: EntityId;
    checklistItems: Array<string>;
    workspaceId: WorkspaceId;
    defaultPriority: TaskPriority;
    defaultAssigneeId?: UserId;
}
export interface Backup {
    id: EntityId;
    status: BackupStatus;
    completedAt?: Timestamp;
    createdAt: Timestamp;
    createdBy: UserId;
    tenantId: TenantId;
    backupLabel: string;
    workspaceId: WorkspaceId;
    sizeBytes?: bigint;
}
export interface PayScheduleInput {
    name: string;
    description: string;
    isDefault: boolean;
    frequency: PayFrequency;
}
export interface Task {
    id: EntityId;
    status: TaskStatus;
    title: string;
    assigneeId?: UserId;
    createdAt: Timestamp;
    dueDate?: Timestamp;
    description: string;
    tenantId: TenantId;
    updatedAt: Timestamp;
    projectId: EntityId;
    workspaceId: WorkspaceId;
    priority: TaskPriority;
    crossLinks: Array<CrossLink>;
}
export interface TimeReportFilter {
    userId?: UserId;
    toDate?: Timestamp;
    billable?: boolean;
    projectId?: EntityId;
    fromDate?: Timestamp;
}
export interface Form {
    id: EntityId;
    status: FormStatus;
    title: string;
    formTemplateId?: string;
    publicUrl: string;
    createdAt: Timestamp;
    createdBy: UserId;
    description: string;
    tenantId: TenantId;
    fields: Array<FormField>;
    updatedAt: Timestamp;
    autoCreateTask?: AutoCreateTaskConfig;
    workspaceId: WorkspaceId;
    branding?: FormBranding;
}
export interface DailyTimesheetEntry {
    totalHours: number;
    date: Timestamp;
    entries: Array<TimeEntry>;
}
export interface GuestUser {
    id: EntityId;
    status: GuestStatus;
    principal?: UserId;
    createdAt: Timestamp;
    email: string;
    tenantId: TenantId;
    workspaceId: WorkspaceId;
    projectIds: Array<EntityId>;
}
export interface Deduction {
    id: EntityId;
    name: string;
    createdAt: Timestamp;
    isActive: boolean;
    tenantId: TenantId;
    employeeId: EntityId;
    workspaceId: WorkspaceId;
    frequency: DeductionFrequency;
    amount: number;
    deductionType: DeductionType;
}
export interface AIResponse {
    id: EntityId;
    model: string;
    content: string;
    createdAt: Timestamp;
    tokensUsed: bigint;
    tenantId: TenantId;
    workspaceId: WorkspaceId;
    promptId: EntityId;
}
export interface TaskComment {
    id: EntityId;
    content: string;
    authorId: UserId;
    createdAt: Timestamp;
    tenantId: TenantId;
    updatedAt: Timestamp;
    taskId: EntityId;
    workspaceId: WorkspaceId;
    editedAt?: Timestamp;
}
export interface TaskWatcher {
    userId: UserId;
    tenantId: TenantId;
    taskId: EntityId;
    addedAt: Timestamp;
    workspaceId: WorkspaceId;
}
export interface ProjectInput {
    name: string;
    description: string;
    memberIds: Array<UserId>;
}
export interface SprintInput {
    taskIds: Array<EntityId>;
    endDate: Timestamp;
    goal: string;
    name: string;
    projectId: EntityId;
    startDate: Timestamp;
}
export interface IntegrationInput {
    provider: IntegrationProvider;
    oauthToken?: string;
    accessToken: string;
    config: string;
}
export interface FormInput {
    title: string;
    formTemplateId?: string;
    description: string;
    fields: Array<FormField>;
    autoCreateTask?: AutoCreateTaskConfig;
    branding?: FormBranding;
}
export type WorkspaceId = string;
export interface ChecklistItemInput {
    content: string;
    order: bigint;
    completed: boolean;
    taskId: EntityId;
}
export interface WalletAccount {
    id: EntityId;
    accountId: string;
    displayName: string;
    btcBalance: bigint;
    userId: UserId;
    createdAt: Timestamp;
    icrc1Account: string;
    icpBalance: bigint;
    tenantId: TenantId;
    updatedAt: Timestamp;
    accountType: AccountType;
    workspaceId: WorkspaceId;
    principalId: string;
}
export interface AIPromptInput {
    model: string;
    content: string;
    contextData?: string;
    promptType: AIPromptType;
    contextEntityType?: string;
    contextEntityId?: EntityId;
}
export interface ContractorPaymentInput {
    contractorId: EntityId;
    notes: string;
    paymentDate: string;
    amount: number;
    reason: ContractorPaymentReason;
}
export interface KeyResult {
    id: EntityId;
    status: KRStatus;
    title: string;
    createdAt: Timestamp;
    unit: string;
    goalId: EntityId;
    description?: string;
    tenantId: TenantId;
    currentValue: number;
    updatedAt: Timestamp;
    linkedTaskIds: Array<EntityId>;
    workspaceId: WorkspaceId;
    targetValue: number;
}
export interface PageNode {
    id: EntityId;
    title: string;
    authorId: UserId;
    icon: string;
    createdAt: Timestamp;
    tenantId: TenantId;
    updatedAt: Timestamp;
    blocks: Array<Block>;
    workspaceId: WorkspaceId;
    coverUrl?: string;
    crossLinks: Array<CrossLink>;
    parentPageId?: EntityId;
    watchers: Array<UserId>;
}
export interface GoalCheckIn {
    id: EntityId;
    userId: UserId;
    krId?: EntityId;
    note: string;
    newValue: number;
    goalId: EntityId;
    previousValue: number;
    tenantId: TenantId;
    timestamp: Timestamp;
    workspaceId: WorkspaceId;
}
export interface AIConfigInput {
    model: string;
    provider: AIProvider;
    apiKey: string;
}
export interface ContractorPayment {
    id: EntityId;
    status: ContractorPaymentStatus;
    createdAt: Timestamp;
    contractorId: EntityId;
    tenantId: TenantId;
    processedAt?: Timestamp;
    notes: string;
    paymentDate: string;
    workspaceId: WorkspaceId;
    amount: number;
    reason: ContractorPaymentReason;
}
export interface Milestone {
    id: EntityId;
    status: MilestoneStatus;
    title: string;
    createdAt: Timestamp;
    dueDate: Timestamp;
    description: string;
    tenantId: TenantId;
    updatedAt: Timestamp;
    projectId: EntityId;
    linkedTaskIds: Array<EntityId>;
    workspaceId: WorkspaceId;
}
export type BlockTypeTag = string;
export interface PublicKeyResult {
    id: EntityId;
    status: KRStatus;
    title: string;
    unit: string;
    description?: string;
    currentValue: number;
    targetValue: number;
}
export interface ChecklistItem {
    id: EntityId;
    content: string;
    order: bigint;
    createdAt: Timestamp;
    completed: boolean;
    tenantId: TenantId;
    updatedAt: Timestamp;
    taskId: EntityId;
    workspaceId: WorkspaceId;
}
export interface ActivityEntry {
    action: string;
    entityTitle: string;
    actorId: string;
    timestamp: bigint;
    entityType: string;
}
export interface MessageInput {
    content: string;
    channelId: EntityId;
    replyToId?: EntityId;
    crossLinks: Array<CrossLink>;
}
export interface WorkspaceInput {
    name: string;
}
export interface RecurringTask {
    id: EntityId;
    title: string;
    assigneeId?: UserId;
    lastCreatedAt?: Timestamp;
    createdAt: Timestamp;
    description: string;
    tenantId: TenantId;
    recurrenceType: RecurrenceType;
    updatedAt: Timestamp;
    nextDueAt: Timestamp;
    projectId: EntityId;
    workspaceId: WorkspaceId;
    priority: TaskPriority;
}
export type EntityId = string;
export interface ConditionalLogic {
    value: string;
    operator: string;
    fieldId: string;
}
export interface MilestoneInput {
    title: string;
    dueDate: Timestamp;
    description: string;
    projectId: EntityId;
    linkedTaskIds: Array<EntityId>;
}
export interface EscrowContract {
    id: EntityId;
    status: EscrowStatus;
    title: string;
    createdAt: Timestamp;
    dueDate?: Timestamp;
    description: string;
    statusHistory: Array<StatusHistoryEntry>;
    tenantId: TenantId;
    updatedAt: Timestamp;
    currency: string;
    workspaceId: WorkspaceId;
    conditions: Array<string>;
    fundingBlockHeight?: bigint;
    crossLinks: Array<CrossLink>;
    amount: bigint;
    payeeId: UserId;
    payerId: UserId;
    fundedAmount?: bigint;
}
export interface NoteLastEdit {
    displayName: string;
    userId: UserId;
    editedAt: bigint;
}
export interface StatusHistoryEntry {
    status: EscrowStatus;
    changedBy: Principal;
    note?: string;
    timestamp: Timestamp;
}
export interface TaskInput {
    title: string;
    assigneeId?: UserId;
    dueDate?: Timestamp;
    description: string;
    projectId: EntityId;
    priority: TaskPriority;
    crossLinks: Array<CrossLink>;
}
export interface SubtaskInput {
    status: TaskStatus;
    title: string;
    assigneeId?: UserId;
    order: bigint;
    dueDate?: Timestamp;
    description: string;
    projectId: EntityId;
    parentTaskId: EntityId;
    priority: TaskPriority;
}
export interface Subtask {
    id: EntityId;
    status: TaskStatus;
    title: string;
    assigneeId?: UserId;
    order: bigint;
    createdAt: Timestamp;
    dueDate?: Timestamp;
    description: string;
    tenantId: TenantId;
    updatedAt: Timestamp;
    projectId: EntityId;
    parentTaskId: EntityId;
    workspaceId: WorkspaceId;
    priority: TaskPriority;
}
export interface AutoCreateTaskConfig {
    assigneeId?: Principal;
    taskTitle: string;
    projectId: string;
}
export interface EscrowMilestone {
    id: EntityId;
    status: MilestoneStatus__1;
    title: string;
    createdAt: Timestamp;
    description: string;
    tenantId: TenantId;
    updatedAt: Timestamp;
    ledgerBlockHeight?: bigint;
    workspaceId: WorkspaceId;
    escrowId: EntityId;
    amount: bigint;
}
export interface TimeReport {
    byUser: Array<[UserId, number]>;
    totalHours: number;
    entries: Array<TimeEntry>;
    byProject: Array<[EntityId, number]>;
    billableHours: number;
    nonBillableHours: number;
}
export interface TimeEntryInput {
    startTime: Timestamp;
    endTime?: Timestamp;
    taskId?: EntityId;
    billable: boolean;
    durationMinutes: bigint;
    projectId: EntityId;
    notes: string;
}
export interface TaskCommentInput {
    content: string;
    taskId: EntityId;
}
export interface EventExceptionInput {
    eventId: string;
    originalDate: string;
    exceptionType: ExceptionType;
    overrideData?: EventInput;
}
export interface Note {
    id: EntityId;
    title: string;
    content: string;
    lastEditedAt?: Timestamp;
    lastEditedBy?: UserId;
    authorId: UserId;
    createdAt: Timestamp;
    tags: Array<string>;
    tenantId: TenantId;
    updatedAt: Timestamp;
    iconEmoji?: string;
    workspaceId: WorkspaceId;
    coverGradient?: string;
    crossLinks: Array<CrossLink>;
}
export interface BenefitInput {
    endDate?: string;
    name: string;
    employeeId: EntityId;
    monthlyCost: number;
    startDate: string;
}
export interface FormSubmission {
    id: EntityId;
    data: Array<[string, string]>;
    submittedAt: Timestamp;
    tenantId: TenantId;
    workspaceId: WorkspaceId;
    submitterEmail: string;
    formId: EntityId;
}
export interface AuditLogEntry {
    id: EntityId;
    action: string;
    tenantId: TenantId;
    entityId: EntityId;
    performedBy: UserId;
    timestamp: Timestamp;
    details: string;
    workspaceId: WorkspaceId;
    entityType: string;
}
export interface Channel {
    id: EntityId;
    topic?: string;
    mentionFlags?: Array<MentionEntry>;
    unreadCounts?: Array<UnreadEntry>;
    name: string;
    createdAt: Timestamp;
    createdBy: UserId;
    description: string;
    tenantId: TenantId;
    workspaceId: WorkspaceId;
    memberIds: Array<UserId>;
    isPublic: boolean;
    pinnedMessageIds?: Array<string>;
}
export interface AvailabilitySlot {
    userId: UserId;
    date: string;
    busyPeriods: Array<[string, string]>;
    timeZone: string;
}
export interface IntegrationEvent {
    id: EntityId;
    integrationId: EntityId;
    triggerAction?: string;
    tenantId: TenantId;
    timestamp: Timestamp;
    workspaceId: WorkspaceId;
    payload: string;
    eventType: string;
}
export interface CalendarDefInput {
    calendarType: CalendarType;
    name: string;
    color: string;
    projectId?: string;
    isVisible: boolean;
}
export interface EventException {
    id: EntityId;
    eventId: string;
    originalDate: string;
    exceptionType: ExceptionType;
    createdAt: Timestamp;
    tenantId: TenantId;
    overrideData?: EventInput;
    workspaceId: WorkspaceId;
}
export interface KeyResultInput {
    title: string;
    unit: string;
    goalId: EntityId;
    description?: string;
    targetValue: number;
}
export interface CalendarDef {
    id: EntityId;
    calendarType: CalendarType;
    ownerId: UserId;
    name: string;
    createdAt: Timestamp;
    color: string;
    tenantId: TenantId;
    projectId?: string;
    isVisible: boolean;
    workspaceId: WorkspaceId;
}
export interface OffCyclePayment {
    id: EntityId;
    status: OffCycleStatus;
    createdAt: Timestamp;
    processImmediately: boolean;
    tenantId: TenantId;
    employeeId: EntityId;
    notes: string;
    workspaceId: WorkspaceId;
    amount: number;
    reason: OffCycleReason;
}
export interface Contractor {
    id: EntityId;
    taxId: string;
    name: string;
    createdAt: Timestamp;
    rate: number;
    isActive: boolean;
    email: string;
    tenantId: TenantId;
    currency: string;
    workspaceId: WorkspaceId;
}
export interface CheckInInput {
    krId?: EntityId;
    note: string;
    newValue: number;
    goalId: EntityId;
}
export interface FormAnalytics {
    recentSubmissions: Array<FormSubmission>;
    fieldCompletionRates: Array<FieldCompletionRate>;
    submissionCount: bigint;
}
export interface Benefit {
    id: EntityId;
    endDate?: string;
    name: string;
    isActive: boolean;
    tenantId: TenantId;
    employeeId: EntityId;
    workspaceId: WorkspaceId;
    monthlyCost: number;
    startDate: string;
}
export interface UserProfile {
    displayName: string;
    userId: UserId;
    createdAt: Timestamp;
    role: Role;
    email: string;
    tenantId: TenantId;
    workspaceId: EntityId;
}
export interface GuestInvitationInput {
    expiresAt: Timestamp;
    inviteeEmail: string;
    projectId: EntityId;
}
export interface CrossLink {
    linkLabel: string;
    tenantId: TenantId;
    entityId: EntityId;
    entityType: string;
}
export type Timestamp = bigint;
export interface AuditLog {
    id: EntityId;
    action: string;
    userId: UserId;
    tenantId: TenantId;
    entityId: EntityId;
    timestamp: Timestamp;
    details: string;
    workspaceId: WorkspaceId;
    entityType: string;
}
export interface FormField {
    id: EntityId;
    fieldLabel: string;
    required: boolean;
    conditionalLogic?: ConditionalLogic;
    options: Array<string>;
    fieldType: FormFieldType;
}
export interface AutomationRule {
    id: EntityId;
    action: AutomationAction;
    trigger: AutomationTrigger;
    name: string;
    createdAt: Timestamp;
    createdBy: UserId;
    description: string;
    isActive: boolean;
    tenantId: TenantId;
    workspaceId: WorkspaceId;
}
export interface WorkspaceSpendingLimit {
    id: EntityId;
    maxAmount: number;
    createdAt: Timestamp;
    role: Role;
    tenantId: TenantId;
    updatedAt: Timestamp;
    currency: string;
    workspaceId: WorkspaceId;
}
export interface WalletTransaction {
    id: EntityId;
    status: TransactionStatus;
    requiredApprovals: bigint;
    asset: AssetType;
    accountId: EntityId;
    fromAddress?: string;
    memoValue?: bigint;
    memo?: string;
    createdAt: Timestamp;
    tenantId: TenantId;
    ledgerTxHash?: string;
    ledgerBlockHeight?: bigint;
    workspaceId: WorkspaceId;
    txType: TransactionType;
    toAddress?: string;
    amount: bigint;
    approvals: Array<TransactionApproval>;
}
export interface NoteTemplateInput {
    icon: string;
    name: string;
    description: string;
    blocksJson: string;
}
export interface FieldCompletionRate {
    completionRate: number;
    fieldId: string;
}
export interface Sprint {
    id: EntityId;
    status: SprintStatus;
    taskIds: Array<EntityId>;
    endDate: Timestamp;
    goal: string;
    name: string;
    createdAt: Timestamp;
    tenantId: TenantId;
    updatedAt: Timestamp;
    projectId: EntityId;
    workspaceId: WorkspaceId;
    startDate: Timestamp;
}
export interface FormSubmissionInput {
    data: Array<[string, string]>;
    submitterEmail: string;
    formId: EntityId;
}
export interface NoteTemplate {
    id: EntityId;
    authorId: UserId;
    icon: string;
    name: string;
    createdAt: Timestamp;
    description: string;
    tenantId: TenantId;
    blocksJson: string;
    workspaceId: WorkspaceId;
}
export interface EscrowInput {
    title: string;
    dueDate?: Timestamp;
    description: string;
    currency: string;
    conditions: Array<string>;
    crossLinks: Array<CrossLink>;
    amount: bigint;
    payeeId: UserId;
}
export interface Employee {
    id: EntityId;
    salary: bigint;
    userId: UserId;
    createdAt: Timestamp;
    isActive: boolean;
    email: string;
    tenantId: TenantId;
    payScheduleId: string;
    currency: string;
    workspaceId: WorkspaceId;
    payFrequency: PayFrequency;
    lastName: string;
    contractorFlag: boolean;
    taxRate: bigint;
    timeZone: string;
    startDate: Timestamp;
    firstName: string;
}
export interface WorkspaceMember {
    displayName: string;
    userId: UserId;
    joinedAt: Timestamp;
    role: WorkspaceRole;
    email: string;
    workspaceId: WorkspaceId;
}
export interface UnreadEntry {
    userId: Principal;
    count: bigint;
}
export interface PublicGoal {
    id: EntityId;
    status: GoalStatus;
    title: string;
    endDate: Timestamp;
    period: string;
    description?: string;
    progress: number;
    checkInCount: bigint;
    keyResults: Array<PublicKeyResult>;
    startDate: Timestamp;
}
export interface Workspace {
    id: EntityId;
    members: Array<[UserId, WorkspaceMember]>;
    ownerId: UserId;
    name: string;
    createdAt: Timestamp;
    tenantId: TenantId;
}
export interface EscrowFilter {
    status?: EscrowStatus;
    toDate?: Timestamp;
    fromDate?: Timestamp;
}
export interface TaskRelationship {
    id: EntityId;
    targetTaskId: EntityId;
    createdAt: Timestamp;
    createdBy: UserId;
    tenantId: TenantId;
    sourceTaskId: EntityId;
    workspaceId: WorkspaceId;
    relationshipType: TaskRelationshipType;
}
export interface WhiteboardElement {
    x: number;
    y: number;
    id: EntityId;
    height: number;
    color: string;
    text: string;
    tool: DrawingTool;
    connectorTo?: string;
    imageUrl?: string;
    width: number;
    connectorFrom?: string;
    converted: boolean;
    strokeWidth: number;
    linkedTaskId?: string;
    points: Array<number>;
}
export interface PayrollRecord {
    id: EntityId;
    status: PayrollStatus;
    netAmount: number;
    period: string;
    approvedAt?: Timestamp;
    approvedBy?: UserId;
    createdAt: Timestamp;
    rejectionReason?: string;
    grossAmount: number;
    tenantId: TenantId;
    processedAt?: Timestamp;
    deductionAmount: number;
    employeeId: EntityId;
    currency: string;
    workspaceId: WorkspaceId;
    taxAmount: number;
    amount: bigint;
}
export interface ChannelInput {
    name: string;
    description: string;
    memberIds: Array<UserId>;
    isPublic: boolean;
}
export interface WhiteboardInput {
    title: string;
    templateId?: string;
    templateName?: string;
    projectId?: EntityId;
}
export interface Integration {
    id: EntityId;
    status: IntegrationStatus;
    provider: IntegrationProvider;
    createdAt: Timestamp;
    tenantId: TenantId;
    updatedAt: Timestamp;
    oauthToken?: string;
    accessToken: string;
    workspaceId: WorkspaceId;
    lastSyncAt?: Timestamp;
    config: string;
    syncStatus?: string;
}
export interface NoteInput {
    title: string;
    content: string;
    tags: Array<string>;
    iconEmoji?: string;
    coverGradient?: string;
    crossLinks: Array<CrossLink>;
}
export interface GuestInvitation {
    id: EntityId;
    inviteToken: string;
    expiresAt: Timestamp;
    inviteeEmail: string;
    createdAt: Timestamp;
    invitedBy: UserId;
    tenantId: TenantId;
    projectId: EntityId;
    workspaceId: WorkspaceId;
    accepted: boolean;
}
export interface EventInput {
    startTime: Timestamp;
    title: string;
    endTime: Timestamp;
    description: string;
    attendeeIds: Array<UserId>;
    recurrence: RecurrenceRule;
    categoryColor?: string;
    projectId?: string;
    linkedNoteId?: string;
    rsvpRequired?: boolean;
    calendarId?: string;
    category?: EventCategory;
    crossLinks: Array<CrossLink>;
    isProjectDeadline?: boolean;
    timeZone?: string;
}
export interface DeductionInput {
    name: string;
    employeeId: EntityId;
    frequency: DeductionFrequency;
    amount: number;
    deductionType: DeductionType;
}
export interface Message {
    id: EntityId;
    content: string;
    channelId: EntityId;
    isThreadReply?: boolean;
    createdAt: Timestamp;
    tenantId: TenantId;
    updatedAt: Timestamp;
    threadCount?: bigint;
    workspaceId: WorkspaceId;
    replyToId?: EntityId;
    crossLinks: Array<CrossLink>;
    reactions?: Array<Reaction>;
    senderId: UserId;
}
export interface TxFilter {
    maxAmount?: number;
    status?: TransactionStatus;
    minAmount?: number;
    toDate?: Timestamp;
    fromDate?: Timestamp;
    txType?: TransactionType;
}
export interface UserProfileInput {
    displayName: string;
    role: Role;
    email: string;
    workspaceId: EntityId;
}
export interface RecurringTaskInput {
    title: string;
    assigneeId?: UserId;
    description: string;
    recurrenceType: RecurrenceType;
    projectId: EntityId;
    priority: TaskPriority;
    startDate: Timestamp;
}
export enum AIPromptType {
    SuggestPriorities = "SuggestPriorities",
    MeetingSummary = "MeetingSummary",
    Custom = "Custom",
    WorkspaceQA = "WorkspaceQA",
    Analyze = "Analyze",
    Generate = "Generate",
    Translate = "Translate",
    Summarize = "Summarize",
    GenerateTasks = "GenerateTasks"
}
export enum AIProvider {
    OpenAI = "OpenAI",
    Anthropic = "Anthropic"
}
export enum AccountType {
    personal = "personal",
    treasury = "treasury"
}
export enum ActivityEventType {
    watcherAdded = "watcherAdded",
    checklistItemAdded = "checklistItemAdded",
    checklistItemCompleted = "checklistItemCompleted",
    taskAssigned = "taskAssigned",
    taskStatusChanged = "taskStatusChanged",
    commentEdited = "commentEdited",
    taskUpdated = "taskUpdated",
    subtaskAdded = "subtaskAdded",
    commentAdded = "commentAdded",
    sprintCompleted = "sprintCompleted",
    taskCreated = "taskCreated",
    dependencyAdded = "dependencyAdded",
    sprintStarted = "sprintStarted",
    milestoneCreated = "milestoneCreated"
}
export enum AssetType {
    BTC = "BTC",
    ICP = "ICP"
}
export enum AutomationAction {
    RunPayroll = "RunPayroll",
    CreateTask = "CreateTask",
    SendNotification = "SendNotification",
    UpdateStatus = "UpdateStatus"
}
export enum AutomationTrigger {
    OnTaskStatusChange = "OnTaskStatusChange",
    OnNoteCreated = "OnNoteCreated",
    OnPaymentDue = "OnPaymentDue",
    Scheduled = "Scheduled",
    OnEscrowUpdate = "OnEscrowUpdate",
    OnEventReminder = "OnEventReminder"
}
export enum BackupStatus {
    Failed = "Failed",
    Running = "Running",
    Completed = "Completed",
    Pending = "Pending"
}
export enum CalendarType {
    team = "team",
    company = "company",
    personal = "personal",
    project = "project"
}
export enum ContractorPaymentReason {
    projectMilestone = "projectMilestone",
    other = "other",
    freelanceInvoice = "freelanceInvoice",
    reimbursement = "reimbursement"
}
export enum ContractorPaymentStatus {
    pending = "pending",
    processed = "processed"
}
export enum DeductionFrequency {
    perRun = "perRun",
    annual = "annual"
}
export enum DeductionType {
    postTax = "postTax",
    preTax = "preTax"
}
export enum DisputeStatus {
    Open = "Open",
    Resolved = "Resolved"
}
export enum DrawingTool {
    Pen = "Pen",
    Line = "Line",
    Text = "Text",
    Sticky = "Sticky",
    Connector = "Connector",
    Image = "Image",
    Eraser = "Eraser",
    Circle = "Circle",
    Rectangle = "Rectangle"
}
export enum EscrowStatus {
    Disputed = "Disputed",
    Released = "Released",
    Funded = "Funded",
    Cancelled = "Cancelled",
    Pending = "Pending"
}
export enum EventCategory {
    pto = "pto",
    internal = "internal",
    other = "other",
    deadline = "deadline",
    meeting = "meeting",
    external = "external"
}
export enum ExceptionType {
    deleted = "deleted",
    modified = "modified"
}
export enum FormFieldType {
    Email = "Email",
    Date_ = "Date",
    Textarea = "Textarea",
    Text = "Text",
    Checkbox = "Checkbox",
    Dropdown = "Dropdown"
}
export enum FormStatus {
    Draft = "Draft",
    Published = "Published"
}
export enum GoalStatus {
    OnHold = "OnHold",
    Active = "Active",
    Cancelled = "Cancelled",
    Completed = "Completed"
}
export enum GuestStatus {
    Active = "Active",
    Revoked = "Revoked",
    Pending = "Pending"
}
export enum IntegrationProvider {
    Slack = "Slack",
    GitHub = "GitHub",
    GoogleDrive = "GoogleDrive"
}
export enum IntegrationStatus {
    Error_ = "Error",
    Connected = "Connected",
    Disconnected = "Disconnected"
}
export enum KRStatus {
    OnTrack = "OnTrack",
    Behind = "Behind",
    Completed = "Completed",
    AtRisk = "AtRisk"
}
export enum MilestoneStatus {
    reached = "reached",
    upcoming = "upcoming",
    missed = "missed"
}
export enum MilestoneStatus__1 {
    Releasing = "Releasing",
    Released = "Released",
    Approved = "Approved",
    Pending = "Pending"
}
export enum OffCycleReason {
    adjustment = "adjustment",
    reimbursement = "reimbursement",
    bonus = "bonus"
}
export enum PayFrequency {
    BiWeekly = "BiWeekly",
    Weekly = "Weekly",
    Quarterly = "Quarterly",
    SemiMonthly = "SemiMonthly",
    Monthly = "Monthly"
}
export enum PayrollStatus {
    Paused = "Paused",
    Active = "Active",
    Approved = "Approved",
    Processed = "Processed",
    Rejected = "Rejected",
    PendingApproval = "PendingApproval",
    Completed = "Completed"
}
export enum ProjectStatus {
    OnHold = "OnHold",
    Active = "Active",
    Archived = "Archived",
    Completed = "Completed"
}
export enum RecurrenceRule {
    Weekly = "Weekly",
    None = "None",
    Daily = "Daily",
    Monthly = "Monthly",
    Yearly = "Yearly"
}
export enum RecurrenceType {
    monthly = "monthly",
    daily = "daily",
    weekly = "weekly"
}
export enum Role {
    Admin = "Admin",
    Manager = "Manager",
    TeamMember = "TeamMember"
}
export enum RsvpStatus {
    tentative = "tentative",
    noResponse = "noResponse",
    accepted = "accepted",
    declined = "declined"
}
export enum SprintStatus {
    active = "active",
    completed = "completed",
    planned = "planned"
}
export enum TaskPriority {
    Low = "Low",
    High = "High",
    Medium = "Medium",
    Critical = "Critical"
}
export enum TaskRelationshipType {
    blockedBy = "blockedBy",
    duplicateOf = "duplicateOf",
    blocks = "blocks",
    relatedTo = "relatedTo"
}
export enum TaskStatus {
    Blocked = "Blocked",
    Done = "Done",
    Todo = "Todo",
    InProgress = "InProgress"
}
export enum TransactionStatus {
    Failed = "Failed",
    Cancelled = "Cancelled",
    AwaitingApproval = "AwaitingApproval",
    Completed = "Completed",
    Pending = "Pending"
}
export enum TransactionType {
    Stake = "Stake",
    Send = "Send",
    Swap = "Swap",
    Unstake = "Unstake",
    Receive = "Receive"
}
export enum Variant_away_offline_online {
    away = "away",
    offline = "offline",
    online = "online"
}
export enum WorkspaceRole {
    Guest = "Guest",
    Admin = "Admin",
    Manager = "Manager",
    TeamMember = "TeamMember"
}
export interface backendInterface {
    acceptGuestInvitation(tenantId: TenantId, workspaceId: WorkspaceId, token: string): Promise<{
        __kind__: "ok";
        ok: GuestUser;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addBenefit(tenantId: TenantId, workspaceId: WorkspaceId, input: BenefitInput): Promise<{
        __kind__: "ok";
        ok: Benefit;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addChecklistItem(tenantId: TenantId, workspaceId: WorkspaceId, input: ChecklistItemInput): Promise<{
        __kind__: "ok";
        ok: ChecklistItem;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addComment(tenantId: TenantId, workspaceId: WorkspaceId, projectId: EntityId, input: TaskCommentInput): Promise<{
        __kind__: "ok";
        ok: TaskComment;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addContractor(tenantId: TenantId, workspaceId: WorkspaceId, input: ContractorInput): Promise<{
        __kind__: "ok";
        ok: Contractor;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Add a contractor payment — requires sufficient treasury balance.
     */
    addContractorPayment(tenantId: TenantId, workspaceId: WorkspaceId, input: ContractorPaymentInput): Promise<{
        __kind__: "ok";
        ok: ContractorPayment;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addDeduction(tenantId: TenantId, workspaceId: WorkspaceId, input: DeductionInput): Promise<{
        __kind__: "ok";
        ok: Deduction;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addEmployee(tenantId: TenantId, workspaceId: WorkspaceId, input: EmployeeInput): Promise<{
        __kind__: "ok";
        ok: Employee;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addEscrowMilestone(tenantId: TenantId, workspaceId: WorkspaceId, escrowId: EntityId, input: EscrowMilestoneInput): Promise<{
        __kind__: "ok";
        ok: EscrowMilestone;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addIntegrationEvent(tenantId: TenantId, workspaceId: WorkspaceId, integrationId: EntityId, eventType: string, payload: string): Promise<{
        __kind__: "ok";
        ok: IntegrationEvent;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addKeyResult(tenantId: TenantId, workspaceId: WorkspaceId, input: KeyResultInput): Promise<{
        __kind__: "ok";
        ok: KeyResult;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Add an off-cycle payment — requires sufficient treasury balance if processImmediately.
     */
    addOffCyclePayment(tenantId: TenantId, workspaceId: WorkspaceId, input: OffCyclePaymentInput): Promise<{
        __kind__: "ok";
        ok: OffCyclePayment;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addPaySchedule(tenantId: TenantId, workspaceId: WorkspaceId, input: PayScheduleInput): Promise<{
        __kind__: "ok";
        ok: PaySchedule;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addReaction(tenantId: TenantId, workspaceId: WorkspaceId, messageId: EntityId, emoji: string): Promise<{
        __kind__: "ok";
        ok: Message;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addTaskRelationship(tenantId: TenantId, workspaceId: WorkspaceId, sourceTaskId: EntityId, targetTaskId: EntityId, relType: TaskRelationshipType): Promise<{
        __kind__: "ok";
        ok: TaskRelationship;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addTaskToSprint(tenantId: TenantId, workspaceId: WorkspaceId, sprintId: EntityId, taskId: EntityId): Promise<{
        __kind__: "ok";
        ok: Sprint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addTaskWatcher(tenantId: TenantId, workspaceId: WorkspaceId, taskId: EntityId, userId: UserId): Promise<{
        __kind__: "ok";
        ok: TaskWatcher;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addWorkspaceMember(tenantId: TenantId, workspaceId: EntityId, userId: UserId, role: WorkspaceRole, displayName: string, email: string): Promise<{
        __kind__: "ok";
        ok: WorkspaceMember;
    } | {
        __kind__: "err";
        err: string;
    }>;
    approveMilestone(tenantId: TenantId, workspaceId: WorkspaceId, milestoneId: EntityId): Promise<{
        __kind__: "ok";
        ok: EscrowMilestone;
    } | {
        __kind__: "err";
        err: string;
    }>;
    approveTransaction(tenantId: TenantId, workspaceId: WorkspaceId, txId: EntityId, approved: boolean): Promise<{
        __kind__: "ok";
        ok: WalletTransaction;
    } | {
        __kind__: "err";
        err: string;
    }>;
    archiveProject(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Project;
    } | {
        __kind__: "err";
        err: string;
    }>;
    assignArbiter(tenantId: TenantId, workspaceId: WorkspaceId, disputeId: EntityId, arbiter: Principal): Promise<{
        __kind__: "ok";
        ok: EscrowDispute;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Bulk approve payroll records — sums all amounts and checks treasury balance once BEFORE approving.
     */
    bulkApprovePayroll(tenantId: TenantId, workspaceId: WorkspaceId, recordIds: Array<EntityId>): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    cancelEscrow(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: EscrowContract;
    } | {
        __kind__: "err";
        err: string;
    }>;
    cancelRecurringPayment(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: RecurringPayment;
    } | {
        __kind__: "err";
        err: string;
    }>;
    checkSpendingLimit(tenantId: TenantId, workspaceId: WorkspaceId, role: Role, amount: number): Promise<boolean>;
    convertWhiteboardElementToTask(tenantId: TenantId, workspaceId: WorkspaceId, whiteboardId: EntityId, elementId: EntityId, projectId: EntityId): Promise<{
        __kind__: "ok";
        ok: Whiteboard;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createAutomationRule(tenantId: TenantId, workspaceId: WorkspaceId, name: string, description: string, trigger: AutomationTrigger, action: AutomationAction): Promise<{
        __kind__: "ok";
        ok: AutomationRule;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createBackup(tenantId: TenantId, workspaceId: WorkspaceId, backupLabel: string): Promise<{
        __kind__: "ok";
        ok: Backup;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createCalendar(tenantId: TenantId, workspaceId: WorkspaceId, input: CalendarDefInput): Promise<{
        __kind__: "ok";
        ok: CalendarDef;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createChannel(tenantId: TenantId, workspaceId: WorkspaceId, input: ChannelInput): Promise<{
        __kind__: "ok";
        ok: Channel;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Create an escrow — requires the caller (payer) to have sufficient treasury balance.
     * / Queries the live ICP/ckBTC ledger balance BEFORE creating the record.
     */
    createEscrow(tenantId: TenantId, workspaceId: WorkspaceId, input: EscrowInput): Promise<{
        __kind__: "ok";
        ok: EscrowContract;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createEvent(tenantId: TenantId, workspaceId: WorkspaceId, input: EventInput): Promise<{
        __kind__: "ok";
        ok: Event;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createEventException(tenantId: TenantId, workspaceId: WorkspaceId, input: EventExceptionInput): Promise<{
        __kind__: "ok";
        ok: EventException;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createForm(tenantId: TenantId, workspaceId: WorkspaceId, input: FormInput): Promise<{
        __kind__: "ok";
        ok: Form;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createGoal(tenantId: TenantId, workspaceId: WorkspaceId, input: GoalInput): Promise<{
        __kind__: "ok";
        ok: Goal;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createGuestInvitation(tenantId: TenantId, workspaceId: WorkspaceId, input: GuestInvitationInput): Promise<{
        __kind__: "ok";
        ok: GuestInvitation;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createMilestone(tenantId: TenantId, workspaceId: WorkspaceId, input: MilestoneInput): Promise<{
        __kind__: "ok";
        ok: Milestone;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createNote(tenantId: TenantId, workspaceId: WorkspaceId, input: NoteInput): Promise<{
        __kind__: "ok";
        ok: Note;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createNoteTemplate(tenantId: TenantId, workspaceId: WorkspaceId, input: NoteTemplateInput): Promise<{
        __kind__: "ok";
        ok: NoteTemplate;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createOrGetDMChannel(tenantId: TenantId, workspaceId: WorkspaceId, targetUserId: UserId): Promise<{
        __kind__: "ok";
        ok: Channel;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createPage(tenantId: TenantId, workspaceId: WorkspaceId, input: PageInput): Promise<{
        __kind__: "ok";
        ok: PageNode;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createProject(tenantId: TenantId, workspaceId: WorkspaceId, input: ProjectInput): Promise<{
        __kind__: "ok";
        ok: Project;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createProjectFromTemplate(tenantId: TenantId, workspaceId: WorkspaceId, templateId: string, projectName: string, projectDescription: string): Promise<{
        __kind__: "ok";
        ok: EntityId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createRecurringPayment(tenantId: TenantId, workspaceId: WorkspaceId, accountId: EntityId, toAddress: string, amount: bigint, asset: AssetType, frequency: PayFrequency): Promise<{
        __kind__: "ok";
        ok: RecurringPayment;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createRecurringTask(tenantId: TenantId, workspaceId: WorkspaceId, input: RecurringTaskInput): Promise<{
        __kind__: "ok";
        ok: RecurringTask;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createSprint(tenantId: TenantId, workspaceId: WorkspaceId, input: SprintInput): Promise<{
        __kind__: "ok";
        ok: Sprint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createSubtask(tenantId: TenantId, workspaceId: WorkspaceId, input: SubtaskInput): Promise<{
        __kind__: "ok";
        ok: Subtask;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createTask(tenantId: TenantId, workspaceId: WorkspaceId, input: TaskInput): Promise<{
        __kind__: "ok";
        ok: Task;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createTaskTemplate(tenantId: TenantId, workspaceId: WorkspaceId, input: TaskTemplateInput): Promise<{
        __kind__: "ok";
        ok: TaskTemplate;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createTimeEntry(tenantId: TenantId, workspaceId: WorkspaceId, input: TimeEntryInput): Promise<{
        __kind__: "ok";
        ok: TimeEntry;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createWalletAccount(tenantId: TenantId, workspaceId: WorkspaceId, displayName: string): Promise<{
        __kind__: "ok";
        ok: WalletAccount;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createWhiteboard(tenantId: TenantId, workspaceId: WorkspaceId, input: WhiteboardInput): Promise<{
        __kind__: "ok";
        ok: Whiteboard;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createWorkspace(tenantId: TenantId, input: WorkspaceInput, ownerDisplayName: string, ownerEmail: string): Promise<{
        __kind__: "ok";
        ok: Workspace;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createWorkspaceTreasury(tenantId: TenantId, workspaceId: WorkspaceId): Promise<{
        __kind__: "ok";
        ok: WalletAccount;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deactivateEmployee(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Employee;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteCalendar(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteChannel(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteChecklistItem(tenantId: TenantId, workspaceId: WorkspaceId, itemId: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteComment(tenantId: TenantId, workspaceId: WorkspaceId, commentId: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteEvent(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteForm(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteGoal(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteIntegration(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteKeyResult(tenantId: TenantId, workspaceId: WorkspaceId, krId: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteMessage(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteMilestone(tenantId: TenantId, workspaceId: WorkspaceId, milestoneId: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteNote(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteNoteTemplate(tenantId: TenantId, workspaceId: WorkspaceId, templateId: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deletePage(tenantId: TenantId, workspaceId: WorkspaceId, pageId: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteRecurringTask(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteSprint(tenantId: TenantId, workspaceId: WorkspaceId, sprintId: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteSubtask(tenantId: TenantId, workspaceId: WorkspaceId, subtaskId: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteTask(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteTaskTemplate(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteTimeEntry(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteWhiteboard(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Deposit funds into an escrow using the ICRC-2 approve/transfer_from pattern (Protection 3).
     * / Flow: caller must first call icrc2_approve on the ICP or ckBTC ledger to authorize
     * / this canister to pull `contract.amount` tokens. Then call this method to execute the pull.
     * / On success: sets escrow status to #Funded with actual funded amount and block height.
     * / On failure: escrow remains #Pending, caller can retry after re-approving.
     */
    depositEscrow(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: EscrowContract;
    } | {
        __kind__: "err";
        err: string;
    }>;
    disputeEscrow(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: EscrowContract;
    } | {
        __kind__: "err";
        err: string;
    }>;
    editComment(tenantId: TenantId, workspaceId: WorkspaceId, commentId: EntityId, content: string): Promise<{
        __kind__: "ok";
        ok: TaskComment;
    } | {
        __kind__: "err";
        err: string;
    }>;
    exportTimeEntries(workspaceId: WorkspaceId, tenantId: TenantId, filter: TimeReportFilter): Promise<string>;
    exportTransactions(tenantId: TenantId, workspaceId: WorkspaceId, accountId: EntityId, filter: TxFilter | null): Promise<string>;
    fundEscrow(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: EscrowContract;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAIConfig(tenantId: TenantId, workspaceId: WorkspaceId): Promise<AIConfig | null>;
    getAIResponses(tenantId: TenantId, workspaceId: WorkspaceId, promptId: EntityId | null, limit: bigint): Promise<Array<AIResponse>>;
    getAvailability(tenantId: TenantId, workspaceId: WorkspaceId, userIds: Array<UserId>, date: string, timeZone: string): Promise<Array<AvailabilitySlot>>;
    getBacklinks(tenantId: TenantId, workspaceId: WorkspaceId, targetPageId: EntityId): Promise<Array<PageNode>>;
    getBackup(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Backup;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getCalendar(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: CalendarDef;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getChannel(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Channel;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getChannelPins(tenantId: TenantId, workspaceId: WorkspaceId, channelId: EntityId): Promise<Array<Message>>;
    getContractor(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Contractor;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getEmployee(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Employee;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getEscrow(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: EscrowContract;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getEscrowDispute(tenantId: TenantId, workspaceId: WorkspaceId, disputeId: EntityId): Promise<{
        __kind__: "ok";
        ok: EscrowDispute;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getEscrowSummary(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: EscrowSummary;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getEvent(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Event;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getEventException(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: EventException;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getEventRsvps(tenantId: TenantId, workspaceId: WorkspaceId, eventId: string): Promise<Array<EventRsvp>>;
    getForm(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Form;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getFormAnalytics(tenantId: TenantId, workspaceId: WorkspaceId, formId: EntityId): Promise<FormAnalytics>;
    getGoal(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Goal;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getGuestUser(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<GuestUser | null>;
    getIntegrationActivityLog(tenantId: TenantId, workspaceId: WorkspaceId, provider: IntegrationProvider | null, fromDate: Timestamp | null, toDate: Timestamp | null, limit: bigint): Promise<Array<IntegrationEvent>>;
    getIntegrationEvents(tenantId: TenantId, workspaceId: WorkspaceId, integrationId: EntityId, limit: bigint): Promise<Array<IntegrationEvent>>;
    getIntegrations(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<Integration>>;
    getLastNoteEdit(tenantId: TenantId, workspaceId: WorkspaceId, noteId: EntityId): Promise<NoteLastEdit | null>;
    getMessages(tenantId: TenantId, workspaceId: WorkspaceId, channelId: EntityId, limit: bigint, before: Timestamp | null): Promise<Array<Message>>;
    getMyProfile(tenantId: TenantId): Promise<UserProfile | null>;
    /**
     * / Returns wallet account with LIVE ICP and ckBTC balances from the real ledger.
     * / Includes lazy migration: if stored accountId is not a valid 64-char hex, re-derives it.
     */
    getMyWalletAccount(tenantId: TenantId, workspaceId: WorkspaceId): Promise<WalletAccount | null>;
    getNote(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Note;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getNoteActiveEditors(tenantId: TenantId, workspaceId: WorkspaceId, noteId: EntityId): Promise<Array<NoteEditorPresence>>;
    getOrCreateWorkspaceShareToken(workspaceId: WorkspaceId, tenantId: TenantId): Promise<string>;
    getPage(tenantId: TenantId, workspaceId: WorkspaceId, pageId: EntityId): Promise<{
        __kind__: "ok";
        ok: PageNode;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getPageHierarchy(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<PageNode>>;
    getPendingApprovals(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<WalletTransaction>>;
    getProject(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Project;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getProjectTimeEntries(tenantId: TenantId, workspaceId: WorkspaceId, projectId: EntityId): Promise<Array<TimeEntry>>;
    getPromptHistory(tenantId: TenantId, workspaceId: WorkspaceId, userId: UserId | null, limit: bigint): Promise<Array<AIPrompt>>;
    getPublicForm(publicUrl: string): Promise<Form | null>;
    getPublicGoals(shareToken: string): Promise<{
        __kind__: "ok";
        ok: Array<PublicGoal>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getReceiveAddress(tenantId: TenantId, workspaceId: WorkspaceId, accountId: EntityId): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getSpendingLimit(tenantId: TenantId, workspaceId: WorkspaceId, role: Role): Promise<WorkspaceSpendingLimit | null>;
    getSprint(tenantId: TenantId, workspaceId: WorkspaceId, sprintId: EntityId): Promise<{
        __kind__: "ok";
        ok: Sprint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getTask(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Task;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getTaskTemplate(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: TaskTemplate;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getTaskTimeEntries(tenantId: TenantId, workspaceId: WorkspaceId, taskId: EntityId): Promise<Array<TimeEntry>>;
    getThreadMessages(tenantId: TenantId, workspaceId: WorkspaceId, parentMessageId: EntityId): Promise<Array<Message>>;
    getTimeReport(workspaceId: WorkspaceId, tenantId: TenantId, filter: TimeReportFilter): Promise<TimeReport>;
    getUnreadCounts(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<[string, bigint]>>;
    getUserStatus(tenantId: TenantId, workspaceId: WorkspaceId, userId: Principal): Promise<UserStatus | null>;
    getUserTimeEntries(tenantId: TenantId, workspaceId: WorkspaceId, userId: UserId): Promise<Array<TimeEntry>>;
    getWalletAccount(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: WalletAccount;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getWeeklyTimesheet(workspaceId: WorkspaceId, tenantId: TenantId, userId: UserId, weekStart: Timestamp): Promise<Array<DailyTimesheetEntry>>;
    getWhiteboard(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Whiteboard;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getWorkspace(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Workspace;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Returns real workspace statistics aggregated from live backend data.
     */
    getWorkspaceDashboardStats(workspaceId: WorkspaceId, tenantId: TenantId): Promise<DashboardStats>;
    getWorkspaceMember(tenantId: TenantId, workspaceId: EntityId, userId: UserId): Promise<WorkspaceMember | null>;
    /**
     * / Returns recent activity feed (up to `limit` entries) from real workspace events.
     */
    getWorkspaceRecentActivity(workspaceId: WorkspaceId, tenantId: TenantId, limit: bigint): Promise<Array<ActivityEntry>>;
    getWorkspaceStats(tenantId: TenantId, workspaceId: WorkspaceId): Promise<{
        walletAccountCount: bigint;
        employeeCount: bigint;
        noteCount: bigint;
        escrowCount: bigint;
        projectCount: bigint;
    }>;
    /**
     * / Returns workspace treasury account with LIVE ICP and ckBTC balances from the real ledger.
     * / Treasury address is derived from the CANISTER's own principal + workspace subaccount,
     * / guaranteeing it is always distinct from any user's personal wallet address.
     * / Includes lazy migration: if stored accountId is not a valid 64-char hex, re-derives it
     * / using the canister principal + workspace subaccount (the correct treasury derivation).
     */
    getWorkspaceTreasury(tenantId: TenantId, workspaceId: WorkspaceId): Promise<WalletAccount | null>;
    isWatching(tenantId: TenantId, workspaceId: WorkspaceId, taskId: EntityId, userId: UserId): Promise<boolean>;
    joinChannel(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Channel;
    } | {
        __kind__: "err";
        err: string;
    }>;
    leaveChannel(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Channel;
    } | {
        __kind__: "err";
        err: string;
    }>;
    linkTaskToKR(tenantId: TenantId, workspaceId: WorkspaceId, krId: EntityId, taskId: EntityId): Promise<{
        __kind__: "ok";
        ok: KeyResult;
    } | {
        __kind__: "err";
        err: string;
    }>;
    listActivityEvents(tenantId: TenantId, workspaceId: WorkspaceId, taskId: EntityId): Promise<Array<ActivityEvent>>;
    listAuditLogs(tenantId: TenantId, workspaceId: WorkspaceId, limit: bigint): Promise<Array<AuditLog>>;
    listAutomationRules(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<AutomationRule>>;
    listBackups(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<Backup>>;
    listBenefits(tenantId: TenantId, workspaceId: WorkspaceId, employeeId: EntityId | null): Promise<Array<Benefit>>;
    listCalendars(tenantId: TenantId, workspaceId: WorkspaceId, ownerId: UserId | null): Promise<Array<CalendarDef>>;
    listChannels(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<Channel>>;
    listCheckIns(tenantId: TenantId, workspaceId: WorkspaceId, goalId: EntityId): Promise<Array<GoalCheckIn>>;
    listChecklistItems(tenantId: TenantId, workspaceId: WorkspaceId, taskId: EntityId): Promise<Array<ChecklistItem>>;
    listComments(tenantId: TenantId, workspaceId: WorkspaceId, taskId: EntityId): Promise<Array<TaskComment>>;
    listContractorPayments(tenantId: TenantId, workspaceId: WorkspaceId, contractorId: EntityId | null): Promise<Array<ContractorPayment>>;
    listContractors(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<Contractor>>;
    listDeductions(tenantId: TenantId, workspaceId: WorkspaceId, employeeId: EntityId | null): Promise<Array<Deduction>>;
    listEmployees(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<Employee>>;
    listEscrowDisputes(tenantId: TenantId, workspaceId: WorkspaceId, escrowId: EntityId): Promise<Array<EscrowDispute>>;
    listEscrowMilestones(tenantId: TenantId, workspaceId: WorkspaceId, escrowId: EntityId): Promise<Array<EscrowMilestone>>;
    listEscrows(tenantId: TenantId, workspaceId: WorkspaceId, filter: EscrowFilter | null): Promise<Array<EscrowContract>>;
    listEventExceptions(tenantId: TenantId, workspaceId: WorkspaceId, eventId: string): Promise<Array<EventException>>;
    listEventRsvps(tenantId: TenantId, workspaceId: WorkspaceId, userId: UserId): Promise<Array<EventRsvp>>;
    listEvents(tenantId: TenantId, workspaceId: WorkspaceId, from: Timestamp, to: Timestamp): Promise<Array<Event>>;
    listFormSubmissions(tenantId: TenantId, workspaceId: WorkspaceId, formId: EntityId): Promise<Array<FormSubmission>>;
    listForms(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<Form>>;
    listGoals(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<Goal>>;
    listGuestUsers(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<GuestUser>>;
    listKeyResults(tenantId: TenantId, workspaceId: WorkspaceId, goalId: EntityId): Promise<Array<KeyResult>>;
    listMessages(tenantId: TenantId, workspaceId: WorkspaceId, channelId: EntityId, limit: bigint, before: Timestamp | null): Promise<Array<Message>>;
    listMilestones(tenantId: TenantId, workspaceId: WorkspaceId, projectId: EntityId): Promise<Array<Milestone>>;
    listMyEvents(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<Event>>;
    listNoteTemplates(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<NoteTemplate>>;
    listNotes(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<Note>>;
    listOffCyclePayments(tenantId: TenantId, workspaceId: WorkspaceId, employeeId: EntityId | null): Promise<Array<OffCyclePayment>>;
    listPages(tenantId: TenantId, workspaceId: WorkspaceId, parentPageId: EntityId | null): Promise<Array<PageNode>>;
    listPaySchedules(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<PaySchedule>>;
    listPayStubs(tenantId: TenantId, workspaceId: WorkspaceId, employeeId: EntityId | null): Promise<Array<PayStub>>;
    listPayrollAuditLog(tenantId: TenantId, workspaceId: WorkspaceId, limit: bigint): Promise<Array<AuditLogEntry>>;
    listPayrollRecords(tenantId: TenantId, workspaceId: WorkspaceId, employeeId: EntityId | null): Promise<Array<PayrollRecord>>;
    listProfiles(tenantId: TenantId): Promise<Array<UserProfile>>;
    listProjectDeadlines(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<Event>>;
    listProjects(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<Project>>;
    listRecurringPayments(tenantId: TenantId, workspaceId: WorkspaceId, accountId: EntityId): Promise<Array<RecurringPayment>>;
    listRecurringTasks(tenantId: TenantId, workspaceId: WorkspaceId, projectId: EntityId): Promise<Array<RecurringTask>>;
    listSprints(tenantId: TenantId, workspaceId: WorkspaceId, projectId: EntityId): Promise<Array<Sprint>>;
    listSubtasks(tenantId: TenantId, workspaceId: WorkspaceId, parentTaskId: EntityId): Promise<Array<Subtask>>;
    listTaskRelationships(tenantId: TenantId, workspaceId: WorkspaceId, taskId: EntityId): Promise<Array<TaskRelationship>>;
    listTaskTemplates(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<TaskTemplate>>;
    listTaskWatchers(tenantId: TenantId, workspaceId: WorkspaceId, taskId: EntityId): Promise<Array<TaskWatcher>>;
    listTasks(tenantId: TenantId, workspaceId: WorkspaceId, projectId: EntityId): Promise<Array<Task>>;
    listTransactions(tenantId: TenantId, workspaceId: WorkspaceId, accountId: EntityId, filter: TxFilter | null): Promise<Array<WalletTransaction>>;
    listWhiteboardTemplates(): Promise<Array<WhiteboardTemplate>>;
    listWhiteboards(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<Whiteboard>>;
    listWorkspaceMembers(tenantId: TenantId, workspaceId: EntityId): Promise<Array<WorkspaceMember>>;
    listWorkspaceStatuses(tenantId: TenantId, workspaceId: WorkspaceId): Promise<Array<UserStatus>>;
    listWorkspaces(tenantId: TenantId): Promise<Array<Workspace>>;
    markChannelRead(tenantId: TenantId, workspaceId: WorkspaceId, channelId: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    pinMessage(tenantId: TenantId, workspaceId: WorkspaceId, channelId: EntityId, messageId: string): Promise<{
        __kind__: "ok";
        ok: Channel;
    } | {
        __kind__: "err";
        err: string;
    }>;
    processIntegrationTrigger(tenantId: TenantId, workspaceId: WorkspaceId, provider: IntegrationProvider, eventType: string, payload: string, triggerAction: string): Promise<{
        __kind__: "ok";
        ok: IntegrationEvent;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Process payroll for one employee — requires sufficient treasury balance.
     */
    processPayroll(tenantId: TenantId, workspaceId: WorkspaceId, employeeId: EntityId, period: string): Promise<{
        __kind__: "ok";
        ok: PayrollRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    raiseEscrowDispute(tenantId: TenantId, workspaceId: WorkspaceId, escrowId: EntityId, reason: string): Promise<{
        __kind__: "ok";
        ok: EscrowDispute;
    } | {
        __kind__: "err";
        err: string;
    }>;
    recordCheckIn(tenantId: TenantId, workspaceId: WorkspaceId, input: CheckInInput): Promise<{
        __kind__: "ok";
        ok: GoalCheckIn;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Refund a funded or disputed escrow back to the payer via the real ICP ledger.
     * / State-before-transfer: escrow is cancelled in state BEFORE the async ledger call.
     * / If the ledger transfer fails, escrow state is already cancelled — caller must retry or resolve manually.
     */
    refundEscrow(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: EscrowContract;
    } | {
        __kind__: "err";
        err: string;
    }>;
    regenerateWorkspaceShareToken(workspaceId: WorkspaceId, tenantId: TenantId): Promise<string>;
    rejectPayrollRecord(tenantId: TenantId, workspaceId: WorkspaceId, recordId: EntityId, reason: string): Promise<{
        __kind__: "ok";
        ok: PayrollRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    releaseEscrow(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: EscrowContract;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Release milestone funds via the real ICP ledger.
     * / Protection 1 (state-before-transfer): sets milestone to #Releasing BEFORE the async ledger call.
     * / Protection 2 (unique memo): increments txMemoCounter and passes it as the ICP transfer memo.
     * / On ledger success: marks milestone #Released with block height.
     * / On ledger failure: reverts milestone back to #Approved so it can be retried.
     */
    releaseMilestoneFunds(tenantId: TenantId, workspaceId: WorkspaceId, milestoneId: EntityId): Promise<{
        __kind__: "ok";
        ok: EscrowMilestone;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeReaction(tenantId: TenantId, workspaceId: WorkspaceId, messageId: EntityId, emoji: string): Promise<{
        __kind__: "ok";
        ok: Message;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeTaskFromSprint(tenantId: TenantId, workspaceId: WorkspaceId, sprintId: EntityId, taskId: EntityId): Promise<{
        __kind__: "ok";
        ok: Sprint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeTaskRelationship(tenantId: TenantId, workspaceId: WorkspaceId, relationshipId: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeTaskWatcher(tenantId: TenantId, workspaceId: WorkspaceId, taskId: EntityId, userId: UserId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeWorkspaceMember(tenantId: TenantId, workspaceId: EntityId, targetUserId: UserId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    resolveDispute(tenantId: TenantId, workspaceId: WorkspaceId, disputeId: EntityId, resolution: string): Promise<{
        __kind__: "ok";
        ok: EscrowDispute;
    } | {
        __kind__: "err";
        err: string;
    }>;
    respondToEvent(tenantId: TenantId, workspaceId: WorkspaceId, input: EventRsvpInput): Promise<{
        __kind__: "ok";
        ok: EventRsvp;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveAIConfig(tenantId: TenantId, workspaceId: WorkspaceId, input: AIConfigInput): Promise<{
        __kind__: "ok";
        ok: AIConfig;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveIntegration(tenantId: TenantId, workspaceId: WorkspaceId, input: IntegrationInput): Promise<{
        __kind__: "ok";
        ok: Integration;
    } | {
        __kind__: "err";
        err: string;
    }>;
    searchMessages(tenantId: TenantId, workspaceId: WorkspaceId, searchQuery: string, channelId: EntityId | null, senderId: Principal | null, fromTime: bigint | null, toTime: bigint | null): Promise<Array<Message>>;
    searchNotes(tenantId: TenantId, workspaceId: WorkspaceId, searchQuery: string): Promise<Array<Note>>;
    /**
     * / Send ICP or ckBTC via the real on-chain ledger.
     * / For ICP: calls icpLedger.transfer() with standard fee of 10_000 e8s.
     * / For ckBTC: calls ckBTCLedger.icrc1_transfer() to recipient principal.
     * / On ledger error: returns #err — transaction is NOT recorded.
     */
    sendAsset(tenantId: TenantId, workspaceId: WorkspaceId, accountId: EntityId, asset: AssetType, amount: bigint, toAddress: string, memo: string | null, requiredApprovals: bigint): Promise<{
        __kind__: "ok";
        ok: WalletTransaction;
    } | {
        __kind__: "err";
        err: string;
    }>;
    sendMessage(tenantId: TenantId, workspaceId: WorkspaceId, input: MessageInput): Promise<{
        __kind__: "ok";
        ok: Message;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setSpendingLimit(tenantId: TenantId, workspaceId: WorkspaceId, role: Role, maxAmount: number, currency: string): Promise<{
        __kind__: "ok";
        ok: WorkspaceSpendingLimit;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setUserStatus(tenantId: TenantId, workspaceId: WorkspaceId, status: Variant_away_offline_online, customStatus: string): Promise<{
        __kind__: "ok";
        ok: UserStatus;
    } | {
        __kind__: "err";
        err: string;
    }>;
    submitAIPrompt(tenantId: TenantId, workspaceId: WorkspaceId, input: AIPromptInput): Promise<{
        __kind__: "ok";
        ok: AIResponse;
    } | {
        __kind__: "err";
        err: string;
    }>;
    submitFormResponse(input: FormSubmissionInput): Promise<{
        __kind__: "ok";
        ok: FormSubmission;
    } | {
        __kind__: "err";
        err: string;
    }>;
    toggleAutomationRule(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: AutomationRule;
    } | {
        __kind__: "err";
        err: string;
    }>;
    toggleGoalPublic(goalId: EntityId, workspaceId: WorkspaceId, tenantId: TenantId): Promise<{
        __kind__: "ok";
        ok: Goal;
    } | {
        __kind__: "err";
        err: string;
    }>;
    unlinkTaskFromKR(tenantId: TenantId, workspaceId: WorkspaceId, krId: EntityId, taskId: EntityId): Promise<{
        __kind__: "ok";
        ok: KeyResult;
    } | {
        __kind__: "err";
        err: string;
    }>;
    unpinMessage(tenantId: TenantId, workspaceId: WorkspaceId, channelId: EntityId, messageId: string): Promise<{
        __kind__: "ok";
        ok: Channel;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateCalendar(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId, input: CalendarDefInput): Promise<{
        __kind__: "ok";
        ok: CalendarDef;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateChannel(tenantId: TenantId, workspaceId: WorkspaceId, channelId: EntityId, name: string, description: string, topic: string): Promise<{
        __kind__: "ok";
        ok: Channel;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateChannelTopic(tenantId: TenantId, workspaceId: WorkspaceId, channelId: EntityId, topic: string): Promise<{
        __kind__: "ok";
        ok: Channel;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateChecklistItem(tenantId: TenantId, workspaceId: WorkspaceId, itemId: EntityId, content: string, completed: boolean): Promise<{
        __kind__: "ok";
        ok: ChecklistItem;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateContractor(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId, input: ContractorInput): Promise<{
        __kind__: "ok";
        ok: Contractor;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateDeduction(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId, isActive: boolean, amount: number): Promise<{
        __kind__: "ok";
        ok: Deduction;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateEmployee(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId, input: EmployeeInput): Promise<{
        __kind__: "ok";
        ok: Employee;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateEscrowMilestone(tenantId: TenantId, workspaceId: WorkspaceId, milestoneId: EntityId, input: EscrowMilestoneInput): Promise<{
        __kind__: "ok";
        ok: EscrowMilestone;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateEvent(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId, input: EventInput): Promise<{
        __kind__: "ok";
        ok: Event;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateForm(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId, input: FormInput): Promise<{
        __kind__: "ok";
        ok: Form;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateGoal(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId, input: GoalInput, status: GoalStatus): Promise<{
        __kind__: "ok";
        ok: Goal;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateGuestStatus(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId, status: GuestStatus): Promise<{
        __kind__: "ok";
        ok: GuestUser;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateIntegrationSyncStatus(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId, status: string, timestamp: Timestamp): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateKeyResult(tenantId: TenantId, workspaceId: WorkspaceId, krId: EntityId, currentValue: number, status: KRStatus): Promise<{
        __kind__: "ok";
        ok: KeyResult;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateMilestone(tenantId: TenantId, workspaceId: WorkspaceId, milestoneId: EntityId, title: string, status: MilestoneStatus, dueDate: Timestamp): Promise<{
        __kind__: "ok";
        ok: Milestone;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateNote(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId, input: NoteInput): Promise<{
        __kind__: "ok";
        ok: Note;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateNotePresence(tenantId: TenantId, workspaceId: WorkspaceId, noteId: EntityId, displayName: string): Promise<void>;
    updatePage(tenantId: TenantId, workspaceId: WorkspaceId, pageId: EntityId, title: string, icon: string, coverUrl: string | null, blocks: Array<Block>): Promise<{
        __kind__: "ok";
        ok: PageNode;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updatePresence(tenantId: TenantId, workspaceId: WorkspaceId): Promise<{
        __kind__: "ok";
        ok: UserStatus;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateProject(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId, input: ProjectInput): Promise<{
        __kind__: "ok";
        ok: Project;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateSprint(tenantId: TenantId, workspaceId: WorkspaceId, sprintId: EntityId, name: string, goal: string, status: SprintStatus, taskIds: Array<EntityId>): Promise<{
        __kind__: "ok";
        ok: Sprint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateSubtask(tenantId: TenantId, workspaceId: WorkspaceId, subtaskId: EntityId, title: string, status: TaskStatus): Promise<{
        __kind__: "ok";
        ok: Subtask;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateTask(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId, input: TaskInput): Promise<{
        __kind__: "ok";
        ok: Task;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateTaskStatus(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId, status: TaskStatus): Promise<{
        __kind__: "ok";
        ok: Task;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateTimeEntry(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId, input: TimeEntryInput): Promise<{
        __kind__: "ok";
        ok: TimeEntry;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateWhiteboardElements(tenantId: TenantId, workspaceId: WorkspaceId, id: EntityId, elements: Array<WhiteboardElement>): Promise<{
        __kind__: "ok";
        ok: Whiteboard;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateWorkspace(tenantId: TenantId, workspaceId: EntityId, name: string): Promise<{
        __kind__: "ok";
        ok: Workspace;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateWorkspaceMemberRole(tenantId: TenantId, workspaceId: EntityId, targetUserId: UserId, newRole: WorkspaceRole): Promise<{
        __kind__: "ok";
        ok: WorkspaceMember;
    } | {
        __kind__: "err";
        err: string;
    }>;
    upsertProfile(tenantId: TenantId, input: UserProfileInput): Promise<{
        __kind__: "ok";
        ok: UserProfile;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
