import { h as getTenantId, a as useNavigate, r as reactExports, e as useQuery, E as EscrowStatus, j as jsxRuntimeExports, l as Shield, B as Button, D as DollarSign } from "./index-D7inqmxR.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-wy6FYjGT.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { P as Plus } from "./plus-DNap1HPx.js";
import { C as CircleX } from "./circle-x-ZZk2DaqI.js";
import { T as TriangleAlert } from "./triangle-alert-BVd-weXD.js";
import { C as CircleCheck } from "./circle-check-gwasD9uJ.js";
import { C as Clock } from "./clock-xD41YETq.js";
import { A as ArrowUpRight } from "./arrow-up-right-D6juibhc.js";
const STATUS_CONFIG = {
  [EscrowStatus.Pending]: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    icon: Clock
  },
  [EscrowStatus.Funded]: {
    label: "Funded",
    className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: DollarSign
  },
  [EscrowStatus.Released]: {
    label: "Released",
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CircleCheck
  },
  [EscrowStatus.Disputed]: {
    label: "Disputed",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: TriangleAlert
  },
  [EscrowStatus.Cancelled]: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground",
    icon: CircleX
  }
};
function formatAmount(amount, currency) {
  const num = Number(amount) / 100;
  return `${currency} ${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}
function EscrowCard({ contract }) {
  const navigate = useNavigate();
  const cfg = STATUS_CONFIG[contract.status];
  const Icon = cfg.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: () => navigate({
        to: "/app/escrow/$contractId",
        params: { contractId: contract.id }
      }),
      "data-ocid": `escrow-card-${contract.id}`,
      className: "w-full text-left rounded-xl border border-border bg-card p-4 transition-smooth hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700 group",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 text-amber-600 dark:text-amber-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors", children: contract.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: contract.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.className}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3" }),
                    cfg.label
                  ]
                }
              ),
              contract.dueDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                "Due",
                " ",
                new Date(
                  Number(contract.dueDate) / 1e6
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm text-amber-600 dark:text-amber-400", children: formatAmount(contract.amount, contract.currency) }),
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
  const navigate = useNavigate();
  const [filter, setFilter] = reactExports.useState("All");
  const { data: contracts, isLoading } = useQuery({
    queryKey: ["escrows", tenantId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEscrows(tenantId);
    },
    enabled: !!actor && !isFetching
  });
  const all = contracts ?? [];
  const filtered = all.filter(
    (c) => filter === "All" || c.status === EscrowStatus[filter]
  );
  const totalFunded = all.filter((c) => c.status === EscrowStatus.Funded).reduce((sum, c) => sum + c.amount, BigInt(0));
  const totalReleased = all.filter((c) => c.status === EscrowStatus.Released).reduce((sum, c) => sum + c.amount, BigInt(0));
  const totalPending = all.filter((c) => c.status === EscrowStatus.Pending).reduce((sum, c) => sum + c.amount, BigInt(0));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-5xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-6 w-6 text-amber-500" }),
          "Escrow"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Manage secure contract agreements and fund releases" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => navigate({ to: "/app/escrow/new" }),
          "data-ocid": "escrow-new-btn",
          className: "bg-amber-500 hover:bg-amber-600 text-white gap-2 shrink-0",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            "New Escrow"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-3", children: [
      {
        label: "Total Funded",
        amount: totalFunded,
        color: "text-yellow-600 dark:text-yellow-400",
        bg: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
      },
      {
        label: "Total Released",
        amount: totalReleased,
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
      },
      {
        label: "Pending",
        amount: totalPending,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
      }
    ].map(({ label, amount, color, bg }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: bg, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-1 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: label }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pb-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-28" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-display text-xl font-bold ${color}`, children: Number(amount) === 0 ? "—" : `$${(Number(amount) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}` }) })
    ] }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex flex-wrap gap-2",
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
              className: `rounded-full px-3.5 py-1.5 text-xs font-medium transition-smooth ${filter === f ? "bg-amber-500 text-white shadow-sm" : "bg-muted text-muted-foreground hover:bg-amber-100 hover:text-amber-700 dark:hover:bg-amber-900/30 dark:hover:text-amber-400"}`,
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
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: isLoading ? ["skel-a", "skel-b", "skel-c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, k)) : filtered.length > 0 ? filtered.map((contract) => /* @__PURE__ */ jsxRuntimeExports.jsx(EscrowCard, { contract }, contract.id)) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-2xl border border-dashed border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 py-16 text-center",
        "data-ocid": "escrow-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "mx-auto h-10 w-10 text-amber-300 dark:text-amber-700 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: filter === "All" ? "No escrow contracts yet" : `No ${filter.toLowerCase()} contracts` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 mb-4", children: filter === "All" ? "Create a secure escrow agreement to get started." : `No contracts with status "${filter}" found.` }),
          filter === "All" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              onClick: () => navigate({ to: "/app/escrow/new" }),
              className: "bg-amber-500 hover:bg-amber-600 text-white",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1.5 h-3.5 w-3.5" }),
                "New Escrow"
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
