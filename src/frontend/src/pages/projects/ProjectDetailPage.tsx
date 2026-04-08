import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CalendarRange,
  CheckCircle2,
  Circle,
  Clock,
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
import { useEffect, useState } from "react";
import type { Whiteboard } from "../../backend";
import GanttView from "../../components/views/GanttView";
import TableView from "../../components/views/TableView";
import TimelineView from "../../components/views/TimelineView";
import WorkloadView from "../../components/views/WorkloadView";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import {
  type Project,
  ProjectStatus,
  type Task,
  TaskPriority,
  TaskStatus,
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
}[] = [
  {
    status: TaskStatus.Todo,
    label: "To Do",
    icon: <Circle className="h-3.5 w-3.5" />,
    color: "text-muted-foreground",
    bg: "bg-muted/40",
  },
  {
    status: TaskStatus.InProgress,
    label: "In Progress",
    icon: <Clock className="h-3.5 w-3.5" />,
    color: "text-orange-500",
    bg: "bg-orange-500/5",
  },
  {
    status: TaskStatus.Done,
    label: "Done",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    color: "text-emerald-500",
    bg: "bg-emerald-500/5",
  },
  {
    status: TaskStatus.Blocked,
    label: "Blocked",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    color: "text-destructive",
    bg: "bg-destructive/5",
  },
];

const PRIORITY_BADGE: Record<TaskPriority, string> = {
  [TaskPriority.Low]: "bg-muted text-muted-foreground border-border",
  [TaskPriority.Medium]:
    "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400",
  [TaskPriority.High]:
    "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800 dark:text-red-400",
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

function TaskCard({
  task,
  projectId,
  workspaceId,
}: { task: Task; projectId: string; workspaceId: string }) {
  const dueDateMs = task.dueDate ? Number(task.dueDate) / 1_000_000 : null;
  const isOverdue =
    dueDateMs && dueDateMs < Date.now() && task.status !== TaskStatus.Done;

  return (
    <Link
      to="/app/$workspaceId/projects/$projectId/tasks/$taskId"
      params={{ workspaceId, projectId, taskId: task.id }}
      data-ocid={`task-card-${task.id}`}
      className="block rounded-xl border border-border/50 bg-card p-3 transition-smooth hover:shadow-sm hover:border-orange-200/60 dark:hover:border-orange-800/60 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-xs font-medium text-foreground leading-snug line-clamp-2 min-w-0">
          {task.title}
        </p>
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
      {dueDateMs && (
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock
            className={`h-2.5 w-2.5 ${isOverdue ? "text-destructive" : ""}`}
          />
          <span className={isOverdue ? "text-destructive" : ""}>
            {new Date(dueDateMs).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      )}
    </Link>
  );
}

function KanbanColumn({
  status,
  label,
  icon,
  color,
  bg,
  tasks,
  projectId,
  workspaceId,
}: {
  status: TaskStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  tasks: Task[];
  projectId: string;
  workspaceId: string;
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
        className={`flex flex-col gap-2 rounded-2xl ${bg} p-2 flex-1 min-h-[200px]`}
      >
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 opacity-40">
            <p className="text-xs text-muted-foreground">No tasks</p>
          </div>
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            projectId={projectId}
            workspaceId={workspaceId}
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

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto pb-20 md:pb-0">
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
          <div className="flex items-center gap-1 shrink-0 text-xs text-muted-foreground bg-muted/50 px-2 py-1.5 rounded-lg">
            <Users className="h-3 w-3" />
            <span className="hidden sm:inline">
              {project.memberIds.length} member
              {project.memberIds.length !== 1 ? "s" : ""}
            </span>
            <span className="sm:hidden">{project.memberIds.length}</span>
          </div>
        </div>

        {/* View tabs — horizontally scrollable */}
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
        className={`px-4 sm:px-6 md:px-8 pt-5 pb-5 ${view === "kanban" ? "overflow-x-auto" : ""}`}
      >
        {view === "kanban" && (
          <div
            className="flex gap-3 sm:gap-4 pb-4"
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
                tasks={tasks.filter((t) => t.status === col.status)}
                projectId={projectId}
                workspaceId={workspaceId}
              />
            ))}
          </div>
        )}
        {view === "gantt" && <GanttView tasks={tasks} projectId={projectId} />}
        {view === "timeline" && (
          <TimelineView tasks={tasks} projectId={projectId} />
        )}
        {view === "table" && <TableView tasks={tasks} projectId={projectId} />}
        {view === "workload" && (
          <WorkloadView tasks={tasks} projectId={projectId} />
        )}
      </div>

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
