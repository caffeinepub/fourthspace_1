// Calendar Page — clean rebuild v2
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  Layers,
  List,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import { CalendarType, EventCategory, RecurrenceRule } from "../../types";
import type { CalendarDef, Event, EventInput } from "../../types";

// ---- Constants ----
const DAYS_OF_WEEK_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_OF_WEEK_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

type ViewMode = "month" | "week" | "day" | "agenda";

// ---- Category colors ----
const CATEGORY_STYLES: Record<
  string,
  { bg: string; border: string; text: string; dot: string }
> = {
  [EventCategory.meeting]: {
    bg: "bg-blue-500/15",
    border: "border-l-blue-500",
    text: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  [EventCategory.deadline]: {
    bg: "bg-red-500/15",
    border: "border-l-red-500",
    text: "text-red-700 dark:text-red-300",
    dot: "bg-red-500",
  },
  [EventCategory.pto]: {
    bg: "bg-green-500/15",
    border: "border-l-green-500",
    text: "text-green-700 dark:text-green-300",
    dot: "bg-green-500",
  },
  [EventCategory.internal]: {
    bg: "bg-purple-500/15",
    border: "border-l-purple-500",
    text: "text-purple-700 dark:text-purple-300",
    dot: "bg-purple-500",
  },
  [EventCategory.external]: {
    bg: "bg-orange-500/15",
    border: "border-l-orange-500",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500",
  },
  [EventCategory.other]: {
    bg: "bg-muted",
    border: "border-l-muted-foreground",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};
const DEADLINE_STYLE = {
  bg: "bg-purple-100/40 dark:bg-purple-900/20",
  border: "border-l-purple-400",
  text: "text-purple-700 dark:text-purple-300",
  dot: "bg-purple-400",
};

function getCategoryStyle(ev: Event) {
  if (ev.isProjectDeadline) return DEADLINE_STYLE;
  return CATEGORY_STYLES[ev.category] ?? CATEGORY_STYLES[EventCategory.other];
}

// ---- Time helpers ----
function formatTime(ts: bigint): string {
  return new Date(Number(ts)).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
function formatTimeTz(ts: bigint): string {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const abbr =
    new Intl.DateTimeFormat("en-US", { timeZoneName: "short", timeZone: tz })
      .formatToParts(new Date(Number(ts)))
      .find((p) => p.type === "timeZoneName")?.value ?? "";
  return `${formatTime(ts)} ${abbr}`;
}
function getDaysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}
function getFirstDow(y: number, m: number) {
  return new Date(y, m, 1).getDay();
}
function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

// ---- Event chip (month/week) ----
interface EventChipProps {
  ev: Event;
  onClick: () => void;
  compact?: boolean;
}
function EventChip({ ev, onClick, compact }: EventChipProps) {
  const s = getCategoryStyle(ev);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "w-full truncate rounded border-l-2 px-1.5 py-0.5 text-left text-xs font-medium transition-colors hover:opacity-80",
        s.bg,
        s.border,
        s.text,
      )}
      data-ocid={`cal-chip-${ev.id}`}
    >
      {!compact && (
        <span className="mr-1 opacity-70">{formatTime(ev.startTime)}</span>
      )}
      {ev.isProjectDeadline && (
        <AlertTriangle className="mr-0.5 inline h-2.5 w-2.5" />
      )}
      {ev.title}
    </button>
  );
}

// ---- Month View ----
interface MonthViewProps {
  events: Event[];
  year: number;
  month: number;
  today: Date;
  onSelectEvent: (ev: Event) => void;
  onDropEvent: (ev: Event, newDate: Date) => void;
}
function MonthView({
  events,
  year,
  month,
  today,
  onSelectEvent,
  onDropEvent,
}: MonthViewProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDow(year, month);
  const trailing = (7 - ((firstDow + daysInMonth) % 7)) % 7;
  const [dragOver, setDragOver] = useState<number | null>(null);
  const dragging = useRef<Event | null>(null);

  const eventsByDay: Record<number, Event[]> = {};
  for (const ev of events) {
    const d = new Date(Number(ev.startTime));
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(ev);
    }
  }

  const isToday = (d: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === d;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="grid grid-cols-7 border-b border-border">
        {DAYS_OF_WEEK_SHORT.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-border">
        {Array.from({ length: firstDow }, (_, i) => {
          const padKey = `${year}-${month}-pad-before-${firstDow - i}`;
          return <div key={padKey} className="h-28 bg-muted/20" />;
        })}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayEvs = eventsByDay[day] ?? [];
          const visible = dayEvs.slice(0, 3);
          const overflow = dayEvs.length - 3;
          return (
            <div
              key={day}
              className={cn(
                "h-28 bg-card p-1.5 transition-colors",
                dragOver === day
                  ? "bg-primary/5 ring-1 ring-inset ring-primary/30"
                  : "hover:bg-muted/20",
              )}
              data-ocid={`cal-day-${day}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(day);
              }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(null);
                if (dragging.current) {
                  const newDate = new Date(year, month, day);
                  onDropEvent(dragging.current, newDate);
                  dragging.current = null;
                }
              }}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                  isToday(day)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground",
                )}
              >
                {day}
              </span>
              <div className="mt-0.5 space-y-0.5">
                {visible.map((ev) => (
                  <div
                    key={ev.id}
                    draggable
                    onDragStart={() => {
                      dragging.current = ev;
                    }}
                    onDragEnd={() => {
                      dragging.current = null;
                    }}
                  >
                    <EventChip
                      ev={ev}
                      compact
                      onClick={() => onSelectEvent(ev)}
                    />
                  </div>
                ))}
                {overflow > 0 && (
                  <span className="block pl-1 text-xs text-muted-foreground">
                    +{overflow} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {Array.from({ length: trailing }).map((_, i) => {
          const padKey = `${year}-${month}-pad-after-${daysInMonth + i + 1}`;
          return <div key={padKey} className="h-28 bg-muted/20" />;
        })}
      </div>
    </div>
  );
}

// ---- Week View ----
interface WeekViewProps {
  events: Event[];
  weekStart: Date;
  today: Date;
  onSelectEvent: (ev: Event) => void;
}
function WeekView({ events, weekStart, today, onSelectEvent }: WeekViewProps) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
  const nowMinutes = today.getHours() * 60 + today.getMinutes();
  const todayStr = today.toDateString();

  function getEventsForDay(date: Date): Event[] {
    return events.filter(
      (ev) =>
        new Date(Number(ev.startTime)).toDateString() === date.toDateString(),
    );
  }
  function topPercent(ts: bigint) {
    const d = new Date(Number(ts));
    return ((d.getHours() * 60 + d.getMinutes()) / (24 * 60)) * 100;
  }
  function heightPercent(start: bigint, end: bigint) {
    return Math.max((Number(end - start) / (24 * 60 * 60 * 1000)) * 100, 1.5);
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Day headers */}
      <div
        className="grid border-b border-border"
        style={{ gridTemplateColumns: "48px repeat(7, 1fr)" }}
      >
        <div className="border-r border-border" />
        {days.map((d) => {
          const isToday = d.toDateString() === todayStr;
          return (
            <div
              key={d.toISOString()}
              className={cn(
                "py-2 text-center border-r border-border last:border-r-0",
                isToday && "bg-primary/5",
              )}
            >
              <p className="text-xs text-muted-foreground uppercase">
                {DAYS_OF_WEEK_SHORT[d.getDay()]}
              </p>
              <p
                className={cn(
                  "text-sm font-semibold mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                  isToday
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground",
                )}
              >
                {d.getDate()}
              </p>
            </div>
          );
        })}
      </div>
      {/* Time grid */}
      <div className="overflow-auto max-h-[600px]">
        <div
          className="relative"
          style={{
            gridTemplateColumns: "48px repeat(7, 1fr)",
            display: "grid",
          }}
        >
          {/* Hour labels */}
          <div className="col-span-1">
            {HOURS.map((h) => (
              <div
                key={h}
                className="h-14 border-b border-border/50 flex items-start justify-end pr-2 pt-1"
              >
                <span className="text-xs text-muted-foreground">
                  {h === 0
                    ? "12am"
                    : h < 12
                      ? `${h}am`
                      : h === 12
                        ? "12pm"
                        : `${h - 12}pm`}
                </span>
              </div>
            ))}
          </div>
          {/* Columns */}
          {days.map((d) => {
            const dayEvs = getEventsForDay(d);
            const isToday = d.toDateString() === todayStr;
            return (
              <div
                key={d.toISOString()}
                className={cn(
                  "relative border-l border-border",
                  isToday && "bg-primary/[0.02]",
                )}
              >
                {HOURS.map((h) => (
                  <div key={h} className="h-14 border-b border-border/30" />
                ))}
                {/* Current time indicator */}
                {isToday && (
                  <div
                    className="absolute left-0 right-0 z-10 pointer-events-none"
                    style={{ top: `${(nowMinutes / (24 * 60)) * 100}%` }}
                  >
                    <div className="relative flex items-center">
                      <div className="h-2 w-2 rounded-full bg-red-500 -ml-1 shrink-0" />
                      <div className="h-px flex-1 bg-red-500" />
                    </div>
                  </div>
                )}
                {/* Events */}
                {dayEvs.map((ev) => {
                  const s = getCategoryStyle(ev);
                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => onSelectEvent(ev)}
                      className={cn(
                        "absolute left-0.5 right-0.5 overflow-hidden rounded border-l-2 px-1 py-0.5 text-left text-xs z-10 hover:opacity-80 transition-opacity",
                        s.bg,
                        s.border,
                        s.text,
                      )}
                      style={{
                        top: `${topPercent(ev.startTime)}%`,
                        height: `${heightPercent(ev.startTime, ev.endTime)}%`,
                        minHeight: "20px",
                      }}
                      data-ocid={`week-event-${ev.id}`}
                    >
                      <span className="font-medium truncate block">
                        {ev.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---- Day View ----
interface DayViewProps {
  events: Event[];
  date: Date;
  today: Date;
  onSelectEvent: (ev: Event) => void;
}
function DayView({ events, date, today, onSelectEvent }: DayViewProps) {
  const nowMinutes = today.getHours() * 60 + today.getMinutes();
  const isToday = date.toDateString() === today.toDateString();
  const dayEvs = events.filter(
    (ev) =>
      new Date(Number(ev.startTime)).toDateString() === date.toDateString(),
  );

  function topPercent(ts: bigint) {
    const d = new Date(Number(ts));
    return ((d.getHours() * 60 + d.getMinutes()) / (24 * 60)) * 100;
  }
  function heightPercent(start: bigint, end: bigint) {
    return Math.max((Number(end - start) / (24 * 60 * 60 * 1000)) * 100, 1.5);
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div
        className={cn(
          "py-3 px-4 border-b border-border text-center",
          isToday && "bg-primary/5",
        )}
      >
        <p className="text-xs text-muted-foreground uppercase">
          {DAYS_OF_WEEK_FULL[date.getDay()]}
        </p>
        <p className="font-display text-2xl font-bold text-foreground">
          {date.getDate()} {MONTH_NAMES[date.getMonth()]} {date.getFullYear()}
        </p>
      </div>
      <div className="overflow-auto max-h-[600px]">
        <div
          className="relative"
          style={{ display: "grid", gridTemplateColumns: "48px 1fr" }}
        >
          <div>
            {HOURS.map((h) => (
              <div
                key={h}
                className="h-14 border-b border-border/50 flex items-start justify-end pr-2 pt-1"
              >
                <span className="text-xs text-muted-foreground">
                  {h === 0
                    ? "12am"
                    : h < 12
                      ? `${h}am`
                      : h === 12
                        ? "12pm"
                        : `${h - 12}pm`}
                </span>
              </div>
            ))}
          </div>
          <div className="relative border-l border-border">
            {HOURS.map((h) => (
              <div key={h} className="h-14 border-b border-border/30" />
            ))}
            {isToday && (
              <div
                className="absolute left-0 right-0 z-10 pointer-events-none"
                style={{ top: `${(nowMinutes / (24 * 60)) * 100}%` }}
              >
                <div className="relative flex items-center">
                  <div className="h-2 w-2 rounded-full bg-red-500 -ml-1 shrink-0" />
                  <div className="h-px flex-1 bg-red-500" />
                </div>
              </div>
            )}
            {dayEvs.map((ev) => {
              const s = getCategoryStyle(ev);
              return (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => onSelectEvent(ev)}
                  className={cn(
                    "absolute left-1 right-1 overflow-hidden rounded border-l-2 px-2 py-0.5 text-left text-xs z-10 hover:opacity-80 transition-opacity",
                    s.bg,
                    s.border,
                    s.text,
                  )}
                  style={{
                    top: `${topPercent(ev.startTime)}%`,
                    height: `${heightPercent(ev.startTime, ev.endTime)}%`,
                    minHeight: "22px",
                  }}
                  data-ocid={`day-event-${ev.id}`}
                >
                  <span className="font-medium">{ev.title}</span>
                  <span className="ml-1 opacity-70">
                    {formatTimeTz(ev.startTime)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Agenda View ----
interface AgendaViewProps {
  events: Event[];
  onSelectEvent: (ev: Event) => void;
}
function AgendaView({ events, onSelectEvent }: AgendaViewProps) {
  const upcoming = [...events]
    .filter((ev) => ev.startTime >= BigInt(Date.now() - 86400000))
    .sort((a, b) => Number(a.startTime - b.startTime));

  const grouped: Record<string, Event[]> = {};
  for (const ev of upcoming) {
    const key = new Date(Number(ev.startTime)).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(ev);
  }
  const groupKeys = Object.keys(grouped);

  if (groupKeys.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center"
        data-ocid="cal-agenda-empty"
      >
        <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
        <h3 className="font-display font-semibold text-foreground">
          No upcoming events
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Your schedule is clear.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groupKeys.map((dateStr) => (
        <div key={dateStr}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {dateStr}
          </h3>
          <div className="space-y-2">
            {grouped[dateStr].map((ev) => {
              const s = getCategoryStyle(ev);
              return (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => onSelectEvent(ev)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left hover:bg-muted/20 transition-colors",
                    "border-l-4",
                    s.border,
                  )}
                  data-ocid={`agenda-event-${ev.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-foreground truncate">
                        {ev.title}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs px-1.5 py-0 shrink-0",
                          s.bg,
                          s.text,
                        )}
                      >
                        {ev.isProjectDeadline ? "deadline" : ev.category}
                      </Badge>
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeTz(ev.startTime)} – {formatTime(ev.endTime)}
                      </span>
                      {ev.attendeeIds.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {ev.attendeeIds.length}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className={cn("h-2.5 w-2.5 shrink-0 rounded-full", s.dot)}
                  />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- Calendar Legend ----
interface CalendarLegendProps {
  calendars: CalendarDef[];
  hidden: Set<string>;
  onToggle: (id: string) => void;
}
function CalendarLegend({ calendars, hidden, onToggle }: CalendarLegendProps) {
  return (
    <div className="space-y-1">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        My Calendars
      </p>
      {calendars.map((cal) => {
        const isHidden = hidden.has(cal.id);
        return (
          <button
            key={cal.id}
            type="button"
            onClick={() => onToggle(cal.id)}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-muted/40 transition-colors"
            data-ocid={`cal-legend-${cal.id}`}
          >
            <span
              className="h-3 w-3 rounded shrink-0"
              style={{ backgroundColor: cal.color || "#6366f1" }}
            />
            <span
              className={cn(
                "flex-1 truncate text-xs font-medium",
                isHidden
                  ? "line-through text-muted-foreground"
                  : "text-foreground",
              )}
            >
              {cal.name}
            </span>
            {isHidden ? (
              <EyeOff className="h-3 w-3 text-muted-foreground shrink-0" />
            ) : (
              <Eye className="h-3 w-3 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---- Main Page ----
export default function CalendarPage() {
  const navigate = useNavigate();
  const { workspaceId } = useParams({ from: "/app/$workspaceId/calendar" });
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();

  const today = new Date();
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  // viewDate: for month → first day of visible month; for week → any day in the visible week;
  // for day → the exact day being viewed
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate()),
  );
  const [hiddenCalendars, setHiddenCalendars] = useState<Set<string>>(
    new Set(),
  );

  // Derived date info
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  // weekStart is always computed from viewDate for consistency across views
  const weekStart = startOfWeek(viewDate);

  // Fetch a wide window so switching views never misses events
  const fromTs = BigInt(new Date(year, month - 1, 1).getTime());
  const toTs = BigInt(new Date(year, month + 2, 0).getTime());

  const { data: allEvents = [], isLoading } = useQuery<Event[]>({
    queryKey: ["events", tenantId, workspaceId, year, month],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEvents(tenantId, workspaceId, fromTs, toTs);
    },
    enabled: !!actor && !isFetching,
  });

  const { data: deadlines = [] } = useQuery<Event[]>({
    queryKey: ["projectDeadlines", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProjectDeadlines(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching,
  });

  const { data: calendars = [] } = useQuery<CalendarDef[]>({
    queryKey: ["calendars", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCalendars(tenantId, workspaceId, null);
    },
    enabled: !!actor && !isFetching,
  });

  // Filter events by visible calendars
  const events = [
    ...allEvents.filter((ev) => !hiddenCalendars.has(ev.calendarId)),
    ...deadlines.filter((ev) => !hiddenCalendars.has(ev.calendarId)),
  ];

  const toggleCalendar = (id: string) => {
    setHiddenCalendars((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Navigation — moves viewDate correctly for every view mode
  const navigateView = (dir: -1 | 1) => {
    setViewDate((prev) => {
      const d = new Date(prev);
      if (viewMode === "month") {
        d.setMonth(d.getMonth() + dir);
        d.setDate(1);
      } else if (viewMode === "week") {
        d.setDate(d.getDate() + dir * 7);
      } else {
        // day and agenda — step one day at a time
        d.setDate(d.getDate() + dir);
      }
      return d;
    });
  };

  // Go-today resets to today's date in every view
  const goToday = () =>
    setViewDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    );

  // Switch view mode and keep viewDate pointing at today's area
  const switchView = (mode: ViewMode) => {
    setViewMode(mode);
    // When switching to month, normalise viewDate to first-of-month
    if (mode === "month") {
      setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), 1));
    }
  };

  const headerLabel = () => {
    if (viewMode === "month") return `${MONTH_NAMES[month]} ${year}`;
    if (viewMode === "week") {
      const end = new Date(weekStart);
      end.setDate(end.getDate() + 6);
      return `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    }
    if (viewMode === "day")
      return viewDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    return "Upcoming";
  };

  // Drag-and-drop reschedule
  const { mutate: reschedule } = useMutation({
    mutationFn: async ({ ev, newDate }: { ev: Event; newDate: Date }) => {
      if (!actor) throw new Error("Not connected");
      const origStart = new Date(Number(ev.startTime));
      const duration = Number(ev.endTime - ev.startTime);
      const newStart = new Date(newDate);
      newStart.setHours(origStart.getHours(), origStart.getMinutes(), 0, 0);
      const newStartTs = BigInt(newStart.getTime());
      const newEndTs = newStartTs + BigInt(duration);
      const input: EventInput = {
        title: ev.title,
        description: ev.description,
        startTime: newStartTs,
        endTime: newEndTs,
        recurrence: ev.recurrence,
        attendeeIds: ev.attendeeIds,
        crossLinks: ev.crossLinks,
        category: ev.category,
        calendarId: ev.calendarId,
        rsvpRequired: ev.rsvpRequired,
        timeZone: ev.timeZone,
      };
      return actor.updateEvent(tenantId, workspaceId, ev.id, input);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["events"] });
        toast.success("Event rescheduled");
      } else {
        toast.error(result.err);
      }
    },
    onError: (err) =>
      toast.error(
        err instanceof Error ? err.message : "Failed to reschedule event",
      ),
  });

  const onSelectEvent = (ev: Event) =>
    navigate({
      to: "/app/$workspaceId/calendar/events/$eventId",
      params: { workspaceId, eventId: ev.id },
    });

  const VIEW_OPTIONS: { id: ViewMode; label: string; icon: React.ReactNode }[] =
    [
      { id: "day", label: "Day", icon: <Calendar className="h-3.5 w-3.5" /> },
      { id: "week", label: "Week", icon: <Layers className="h-3.5 w-3.5" /> },
      {
        id: "month",
        label: "Month",
        icon: <Calendar className="h-3.5 w-3.5" />,
      },
      { id: "agenda", label: "Agenda", icon: <List className="h-3.5 w-3.5" /> },
    ];

  return (
    <div className="flex h-full min-h-screen flex-col bg-background pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border/60 bg-card/90 backdrop-blur-subtle px-4 sm:px-6 py-3 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15">
              <Calendar className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <h1 className="font-display text-base sm:text-lg font-bold text-foreground tracking-tight">
                Calendar
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Schedule and manage events
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none">
            {/* View picker */}
            <div className="flex rounded-lg border border-border/50 bg-muted/40 p-0.5 shrink-0">
              {VIEW_OPTIONS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => switchView(v.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2 sm:px-2.5 py-1.5 text-xs font-medium transition-smooth min-h-[36px]",
                    viewMode === v.id
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  data-ocid={`cal-view-${v.id}`}
                >
                  {v.icon}
                  <span className="hidden sm:inline">{v.label}</span>
                </button>
              ))}
            </div>
            <Link
              to="/app/$workspaceId/calendar/availability"
              params={{ workspaceId }}
            >
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex h-8 text-xs gap-1.5 min-h-[44px]"
                data-ocid="cal-availability-btn"
              >
                <Users className="h-3.5 w-3.5" /> Availability
              </Button>
            </Link>
            <Link
              to="/app/$workspaceId/calendar/settings"
              params={{ workspaceId }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 min-h-[44px] min-w-[44px]"
                aria-label="Calendar settings"
                data-ocid="cal-settings-btn"
              >
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Button
              asChild
              size="sm"
              className="bg-red-500 text-white hover:bg-red-600 active-press gap-1.5 h-9 text-xs shrink-0 min-h-[44px]"
              data-ocid="cal-new-event-btn"
            >
              <Link
                to="/app/$workspaceId/calendar/new"
                params={{ workspaceId }}
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New Event</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-52 xl:w-60 flex-col border-r border-border bg-card/60 p-4 gap-4">
          <CalendarLegend
            calendars={calendars}
            hidden={hiddenCalendars}
            onToggle={toggleCalendar}
          />
          {/* Category legend */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Categories
            </p>
            {[
              { cat: "meeting", label: "Meeting" },
              { cat: "deadline", label: "Deadline" },
              { cat: "pto", label: "PTO" },
              { cat: "internal", label: "Internal" },
              { cat: "external", label: "External" },
              { cat: "other", label: "Other" },
            ].map(({ cat, label }) => {
              const s = CATEGORY_STYLES[cat];
              return (
                <div key={cat} className="flex items-center gap-2 px-2 py-1">
                  <span
                    className={cn("h-2.5 w-2.5 rounded-full shrink-0", s.dot)}
                  />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              );
            })}
            <div className="flex items-center gap-2 px-2 py-1">
              <span className="h-2.5 w-2.5 rounded-full shrink-0 bg-purple-400" />
              <span className="text-xs text-muted-foreground">
                Project Deadline
              </span>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {/* Date navigation */}
          {viewMode !== "agenda" && (
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigateView(-1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth"
                  aria-label="Previous"
                  data-ocid="cal-prev"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <h2 className="font-display text-lg font-bold text-foreground min-w-[200px] text-center">
                  {headerLabel()}
                </h2>
                <button
                  type="button"
                  onClick={() => navigateView(1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth"
                  aria-label="Next"
                  data-ocid="cal-next"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={goToday}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth"
                data-ocid="cal-today-btn"
              >
                Today
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              {viewMode === "month" && (
                <MonthView
                  events={events}
                  year={year}
                  month={month}
                  today={today}
                  onSelectEvent={onSelectEvent}
                  onDropEvent={(ev, newDate) => reschedule({ ev, newDate })}
                />
              )}
              {viewMode === "week" && (
                <WeekView
                  events={events}
                  weekStart={weekStart}
                  today={today}
                  onSelectEvent={onSelectEvent}
                />
              )}
              {viewMode === "day" && (
                <DayView
                  events={events}
                  date={viewDate}
                  today={today}
                  onSelectEvent={onSelectEvent}
                />
              )}
              {viewMode === "agenda" && (
                <AgendaView events={events} onSelectEvent={onSelectEvent} />
              )}
            </>
          )}

          {/* Project Deadlines strip */}
          {deadlines.length > 0 && viewMode === "month" && (
            <div className="mt-4 rounded-xl border border-purple-200/50 dark:border-purple-800/30 bg-purple-50/30 dark:bg-purple-900/10 p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-purple-500" />
                <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                  Project Deadlines
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {deadlines.slice(0, 6).map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => onSelectEvent(ev)}
                    className="flex items-center gap-1.5 rounded-lg bg-purple-100/60 dark:bg-purple-900/30 px-2.5 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-200/60 transition-colors"
                    data-ocid={`deadline-chip-${ev.id}`}
                  >
                    <AlertTriangle className="h-3 w-3" />
                    {ev.title}
                    <span className="opacity-70">
                      {new Date(Number(ev.startTime)).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" },
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
