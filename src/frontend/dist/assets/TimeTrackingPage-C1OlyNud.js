import { m as useParams, f as useWorkspace, n as useQueryClient, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, P as Plus } from "./index-1XRv9GHr.js";
import { B as Badge } from "./badge-rX4oLW6l.js";
import { C as Card, b as CardHeader, a as CardContent, c as CardTitle } from "./card-CFU1s52N.js";
import { I as Input } from "./input-BOIU-9S_.js";
import { L as Label } from "./label-cy3JJ-Xo.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BNtSJS5c.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { S as Switch } from "./switch-CkJgAgK0.js";
import { T as Textarea } from "./textarea-DsJhlE90.js";
import { u as useMutation } from "./useMutation-X94w2CVk.js";
import { u as ue } from "./index-BOWFyaIB.js";
import { u as useBackend } from "./useBackend-DyFxq-Jw.js";
import { A as ArrowLeft } from "./arrow-left-B-gbON0E.js";
import { D as Download } from "./download-B8M1zj2A.js";
import { C as Clock } from "./clock-By6uj0s2.js";
import { T as Timer } from "./timer-DisdAkUD.js";
import { U as Users } from "./users-BwTeKVE_.js";
import { T as Trash2 } from "./trash-2-DiWEnbCD.js";
import "./index-IXOTxK3N.js";
import "./index-DYs8jb_i.js";
import "./chevron-up-BUdvSziG.js";
function formatDurationHHMM(minutes) {
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function exportToCSV(entries, tasks) {
  const header = "Task,Date,Duration,Notes,Billable\n";
  const rows = entries.map((e) => {
    var _a;
    const task = e.taskId ? ((_a = tasks.find((t) => t.id === e.taskId)) == null ? void 0 : _a.title) ?? e.taskId : "No task";
    const date = formatDate(e.startTime);
    const dur = formatDurationHHMM(Number(e.durationMinutes));
    const notes = e.notes.replace(/,/g, ";");
    const billable = e.billable ? "Yes" : "No";
    return `"${task}","${date}","${dur}","${notes}","${billable}"`;
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
const DAY_MS = 864e5;
function TimeTrackingPage() {
  const { workspaceId, projectId } = useParams({
    from: "/app/$workspaceId/projects/$projectId/time-tracking"
  });
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();
  const [filterTask, setFilterTask] = reactExports.useState("all");
  const [filterFrom, setFilterFrom] = reactExports.useState("");
  const [filterTo, setFilterTo] = reactExports.useState("");
  const [showForm, setShowForm] = reactExports.useState(false);
  const [formTask, setFormTask] = reactExports.useState("none");
  const [formDuration, setFormDuration] = reactExports.useState("");
  const [formNotes, setFormNotes] = reactExports.useState("");
  const [formBillable, setFormBillable] = reactExports.useState(false);
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTasks(tenantId, workspaceId, projectId);
    },
    enabled: !!actor && !isFetching
  });
  const { data: entries = [], isLoading: entriesLoading } = useQuery({
    queryKey: ["timeEntries", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProjectTimeEntries(tenantId, workspaceId, projectId);
    },
    enabled: !!actor && !isFetching
  });
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!formDuration) throw new Error("Provide duration (HH:MM)");
      const [h, m] = formDuration.split(":").map(Number);
      const minutes = (h || 0) * 60 + (m || 0);
      if (minutes <= 0) throw new Error("Duration must be greater than zero");
      const r = await actor.createTimeEntry(tenantId, workspaceId, {
        projectId,
        taskId: formTask !== "none" ? formTask : void 0,
        startTime: BigInt(Date.now() * 1e6),
        endTime: void 0,
        durationMinutes: BigInt(minutes),
        notes: formNotes,
        billable: formBillable
      });
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["timeEntries", tenantId, workspaceId, projectId]
      });
      setFormTask("none");
      setFormDuration("");
      setFormNotes("");
      setFormBillable(false);
      setShowForm(false);
      ue.success("Time entry logged");
    },
    onError: (e) => ue.error(e.message)
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.deleteTimeEntry(tenantId, workspaceId, id);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["timeEntries", tenantId, workspaceId, projectId]
      });
      ue.success("Entry deleted");
    },
    onError: (e) => ue.error(e.message)
  });
  const filtered = reactExports.useMemo(() => {
    return entries.filter((e) => {
      if (filterTask !== "all" && e.taskId !== filterTask) return false;
      if (filterFrom) {
        const from = BigInt(new Date(filterFrom).getTime() * 1e6);
        if (e.startTime < from) return false;
      }
      if (filterTo) {
        const to = BigInt((new Date(filterTo).getTime() + DAY_MS) * 1e6);
        if (e.startTime > to) return false;
      }
      return true;
    });
  }, [entries, filterTask, filterFrom, filterTo]);
  const totalMinutes = filtered.reduce(
    (a, e) => a + Number(e.durationMinutes),
    0
  );
  const billableMinutes = filtered.filter((e) => e.billable).reduce((a, e) => a + Number(e.durationMinutes), 0);
  const isLoading = tasksLoading || entriesLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "animate-fade-in-up p-4 sm:p-6 space-y-5 pb-20 md:pb-6",
      "data-ocid": "time-tracking-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              asChild: true,
              className: "h-8 w-8 min-h-[44px] min-w-[44px]",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/app/$workspaceId/projects/$projectId",
                  params: { workspaceId, projectId },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-display font-bold text-foreground tracking-tight", children: "Time Tracking" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground hidden sm:block", children: "Track and manage time spent on project tasks" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "gap-1.5 h-8 text-xs",
              onClick: () => exportToCSV(filtered, tasks),
              "data-ocid": "export-csv-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Export CSV" })
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
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Log Time" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
          {
            label: "Total Hours",
            value: formatDurationHHMM(totalMinutes),
            icon: Clock,
            color: "text-primary bg-primary/10"
          },
          {
            label: "Billable",
            value: formatDurationHHMM(billableMinutes),
            icon: Timer,
            color: "text-accent bg-accent/10"
          },
          {
            label: "Non-Billable",
            value: formatDurationHHMM(totalMinutes - billableMinutes),
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-display font-bold text-foreground font-mono", children: s.value }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.label })
          ] })
        ] }, s.label)) }),
        showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/30 bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 text-primary" }),
            "Log Time Entry"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "entry-task", className: "text-xs", children: "Task (optional)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formTask, onValueChange: setFormTask, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      id: "entry-task",
                      "data-ocid": "entry-task-select",
                      className: "h-9 text-xs",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select task…" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "No specific task" }) }),
                    tasks.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t.id, className: "text-xs", children: t.title }, t.id))
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "entry-duration", className: "text-xs", children: "Duration (HH:MM) *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "entry-duration",
                    placeholder: "e.g. 01:30",
                    value: formDuration,
                    onChange: (e) => setFormDuration(e.target.value),
                    className: "h-9 text-xs",
                    "data-ocid": "entry-duration-input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "entry-notes", className: "text-xs", children: "Notes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "entry-notes",
                  placeholder: "What did you work on?",
                  value: formNotes,
                  onChange: (e) => setFormNotes(e.target.value),
                  rows: 2,
                  className: "resize-none text-xs",
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "entry-billable",
                    className: "text-xs cursor-pointer",
                    children: "Billable"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "text-xs h-8",
                    onClick: () => setShowForm(false),
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    className: "text-xs h-8 gap-1.5",
                    onClick: () => createMutation.mutate(),
                    disabled: createMutation.isPending || !formDuration,
                    "data-ocid": "entry-submit-btn",
                    children: createMutation.isPending ? "Logging…" : "Log Entry"
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3", children: [
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", className: "text-xs", children: "All tasks" }),
                tasks.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t.id, className: "text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[160px] block", children: t.title }) }, t.id))
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
          (filterTask !== "all" || filterFrom || filterTo) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-8 text-xs",
              onClick: () => {
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: formatDurationHHMM(totalMinutes) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pb-6 space-y-3 pt-2", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-xl" }, n)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-12 gap-3",
              "data-ocid": "time-entries-empty",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-6 w-6 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No time entries yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    className: "text-xs h-8",
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
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-medium text-muted-foreground px-3 py-3", children: "Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right text-xs font-medium text-muted-foreground px-3 py-3", children: "Duration" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-medium text-muted-foreground px-3 py-3 max-w-xs", children: "Notes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center text-xs font-medium text-muted-foreground px-3 py-3", children: "Billable" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: filtered.map((entry) => {
                var _a;
                const taskTitle = entry.taskId ? ((_a = tasks.find((t) => t.id === entry.taskId)) == null ? void 0 : _a.title) ?? entry.taskId : "General";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "hover:bg-muted/30 transition-colors",
                    "data-ocid": `time-entry-row-${entry.id}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-3 font-medium text-foreground truncate max-w-[180px] text-xs", children: taskTitle }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-muted-foreground whitespace-nowrap text-xs", children: formatDate(entry.startTime) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right font-mono font-semibold text-foreground whitespace-nowrap text-xs", children: formatDurationHHMM(Number(entry.durationMinutes)) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-muted-foreground truncate max-w-[200px] text-xs", children: entry.notes || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 italic", children: "—" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center", children: entry.billable && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-accent/10 text-accent border-accent/20 text-[10px]", children: "Billable" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "h-7 w-7 text-muted-foreground hover:text-destructive",
                          onClick: () => deleteMutation.mutate(entry.id),
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
              const taskTitle = entry.taskId ? ((_a = tasks.find((t) => t.id === entry.taskId)) == null ? void 0 : _a.title) ?? "Task" : "General";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-start gap-3 px-4 py-4",
                  "data-ocid": `time-entry-mobile-${entry.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: taskTitle }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: formatDate(entry.startTime) }),
                      entry.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 mt-1 line-clamp-2", children: entry.notes })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1.5 shrink-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono font-semibold text-foreground", children: formatDurationHHMM(Number(entry.durationMinutes)) }),
                      entry.billable && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-accent/10 text-accent border-accent/20 text-xs", children: "Billable" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "h-6 w-6 text-muted-foreground hover:text-destructive",
                          onClick: () => deleteMutation.mutate(entry.id),
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
