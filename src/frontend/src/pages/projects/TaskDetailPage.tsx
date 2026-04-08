import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  FolderKanban,
  GitMerge,
  Link2,
  ListChecks,
  Loader2,
  MessageSquare,
  Save,
  Trash2,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TimeTracker } from "../../components/TimeTracker";
import { ChecklistSection } from "../../components/projects/ChecklistSection";
import { SubtaskList } from "../../components/projects/SubtaskList";
import { TaskComments } from "../../components/projects/TaskComments";
import { TaskRelationships } from "../../components/projects/TaskRelationships";
import { TaskWatchers } from "../../components/projects/TaskWatchers";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import {
  type CrossLink,
  type Sprint,
  type Task,
  type TaskInput,
  TaskPriority,
  TaskStatus,
} from "../../types";
import type { TimeEntry } from "../../types";

const PRIORITY_OPTIONS = [
  { value: TaskPriority.Low, label: "Low", color: "text-muted-foreground" },
  { value: TaskPriority.Medium, label: "Normal", color: "text-blue-500" },
  { value: TaskPriority.High, label: "High", color: "text-orange-500" },
  { value: TaskPriority.Critical, label: "Urgent", color: "text-destructive" },
];

const STATUS_OPTIONS = [
  {
    value: TaskStatus.Todo,
    label: "To Do",
    color: "text-muted-foreground",
    bg: "bg-muted text-muted-foreground border-border",
  },
  {
    value: TaskStatus.InProgress,
    label: "In Progress",
    color: "text-blue-500",
    bg: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400",
  },
  {
    value: TaskStatus.Done,
    label: "Done",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
  },
  {
    value: TaskStatus.Blocked,
    label: "Blocked",
    color: "text-destructive",
    bg: "bg-destructive/10 text-destructive border-destructive/30",
  },
];

const PRIORITY_BADGE: Record<TaskPriority, string> = {
  [TaskPriority.Low]: "bg-muted text-muted-foreground border-border",
  [TaskPriority.Medium]:
    "bg-blue-500/10 text-blue-600 border-blue-200 dark:text-blue-400",
  [TaskPriority.High]:
    "bg-orange-500/10 text-orange-600 border-orange-200 dark:text-orange-400",
  [TaskPriority.Critical]:
    "bg-destructive/10 text-destructive border-destructive/30 font-semibold",
};

function formatDateValue(ts?: bigint): string {
  if (!ts) return "";
  return new Date(Number(ts) / 1_000_000).toISOString().split("T")[0];
}

function parseDateToTimestamp(dateStr: string): bigint | undefined {
  if (!dateStr) return undefined;
  return BigInt(new Date(dateStr).getTime() * 1_000_000);
}

function formatTs(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors py-1 min-h-[44px]"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        {icon}
        {title}
      </button>
      {open && <div className="pl-1">{children}</div>}
    </div>
  );
}

const MOCK_TIME_ENTRIES: TimeEntry[] = [];

export default function TaskDetailPage() {
  const { workspaceId, projectId, taskId } = useParams({
    from: "/app/$workspaceId/projects/$projectId/tasks/$taskId",
  });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();
  const isNew = taskId === "new";

  const { data: task, isLoading } = useQuery<Task | null>({
    queryKey: ["task", tenantId, workspaceId, taskId],
    queryFn: async () => {
      if (!actor || isNew) return null;
      const r = await actor.getTask(tenantId, workspaceId, taskId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled: !!actor && !isFetching && !isNew,
  });

  const { data: sprints = [] } = useQuery<Sprint[]>({
    queryKey: ["sprints", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSprints(tenantId, workspaceId, projectId);
    },
    enabled: !!actor && !isFetching && !isNew,
  });

  const taskSprint = sprints.find((s) => s.taskIds.includes(taskId));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.Todo);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
  const [dueDate, setDueDate] = useState("");
  const [crossLinks, setCrossLinks] = useState<CrossLink[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(
    isNew ? [] : MOCK_TIME_ENTRIES,
  );

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(formatDateValue(task.dueDate));
      setCrossLinks(task.crossLinks);
      setIsDirty(false);
    }
  }, [task]);

  const saveMutation = useMutation({
    mutationFn: async (input: TaskInput) => {
      if (!actor) throw new Error("Not connected");
      if (isNew) {
        const result = await actor.createTask(tenantId, workspaceId, input);
        if (result.__kind__ === "err") throw new Error(result.err);
        return result.ok;
      }
      const result = await actor.updateTask(
        tenantId,
        workspaceId,
        taskId,
        input,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", tenantId, workspaceId, projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task", tenantId, workspaceId, taskId],
      });
      toast.success(isNew ? "Task created" : "Task saved");
      setIsDirty(false);
      if (isNew) {
        navigate({
          to: "/app/$workspaceId/projects/$projectId/tasks/$taskId",
          params: { workspaceId, projectId, taskId: saved.id },
        });
      }
    },
    onError: (err: Error) => toast.error(err.message || "Failed to save task"),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.deleteTask(tenantId, workspaceId, taskId);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", tenantId, workspaceId, projectId],
      });
      toast.success("Task deleted");
      navigate({
        to: "/app/$workspaceId/projects/$projectId",
        params: { workspaceId, projectId },
      });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to delete task"),
  });

  function handleStatusChange(v: TaskStatus) {
    setStatus(v);
    setIsDirty(true);
    if (!isNew && task) {
      saveMutation.mutate({
        title,
        description,
        projectId,
        priority,
        dueDate: parseDateToTimestamp(dueDate),
        crossLinks,
      });
    }
  }

  function handlePriorityChange(v: TaskPriority) {
    setPriority(v);
    setIsDirty(true);
  }

  function handleSave() {
    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }
    saveMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      projectId,
      priority,
      dueDate: parseDateToTimestamp(dueDate),
      crossLinks,
    });
  }

  function handleTimerStart(
    entry: Omit<TimeEntry, "id" | "createdAt" | "updatedAt">,
  ) {
    const newEntry: TimeEntry = {
      ...entry,
      id: `te-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setTimeEntries((prev) => [newEntry, ...prev]);
  }

  function handleTimerStop(entryId: string, durationSeconds: number) {
    setTimeEntries((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? {
              ...e,
              status: "stopped" as const,
              stoppedAt: Date.now(),
              durationSeconds,
              updatedAt: Date.now(),
            }
          : e,
      ),
    );
  }

  if (isLoading && !isNew) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-4 pb-20 md:pb-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  const statusCfg =
    STATUS_OPTIONS.find((o) => o.value === status) ?? STATUS_OPTIONS[0];
  const priorityLabel =
    PRIORITY_OPTIONS.find((o) => o.value === priority)?.label ?? priority;

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto pb-20 md:pb-0">
      {/* Page header */}
      <div className="px-4 sm:px-6 md:px-8 pt-3 pb-3 border-b border-border/60 bg-card/80 sticky top-0 z-10 backdrop-blur-subtle">
        <div className="flex items-center gap-2.5 max-w-5xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-9 w-9 min-h-[44px] min-w-[44px]"
            aria-label="Back to Project"
          >
            <Link
              to="/app/$workspaceId/projects/$projectId"
              params={{ workspaceId, projectId }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 shrink-0">
              <FolderKanban className="h-3.5 w-3.5 text-orange-500" />
            </div>
            <h1 className="font-display text-sm sm:text-base font-bold text-foreground truncate tracking-tight">
              {isNew ? "New Task" : title || "Task Detail"}
            </h1>
            {!isNew && (
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium border ${statusCfg.bg}`}
                >
                  {statusCfg.label}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium border ${PRIORITY_BADGE[priority]}`}
                >
                  {priorityLabel}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {!isNew && (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5 h-9 w-9 p-0 min-h-[44px] min-w-[44px]"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                data-ocid="task-delete-btn"
                aria-label="Delete task"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saveMutation.isPending || (!isNew && !isDirty)}
              className="gap-1.5 h-9 text-xs active-press min-h-[44px]"
              data-ocid="task-save-btn"
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Save className="h-3 w-3" />
              )}
              {isNew ? (
                <span className="hidden sm:inline">Create Task</span>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Content — stacked on mobile, side-by-side on lg+ */}
      <div className="px-4 sm:px-6 md:px-8 py-5 max-w-5xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* LEFT COLUMN */}
          <div className="flex-1 min-w-0 space-y-5">
            <div className="space-y-1.5">
              <Input
                id="task-title"
                placeholder="Task title..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setIsDirty(true);
                }}
                onBlur={() => {
                  if (!isNew && isDirty && title.trim()) handleSave();
                }}
                className="text-base sm:text-lg font-display font-bold border-0 border-b border-border rounded-none px-0 h-auto py-2 focus-visible:ring-0 bg-transparent"
                data-ocid="task-title-input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Description
              </Label>
              <Textarea
                id="task-desc"
                placeholder="Describe what needs to be done..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setIsDirty(true);
                }}
                onBlur={() => {
                  if (!isNew && isDirty) handleSave();
                }}
                rows={4}
                className="resize-none text-sm"
                data-ocid="task-desc-input"
              />
            </div>

            {/* Status/Priority/DueDate — stacked 1-col on tiny mobile, 3-col otherwise */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => handleStatusChange(v as TaskStatus)}
                >
                  <SelectTrigger
                    className="h-10 sm:h-8 text-xs"
                    data-ocid="task-status-select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        <span className={`text-xs ${o.color}`}>{o.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Priority
                </Label>
                <Select
                  value={priority}
                  onValueChange={(v) => handlePriorityChange(v as TaskPriority)}
                >
                  <SelectTrigger
                    className="h-10 sm:h-8 text-xs"
                    data-ocid="task-priority-select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        <span className={`text-xs ${o.color}`}>{o.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Due Date
                </Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    setIsDirty(true);
                  }}
                  className="h-10 sm:h-8 text-xs"
                  data-ocid="task-due-input"
                />
              </div>
            </div>

            {task && (
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/60">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Created{" "}
                  {formatTs(task.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Updated{" "}
                  {formatTs(task.updatedAt)}
                </span>
              </div>
            )}

            {!isNew && (
              <div className="rounded-2xl border border-border bg-card p-4">
                <CollapsibleSection
                  title="Subtasks"
                  icon={<ListChecks className="h-4 w-4 text-primary" />}
                >
                  <SubtaskList taskId={taskId} projectId={projectId} />
                </CollapsibleSection>
              </div>
            )}

            {!isNew && (
              <div className="rounded-2xl border border-border bg-card p-4">
                <CollapsibleSection
                  title="Checklist"
                  icon={<CheckSquare className="h-4 w-4 text-accent" />}
                  defaultOpen={false}
                >
                  <ChecklistSection taskId={taskId} />
                </CollapsibleSection>
              </div>
            )}

            {!isNew && (
              <div className="rounded-2xl border border-border bg-card p-4">
                <CollapsibleSection
                  title="Discussion"
                  icon={<MessageSquare className="h-4 w-4 text-secondary" />}
                >
                  <TaskComments taskId={taskId} projectId={projectId} />
                </CollapsibleSection>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR — full-width on mobile, fixed width on lg+ */}
          {!isNew && (
            <div className="w-full lg:w-72 shrink-0 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <Zap className="h-4 w-4 text-primary" /> Sprint
                </div>
                {taskSprint ? (
                  <Link
                    to="/app/$workspaceId/projects/$projectId/sprints/$sprintId"
                    params={{ workspaceId, projectId, sprintId: taskSprint.id }}
                    className="text-xs text-primary hover:underline"
                    data-ocid="task-sprint-link"
                  >
                    {taskSprint.name}
                  </Link>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Not in a sprint
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <Eye className="h-4 w-4 text-muted-foreground" /> Watchers
                </div>
                <TaskWatchers taskId={taskId} />
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <GitMerge className="h-4 w-4 text-muted-foreground" />{" "}
                  Relationships
                </div>
                <TaskRelationships taskId={taskId} projectId={projectId} />
              </div>

              <TimeTracker
                taskId={taskId}
                projectId={projectId}
                entries={timeEntries}
                onStart={handleTimerStart}
                onStop={handleTimerStop}
              />

              {crossLinks.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Link2 className="h-4 w-4 text-orange-500" /> Cross-Links
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {crossLinks.map((link) => (
                      <Badge
                        key={`${link.entityId}-${link.linkLabel}`}
                        variant="outline"
                        className="text-xs gap-1.5"
                      >
                        <span className="text-muted-foreground capitalize">
                          {link.entityType}
                        </span>
                        <span className="text-foreground">
                          {link.linkLabel}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* New task save button at bottom for mobile */}
        {isNew && (
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60 mt-4">
            <Button variant="ghost" asChild data-ocid="task-cancel-btn">
              <Link
                to="/app/$workspaceId/projects/$projectId"
                params={{ workspaceId, projectId }}
              >
                Cancel
              </Link>
            </Button>
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              data-ocid="task-create-btn"
            >
              {saveMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Create Task
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
