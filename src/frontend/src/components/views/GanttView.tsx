import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import type { Task } from "../../types";
import { TaskStatus } from "../../types";

const STATUS_COLORS: Record<string, string> = {
  [TaskStatus.Todo]: "bg-muted-foreground/30",
  [TaskStatus.InProgress]: "bg-orange-500",
  [TaskStatus.Done]: "bg-emerald-500",
  [TaskStatus.Blocked]: "bg-destructive",
};

const STATUS_TEXT: Record<string, string> = {
  [TaskStatus.Todo]: "text-muted-foreground",
  [TaskStatus.InProgress]: "text-orange-500",
  [TaskStatus.Done]: "text-emerald-500",
  [TaskStatus.Blocked]: "text-destructive",
};

function principalToText(id: { toText(): string } | string): string {
  return typeof id === "string" ? id : id.toText();
}

function getInitials(id: { toText(): string } | string): string {
  return principalToText(id).slice(0, 2).toUpperCase();
}

function toMs(nano: bigint | number | undefined): number | null {
  if (nano == null) return null;
  return Number(nano) / 1_000_000;
}

interface GanttViewProps {
  tasks: Task[];
  projectId: string;
}

export default function GanttView({ tasks }: GanttViewProps) {
  const today = Date.now();

  const { startMs, endMs, totalDays } = useMemo(() => {
    const dates = tasks
      .flatMap((t) => [toMs(t.createdAt), toMs(t.dueDate)])
      .filter((d): d is number => d != null);
    const minDate = Math.min(...dates, today);
    const maxDate = Math.max(...dates, today + 7 * 86_400_000);
    // Pad by 3 days on each side
    const s = minDate - 3 * 86_400_000;
    const e = maxDate + 3 * 86_400_000;
    return { startMs: s, endMs: e, totalDays: (e - s) / 86_400_000 };
  }, [tasks, today]);

  const pct = (ms: number) =>
    Math.max(0, Math.min(100, ((ms - startMs) / (endMs - startMs)) * 100));

  const todayPct = pct(today);

  // Build month header labels
  const monthLabels = useMemo(() => {
    const labels: { label: string; pct: number }[] = [];
    const start = new Date(startMs);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    while (start.getTime() < endMs) {
      const t = start.getTime();
      labels.push({
        label: start.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
        pct: Math.max(
          0,
          Math.min(100, ((t - startMs) / (endMs - startMs)) * 100),
        ),
      });
      start.setMonth(start.getMonth() + 1);
    }
    return labels;
  }, [startMs, endMs]);

  // Group tasks by status
  const grouped = useMemo(() => {
    const order = [
      TaskStatus.InProgress,
      TaskStatus.Todo,
      TaskStatus.Blocked,
      TaskStatus.Done,
    ];
    return order
      .map((status) => ({
        status,
        tasks: tasks.filter((t) => t.status === status),
      }))
      .filter((g) => g.tasks.length > 0);
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center"
        data-ocid="gantt-empty"
      >
        <p className="text-muted-foreground text-sm">
          No tasks to display in Gantt view.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" data-ocid="gantt-view">
      {/* Header: Month labels */}
      <div
        className="relative h-8 bg-muted/30 border-b border-border rounded-t-xl overflow-hidden mb-0"
        style={{ minWidth: 600 }}
      >
        {monthLabels.map((m) => (
          <span
            key={m.label}
            className="absolute top-1.5 text-[10px] font-medium text-muted-foreground"
            style={{ left: `${m.pct}%`, transform: "translateX(-50%)" }}
          >
            {m.label}
          </span>
        ))}
        {/* Today marker in header */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-orange-500 opacity-60"
          style={{ left: `${todayPct}%` }}
        />
      </div>

      {/* Rows */}
      <div
        className="relative rounded-b-xl border border-t-0 border-border bg-card overflow-hidden"
        style={{ minWidth: 600 }}
      >
        {/* Today line behind rows */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-orange-500/30 z-10 pointer-events-none"
          style={{ left: `${todayPct}%` }}
        />

        {/* Vertical day guides every ~7 days */}
        {Array.from({ length: Math.ceil(totalDays / 7) }).map((_, i) => {
          const weekMs = startMs + i * 7 * 86_400_000;
          const pos = pct(weekMs);
          return (
            <div
              key={weekMs}
              className="absolute top-0 bottom-0 w-px bg-border/40 pointer-events-none"
              style={{ left: `${pos}%` }}
            />
          );
        })}

        {grouped.map((group) => (
          <div key={group.status}>
            {/* Status group header */}
            <div
              className={`px-4 py-1.5 text-xs font-semibold ${STATUS_TEXT[group.status]} bg-muted/20 border-b border-border/40 sticky left-0`}
            >
              {group.status} ({group.tasks.length})
            </div>
            {group.tasks.map((task) => {
              const createdMs = toMs(task.createdAt) ?? today;
              const dueMs = toMs(task.dueDate);
              const barStart = pct(createdMs);
              const barEnd = dueMs
                ? pct(dueMs)
                : pct(createdMs + 3 * 86_400_000);
              const barWidth = Math.max(barEnd - barStart, 1.5);
              const isOverdue =
                dueMs && dueMs < today && task.status !== TaskStatus.Done;

              return (
                <div
                  key={task.id}
                  className="relative flex items-center h-11 border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                  data-ocid={`gantt-row-${task.id}`}
                >
                  {/* Task bar */}
                  <div
                    className={`absolute h-6 rounded-full flex items-center px-2 gap-1.5 overflow-hidden z-20 cursor-default transition-all ${STATUS_COLORS[task.status]} ${isOverdue ? "ring-1 ring-destructive" : ""}`}
                    style={{
                      left: `${barStart}%`,
                      width: `${barWidth}%`,
                      minWidth: "2.5rem",
                    }}
                    title={task.title}
                  >
                    {/* Assignee avatar */}
                    {task.assigneeId && (
                      <span className="flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-white text-[8px] font-bold">
                        {getInitials(task.assigneeId)}
                      </span>
                    )}
                    <span className="text-[10px] font-medium text-white truncate leading-none">
                      {task.title}
                    </span>
                  </div>

                  {/* Row label (pinned left for small viewports) */}
                  <div className="absolute right-3 flex items-center gap-1.5 z-30 pointer-events-none">
                    {isOverdue && (
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1 py-0 border-destructive/50 text-destructive"
                      >
                        Overdue
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Today label */}
        <div
          className="absolute top-0 z-30 pointer-events-none"
          style={{ left: `${todayPct}%`, transform: "translateX(-50%)" }}
        >
          <span className="text-[9px] font-bold text-orange-500 bg-card px-1 rounded leading-none">
            Today
          </span>
        </div>
      </div>
    </div>
  );
}
