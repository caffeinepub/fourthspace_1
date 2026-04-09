import { m as useParams, f as useWorkspace, d as useNavigate, n as useQueryClient, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, p as Shield, W as Wallet, P as Plus } from "./index-1XRv9GHr.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-CFU1s52N.js";
import { I as Input } from "./input-BOIU-9S_.js";
import { L as Label } from "./label-cy3JJ-Xo.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { T as Textarea } from "./textarea-DsJhlE90.js";
import { u as useMutation } from "./useMutation-X94w2CVk.js";
import { u as ue } from "./index-BOWFyaIB.js";
import { u as useBackend } from "./useBackend-DyFxq-Jw.js";
import { A as ArrowLeft } from "./arrow-left-B-gbON0E.js";
import { T as TriangleAlert } from "./triangle-alert-Dm4aJj7p.js";
function formatICP(e8s) {
  return `${(Number(e8s) / 1e8).toFixed(4)} ICP`;
}
function EscrowNewPage() {
  const { workspaceId } = useParams({ strict: false });
  const { tenantId } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [payeeId, setPayeeId] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const [currency, setCurrency] = reactExports.useState("ICP");
  const [conditions, setConditions] = reactExports.useState("");
  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ["myWallet", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWalletAccount(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const hasBalance = wallet != null && wallet.icpBalance > 0n;
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createEscrow(tenantId, workspaceId, {
        title: title.trim(),
        description: description.trim(),
        payeeId: payeeId.trim(),
        amount: BigInt(Math.round(Number.parseFloat(amount) * 1e8)),
        currency,
        conditions: conditions.trim() ? conditions.split("\n").filter(Boolean) : [],
        crossLinks: []
      });
      if (result.__kind__ === "err") {
        const msg = result.err.toLowerCase();
        if (msg.includes("insufficient") || msg.includes("funds") || msg.includes("balance")) {
          throw new Error(
            "Please fund your wallet first before creating an escrow."
          );
        }
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: (created) => {
      ue.success("Escrow created successfully");
      void queryClient.invalidateQueries({ queryKey: ["escrow"] });
      navigate({ to: `/app/${workspaceId}/escrow/${created.id}` });
    },
    onError: (err) => {
      const msg = err.message ?? "Failed to create escrow";
      ue.error(msg, {
        description: msg.toLowerCase().includes("wallet") || msg.toLowerCase().includes("fund") ? "Go to Wallet to add funds." : void 0
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
  function handleSubmit(e) {
    e.preventDefault();
    if (!payeeId.trim()) {
      ue.error("Payee principal ID is required");
      return;
    }
    if (!amount || Number.parseFloat(amount) <= 0) {
      ue.error("Amount must be greater than 0");
      return;
    }
    createMutation.mutate();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 p-4 sm:p-6 max-w-2xl mx-auto w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: `/app/${workspaceId}/escrow` }),
          "data-ocid": "escrow-new-back",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-foreground font-display", children: "New Escrow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Create a secure payment agreement" })
        ] })
      ] })
    ] }),
    walletLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-lg" }) : !hasBalance ? (
      /* Hard blocker — form is NOT shown when balance is zero */
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "escrow-balance-blocker",
          className: "flex flex-col items-center gap-5 py-12 px-6 rounded-xl border border-destructive/30 bg-destructive/5 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-7 h-7 text-destructive" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-destructive", children: "Insufficient wallet balance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto", children: "Please fund your wallet before creating an escrow agreement. Your wallet must have a positive ICP balance to proceed." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "gap-1.5",
                onClick: () => navigate({ to: `/app/${workspaceId}/wallet` }),
                "data-ocid": "escrow-go-to-wallet-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-4 h-4" }),
                  "Go to Wallet"
                ]
              }
            )
          ]
        }
      )
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-4 h-4 text-primary shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Available balance:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: formatICP(wallet.icpBalance) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: "Agreement Details" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "esc-title", children: "Title *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "esc-title",
                "data-ocid": "escrow-title-input",
                placeholder: "e.g. Website Design Agreement",
                value: title,
                onChange: (e) => setTitle(e.target.value),
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "esc-desc", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "esc-desc",
                "data-ocid": "escrow-description-input",
                placeholder: "Describe the work or deliverables...",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                rows: 3
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "esc-payee", children: "Payee Principal ID *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "esc-payee",
                "data-ocid": "escrow-payee-input",
                placeholder: "e.g. xxxxx-xxxxx-xxxxx-xxxxx-xxx",
                value: payeeId,
                onChange: (e) => setPayeeId(e.target.value),
                required: true,
                className: "font-mono text-sm"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "The Internet Identity principal of the recipient" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "esc-amount", children: "Amount *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "esc-amount",
                  "data-ocid": "escrow-amount-input",
                  type: "number",
                  min: "0",
                  step: "0.0001",
                  placeholder: "0.0000",
                  value: amount,
                  onChange: (e) => setAmount(e.target.value),
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "esc-currency", children: "Currency" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  id: "esc-currency",
                  "data-ocid": "escrow-currency-select",
                  value: currency,
                  onChange: (e) => setCurrency(e.target.value),
                  className: "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ICP", children: "ICP" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ckBTC", children: "ckBTC" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "esc-conditions", children: "Conditions (one per line)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "esc-conditions",
                "data-ocid": "escrow-conditions-input",
                placeholder: "Milestone 1: Initial mockups delivered\nMilestone 2: Revisions complete\nMilestone 3: Final files delivered",
                value: conditions,
                onChange: (e) => setConditions(e.target.value),
                rows: 4
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => navigate({ to: `/app/${workspaceId}/escrow` }),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                "data-ocid": "escrow-submit-btn",
                disabled: createMutation.isPending,
                className: "gap-2",
                children: createMutation.isPending ? "Creating..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                  "Create Escrow"
                ] })
              }
            )
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  EscrowNewPage as default
};
