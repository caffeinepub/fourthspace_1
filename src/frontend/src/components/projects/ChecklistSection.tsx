import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckSquare, Plus, Square, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { ChecklistItem } from "../../types";

interface ChecklistSectionProps {
  taskId: string;
}

export function ChecklistSection({ taskId }: ChecklistSectionProps) {
  const { actor, isFetching } = useBackend();
  const { tenantId, activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");

  const { data: items = [], isLoading } = useQuery<ChecklistItem[]>({
    queryKey: ["checklist", tenantId, workspaceId, taskId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listChecklistItems(tenantId, workspaceId, taskId);
    },
    enabled: !!actor && !isFetching,
  });

  const addMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.addChecklistItem(tenantId, workspaceId, {
        content,
        order: BigInt(items.length),
        completed: false,
        taskId,
      });
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checklist", tenantId, workspaceId, taskId],
      });
      setNewText("");
      setAdding(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({
      id,
      content,
      completed,
    }: { id: string; content: string; completed: boolean }) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.updateChecklistItem(
        tenantId,
        workspaceId,
        id,
        content,
        completed,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["checklist", tenantId, workspaceId, taskId],
      }),
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.deleteChecklistItem(tenantId, workspaceId, id);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["checklist", tenantId, workspaceId, taskId],
      }),
    onError: (e: Error) => toast.error(e.message),
  });

  const doneCount = items.filter((i) => i.completed).length;

  if (isLoading) return <Skeleton className="h-20 w-full rounded-xl" />;

  return (
    <div className="space-y-2" data-ocid="checklist-section">
      {items.length > 0 && (
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${(doneCount / items.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
            {doneCount}/{items.length}
          </span>
        </div>
      )}

      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="group flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-muted/50 transition-colors"
          >
            <button
              type="button"
              aria-label={item.completed ? "Uncheck item" : "Check item"}
              onClick={() =>
                toggleMutation.mutate({
                  id: item.id,
                  content: item.content,
                  completed: !item.completed,
                })
              }
              className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
            >
              {item.completed ? (
                <CheckSquare className="h-4 w-4 text-primary" />
              ) : (
                <Square className="h-4 w-4" />
              )}
            </button>
            <span
              className={`flex-1 text-sm ${item.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
            >
              {item.content}
            </span>
            <button
              type="button"
              aria-label="Delete item"
              onClick={() => deleteMutation.mutate(item.id)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
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
            placeholder="Add item..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newText.trim())
                addMutation.mutate(newText.trim());
              if (e.key === "Escape") {
                setAdding(false);
                setNewText("");
              }
            }}
            className="h-8 text-sm"
            data-ocid="checklist-item-input"
          />
          <Button
            type="button"
            size="sm"
            className="h-8 px-3 text-xs"
            disabled={!newText.trim() || addMutation.isPending}
            onClick={() => newText.trim() && addMutation.mutate(newText.trim())}
            data-ocid="checklist-save-btn"
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
              setNewText("");
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
          className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setAdding(true)}
          data-ocid="checklist-add-btn"
        >
          <Plus className="h-3.5 w-3.5" />
          Add item
        </Button>
      )}
    </div>
  );
}
