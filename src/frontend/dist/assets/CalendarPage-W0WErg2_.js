import { g as createLucideIcon, a as useNavigate, h as getTenantId, r as reactExports, e as useQuery, j as jsxRuntimeExports, n as cn, B as Button, f as Link, ai as ChevronLeft, R as RecurrenceRule } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { C as Calendar } from "./calendar-ts51vnwj.js";
import { P as Plus } from "./plus-DNap1HPx.js";
import { C as ChevronRight } from "./chevron-right-DhEmnM__.js";
import { R as RefreshCw } from "./refresh-cw-DkNAkJEv.js";
import { C as Clock } from "./clock-xD41YETq.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M3 15h18", key: "5xshup" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "M15 3v18", key: "14nvp0" }]
];
const Grid3x3 = createLucideIcon("grid-3x3", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 18h.01", key: "1tta3j" }],
  ["path", { d: "M3 6h.01", key: "1rqtza" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 18h13", key: "1lx6n3" }],
  ["path", { d: "M8 6h13", key: "ik3vkj" }]
];
const List = createLucideIcon("list", __iconNode);
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
  "December"
];
const RECURRENCE_LABELS = {
  [RecurrenceRule.None]: "One-time",
  [RecurrenceRule.Daily]: "Daily",
  [RecurrenceRule.Weekly]: "Weekly",
  [RecurrenceRule.Monthly]: "Monthly",
  [RecurrenceRule.Yearly]: "Yearly"
};
function formatEventTime(ts) {
  return new Date(Number(ts)).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}
function DayEvents({ events, onSelect }) {
  const visible = events.slice(0, 3);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 space-y-0.5", children: [
    visible.map((ev) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: (e) => {
          e.stopPropagation();
          onSelect(ev);
        },
        className: "w-full truncate rounded px-1 py-0.5 text-left text-xs font-medium bg-red-500/15 text-red-700 dark:text-red-300 hover:bg-red-500/25 transition-smooth",
        "data-ocid": `cal-event-chip-${ev.id}`,
        children: ev.title
      },
      ev.id
    )),
    events.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block text-xs text-muted-foreground pl-1", children: [
      "+",
      events.length - 3,
      " more"
    ] })
  ] });
}
function CalendarPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const today = /* @__PURE__ */ new Date();
  const [viewMonth, setViewMonth] = reactExports.useState(today.getMonth());
  const [viewYear, setViewYear] = reactExports.useState(today.getFullYear());
  const [viewMode, setViewMode] = reactExports.useState("month");
  const [selectedDay, setSelectedDay] = reactExports.useState(null);
  const fromTs = BigInt(new Date(viewYear, viewMonth - 1, 1).getTime());
  const toTs = BigInt(new Date(viewYear, viewMonth + 2, 0).getTime());
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", tenantId, viewYear, viewMonth],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEvents(tenantId, fromTs, toTs);
    },
    enabled: !!actor && !isFetching
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
  const trailingCells = (7 - (firstDow + daysInMonth) % 7) % 7;
  const eventsByDay = reactExports.useMemo(() => {
    const map = {};
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
  const selectedDayEvents = selectedDay ? eventsByDay[selectedDay] ?? [] : [];
  const upcomingEvents = reactExports.useMemo(() => {
    const nowTs = BigInt(Date.now());
    return [...events].filter((ev) => ev.startTime >= nowTs).sort((a, b) => Number(a.startTime - b.startTime));
  }, [events]);
  const isToday = (day) => viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-screen flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 border-b border-border bg-card px-6 py-4 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5 text-red-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Calendar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Schedule and manage events" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex rounded-lg border border-border bg-muted/40 p-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setViewMode("month"),
              className: cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-smooth",
                viewMode === "month" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              ),
              "data-ocid": "cal-view-month",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { className: "h-3.5 w-3.5" }),
                "Month"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setViewMode("list"),
              className: cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-smooth",
                viewMode === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              ),
              "data-ocid": "cal-view-list",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "h-3.5 w-3.5" }),
                "List"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            size: "sm",
            className: "bg-red-500 text-white hover:bg-red-600",
            "data-ocid": "cal-new-event-btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/calendar/new", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1.5 h-4 w-4" }),
              "New Event"
            ] })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col lg:flex-row overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto p-4 md:p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: prevMonth,
                className: "flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth",
                "aria-label": "Previous month",
                "data-ocid": "cal-prev-month",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-lg font-bold text-foreground min-w-[180px] text-center", children: [
              MONTH_NAMES[viewMonth],
              " ",
              viewYear
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: nextMonth,
                className: "flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth",
                "aria-label": "Next month",
                "data-ocid": "cal-next-month",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: goToday,
              className: "flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth",
              "data-ocid": "cal-today-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
                "Today"
              ]
            }
          )
        ] }),
        viewMode === "month" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 border-b border-border", children: DAYS_OF_WEEK.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide",
              children: d
            },
            d
          )) }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-px bg-border", children: [
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
            "s35"
          ].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-none" }, k)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7 gap-px bg-border", children: [
            Array.from({ length: firstDow }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "bg-muted/20 h-24 md:h-28"
              },
              `empty-before-${firstDow - i}`
            )),
            Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = eventsByDay[day] ?? [];
              const isCurrentDay = isToday(day);
              const isSelected = selectedDay === day;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: cn(
                    "h-24 md:h-28 bg-card p-1.5 transition-smooth hover:bg-muted/30",
                    isSelected && "ring-2 ring-inset ring-red-500/50 bg-red-50/40 dark:bg-red-950/20"
                  ),
                  "data-ocid": `cal-day-${day}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setSelectedDay(day === selectedDay ? null : day),
                        "aria-label": `Select ${MONTH_NAMES[viewMonth]} ${day}`,
                        className: cn(
                          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-smooth",
                          isCurrentDay ? "bg-red-500 text-white" : "text-foreground hover:bg-muted"
                        ),
                        children: day
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      DayEvents,
                      {
                        events: dayEvents,
                        onSelect: (ev) => navigate({
                          to: "/app/calendar/$eventId",
                          params: { eventId: ev.id }
                        })
                      }
                    )
                  ]
                },
                day
              );
            }),
            Array.from({ length: trailingCells }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "bg-muted/20 h-24 md:h-28"
              },
              `empty-after-${daysInMonth + i + 1}`
            ))
          ] })
        ] }) : (
          /* List view */
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: isLoading ? [1, 2, 3, 4].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, n)) : upcomingEvents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center",
              "data-ocid": "cal-empty-list",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-6 w-6 text-red-500" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "No upcoming events" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground", children: "Schedule your first event to get started." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    asChild: true,
                    className: "mt-5 bg-red-500 text-white hover:bg-red-600",
                    size: "sm",
                    "data-ocid": "cal-list-empty-cta",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/calendar/new", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1.5 h-4 w-4" }),
                      "New Event"
                    ] })
                  }
                )
              ]
            }
          ) : upcomingEvents.map((ev) => {
            const d = new Date(Number(ev.startTime));
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/app/calendar/$eventId",
                params: { eventId: ev.id },
                className: "flex items-start gap-4 rounded-xl border border-border bg-card p-4 hover:bg-muted/20 transition-smooth hover:shadow-sm",
                "data-ocid": `cal-list-event-${ev.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-lg bg-red-500/10 px-3 py-2 min-w-[52px] text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase text-red-500", children: d.toLocaleDateString("en-US", { month: "short" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-bold text-foreground leading-none", children: d.getDate() })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate", children: ev.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 flex items-center gap-1 text-xs text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                      formatEventTime(ev.startTime),
                      " –",
                      " ",
                      formatEventTime(ev.endTime)
                    ] }),
                    ev.recurrence !== RecurrenceRule.None && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "mt-1.5 text-xs", children: RECURRENCE_LABELS[ev.recurrence] })
                  ] })
                ]
              },
              ev.id
            );
          }) })
        )
      ] }),
      viewMode === "month" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-border bg-card/60 p-4 md:p-6", children: selectedDay ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-semibold text-foreground mb-3", children: [
          MONTH_NAMES[viewMonth],
          " ",
          selectedDay,
          ", ",
          viewYear
        ] }),
        selectedDayEvents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "text-center py-8",
            "data-ocid": "cal-day-panel-empty",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No events this day" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  asChild: true,
                  size: "sm",
                  variant: "outline",
                  className: "mt-3 border-red-500/30 text-red-600 hover:bg-red-500/5",
                  "data-ocid": "cal-day-panel-new",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/calendar/new", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-3.5 w-3.5" }),
                    "Add event"
                  ] })
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: selectedDayEvents.map((ev) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/app/calendar/$eventId",
            params: { eventId: ev.id },
            className: "block rounded-lg border border-red-200/50 dark:border-red-900/30 bg-red-50/30 dark:bg-red-950/10 p-3 hover:bg-red-50/60 dark:hover:bg-red-950/20 transition-smooth",
            "data-ocid": `cal-day-panel-event-${ev.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: ev.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1 mt-1 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                formatEventTime(ev.startTime),
                " –",
                " ",
                formatEventTime(ev.endTime)
              ] }),
              ev.recurrence !== RecurrenceRule.None && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "mt-1.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
                  children: RECURRENCE_LABELS[ev.recurrence]
                }
              )
            ]
          },
          ev.id
        )) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center h-full min-h-[200px] text-center",
          "data-ocid": "cal-day-panel-placeholder",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-6 w-6 text-red-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Select a day" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Click any date to see its events" })
          ]
        }
      ) })
    ] })
  ] });
}
export {
  CalendarPage as default
};
