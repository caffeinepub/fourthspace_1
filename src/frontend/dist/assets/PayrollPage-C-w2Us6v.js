import { m as useParams, f as useWorkspace, d as useNavigate, n as useQueryClient, h as useQuery, j as jsxRuntimeExports, B as Button, W as Wallet, k as Building2, ac as PayrollStatus, P as Plus } from "./index-1XRv9GHr.js";
import { B as Badge } from "./badge-rX4oLW6l.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-CFU1s52N.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { u as useMutation } from "./useMutation-X94w2CVk.js";
import { u as ue } from "./index-BOWFyaIB.js";
import { u as useBackend } from "./useBackend-DyFxq-Jw.js";
import { f as format } from "./format-BjBbZPfh.js";
import { B as BadgeDollarSign } from "./badge-dollar-sign-Ce6iylaz.js";
import { C as CircleCheck } from "./circle-check-DTEyto7g.js";
import { U as Users } from "./users-BwTeKVE_.js";
import { T as TriangleAlert } from "./triangle-alert-Dm4aJj7p.js";
import { C as Clock } from "./clock-By6uj0s2.js";
import { L as LoaderCircle } from "./loader-circle-CtmMa9i8.js";
import "./en-US-CJ_JRP0W.js";
function formatICP(e8s) {
  return `${(Number(e8s) / 1e8).toFixed(4)} ICP`;
}
const PAYROLL_STATUS_COLORS = {
  [PayrollStatus.Active]: "bg-primary/10 text-primary",
  [PayrollStatus.Approved]: "bg-accent/10 text-accent-foreground",
  [PayrollStatus.Processed]: "bg-accent/10 text-accent-foreground",
  [PayrollStatus.Completed]: "bg-muted text-muted-foreground",
  [PayrollStatus.PendingApproval]: "bg-secondary/10 text-secondary-foreground",
  [PayrollStatus.Rejected]: "bg-destructive/10 text-destructive",
  [PayrollStatus.Paused]: "bg-muted text-muted-foreground"
};
function PayrollPage() {
  const { workspaceId } = useParams({ strict: false });
  const { tenantId } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: treasury, isLoading: loadingTreasury } = useQuery({
    queryKey: ["treasury", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWorkspaceTreasury(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: employees = [], isLoading: loadingEmployees } = useQuery({
    queryKey: ["employees", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEmployees(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: records = [], isLoading: loadingRecords } = useQuery({
    queryKey: ["payroll", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPayrollRecords(tenantId, workspaceId, null);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const processMutation = useMutation({
    mutationFn: async ({
      employeeId,
      period
    }) => {
      if (!actor) throw new Error("Not connected");
      if (!hasTreasuryBalance) {
        throw new Error(
          "The workspace treasury has no funds. Please fund the treasury before processing payroll."
        );
      }
      const r = await actor.processPayroll(
        tenantId,
        workspaceId,
        employeeId,
        period
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      ue.success("Payroll processed");
      void queryClient.invalidateQueries({ queryKey: ["payroll"] });
    },
    onError: (e) => ue.error(e.message)
  });
  const hasTreasuryBalance = treasury != null && treasury.icpBalance > 0n;
  const isLoading = loadingTreasury || loadingEmployees || loadingRecords;
  const currentPeriod = format(/* @__PURE__ */ new Date(), "yyyy-MM");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 p-4 sm:p-6 max-w-5xl mx-auto w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeDollarSign, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold font-display text-foreground", children: "Payroll" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage employee pay and approvals" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => navigate({
              to: `/app/${workspaceId}/payroll/bulk-approval`
            }),
            "data-ocid": "payroll-bulk-approval-btn",
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
              "Bulk Approval"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => navigate({ to: `/app/${workspaceId}/payroll/employees` }),
            "data-ocid": "payroll-employees-btn",
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
              "Employees"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            onClick: () => navigate({ to: `/app/${workspaceId}/payroll/audit-log` }),
            "data-ocid": "payroll-audit-btn",
            className: "gap-1.5",
            children: "Audit Log"
          }
        )
      ] })
    ] }),
    loadingTreasury ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-lg" }) : !hasTreasuryBalance ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "payroll-balance-warning",
        className: "flex items-start gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-destructive mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-destructive", children: "Treasury balance is empty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "The workspace treasury has no funds. Please fund the treasury wallet before processing payroll." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "shrink-0 gap-1.5",
              onClick: () => navigate({ to: `/app/${workspaceId}/wallet` }),
              "data-ocid": "payroll-fund-treasury-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-3.5 h-3.5" }),
                "Fund Treasury"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-4 h-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Treasury balance:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: formatICP(treasury.icpBalance) })
      ] })
    ] }),
    hasTreasuryBalance && employees.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-display flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
        "Process Payroll — ",
        currentPeriod
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-4 pb-4 pt-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: employees.slice(0, 8).map((emp) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground truncate", children: [
                  emp.firstName,
                  " ",
                  emp.lastName
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: emp.email })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
                  Number(emp.salary).toLocaleString(),
                  " ",
                  emp.currency
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: emp.payFrequency })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  "data-ocid": `payroll-process-${emp.id}`,
                  disabled: processMutation.isPending || !hasTreasuryBalance,
                  onClick: () => processMutation.mutate({
                    employeeId: emp.id,
                    period: currentPeriod
                  }),
                  className: "text-xs h-7 px-2 shrink-0",
                  children: processMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" }) : "Process"
                }
              )
            ]
          },
          emp.id
        )) }),
        employees.length > 8 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-3 text-center", children: [
          "+",
          employees.length - 8,
          " more employees — use Bulk Approval to process all."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
      {
        href: `/app/${workspaceId}/payroll/employees`,
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 text-primary" }),
        label: "Employees",
        desc: `${employees.length} active`,
        ocid: "payroll-nav-employees"
      },
      {
        href: `/app/${workspaceId}/payroll/bulk-approval`,
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-primary" }),
        label: "Bulk Approval",
        desc: `${records.filter((r) => r.status === PayrollStatus.PendingApproval).length} pending`,
        ocid: "payroll-nav-bulk"
      },
      {
        href: `/app/${workspaceId}/payroll/audit-log`,
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeDollarSign, { className: "w-5 h-5 text-primary" }),
        label: "Audit Log",
        desc: "Full history",
        ocid: "payroll-nav-audit"
      }
    ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "cursor-pointer hover:border-primary/40 transition-colors",
        onClick: () => navigate({ to: item.href }),
        "data-ocid": item.ocid,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: item.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground font-display", children: item.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: item.desc })
          ] })
        ] })
      },
      item.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground font-display", children: "Recent Payroll Records" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => navigate({
              to: `/app/${workspaceId}/payroll/bulk-approval`
            }),
            className: "text-xs gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
              "View All"
            ]
          }
        )
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-lg" }, k)) }) : records.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "payroll-records-empty",
          className: "flex flex-col items-center justify-center py-12 gap-3 text-center rounded-lg border border-dashed border-border",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeDollarSign, { className: "w-8 h-8 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No payroll records yet" }),
            employees.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                onClick: () => navigate({
                  to: `/app/${workspaceId}/payroll/employees`
                }),
                className: "gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                  "Add Employees"
                ]
              }
            )
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: records.slice(0, 10).map((rec) => /* @__PURE__ */ jsxRuntimeExports.jsx(PayrollRecordRow, { record: rec }, rec.id)) })
    ] })
  ] });
}
function PayrollRecordRow({ record }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `payroll-record-${record.id}`,
      className: "flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:bg-muted/20 transition-colors",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: record.period }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Employee #",
            record.employeeId.slice(0, 8)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
            record.grossAmount.toLocaleString(),
            " ",
            record.currency
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Net: ",
            record.netAmount.toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: `text-xs shrink-0 ${PAYROLL_STATUS_COLORS[record.status] ?? "bg-muted text-muted-foreground"}`,
            children: record.status
          }
        )
      ]
    }
  );
}
export {
  PayrollPage as default
};
