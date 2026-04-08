import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import { type Subtask, TaskPriority, TaskStatus } from "../../types";

interface SubtaskListProps {
  taskId: string;
  projectId: string;
}

export function SubtaskList({ taskId, projectId }: SubtaskListProps) {
  const { actor, isFetching } = useBackend();
  const { tenantId, activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const { data: subtasks = [], isLoading } = useQuery<Subtask[]>({
    queryKey: ["subtasks", tenantId, workspaceId, taskId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSubtasks(tenantId, workspaceId, taskId);
    },
    enabled: !!actor && !isFetching,
  });

  const createMutation = useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.createSubtask(tenantId, workspaceId, {
        title,
        description: "",
        projectId,
        parentTaskId: taskId,
        priority: TaskPriority.Medium,
        status: TaskStatus.Todo,
        order: BigInt(subtasks.length),
      });
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subtasks", tenantId, workspaceId, taskId],
      });
      setNewTitle("");
      setAdding(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({
      id,
      title,
      done,
    }: { id: string; title: string; done: boolean }) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.updateSubtask(
        tenantId,
        workspaceId,
        id,
        title,
        done ? TaskStatus.Done : TaskStatus.Todo,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["subtasks", tenantId, workspaceId, taskId],
      }),
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.deleteSubtask(tenantId, workspaceId, id);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["subtasks", tenantId, workspaceId, taskId],
      }),
    onError: (e: Error) => toast.error(e.message),
  });

  const doneCount = subtasks.filter((s) => s.status === TaskStatus.Done).length;

  if (isLoading) return <Skeleton className="h-16 w-full rounded-xl" />;

  return (
    <div className="space-y-2" data-ocid="subtask-list">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted-foreground">
          {subtasks.length > 0
            ? `${doneCount}/${subtasks.length} completed`
            : "No subtasks"}
        </span>
        {subtasks.length > 0 && (
          <div className="flex-1 mx-3 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{
                width:
                  subtasks.length > 0
                    ? `${(doneCount / subtasks.length) * 100}%`
                    : "0%",
              }}
            />
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        {subtasks.map((sub) => (
          <div
            key={sub.id}
            className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted/50 transition-colors"
          >
            <button
              type="button"
              aria-label={
                sub.status === TaskStatus.Done
                  ? "Mark incomplete"
                  : "Mark complete"
              }
              onClick={() =>
                toggleMutation.mutate({
                  id: sub.id,
                  title: sub.title,
                  done: sub.status !== TaskStatus.Done,
                })
              }
              className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
            >
              {sub.status === TaskStatus.Done ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
            </button>
            <span
              className={`flex-1 text-sm min-w-0 truncate ${sub.status === TaskStatus.Done ? "line-through text-muted-foreground" : "text-foreground"}`}
            >
              {sub.title}
            </span>
            <button
              type="button"
              aria-label="Delete subtask"
              onClick={() => deleteMutation.mutate(sub.id)}
              className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {adding ? (
        <div className="flex items-center gap-2 mt-2">
          <Input
            autoFocus
            placeholder="Subtask title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newTitle.trim())
                createMutation.mutate(newTitle.trim());
              if (e.key === "Escape") {
                setAdding(false);
                setNewTitle("");
              }
            }}
            className="h-8 text-sm"
            data-ocid="subtask-new-input"
          />
          <Button
            type="button"
            size="sm"
            className="h-8 px-3 text-xs"
            disabled={!newTitle.trim() || createMutation.isPending}
            onClick={() =>
              newTitle.trim() && createMutation.mutate(newTitle.trim())
            }
            data-ocid="subtask-save-btn"
          >
            Add
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => {
              setAdding(false);
              setNewTitle("");
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground mt-1"
          onClick={() => setAdding(true)}
          data-ocid="subtask-add-btn"
        >
          <Plus className="h-3.5 w-3.5" />
          Add subtask
        </Button>
      )}
    </div>
  );
}
