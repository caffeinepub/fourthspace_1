import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { useWorkspace } from "../../hooks/useWorkspace";

interface TimesheetEntry {
  id: string;
  userId: string;
  date: string;
  hours: number;
  description: string;
  project: string;
  billable: boolean;
}

const MOCK_USERS = [
  { id: "u1", name: "Alex Martinez" },
  { id: "u2", name: "Sam Kim" },
  { id: "u3", name: "Jordan Lee" },
  { id: "u4", name: "Morgan Chen" },
  { id: "u5", name: "Riley Okafor" },
];

function generateTimesheetEntries(): TimesheetEntry[] {
  const entries: TimesheetEntry[] = [];
  const projects = [
    "Website Redesign",
    "Mobile App MVP",
    "API Integration Suite",
    "Internal Tooling",
  ];
  const descriptions = [
    "Component development",
    "Code review",
    "Sprint planning",
    "Bug fixes",
    "Documentation",
    "Design review",
    "API integration",
    "Testing",
  ];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);

  let id = 1;
  for (let week = -2; week <= 1; week++) {
    for (const user of MOCK_USERS) {
      for (let day = 0; day < 7; day++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + week * 7 + day);
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        if (isWeekend) continue;
        const numEntries = Math.floor(Math.random() * 3) + 1;
        for (let n = 0; n < numEntries; n++) {
          const hours = Math.round((Math.random() * 3 + 0.5) * 10) / 10;
          entries.push({
            id: `e${id++}`,
            userId: user.id,
            date: d.toISOString().slice(0, 10),
            hours,
            description:
              descriptions[Math.floor(Math.random() * descriptions.length)],
            project: projects[Math.floor(Math.random() * projects.length)],
            billable: Math.random() > 0.3,
          });
        }
      }
    }
  }
  return entries;
}

const ALL_ENTRIES = generateTimesheetEntries();

function getWeekStart(offset: number): Date {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const mon = new Date(today);
  mon.setDate(today.getDate() + diff + offset * 7);
  mon.setHours(0, 0, 0, 0);
  return mon;
}

const formatDate = (d: Date) => d.toISOString().slice(0, 10);
const formatDisplay = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
const formatH = (h: number) => `${h.toFixed(1)}h`;
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeeklyTimesheetPage() {
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedUser, setSelectedUser] = useState(MOCK_USERS[0].id);

  const weekStart = useMemo(() => getWeekStart(weekOffset), [weekOffset]);

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
      }),
    [weekStart],
  );

  const userEntries = useMemo(
    () => ALL_ENTRIES.filter((e) => e.userId === selectedUser),
    [selectedUser],
  );

  const dayTotals = useMemo(
    () =>
      weekDays.map((d) => {
        const dateStr = formatDate(d);
        const dayEntries = userEntries.filter((e) => e.date === dateStr);
        const total = dayEntries.reduce((a, e) => a + e.hours, 0);
        return { date: dateStr, entries: dayEntries, total };
      }),
    [weekDays, userEntries],
  );

  const weekTotal = dayTotals.reduce((a, d) => a + d.total, 0);
  const weekLabel = (() => {
    const end = new Date(weekStart);
    end.setDate(weekStart.getDate() + 6);
    return `${formatDisplay(weekStart)} – ${formatDisplay(end)}, ${weekStart.getFullYear()}`;
  })();

  return (
    <div
      className="p-6 space-y-6 animate-fade-in-up"
      data-ocid="weekly-timesheet-page"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="hover:bg-muted">
          <Link to={`/app/${workspaceId}/admin/time-reports` as "/"}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10">
          <Clock className="h-4 w-4 text-cyan-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Weekly Timesheet
          </h1>
          <p className="text-sm text-muted-foreground">
            View time entries by week for each team member
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Member</span>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger
              className="h-8 w-44 text-xs"
              data-ocid="timesheet-user-select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MOCK_USERS.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted"
            onClick={() => setWeekOffset((v) => v - 1)}
            aria-label="Previous week"
            data-ocid="prev-week-btn"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-foreground min-w-[180px] text-center">
            {weekLabel}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted"
            onClick={() => setWeekOffset((v) => v + 1)}
            aria-label="Next week"
            data-ocid="next-week-btn"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          {weekOffset !== 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs ml-1 active-press"
              onClick={() => setWeekOffset(0)}
              data-ocid="this-week-btn"
            >
              This Week
            </Button>
          )}
        </div>
      </div>

      {/* Week total */}
      <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3 shadow-card">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-display font-bold font-mono text-foreground">
            {formatH(weekTotal)}
          </p>
          <p className="text-xs text-muted-foreground">Total this week</p>
        </div>
        <Badge className="ml-auto text-xs rounded-full px-2.5 py-0.5 bg-muted text-muted-foreground border-border">
          {MOCK_USERS.find((u) => u.id === selectedUser)?.name}
        </Badge>
      </div>

      {/* 7-column grid */}
      <div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7"
        data-ocid="week-grid"
      >
        {dayTotals.map((day, i) => {
          const d = weekDays[i];
          const isToday = formatDate(new Date()) === day.date;
          const isWeekend = d.getDay() === 0 || d.getDay() === 6;
          return (
            <Card
              key={day.date}
              className={`border-border/50 shadow-card transition-all ${isToday ? "border-primary/40 bg-primary/5 dark:bg-primary/10" : "bg-card"} ${isWeekend ? "opacity-50" : ""}`}
              data-ocid={`day-col-${day.date}`}
            >
              <CardHeader className="pb-2 pt-3 px-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {DAY_LABELS[i]}
                  </p>
                  {isToday && (
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">
                      Today
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDisplay(d)}
                </p>
              </CardHeader>
              <CardContent className="px-3 pb-3 space-y-1.5">
                {day.entries.length === 0 ? (
                  <p className="text-xs text-muted-foreground/50 italic py-2">
                    No entries
                  </p>
                ) : (
                  day.entries.map((e) => (
                    <div
                      key={e.id}
                      className="rounded-lg border border-border/40 bg-muted/20 px-2.5 py-2 space-y-0.5"
                      data-ocid={`entry-${e.id}`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-mono font-semibold text-foreground">
                          {formatH(e.hours)}
                        </span>
                        {e.billable && (
                          <span className="text-[10px] text-accent font-medium">
                            Bill.
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {e.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 truncate">
                        {e.project}
                      </p>
                    </div>
                  ))
                )}
                {day.total > 0 && (
                  <div className="pt-1 border-t border-border/40">
                    <p className="text-xs font-mono font-semibold text-foreground text-right">
                      {formatH(day.total)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
