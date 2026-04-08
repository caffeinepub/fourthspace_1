import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Flag,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import { type Milestone, MilestoneStatus } from "../../types";

const STATUS_CONFIG: Record<
  MilestoneStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  [MilestoneStatus.upcoming]: {
    label: "Upcoming",
    color: "bg-primary/10 text-primary border-primary/30",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  [MilestoneStatus.reached]: {
    label: "Reached",
    color:
      "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  [MilestoneStatus.missed]: {
    label: "Missed",
    color: "bg-destructive/10 text-destructive border-destructive/30",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
};

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function parseDateToTs(s: string): bigint {
  return BigInt(new Date(s).getTime() * 1_000_000);
}

export default function MilestonesPage() {
  const { workspaceId, projectId } = useParams({
    from: "/app/$workspaceId/projects/$projectId/milestones",
  });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const { data: milestones = [], isLoading } = useQuery<Milestone[]>({
    queryKey: ["milestones", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMilestones(tenantId, workspaceId, projectId);
    },
    enabled: !!actor && !isFetching,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.createMilestone(tenantId, workspaceId, {
        title: title.trim(),
        description: description.trim(),
        projectId,
        dueDate: parseDateToTs(dueDate),
        linkedTaskIds: [],
      });
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["milestones", tenantId, workspaceId, projectId],
      });
      setShowForm(false);
      setTitle("");
      setDescription("");
      setDueDate("");
      toast.success("Milestone created");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const markReachedMutation = useMutation({
    mutationFn: async (m: Milestone) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.updateMilestone(
        tenantId,
        workspaceId,
        m.id,
        m.title,
        MilestoneStatus.reached,
        m.dueDate,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["milestones", tenantId, workspaceId, projectId],
      });
      toast.success("Milestone reached! 🎉");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.deleteMilestone(tenantId, workspaceId, id);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["milestones", tenantId, workspaceId, projectId],
      });
      toast.success("Milestone deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const sorted = [...milestones].sort((a, b) => Number(a.dueDate - b.dueDate));

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      {/* Header */}
      <div className="px-6 md:px-8 pt-4 pb-4 border-b border-border/60 bg-card/80 sticky top-0 z-10 backdrop-blur-subtle">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              navigate({
                to: "/app/$workspaceId/projects/$projectId",
                params: { workspaceId, projectId },
              })
            }
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
            <Link
              to="/app/$workspaceId/projects"
              params={{ workspaceId }}
              className="hover:text-foreground transition-colors"
            >
              Projects
            </Link>
            <span>/</span>
            <Link
              to="/app/$workspaceId/projects/$projectId"
              params={{ workspaceId, projectId }}
              className="hover:text-foreground transition-colors"
            >
              Project
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Milestones</span>
          </div>
          <div className="ml-auto">
            <Button
              size="sm"
              className="gap-1.5 h-8 text-xs active-press"
              onClick={() => setShowForm(true)}
              data-ocid="create-milestone-btn"
            >
              <Plus className="h-3.5 w-3.5" /> New Milestone
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-8 py-6 space-y-6">
        {/* Create form */}
        {showForm && (
          <div
            className="rounded-2xl border border-primary/30 bg-card p-5 space-y-4"
            data-ocid="milestone-create-form"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-foreground">
                New Milestone
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setShowForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Title *</Label>
                <Input
                  placeholder="e.g. Beta Launch"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="milestone-title-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Due Date *</Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="milestone-due-input"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs">Description</Label>
                <Textarea
                  placeholder="Describe this milestone..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-sm resize-none"
                  rows={2}
                  data-ocid="milestone-desc-input"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                size="sm"
                className="gap-1.5 text-xs h-8"
                disabled={!title.trim() || !dueDate || createMutation.isPending}
                onClick={() => createMutation.mutate()}
                data-ocid="milestone-save-btn"
              >
                {createMutation.isPending && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                Create Milestone
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs h-8"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {!isLoading && milestones.length === 0 && !showForm && (
          <div
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 gap-4"
            data-ocid="milestones-empty"
          >
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Flag className="h-7 w-7 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-display font-bold text-foreground">
                No milestones yet
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Mark key project checkpoints as milestones.
              </p>
            </div>
            <Button
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => setShowForm(true)}
              data-ocid="create-first-milestone-btn"
            >
              <Plus className="h-3.5 w-3.5" />
              Create First Milestone
            </Button>
          </div>
        )}

        {/* Timeline */}
        {sorted.length > 0 && (
          <div className="relative">
            <div
              className="absolute left-5 top-0 bottom-0 w-px bg-border"
              aria-hidden
            />
            <div className="space-y-4">
              {sorted.map((m) => {
                const cfg = STATUS_CONFIG[m.status];
                const isUpcoming = m.status === MilestoneStatus.upcoming;
                return (
                  <div
                    key={m.id}
                    className="relative flex gap-4 pl-12"
                    data-ocid={`milestone-${m.id}`}
                  >
                    <div
                      className={`absolute left-3 top-3 h-4 w-4 rotate-45 rounded-sm border-2 ${
                        m.status === MilestoneStatus.reached
                          ? "bg-emerald-500 border-emerald-500"
                          : m.status === MilestoneStatus.missed
                            ? "bg-destructive border-destructive"
                            : "bg-primary border-primary"
                      }`}
                      aria-hidden
                    />
                    <div
                      className={`flex-1 rounded-2xl border ${m.status === MilestoneStatus.reached ? "border-emerald-200 dark:border-emerald-800 bg-emerald-500/5" : m.status === MilestoneStatus.missed ? "border-destructive/30 bg-destructive/5" : "border-border bg-card"} p-4`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-display font-bold text-foreground">
                              {m.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`text-xs gap-1 ${cfg.color}`}
                            >
                              {cfg.icon}
                              {cfg.label}
                            </Badge>
                          </div>
                          {m.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {m.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              Due {formatDate(m.dueDate)}
                            </span>
                            {m.linkedTaskIds.length > 0 && (
                              <span>{m.linkedTaskIds.length} linked tasks</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {isUpcoming && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 gap-1 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-500/10 dark:border-emerald-800 dark:text-emerald-400"
                              onClick={() => markReachedMutation.mutate(m)}
                              disabled={markReachedMutation.isPending}
                              data-ocid={`mark-reached-${m.id}`}
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              Mark Reached
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteMutation.mutate(m.id)}
                            aria-label="Delete milestone"
                            data-ocid={`delete-milestone-${m.id}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
