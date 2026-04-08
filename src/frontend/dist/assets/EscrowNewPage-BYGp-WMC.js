const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index--nGTycyb.js","assets/index-BZqaRhAX.js","assets/index-BwayeclK.css"])))=>i.map(i=>d[i]);
import { g as getTenantId, f as useWorkspace, d as useNavigate, n as useQueryClient, r as reactExports, j as jsxRuntimeExports, p as Shield, B as Button, P as Plus, a9 as __vitePreload } from "./index-BZqaRhAX.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DQu6DGwy.js";
import { I as Input } from "./input-BJtw5f9h.js";
import { L as Label } from "./label-CvyzRjc5.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CkiaF30e.js";
import { T as Textarea } from "./textarea-CZBafaSY.js";
import { u as useMutation } from "./useMutation-CLofsIuD.js";
import { u as ue } from "./index-BRf-248B.js";
import { C as CrossLinkPicker } from "./CrossLinkPicker-B9W9kXjQ.js";
import { u as useBackend } from "./useBackend-DSxJo5MU.js";
import { A as ArrowLeft } from "./arrow-left-BCLeiEG1.js";
import { L as Layers } from "./layers-D2OloIh5.js";
import { T as Trash2 } from "./trash-2-B2tpJk42.js";
import { C as CircleCheck } from "./circle-check-wa2s5his.js";
import "./index-IXOTxK3N.js";
import "./index-38IBqnCJ.js";
import "./chevron-up-Dd5ZqoJs.js";
import "./index--nGTycyb.js";
import "./popover-BITncVJJ.js";
import "./link-2-D7MBFLBt.js";
import "./search-D7yG9ybj.js";
const CURRENCIES = ["ICP", "ckBTC", "USD"];
let conditionCounter = 0;
function newCondition() {
  conditionCounter += 1;
  return { id: `cond-${conditionCounter}`, text: "" };
}
let milestoneCounter = 0;
function newMilestone() {
  milestoneCounter += 1;
  return {
    id: `ms-${milestoneCounter}`,
    title: "",
    amount: "",
    description: ""
  };
}
function EscrowNewPage() {
  const { actor } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const [currency, setCurrency] = reactExports.useState("ICP");
  const [payeeId, setPayeeId] = reactExports.useState("");
  const [conditions, setConditions] = reactExports.useState([
    newCondition()
  ]);
  const [dueDate, setDueDate] = reactExports.useState("");
  const [crossLinks, setCrossLinks] = reactExports.useState([]);
  const [milestones, setMilestones] = reactExports.useState([]);
  const createMutation = useMutation({
    mutationFn: async ({
      input,
      milestoneInputs
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createEscrow(tenantId, workspaceId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      const contract = result.ok;
      for (const ms of milestoneInputs) {
        const msResult = await actor.addEscrowMilestone(
          tenantId,
          workspaceId,
          contract.id,
          ms
        );
        if (msResult.__kind__ === "err") throw new Error(msResult.err);
      }
      return contract;
    },
    onSuccess: (contract) => {
      queryClient.invalidateQueries({
        queryKey: ["escrows", tenantId, workspaceId]
      });
      ue.success("Escrow contract created");
      navigate({
        to: `/app/${workspaceId}/escrow/$escrowId`,
        params: { escrowId: contract.id }
      });
    },
    onError: (err) => ue.error(err.message)
  });
  const handleAddCondition = () => setConditions((prev) => [...prev, newCondition()]);
  const handleRemoveCondition = (id) => setConditions((prev) => prev.filter((c) => c.id !== id));
  const handleConditionChange = (id, value) => setConditions(
    (prev) => prev.map((c) => c.id === id ? { ...c, text: value } : c)
  );
  const handleAddMilestone = () => setMilestones((prev) => [...prev, newMilestone()]);
  const handleRemoveMilestone = (id) => setMilestones((prev) => prev.filter((m) => m.id !== id));
  const handleMilestoneChange = (id, field, value) => setMilestones(
    (prev) => prev.map((m) => m.id === id ? { ...m, [field]: value } : m)
  );
  const totalMilestoneAmount = milestones.reduce((sum, m) => {
    const val = Number.parseFloat(m.amount);
    return sum + (Number.isNaN(val) ? 0 : val);
  }, 0);
  const contractAmount = Number.parseFloat(amount) || 0;
  const milestoneAmountMismatch = milestones.length > 0 && contractAmount > 0 && Math.abs(totalMilestoneAmount - contractAmount) > 0.01;
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
    const validMilestones = milestones.filter(
      (m) => m.title.trim().length > 0 && Number.parseFloat(m.amount) > 0
    );
    if (milestones.length > 0 && validMilestones.length !== milestones.length) {
      ue.error("All milestones must have a title and amount");
      return;
    }
    const { Principal } = await __vitePreload(async () => {
      const { Principal: Principal2 } = await import("./index--nGTycyb.js").then((n) => n.i);
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
    const milestoneInputs = validMilestones.map(
      (m) => ({
        title: m.title.trim(),
        description: m.description.trim(),
        amount: BigInt(Math.round(Number.parseFloat(m.amount) * 100))
      })
    );
    createMutation.mutate({ input, milestoneInputs });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-6 md:p-8 max-w-2xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: `/app/${workspaceId}/escrow` }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Create a secure on-chain agreement between parties" })
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
                className: "font-mono text-sm",
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-amber-500" }),
            "Milestones",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-muted-foreground", children: "(optional)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: handleAddMilestone,
              "data-ocid": "escrow-add-milestone",
              className: "h-7 text-xs gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                "Add Milestone"
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: milestones.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-dashed border-border py-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "mx-auto h-7 w-7 text-muted-foreground/40 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No milestones — funds release in one payment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: handleAddMilestone,
              className: "mt-2 text-xs text-amber-600 hover:text-amber-700 h-7",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3 mr-1" }),
                "Add first milestone"
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          milestones.map((ms, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl border border-border bg-muted/20 p-4 space-y-3",
              "data-ocid": `milestone-item-${ms.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-foreground", children: [
                    "Milestone ",
                    idx + 1
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleRemoveMilestone(ms.id),
                      "aria-label": `Remove milestone ${idx + 1}`,
                      className: "flex h-6 w-6 items-center justify-center rounded-md hover:bg-destructive/10 hover:text-destructive transition-smooth",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: `ms-title-${ms.id}`,
                        className: "text-xs",
                        children: "Title *"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: `ms-title-${ms.id}`,
                        value: ms.title,
                        onChange: (e) => handleMilestoneChange(
                          ms.id,
                          "title",
                          e.target.value
                        ),
                        "data-ocid": `ms-title-${ms.id}`,
                        className: "text-sm"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Label,
                      {
                        htmlFor: `ms-amount-${ms.id}`,
                        className: "text-xs",
                        children: [
                          "Amount (",
                          currency,
                          ") *"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: `ms-amount-${ms.id}`,
                        type: "number",
                        min: "0.01",
                        step: "0.01",
                        placeholder: "0.00",
                        value: ms.amount,
                        onChange: (e) => handleMilestoneChange(
                          ms.id,
                          "amount",
                          e.target.value
                        ),
                        "data-ocid": `ms-amount-${ms.id}`,
                        className: "text-sm"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `ms-desc-${ms.id}`, className: "text-xs", children: "Description" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: `ms-desc-${ms.id}`,
                      value: ms.description,
                      onChange: (e) => handleMilestoneChange(
                        ms.id,
                        "description",
                        e.target.value
                      ),
                      "data-ocid": `ms-desc-${ms.id}`,
                      className: "text-sm"
                    }
                  )
                ] })
              ]
            },
            ms.id
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium ${milestoneAmountMismatch ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400" : "bg-muted text-muted-foreground"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Milestone total:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                    currency,
                    " ",
                    totalMilestoneAmount.toFixed(2)
                  ] })
                ] }),
                contractAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-1", children: milestoneAmountMismatch ? "⚠ Doesn't match contract amount" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-green-500" }),
                  "Matches contract amount"
                ] }) })
              ]
            }
          )
        ] }) })
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
              placeholder: `Condition ${idx + 1}`,
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
            onClick: () => navigate({ to: `/app/${workspaceId}/escrow` }),
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
