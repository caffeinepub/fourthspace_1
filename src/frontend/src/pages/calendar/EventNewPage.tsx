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
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CrossLinkPicker } from "../../components/CrossLinkPicker";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import { RecurrenceRule } from "../../types";
import type { CrossLink, EventInput } from "../../types";

const RECURRENCE_OPTIONS = [
  { value: RecurrenceRule.None, label: "No recurrence" },
  { value: RecurrenceRule.Daily, label: "Daily" },
  { value: RecurrenceRule.Weekly, label: "Weekly" },
  { value: RecurrenceRule.Monthly, label: "Monthly" },
  { value: RecurrenceRule.Yearly, label: "Yearly" },
];

function tsToLocalDatetime(ts: bigint): string {
  const d = new Date(Number(ts));
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function localDatetimeToTs(value: string): bigint {
  return BigInt(new Date(value).getTime());
}

function defaultStart(): string {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return tsToLocalDatetime(BigInt(d.getTime()));
}

function defaultEnd(start: string): string {
  const d = new Date(start);
  d.setHours(d.getHours() + 1);
  return tsToLocalDatetime(BigInt(d.getTime()));
}

export default function EventNewPage() {
  const navigate = useNavigate();
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();

  const startDefault = defaultStart();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(startDefault);
  const [endTime, setEndTime] = useState(defaultEnd(startDefault));
  const [recurrence, setRecurrence] = useState<RecurrenceRule>(
    RecurrenceRule.None,
  );
  const [attendees, setAttendees] = useState("");
  const [crossLinks, setCrossLinks] = useState<CrossLink[]>([]);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const input: EventInput = {
        title: title.trim(),
        description: description.trim(),
        startTime: localDatetimeToTs(startTime),
        endTime: localDatetimeToTs(endTime),
        recurrence,
        attendeeIds: [],
        crossLinks,
      };
      return actor.createEvent(tenantId, input);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["events"] });
        toast.success("Event created!");
        navigate({
          to: "/app/calendar/$eventId",
          params: { eventId: result.ok.id },
        });
      } else {
        toast.error(result.err);
      }
    },
    onError: () => toast.error("Failed to create event"),
  });

  const isValid =
    title.trim().length > 0 &&
    startTime.length > 0 &&
    endTime.length > 0 &&
    new Date(endTime) > new Date(startTime);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/app/calendar" })}
            aria-label="Back to Calendar"
            data-ocid="event-new-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15">
              <Calendar className="h-4 w-4 text-red-500" />
            </div>
            <h1 className="font-display text-xl font-bold text-foreground">
              New Event
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="event-title">
              Event Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="event-title"
              placeholder="Give your event a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-ocid="event-title-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              placeholder="Describe the event..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-ocid="event-description-input"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="event-start">
                Start Date &amp; Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="event-start"
                type="datetime-local"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  if (
                    e.target.value &&
                    new Date(endTime) <= new Date(e.target.value)
                  ) {
                    setEndTime(defaultEnd(e.target.value));
                  }
                }}
                data-ocid="event-start-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-end">
                End Date &amp; Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="event-end"
                type="datetime-local"
                value={endTime}
                min={startTime}
                onChange={(e) => setEndTime(e.target.value)}
                data-ocid="event-end-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Recurrence</Label>
            <Select
              value={recurrence}
              onValueChange={(v) => setRecurrence(v as RecurrenceRule)}
            >
              <SelectTrigger data-ocid="event-recurrence-select">
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

          <div className="space-y-2">
            <Label htmlFor="event-attendees">Attendees</Label>
            <Input
              id="event-attendees"
              placeholder="Comma-separated names or emails (informational)"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              data-ocid="event-attendees-input"
            />
            <p className="text-xs text-muted-foreground">
              Attendee tracking is informational for this workspace.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Cross-Links</Label>
            <CrossLinkPicker
              tenantId={tenantId}
              value={crossLinks}
              onChange={setCrossLinks}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/app/calendar" })}
            data-ocid="event-new-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={() => mutate()}
            disabled={!isValid || isPending}
            className="bg-red-500 text-white hover:bg-red-600"
            data-ocid="event-new-save"
          >
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Saving..." : "Save Event"}
          </Button>
        </div>
      </div>
    </div>
  );
}
