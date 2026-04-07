import { a as useNavigate, d as useQueryClient, h as getTenantId, r as reactExports, R as RecurrenceRule, j as jsxRuntimeExports, B as Button } from "./index-D7inqmxR.js";
import { I as Input } from "./input-C0aO0R3D.js";
import { L as Label } from "./label-CBtn2p-5.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D0Yw2k_p.js";
import { T as Textarea } from "./textarea-DoR08WA4.js";
import { u as useMutation } from "./useMutation-BeBnUQJD.js";
import { u as ue } from "./index-p-k3Ndic.js";
import { C as CrossLinkPicker } from "./CrossLinkPicker-BbxKwuNH.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { A as ArrowLeft } from "./arrow-left-mNBAKt8w.js";
import { C as Calendar } from "./calendar-ts51vnwj.js";
import { S as Save } from "./save-gMXGM8pU.js";
import "./index-IXOTxK3N.js";
import "./index-BGFsRO7G.js";
import "./check-EW6vRiNm.js";
import "./index-BJuRsRYe.js";
import "./link-2-CZnDvFVS.js";
import "./search-BaaXS-B8.js";
const RECURRENCE_OPTIONS = [
  { value: RecurrenceRule.None, label: "No recurrence" },
  { value: RecurrenceRule.Daily, label: "Daily" },
  { value: RecurrenceRule.Weekly, label: "Weekly" },
  { value: RecurrenceRule.Monthly, label: "Monthly" },
  { value: RecurrenceRule.Yearly, label: "Yearly" }
];
function tsToLocalDatetime(ts) {
  const d = new Date(Number(ts));
  const pad = (n) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function localDatetimeToTs(value) {
  return BigInt(new Date(value).getTime());
}
function defaultStart() {
  const d = /* @__PURE__ */ new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return tsToLocalDatetime(BigInt(d.getTime()));
}
function defaultEnd(start) {
  const d = new Date(start);
  d.setHours(d.getHours() + 1);
  return tsToLocalDatetime(BigInt(d.getTime()));
}
function EventNewPage() {
  const navigate = useNavigate();
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const startDefault = defaultStart();
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [startTime, setStartTime] = reactExports.useState(startDefault);
  const [endTime, setEndTime] = reactExports.useState(defaultEnd(startDefault));
  const [recurrence, setRecurrence] = reactExports.useState(
    RecurrenceRule.None
  );
  const [attendees, setAttendees] = reactExports.useState("");
  const [crossLinks, setCrossLinks] = reactExports.useState([]);
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const input = {
        title: title.trim(),
        description: description.trim(),
        startTime: localDatetimeToTs(startTime),
        endTime: localDatetimeToTs(endTime),
        recurrence,
        attendeeIds: [],
        crossLinks
      };
      return actor.createEvent(tenantId, input);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["events"] });
        ue.success("Event created!");
        navigate({
          to: "/app/calendar/$eventId",
          params: { eventId: result.ok.id }
        });
      } else {
        ue.error(result.err);
      }
    },
    onError: () => ue.error("Failed to create event")
  });
  const isValid = title.trim().length > 0 && startTime.length > 0 && endTime.length > 0 && new Date(endTime) > new Date(startTime);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 border-b border-border bg-card px-6 py-4 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-2xl items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: "/app/calendar" }),
          "aria-label": "Back to Calendar",
          "data-ocid": "event-new-back",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-red-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "New Event" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl px-6 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "event-title", children: [
            "Event Title ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "event-title",
              placeholder: "Give your event a title...",
              value: title,
              onChange: (e) => setTitle(e.target.value),
              "data-ocid": "event-title-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "event-description", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "event-description",
              placeholder: "Describe the event...",
              rows: 4,
              value: description,
              onChange: (e) => setDescription(e.target.value),
              "data-ocid": "event-description-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "event-start", children: [
              "Start Date & Time ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "event-start",
                type: "datetime-local",
                value: startTime,
                onChange: (e) => {
                  setStartTime(e.target.value);
                  if (e.target.value && new Date(endTime) <= new Date(e.target.value)) {
                    setEndTime(defaultEnd(e.target.value));
                  }
                },
                "data-ocid": "event-start-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "event-end", children: [
              "End Date & Time ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "event-end",
                type: "datetime-local",
                value: endTime,
                min: startTime,
                onChange: (e) => setEndTime(e.target.value),
                "data-ocid": "event-end-input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Recurrence" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: recurrence,
              onValueChange: (v) => setRecurrence(v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "event-recurrence-select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "No recurrence" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: RECURRENCE_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "event-attendees", children: "Attendees" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "event-attendees",
              placeholder: "Comma-separated names or emails (informational)",
              value: attendees,
              onChange: (e) => setAttendees(e.target.value),
              "data-ocid": "event-attendees-input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Attendee tracking is informational for this workspace." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Cross-Links" }),
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
            variant: "outline",
            onClick: () => navigate({ to: "/app/calendar" }),
            "data-ocid": "event-new-cancel",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => mutate(),
            disabled: !isValid || isPending,
            className: "bg-red-500 text-white hover:bg-red-600",
            "data-ocid": "event-new-save",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-4 w-4" }),
              isPending ? "Saving..." : "Save Event"
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  EventNewPage as default
};
