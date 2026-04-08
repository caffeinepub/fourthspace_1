import { g as getTenantId, f as useWorkspace, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, X, P as Plus, n as useQueryClient, a9 as PayFrequency } from "./index-CzyNqtbv.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-BTCkNtDu.js";
import { I as Input } from "./input-982h_Ebl.js";
import { L as Label } from "./label-D31XgQrg.js";
import { S as Skeleton } from "./skeleton-DMAdSNre.js";
import { S as Switch } from "./switch-5ZixxZeQ.js";
import { u as useMutation } from "./useMutation-BsRk2Bod.js";
import { u as ue } from "./index-DaWH_LJ9.js";
import { u as useBackend } from "./index-CJtF1vtU.js";
import { A as ArrowLeft } from "./arrow-left-BnDr9sMT.js";
import { C as Calendar } from "./calendar-CTr0Yk3T.js";
import { C as CircleCheck } from "./circle-check-Bz_M8Dh9.js";
import { U as Users } from "./users-6wl8SB25.js";
import { C as Clock } from "./clock-DD8HS7VE.js";
import "./index-DhDScjUU.js";
const FREQUENCIES = [
  PayFrequency.Weekly,
  PayFrequency.BiWeekly,
  PayFrequency.SemiMonthly,
  PayFrequency.Monthly
];
const FREQ_LABELS = {
  [PayFrequency.Weekly]: "Weekly",
  [PayFrequency.BiWeekly]: "Bi-Weekly",
  [PayFrequency.SemiMonthly]: "Semi-Monthly",
  [PayFrequency.Monthly]: "Monthly",
  [PayFrequency.Quarterly]: "Quarterly"
};
const FREQ_COLORS = {
  [PayFrequency.Weekly]: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
  [PayFrequency.BiWeekly]: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
  [PayFrequency.SemiMonthly]: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20",
  [PayFrequency.Monthly]: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  [PayFrequency.Quarterly]: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20"
};
function AddScheduleForm({
  onClose,
  tenantId,
  workspaceId
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [form, setForm] = reactExports.useState({
    name: "",
    description: "",
    frequency: PayFrequency.Monthly,
    isDefault: false
  });
  const add = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const input = {
        name: form.name.trim(),
        description: form.description.trim(),
        frequency: form.frequency,
        isDefault: form.isDefault
      };
      const res = await actor.addPaySchedule(tenantId, workspaceId, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      ue.success("Pay schedule created");
      queryClient.invalidateQueries({ queryKey: ["paySchedules"] });
      onClose();
    },
    onError: (e) => ue.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "shadow-card rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02]",
      "data-ocid": "add-schedule-form",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3 flex flex-row items-center justify-between border-b border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" }),
            "New Pay Schedule"
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sched-name", children: "Schedule Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "sched-name",
                    value: form.name,
                    onChange: (e) => setForm((p) => ({ ...p, name: e.target.value })),
                    placeholder: "e.g. Bi-Weekly Employees",
                    required: true,
                    "data-ocid": "sched-name"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sched-freq", children: "Frequency" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    id: "sched-freq",
                    value: form.frequency,
                    onChange: (e) => setForm((p) => ({ ...p, frequency: e.target.value })),
                    "data-ocid": "sched-frequency",
                    className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    children: FREQUENCIES.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: f, children: FREQ_LABELS[f] ?? f }, f))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sched-desc", children: "Description" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "sched-desc",
                    value: form.description,
                    onChange: (e) => setForm((p) => ({ ...p, description: e.target.value })),
                    placeholder: "Optional description",
                    "data-ocid": "sched-desc"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    id: "sched-default",
                    checked: form.isDefault,
                    onCheckedChange: (v) => setForm((p) => ({ ...p, isDefault: v })),
                    "data-ocid": "sched-default-toggle"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sched-default", className: "cursor-pointer", children: "Set as default pay schedule" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 flex gap-3 justify-end pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Cancel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    disabled: add.isPending,
                    className: "bg-emerald-600 hover:bg-emerald-700 text-white active-press",
                    "data-ocid": "sched-submit-btn",
                    children: add.isPending ? "Saving…" : "Create Schedule"
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
function PaySchedulesPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const [showForm, setShowForm] = reactExports.useState(false);
  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ["paySchedules", tenantId, workspaceId],
    queryFn: async () => actor ? actor.listPaySchedules(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-6 space-y-6 max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, "aria-label": "Back", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${workspaceId}/payroll`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: "Pay Schedules" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isLoading ? "Loading…" : `${schedules.length} schedule${schedules.length !== 1 ? "s" : ""}` })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => setShowForm((v) => !v),
          className: "bg-emerald-600 hover:bg-emerald-700 text-white active-press",
          "data-ocid": "add-schedule-btn",
          children: showForm ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-2 h-4 w-4" }),
            "Cancel"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
            "New Schedule"
          ] })
        }
      )
    ] }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddScheduleForm,
      {
        onClose: () => setShowForm(false),
        tenantId,
        workspaceId
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 rounded-xl" }, n)) }) : schedules.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center",
        "data-ocid": "schedules-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-7 w-7 text-emerald-600 dark:text-emerald-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "No pay schedules yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground max-w-xs", children: "Create pay schedules to assign different payment frequencies to employee groups." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "mt-6 bg-emerald-600 hover:bg-emerald-700 text-white active-press",
              onClick: () => setShowForm(true),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                "Create First Schedule"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: schedules.map((sched) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border/50 bg-card shadow-card hover:border-emerald-400/50 hover:shadow-card-hover transition-all p-5 space-y-4",
        "data-ocid": `schedule-card-${sched.id}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5 text-emerald-600 dark:text-emerald-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate", children: sched.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${FREQ_COLORS[sched.frequency] ?? "bg-muted text-muted-foreground border-border"}`,
                    children: FREQ_LABELS[sched.frequency] ?? sched.frequency
                  }
                ),
                sched.isDefault && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-2.5 w-2.5" }),
                  "Default"
                ] })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "0 employees" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Created",
                " ",
                new Date(
                  Number(sched.createdAt) / 1e6
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })
              ] })
            ] })
          ] }),
          sched.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: sched.description })
        ]
      },
      sched.id
    )) })
  ] });
}
export {
  PaySchedulesPage as default
};
