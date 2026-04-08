import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Task } from "../../types";
import { TaskPriority, TaskStatus } from "../../types";

type Filter = "all" | "week" | "month" | "overdue";

const STATUS_DOT: Record<string, string> = {
  [TaskStatus.Todo]: "bg-muted-foreground/60",
  [TaskStatus.InProgress]: "bg-orange-500",
  [TaskStatus.Done]: "bg-emerald-500",
  [TaskStatus.Blocked]: "bg-destructive",
};

const PRIORITY_BADGE: Record<string, string> = {
  [TaskPriority.Low]: "bg-muted text-muted-foreground border-border",
  [TaskPriority.Medium]:
    "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400",
  [TaskPriority.High]:
    "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800 dark:text-red-400",
  [TaskPriority.Critical]:
    "bg-red-600/20 text-red-700 border-red-300 dark:border-red-700 dark:text-red-300 font-semibold",
};

function toMs(nano: bigint | number | undefined): number | null {
  if (nano == null) return null;
  return Number(nano) / 1_000_000;
}

function principalToText(id: { toText(): string } | string): string {
  return typeof id === "string" ? id : id.toText();
}

function getInitials(id: { toText(): string } | string): string {
  return principalToText(id).slice(0, 2).toUpperCase();
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "overdue", label: "Overdue" },
];

interface TimelineViewProps {
  tasks: Task[];
  projectId: string;
}

export default function TimelineView({ tasks, projectId }: TimelineViewProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const today = Date.now();

  const filtered = tasks
    .filter((t) => {
      const dueMs = toMs(t.dueDate);
      if (filter === "overdue")
        return dueMs != null && dueMs < today && t.status !== TaskStatus.Done;
      if (filter === "week") {
        const endOfWeek = today + 7 * 86_400_000;
        return dueMs != null && dueMs >= today && dueMs <= endOfWeek;
      }
      if (filter === "month") {
        const endOfMonth = today + 30 * 86_400_000;
        return dueMs != null && dueMs >= today && dueMs <= endOfMonth;
      }
      return true;
    })
    .sort((a, b) => {
      const aMs = toMs(a.dueDate) ?? Number.POSITIVE_INFINITY;
      const bMs = toMs(b.dueDate) ?? Number.POSITIVE_INFINITY;
      return aMs - bMs;
    });

  return (
    <div data-ocid="timeline-view" className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-1.5" data-ocid="timeline-filters">
        {FILTERS.map((f) => (
          <Button
            key={f.key}
            variant={filter === f.key ? "default" : "outline"}
            size="sm"
            className={`h-7 px-3 text-xs ${filter === f.key ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            onClick={() => setFilter(f.key)}
            data-ocid={`timeline-filter-${f.key}`}
          >
            {f.label}
          </Button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground self-center">
          {filtered.length} task{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border">
          <p className="text-muted-foreground text-sm">
            No tasks match this filter.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((task) => {
            const dueMs = toMs(task.dueDate);
            const isOverdue =
              dueMs && dueMs < today && task.status !== TaskStatus.Done;

            return (
              <Link
                key={task.id}
                to="/app/projects/$projectId/tasks/$taskId"
                params={{ projectId, taskId: task.id }}
                data-ocid={`timeline-task-${task.id}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-sm transition-all group"
              >
                {/* Status dot */}
                <span
                  className={`flex-shrink-0 h-2.5 w-2.5 rounded-full ${STATUS_DOT[task.status]}`}
                />

                {/* Task info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {task.status}
                  </p>
                </div>

                {/* Assignee */}
                {task.assigneeId && (
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">
                    {getInitials(task.assigneeId)}
                  </div>
                )}

                {/* Priority badge */}
                <Badge
                  variant="outline"
                  className={`flex-shrink-0 text-[10px] px-1.5 py-0 ${PRIORITY_BADGE[task.priority]}`}
                >
                  {task.priority}
                </Badge>

                {/* Due date */}
                {dueMs ? (
                  <span
                    className={`flex-shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-md ${
                      isOverdue
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {new Date(dueMs).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                ) : (
                  <span className="flex-shrink-0 text-[11px] text-muted-foreground/50">
                    No date
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
