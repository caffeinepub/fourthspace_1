import { m as useParams, r as reactExports, j as jsxRuntimeExports, B as Button, i as Link, P as Plus } from "./index-DemOGW1B.js";
import { B as Badge } from "./badge-BgvX66QS.js";
import { C as Card, b as CardHeader, a as CardContent, c as CardTitle } from "./card-wtglWSxh.js";
import { C as Checkbox } from "./checkbox-F45Pncq-.js";
import { I as Input } from "./input-1iXuA55D.js";
import { L as Label } from "./label-mmRgUQzR.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-NwajN2eF.js";
import { S as Switch } from "./switch-ByXrkuOM.js";
import { T as Textarea } from "./textarea-DdbmcPlU.js";
import { u as ue } from "./index-BBpqu5x7.js";
import { A as ArrowLeft } from "./arrow-left-lpbCbWBz.js";
import { D as Download } from "./download-C-gBOiYU.js";
import { C as Clock } from "./clock-dgG5UHWp.js";
import { T as Timer } from "./timer-DwiI59Q2.js";
import { U as Users } from "./users-CP73E1L-.js";
import { T as Trash2 } from "./trash-2-UJLUw61l.js";
import "./index-DnYpjSFd.js";
import "./index-IXOTxK3N.js";
import "./chevron-up-3jVPN2OD.js";
const MOCK_TASKS = [
  { id: "t1", title: "Design system setup" },
  { id: "t2", title: "API integration" },
  { id: "t3", title: "Sprint planning" },
  { id: "t4", title: "Code review" }
];
const NOW = Date.now();
const DAY = 864e5;
const INITIAL_ENTRIES = [
  {
    id: "e1",
    tenantId: "t",
    userId: "u1",
    projectId: "p1",
    taskId: "t1",
    description: "Initial design tokens and component scaffolding",
    startedAt: NOW - DAY - 72e5,
    stoppedAt: NOW - DAY - 45e5,
    durationSeconds: 9e3,
    status: "stopped",
    tags: [],
    createdAt: NOW - DAY - 72e5,
    updatedAt: NOW - DAY - 45e5
  },
  {
    id: "e2",
    tenantId: "t",
    userId: "u2",
    projectId: "p1",
    taskId: "t2",
    description: "REST endpoint wiring and error handling",
    startedAt: NOW - DAY - 36e5,
    stoppedAt: NOW - DAY - 18e5,
    durationSeconds: 5400,
    status: "stopped",
    tags: [],
    createdAt: NOW - DAY - 36e5,
    updatedAt: NOW - DAY - 18e5
  },
  {
    id: "e3",
    tenantId: "t",
    userId: "u1",
    projectId: "p1",
    taskId: "t3",
    description: "Sprint 14 planning session",
    startedAt: NOW - 72e5,
    stoppedAt: NOW - 36e5,
    durationSeconds: 3600,
    status: "stopped",
    tags: [],
    createdAt: NOW - 72e5,
    updatedAt: NOW - 36e5
  },
  {
    id: "e4",
    tenantId: "t",
    userId: "u3",
    projectId: "p1",
    taskId: "t4",
    description: "PR review — auth module",
    startedAt: NOW - 54e5,
    stoppedAt: NOW - 3e6,
    durationSeconds: 2700,
    status: "stopped",
    tags: ["billable"],
    createdAt: NOW - 54e5,
    updatedAt: NOW - 3e6
  }
];
const MOCK_USERS = {
  u1: "Alex Martinez",
  u2: "Sam Kim",
  u3: "Jordan Lee"
};
function formatDurationHHMM(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function exportToCSV(entries, tasks) {
  const header = "Task,User,Date,Duration,Notes,Billable\n";
  const rows = entries.map((e) => {
    var _a;
    const task = ((_a = tasks.find((t) => t.id === e.taskId)) == null ? void 0 : _a.title) ?? e.taskId ?? "";
    const user = MOCK_USERS[e.userId] ?? e.userId;
    const date = formatDate(e.startedAt);
    const dur = formatDurationHHMM(e.durationSeconds);
    const notes = e.description.replace(/,/g, ";");
    const billable = e.tags.includes("billable") ? "Yes" : "No";
    return `"${task}","${user}","${date}","${dur}","${notes}","${billable}"`;
  });
  const csv = header + rows.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "time-entries.csv";
  a.click();
  URL.revokeObjectURL(url);
}
function TimeTrackingPage() {
  const { workspaceId, projectId } = useParams({
    from: "/app/$workspaceId/projects/$projectId/time-tracking"
  });
  const [entries, setEntries] = reactExports.useState(INITIAL_ENTRIES);
  const [filterUser, setFilterUser] = reactExports.useState("all");
  const [filterTask, setFilterTask] = reactExports.useState("all");
  const [filterFrom, setFilterFrom] = reactExports.useState("");
  const [filterTo, setFilterTo] = reactExports.useState("");
  const [showForm, setShowForm] = reactExports.useState(false);
  const [formTask, setFormTask] = reactExports.useState("");
  const [formStart, setFormStart] = reactExports.useState("");
  const [formEnd, setFormEnd] = reactExports.useState("");
  const [formDuration, setFormDuration] = reactExports.useState("");
  const [formNotes, setFormNotes] = reactExports.useState("");
  const [formBillable, setFormBillable] = reactExports.useState(false);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const filtered = reactExports.useMemo(() => {
    return entries.filter((e) => {
      if (filterUser !== "all" && e.userId !== filterUser) return false;
      if (filterTask !== "all" && e.taskId !== filterTask) return false;
      if (filterFrom) {
        const from = new Date(filterFrom).getTime();
        if (e.startedAt < from) return false;
      }
      if (filterTo) {
        const to = new Date(filterTo).getTime() + DAY;
        if (e.startedAt > to) return false;
      }
      return true;
    });
  }, [entries, filterUser, filterTask, filterFrom, filterTo]);
  const totalSeconds = filtered.reduce((a, e) => a + e.durationSeconds, 0);
  const billableSeconds = filtered.filter((e) => e.tags.includes("billable")).reduce((a, e) => a + e.durationSeconds, 0);
  function handleDelete(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    ue.success("Entry deleted");
  }
  function handleBillableToggle(id, checked) {
    setEntries(
      (prev) => prev.map(
        (e) => e.id === id ? {
          ...e,
          tags: checked ? [...e.tags.filter((t) => t !== "billable"), "billable"] : e.tags.filter((t) => t !== "billable")
        } : e
      )
    );
  }
  function handleAddEntry() {
    if (!formTask) {
      ue.error("Please select a task");
      return;
    }
    let durationSeconds = 0;
    let startedAt = Date.now();
    let stoppedAt = Date.now();
    if (formStart && formEnd) {
      const start = new Date(formStart).getTime();
      const end = new Date(formEnd).getTime();
      if (end <= start) {
        ue.error("End time must be after start time");
        return;
      }
      startedAt = start;
      stoppedAt = end;
      durationSeconds = Math.floor((end - start) / 1e3);
    } else if (formDuration) {
      const [h, m] = formDuration.split(":").map(Number);
      durationSeconds = (h || 0) * 3600 + (m || 0) * 60;
    } else {
      ue.error("Provide start/end time or duration (HH:MM)");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const newEntry = {
        id: `e${Date.now()}`,
        tenantId: "t",
        userId: "u1",
        projectId,
        taskId: formTask,
        description: formNotes,
        startedAt,
        stoppedAt,
        durationSeconds,
        status: "stopped",
        tags: formBillable ? ["billable"] : [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setEntries((prev) => [newEntry, ...prev]);
      setFormTask("");
      setFormStart("");
      setFormEnd("");
      setFormDuration("");
      setFormNotes("");
      setFormBillable(false);
      setShowForm(false);
      setIsSubmitting(false);
      ue.success("Time entry added");
    }, 400);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "animate-fade-in-up p-6 space-y-5",
      "data-ocid": "time-tracking-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/app/$workspaceId/projects/$projectId",
              params: { workspaceId, projectId },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground tracking-tight", children: "Time Tracking" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Track and manage time spent on project tasks" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "gap-1.5 h-8 text-xs",
              onClick: () => exportToCSV(filtered, MOCK_TASKS),
              "data-ocid": "export-csv-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
                " Export CSV"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "gap-1.5 h-8 text-xs active-press",
              onClick: () => setShowForm((v) => !v),
              "data-ocid": "add-entry-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                " Log Time"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-4", children: [
          {
            label: "Total Hours",
            value: formatDurationHHMM(totalSeconds),
            icon: Clock,
            color: "text-primary bg-primary/10"
          },
          {
            label: "Billable",
            value: formatDurationHHMM(billableSeconds),
            icon: Timer,
            color: "text-accent bg-accent/10"
          },
          {
            label: "Non-Billable",
            value: formatDurationHHMM(totalSeconds - billableSeconds),
            icon: Users,
            color: "text-secondary bg-secondary/10"
          },
          {
            label: "Entries",
            value: String(filtered.length),
            icon: Clock,
            color: "text-muted-foreground bg-muted"
          }
        ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-1 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex h-8 w-8 items-center justify-center rounded-lg ${s.color}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-4 w-4" })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-4 pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground font-mono", children: s.value }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.label })
          ] })
        ] }, s.label)) }),
        showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border border-primary/30 bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 text-primary" }),
            "Log Time Entry"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "entry-task", children: "Task" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formTask, onValueChange: setFormTask, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "entry-task", "data-ocid": "entry-task-select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select task…" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: MOCK_TASKS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t.id, children: t.title }, t.id)) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "entry-duration", children: "Duration (HH:MM)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "entry-duration",
                    placeholder: "e.g. 01:30",
                    value: formDuration,
                    onChange: (e) => setFormDuration(e.target.value),
                    "data-ocid": "entry-duration-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "entry-start", children: "Start Time" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "entry-start",
                    type: "datetime-local",
                    value: formStart,
                    onChange: (e) => setFormStart(e.target.value),
                    "data-ocid": "entry-start-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "entry-end", children: "End Time" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "entry-end",
                    type: "datetime-local",
                    value: formEnd,
                    onChange: (e) => setFormEnd(e.target.value),
                    "data-ocid": "entry-end-input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "entry-notes", children: "Notes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "entry-notes",
                  placeholder: "What did you work on?",
                  value: formNotes,
                  onChange: (e) => setFormNotes(e.target.value),
                  rows: 2,
                  className: "resize-none",
                  "data-ocid": "entry-notes-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    id: "entry-billable",
                    checked: formBillable,
                    onCheckedChange: setFormBillable,
                    "data-ocid": "entry-billable-switch"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "entry-billable", className: "cursor-pointer", children: "Billable" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => setShowForm(false),
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    onClick: handleAddEntry,
                    disabled: isSubmitting,
                    "data-ocid": "entry-submit-btn",
                    children: isSubmitting ? "Adding…" : "Add Entry"
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground whitespace-nowrap", children: "User" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterUser, onValueChange: setFilterUser, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-8 w-36 text-xs",
                  "data-ocid": "filter-user-select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All users" }),
                Object.entries(MOCK_USERS).map(([id, name]) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: id, children: name }, id))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground whitespace-nowrap", children: "Task" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterTask, onValueChange: setFilterTask, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-8 w-40 text-xs",
                  "data-ocid": "filter-task-select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All tasks" }),
                MOCK_TASKS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t.id, children: t.title }, t.id))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "From" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                className: "h-8 text-xs w-36",
                value: filterFrom,
                onChange: (e) => setFilterFrom(e.target.value),
                "data-ocid": "filter-from-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "To" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                className: "h-8 text-xs w-36",
                value: filterTo,
                onChange: (e) => setFilterTo(e.target.value),
                "data-ocid": "filter-to-input"
              }
            )
          ] }),
          (filterUser !== "all" || filterTask !== "all" || filterFrom || filterTo) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-8 text-xs",
              onClick: () => {
                setFilterUser("all");
                setFilterTask("all");
                setFilterFrom("");
                setFilterTo("");
              },
              children: "Clear filters"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Time Entries",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal", children: [
                "(",
                filtered.length,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-muted-foreground", children: [
              "Total:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: formatDurationHHMM(totalSeconds) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-12 gap-3",
              "data-ocid": "time-entries-empty",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-6 w-6 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No time entries found" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => setShowForm(true),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1.5" }),
                      "Log First Entry"
                    ]
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:block overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-medium text-muted-foreground px-6 py-3", children: "Task" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-medium text-muted-foreground px-3 py-3", children: "User" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-medium text-muted-foreground px-3 py-3", children: "Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right text-xs font-medium text-muted-foreground px-3 py-3", children: "Duration" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-medium text-muted-foreground px-3 py-3 max-w-xs", children: "Notes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center text-xs font-medium text-muted-foreground px-3 py-3", children: "Billable" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: filtered.map((entry) => {
                var _a;
                const taskName = ((_a = MOCK_TASKS.find((t) => t.id === entry.taskId)) == null ? void 0 : _a.title) ?? entry.taskId ?? "Unknown task";
                const userName = MOCK_USERS[entry.userId] ?? entry.userId;
                const isBillable = entry.tags.includes("billable");
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "hover:bg-muted/30 transition-colors",
                    "data-ocid": `time-entry-row-${entry.id}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-3 font-medium text-foreground truncate max-w-[160px]", children: taskName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-muted-foreground whitespace-nowrap", children: userName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-muted-foreground whitespace-nowrap", children: formatDate(entry.startedAt) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right font-mono font-semibold text-foreground whitespace-nowrap", children: formatDurationHHMM(entry.durationSeconds) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-muted-foreground truncate max-w-[200px]", children: entry.description || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 italic", children: "—" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Checkbox,
                        {
                          checked: isBillable,
                          onCheckedChange: (c) => handleBillableToggle(entry.id, c === true),
                          "data-ocid": `billable-toggle-${entry.id}`,
                          "aria-label": "Billable"
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "h-7 w-7 text-muted-foreground hover:text-destructive",
                          onClick: () => handleDelete(entry.id),
                          "data-ocid": `delete-entry-${entry.id}`,
                          "aria-label": "Delete entry",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                        }
                      ) })
                    ]
                  },
                  entry.id
                );
              }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:hidden divide-y divide-border", children: filtered.map((entry) => {
              var _a;
              const taskName = ((_a = MOCK_TASKS.find((t) => t.id === entry.taskId)) == null ? void 0 : _a.title) ?? "Unknown task";
              const isBillable = entry.tags.includes("billable");
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-start gap-3 px-4 py-4",
                  "data-ocid": `time-entry-mobile-${entry.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: taskName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                        MOCK_USERS[entry.userId],
                        " ·",
                        " ",
                        formatDate(entry.startedAt)
                      ] }),
                      entry.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 mt-1 line-clamp-2", children: entry.description })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1.5 shrink-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono font-semibold text-foreground", children: formatDurationHHMM(entry.durationSeconds) }),
                      isBillable && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-accent/10 text-accent border-accent/20 text-xs", children: "Billable" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "h-6 w-6 text-muted-foreground hover:text-destructive",
                          onClick: () => handleDelete(entry.id),
                          "aria-label": "Delete entry",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
                        }
                      )
                    ] })
                  ]
                },
                entry.id
              );
            }) })
          ] }) })
        ] })
      ]
    }
  );
}
export {
  TimeTrackingPage as default
};
