import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Edit2,
  ExternalLink,
  FileText,
  Globe,
  Link2,
  RefreshCw,
  Save,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CrossLinkPicker } from "../../components/CrossLinkPicker";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import {
  EventCategory,
  ExceptionType,
  RecurrenceRule,
  RsvpStatus,
} from "../../types";
import type {
  CrossLink,
  Event,
  EventExceptionInput,
  EventInput,
  EventRsvp,
} from "../../types";

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
function formatDateTime(ts: bigint): string {
  return new Date(Number(ts)).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
function formatDateTimeTz(ts: bigint): string {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const abbr =
    new Intl.DateTimeFormat("en-US", { timeZoneName: "short", timeZone: tz })
      .formatToParts(new Date(Number(ts)))
      .find((p) => p.type === "timeZoneName")?.value ?? "";
  return `${formatDateTime(ts)} (${abbr})`;
}
function formatDuration(start: bigint, end: bigint): string {
  const diffMs = Number(end - start);
  if (diffMs <= 0) return "—";
  const hours = Math.floor(diffMs / 3600000);
  const mins = Math.floor((diffMs % 3600000) / 60000);
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

// ---- Category styling ----
const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  [EventCategory.meeting]: {
    bg: "bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-300",
  },
  [EventCategory.deadline]: {
    bg: "bg-red-500/10",
    text: "text-red-700 dark:text-red-300",
  },
  [EventCategory.pto]: {
    bg: "bg-green-500/10",
    text: "text-green-700 dark:text-green-300",
  },
  [EventCategory.internal]: {
    bg: "bg-purple-500/10",
    text: "text-purple-700 dark:text-purple-300",
  },
  [EventCategory.external]: {
    bg: "bg-orange-500/10",
    text: "text-orange-700 dark:text-orange-300",
  },
  [EventCategory.other]: { bg: "bg-muted", text: "text-muted-foreground" },
};

const RSVP_STYLES: Record<string, { bg: string; text: string; label: string }> =
  {
    [RsvpStatus.accepted]: {
      bg: "bg-green-500/10",
      text: "text-green-700 dark:text-green-300",
      label: "Accepted",
    },
    [RsvpStatus.declined]: {
      bg: "bg-red-500/10",
      text: "text-red-700 dark:text-red-300",
      label: "Declined",
    },
    [RsvpStatus.tentative]: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-700 dark:text-yellow-300",
      label: "Tentative",
    },
    [RsvpStatus.noResponse]: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      label: "No response",
    },
  };

const RECURRENCE_OPTIONS = [
  { value: RecurrenceRule.None, label: "No recurrence" },
  { value: RecurrenceRule.Daily, label: "Daily" },
  { value: RecurrenceRule.Weekly, label: "Weekly" },
  { value: RecurrenceRule.Monthly, label: "Monthly" },
  { value: RecurrenceRule.Yearly, label: "Yearly" },
];
const RECURRENCE_LABELS: Record<string, string> = {
  [RecurrenceRule.None]: "One-time",
  [RecurrenceRule.Daily]: "Daily",
  [RecurrenceRule.Weekly]: "Weekly",
  [RecurrenceRule.Monthly]: "Monthly",
  [RecurrenceRule.Yearly]: "Yearly",
};

// ---- Component ----
export default function EventDetailPage() {
  const navigate = useNavigate();
  const { workspaceId, eventId } = useParams({
    from: "/app/$workspaceId/calendar/events/$eventId",
  });
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editRecurrence, setEditRecurrence] = useState<RecurrenceRule>(
    RecurrenceRule.None,
  );
  const [editCrossLinks, setEditCrossLinks] = useState<CrossLink[]>([]);

  // Load event — wait for actor to be ready
  const { data: event, isLoading } = useQuery<Event | null>({
    queryKey: ["event", tenantId, workspaceId, eventId],
    queryFn: async () => {
      if (!actor) return null;
      const res = await actor.getEvent(tenantId, workspaceId, eventId);
      if (res.__kind__ === "ok") return res.ok;
      throw new Error(res.err);
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });

  // Load RSVPs
  const { data: rsvps = [] } = useQuery<EventRsvp[]>({
    queryKey: ["eventRsvps", tenantId, workspaceId, eventId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEventRsvps(tenantId, workspaceId, eventId);
    },
    enabled: !!actor && !isFetching && !!event,
  });

  function startEditMode(ev: Event) {
    setEditTitle(ev.title);
    setEditDescription(ev.description);
    setEditStartTime(tsToLocal(ev.startTime));
    setEditEndTime(tsToLocal(ev.endTime));
    setEditRecurrence(ev.recurrence);
    setEditCrossLinks(ev.crossLinks);
    setIsEditing(true);
  }

  const { mutate: updateEvent, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      if (!actor || !event) throw new Error("Not connected");
      const start = localToTs(editStartTime);
      const end = localToTs(editEndTime);
      if (end <= start) throw new Error("End time must be after start time");
      const input: EventInput = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        startTime: start,
        endTime: end,
        recurrence: editRecurrence,
        attendeeIds: event.attendeeIds,
        crossLinks: editCrossLinks,
        category: event.category,
        calendarId: event.calendarId,
        rsvpRequired: event.rsvpRequired,
        timeZone: event.timeZone,
      };
      return actor.updateEvent(tenantId, workspaceId, eventId, input);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({
          queryKey: ["event", tenantId, workspaceId, eventId],
        });
        queryClient.invalidateQueries({ queryKey: ["events"] });
        toast.success("Event updated!");
        setIsEditing(false);
      } else {
        toast.error(result.err);
      }
    },
    onError: (err) =>
      toast.error(
        err instanceof Error ? err.message : "Failed to update event",
      ),
  });

  const { mutate: deleteEvent, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteEvent(tenantId, workspaceId, eventId);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["events"] });
        toast.success("Event deleted");
        navigate({
          to: "/app/$workspaceId/calendar",
          params: { workspaceId },
        });
      } else {
        toast.error(result.err);
      }
    },
    onError: (err) =>
      toast.error(
        err instanceof Error ? err.message : "Failed to delete event",
      ),
  });

  const { mutate: respondToEvent, isPending: isResponding } = useMutation({
    mutationFn: async (status: RsvpStatus) => {
      if (!actor) throw new Error("Not connected");
      return actor.respondToEvent(tenantId, workspaceId, { eventId, status });
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({
          queryKey: ["eventRsvps", tenantId, workspaceId, eventId],
        });
        toast.success("Response recorded");
      } else {
        toast.error(result.err);
      }
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Failed to respond"),
  });

  const { mutate: createException, isPending: isCreatingException } =
    useMutation({
      mutationFn: async () => {
        if (!actor || !event) throw new Error("Not connected");
        const input: EventExceptionInput = {
          eventId,
          originalDate: new Date(Number(event.startTime))
            .toISOString()
            .slice(0, 10),
          exceptionType: ExceptionType.modified,
          overrideData: {
            title: event.title,
            description: event.description,
            startTime: event.startTime,
            endTime: event.endTime,
            recurrence: RecurrenceRule.None,
            attendeeIds: event.attendeeIds,
            crossLinks: event.crossLinks,
            category: event.category,
            calendarId: event.calendarId,
            rsvpRequired: event.rsvpRequired,
            timeZone: event.timeZone,
          },
        };
        return actor.createEventException(tenantId, workspaceId, input);
      },
      onSuccess: (result) => {
        if (result.__kind__ === "ok") {
          toast.success(
            "Exception created — you can now edit this occurrence.",
          );
        } else {
          toast.error(result.err);
        }
      },
      onError: (err) =>
        toast.error(
          err instanceof Error ? err.message : "Failed to create exception",
        ),
    });

  const isEditValid =
    editTitle.trim().length > 0 &&
    editStartTime.length > 0 &&
    editEndTime.length > 0 &&
    new Date(editEndTime) > new Date(editStartTime);

  const catStyle = event
    ? (CATEGORY_STYLES[event.category] ?? CATEGORY_STYLES[EventCategory.other])
    : CATEGORY_STYLES[EventCategory.other];

  return (
    <div className="min-h-screen bg-background animate-fade-in-up">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border/60 bg-card/90 backdrop-blur-subtle px-6 py-3.5 shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                isEditing
                  ? setIsEditing(false)
                  : navigate({
                      to: "/app/$workspaceId/calendar",
                      params: { workspaceId },
                    })
              }
              aria-label={isEditing ? "Cancel edit" : "Back"}
              data-ocid="event-detail-back"
            >
              {isEditing ? (
                <X className="h-4 w-4" />
              ) : (
                <ArrowLeft className="h-4 w-4" />
              )}
            </Button>
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/15">
                <Calendar className="h-3.5 w-3.5 text-red-500" />
              </div>
              {isLoading ? (
                <Skeleton className="h-5 w-48" />
              ) : (
                <h1 className="font-display text-lg font-bold text-foreground truncate tracking-tight">
                  {isEditing ? "Edit Event" : (event?.title ?? "Event")}
                </h1>
              )}
            </div>
          </div>
          {!isEditing && event && (
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => startEditMode(event)}
                data-ocid="event-edit-btn"
              >
                <Edit2 className="h-3 w-3" /> Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/5 gap-1.5"
                    data-ocid="event-delete-btn"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this event?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-ocid="event-delete-cancel">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteEvent()}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      data-ocid="event-delete-confirm"
                    >
                      {isDeleting ? "Deleting..." : "Delete event"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : !event ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="event-not-found"
          >
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-display font-semibold text-foreground">
              Event not found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This event may have been deleted.
            </p>
            <Button
              variant="outline"
              className="mt-5"
              onClick={() =>
                navigate({
                  to: "/app/$workspaceId/calendar",
                  params: { workspaceId },
                })
              }
              data-ocid="event-not-found-back"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Calendar
            </Button>
          </div>
        ) : isEditing ? (
          /* ---- Edit Form ---- */
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="edit-title">
                Event Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
                data-ocid="event-edit-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                rows={4}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                data-ocid="event-edit-description"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-start">
                  Start <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-start"
                  type="datetime-local"
                  value={editStartTime}
                  onChange={(e) => {
                    setEditStartTime(e.target.value);
                    // Auto-advance end if it would be before new start
                    if (
                      e.target.value &&
                      new Date(editEndTime) <= new Date(e.target.value)
                    ) {
                      const d = new Date(e.target.value);
                      d.setHours(d.getHours() + 1);
                      const pad2 = (n: number) => n.toString().padStart(2, "0");
                      setEditEndTime(
                        `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`,
                      );
                    }
                  }}
                  data-ocid="event-edit-start"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end">
                  End <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-end"
                  type="datetime-local"
                  value={editEndTime}
                  min={editStartTime}
                  onChange={(e) => setEditEndTime(e.target.value)}
                  data-ocid="event-edit-end"
                />
                {editEndTime &&
                  editStartTime &&
                  new Date(editEndTime) <= new Date(editStartTime) && (
                    <p className="text-xs text-red-500">
                      End time must be after start time
                    </p>
                  )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Recurrence</Label>
              <Select
                value={editRecurrence}
                onValueChange={(v) => setEditRecurrence(v as RecurrenceRule)}
              >
                <SelectTrigger data-ocid="event-edit-recurrence">
                  <SelectValue />
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
            <div className="space-y-2">
              <Label>Cross-Links</Label>
              <CrossLinkPicker
                tenantId={tenantId}
                value={editCrossLinks}
                onChange={setEditCrossLinks}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                data-ocid="event-edit-cancel"
              >
                Cancel
              </Button>
              <Button
                onClick={() => updateEvent()}
                disabled={!isEditValid || isUpdating}
                className="bg-red-500 text-white hover:bg-red-600"
                data-ocid="event-edit-save"
              >
                <Save className="mr-2 h-4 w-4" />
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        ) : (
          /* ---- Detail View ---- */
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <div className="flex flex-wrap items-start gap-3">
                <h2 className="font-display text-2xl font-bold text-foreground flex-1 min-w-0">
                  {event.title}
                </h2>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <Badge
                    className={`text-xs capitalize ${catStyle.bg} ${catStyle.text} border-0`}
                  >
                    {event.category}
                  </Badge>
                  {event.recurrence !== RecurrenceRule.None && (
                    <Badge variant="secondary" className="text-xs">
                      <RefreshCw className="mr-1 h-3 w-3" />
                      {RECURRENCE_LABELS[event.recurrence]}
                    </Badge>
                  )}
                  {event.rsvpRequired && (
                    <Badge variant="outline" className="text-xs">
                      RSVP Required
                    </Badge>
                  )}
                </div>
              </div>

              {event.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              )}

              <div className="rounded-xl bg-muted/40 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/15">
                    <Clock className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
                      Start
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDateTimeTz(event.startTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
                      End
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDateTimeTz(event.endTime)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Duration: {formatDuration(event.startTime, event.endTime)}
                    </p>
                  </div>
                </div>
                {event.timeZone && (
                  <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {event.timeZone.replace(/_/g, " ")}
                    </span>
                  </div>
                )}
              </div>

              {event.isRecurringSeries && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => createException()}
                    disabled={isCreatingException}
                    data-ocid="event-edit-occurrence-btn"
                  >
                    <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                    {isCreatingException
                      ? "Creating..."
                      : "Edit This Occurrence"}
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  data-ocid="event-add-notes-btn"
                >
                  <a
                    href={`/app/${workspaceId}/notes/new?title=${encodeURIComponent(`Meeting Notes: ${event.title}`)}`}
                  >
                    <FileText className="mr-1.5 h-3.5 w-3.5" />
                    Add Meeting Notes
                    <ExternalLink className="ml-1.5 h-3 w-3 opacity-60" />
                  </a>
                </Button>
              </div>
            </div>

            {/* RSVP section */}
            {(event.rsvpRequired || rsvps.length > 0) && (
              <div
                className="rounded-2xl border border-border bg-card p-5 space-y-4"
                data-ocid="event-rsvp-section"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm text-foreground">
                    {event.rsvpRequired ? "RSVPs" : "Attendees"}
                  </h3>
                  {!event.rsvpRequired && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      RSVP not required
                    </span>
                  )}
                </div>

                {event.rsvpRequired && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground mr-1">
                      Your response:
                    </span>
                    {[
                      {
                        status: RsvpStatus.accepted,
                        label: "Accept",
                        icon: <Check className="h-3.5 w-3.5" />,
                        cls: "border-green-500/30 text-green-700 dark:text-green-300 hover:bg-green-500/5",
                      },
                      {
                        status: RsvpStatus.tentative,
                        label: "Tentative",
                        icon: null,
                        cls: "border-yellow-500/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-500/5",
                      },
                      {
                        status: RsvpStatus.declined,
                        label: "Decline",
                        icon: <X className="h-3.5 w-3.5" />,
                        cls: "border-red-500/30 text-red-700 dark:text-red-300 hover:bg-red-500/5",
                      },
                    ].map(({ status, label, icon, cls }) => (
                      <Button
                        key={status}
                        variant="outline"
                        size="sm"
                        onClick={() => respondToEvent(status)}
                        disabled={isResponding}
                        className={cls}
                        data-ocid={`rsvp-btn-${status}`}
                      >
                        {icon && <span className="mr-1">{icon}</span>}
                        {label}
                      </Button>
                    ))}
                  </div>
                )}

                {rsvps.length > 0 ? (
                  <div className="space-y-2">
                    {rsvps.map((rsvp) => {
                      const s =
                        RSVP_STYLES[rsvp.status] ??
                        RSVP_STYLES[RsvpStatus.noResponse];
                      return (
                        <div
                          key={rsvp.id}
                          className="flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2"
                        >
                          <span className="text-xs font-medium text-foreground truncate">
                            {rsvp.userId.toString().slice(0, 12)}…
                          </span>
                          <Badge
                            className={`text-xs ${s.bg} ${s.text} border-0`}
                          >
                            {s.label}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No responses yet.
                  </p>
                )}
              </div>
            )}

            {/* Cross-links */}
            {event.crossLinks.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm text-foreground">
                    Cross-Links
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.crossLinks.map((link, i) => (
                    <Badge
                      key={`${link.entityType}-${link.entityId}-${i}`}
                      variant="secondary"
                      className="text-xs gap-1.5"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      {link.linkLabel}
                      <span className="text-muted-foreground">
                        → {link.entityType}
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Meta */}
            <div className="rounded-xl bg-muted/20 px-4 py-3 flex flex-wrap gap-x-6 gap-y-1.5">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Created:</span>{" "}
                {new Date(Number(event.createdAt)).toLocaleDateString("en-US", {
                  dateStyle: "medium",
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Updated:</span>{" "}
                {new Date(Number(event.updatedAt)).toLocaleDateString("en-US", {
                  dateStyle: "medium",
                })}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
