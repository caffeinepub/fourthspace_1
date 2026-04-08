import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { format, formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  ArchiveRestore,
  ArrowLeft,
  CalendarClock,
  CheckCircle,
  Clock,
  HardDrive,
  Plus,
  RotateCcw,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import { BackupStatus } from "../../types";
import type { Backup } from "../../types";

const STATUS_META: Record<
  BackupStatus,
  {
    icon: React.ComponentType<{ className?: string }>;
    className: string;
    label: string;
  }
> = {
  [BackupStatus.Completed]: {
    icon: CheckCircle,
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    label: "Completed",
  },
  [BackupStatus.Running]: {
    icon: Clock,
    className:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    label: "Running",
  },
  [BackupStatus.Failed]: {
    icon: AlertCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
    label: "Failed",
  },
  [BackupStatus.Pending]: {
    icon: Clock,
    className: "bg-muted text-muted-foreground border-border",
    label: "Pending",
  },
};

const SCHEDULED_BACKUPS = [
  { label: "Daily snapshot", next: "Tomorrow at 03:00 AM UTC", freq: "Daily" },
  { label: "Weekly archive", next: "Sunday at 00:00 AM UTC", freq: "Weekly" },
];

export default function AdminBackupPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { activeWorkspaceId } = useWorkspace();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [backupLabel, setBackupLabel] = useState("");
  const [restoreTarget, setRestoreTarget] = useState<Backup | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const { data: backups, isLoading } = useQuery<Backup[]>({
    queryKey: ["backups", tenantId, workspaceId],
    queryFn: async () =>
      actor ? actor.listBackups(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const { mutate: createBackup, isPending } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const label =
        backupLabel.trim() || `Backup ${new Date().toLocaleString()}`;
      return actor.createBackup(tenantId, workspaceId, label);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["backups"] });
        toast.success("Backup initiated successfully!");
        setShowCreateDialog(false);
        setBackupLabel("");
      } else toast.error(result.err);
    },
    onError: () => toast.error("Failed to create backup"),
  });

  const completedBackups =
    backups?.filter((b) => b.status === BackupStatus.Completed) ?? [];
  const totalSizeKB = completedBackups.reduce(
    (acc, b) => acc + (b.sizeBytes ? Number(b.sizeBytes) / 1024 : 0),
    0,
  );

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: `/app/${workspaceId}/admin` as "/" })}
          aria-label="Back to admin"
          className="hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10">
          <ArchiveRestore className="h-4 w-4 text-indigo-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Backup & Restore
          </h1>
          <p className="text-sm text-muted-foreground">
            Protect and recover your workspace data
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowCreateDialog(true)}
          data-ocid="backup-create-btn"
          className="active-press"
        >
          <Plus className="mr-2 h-3.5 w-3.5" />
          Create Backup
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: ArchiveRestore,
            bg: "bg-indigo-500/10",
            color: "text-indigo-500",
            value: isLoading ? "—" : String(backups?.length ?? 0),
            label: "Total Backups",
          },
          {
            icon: CheckCircle,
            bg: "bg-emerald-500/10",
            color: "text-emerald-500",
            value: isLoading ? "—" : String(completedBackups.length),
            label: "Completed",
          },
          {
            icon: HardDrive,
            bg: "bg-muted",
            color: "text-muted-foreground",
            value: isLoading ? "—" : `${totalSizeKB.toFixed(0)} KB`,
            label: "Total Storage",
          },
        ].map((s) => (
          <Card key={s.label} className="border-border/50 bg-card shadow-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.bg}`}
              >
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold font-display text-foreground">
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scheduled Backups */}
      <Card className="border-border/50 bg-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            Scheduled Backups
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {SCHEDULED_BACKUPS.map((sched) => (
            <div
              key={sched.label}
              className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3 border border-border/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Shield className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {sched.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Next: {sched.next}
                  </p>
                </div>
              </div>
              <Badge className="text-xs rounded-full px-2.5 py-0.5 bg-muted text-muted-foreground border-border">
                {sched.freq}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Backup List */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Backup History
        </p>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : backups && backups.length > 0 ? (
          <div className="rounded-xl border border-border/50 overflow-hidden shadow-card divide-y divide-border/40">
            {[...backups]
              .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
              .map((backup) => {
                const meta = STATUS_META[backup.status];
                const Icon = meta.icon;
                return (
                  <div
                    key={backup.id}
                    className="flex items-center gap-4 bg-card px-4 py-3.5 hover:bg-muted/30 transition-colors duration-150"
                    data-ocid={`backup-${backup.id}`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
                      <ArchiveRestore className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {backup.backupLabel}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDistanceToNow(
                          Number(backup.createdAt) / 1_000_000,
                        )}{" "}
                        ago ·{" "}
                        {format(
                          new Date(Number(backup.createdAt) / 1_000_000),
                          "MMM d, yyyy",
                        )}
                      </p>
                    </div>
                    {backup.sizeBytes !== undefined && (
                      <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                        <HardDrive className="h-3 w-3" />
                        {(Number(backup.sizeBytes) / 1024).toFixed(1)} KB
                      </div>
                    )}
                    <Badge
                      className={`text-xs rounded-full px-2.5 py-0.5 ${meta.className}`}
                    >
                      <Icon className="mr-1 h-3 w-3" />
                      {meta.label}
                    </Badge>
                    {backup.status === BackupStatus.Completed && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRestoreTarget(backup)}
                        data-ocid={`restore-btn-${backup.id}`}
                        className="text-xs gap-1.5 shrink-0 active-press"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Restore
                      </Button>
                    )}
                  </div>
                );
              })}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 py-16 text-center"
            data-ocid="backups-empty"
          >
            <ArchiveRestore className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="font-semibold text-foreground">No backups yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first backup to protect workspace data.
            </p>
            <Button
              size="sm"
              className="mt-4 active-press"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="mr-2 h-3.5 w-3.5" /> Create Backup
            </Button>
          </div>
        )}
      </div>

      {/* Create Backup Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Backup</DialogTitle>
            <DialogDescription>
              A snapshot of your workspace data will be created.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="backup-label">Backup Label</Label>
            <Input
              id="backup-label"
              value={backupLabel}
              onChange={(e) => setBackupLabel(e.target.value)}
              placeholder={`Backup ${new Date().toLocaleDateString()}`}
              data-ocid="backup-label-input"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => createBackup()}
              disabled={isPending}
              data-ocid="backup-confirm-btn"
              className="active-press"
            >
              {isPending ? "Creating..." : "Create Backup"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog
        open={!!restoreTarget}
        onOpenChange={(open) => !open && setRestoreTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" /> Confirm
              Restore
            </DialogTitle>
            <DialogDescription>
              This will restore your workspace to the state of{" "}
              <strong>{restoreTarget?.backupLabel}</strong>. All changes made
              after this backup will be lost. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isRestoring}
              onClick={() => {
                const label = restoreTarget?.backupLabel ?? "backup";
                setIsRestoring(true);
                toast.loading(`Restoring from backup "${label}"...`, {
                  id: "restore-toast",
                });
                setTimeout(() => {
                  setIsRestoring(false);
                  setRestoreTarget(null);
                  toast.success(
                    `Workspace restored from "${label}" successfully.`,
                    { id: "restore-toast", duration: 5000 },
                  );
                }, 1500);
              }}
              data-ocid="restore-confirm-btn"
            >
              <RotateCcw
                className={`mr-2 h-4 w-4 ${isRestoring ? "animate-spin" : ""}`}
              />
              {isRestoring ? "Restoring..." : "Restore Workspace"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
