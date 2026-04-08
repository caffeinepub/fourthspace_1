import { s as createLucideIcon, m as useParams, f as useWorkspace, g as getTenantId, e as useActor, aQ as useInternetIdentity, r as reactExports, h as useQuery, o as WorkspaceRole, j as jsxRuntimeExports, B as Button, i as Link, ak as Target, P as Plus, ab as ChevronDown, A as Avatar, q as AvatarFallback, l as createActor } from "./index-BZqaRhAX.js";
import { B as Badge } from "./index--nGTycyb.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-DQu6DGwy.js";
import { I as Input } from "./input-BJtw5f9h.js";
import { L as Label } from "./label-CvyzRjc5.js";
import { T as Textarea } from "./textarea-CZBafaSY.js";
import { u as ue } from "./index-BRf-248B.js";
import { M as MOCK_GOALS, S as STATUS_LABELS, a as STATUS_COLORS } from "./goalData-BuNPhJNp.js";
import { A as ArrowLeft } from "./arrow-left-BCLeiEG1.js";
import { G as Globe } from "./globe-eJv3BneN.js";
import { L as Lock } from "./lock-D4SeUQX2.js";
import { L as LoaderCircle } from "./loader-circle-MfA_AsIp.js";
import { T as TrendingUp } from "./trending-up-Da3p-3P5.js";
import { C as ChevronUp } from "./chevron-up-Dd5ZqoJs.js";
import { L as Link2 } from "./link-2-D7MBFLBt.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h9", key: "t2du7b" }],
  [
    "path",
    {
      d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",
      key: "1ykcvy"
    }
  ]
];
const PenLine = createLucideIcon("pen-line", __iconNode);
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
function UpdateProgressForm({ kr, onSave, onCancel }) {
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
          onClick: () => {
            onSave(Number(value), note);
          },
          "data-ocid": `save-progress-${kr.id}`,
          children: "Save"
        }
      )
    ] })
  ] });
}
function AddKRForm({ onSave, onCancel }) {
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
  const { workspaceId } = useParams({
    from: "/app/$workspaceId/goals/$goalId"
  });
  const { goalId } = useParams({
    from: "/app/$workspaceId/goals/$goalId"
  });
  const { activeWorkspaceId } = useWorkspace();
  const wsId = workspaceId ?? activeWorkspaceId ?? "";
  const tenantId = getTenantId();
  const { actor, isFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const goalData = MOCK_GOALS.find((g) => g.id === goalId) ?? MOCK_GOALS[0];
  const [keyResults, setKeyResults] = reactExports.useState(
    goalData.keyResultList
  );
  const [checkIns, setCheckIns] = reactExports.useState(goalData.checkIns);
  const [showAddKR, setShowAddKR] = reactExports.useState(false);
  const [updatingKR, setUpdatingKR] = reactExports.useState(null);
  const [showCheckIn, setShowCheckIn] = reactExports.useState(false);
  const [checkInNote, setCheckInNote] = reactExports.useState("");
  const [expandedKRs, setExpandedKRs] = reactExports.useState({});
  const [isPublic, setIsPublic] = reactExports.useState(false);
  const [isTogglingPublic, setIsTogglingPublic] = reactExports.useState(false);
  const { data: goalFromBackend } = useQuery({
    queryKey: ["goal", tenantId, wsId, goalId],
    queryFn: async () => {
      if (!actor) return null;
      const res = await actor.getGoal(tenantId, wsId, goalId);
      return res.__kind__ === "ok" ? res.ok : null;
    },
    enabled: !!actor && !isFetching && !!wsId && !!goalId
  });
  reactExports.useEffect(() => {
    if (goalFromBackend) {
      setIsPublic(goalFromBackend.isPublic);
    }
  }, [goalFromBackend]);
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
  async function handleTogglePublic() {
    if (!actor || !wsId) return;
    setIsTogglingPublic(true);
    try {
      const res = await actor.toggleGoalPublic(goalId, wsId, tenantId);
      if (res.__kind__ === "ok") {
        setIsPublic(res.ok.isPublic);
        ue.success(
          res.ok.isPublic ? "Goal is now public — stakeholders can view it" : "Goal is now private"
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
  const overallProgress = keyResults.length > 0 ? Math.round(
    keyResults.reduce(
      (a, kr) => a + Math.min(100, kr.currentValue / (kr.targetValue || 1) * 100),
      0
    ) / keyResults.length
  ) : goalData.progress;
  function handleUpdateProgress(krId, newValue, note) {
    const kr = keyResults.find((k) => k.id === krId);
    if (!kr) return;
    const oldValue = kr.currentValue;
    setKeyResults(
      (prev) => prev.map((k) => k.id === krId ? { ...k, currentValue: newValue } : k)
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
          date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          })
        },
        ...prev
      ]);
    }
    setUpdatingKR(null);
    ue.success("Progress updated");
  }
  function handleAddKR(kr) {
    setKeyResults((prev) => [
      ...prev,
      {
        id: `kr-${Date.now()}`,
        title: kr.title,
        currentValue: 0,
        targetValue: kr.targetValue,
        unit: kr.unit,
        description: kr.description,
        status: "Active"
      }
    ]);
    setShowAddKR(false);
    ue.success("Key result added");
  }
  function handleRecordCheckIn() {
    if (!checkInNote.trim()) {
      ue.error("Please enter a note");
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
        date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        })
      },
      ...prev
    ]);
    setCheckInNote("");
    setShowCheckIn(false);
    ue.success("Check-in recorded");
  }
  function toggleKRExpand(id) {
    setExpandedKRs((prev) => ({ ...prev, [id]: !prev[id] }));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "animate-fade-in-up p-6 space-y-6",
      "data-ocid": "goal-detail-page",
      children: [
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${wsId}/goals`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold tracking-tight text-foreground truncate", children: goalData.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `${STATUS_COLORS[goalData.status]} shrink-0`, children: STATUS_LABELS[goalData.status] }),
              isPublic ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  className: "shrink-0 bg-accent/10 text-accent border-accent/30 gap-1",
                  "data-ocid": "goal-public-badge",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3 w-3" }),
                    "Public"
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  className: "shrink-0 bg-muted text-muted-foreground border-border gap-1",
                  "data-ocid": "goal-private-badge",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3" }),
                    "Private"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              goalData.period,
              " · ",
              goalData.owner
            ] })
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
              "aria-label": isPublic ? "Make goal private" : "Make goal public",
              children: [
                isTogglingPublic ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : isPublic ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3.5 w-3.5" }),
                isPublic ? "Make Private" : "Make Public"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              "aria-label": "Edit goal",
              "data-ocid": "edit-goal-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "h-4 w-4" })
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
          goalData.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-4", children: goalData.description })
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
            keyResults.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
                        Badge,
                        {
                          className: `${STATUS_COLORS[kr.status]} shrink-0 text-xs`,
                          children: STATUS_LABELS[kr.status]
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
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            size: "sm",
                            variant: "outline",
                            className: "text-xs h-7",
                            onClick: () => setUpdatingKR(updatingKR === kr.id ? null : kr.id),
                            "data-ocid": `update-progress-btn-${kr.id}`,
                            children: "Update Progress"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Button,
                          {
                            size: "sm",
                            variant: "ghost",
                            className: "text-xs h-7 text-muted-foreground",
                            onClick: () => ue.info("Task picker coming soon"),
                            "data-ocid": `link-task-btn-${kr.id}`,
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3 w-3 mr-1" }),
                              "Link Task"
                            ]
                          }
                        )
                      ] }),
                      updatingKR === kr.id && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        UpdateProgressForm,
                        {
                          kr,
                          onSave: (v, n) => handleUpdateProgress(kr.id, v, n),
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
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Owner" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: goalData.owner })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Period" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: goalData.period })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Start" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: goalData.startDate })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "End" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: goalData.endDate })
              ] }),
              goalData.contributors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between text-xs gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground shrink-0", children: "Contributors" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground text-right", children: goalData.contributors.join(", ") })
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
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        onClick: handleRecordCheckIn,
                        "data-ocid": "save-checkin-btn",
                        children: "Save"
                      }
                    )
                  ] })
                ] }),
                checkIns.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground py-3 text-center", children: "No check-ins yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 max-h-80 overflow-y-auto", children: checkIns.map((ci) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-start gap-3",
                    "data-ocid": `checkin-${ci.id}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-7 w-7 shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/10 text-primary text-[10px] font-semibold", children: ci.initials }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 text-xs", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: ci.author }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground shrink-0", children: ci.date })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: ci.oldValue }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1", children: "→" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-foreground", children: ci.newValue })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground mt-1", children: ci.note })
                      ] })
                    ]
                  },
                  ci.id
                )) })
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
