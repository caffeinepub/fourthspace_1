import { Card, CardContent } from "@/components/ui/card";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Task } from "../../types";
import { TaskStatus } from "../../types";

function principalToText(id: { toText(): string } | string): string {
  return typeof id === "string" ? id : id.toText();
}

function getInitials(id: string): string {
  return id.slice(0, 2).toUpperCase();
}

const STATUS_FILL: Record<string, string> = {
  [TaskStatus.Todo]: "hsl(var(--muted-foreground) / 0.4)",
  [TaskStatus.InProgress]: "#f97316",
  [TaskStatus.Done]: "#10b981",
  [TaskStatus.Blocked]: "hsl(var(--destructive))",
};

interface WorkloadViewProps {
  tasks: Task[];
  projectId: string;
}

interface AssigneeData {
  id: string;
  initials: string;
  [TaskStatus.Todo]: number;
  [TaskStatus.InProgress]: number;
  [TaskStatus.Done]: number;
  [TaskStatus.Blocked]: number;
  total: number;
}

export default function WorkloadView({ tasks }: WorkloadViewProps) {
  const { chartData, assigneeList } = useMemo(() => {
    const map = new Map<string, AssigneeData>();

    const getOrCreate = (id: string): AssigneeData => {
      if (!map.has(id)) {
        map.set(id, {
          id,
          initials: getInitials(id),
          [TaskStatus.Todo]: 0,
          [TaskStatus.InProgress]: 0,
          [TaskStatus.Done]: 0,
          [TaskStatus.Blocked]: 0,
          total: 0,
        });
      }
      return map.get(id)!;
    };

    for (const task of tasks) {
      const rawId = task.assigneeId;
      const key = rawId != null ? principalToText(rawId) : "unassigned";
      const entry = getOrCreate(key);
      const s = task.status as TaskStatus;
      if (s in entry) (entry[s] as number)++;
      entry.total++;
    }

    const list = Array.from(map.values()).sort((a, b) => b.total - a.total);
    const maxTotal = Math.max(...list.map((a) => a.total), 1);

    return {
      chartData: list.map((a) => ({
        ...a,
        name: a.id === "unassigned" ? "Unassigned" : a.initials,
        displayId:
          a.id === "unassigned" ? "Unassigned" : `${a.id.slice(0, 12)}…`,
      })),
      assigneeList: list.map((a) => ({
        ...a,
        utilization: Math.round((a.total / maxTotal) * 100),
      })),
    };
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center"
        data-ocid="workload-empty"
      >
        <p className="text-muted-foreground text-sm">
          No tasks to display workload for.
        </p>
      </div>
    );
  }

  return (
    <div data-ocid="workload-view" className="space-y-6">
      {/* Stacked bar chart */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Task Distribution by Assignee
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-border/50"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: 12,
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                fontSize: 11,
                color: "hsl(var(--muted-foreground))",
              }}
            />
            <Bar
              dataKey={TaskStatus.Todo}
              name="To Do"
              stackId="a"
              fill={STATUS_FILL[TaskStatus.Todo]}
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey={TaskStatus.InProgress}
              name="In Progress"
              stackId="a"
              fill={STATUS_FILL[TaskStatus.InProgress]}
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey={TaskStatus.Blocked}
              name="Blocked"
              stackId="a"
              fill={STATUS_FILL[TaskStatus.Blocked]}
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey={TaskStatus.Done}
              name="Done"
              stackId="a"
              fill={STATUS_FILL[TaskStatus.Done]}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Team member cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {assigneeList.map((a) => (
          <Card
            key={a.id}
            className="border-border bg-card hover:border-orange-200 dark:hover:border-orange-800 transition-colors"
            data-ocid={`workload-card-${a.id}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                  {a.id === "unassigned" ? "?" : getInitials(a.id)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {a.id === "unassigned"
                      ? "Unassigned"
                      : `Assignee ${a.initials}`}
                  </p>
                  <p className="text-xs text-muted-foreground">{`${a.total} task${a.total !== 1 ? "s" : ""}`}</p>
                </div>
                <span className="text-sm font-bold text-foreground tabular-nums">
                  {a.utilization}%
                </span>
              </div>

              {/* Utilization bar */}
              <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-orange-500 transition-all"
                  style={{ width: `${a.utilization}%` }}
                />
              </div>

              {/* Status breakdown */}
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {a[TaskStatus.Todo] > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {a[TaskStatus.Todo]} todo
                  </span>
                )}
                {a[TaskStatus.InProgress] > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    {a[TaskStatus.InProgress]} in progress
                  </span>
                )}
                {a[TaskStatus.Blocked] > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">
                    {a[TaskStatus.Blocked]} blocked
                  </span>
                )}
                {a[TaskStatus.Done] > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    {a[TaskStatus.Done]} done
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
