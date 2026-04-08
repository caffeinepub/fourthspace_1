import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Edit3,
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
import { createActor } from "../../backend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import { WorkspaceRole } from "../../types";
import type { WorkspaceMember } from "../../types";
import type { GoalStatus, MockKeyResult } from "./goalData";
import { MOCK_GOALS, STATUS_COLORS, STATUS_LABELS } from "./goalData";

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

interface UpdateProgressFormProps {
  kr: MockKeyResult;
  onSave: (newValue: number, note: string) => void;
  onCancel: () => void;
}

function UpdateProgressForm({ kr, onSave, onCancel }: UpdateProgressFormProps) {
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
          onClick={() => {
            onSave(Number(value), note);
          }}
          data-ocid={`save-progress-${kr.id}`}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

interface AddKRFormProps {
  onSave: (kr: {
    title: string;
    targetValue: number;
    unit: string;
    description: string;
  }) => void;
  onCancel: () => void;
}

function AddKRForm({ onSave, onCancel }: AddKRFormProps) {
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
  const { workspaceId } = useParams({
    from: "/app/$workspaceId/goals/$goalId" as "/",
  });
  const { goalId } = useParams({
    from: "/app/$workspaceId/goals/$goalId" as "/",
  }) as { goalId: string };
  const { activeWorkspaceId } = useWorkspace();
  const wsId = workspaceId ?? activeWorkspaceId ?? "";
  const tenantId = getTenantId();
  const { actor, isFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();

  const goalData = MOCK_GOALS.find((g) => g.id === goalId) ?? MOCK_GOALS[0];
  const [keyResults, setKeyResults] = useState<MockKeyResult[]>(
    goalData.keyResultList,
  );
  const [checkIns, setCheckIns] = useState(goalData.checkIns);
  const [showAddKR, setShowAddKR] = useState(false);
  const [updatingKR, setUpdatingKR] = useState<string | null>(null);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInNote, setCheckInNote] = useState("");
  const [expandedKRs, setExpandedKRs] = useState<Record<string, boolean>>({});
  const [isPublic, setIsPublic] = useState(false);
  const [isTogglingPublic, setIsTogglingPublic] = useState(false);

  // Fetch goal from backend to initialize isPublic from actual stored value
  const { data: goalFromBackend } = useQuery({
    queryKey: ["goal", tenantId, wsId, goalId],
    queryFn: async () => {
      if (!actor) return null;
      const res = await actor.getGoal(tenantId, wsId, goalId);
      return res.__kind__ === "ok" ? res.ok : null;
    },
    enabled: !!actor && !isFetching && !!wsId && !!goalId,
  });

  useEffect(() => {
    if (goalFromBackend) {
      setIsPublic(goalFromBackend.isPublic);
    }
  }, [goalFromBackend]);

  // Fetch workspace members to determine current user's role
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

  async function handleTogglePublic() {
    if (!actor || !wsId) return;
    setIsTogglingPublic(true);
    try {
      const res = await actor.toggleGoalPublic(goalId, wsId, tenantId);
      if (res.__kind__ === "ok") {
        setIsPublic(res.ok.isPublic);
        toast.success(
          res.ok.isPublic
            ? "Goal is now public — stakeholders can view it"
            : "Goal is now private",
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
      : goalData.progress;

  function handleUpdateProgress(krId: string, newValue: number, note: string) {
    const kr = keyResults.find((k) => k.id === krId);
    if (!kr) return;
    const oldValue = kr.currentValue;
    setKeyResults((prev) =>
      prev.map((k) => (k.id === krId ? { ...k, currentValue: newValue } : k)),
    );
    if (note) {
      setCheckIns((prev) => [
        {
          id: `ci-${Date.now()}`,
          author: "You",
          initials: "YO",
          oldValue,
          newValue,
          note,
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        },
        ...prev,
      ]);
    }
    setUpdatingKR(null);
    toast.success("Progress updated");
  }

  function handleAddKR(kr: {
    title: string;
    targetValue: number;
    unit: string;
    description: string;
  }) {
    setKeyResults((prev) => [
      ...prev,
      {
        id: `kr-${Date.now()}`,
        title: kr.title,
        currentValue: 0,
        targetValue: kr.targetValue,
        unit: kr.unit,
        description: kr.description,
        status: "Active" as GoalStatus,
      },
    ]);
    setShowAddKR(false);
    toast.success("Key result added");
  }

  function handleRecordCheckIn() {
    if (!checkInNote.trim()) {
      toast.error("Please enter a note");
      return;
    }
    setCheckIns((prev) => [
      {
        id: `ci-${Date.now()}`,
        author: "You",
        initials: "YO",
        oldValue: overallProgress - 5,
        newValue: overallProgress,
        note: checkInNote,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      },
      ...prev,
    ]);
    setCheckInNote("");
    setShowCheckIn(false);
    toast.success("Check-in recorded");
  }

  function toggleKRExpand(id: string) {
    setExpandedKRs((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div
      className="animate-fade-in-up p-6 space-y-6"
      data-ocid="goal-detail-page"
    >
      {" "}
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
              {goalData.title}
            </h1>
            <Badge className={`${STATUS_COLORS[goalData.status]} shrink-0`}>
              {STATUS_LABELS[goalData.status]}
            </Badge>
            {/* Public / Private visibility badge */}
            {isPublic ? (
              <Badge
                className="shrink-0 bg-accent/10 text-accent border-accent/30 gap-1"
                data-ocid="goal-public-badge"
              >
                <Globe className="h-3 w-3" />
                Public
              </Badge>
            ) : (
              <Badge
                className="shrink-0 bg-muted text-muted-foreground border-border gap-1"
                data-ocid="goal-private-badge"
              >
                <Lock className="h-3 w-3" />
                Private
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {goalData.period} · {goalData.owner}
          </p>
        </div>
        {/* Visibility toggle — Admin/Manager only */}
        {canTogglePublic && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleTogglePublic}
            disabled={isTogglingPublic}
            className="shrink-0 gap-1.5 text-xs"
            data-ocid="goal-toggle-public-btn"
            aria-label={isPublic ? "Make goal private" : "Make goal public"}
          >
            {isTogglingPublic ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isPublic ? (
              <Lock className="h-3.5 w-3.5" />
            ) : (
              <Globe className="h-3.5 w-3.5" />
            )}
            {isPublic ? "Make Private" : "Make Public"}
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Edit goal"
          data-ocid="edit-goal-btn"
        >
          <Edit3 className="h-4 w-4" />
        </Button>
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
          {goalData.description && (
            <p className="text-sm text-muted-foreground mt-4">
              {goalData.description}
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

          {keyResults.length === 0 ? (
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
                      <Badge
                        className={`${STATUS_COLORS[kr.status]} shrink-0 text-xs`}
                      >
                        {STATUS_LABELS[kr.status]}
                      </Badge>
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
                        >
                          Update Progress
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-7 text-muted-foreground"
                          onClick={() => toast.info("Task picker coming soon")}
                          data-ocid={`link-task-btn-${kr.id}`}
                        >
                          <Link2 className="h-3 w-3 mr-1" />
                          Link Task
                        </Button>
                      </div>
                    )}
                    {updatingKR === kr.id && (
                      <UpdateProgressForm
                        kr={kr}
                        onSave={(v, n) => handleUpdateProgress(kr.id, v, n)}
                        onCancel={() => setUpdatingKR(null)}
                      />
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Sidebar: Check-ins + Meta */}
        <div className="space-y-4">
          {/* Meta */}
          <Card className="border-border">
            <CardContent className="px-4 py-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Owner</span>
                <span className="font-medium text-foreground">
                  {goalData.owner}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Period</span>
                <span className="font-medium text-foreground">
                  {goalData.period}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Start</span>
                <span className="font-mono text-foreground">
                  {goalData.startDate}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">End</span>
                <span className="font-mono text-foreground">
                  {goalData.endDate}
                </span>
              </div>
              {goalData.contributors.length > 0 && (
                <div className="flex items-start justify-between text-xs gap-2">
                  <span className="text-muted-foreground shrink-0">
                    Contributors
                  </span>
                  <span className="text-foreground text-right">
                    {goalData.contributors.join(", ")}
                  </span>
                </div>
              )}
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
                      data-ocid="save-checkin-btn"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              )}

              {checkIns.length === 0 ? (
                <p className="text-xs text-muted-foreground py-3 text-center">
                  No check-ins yet
                </p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {checkIns.map((ci) => (
                    <div
                      key={ci.id}
                      className="flex items-start gap-3"
                      data-ocid={`checkin-${ci.id}`}
                    >
                      <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                          {ci.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-semibold text-foreground">
                            {ci.author}
                          </span>
                          <span className="text-muted-foreground shrink-0">
                            {ci.date}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          <span className="font-mono">{ci.oldValue}</span>
                          <span className="mx-1">→</span>
                          <span className="font-mono font-semibold text-foreground">
                            {ci.newValue}
                          </span>
                        </p>
                        <p className="text-xs text-foreground mt-1">
                          {ci.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
