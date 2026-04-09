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
  Trash2,
  User,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
  type TimeEntryLocal,
  type WorkspaceMember,
} from "../../types";

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIORITY_OPTIONS: {
  value: TaskPriority;
  label: string;
  color: string;
  badge: string;
}[] = [
  {
    value: TaskPriority.Low,
    label: "Low",
    color: "text-muted-foreground",
    badge: "bg-muted text-muted-foreground border-border",
  },
  {
    value: TaskPriority.Medium,
    label: "Normal",
    color: "text-blue-500",
    badge:
      "bg-blue-500/10 text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-800",
  },
  {
    value: TaskPriority.High,
    label: "High",
    color: "text-orange-500",
    badge:
      "bg-orange-500/10 text-orange-600 border-orange-200 dark:text-orange-400 dark:border-orange-800",
  },
  {
    value: TaskPriority.Critical,
    label: "Urgent",
    color: "text-destructive",
    badge:
      "bg-destructive/10 text-destructive border-destructive/30 font-semibold",
  },
];

const STATUS_OPTIONS: {
  value: TaskStatus;
  label: string;
  color: string;
  bg: string;
}[] = [
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function getInitials(member: WorkspaceMember | undefined): string {
  if (!member?.displayName) return "?";
  return member.displayName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Collapsible section ──────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

const MOCK_TIME_ENTRIES: TimeEntryLocal[] = [];

export default function TaskDetailPage() {
  const { workspaceId, projectId, taskId } = useParams({
    from: "/app/$workspaceId/projects/$projectId/tasks/$taskId",
  });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();
  const isNew = taskId === "new";

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const { data: members = [] } = useQuery<WorkspaceMember[]>({
    queryKey: ["members", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaceMembers(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !isNew,
  });

  const taskSprint = sprints.find((s) => s.taskIds.includes(taskId));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.Todo);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState<string>("none");
  const [crossLinks, setCrossLinks] = useState<CrossLink[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [timeEntries, setTimeEntries] = useState<TimeEntryLocal[]>(
    isNew ? [] : MOCK_TIME_ENTRIES,
  );

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(formatDateValue(task.dueDate));
      setAssigneeId(task.assigneeId ? task.assigneeId.toString() : "none");
      setCrossLinks(task.crossLinks);
      setIsDirty(false);
    }
  }, [task]);

  // ─── Mutations ──────────────────────────────────────────────────────────────

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
      setIsDirty(false);
      if (isNew) {
        toast.success("Task created");
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

  // ─── Save helpers ──────────────────────────────────────────────────────────

  const buildInput = useCallback(
    (overrides?: Partial<TaskInput>): TaskInput => {
      const resolvedAssignee =
        assigneeId && assigneeId !== "none"
          ? (members.find((m) => m.userId.toString() === assigneeId)?.userId ??
            undefined)
          : undefined;
      return {
        title: title.trim() || "Untitled",
        description: description.trim(),
        projectId,
        priority,
        dueDate: parseDateToTimestamp(dueDate),
        crossLinks,
        assigneeId: resolvedAssignee,
        ...overrides,
      };
    },
    [
      title,
      description,
      projectId,
      priority,
      dueDate,
      crossLinks,
      assigneeId,
      members,
    ],
  );

  function triggerSave(overrides?: Partial<TaskInput>) {
    if (!isNew) {
      saveMutation.mutate(buildInput(overrides));
    }
  }

  // Debounced auto-save for text fields
  function scheduleSave(overrides?: Partial<TaskInput>) {
    if (isNew) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveMutation.mutate(buildInput(overrides));
    }, 500);
  }

  function handleSave() {
    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveMutation.mutate(buildInput());
  }

  // ─── Status mutation (dedicated endpoint) ─────────────────────────────────

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: TaskStatus) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updateTaskStatus(
        tenantId,
        workspaceId,
        taskId,
        newStatus,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", tenantId, workspaceId, projectId],
      });
      queryClient.setQueryData(
        ["task", tenantId, workspaceId, taskId],
        updated,
      );
    },
    onError: (err: Error) => {
      // Revert optimistic update on failure
      setStatus(task?.status ?? TaskStatus.Todo);
      toast.error(err.message || "Failed to update status");
    },
  });

  // ─── Field change handlers ─────────────────────────────────────────────────

  function handleStatusChange(v: TaskStatus) {
    setStatus(v); // optimistic update
    setIsDirty(true);
    if (!isNew) {
      updateStatusMutation.mutate(v);
      toast.success(
        `Status set to ${STATUS_OPTIONS.find((o) => o.value === v)?.label ?? v}`,
      );
    }
  }

  function handlePriorityChange(v: TaskPriority) {
    setPriority(v);
    setIsDirty(true);
    if (!isNew) {
      // Immediate save for dropdown changes
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveMutation.mutate(buildInput({ priority: v }));
    }
  }

  function handleAssigneeChange(v: string) {
    setAssigneeId(v);
    setIsDirty(true);
    if (!isNew) {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      const resolvedAssignee =
        v !== "none"
          ? (members.find((m) => m.userId.toString() === v)?.userId ??
            undefined)
          : undefined;
      saveMutation.mutate(buildInput({ assigneeId: resolvedAssignee }));
    }
  }

  function handleDueDateChange(v: string) {
    setDueDate(v);
    setIsDirty(true);
    if (!isNew) {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveMutation.mutate(buildInput({ dueDate: parseDateToTimestamp(v) }));
    }
  }

  function handleTimerStart(
    entry: Omit<TimeEntryLocal, "id" | "createdAt" | "updatedAt">,
  ) {
    const newEntry: TimeEntryLocal = {
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

  // ─── Derived state ─────────────────────────────────────────────────────────

  const dueDateMs = dueDate ? new Date(dueDate).getTime() : null;
  const isOverdue =
    dueDateMs && dueDateMs < Date.now() && status !== TaskStatus.Done;

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
  const priorityCfg =
    PRIORITY_OPTIONS.find((o) => o.value === priority) ?? PRIORITY_OPTIONS[1];
  const assignee =
    assigneeId !== "none"
      ? members.find((m) => m.userId.toString() === assigneeId)
      : undefined;

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
                  className={`rounded-full px-2 py-0.5 text-xs font-medium border ${priorityCfg.badge}`}
                >
                  {priorityCfg.label}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {saveMutation.isPending && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving…
              </span>
            )}
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
            {isNew && (
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="gap-1.5 h-9 text-xs active-press min-h-[44px]"
                data-ocid="task-create-btn"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : null}
                Create Task
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 md:px-8 py-5 max-w-5xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* LEFT COLUMN */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Input
                id="task-title"
                placeholder="Task title..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setIsDirty(true);
                  scheduleSave({ title: e.target.value.trim() || "Untitled" });
                }}
                onBlur={() => {
                  if (!isNew && isDirty && title.trim()) {
                    if (saveTimerRef.current)
                      clearTimeout(saveTimerRef.current);
                    triggerSave();
                  }
                }}
                className="text-base sm:text-lg font-display font-bold border-0 border-b border-border rounded-none px-0 h-auto py-2 focus-visible:ring-0 bg-transparent"
                data-ocid="task-title-input"
              />
            </div>

            {/* Description */}
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
                  scheduleSave({ description: e.target.value.trim() });
                }}
                onBlur={() => {
                  if (!isNew && isDirty) {
                    if (saveTimerRef.current)
                      clearTimeout(saveTimerRef.current);
                    triggerSave();
                  }
                }}
                rows={4}
                className="resize-none text-sm"
                data-ocid="task-desc-input"
              />
            </div>

            {/* Status / Priority / Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Status */}
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

              {/* Priority */}
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
                    <SelectValue>
                      <span className={`text-xs ${priorityCfg.color}`}>
                        {priorityCfg.label}
                      </span>
                    </SelectValue>
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

              {/* Due Date */}
              <div className="space-y-1.5">
                <Label
                  className={`text-xs flex items-center gap-1 ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}
                >
                  <Calendar className="h-3 w-3" />
                  {isOverdue ? "Overdue" : "Due Date"}
                </Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => handleDueDateChange(e.target.value)}
                  className={`h-10 sm:h-8 text-xs ${isOverdue ? "text-destructive border-destructive/50" : ""}`}
                  data-ocid="task-due-input"
                />
              </div>
            </div>

            {/* Assignee */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" /> Assignee
              </Label>
              <Select value={assigneeId} onValueChange={handleAssigneeChange}>
                <SelectTrigger
                  className="h-10 sm:h-8 text-xs"
                  data-ocid="task-assignee-select"
                >
                  <SelectValue placeholder="Unassigned">
                    {assignee ? (
                      <span className="flex items-center gap-1.5">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[9px] font-bold text-primary">
                          {(() => {
                            const name = assignee.displayName;
                            return name
                              .split(" ")
                              .map((p) => p[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2);
                          })()}
                        </span>
                        {assignee.displayName}
                      </span>
                    ) : (
                      "Unassigned"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-xs text-muted-foreground">
                      Unassigned
                    </span>
                  </SelectItem>
                  {members.map((m) => (
                    <SelectItem
                      key={m.userId.toString()}
                      value={m.userId.toString()}
                    >
                      <span className="flex items-center gap-1.5 text-xs">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[9px] font-bold text-primary shrink-0">
                          {getInitials(m)}
                        </span>
                        {m.displayName}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Meta */}
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

            {/* Subtasks */}
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

            {/* Checklist */}
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

            {/* Discussion */}
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

          {/* RIGHT SIDEBAR */}
          {!isNew && (
            <div className="w-full lg:w-72 shrink-0 space-y-4">
              {/* Sprint */}
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

              {/* Watchers */}
              <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <Eye className="h-4 w-4 text-muted-foreground" /> Watchers
                </div>
                <TaskWatchers taskId={taskId} />
              </div>

              {/* Relationships */}
              <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <GitMerge className="h-4 w-4 text-muted-foreground" />{" "}
                  Relationships
                </div>
                <TaskRelationships taskId={taskId} projectId={projectId} />
              </div>

              {/* Time Tracker */}
              <TimeTracker
                taskId={taskId}
                projectId={projectId}
                entries={timeEntries}
                onStart={handleTimerStart}
                onStop={handleTimerStop}
              />

              {/* Cross-links */}
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

        {/* New task bottom bar */}
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
              data-ocid="task-create-submit-btn"
            >
              {saveMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Create Task
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
