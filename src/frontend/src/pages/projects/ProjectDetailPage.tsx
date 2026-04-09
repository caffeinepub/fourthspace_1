import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CalendarCheck,
  CalendarRange,
  CheckCircle2,
  Circle,
  Clock,
  Diamond,
  FileText,
  Flag,
  FolderKanban,
  GanttChartSquare,
  LayoutDashboard,
  LayoutList,
  Plus,
  Table2,
  Trash2,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { Whiteboard } from "../../backend";
import GanttView from "../../components/views/GanttView";
import TableView from "../../components/views/TableView";
import TimelineView from "../../components/views/TimelineView";
import WorkloadView from "../../components/views/WorkloadView";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import {
  type Milestone,
  MilestoneStatus,
  type Project,
  ProjectStatus,
  type Task,
  TaskPriority,
  TaskStatus,
  type WorkspaceMember,
} from "../../types";

type ViewMode = "kanban" | "gantt" | "timeline" | "table" | "workload";

const VIEW_TABS: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
  {
    mode: "kanban",
    label: "Kanban",
    icon: <FolderKanban className="h-3.5 w-3.5" />,
  },
  {
    mode: "gantt",
    label: "Gantt",
    icon: <GanttChartSquare className="h-3.5 w-3.5" />,
  },
  {
    mode: "timeline",
    label: "Timeline",
    icon: <LayoutList className="h-3.5 w-3.5" />,
  },
  { mode: "table", label: "Table", icon: <Table2 className="h-3.5 w-3.5" /> },
  {
    mode: "workload",
    label: "Workload",
    icon: <BarChart3 className="h-3.5 w-3.5" />,
  },
];

const COLUMNS: {
  status: TaskStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
}[] = [
  {
    status: TaskStatus.Todo,
    label: "To Do",
    icon: <Circle className="h-3.5 w-3.5" />,
    color: "text-muted-foreground",
    bg: "bg-muted/40",
    border: "border-muted",
  },
  {
    status: TaskStatus.InProgress,
    label: "In Progress",
    icon: <Clock className="h-3.5 w-3.5" />,
    color: "text-orange-500",
    bg: "bg-orange-500/5",
    border: "border-orange-200/60 dark:border-orange-800/40",
  },
  {
    status: TaskStatus.Done,
    label: "Done",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    color: "text-emerald-500",
    bg: "bg-emerald-500/5",
    border: "border-emerald-200/60 dark:border-emerald-800/40",
  },
  {
    status: TaskStatus.Blocked,
    label: "Blocked",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    color: "text-destructive",
    bg: "bg-destructive/5",
    border: "border-destructive/20",
  },
];

const PRIORITY_BADGE: Record<TaskPriority, string> = {
  [TaskPriority.Low]: "bg-muted text-muted-foreground border-border",
  [TaskPriority.Medium]:
    "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400",
  [TaskPriority.High]:
    "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400",
  [TaskPriority.Critical]:
    "bg-red-600/20 text-red-700 border-red-300 dark:border-red-700 dark:text-red-300 font-semibold",
};

const PROJECT_STATUS_BADGE: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  [ProjectStatus.Active]: {
    label: "Active",
    className:
      "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400",
  },
  [ProjectStatus.OnHold]: {
    label: "On Hold",
    className: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  },
  [ProjectStatus.Completed]: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  },
  [ProjectStatus.Archived]: {
    label: "Archived",
    className: "bg-muted text-muted-foreground border-border",
  },
};

function getInitials(member: WorkspaceMember | undefined): string {
  if (!member?.displayName) return "?";
  return member.displayName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function TaskCard({
  task,
  projectId,
  workspaceId,
  members,
  subtaskCounts,
  onDragStart,
}: {
  task: Task;
  projectId: string;
  workspaceId: string;
  members: WorkspaceMember[];
  subtaskCounts: Record<string, { done: number; total: number }>;
  onDragStart: (task: Task) => void;
}) {
  const dueDateMs = task.dueDate ? Number(task.dueDate) / 1_000_000 : null;
  const isOverdue =
    dueDateMs && dueDateMs < Date.now() && task.status !== TaskStatus.Done;
  const assignee = task.assigneeId
    ? members.find((m) => m.userId.toString() === task.assigneeId?.toString())
    : undefined;
  const subCounts = subtaskCounts[task.id];
  const isMilestone = task.crossLinks?.some(
    (cl) => cl.entityType === "milestone",
  );

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(task);
      }}
      data-task-id={task.id}
      data-ocid={`task-card-${task.id}`}
      className="group relative rounded-xl border border-border/50 bg-card p-3 cursor-grab active:cursor-grabbing transition-all duration-150 hover:shadow-sm hover:border-primary/30 hover:-translate-y-0.5 select-none"
    >
      <Link
        to="/app/$workspaceId/projects/$projectId/tasks/$taskId"
        params={{ workspaceId, projectId, taskId: task.id }}
        className="absolute inset-0 rounded-xl z-0"
        aria-hidden
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="relative z-10 pointer-events-none">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-start gap-1.5 min-w-0">
            {isMilestone && (
              <Diamond className="h-3 w-3 text-primary shrink-0 mt-0.5" />
            )}
            <p className="text-xs font-medium text-foreground leading-snug line-clamp-2 min-w-0">
              {task.title}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium border ${PRIORITY_BADGE[task.priority]}`}
          >
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="text-[11px] text-muted-foreground line-clamp-1 mb-1.5">
            {task.description}
          </p>
        )}

        {/* Subtask progress bar */}
        {subCounts && subCounts.total > 0 && (
          <div className="mb-1.5">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] text-muted-foreground">
                {subCounts.done}/{subCounts.total} subtasks
              </span>
            </div>
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{
                  width: `${Math.round((subCounts.done / subCounts.total) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          {dueDateMs && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground flex-1 min-w-0">
              <Clock
                className={`h-2.5 w-2.5 shrink-0 ${isOverdue ? "text-destructive" : ""}`}
              />
              <span className={isOverdue ? "text-destructive font-medium" : ""}>
                {new Date(dueDateMs).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
          {assignee ? (
            <div
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[9px] font-bold text-primary ml-auto"
              title={assignee.displayName}
            >
              {getInitials(assignee)}
            </div>
          ) : (
            <div className="ml-auto" />
          )}
        </div>
      </div>

      <Link
        to="/app/$workspaceId/projects/$projectId/tasks/$taskId"
        params={{ workspaceId, projectId, taskId: task.id }}
        className="absolute inset-0 rounded-xl z-0"
        tabIndex={0}
        data-ocid={`task-card-link-${task.id}`}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

function KanbanColumn({
  status,
  label,
  icon,
  color,
  bg,
  border,
  tasks,
  projectId,
  workspaceId,
  members,
  subtaskCounts,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
}: {
  status: TaskStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  tasks: Task[];
  projectId: string;
  workspaceId: string;
  members: WorkspaceMember[];
  subtaskCounts: Record<string, { done: number; total: number }>;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent, status: TaskStatus) => void;
  onDragLeave: () => void;
  onDrop: (status: TaskStatus) => void;
  onDragStart: (task: Task) => void;
}) {
  return (
    <div className="flex flex-col w-[260px] sm:w-[280px] shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <div
          className={`flex items-center gap-1.5 font-semibold text-sm ${color}`}
        >
          {icon} {label}
          <span className="ml-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full font-normal">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          asChild
          aria-label={`Add task to ${label}`}
          data-ocid={`add-task-col-${status}`}
        >
          <Link
            to="/app/$workspaceId/projects/$projectId/tasks/$taskId"
            params={{ workspaceId, projectId, taskId: "new" }}
          >
            <Plus className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
      <div
        className={`flex flex-col gap-2 rounded-2xl border ${border} ${bg} p-2 flex-1 min-h-[200px] transition-all duration-150 ${
          isDragOver
            ? "ring-2 ring-primary/40 bg-primary/5 border-primary/40 scale-[1.01]"
            : ""
        }`}
        onDragOver={(e) => onDragOver(e, status)}
        onDragLeave={onDragLeave}
        onDrop={() => onDrop(status)}
        data-column-status={status}
        data-ocid={`kanban-col-${status}`}
      >
        {tasks.length === 0 && !isDragOver && (
          <div className="flex flex-col items-center justify-center py-10 opacity-40">
            <p className="text-xs text-muted-foreground">
              {isDragOver ? "Drop here" : "No tasks"}
            </p>
          </div>
        )}
        {isDragOver && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5">
            <p className="text-xs text-primary font-medium">Drop here</p>
          </div>
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            projectId={projectId}
            workspaceId={workspaceId}
            members={members}
            subtaskCounts={subtaskCounts}
            onDragStart={onDragStart}
          />
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-1.5 text-muted-foreground text-xs h-8 hover:text-foreground mt-auto"
          asChild
          data-ocid={`add-task-btn-${status}`}
        >
          <Link
            to="/app/$workspaceId/projects/$projectId/tasks/$taskId"
            params={{ workspaceId, projectId, taskId: "new" }}
          >
            <Plus className="h-3.5 w-3.5" /> Add Task
          </Link>
        </Button>
      </div>
    </div>
  );
}

const WB_COLORS = [
  "from-violet-500/20 to-purple-500/30",
  "from-orange-400/20 to-amber-500/30",
  "from-teal-400/20 to-emerald-500/30",
  "from-pink-400/20 to-rose-500/30",
  "from-blue-400/20 to-cyan-500/30",
];

function WhiteboardCard({
  wb,
  projectId,
  workspaceId,
  onDelete,
}: {
  wb: Whiteboard;
  projectId: string;
  workspaceId: string;
  onDelete: (id: string) => void;
}) {
  const colorClass = WB_COLORS[wb.id.charCodeAt(0) % WB_COLORS.length];
  const updatedMs = wb.updatedAt ? Number(wb.updatedAt) / 1_000_000 : null;
  return (
    <div
      className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-smooth hover:shadow-md hover:-translate-y-0.5"
      data-ocid={`whiteboard-card-${wb.id}`}
    >
      <Link
        to="/app/$workspaceId/projects/$projectId/whiteboard/$whiteboardId"
        params={{ workspaceId, projectId, whiteboardId: wb.id }}
        className="block"
      >
        <div
          className={`h-24 sm:h-28 bg-gradient-to-br ${colorClass} flex items-center justify-center`}
        >
          <LayoutDashboard className="h-10 w-10 opacity-30 text-foreground" />
        </div>
      </Link>
      <div className="px-3 py-2.5">
        <Link
          to="/app/$workspaceId/projects/$projectId/whiteboard/$whiteboardId"
          params={{ workspaceId, projectId, whiteboardId: wb.id }}
        >
          <p className="text-sm font-semibold text-foreground truncate hover:text-primary transition-colors">
            {wb.title}
          </p>
        </Link>
        {updatedMs && (
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Updated{" "}
            {new Date(updatedMs).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDelete(wb.id)}
        aria-label="Delete whiteboard"
        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-card/80 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-destructive"
        data-ocid={`delete-whiteboard-${wb.id}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function getViewKey(projectId: string) {
  return `fourthspace:project-view:${projectId}`;
}

export default function ProjectDetailPage() {
  const { workspaceId, projectId } = useParams({
    from: "/app/$workspaceId/projects/$projectId",
  });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();

  const [view, setView] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem(getViewKey(projectId));
      if (saved && VIEW_TABS.some((t) => t.mode === saved))
        return saved as ViewMode;
    } catch (_) {
      /* ignore */
    }
    return "kanban";
  });

  // Kanban drag state
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  // Optimistic task statuses (taskId -> status)
  const [localStatuses, setLocalStatuses] = useState<
    Record<string, TaskStatus>
  >({});
  const dragLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(getViewKey(projectId), view);
    } catch (_) {
      /* ignore */
    }
  }, [view, projectId]);

  const { data: project, isLoading: projectLoading } = useQuery<Project | null>(
    {
      queryKey: ["project", tenantId, workspaceId, projectId],
      queryFn: async () => {
        if (!actor) return null;
        const r = await actor.getProject(tenantId, workspaceId, projectId);
        return r.__kind__ === "ok" ? r.ok : null;
      },
      enabled: !!actor && !isFetching && !!projectId,
    },
  );

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["tasks", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTasks(tenantId, workspaceId, projectId);
    },
    enabled: !!actor && !isFetching && !!projectId,
  });

  const { data: members = [] } = useQuery<WorkspaceMember[]>({
    queryKey: ["members", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaceMembers(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching,
  });

  // Merge server tasks with local optimistic statuses
  const tasksWithStatus = tasks.map((t) => ({
    ...t,
    status: localStatuses[t.id] ?? t.status,
  }));

  // Subtask counts per task — Task type has no subtask fields, so hide progress bars gracefully
  const subtaskCounts = useMemo<
    Record<string, { done: number; total: number }>
  >(() => ({}), []);

  const { data: whiteboards = [], isLoading: wbLoading } = useQuery<
    Whiteboard[]
  >({
    queryKey: ["whiteboards", tenantId, workspaceId, projectId],
    queryFn: async (): Promise<Whiteboard[]> => {
      if (!actor) return [];
      return actor.listWhiteboards(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!projectId,
  });

  const { data: milestones = [] } = useQuery<Milestone[]>({
    queryKey: ["milestones", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMilestones(tenantId, workspaceId, projectId);
    },
    enabled: !!actor && !isFetching && !!projectId,
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: async ({
      taskId,
      newStatus,
    }: { taskId: string; newStatus: TaskStatus }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updateTaskStatus(
        tenantId,
        workspaceId,
        taskId,
        newStatus,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return { taskId, newStatus };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", tenantId, workspaceId, projectId],
      });
    },
    onError: (err: Error, { taskId }) => {
      // Revert optimistic update
      setLocalStatuses((prev) => {
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
      toast.error(err.message || "Failed to update task status");
    },
  });

  const handleDragStart = useCallback((task: Task) => {
    setDraggingTask(task);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, status: TaskStatus) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (dragLeaveTimer.current) {
        clearTimeout(dragLeaveTimer.current);
        dragLeaveTimer.current = null;
      }
      setDragOverColumn(status);
    },
    [],
  );

  const handleDragLeave = useCallback(() => {
    dragLeaveTimer.current = setTimeout(() => {
      setDragOverColumn(null);
    }, 80);
  }, []);

  const handleDrop = useCallback(
    (targetStatus: TaskStatus) => {
      setDragOverColumn(null);
      if (!draggingTask) return;

      const currentStatus =
        localStatuses[draggingTask.id] ?? draggingTask.status;
      if (currentStatus === targetStatus) {
        setDraggingTask(null);
        return;
      }

      // Optimistic update immediately
      setLocalStatuses((prev) => ({
        ...prev,
        [draggingTask.id]: targetStatus,
      }));

      // Persist status change to backend via the dedicated updateTaskStatus endpoint
      updateTaskStatusMutation.mutate({
        taskId: draggingTask.id,
        newStatus: targetStatus,
      });
      setDraggingTask(null);
    },
    [draggingTask, localStatuses, updateTaskStatusMutation],
  );

  const createWbMutation = useMutation({
    mutationFn: async (): Promise<Whiteboard> => {
      if (!actor) throw new Error("Whiteboards not available");
      const result = await actor.createWhiteboard(tenantId, workspaceId, {
        projectId: projectId as string | undefined,
        title: "New Whiteboard",
      });
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (wb: Whiteboard) => {
      queryClient.invalidateQueries({
        queryKey: ["whiteboards", tenantId, workspaceId, projectId],
      });
      navigate({
        to: "/app/$workspaceId/projects/$projectId/whiteboard/$whiteboardId",
        params: { workspaceId, projectId, whiteboardId: wb.id },
      });
    },
  });

  const deleteWbMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) return;
      await actor.deleteWhiteboard(tenantId, workspaceId, id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["whiteboards", tenantId, workspaceId, projectId],
      }),
  });

  if (projectLoading || tasksLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-6 pb-20 md:pb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-7 w-56" />
        </div>
        <div className="flex gap-4 pt-4 overflow-x-auto">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-64 w-64 rounded-2xl shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center pb-20 md:pb-8">
        <p className="text-muted-foreground">Project not found.</p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() =>
            navigate({
              to: "/app/$workspaceId/projects",
              params: { workspaceId },
            })
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
      </div>
    );
  }

  const statusBadge = PROJECT_STATUS_BADGE[project.status];
  const totalTasks = tasksWithStatus.length;
  const doneTasks = tasksWithStatus.filter(
    (t) => t.status === TaskStatus.Done,
  ).length;

  return (
    <div
      className="flex flex-col h-full min-h-0 overflow-y-auto pb-20 md:pb-0"
      onDragEnd={() => {
        setDraggingTask(null);
        setDragOverColumn(null);
      }}
    >
      {/* Project Header + View Switcher */}
      <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-5 pb-0 border-b border-border/60 bg-card/80 sticky top-0 z-10 backdrop-blur-subtle">
        <div className="flex items-start gap-2.5 pb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              navigate({
                to: "/app/$workspaceId/projects",
                params: { workspaceId },
              })
            }
            aria-label="Back to Projects"
            className="shrink-0 mt-0.5 h-8 w-8 min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10">
                <FolderKanban className="h-3.5 w-3.5 text-orange-500" />
              </div>
              <h1 className="font-display text-base sm:text-lg font-bold text-foreground truncate tracking-tight">
                {project.name}
              </h1>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium border ${statusBadge.className}`}
              >
                {statusBadge.label}
              </span>
            </div>
            {project.description && (
              <p className="text-xs text-muted-foreground ml-9 line-clamp-1">
                {project.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {totalTasks > 0 && (
              <div className="hidden sm:flex flex-col items-end gap-0.5">
                <span className="text-xs text-muted-foreground">
                  {doneTasks}/{totalTasks} done
                </span>
                <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%`,
                    }}
                  />
                </div>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1.5 rounded-lg">
              <Users className="h-3 w-3" />
              <span className="hidden sm:inline">
                {project.memberIds.length} member
                {project.memberIds.length !== 1 ? "s" : ""}
              </span>
              <span className="sm:hidden">{project.memberIds.length}</span>
            </div>
          </div>
        </div>

        {/* View tabs */}
        <div
          className="flex items-center gap-0 -mb-px overflow-x-auto scrollbar-none"
          data-ocid="view-switcher"
        >
          {VIEW_TABS.map((tab) => (
            <button
              key={tab.mode}
              type="button"
              onClick={() => setView(tab.mode)}
              data-ocid={`view-tab-${tab.mode}`}
              className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap min-h-[44px] ${
                view === tab.mode
                  ? "border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-500/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
          <div className="w-px h-5 bg-border mx-1 shrink-0" aria-hidden />
          <Link
            to="/app/$workspaceId/projects/$projectId/sprints"
            params={{ workspaceId, projectId }}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-t-lg border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors whitespace-nowrap min-h-[44px]"
            data-ocid="sprints-tab"
          >
            <CalendarRange className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sprints</span>
          </Link>
          <Link
            to="/app/$workspaceId/projects/$projectId/milestones"
            params={{ workspaceId, projectId }}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-t-lg border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors whitespace-nowrap min-h-[44px]"
            data-ocid="milestones-tab"
          >
            <Flag className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Milestones</span>
          </Link>
          <Link
            to="/app/$workspaceId/projects/$projectId/templates"
            params={{ workspaceId, projectId }}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-t-lg border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors whitespace-nowrap min-h-[44px]"
            data-ocid="templates-tab"
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Templates</span>
          </Link>
        </div>
      </div>

      {/* View Content */}
      <div
        className={`px-4 sm:px-6 md:px-8 pt-5 pb-5 ${view === "kanban" ? "md:overflow-x-auto" : ""}`}
      >
        {view === "kanban" && (
          <>
            {/* Mobile: vertical list view */}
            <div className="md:hidden space-y-4 pb-4">
              {COLUMNS.map((col) => {
                const colTasks = tasksWithStatus.filter(
                  (t) => t.status === col.status,
                );
                if (colTasks.length === 0) return null;
                return (
                  <div key={col.status}>
                    <div
                      className={`flex items-center gap-1.5 font-semibold text-sm mb-2 ${col.color}`}
                    >
                      {col.icon} {col.label}
                      <span className="ml-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full font-normal">
                        {colTasks.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {colTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          projectId={projectId}
                          workspaceId={workspaceId}
                          members={members}
                          subtaskCounts={subtaskCounts}
                          onDragStart={handleDragStart}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
              {tasksWithStatus.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl border border-dashed border-border">
                  <p className="text-sm text-muted-foreground">No tasks yet</p>
                  <Link
                    to="/app/$workspaceId/projects/$projectId/tasks/$taskId"
                    params={{ workspaceId, projectId, taskId: "new" }}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add first task
                  </Link>
                </div>
              )}
            </div>
            {/* Desktop: kanban columns */}
            <div
              className="hidden md:flex gap-3 sm:gap-4 pb-4"
              style={{ minWidth: "max-content" }}
            >
              {COLUMNS.map((col) => (
                <KanbanColumn
                  key={col.status}
                  status={col.status}
                  label={col.label}
                  icon={col.icon}
                  color={col.color}
                  bg={col.bg}
                  border={col.border}
                  tasks={tasksWithStatus.filter((t) => t.status === col.status)}
                  projectId={projectId}
                  workspaceId={workspaceId}
                  members={members}
                  subtaskCounts={subtaskCounts}
                  isDragOver={dragOverColumn === col.status}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onDragStart={handleDragStart}
                />
              ))}
            </div>
          </>
        )}
        {view === "gantt" && (
          <GanttView tasks={tasksWithStatus} projectId={projectId} />
        )}
        {view === "timeline" && (
          <TimelineView
            tasks={tasksWithStatus}
            projectId={projectId}
            workspaceId={workspaceId}
          />
        )}
        {view === "table" && (
          <TableView
            tasks={tasksWithStatus}
            projectId={projectId}
            workspaceId={workspaceId}
          />
        )}
        {view === "workload" && (
          <WorkloadView tasks={tasksWithStatus} projectId={projectId} />
        )}
      </div>

      {/* Milestones Section */}
      {milestones.length > 0 && (
        <div className="px-4 sm:px-6 md:px-8 pb-5 border-t border-border bg-muted/10 pt-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-orange-500" />
              <h2 className="font-display text-base font-bold text-foreground">
                Milestones
              </h2>
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                {milestones.length}
              </span>
            </div>
            <Link
              to="/app/$workspaceId/projects/$projectId/milestones"
              params={{ workspaceId, projectId }}
              className="text-xs text-primary hover:underline font-medium"
              data-ocid="view-all-milestones"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {milestones.slice(0, 6).map((ms) => {
              const dueMs = Number(ms.dueDate) / 1_000_000;
              const isOverdue =
                dueMs < Date.now() && ms.status !== MilestoneStatus.reached;
              const linkedDone = tasksWithStatus.filter(
                (t) =>
                  ms.linkedTaskIds.includes(t.id) &&
                  t.status === TaskStatus.Done,
              ).length;
              const linkedTotal = ms.linkedTaskIds.length;
              const pct =
                linkedTotal > 0
                  ? Math.round((linkedDone / linkedTotal) * 100)
                  : 0;
              const statusColors: Record<MilestoneStatus, string> = {
                [MilestoneStatus.reached]:
                  "text-emerald-500 bg-emerald-500/10 border-emerald-200",
                [MilestoneStatus.upcoming]:
                  "text-blue-500 bg-blue-500/10 border-blue-200",
                [MilestoneStatus.missed]:
                  "text-destructive bg-destructive/10 border-destructive/20",
              };
              const statusLabels: Record<MilestoneStatus, string> = {
                [MilestoneStatus.reached]: "Reached",
                [MilestoneStatus.upcoming]: "Upcoming",
                [MilestoneStatus.missed]: "Missed",
              };
              return (
                <div
                  key={ms.id}
                  className="rounded-xl border border-border/50 bg-card p-4 space-y-3 hover:border-primary/30 transition-colors"
                  data-ocid={`milestone-card-${ms.id}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <Diamond className="h-3.5 w-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <p className="text-xs font-semibold text-foreground line-clamp-2">
                        {ms.title}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium border ${statusColors[ms.status] ?? statusColors[MilestoneStatus.upcoming]}`}
                    >
                      {statusLabels[ms.status] ?? "Upcoming"}
                    </span>
                  </div>
                  {linkedTotal > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>
                          {linkedDone}/{linkedTotal} tasks
                        </span>
                        <span className="font-mono font-semibold text-foreground">
                          {pct}%
                        </span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <div
                    className={`flex items-center gap-1 text-[11px] ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    <CalendarCheck className="h-3 w-3 shrink-0" />
                    <span>
                      {new Date(dueMs).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {isOverdue && (
                      <span className="font-medium">· Overdue</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Whiteboards Section */}
      <div className="px-4 sm:px-6 md:px-8 pb-8 border-t border-border bg-muted/20 pt-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-primary" />
            <h2 className="font-display text-base font-bold text-foreground">
              Whiteboards
            </h2>
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
              {whiteboards.length}
            </span>
          </div>
          <Button
            size="sm"
            className="gap-1.5 h-8 text-xs min-h-[44px]"
            onClick={() => createWbMutation.mutate()}
            disabled={createWbMutation.isPending}
            data-ocid="new-whiteboard-btn"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Whiteboard</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        {wbLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-44 rounded-2xl" />
            ))}
          </div>
        ) : whiteboards.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-10 sm:py-12 gap-3"
            data-ocid="whiteboards-empty-state"
          >
            <LayoutDashboard className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground font-medium">
              No whiteboards yet
            </p>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 h-8 text-xs min-h-[44px]"
              onClick={() => createWbMutation.mutate()}
              disabled={createWbMutation.isPending}
              data-ocid="new-whiteboard-empty-btn"
            >
              <Plus className="h-3.5 w-3.5" /> Create First Whiteboard
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {whiteboards.map((wb) => (
              <WhiteboardCard
                key={wb.id}
                wb={wb}
                projectId={projectId}
                workspaceId={workspaceId}
                onDelete={(id) => deleteWbMutation.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
