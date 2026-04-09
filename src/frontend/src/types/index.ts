// Re-export all types from the generated backend bindings
export type {
  TenantId,
  UserId,
  EntityId,
  Timestamp,
  CrossLink,
  Workspace,
  WorkspaceMember,
  WorkspaceId,
  Note,
  NoteInput,
  Project,
  Task,
  TaskInput,
  ProjectInput,
  Channel,
  Message,
  ChannelInput,
  MessageInput,
  Event,
  EventInput,
  Employee,
  EmployeeInput,
  PayrollRecord,
  EscrowContract,
  EscrowInput,
  WalletAccount,
  WalletTransaction,
  RecurringPayment,
  AutomationRule,
  AuditLog,
  Backup,
  UserProfile,
  UserProfileInput,
  WorkspaceInput,
  // New project feature types
  Subtask,
  SubtaskInput,
  Sprint,
  SprintInput,
  Milestone,
  MilestoneInput,
  TaskComment,
  TaskCommentInput,
  ActivityEvent,
  TaskWatcher,
  TaskRelationship,
  ChecklistItem,
  ChecklistItemInput,
  RecurringTask,
  RecurringTaskInput,
  TaskTemplate,
  TaskTemplateInput,
  // Time tracking
  TimeEntry,
  TimeEntryInput,
  TimeReport,
  // Pages / block editor
  Block,
  PageNode,
  PageInput,
  NoteTemplate,
  NoteTemplateInput,
  NoteEditorPresence,
  NoteLastEdit,
  // Chat enhancement types
  Reaction,
  UserStatus,
  MentionEntry,
  UnreadEntry,
  // Calendar types
  CalendarDef,
  CalendarDefInput,
  EventRsvp,
  EventRsvpInput,
  EventException,
  EventExceptionInput,
  AvailabilitySlot,
  // Payroll extended types
  Benefit,
  BenefitInput,
  Deduction,
  DeductionInput,
  PayStub,
  PaySchedule,
  PayScheduleInput,
  Contractor,
  ContractorInput,
  ContractorPayment,
  ContractorPaymentInput,
  OffCyclePayment,
  OffCyclePaymentInput,
  AuditLogEntry,
} from "../backend";

// ---- UI-only types ----
/** Filters for the message search hook */
export interface MessageSearchFilters {
  channelId?: string;
  senderId?: string;
  fromTime?: bigint;
  toTime?: bigint;
}

export {
  Role,
  TaskStatus,
  TaskPriority,
  ProjectStatus,
  PayFrequency,
  EscrowStatus,
  BackupStatus,
  PayrollStatus,
  RecurrenceRule,
  AssetType,
  TransactionType,
  TransactionStatus,
  AutomationTrigger,
  AutomationAction,
  // New project enums
  SprintStatus,
  MilestoneStatus,
  MilestoneStatus__1,
  TaskRelationshipType,
  ActivityEventType,
  RecurrenceType,
  // Calendar enums
  CalendarType,
  EventCategory,
  ExceptionType,
  RsvpStatus,
  // Payroll enums
  DeductionFrequency,
  DeductionType,
  ContractorPaymentReason,
  ContractorPaymentStatus,
  OffCycleReason,
  // Workspace enums
  WorkspaceRole,
  // Escrow enums
  DisputeStatus,
} from "../backend";

export type {
  WorkspaceSpendingLimit,
  EscrowSummary,
  EscrowDispute,
  EscrowMilestone,
  StatusHistoryEntry,
} from "../backend";

// Derived / UI-only types

/** String alias for workspace ID — same as backend WorkspaceId */
export type WorkspaceIdAlias = string;

/** Convenience role type matching backend WorkspaceRole enum values */
export type WorkspaceRoleType = "Admin" | "Manager" | "TeamMember" | "Guest";

export interface WorkspaceStats {
  totalNotes: number;
  totalProjects: number;
  activeTasks: number;
  totalChannels: number;
  totalEmployees: number;
  activeEscrows: number;
  walletBalance: bigint;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type:
    | "note"
    | "project"
    | "task"
    | "chat"
    | "event"
    | "payroll"
    | "escrow"
    | "wallet";
  title: string;
  description: string;
  timestamp: number;
  entityId: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  color: string;
  badge?: number;
  children?: NavItem[];
}

export type CategoryColor =
  | "notes"
  | "projects"
  | "chat"
  | "calendar"
  | "payroll"
  | "escrow"
  | "wallet"
  | "ai"
  | "admin"
  | "settings";

// ---- AI Types ----
export type AIProvider = "openai" | "anthropic" | "google" | "custom";
export type AIModelId = string;

export interface AIConfig {
  id: string;
  tenantId: string;
  provider: AIProvider;
  modelId: AIModelId;
  apiKeyRef: string;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface AIPrompt {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  createdAt: number;
  updatedAt: number;
}

export interface AIResponse {
  id: string;
  tenantId: string;
  promptId: string;
  userInput: string;
  output: string;
  tokensUsed: number;
  durationMs: number;
  createdAt: number;
}

// ---- Integration Types ----
export type IntegrationProvider =
  | "slack"
  | "github"
  | "google_drive"
  | "google_calendar"
  | "notion"
  | "jira"
  | "trello"
  | "zapier"
  | "custom";

export type IntegrationStatus = "active" | "inactive" | "error" | "pending";

export interface Integration {
  id: string;
  tenantId: string;
  provider: IntegrationProvider;
  name: string;
  status: IntegrationStatus;
  config: Record<string, string>;
  webhookUrl?: string;
  lastSyncedAt?: number;
  createdAt: number;
  updatedAt: number;
}

// ---- Time Tracking UI types ----
export type TimeEntryStatus = "running" | "stopped";

/** UI-only time entry used by TimeTracker widget (client-side timer state) */
export interface TimeEntryLocal {
  id: string;
  tenantId: string;
  userId: string;
  projectId: string;
  taskId?: string;
  description: string;
  startedAt: number;
  stoppedAt?: number;
  durationSeconds: number;
  status: TimeEntryStatus;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

// ---- Guest / External User Types ----
export type GuestRole = "viewer" | "commenter" | "editor";
export type GuestInvitationStatus =
  | "pending"
  | "accepted"
  | "expired"
  | "revoked";

export interface GuestUser {
  id: string;
  tenantId: string;
  email: string;
  displayName: string;
  role: GuestRole;
  projectIds: string[];
  invitedBy: string;
  acceptedAt?: number;
  expiresAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface GuestInvitation {
  id: string;
  tenantId: string;
  projectId: string;
  email: string;
  role: GuestRole;
  token: string;
  status: GuestInvitationStatus;
  invitedBy: string;
  expiresAt: number;
  createdAt: number;
}

// ---- Form Types ----
export type FormFieldType =
  | "text"
  | "textarea"
  | "email"
  | "phone"
  | "number"
  | "date"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "file"
  | "rating";

export type FormStatus = "draft" | "published" | "archived";

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  order: number;
}

export interface Form {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  publicUrl: string;
  status: FormStatus;
  fields: FormField[];
  projectId?: string;
  submissionsCount: number;
  notifyEmail?: string;
  createdAt: number;
  updatedAt: number;
}

export interface FormSubmission {
  id: string;
  tenantId: string;
  formId: string;
  data: Record<string, string | string[] | boolean | number>;
  submittedAt: number;
  submitterEmail?: string;
  submitterName?: string;
  ipAddress?: string;
}

// ---- Pages / Block Editor Types ----
// Block and PageNode come from backend — re-exported below
// BlockType is a convenience alias (backend uses BlockTypeTag = string)
export type BlockType =
  | "paragraph"
  | "heading1"
  | "heading2"
  | "heading3"
  | "bulletList"
  | "numberedList"
  | "todo"
  | "toggle"
  | "callout"
  | "code"
  | "divider"
  | "quote"
  | "table"
  | "image";

// ---- Whiteboard Types ----
export type WhiteboardElementType =
  | "rect"
  | "ellipse"
  | "text"
  | "arrow"
  | "line"
  | "sticky"
  | "image"
  | "freehand";

export interface WhiteboardElement {
  id: string;
  type: WhiteboardElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  text?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fontSize?: number;
  opacity: number;
  points?: number[];
  imageUrl?: string;
  locked: boolean;
  createdBy: string;
  updatedAt: number;
}

export interface Whiteboard {
  id: string;
  tenantId: string;
  projectId: string;
  name: string;
  elements: WhiteboardElement[];
  thumbnail?: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}
