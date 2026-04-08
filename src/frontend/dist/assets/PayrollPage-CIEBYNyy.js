import { g as getTenantId, f as useWorkspace, n as useQueryClient, h as useQuery, a8 as PayrollStatus, D as DollarSign, j as jsxRuntimeExports, W as Wallet, B as Button, i as Link, P as Plus, F as FileText } from "./index-CzyNqtbv.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-BTCkNtDu.js";
import { S as Skeleton } from "./skeleton-DMAdSNre.js";
import { u as useMutation } from "./useMutation-BsRk2Bod.js";
import { u as ue } from "./index-DaWH_LJ9.js";
import { u as useBackend } from "./index-CJtF1vtU.js";
import { U as Users } from "./users-6wl8SB25.js";
import { C as Clock } from "./clock-DD8HS7VE.js";
import { T as TrendingUp } from "./trending-up-CqMdsyEa.js";
import { B as BadgeDollarSign } from "./badge-dollar-sign-Dq47BRWY.js";
import { P as Play } from "./play-CgyUjpXA.js";
import { T as TriangleAlert } from "./triangle-alert-B7NWtnMG.js";
import { C as CircleAlert } from "./circle-alert-aUZdVIV-.js";
import { A as ArrowRight } from "./arrow-right-D3_42nyU.js";
import { C as Calendar } from "./calendar-CTr0Yk3T.js";
import { C as CircleCheck } from "./circle-check-Bz_M8Dh9.js";
import { R as RefreshCw } from "./refresh-cw-E57THFPd.js";
function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD"
  }).format(Number(amount) / 100);
}
function formatIcp(balance) {
  return (Number(balance) / 1e8).toFixed(4);
}
function PayrollStatusBadge({ status }) {
  const map = {
    [PayrollStatus.Completed]: {
      label: "Completed",
      className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
    },
    [PayrollStatus.Approved]: {
      label: "Approved",
      className: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20"
    },
    [PayrollStatus.PendingApproval]: {
      label: "Pending",
      className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20"
    },
    [PayrollStatus.Rejected]: {
      label: "Rejected",
      className: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20"
    },
    [PayrollStatus.Processed]: {
      label: "Processed",
      className: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20"
    },
    [PayrollStatus.Active]: {
      label: "Active",
      className: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/20"
    },
    [PayrollStatus.Paused]: {
      label: "Paused",
      className: "bg-muted text-muted-foreground"
    }
  };
  const s = map[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${s.className}`,
      children: s.label
    }
  );
}
function PayrollPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();
  const navLinks = [
    {
      to: `/app/${workspaceId}/payroll/employees`,
      label: "Employees",
      icon: Users,
      desc: "Manage employee profiles"
    },
    {
      to: `/app/${workspaceId}/payroll/schedules`,
      label: "Pay Schedules",
      icon: Calendar,
      desc: "Weekly, bi-weekly, monthly"
    },
    {
      to: `/app/${workspaceId}/payroll/contractors`,
      label: "Contractors",
      icon: FileText,
      desc: "Freelancer & contractor payments"
    },
    {
      to: `/app/${workspaceId}/payroll/bulk-approval`,
      label: "Bulk Approval",
      icon: CircleCheck,
      desc: "Review & approve payroll runs"
    },
    {
      to: `/app/${workspaceId}/payroll/off-cycle`,
      label: "Off-Cycle Payments",
      icon: RefreshCw,
      desc: "Bonuses & reimbursements"
    },
    {
      to: `/app/${workspaceId}/payroll/audit-log`,
      label: "Audit Log",
      icon: CircleAlert,
      desc: "Full payroll history log"
    }
  ];
  const { data: treasury, isLoading: treasuryLoading } = useQuery({
    queryKey: ["workspaceTreasury", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWorkspaceTreasury(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: employees = [], isLoading: empLoading } = useQuery({
    queryKey: ["employees", tenantId, workspaceId],
    queryFn: async () => actor ? actor.listEmployees(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: records = [], isLoading: recLoading } = useQuery({
    queryKey: ["payrollRecords", tenantId, workspaceId, null],
    queryFn: async () => actor ? actor.listPayrollRecords(tenantId, workspaceId, null) : [],
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const icpBalance = (treasury == null ? void 0 : treasury.icpBalance) ?? BigInt(0);
  const hasNoFunds = !treasuryLoading && icpBalance === BigInt(0);
  const runPayroll = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const activeEmps = employees.filter((e) => e.isActive);
      if (activeEmps.length === 0) throw new Error("No active employees");
      const period = (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
      const results = await Promise.allSettled(
        activeEmps.map(
          (e) => actor.processPayroll(tenantId, workspaceId, e.id, period)
        )
      );
      for (const r of results) {
        if (r.status === "fulfilled" && r.value.__kind__ === "err") {
          if (r.value.err.toLowerCase().includes("insufficient")) {
            throw new Error(r.value.err);
          }
        }
      }
      return results.filter((r) => r.status === "fulfilled").length;
    },
    onSuccess: (count) => {
      ue.success(`Payroll processed for ${count} employee(s)`);
      queryClient.invalidateQueries({ queryKey: ["payrollRecords"] });
    },
    onError: (e) => ue.error(e.message)
  });
  const activeEmployees = employees.filter((e) => e.isActive);
  const pendingApproval = records.filter(
    (r) => r.status === PayrollStatus.PendingApproval
  );
  const thisMonth = (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
  const monthRecords = records.filter((r) => r.period.startsWith(thisMonth));
  const totalPayroll = monthRecords.reduce(
    (sum, r) => sum + Number(r.amount),
    0
  );
  const recentRecords = [...records].sort((a, b) => Number(b.createdAt) - Number(a.createdAt)).slice(0, 6);
  const employeeMap = new Map(employees.map((e) => [e.id, e]));
  const statsLoading = empLoading || recLoading;
  const stats = [
    {
      label: "Active Employees",
      value: statsLoading ? null : String(activeEmployees.length),
      icon: Users,
      trend: null
    },
    {
      label: "Payroll This Month",
      value: statsLoading ? null : `$${(totalPayroll / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      trend: "Current period"
    },
    {
      label: "Pending Approval",
      value: statsLoading ? null : String(pendingApproval.length),
      icon: Clock,
      link: `/app/${workspaceId}/payroll/bulk-approval`,
      urgent: pendingApproval.length > 0
    },
    {
      label: "Total Payroll Runs",
      value: statsLoading ? null : String(records.length),
      icon: TrendingUp,
      trend: "All time"
    }
  ];
  const isRunDisabled = runPayroll.isPending || activeEmployees.length === 0 || hasNoFunds;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-6 space-y-6 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeDollarSign, { className: "h-5 w-5 text-emerald-600 dark:text-emerald-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: "Payroll" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage employee payments and compensation" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        !treasuryLoading && treasury && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Treasury:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: `text-xs font-semibold tabular-nums ${icpBalance === BigInt(0) ? "text-destructive" : "text-foreground"}`,
              "data-ocid": "payroll-treasury-balance",
              children: [
                formatIcp(icpBalance),
                " ICP"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", size: "sm", className: "active-press", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/app/${workspaceId}/payroll/employees`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1.5 h-3.5 w-3.5" }),
          "Add Employee"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            className: "bg-emerald-600 hover:bg-emerald-700 text-white active-press disabled:opacity-60",
            onClick: () => runPayroll.mutate(),
            disabled: isRunDisabled,
            "data-ocid": "payroll-run-all-btn",
            title: hasNoFunds ? "Fund your workspace wallet before processing payroll" : activeEmployees.length === 0 ? "No active employees" : void 0,
            children: runPayroll.isPending ? "Running…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "mr-1.5 h-3.5 w-3.5" }),
              "Run Payroll"
            ] })
          }
        )
      ] })
    ] }),
    hasNoFunds && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-500/8 px-4 py-3",
        "data-ocid": "payroll-no-funds-banner",
        role: "alert",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Your workspace wallet has no funds. Fund it to process payroll." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              size: "sm",
              variant: "outline",
              className: "shrink-0 gap-1.5 border-amber-400/60 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10",
              "data-ocid": "payroll-fund-wallet-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/app/${workspaceId}/wallet`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5" }),
                "Fund Wallet"
              ] })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: stats.map(({ label, value, icon: Icon, trend, link, urgent }) => {
      const card = /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: `shadow-card rounded-xl border border-border/50 bg-card transition-colors ${link ? "card-interactive" : ""} ${urgent ? "border-amber-500/40" : ""}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: label }),
              value === null ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-24 mt-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `text-2xl font-bold font-mono tabular-nums ${urgent ? "text-amber-600 dark:text-amber-400" : "text-foreground"}`,
                  children: value
                }
              ),
              trend && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground/70", children: trend })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `flex h-9 w-9 items-center justify-center rounded-lg ${urgent ? "bg-amber-500/10" : "bg-emerald-500/10"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Icon,
                  {
                    className: `h-4 w-4 ${urgent ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`
                  }
                )
              }
            )
          ] }) })
        },
        label
      );
      return link ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: link, children: card }, label) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: card }, label);
    }) }),
    pendingApproval.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-amber-700 dark:text-amber-400 font-semibold", children: [
            pendingApproval.length,
            " payroll record",
            pendingApproval.length !== 1 ? "s" : ""
          ] }),
          " ",
          "awaiting approval"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          asChild: true,
          size: "sm",
          className: "bg-amber-600 hover:bg-amber-700 text-white shrink-0 active-press",
          "data-ocid": "payroll-approval-banner-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/app/${workspaceId}/payroll/bulk-approval`, children: [
            "Review Now ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1.5 h-3.5 w-3.5" })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1", children: "Quick Access" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: navLinks.map(({ to, label, icon: Icon, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to,
            "data-ocid": `payroll-nav-${label.toLowerCase().replace(/\s+/g, "-")}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3 hover:border-emerald-400/50 hover:bg-emerald-500/5 transition-colors group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: desc })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-emerald-600 transition-colors shrink-0" })
            ] })
          },
          to
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "lg:col-span-3 shadow-card rounded-xl border border-border/50 bg-card",
          "data-ocid": "recent-payroll-card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3 flex flex-row items-center justify-between border-b border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Recent Payroll Records" }),
              records.length > 6 && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${workspaceId}/payroll/bulk-approval`, children: "View all" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: recLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 p-4", children: [1, 2, 3, 4].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, n)) }) : recentRecords.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center justify-center py-12 text-center",
                "data-ocid": "payroll-records-empty",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeDollarSign, { className: "h-6 w-6 text-emerald-600 dark:text-emerald-400" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No payroll records yet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: 'Click "Run Payroll" to process the current pay period.' })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/40 bg-muted/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-left text-xs font-medium text-muted-foreground", children: "Employee" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell", children: "Period" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-right text-xs font-medium text-muted-foreground", children: "Amount" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-right text-xs font-medium text-muted-foreground", children: "Status" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/40", children: recentRecords.map((record) => {
                const emp = employeeMap.get(record.employeeId);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "hover:bg-muted/50 transition-colors",
                    "data-ocid": `payroll-record-${record.id}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-700 dark:text-emerald-400", children: emp ? `${emp.firstName[0]}${emp.lastName[0]}` : "?" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate max-w-[140px]", children: emp ? `${emp.firstName} ${emp.lastName}` : "—" })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground hidden sm:table-cell", children: record.period }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right font-mono font-semibold tabular-nums text-foreground", children: formatCurrency(record.amount, record.currency) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PayrollStatusBadge, { status: record.status }) })
                    ]
                  },
                  record.id
                );
              }) })
            ] }) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  PayrollPage as default
};
