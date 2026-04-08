import { d as useNavigate, m as useParams, n as useQueryClient, g as getTenantId, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, z as Settings, P as Plus, a6 as CalendarType, y as cn } from "./index-DemOGW1B.js";
import { A as AlertDialog, a as AlertDialogTrigger, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-BlMvH9cn.js";
import { B as Badge } from "./badge-BgvX66QS.js";
import { I as Input } from "./input-1iXuA55D.js";
import { L as Label } from "./label-mmRgUQzR.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-NwajN2eF.js";
import { S as Switch } from "./switch-ByXrkuOM.js";
import { u as useMutation } from "./useMutation-4TvYOXEz.js";
import { u as ue } from "./index-BBpqu5x7.js";
import { u as useBackend } from "./index-CeqQA3r7.js";
import { A as ArrowLeft } from "./arrow-left-lpbCbWBz.js";
import { E as Eye } from "./eye-D1riEs2V.js";
import { E as EyeOff } from "./eye-off-DnicXoRr.js";
import { P as Pen } from "./pen-DRNa4kxD.js";
import { T as Trash2 } from "./trash-2-UJLUw61l.js";
import "./index-BTkz9mih.js";
import "./index-IXOTxK3N.js";
import "./index-DnYpjSFd.js";
import "./chevron-up-3jVPN2OD.js";
const CALENDAR_COLORS = [
  "#6366f1",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#f97316"
];
const TYPE_OPTIONS = [
  { value: CalendarType.personal, label: "Personal" },
  { value: CalendarType.team, label: "Team" },
  { value: CalendarType.project, label: "Project" },
  { value: CalendarType.company, label: "Company-wide" }
];
const TYPE_BADGES = {
  [CalendarType.personal]: {
    bg: "bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-300"
  },
  [CalendarType.team]: {
    bg: "bg-green-500/10",
    text: "text-green-700 dark:text-green-300"
  },
  [CalendarType.project]: {
    bg: "bg-orange-500/10",
    text: "text-orange-700 dark:text-orange-300"
  },
  [CalendarType.company]: {
    bg: "bg-purple-500/10",
    text: "text-purple-700 dark:text-purple-300"
  }
};
function defaultForm() {
  return {
    name: "",
    calendarType: CalendarType.personal,
    color: CALENDAR_COLORS[0],
    isVisible: true
  };
}
function CalendarForm({
  initial,
  onSave,
  onCancel,
  isSaving
}) {
  const [form, setForm] = reactExports.useState(initial);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-4 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "cal-name", children: [
        "Calendar Name ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "cal-name",
          placeholder: "e.g. My Work Calendar",
          value: form.name,
          onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
          "data-ocid": "cal-settings-name"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: form.calendarType,
          onValueChange: (v) => setForm((f) => ({ ...f, calendarType: v })),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "cal-settings-type", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: TYPE_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Color" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        CALENDAR_COLORS.map((color) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setForm((f) => ({ ...f, color })),
            className: cn(
              "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110",
              form.color === color ? "border-foreground scale-110" : "border-transparent"
            ),
            style: { backgroundColor: color },
            "aria-label": `Color ${color}`,
            "data-ocid": `cal-settings-color-${color.replace("#", "")}`
          },
          color
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "color",
              value: form.color,
              onChange: (e) => setForm((f) => ({ ...f, color: e.target.value })),
              className: "h-7 w-14 cursor-pointer p-0.5 rounded-full",
              "data-ocid": "cal-settings-custom-color"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Custom" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "cursor-pointer", children: "Show on calendar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Switch,
        {
          checked: form.isVisible,
          onCheckedChange: (v) => setForm((f) => ({ ...f, isVisible: v })),
          "data-ocid": "cal-settings-visible"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: onCancel,
          "data-ocid": "cal-settings-cancel",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          disabled: !form.name.trim() || isSaving,
          onClick: () => onSave(form),
          "data-ocid": "cal-settings-save",
          children: isSaving ? "Saving…" : "Save Calendar"
        }
      )
    ] })
  ] });
}
function CalendarSettingsPage() {
  const navigate = useNavigate();
  const { workspaceId } = useParams({
    from: "/app/$workspaceId/calendar/settings"
  });
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [editingId, setEditingId] = reactExports.useState(null);
  const { data: calendars = [], isLoading } = useQuery({
    queryKey: ["calendars", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCalendars(tenantId, workspaceId, null);
    },
    enabled: !!actor && !isFetching
  });
  const invalidate = () => queryClient.invalidateQueries({
    queryKey: ["calendars", tenantId, workspaceId]
  });
  const { mutate: createCalendar, isPending: isCreating } = useMutation({
    mutationFn: async (form) => {
      if (!actor) throw new Error("Not connected");
      const input = {
        name: form.name.trim(),
        calendarType: form.calendarType,
        color: form.color,
        isVisible: form.isVisible
      };
      return actor.createCalendar(tenantId, workspaceId, input);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        invalidate();
        ue.success("Calendar created!");
        setShowCreate(false);
      } else ue.error(result.err);
    },
    onError: () => ue.error("Failed to create calendar")
  });
  const { mutate: updateCalendar, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      id,
      form
    }) => {
      if (!actor) throw new Error("Not connected");
      const input = {
        name: form.name.trim(),
        calendarType: form.calendarType,
        color: form.color,
        isVisible: form.isVisible
      };
      return actor.updateCalendar(tenantId, workspaceId, id, input);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        invalidate();
        ue.success("Calendar updated!");
        setEditingId(null);
      } else ue.error(result.err);
    },
    onError: () => ue.error("Failed to update calendar")
  });
  const { mutate: deleteCalendar } = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteCalendar(tenantId, workspaceId, id);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        invalidate();
        ue.success("Calendar deleted");
      } else ue.error(result.err);
    },
    onError: () => ue.error("Failed to delete calendar")
  });
  const toggleVisible = (cal) => {
    if (!actor) return;
    updateCalendar({
      id: cal.id,
      form: {
        name: cal.name,
        calendarType: cal.calendarType,
        color: cal.color,
        isVisible: !cal.isVisible
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background animate-fade-in-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 border-b border-border/60 bg-card/90 backdrop-blur-subtle px-6 py-3.5 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-2xl items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-8 w-8",
            onClick: () => navigate({
              to: "/app/$workspaceId/calendar",
              params: { workspaceId }
            }),
            "aria-label": "Back",
            "data-ocid": "cal-settings-back",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-3.5 w-3.5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-bold text-foreground tracking-tight", children: "Calendar Settings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Manage your calendars" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "gap-1.5 h-8 text-xs active-press",
          onClick: () => {
            setShowCreate(true);
            setEditingId(null);
          },
          "data-ocid": "cal-settings-new-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            " New Calendar"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl px-6 py-8 space-y-4", children: [
      showCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(
        CalendarForm,
        {
          initial: defaultForm(),
          onSave: (form) => createCalendar(form),
          onCancel: () => setShowCreate(false),
          isSaving: isCreating
        }
      ),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-16 rounded-xl bg-muted/30 animate-pulse"
        },
        n
      )) }) : calendars.length === 0 && !showCreate ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center",
          "data-ocid": "cal-settings-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-10 w-10 text-muted-foreground mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "No calendars yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Create a calendar to get started." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "mt-4",
                onClick: () => setShowCreate(true),
                "data-ocid": "cal-settings-empty-cta",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1.5 h-4 w-4" }),
                  "New Calendar"
                ]
              }
            )
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: calendars.map((cal) => {
        var _a;
        const tStyle = TYPE_BADGES[cal.calendarType] ?? TYPE_BADGES[CalendarType.personal];
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: editingId === cal.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          CalendarForm,
          {
            initial: {
              name: cal.name,
              calendarType: cal.calendarType,
              color: cal.color,
              isVisible: cal.isVisible
            },
            onSave: (form) => updateCalendar({ id: cal.id, form }),
            onCancel: () => setEditingId(null),
            isSaving: isUpdating
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3",
            "data-ocid": `cal-settings-item-${cal.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-4 w-4 rounded-full shrink-0",
                  style: { backgroundColor: cal.color || "#6366f1" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "font-semibold text-sm",
                      !cal.isVisible && "text-muted-foreground line-through"
                    ),
                    children: cal.name
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    className: cn(
                      "text-xs px-1.5 py-0 border-0",
                      tStyle.bg,
                      tStyle.text
                    ),
                    children: ((_a = TYPE_OPTIONS.find(
                      (t) => t.value === cal.calendarType
                    )) == null ? void 0 : _a.label) ?? cal.calendarType
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => toggleVisible(cal),
                  className: "text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted",
                  "aria-label": cal.isVisible ? "Hide calendar" : "Show calendar",
                  "data-ocid": `cal-settings-toggle-${cal.id}`,
                  children: cal.isVisible ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setEditingId(cal.id);
                    setShowCreate(false);
                  },
                  className: "text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted",
                  "aria-label": "Edit calendar",
                  "data-ocid": `cal-settings-edit-${cal.id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/5",
                    "aria-label": "Delete calendar",
                    "data-ocid": `cal-settings-delete-${cal.id}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { children: [
                      'Delete "',
                      cal.name,
                      '"?'
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This will delete the calendar. Events assigned to it will remain but lose their calendar association." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      AlertDialogAction,
                      {
                        onClick: () => deleteCalendar(cal.id),
                        className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                        "data-ocid": `cal-settings-delete-confirm-${cal.id}`,
                        children: "Delete"
                      }
                    )
                  ] })
                ] })
              ] })
            ]
          }
        ) }, cal.id);
      }) })
    ] })
  ] });
}
export {
  CalendarSettingsPage as default
};
