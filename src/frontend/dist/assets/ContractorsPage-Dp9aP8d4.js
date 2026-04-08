import { g as getTenantId, f as useWorkspace, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, X, P as Plus, F as FileText, n as useQueryClient, aa as ContractorPaymentStatus, ab as ChevronDown, D as DollarSign, ac as ContractorPaymentReason } from "./index-BZqaRhAX.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DQu6DGwy.js";
import { I as Input } from "./input-BJtw5f9h.js";
import { L as Label } from "./label-CvyzRjc5.js";
import { S as Skeleton } from "./skeleton-CXUiMpVp.js";
import { u as useMutation } from "./useMutation-CLofsIuD.js";
import { u as ue } from "./index-BRf-248B.js";
import { u as useBackend } from "./useBackend-DSxJo5MU.js";
import { A as ArrowLeft } from "./arrow-left-BCLeiEG1.js";
import { C as ChevronUp } from "./chevron-up-Dd5ZqoJs.js";
const PAYMENT_REASON_LABELS = {
  [ContractorPaymentReason.freelanceInvoice]: "Freelance Invoice",
  [ContractorPaymentReason.projectMilestone]: "Project Milestone",
  [ContractorPaymentReason.reimbursement]: "Reimbursement",
  [ContractorPaymentReason.other]: "Other"
};
function AddContractorForm({
  onClose,
  tenantId,
  workspaceId
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    taxId: "",
    rate: "",
    currency: "USD"
  });
  const add = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const input = {
        name: form.name.trim(),
        email: form.email.trim(),
        taxId: form.taxId.trim(),
        rate: Number.parseFloat(form.rate) * 100,
        currency: form.currency
      };
      const res = await actor.addContractor(tenantId, workspaceId, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      ue.success("Contractor added");
      queryClient.invalidateQueries({ queryKey: ["contractors"] });
      onClose();
    },
    onError: (e) => ue.error(e.message)
  });
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "shadow-card rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02]",
      "data-ocid": "add-contractor-form",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3 flex flex-row items-center justify-between border-b border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" }),
            "Add Contractor"
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
              add.mutate();
            },
            className: "grid gap-4 sm:grid-cols-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "con-name", children: "Full Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "con-name",
                    value: form.name,
                    onChange: set("name"),
                    placeholder: "Alex Johnson",
                    required: true,
                    "data-ocid": "con-name"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "con-email", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "con-email",
                    type: "email",
                    value: form.email,
                    onChange: set("email"),
                    placeholder: "alex@example.com",
                    required: true,
                    "data-ocid": "con-email"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "con-taxId", children: "Tax ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "con-taxId",
                    value: form.taxId,
                    onChange: set("taxId"),
                    placeholder: "EIN or SSN",
                    "data-ocid": "con-taxid"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "con-currency", children: "Currency" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "con-currency",
                    value: form.currency,
                    onChange: set("currency"),
                    placeholder: "USD",
                    maxLength: 3,
                    "data-ocid": "con-currency"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "con-rate", children: "Hourly Rate (USD)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "con-rate",
                    type: "number",
                    min: "0",
                    step: "0.01",
                    value: form.rate,
                    onChange: set("rate"),
                    placeholder: "150.00",
                    required: true,
                    "data-ocid": "con-rate"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 flex gap-3 justify-end pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Cancel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    disabled: add.isPending,
                    className: "bg-emerald-600 hover:bg-emerald-700 text-white active-press",
                    "data-ocid": "con-submit-btn",
                    children: add.isPending ? "Saving…" : "Add Contractor"
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
function AddPaymentForm({
  contractorId,
  tenantId,
  workspaceId,
  onClose
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [form, setForm] = reactExports.useState({
    amount: "",
    reason: ContractorPaymentReason.freelanceInvoice,
    paymentDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    notes: ""
  });
  const add = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const input = {
        contractorId,
        amount: Number.parseFloat(form.amount) * 100,
        reason: form.reason,
        paymentDate: form.paymentDate,
        notes: form.notes.trim()
      };
      const res = await actor.addContractorPayment(
        tenantId,
        workspaceId,
        input
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      ue.success("Payment added");
      queryClient.invalidateQueries({
        queryKey: ["contractorPayments", contractorId]
      });
      onClose();
    },
    onError: (e) => ue.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: (e) => {
        e.preventDefault();
        add.mutate();
      },
      className: "grid gap-3 sm:grid-cols-2 pt-3 border-t border-border mt-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `pay-amount-${contractorId}`, children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: `pay-amount-${contractorId}`,
              type: "number",
              min: "0",
              step: "0.01",
              value: form.amount,
              onChange: (e) => setForm((p) => ({ ...p, amount: e.target.value })),
              placeholder: "500.00",
              required: true,
              "data-ocid": "cpay-amount"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `pay-reason-${contractorId}`, children: "Reason" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              id: `pay-reason-${contractorId}`,
              value: form.reason,
              onChange: (e) => setForm((p) => ({ ...p, reason: e.target.value })),
              "data-ocid": "cpay-reason",
              className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              children: Object.entries(PAYMENT_REASON_LABELS).map(([v, l]) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: v, children: l }, v))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `pay-date-${contractorId}`, children: "Payment Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: `pay-date-${contractorId}`,
              type: "date",
              value: form.paymentDate,
              onChange: (e) => setForm((p) => ({ ...p, paymentDate: e.target.value })),
              required: true,
              "data-ocid": "cpay-date"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `pay-notes-${contractorId}`, children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: `pay-notes-${contractorId}`,
              value: form.notes,
              onChange: (e) => setForm((p) => ({ ...p, notes: e.target.value })),
              placeholder: "Invoice #123",
              "data-ocid": "cpay-notes"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 flex gap-2 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: onClose, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              size: "sm",
              disabled: add.isPending,
              className: "bg-emerald-600 hover:bg-emerald-700 text-white active-press",
              "data-ocid": "cpay-submit-btn",
              children: add.isPending ? "Saving…" : "Add Payment"
            }
          )
        ] })
      ]
    }
  );
}
function ContractorCard({
  contractor,
  tenantId,
  workspaceId
}) {
  const { actor, isFetching } = useBackend();
  const [expanded, setExpanded] = reactExports.useState(false);
  const [showPayForm, setShowPayForm] = reactExports.useState(false);
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["contractorPayments", contractor.id],
    queryFn: async () => actor ? actor.listContractorPayments(tenantId, workspaceId, contractor.id) : [],
    enabled: !!actor && !isFetching && expanded
  });
  const totalPaid = payments.filter((p) => p.status === ContractorPaymentStatus.processed).reduce((s, p) => s + p.amount, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "rounded-xl border border-border/50 bg-card shadow-card hover:border-emerald-400/30 transition-all",
      "data-ocid": `contractor-card-${contractor.id}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 font-bold text-emerald-600 dark:text-emerald-400", children: contractor.name.charAt(0).toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate", children: contractor.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold border bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20", children: "1099" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: contractor.email })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right hidden sm:block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Rate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold font-mono tabular-nums text-foreground", children: [
                "$",
                (contractor.rate / 100).toLocaleString("en-US", {
                  minimumFractionDigits: 2
                }),
                "/hr"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${contractor.isActive ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"}`,
                children: contractor.isActive ? "Active" : "Inactive"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: () => setExpanded((v) => !v),
                "aria-label": "Toggle payments",
                "data-ocid": `contractor-expand-${contractor.id}`,
                children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 border-t border-border/40 pt-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" }),
              "Invoice History",
              totalPaid > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-normal ml-1", children: [
                "($",
                (totalPaid / 100).toLocaleString("en-US", {
                  minimumFractionDigits: 2
                }),
                " ",
                "total)"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => setShowPayForm((v) => !v),
                "data-ocid": `add-payment-${contractor.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1" }),
                  "Add Payment"
                ]
              }
            )
          ] }),
          showPayForm && /* @__PURE__ */ jsxRuntimeExports.jsx(
            AddPaymentForm,
            {
              contractorId: contractor.id,
              tenantId,
              workspaceId,
              onClose: () => setShowPayForm(false)
            }
          ),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded-lg" }, n)) }) : payments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-muted-foreground text-center py-4",
              "data-ocid": `contractor-payments-empty-${contractor.id}`,
              children: "No payments yet"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: [...payments].sort((a, b) => Number(b.createdAt) - Number(a.createdAt)).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between text-sm py-2 border-b border-border/40 last:border-0",
              "data-ocid": `contractor-payment-${p.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: PAYMENT_REASON_LABELS[p.reason] ?? p.reason }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: p.paymentDate })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold tabular-nums text-foreground", children: [
                    "$",
                    (p.amount / 100).toLocaleString("en-US", {
                      minimumFractionDigits: 2
                    })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium border ${p.status === ContractorPaymentStatus.processed ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20"}`,
                      children: p.status
                    }
                  )
                ] })
              ]
            },
            p.id
          )) })
        ] })
      ] })
    }
  );
}
function ContractorsPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const [showForm, setShowForm] = reactExports.useState(false);
  const { data: contractors = [], isLoading } = useQuery({
    queryKey: ["contractors", tenantId, workspaceId],
    queryFn: async () => actor ? actor.listContractors(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-6 space-y-6 max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, "aria-label": "Back", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${workspaceId}/payroll`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: "Contractors" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isLoading ? "Loading…" : `${contractors.length} contractor${contractors.length !== 1 ? "s" : ""}` })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => setShowForm((v) => !v),
          className: "bg-emerald-600 hover:bg-emerald-700 text-white active-press",
          "data-ocid": "add-contractor-btn",
          children: showForm ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-2 h-4 w-4" }),
            "Cancel"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
            "Add Contractor"
          ] })
        }
      )
    ] }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddContractorForm,
      {
        onClose: () => setShowForm(false),
        tenantId,
        workspaceId
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, n)) }) : contractors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center",
        "data-ocid": "contractors-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-7 w-7 text-emerald-600 dark:text-emerald-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "No contractors yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground max-w-xs", children: "Add contractors to manage freelancer and consultant payments separately from employees." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "mt-6 bg-emerald-600 hover:bg-emerald-700 text-white active-press",
              onClick: () => setShowForm(true),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                "Add First Contractor"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: contractors.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      ContractorCard,
      {
        contractor: c,
        tenantId,
        workspaceId
      },
      c.id
    )) })
  ] });
}
export {
  ContractorsPage as default
};
