import { d as useNavigate, m as useParams, n as useQueryClient, g as getTenantId, r as reactExports, a5 as RecurrenceRule, h as useQuery, G as EventCategory, j as jsxRuntimeExports, B as Button, X, F as FileText, a7 as RsvpStatus, C as Check, a8 as ExceptionType } from "./index-DemOGW1B.js";
import { A as AlertDialog, a as AlertDialogTrigger, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-BlMvH9cn.js";
import { B as Badge } from "./badge-BgvX66QS.js";
import { I as Input } from "./input-1iXuA55D.js";
import { L as Label } from "./label-mmRgUQzR.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-NwajN2eF.js";
import { S as Skeleton } from "./skeleton-M5HtR2mS.js";
import { T as Textarea } from "./textarea-DdbmcPlU.js";
import { u as useMutation } from "./useMutation-4TvYOXEz.js";
import { u as ue } from "./index-BBpqu5x7.js";
import { C as CrossLinkPicker } from "./CrossLinkPicker-Hq1KNb7a.js";
import { u as useBackend } from "./index-CeqQA3r7.js";
import { A as ArrowLeft } from "./arrow-left-lpbCbWBz.js";
import { C as Calendar } from "./calendar-Cfj8q013.js";
import { P as Pen } from "./pen-DRNa4kxD.js";
import { T as Trash2 } from "./trash-2-UJLUw61l.js";
import { S as Save } from "./save-_P0zvLPW.js";
import { R as RefreshCw } from "./refresh-cw-DC1ue0An.js";
import { C as Clock } from "./clock-dgG5UHWp.js";
import { G as Globe } from "./globe-CXaldVnt.js";
import { E as ExternalLink } from "./external-link-BGpFW10O.js";
import { U as Users } from "./users-CP73E1L-.js";
import { L as Link2 } from "./link-2-CeDyFl-9.js";
import "./index-BTkz9mih.js";
import "./index-IXOTxK3N.js";
import "./index-DnYpjSFd.js";
import "./chevron-up-3jVPN2OD.js";
import "./popover-BPsRruq-.js";
import "./search-CqVwSPFD.js";
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
function formatDateTime(ts) {
  return new Date(Number(ts)).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}
function formatDateTimeTz(ts) {
  var _a;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const abbr = ((_a = new Intl.DateTimeFormat("en-US", { timeZoneName: "short", timeZone: tz }).formatToParts(new Date(Number(ts))).find((p) => p.type === "timeZoneName")) == null ? void 0 : _a.value) ?? "";
  return `${formatDateTime(ts)} (${abbr})`;
}
function formatDuration(start, end) {
  const diffMs = Number(end - start);
  const hours = Math.floor(diffMs / 36e5);
  const mins = Math.floor(diffMs % 36e5 / 6e4);
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
const CATEGORY_STYLES = {
  [EventCategory.meeting]: {
    bg: "bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-300"
  },
  [EventCategory.deadline]: {
    bg: "bg-red-500/10",
    text: "text-red-700 dark:text-red-300"
  },
  [EventCategory.pto]: {
    bg: "bg-green-500/10",
    text: "text-green-700 dark:text-green-300"
  },
  [EventCategory.internal]: {
    bg: "bg-purple-500/10",
    text: "text-purple-700 dark:text-purple-300"
  },
  [EventCategory.external]: {
    bg: "bg-orange-500/10",
    text: "text-orange-700 dark:text-orange-300"
  },
  [EventCategory.other]: { bg: "bg-muted", text: "text-muted-foreground" }
};
const RSVP_STYLES = {
  [RsvpStatus.accepted]: {
    bg: "bg-green-500/10",
    text: "text-green-700 dark:text-green-300",
    label: "Accepted"
  },
  [RsvpStatus.declined]: {
    bg: "bg-red-500/10",
    text: "text-red-700 dark:text-red-300",
    label: "Declined"
  },
  [RsvpStatus.tentative]: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-700 dark:text-yellow-300",
    label: "Tentative"
  },
  [RsvpStatus.noResponse]: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    label: "No response"
  }
};
const RECURRENCE_OPTIONS = [
  { value: RecurrenceRule.None, label: "No recurrence" },
  { value: RecurrenceRule.Daily, label: "Daily" },
  { value: RecurrenceRule.Weekly, label: "Weekly" },
  { value: RecurrenceRule.Monthly, label: "Monthly" },
  { value: RecurrenceRule.Yearly, label: "Yearly" }
];
const RECURRENCE_LABELS = {
  [RecurrenceRule.None]: "One-time",
  [RecurrenceRule.Daily]: "Daily",
  [RecurrenceRule.Weekly]: "Weekly",
  [RecurrenceRule.Monthly]: "Monthly",
  [RecurrenceRule.Yearly]: "Yearly"
};
function EventDetailPage() {
  const navigate = useNavigate();
  const { workspaceId, eventId } = useParams({
    from: "/app/$workspaceId/calendar/events/$eventId"
  });
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [editTitle, setEditTitle] = reactExports.useState("");
  const [editDescription, setEditDescription] = reactExports.useState("");
  const [editStartTime, setEditStartTime] = reactExports.useState("");
  const [editEndTime, setEditEndTime] = reactExports.useState("");
  const [editRecurrence, setEditRecurrence] = reactExports.useState(
    RecurrenceRule.None
  );
  const [editCrossLinks, setEditCrossLinks] = reactExports.useState([]);
  const { data: event, isLoading } = useQuery({
    queryKey: ["event", tenantId, workspaceId, eventId],
    queryFn: async () => {
      if (!actor) return null;
      const res = await actor.getEvent(tenantId, workspaceId, eventId);
      return res.__kind__ === "ok" ? res.ok : null;
    },
    enabled: !!actor
  });
  const { data: rsvps = [] } = useQuery({
    queryKey: ["eventRsvps", tenantId, workspaceId, eventId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEventRsvps(tenantId, workspaceId, eventId);
    },
    enabled: !!actor && !!event
  });
  function startEditMode(ev) {
    setEditTitle(ev.title);
    setEditDescription(ev.description);
    setEditStartTime(tsToLocal(ev.startTime));
    setEditEndTime(tsToLocal(ev.endTime));
    setEditRecurrence(ev.recurrence);
    setEditCrossLinks(ev.crossLinks);
    setIsEditing(true);
  }
  const { mutate: updateEvent, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      if (!actor || !event) throw new Error("Not connected");
      const input = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        startTime: localToTs(editStartTime),
        endTime: localToTs(editEndTime),
        recurrence: editRecurrence,
        attendeeIds: event.attendeeIds,
        crossLinks: editCrossLinks,
        category: event.category,
        calendarId: event.calendarId,
        rsvpRequired: event.rsvpRequired,
        timeZone: event.timeZone
      };
      return actor.updateEvent(tenantId, workspaceId, eventId, input);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({
          queryKey: ["event", tenantId, workspaceId, eventId]
        });
        queryClient.invalidateQueries({ queryKey: ["events"] });
        ue.success("Event updated!");
        setIsEditing(false);
      } else ue.error(result.err);
    },
    onError: () => ue.error("Failed to update event")
  });
  const { mutate: deleteEvent, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteEvent(tenantId, workspaceId, eventId);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["events"] });
        ue.success("Event deleted");
        navigate({
          to: "/app/$workspaceId/calendar",
          params: { workspaceId }
        });
      } else ue.error(result.err);
    },
    onError: () => ue.error("Failed to delete event")
  });
  const { mutate: respondToEvent, isPending: isResponding } = useMutation({
    mutationFn: async (status) => {
      if (!actor) throw new Error("Not connected");
      return actor.respondToEvent(tenantId, workspaceId, { eventId, status });
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({
          queryKey: ["eventRsvps", tenantId, workspaceId, eventId]
        });
        ue.success("Response recorded");
      } else ue.error(result.err);
    },
    onError: () => ue.error("Failed to respond")
  });
  const { mutate: createException, isPending: isCreatingException } = useMutation({
    mutationFn: async () => {
      if (!actor || !event) throw new Error("Not connected");
      const input = {
        eventId,
        originalDate: new Date(Number(event.startTime)).toISOString().slice(0, 10),
        exceptionType: ExceptionType.modified,
        overrideData: {
          title: event.title,
          description: event.description,
          startTime: event.startTime,
          endTime: event.endTime,
          recurrence: RecurrenceRule.None,
          attendeeIds: event.attendeeIds,
          crossLinks: event.crossLinks,
          category: event.category,
          calendarId: event.calendarId,
          rsvpRequired: event.rsvpRequired,
          timeZone: event.timeZone
        }
      };
      return actor.createEventException(tenantId, workspaceId, input);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        ue.success(
          "Exception created — you can now edit this occurrence."
        );
      } else ue.error(result.err);
    },
    onError: () => ue.error("Failed to create exception")
  });
  const isEditValid = editTitle.trim().length > 0 && editStartTime.length > 0 && editEndTime.length > 0 && new Date(editEndTime) > new Date(editStartTime);
  const catStyle = event ? CATEGORY_STYLES[event.category] ?? CATEGORY_STYLES[EventCategory.other] : CATEGORY_STYLES[EventCategory.other];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background animate-fade-in-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 border-b border-border/60 bg-card/90 backdrop-blur-subtle px-6 py-3.5 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-2xl items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-8 w-8",
            onClick: () => isEditing ? setIsEditing(false) : navigate({
              to: "/app/$workspaceId/calendar",
              params: { workspaceId }
            }),
            "aria-label": isEditing ? "Cancel edit" : "Back",
            "data-ocid": "event-detail-back",
            children: isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5 text-red-500" }) }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-48" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-bold text-foreground truncate tracking-tight", children: isEditing ? "Edit Event" : (event == null ? void 0 : event.title) ?? "Event" })
        ] })
      ] }),
      !isEditing && event && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "h-8 text-xs gap-1.5",
            onClick: () => startEditMode(event),
            "data-ocid": "event-edit-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3 w-3" }),
              " Edit"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/5 gap-1.5",
              "data-ocid": "event-delete-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }),
                " Delete"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this event?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This action cannot be undone." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "event-delete-cancel", children: "Cancel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                AlertDialogAction,
                {
                  onClick: () => deleteEvent(),
                  disabled: isDeleting,
                  className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                  "data-ocid": "event-delete-confirm",
                  children: isDeleting ? "Deleting..." : "Delete event"
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-2xl px-6 py-8", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" })
    ] }) : !event ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-24 text-center",
        "data-ocid": "event-not-found",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-12 w-12 text-muted-foreground mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "Event not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "This event may have been deleted." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              className: "mt-5",
              onClick: () => navigate({
                to: "/app/$workspaceId/calendar",
                params: { workspaceId }
              }),
              "data-ocid": "event-not-found-back",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
                "Back to Calendar"
              ]
            }
          )
        ]
      }
    ) : isEditing ? (
      /* ---- Edit Form ---- */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "edit-title", children: [
            "Event Title ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "edit-title",
              value: editTitle,
              onChange: (e) => setEditTitle(e.target.value),
              "data-ocid": "event-edit-title"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-description", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "edit-description",
              rows: 4,
              value: editDescription,
              onChange: (e) => setEditDescription(e.target.value),
              "data-ocid": "event-edit-description"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "edit-start", children: [
              "Start ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "edit-start",
                type: "datetime-local",
                value: editStartTime,
                onChange: (e) => setEditStartTime(e.target.value),
                "data-ocid": "event-edit-start"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "edit-end", children: [
              "End ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "edit-end",
                type: "datetime-local",
                value: editEndTime,
                min: editStartTime,
                onChange: (e) => setEditEndTime(e.target.value),
                "data-ocid": "event-edit-end"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Recurrence" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: editRecurrence,
              onValueChange: (v) => setEditRecurrence(v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "event-edit-recurrence", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: RECURRENCE_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Cross-Links" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CrossLinkPicker,
            {
              tenantId,
              value: editCrossLinks,
              onChange: setEditCrossLinks
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setIsEditing(false),
              "data-ocid": "event-edit-cancel",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => updateEvent(),
              disabled: !isEditValid || isUpdating,
              className: "bg-red-500 text-white hover:bg-red-600",
              "data-ocid": "event-edit-save",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-4 w-4" }),
                isUpdating ? "Saving..." : "Save Changes"
              ]
            }
          )
        ] })
      ] })
    ) : (
      /* ---- Detail View ---- */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground flex-1 min-w-0", children: event.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: `text-xs capitalize ${catStyle.bg} ${catStyle.text} border-0`,
                  children: event.category
                }
              ),
              event.recurrence !== RecurrenceRule.None && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-1 h-3 w-3" }),
                RECURRENCE_LABELS[event.recurrence]
              ] }),
              event.rsvpRequired && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: "RSVP Required" })
            ] })
          ] }),
          event.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: event.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/40 p-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-red-500" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5", children: "Start" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: formatDateTimeTz(event.startTime) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5", children: "End" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: formatDateTimeTz(event.endTime) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  "Duration: ",
                  formatDuration(event.startTime, event.endTime)
                ] })
              ] })
            ] }),
            event.timeZone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1 border-t border-border/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3.5 w-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: event.timeZone.replace(/_/g, " ") })
            ] })
          ] }),
          event.isRecurringSeries && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => createException(),
              disabled: isCreatingException,
              "data-ocid": "event-edit-occurrence-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "mr-1.5 h-3.5 w-3.5" }),
                isCreatingException ? "Creating..." : "Edit This Occurrence"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              asChild: true,
              "data-ocid": "event-add-notes-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: `/app/${workspaceId}/notes/new?title=${encodeURIComponent(`Meeting Notes: ${event.title}`)}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "mr-1.5 h-3.5 w-3.5" }),
                    "Add Meeting Notes",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "ml-1.5 h-3 w-3 opacity-60" })
                  ]
                }
              )
            }
          ) })
        ] }),
        (event.rsvpRequired || rsvps.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-2xl border border-border bg-card p-5 space-y-4",
            "data-ocid": "event-rsvp-section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm text-foreground", children: event.rsvpRequired ? "RSVPs" : "Attendees" }),
                !event.rsvpRequired && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-auto", children: "RSVP not required" })
              ] }),
              event.rsvpRequired && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground mr-1", children: "Your response:" }),
                [
                  {
                    status: RsvpStatus.accepted,
                    label: "Accept",
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }),
                    cls: "border-green-500/30 text-green-700 dark:text-green-300 hover:bg-green-500/5"
                  },
                  {
                    status: RsvpStatus.tentative,
                    label: "Tentative",
                    icon: null,
                    cls: "border-yellow-500/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-500/5"
                  },
                  {
                    status: RsvpStatus.declined,
                    label: "Decline",
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }),
                    cls: "border-red-500/30 text-red-700 dark:text-red-300 hover:bg-red-500/5"
                  }
                ].map(({ status, label, icon, cls }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => respondToEvent(status),
                    disabled: isResponding,
                    className: cls,
                    "data-ocid": `rsvp-btn-${status}`,
                    children: [
                      icon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1", children: icon }),
                      label
                    ]
                  },
                  status
                ))
              ] }),
              rsvps.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: rsvps.map((rsvp) => {
                const s = RSVP_STYLES[rsvp.status] ?? RSVP_STYLES[RsvpStatus.noResponse];
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-foreground truncate", children: [
                        rsvp.userId.toString().slice(0, 12),
                        "…"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          className: `text-xs ${s.bg} ${s.text} border-0`,
                          children: s.label
                        }
                      )
                    ]
                  },
                  rsvp.id
                );
              }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No responses yet." })
            ]
          }
        ),
        event.crossLinks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm text-foreground", children: "Cross-Links" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: event.crossLinks.map((link, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "secondary",
              className: "text-xs gap-1.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-red-500" }),
                link.linkLabel,
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                  "→ ",
                  link.entityType
                ] })
              ]
            },
            `${link.entityType}-${link.entityId}-${i}`
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/20 px-4 py-3 flex flex-wrap gap-x-6 gap-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Created:" }),
            " ",
            new Date(Number(event.createdAt)).toLocaleDateString("en-US", {
              dateStyle: "medium"
            })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Updated:" }),
            " ",
            new Date(Number(event.updatedAt)).toLocaleDateString("en-US", {
              dateStyle: "medium"
            })
          ] })
        ] })
      ] })
    ) })
  ] });
}
export {
  EventDetailPage as default
};
