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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { Task, TimeEntry } from "../../types";

function formatDurationHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function exportToCSV(entries: TimeEntry[], tasks: Task[]) {
  const header = "Task,Date,Duration,Notes,Billable\n";
  const rows = entries.map((e) => {
    const task = e.taskId
      ? (tasks.find((t) => t.id === e.taskId)?.title ?? e.taskId)
      : "No task";
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

const DAY_MS = 86_400_000;

export default function TimeTrackingPage() {
  const { workspaceId, projectId } = useParams({
    from: "/app/$workspaceId/projects/$projectId/time-tracking",
  });
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();

  const [filterTask, setFilterTask] = useState("all");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formTask, setFormTask] = useState("none");
  const [formDuration, setFormDuration] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formBillable, setFormBillable] = useState(false);

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["tasks", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTasks(tenantId, workspaceId, projectId);
    },
    enabled: !!actor && !isFetching,
  });

  const { data: entries = [], isLoading: entriesLoading } = useQuery<
    TimeEntry[]
  >({
    queryKey: ["timeEntries", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProjectTimeEntries(tenantId, workspaceId, projectId);
    },
    enabled: !!actor && !isFetching,
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
        taskId: formTask !== "none" ? formTask : undefined,
        startTime: BigInt(Date.now() * 1_000_000),
        endTime: undefined,
        durationMinutes: BigInt(minutes),
        notes: formNotes,
        billable: formBillable,
      });
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["timeEntries", tenantId, workspaceId, projectId],
      });
      setFormTask("none");
      setFormDuration("");
      setFormNotes("");
      setFormBillable(false);
      setShowForm(false);
      toast.success("Time entry logged");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.deleteTimeEntry(tenantId, workspaceId, id);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["timeEntries", tenantId, workspaceId, projectId],
      });
      toast.success("Entry deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (filterTask !== "all" && e.taskId !== filterTask) return false;
      if (filterFrom) {
        const from = BigInt(new Date(filterFrom).getTime() * 1_000_000);
        if (e.startTime < from) return false;
      }
      if (filterTo) {
        const to = BigInt((new Date(filterTo).getTime() + DAY_MS) * 1_000_000);
        if (e.startTime > to) return false;
      }
      return true;
    });
  }, [entries, filterTask, filterFrom, filterTo]);

  const totalMinutes = filtered.reduce(
    (a, e) => a + Number(e.durationMinutes),
    0,
  );
  const billableMinutes = filtered
    .filter((e) => e.billable)
    .reduce((a, e) => a + Number(e.durationMinutes), 0);

  const isLoading = tasksLoading || entriesLoading;

  return (
    <div
      className="animate-fade-in-up p-4 sm:p-6 space-y-5 pb-20 md:pb-6"
      data-ocid="time-tracking-page"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-8 w-8 min-h-[44px] min-w-[44px]"
        >
          <Link
            to="/app/$workspaceId/projects/$projectId"
            params={{ workspaceId, projectId }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-display font-bold text-foreground tracking-tight">
            Time Tracking
          </h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Track and manage time spent on project tasks
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 h-8 text-xs"
          onClick={() => exportToCSV(filtered, tasks)}
          data-ocid="export-csv-btn"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export CSV</span>
        </Button>
        <Button
          size="sm"
          className="gap-1.5 h-8 text-xs active-press"
          onClick={() => setShowForm((v) => !v)}
          data-ocid="add-entry-btn"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Log Time</span>
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Hours",
            value: formatDurationHHMM(totalMinutes),
            icon: Clock,
            color: "text-primary bg-primary/10",
          },
          {
            label: "Billable",
            value: formatDurationHHMM(billableMinutes),
            icon: Timer,
            color: "text-accent bg-accent/10",
          },
          {
            label: "Non-Billable",
            value: formatDurationHHMM(totalMinutes - billableMinutes),
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
              <p className="text-xl font-display font-bold text-foreground font-mono">
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Manual Entry Form */}
      {showForm && (
        <Card className="border-primary/30 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" />
              Log Time Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="entry-task" className="text-xs">
                  Task (optional)
                </Label>
                <Select value={formTask} onValueChange={setFormTask}>
                  <SelectTrigger
                    id="entry-task"
                    data-ocid="entry-task-select"
                    className="h-9 text-xs"
                  >
                    <SelectValue placeholder="Select task…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <span className="text-xs text-muted-foreground">
                        No specific task
                      </span>
                    </SelectItem>
                    {tasks.map((t) => (
                      <SelectItem key={t.id} value={t.id} className="text-xs">
                        {t.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="entry-duration" className="text-xs">
                  Duration (HH:MM) *
                </Label>
                <Input
                  id="entry-duration"
                  placeholder="e.g. 01:30"
                  value={formDuration}
                  onChange={(e) => setFormDuration(e.target.value)}
                  className="h-9 text-xs"
                  data-ocid="entry-duration-input"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="entry-notes" className="text-xs">
                Notes
              </Label>
              <Textarea
                id="entry-notes"
                placeholder="What did you work on?"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                rows={2}
                className="resize-none text-xs"
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
                <Label
                  htmlFor="entry-billable"
                  className="text-xs cursor-pointer"
                >
                  Billable
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="text-xs h-8 gap-1.5"
                  onClick={() => createMutation.mutate()}
                  disabled={createMutation.isPending || !formDuration}
                  data-ocid="entry-submit-btn"
                >
                  {createMutation.isPending ? "Logging…" : "Log Entry"}
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
              <SelectItem value="all" className="text-xs">
                All tasks
              </SelectItem>
              {tasks.map((t) => (
                <SelectItem key={t.id} value={t.id} className="text-xs">
                  <span className="truncate max-w-[160px] block">
                    {t.title}
                  </span>
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
        {(filterTask !== "all" || filterFrom || filterTo) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => {
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
                {formatDurationHHMM(totalMinutes)}
              </span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="px-6 pb-6 space-y-3 pt-2">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 gap-3"
              data-ocid="time-entries-empty"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No time entries yet
              </p>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => setShowForm(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Log First Entry
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                        Task
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
                      const taskTitle = entry.taskId
                        ? (tasks.find((t) => t.id === entry.taskId)?.title ??
                          entry.taskId)
                        : "General";
                      return (
                        <tr
                          key={entry.id}
                          className="hover:bg-muted/30 transition-colors"
                          data-ocid={`time-entry-row-${entry.id}`}
                        >
                          <td className="px-6 py-3 font-medium text-foreground truncate max-w-[180px] text-xs">
                            {taskTitle}
                          </td>
                          <td className="px-3 py-3 text-muted-foreground whitespace-nowrap text-xs">
                            {formatDate(entry.startTime)}
                          </td>
                          <td className="px-3 py-3 text-right font-mono font-semibold text-foreground whitespace-nowrap text-xs">
                            {formatDurationHHMM(Number(entry.durationMinutes))}
                          </td>
                          <td className="px-3 py-3 text-muted-foreground truncate max-w-[200px] text-xs">
                            {entry.notes || (
                              <span className="text-muted-foreground/40 italic">
                                —
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {entry.billable && (
                              <Badge className="bg-accent/10 text-accent border-accent/20 text-[10px]">
                                Billable
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => deleteMutation.mutate(entry.id)}
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
              {/* Mobile cards */}
              <div className="sm:hidden divide-y divide-border">
                {filtered.map((entry) => {
                  const taskTitle = entry.taskId
                    ? (tasks.find((t) => t.id === entry.taskId)?.title ??
                      "Task")
                    : "General";
                  return (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 px-4 py-4"
                      data-ocid={`time-entry-mobile-${entry.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {taskTitle}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(entry.startTime)}
                        </p>
                        {entry.notes && (
                          <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-sm font-mono font-semibold text-foreground">
                          {formatDurationHHMM(Number(entry.durationMinutes))}
                        </span>
                        {entry.billable && (
                          <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">
                            Billable
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteMutation.mutate(entry.id)}
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
