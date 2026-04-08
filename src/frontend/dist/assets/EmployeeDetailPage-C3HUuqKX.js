import { s as createLucideIcon, m as useParams, g as getTenantId, f as useWorkspace, n as useQueryClient, r as reactExports, a_ as DeductionType, a$ as DeductionFrequency, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, X, a9 as PayFrequency, P as Plus, a8 as PayrollStatus } from "./index-CzyNqtbv.js";
import { B as Badge } from "./badge-B6elWcoD.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-BTCkNtDu.js";
import { I as Input } from "./input-982h_Ebl.js";
import { L as Label } from "./label-D31XgQrg.js";
import { S as Skeleton } from "./skeleton-DMAdSNre.js";
import { u as useMutation } from "./useMutation-BsRk2Bod.js";
import { u as ue } from "./index-DaWH_LJ9.js";
import { u as useBackend } from "./index-CJtF1vtU.js";
import { A as ArrowLeft } from "./arrow-left-BnDr9sMT.js";
import { M as Mail } from "./mail-eGlwiGsX.js";
import { P as Pen } from "./pen-BZMmY30Z.js";
import { B as BadgeDollarSign } from "./badge-dollar-sign-Dq47BRWY.js";
import { S as Save } from "./save-R19D3P8T.js";
import { C as Calendar } from "./calendar-CTr0Yk3T.js";
import { T as TriangleAlert } from "./triangle-alert-B7NWtnMG.js";
import { D as Download } from "./download-BwKI_7SK.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }]
];
const CircleMinus = createLucideIcon("circle-minus", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { x: "3", y: "8", width: "18", height: "4", rx: "1", key: "bkv52" }],
  ["path", { d: "M12 8v13", key: "1c76mn" }],
  ["path", { d: "M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7", key: "6wjy6b" }],
  [
    "path",
    {
      d: "M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",
      key: "1ihvrl"
    }
  ]
];
const Gift = createLucideIcon("gift", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z", key: "q3az6g" }
  ],
  ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8", key: "1h4pet" }],
  ["path", { d: "M12 17.5v-11", key: "1jc1ny" }]
];
const Receipt = createLucideIcon("receipt", __iconNode$1);
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
  PayFrequency.SemiMonthly,
  PayFrequency.Monthly,
  PayFrequency.Quarterly
];
function fmtCurrency(amount, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD"
  }).format(typeof amount === "bigint" ? Number(amount) / 100 : amount / 100);
}
function StatusBadge({ status }) {
  const cfg = {
    [PayrollStatus.Completed]: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20",
    [PayrollStatus.Approved]: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    [PayrollStatus.Active]: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
    [PayrollStatus.PendingApproval]: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
    [PayrollStatus.Rejected]: "bg-destructive/15 text-destructive border-destructive/20",
    [PayrollStatus.Processed]: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      className: `${cfg[status] ?? "bg-muted text-muted-foreground"} text-xs`,
      children: status
    }
  );
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
function openPayStub(stub, emp) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Pay Stub — ${emp.firstName} ${emp.lastName}</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 600px; margin: 40px auto; padding: 0 24px; color: #111; }
  h1 { font-size: 22px; margin-bottom: 4px; } 
  .company { color: #555; font-size: 14px; margin-bottom: 24px; }
  .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; }
  .row.total { font-weight: 700; font-size: 16px; border-bottom: 2px solid #111; }
  .section { margin-top: 24px; } .section h2 { font-size: 13px; text-transform: uppercase; color: #888; letter-spacing: .06em; margin-bottom: 8px; }
  @media print { body { margin: 0; } }
</style></head>
<body>
  <h1>Pay Stub</h1>
  <p class="company">Fourthspace · Period: ${stub.period}</p>
  <div class="section"><h2>Employee</h2>
    <div class="row"><span>Name</span><span>${emp.firstName} ${emp.lastName}</span></div>
    <div class="row"><span>Email</span><span>${emp.email}</span></div>
    <div class="row"><span>Generated</span><span>${new Date(Number(stub.generatedAt) / 1e6).toLocaleDateString("en-US", { dateStyle: "long" })}</span></div>
  </div>
  <div class="section"><h2>Earnings</h2>
    <div class="row"><span>Gross Pay</span><span>$${(stub.grossPay / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
  </div>
  <div class="section"><h2>Deductions</h2>
    <div class="row"><span>Tax Deductions</span><span>$${(stub.taxDeductions / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
    <div class="row"><span>Other Deductions</span><span>$${(stub.otherDeductions / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
  </div>
  <div class="section">
    <div class="row total"><span>Net Pay</span><span>$${(stub.netPay / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
  </div>
  <p style="margin-top:40px;font-size:12px;color:#aaa">This is an auto-generated pay stub from Fourthspace. Print or save as PDF using your browser.</p>
  <script>window.onload = function() { window.print(); }<\/script>
</body></html>`;
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}
function EmployeeDetailPage() {
  const { employeeId } = useParams({
    from: "/app/$workspaceId/payroll/employees/$employeeId"
  });
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();
  const [tab, setTab] = reactExports.useState("details");
  const [editing, setEditing] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(null);
  const [confirmDeactivate, setConfirmDeactivate] = reactExports.useState(false);
  const [showAddDeduction, setShowAddDeduction] = reactExports.useState(false);
  const [showAddBenefit, setShowAddBenefit] = reactExports.useState(false);
  const [dedForm, setDedForm] = reactExports.useState({
    name: "",
    amount: "",
    frequency: DeductionFrequency.perRun,
    deductionType: DeductionType.preTax
  });
  const [benForm, setBenForm] = reactExports.useState({
    name: "",
    monthlyCost: "",
    startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    endDate: ""
  });
  const { data: employee, isLoading } = useQuery({
    queryKey: ["employee", tenantId, workspaceId, employeeId],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getEmployee(tenantId, workspaceId, employeeId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: payrollHistory = [], isLoading: histLoading } = useQuery({
    queryKey: ["payrollRecords", tenantId, workspaceId, employeeId],
    queryFn: async () => actor ? actor.listPayrollRecords(tenantId, workspaceId, employeeId) : [],
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: deductions = [], isLoading: dedLoading } = useQuery({
    queryKey: ["deductions", tenantId, workspaceId, employeeId],
    queryFn: async () => actor ? actor.listDeductions(tenantId, workspaceId, employeeId) : [],
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: benefits = [], isLoading: benLoading } = useQuery({
    queryKey: ["benefits", tenantId, workspaceId, employeeId],
    queryFn: async () => actor ? actor.listBenefits(tenantId, workspaceId, employeeId) : [],
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: payStubs = [], isLoading: stubLoading } = useQuery({
    queryKey: ["payStubs", tenantId, workspaceId, employeeId],
    queryFn: async () => actor ? actor.listPayStubs(tenantId, workspaceId, employeeId) : [],
    enabled: !!actor && !isFetching && !!workspaceId
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
        userId: employee.userId,
        payScheduleId: employee.payScheduleId ?? "",
        contractorFlag: employee.contractorFlag ?? false,
        timeZone: employee.timeZone ?? ""
      };
      const res = await actor.updateEmployee(
        tenantId,
        workspaceId,
        employeeId,
        input
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (updated) => {
      ue.success("Employee updated");
      queryClient.setQueryData(
        ["employee", tenantId, workspaceId, employeeId],
        updated
      );
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setEditing(false);
    },
    onError: (e) => ue.error(e.message)
  });
  const deactivateEmployee = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const res = await actor.deactivateEmployee(
        tenantId,
        workspaceId,
        employeeId
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (updated) => {
      ue.success("Employee deactivated");
      queryClient.setQueryData(
        ["employee", tenantId, workspaceId, employeeId],
        updated
      );
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setConfirmDeactivate(false);
    },
    onError: (e) => ue.error(e.message)
  });
  const addDeduction = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const input = {
        name: dedForm.name.trim(),
        employeeId,
        frequency: dedForm.frequency,
        amount: Math.round(Number.parseFloat(dedForm.amount) * 100),
        deductionType: dedForm.deductionType
      };
      const res = await actor.addDeduction(tenantId, workspaceId, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      ue.success("Deduction added");
      queryClient.invalidateQueries({ queryKey: ["deductions"] });
      setShowAddDeduction(false);
      setDedForm({
        name: "",
        amount: "",
        frequency: DeductionFrequency.perRun,
        deductionType: DeductionType.preTax
      });
    },
    onError: (e) => ue.error(e.message)
  });
  const addBenefit = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const input = {
        name: benForm.name.trim(),
        employeeId,
        monthlyCost: Math.round(Number.parseFloat(benForm.monthlyCost) * 100),
        startDate: benForm.startDate,
        endDate: benForm.endDate || void 0
      };
      const res = await actor.addBenefit(tenantId, workspaceId, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      ue.success("Benefit added");
      queryClient.invalidateQueries({ queryKey: ["benefits"] });
      setShowAddBenefit(false);
      setBenForm({
        name: "",
        monthlyCost: "",
        startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        endDate: ""
      });
    },
    onError: (e) => ue.error(e.message)
  });
  const startEdit = () => {
    if (employee) {
      setForm(employeeToForm(employee));
      setEditing(true);
    }
  };
  const setField = (k) => (e) => setForm((prev) => prev ? { ...prev, [k]: e.target.value } : prev);
  if (isLoading)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-6 md:p-8 max-w-4xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 rounded-2xl" })
    ] });
  if (!employee)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 flex flex-col items-center justify-center gap-4 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "h-8 w-8 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-foreground", children: "Employee not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/app/${workspaceId}/payroll/employees`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "Back to Employees"
      ] }) })
    ] });
  const TABS = [
    { id: "details", label: "Details", icon: BadgeDollarSign },
    { id: "deductions", label: "Deductions", icon: CircleMinus },
    { id: "benefits", label: "Benefits", icon: Gift },
    { id: "paystubs", label: "Pay Stubs", icon: Receipt }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-6 md:p-8 max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 flex-wrap justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            asChild: true,
            "aria-label": "Back to Employees",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${workspaceId}/payroll/employees`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) })
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
              "Edit"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex gap-0.5 border-b border-border",
        "data-ocid": "employee-detail-tabs",
        children: TABS.map(({ id, label, icon: Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setTab(id),
            "data-ocid": `emp-tab-${id}`,
            className: `inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === id ? "border-green-600 text-green-700 dark:text-green-400" : "border-transparent text-muted-foreground hover:text-foreground"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
              label
            ]
          },
          id
        ))
      }
    ),
    tab === "details" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      editing && form ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "border-green-500/20 bg-green-500/[0.02]",
          "data-ocid": "emp-edit-form",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3 flex flex-row items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold", children: "Edit Employee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  onClick: () => setEditing(false),
                  "aria-label": "Cancel",
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
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "First Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        value: form.firstName,
                        onChange: setField("firstName"),
                        required: true,
                        "data-ocid": "edit-firstname"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Last Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        value: form.lastName,
                        onChange: setField("lastName"),
                        required: true,
                        "data-ocid": "edit-lastname"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Email" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "email",
                        value: form.email,
                        onChange: setField("email"),
                        required: true,
                        "data-ocid": "edit-email"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Annual Salary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "number",
                        min: "0",
                        step: "0.01",
                        value: form.salary,
                        onChange: setField("salary"),
                        required: true,
                        "data-ocid": "edit-salary"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Currency" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        value: form.currency,
                        onChange: setField("currency"),
                        maxLength: 3,
                        "data-ocid": "edit-currency"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Pay Frequency" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "select",
                      {
                        value: form.payFrequency,
                        onChange: setField("payFrequency"),
                        "data-ocid": "edit-pay-frequency",
                        className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        children: FREQUENCIES.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: f, children: f }, f))
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tax Rate (%)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "number",
                        min: "0",
                        max: "100",
                        value: form.taxRate,
                        onChange: setField("taxRate"),
                        required: true,
                        "data-ocid": "edit-tax-rate"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Start Date" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "date",
                        value: form.startDate,
                        onChange: setField("startDate"),
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
                          "Save Changes"
                        ] })
                      }
                    )
                  ] })
                ]
              }
            ) })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", "data-ocid": "emp-profile-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeDollarSign, { className: "h-4 w-4 text-green-600 dark:text-green-400" }),
          "Employment Details"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-muted-foreground mb-1", children: "Annual Salary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-semibold text-foreground tabular-nums", children: fmtCurrency(employee.salary, employee.currency) })
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-semibold text-foreground tabular-nums", children: fmtCurrency(
              payrollHistory.reduce((s, r) => s + r.amount, 0n),
              employee.currency
            ) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", "data-ocid": "emp-payroll-history", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold", children: "Payroll History" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: histLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-xl" }, n)) }) : payrollHistory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "py-10 text-center text-sm text-muted-foreground",
            "data-ocid": "emp-history-empty",
            children: "No payroll records yet."
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-left font-medium text-muted-foreground", children: "Period" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-right font-medium text-muted-foreground", children: "Gross" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-right font-medium text-muted-foreground", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-right font-medium text-muted-foreground hidden sm:table-cell", children: "Date" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: [...payrollHistory].sort(
            (a, b) => Number(b.createdAt) - Number(a.createdAt)
          ).map((record) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border/60 last:border-0",
              "data-ocid": `emp-record-${record.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pr-4 font-medium text-foreground", children: record.period }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pr-4 text-right font-mono tabular-nums font-semibold text-foreground", children: fmtCurrency(record.amount, record.currency) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pr-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: record.status }) }),
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
                  "This removes ",
                  employee.firstName,
                  " from active payroll."
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
                  " from active payroll."
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
    ] }),
    tab === "deductions" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          deductions.length,
          " deduction",
          deductions.length !== 1 ? "s" : "",
          " ",
          "configured"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => setShowAddDeduction((v) => !v),
            "data-ocid": "add-deduction-btn",
            children: showAddDeduction ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-1.5 h-3.5 w-3.5" }),
              "Cancel"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1.5 h-3.5 w-3.5" }),
              "Add Deduction"
            ] })
          }
        )
      ] }),
      showAddDeduction && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "border-border bg-muted/10",
          "data-ocid": "add-deduction-form",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              onSubmit: (e) => {
                e.preventDefault();
                addDeduction.mutate();
              },
              className: "grid gap-4 sm:grid-cols-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Deduction Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: dedForm.name,
                      onChange: (e) => setDedForm((p) => ({ ...p, name: e.target.value })),
                      placeholder: "Health Insurance",
                      required: true,
                      "data-ocid": "ded-name"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Amount (USD)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      min: "0",
                      step: "0.01",
                      value: dedForm.amount,
                      onChange: (e) => setDedForm((p) => ({ ...p, amount: e.target.value })),
                      placeholder: "50.00",
                      required: true,
                      "data-ocid": "ded-amount"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Frequency" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      value: dedForm.frequency,
                      onChange: (e) => setDedForm((p) => ({
                        ...p,
                        frequency: e.target.value
                      })),
                      className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      "data-ocid": "ded-frequency",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: DeductionFrequency.perRun, children: "Per Run" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: DeductionFrequency.annual, children: "Annual" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      value: dedForm.deductionType,
                      onChange: (e) => setDedForm((p) => ({
                        ...p,
                        deductionType: e.target.value
                      })),
                      className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      "data-ocid": "ded-type",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: DeductionType.preTax, children: "Pre-Tax" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: DeductionType.postTax, children: "Post-Tax" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 flex gap-3 justify-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: () => setShowAddDeduction(false),
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      size: "sm",
                      disabled: addDeduction.isPending,
                      className: "bg-green-600 hover:bg-green-700 text-white",
                      "data-ocid": "ded-submit",
                      children: addDeduction.isPending ? "Adding…" : "Add Deduction"
                    }
                  )
                ] })
              ]
            }
          ) })
        }
      ),
      dedLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" }, n)) }) : deductions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 py-14 text-center",
          "data-ocid": "deductions-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleMinus, { className: "h-8 w-8 text-muted-foreground/30 mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No deductions yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Add deductions like health insurance or pension contributions." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium text-muted-foreground", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-medium text-muted-foreground", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell", children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell", children: "Frequency" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium text-muted-foreground", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: deductions.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border/60 last:border-0",
            "data-ocid": `deduction-row-${d.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: d.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono tabular-nums text-foreground", children: [
                "$",
                (d.amount / 100).toLocaleString("en-US", {
                  minimumFractionDigits: 2
                })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden sm:table-cell text-muted-foreground capitalize", children: d.deductionType === DeductionType.preTax ? "Pre-Tax" : "Post-Tax" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden sm:table-cell text-muted-foreground capitalize", children: d.frequency === DeductionFrequency.perRun ? "Per Run" : "Annual" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: d.isActive ? "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20 text-xs" : "bg-muted text-muted-foreground text-xs",
                  children: d.isActive ? "Active" : "Inactive"
                }
              ) })
            ]
          },
          d.id
        )) })
      ] }) })
    ] }),
    tab === "benefits" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          benefits.length,
          " benefit",
          benefits.length !== 1 ? "s" : "",
          " ",
          "enrolled"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => setShowAddBenefit((v) => !v),
            "data-ocid": "add-benefit-btn",
            children: showAddBenefit ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-1.5 h-3.5 w-3.5" }),
              "Cancel"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1.5 h-3.5 w-3.5" }),
              "Add Benefit"
            ] })
          }
        )
      ] }),
      showAddBenefit && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "border-border bg-muted/10",
          "data-ocid": "add-benefit-form",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              onSubmit: (e) => {
                e.preventDefault();
                addBenefit.mutate();
              },
              className: "grid gap-4 sm:grid-cols-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Benefit Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: benForm.name,
                      onChange: (e) => setBenForm((p) => ({ ...p, name: e.target.value })),
                      placeholder: "Health Insurance Plan A",
                      required: true,
                      "data-ocid": "ben-name"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Monthly Cost (USD)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      min: "0",
                      step: "0.01",
                      value: benForm.monthlyCost,
                      onChange: (e) => setBenForm((p) => ({
                        ...p,
                        monthlyCost: e.target.value
                      })),
                      placeholder: "150.00",
                      required: true,
                      "data-ocid": "ben-cost"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Start Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "date",
                      value: benForm.startDate,
                      onChange: (e) => setBenForm((p) => ({ ...p, startDate: e.target.value })),
                      required: true,
                      "data-ocid": "ben-start"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "End Date (optional)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "date",
                      value: benForm.endDate,
                      onChange: (e) => setBenForm((p) => ({ ...p, endDate: e.target.value })),
                      "data-ocid": "ben-end"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 flex gap-3 justify-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: () => setShowAddBenefit(false),
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      size: "sm",
                      disabled: addBenefit.isPending,
                      className: "bg-green-600 hover:bg-green-700 text-white",
                      "data-ocid": "ben-submit",
                      children: addBenefit.isPending ? "Adding…" : "Add Benefit"
                    }
                  )
                ] })
              ]
            }
          ) })
        }
      ),
      benLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" }, n)) }) : benefits.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 py-14 text-center",
          "data-ocid": "benefits-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-8 w-8 text-muted-foreground/30 mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No benefits enrolled" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Add health insurance, retirement plans, and more." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium text-muted-foreground", children: "Benefit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-medium text-muted-foreground", children: "Monthly Cost" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell", children: "Start" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell", children: "End" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium text-muted-foreground", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: benefits.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border/60 last:border-0",
            "data-ocid": `benefit-row-${b.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: b.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono tabular-nums text-foreground", children: [
                "$",
                (b.monthlyCost / 100).toLocaleString("en-US", {
                  minimumFractionDigits: 2
                })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden sm:table-cell text-muted-foreground", children: b.startDate }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden sm:table-cell text-muted-foreground", children: b.endDate ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: b.isActive ? "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20 text-xs" : "bg-muted text-muted-foreground text-xs",
                  children: b.isActive ? "Active" : "Ended"
                }
              ) })
            ]
          },
          b.id
        )) })
      ] }) })
    ] }),
    tab === "paystubs" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        payStubs.length,
        " pay stub",
        payStubs.length !== 1 ? "s" : "",
        " ",
        "generated"
      ] }),
      stubLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" }, n)) }) : payStubs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 py-14 text-center",
          "data-ocid": "paystubs-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-8 w-8 text-muted-foreground/30 mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No pay stubs yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Pay stubs are generated automatically when payroll is processed." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium text-muted-foreground", children: "Period" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-medium text-muted-foreground", children: "Gross Pay" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-medium text-muted-foreground hidden sm:table-cell", children: "Tax" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-medium text-muted-foreground", children: "Net Pay" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-medium text-muted-foreground", children: "Download" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: [...payStubs].sort(
          (a, b) => Number(b.generatedAt) - Number(a.generatedAt)
        ).map((stub) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border/60 last:border-0",
            "data-ocid": `paystub-row-${stub.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: stub.period }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono tabular-nums text-foreground", children: [
                "$",
                (stub.grossPay / 100).toLocaleString("en-US", {
                  minimumFractionDigits: 2
                })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono tabular-nums text-muted-foreground hidden sm:table-cell", children: [
                "$",
                (stub.taxDeductions / 100).toLocaleString("en-US", {
                  minimumFractionDigits: 2
                })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono tabular-nums font-semibold text-foreground", children: [
                "$",
                (stub.netPay / 100).toLocaleString("en-US", {
                  minimumFractionDigits: 2
                })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8",
                  onClick: () => openPayStub(stub, employee),
                  "aria-label": "Download pay stub",
                  "data-ocid": `paystub-download-${stub.id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 text-muted-foreground" })
                }
              ) })
            ]
          },
          stub.id
        )) })
      ] }) })
    ] })
  ] });
}
export {
  EmployeeDetailPage as default
};
