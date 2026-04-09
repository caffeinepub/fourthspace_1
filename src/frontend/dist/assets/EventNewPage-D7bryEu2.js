import { d as useNavigate, m as useParams, n as useQueryClient, g as getTenantId, r as reactExports, E as EventCategory, a4 as RecurrenceRule, h as useQuery, j as jsxRuntimeExports, B as Button, a5 as CalendarType } from "./index-CQ7TXF2a.js";
import { I as Input } from "./input-Dkit6sfw.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C1Xsy-LN.js";
import { S as Switch } from "./switch-BGZRmkVS.js";
import { T as Textarea } from "./textarea-CkHQfDFp.js";
import { u as useMutation } from "./useMutation-fGi-GboX.js";
import { u as ue } from "./index-BGFcG_k-.js";
import { C as CrossLinkPicker } from "./CrossLinkPicker-Dk3dnDyP.js";
import { u as useBackend } from "./index--h8TKSCt.js";
import { A as ArrowLeft } from "./arrow-left-D6cz-lXM.js";
import { C as Calendar } from "./calendar-BUBDkMEv.js";
import { S as Save } from "./save-DJl3ZDfM.js";
import "./index-IXOTxK3N.js";
import "./index-CkN0xm2T.js";
import "./chevron-up-56u9dcHi.js";
import "./badge-DOwzzuc_.js";
import "./popover-BB0XJl-b.js";
import "./link-2-Vn75IhwF.js";
import "./search-B58SW5UA.js";
function pad(n) {
  return n.toString().padStart(2, "0");
}
function tsToLocal(ts) {
  const d = new Date(Number(ts));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function localToTs(v) {
  return BigInt(new Date(v).getTime());
}
function defaultStart() {
  const d = /* @__PURE__ */ new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return tsToLocal(BigInt(d.getTime()));
}
function defaultEnd(start) {
  const d = new Date(start);
  d.setHours(d.getHours() + 1);
  return tsToLocal(BigInt(d.getTime()));
}
function getBrowserTz() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
const CATEGORY_OPTIONS = [
  { value: EventCategory.meeting, label: "Meeting" },
  { value: EventCategory.deadline, label: "Deadline" },
  { value: EventCategory.pto, label: "PTO / Time off" },
  { value: EventCategory.internal, label: "Internal" },
  { value: EventCategory.external, label: "External" },
  { value: EventCategory.other, label: "Other" }
];
const RECURRENCE_OPTIONS = [
  { value: RecurrenceRule.None, label: "No recurrence" },
  { value: RecurrenceRule.Daily, label: "Daily" },
  { value: RecurrenceRule.Weekly, label: "Weekly" },
  { value: RecurrenceRule.Monthly, label: "Monthly" },
  { value: RecurrenceRule.Yearly, label: "Yearly" }
];
const COMMON_TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland"
];
const CALENDAR_TYPE_LABELS = {
  [CalendarType.personal]: "Personal",
  [CalendarType.team]: "Team",
  [CalendarType.project]: "Project",
  [CalendarType.company]: "Company"
};
function EventNewPage() {
  const navigate = useNavigate();
  const { workspaceId } = useParams({ from: "/app/$workspaceId/calendar/new" });
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const startDefault = defaultStart();
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [startTime, setStartTime] = reactExports.useState(startDefault);
  const [endTime, setEndTime] = reactExports.useState(defaultEnd(startDefault));
  const [category, setCategory] = reactExports.useState(
    EventCategory.meeting
  );
  const [calendarId, setCalendarId] = reactExports.useState("");
  const [timezone, setTimezone] = reactExports.useState(getBrowserTz());
  const [rsvpRequired, setRsvpRequired] = reactExports.useState(false);
  const [recurrence, setRecurrence] = reactExports.useState(
    RecurrenceRule.None
  );
  const [endCondition, setEndCondition] = reactExports.useState("never");
  const [endDate, setEndDate] = reactExports.useState("");
  const [afterN, setAfterN] = reactExports.useState("10");
  const [crossLinks, setCrossLinks] = reactExports.useState([]);
  const { data: calendars = [] } = useQuery({
    queryKey: ["calendars", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listCalendars(tenantId, workspaceId, null);
      return result;
    },
    enabled: !!actor && !isFetching,
    // Pre-select the first calendar once loaded
    select: (data) => {
      if (data.length > 0 && calendarId === "") {
        setTimeout(() => setCalendarId(data[0].id), 0);
      }
      return data;
    }
  });
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const start = localToTs(startTime);
      const end = localToTs(endTime);
      if (end <= start) throw new Error("End time must be after start time");
      const input = {
        title: title.trim(),
        description: description.trim(),
        startTime: start,
        endTime: end,
        recurrence,
        attendeeIds: [],
        crossLinks,
        category,
        calendarId: calendarId || void 0,
        rsvpRequired,
        timeZone: timezone
      };
      return actor.createEvent(tenantId, workspaceId, input);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["events"] });
        ue.success("Event created!");
        navigate({
          to: "/app/$workspaceId/calendar/events/$eventId",
          params: { workspaceId, eventId: result.ok.id }
        });
      } else {
        ue.error(result.err);
      }
    },
    onError: (err) => ue.error(
      err instanceof Error ? err.message : "Failed to create event"
    )
  });
  const isValid = title.trim().length > 0 && startTime.length > 0 && endTime.length > 0 && new Date(endTime) > new Date(startTime);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    mutate();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background animate-fade-in-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 border-b border-border/60 bg-card/90 backdrop-blur-subtle px-6 py-3.5 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-2xl items-center gap-3", children: [
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
          "aria-label": "Back to Calendar",
          "data-ocid": "event-new-back",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5 text-red-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-bold text-foreground tracking-tight", children: "New Event" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: handleSubmit,
        className: "mx-auto max-w-2xl px-6 py-6",
        noValidate: true,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/50 bg-card p-6 space-y-5 shadow-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  htmlFor: "event-title",
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground block",
                  children: [
                    "Event Title ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "event-title",
                  placeholder: "Give your event a title...",
                  value: title,
                  onChange: (e) => setTitle(e.target.value),
                  "data-ocid": "event-title-input",
                  className: "border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30",
                  required: true,
                  autoFocus: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "event-description",
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground block",
                  children: "Description"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "event-description",
                  placeholder: "Describe the event...",
                  rows: 3,
                  value: description,
                  onChange: (e) => setDescription(e.target.value),
                  "data-ocid": "event-description-input",
                  className: "border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground block", children: "Calendar" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: calendarId, onValueChange: setCalendarId, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      "data-ocid": "event-calendar-select",
                      className: "border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select calendar" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: calendars.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "default", children: "Default Calendar" }) : calendars.map((cal) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: cal.id, children: [
                    cal.name,
                    " ·",
                    " ",
                    CALENDAR_TYPE_LABELS[cal.calendarType] ?? cal.calendarType
                  ] }, cal.id)) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground block", children: "Category" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: category,
                    onValueChange: (v) => setCategory(v),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectTrigger,
                        {
                          "data-ocid": "event-category-select",
                          className: "border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select category" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CATEGORY_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "label",
                  {
                    htmlFor: "event-start",
                    className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground block",
                    children: [
                      "Start Date & Time ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "event-start",
                    type: "datetime-local",
                    value: startTime,
                    onChange: (e) => {
                      setStartTime(e.target.value);
                      if (e.target.value && new Date(endTime) <= new Date(e.target.value))
                        setEndTime(defaultEnd(e.target.value));
                    },
                    "data-ocid": "event-start-input",
                    className: "border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "label",
                  {
                    htmlFor: "event-end",
                    className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground block",
                    children: [
                      "End Date & Time ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "event-end",
                    type: "datetime-local",
                    value: endTime,
                    min: startTime,
                    onChange: (e) => setEndTime(e.target.value),
                    "data-ocid": "event-end-input",
                    className: "border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30",
                    required: true
                  }
                ),
                endTime && startTime && new Date(endTime) <= new Date(startTime) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500 mt-1", children: "End time must be after start time" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground block", children: "Time Zone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: timezone, onValueChange: setTimezone, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    "data-ocid": "event-timezone-select",
                    className: "border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Array.from(/* @__PURE__ */ new Set([getBrowserTz(), ...COMMON_TIMEZONES])).map(
                  (tz) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: tz, children: tz.replace(/_/g, " ") }, tz)
                ) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground block", children: "Recurrence" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: recurrence,
                  onValueChange: (v) => setRecurrence(v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        "data-ocid": "event-recurrence-select",
                        className: "border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "No recurrence" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: RECURRENCE_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
                  ]
                }
              )
            ] }),
            recurrence !== RecurrenceRule.None && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/30 border border-border/40 p-4 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground block", children: "Ends" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: ["never", "onDate", "after"].map((cond) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: "flex items-center gap-2 cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "radio",
                        name: "endCondition",
                        value: cond,
                        checked: endCondition === cond,
                        onChange: () => setEndCondition(cond),
                        className: "accent-primary",
                        "data-ocid": `event-end-cond-${cond}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-foreground", children: [
                      cond === "never" && "Never",
                      cond === "onDate" && "On date",
                      cond === "after" && "After N occurrences"
                    ] })
                  ]
                },
                cond
              )) }),
              endCondition === "onDate" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "date",
                  value: endDate,
                  min: startTime.slice(0, 10),
                  onChange: (e) => setEndDate(e.target.value),
                  "data-ocid": "event-end-date",
                  className: "border-border/60"
                }
              ),
              endCondition === "after" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: "1",
                    max: "999",
                    value: afterN,
                    onChange: (e) => setAfterN(e.target.value),
                    className: "w-24 border-border/60",
                    "data-ocid": "event-after-n"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "occurrences" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl bg-muted/20 border border-border/40 px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Require RSVP" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Attendees must respond to this event" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: rsvpRequired,
                  onCheckedChange: setRsvpRequired,
                  "data-ocid": "event-rsvp-toggle"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground block", children: "Cross-Links" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CrossLinkPicker,
                {
                  tenantId,
                  value: crossLinks,
                  onChange: setCrossLinks
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center justify-end gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => navigate({
                  to: "/app/$workspaceId/calendar",
                  params: { workspaceId }
                }),
                "data-ocid": "event-new-cancel",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                disabled: !isValid || isPending,
                className: "bg-red-500 text-white hover:bg-red-600 active-press gap-1.5",
                "data-ocid": "event-new-save",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
                  isPending ? "Saving..." : "Save Event"
                ]
              }
            )
          ] })
        ]
      }
    )
  ] });
}
export {
  EventNewPage as default
};
