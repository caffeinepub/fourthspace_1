import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Loader2,
  Plus,
  Target,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { GoalInput, KeyResultInput, WorkspaceMember } from "../../backend";
import { GoalStatus } from "../../backend";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import type { OKRTemplate } from "./goalData";
import { OKR_TEMPLATES } from "./goalData";

const GOAL_STATUSES: { value: GoalStatus; label: string }[] = [
  { value: GoalStatus.Active, label: "Active" },
  { value: GoalStatus.OnHold, label: "On Hold" },
  { value: GoalStatus.Completed, label: "Completed" },
  { value: GoalStatus.Cancelled, label: "Cancelled" },
];

interface LocalKR {
  id: string;
  title: string;
  targetValue: string;
  unit: string;
  description: string;
}

function KRRow({
  kr,
  onChange,
  onRemove,
}: { kr: LocalKR; onChange: (u: LocalKR) => void; onRemove: () => void }) {
  return (
    <div
      className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3"
      data-ocid={`kr-row-${kr.id}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Key Result
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
          aria-label="Remove key result"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
      <Input
        placeholder="Describe the measurable outcome…"
        value={kr.title}
        onChange={(e) => onChange({ ...kr, title: e.target.value })}
        className="text-sm"
        data-ocid={`kr-title-${kr.id}`}
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Target Value
          </Label>
          <Input
            placeholder="e.g. 100"
            value={kr.targetValue}
            onChange={(e) => onChange({ ...kr, targetValue: e.target.value })}
            type="number"
            className="text-sm"
            data-ocid={`kr-target-${kr.id}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Unit
          </Label>
          <Input
            placeholder="e.g. %, deals, $"
            value={kr.unit}
            onChange={(e) => onChange({ ...kr, unit: e.target.value })}
            className="text-sm"
            data-ocid={`kr-unit-${kr.id}`}
          />
        </div>
      </div>
    </div>
  );
}

function TemplateCard({
  tmpl,
  onApply,
}: { tmpl: OKRTemplate; onApply: (t: OKRTemplate) => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl border border-border/50 bg-card shadow-card p-4 space-y-2 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 shrink-0 mb-1"
          >
            {tmpl.category}
          </Badge>
          <p className="text-sm font-semibold text-foreground line-clamp-2">
            {tmpl.name}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 text-xs h-7 active-press"
          onClick={() => onApply(tmpl)}
          data-ocid={`apply-template-${tmpl.id}`}
        >
          <Check className="h-3 w-3 mr-1" />
          Use
        </Button>
      </div>
      <button
        type="button"
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
        {tmpl.suggestedKRs.length} key results
      </button>
      {expanded && (
        <ul className="space-y-1 pl-1">
          {tmpl.suggestedKRs.map((kr) => (
            <li
              key={kr.title}
              className="flex items-start gap-2 text-xs text-muted-foreground"
            >
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>{kr.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function GoalNewPage() {
  const { activeWorkspaceId } = useWorkspace();
  const wsId = activeWorkspaceId ?? "";
  const tenantId = getTenantId();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contributorIds, setContributorIds] = useState<string[]>([]);
  const [period, setPeriod] = useState("Q2 2026");
  const [startDate, setStartDate] = useState("2026-04-01");
  const [endDate, setEndDate] = useState("2026-06-30");
  const [goalStatus, setGoalStatus] = useState<GoalStatus>(GoalStatus.Active);
  const [keyResults, setKeyResults] = useState<LocalKR[]>([]);
  const [showTemplates, setShowTemplates] = useState(true);
  const [appliedTemplate, setAppliedTemplate] = useState<string | null>(null);

  // Load workspace members for owner/contributor picker
  const { data: members = [] } = useQuery<WorkspaceMember[]>({
    queryKey: ["workspaceMembers", tenantId, wsId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaceMembers(tenantId, wsId);
    },
    enabled: !!actor && !isFetching && !!wsId,
  });

  const createGoalMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!title.trim()) throw new Error("Goal title is required");
      const startTs = BigInt(new Date(startDate).getTime() * 1_000_000);
      const endTs = BigInt(new Date(endDate).getTime() * 1_000_000);
      const input: GoalInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        period,
        startDate: startTs,
        endDate: endTs,
        contributorIds: contributorIds as unknown as Array<
          import("../../backend").UserId
        >,
      };
      const goalRes = await actor.createGoal(tenantId, wsId, input);
      if (goalRes.__kind__ === "err") throw new Error(goalRes.err);
      const goal = goalRes.ok;

      // Add key results sequentially
      for (const kr of keyResults) {
        if (!kr.title.trim()) continue;
        const krInput: KeyResultInput = {
          goalId: goal.id,
          title: kr.title.trim(),
          targetValue: Number(kr.targetValue) || 0,
          unit: kr.unit,
          description: kr.description.trim() || undefined,
        };
        await actor.addKeyResult(tenantId, wsId, krInput);
      }
      return goal;
    },
    onSuccess: (goal) => {
      toast.success("Goal created successfully");
      void navigate({ to: `/app/${wsId}/goals/${goal.id}` as "/" });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to create goal"),
  });

  function addKR() {
    setKeyResults((prev) => [
      ...prev,
      {
        id: `kr-${Date.now()}`,
        title: "",
        targetValue: "",
        unit: "",
        description: "",
      },
    ]);
  }

  function applyTemplate(tmpl: OKRTemplate) {
    setTitle(tmpl.title);
    setDescription(tmpl.description);
    setPeriod(tmpl.period);
    setKeyResults(
      tmpl.suggestedKRs.map((kr, i) => ({
        id: `kr-tmpl-${i}`,
        title: kr.title,
        targetValue: String(kr.targetValue),
        unit: kr.unit,
        description: kr.description,
      })),
    );
    setAppliedTemplate(tmpl.id);
    setShowTemplates(false);
    toast.success(`Template "${tmpl.name}" applied`);
  }

  function handleSubmit() {
    if (!title.trim()) {
      toast.error("Please enter a goal title");
      return;
    }
    createGoalMutation.mutate();
  }

  return (
    <div
      className="animate-fade-in-up p-4 sm:p-6 space-y-6 pb-20 md:pb-6"
      data-ocid="goal-new-page"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/app/${wsId}/goals` as "/"}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-display font-bold tracking-tight text-foreground">
            New Goal
          </h1>
          <p className="text-sm text-muted-foreground">
            Define an objective and the key results that will measure success
          </p>
        </div>
      </div>

      {/* Templates */}
      <div className="rounded-xl border border-border/50 bg-card shadow-card overflow-hidden">
        <button
          type="button"
          className="flex w-full items-center gap-2 px-5 py-3 hover:bg-muted/40 transition-colors text-left"
          onClick={() => setShowTemplates((v) => !v)}
          data-ocid="templates-toggle"
        >
          <Lightbulb className="h-4 w-4 text-secondary shrink-0" />
          <span className="text-sm font-semibold text-foreground flex-1">
            Start from an OKR template
          </span>
          {appliedTemplate && (
            <Badge className="bg-accent/10 text-accent border-accent/20 text-xs mr-2">
              Applied
            </Badge>
          )}
          {showTemplates ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {showTemplates && (
          <div className="px-4 pb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 border-t border-border/40 pt-4">
            {OKR_TEMPLATES.map((t) => (
              <TemplateCard key={t.id} tmpl={t} onApply={applyTemplate} />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card rounded-xl border border-border/50 bg-card">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                <Target className="h-4 w-4 text-primary" />
                Objective
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="goal-title"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  Title *
                </Label>
                <Input
                  id="goal-title"
                  placeholder="What do you want to achieve?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  data-ocid="goal-title-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="goal-description"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  Description
                </Label>
                <Textarea
                  id="goal-description"
                  placeholder="Provide context, motivation, and success criteria…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="resize-none"
                  data-ocid="goal-description-input"
                />
              </div>
            </CardContent>
          </Card>

          {/* Key Results */}
          <Card className="shadow-card rounded-xl border border-border/50 bg-card">
            <CardHeader className="pb-3 border-b border-border/40">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  Key Results ({keyResults.length})
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addKR}
                  data-ocid="add-kr-btn"
                  className="active-press"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Key Result
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {keyResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3 rounded-xl border border-dashed border-border">
                  <p className="text-sm text-muted-foreground">
                    No key results yet
                  </p>
                  <Button size="sm" variant="outline" onClick={addKR}>
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Add Key Result
                  </Button>
                </div>
              ) : (
                keyResults.map((kr) => (
                  <KRRow
                    key={kr.id}
                    kr={kr}
                    onChange={(updated) =>
                      setKeyResults((prev) =>
                        prev.map((k) => (k.id === kr.id ? updated : k)),
                      )
                    }
                    onRemove={() =>
                      setKeyResults((prev) =>
                        prev.filter((k) => k.id !== kr.id),
                      )
                    }
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="shadow-card rounded-xl border border-border/50 bg-card">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-sm font-semibold">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Contributors
                </Label>
                {members.length > 0 ? (
                  <div
                    className="flex flex-wrap gap-1.5"
                    data-ocid="contributors-picker"
                  >
                    {members.map((m) => {
                      const id = m.userId.toString();
                      const isSelected = contributorIds.includes(id);
                      const firstName = m.displayName.split(" ")[0];
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() =>
                            setContributorIds((prev) =>
                              prev.includes(id)
                                ? prev.filter((x) => x !== id)
                                : [...prev, id],
                            )
                          }
                          className={`rounded-full px-2.5 py-1 text-xs font-medium border transition-colors ${isSelected ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/50"}`}
                        >
                          {firstName}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No members found
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="goal-period"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  Period
                </Label>
                <Input
                  id="goal-period"
                  placeholder="e.g. Q2 2026"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  data-ocid="goal-period-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="goal-start"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Start
                  </Label>
                  <Input
                    id="goal-start"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    data-ocid="goal-start-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="goal-end"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    End
                  </Label>
                  <Input
                    id="goal-end"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    data-ocid="goal-end-input"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="goal-status"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  Status
                </Label>
                <Select
                  value={goalStatus}
                  onValueChange={(v) => setGoalStatus(v as GoalStatus)}
                >
                  <SelectTrigger
                    id="goal-status"
                    data-ocid="goal-status-select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GOAL_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button
              className="w-full active-press"
              onClick={handleSubmit}
              disabled={createGoalMutation.isPending}
              data-ocid="create-goal-btn"
            >
              {createGoalMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {createGoalMutation.isPending ? "Creating…" : "Create Goal"}
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link to={`/app/${wsId}/goals` as "/"}>Cancel</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
