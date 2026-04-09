import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Pause, Play, Timer } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TimeEntryLocal } from "../types";

interface TimeTrackerProps {
  taskId: string;
  projectId: string;
  entries: TimeEntryLocal[];
  isLoading?: boolean;
  onStart?: (
    entry: Omit<TimeEntryLocal, "id" | "createdAt" | "updatedAt">,
  ) => void;
  onStop?: (entryId: string, durationSeconds: number) => void;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m`;
  if (m > 0) return `${m}m ${s.toString().padStart(2, "0")}s`;
  return `${s}s`;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function TimeTracker({
  taskId,
  projectId,
  entries,
  isLoading,
  onStart,
  onStop,
}: TimeTrackerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const totalSeconds = entries.reduce(
    (acc, e) => acc + (e.durationSeconds ?? 0),
    0,
  );
  const recentEntries = [...entries]
    .sort((a, b) => b.startedAt - a.startedAt)
    .slice(0, 5);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    setElapsed(0);
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    const tempId = `temp-${Date.now()}`;
    setActiveEntryId(tempId);
    onStart?.({
      tenantId: "",
      userId: "",
      projectId,
      taskId,
      description: "",
      startedAt: startTimeRef.current,
      durationSeconds: 0,
      status: "running",
      tags: [],
    });
  }, [projectId, taskId, onStart]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    const finalElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setElapsed(finalElapsed);
    if (activeEntryId) {
      onStop?.(activeEntryId, finalElapsed);
      setActiveEntryId(null);
    }
  }, [activeEntryId, onStop]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-border bg-card p-5 space-y-4"
      data-ocid="time-tracker-widget"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <Timer className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Time Tracker</h3>
        <div className="ml-auto flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-mono font-semibold text-foreground">
            {formatDuration(totalSeconds + (isRunning ? elapsed : 0))}
          </span>
          <span className="text-xs text-muted-foreground">total</span>
        </div>
      </div>

      {/* Timer control */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
        <div className="flex-1 min-w-0">
          {isRunning ? (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-sm font-medium text-foreground">
                Recording
              </span>
              <span className="text-xl font-mono font-bold text-primary tabular-nums">
                {formatDuration(elapsed)}
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Start timer to log time on this task
            </p>
          )}
        </div>
        <Button
          variant={isRunning ? "outline" : "default"}
          size="sm"
          onClick={isRunning ? stopTimer : startTimer}
          className="shrink-0 gap-2"
          data-ocid="timer-toggle-btn"
        >
          {isRunning ? (
            <>
              <Pause className="h-3.5 w-3.5" /> Stop
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" /> Start
            </>
          )}
        </Button>
      </div>

      {/* Recent entries */}
      {recentEntries.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Recent Entries
          </p>
          <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
            {recentEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 px-3 py-2.5 bg-card"
                data-ocid={`time-entry-row-${entry.id}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">
                    {formatDate(entry.startedAt)}
                    {" · "}
                    {formatTime(entry.startedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {entry.status === "running" ? (
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                      Running
                    </Badge>
                  ) : (
                    <span className="text-sm font-mono font-semibold text-foreground tabular-nums">
                      {formatDuration(entry.durationSeconds)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentEntries.length === 0 && (
        <div className="text-center py-3" data-ocid="time-tracker-empty">
          <p className="text-xs text-muted-foreground">
            No time logged yet. Start the timer above.
          </p>
        </div>
      )}
    </div>
  );
}
