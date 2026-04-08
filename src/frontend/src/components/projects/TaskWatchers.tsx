import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, Eye, X } from "lucide-react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { TaskWatcher } from "../../types";

interface TaskWatchersProps {
  taskId: string;
}

export function TaskWatchers({ taskId }: TaskWatchersProps) {
  const { actor, isFetching } = useBackend();
  const { tenantId, activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  const myPrincipal = identity?.getPrincipal();

  const { data: watchers = [], isLoading } = useQuery<TaskWatcher[]>({
    queryKey: ["watchers", tenantId, workspaceId, taskId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTaskWatchers(tenantId, workspaceId, taskId);
    },
    enabled: !!actor && !isFetching,
  });

  const { data: isWatching = false } = useQuery<boolean>({
    queryKey: [
      "isWatching",
      tenantId,
      workspaceId,
      taskId,
      myPrincipal?.toText(),
    ],
    queryFn: async () => {
      if (!actor || !myPrincipal) return false;
      return actor.isWatching(tenantId, workspaceId, taskId, myPrincipal);
    },
    enabled: !!actor && !isFetching && !!myPrincipal,
  });

  const watchMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !myPrincipal) throw new Error("Not connected");
      const r = await actor.addTaskWatcher(
        tenantId,
        workspaceId,
        taskId,
        myPrincipal,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["watchers", tenantId, workspaceId, taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["isWatching", tenantId, workspaceId, taskId],
      });
      toast.success("Watching this task");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const unwatchMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !myPrincipal) throw new Error("Not connected");
      const r = await actor.removeTaskWatcher(
        tenantId,
        workspaceId,
        taskId,
        myPrincipal,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["watchers", tenantId, workspaceId, taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["isWatching", tenantId, workspaceId, taskId],
      });
      toast.success("Stopped watching");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeMutation = useMutation({
    mutationFn: async (userId: import("../../types").UserId) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.removeTaskWatcher(
        tenantId,
        workspaceId,
        taskId,
        userId,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["watchers", tenantId, workspaceId, taskId],
      }),
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <Skeleton className="h-16 w-full rounded-xl" />;

  return (
    <div className="space-y-2.5" data-ocid="task-watchers">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Eye className="h-3.5 w-3.5" />
          <span>{watchers.length} watching</span>
        </div>
        <Button
          type="button"
          variant={isWatching ? "outline" : "secondary"}
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={() =>
            isWatching ? unwatchMutation.mutate() : watchMutation.mutate()
          }
          disabled={watchMutation.isPending || unwatchMutation.isPending}
          data-ocid="watch-toggle-btn"
        >
          {isWatching ? (
            <>
              <BellOff className="h-3.5 w-3.5" />
              Unwatch
            </>
          ) : (
            <>
              <Bell className="h-3.5 w-3.5" />
              Watch
            </>
          )}
        </Button>
      </div>

      {watchers.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {watchers.map((w) => {
            const uid =
              typeof w.userId === "object"
                ? ((w.userId as { toText?: () => string }).toText?.() ??
                  `${String(w.userId)}`)
                : `${String(w.userId)}`;
            const isMe = uid === myPrincipal?.toText();
            return (
              <div
                key={uid}
                className="group flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-foreground"
                data-ocid={`watcher-${uid.slice(0, 8)}`}
              >
                <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary shrink-0">
                  {uid.slice(0, 2).toUpperCase()}
                </div>
                <span className="max-w-[80px] truncate">
                  {isMe ? "You" : `${uid.slice(0, 8)}…`}
                </span>
                {isMe && (
                  <button
                    type="button"
                    aria-label="Remove watcher"
                    onClick={() => removeMutation.mutate(w.userId)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
