import { g as getTenantId, f as useWorkspace, d as useNavigate, n as useQueryClient, h as useQuery, ag as Role, r as reactExports, j as jsxRuntimeExports, B as Button, p as Shield } from "./index-BZqaRhAX.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DQu6DGwy.js";
import { I as Input } from "./input-BJtw5f9h.js";
import { L as Label } from "./label-CvyzRjc5.js";
import { S as Skeleton } from "./skeleton-CXUiMpVp.js";
import { u as useMutation } from "./useMutation-CLofsIuD.js";
import { u as ue } from "./index-BRf-248B.js";
import { u as useBackend } from "./useBackend-DSxJo5MU.js";
import { A as ArrowLeft } from "./arrow-left-BCLeiEG1.js";
import { I as Info } from "./info-jIqTkrKJ.js";
import { S as ShieldAlert } from "./shield-alert-CESpSo-o.js";
import { S as ShieldCheck } from "./shield-check-Cf_cO_r5.js";
import { S as Save } from "./save-7muzwGmu.js";
const CURRENCIES = ["USD", "ICP", "BTC"];
const ROLE_META = {
  [Role.Admin]: {
    label: "Admin",
    description: "Full access — can approve all transactions",
    icon: ShieldCheck,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10"
  },
  [Role.Manager]: {
    label: "Manager",
    description: "Can send up to the defined limit without approval",
    icon: Shield,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10"
  },
  [Role.TeamMember]: {
    label: "Team Member",
    description: "Transactions above limit require Admin approval",
    icon: ShieldAlert,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10"
  }
};
const SCOPED_ROLES = [Role.Admin, Role.Manager, Role.TeamMember];
function limitFromData(data) {
  return {
    maxAmount: data ? data.maxAmount.toString() : "1000",
    currency: (data == null ? void 0 : data.currency) ?? "USD"
  };
}
function WalletSpendingLimitsPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const adminQuery = useQuery({
    queryKey: ["spendingLimit", tenantId, workspaceId, Role.Admin],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSpendingLimit(tenantId, workspaceId, Role.Admin);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const managerQuery = useQuery({
    queryKey: ["spendingLimit", tenantId, workspaceId, Role.Manager],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSpendingLimit(tenantId, workspaceId, Role.Manager);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const memberQuery = useQuery({
    queryKey: ["spendingLimit", tenantId, workspaceId, Role.TeamMember],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSpendingLimit(tenantId, workspaceId, Role.TeamMember);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const isLoading = adminQuery.isLoading || managerQuery.isLoading || memberQuery.isLoading;
  const [adminLimit, setAdminLimit] = reactExports.useState({
    maxAmount: "1000",
    currency: "USD"
  });
  const [managerLimit, setManagerLimit] = reactExports.useState({
    maxAmount: "1000",
    currency: "USD"
  });
  const [memberLimit, setMemberLimit] = reactExports.useState({
    maxAmount: "500",
    currency: "USD"
  });
  reactExports.useEffect(() => {
    if (adminQuery.data !== void 0)
      setAdminLimit(limitFromData(adminQuery.data));
  }, [adminQuery.data]);
  reactExports.useEffect(() => {
    if (managerQuery.data !== void 0)
      setManagerLimit(limitFromData(managerQuery.data));
  }, [managerQuery.data]);
  reactExports.useEffect(() => {
    if (memberQuery.data !== void 0)
      setMemberLimit(limitFromData(memberQuery.data));
  }, [memberQuery.data]);
  const stateByRole = {
    [Role.Admin]: { state: adminLimit, setState: setAdminLimit },
    [Role.Manager]: { state: managerLimit, setState: setManagerLimit },
    [Role.TeamMember]: { state: memberLimit, setState: setMemberLimit }
  };
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const rows = [
        [Role.Admin, adminLimit],
        [Role.Manager, managerLimit],
        [Role.TeamMember, memberLimit]
      ];
      for (const [role, ls] of rows) {
        const amount = Number.parseFloat(ls.maxAmount);
        if (Number.isNaN(amount) || amount < 0)
          throw new Error(`Invalid amount for ${role}`);
        const res = await actor.setSpendingLimit(
          tenantId,
          workspaceId,
          role,
          amount,
          ls.currency
        );
        if (res.__kind__ === "err") throw new Error(res.err);
      }
    },
    onSuccess: () => {
      for (const role of SCOPED_ROLES)
        queryClient.invalidateQueries({
          queryKey: ["spendingLimit", tenantId, workspaceId, role]
        });
      ue.success("Spending limits saved");
    },
    onError: (err) => ue.error(err.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-6 space-y-6 max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: `/app/${workspaceId}/wallet` }),
          "aria-label": "Back to wallet",
          "data-ocid": "limits-back-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-6 w-6 text-violet-500" }),
          "Spending Limits"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Admin only — set maximum send amounts per role" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-500/5 px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-700 dark:text-blue-400 leading-relaxed", children: "Transactions that exceed a role's spending limit require Admin approval before processing. Set to 0 to require approval on all transactions." })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 rounded-xl" }, n)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      SCOPED_ROLES.map((role) => {
        const meta = ROLE_META[role];
        const { state, setState } = stateByRole[role];
        const Icon = meta.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "shadow-card rounded-xl border border-border/50 bg-card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `flex h-9 w-9 items-center justify-center rounded-lg ${meta.bg}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-4 w-4 ${meta.color}` })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: meta.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: meta.description })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: `limit-amount-${role}`,
                        className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                        children: "Max Amount"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono", children: "$" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: `limit-amount-${role}`,
                          type: "number",
                          min: "0",
                          step: "1",
                          placeholder: "e.g. 1000",
                          value: state.maxAmount,
                          onChange: (e) => setState((prev) => ({
                            ...prev,
                            maxAmount: e.target.value
                          })),
                          className: "pl-7 font-mono tabular-nums",
                          "data-ocid": `limit-amount-${role.toLowerCase()}`
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: `limit-currency-${role}`,
                        className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                        children: "Currency"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "select",
                      {
                        id: `limit-currency-${role}`,
                        value: state.currency,
                        onChange: (e) => setState((prev) => ({
                          ...prev,
                          currency: e.target.value
                        })),
                        className: "w-full h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
                        "data-ocid": `limit-currency-${role.toLowerCase()}`,
                        children: CURRENCIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
                      }
                    )
                  ] })
                ] }),
                state.maxAmount === "0" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3.5 w-3.5" }),
                  "All transactions for this role will require approval."
                ] })
              ] })
            ]
          },
          role
        );
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => saveMutation.mutate(),
          disabled: saveMutation.isPending,
          className: "bg-violet-600 hover:bg-violet-700 text-white gap-2 min-w-[140px] active-press",
          "data-ocid": "limits-save-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
            saveMutation.isPending ? "Saving…" : "Save Limits"
          ]
        }
      ) })
    ] })
  ] });
}
export {
  WalletSpendingLimitsPage as default
};
