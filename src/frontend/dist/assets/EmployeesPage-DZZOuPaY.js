const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-CeqQA3r7.js","assets/index-DemOGW1B.js","assets/index-C9FzSvQ2.css"])))=>i.map(i=>d[i]);
import { g as getTenantId, f as useWorkspace, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, X, P as Plus, n as useQueryClient, aa as PayFrequency, ab as __vitePreload } from "./index-DemOGW1B.js";
import { B as Badge } from "./badge-BgvX66QS.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-wtglWSxh.js";
import { I as Input } from "./input-1iXuA55D.js";
import { L as Label } from "./label-mmRgUQzR.js";
import { S as Skeleton } from "./skeleton-M5HtR2mS.js";
import { u as useMutation } from "./useMutation-4TvYOXEz.js";
import { u as ue } from "./index-BBpqu5x7.js";
import { u as useBackend } from "./index-CeqQA3r7.js";
import { A as ArrowLeft } from "./arrow-left-lpbCbWBz.js";
import { S as Search } from "./search-CqVwSPFD.js";
import { U as Users } from "./users-CP73E1L-.js";
import { M as Mail } from "./mail-B0hgdLqH.js";
import { C as ChevronRight } from "./chevron-right-B2GYyexT.js";
const FREQUENCIES = [
  PayFrequency.Weekly,
  PayFrequency.BiWeekly,
  PayFrequency.SemiMonthly,
  PayFrequency.Monthly,
  PayFrequency.Quarterly
];
function AddEmployeeForm({
  onClose,
  tenantId,
  workspaceId,
  paySchedules
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [form, setForm] = reactExports.useState({
    firstName: "",
    lastName: "",
    email: "",
    salary: "",
    currency: "USD",
    payFrequency: PayFrequency.Monthly,
    taxRate: "20",
    startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    payScheduleId: "",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    isContractor: false
  });
  const addEmployee = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const { Principal } = await __vitePreload(async () => {
        const { Principal: Principal2 } = await import("./index-CeqQA3r7.js").then((n) => n.i);
        return { Principal: Principal2 };
      }, true ? __vite__mapDeps([0,1,2]) : void 0);
      const input = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        salary: BigInt(Math.round(Number.parseFloat(form.salary) * 100)),
        currency: form.currency,
        payFrequency: form.payFrequency,
        taxRate: BigInt(Number.parseInt(form.taxRate)),
        startDate: BigInt(new Date(form.startDate).getTime() * 1e6),
        userId: Principal.anonymous(),
        payScheduleId: form.payScheduleId ?? "",
        timeZone: form.timeZone ?? "",
        contractorFlag: form.isContractor
      };
      const res = await actor.addEmployee(tenantId, workspaceId, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      ue.success("Employee added");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onClose();
    },
    onError: (e) => ue.error(e.message)
  });
  const set = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "shadow-card rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02]",
      "data-ocid": "add-employee-form",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3 flex flex-row items-center justify-between border-b border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" }),
            "Add New Employee"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: onClose,
              "aria-label": "Close",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: (e) => {
              e.preventDefault();
              addEmployee.mutate();
            },
            className: "grid gap-4 sm:grid-cols-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "firstName", children: "First Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "firstName",
                    value: form.firstName,
                    onChange: set("firstName"),
                    placeholder: "Jane",
                    required: true,
                    "data-ocid": "emp-firstname"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "lastName", children: "Last Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "lastName",
                    value: form.lastName,
                    onChange: set("lastName"),
                    placeholder: "Smith",
                    required: true,
                    "data-ocid": "emp-lastname"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "email",
                    type: "email",
                    value: form.email,
                    onChange: set("email"),
                    placeholder: "jane.smith@company.com",
                    required: true,
                    "data-ocid": "emp-email"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "salary", children: "Annual Salary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "salary",
                    type: "number",
                    min: "0",
                    step: "0.01",
                    value: form.salary,
                    onChange: set("salary"),
                    placeholder: "65000",
                    required: true,
                    "data-ocid": "emp-salary"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "taxRate", children: "Tax Rate (%)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "taxRate",
                    type: "number",
                    min: "0",
                    max: "100",
                    value: form.taxRate,
                    onChange: set("taxRate"),
                    placeholder: "20",
                    required: true,
                    "data-ocid": "emp-tax-rate"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "payFrequency", children: "Pay Frequency" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    id: "payFrequency",
                    value: form.payFrequency,
                    onChange: set("payFrequency"),
                    "data-ocid": "emp-pay-frequency",
                    className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    children: FREQUENCIES.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: f, children: f }, f))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "currency", children: "Currency" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "currency",
                    value: form.currency,
                    onChange: set("currency"),
                    placeholder: "USD",
                    maxLength: 3,
                    "data-ocid": "emp-currency"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "startDate", children: "Start Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "startDate",
                    type: "date",
                    value: form.startDate,
                    onChange: set("startDate"),
                    required: true,
                    "data-ocid": "emp-start-date"
                  }
                )
              ] }),
              paySchedules.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "payScheduleId", children: "Pay Schedule" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    id: "payScheduleId",
                    value: form.payScheduleId,
                    onChange: set("payScheduleId"),
                    "data-ocid": "emp-pay-schedule",
                    className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "None (default)" }),
                      paySchedules.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.name }, s.id))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    id: "isContractor",
                    checked: form.isContractor,
                    onChange: (e) => setForm((prev) => ({ ...prev, isContractor: e.target.checked })),
                    className: "h-4 w-4 rounded border-input",
                    "data-ocid": "emp-contractor-toggle"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "isContractor", className: "cursor-pointer", children: "Mark as contractor" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 flex gap-3 justify-end pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Cancel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    disabled: addEmployee.isPending,
                    className: "bg-emerald-600 hover:bg-emerald-700 text-white active-press",
                    "data-ocid": "emp-submit-btn",
                    children: addEmployee.isPending ? "Saving…" : "Add Employee"
                  }
                )
              ] })
            ]
          }
        ) })
      ]
    }
  );
}
function EmployeesPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const [showForm, setShowForm] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const [filter, setFilter] = reactExports.useState("all");
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees", tenantId, workspaceId],
    queryFn: async () => actor ? actor.listEmployees(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: paySchedules = [] } = useQuery({
    queryKey: ["paySchedules", tenantId, workspaceId],
    queryFn: async () => actor ? actor.listPaySchedules(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const filtered = employees.filter((e) => {
    const matchStatus = filter === "all" || filter === "active" && e.isActive || filter === "inactive" && !e.isActive;
    const q = search.toLowerCase();
    const matchSearch = !q || `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) || e.email.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });
  const activeCount = employees.filter((e) => e.isActive).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-6 space-y-6 max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            asChild: true,
            "aria-label": "Back to Payroll",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${workspaceId}/payroll`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: "Employees" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isLoading ? "Loading…" : `${activeCount} active · ${employees.length} total` })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => setShowForm((v) => !v),
          className: "bg-emerald-600 hover:bg-emerald-700 text-white active-press",
          "data-ocid": "employee-add-btn",
          children: showForm ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-2 h-4 w-4" }),
            "Cancel"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
            "Add Employee"
          ] })
        }
      )
    ] }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddEmployeeForm,
      {
        onClose: () => setShowForm(false),
        tenantId,
        workspaceId,
        paySchedules
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search employees…",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-9",
            "data-ocid": "employees-search"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex gap-1 p-1 bg-muted rounded-lg",
          "data-ocid": "employees-filter",
          children: ["all", "active", "inactive"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setFilter(f),
              className: `px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${filter === f ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
              "data-ocid": `employees-filter-${f}`,
              children: f
            },
            f
          ))
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3, 4].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[68px] rounded-xl" }, n)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center",
        "data-ocid": "employees-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-7 w-7 text-emerald-600 dark:text-emerald-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: search || filter !== "all" ? "No employees match filters" : "No employees yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground max-w-xs", children: search || filter !== "all" ? "Try adjusting your search or filters." : "Add your first employee to start managing payroll." }),
          !search && filter === "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "mt-6 bg-emerald-600 hover:bg-emerald-700 text-white active-press",
              onClick: () => setShowForm(true),
              "data-ocid": "employees-empty-cta",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                "Add First Employee"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-xl border border-border/50 bg-card shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/40 bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Employee" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell", children: "Pay Schedule" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell", children: "Salary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", "aria-label": "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/40", children: filtered.map((emp) => {
        const sched = paySchedules.find(
          (s) => s.id === emp.payScheduleId
        );
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `employee-row-${emp.id}`,
            className: "hover:bg-muted/50 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 font-semibold text-emerald-600 dark:text-emerald-400 text-sm", children: [
                  emp.firstName[0],
                  emp.lastName[0]
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-foreground truncate max-w-[120px]", children: [
                    emp.firstName,
                    " ",
                    emp.lastName
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: emp.payFrequency })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3.5 w-3.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[160px]", children: emp.email })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell text-muted-foreground text-sm", children: sched ? sched.name : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right hidden md:table-cell", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold tabular-nums text-foreground", children: [
                  "$",
                  (Number(emp.salary) / 100).toLocaleString("en-US", {
                    minimumFractionDigits: 2
                  })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs text-muted-foreground", children: emp.currency })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${emp.isActive ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"}`,
                    children: emp.isActive ? "Active" : "Inactive"
                  }
                ),
                emp.isContractor && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-xs text-muted-foreground",
                    children: "1099"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: `/app/${workspaceId}/payroll/employees/${emp.id}`,
                  "aria-label": `View ${emp.firstName} ${emp.lastName}`,
                  className: "inline-flex items-center justify-center h-7 w-7 rounded-lg hover:bg-muted transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
                }
              ) })
            ]
          },
          emp.id
        );
      }) })
    ] }) })
  ] });
}
export {
  EmployeesPage as default
};
