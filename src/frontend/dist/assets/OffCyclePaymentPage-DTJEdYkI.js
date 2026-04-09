import { g as getTenantId, f as useWorkspace, n as useQueryClient, r as reactExports, ae as OffCycleReason, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, W as Wallet, X, P as Plus, D as DollarSign } from "./index-CQ7TXF2a.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DtVZ2GZq.js";
import { I as Input } from "./input-Dkit6sfw.js";
import { L as Label } from "./label-ANHtprqJ.js";
import { S as Skeleton } from "./skeleton-CzZABium.js";
import { S as Switch } from "./switch-BGZRmkVS.js";
import { T as Textarea } from "./textarea-CkHQfDFp.js";
import { u as useMutation } from "./useMutation-fGi-GboX.js";
import { u as ue } from "./index-BGFcG_k-.js";
import { u as useBackend } from "./index--h8TKSCt.js";
import { A as ArrowLeft } from "./arrow-left-D6cz-lXM.js";
import { T as TriangleAlert } from "./triangle-alert-BbQlAF2-.js";
import { R as RefreshCw } from "./refresh-cw-DpvTmWmJ.js";
import { C as CalendarClock } from "./calendar-clock-GFZeyF9l.js";
import "./index-CkN0xm2T.js";
function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD"
  }).format(amount / 100);
}
function formatIcp(balance) {
  return (Number(balance) / 1e8).toFixed(4);
}
const REASON_LABELS = {
  [OffCycleReason.bonus]: "Bonus",
  [OffCycleReason.reimbursement]: "Reimbursement",
  [OffCycleReason.adjustment]: "Adjustment"
};
const REASON_COLORS = {
  [OffCycleReason.bonus]: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
  [OffCycleReason.reimbursement]: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
  [OffCycleReason.adjustment]: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20"
};
function OffCyclePaymentPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    employeeId: "",
    amount: "",
    reason: OffCycleReason.bonus,
    processImmediately: false,
    notes: ""
  });
  const { data: treasury, isLoading: treasuryLoading } = useQuery({
    queryKey: ["workspaceTreasury", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWorkspaceTreasury(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const icpBalance = (treasury == null ? void 0 : treasury.icpBalance) ?? BigInt(0);
  const hasNoFunds = !treasuryLoading && icpBalance === BigInt(0);
  const { data: employees = [], isLoading: empLoading } = useQuery({
    queryKey: ["employees", tenantId, workspaceId],
    queryFn: async () => actor ? actor.listEmployees(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: payments = [], isLoading: payLoading } = useQuery({
    queryKey: ["offCyclePayments", tenantId, workspaceId],
    queryFn: async () => actor ? actor.listOffCyclePayments(tenantId, workspaceId, null) : [],
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const activeEmployees = employees.filter((e) => e.isActive);
  const addPayment = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const input = {
        employeeId: form.employeeId,
        amount: Number.parseFloat(form.amount) * 100,
        reason: form.reason,
        processImmediately: form.processImmediately,
        notes: form.notes.trim()
      };
      const res = await actor.addOffCyclePayment(tenantId, workspaceId, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      ue.success("Off-cycle payment added");
      queryClient.invalidateQueries({ queryKey: ["offCyclePayments"] });
      setShowForm(false);
      setForm({
        employeeId: "",
        amount: "",
        reason: OffCycleReason.bonus,
        processImmediately: false,
        notes: ""
      });
    },
    onError: (e) => {
      if (e.message.toLowerCase().includes("insufficient")) {
        ue.error(
          "Insufficient treasury balance — fund your workspace wallet first."
        );
      } else {
        ue.error(e.message);
      }
    }
  });
  const employeeMap = new Map(employees.map((e) => [e.id, e]));
  const isSubmitDisabled = addPayment.isPending || !form.employeeId || hasNoFunds;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-6 space-y-6 max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, "aria-label": "Back", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${workspaceId}/payroll`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: "Off-Cycle Payments" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Bonuses, reimbursements, and manual adjustments" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        !treasuryLoading && treasury && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Treasury:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: `text-xs font-semibold tabular-nums ${hasNoFunds ? "text-destructive" : "text-foreground"}`,
              "data-ocid": "off-cycle-treasury-balance",
              children: [
                formatIcp(icpBalance),
                " ICP"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => setShowForm((v) => !v),
            disabled: hasNoFunds,
            className: "bg-emerald-600 hover:bg-emerald-700 text-white active-press disabled:opacity-60",
            "data-ocid": "add-off-cycle-btn",
            title: hasNoFunds ? "Fund your workspace wallet before adding off-cycle payments" : void 0,
            children: showForm ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-2 h-4 w-4" }),
              "Cancel"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
              "New Payment"
            ] })
          }
        )
      ] })
    ] }),
    hasNoFunds && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-500/8 px-4 py-3",
        "data-ocid": "off-cycle-no-funds-banner",
        role: "alert",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Treasury wallet is empty — off-cycle payments cannot be processed until the workspace wallet is funded." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              size: "sm",
              variant: "outline",
              className: "shrink-0 gap-1.5 border-amber-400/60 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10",
              "data-ocid": "off-cycle-fund-wallet-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/app/${workspaceId}/wallet`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5" }),
                "Fund Wallet"
              ] })
            }
          )
        ]
      }
    ),
    showForm && !hasNoFunds && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "shadow-card rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02]",
        "data-ocid": "off-cycle-form",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3 flex flex-row items-center justify-between border-b border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" }),
              "New Off-Cycle Payment"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: () => setShowForm(false),
                "aria-label": "Close",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              onSubmit: (e) => {
                e.preventDefault();
                addPayment.mutate();
              },
              className: "space-y-5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "oc-employee", children: "Employee" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "select",
                      {
                        id: "oc-employee",
                        value: form.employeeId,
                        onChange: (e) => setForm((p) => ({ ...p, employeeId: e.target.value })),
                        required: true,
                        "data-ocid": "oc-employee",
                        className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select employee…" }),
                          activeEmployees.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: e.id, children: [
                            e.firstName,
                            " ",
                            e.lastName
                          ] }, e.id))
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "oc-amount", children: "Amount (USD)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm", children: "$" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "oc-amount",
                          type: "number",
                          min: "0",
                          step: "0.01",
                          value: form.amount,
                          onChange: (e) => setForm((p) => ({ ...p, amount: e.target.value })),
                          placeholder: "0.00",
                          required: true,
                          "data-ocid": "oc-amount",
                          className: "pl-7 font-mono text-xl font-bold tabular-nums h-12"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "oc-reason", children: "Reason" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "select",
                      {
                        id: "oc-reason",
                        value: form.reason,
                        onChange: (e) => setForm((p) => ({ ...p, reason: e.target.value })),
                        "data-ocid": "oc-reason",
                        className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-12",
                        children: Object.entries(REASON_LABELS).map(([v, l]) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: v, children: l }, v))
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "oc-notes", children: "Notes" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Textarea,
                      {
                        id: "oc-notes",
                        value: form.notes,
                        onChange: (e) => setForm((p) => ({ ...p, notes: e.target.value })),
                        placeholder: "e.g. Q4 performance bonus",
                        rows: 2,
                        "data-ocid": "oc-notes"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      id: "oc-immediate",
                      checked: form.processImmediately,
                      onCheckedChange: (v) => setForm((p) => ({ ...p, processImmediately: v })),
                      "data-ocid": "oc-immediate-toggle"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "oc-immediate", className: "cursor-pointer", children: "Process immediately (instead of next scheduled run)" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end pt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      onClick: () => setShowForm(false),
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      disabled: isSubmitDisabled,
                      className: "bg-emerald-600 hover:bg-emerald-700 text-white active-press disabled:opacity-60",
                      "data-ocid": "oc-submit-btn",
                      children: addPayment.isPending ? "Submitting…" : "Submit Payment"
                    }
                  )
                ] })
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "shadow-card rounded-xl border border-border/50 bg-card",
        "data-ocid": "off-cycle-list",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold", children: "Pending Off-Cycle Payments" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: payLoading || empLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 p-4", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" }, n)) }) : payments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-12 text-center",
              "data-ocid": "off-cycle-empty",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "h-6 w-6 text-emerald-600 dark:text-emerald-400" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No off-cycle payments yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: hasNoFunds ? "Fund your workspace wallet to enable payments." : `Click "New Payment" to add a bonus or reimbursement.` })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/40 bg-muted/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Employee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell", children: "Reason" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell", children: "Timing" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/40", children: [...payments].sort((a, b) => Number(b.createdAt) - Number(a.createdAt)).map((p) => {
              const emp = employeeMap.get(p.employeeId);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: "hover:bg-muted/50 transition-colors",
                  "data-ocid": `off-cycle-row-${p.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0", children: emp ? `${emp.firstName[0]}${emp.lastName[0]}` : "?" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate max-w-[120px]", children: emp ? `${emp.firstName} ${emp.lastName}` : "—" }),
                        p.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate max-w-[120px]", children: p.notes })
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${REASON_COLORS[p.reason] ?? "bg-muted text-muted-foreground border-border"}`,
                        children: REASON_LABELS[p.reason] ?? p.reason
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono tabular-nums font-bold text-xl text-foreground flex items-center justify-end gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" }),
                      formatCurrency(p.amount)
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: p.processImmediately ? "Immediate" : "Next run" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border bg-muted text-muted-foreground border-border capitalize", children: p.status ?? "pending" }) })
                  ]
                },
                p.id
              );
            }) })
          ] }) }) })
        ]
      }
    )
  ] });
}
export {
  OffCyclePaymentPage as default
};
