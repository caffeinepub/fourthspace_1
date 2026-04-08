import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  Minus,
  Plus,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import { type Sprint, SprintStatus, type Task, TaskStatus } from "../../types";

const COLUMNS: {
  status: TaskStatus;
  label: string;
  color: string;
  bg: string;
  icon: React.ReactNode;
}[] = [
  {
    status: TaskStatus.Todo,
    label: "To Do",
    color: "text-muted-foreground",
    bg: "bg-muted/40",
    icon: <Circle className="h-3.5 w-3.5" />,
  },
  {
    status: TaskStatus.InProgress,
    label: "In Progress",
    color: "text-blue-500",
    bg: "bg-blue-500/5",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  {
    status: TaskStatus.Done,
    label: "Done",
    color: "text-emerald-500",
    bg: "bg-emerald-500/5",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  {
    status: TaskStatus.Blocked,
    label: "Blocked",
    color: "text-destructive",
    bg: "bg-destructive/5",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
  },
];

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SprintDetailPage() {
  const { workspaceId, projectId, sprintId } = useParams({
    from: "/app/$workspaceId/projects/$projectId/sprints/$sprintId",
  });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();
  const [showAddPanel, setShowAddPanel] = useState(false);

  const { data: sprint, isLoading: sprintLoading } = useQuery<Sprint | null>({
    queryKey: ["sprint", tenantId, workspaceId, sprintId],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getSprint(tenantId, workspaceId, sprintId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled: !!actor && !isFetching,
  });

  const { data: allTasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["tasks", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTasks(tenantId, workspaceId, projectId);
    },
    enabled: !!actor && !isFetching,
  });

  const sprintTaskIds = new Set(sprint?.taskIds ?? []);
  const sprintTasks = allTasks.filter((t) => sprintTaskIds.has(t.id));
  const backlog = allTasks.filter((t) => !sprintTaskIds.has(t.id));
  const doneTasks = sprintTasks.filter(
    (t) => t.status === TaskStatus.Done,
  ).length;

  const addTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.addTaskToSprint(
        tenantId,
        workspaceId,
        sprintId,
        taskId,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sprint", tenantId, workspaceId, sprintId],
      });
      toast.success("Task added to sprint");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.removeTaskFromSprint(
        tenantId,
        workspaceId,
        sprintId,
        taskId,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["sprint", tenantId, workspaceId, sprintId],
      }),
    onError: (e: Error) => toast.error(e.message),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: SprintStatus) => {
      if (!actor || !sprint) throw new Error("Not connected");
      const r = await actor.updateSprint(
        tenantId,
        workspaceId,
        sprintId,
        sprint.name,
        sprint.goal,
        status,
        sprint.taskIds,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: (s) => {
      queryClient.setQueryData(["sprint", tenantId, workspaceId, sprintId], s);
      toast.success(
        `Sprint ${s.status === SprintStatus.active ? "started" : "completed"}`,
      );
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (sprintLoading || tasksLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-48 w-56 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!sprint) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Sprint not found.</p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() =>
            navigate({
              to: "/app/$workspaceId/projects/$projectId/sprints",
              params: { workspaceId, projectId },
            })
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sprints
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      {/* Header */}
      <div className="px-6 md:px-8 pt-4 pb-4 border-b border-border/60 bg-card/80 sticky top-0 z-10 backdrop-blur-subtle">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 mt-0.5"
            onClick={() =>
              navigate({
                to: "/app/$workspaceId/projects/$projectId/sprints",
                params: { workspaceId, projectId },
              })
            }
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-xl font-bold text-foreground">
                {sprint.name}
              </h1>
              <Badge
                variant="outline"
                className={
                  sprint.status === SprintStatus.active
                    ? "bg-primary/10 text-primary border-primary/30 gap-1"
                    : sprint.status === SprintStatus.completed
                      ? "bg-emerald-500/10 text-emerald-700 border-emerald-200 gap-1"
                      : "bg-muted text-muted-foreground border-border gap-1"
                }
              >
                {sprint.status === SprintStatus.active ? (
                  <Zap className="h-3 w-3" />
                ) : sprint.status === SprintStatus.completed ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
                {sprint.status === SprintStatus.active
                  ? "Active"
                  : sprint.status === SprintStatus.completed
                    ? "Completed"
                    : "Planned"}
              </Badge>
            </div>
            {sprint.goal && (
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {sprint.goal}
              </p>
            )}
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(sprint.startDate)} – {formatDate(sprint.endDate)}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                {doneTasks}/{sprintTasks.length} done
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {sprint.status === SprintStatus.planned && (
              <Button
                size="sm"
                className="gap-1.5 h-8 text-xs bg-primary"
                onClick={() => updateStatusMutation.mutate(SprintStatus.active)}
                disabled={updateStatusMutation.isPending}
                data-ocid="start-sprint-btn"
              >
                {updateStatusMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Zap className="h-3.5 w-3.5" />
                )}
                Start Sprint
              </Button>
            )}
            {sprint.status === SprintStatus.active && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 h-8 text-xs"
                onClick={() =>
                  updateStatusMutation.mutate(SprintStatus.completed)
                }
                disabled={updateStatusMutation.isPending}
                data-ocid="complete-sprint-btn"
              >
                {updateStatusMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                )}
                Complete Sprint
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 h-8 text-xs"
              onClick={() => setShowAddPanel((v) => !v)}
              data-ocid="add-tasks-btn"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Tasks
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-8 py-6 flex gap-6">
        {/* Board */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 min-w-fit pb-4">
            {COLUMNS.map((col) => {
              const colTasks = sprintTasks.filter(
                (t) => t.status === col.status,
              );
              return (
                <div
                  key={col.status}
                  className="flex flex-col min-w-[240px] max-w-[300px] flex-1"
                >
                  <div
                    className={`flex items-center gap-1.5 font-semibold text-sm mb-3 ${col.color}`}
                  >
                    {col.icon} {col.label}
                    <span className="ml-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full font-normal">
                      {colTasks.length}
                    </span>
                  </div>
                  <div
                    className={`flex flex-col gap-2 rounded-2xl ${col.bg} p-2 flex-1 min-h-[160px]`}
                  >
                    {colTasks.length === 0 && (
                      <div className="flex items-center justify-center py-8 opacity-40">
                        <p className="text-xs text-muted-foreground">
                          No tasks
                        </p>
                      </div>
                    )}
                    {colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="group relative rounded-xl border border-border bg-card p-3 transition-smooth hover:shadow-sm"
                      >
                        <Link
                          to="/app/$workspaceId/projects/$projectId/tasks/$taskId"
                          params={{ workspaceId, projectId, taskId: task.id }}
                          className="block text-sm font-medium text-foreground leading-snug line-clamp-2 hover:text-primary transition-colors"
                          data-ocid={`sprint-task-${task.id}`}
                        >
                          {task.title}
                        </Link>
                        <button
                          type="button"
                          aria-label="Remove from sprint"
                          onClick={() => removeTaskMutation.mutate(task.id)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                          data-ocid={`remove-sprint-task-${task.id}`}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add panel */}
        {showAddPanel && (
          <div
            className="w-72 shrink-0 space-y-3 rounded-2xl border border-border bg-card p-4"
            data-ocid="add-tasks-panel"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-foreground">
                Backlog
              </h3>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowAddPanel(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <AlertCircle className="h-4 w-4" />
              </button>
            </div>
            {backlog.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                All tasks are in sprints.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
                {backlog.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted/50 transition-colors"
                  >
                    <p className="flex-1 text-xs text-foreground truncate">
                      {task.title}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 text-muted-foreground hover:text-primary"
                      onClick={() => addTaskMutation.mutate(task.id)}
                      aria-label="Add to sprint"
                      data-ocid={`add-to-sprint-${task.id}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
