import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CrossLinkPicker } from "../../components/CrossLinkPicker";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import { CalendarType, EventCategory, RecurrenceRule } from "../../types";
import type { CalendarDef, CrossLink, EventInput } from "../../types";

// ---- Helpers ----
function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function tsToLocal(ts: bigint): string {
  const d = new Date(Number(ts));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function localToTs(v: string): bigint {
  return BigInt(new Date(v).getTime());
}
function defaultStart(): string {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return tsToLocal(BigInt(d.getTime()));
}
function defaultEnd(start: string): string {
  const d = new Date(start);
  d.setHours(d.getHours() + 1);
  return tsToLocal(BigInt(d.getTime()));
}
function getBrowserTz(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

const CATEGORY_OPTIONS = [
  { value: EventCategory.meeting, label: "Meeting" },
  { value: EventCategory.deadline, label: "Deadline" },
  { value: EventCategory.pto, label: "PTO / Time off" },
  { value: EventCategory.internal, label: "Internal" },
  { value: EventCategory.external, label: "External" },
  { value: EventCategory.other, label: "Other" },
];

const RECURRENCE_OPTIONS = [
  { value: RecurrenceRule.None, label: "No recurrence" },
  { value: RecurrenceRule.Daily, label: "Daily" },
  { value: RecurrenceRule.Weekly, label: "Weekly" },
  { value: RecurrenceRule.Monthly, label: "Monthly" },
  { value: RecurrenceRule.Yearly, label: "Yearly" },
];

const COMMON_TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
];

const CALENDAR_TYPE_LABELS: Record<string, string> = {
  [CalendarType.personal]: "Personal",
  [CalendarType.team]: "Team",
  [CalendarType.project]: "Project",
  [CalendarType.company]: "Company",
};

// ---- Component ----
export default function EventNewPage() {
  const navigate = useNavigate();
  const { workspaceId } = useParams({ from: "/app/$workspaceId/calendar/new" });
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();

  const startDefault = defaultStart();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(startDefault);
  const [endTime, setEndTime] = useState(defaultEnd(startDefault));
  const [category, setCategory] = useState<EventCategory>(
    EventCategory.meeting,
  );
  const [calendarId, setCalendarId] = useState<string>("");
  const [timezone, setTimezone] = useState(getBrowserTz());
  const [rsvpRequired, setRsvpRequired] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceRule>(
    RecurrenceRule.None,
  );
  const [endCondition, setEndCondition] = useState<
    "never" | "onDate" | "after"
  >("never");
  const [endDate, setEndDate] = useState("");
  const [afterN, setAfterN] = useState("10");
  const [crossLinks, setCrossLinks] = useState<CrossLink[]>([]);

  const { data: calendars = [] } = useQuery<CalendarDef[]>({
    queryKey: ["calendars", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listCalendars(tenantId, workspaceId, null);
      return result;
    },
    enabled: !!actor && !isFetching,
    // Pre-select the first calendar once loaded
    select: (data) => {
      if (data.length > 0 && calendarId === "") {
        // schedule state update outside render
        setTimeout(() => setCalendarId(data[0].id), 0);
      }
      return data;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      // Validate dates before submitting
      const start = localToTs(startTime);
      const end = localToTs(endTime);
      if (end <= start) throw new Error("End time must be after start time");
      const input: EventInput = {
        title: title.trim(),
        description: description.trim(),
        startTime: start,
        endTime: end,
        recurrence,
        attendeeIds: [],
        crossLinks,
        category,
        calendarId: calendarId || undefined,
        rsvpRequired,
        timeZone: timezone,
      };
      return actor.createEvent(tenantId, workspaceId, input);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["events"] });
        toast.success("Event created!");
        navigate({
          to: "/app/$workspaceId/calendar/events/$eventId",
          params: { workspaceId, eventId: result.ok.id },
        });
      } else {
        toast.error(result.err);
      }
    },
    onError: (err) =>
      toast.error(
        err instanceof Error ? err.message : "Failed to create event",
      ),
  });

  const isValid =
    title.trim().length > 0 &&
    startTime.length > 0 &&
    endTime.length > 0 &&
    new Date(endTime) > new Date(startTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    mutate();
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in-up">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border/60 bg-card/90 backdrop-blur-subtle px-6 py-3.5 shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              navigate({
                to: "/app/$workspaceId/calendar",
                params: { workspaceId },
              })
            }
            aria-label="Back to Calendar"
            data-ocid="event-new-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/15">
              <Calendar className="h-3.5 w-3.5 text-red-500" />
            </div>
            <h1 className="font-display text-lg font-bold text-foreground tracking-tight">
              New Event
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl px-6 py-6"
        noValidate
      >
        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-5 shadow-card">
          {/* Title */}
          <div className="space-y-1.5">
            <label
              htmlFor="event-title"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block"
            >
              Event Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="event-title"
              placeholder="Give your event a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-ocid="event-title-input"
              className="border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="event-description"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block"
            >
              Description
            </label>
            <Textarea
              id="event-description"
              placeholder="Describe the event..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-ocid="event-description-input"
              className="border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
          </div>

          {/* Calendar + Category */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Calendar
              </span>
              <Select value={calendarId} onValueChange={setCalendarId}>
                <SelectTrigger
                  data-ocid="event-calendar-select"
                  className="border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
                >
                  <SelectValue placeholder="Select calendar" />
                </SelectTrigger>
                <SelectContent>
                  {calendars.length === 0 ? (
                    <SelectItem value="default">Default Calendar</SelectItem>
                  ) : (
                    calendars.map((cal) => (
                      <SelectItem key={cal.id} value={cal.id}>
                        {cal.name} ·{" "}
                        {CALENDAR_TYPE_LABELS[cal.calendarType] ??
                          cal.calendarType}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Category
              </span>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as EventCategory)}
              >
                <SelectTrigger
                  data-ocid="event-category-select"
                  className="border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Start / End */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="event-start"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block"
              >
                Start Date &amp; Time <span className="text-red-500">*</span>
              </label>
              <Input
                id="event-start"
                type="datetime-local"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  // Auto-advance end time if it would become before start
                  if (
                    e.target.value &&
                    new Date(endTime) <= new Date(e.target.value)
                  )
                    setEndTime(defaultEnd(e.target.value));
                }}
                data-ocid="event-start-input"
                className="border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="event-end"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block"
              >
                End Date &amp; Time <span className="text-red-500">*</span>
              </label>
              <Input
                id="event-end"
                type="datetime-local"
                value={endTime}
                min={startTime}
                onChange={(e) => setEndTime(e.target.value)}
                data-ocid="event-end-input"
                className="border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
                required
              />
              {endTime &&
                startTime &&
                new Date(endTime) <= new Date(startTime) && (
                  <p className="text-xs text-red-500 mt-1">
                    End time must be after start time
                  </p>
                )}
            </div>
          </div>

          {/* Timezone */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Time Zone
            </span>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger
                data-ocid="event-timezone-select"
                className="border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from(new Set([getBrowserTz(), ...COMMON_TIMEZONES])).map(
                  (tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz.replace(/_/g, " ")}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Recurrence */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Recurrence
            </span>
            <Select
              value={recurrence}
              onValueChange={(v) => setRecurrence(v as RecurrenceRule)}
            >
              <SelectTrigger
                data-ocid="event-recurrence-select"
                className="border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
              >
                <SelectValue placeholder="No recurrence" />
              </SelectTrigger>
              <SelectContent>
                {RECURRENCE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {recurrence !== RecurrenceRule.None && (
            <div className="rounded-xl bg-muted/30 border border-border/40 p-4 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Ends
              </span>
              <div className="flex flex-col gap-2">
                {(["never", "onDate", "after"] as const).map((cond) => (
                  <label
                    key={cond}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="endCondition"
                      value={cond}
                      checked={endCondition === cond}
                      onChange={() => setEndCondition(cond)}
                      className="accent-primary"
                      data-ocid={`event-end-cond-${cond}`}
                    />
                    <span className="text-sm text-foreground">
                      {cond === "never" && "Never"}
                      {cond === "onDate" && "On date"}
                      {cond === "after" && "After N occurrences"}
                    </span>
                  </label>
                ))}
              </div>
              {endCondition === "onDate" && (
                <Input
                  type="date"
                  value={endDate}
                  min={startTime.slice(0, 10)}
                  onChange={(e) => setEndDate(e.target.value)}
                  data-ocid="event-end-date"
                  className="border-border/60"
                />
              )}
              {endCondition === "after" && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="999"
                    value={afterN}
                    onChange={(e) => setAfterN(e.target.value)}
                    className="w-24 border-border/60"
                    data-ocid="event-after-n"
                  />
                  <span className="text-sm text-muted-foreground">
                    occurrences
                  </span>
                </div>
              )}
            </div>
          )}

          {/* RSVP toggle */}
          <div className="flex items-center justify-between rounded-xl bg-muted/20 border border-border/40 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Require RSVP
              </p>
              <p className="text-xs text-muted-foreground">
                Attendees must respond to this event
              </p>
            </div>
            <Switch
              checked={rsvpRequired}
              onCheckedChange={setRsvpRequired}
              data-ocid="event-rsvp-toggle"
            />
          </div>

          {/* Cross-links */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Cross-Links
            </span>
            <CrossLinkPicker
              tenantId={tenantId}
              value={crossLinks}
              onChange={setCrossLinks}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate({
                to: "/app/$workspaceId/calendar",
                params: { workspaceId },
              })
            }
            data-ocid="event-new-cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isValid || isPending}
            className="bg-red-500 text-white hover:bg-red-600 active-press gap-1.5"
            data-ocid="event-new-save"
          >
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : "Save Event"}
          </Button>
        </div>
      </form>
    </div>
  );
}
