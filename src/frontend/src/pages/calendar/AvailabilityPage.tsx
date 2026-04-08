import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Search, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import type { AvailabilitySlot } from "../../types";

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8);

function formatHour(h: number): string {
  if (h === 12) return "12pm";
  if (h < 12) return `${h}am`;
  return `${h - 12}pm`;
}

function isBusy(slot: AvailabilitySlot, hour: number): boolean {
  const hStr = `${hour.toString().padStart(2, "0")}:00`;
  const hEnd = `${(hour + 1).toString().padStart(2, "0")}:00`;
  return slot.busyPeriods.some(([start, end]) => {
    return start < hEnd && end > hStr;
  });
}

function getBrowserTz(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export default function AvailabilityPage() {
  const navigate = useNavigate();
  const { workspaceId } = useParams({
    from: "/app/$workspaceId/calendar/availability",
  });
  const { actor } = useBackend();
  const tenantId = getTenantId();

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [memberInput, setMemberInput] = useState("");
  const [memberList, setMemberList] = useState<string[]>([]);
  const [timezone] = useState(getBrowserTz());
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);

  const addMember = () => {
    const trimmed = memberInput.trim();
    if (trimmed && !memberList.includes(trimmed)) {
      setMemberList((prev) => [...prev, trimmed]);
      setMemberInput("");
    }
  };

  const removeMember = (id: string) => {
    setMemberList((prev) => prev.filter((m) => m !== id));
  };

  const { mutate: checkAvailability, isPending } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (memberList.length === 0)
        throw new Error("Add at least one team member");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return actor.getAvailability(
        tenantId,
        workspaceId,
        memberList as any,
        date,
        timezone,
      );
    },
    onSuccess: (data) => {
      setSlots(data);
      if (data.length === 0)
        toast.info("No availability data found for the selected members.");
    },
    onError: (err) =>
      toast.error(
        err instanceof Error ? err.message : "Failed to check availability",
      ),
  });

  const bestHours = HOURS.filter(
    (h) => slots.length > 0 && slots.every((s) => !isBusy(s, h)),
  );

  return (
    <div className="min-h-screen bg-background animate-fade-in-up">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border/60 bg-card/90 backdrop-blur-subtle px-6 py-3.5 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
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
            data-ocid="availability-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15">
              <Users className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground tracking-tight">
                Team Availability
              </h1>
              <p className="text-xs text-muted-foreground">
                Find the best meeting time
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        {/* Controls */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="av-date">Date</Label>
            <Input
              id="av-date"
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              data-ocid="availability-date"
            />
          </div>

          <div className="space-y-2">
            <Label>Team Members</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter principal ID or username…"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addMember()}
                data-ocid="availability-member-input"
              />
              <Button
                variant="outline"
                onClick={addMember}
                type="button"
                data-ocid="availability-add-member"
              >
                Add
              </Button>
            </div>
            {memberList.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {memberList.map((m) => (
                  <div
                    key={m}
                    className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                  >
                    <span className="truncate max-w-[120px]">{m}</span>
                    <button
                      type="button"
                      onClick={() => removeMember(m)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-1">
            <p className="text-xs text-muted-foreground mb-3">
              Time zone:{" "}
              <span className="font-medium text-foreground">
                {timezone.replace(/_/g, " ")}
              </span>
            </p>
            <Button
              onClick={() => checkAvailability()}
              disabled={isPending || memberList.length === 0}
              className="w-full sm:w-auto"
              data-ocid="availability-check-btn"
            >
              <Search className="mr-2 h-4 w-4" />
              {isPending ? "Checking…" : "Check Availability"}
            </Button>
          </div>
        </div>

        {/* Results grid */}
        {isPending && (
          <div className="space-y-2">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-10 rounded-lg" />
            ))}
          </div>
        )}

        {slots.length > 0 && (
          <div className="space-y-4">
            {bestHours.length > 0 && (
              <div className="rounded-xl border border-green-200/50 dark:border-green-800/30 bg-green-50/40 dark:bg-green-900/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                    Best Times (Everyone Available)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {bestHours.map((h) => (
                    <span
                      key={h}
                      className="rounded-lg bg-green-100/80 dark:bg-green-900/30 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-300"
                    >
                      {formatHour(h)} – {formatHour(h + 1)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="py-2 px-3 text-left text-xs font-semibold text-muted-foreground w-16">
                        Time
                      </th>
                      {slots.map((slot) => (
                        <th
                          key={slot.userId.toString()}
                          className="py-2 px-2 text-center text-xs font-semibold text-foreground min-w-[100px] truncate max-w-[120px]"
                        >
                          {slot.userId.toString().slice(0, 8)}…
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {HOURS.map((h) => {
                      const allFree = slots.every((s) => !isBusy(s, h));
                      return (
                        <tr
                          key={h}
                          className={cn(
                            "border-b border-border/50 last:border-0",
                            allFree && "bg-green-50/20 dark:bg-green-900/5",
                          )}
                        >
                          <td className="py-2 px-3 text-xs font-medium text-muted-foreground whitespace-nowrap">
                            {formatHour(h)}
                          </td>
                          {slots.map((slot) => {
                            const busy = isBusy(slot, h);
                            return (
                              <td
                                key={slot.userId.toString()}
                                className="py-1 px-2 text-center"
                                data-ocid={`av-cell-${h}-${slot.userId.toString().slice(0, 6)}`}
                              >
                                <div
                                  className={cn(
                                    "mx-auto h-7 w-full rounded text-xs font-medium flex items-center justify-center",
                                    busy
                                      ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                      : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
                                  )}
                                >
                                  {busy ? "Busy" : "Free"}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center gap-4 px-1">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-green-200 dark:bg-green-800" />
                <span className="text-xs text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-red-200 dark:bg-red-800" />
                <span className="text-xs text-muted-foreground">Busy</span>
              </div>
            </div>
          </div>
        )}

        {!isPending && slots.length === 0 && memberList.length > 0 && (
          <div
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-12 text-center"
            data-ocid="availability-empty"
          >
            <Users className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground">
              No availability data yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Click "Check Availability" to see the grid.
            </p>
          </div>
        )}

        {!isPending && slots.length === 0 && memberList.length === 0 && (
          <div
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-14 text-center"
            data-ocid="availability-no-members"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 mb-4">
              <Users className="h-7 w-7 text-blue-500" />
            </div>
            <h3 className="font-display font-semibold text-foreground">
              Add team members to get started
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Enter principal IDs or usernames above, then click "Check
              Availability" to see who's free.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
