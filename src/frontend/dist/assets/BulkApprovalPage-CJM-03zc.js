import { g as getTenantId, f as useWorkspace, n as useQueryClient, r as reactExports, h as useQuery, a8 as PayrollStatus, j as jsxRuntimeExports, B as Button, i as Link, W as Wallet, D as DollarSign } from "./index-CzyNqtbv.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-BTCkNtDu.js";
import { I as Input } from "./input-982h_Ebl.js";
import { S as Skeleton } from "./skeleton-DMAdSNre.js";
import { u as useMutation } from "./useMutation-BsRk2Bod.js";
import { u as ue } from "./index-DaWH_LJ9.js";
import { u as useBackend } from "./index-CJtF1vtU.js";
import { A as ArrowLeft } from "./arrow-left-BnDr9sMT.js";
import { T as TriangleAlert } from "./triangle-alert-B7NWtnMG.js";
import { C as Clock } from "./clock-DD8HS7VE.js";
import { C as CircleCheck } from "./circle-check-Bz_M8Dh9.js";
import { C as CircleX } from "./circle-x-BX5Efhsc.js";
import { S as SquareCheckBig } from "./square-check-big-kPgmw6zy.js";
function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD"
  }).format(Number(amount) / 100);
}
function formatIcp(balance) {
  return (Number(balance) / 1e8).toFixed(4);
}
function BulkApprovalPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [rejectId, setRejectId] = reactExports.useState(null);
  const [rejectReason, setRejectReason] = reactExports.useState("");
  const { data: treasury, isLoading: treasuryLoading } = useQuery({
    queryKey: ["workspaceTreasury", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWorkspaceTreasury(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: records = [], isLoading: recLoading } = useQuery({
    queryKey: ["payrollRecords", tenantId, workspaceId, null],
    queryFn: async () => actor ? actor.listPayrollRecords(tenantId, workspaceId, null) : [],
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: employees = [], isLoading: empLoading } = useQuery({
    queryKey: ["employees", tenantId, workspaceId],
    queryFn: async () => actor ? actor.listEmployees(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const icpBalance = (treasury == null ? void 0 : treasury.icpBalance) ?? BigInt(0);
  const hasNoFunds = !treasuryLoading && icpBalance === BigInt(0);
  const pending = records.filter(
    (r) => r.status === PayrollStatus.PendingApproval
  );
  const approved = records.filter((r) => r.status === PayrollStatus.Approved);
  const rejected = records.filter((r) => r.status === PayrollStatus.Rejected);
  const employeeMap = new Map(employees.map((e) => [e.id, e]));
  const bulkApprove = useMutation({
    mutationFn: async (ids) => {
      if (!actor) throw new Error("Not connected");
      const res = await actor.bulkApprovePayroll(tenantId, workspaceId, ids);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      ue.success("Selected payroll records approved");
      queryClient.invalidateQueries({ queryKey: ["payrollRecords"] });
      setSelected(/* @__PURE__ */ new Set());
    },
    onError: (e) => {
      if (e.message.toLowerCase().includes("insufficient")) {
        ue.error(
          "Insufficient treasury balance — fund your workspace wallet before approving payroll."
        );
      } else {
        ue.error(e.message);
      }
    }
  });
  const rejectRecord = useMutation({
    mutationFn: async ({ id, reason }) => {
      if (!actor) throw new Error("Not connected");
      const res = await actor.rejectPayrollRecord(
        tenantId,
        workspaceId,
        id,
        reason
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      ue.success("Record rejected");
      queryClient.invalidateQueries({ queryKey: ["payrollRecords"] });
      setRejectId(null);
      setRejectReason("");
    },
    onError: (e) => ue.error(e.message)
  });
  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const selectAll = () => setSelected(new Set(pending.map((r) => r.id)));
  const isLoading = recLoading || empLoading;
  const selectedTotal = pending.filter((r) => selected.has(r.id)).reduce((sum, r) => sum + Number(r.netAmount ?? r.amount), 0);
  const isApproveDisabled = selected.size === 0 || bulkApprove.isPending || hasNoFunds;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-6 space-y-6 max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, "aria-label": "Back", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${workspaceId}/payroll`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: "Bulk Approval" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isLoading ? "Loading…" : `${pending.length} pending · ${approved.length} approved · ${rejected.length} rejected` })
        ] })
      ] }),
      !treasuryLoading && treasury && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Treasury:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: `text-xs font-semibold tabular-nums ${hasNoFunds ? "text-destructive" : "text-foreground"}`,
            "data-ocid": "bulk-treasury-balance",
            children: [
              formatIcp(icpBalance),
              " ICP"
            ]
          }
        )
      ] })
    ] }),
    hasNoFunds && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-500/8 px-4 py-3",
        "data-ocid": "bulk-no-funds-banner",
        role: "alert",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Treasury wallet is empty — payroll approval is blocked until the workspace wallet is funded." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              size: "sm",
              variant: "outline",
              className: "shrink-0 gap-1.5 border-amber-400/60 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10",
              "data-ocid": "bulk-fund-wallet-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/app/${workspaceId}/wallet`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5" }),
                "Fund Wallet"
              ] })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-3", children: [
      {
        label: "Pending Approval",
        count: pending.length,
        icon: Clock,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10"
      },
      {
        label: "Approved",
        count: approved.length,
        icon: CircleCheck,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10"
      },
      {
        label: "Rejected",
        count: rejected.length,
        icon: CircleX,
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-500/10"
      }
    ].map(({ label, count, icon: Icon, color, bg }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "shadow-card rounded-xl border border-border/50 bg-card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-5 w-5 ${color}` })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-mono tabular-nums text-foreground", children: isLoading ? "—" : count })
          ] })
        ] })
      },
      label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "shadow-card rounded-xl border border-border/50 bg-card",
        "data-ocid": "bulk-approval-card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3 flex flex-row items-center justify-between border-b border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold", children: "Pending Approvals" }),
            pending.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: selectAll,
                  disabled: selected.size === pending.length,
                  "data-ocid": "bulk-select-all",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "mr-1.5 h-3.5 w-3.5" }),
                    "Select All"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  className: "bg-emerald-600 hover:bg-emerald-700 text-white active-press disabled:opacity-60",
                  disabled: isApproveDisabled,
                  onClick: () => bulkApprove.mutate(Array.from(selected)),
                  "data-ocid": "bulk-approve-btn",
                  title: hasNoFunds ? "Fund your workspace wallet before approving payroll" : selected.size === 0 ? "Select records to approve" : void 0,
                  children: bulkApprove.isPending ? "Approving…" : `Approve ${selected.size > 0 ? `(${selected.size})` : "Selected"}`
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 p-4", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" }, n)) }) : pending.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-12 text-center",
              "data-ocid": "bulk-empty",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-6 w-6 text-emerald-600 dark:text-emerald-400" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "All caught up!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "No payroll records awaiting approval." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/40 bg-muted/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    className: "px-4 py-2.5 text-left w-8",
                    "aria-label": "Select"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Employee" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell", children: "Period" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Gross" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell", children: "Deductions" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Net" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Action" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/40", children: pending.map((record) => {
                const emp = employeeMap.get(record.employeeId);
                const deductions = Number(record.amount) - Number(record.netAmount ?? record.amount);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: `transition-colors ${selected.has(record.id) ? "bg-emerald-500/5" : "hover:bg-muted/50"}`,
                    "data-ocid": `approval-row-${record.id}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: selected.has(record.id),
                          onChange: () => toggleSelect(record.id),
                          disabled: hasNoFunds,
                          className: "h-4 w-4 rounded border-input disabled:opacity-50 disabled:cursor-not-allowed",
                          "aria-label": `Select record for ${emp == null ? void 0 : emp.firstName}`,
                          "data-ocid": `approval-check-${record.id}`
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0", children: emp ? `${emp.firstName[0]}${emp.lastName[0]}` : "?" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate max-w-[120px]", children: emp ? `${emp.firstName} ${emp.lastName}` : record.employeeId.slice(0, 8) })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-muted-foreground hidden sm:table-cell", children: record.period }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-right font-mono tabular-nums font-medium text-foreground", children: formatCurrency(record.amount, record.currency) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-right font-mono tabular-nums text-muted-foreground hidden md:table-cell", children: deductions !== 0 ? `-${formatCurrency(Math.abs(deductions), record.currency)}` : "—" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-right font-mono tabular-nums font-semibold text-foreground", children: formatCurrency(
                        record.netAmount ?? record.amount,
                        record.currency
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-right", children: rejectId === record.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-end flex-wrap", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Input,
                          {
                            value: rejectReason,
                            onChange: (e) => setRejectReason(e.target.value),
                            placeholder: "Rejection reason",
                            className: "h-7 text-xs w-32",
                            "data-ocid": `reject-reason-${record.id}`
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            size: "sm",
                            variant: "destructive",
                            className: "h-7 text-xs px-2",
                            disabled: rejectRecord.isPending,
                            onClick: () => rejectRecord.mutate({
                              id: record.id,
                              reason: rejectReason
                            }),
                            "data-ocid": `confirm-reject-${record.id}`,
                            children: "Confirm"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            size: "sm",
                            variant: "ghost",
                            className: "h-7 text-xs px-2",
                            onClick: () => setRejectId(null),
                            children: "Cancel"
                          }
                        )
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          variant: "outline",
                          size: "sm",
                          className: "h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive",
                          onClick: () => {
                            setRejectId(record.id);
                            setRejectReason("");
                          },
                          "data-ocid": `reject-btn-${record.id}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "mr-1 h-3 w-3" }),
                            " Reject"
                          ]
                        }
                      ) })
                    ]
                  },
                  record.id
                );
              }) })
            ] }) }),
            selected.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/40 bg-muted/20 px-5 py-3 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                selected.size,
                " record",
                selected.size !== 1 ? "s" : "",
                " ",
                "selected"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold font-mono tabular-nums text-foreground", children: [
                "Total net: ",
                formatCurrency(selectedTotal)
              ] })
            ] })
          ] }) })
        ]
      }
    ),
    (approved.length > 0 || rejected.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card rounded-xl border border-border/50 bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold", children: "Recent Decisions" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/40 bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Employee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell", children: "Period" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Decision" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/40", children: [...approved, ...rejected].sort((a, b) => Number(b.createdAt) - Number(a.createdAt)).slice(0, 10).map((record) => {
          const emp = employeeMap.get(record.employeeId);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "hover:bg-muted/50 transition-colors",
              "data-ocid": `decision-row-${record.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium text-foreground", children: emp ? `${emp.firstName} ${emp.lastName}` : "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground hidden sm:table-cell", children: record.period }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right font-mono tabular-nums font-medium text-foreground", children: formatCurrency(record.amount, record.currency) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${record.status === PayrollStatus.Approved ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" : "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-3 w-3 mr-1" }),
                      record.status
                    ]
                  }
                ) })
              ]
            },
            record.id
          );
        }) })
      ] }) }) })
    ] })
  ] });
}
export {
  BulkApprovalPage as default
};
