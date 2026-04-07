import { a as useNavigate, d as useQueryClient, h as getTenantId, r as reactExports, W as AutomationTrigger, Y as AutomationAction, e as useQuery, j as jsxRuntimeExports, B as Button } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-wy6FYjGT.js";
import { I as Input } from "./input-C0aO0R3D.js";
import { L as Label } from "./label-CBtn2p-5.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D0Yw2k_p.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { S as Switch } from "./switch-DMUk12Ll.js";
import { u as useMutation } from "./useMutation-BeBnUQJD.js";
import { u as ue } from "./index-p-k3Ndic.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { A as ArrowLeft } from "./arrow-left-mNBAKt8w.js";
import { Z as Zap } from "./zap-Czf8pMIS.js";
import { P as Plus } from "./plus-DNap1HPx.js";
import { A as ArrowRight } from "./arrow-right-D7-RcTtv.js";
import "./index-IXOTxK3N.js";
import "./index-BGFsRO7G.js";
import "./check-EW6vRiNm.js";
const TRIGGER_LABELS = {
  [AutomationTrigger.Scheduled]: "Scheduled",
  [AutomationTrigger.OnTaskStatusChange]: "Task Status Changed",
  [AutomationTrigger.OnNoteCreated]: "Note Created",
  [AutomationTrigger.OnPaymentDue]: "Payment Due",
  [AutomationTrigger.OnEscrowUpdate]: "Escrow Updated",
  [AutomationTrigger.OnEventReminder]: "Event Reminder"
};
const ACTION_LABELS = {
  [AutomationAction.SendNotification]: "Send Notification",
  [AutomationAction.RunPayroll]: "Run Payroll",
  [AutomationAction.CreateTask]: "Create Task",
  [AutomationAction.UpdateStatus]: "Update Status"
};
function AdminAutomationPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const [showForm, setShowForm] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [trigger, setTrigger] = reactExports.useState(
    AutomationTrigger.Scheduled
  );
  const [action, setAction] = reactExports.useState(
    AutomationAction.SendNotification
  );
  const { data: rules, isLoading } = useQuery({
    queryKey: ["automationRules", tenantId],
    queryFn: async () => actor ? actor.listAutomationRules(tenantId) : [],
    enabled: !!actor && !isFetching
  });
  const { mutate: create, isPending } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.createAutomationRule(
        tenantId,
        name.trim(),
        description.trim(),
        trigger,
        action
      );
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["automationRules"] });
        ue.success("Automation rule created!");
        setShowForm(false);
        setName("");
        setDescription("");
        setTrigger(AutomationTrigger.Scheduled);
        setAction(AutomationAction.SendNotification);
      } else ue.error(result.err);
    },
    onError: () => ue.error("Failed to create rule")
  });
  const { mutate: toggle } = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.toggleAutomationRule(tenantId, id);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["automationRules"] });
        ue.success(
          result.ok.isActive ? "Rule activated" : "Rule deactivated"
        );
      }
    },
    onError: () => ue.error("Failed to toggle rule")
  });
  const activeCount = (rules ?? []).filter((r) => r.isActive).length;
  const totalCount = (rules == null ? void 0 : rules.length) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: "/app/admin" }),
          "aria-label": "Back to admin",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-yellow-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Automation Rules" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Automate repetitive tasks with triggers and actions" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: () => setShowForm(!showForm),
          "data-ocid": "automation-new-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-3.5 w-3.5" }),
            "New Rule"
          ]
        }
      )
    ] }),
    !isLoading && totalCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 rounded-xl bg-muted/40 px-5 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-green-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-foreground font-medium", children: [
          activeCount,
          " active"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
        totalCount - activeCount,
        " paused"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
        totalCount,
        " total rules"
      ] })
    ] }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-semibold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-yellow-500" }),
        "Create Automation Rule"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "automation-name", children: "Rule Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "automation-name",
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "e.g., Daily Payroll Run",
                "data-ocid": "automation-name"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "automation-desc", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "automation-desc",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                placeholder: "What does this rule do?",
                "data-ocid": "automation-desc"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Trigger" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: trigger,
                onValueChange: (v) => setTrigger(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "automation-trigger", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(AutomationTrigger).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: TRIGGER_LABELS[t] }, t)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Action" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: action,
                onValueChange: (v) => setAction(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "automation-action", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(AutomationAction).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: a, children: ACTION_LABELS[a] }, a)) })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs shrink-0", children: TRIGGER_LABELS[trigger] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "text-xs shrink-0 bg-yellow-500/10 text-yellow-600 border-yellow-200",
              children: ACTION_LABELS[action]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setShowForm(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => create(),
              disabled: !name.trim() || isPending,
              "data-ocid": "automation-save-btn",
              children: isPending ? "Creating..." : "Create Rule"
            }
          )
        ] })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, n)) }) : rules && rules.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: rules.map((rule) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:bg-muted/20 transition-smooth",
        "data-ocid": `rule-${rule.id}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-yellow-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground text-sm truncate", children: rule.name }),
            rule.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: rule.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: TRIGGER_LABELS[rule.trigger] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-xs bg-yellow-500/10 text-yellow-600 border-yellow-200",
                  children: ACTION_LABELS[rule.action]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: rule.isActive ? "bg-green-500/10 text-green-600 border-green-200 dark:border-green-900 shrink-0" : "bg-muted text-muted-foreground shrink-0",
              children: rule.isActive ? "Active" : "Paused"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: rule.isActive,
              onCheckedChange: () => toggle(rule.id),
              "aria-label": rule.isActive ? "Deactivate rule" : "Activate rule",
              "data-ocid": `rule-toggle-${rule.id}`
            }
          )
        ]
      },
      rule.id
    )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center",
        "data-ocid": "automation-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-10 w-10 text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No automation rules yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Create rules to automate repetitive tasks and save time." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "mt-4", onClick: () => setShowForm(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-3.5 w-3.5" }),
            "Create First Rule"
          ] })
        ]
      }
    )
  ] });
}
export {
  AdminAutomationPage as default
};
