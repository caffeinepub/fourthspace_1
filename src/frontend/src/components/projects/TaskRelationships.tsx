import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Copy, Link2, Lock, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import { type TaskRelationship, TaskRelationshipType } from "../../types";

interface TaskRelationshipsProps {
  taskId: string;
  projectId: string;
}

const REL_CONFIG: Record<
  TaskRelationshipType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  [TaskRelationshipType.blocks]: {
    label: "Blocks",
    icon: <Lock className="h-3.5 w-3.5" />,
    color: "bg-destructive/10 text-destructive border-destructive/30",
  },
  [TaskRelationshipType.blockedBy]: {
    label: "Blocked by",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    color:
      "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400",
  },
  [TaskRelationshipType.relatedTo]: {
    label: "Related to",
    icon: <Link2 className="h-3.5 w-3.5" />,
    color: "bg-primary/10 text-primary border-primary/30",
  },
  [TaskRelationshipType.duplicateOf]: {
    label: "Duplicate of",
    icon: <Copy className="h-3.5 w-3.5" />,
    color: "bg-muted text-muted-foreground border-border",
  },
};

export function TaskRelationships({
  taskId,
  projectId,
}: TaskRelationshipsProps) {
  const { actor, isFetching } = useBackend();
  const { tenantId, activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();

  const [adding, setAdding] = useState(false);
  const [relType, setRelType] = useState<TaskRelationshipType>(
    TaskRelationshipType.relatedTo,
  );
  const [targetId, setTargetId] = useState("");

  const { data: relationships = [], isLoading } = useQuery<TaskRelationship[]>({
    queryKey: ["relationships", tenantId, workspaceId, taskId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTaskRelationships(tenantId, workspaceId, taskId);
    },
    enabled: !!actor && !isFetching,
  });

  const addMutation = useMutation({
    mutationFn: async ({
      target,
      type,
    }: { target: string; type: TaskRelationshipType }) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.addTaskRelationship(
        tenantId,
        workspaceId,
        taskId,
        target,
        type,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["relationships", tenantId, workspaceId, taskId],
      });
      setTargetId("");
      setAdding(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.removeTaskRelationship(tenantId, workspaceId, id);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["relationships", tenantId, workspaceId, taskId],
      }),
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <Skeleton className="h-16 w-full rounded-xl" />;

  // Group by type
  const grouped = Object.values(TaskRelationshipType).reduce<
    Record<string, TaskRelationship[]>
  >((acc, type) => {
    acc[type] = relationships.filter((r) => r.relationshipType === type);
    return acc;
  }, {});

  return (
    <div className="space-y-3" data-ocid="task-relationships">
      {relationships.length === 0 && !adding && (
        <p className="text-xs text-muted-foreground">No relationships added.</p>
      )}

      {Object.entries(grouped).map(([type, rels]) => {
        if (rels.length === 0) return null;
        const cfg = REL_CONFIG[type as TaskRelationshipType];
        return (
          <div key={type} className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              {cfg.icon}
              {cfg.label}
            </div>
            <div className="space-y-1 pl-1">
              {rels.map((rel) => {
                const otherId =
                  rel.sourceTaskId === taskId
                    ? rel.targetTaskId
                    : rel.sourceTaskId;
                return (
                  <div key={rel.id} className="flex items-center gap-2 group">
                    <Badge
                      variant="outline"
                      className={`text-xs gap-1.5 ${cfg.color}`}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </Badge>
                    <Link
                      to="/app/$workspaceId/projects/$projectId/tasks/$taskId"
                      params={{ workspaceId, projectId, taskId: otherId }}
                      className="text-xs text-primary hover:underline truncate flex-1 min-w-0"
                      data-ocid={`rel-link-${rel.id}`}
                    >
                      {otherId}
                    </Link>
                    <button
                      type="button"
                      aria-label="Remove relationship"
                      onClick={() => removeMutation.mutate(rel.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {adding ? (
        <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
          <div className="space-y-1.5">
            <Select
              value={relType}
              onValueChange={(v) => setRelType(v as TaskRelationshipType)}
            >
              <SelectTrigger
                className="h-8 text-xs"
                data-ocid="rel-type-select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(REL_CONFIG).map(([val, cfg]) => (
                  <SelectItem key={val} value={val}>
                    <span className="flex items-center gap-1.5">
                      {cfg.icon}
                      {cfg.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Target task ID..."
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="h-8 text-xs font-mono"
              data-ocid="rel-target-input"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              className="h-7 text-xs px-3"
              disabled={!targetId.trim() || addMutation.isPending}
              onClick={() =>
                targetId.trim() &&
                addMutation.mutate({ target: targetId.trim(), type: relType })
              }
              data-ocid="rel-add-confirm-btn"
            >
              Add
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs px-2"
              onClick={() => {
                setAdding(false);
                setTargetId("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setAdding(true)}
          data-ocid="add-relationship-btn"
        >
          <Plus className="h-3.5 w-3.5" />
          Add relationship
        </Button>
      )}
    </div>
  );
}
