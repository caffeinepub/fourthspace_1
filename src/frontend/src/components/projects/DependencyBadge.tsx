import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Lock } from "lucide-react";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import { type TaskRelationship, TaskRelationshipType } from "../../types";

interface DependencyBadgeProps {
  taskId: string;
  projectId: string;
}

export function DependencyBadge({ taskId, projectId }: DependencyBadgeProps) {
  const { actor, isFetching } = useBackend();
  const { tenantId, activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";

  const { data: relationships = [] } = useQuery<TaskRelationship[]>({
    queryKey: ["relationships", tenantId, workspaceId, taskId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTaskRelationships(tenantId, workspaceId, taskId);
    },
    enabled: !!actor && !isFetching,
  });

  const blockers = relationships.filter(
    (r) => r.relationshipType === TaskRelationshipType.blockedBy,
  );
  const blocking = relationships.filter(
    (r) => r.relationshipType === TaskRelationshipType.blocks,
  );

  if (blockers.length === 0 && blocking.length === 0) return null;

  return (
    <div
      className="flex flex-col gap-1"
      data-ocid={`dependency-badge-${taskId}`}
    >
      {blockers.map((rel) => {
        const blockerId =
          rel.sourceTaskId === taskId ? rel.targetTaskId : rel.sourceTaskId;
        return (
          <Link
            key={rel.id}
            to="/app/$workspaceId/projects/$projectId/tasks/$taskId"
            params={{ workspaceId, projectId, taskId: blockerId }}
            className="flex items-center gap-1 text-[10px] font-medium text-orange-600 dark:text-orange-400 hover:underline"
            data-ocid={`blocked-by-${blockerId}`}
          >
            <AlertTriangle className="h-3 w-3 shrink-0" />
            <span className="truncate">
              Blocked by: {blockerId.slice(0, 8)}…
            </span>
          </Link>
        );
      })}
      {blocking.length > 0 && (
        <div
          className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground"
          data-ocid={`blocks-badge-${taskId}`}
        >
          <Lock className="h-3 w-3 shrink-0" />
          <span>
            Blocks {blocking.length} task{blocking.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
