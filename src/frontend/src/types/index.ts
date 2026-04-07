// Re-export all types from the generated backend bindings
export type {
  TenantId,
  UserId,
  EntityId,
  Timestamp,
  CrossLink,
  Workspace,
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
} from "../backend";

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
} from "../backend";

// Derived / UI-only types
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
