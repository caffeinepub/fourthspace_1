import { t as createLucideIcon, f as useWorkspace, g as getTenantId, d as useNavigate, r as reactExports, al as GoalStatus, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, ac as ChevronDown, am as Target, P as Plus, C as Check, X } from "./index-CQ7TXF2a.js";
import { B as Badge } from "./badge-DOwzzuc_.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DtVZ2GZq.js";
import { I as Input } from "./input-Dkit6sfw.js";
import { L as Label } from "./label-ANHtprqJ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C1Xsy-LN.js";
import { T as Textarea } from "./textarea-CkHQfDFp.js";
import { u as useMutation } from "./useMutation-fGi-GboX.js";
import { u as ue } from "./index-BGFcG_k-.js";
import { u as useBackend } from "./index--h8TKSCt.js";
import { A as ArrowLeft } from "./arrow-left-D6cz-lXM.js";
import { C as ChevronUp } from "./chevron-up-56u9dcHi.js";
import { L as LoaderCircle } from "./loader-circle-CcnovRzn.js";
import "./index-IXOTxK3N.js";
import "./index-CkN0xm2T.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb"
    }
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }]
];
const Lightbulb = createLucideIcon("lightbulb", __iconNode);
const OKR_TEMPLATES = [
  {
    id: "tmpl-eng",
    name: "Engineering OKR",
    category: "Engineering",
    title: "Improve Engineering Velocity and Quality",
    description: "Drive faster, higher-quality delivery through better practices, tooling, and team health.",
    period: "Q2 2026",
    suggestedKRs: [
      {
        title: "Achieve deployment frequency of 5+ deploys per day",
        targetValue: 5,
        unit: "deploys/day",
        description: "Track via CI/CD pipeline metrics"
      },
      {
        title: "Reduce P0 incidents to under 2 per quarter",
        targetValue: 2,
        unit: "incidents",
        description: "Customer-facing outages > 15 minutes"
      },
      {
        title: "Increase test coverage from 60% to 85%",
        targetValue: 85,
        unit: "%",
        description: "Unit + integration tests across all services"
      },
      {
        title: "Reduce average PR review time to under 4 hours",
        targetValue: 4,
        unit: "hours",
        description: "Measured from PR open to first review"
      }
    ]
  },
  {
    id: "tmpl-mkt",
    name: "Marketing OKR",
    category: "Marketing",
    title: "Drive Qualified Pipeline Through Organic and Paid Channels",
    description: "Scale demand generation to deliver high-quality leads and reduce customer acquisition cost.",
    period: "Q2 2026",
    suggestedKRs: [
      {
        title: "Increase MQLs from 500 to 1,200 per month",
        targetValue: 1200,
        unit: "MQLs/mo",
        description: "Measured from CRM inbound"
      },
      {
        title: "Grow organic traffic by 120%",
        targetValue: 120,
        unit: "% growth",
        description: "Track via Google Analytics"
      },
      {
        title: "Launch 3 high-converting landing pages",
        targetValue: 3,
        unit: "pages",
        description: "Each must achieve > 5% CVR"
      },
      {
        title: "Reduce CAC from $480 to $300",
        targetValue: 300,
        unit: "$ CAC",
        description: "Blended acquisition cost"
      }
    ]
  },
  {
    id: "tmpl-sales",
    name: "Sales OKR",
    category: "Sales",
    title: "Hit $2M ARR by End of Quarter",
    description: "Close high-value accounts, improve win rate, and shorten the sales cycle to hit our revenue milestone.",
    period: "Q2 2026",
    suggestedKRs: [
      {
        title: "Close $2M in new ARR",
        targetValue: 2e6,
        unit: "$",
        description: "Net new ARR excluding expansions"
      },
      {
        title: "Improve win rate from 18% to 28%",
        targetValue: 28,
        unit: "%",
        description: "Opportunities created this quarter"
      },
      {
        title: "Reduce average sales cycle from 45 to 28 days",
        targetValue: 28,
        unit: "days",
        description: "From first demo to signed contract"
      },
      {
        title: "Achieve 100% CRM data completeness on active deals",
        targetValue: 100,
        unit: "%",
        description: "All required fields populated"
      }
    ]
  },
  {
    id: "tmpl-product",
    name: "Product OKR",
    category: "Product",
    title: "Deliver Features That Drive Activation and Retention",
    description: "Ship high-impact product improvements that increase user activation and reduce churn through better product-market fit.",
    period: "Q2 2026",
    suggestedKRs: [
      {
        title: "Increase activation rate (day 7) from 32% to 50%",
        targetValue: 50,
        unit: "%",
        description: "Users completing core onboarding flow"
      },
      {
        title: "Ship 3 retention-driving features based on churn interviews",
        targetValue: 3,
        unit: "features",
        description: "Validated by at-risk customer feedback"
      },
      {
        title: "Reduce time-to-first-value from 14 min to 5 min",
        targetValue: 5,
        unit: "minutes",
        description: "From signup to first meaningful action"
      },
      {
        title: "Achieve NPS of 45+ from active users",
        targetValue: 45,
        unit: "NPS",
        description: "Survey users with 7+ days activity"
      }
    ]
  },
  {
    id: "tmpl-hr",
    name: "HR OKR",
    category: "People & HR",
    title: "Build a High-Performing, Inclusive Workplace",
    description: "Improve hiring velocity, reduce turnover, and build programs that make this workspace a destination employer.",
    period: "Q2 2026",
    suggestedKRs: [
      {
        title: "Hire 8 open positions with avg. offer acceptance rate of 85%+",
        targetValue: 8,
        unit: "hires",
        description: "Track from offer sent to signed"
      },
      {
        title: "Reduce voluntary turnover from 18% to 10% annualized",
        targetValue: 10,
        unit: "%",
        description: "Rolling 12-month voluntary attrition"
      },
      {
        title: "Achieve employee engagement score of 75+ (eNPS)",
        targetValue: 75,
        unit: "eNPS",
        description: "Company-wide quarterly survey"
      },
      {
        title: "Launch leadership development program with 100% manager participation",
        targetValue: 100,
        unit: "%",
        description: "All people managers enrolled"
      }
    ]
  }
];
const GOAL_STATUSES = [
  { value: GoalStatus.Active, label: "Active" },
  { value: GoalStatus.OnHold, label: "On Hold" },
  { value: GoalStatus.Completed, label: "Completed" },
  { value: GoalStatus.Cancelled, label: "Cancelled" }
];
function KRRow({
  kr,
  onChange,
  onRemove
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3",
      "data-ocid": `kr-row-${kr.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Key Result" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-6 w-6 text-muted-foreground hover:text-destructive",
              onClick: onRemove,
              "aria-label": "Remove key result",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Describe the measurable outcome…",
            value: kr.title,
            onChange: (e) => onChange({ ...kr, title: e.target.value }),
            className: "text-sm",
            "data-ocid": `kr-title-${kr.id}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Target Value" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. 100",
                value: kr.targetValue,
                onChange: (e) => onChange({ ...kr, targetValue: e.target.value }),
                type: "number",
                className: "text-sm",
                "data-ocid": `kr-target-${kr.id}`
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Unit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. %, deals, $",
                value: kr.unit,
                onChange: (e) => onChange({ ...kr, unit: e.target.value }),
                className: "text-sm",
                "data-ocid": `kr-unit-${kr.id}`
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function TemplateCard({
  tmpl,
  onApply
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/50 bg-card shadow-card p-4 space-y-2 hover:border-primary/30 transition-colors", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: "text-[10px] px-1.5 py-0 shrink-0 mb-1",
            children: tmpl.category
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground line-clamp-2", children: tmpl.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          variant: "outline",
          className: "shrink-0 text-xs h-7 active-press",
          onClick: () => onApply(tmpl),
          "data-ocid": `apply-template-${tmpl.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 mr-1" }),
            "Use"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: "flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors",
        onClick: () => setExpanded((v) => !v),
        children: [
          expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" }),
          tmpl.suggestedKRs.length,
          " key results"
        ]
      }
    ),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1 pl-1", children: tmpl.suggestedKRs.map((kr) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "li",
      {
        className: "flex items-start gap-2 text-xs text-muted-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: kr.title })
        ]
      },
      kr.title
    )) })
  ] });
}
function GoalNewPage() {
  const { activeWorkspaceId } = useWorkspace();
  const wsId = activeWorkspaceId ?? "";
  const tenantId = getTenantId();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [contributorIds, setContributorIds] = reactExports.useState([]);
  const [period, setPeriod] = reactExports.useState("Q2 2026");
  const [startDate, setStartDate] = reactExports.useState("2026-04-01");
  const [endDate, setEndDate] = reactExports.useState("2026-06-30");
  const [goalStatus, setGoalStatus] = reactExports.useState(GoalStatus.Active);
  const [keyResults, setKeyResults] = reactExports.useState([]);
  const [showTemplates, setShowTemplates] = reactExports.useState(true);
  const [appliedTemplate, setAppliedTemplate] = reactExports.useState(null);
  const { data: members = [] } = useQuery({
    queryKey: ["workspaceMembers", tenantId, wsId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaceMembers(tenantId, wsId);
    },
    enabled: !!actor && !isFetching && !!wsId
  });
  const createGoalMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!title.trim()) throw new Error("Goal title is required");
      const startTs = BigInt(new Date(startDate).getTime() * 1e6);
      const endTs = BigInt(new Date(endDate).getTime() * 1e6);
      const input = {
        title: title.trim(),
        description: description.trim() || void 0,
        period,
        startDate: startTs,
        endDate: endTs,
        contributorIds
      };
      const goalRes = await actor.createGoal(tenantId, wsId, input);
      if (goalRes.__kind__ === "err") throw new Error(goalRes.err);
      const goal = goalRes.ok;
      for (const kr of keyResults) {
        if (!kr.title.trim()) continue;
        const krInput = {
          goalId: goal.id,
          title: kr.title.trim(),
          targetValue: Number(kr.targetValue) || 0,
          unit: kr.unit,
          description: kr.description.trim() || void 0
        };
        await actor.addKeyResult(tenantId, wsId, krInput);
      }
      return goal;
    },
    onSuccess: (goal) => {
      ue.success("Goal created successfully");
      void navigate({ to: `/app/${wsId}/goals/${goal.id}` });
    },
    onError: (err) => ue.error(err.message || "Failed to create goal")
  });
  function addKR() {
    setKeyResults((prev) => [
      ...prev,
      {
        id: `kr-${Date.now()}`,
        title: "",
        targetValue: "",
        unit: "",
        description: ""
      }
    ]);
  }
  function applyTemplate(tmpl) {
    setTitle(tmpl.title);
    setDescription(tmpl.description);
    setPeriod(tmpl.period);
    setKeyResults(
      tmpl.suggestedKRs.map((kr, i) => ({
        id: `kr-tmpl-${i}`,
        title: kr.title,
        targetValue: String(kr.targetValue),
        unit: kr.unit,
        description: kr.description
      }))
    );
    setAppliedTemplate(tmpl.id);
    setShowTemplates(false);
    ue.success(`Template "${tmpl.name}" applied`);
  }
  function handleSubmit() {
    if (!title.trim()) {
      ue.error("Please enter a goal title");
      return;
    }
    createGoalMutation.mutate();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "animate-fade-in-up p-4 sm:p-6 space-y-6 pb-20 md:pb-6",
      "data-ocid": "goal-new-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${wsId}/goals`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold tracking-tight text-foreground", children: "New Goal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Define an objective and the key results that will measure success" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/50 bg-card shadow-card overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "flex w-full items-center gap-2 px-5 py-3 hover:bg-muted/40 transition-colors text-left",
              onClick: () => setShowTemplates((v) => !v),
              "data-ocid": "templates-toggle",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-4 w-4 text-secondary shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground flex-1", children: "Start from an OKR template" }),
                appliedTemplate && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-accent/10 text-accent border-accent/20 text-xs mr-2", children: "Applied" }),
                showTemplates ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })
              ]
            }
          ),
          showTemplates && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 border-t border-border/40 pt-4", children: OKR_TEMPLATES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(TemplateCard, { tmpl: t, onApply: applyTemplate }, t.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card rounded-xl border border-border/50 bg-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2 font-semibold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-4 w-4 text-primary" }),
                "Objective"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4 pt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "goal-title",
                      className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                      children: "Title *"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "goal-title",
                      placeholder: "What do you want to achieve?",
                      value: title,
                      onChange: (e) => setTitle(e.target.value),
                      "data-ocid": "goal-title-input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "goal-description",
                      className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                      children: "Description"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: "goal-description",
                      placeholder: "Provide context, motivation, and success criteria…",
                      value: description,
                      onChange: (e) => setDescription(e.target.value),
                      rows: 3,
                      className: "resize-none",
                      "data-ocid": "goal-description-input"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card rounded-xl border border-border/50 bg-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold", children: [
                  "Key Results (",
                  keyResults.length,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: addKR,
                    "data-ocid": "add-kr-btn",
                    className: "active-press",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1.5" }),
                      "Add Key Result"
                    ]
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3 pt-4", children: keyResults.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-8 gap-3 rounded-xl border border-dashed border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No key results yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: addKR, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1.5" }),
                  "Add Key Result"
                ] })
              ] }) : keyResults.map((kr) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                KRRow,
                {
                  kr,
                  onChange: (updated) => setKeyResults(
                    (prev) => prev.map((k) => k.id === kr.id ? updated : k)
                  ),
                  onRemove: () => setKeyResults(
                    (prev) => prev.filter((k) => k.id !== kr.id)
                  )
                },
                kr.id
              )) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card rounded-xl border border-border/50 bg-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold", children: "Details" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4 pt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Contributors" }),
                  members.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "flex flex-wrap gap-1.5",
                      "data-ocid": "contributors-picker",
                      children: members.map((m) => {
                        const id = m.userId.toString();
                        const isSelected = contributorIds.includes(id);
                        const firstName = m.displayName.split(" ")[0];
                        return /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setContributorIds(
                              (prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                            ),
                            className: `rounded-full px-2.5 py-1 text-xs font-medium border transition-colors ${isSelected ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/50"}`,
                            children: firstName
                          },
                          id
                        );
                      })
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No members found" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "goal-period",
                      className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                      children: "Period"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "goal-period",
                      placeholder: "e.g. Q2 2026",
                      value: period,
                      onChange: (e) => setPeriod(e.target.value),
                      "data-ocid": "goal-period-input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: "goal-start",
                        className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                        children: "Start"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "goal-start",
                        type: "date",
                        value: startDate,
                        onChange: (e) => setStartDate(e.target.value),
                        "data-ocid": "goal-start-input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: "goal-end",
                        className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                        children: "End"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "goal-end",
                        type: "date",
                        value: endDate,
                        onChange: (e) => setEndDate(e.target.value),
                        "data-ocid": "goal-end-input"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "goal-status",
                      className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                      children: "Status"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: goalStatus,
                      onValueChange: (v) => setGoalStatus(v),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectTrigger,
                          {
                            id: "goal-status",
                            "data-ocid": "goal-status-select",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: GOAL_STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.value, children: s.label }, s.value)) })
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  className: "w-full active-press",
                  onClick: handleSubmit,
                  disabled: createGoalMutation.isPending,
                  "data-ocid": "create-goal-btn",
                  children: [
                    createGoalMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-2" }) : null,
                    createGoalMutation.isPending ? "Creating…" : "Create Goal"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "w-full", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${wsId}/goals`, children: "Cancel" }) })
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  GoalNewPage as default
};
