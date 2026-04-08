import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, Edit2, MessageSquare, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import {
  type ActivityEvent,
  ActivityEventType,
  type TaskComment,
} from "../../types";

interface TaskCommentsProps {
  taskId: string;
  projectId: string;
}

function formatTs(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const d = new Date(ms);
  const now = Date.now();
  const diff = now - ms;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function initials(id: string): string {
  return id.slice(0, 2).toUpperCase();
}

const ACTIVITY_ICONS: Partial<Record<ActivityEventType, string>> = {
  [ActivityEventType.taskCreated]: "✨",
  [ActivityEventType.taskUpdated]: "✏️",
  [ActivityEventType.taskStatusChanged]: "🔄",
  [ActivityEventType.taskAssigned]: "👤",
  [ActivityEventType.commentAdded]: "💬",
  [ActivityEventType.commentEdited]: "📝",
  [ActivityEventType.subtaskAdded]: "📋",
  [ActivityEventType.checklistItemAdded]: "☑️",
  [ActivityEventType.checklistItemCompleted]: "✅",
  [ActivityEventType.watcherAdded]: "👁️",
  [ActivityEventType.dependencyAdded]: "🔗",
  [ActivityEventType.sprintStarted]: "🚀",
  [ActivityEventType.sprintCompleted]: "🏁",
  [ActivityEventType.milestoneCreated]: "🎯",
};

export function TaskComments({ taskId, projectId }: TaskCommentsProps) {
  const { actor, isFetching } = useBackend();
  const { tenantId, activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  const myPrincipal = identity?.getPrincipal().toText() ?? "";

  const [tab, setTab] = useState<"comments" | "activity">("comments");
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const { data: comments = [], isLoading: commentsLoading } = useQuery<
    TaskComment[]
  >({
    queryKey: ["comments", tenantId, workspaceId, taskId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listComments(tenantId, workspaceId, taskId);
    },
    enabled: !!actor && !isFetching,
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery<
    ActivityEvent[]
  >({
    queryKey: ["activity", tenantId, workspaceId, taskId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listActivityEvents(tenantId, workspaceId, taskId);
    },
    enabled: !!actor && !isFetching && tab === "activity",
  });

  const addMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.addComment(tenantId, workspaceId, projectId, {
        content,
        taskId,
      });
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", tenantId, workspaceId, taskId],
      });
      setNewComment("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.editComment(tenantId, workspaceId, id, content);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", tenantId, workspaceId, taskId],
      });
      setEditingId(null);
      setEditText("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.deleteComment(tenantId, workspaceId, id);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["comments", tenantId, workspaceId, taskId],
      }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-3" data-ocid="task-comments">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        <button
          type="button"
          onClick={() => setTab("comments")}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${
            tab === "comments"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          data-ocid="comments-tab"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Comments
          {comments.length > 0 && (
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-4 min-w-4"
            >
              {comments.length}
            </Badge>
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab("activity")}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${
            tab === "activity"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          data-ocid="activity-tab"
        >
          <Activity className="h-3.5 w-3.5" />
          Activity
        </button>
      </div>

      {/* Comments Tab */}
      {tab === "comments" && (
        <div className="space-y-3">
          {commentsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <Skeleton key={n} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div
              className="py-8 text-center text-sm text-muted-foreground"
              data-ocid="comments-empty"
            >
              No comments yet. Be the first to comment.
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => {
                const isOwn =
                  typeof c.authorId === "object"
                    ? (c.authorId as { toText?: () => string }).toText?.() ===
                      myPrincipal
                    : String(c.authorId) === myPrincipal;
                return (
                  <div
                    key={c.id}
                    className="flex gap-2.5"
                    data-ocid={`comment-${c.id}`}
                  >
                    <div className="shrink-0 h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary">
                      {initials(c.id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-foreground">
                          Team Member
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatTs(c.createdAt)}
                        </span>
                        {c.editedAt && (
                          <span className="text-[10px] text-muted-foreground italic">
                            (edited)
                          </span>
                        )}
                      </div>
                      {editingId === c.id ? (
                        <div className="space-y-2">
                          <Textarea
                            autoFocus
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="text-sm resize-none min-h-[60px]"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              className="h-7 gap-1.5 text-xs"
                              disabled={
                                !editText.trim() || editMutation.isPending
                              }
                              onClick={() =>
                                editMutation.mutate({
                                  id: c.id,
                                  content: editText.trim(),
                                })
                              }
                              data-ocid="comment-save-edit-btn"
                            >
                              <Save className="h-3 w-3" />
                              Save
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 gap-1.5 text-xs"
                              onClick={() => {
                                setEditingId(null);
                                setEditText("");
                              }}
                            >
                              <X className="h-3 w-3" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-foreground break-words">
                          {c.content}
                        </p>
                      )}
                      {isOwn && editingId !== c.id && (
                        <div className="flex gap-2 mt-1">
                          <button
                            type="button"
                            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => {
                              setEditingId(c.id);
                              setEditText(c.content);
                            }}
                            data-ocid={`comment-edit-${c.id}`}
                          >
                            <Edit2 className="h-3 w-3 inline mr-0.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-[11px] text-muted-foreground hover:text-destructive transition-colors"
                            onClick={() => deleteMutation.mutate(c.id)}
                            data-ocid={`comment-delete-${c.id}`}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add comment */}
          <div className="flex gap-2.5 pt-1 border-t border-border/60">
            <div className="shrink-0 h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary">
              {initials(myPrincipal || "me")}
            </div>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="text-sm resize-none min-h-[60px]"
                rows={2}
                data-ocid="new-comment-input"
              />
              <Button
                type="button"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                disabled={!newComment.trim() || addMutation.isPending}
                onClick={() =>
                  newComment.trim() && addMutation.mutate(newComment.trim())
                }
                data-ocid="add-comment-btn"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Add comment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {tab === "activity" && (
        <div className="space-y-1">
          {eventsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div
              className="py-8 text-center text-sm text-muted-foreground"
              data-ocid="activity-empty"
            >
              No activity yet.
            </div>
          ) : (
            [...events].reverse().map((e) => (
              <div
                key={e.id}
                className="flex items-start gap-2.5 px-1 py-1.5 rounded-lg hover:bg-muted/40 transition-colors"
              >
                <span className="text-base shrink-0 mt-0.5">
                  {ACTIVITY_ICONS[e.eventType] ?? "📌"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground">{e.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {formatTs(e.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
