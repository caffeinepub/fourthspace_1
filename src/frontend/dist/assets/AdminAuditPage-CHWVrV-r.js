import { d as useNavigate, f as useWorkspace, g as getTenantId, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button } from "./index-BZqaRhAX.js";
import { B as Badge } from "./index--nGTycyb.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CkiaF30e.js";
import { S as Skeleton } from "./skeleton-CXUiMpVp.js";
import { u as useBackend } from "./useBackend-DSxJo5MU.js";
import { A as ArrowLeft } from "./arrow-left-BCLeiEG1.js";
import { C as ClipboardList } from "./clipboard-list-Iiw_LflT.js";
import { R as RefreshCw } from "./refresh-cw-zBJl8Ogw.js";
import { C as Circle } from "./circle-BjnPthQb.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-gmG56FeV.js";
import { f as format } from "./format-BjBbZPfh.js";
import "./index-IXOTxK3N.js";
import "./index-38IBqnCJ.js";
import "./chevron-up-Dd5ZqoJs.js";
import "./en-US-CJ_JRP0W.js";
const ACTION_COLOR = {
  create: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  update: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  delete: "bg-destructive/10 text-destructive",
  read: "bg-muted text-muted-foreground"
};
const ENTITY_COLORS = {
  note: "bg-indigo-500/10 text-indigo-600",
  project: "bg-orange-500/10 text-orange-600",
  task: "bg-orange-400/10 text-orange-500",
  channel: "bg-teal-500/10 text-teal-600",
  message: "bg-teal-400/10 text-teal-500",
  event: "bg-red-500/10 text-red-600",
  employee: "bg-emerald-500/10 text-emerald-600",
  payroll: "bg-emerald-400/10 text-emerald-500",
  escrow: "bg-yellow-500/10 text-yellow-600",
  wallet: "bg-pink-500/10 text-pink-600",
  backup: "bg-blue-500/10 text-blue-600",
  automation: "bg-purple-500/10 text-purple-600",
  user: "bg-primary/10 text-primary"
};
function getEntityColor(entityType) {
  return ENTITY_COLORS[entityType.toLowerCase()] ?? "bg-muted text-muted-foreground";
}
function getActionColor(action) {
  const key = action.toLowerCase().split("_")[0];
  return ACTION_COLOR[key] ?? "bg-muted text-muted-foreground";
}
function AdminAuditPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { activeWorkspaceId } = useWorkspace();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  const [entityFilter, setEntityFilter] = reactExports.useState("All");
  const {
    data: logs,
    isLoading,
    refetch,
    isFetching: isRefetching
  } = useQuery({
    queryKey: ["auditLogs", tenantId, workspaceId],
    queryFn: async () => actor ? actor.listAuditLogs(tenantId, workspaceId, BigInt(100)) : [],
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const entityTypes = logs ? ["All", ...Array.from(new Set(logs.map((l) => l.entityType))).sort()] : ["All"];
  const filtered = (logs ?? []).filter((l) => entityFilter === "All" || l.entityType === entityFilter).sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: `/app/${workspaceId}/admin` }),
          "aria-label": "Back",
          className: "hover:bg-muted",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-4 w-4 text-orange-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: "Audit Logs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "All system activity, sorted newest first" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => refetch(),
          disabled: isRefetching,
          "data-ocid": "audit-refresh-btn",
          className: "gap-1.5 active-press",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RefreshCw,
              {
                className: `h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`
              }
            ),
            "Refresh"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
      [
        { label: "Create", color: "bg-emerald-500" },
        { label: "Update", color: "bg-blue-500" },
        { label: "Delete", color: "bg-destructive" }
      ].map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-1.5 text-xs text-muted-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Circle,
              {
                className: `h-2 w-2 fill-current ${l.color.replace("bg-", "text-")}`
              }
            ),
            l.label
          ]
        },
        l.label
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: entityFilter, onValueChange: setEntityFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "h-8 w-[160px] text-sm",
              "data-ocid": "audit-entity-filter",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: entityTypes.map((type) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: type, children: type }, type)) })
        ] }),
        !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          filtered.length,
          " entries"
        ] })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-lg" }, n)) }) : filtered.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/50 overflow-hidden shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-4 bg-muted/40 px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Action" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Entity Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Entity ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "User" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Time" })
      ] }),
      filtered.map((log) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-3 md:gap-4 items-start md:items-center border-t border-border/40 bg-card px-5 py-3.5 hover:bg-muted/30 transition-colors duration-150",
          "data-ocid": `audit-log-${log.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: `w-fit text-xs rounded-full px-2.5 py-0.5 font-mono ${getActionColor(log.action)}`,
                  children: log.action
                }
              ),
              log.details && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1", children: log.details })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                className: `w-fit text-xs rounded-full px-2.5 py-0.5 ${getEntityColor(log.entityType)}`,
                children: log.entityType
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono truncate", children: [
              log.entityId.slice(0, 12),
              "..."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono truncate", children: [
              log.userId.toString().slice(0, 12),
              "..."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                formatDistanceToNow(Number(log.timestamp) / 1e6),
                " ago"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 mt-0.5", children: format(
                new Date(Number(log.timestamp) / 1e6),
                "MMM d, HH:mm"
              ) })
            ] })
          ]
        },
        log.id
      ))
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 py-16 text-center",
        "data-ocid": "audit-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-10 w-10 text-muted-foreground/40 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No audit logs yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: entityFilter !== "All" ? `No activity for entity type "${entityFilter}".` : "Activity will be logged here as the workspace is used." })
        ]
      }
    )
  ] });
}
export {
  AdminAuditPage as default
};
