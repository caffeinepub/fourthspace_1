import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  FolderKanban,
  Plus,
  Users,
} from "lucide-react";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import {
  type Project,
  ProjectStatus,
  type Task,
  TaskPriority,
  TaskStatus,
} from "../../types";

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
}: {
  task: Task;
  projectId: string;
}) {
  const dueDateMs = task.dueDate ? Number(task.dueDate) / 1_000_000 : null;
  const isOverdue =
    dueDateMs && dueDateMs < Date.now() && task.status !== TaskStatus.Done;

  return (
    <Link
      to="/app/projects/$projectId/tasks/$taskId"
      params={{ projectId, taskId: task.id }}
      data-ocid={`task-card-${task.id}`}
      className="block rounded-xl border border-border bg-card p-3.5 transition-smooth hover:shadow-sm hover:border-orange-200 dark:hover:border-orange-800 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-foreground leading-snug line-clamp-2 min-w-0">
          {task.title}
        </p>
        <Badge
          variant="outline"
          className={`shrink-0 text-[10px] px-1.5 py-0 ${PRIORITY_BADGE[task.priority]}`}
        >
          {task.priority}
        </Badge>
      </div>
      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
          {task.description}
        </p>
      )}
      {dueDateMs && (
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className={`h-3 w-3 ${isOverdue ? "text-destructive" : ""}`} />
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
}: {
  status: TaskStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  tasks: Task[];
  projectId: string;
}) {
  return (
    <div className="flex flex-col min-w-[260px] max-w-[320px] flex-1">
      <div className="flex items-center justify-between mb-3 px-1">
        <div
          className={`flex items-center gap-1.5 font-semibold text-sm ${color}`}
        >
          {icon}
          {label}
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
            to="/app/projects/$projectId/tasks/$taskId"
            params={{ projectId, taskId: "new" }}
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
          <TaskCard key={task.id} task={task} projectId={projectId} />
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-1.5 text-muted-foreground text-xs h-8 hover:text-foreground mt-auto"
          asChild
          data-ocid={`add-task-btn-${status}`}
        >
          <Link
            to="/app/projects/$projectId/tasks/$taskId"
            params={{ projectId, taskId: "new" }}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Task
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const { projectId } = useParams({ from: "/app/projects/$projectId" });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();

  const { data: project, isLoading: projectLoading } = useQuery<Project | null>(
    {
      queryKey: ["project", tenantId, projectId],
      queryFn: async () => {
        if (!actor) return null;
        const r = await actor.getProject(tenantId, projectId);
        return r.__kind__ === "ok" ? r.ok : null;
      },
      enabled: !!actor && !isFetching && !!projectId,
    },
  );

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["tasks", tenantId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTasks(tenantId, projectId);
    },
    enabled: !!actor && !isFetching && !!projectId,
  });

  if (projectLoading || tasksLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-7 w-56" />
        </div>
        <div className="flex gap-4 pt-4">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-64 w-64 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Project not found.</p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => navigate({ to: "/app/projects" })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    );
  }

  const statusBadge = PROJECT_STATUS_BADGE[project.status];

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Project Header */}
      <div className="px-6 md:px-8 pt-5 pb-4 border-b border-border bg-card/60">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/app/projects" })}
            aria-label="Back to Projects"
            className="shrink-0 mt-0.5"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                <FolderKanban className="h-4 w-4 text-orange-500" />
              </div>
              <h1 className="font-display text-xl font-bold text-foreground truncate">
                {project.name}
              </h1>
              <Badge
                variant="outline"
                className={`text-xs ${statusBadge.className}`}
              >
                {statusBadge.label}
              </Badge>
            </div>
            {project.description && (
              <p className="text-sm text-muted-foreground ml-10 line-clamp-1">
                {project.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1.5 rounded-lg">
            <Users className="h-3.5 w-3.5" />
            {project.memberIds.length} member
            {project.memberIds.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6 md:p-8">
        <div className="flex gap-4 min-w-fit pb-4 h-full">
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}
