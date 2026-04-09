import { d as useNavigate, m as useParams, g as getTenantId, r as reactExports, j as jsxRuntimeExports, B as Button, X, z as cn } from "./index-1XRv9GHr.js";
import { I as Input } from "./input-BOIU-9S_.js";
import { L as Label } from "./label-cy3JJ-Xo.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { u as useMutation } from "./useMutation-X94w2CVk.js";
import { u as ue } from "./index-BOWFyaIB.js";
import { u as useBackend } from "./useBackend-DyFxq-Jw.js";
import { A as ArrowLeft } from "./arrow-left-B-gbON0E.js";
import { U as Users } from "./users-BwTeKVE_.js";
import { S as Search } from "./search-CWnD_rod.js";
import { C as Calendar } from "./calendar-AxllVY2A.js";
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8);
function formatHour(h) {
  if (h === 12) return "12pm";
  if (h < 12) return `${h}am`;
  return `${h - 12}pm`;
}
function isBusy(slot, hour) {
  const hStr = `${hour.toString().padStart(2, "0")}:00`;
  const hEnd = `${(hour + 1).toString().padStart(2, "0")}:00`;
  return slot.busyPeriods.some(([start, end]) => {
    return start < hEnd && end > hStr;
  });
}
function getBrowserTz() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function AvailabilityPage() {
  const navigate = useNavigate();
  const { workspaceId } = useParams({
    from: "/app/$workspaceId/calendar/availability"
  });
  const { actor } = useBackend();
  const tenantId = getTenantId();
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const [date, setDate] = reactExports.useState(today);
  const [memberInput, setMemberInput] = reactExports.useState("");
  const [memberList, setMemberList] = reactExports.useState([]);
  const [timezone] = reactExports.useState(getBrowserTz());
  const [slots, setSlots] = reactExports.useState([]);
  const [hasSearched, setHasSearched] = reactExports.useState(false);
  const addMember = () => {
    const trimmed = memberInput.trim();
    if (!trimmed) return;
    if (memberList.includes(trimmed)) {
      ue.info("This member is already added");
      return;
    }
    setMemberList((prev) => [...prev, trimmed]);
    setMemberInput("");
  };
  const removeMember = (id) => {
    setMemberList((prev) => prev.filter((m) => m !== id));
    setSlots([]);
    setHasSearched(false);
  };
  const { mutate: checkAvailability, isPending } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected to backend");
      if (memberList.length === 0)
        throw new Error("Add at least one team member");
      if (!date) throw new Error("Please select a date");
      return actor.getAvailability(
        tenantId,
        workspaceId,
        memberList,
        date,
        timezone
      );
    },
    onSuccess: (data) => {
      setSlots(data);
      setHasSearched(true);
      if (data.length === 0) {
        ue.info("No availability data found for the selected members.");
      }
    },
    onError: (err) => {
      ue.error(
        err instanceof Error ? err.message : "Failed to check availability"
      );
    }
  });
  const bestHours = HOURS.filter(
    (h) => slots.length > 0 && slots.every((s) => !isBusy(s, h))
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background animate-fade-in-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 border-b border-border/60 bg-card/90 backdrop-blur-subtle px-6 py-3.5 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-3xl items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-8 w-8",
          onClick: () => navigate({
            to: "/app/$workspaceId/calendar",
            params: { workspaceId }
          }),
          "aria-label": "Back to Calendar",
          "data-ocid": "availability-back",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5 text-blue-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-bold text-foreground tracking-tight", children: "Team Availability" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Find the best meeting time" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-6 py-8 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "av-date", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "av-date",
              type: "date",
              value: date,
              min: today,
              onChange: (e) => {
                setDate(e.target.value);
                setSlots([]);
                setHasSearched(false);
              },
              "data-ocid": "availability-date"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Team Members" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Enter principal ID or username…",
                value: memberInput,
                onChange: (e) => setMemberInput(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addMember();
                  }
                },
                "data-ocid": "availability-member-input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: addMember,
                type: "button",
                "data-ocid": "availability-add-member",
                disabled: !memberInput.trim(),
                children: "Add"
              }
            )
          ] }),
          memberList.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 pt-1", children: memberList.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[120px]", children: m }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => removeMember(m),
                    className: "text-muted-foreground hover:text-foreground transition-colors ml-0.5",
                    "aria-label": `Remove ${m}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
                  }
                )
              ]
            },
            m
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-3", children: [
            "Time zone:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: timezone.replace(/_/g, " ") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => checkAvailability(),
              disabled: isPending || memberList.length === 0 || !date,
              className: "w-full sm:w-auto",
              "data-ocid": "availability-check-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "mr-2 h-4 w-4" }),
                isPending ? "Checking…" : "Check Availability"
              ]
            }
          )
        ] })
      ] }),
      isPending && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded-lg" }, n)) }),
      !isPending && slots.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        bestHours.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-green-200/50 dark:border-green-800/30 bg-green-50/40 dark:bg-green-900/10 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-green-600 dark:text-green-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-green-700 dark:text-green-300", children: "Best Times (Everyone Available)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: bestHours.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "rounded-lg bg-green-100/80 dark:bg-green-900/30 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-300",
              children: [
                formatHour(h),
                " – ",
                formatHour(h + 1)
              ]
            },
            h
          )) })
        ] }),
        bestHours.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-orange-200/50 dark:border-orange-800/30 bg-orange-50/40 dark:bg-orange-900/10 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-orange-700 dark:text-orange-300", children: "No common free slots found in the 8am–6pm window. Consider widening the search or checking a different date." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 text-left text-xs font-semibold text-muted-foreground w-16", children: "Time" }),
            slots.map((slot) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "th",
              {
                className: "py-2 px-2 text-center text-xs font-semibold text-foreground min-w-[100px] truncate max-w-[120px]",
                title: slot.userId.toString(),
                children: [
                  slot.userId.toString().slice(0, 8),
                  "…"
                ]
              },
              slot.userId.toString()
            ))
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: HOURS.map((h) => {
            const allFree = slots.every((s) => !isBusy(s, h));
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: cn(
                  "border-b border-border/50 last:border-0",
                  allFree && "bg-green-50/20 dark:bg-green-900/5"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3 text-xs font-medium text-muted-foreground whitespace-nowrap", children: formatHour(h) }),
                  slots.map((slot) => {
                    const busy = isBusy(slot, h);
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        className: "py-1 px-2 text-center",
                        "data-ocid": `av-cell-${h}-${slot.userId.toString().slice(0, 6)}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: cn(
                              "mx-auto h-7 w-full rounded text-xs font-medium flex items-center justify-center",
                              busy ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            ),
                            children: busy ? "Busy" : "Free"
                          }
                        )
                      },
                      slot.userId.toString()
                    );
                  })
                ]
              },
              h
            );
          }) })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 px-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-3 rounded bg-green-200 dark:bg-green-800" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Available" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-3 rounded bg-red-200 dark:bg-red-800" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Busy" })
          ] })
        ] })
      ] }),
      !isPending && hasSearched && slots.length === 0 && memberList.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-12 text-center",
          "data-ocid": "availability-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10 text-muted-foreground mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No availability data found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "These members may not have any events on this date." })
          ]
        }
      ),
      !isPending && !hasSearched && memberList.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-14 text-center",
          "data-ocid": "availability-no-members",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-7 w-7 text-blue-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "Add team members to get started" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground max-w-xs", children: `Enter principal IDs or usernames above, then click "Check Availability" to see who's free.` })
          ]
        }
      ),
      !isPending && !hasSearched && memberList.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-12 text-center",
          "data-ocid": "availability-ready",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-10 w-10 text-muted-foreground mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Ready to check" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: 'Click "Check Availability" to see the schedule grid.' })
          ]
        }
      )
    ] })
  ] });
}
export {
  AvailabilityPage as default
};
