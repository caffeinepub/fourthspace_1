import { s as createLucideIcon, m as useParams, f as useWorkspace, d as useNavigate, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button } from "./index-1XRv9GHr.js";
import { B as Badge } from "./badge-rX4oLW6l.js";
import { C as Card, a as CardContent } from "./card-CFU1s52N.js";
import { I as Input } from "./input-BOIU-9S_.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { u as useBackend } from "./useBackend-DyFxq-Jw.js";
import { A as ArrowLeft } from "./arrow-left-B-gbON0E.js";
import { R as RefreshCw } from "./refresh-cw-J9WZ69Bg.js";
import { S as Search } from "./search-CWnD_rod.js";
import { f as format } from "./format-BjBbZPfh.js";
import "./en-US-CJ_JRP0W.js";
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
  CREATE: "bg-primary/10 text-primary",
  APPROVE: "bg-accent/10 text-accent-foreground",
  REJECT: "bg-destructive/10 text-destructive",
  PROCESS: "bg-secondary/10 text-secondary-foreground",
  UPDATE: "bg-muted text-muted-foreground"
};
function getActionColor(action) {
  const upper = action.toUpperCase();
  for (const [key, val] of Object.entries(ACTION_COLORS)) {
    if (upper.includes(key)) return val;
  }
  return "bg-muted text-muted-foreground";
}
function formatTs(ts) {
  return format(new Date(Number(ts) / 1e6), "MMM d, yyyy HH:mm:ss");
}
function AuditLogPage() {
  const { workspaceId } = useParams({ strict: false });
  const { tenantId } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const [search, setSearch] = reactExports.useState("");
  const [limit] = reactExports.useState(50);
  const {
    data: entries = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["payrollAuditLog", tenantId, workspaceId, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPayrollAuditLog(tenantId, workspaceId, BigInt(limit));
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const filtered = reactExports.useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (e) => e.action.toLowerCase().includes(q) || e.entityType.toLowerCase().includes(q) || e.details.toLowerCase().includes(q) || e.entityId.toLowerCase().includes(q)
    );
  }, [entries, search]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 p-4 sm:p-6 max-w-5xl mx-auto w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: () => navigate({ to: `/app/${workspaceId}/payroll` }),
            "data-ocid": "audit-log-back",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileSearch, { className: "w-5 h-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold font-display text-foreground", children: "Payroll Audit Log" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              entries.length,
              " entr",
              entries.length !== 1 ? "ies" : "y",
              " — full history"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => void refetch(),
          "data-ocid": "audit-log-refresh",
          className: "gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
            "Refresh"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          "data-ocid": "audit-log-search",
          placeholder: "Search by action, entity type, or details...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "pl-9"
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: ["a", "b", "c", "d", "e"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-lg" }, k)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "audit-log-empty",
        className: "flex flex-col items-center justify-center py-16 gap-3 text-center rounded-lg border border-dashed border-border",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileSearch, { className: "w-10 h-10 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground font-display", children: "No audit log entries" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: search ? "Try a different search." : "Payroll actions will appear here." })
          ] })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: filtered.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(AuditEntry, { entry }, entry.id)) })
  ] });
}
function AuditEntry({ entry }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      "data-ocid": `audit-entry-${entry.id}`,
      className: "hover:bg-muted/20 transition-colors",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: `text-xs shrink-0 mt-0.5 ${getActionColor(entry.action)}`,
            children: entry.action
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: entry.entityType }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-muted-foreground", children: [
              "#",
              entry.entityId.slice(0, 8)
            ] })
          ] }),
          entry.details && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: entry.details }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-mono text-muted-foreground mt-1", children: [
            "By: ",
            entry.performedBy.toString().slice(0, 20),
            "…"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground whitespace-nowrap", children: formatTs(entry.timestamp) }) })
      ] })
    }
  );
}
export {
  AuditLogPage as default
};
