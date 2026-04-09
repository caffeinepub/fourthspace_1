import { d as useNavigate, m as useParams, g as getTenantId, n as useQueryClient, r as reactExports, h as useQuery, j as jsxRuntimeExports, x as cn, i as Link, B as Button, y as Settings, P as Plus, z as ChevronLeft, E as EventCategory } from "./index-CQ7TXF2a.js";
import { B as Badge } from "./badge-DOwzzuc_.js";
import { S as Skeleton } from "./skeleton-CzZABium.js";
import { u as useMutation } from "./useMutation-fGi-GboX.js";
import { u as ue } from "./index-BGFcG_k-.js";
import { u as useBackend } from "./index--h8TKSCt.js";
import { C as Calendar } from "./calendar-BUBDkMEv.js";
import { U as Users } from "./users-Dh_2Am6J.js";
import { C as ChevronRight } from "./chevron-right-XUDdRA1-.js";
import { T as TriangleAlert } from "./triangle-alert-BbQlAF2-.js";
import { L as Layers } from "./layers-bBrlstaN.js";
import { L as List } from "./list-k-lHThjo.js";
import { E as EyeOff } from "./eye-off-B1oDUMfW.js";
import { E as Eye } from "./eye-BW24WLxb.js";
import { C as Clock } from "./clock-c3PUUUEP.js";
const DAYS_OF_WEEK_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_OF_WEEK_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
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
  "December"
];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const CATEGORY_STYLES = {
  [EventCategory.meeting]: {
    bg: "bg-blue-500/15",
    border: "border-l-blue-500",
    text: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500"
  },
  [EventCategory.deadline]: {
    bg: "bg-red-500/15",
    border: "border-l-red-500",
    text: "text-red-700 dark:text-red-300",
    dot: "bg-red-500"
  },
  [EventCategory.pto]: {
    bg: "bg-green-500/15",
    border: "border-l-green-500",
    text: "text-green-700 dark:text-green-300",
    dot: "bg-green-500"
  },
  [EventCategory.internal]: {
    bg: "bg-purple-500/15",
    border: "border-l-purple-500",
    text: "text-purple-700 dark:text-purple-300",
    dot: "bg-purple-500"
  },
  [EventCategory.external]: {
    bg: "bg-orange-500/15",
    border: "border-l-orange-500",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500"
  },
  [EventCategory.other]: {
    bg: "bg-muted",
    border: "border-l-muted-foreground",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground"
  }
};
const DEADLINE_STYLE = {
  bg: "bg-purple-100/40 dark:bg-purple-900/20",
  border: "border-l-purple-400",
  text: "text-purple-700 dark:text-purple-300",
  dot: "bg-purple-400"
};
function getCategoryStyle(ev) {
  if (ev.isProjectDeadline) return DEADLINE_STYLE;
  return CATEGORY_STYLES[ev.category] ?? CATEGORY_STYLES[EventCategory.other];
}
function formatTime(ts) {
  return new Date(Number(ts)).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}
function formatTimeTz(ts) {
  var _a;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const abbr = ((_a = new Intl.DateTimeFormat("en-US", { timeZoneName: "short", timeZone: tz }).formatToParts(new Date(Number(ts))).find((p) => p.type === "timeZoneName")) == null ? void 0 : _a.value) ?? "";
  return `${formatTime(ts)} ${abbr}`;
}
function getDaysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}
function getFirstDow(y, m) {
  return new Date(y, m, 1).getDay();
}
function startOfWeek(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}
function EventChip({ ev, onClick, compact }) {
  const s = getCategoryStyle(ev);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: (e) => {
        e.stopPropagation();
        onClick();
      },
      className: cn(
        "w-full truncate rounded border-l-2 px-1.5 py-0.5 text-left text-xs font-medium transition-colors hover:opacity-80",
        s.bg,
        s.border,
        s.text
      ),
      "data-ocid": `cal-chip-${ev.id}`,
      children: [
        !compact && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1 opacity-70", children: formatTime(ev.startTime) }),
        ev.isProjectDeadline && /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mr-0.5 inline h-2.5 w-2.5" }),
        ev.title
      ]
    }
  );
}
function MonthView({
  events,
  year,
  month,
  today,
  onSelectEvent,
  onDropEvent
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDow(year, month);
  const trailing = (7 - (firstDow + daysInMonth) % 7) % 7;
  const [dragOver, setDragOver] = reactExports.useState(null);
  const dragging = reactExports.useRef(null);
  const eventsByDay = {};
  for (const ev of events) {
    const d = new Date(Number(ev.startTime));
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(ev);
    }
  }
  const isToday = (d) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 border-b border-border", children: DAYS_OF_WEEK_SHORT.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground",
        children: d
      },
      d
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7 gap-px bg-border", children: [
      Array.from({ length: firstDow }, (_, i) => {
        const padKey = `${year}-${month}-pad-before-${firstDow - i}`;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-28 bg-muted/20" }, padKey);
      }),
      Array.from({ length: daysInMonth }).map((_, i) => {
        const day = i + 1;
        const dayEvs = eventsByDay[day] ?? [];
        const visible = dayEvs.slice(0, 3);
        const overflow = dayEvs.length - 3;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "h-28 bg-card p-1.5 transition-colors",
              dragOver === day ? "bg-primary/5 ring-1 ring-inset ring-primary/30" : "hover:bg-muted/20"
            ),
            "data-ocid": `cal-day-${day}`,
            onDragOver: (e) => {
              e.preventDefault();
              setDragOver(day);
            },
            onDragLeave: () => setDragOver(null),
            onDrop: (e) => {
              e.preventDefault();
              setDragOver(null);
              if (dragging.current) {
                const newDate = new Date(year, month, day);
                onDropEvent(dragging.current, newDate);
                dragging.current = null;
              }
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                    isToday(day) ? "bg-primary text-primary-foreground" : "text-foreground"
                  ),
                  children: day
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 space-y-0.5", children: [
                visible.map((ev) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    draggable: true,
                    onDragStart: () => {
                      dragging.current = ev;
                    },
                    onDragEnd: () => {
                      dragging.current = null;
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      EventChip,
                      {
                        ev,
                        compact: true,
                        onClick: () => onSelectEvent(ev)
                      }
                    )
                  },
                  ev.id
                )),
                overflow > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block pl-1 text-xs text-muted-foreground", children: [
                  "+",
                  overflow,
                  " more"
                ] })
              ] })
            ]
          },
          day
        );
      }),
      Array.from({ length: trailing }).map((_, i) => {
        const padKey = `${year}-${month}-pad-after-${daysInMonth + i + 1}`;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-28 bg-muted/20" }, padKey);
      })
    ] })
  ] });
}
function WeekView({ events, weekStart, today, onSelectEvent }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
  const nowMinutes = today.getHours() * 60 + today.getMinutes();
  const todayStr = today.toDateString();
  function getEventsForDay(date) {
    return events.filter(
      (ev) => new Date(Number(ev.startTime)).toDateString() === date.toDateString()
    );
  }
  function topPercent(ts) {
    const d = new Date(Number(ts));
    return (d.getHours() * 60 + d.getMinutes()) / (24 * 60) * 100;
  }
  function heightPercent(start, end) {
    return Math.max(Number(end - start) / (24 * 60 * 60 * 1e3) * 100, 1.5);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid border-b border-border",
        style: { gridTemplateColumns: "48px repeat(7, 1fr)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-r border-border" }),
          days.map((d) => {
            const isToday = d.toDateString() === todayStr;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: cn(
                  "py-2 text-center border-r border-border last:border-r-0",
                  isToday && "bg-primary/5"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase", children: DAYS_OF_WEEK_SHORT[d.getDay()] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: cn(
                        "text-sm font-semibold mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                        isToday ? "bg-primary text-primary-foreground" : "text-foreground"
                      ),
                      children: d.getDate()
                    }
                  )
                ]
              },
              d.toISOString()
            );
          })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto max-h-[600px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative",
        style: {
          gridTemplateColumns: "48px repeat(7, 1fr)",
          display: "grid"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1", children: HOURS.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-14 border-b border-border/50 flex items-start justify-end pr-2 pt-1",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: h === 0 ? "12am" : h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm` })
            },
            h
          )) }),
          days.map((d) => {
            const dayEvs = getEventsForDay(d);
            const isToday = d.toDateString() === todayStr;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: cn(
                  "relative border-l border-border",
                  isToday && "bg-primary/[0.02]"
                ),
                children: [
                  HOURS.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 border-b border-border/30" }, h)),
                  isToday && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "absolute left-0 right-0 z-10 pointer-events-none",
                      style: { top: `${nowMinutes / (24 * 60) * 100}%` },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-red-500 -ml-1 shrink-0" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-red-500" })
                      ] })
                    }
                  ),
                  dayEvs.map((ev) => {
                    const s = getCategoryStyle(ev);
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => onSelectEvent(ev),
                        className: cn(
                          "absolute left-0.5 right-0.5 overflow-hidden rounded border-l-2 px-1 py-0.5 text-left text-xs z-10 hover:opacity-80 transition-opacity",
                          s.bg,
                          s.border,
                          s.text
                        ),
                        style: {
                          top: `${topPercent(ev.startTime)}%`,
                          height: `${heightPercent(ev.startTime, ev.endTime)}%`,
                          minHeight: "20px"
                        },
                        "data-ocid": `week-event-${ev.id}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium truncate block", children: ev.title })
                      },
                      ev.id
                    );
                  })
                ]
              },
              d.toISOString()
            );
          })
        ]
      }
    ) })
  ] });
}
function DayView({ events, date, today, onSelectEvent }) {
  const nowMinutes = today.getHours() * 60 + today.getMinutes();
  const isToday = date.toDateString() === today.toDateString();
  const dayEvs = events.filter(
    (ev) => new Date(Number(ev.startTime)).toDateString() === date.toDateString()
  );
  function topPercent(ts) {
    const d = new Date(Number(ts));
    return (d.getHours() * 60 + d.getMinutes()) / (24 * 60) * 100;
  }
  function heightPercent(start, end) {
    return Math.max(Number(end - start) / (24 * 60 * 60 * 1e3) * 100, 1.5);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "py-3 px-4 border-b border-border text-center",
          isToday && "bg-primary/5"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase", children: DAYS_OF_WEEK_FULL[date.getDay()] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-2xl font-bold text-foreground", children: [
            date.getDate(),
            " ",
            MONTH_NAMES[date.getMonth()],
            " ",
            date.getFullYear()
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto max-h-[600px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative",
        style: { display: "grid", gridTemplateColumns: "48px 1fr" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: HOURS.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-14 border-b border-border/50 flex items-start justify-end pr-2 pt-1",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: h === 0 ? "12am" : h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm` })
            },
            h
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative border-l border-border", children: [
            HOURS.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 border-b border-border/30" }, h)),
            isToday && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute left-0 right-0 z-10 pointer-events-none",
                style: { top: `${nowMinutes / (24 * 60) * 100}%` },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-red-500 -ml-1 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-red-500" })
                ] })
              }
            ),
            dayEvs.map((ev) => {
              const s = getCategoryStyle(ev);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => onSelectEvent(ev),
                  className: cn(
                    "absolute left-1 right-1 overflow-hidden rounded border-l-2 px-2 py-0.5 text-left text-xs z-10 hover:opacity-80 transition-opacity",
                    s.bg,
                    s.border,
                    s.text
                  ),
                  style: {
                    top: `${topPercent(ev.startTime)}%`,
                    height: `${heightPercent(ev.startTime, ev.endTime)}%`,
                    minHeight: "22px"
                  },
                  "data-ocid": `day-event-${ev.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: ev.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 opacity-70", children: formatTimeTz(ev.startTime) })
                  ]
                },
                ev.id
              );
            })
          ] })
        ]
      }
    ) })
  ] });
}
function AgendaView({ events, onSelectEvent }) {
  const upcoming = [...events].filter((ev) => ev.startTime >= BigInt(Date.now() - 864e5)).sort((a, b) => Number(a.startTime - b.startTime));
  const grouped = {};
  for (const ev of upcoming) {
    const key = new Date(Number(ev.startTime)).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(ev);
  }
  const groupKeys = Object.keys(grouped);
  if (groupKeys.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center",
        "data-ocid": "cal-agenda-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-10 w-10 text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "No upcoming events" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Your schedule is clear." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: groupKeys.map((dateStr) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: dateStr }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: grouped[dateStr].map((ev) => {
      const s = getCategoryStyle(ev);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onSelectEvent(ev),
          className: cn(
            "flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left hover:bg-muted/20 transition-colors",
            "border-l-4",
            s.border
          ),
          "data-ocid": `agenda-event-${ev.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground truncate", children: ev.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "secondary",
                    className: cn(
                      "text-xs px-1.5 py-0 shrink-0",
                      s.bg,
                      s.text
                    ),
                    children: ev.isProjectDeadline ? "deadline" : ev.category
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex items-center gap-3 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                  formatTimeTz(ev.startTime),
                  " – ",
                  formatTime(ev.endTime)
                ] }),
                ev.attendeeIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
                  ev.attendeeIds.length
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn("h-2.5 w-2.5 shrink-0 rounded-full", s.dot)
              }
            )
          ]
        },
        ev.id
      );
    }) })
  ] }, dateStr)) });
}
function CalendarLegend({ calendars, hidden, onToggle }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "My Calendars" }),
    calendars.map((cal) => {
      const isHidden = hidden.has(cal.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onToggle(cal.id),
          className: "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-muted/40 transition-colors",
          "data-ocid": `cal-legend-${cal.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "h-3 w-3 rounded shrink-0",
                style: { backgroundColor: cal.color || "#6366f1" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "flex-1 truncate text-xs font-medium",
                  isHidden ? "line-through text-muted-foreground" : "text-foreground"
                ),
                children: cal.name
              }
            ),
            isHidden ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-3 w-3 text-muted-foreground shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3 w-3 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100" })
          ]
        },
        cal.id
      );
    })
  ] });
}
function CalendarPage() {
  const navigate = useNavigate();
  const { workspaceId } = useParams({ from: "/app/$workspaceId/calendar" });
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();
  const today = /* @__PURE__ */ new Date();
  const [viewMode, setViewMode] = reactExports.useState("month");
  const [viewDate, setViewDate] = reactExports.useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [hiddenCalendars, setHiddenCalendars] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const weekStart = startOfWeek(viewDate);
  const fromTs = BigInt(new Date(year, month - 1, 1).getTime());
  const toTs = BigInt(new Date(year, month + 2, 0).getTime());
  const { data: allEvents = [], isLoading } = useQuery({
    queryKey: ["events", tenantId, workspaceId, year, month],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEvents(tenantId, workspaceId, fromTs, toTs);
    },
    enabled: !!actor && !isFetching
  });
  const { data: deadlines = [] } = useQuery({
    queryKey: ["projectDeadlines", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProjectDeadlines(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching
  });
  const { data: calendars = [] } = useQuery({
    queryKey: ["calendars", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCalendars(tenantId, workspaceId, null);
    },
    enabled: !!actor && !isFetching
  });
  const events = [
    ...allEvents.filter((ev) => !hiddenCalendars.has(ev.calendarId)),
    ...deadlines.filter((ev) => !hiddenCalendars.has(ev.calendarId))
  ];
  const toggleCalendar = (id) => {
    setHiddenCalendars((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const navigateView = (dir) => {
    setViewDate((prev) => {
      const d = new Date(prev);
      if (viewMode === "month") {
        d.setMonth(d.getMonth() + dir);
        d.setDate(1);
      } else if (viewMode === "week") {
        d.setDate(d.getDate() + dir * 7);
      } else {
        d.setDate(d.getDate() + dir);
      }
      return d;
    });
  };
  const goToday = () => setViewDate(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const switchView = (mode) => {
    setViewMode(mode);
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
        day: "numeric"
      });
    return "Upcoming";
  };
  const { mutate: reschedule } = useMutation({
    mutationFn: async ({ ev, newDate }) => {
      if (!actor) throw new Error("Not connected");
      const origStart = new Date(Number(ev.startTime));
      const duration = Number(ev.endTime - ev.startTime);
      const newStart = new Date(newDate);
      newStart.setHours(origStart.getHours(), origStart.getMinutes(), 0, 0);
      const newStartTs = BigInt(newStart.getTime());
      const newEndTs = newStartTs + BigInt(duration);
      const input = {
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
        timeZone: ev.timeZone
      };
      return actor.updateEvent(tenantId, workspaceId, ev.id, input);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["events"] });
        ue.success("Event rescheduled");
      } else {
        ue.error(result.err);
      }
    },
    onError: (err) => ue.error(
      err instanceof Error ? err.message : "Failed to reschedule event"
    )
  });
  const onSelectEvent = (ev) => navigate({
    to: "/app/$workspaceId/calendar/events/$eventId",
    params: { workspaceId, eventId: ev.id }
  });
  const VIEW_OPTIONS = [
    { id: "day", label: "Day", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }) },
    { id: "week", label: "Week", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3.5 w-3.5" }) },
    {
      id: "month",
      label: "Month",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" })
    },
    { id: "agenda", label: "Agenda", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "h-3.5 w-3.5" }) }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-screen flex-col bg-background pb-20 md:pb-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 border-b border-border/60 bg-card/90 backdrop-blur-subtle px-4 sm:px-6 py-3 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-red-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-base sm:text-lg font-bold text-foreground tracking-tight", children: "Calendar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground hidden sm:block", children: "Schedule and manage events" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex rounded-lg border border-border/50 bg-muted/40 p-0.5 shrink-0", children: VIEW_OPTIONS.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => switchView(v.id),
            className: cn(
              "flex items-center gap-1.5 rounded-md px-2 sm:px-2.5 py-1.5 text-xs font-medium transition-smooth min-h-[36px]",
              viewMode === v.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            ),
            "data-ocid": `cal-view-${v.id}`,
            children: [
              v.icon,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: v.label })
            ]
          },
          v.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/app/$workspaceId/calendar/availability",
            params: { workspaceId },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "hidden sm:flex h-8 text-xs gap-1.5 min-h-[44px]",
                "data-ocid": "cal-availability-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
                  " Availability"
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/app/$workspaceId/calendar/settings",
            params: { workspaceId },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-9 w-9 min-h-[44px] min-w-[44px]",
                "aria-label": "Calendar settings",
                "data-ocid": "cal-settings-btn",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-3.5 w-3.5" })
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            size: "sm",
            className: "bg-red-500 text-white hover:bg-red-600 active-press gap-1.5 h-9 text-xs shrink-0 min-h-[44px]",
            "data-ocid": "cal-new-event-btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/app/$workspaceId/calendar/new",
                params: { workspaceId },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "New Event" })
                ]
              }
            )
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex lg:w-52 xl:w-60 flex-col border-r border-border bg-card/60 p-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CalendarLegend,
          {
            calendars,
            hidden: hiddenCalendars,
            onToggle: toggleCalendar
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Categories" }),
          [
            { cat: "meeting", label: "Meeting" },
            { cat: "deadline", label: "Deadline" },
            { cat: "pto", label: "PTO" },
            { cat: "internal", label: "Internal" },
            { cat: "external", label: "External" },
            { cat: "other", label: "Other" }
          ].map(({ cat, label }) => {
            const s = CATEGORY_STYLES[cat];
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-2 py-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn("h-2.5 w-2.5 rounded-full shrink-0", s.dot)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: label })
            ] }, cat);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-2 py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 rounded-full shrink-0 bg-purple-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Project Deadline" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto p-4 md:p-6", children: [
        viewMode !== "agenda" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => navigateView(-1),
                className: "flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth",
                "aria-label": "Previous",
                "data-ocid": "cal-prev",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground min-w-[200px] text-center", children: headerLabel() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => navigateView(1),
                className: "flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth",
                "aria-label": "Next",
                "data-ocid": "cal-next",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: goToday,
              className: "flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth",
              "data-ocid": "cal-today-btn",
              children: "Today"
            }
          )
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-xl" }, n)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          viewMode === "month" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            MonthView,
            {
              events,
              year,
              month,
              today,
              onSelectEvent,
              onDropEvent: (ev, newDate) => reschedule({ ev, newDate })
            }
          ),
          viewMode === "week" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            WeekView,
            {
              events,
              weekStart,
              today,
              onSelectEvent
            }
          ),
          viewMode === "day" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            DayView,
            {
              events,
              date: viewDate,
              today,
              onSelectEvent
            }
          ),
          viewMode === "agenda" && /* @__PURE__ */ jsxRuntimeExports.jsx(AgendaView, { events, onSelectEvent })
        ] }),
        deadlines.length > 0 && viewMode === "month" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-xl border border-purple-200/50 dark:border-purple-800/30 bg-purple-50/30 dark:bg-purple-900/10 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-purple-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-purple-700 dark:text-purple-300", children: "Project Deadlines" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: deadlines.slice(0, 6).map((ev) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => onSelectEvent(ev),
              className: "flex items-center gap-1.5 rounded-lg bg-purple-100/60 dark:bg-purple-900/30 px-2.5 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-200/60 transition-colors",
              "data-ocid": `deadline-chip-${ev.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
                ev.title,
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-70", children: new Date(Number(ev.startTime)).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric" }
                ) })
              ]
            },
            ev.id
          )) })
        ] })
      ] })
    ] })
  ] });
}
export {
  CalendarPage as default
};
