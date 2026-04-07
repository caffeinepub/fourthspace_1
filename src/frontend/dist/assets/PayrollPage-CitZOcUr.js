import { g as createLucideIcon, h as getTenantId, d as useQueryClient, r as reactExports, e as useQuery, j as jsxRuntimeExports, B as Button, f as Link, D as DollarSign, a8 as PayrollStatus } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle } from "./card-wy6FYjGT.js";
import { I as Input } from "./input-C0aO0R3D.js";
import { L as Label } from "./label-CBtn2p-5.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { u as useMutation } from "./useMutation-BeBnUQJD.js";
import { u as ue } from "./index-p-k3Ndic.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { B as BadgeDollarSign } from "./badge-dollar-sign-BHPyHquK.js";
import { U as Users } from "./users-0z2gux4W.js";
import { A as ArrowRight } from "./arrow-right-D7-RcTtv.js";
import { C as Calendar } from "./calendar-ts51vnwj.js";
import { C as CircleCheck } from "./circle-check-gwasD9uJ.js";
import { C as Clock } from "./clock-xD41YETq.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = createLucideIcon("play", __iconNode);
function PayrollStatusBadge({ status }) {
  if (status === PayrollStatus.Completed)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20 gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
      " Completed"
    ] });
  if (status === PayrollStatus.Active)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20 gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
      " Active"
    ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-muted-foreground gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
    " Paused"
  ] });
}
function formatCurrency(amount, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD"
  }).format(Number(amount) / 100);
}
function nextPayrollDate() {
  const d = /* @__PURE__ */ new Date();
  d.setMonth(d.getMonth() + 1, 1);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
function PayrollPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();
  const [selectedEmployeeId, setSelectedEmployeeId] = reactExports.useState("");
  const [period, setPeriod] = reactExports.useState(() => {
    const now = /* @__PURE__ */ new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const { data: employees = [], isLoading: empLoading } = useQuery({
    queryKey: ["employees", tenantId],
    queryFn: async () => actor ? actor.listEmployees(tenantId) : [],
    enabled: !!actor && !isFetching
  });
  const { data: records = [], isLoading: recLoading } = useQuery({
    queryKey: ["payrollRecords", tenantId, null],
    queryFn: async () => actor ? actor.listPayrollRecords(tenantId, null) : [],
    enabled: !!actor && !isFetching
  });
  const processPayroll = useMutation({
    mutationFn: async () => {
      if (!actor || !selectedEmployeeId) throw new Error("Select an employee");
      const res = await actor.processPayroll(
        tenantId,
        selectedEmployeeId,
        period
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      ue.success("Payroll processed successfully");
      queryClient.invalidateQueries({ queryKey: ["payrollRecords"] });
      setSelectedEmployeeId("");
    },
    onError: (e) => ue.error(e.message)
  });
  const activeEmployees = employees.filter((e) => e.isActive);
  const thisMonth = (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
  const monthRecords = records.filter((r) => r.period.startsWith(thisMonth));
  const totalPayroll = monthRecords.reduce(
    (sum, r) => sum + Number(r.amount),
    0
  );
  const recentRecords = [...records].sort((a, b) => Number(b.createdAt) - Number(a.createdAt)).slice(0, 8);
  const employeeMap = new Map(employees.map((e) => [e.id, e]));
  const statsLoading = empLoading || recLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-6xl mx-auto space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeDollarSign, { className: "h-5 w-5 text-green-600 dark:text-green-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Payroll" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage payroll and employee payments" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", "data-ocid": "payroll-employees-link", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/payroll/employees", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "mr-2 h-4 w-4" }),
        "Manage Employees",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-3", children: [
      {
        label: "Active Employees",
        value: statsLoading ? null : String(activeEmployees.length),
        icon: Users
      },
      {
        label: "Payroll This Month",
        value: statsLoading ? null : `$${(totalPayroll / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        icon: DollarSign
      },
      {
        label: "Next Payroll Date",
        value: nextPayrollDate(),
        icon: Calendar
      }
    ].map(({ label, value, icon: Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-4 pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-green-600 dark:text-green-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: label }),
        value === null ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "mt-1 h-6 w-24" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold font-display text-foreground truncate", children: value })
      ] })
    ] }) }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "lg:col-span-2 border-green-500/20 bg-green-500/[0.03]",
          "data-ocid": "run-payroll-card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4 text-green-600 dark:text-green-400" }),
              "Run Payroll"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "employee-select", children: "Employee" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    id: "employee-select",
                    value: selectedEmployeeId,
                    onChange: (e) => setSelectedEmployeeId(e.target.value),
                    "data-ocid": "payroll-employee-select",
                    className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select employee…" }),
                      activeEmployees.map((emp) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: emp.id, children: [
                        emp.firstName,
                        " ",
                        emp.lastName
                      ] }, emp.id))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "period-input", children: "Pay Period (YYYY-MM)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "period-input",
                    type: "month",
                    value: period,
                    onChange: (e) => setPeriod(e.target.value),
                    "data-ocid": "payroll-period-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "w-full bg-green-600 hover:bg-green-700 text-white",
                  disabled: !selectedEmployeeId || processPayroll.isPending,
                  onClick: () => processPayroll.mutate(),
                  "data-ocid": "payroll-process-btn",
                  children: processPayroll.isPending ? "Processing…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "mr-2 h-4 w-4" }),
                    "Process Payroll"
                  ] })
                }
              ),
              !selectedEmployeeId && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "Select an employee to enable payroll processing" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "lg:col-span-3 border-border",
          "data-ocid": "recent-payroll-card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold", children: "Recent Payroll Records" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: recLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3, 4].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-xl" }, n)) }) : recentRecords.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center justify-center py-12 text-center",
                "data-ocid": "payroll-records-empty",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeDollarSign, { className: "h-6 w-6 text-green-600 dark:text-green-400" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No payroll records yet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Process your first payroll using the form." })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-left font-medium text-muted-foreground", children: "Employee" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-left font-medium text-muted-foreground", children: "Period" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-right font-medium text-muted-foreground", children: "Amount" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-right font-medium text-muted-foreground", children: "Status" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: recentRecords.map((record) => {
                const emp = employeeMap.get(record.employeeId);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-b border-border/60 last:border-0",
                    "data-ocid": `payroll-record-${record.id}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate max-w-[120px] block", children: emp ? `${emp.firstName} ${emp.lastName}` : "—" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pr-4 text-muted-foreground", children: record.period }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pr-4 text-right font-mono font-medium tabular-nums text-foreground", children: formatCurrency(record.amount, record.currency) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PayrollStatusBadge, { status: record.status }) })
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
