import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { ArrowUpDown, ChevronDown, ChevronUp, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Task } from "../../types";
import { TaskPriority, TaskStatus } from "../../types";

const STATUS_BADGE: Record<string, string> = {
  [TaskStatus.Todo]: "bg-muted text-muted-foreground border-border",
  [TaskStatus.InProgress]:
    "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400",
  [TaskStatus.Done]:
    "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
  [TaskStatus.Blocked]:
    "bg-destructive/10 text-destructive border-destructive/20",
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

const PRIORITY_ORDER: Record<string, number> = {
  [TaskPriority.Critical]: 0,
  [TaskPriority.High]: 1,
  [TaskPriority.Medium]: 2,
  [TaskPriority.Low]: 3,
};

type SortKey =
  | "title"
  | "status"
  | "priority"
  | "assigneeId"
  | "dueDate"
  | "createdAt";
type SortDir = "asc" | "desc";

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

interface TableViewProps {
  tasks: Task[];
  projectId: string;
  workspaceId?: string;
}

export default function TableView({
  tasks,
  projectId,
  workspaceId = "",
}: TableViewProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = q
      ? tasks.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.status.toLowerCase().includes(q),
        )
      : tasks;

    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "title") cmp = a.title.localeCompare(b.title);
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      else if (sortKey === "priority")
        cmp =
          (PRIORITY_ORDER[a.priority] ?? 99) -
          (PRIORITY_ORDER[b.priority] ?? 99);
      else if (sortKey === "assigneeId") {
        const aText = a.assigneeId != null ? principalToText(a.assigneeId) : "";
        const bText = b.assigneeId != null ? principalToText(b.assigneeId) : "";
        cmp = aText.localeCompare(bText);
      } else if (sortKey === "dueDate")
        cmp = (toMs(a.dueDate) ?? 0) - (toMs(b.dueDate) ?? 0);
      else if (sortKey === "createdAt")
        cmp = (toMs(a.createdAt) ?? 0) - (toMs(b.createdAt) ?? 0);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [tasks, search, sortKey, sortDir]);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    );
  };

  const Th = ({
    col,
    label,
    align = "left",
  }: { col: SortKey; label: string; align?: "left" | "right" }) => (
    <th
      className={`px-0 py-0 font-medium text-muted-foreground text-xs ${align === "right" ? "text-right" : "text-left"}`}
      data-ocid={`table-sort-${col}`}
    >
      <button
        type="button"
        className={`w-full px-4 py-3 flex items-center gap-1 hover:text-foreground transition-colors ${align === "right" ? "justify-end" : "justify-start"}`}
        onClick={() => handleSort(col)}
        aria-sort={
          sortKey === col
            ? sortDir === "asc"
              ? "ascending"
              : "descending"
            : "none"
        }
      >
        {label}
        <SortIcon col={col} />
      </button>
    </th>
  );

  return (
    <div data-ocid="table-view" className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks…"
          className="pl-8 h-8 text-sm"
          data-ocid="table-search"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="sticky top-0 bg-muted/40 backdrop-blur-sm border-b border-border z-10">
            <tr>
              <Th col="title" label="Task Name" />
              <Th col="status" label="Status" />
              <Th col="priority" label="Priority" />
              <Th col="assigneeId" label="Assignee" />
              <Th col="dueDate" label="Due Date" align="right" />
              <Th col="createdAt" label="Created" align="right" />
            </tr>
          </thead>
          <tbody className="bg-card">
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground text-sm"
                >
                  {search ? "No tasks match your search." : "No tasks yet."}
                </td>
              </tr>
            ) : (
              sorted.map((task) => {
                const dueMs = toMs(task.dueDate);
                const createdMs = toMs(task.createdAt);
                const isOverdue =
                  dueMs &&
                  dueMs < Date.now() &&
                  task.status !== TaskStatus.Done;

                return (
                  <tr
                    key={task.id}
                    data-ocid={`table-row-${task.id}`}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 max-w-[220px]">
                      <Link
                        to="/app/$workspaceId/projects/$projectId/tasks/$taskId"
                        params={{ workspaceId, projectId, taskId: task.id }}
                        className="font-medium text-foreground hover:text-primary truncate block transition-colors"
                      >
                        {task.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 ${STATUS_BADGE[task.status]}`}
                      >
                        {task.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 ${PRIORITY_BADGE[task.priority]}`}
                      >
                        {task.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {task.assigneeId ? (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary flex-shrink-0">
                            {getInitials(task.assigneeId)}
                          </div>
                          <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                            {`${principalToText(task.assigneeId).slice(0, 8)}…`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/50">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td
                      className={`px-4 py-3 text-right text-xs tabular-nums ${isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}`}
                    >
                      {dueMs ? (
                        new Date(dueMs).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "2-digit",
                        })
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground tabular-nums">
                      {createdMs
                        ? new Date(createdMs).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "2-digit",
                          })
                        : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground text-right">
        {sorted.length} of {tasks.length} tasks
      </p>
    </div>
  );
}
