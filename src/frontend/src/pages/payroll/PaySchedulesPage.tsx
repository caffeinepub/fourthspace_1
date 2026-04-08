import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import type { PaySchedule, PayScheduleInput } from "../../types";
import { PayFrequency } from "../../types";

const FREQUENCIES = [
  PayFrequency.Weekly,
  PayFrequency.BiWeekly,
  PayFrequency.SemiMonthly,
  PayFrequency.Monthly,
];

const FREQ_LABELS: Record<string, string> = {
  [PayFrequency.Weekly]: "Weekly",
  [PayFrequency.BiWeekly]: "Bi-Weekly",
  [PayFrequency.SemiMonthly]: "Semi-Monthly",
  [PayFrequency.Monthly]: "Monthly",
  [PayFrequency.Quarterly]: "Quarterly",
};

const FREQ_COLORS: Record<string, string> = {
  [PayFrequency.Weekly]:
    "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
  [PayFrequency.BiWeekly]:
    "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
  [PayFrequency.SemiMonthly]:
    "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20",
  [PayFrequency.Monthly]:
    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  [PayFrequency.Quarterly]:
    "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
};

function AddScheduleForm({
  onClose,
  tenantId,
  workspaceId,
}: { onClose: () => void; tenantId: string; workspaceId: string }) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    description: "",
    frequency: PayFrequency.Monthly as string,
    isDefault: false,
  });

  const add = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const input: PayScheduleInput = {
        name: form.name.trim(),
        description: form.description.trim(),
        frequency: form.frequency as PayFrequency,
        isDefault: form.isDefault,
      };
      const res = await actor.addPaySchedule(tenantId, workspaceId, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      toast.success("Pay schedule created");
      queryClient.invalidateQueries({ queryKey: ["paySchedules"] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Card
      className="shadow-card rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02]"
      data-ocid="add-schedule-form"
    >
      <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-border/40">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          New Pay Schedule
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            add.mutate();
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="space-y-1.5">
            <Label htmlFor="sched-name">Schedule Name</Label>
            <Input
              id="sched-name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Bi-Weekly Employees"
              required
              data-ocid="sched-name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sched-freq">Frequency</Label>
            <select
              id="sched-freq"
              value={form.frequency}
              onChange={(e) =>
                setForm((p) => ({ ...p, frequency: e.target.value }))
              }
              data-ocid="sched-frequency"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {FREQ_LABELS[f] ?? f}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="sched-desc">Description</Label>
            <Input
              id="sched-desc"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Optional description"
              data-ocid="sched-desc"
            />
          </div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <Switch
              id="sched-default"
              checked={form.isDefault}
              onCheckedChange={(v) => setForm((p) => ({ ...p, isDefault: v }))}
              data-ocid="sched-default-toggle"
            />
            <Label htmlFor="sched-default" className="cursor-pointer">
              Set as default pay schedule
            </Label>
          </div>
          <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={add.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white active-press"
              data-ocid="sched-submit-btn"
            >
              {add.isPending ? "Saving…" : "Create Schedule"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function PaySchedulesPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const [showForm, setShowForm] = useState(false);

  const { data: schedules = [], isLoading } = useQuery<PaySchedule[]>({
    queryKey: ["paySchedules", tenantId, workspaceId],
    queryFn: async () =>
      actor ? actor.listPaySchedules(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  return (
    <div className="animate-fade-in-up p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild aria-label="Back">
            <Link to={`/app/${workspaceId}/payroll`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Pay Schedules
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? "Loading…"
                : `${schedules.length} schedule${schedules.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white active-press"
          data-ocid="add-schedule-btn"
        >
          {showForm ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              New Schedule
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <AddScheduleForm
          onClose={() => setShowForm(false)}
          tenantId={tenantId}
          workspaceId={workspaceId}
        />
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : schedules.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center"
          data-ocid="schedules-empty"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 mb-4">
            <Calendar className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-display font-semibold text-foreground">
            No pay schedules yet
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            Create pay schedules to assign different payment frequencies to
            employee groups.
          </p>
          <Button
            className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white active-press"
            onClick={() => setShowForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create First Schedule
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {schedules.map((sched) => (
            <div
              key={sched.id}
              className="rounded-xl border border-border/50 bg-card shadow-card hover:border-emerald-400/50 hover:shadow-card-hover transition-all p-5 space-y-4"
              data-ocid={`schedule-card-${sched.id}`}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                    <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {sched.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${FREQ_COLORS[sched.frequency] ?? "bg-muted text-muted-foreground border-border"}`}
                      >
                        {FREQ_LABELS[sched.frequency] ?? sched.frequency}
                      </span>
                      {sched.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/40">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span>0 employees</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    Created{" "}
                    {new Date(
                      Number(sched.createdAt) / 1_000_000,
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              {sched.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {sched.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
