import { a as useNavigate, b as useParams, d as useQueryClient, h as getTenantId, r as reactExports, R as RecurrenceRule, e as useQuery, j as jsxRuntimeExports, B as Button, X } from "./index-D7inqmxR.js";
import { A as AlertDialog, a as AlertDialogTrigger, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-BaULY9v5.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { I as Input } from "./input-C0aO0R3D.js";
import { L as Label } from "./label-CBtn2p-5.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D0Yw2k_p.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { T as Textarea } from "./textarea-DoR08WA4.js";
import { u as useMutation } from "./useMutation-BeBnUQJD.js";
import { u as ue } from "./index-p-k3Ndic.js";
import { C as CrossLinkPicker } from "./CrossLinkPicker-BbxKwuNH.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { A as ArrowLeft } from "./arrow-left-mNBAKt8w.js";
import { C as Calendar } from "./calendar-ts51vnwj.js";
import { P as Pen } from "./pen-B9Zo65Ev.js";
import { T as Trash2 } from "./trash-2-5DF1cbxg.js";
import { S as Save } from "./save-gMXGM8pU.js";
import { R as RefreshCw } from "./refresh-cw-DkNAkJEv.js";
import { C as Clock } from "./clock-xD41YETq.js";
import { U as Users } from "./users-0z2gux4W.js";
import { L as Link2 } from "./link-2-CZnDvFVS.js";
import "./index-Cjvi6AGX.js";
import "./index-IXOTxK3N.js";
import "./index-BGFsRO7G.js";
import "./check-EW6vRiNm.js";
import "./search-BaaXS-B8.js";
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
function tsToLocalDatetime(ts) {
  const d = new Date(Number(ts));
  const pad = (n) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function localDatetimeToTs(value) {
  return BigInt(new Date(value).getTime());
}
function formatDuration(start, end) {
  const diffMs = Number(end - start);
  const hours = Math.floor(diffMs / 36e5);
  const mins = Math.floor(diffMs % 36e5 / 6e4);
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
function EventDetailPage() {
  const navigate = useNavigate();
  const { eventId } = useParams({ from: "/app/calendar/$eventId" });
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
  const [editAttendees, setEditAttendees] = reactExports.useState("");
  const [editCrossLinks, setEditCrossLinks] = reactExports.useState([]);
  const { data: event, isLoading } = useQuery({
    queryKey: ["event", tenantId, eventId],
    queryFn: async () => {
      if (!actor) return null;
      const res = await actor.getEvent(tenantId, eventId);
      return res.__kind__ === "ok" ? res.ok : null;
    },
    enabled: !!actor
  });
  const startEditMode = (ev) => {
    setEditTitle(ev.title);
    setEditDescription(ev.description);
    setEditStartTime(tsToLocalDatetime(ev.startTime));
    setEditEndTime(tsToLocalDatetime(ev.endTime));
    setEditRecurrence(ev.recurrence);
    setEditAttendees("");
    setEditCrossLinks(ev.crossLinks);
    setIsEditing(true);
  };
  const { mutate: updateEvent, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const input = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        startTime: localDatetimeToTs(editStartTime),
        endTime: localDatetimeToTs(editEndTime),
        recurrence: editRecurrence,
        attendeeIds: [],
        crossLinks: editCrossLinks
      };
      return actor.updateEvent(tenantId, eventId, input);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({
          queryKey: ["event", tenantId, eventId]
        });
        queryClient.invalidateQueries({ queryKey: ["events"] });
        ue.success("Event updated!");
        setIsEditing(false);
      } else {
        ue.error(result.err);
      }
    },
    onError: () => ue.error("Failed to update event")
  });
  const { mutate: deleteEvent, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteEvent(tenantId, eventId);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["events"] });
        ue.success("Event deleted");
        navigate({ to: "/app/calendar" });
      } else {
        ue.error(result.err);
      }
    },
    onError: () => ue.error("Failed to delete event")
  });
  const isEditValid = editTitle.trim().length > 0 && editStartTime.length > 0 && editEndTime.length > 0 && new Date(editEndTime) > new Date(editStartTime);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 border-b border-border bg-card px-6 py-4 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-2xl items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: () => isEditing ? setIsEditing(false) : navigate({ to: "/app/calendar" }),
            "aria-label": isEditing ? "Cancel edit" : "Back to Calendar",
            "data-ocid": "event-detail-back",
            children: isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-red-500" }) }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-48" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground truncate", children: isEditing ? "Edit Event" : (event == null ? void 0 : event.title) ?? "Event" })
        ] })
      ] }),
      !isEditing && event && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => startEditMode(event),
            "data-ocid": "event-edit-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "mr-1.5 h-3.5 w-3.5" }),
              "Edit"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "border-destructive/30 text-destructive hover:bg-destructive/5",
              "data-ocid": "event-delete-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-1.5 h-3.5 w-3.5" }),
                "Delete"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this event?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This action cannot be undone. The event will be permanently removed from your calendar." })
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-6 w-6 text-red-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "Event not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "This event may have been deleted or does not exist." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              className: "mt-5",
              onClick: () => navigate({ to: "/app/calendar" }),
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
      /* Edit form */
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-attendees", children: "Attendees" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "edit-attendees",
              placeholder: "Comma-separated names or emails",
              value: editAttendees,
              onChange: (e) => setEditAttendees(e.target.value),
              "data-ocid": "event-edit-attendees"
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
      /* Detail view */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground flex-1 min-w-0", children: event.title }),
            event.recurrence !== RecurrenceRule.None && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "shrink-0 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border-red-200/50 dark:border-red-800/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-1 h-3 w-3" }),
              RECURRENCE_LABELS[event.recurrence]
            ] })
          ] }),
          event.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: event.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/40 p-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-red-500" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5", children: "Start" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: formatDateTime(event.startTime) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5", children: "End" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: formatDateTime(event.endTime) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  "Duration: ",
                  formatDuration(event.startTime, event.endTime)
                ] })
              ] })
            ] })
          ] }),
          event.attendeeIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2", children: "Attendees" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: event.attendeeIds.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  variant: "secondary",
                  className: "text-xs",
                  children: [
                    id.toString().slice(0, 12),
                    "…"
                  ]
                },
                id.toString()
              )) })
            ] })
          ] })
        ] }),
        event.crossLinks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3.5 w-3.5 text-muted-foreground" }) }),
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
