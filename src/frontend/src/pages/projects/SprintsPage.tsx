import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarRange,
  CheckCircle2,
  Circle,
  Clock,
  Flag,
  Loader2,
  Plus,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import { type Sprint, SprintStatus } from "../../types";

const STATUS_CONFIG: Record<
  SprintStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  [SprintStatus.planned]: {
    label: "Planned",
    color: "bg-muted text-muted-foreground border-border",
    icon: <Circle className="h-3.5 w-3.5" />,
  },
  [SprintStatus.active]: {
    label: "Active",
    color: "bg-primary/10 text-primary border-primary/30",
    icon: <Zap className="h-3.5 w-3.5" />,
  },
  [SprintStatus.completed]: {
    label: "Completed",
    color:
      "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
};

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function parseDateToTs(s: string): bigint {
  return BigInt(new Date(s).getTime() * 1_000_000);
}

export default function SprintsPage() {
  const { workspaceId, projectId } = useParams({
    from: "/app/$workspaceId/projects/$projectId/sprints",
  });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: sprints = [], isLoading } = useQuery<Sprint[]>({
    queryKey: ["sprints", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSprints(tenantId, workspaceId, projectId);
    },
    enabled: !!actor && !isFetching,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.createSprint(tenantId, workspaceId, {
        name,
        goal,
        projectId,
        taskIds: [],
        startDate: parseDateToTs(startDate),
        endDate: parseDateToTs(endDate),
      });
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sprints", tenantId, workspaceId, projectId],
      });
      setShowForm(false);
      setName("");
      setGoal("");
      setStartDate("");
      setEndDate("");
      toast.success("Sprint created");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.deleteSprint(tenantId, workspaceId, id);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sprints", tenantId, workspaceId, projectId],
      });
      toast.success("Sprint deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const activeSprints = sprints.filter((s) => s.status === SprintStatus.active);
  const otherSprints = sprints.filter((s) => s.status !== SprintStatus.active);

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      {/* Header */}
      <div className="px-4 sm:px-6 md:px-8 pt-4 pb-4 border-b border-border/60 bg-card/80 sticky top-0 z-10 backdrop-blur-subtle">
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
              className="hover:text-foreground transition-colors truncate"
            >
              Project
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Sprints</span>
          </div>
          <div className="ml-auto">
            <Button
              size="sm"
              className="gap-1.5 h-8 text-xs active-press"
              onClick={() => setShowForm(true)}
              data-ocid="create-sprint-btn"
            >
              <Plus className="h-3.5 w-3.5" /> New Sprint
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6">
        {/* Create form */}
        {showForm && (
          <div
            className="rounded-2xl border border-primary/30 bg-card p-5 space-y-4"
            data-ocid="sprint-create-form"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-foreground">
                New Sprint
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
                <Label className="text-xs">Sprint Name *</Label>
                <Input
                  placeholder="Sprint 1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="sprint-name-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Sprint Goal</Label>
                <Input
                  placeholder="What do you want to achieve?"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="sprint-goal-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Start Date *</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="sprint-start-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">End Date *</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="sprint-end-input"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                size="sm"
                className="gap-1.5 text-xs h-8"
                disabled={
                  !name.trim() ||
                  !startDate ||
                  !endDate ||
                  createMutation.isPending
                }
                onClick={() => createMutation.mutate()}
                data-ocid="sprint-save-btn"
              >
                {createMutation.isPending && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                Create Sprint
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
              <Skeleton key={n} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {!isLoading && sprints.length === 0 && !showForm && (
          <div
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 gap-4"
            data-ocid="sprints-empty"
          >
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <CalendarRange className="h-7 w-7 text-primary" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-display font-bold text-foreground">
                No sprints yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Create your first sprint to organize work into time-boxed
                iterations.
              </p>
            </div>
            <Button
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => setShowForm(true)}
              data-ocid="create-first-sprint-btn"
            >
              <Plus className="h-3.5 w-3.5" />
              Create First Sprint
            </Button>
          </div>
        )}

        {activeSprints.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Active Sprint
            </h2>
            {activeSprints.map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprint={sprint}
                projectId={projectId}
                workspaceId={workspaceId}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </div>
        )}

        {otherSprints.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
              <Flag className="h-4 w-4 text-muted-foreground" />
              All Sprints
            </h2>
            {otherSprints.map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprint={sprint}
                projectId={projectId}
                workspaceId={workspaceId}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SprintCard({
  sprint,
  projectId,
  workspaceId,
  onDelete,
}: {
  sprint: Sprint;
  projectId: string;
  workspaceId: string;
  onDelete: (id: string) => void;
}) {
  const cfg = STATUS_CONFIG[sprint.status];
  const isActive = sprint.status === SprintStatus.active;
  return (
    <div
      className={`rounded-2xl border ${isActive ? "border-primary/40 bg-primary/5" : "border-border bg-card"} p-5 transition-smooth hover:shadow-sm`}
      data-ocid={`sprint-card-${sprint.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/app/$workspaceId/projects/$projectId/sprints/$sprintId"
              params={{ workspaceId, projectId, sprintId: sprint.id }}
              className="font-display font-bold text-foreground hover:text-primary transition-colors text-base"
              data-ocid={`sprint-link-${sprint.id}`}
            >
              {sprint.name}
            </Link>
            <Badge variant="outline" className={`text-xs gap-1 ${cfg.color}`}>
              {cfg.icon}
              {cfg.label}
            </Badge>
          </div>
          {sprint.goal && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {sprint.goal}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDate(sprint.startDate)} – {formatDate(sprint.endDate)}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {sprint.taskIds.length} tasks
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            aria-label="Delete sprint"
            onClick={() => onDelete(sprint.id)}
            data-ocid={`sprint-delete-${sprint.id}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
