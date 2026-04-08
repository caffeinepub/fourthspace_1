import { t as createLucideIcon, f as useWorkspace, d as useNavigate, r as reactExports, j as jsxRuntimeExports, B as Button, i as Link, s as ChevronDown, al as Target, P as Plus, C as Check, X } from "./index-DemOGW1B.js";
import { B as Badge } from "./badge-BgvX66QS.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-wtglWSxh.js";
import { I as Input } from "./input-1iXuA55D.js";
import { L as Label } from "./label-mmRgUQzR.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-NwajN2eF.js";
import { T as Textarea } from "./textarea-DdbmcPlU.js";
import { u as ue } from "./index-BBpqu5x7.js";
import { O as OKR_TEMPLATES } from "./goalData-BuNPhJNp.js";
import { A as ArrowLeft } from "./arrow-left-lpbCbWBz.js";
import { C as ChevronUp } from "./chevron-up-3jVPN2OD.js";
import "./index-IXOTxK3N.js";
import "./index-DnYpjSFd.js";
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
const MOCK_USERS = [
  { id: "u1", name: "Alex Martinez" },
  { id: "u2", name: "Sam Kim" },
  { id: "u3", name: "Jordan Lee" },
  { id: "u4", name: "Morgan Chen" },
  { id: "u5", name: "Riley Okafor" }
];
const GOAL_STATUSES = [
  "Active",
  "OnTrack",
  "AtRisk",
  "Behind",
  "Completed"
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
  const navigate = useNavigate();
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [owner, setOwner] = reactExports.useState(MOCK_USERS[0].id);
  const [contributors, setContributors] = reactExports.useState([]);
  const [period, setPeriod] = reactExports.useState("Q2 2026");
  const [startDate, setStartDate] = reactExports.useState("2026-04-01");
  const [endDate, setEndDate] = reactExports.useState("2026-06-30");
  const [status, setStatus] = reactExports.useState("Active");
  const [keyResults, setKeyResults] = reactExports.useState([]);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [showTemplates, setShowTemplates] = reactExports.useState(true);
  const [appliedTemplate, setAppliedTemplate] = reactExports.useState(null);
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
    setIsSubmitting(true);
    setTimeout(() => {
      ue.success("Goal created successfully");
      void navigate({ to: `/app/${wsId}/goals` });
    }, 600);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-6 space-y-6", "data-ocid": "goal-new-page", children: [
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
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "goal-owner",
                  className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                  children: "Owner"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: owner, onValueChange: setOwner, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "goal-owner", "data-ocid": "goal-owner-select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: MOCK_USERS.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: u.id, children: u.name }, u.id)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Contributors" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex flex-wrap gap-1.5",
                  "data-ocid": "contributors-picker",
                  children: MOCK_USERS.filter((u) => u.id !== owner).map((u) => {
                    const isSelected = contributors.includes(u.id);
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setContributors(
                          (prev) => prev.includes(u.id) ? prev.filter((id) => id !== u.id) : [...prev, u.id]
                        ),
                        className: `rounded-full px-2.5 py-1 text-xs font-medium border transition-colors ${isSelected ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/50"}`,
                        children: u.name.split(" ")[0]
                      },
                      u.id
                    );
                  })
                }
              )
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
                  value: status,
                  onValueChange: (v) => setStatus(v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        id: "goal-status",
                        "data-ocid": "goal-status-select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: GOAL_STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full active-press",
              onClick: handleSubmit,
              disabled: isSubmitting,
              "data-ocid": "create-goal-btn",
              children: isSubmitting ? "Creating…" : "Create Goal"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "w-full", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${wsId}/goals`, children: "Cancel" }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  GoalNewPage as default
};
