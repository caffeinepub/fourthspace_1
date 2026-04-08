// ─── Public Goals Types ────────────────────────────────────────────────────────
// Matching backend types/goals.mo PublicGoal and PublicKeyResult

export type PublicGoalStatus = "Active" | "Completed" | "Cancelled" | "OnHold";
export type PublicKRStatus = "OnTrack" | "AtRisk" | "Behind" | "Completed";

export interface PublicKeyResult {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: PublicKRStatus;
}

export interface PublicGoal {
  id: string;
  title: string;
  description: string;
  period: string;
  status: PublicGoalStatus;
  progress: number;
  startDate: string;
  endDate: string;
  keyResults: PublicKeyResult[];
  checkInCount: bigint | number;
}

// ─── Check-in history (public, no internal notes or contributor names) ─────────
export interface PublicCheckIn {
  date: string;
  progressChange: number;
  newProgress: number;
}

// ─── Sort config ───────────────────────────────────────────────────────────────
export type SortField = "name" | "period" | "status" | "progress";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

// ─── Filter options ─────────────────────────────────────────────────────────────
export type StatusFilter = "All" | PublicGoalStatus;
export type PeriodFilter = "All" | "Q1" | "Q2" | "Q3" | "Q4" | "Annual";
