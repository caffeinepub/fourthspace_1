import { g as getTenantId, f as useWorkspace, d as useNavigate, r as reactExports, h as useQuery, af as EscrowStatus, j as jsxRuntimeExports, p as Shield, B as Button, P as Plus, D as DollarSign } from "./index-CzyNqtbv.js";
import { C as Card, a as CardContent } from "./card-BTCkNtDu.js";
import { I as Input } from "./input-982h_Ebl.js";
import { L as Label } from "./label-D31XgQrg.js";
import { S as Skeleton } from "./skeleton-DMAdSNre.js";
import { u as useBackend } from "./index-CJtF1vtU.js";
import { F as Funnel } from "./funnel-C0plywLz.js";
import { C as CircleCheck } from "./circle-check-Bz_M8Dh9.js";
import { C as Clock } from "./clock-DD8HS7VE.js";
import { C as Calendar } from "./calendar-CTr0Yk3T.js";
import { C as CircleX } from "./circle-x-BX5Efhsc.js";
import { T as TriangleAlert } from "./triangle-alert-B7NWtnMG.js";
import { A as ArrowUpRight } from "./arrow-up-right-CkIpV1tI.js";
const STATUS_CONFIG = {
  [EscrowStatus.Pending]: {
    label: "Pending",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
    icon: Clock
  },
  [EscrowStatus.Funded]: {
    label: "Funded",
    className: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    icon: DollarSign
  },
  [EscrowStatus.Released]: {
    label: "Released",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    icon: CircleCheck
  },
  [EscrowStatus.Disputed]: {
    label: "Disputed",
    className: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20",
    icon: TriangleAlert
  },
  [EscrowStatus.Cancelled]: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground border-border",
    icon: CircleX
  }
};
const STATUS_DOTS = {
  [EscrowStatus.Pending]: "bg-amber-500",
  [EscrowStatus.Funded]: "bg-yellow-500",
  [EscrowStatus.Released]: "bg-emerald-500",
  [EscrowStatus.Disputed]: "bg-red-500",
  [EscrowStatus.Cancelled]: "bg-muted-foreground"
};
function formatAmount(amount, currency) {
  const num = Number(amount) / 100;
  return `${currency} ${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function EscrowCard({
  contract,
  workspaceId
}) {
  const navigate = useNavigate();
  const cfg = STATUS_CONFIG[contract.status];
  const Icon = cfg.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: () => navigate({
        to: `/app/${workspaceId}/escrow/$escrowId`,
        params: { escrowId: contract.id }
      }),
      "data-ocid": `escrow-card-${contract.id}`,
      className: "w-full text-left rounded-xl border border-border/50 bg-card shadow-card hover:shadow-card-hover hover:border-amber-300/60 dark:hover:border-amber-700/60 transition-all duration-200 group p-4",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 text-amber-600 dark:text-amber-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors", children: contract.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1", children: contract.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5", children: [
                EscrowStatus.Pending,
                EscrowStatus.Funded,
                EscrowStatus.Released
              ].map((s) => {
                const statusOrder = [
                  EscrowStatus.Pending,
                  EscrowStatus.Funded,
                  EscrowStatus.Released
                ];
                const currentIdx = statusOrder.indexOf(contract.status);
                const thisIdx = statusOrder.indexOf(s);
                const isPast = thisIdx <= currentIdx && contract.status !== EscrowStatus.Disputed && contract.status !== EscrowStatus.Cancelled;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `h-1.5 w-4 rounded-full transition-colors ${isPast ? STATUS_DOTS[s] : "bg-border"}`
                  },
                  s
                );
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border ${cfg.className}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3" }),
                    cfg.label
                  ]
                }
              ),
              contract.dueDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                new Date(
                  Number(contract.dueDate) / 1e6
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm text-amber-600 dark:text-amber-400 font-mono tabular-nums", children: formatAmount(contract.amount, contract.currency) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3.5 w-3.5 text-muted-foreground ml-auto mt-1 group-hover:text-amber-500 transition-colors" })
        ] })
      ] })
    }
  );
}
const FILTERS = [
  "All",
  "Pending",
  "Funded",
  "Released",
  "Disputed",
  "Cancelled"
];
function EscrowPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const navigate = useNavigate();
  const [filter, setFilter] = reactExports.useState("All");
  const [dateFrom, setDateFrom] = reactExports.useState("");
  const [dateTo, setDateTo] = reactExports.useState("");
  const [showFilters, setShowFilters] = reactExports.useState(false);
  const { data: contracts, isLoading } = useQuery({
    queryKey: ["escrows", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEscrows(tenantId, workspaceId, null);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const all = contracts ?? [];
  const filtered = all.filter((c) => {
    const statusMatch = filter === "All" || c.status === EscrowStatus[filter];
    let dateMatch = true;
    if (dateFrom || dateTo) {
      const ts = Number(c.createdAt) / 1e6;
      if (dateFrom) dateMatch = dateMatch && ts >= new Date(dateFrom).getTime();
      if (dateTo)
        dateMatch = dateMatch && ts <= new Date(dateTo).getTime() + 864e5 - 1;
    }
    return statusMatch && dateMatch;
  });
  const totalFunded = all.filter((c) => c.status === EscrowStatus.Funded).reduce((sum, c) => sum + c.amount, BigInt(0));
  const totalReleased = all.filter((c) => c.status === EscrowStatus.Released).reduce((sum, c) => sum + c.amount, BigInt(0));
  const totalPending = all.filter((c) => c.status === EscrowStatus.Pending).reduce((sum, c) => sum + c.amount, BigInt(0));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-4 sm:p-6 space-y-5 max-w-5xl mx-auto pb-20 md:pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 text-amber-600 dark:text-amber-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground", children: "Escrow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage secure on-chain contract agreements" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setShowFilters((v) => !v),
            "data-ocid": "escrow-filters-toggle",
            className: `min-h-[44px] ${showFilters ? "border-amber-400/60 text-amber-600" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4 mr-1.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Filters" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => navigate({ to: `/app/${workspaceId}/escrow/new` }),
            "data-ocid": "escrow-new-btn",
            className: "bg-amber-500 hover:bg-amber-600 text-white active-press gap-1.5 min-h-[44px]",
            size: "sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "New Escrow" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "New" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 grid-cols-1 sm:grid-cols-3", children: [
      {
        label: "Funded",
        amount: totalFunded,
        color: "text-yellow-600 dark:text-yellow-400",
        bg: "bg-yellow-500/10",
        icon: DollarSign
      },
      {
        label: "Released",
        amount: totalReleased,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10",
        icon: CircleCheck
      },
      {
        label: "Pending",
        amount: totalPending,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10",
        icon: Clock
      }
    ].map(({ label, amount, color, bg, icon: Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "shadow-card rounded-xl border border-border/50 bg-card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 sm:p-5 flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-5 w-5 ${color}` })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: label }),
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-28 mt-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `font-mono font-bold text-lg tabular-nums ${color}`,
                children: Number(amount) === 0 ? "—" : `$${(Number(amount) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
              }
            )
          ] })
        ] })
      },
      label
    )) }),
    showFilters && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-amber-200/60 dark:border-amber-800/60 bg-amber-500/5 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 grid-cols-1 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Label,
          {
            htmlFor: "date-from",
            className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }),
              " Created From"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "date-from",
            type: "date",
            value: dateFrom,
            onChange: (e) => setDateFrom(e.target.value),
            "data-ocid": "escrow-date-from",
            className: "h-10"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Label,
          {
            htmlFor: "date-to",
            className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }),
              " Created To"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "date-to",
            type: "date",
            value: dateTo,
            onChange: (e) => setDateTo(e.target.value),
            "data-ocid": "escrow-date-to",
            className: "h-10"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex gap-1.5 w-max",
        role: "tablist",
        "aria-label": "Filter escrow contracts",
        children: FILTERS.map((f) => {
          const count = f === "All" ? all.length : all.filter(
            (c) => c.status === EscrowStatus[f]
          ).length;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              role: "tab",
              type: "button",
              "aria-selected": filter === f,
              onClick: () => setFilter(f),
              "data-ocid": `escrow-filter-${f.toLowerCase()}`,
              className: `rounded-full px-3 py-1.5 text-xs font-medium transition-colors border min-h-[36px] whitespace-nowrap ${filter === f ? "bg-amber-500 text-white border-amber-500 shadow-sm" : "bg-card text-muted-foreground border-border hover:border-amber-400/60 hover:text-foreground"}`,
              children: [
                f,
                count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${filter === f ? "bg-white/20 text-white" : "bg-muted-foreground/20"}`,
                    children: count
                  }
                )
              ]
            },
            f
          );
        })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: isLoading ? ["skel-a", "skel-b", "skel-c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, k)) : filtered.length > 0 ? filtered.map((contract) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      EscrowCard,
      {
        contract,
        workspaceId
      },
      contract.id
    )) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-2xl border border-dashed border-amber-200 dark:border-amber-800 bg-amber-500/5 py-12 sm:py-16 text-center px-4",
        "data-ocid": "escrow-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "mx-auto h-10 w-10 text-amber-300 dark:text-amber-700 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: filter === "All" ? "No escrow contracts yet" : `No ${filter.toLowerCase()} contracts` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 mb-4", children: filter === "All" ? "Create a secure escrow agreement to get started." : `No contracts with status "${filter}" found.` }),
          filter === "All" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              onClick: () => navigate({ to: `/app/${workspaceId}/escrow/new` }),
              className: "bg-amber-500 hover:bg-amber-600 text-white active-press min-h-[44px]",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1.5 h-3.5 w-3.5" }),
                " New Escrow"
              ]
            }
          )
        ]
      }
    ) })
  ] });
}
export {
  EscrowPage as default
};
