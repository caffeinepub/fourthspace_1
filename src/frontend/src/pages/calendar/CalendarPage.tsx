import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Grid3X3,
  List,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import { RecurrenceRule } from "../../types";
import type { Event } from "../../types";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
const RECURRENCE_LABELS: Record<string, string> = {
  [RecurrenceRule.None]: "One-time",
  [RecurrenceRule.Daily]: "Daily",
  [RecurrenceRule.Weekly]: "Weekly",
  [RecurrenceRule.Monthly]: "Monthly",
  [RecurrenceRule.Yearly]: "Yearly",
};

function formatEventTime(ts: bigint): string {
  return new Date(Number(ts)).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

interface DayEventsProps {
  events: Event[];
  onSelect: (event: Event) => void;
}

function DayEvents({ events, onSelect }: DayEventsProps) {
  const visible = events.slice(0, 3);
  return (
    <div className="mt-1 space-y-0.5">
      {visible.map((ev) => (
        <button
          key={ev.id}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(ev);
          }}
          className="w-full truncate rounded px-1 py-0.5 text-left text-xs font-medium bg-red-500/15 text-red-700 dark:text-red-300 hover:bg-red-500/25 transition-smooth"
          data-ocid={`cal-event-chip-${ev.id}`}
        >
          {ev.title}
        </button>
      ))}
      {events.length > 3 && (
        <span className="block text-xs text-muted-foreground pl-1">
          +{events.length - 3} more
        </span>
      )}
    </div>
  );
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMode, setViewMode] = useState<"month" | "list">("month");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const fromTs = BigInt(new Date(viewYear, viewMonth - 1, 1).getTime());
  const toTs = BigInt(new Date(viewYear, viewMonth + 2, 0).getTime());

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["events", tenantId, viewYear, viewMonth],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEvents(tenantId, fromTs, toTs);
    },
    enabled: !!actor && !isFetching,
  });

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
    setSelectedDay(null);
  };
  const goToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDay(today.getDate());
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDow = getFirstDayOfWeek(viewYear, viewMonth);
  const trailingCells = (7 - ((firstDow + daysInMonth) % 7)) % 7;

  const eventsByDay = useMemo(() => {
    const map: Record<number, Event[]> = {};
    for (const ev of events) {
      const d = new Date(Number(ev.startTime));
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(ev);
      }
    }
    return map;
  }, [events, viewYear, viewMonth]);

  const selectedDayEvents = selectedDay ? (eventsByDay[selectedDay] ?? []) : [];

  const upcomingEvents = useMemo(() => {
    const nowTs = BigInt(Date.now());
    return [...events]
      .filter((ev) => ev.startTime >= nowTs)
      .sort((a, b) => Number(a.startTime - b.startTime));
  }, [events]);

  const isToday = (day: number) =>
    viewYear === today.getFullYear() &&
    viewMonth === today.getMonth() &&
    day === today.getDate();

  return (
    <div className="flex h-full min-h-screen flex-col bg-background">
      {/* Page header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card px-6 py-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/15">
              <Calendar className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                Calendar
              </h1>
              <p className="text-xs text-muted-foreground">
                Schedule and manage events
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("month")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-smooth",
                  viewMode === "month"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                data-ocid="cal-view-month"
              >
                <Grid3X3 className="h-3.5 w-3.5" />
                Month
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-smooth",
                  viewMode === "list"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                data-ocid="cal-view-list"
              >
                <List className="h-3.5 w-3.5" />
                List
              </button>
            </div>
            <Button
              asChild
              size="sm"
              className="bg-red-500 text-white hover:bg-red-600"
              data-ocid="cal-new-event-btn"
            >
              <Link to="/app/calendar/new">
                <Plus className="mr-1.5 h-4 w-4" />
                New Event
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Main area */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {/* Month navigation */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevMonth}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth"
                aria-label="Previous month"
                data-ocid="cal-prev-month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h2 className="font-display text-lg font-bold text-foreground min-w-[180px] text-center">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </h2>
              <button
                type="button"
                onClick={nextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth"
                aria-label="Next month"
                data-ocid="cal-next-month"
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
              <RefreshCw className="h-3.5 w-3.5" />
              Today
            </button>
          </div>

          {viewMode === "month" ? (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {/* Day-of-week headers */}
              <div className="grid grid-cols-7 border-b border-border">
                {DAYS_OF_WEEK.map((d) => (
                  <div
                    key={d}
                    className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Grid cells */}
              {isLoading ? (
                <div className="grid grid-cols-7 gap-px bg-border">
                  {[
                    "s1",
                    "s2",
                    "s3",
                    "s4",
                    "s5",
                    "s6",
                    "s7",
                    "s8",
                    "s9",
                    "s10",
                    "s11",
                    "s12",
                    "s13",
                    "s14",
                    "s15",
                    "s16",
                    "s17",
                    "s18",
                    "s19",
                    "s20",
                    "s21",
                    "s22",
                    "s23",
                    "s24",
                    "s25",
                    "s26",
                    "s27",
                    "s28",
                    "s29",
                    "s30",
                    "s31",
                    "s32",
                    "s33",
                    "s34",
                    "s35",
                  ].map((k) => (
                    <Skeleton key={k} className="h-24 rounded-none" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-px bg-border">
                  {Array.from({ length: firstDow }, (_, i) => (
                    <div
                      key={`empty-before-${firstDow - i}`}
                      className="bg-muted/20 h-24 md:h-28"
                    />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dayEvents = eventsByDay[day] ?? [];
                    const isCurrentDay = isToday(day);
                    const isSelected = selectedDay === day;
                    return (
                      <div
                        key={day}
                        className={cn(
                          "h-24 md:h-28 bg-card p-1.5 transition-smooth hover:bg-muted/30",
                          isSelected &&
                            "ring-2 ring-inset ring-red-500/50 bg-red-50/40 dark:bg-red-950/20",
                        )}
                        data-ocid={`cal-day-${day}`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedDay(day === selectedDay ? null : day)
                          }
                          aria-label={`Select ${MONTH_NAMES[viewMonth]} ${day}`}
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-smooth",
                            isCurrentDay
                              ? "bg-red-500 text-white"
                              : "text-foreground hover:bg-muted",
                          )}
                        >
                          {day}
                        </button>
                        <DayEvents
                          events={dayEvents}
                          onSelect={(ev) =>
                            navigate({
                              to: "/app/calendar/$eventId",
                              params: { eventId: ev.id },
                            })
                          }
                        />
                      </div>
                    );
                  })}
                  {Array.from({ length: trailingCells }).map((_, i) => (
                    <div
                      key={`empty-after-${daysInMonth + i + 1}`}
                      className="bg-muted/20 h-24 md:h-28"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* List view */
            <div className="space-y-3">
              {isLoading ? (
                [1, 2, 3, 4].map((n) => (
                  <Skeleton key={n} className="h-20 rounded-xl" />
                ))
              ) : upcomingEvents.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center"
                  data-ocid="cal-empty-list"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                    <Calendar className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground">
                    No upcoming events
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Schedule your first event to get started.
                  </p>
                  <Button
                    asChild
                    className="mt-5 bg-red-500 text-white hover:bg-red-600"
                    size="sm"
                    data-ocid="cal-list-empty-cta"
                  >
                    <Link to="/app/calendar/new">
                      <Plus className="mr-1.5 h-4 w-4" />
                      New Event
                    </Link>
                  </Button>
                </div>
              ) : (
                upcomingEvents.map((ev) => {
                  const d = new Date(Number(ev.startTime));
                  return (
                    <Link
                      key={ev.id}
                      to="/app/calendar/$eventId"
                      params={{ eventId: ev.id }}
                      className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 hover:bg-muted/20 transition-smooth hover:shadow-sm"
                      data-ocid={`cal-list-event-${ev.id}`}
                    >
                      <div className="flex flex-col items-center justify-center rounded-lg bg-red-500/10 px-3 py-2 min-w-[52px] text-center">
                        <span className="text-xs font-semibold uppercase text-red-500">
                          {d.toLocaleDateString("en-US", { month: "short" })}
                        </span>
                        <span className="text-xl font-bold text-foreground leading-none">
                          {d.getDate()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {ev.title}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatEventTime(ev.startTime)} –{" "}
                          {formatEventTime(ev.endTime)}
                        </p>
                        {ev.recurrence !== RecurrenceRule.None && (
                          <Badge variant="secondary" className="mt-1.5 text-xs">
                            {RECURRENCE_LABELS[ev.recurrence]}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Day events side panel */}
        {viewMode === "month" && (
          <div className="lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-border bg-card/60 p-4 md:p-6">
            {selectedDay ? (
              <div>
                <h3 className="font-display font-semibold text-foreground mb-3">
                  {MONTH_NAMES[viewMonth]} {selectedDay}, {viewYear}
                </h3>
                {selectedDayEvents.length === 0 ? (
                  <div
                    className="text-center py-8"
                    data-ocid="cal-day-panel-empty"
                  >
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No events this day
                    </p>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="mt-3 border-red-500/30 text-red-600 hover:bg-red-500/5"
                      data-ocid="cal-day-panel-new"
                    >
                      <Link to="/app/calendar/new">
                        <Plus className="mr-1 h-3.5 w-3.5" />
                        Add event
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedDayEvents.map((ev) => (
                      <Link
                        key={ev.id}
                        to="/app/calendar/$eventId"
                        params={{ eventId: ev.id }}
                        className="block rounded-lg border border-red-200/50 dark:border-red-900/30 bg-red-50/30 dark:bg-red-950/10 p-3 hover:bg-red-50/60 dark:hover:bg-red-950/20 transition-smooth"
                        data-ocid={`cal-day-panel-event-${ev.id}`}
                      >
                        <p className="font-semibold text-sm text-foreground truncate">
                          {ev.title}
                        </p>
                        <p className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatEventTime(ev.startTime)} –{" "}
                          {formatEventTime(ev.endTime)}
                        </p>
                        {ev.recurrence !== RecurrenceRule.None && (
                          <Badge
                            variant="secondary"
                            className="mt-1.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          >
                            {RECURRENCE_LABELS[ev.recurrence]}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center h-full min-h-[200px] text-center"
                data-ocid="cal-day-panel-placeholder"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                  <Calendar className="h-6 w-6 text-red-500" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Select a day
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Click any date to see its events
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
