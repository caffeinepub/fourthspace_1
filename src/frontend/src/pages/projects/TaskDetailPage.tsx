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
  Clock,
  FolderKanban,
  Link2,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import {
  type CrossLink,
  type Task,
  type TaskInput,
  TaskPriority,
  TaskStatus,
} from "../../types";

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: TaskPriority.Low, label: "Low" },
  { value: TaskPriority.Medium, label: "Medium" },
  { value: TaskPriority.High, label: "High" },
  { value: TaskPriority.Critical, label: "Critical" },
];

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: TaskStatus.Todo, label: "To Do" },
  { value: TaskStatus.InProgress, label: "In Progress" },
  { value: TaskStatus.Done, label: "Done" },
  { value: TaskStatus.Blocked, label: "Blocked" },
];

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  [TaskPriority.Low]: "bg-muted text-muted-foreground border-border",
  [TaskPriority.Medium]:
    "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400",
  [TaskPriority.High]:
    "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800 dark:text-red-400",
  [TaskPriority.Critical]:
    "bg-red-600/20 text-red-700 border-red-300 font-semibold",
};

const STATUS_COLOR: Record<TaskStatus, string> = {
  [TaskStatus.Todo]: "bg-muted text-muted-foreground border-border",
  [TaskStatus.InProgress]: "bg-orange-500/10 text-orange-600 border-orange-200",
  [TaskStatus.Done]: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  [TaskStatus.Blocked]:
    "bg-destructive/10 text-destructive border-destructive/30",
};

function formatDateValue(ts?: bigint): string {
  if (!ts) return "";
  return new Date(Number(ts) / 1_000_000).toISOString().split("T")[0];
}

function parseDateToTimestamp(dateStr: string): bigint | undefined {
  if (!dateStr) return undefined;
  return BigInt(new Date(dateStr).getTime() * 1_000_000);
}

export default function TaskDetailPage() {
  const { projectId, taskId } = useParams({
    from: "/app/projects/$projectId/tasks/$taskId",
  });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();
  const isNew = taskId === "new";

  const { data: task, isLoading } = useQuery<Task | null>({
    queryKey: ["task", tenantId, taskId],
    queryFn: async () => {
      if (!actor || isNew) return null;
      const r = await actor.getTask(tenantId, taskId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled: !!actor && !isFetching && !isNew,
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.Todo);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
  const [dueDate, setDueDate] = useState("");
  const [crossLinks, setCrossLinks] = useState<CrossLink[]>([]);
  const [isDirty, setIsDirty] = useState(false);

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
        const result = await actor.createTask(tenantId, input);
        if (result.__kind__ === "err") throw new Error(result.err);
        return result.ok;
      }
      const result = await actor.updateTask(tenantId, taskId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", tenantId, projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["task", tenantId, taskId] });
      toast.success(isNew ? "Task created" : "Task saved");
      setIsDirty(false);
      if (isNew) {
        navigate({
          to: "/app/projects/$projectId/tasks/$taskId",
          params: { projectId, taskId: saved.id },
        });
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to save task");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.deleteTask(tenantId, taskId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", tenantId, projectId],
      });
      toast.success("Task deleted");
      navigate({ to: "/app/projects/$projectId", params: { projectId } });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete task");
    },
  });

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

  if (isLoading && !isNew) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-7 w-48" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          asChild
          aria-label="Back to Project"
        >
          <Link to="/app/projects/$projectId" params={{ projectId }}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
            <FolderKanban className="h-4 w-4 text-orange-500" />
          </div>
          <h1 className="font-display text-xl font-bold text-foreground truncate">
            {isNew ? "New Task" : title || "Task Detail"}
          </h1>
          {!isNew && task && (
            <div className="flex items-center gap-2 shrink-0">
              <Badge
                variant="outline"
                className={`text-xs ${STATUS_COLOR[status]}`}
              >
                {STATUS_OPTIONS.find((o) => o.value === status)?.label}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs ${PRIORITY_COLOR[priority]}`}
              >
                {priority}
              </Badge>
            </div>
          )}
        </div>
        {!isNew && (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5 shrink-0"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            data-ocid="task-delete-btn"
            aria-label="Delete task"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Form */}
      <div
        className="rounded-2xl border border-border bg-card p-6 space-y-5"
        data-ocid="task-detail-form"
      >
        <div className="space-y-1.5">
          <Label htmlFor="task-title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="task-title"
            placeholder="e.g. Design homepage wireframes"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setIsDirty(true);
            }}
            data-ocid="task-title-input"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="task-desc">Description</Label>
          <Textarea
            id="task-desc"
            placeholder="Describe what needs to be done..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setIsDirty(true);
            }}
            rows={4}
            className="resize-none"
            data-ocid="task-desc-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-status">Status</Label>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v as TaskStatus);
                setIsDirty(true);
              }}
            >
              <SelectTrigger id="task-status" data-ocid="task-status-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="task-priority">Priority</Label>
            <Select
              value={priority}
              onValueChange={(v) => {
                setPriority(v as TaskPriority);
                setIsDirty(true);
              }}
            >
              <SelectTrigger
                id="task-priority"
                data-ocid="task-priority-select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="task-due" className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            Due Date
          </Label>
          <Input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              setIsDirty(true);
            }}
            data-ocid="task-due-input"
          />
        </div>

        {task && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/60">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Created{" "}
              {new Date(Number(task.createdAt) / 1_000_000).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              )}
            </span>
            <span className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Updated{" "}
              {new Date(Number(task.updatedAt) / 1_000_000).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              )}
            </span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/60">
          <Button variant="ghost" asChild data-ocid="task-cancel-btn">
            <Link to="/app/projects/$projectId" params={{ projectId }}>
              Cancel
            </Link>
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending || (!isNew && !isDirty)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            data-ocid="task-save-btn"
          >
            {saveMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isNew ? "Create Task" : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Cross-Links */}
      {crossLinks.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Link2 className="h-4 w-4 text-orange-500" />
            Cross-Links
          </h3>
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
                <span className="text-foreground">{link.linkLabel}</span>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
