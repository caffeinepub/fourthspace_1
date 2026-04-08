import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Download,
  FolderKanban,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useWorkspace } from "../../hooks/useWorkspace";

interface DailyData {
  date: string;
  hours: number;
  billable: number;
}
interface UserRow {
  id: string;
  name: string;
  totalHours: number;
  billableHours: number;
}
interface ProjectRow {
  id: string;
  name: string;
  totalHours: number;
  billableHours: number;
}
interface TimeEntryRow {
  id: string;
  user: string;
  project: string;
  date: string;
  hours: number;
  description: string;
  billable: boolean;
}

const NOW = Date.now();
const DAY = 86400000;

const MOCK_USERS: UserRow[] = [
  { id: "u1", name: "Alex Martinez", totalHours: 142.5, billableHours: 108.0 },
  { id: "u2", name: "Sam Kim", totalHours: 118.0, billableHours: 95.5 },
  { id: "u3", name: "Jordan Lee", totalHours: 96.0, billableHours: 60.0 },
  { id: "u4", name: "Morgan Chen", totalHours: 80.5, billableHours: 72.0 },
  { id: "u5", name: "Riley Okafor", totalHours: 64.0, billableHours: 38.0 },
];

const MOCK_PROJECTS: ProjectRow[] = [
  {
    id: "p1",
    name: "Website Redesign",
    totalHours: 210.0,
    billableHours: 176.5,
  },
  { id: "p2", name: "Mobile App MVP", totalHours: 185.5, billableHours: 162.0 },
  {
    id: "p3",
    name: "API Integration Suite",
    totalHours: 104.5,
    billableHours: 80.0,
  },
  { id: "p4", name: "Internal Tooling", totalHours: 61.0, billableHours: 0 },
];

const MOCK_ENTRIES: TimeEntryRow[] = [
  {
    id: "e1",
    user: "u1",
    project: "p1",
    date: "Apr 7, 2026",
    hours: 3.5,
    description: "Design system tokens and component scaffolding",
    billable: true,
  },
  {
    id: "e2",
    user: "u2",
    project: "p2",
    date: "Apr 7, 2026",
    hours: 2.0,
    description: "REST endpoint wiring and error handling",
    billable: true,
  },
  {
    id: "e3",
    user: "u3",
    project: "p1",
    date: "Apr 6, 2026",
    hours: 4.0,
    description: "Mobile responsive layout pass",
    billable: true,
  },
  {
    id: "e4",
    user: "u1",
    project: "p3",
    date: "Apr 6, 2026",
    hours: 1.5,
    description: "OAuth2 integration research",
    billable: false,
  },
  {
    id: "e5",
    user: "u4",
    project: "p2",
    date: "Apr 5, 2026",
    hours: 5.0,
    description: "Push notifications and deep links",
    billable: true,
  },
  {
    id: "e6",
    user: "u2",
    project: "p4",
    date: "Apr 5, 2026",
    hours: 2.5,
    description: "Internal dev tooling improvements",
    billable: false,
  },
  {
    id: "e7",
    user: "u5",
    project: "p1",
    date: "Apr 4, 2026",
    hours: 3.0,
    description: "User research synthesis",
    billable: true,
  },
  {
    id: "e8",
    user: "u3",
    project: "p3",
    date: "Apr 4, 2026",
    hours: 2.0,
    description: "API documentation review",
    billable: false,
  },
];

function generateDailyData(days: number): DailyData[] {
  const result: DailyData[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(NOW - i * DAY);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const seed = d.getDate() * 13 + d.getMonth() * 7;
    const baseH = isWeekend ? 0 : (seed % 5) + 2.5;
    const hours = Math.round(baseH * 10) / 10;
    const billable = Math.round(hours * (0.5 + (seed % 4) * 0.1) * 10) / 10;
    result.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      hours,
      billable,
    });
  }
  return result;
}

const ALL_DAILY = generateDailyData(30);
const formatH = (h: number) => `${h.toFixed(1)}h`;

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-dropdown text-xs space-y-1">
      <p className="font-semibold text-foreground">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full shrink-0"
            style={{ background: p.color }}
          />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-mono font-semibold text-foreground">
            {formatH(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function TimeReportsPage() {
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";

  const [filterProject, setFilterProject] = useState("all");
  const [filterUser, setFilterUser] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [billableOnly, setBillableOnly] = useState(false);
  const [hasRun, setHasRun] = useState(true);

  const filteredEntries = useMemo(() => {
    if (!hasRun) return [];
    return MOCK_ENTRIES.filter((e) => {
      if (filterProject !== "all" && e.project !== filterProject) return false;
      if (filterUser !== "all" && e.user !== filterUser) return false;
      if (billableOnly && !e.billable) return false;
      return true;
    });
  }, [hasRun, filterProject, filterUser, billableOnly]);

  const daily = useMemo(() => {
    if (!dateFrom && !dateTo) return ALL_DAILY;
    return ALL_DAILY.filter((_d, i) => {
      const dayMs = NOW - (ALL_DAILY.length - 1 - i) * DAY;
      if (dateFrom && dayMs < new Date(dateFrom).getTime()) return false;
      if (dateTo && dayMs > new Date(dateTo).getTime() + DAY) return false;
      return true;
    });
  }, [dateFrom, dateTo]);

  const totalHours = filteredEntries.reduce((a, e) => a + e.hours, 0);
  const billableHours = filteredEntries
    .filter((e) => e.billable)
    .reduce((a, e) => a + e.hours, 0);
  const nonBillableHours = totalHours - billableHours;
  const billablePct =
    totalHours > 0 ? Math.round((billableHours / totalHours) * 100) : 0;

  const projectBreakdown = useMemo(() => {
    const map = new Map<
      string,
      { name: string; hours: number; billableHours: number }
    >();
    for (const e of filteredEntries) {
      const proj = MOCK_PROJECTS.find((p) => p.id === e.project);
      const name = proj?.name ?? e.project;
      const existing = map.get(e.project) ?? {
        name,
        hours: 0,
        billableHours: 0,
      };
      map.set(e.project, {
        name,
        hours: existing.hours + e.hours,
        billableHours: existing.billableHours + (e.billable ? e.hours : 0),
      });
    }
    return Array.from(map.values());
  }, [filteredEntries]);

  const userBreakdown = useMemo(() => {
    const map = new Map<
      string,
      { name: string; hours: number; billableHours: number }
    >();
    for (const e of filteredEntries) {
      const user = MOCK_USERS.find((u) => u.id === e.user);
      const name = user?.name ?? e.user;
      const existing = map.get(e.user) ?? { name, hours: 0, billableHours: 0 };
      map.set(e.user, {
        name,
        hours: existing.hours + e.hours,
        billableHours: existing.billableHours + (e.billable ? e.hours : 0),
      });
    }
    return Array.from(map.values());
  }, [filteredEntries]);

  function handleExportCSV() {
    const header = "User,Project,Date,Hours,Description,Billable\n";
    const rows = filteredEntries
      .map((e) => {
        const user = MOCK_USERS.find((u) => u.id === e.user)?.name ?? e.user;
        const proj =
          MOCK_PROJECTS.find((p) => p.id === e.project)?.name ?? e.project;
        return `"${user}","${proj}","${e.date}",${e.hours},"${e.description}","${e.billable ? "Yes" : "No"}"`;
      })
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "time-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const thCls =
    "text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5";
  const tdCls = "px-4 py-3";

  return (
    <div
      className="p-6 space-y-6 animate-fade-in-up"
      data-ocid="time-reports-page"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="hover:bg-muted">
          <Link to={`/app/${workspaceId}/admin` as "/"}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10">
          <Clock className="h-4 w-4 text-cyan-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Time Reports
          </h1>
          <p className="text-sm text-muted-foreground">
            Organization-wide time tracking analytics
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="active-press">
          <Link to={`/app/${workspaceId}/admin/timesheet` as "/"}>
            <Clock className="h-4 w-4 mr-2" />
            Timesheet
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          data-ocid="export-report-btn"
          className="active-press"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">
            Project
          </Label>
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger
              className="h-8 w-40 text-xs"
              data-ocid="report-project-select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {MOCK_PROJECTS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">
            User
          </Label>
          <Select value={filterUser} onValueChange={setFilterUser}>
            <SelectTrigger
              className="h-8 w-36 text-xs"
              data-ocid="report-user-select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All users</SelectItem>
              {MOCK_USERS.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
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
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            data-ocid="report-from-input"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">To</Label>
          <Input
            type="date"
            className="h-8 text-xs w-36"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            data-ocid="report-to-input"
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Switch
            id="billable-only"
            checked={billableOnly}
            onCheckedChange={setBillableOnly}
            data-ocid="report-billable-toggle"
          />
          <Label
            htmlFor="billable-only"
            className="text-xs cursor-pointer text-muted-foreground"
          >
            Billable only
          </Label>
        </div>
        <Button
          size="sm"
          className="h-8 active-press"
          onClick={() => setHasRun(true)}
          data-ocid="run-report-btn"
        >
          Run Report
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Hours",
            value: formatH(totalHours),
            icon: Clock,
            iconCls: "text-primary bg-primary/10",
          },
          {
            label: "Billable Hours",
            value: formatH(billableHours),
            icon: DollarSign,
            iconCls: "text-accent bg-accent/10",
          },
          {
            label: "Non-Billable",
            value: formatH(nonBillableHours),
            icon: Users,
            iconCls: "text-secondary bg-secondary/10",
          },
        ].map((s) => (
          <Card key={s.label} className="border-border/50 bg-card shadow-card">
            <CardContent className="p-4">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.iconCls} mb-2`}
              >
                <s.icon className="h-4 w-4" />
              </div>
              <p className="text-2xl font-display font-bold font-mono text-foreground">
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Billable % bar */}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${billablePct}%` }}
          />
        </div>
        <Badge className="text-xs shrink-0 rounded-full px-2.5 py-0.5 bg-accent/10 text-accent border-accent/20">
          {billablePct}% billable
        </Badge>
      </div>

      {/* Daily chart */}
      <Card
        className="border-border/50 bg-card shadow-card"
        data-ocid="daily-hours-chart"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Hours Per Day — Past 30 Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={daily}
                margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
                barGap={2}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="oklch(var(--border))"
                />
                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 10,
                    fill: "oklch(var(--muted-foreground))",
                  }}
                  tickLine={false}
                  axisLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{
                    fontSize: 10,
                    fill: "oklch(var(--muted-foreground))",
                  }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `${v}h`}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "oklch(var(--muted))" }}
                />
                <Bar
                  dataKey="hours"
                  name="total"
                  fill="oklch(var(--primary))"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={24}
                />
                <Bar
                  dataKey="billable"
                  name="billable"
                  fill="oklch(var(--accent))"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown tables */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card
          className="border-border/50 bg-card shadow-card"
          data-ocid="project-breakdown-table"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-secondary" /> By Project
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  <th className={thCls}>Project</th>
                  <th className={`${thCls} text-right`}>Hours</th>
                  <th className={`${thCls} text-right`}>Billable</th>
                  <th className={`${thCls} text-right`}>% Bill.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {projectBreakdown.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      Run the report to see data
                    </td>
                  </tr>
                ) : (
                  projectBreakdown.map((p) => {
                    const pct =
                      p.hours > 0
                        ? Math.round((p.billableHours / p.hours) * 100)
                        : 0;
                    return (
                      <tr
                        key={p.name}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td
                          className={`${tdCls} font-medium text-foreground truncate max-w-[140px]`}
                        >
                          {p.name}
                        </td>
                        <td
                          className={`${tdCls} text-right font-mono text-foreground`}
                        >
                          {formatH(p.hours)}
                        </td>
                        <td
                          className={`${tdCls} text-right font-mono text-accent font-semibold`}
                        >
                          {formatH(p.billableHours)}
                        </td>
                        <td
                          className={`${tdCls} text-right text-muted-foreground text-xs`}
                        >
                          {pct}%
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card
          className="border-border/50 bg-card shadow-card"
          data-ocid="user-breakdown-table"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> By User
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  <th className={thCls}>User</th>
                  <th className={`${thCls} text-right`}>Hours</th>
                  <th className={`${thCls} text-right`}>Billable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {userBreakdown.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      Run the report to see data
                    </td>
                  </tr>
                ) : (
                  userBreakdown.map((u) => (
                    <tr
                      key={u.name}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className={`${tdCls} font-medium text-foreground`}>
                        {u.name}
                      </td>
                      <td
                        className={`${tdCls} text-right font-mono text-foreground`}
                      >
                        {formatH(u.hours)}
                      </td>
                      <td
                        className={`${tdCls} text-right font-mono text-accent font-semibold`}
                      >
                        {formatH(u.billableHours)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Time Entry list */}
      <Card
        className="border-border/50 bg-card shadow-card"
        data-ocid="time-entries-list"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            Time Entries
            <span className="text-muted-foreground font-normal">
              ({filteredEntries.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                <th className={thCls}>User</th>
                <th className={thCls}>Project</th>
                <th className={thCls}>Date</th>
                <th className={`${thCls} text-right`}>Hours</th>
                <th className={`${thCls} hidden lg:table-cell`}>Description</th>
                <th className={`${thCls} text-center`}>Billable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    No entries to display. Run the report with your filters.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((e) => {
                  const user =
                    MOCK_USERS.find((u) => u.id === e.user)?.name ?? e.user;
                  const proj =
                    MOCK_PROJECTS.find((p) => p.id === e.project)?.name ??
                    e.project;
                  return (
                    <tr
                      key={e.id}
                      className="hover:bg-muted/30 transition-colors"
                      data-ocid={`entry-row-${e.id}`}
                    >
                      <td
                        className={`${tdCls} font-medium text-foreground whitespace-nowrap`}
                      >
                        {user}
                      </td>
                      <td
                        className={`${tdCls} text-muted-foreground whitespace-nowrap`}
                      >
                        {proj}
                      </td>
                      <td
                        className={`${tdCls} text-muted-foreground whitespace-nowrap`}
                      >
                        {e.date}
                      </td>
                      <td
                        className={`${tdCls} text-right font-mono font-semibold text-foreground`}
                      >
                        {formatH(e.hours)}
                      </td>
                      <td
                        className={`${tdCls} text-muted-foreground truncate max-w-[200px] hidden lg:table-cell`}
                      >
                        {e.description}
                      </td>
                      <td className={`${tdCls} text-center`}>
                        {e.billable ? (
                          <Badge className="text-xs rounded-full px-2 py-0.5 bg-accent/10 text-accent border-accent/20">
                            Yes
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
