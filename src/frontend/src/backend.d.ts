import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface EmployeeInput {
    salary: bigint;
    userId: UserId;
    email: string;
    currency: string;
    payFrequency: PayFrequency;
    lastName: string;
    taxRate: bigint;
    startDate: Timestamp;
    firstName: string;
}
export type Timestamp = bigint;
export interface WorkspaceInput {
    name: string;
}
export interface CrossLink {
    linkLabel: string;
    tenantId: TenantId;
    entityId: EntityId;
    entityType: string;
}
export interface Backup {
    id: EntityId;
    status: BackupStatus;
    completedAt?: Timestamp;
    createdAt: Timestamp;
    createdBy: UserId;
    tenantId: TenantId;
    backupLabel: string;
    sizeBytes?: bigint;
}
export type EntityId = string;
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
    priority: TaskPriority;
    crossLinks: Array<CrossLink>;
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
}
export interface WalletTransaction {
    id: EntityId;
    status: TransactionStatus;
    asset: AssetType;
    accountId: EntityId;
    fromAddress?: string;
    memo?: string;
    createdAt: Timestamp;
    tenantId: TenantId;
    txType: TransactionType;
    toAddress?: string;
    amount: bigint;
}
export interface AuditLog {
    id: EntityId;
    action: string;
    userId: UserId;
    tenantId: TenantId;
    entityId: EntityId;
    timestamp: Timestamp;
    details: string;
    entityType: string;
}
export interface EscrowContract {
    id: EntityId;
    status: EscrowStatus;
    title: string;
    createdAt: Timestamp;
    dueDate?: Timestamp;
    description: string;
    tenantId: TenantId;
    updatedAt: Timestamp;
    currency: string;
    conditions: Array<string>;
    crossLinks: Array<CrossLink>;
    amount: bigint;
    payeeId: UserId;
    payerId: UserId;
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
export interface ProjectInput {
    name: string;
    description: string;
    memberIds: Array<UserId>;
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
    currency: string;
    payFrequency: PayFrequency;
    lastName: string;
    taxRate: bigint;
    startDate: Timestamp;
    firstName: string;
}
export interface WalletAccount {
    id: EntityId;
    accountId: string;
    displayName: string;
    btcBalance: bigint;
    userId: UserId;
    createdAt: Timestamp;
    icpBalance: bigint;
    tenantId: TenantId;
    updatedAt: Timestamp;
    principalId: string;
}
export interface Note {
    id: EntityId;
    title: string;
    content: string;
    authorId: UserId;
    createdAt: Timestamp;
    tags: Array<string>;
    tenantId: TenantId;
    updatedAt: Timestamp;
    crossLinks: Array<CrossLink>;
}
export type TenantId = string;
export interface Workspace {
    id: EntityId;
    ownerId: UserId;
    name: string;
    createdAt: Timestamp;
    tenantId: TenantId;
}
export interface RecurringPayment {
    id: EntityId;
    asset: AssetType;
    accountId: EntityId;
    createdAt: Timestamp;
    isActive: boolean;
    tenantId: TenantId;
    nextRunAt: Timestamp;
    frequency: PayFrequency;
    toAddress: string;
    amount: bigint;
}
export interface Event {
    id: EntityId;
    startTime: Timestamp;
    title: string;
    endTime: Timestamp;
    createdAt: Timestamp;
    createdBy: UserId;
    description: string;
    attendeeIds: Array<UserId>;
    tenantId: TenantId;
    recurrence: RecurrenceRule;
    updatedAt: Timestamp;
    crossLinks: Array<CrossLink>;
}
export interface ChannelInput {
    name: string;
    description: string;
    memberIds: Array<UserId>;
    isPublic: boolean;
}
export interface Channel {
    id: EntityId;
    name: string;
    createdAt: Timestamp;
    createdBy: UserId;
    description: string;
    tenantId: TenantId;
    memberIds: Array<UserId>;
    isPublic: boolean;
}
export interface PayrollRecord {
    id: EntityId;
    status: PayrollStatus;
    period: string;
    createdAt: Timestamp;
    tenantId: TenantId;
    processedAt?: Timestamp;
    employeeId: EntityId;
    currency: string;
    amount: bigint;
}
export type UserId = Principal;
export interface NoteInput {
    title: string;
    content: string;
    tags: Array<string>;
    crossLinks: Array<CrossLink>;
}
export interface EventInput {
    startTime: Timestamp;
    title: string;
    endTime: Timestamp;
    description: string;
    attendeeIds: Array<UserId>;
    recurrence: RecurrenceRule;
    crossLinks: Array<CrossLink>;
}
export interface Message {
    id: EntityId;
    content: string;
    channelId: EntityId;
    createdAt: Timestamp;
    tenantId: TenantId;
    updatedAt: Timestamp;
    replyToId?: EntityId;
    crossLinks: Array<CrossLink>;
    senderId: UserId;
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
    memberIds: Array<UserId>;
    crossLinks: Array<CrossLink>;
}
export interface MessageInput {
    content: string;
    channelId: EntityId;
    replyToId?: EntityId;
    crossLinks: Array<CrossLink>;
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
export interface UserProfileInput {
    displayName: string;
    role: Role;
    email: string;
    workspaceId: EntityId;
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
export enum EscrowStatus {
    Disputed = "Disputed",
    Released = "Released",
    Funded = "Funded",
    Cancelled = "Cancelled",
    Pending = "Pending"
}
export enum PayFrequency {
    BiWeekly = "BiWeekly",
    Weekly = "Weekly",
    Quarterly = "Quarterly",
    Monthly = "Monthly"
}
export enum PayrollStatus {
    Paused = "Paused",
    Active = "Active",
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
export enum Role {
    Admin = "Admin",
    Manager = "Manager",
    TeamMember = "TeamMember"
}
export enum TaskPriority {
    Low = "Low",
    High = "High",
    Medium = "Medium",
    Critical = "Critical"
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
export interface backendInterface {
    addEmployee(tenantId: TenantId, input: EmployeeInput): Promise<{
        __kind__: "ok";
        ok: Employee;
    } | {
        __kind__: "err";
        err: string;
    }>;
    archiveProject(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Project;
    } | {
        __kind__: "err";
        err: string;
    }>;
    cancelEscrow(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: EscrowContract;
    } | {
        __kind__: "err";
        err: string;
    }>;
    cancelRecurringPayment(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: RecurringPayment;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createAutomationRule(tenantId: TenantId, name: string, description: string, trigger: AutomationTrigger, action: AutomationAction): Promise<{
        __kind__: "ok";
        ok: AutomationRule;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createBackup(tenantId: TenantId, backupLabel: string): Promise<{
        __kind__: "ok";
        ok: Backup;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createChannel(tenantId: TenantId, input: ChannelInput): Promise<{
        __kind__: "ok";
        ok: Channel;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createEscrow(tenantId: TenantId, input: EscrowInput): Promise<{
        __kind__: "ok";
        ok: EscrowContract;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createEvent(tenantId: TenantId, input: EventInput): Promise<{
        __kind__: "ok";
        ok: Event;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createNote(tenantId: TenantId, input: NoteInput): Promise<{
        __kind__: "ok";
        ok: Note;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createProject(tenantId: TenantId, input: ProjectInput): Promise<{
        __kind__: "ok";
        ok: Project;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createRecurringPayment(tenantId: TenantId, accountId: EntityId, toAddress: string, amount: bigint, asset: AssetType, frequency: PayFrequency): Promise<{
        __kind__: "ok";
        ok: RecurringPayment;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createTask(tenantId: TenantId, input: TaskInput): Promise<{
        __kind__: "ok";
        ok: Task;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createWalletAccount(tenantId: TenantId, displayName: string): Promise<{
        __kind__: "ok";
        ok: WalletAccount;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createWorkspace(tenantId: TenantId, input: WorkspaceInput): Promise<{
        __kind__: "ok";
        ok: Workspace;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deactivateEmployee(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Employee;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteEvent(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteMessage(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteNote(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteTask(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    disputeEscrow(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: EscrowContract;
    } | {
        __kind__: "err";
        err: string;
    }>;
    fundEscrow(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: EscrowContract;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getBackup(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Backup;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getChannel(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Channel;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getEmployee(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Employee;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getEscrow(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: EscrowContract;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getEvent(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Event;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMessages(tenantId: TenantId, channelId: EntityId, limit: bigint, before: Timestamp | null): Promise<Array<Message>>;
    getMyProfile(tenantId: TenantId): Promise<UserProfile | null>;
    getMyWalletAccount(tenantId: TenantId): Promise<WalletAccount | null>;
    getNote(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Note;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getProject(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Project;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getTask(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Task;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getWalletAccount(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: WalletAccount;
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
    getWorkspaceStats(tenantId: TenantId): Promise<{
        walletAccountCount: bigint;
        employeeCount: bigint;
        noteCount: bigint;
        escrowCount: bigint;
        projectCount: bigint;
    }>;
    joinChannel(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: Channel;
    } | {
        __kind__: "err";
        err: string;
    }>;
    listAuditLogs(tenantId: TenantId, limit: bigint): Promise<Array<AuditLog>>;
    listAutomationRules(tenantId: TenantId): Promise<Array<AutomationRule>>;
    listBackups(tenantId: TenantId): Promise<Array<Backup>>;
    listChannels(tenantId: TenantId): Promise<Array<Channel>>;
    listEmployees(tenantId: TenantId): Promise<Array<Employee>>;
    listEscrows(tenantId: TenantId): Promise<Array<EscrowContract>>;
    listEvents(tenantId: TenantId, from: Timestamp, to: Timestamp): Promise<Array<Event>>;
    listMyEvents(tenantId: TenantId): Promise<Array<Event>>;
    listNotes(tenantId: TenantId): Promise<Array<Note>>;
    listPayrollRecords(tenantId: TenantId, employeeId: EntityId | null): Promise<Array<PayrollRecord>>;
    listProfiles(tenantId: TenantId): Promise<Array<UserProfile>>;
    listProjects(tenantId: TenantId): Promise<Array<Project>>;
    listRecurringPayments(tenantId: TenantId, accountId: EntityId): Promise<Array<RecurringPayment>>;
    listTasks(tenantId: TenantId, projectId: EntityId): Promise<Array<Task>>;
    listTransactions(tenantId: TenantId, accountId: EntityId): Promise<Array<WalletTransaction>>;
    listWorkspaces(tenantId: TenantId): Promise<Array<Workspace>>;
    processPayroll(tenantId: TenantId, employeeId: EntityId, period: string): Promise<{
        __kind__: "ok";
        ok: PayrollRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    releaseEscrow(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: EscrowContract;
    } | {
        __kind__: "err";
        err: string;
    }>;
    searchNotes(tenantId: TenantId, searchQuery: string): Promise<Array<Note>>;
    sendAsset(tenantId: TenantId, accountId: EntityId, asset: AssetType, amount: bigint, toAddress: string, memo: string | null): Promise<{
        __kind__: "ok";
        ok: WalletTransaction;
    } | {
        __kind__: "err";
        err: string;
    }>;
    sendMessage(tenantId: TenantId, input: MessageInput): Promise<{
        __kind__: "ok";
        ok: Message;
    } | {
        __kind__: "err";
        err: string;
    }>;
    toggleAutomationRule(tenantId: TenantId, id: EntityId): Promise<{
        __kind__: "ok";
        ok: AutomationRule;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateEmployee(tenantId: TenantId, id: EntityId, input: EmployeeInput): Promise<{
        __kind__: "ok";
        ok: Employee;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateEvent(tenantId: TenantId, id: EntityId, input: EventInput): Promise<{
        __kind__: "ok";
        ok: Event;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateNote(tenantId: TenantId, id: EntityId, input: NoteInput): Promise<{
        __kind__: "ok";
        ok: Note;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateProject(tenantId: TenantId, id: EntityId, input: ProjectInput): Promise<{
        __kind__: "ok";
        ok: Project;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateTask(tenantId: TenantId, id: EntityId, input: TaskInput): Promise<{
        __kind__: "ok";
        ok: Task;
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
