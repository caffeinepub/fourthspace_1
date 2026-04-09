import { m as useParams, f as useWorkspace, g as getTenantId, an as useInternetIdentity, n as useQueryClient, r as reactExports, h as useQuery, o as WorkspaceRole, j as jsxRuntimeExports, am as Target, B as Button, i as Link, al as GoalStatus, P as Plus, ao as KRStatus, ac as ChevronDown, A as Avatar, q as AvatarFallback } from "./index-CQ7TXF2a.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-DtVZ2GZq.js";
import { I as Input } from "./input-Dkit6sfw.js";
import { L as Label } from "./label-ANHtprqJ.js";
import { S as Skeleton } from "./skeleton-CzZABium.js";
import { T as Textarea } from "./textarea-CkHQfDFp.js";
import { u as useMutation } from "./useMutation-fGi-GboX.js";
import { u as ue } from "./index-BGFcG_k-.js";
import { u as useBackend } from "./index--h8TKSCt.js";
import { A as ArrowLeft } from "./arrow-left-D6cz-lXM.js";
import { G as Globe } from "./globe-CFCJUvx_.js";
import { L as Lock } from "./lock-CkJjGu7l.js";
import { L as LoaderCircle } from "./loader-circle-CcnovRzn.js";
import { T as TrendingUp } from "./trending-up-BY9OgvcY.js";
import { C as ChevronUp } from "./chevron-up-56u9dcHi.js";
import { L as Link2 } from "./link-2-Vn75IhwF.js";
const GOAL_STATUS_COLORS = {
  [GoalStatus.Active]: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400",
  [GoalStatus.OnHold]: "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-800",
  [GoalStatus.Completed]: "bg-muted text-muted-foreground border-border",
  [GoalStatus.Cancelled]: "bg-destructive/10 text-destructive border-destructive/20"
};
const GOAL_STATUS_LABELS = {
  [GoalStatus.Active]: "Active",
  [GoalStatus.OnHold]: "On Hold",
  [GoalStatus.Completed]: "Completed",
  [GoalStatus.Cancelled]: "Cancelled"
};
const KR_STATUS_COLORS = {
  [KRStatus.OnTrack]: "bg-accent/10 text-accent border-accent/20",
  [KRStatus.Behind]: "bg-destructive/10 text-destructive border-destructive/20",
  [KRStatus.Completed]: "bg-muted text-muted-foreground border-border",
  [KRStatus.AtRisk]: "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-800"
};
const KR_STATUS_LABELS = {
  [KRStatus.OnTrack]: "On Track",
  [KRStatus.Behind]: "Behind",
  [KRStatus.Completed]: "Completed",
  [KRStatus.AtRisk]: "At Risk"
};
function KRProgressBar({
  current,
  target
}) {
  const pct = target > 0 ? Math.min(100, Math.round(current / target * 100)) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-1.5 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "h-full rounded-full bg-accent transition-all duration-500",
      style: { width: `${pct}%` }
    }
  ) });
}
function UpdateProgressForm({
  kr,
  onSave,
  onCancel
}) {
  const [value, setValue] = reactExports.useState(String(kr.currentValue));
  const [note, setNote] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3 mt-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "Update Progress" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
          "New Value (",
          kr.unit,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            value,
            onChange: (e) => setValue(e.target.value),
            className: "h-8 text-sm",
            "data-ocid": `update-value-${kr.id}`
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Target" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-8 flex items-center text-sm text-muted-foreground font-mono", children: [
          kr.targetValue,
          " ",
          kr.unit
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Note (optional)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          placeholder: "What progress was made?",
          value: note,
          onChange: (e) => setNote(e.target.value),
          rows: 2,
          className: "resize-none text-sm",
          "data-ocid": `update-note-${kr.id}`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: onCancel, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          onClick: () => onSave(Number(value), note),
          "data-ocid": `save-progress-${kr.id}`,
          children: "Save"
        }
      )
    ] })
  ] });
}
function AddKRForm({
  onSave,
  onCancel
}) {
  const [title, setTitle] = reactExports.useState("");
  const [targetValue, setTargetValue] = reactExports.useState("");
  const [unit, setUnit] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  function handleSave() {
    if (!title.trim()) {
      ue.error("Title is required");
      return;
    }
    onSave({ title, targetValue: Number(targetValue), unit, description });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-border bg-muted/20 p-4 space-y-3",
      "data-ocid": "add-kr-form",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "New Key Result" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Describe the measurable outcome…",
            value: title,
            onChange: (e) => setTitle(e.target.value),
            className: "text-sm",
            "data-ocid": "new-kr-title"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Target Value" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                value: targetValue,
                onChange: (e) => setTargetValue(e.target.value),
                className: "h-8 text-sm",
                "data-ocid": "new-kr-target"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Unit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "%, $, deals…",
                value: unit,
                onChange: (e) => setUnit(e.target.value),
                className: "h-8 text-sm",
                "data-ocid": "new-kr-unit"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "How will it be measured?",
              value: description,
              onChange: (e) => setDescription(e.target.value),
              className: "text-sm",
              "data-ocid": "new-kr-desc"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: onCancel, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: handleSave, "data-ocid": "save-kr-btn", children: "Add" })
        ] })
      ]
    }
  );
}
function GoalDetailPage() {
  var _a;
  const { workspaceId, goalId } = useParams({
    from: "/app/$workspaceId/goals/$goalId"
  });
  const { activeWorkspaceId } = useWorkspace();
  const wsId = workspaceId ?? activeWorkspaceId ?? "";
  const tenantId = getTenantId();
  const { actor, isFetching } = useBackend();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [showAddKR, setShowAddKR] = reactExports.useState(false);
  const [updatingKR, setUpdatingKR] = reactExports.useState(null);
  const [showCheckIn, setShowCheckIn] = reactExports.useState(false);
  const [checkInNote, setCheckInNote] = reactExports.useState("");
  const [expandedKRs, setExpandedKRs] = reactExports.useState({});
  const [isTogglingPublic, setIsTogglingPublic] = reactExports.useState(false);
  const { data: goal, isLoading: goalLoading } = useQuery({
    queryKey: ["goal", tenantId, wsId, goalId],
    queryFn: async () => {
      if (!actor) return null;
      const res = await actor.getGoal(tenantId, wsId, goalId);
      return res.__kind__ === "ok" ? res.ok : null;
    },
    enabled: !!actor && !isFetching && !!wsId && !!goalId
  });
  const { data: keyResults = [], isLoading: krLoading } = useQuery(
    {
      queryKey: ["keyResults", tenantId, wsId, goalId],
      queryFn: async () => {
        if (!actor) return [];
        return actor.listKeyResults(tenantId, wsId, goalId);
      },
      enabled: !!actor && !isFetching && !!wsId && !!goalId
    }
  );
  const { data: checkIns = [], isLoading: ciLoading } = useQuery(
    {
      queryKey: ["checkIns", tenantId, wsId, goalId],
      queryFn: async () => {
        if (!actor) return [];
        return actor.listCheckIns(tenantId, wsId, goalId);
      },
      enabled: !!actor && !isFetching && !!wsId && !!goalId
    }
  );
  const { data: members = [] } = useQuery({
    queryKey: ["workspaceMembers", tenantId, wsId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaceMembers(tenantId, wsId);
    },
    enabled: !!actor && !isFetching && !!wsId
  });
  const currentPrincipal = ((_a = identity == null ? void 0 : identity.getPrincipal()) == null ? void 0 : _a.toText()) ?? "";
  const currentMember = members.find(
    (m) => m.userId.toString() === currentPrincipal
  );
  const canTogglePublic = (currentMember == null ? void 0 : currentMember.role) === WorkspaceRole.Admin || (currentMember == null ? void 0 : currentMember.role) === WorkspaceRole.Manager;
  const sortedCheckIns = [...checkIns].sort(
    (a, b) => Number(b.timestamp - a.timestamp)
  );
  const overallProgress = keyResults.length > 0 ? Math.round(
    keyResults.reduce(
      (a, kr) => a + Math.min(100, kr.currentValue / (kr.targetValue || 1) * 100),
      0
    ) / keyResults.length
  ) : (goal == null ? void 0 : goal.progress) ?? 0;
  const addKRMutation = useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      const res = await actor.addKeyResult(tenantId, wsId, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["keyResults", tenantId, wsId, goalId]
      });
      queryClient.invalidateQueries({
        queryKey: ["goal", tenantId, wsId, goalId]
      });
      setShowAddKR(false);
      ue.success("Key result added");
    },
    onError: (err) => ue.error(err.message || "Failed to add key result")
  });
  const updateKRMutation = useMutation({
    mutationFn: async ({
      krId,
      newValue,
      status
    }) => {
      if (!actor) throw new Error("Not connected");
      const res = await actor.updateKeyResult(
        tenantId,
        wsId,
        krId,
        newValue,
        status
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["keyResults", tenantId, wsId, goalId]
      });
      queryClient.invalidateQueries({
        queryKey: ["goal", tenantId, wsId, goalId]
      });
      setUpdatingKR(null);
      ue.success("Progress updated");
    },
    onError: (err) => ue.error(err.message || "Failed to update progress")
  });
  const recordCheckInMutation = useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      const res = await actor.recordCheckIn(tenantId, wsId, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checkIns", tenantId, wsId, goalId]
      });
      setCheckInNote("");
      setShowCheckIn(false);
      ue.success("Check-in recorded");
    },
    onError: (err) => ue.error(err.message || "Failed to record check-in")
  });
  async function handleTogglePublic() {
    if (!actor || !wsId) return;
    setIsTogglingPublic(true);
    try {
      const res = await actor.toggleGoalPublic(goalId, wsId, tenantId);
      if (res.__kind__ === "ok") {
        queryClient.invalidateQueries({
          queryKey: ["goal", tenantId, wsId, goalId]
        });
        ue.success(
          res.ok.isPublic ? "Goal is now public" : "Goal is now private"
        );
      } else {
        ue.error(res.err ?? "Failed to update visibility");
      }
    } catch {
      ue.error("Something went wrong");
    } finally {
      setIsTogglingPublic(false);
    }
  }
  function handleUpdateProgress(kr, newValue, note) {
    const newStatus = kr.targetValue > 0 && newValue >= kr.targetValue ? KRStatus.Completed : kr.status;
    updateKRMutation.mutate({ krId: kr.id, newValue, status: newStatus });
    if (note.trim()) {
      recordCheckInMutation.mutate({ goalId, krId: kr.id, newValue, note });
    }
  }
  function handleAddKR(kr) {
    addKRMutation.mutate({
      goalId,
      title: kr.title,
      targetValue: kr.targetValue,
      unit: kr.unit,
      description: kr.description || void 0
    });
  }
  function handleRecordCheckIn() {
    if (!checkInNote.trim()) {
      ue.error("Please enter a note");
      return;
    }
    recordCheckInMutation.mutate({
      goalId,
      newValue: overallProgress,
      note: checkInNote
    });
  }
  function toggleKRExpand(id) {
    setExpandedKRs((prev) => ({ ...prev, [id]: !prev[id] }));
  }
  if (goalLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-64" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full rounded-xl" })
    ] });
  }
  if (!goal) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 flex flex-col items-center justify-center py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-12 w-12 text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Goal not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "mt-4", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/app/${wsId}/goals`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        " Back to Goals"
      ] }) })
    ] });
  }
  const statusColor = GOAL_STATUS_COLORS[goal.status] ?? GOAL_STATUS_COLORS[GoalStatus.Active];
  const statusLabel = GOAL_STATUS_LABELS[goal.status] ?? "Active";
  const periodLabel = goal.period || new Date(Number(goal.endDate) / 1e6).getFullYear().toString();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "animate-fade-in-up p-4 sm:p-6 space-y-6 pb-20 md:pb-6",
      "data-ocid": "goal-detail-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${wsId}/goals`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold tracking-tight text-foreground truncate", children: goal.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border shrink-0 ${statusColor}`,
                  children: statusLabel
                }
              ),
              goal.isPublic ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border bg-accent/10 text-accent border-accent/30 shrink-0",
                  "data-ocid": "goal-public-badge",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3 w-3" }),
                    " Public"
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border bg-muted text-muted-foreground border-border shrink-0",
                  "data-ocid": "goal-private-badge",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3" }),
                    " Private"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: periodLabel })
          ] }),
          canTogglePublic && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: handleTogglePublic,
              disabled: isTogglingPublic,
              className: "shrink-0 gap-1.5 text-xs",
              "data-ocid": "goal-toggle-public-btn",
              children: [
                isTogglingPublic ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : goal.isPublic ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3.5 w-3.5" }),
                goal.isPublic ? "Make Private" : "Make Public"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card rounded-xl border border-border/50 bg-gradient-to-br from-primary/5 to-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-6 py-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Overall Progress" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-5xl font-display font-bold text-foreground mt-1 font-mono tabular-nums", children: [
                overallProgress,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-8 w-8 text-primary" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full rounded-full bg-primary transition-all duration-500",
              style: { width: `${Math.min(100, overallProgress)}%` }
            }
          ) }),
          goal.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-4", children: goal.description })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground", children: "Key Results" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => setShowAddKR((v) => !v),
                  "data-ocid": "add-kr-trigger",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1.5" }),
                    "Add Key Result"
                  ]
                }
              )
            ] }),
            showAddKR && /* @__PURE__ */ jsxRuntimeExports.jsx(
              AddKRForm,
              {
                onSave: handleAddKR,
                onCancel: () => setShowAddKR(false)
              }
            ),
            krLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" }, n)) }) : keyResults.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center py-10 gap-3 rounded-xl border border-dashed border-border",
                "data-ocid": "no-krs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-8 w-8 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No key results yet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      onClick: () => setShowAddKR(true),
                      children: "Add First Key Result"
                    }
                  )
                ]
              }
            ) : keyResults.map((kr) => {
              const pct = kr.targetValue > 0 ? Math.min(
                100,
                Math.round(kr.currentValue / kr.targetValue * 100)
              ) : 0;
              const isExpanded = expandedKRs[kr.id];
              const krStatusColor = KR_STATUS_COLORS[kr.status] ?? KR_STATUS_COLORS[KRStatus.OnTrack];
              const krStatusLabel = KR_STATUS_LABELS[kr.status] ?? "On Track";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Card,
                {
                  className: "shadow-card rounded-xl border border-border/50 bg-card hover:border-accent/30 transition-colors",
                  "data-ocid": `kr-card-${kr.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5 text-accent" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            className: "text-sm font-semibold text-foreground text-left hover:text-primary transition-colors w-full",
                            onClick: () => toggleKRExpand(kr.id),
                            children: kr.title
                          }
                        ),
                        kr.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: kr.description })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border shrink-0 ${krStatusColor}`,
                          children: krStatusLabel
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => toggleKRExpand(kr.id),
                          className: "text-muted-foreground hover:text-foreground shrink-0",
                          children: isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
                        }
                      )
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-5 pb-4 space-y-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-foreground", children: kr.currentValue }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1 text-muted-foreground", children: "/" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                              kr.targetValue,
                              " ",
                              kr.unit
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold text-foreground", children: [
                            pct,
                            "%"
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          KRProgressBar,
                          {
                            current: kr.currentValue,
                            target: kr.targetValue
                          }
                        )
                      ] }),
                      isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Button,
                          {
                            size: "sm",
                            variant: "outline",
                            className: "text-xs h-7",
                            onClick: () => setUpdatingKR(updatingKR === kr.id ? null : kr.id),
                            "data-ocid": `update-progress-btn-${kr.id}`,
                            disabled: updateKRMutation.isPending,
                            children: [
                              updateKRMutation.isPending && updatingKR === kr.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin mr-1" }) : null,
                              "Update Progress"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            size: "sm",
                            variant: "ghost",
                            className: "text-xs h-7 text-muted-foreground",
                            asChild: true,
                            "data-ocid": `link-task-btn-${kr.id}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/app/${wsId}/projects`, children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3 w-3 mr-1" }),
                              "Link Task"
                            ] })
                          }
                        )
                      ] }),
                      updatingKR === kr.id && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        UpdateProgressForm,
                        {
                          kr,
                          onSave: (v, n) => handleUpdateProgress(kr, v, n),
                          onCancel: () => setUpdatingKR(null)
                        }
                      )
                    ] })
                  ]
                },
                kr.id
              );
            })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-4 py-4 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${statusColor}`,
                    children: statusLabel
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Period" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: periodLabel })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Start" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: new Date(
                  Number(goal.startDate) / 1e6
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "End" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: new Date(
                  Number(goal.endDate) / 1e6
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Key Results" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: keyResults.length })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Check-in History" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "h-7 text-xs",
                    onClick: () => setShowCheckIn((v) => !v),
                    "data-ocid": "record-checkin-btn",
                    disabled: recordCheckInMutation.isPending,
                    children: "Record"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
                showCheckIn && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-xl border border-border bg-muted/20 p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      placeholder: "What progress was made since last check-in?",
                      value: checkInNote,
                      onChange: (e) => setCheckInNote(e.target.value),
                      rows: 2,
                      className: "resize-none text-sm",
                      "data-ocid": "checkin-note-input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "sm",
                        onClick: () => {
                          setShowCheckIn(false);
                          setCheckInNote("");
                        },
                        children: "Cancel"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        onClick: handleRecordCheckIn,
                        disabled: recordCheckInMutation.isPending,
                        "data-ocid": "save-checkin-btn",
                        children: [
                          recordCheckInMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin mr-1" }) : null,
                          "Save"
                        ]
                      }
                    )
                  ] })
                ] }),
                ciLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, n)) }) : sortedCheckIns.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground py-3 text-center", children: "No check-ins yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 max-h-80 overflow-y-auto", children: sortedCheckIns.map((ci) => {
                  const tsMs = Number(ci.timestamp) / 1e6;
                  const dateStr = new Date(tsMs).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  });
                  const authorShort = ci.userId.toString().slice(0, 8);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-start gap-3",
                      "data-ocid": `checkin-${ci.id}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-7 w-7 shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/10 text-primary text-[10px] font-semibold", children: authorShort.slice(0, 2).toUpperCase() }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 text-xs", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-muted-foreground truncate", children: [
                              authorShort,
                              "…"
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground shrink-0", children: dateStr })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: ci.previousValue }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1", children: "→" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-foreground", children: ci.newValue })
                          ] }),
                          ci.note && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground mt-1", children: ci.note })
                        ] })
                      ]
                    },
                    ci.id
                  );
                }) })
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  GoalDetailPage as default
};
