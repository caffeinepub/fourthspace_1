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
  Clock,
  Edit2,
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
import { RecurrenceRule } from "../../types";
import type { CrossLink, Event, EventInput } from "../../types";

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

function tsToLocalDatetime(ts: bigint): string {
  const d = new Date(Number(ts));
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function localDatetimeToTs(value: string): bigint {
  return BigInt(new Date(value).getTime());
}

function formatDuration(start: bigint, end: bigint): string {
  const diffMs = Number(end - start);
  const hours = Math.floor(diffMs / 3600000);
  const mins = Math.floor((diffMs % 3600000) / 60000);
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export default function EventDetailPage() {
  const navigate = useNavigate();
  const { eventId } = useParams({ from: "/app/calendar/$eventId" });
  const { actor } = useBackend();
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
  const [editAttendees, setEditAttendees] = useState("");
  const [editCrossLinks, setEditCrossLinks] = useState<CrossLink[]>([]);

  const { data: event, isLoading } = useQuery<Event | null>({
    queryKey: ["event", tenantId, eventId],
    queryFn: async () => {
      if (!actor) return null;
      const res = await actor.getEvent(tenantId, eventId);
      return res.__kind__ === "ok" ? res.ok : null;
    },
    enabled: !!actor,
  });

  const startEditMode = (ev: Event) => {
    setEditTitle(ev.title);
    setEditDescription(ev.description);
    setEditStartTime(tsToLocalDatetime(ev.startTime));
    setEditEndTime(tsToLocalDatetime(ev.endTime));
    setEditRecurrence(ev.recurrence);
    setEditAttendees("");
    setEditCrossLinks(ev.crossLinks);
    setIsEditing(true);
  };

  const { mutate: updateEvent, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const input: EventInput = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        startTime: localDatetimeToTs(editStartTime),
        endTime: localDatetimeToTs(editEndTime),
        recurrence: editRecurrence,
        attendeeIds: [],
        crossLinks: editCrossLinks,
      };
      return actor.updateEvent(tenantId, eventId, input);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({
          queryKey: ["event", tenantId, eventId],
        });
        queryClient.invalidateQueries({ queryKey: ["events"] });
        toast.success("Event updated!");
        setIsEditing(false);
      } else {
        toast.error(result.err);
      }
    },
    onError: () => toast.error("Failed to update event"),
  });

  const { mutate: deleteEvent, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteEvent(tenantId, eventId);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["events"] });
        toast.success("Event deleted");
        navigate({ to: "/app/calendar" });
      } else {
        toast.error(result.err);
      }
    },
    onError: () => toast.error("Failed to delete event"),
  });

  const isEditValid =
    editTitle.trim().length > 0 &&
    editStartTime.length > 0 &&
    editEndTime.length > 0 &&
    new Date(editEndTime) > new Date(editStartTime);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                isEditing
                  ? setIsEditing(false)
                  : navigate({ to: "/app/calendar" })
              }
              aria-label={isEditing ? "Cancel edit" : "Back to Calendar"}
              data-ocid="event-detail-back"
            >
              {isEditing ? (
                <X className="h-4 w-4" />
              ) : (
                <ArrowLeft className="h-4 w-4" />
              )}
            </Button>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/15">
                <Calendar className="h-4 w-4 text-red-500" />
              </div>
              {isLoading ? (
                <Skeleton className="h-6 w-48" />
              ) : (
                <h1 className="font-display text-xl font-bold text-foreground truncate">
                  {isEditing ? "Edit Event" : (event?.title ?? "Event")}
                </h1>
              )}
            </div>
          </div>

          {!isEditing && event && (
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => startEditMode(event)}
                data-ocid="event-edit-btn"
              >
                <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-destructive/30 text-destructive hover:bg-destructive/5"
                    data-ocid="event-delete-btn"
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this event?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The event will be
                      permanently removed from your calendar.
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
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
              <Calendar className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="font-display font-semibold text-foreground">
              Event not found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This event may have been deleted or does not exist.
            </p>
            <Button
              variant="outline"
              className="mt-5"
              onClick={() => navigate({ to: "/app/calendar" })}
              data-ocid="event-not-found-back"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Calendar
            </Button>
          </div>
        ) : isEditing ? (
          /* Edit form */
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="edit-title">
                Event Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
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
                  onChange={(e) => setEditStartTime(e.target.value)}
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
              <Label htmlFor="edit-attendees">Attendees</Label>
              <Input
                id="edit-attendees"
                placeholder="Comma-separated names or emails"
                value={editAttendees}
                onChange={(e) => setEditAttendees(e.target.value)}
                data-ocid="event-edit-attendees"
              />
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
          /* Detail view */
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              {/* Title + recurrence */}
              <div className="flex flex-wrap items-start gap-3">
                <h2 className="font-display text-2xl font-bold text-foreground flex-1 min-w-0">
                  {event.title}
                </h2>
                {event.recurrence !== RecurrenceRule.None && (
                  <Badge className="shrink-0 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border-red-200/50 dark:border-red-800/40">
                    <RefreshCw className="mr-1 h-3 w-3" />
                    {RECURRENCE_LABELS[event.recurrence]}
                  </Badge>
                )}
              </div>

              {event.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              )}

              {/* Time info */}
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
                      {formatDateTime(event.startTime)}
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
                      {formatDateTime(event.endTime)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Duration: {formatDuration(event.startTime, event.endTime)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attendees */}
              {event.attendeeIds.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      Attendees
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {event.attendeeIds.map((id) => (
                        <Badge
                          key={id.toString()}
                          variant="secondary"
                          className="text-xs"
                        >
                          {id.toString().slice(0, 12)}…
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cross-links */}
            {event.crossLinks.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
                    <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
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
