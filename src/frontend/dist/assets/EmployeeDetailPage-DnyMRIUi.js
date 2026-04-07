import { g as createLucideIcon, b as useParams, h as getTenantId, d as useQueryClient, r as reactExports, e as useQuery, j as jsxRuntimeExports, B as Button, f as Link, X, k as PayFrequency, a8 as PayrollStatus } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-wy6FYjGT.js";
import { I as Input } from "./input-C0aO0R3D.js";
import { L as Label } from "./label-CBtn2p-5.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { u as useMutation } from "./useMutation-BeBnUQJD.js";
import { u as ue } from "./index-p-k3Ndic.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { A as ArrowLeft } from "./arrow-left-mNBAKt8w.js";
import { M as Mail } from "./mail-D36Yph7Y.js";
import { P as Pen } from "./pen-B9Zo65Ev.js";
import { S as Save } from "./save-gMXGM8pU.js";
import { B as BadgeDollarSign } from "./badge-dollar-sign-BHPyHquK.js";
import { C as Calendar } from "./calendar-ts51vnwj.js";
import { T as TriangleAlert } from "./triangle-alert-BVd-weXD.js";
import { C as CircleCheck } from "./circle-check-gwasD9uJ.js";
import { C as Clock } from "./clock-xD41YETq.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "17", x2: "22", y1: "8", y2: "13", key: "3nzzx3" }],
  ["line", { x1: "22", x2: "17", y1: "8", y2: "13", key: "1swrse" }]
];
const UserX = createLucideIcon("user-x", __iconNode);
const FREQUENCIES = [
  PayFrequency.Weekly,
  PayFrequency.BiWeekly,
  PayFrequency.Monthly,
  PayFrequency.Quarterly
];
function formatCurrency(amount, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD"
  }).format(Number(amount) / 100);
}
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
function employeeToForm(emp) {
  return {
    firstName: emp.firstName,
    lastName: emp.lastName,
    email: emp.email,
    salary: (Number(emp.salary) / 100).toFixed(2),
    currency: emp.currency,
    payFrequency: emp.payFrequency,
    taxRate: String(Number(emp.taxRate)),
    startDate: new Date(Number(emp.startDate) / 1e6).toISOString().split("T")[0]
  };
}
function EmployeeDetailPage() {
  const { employeeId } = useParams({
    from: "/app/payroll/employees/$employeeId"
  });
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();
  const [editing, setEditing] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(null);
  const [confirmDeactivate, setConfirmDeactivate] = reactExports.useState(false);
  const { data: employee, isLoading } = useQuery({
    queryKey: ["employee", tenantId, employeeId],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getEmployee(tenantId, employeeId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled: !!actor && !isFetching
  });
  const { data: payrollHistory = [], isLoading: histLoading } = useQuery({
    queryKey: ["payrollRecords", tenantId, employeeId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPayrollRecords(tenantId, employeeId);
    },
    enabled: !!actor && !isFetching
  });
  const updateEmployee = useMutation({
    mutationFn: async (f) => {
      if (!actor || !employee) throw new Error("Not ready");
      const input = {
        firstName: f.firstName.trim(),
        lastName: f.lastName.trim(),
        email: f.email.trim(),
        salary: BigInt(Math.round(Number.parseFloat(f.salary) * 100)),
        currency: f.currency,
        payFrequency: f.payFrequency,
        taxRate: BigInt(Number.parseInt(f.taxRate)),
        startDate: BigInt(new Date(f.startDate).getTime() * 1e6),
        userId: employee.userId
      };
      const res = await actor.updateEmployee(tenantId, employeeId, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (updated) => {
      ue.success("Employee updated");
      queryClient.setQueryData(["employee", tenantId, employeeId], updated);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setEditing(false);
    },
    onError: (e) => ue.error(e.message)
  });
  const deactivateEmployee = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const res = await actor.deactivateEmployee(tenantId, employeeId);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (updated) => {
      ue.success("Employee deactivated");
      queryClient.setQueryData(["employee", tenantId, employeeId], updated);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setConfirmDeactivate(false);
    },
    onError: (e) => ue.error(e.message)
  });
  const startEdit = () => {
    if (employee) {
      setForm(employeeToForm(employee));
      setEditing(true);
    }
  };
  const set = (k) => (e) => setForm((prev) => prev ? { ...prev, [k]: e.target.value } : prev);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-4xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 rounded-2xl" })
    ] });
  }
  if (!employee) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 flex flex-col items-center justify-center gap-4 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "h-8 w-8 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-foreground", children: "Employee not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/payroll/employees", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        " Back to Employees"
      ] }) })
    ] });
  }
  const sortedHistory = [...payrollHistory].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 flex-wrap justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            asChild: true,
            "aria-label": "Back to Employees",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/payroll/employees", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500/15 font-bold text-green-600 dark:text-green-400 text-lg", children: [
          employee.firstName[0],
          employee.lastName[0]
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground", children: [
            employee.firstName,
            " ",
            employee.lastName
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: employee.email })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            className: employee.isActive ? "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20" : "bg-muted text-muted-foreground",
            children: employee.isActive ? "Active" : "Inactive"
          }
        ),
        !editing && employee.isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: startEdit,
            "data-ocid": "emp-edit-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "mr-1.5 h-3.5 w-3.5" }),
              " Edit"
            ]
          }
        )
      ] })
    ] }),
    editing && form ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "border-green-500/20 bg-green-500/[0.02]",
        "data-ocid": "emp-edit-form",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3 flex flex-row items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold", children: "Edit Employee Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: () => setEditing(false),
                "aria-label": "Cancel editing",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              onSubmit: (e) => {
                e.preventDefault();
                if (form) updateEmployee.mutate(form);
              },
              className: "grid gap-4 sm:grid-cols-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-firstName", children: "First Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "edit-firstName",
                      value: form.firstName,
                      onChange: set("firstName"),
                      required: true,
                      "data-ocid": "edit-firstname"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-lastName", children: "Last Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "edit-lastName",
                      value: form.lastName,
                      onChange: set("lastName"),
                      required: true,
                      "data-ocid": "edit-lastname"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-email", children: "Email" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "edit-email",
                      type: "email",
                      value: form.email,
                      onChange: set("email"),
                      required: true,
                      "data-ocid": "edit-email"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-salary", children: "Annual Salary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "edit-salary",
                      type: "number",
                      min: "0",
                      step: "0.01",
                      value: form.salary,
                      onChange: set("salary"),
                      required: true,
                      "data-ocid": "edit-salary"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-currency", children: "Currency" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "edit-currency",
                      value: form.currency,
                      onChange: set("currency"),
                      maxLength: 3,
                      "data-ocid": "edit-currency"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-frequency", children: "Pay Frequency" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      id: "edit-frequency",
                      value: form.payFrequency,
                      onChange: set("payFrequency"),
                      "data-ocid": "edit-pay-frequency",
                      className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      children: FREQUENCIES.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: f, children: f }, f))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-taxRate", children: "Tax Rate (%)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "edit-taxRate",
                      type: "number",
                      min: "0",
                      max: "100",
                      value: form.taxRate,
                      onChange: set("taxRate"),
                      required: true,
                      "data-ocid": "edit-tax-rate"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-startDate", children: "Start Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "edit-startDate",
                      type: "date",
                      value: form.startDate,
                      onChange: set("startDate"),
                      required: true,
                      "data-ocid": "edit-start-date"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 flex gap-3 justify-end pt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      onClick: () => setEditing(false),
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      disabled: updateEmployee.isPending,
                      className: "bg-green-600 hover:bg-green-700 text-white",
                      "data-ocid": "emp-save-btn",
                      children: updateEmployee.isPending ? "Saving…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-4 w-4" }),
                        " Save Changes"
                      ] })
                    }
                  )
                ] })
              ]
            }
          ) })
        ]
      }
    ) : (
      /* Profile Details Card */
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", "data-ocid": "emp-profile-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeDollarSign, { className: "h-4 w-4 text-green-600 dark:text-green-400" }),
          "Employment Details"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-muted-foreground mb-1", children: "Annual Salary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-semibold text-foreground tabular-nums", children: formatCurrency(employee.salary, employee.currency) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-muted-foreground mb-1", children: "Currency" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-semibold text-foreground", children: employee.currency })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-muted-foreground mb-1", children: "Pay Frequency" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-semibold text-foreground", children: employee.payFrequency })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-muted-foreground mb-1", children: "Tax Rate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { className: "font-semibold text-foreground", children: [
              Number(employee.taxRate),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-muted-foreground mb-1", children: "Start Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { className: "font-semibold text-foreground flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5 text-muted-foreground" }),
              new Date(
                Number(employee.startDate) / 1e6
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-muted-foreground mb-1", children: "Payroll Records" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-semibold text-foreground", children: payrollHistory.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-muted-foreground mb-1", children: "Total Paid" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-semibold text-foreground tabular-nums", children: formatCurrency(
              payrollHistory.reduce((s, r) => s + r.amount, 0n),
              employee.currency
            ) })
          ] })
        ] }) })
      ] })
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", "data-ocid": "emp-payroll-history", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold", children: "Payroll History" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: histLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-xl" }, n)) }) : sortedHistory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-10 text-center",
          "data-ocid": "emp-history-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeDollarSign, { className: "h-5 w-5 text-green-600 dark:text-green-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No payroll records yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
              "Process payroll from the",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/app/payroll",
                  className: "text-green-600 hover:underline",
                  children: "Payroll dashboard"
                }
              ),
              "."
            ] })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-left font-medium text-muted-foreground", children: "Period" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-right font-medium text-muted-foreground", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-right font-medium text-muted-foreground", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-right font-medium text-muted-foreground hidden sm:table-cell", children: "Date" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sortedHistory.map((record) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border/60 last:border-0",
            "data-ocid": `emp-record-${record.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pr-4 font-medium text-foreground", children: record.period }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pr-4 text-right font-mono tabular-nums font-semibold text-foreground", children: formatCurrency(record.amount, record.currency) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pr-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PayrollStatusBadge, { status: record.status }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 text-right text-muted-foreground hidden sm:table-cell", children: new Date(
                Number(record.createdAt) / 1e6
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              }) })
            ]
          },
          record.id
        )) })
      ] }) }) })
    ] }),
    employee.isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "border-destructive/20 bg-destructive/[0.02]",
        "data-ocid": "emp-danger-zone",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-semibold text-destructive flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
            "Danger Zone"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: confirmDeactivate ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-destructive/20 bg-destructive/5 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground text-sm", children: "Deactivate this employee?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                "This will mark ",
                employee.firstName,
                " as inactive. This action can be reversed by editing the employee record."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => setConfirmDeactivate(false),
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "destructive",
                  disabled: deactivateEmployee.isPending,
                  onClick: () => deactivateEmployee.mutate(),
                  "data-ocid": "emp-confirm-deactivate-btn",
                  children: deactivateEmployee.isPending ? "Deactivating…" : "Confirm Deactivate"
                }
              )
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground text-sm", children: "Deactivate Employee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                "Remove ",
                employee.firstName,
                " from active payroll processing."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive shrink-0",
                onClick: () => setConfirmDeactivate(true),
                "data-ocid": "emp-deactivate-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "mr-1.5 h-3.5 w-3.5" }),
                  "Deactivate Employee"
                ]
              }
            )
          ] }) })
        ]
      }
    )
  ] });
}
export {
  EmployeeDetailPage as default
};
