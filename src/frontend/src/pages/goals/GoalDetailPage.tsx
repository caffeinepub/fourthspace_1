// Goal Detail Page — clean rebuild v2
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Globe,
  Link2,
  Loader2,
  Lock,
  Plus,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  CheckInInput,
  GoalCheckIn,
  KeyResult,
  KeyResultInput,
  WorkspaceMember,
} from "../../backend";
import { GoalStatus, KRStatus } from "../../backend";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import { WorkspaceRole } from "../../types";

const GOAL_STATUS_COLORS: Record<GoalStatus, string> = {
  [GoalStatus.Active]:
    "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400",
  [GoalStatus.OnHold]:
    "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-800",
  [GoalStatus.Completed]: "bg-muted text-muted-foreground border-border",
  [GoalStatus.Cancelled]:
    "bg-destructive/10 text-destructive border-destructive/20",
};
const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  [GoalStatus.Active]: "Active",
  [GoalStatus.OnHold]: "On Hold",
  [GoalStatus.Completed]: "Completed",
  [GoalStatus.Cancelled]: "Cancelled",
};

const KR_STATUS_COLORS: Record<KRStatus, string> = {
  [KRStatus.OnTrack]: "bg-accent/10 text-accent border-accent/20",
  [KRStatus.Behind]: "bg-destructive/10 text-destructive border-destructive/20",
  [KRStatus.Completed]: "bg-muted text-muted-foreground border-border",
  [KRStatus.AtRisk]:
    "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-800",
};
const KR_STATUS_LABELS: Record<KRStatus, string> = {
  [KRStatus.OnTrack]: "On Track",
  [KRStatus.Behind]: "Behind",
  [KRStatus.Completed]: "Completed",
  [KRStatus.AtRisk]: "At Risk",
};

function KRProgressBar({
  current,
  target,
}: { current: number; target: number }) {
  const pct =
    target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  return (
    <div className="relative h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full bg-accent transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function UpdateProgressForm({
  kr,
  onSave,
  onCancel,
}: {
  kr: KeyResult;
  onSave: (newValue: number, note: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(String(kr.currentValue));
  const [note, setNote] = useState("");
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3 mt-3">
      <p className="text-xs font-semibold text-foreground">Update Progress</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">New Value ({kr.unit})</Label>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-8 text-sm"
            data-ocid={`update-value-${kr.id}`}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Target</Label>
          <div className="h-8 flex items-center text-sm text-muted-foreground font-mono">
            {kr.targetValue} {kr.unit}
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Note (optional)</Label>
        <Textarea
          placeholder="What progress was made?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="resize-none text-sm"
          data-ocid={`update-note-${kr.id}`}
        />
      </div>
      <div className="flex items-center gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={() => onSave(Number(value), note)}
          data-ocid={`save-progress-${kr.id}`}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

function AddKRForm({
  onSave,
  onCancel,
}: {
  onSave: (kr: {
    title: string;
    targetValue: number;
    unit: string;
    description: string;
  }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");

  function handleSave() {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    onSave({ title, targetValue: Number(targetValue), unit, description });
  }

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4 space-y-3"
      data-ocid="add-kr-form"
    >
      <p className="text-xs font-semibold text-foreground">New Key Result</p>
      <Input
        placeholder="Describe the measurable outcome…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-sm"
        data-ocid="new-kr-title"
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Target Value</Label>
          <Input
            type="number"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            className="h-8 text-sm"
            data-ocid="new-kr-target"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Unit</Label>
          <Input
            placeholder="%, $, deals…"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="h-8 text-sm"
            data-ocid="new-kr-unit"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Description</Label>
        <Input
          placeholder="How will it be measured?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-sm"
          data-ocid="new-kr-desc"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave} data-ocid="save-kr-btn">
          Add
        </Button>
      </div>
    </div>
  );
}

export default function GoalDetailPage() {
  const { workspaceId, goalId } = useParams({
    from: "/app/$workspaceId/goals/$goalId" as "/",
  }) as { workspaceId: string; goalId: string };
  const { activeWorkspaceId } = useWorkspace();
  const wsId = workspaceId ?? activeWorkspaceId ?? "";
  const tenantId = getTenantId();
  const { actor, isFetching } = useBackend();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const [showAddKR, setShowAddKR] = useState(false);
  const [updatingKR, setUpdatingKR] = useState<string | null>(null);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInNote, setCheckInNote] = useState("");
  const [expandedKRs, setExpandedKRs] = useState<Record<string, boolean>>({});
  const [isTogglingPublic, setIsTogglingPublic] = useState(false);

  const { data: goal, isLoading: goalLoading } = useQuery({
    queryKey: ["goal", tenantId, wsId, goalId],
    queryFn: async () => {
      if (!actor) return null;
      const res = await actor.getGoal(tenantId, wsId, goalId);
      return res.__kind__ === "ok" ? res.ok : null;
    },
    enabled: !!actor && !isFetching && !!wsId && !!goalId,
  });

  const { data: keyResults = [], isLoading: krLoading } = useQuery<KeyResult[]>(
    {
      queryKey: ["keyResults", tenantId, wsId, goalId],
      queryFn: async () => {
        if (!actor) return [];
        return actor.listKeyResults(tenantId, wsId, goalId);
      },
      enabled: !!actor && !isFetching && !!wsId && !!goalId,
    },
  );

  const { data: checkIns = [], isLoading: ciLoading } = useQuery<GoalCheckIn[]>(
    {
      queryKey: ["checkIns", tenantId, wsId, goalId],
      queryFn: async () => {
        if (!actor) return [];
        return actor.listCheckIns(tenantId, wsId, goalId);
      },
      enabled: !!actor && !isFetching && !!wsId && !!goalId,
    },
  );

  const { data: members = [] } = useQuery<WorkspaceMember[]>({
    queryKey: ["workspaceMembers", tenantId, wsId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaceMembers(tenantId, wsId);
    },
    enabled: !!actor && !isFetching && !!wsId,
  });

  const currentPrincipal = identity?.getPrincipal()?.toText() ?? "";
  const currentMember = members.find(
    (m) => m.userId.toString() === currentPrincipal,
  );
  const canTogglePublic =
    currentMember?.role === WorkspaceRole.Admin ||
    currentMember?.role === WorkspaceRole.Manager;

  // Sorted check-ins: desc by timestamp
  const sortedCheckIns = [...checkIns].sort((a, b) =>
    Number(b.timestamp - a.timestamp),
  );

  const overallProgress =
    keyResults.length > 0
      ? Math.round(
          keyResults.reduce(
            (a, kr) =>
              a +
              Math.min(100, (kr.currentValue / (kr.targetValue || 1)) * 100),
            0,
          ) / keyResults.length,
        )
      : (goal?.progress ?? 0);

  const addKRMutation = useMutation({
    mutationFn: async (input: KeyResultInput) => {
      if (!actor) throw new Error("Not connected");
      const res = await actor.addKeyResult(tenantId, wsId, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["keyResults", tenantId, wsId, goalId],
      });
      queryClient.invalidateQueries({
        queryKey: ["goal", tenantId, wsId, goalId],
      });
      setShowAddKR(false);
      toast.success("Key result added");
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to add key result"),
  });

  const updateKRMutation = useMutation({
    mutationFn: async ({
      krId,
      newValue,
      status,
    }: { krId: string; newValue: number; status: KRStatus }) => {
      if (!actor) throw new Error("Not connected");
      const res = await actor.updateKeyResult(
        tenantId,
        wsId,
        krId,
        newValue,
        status,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["keyResults", tenantId, wsId, goalId],
      });
      queryClient.invalidateQueries({
        queryKey: ["goal", tenantId, wsId, goalId],
      });
      setUpdatingKR(null);
      toast.success("Progress updated");
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to update progress"),
  });

  const recordCheckInMutation = useMutation({
    mutationFn: async (input: CheckInInput) => {
      if (!actor) throw new Error("Not connected");
      const res = await actor.recordCheckIn(tenantId, wsId, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checkIns", tenantId, wsId, goalId],
      });
      setCheckInNote("");
      setShowCheckIn(false);
      toast.success("Check-in recorded");
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to record check-in"),
  });

  async function handleTogglePublic() {
    if (!actor || !wsId) return;
    setIsTogglingPublic(true);
    try {
      const res = await actor.toggleGoalPublic(goalId, wsId, tenantId);
      if (res.__kind__ === "ok") {
        queryClient.invalidateQueries({
          queryKey: ["goal", tenantId, wsId, goalId],
        });
        toast.success(
          res.ok.isPublic ? "Goal is now public" : "Goal is now private",
        );
      } else {
        toast.error(res.err ?? "Failed to update visibility");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsTogglingPublic(false);
    }
  }

  function handleUpdateProgress(kr: KeyResult, newValue: number, note: string) {
    const newStatus: KRStatus =
      kr.targetValue > 0 && newValue >= kr.targetValue
        ? KRStatus.Completed
        : kr.status;
    updateKRMutation.mutate({ krId: kr.id, newValue, status: newStatus });
    if (note.trim()) {
      recordCheckInMutation.mutate({ goalId, krId: kr.id, newValue, note });
    }
  }

  function handleAddKR(kr: {
    title: string;
    targetValue: number;
    unit: string;
    description: string;
  }) {
    addKRMutation.mutate({
      goalId,
      title: kr.title,
      targetValue: kr.targetValue,
      unit: kr.unit,
      description: kr.description || undefined,
    });
  }

  function handleRecordCheckIn() {
    if (!checkInNote.trim()) {
      toast.error("Please enter a note");
      return;
    }
    recordCheckInMutation.mutate({
      goalId,
      newValue: overallProgress,
      note: checkInNote,
    });
  }

  function toggleKRExpand(id: string) {
    setExpandedKRs((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  if (goalLoading) {
    return (
      <div className="p-6 space-y-5">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="p-6 flex flex-col items-center justify-center py-20 text-center">
        <Target className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="font-semibold text-foreground">Goal not found</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to={`/app/${wsId}/goals` as "/"}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Goals
          </Link>
        </Button>
      </div>
    );
  }

  const statusColor =
    GOAL_STATUS_COLORS[goal.status] ?? GOAL_STATUS_COLORS[GoalStatus.Active];
  const statusLabel = GOAL_STATUS_LABELS[goal.status] ?? "Active";
  const periodLabel =
    goal.period ||
    new Date(Number(goal.endDate) / 1_000_000).getFullYear().toString();

  return (
    <div
      className="animate-fade-in-up p-4 sm:p-6 space-y-6 pb-20 md:pb-6"
      data-ocid="goal-detail-page"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/app/${wsId}/goals` as "/"}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-display font-bold tracking-tight text-foreground truncate">
              {goal.title}
            </h1>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border shrink-0 ${statusColor}`}
            >
              {statusLabel}
            </span>
            {goal.isPublic ? (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border bg-accent/10 text-accent border-accent/30 shrink-0"
                data-ocid="goal-public-badge"
              >
                <Globe className="h-3 w-3" /> Public
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border bg-muted text-muted-foreground border-border shrink-0"
                data-ocid="goal-private-badge"
              >
                <Lock className="h-3 w-3" /> Private
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{periodLabel}</p>
        </div>
        {canTogglePublic && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleTogglePublic}
            disabled={isTogglingPublic}
            className="shrink-0 gap-1.5 text-xs"
            data-ocid="goal-toggle-public-btn"
          >
            {isTogglingPublic ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : goal.isPublic ? (
              <Lock className="h-3.5 w-3.5" />
            ) : (
              <Globe className="h-3.5 w-3.5" />
            )}
            {goal.isPublic ? "Make Private" : "Make Public"}
          </Button>
        )}
      </div>

      {/* Progress hero */}
      <Card className="shadow-card rounded-xl border border-border/50 bg-gradient-to-br from-primary/5 to-card">
        <CardContent className="px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Overall Progress
              </p>
              <p className="text-5xl font-display font-bold text-foreground mt-1 font-mono tabular-nums">
                {overallProgress}%
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Target className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min(100, overallProgress)}%` }}
            />
          </div>
          {goal.description && (
            <p className="text-sm text-muted-foreground mt-4">
              {goal.description}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Key Results */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Key Results
            </h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddKR((v) => !v)}
              data-ocid="add-kr-trigger"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Key Result
            </Button>
          </div>

          {showAddKR && (
            <AddKRForm
              onSave={handleAddKR}
              onCancel={() => setShowAddKR(false)}
            />
          )}

          {krLoading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <Skeleton key={n} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : keyResults.length === 0 ? (
            <div
              className="flex flex-col items-center py-10 gap-3 rounded-xl border border-dashed border-border"
              data-ocid="no-krs"
            >
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No key results yet
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddKR(true)}
              >
                Add First Key Result
              </Button>
            </div>
          ) : (
            keyResults.map((kr) => {
              const pct =
                kr.targetValue > 0
                  ? Math.min(
                      100,
                      Math.round((kr.currentValue / kr.targetValue) * 100),
                    )
                  : 0;
              const isExpanded = expandedKRs[kr.id];
              const krStatusColor =
                KR_STATUS_COLORS[kr.status] ??
                KR_STATUS_COLORS[KRStatus.OnTrack];
              const krStatusLabel = KR_STATUS_LABELS[kr.status] ?? "On Track";
              return (
                <Card
                  key={kr.id}
                  className="shadow-card rounded-xl border border-border/50 bg-card hover:border-accent/30 transition-colors"
                  data-ocid={`kr-card-${kr.id}`}
                >
                  <CardHeader className="pb-2 pt-4 px-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                        <TrendingUp className="h-3.5 w-3.5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <button
                          type="button"
                          className="text-sm font-semibold text-foreground text-left hover:text-primary transition-colors w-full"
                          onClick={() => toggleKRExpand(kr.id)}
                        >
                          {kr.title}
                        </button>
                        {kr.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {kr.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border shrink-0 ${krStatusColor}`}
                      >
                        {krStatusLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleKRExpand(kr.id)}
                        className="text-muted-foreground hover:text-foreground shrink-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-4 space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          <span className="font-mono font-semibold text-foreground">
                            {kr.currentValue}
                          </span>
                          <span className="mx-1 text-muted-foreground">/</span>
                          <span className="font-mono">
                            {kr.targetValue} {kr.unit}
                          </span>
                        </span>
                        <span className="font-mono font-semibold text-foreground">
                          {pct}%
                        </span>
                      </div>
                      <KRProgressBar
                        current={kr.currentValue}
                        target={kr.targetValue}
                      />
                    </div>
                    {isExpanded && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() =>
                            setUpdatingKR(updatingKR === kr.id ? null : kr.id)
                          }
                          data-ocid={`update-progress-btn-${kr.id}`}
                          disabled={updateKRMutation.isPending}
                        >
                          {updateKRMutation.isPending &&
                          updatingKR === kr.id ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : null}
                          Update Progress
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-7 text-muted-foreground"
                          asChild
                          data-ocid={`link-task-btn-${kr.id}`}
                        >
                          <Link to={`/app/${wsId}/projects` as "/"}>
                            <Link2 className="h-3 w-3 mr-1" />
                            Link Task
                          </Link>
                        </Button>
                      </div>
                    )}
                    {updatingKR === kr.id && (
                      <UpdateProgressForm
                        kr={kr}
                        onSave={(v, n) => handleUpdateProgress(kr, v, n)}
                        onCancel={() => setUpdatingKR(null)}
                      />
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Meta */}
          <Card className="border-border">
            <CardContent className="px-4 py-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${statusColor}`}
                >
                  {statusLabel}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Period</span>
                <span className="font-medium text-foreground">
                  {periodLabel}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Start</span>
                <span className="font-mono text-foreground">
                  {new Date(
                    Number(goal.startDate) / 1_000_000,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">End</span>
                <span className="font-mono text-foreground">
                  {new Date(
                    Number(goal.endDate) / 1_000_000,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Key Results</span>
                <span className="font-medium text-foreground">
                  {keyResults.length}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Check-ins */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Check-in History</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => setShowCheckIn((v) => !v)}
                  data-ocid="record-checkin-btn"
                  disabled={recordCheckInMutation.isPending}
                >
                  Record
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {showCheckIn && (
                <div className="space-y-2 rounded-xl border border-border bg-muted/20 p-3">
                  <Textarea
                    placeholder="What progress was made since last check-in?"
                    value={checkInNote}
                    onChange={(e) => setCheckInNote(e.target.value)}
                    rows={2}
                    className="resize-none text-sm"
                    data-ocid="checkin-note-input"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowCheckIn(false);
                        setCheckInNote("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleRecordCheckIn}
                      disabled={recordCheckInMutation.isPending}
                      data-ocid="save-checkin-btn"
                    >
                      {recordCheckInMutation.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : null}
                      Save
                    </Button>
                  </div>
                </div>
              )}

              {ciLoading ? (
                <div className="space-y-2">
                  {[1, 2].map((n) => (
                    <Skeleton key={n} className="h-12 rounded-lg" />
                  ))}
                </div>
              ) : sortedCheckIns.length === 0 ? (
                <p className="text-xs text-muted-foreground py-3 text-center">
                  No check-ins yet
                </p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {sortedCheckIns.map((ci) => {
                    const tsMs = Number(ci.timestamp) / 1_000_000;
                    const dateStr = new Date(tsMs).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                    const authorShort = ci.userId.toString().slice(0, 8);
                    return (
                      <div
                        key={ci.id}
                        className="flex items-start gap-3"
                        data-ocid={`checkin-${ci.id}`}
                      >
                        <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                            {authorShort.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-mono text-muted-foreground truncate">
                              {authorShort}…
                            </span>
                            <span className="text-muted-foreground shrink-0">
                              {dateStr}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            <span className="font-mono">
                              {ci.previousValue}
                            </span>
                            <span className="mx-1">→</span>
                            <span className="font-mono font-semibold text-foreground">
                              {ci.newValue}
                            </span>
                          </p>
                          {ci.note && (
                            <p className="text-xs text-foreground mt-1">
                              {ci.note}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
