import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  Download,
  Plus,
  Timer,
  Trash2,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { TimeEntry } from "../../types";

const MOCK_TASKS = [
  { id: "t1", title: "Design system setup" },
  { id: "t2", title: "API integration" },
  { id: "t3", title: "Sprint planning" },
  { id: "t4", title: "Code review" },
];

const NOW = Date.now();
const DAY = 86400000;

const INITIAL_ENTRIES: TimeEntry[] = [
  {
    id: "e1",
    tenantId: "t",
    userId: "u1",
    projectId: "p1",
    taskId: "t1",
    description: "Initial design tokens and component scaffolding",
    startedAt: NOW - DAY - 7200000,
    stoppedAt: NOW - DAY - 4500000,
    durationSeconds: 9000,
    status: "stopped",
    tags: [],
    createdAt: NOW - DAY - 7200000,
    updatedAt: NOW - DAY - 4500000,
  },
  {
    id: "e2",
    tenantId: "t",
    userId: "u2",
    projectId: "p1",
    taskId: "t2",
    description: "REST endpoint wiring and error handling",
    startedAt: NOW - DAY - 3600000,
    stoppedAt: NOW - DAY - 1800000,
    durationSeconds: 5400,
    status: "stopped",
    tags: [],
    createdAt: NOW - DAY - 3600000,
    updatedAt: NOW - DAY - 1800000,
  },
  {
    id: "e3",
    tenantId: "t",
    userId: "u1",
    projectId: "p1",
    taskId: "t3",
    description: "Sprint 14 planning session",
    startedAt: NOW - 7200000,
    stoppedAt: NOW - 3600000,
    durationSeconds: 3600,
    status: "stopped",
    tags: [],
    createdAt: NOW - 7200000,
    updatedAt: NOW - 3600000,
  },
  {
    id: "e4",
    tenantId: "t",
    userId: "u3",
    projectId: "p1",
    taskId: "t4",
    description: "PR review — auth module",
    startedAt: NOW - 5400000,
    stoppedAt: NOW - 3000000,
    durationSeconds: 2700,
    status: "stopped",
    tags: ["billable"],
    createdAt: NOW - 5400000,
    updatedAt: NOW - 3000000,
  },
];

const MOCK_USERS: Record<string, string> = {
  u1: "Alex Martinez",
  u2: "Sam Kim",
  u3: "Jordan Lee",
};

function formatDurationHHMM(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function exportToCSV(entries: TimeEntry[], tasks: typeof MOCK_TASKS) {
  const header = "Task,User,Date,Duration,Notes,Billable\n";
  const rows = entries.map((e) => {
    const task = tasks.find((t) => t.id === e.taskId)?.title ?? e.taskId ?? "";
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

export default function TimeTrackingPage() {
  const { workspaceId, projectId } = useParams({
    from: "/app/$workspaceId/projects/$projectId/time-tracking",
  });

  const [entries, setEntries] = useState<TimeEntry[]>(INITIAL_ENTRIES);
  const [filterUser, setFilterUser] = useState("all");
  const [filterTask, setFilterTask] = useState("all");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formTask, setFormTask] = useState("");
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formBillable, setFormBillable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = useMemo(() => {
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
  const billableSeconds = filtered
    .filter((e) => e.tags.includes("billable"))
    .reduce((a, e) => a + e.durationSeconds, 0);

  function handleDelete(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast.success("Entry deleted");
  }

  function handleBillableToggle(id: string, checked: boolean) {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              tags: checked
                ? [...e.tags.filter((t) => t !== "billable"), "billable"]
                : e.tags.filter((t) => t !== "billable"),
            }
          : e,
      ),
    );
  }

  function handleAddEntry() {
    if (!formTask) {
      toast.error("Please select a task");
      return;
    }
    let durationSeconds = 0;
    let startedAt = Date.now();
    let stoppedAt = Date.now();
    if (formStart && formEnd) {
      const start = new Date(formStart).getTime();
      const end = new Date(formEnd).getTime();
      if (end <= start) {
        toast.error("End time must be after start time");
        return;
      }
      startedAt = start;
      stoppedAt = end;
      durationSeconds = Math.floor((end - start) / 1000);
    } else if (formDuration) {
      const [h, m] = formDuration.split(":").map(Number);
      durationSeconds = (h || 0) * 3600 + (m || 0) * 60;
    } else {
      toast.error("Provide start/end time or duration (HH:MM)");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const newEntry: TimeEntry = {
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
        updatedAt: Date.now(),
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
      toast.success("Time entry added");
    }, 400);
  }

  return (
    <div
      className="animate-fade-in-up p-6 space-y-5"
      data-ocid="time-tracking-page"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
          <Link
            to="/app/$workspaceId/projects/$projectId"
            params={{ workspaceId, projectId }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-display font-bold text-foreground tracking-tight">
            Time Tracking
          </h1>
          <p className="text-xs text-muted-foreground">
            Track and manage time spent on project tasks
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 h-8 text-xs"
          onClick={() => exportToCSV(filtered, MOCK_TASKS)}
          data-ocid="export-csv-btn"
        >
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
        <Button
          size="sm"
          className="gap-1.5 h-8 text-xs active-press"
          onClick={() => setShowForm((v) => !v)}
          data-ocid="add-entry-btn"
        >
          <Plus className="h-3.5 w-3.5" /> Log Time
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Total Hours",
            value: formatDurationHHMM(totalSeconds),
            icon: Clock,
            color: "text-primary bg-primary/10",
          },
          {
            label: "Billable",
            value: formatDurationHHMM(billableSeconds),
            icon: Timer,
            color: "text-accent bg-accent/10",
          },
          {
            label: "Non-Billable",
            value: formatDurationHHMM(totalSeconds - billableSeconds),
            icon: Users,
            color: "text-secondary bg-secondary/10",
          },
          {
            label: "Entries",
            value: String(filtered.length),
            icon: Clock,
            color: "text-muted-foreground bg-muted",
          },
        ].map((s) => (
          <Card key={s.label} className="border-border">
            <CardHeader className="pb-1 pt-4 px-4">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.color}`}
              >
                <s.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-2xl font-display font-bold text-foreground font-mono">
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Manual Entry Form */}
      {showForm && (
        <Card className="border-border border-primary/30 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" />
              Log Time Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="entry-task">Task</Label>
                <Select value={formTask} onValueChange={setFormTask}>
                  <SelectTrigger id="entry-task" data-ocid="entry-task-select">
                    <SelectValue placeholder="Select task…" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_TASKS.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="entry-duration">Duration (HH:MM)</Label>
                <Input
                  id="entry-duration"
                  placeholder="e.g. 01:30"
                  value={formDuration}
                  onChange={(e) => setFormDuration(e.target.value)}
                  data-ocid="entry-duration-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="entry-start">Start Time</Label>
                <Input
                  id="entry-start"
                  type="datetime-local"
                  value={formStart}
                  onChange={(e) => setFormStart(e.target.value)}
                  data-ocid="entry-start-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="entry-end">End Time</Label>
                <Input
                  id="entry-end"
                  type="datetime-local"
                  value={formEnd}
                  onChange={(e) => setFormEnd(e.target.value)}
                  data-ocid="entry-end-input"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="entry-notes">Notes</Label>
              <Textarea
                id="entry-notes"
                placeholder="What did you work on?"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                rows={2}
                className="resize-none"
                data-ocid="entry-notes-input"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="entry-billable"
                  checked={formBillable}
                  onCheckedChange={setFormBillable}
                  data-ocid="entry-billable-switch"
                />
                <Label htmlFor="entry-billable" className="cursor-pointer">
                  Billable
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddEntry}
                  disabled={isSubmitting}
                  data-ocid="entry-submit-btn"
                >
                  {isSubmitting ? "Adding…" : "Add Entry"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">
            User
          </Label>
          <Select value={filterUser} onValueChange={setFilterUser}>
            <SelectTrigger
              className="h-8 w-36 text-xs"
              data-ocid="filter-user-select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All users</SelectItem>
              {Object.entries(MOCK_USERS).map(([id, name]) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">
            Task
          </Label>
          <Select value={filterTask} onValueChange={setFilterTask}>
            <SelectTrigger
              className="h-8 w-40 text-xs"
              data-ocid="filter-task-select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tasks</SelectItem>
              {MOCK_TASKS.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">From</Label>
          <Input
            type="date"
            className="h-8 text-xs w-36"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            data-ocid="filter-from-input"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">To</Label>
          <Input
            type="date"
            className="h-8 text-xs w-36"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            data-ocid="filter-to-input"
          />
        </div>
        {(filterUser !== "all" ||
          filterTask !== "all" ||
          filterFrom ||
          filterTo) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => {
              setFilterUser("all");
              setFilterTask("all");
              setFilterFrom("");
              setFilterTo("");
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Entries table */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>
              Time Entries{" "}
              <span className="text-muted-foreground font-normal">
                ({filtered.length})
              </span>
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              Total:{" "}
              <span className="text-foreground font-semibold">
                {formatDurationHHMM(totalSeconds)}
              </span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 gap-3"
              data-ocid="time-entries-empty"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No time entries found
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowForm(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Log First Entry
              </Button>
            </div>
          ) : (
            <>
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                        Task
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-3 py-3">
                        User
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-3 py-3">
                        Date
                      </th>
                      <th className="text-right text-xs font-medium text-muted-foreground px-3 py-3">
                        Duration
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-3 py-3 max-w-xs">
                        Notes
                      </th>
                      <th className="text-center text-xs font-medium text-muted-foreground px-3 py-3">
                        Billable
                      </th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((entry) => {
                      const taskName =
                        MOCK_TASKS.find((t) => t.id === entry.taskId)?.title ??
                        entry.taskId ??
                        "Unknown task";
                      const userName = MOCK_USERS[entry.userId] ?? entry.userId;
                      const isBillable = entry.tags.includes("billable");
                      return (
                        <tr
                          key={entry.id}
                          className="hover:bg-muted/30 transition-colors"
                          data-ocid={`time-entry-row-${entry.id}`}
                        >
                          <td className="px-6 py-3 font-medium text-foreground truncate max-w-[160px]">
                            {taskName}
                          </td>
                          <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                            {userName}
                          </td>
                          <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                            {formatDate(entry.startedAt)}
                          </td>
                          <td className="px-3 py-3 text-right font-mono font-semibold text-foreground whitespace-nowrap">
                            {formatDurationHHMM(entry.durationSeconds)}
                          </td>
                          <td className="px-3 py-3 text-muted-foreground truncate max-w-[200px]">
                            {entry.description || (
                              <span className="text-muted-foreground/50 italic">
                                —
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            <Checkbox
                              checked={isBillable}
                              onCheckedChange={(c) =>
                                handleBillableToggle(entry.id, c === true)
                              }
                              data-ocid={`billable-toggle-${entry.id}`}
                              aria-label="Billable"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDelete(entry.id)}
                              data-ocid={`delete-entry-${entry.id}`}
                              aria-label="Delete entry"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="sm:hidden divide-y divide-border">
                {filtered.map((entry) => {
                  const taskName =
                    MOCK_TASKS.find((t) => t.id === entry.taskId)?.title ??
                    "Unknown task";
                  const isBillable = entry.tags.includes("billable");
                  return (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 px-4 py-4"
                      data-ocid={`time-entry-mobile-${entry.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {taskName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {MOCK_USERS[entry.userId]} ·{" "}
                          {formatDate(entry.startedAt)}
                        </p>
                        {entry.description && (
                          <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2">
                            {entry.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-sm font-mono font-semibold text-foreground">
                          {formatDurationHHMM(entry.durationSeconds)}
                        </span>
                        {isBillable && (
                          <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">
                            Billable
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(entry.id)}
                          aria-label="Delete entry"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
