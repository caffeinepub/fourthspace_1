import { t as createLucideIcon, g as getTenantId, f as useWorkspace, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, X } from "./index-DemOGW1B.js";
import { I as Input } from "./input-1iXuA55D.js";
import { L as Label } from "./label-mmRgUQzR.js";
import { S as Skeleton } from "./skeleton-M5HtR2mS.js";
import { u as useBackend } from "./index-CeqQA3r7.js";
import { A as ArrowLeft } from "./arrow-left-lpbCbWBz.js";
import { F as Funnel } from "./funnel-D9AHv-ih.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    { d: "M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3", key: "ms7g94" }
  ],
  ["path", { d: "m9 18-1.5-1.5", key: "1j6qii" }],
  ["circle", { cx: "5", cy: "14", r: "3", key: "ufru5t" }]
];
const FileSearch = createLucideIcon("file-search", __iconNode);
const ACTION_COLORS = {
  create: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  update: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
  delete: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20",
  approve: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20",
  reject: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/20",
  process: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/20"
};
const ACTION_DOT_COLORS = {
  create: "bg-emerald-500",
  update: "bg-blue-500",
  delete: "bg-red-500",
  approve: "bg-purple-500",
  reject: "bg-orange-500",
  process: "bg-cyan-500"
};
function actionColor(action) {
  const key = Object.keys(ACTION_COLORS).find(
    (k) => action.toLowerCase().includes(k)
  );
  return key ? ACTION_COLORS[key] : "bg-muted text-muted-foreground border-border";
}
function actionDotColor(action) {
  const key = Object.keys(ACTION_DOT_COLORS).find(
    (k) => action.toLowerCase().includes(k)
  );
  return key ? ACTION_DOT_COLORS[key] : "bg-muted-foreground";
}
function AuditLogPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const [filterAction, setFilterAction] = reactExports.useState("");
  const [filterFrom, setFilterFrom] = reactExports.useState("");
  const [filterTo, setFilterTo] = reactExports.useState("");
  const [showFilters, setShowFilters] = reactExports.useState(false);
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["payrollAuditLog", tenantId, workspaceId],
    queryFn: async () => actor ? actor.listPayrollAuditLog(tenantId, workspaceId, BigInt(200)) : [],
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const filtered = entries.filter((e) => {
    if (filterAction && !e.action.toLowerCase().includes(filterAction.toLowerCase()))
      return false;
    if (filterFrom) {
      const from = new Date(filterFrom).getTime() * 1e6;
      if (Number(e.timestamp) < from) return false;
    }
    if (filterTo) {
      const to = new Date(filterTo).getTime() * 1e6 + 864e5 * 1e6;
      if (Number(e.timestamp) > to) return false;
    }
    return true;
  });
  const hasFilters = !!filterAction || !!filterFrom || !!filterTo;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-6 space-y-6 max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, "aria-label": "Back", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${workspaceId}/payroll`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: "Audit Log" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isLoading ? "Loading…" : `${filtered.length} entries${hasFilters ? " (filtered)" : ""}` })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        hasFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => {
              setFilterAction("");
              setFilterFrom("");
              setFilterTo("");
            },
            "data-ocid": "audit-clear-filters",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-1.5 h-3.5 w-3.5" }),
              " Clear filters"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setShowFilters((v) => !v),
            "data-ocid": "audit-filter-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "mr-1.5 h-3.5 w-3.5" }),
              "Filter"
            ]
          }
        )
      ] })
    ] }),
    showFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/50 bg-card shadow-card p-4 grid gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "filter-action",
            className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
            children: "Action type"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "filter-action",
            value: filterAction,
            onChange: (e) => setFilterAction(e.target.value),
            placeholder: "e.g. create, approve…",
            "data-ocid": "audit-filter-action"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "filter-from",
            className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
            children: "From date"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "filter-from",
            type: "date",
            value: filterFrom,
            onChange: (e) => setFilterFrom(e.target.value),
            "data-ocid": "audit-filter-from"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "filter-to",
            className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
            children: "To date"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "filter-to",
            type: "date",
            value: filterTo,
            onChange: (e) => setFilterTo(e.target.value),
            "data-ocid": "audit-filter-to"
          }
        )
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" }, n)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center",
        "data-ocid": "audit-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileSearch, { className: "h-7 w-7 text-muted-foreground/60" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: hasFilters ? "No entries match your filters" : "No audit entries yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground max-w-xs", children: hasFilters ? "Try adjusting your filter criteria." : "Audit entries are recorded automatically as payroll actions occur." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-[18px] top-3 bottom-3 w-px bg-border/60" }),
      filtered.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative pl-10 pb-4 last:pb-0",
          "data-ocid": `audit-row-${entry.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `absolute left-[11px] top-[14px] h-4 w-4 rounded-full border-2 border-background ${actionDotColor(entry.action)}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border/50 bg-card shadow-card hover:bg-muted/30 transition-colors p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border capitalize shrink-0 ${actionColor(entry.action)}`,
                    children: entry.action
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground capitalize", children: entry.entityType }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono truncate max-w-[200px]", children: entry.entityId }),
                  entry.details && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: entry.details })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground whitespace-nowrap", children: new Date(
                  Number(entry.timestamp) / 1e6
                ).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground/60 font-mono truncate max-w-[120px]", children: [
                  String(entry.performedBy).slice(0, 16),
                  "…"
                ] })
              ] })
            ] }) })
          ]
        },
        entry.id
      ))
    ] })
  ] });
}
export {
  AuditLogPage as default
};
