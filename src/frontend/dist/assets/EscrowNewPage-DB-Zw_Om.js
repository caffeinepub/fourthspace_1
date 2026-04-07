const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-BJuRsRYe.js","assets/index-D7inqmxR.js","assets/index-D4uwiOQ6.css"])))=>i.map(i=>d[i]);
import { h as getTenantId, a as useNavigate, d as useQueryClient, r as reactExports, j as jsxRuntimeExports, l as Shield, B as Button, _ as __vitePreload } from "./index-D7inqmxR.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-wy6FYjGT.js";
import { I as Input } from "./input-C0aO0R3D.js";
import { L as Label } from "./label-CBtn2p-5.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D0Yw2k_p.js";
import { T as Textarea } from "./textarea-DoR08WA4.js";
import { u as useMutation } from "./useMutation-BeBnUQJD.js";
import { u as ue } from "./index-p-k3Ndic.js";
import { C as CrossLinkPicker } from "./CrossLinkPicker-BbxKwuNH.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { A as ArrowLeft } from "./arrow-left-mNBAKt8w.js";
import { P as Plus } from "./plus-DNap1HPx.js";
import { T as Trash2 } from "./trash-2-5DF1cbxg.js";
import "./index-IXOTxK3N.js";
import "./index-BGFsRO7G.js";
import "./check-EW6vRiNm.js";
import "./index-BJuRsRYe.js";
import "./link-2-CZnDvFVS.js";
import "./search-BaaXS-B8.js";
const CURRENCIES = ["USD", "ICP", "BTC"];
let conditionCounter = 0;
function newCondition(text = "") {
  conditionCounter += 1;
  return { id: `cond-${conditionCounter}`, text };
}
function EscrowNewPage() {
  const { actor } = useBackend();
  const tenantId = getTenantId();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const [currency, setCurrency] = reactExports.useState("USD");
  const [payeeId, setPayeeId] = reactExports.useState("");
  const [conditions, setConditions] = reactExports.useState([
    newCondition()
  ]);
  const [dueDate, setDueDate] = reactExports.useState("");
  const [crossLinks, setCrossLinks] = reactExports.useState([]);
  const createMutation = useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createEscrow(tenantId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (contract) => {
      queryClient.invalidateQueries({ queryKey: ["escrows", tenantId] });
      ue.success("Escrow contract created");
      navigate({
        to: "/app/escrow/$contractId",
        params: { contractId: contract.id }
      });
    },
    onError: (err) => ue.error(err.message)
  });
  const handleAddCondition = () => setConditions((prev) => [...prev, newCondition()]);
  const handleRemoveCondition = (id) => setConditions((prev) => prev.filter((c) => c.id !== id));
  const handleConditionChange = (id, value) => setConditions(
    (prev) => prev.map((c) => c.id === id ? { ...c, text: value } : c)
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || !payeeId.trim()) {
      ue.error("Please fill in all required fields");
      return;
    }
    const amountVal = Math.round(Number.parseFloat(amount) * 100);
    if (Number.isNaN(amountVal) || amountVal <= 0) {
      ue.error("Please enter a valid amount");
      return;
    }
    const { Principal } = await __vitePreload(async () => {
      const { Principal: Principal2 } = await import("./index-BJuRsRYe.js").then((n) => n.i);
      return { Principal: Principal2 };
    }, true ? __vite__mapDeps([0,1,2]) : void 0);
    let payeePrincipal;
    try {
      payeePrincipal = Principal.fromText(payeeId.trim());
    } catch {
      ue.error("Invalid principal ID");
      return;
    }
    const input = {
      title: title.trim(),
      description: description.trim(),
      amount: BigInt(amountVal),
      currency,
      payeeId: payeePrincipal,
      conditions: conditions.filter((c) => c.text.trim().length > 0).map((c) => c.text),
      dueDate: dueDate ? BigInt(new Date(dueDate).getTime() * 1e6) : void 0,
      crossLinks
    };
    createMutation.mutate(input);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-2xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/app/escrow" }),
          "aria-label": "Back to escrow",
          className: "flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-smooth",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 text-muted-foreground" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 text-amber-500" }),
          "New Escrow Contract"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Create a secure agreement between parties" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Contract Details" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "title", children: [
              "Title ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "title",
                placeholder: "e.g. Website Development Contract",
                value: title,
                onChange: (e) => setTitle(e.target.value),
                "data-ocid": "escrow-title",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "description",
                placeholder: "Describe the contract terms and deliverables...",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                "data-ocid": "escrow-description",
                rows: 3
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "amount", children: [
                "Amount ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "amount",
                  type: "number",
                  min: "0.01",
                  step: "0.01",
                  placeholder: "0.00",
                  value: amount,
                  onChange: (e) => setAmount(e.target.value),
                  "data-ocid": "escrow-amount",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "currency", children: "Currency" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: currency, onValueChange: setCurrency, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "currency", "data-ocid": "escrow-currency", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CURRENCIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "payeeId", children: [
              "Payee Principal ID ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "payeeId",
                placeholder: "xxxxx-xxxxx-xxxxx-xxxxx-xxx",
                value: payeeId,
                onChange: (e) => setPayeeId(e.target.value),
                "data-ocid": "escrow-payee",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "dueDate", children: "Due Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "dueDate",
                type: "date",
                value: dueDate,
                onChange: (e) => setDueDate(e.target.value),
                "data-ocid": "escrow-due-date",
                min: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Release Conditions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: handleAddCondition,
              "data-ocid": "escrow-add-condition",
              className: "h-7 text-xs gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                "Add"
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: conditions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center py-2", children: "No conditions added — funds release manually" }) : conditions.map((cond, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: `Condition ${idx + 1}: e.g. Milestone delivered and approved`,
              value: cond.text,
              onChange: (e) => handleConditionChange(cond.id, e.target.value),
              "data-ocid": `escrow-condition-${cond.id}`,
              className: "text-sm"
            }
          ),
          conditions.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => handleRemoveCondition(cond.id),
              "aria-label": `Remove condition ${idx + 1}`,
              className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-md hover:bg-destructive/10 hover:text-destructive transition-smooth",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
            }
          )
        ] }, cond.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Cross-Links" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          CrossLinkPicker,
          {
            tenantId,
            value: crossLinks,
            onChange: setCrossLinks
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => navigate({ to: "/app/escrow" }),
            "data-ocid": "escrow-cancel-btn",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: createMutation.isPending || !title.trim() || !amount || !payeeId.trim(),
            "data-ocid": "escrow-save-btn",
            className: "bg-amber-500 hover:bg-amber-600 text-white min-w-[120px]",
            children: createMutation.isPending ? "Creating..." : "Create Escrow"
          }
        )
      ] })
    ] })
  ] });
}
export {
  EscrowNewPage as default
};
