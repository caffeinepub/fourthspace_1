import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  DollarSign,
  Flag,
  Loader2,
  RefreshCw,
  Shield,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type {
  EscrowContract,
  EscrowDispute,
  EscrowMilestone,
  StatusHistoryEntry,
} from "../../types";
import { EscrowStatus, MilestoneStatus__1 } from "../../types";

function formatICP(e8s: bigint): string {
  return `${(Number(e8s) / 1e8).toFixed(4)} ICP`;
}
function formatTs(ts: bigint): string {
  return format(new Date(Number(ts) / 1_000_000), "MMM d, yyyy HH:mm");
}

const ESCROW_COLORS: Record<string, string> = {
  [EscrowStatus.Pending]: "bg-muted text-muted-foreground",
  [EscrowStatus.Funded]: "bg-primary/10 text-primary",
  [EscrowStatus.Released]: "bg-accent/10 text-accent-foreground",
  [EscrowStatus.Disputed]: "bg-destructive/10 text-destructive",
  [EscrowStatus.Cancelled]: "bg-muted text-muted-foreground",
};

const MS_COLORS: Record<string, string> = {
  [MilestoneStatus__1.Pending]: "bg-muted text-muted-foreground",
  [MilestoneStatus__1.Approved]: "bg-primary/10 text-primary",
  [MilestoneStatus__1.Releasing]: "bg-secondary/10 text-secondary-foreground",
  [MilestoneStatus__1.Released]: "bg-accent/10 text-accent-foreground",
};

export default function EscrowDetailPage() {
  const { workspaceId, escrowId } = useParams({ strict: false }) as {
    workspaceId: string;
    escrowId: string;
  };
  const { tenantId } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [disputeReason, setDisputeReason] = useState("");
  const [showDisputeForm, setShowDisputeForm] = useState(false);

  const { data: escrow, isLoading } = useQuery<EscrowContract | null>({
    queryKey: ["escrow", tenantId, workspaceId, escrowId],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getEscrow(tenantId, workspaceId, escrowId);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !isFetching && !!escrowId,
  });

  const { data: milestones = [] } = useQuery<EscrowMilestone[]>({
    queryKey: ["escrowMilestones", tenantId, workspaceId, escrowId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEscrowMilestones(tenantId, workspaceId, escrowId);
    },
    enabled: !!actor && !isFetching && !!escrowId,
  });

  const { data: disputes = [] } = useQuery<EscrowDispute[]>({
    queryKey: ["escrowDisputes", tenantId, workspaceId, escrowId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEscrowDisputes(tenantId, workspaceId, escrowId);
    },
    enabled: !!actor && !isFetching && !!escrowId,
  });

  function invalidate() {
    void queryClient.invalidateQueries({
      queryKey: ["escrow", tenantId, workspaceId, escrowId],
    });
    void queryClient.invalidateQueries({
      queryKey: ["escrowMilestones", tenantId, workspaceId, escrowId],
    });
    void queryClient.invalidateQueries({
      queryKey: ["escrowDisputes", tenantId, workspaceId, escrowId],
    });
    void queryClient.invalidateQueries({
      queryKey: ["escrow", tenantId, workspaceId],
    });
  }

  const fundMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.fundEscrow(tenantId, workspaceId, escrowId);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      toast.success("Escrow funded successfully");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const releaseMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.releaseEscrow(tenantId, workspaceId, escrowId);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      toast.success("Funds released successfully");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const refundMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.refundEscrow(tenantId, workspaceId, escrowId);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      toast.success("Escrow refunded");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.cancelEscrow(tenantId, workspaceId, escrowId);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      toast.success("Escrow cancelled");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const disputeMutation = useMutation({
    mutationFn: async (reason: string) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.raiseEscrowDispute(
        tenantId,
        workspaceId,
        escrowId,
        reason,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      toast.success("Dispute raised");
      setShowDisputeForm(false);
      setDisputeReason("");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const approveMsMutation = useMutation({
    mutationFn: async (milestoneId: string) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.approveMilestone(
        tenantId,
        workspaceId,
        milestoneId,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      toast.success("Milestone approved");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const releaseMsMutation = useMutation({
    mutationFn: async (milestoneId: string) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.releaseMilestoneFunds(
        tenantId,
        workspaceId,
        milestoneId,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      toast.success("Milestone released successfully");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 sm:p-6 max-w-3xl mx-auto">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  if (!escrow) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <XCircle className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground">Escrow not found.</p>
        <Button
          onClick={() => navigate({ to: `/app/${workspaceId}/escrow` as "/" })}
        >
          Back to Escrow
        </Button>
      </div>
    );
  }

  const canFund = escrow.status === EscrowStatus.Pending;
  const canRelease = escrow.status === EscrowStatus.Funded;
  const canDispute =
    escrow.status === EscrowStatus.Funded ||
    escrow.status === EscrowStatus.Pending;
  const canRefund =
    escrow.status === EscrowStatus.Disputed ||
    escrow.status === EscrowStatus.Funded;
  const canCancel = escrow.status === EscrowStatus.Pending;
  const isTerminal =
    escrow.status === EscrowStatus.Released ||
    escrow.status === EscrowStatus.Cancelled;

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: `/app/${workspaceId}/escrow` as "/" })}
          data-ocid="escrow-detail-back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Shield className="w-5 h-5 text-primary shrink-0" />
        <h1 className="text-xl font-semibold font-display truncate flex-1 min-w-0">
          {escrow.title}
        </h1>
        <Badge
          className={`shrink-0 text-xs ${ESCROW_COLORS[escrow.status] ?? "bg-muted text-muted-foreground"}`}
          variant="outline"
        >
          {escrow.status}
        </Badge>
      </div>

      {/* Overview card */}
      <Card>
        <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat label="Amount" value={formatICP(escrow.amount)} />
          <Stat label="Currency" value={escrow.currency} />
          <Stat label="Created" value={formatTs(escrow.createdAt)} />
          {escrow.dueDate ? (
            <Stat label="Due" value={formatTs(escrow.dueDate)} />
          ) : null}
        </CardContent>
      </Card>

      {escrow.description && (
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1.5">Description</p>
            <p className="text-sm text-foreground">{escrow.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {!isTerminal && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display">Actions</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {canFund && (
                <Button
                  data-ocid="escrow-fund-btn"
                  size="sm"
                  onClick={() => fundMutation.mutate()}
                  disabled={fundMutation.isPending}
                  className="gap-1.5"
                >
                  {fundMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <DollarSign className="w-3.5 h-3.5" />
                  )}
                  Fund Escrow
                </Button>
              )}
              {canRelease && (
                <Button
                  data-ocid="escrow-release-btn"
                  size="sm"
                  variant="outline"
                  onClick={() => releaseMutation.mutate()}
                  disabled={releaseMutation.isPending}
                  className="gap-1.5"
                >
                  {releaseMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5" />
                  )}
                  Release Funds
                </Button>
              )}
              {canDispute && !showDisputeForm && (
                <Button
                  data-ocid="escrow-dispute-btn"
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDisputeForm(true)}
                  className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5"
                >
                  <Flag className="w-3.5 h-3.5" />
                  Raise Dispute
                </Button>
              )}
              {canRefund && (
                <Button
                  data-ocid="escrow-refund-btn"
                  size="sm"
                  variant="outline"
                  onClick={() => refundMutation.mutate()}
                  disabled={refundMutation.isPending}
                  className="gap-1.5"
                >
                  {refundMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  Refund
                </Button>
              )}
              {canCancel && (
                <Button
                  data-ocid="escrow-cancel-btn"
                  size="sm"
                  variant="ghost"
                  onClick={() => cancelMutation.mutate()}
                  disabled={cancelMutation.isPending}
                  className="gap-1.5 text-destructive hover:text-destructive"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Cancel
                </Button>
              )}
            </div>
            {showDisputeForm && (
              <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 flex flex-col gap-3">
                <p className="text-sm font-medium text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Raise a Dispute
                </p>
                <Textarea
                  data-ocid="escrow-dispute-reason"
                  placeholder="Describe the reason for the dispute..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowDisputeForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    data-ocid="escrow-dispute-submit"
                    onClick={() => disputeMutation.mutate(disputeReason)}
                    disabled={
                      disputeMutation.isPending || !disputeReason.trim()
                    }
                  >
                    {disputeMutation.isPending
                      ? "Submitting..."
                      : "Submit Dispute"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Milestones */}
      {milestones.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display">
              Milestones ({milestones.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 flex flex-col gap-3">
            {milestones.map((m) => (
              <div
                key={m.id}
                data-ocid={`milestone-card-${m.id}`}
                className="p-3 rounded-lg border border-border bg-background flex items-start justify-between gap-3 flex-wrap"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-sm font-medium text-foreground truncate">
                      {m.title}
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-xs shrink-0 ${MS_COLORS[m.status] ?? "bg-muted"}`}
                    >
                      {m.status}
                    </Badge>
                  </div>
                  {m.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {m.description}
                    </p>
                  )}
                  <p className="text-xs font-medium text-foreground mt-1">
                    {formatICP(m.amount)}
                    {m.ledgerBlockHeight != null && (
                      <span className="text-muted-foreground font-normal ml-2">
                        Block #{m.ledgerBlockHeight.toString()}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {m.status === MilestoneStatus__1.Pending && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => approveMsMutation.mutate(m.id)}
                      disabled={approveMsMutation.isPending}
                      data-ocid={`milestone-approve-${m.id}`}
                      className="text-xs h-7 px-2 gap-1"
                    >
                      {approveMsMutation.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <CheckCircle className="w-3 h-3" />
                      )}
                      Approve
                    </Button>
                  )}
                  {m.status === MilestoneStatus__1.Approved && (
                    <Button
                      size="sm"
                      onClick={() => releaseMsMutation.mutate(m.id)}
                      disabled={releaseMsMutation.isPending}
                      data-ocid={`milestone-release-${m.id}`}
                      className="text-xs h-7 px-2 gap-1"
                    >
                      {releaseMsMutation.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <DollarSign className="w-3 h-3" />
                      )}
                      Release
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Status Timeline */}
      {escrow.statusHistory?.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display">
              Status Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            {escrow.statusHistory.map((entry, idx) => (
              <TimelineEntry
                key={`timeline-${entry.timestamp.toString()}-${idx}`}
                entry={entry}
                isLast={idx === escrow.statusHistory.length - 1}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Disputes */}
      {disputes.length > 0 && (
        <Card className="border-destructive/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display text-destructive flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Disputes
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 flex flex-col gap-3">
            {disputes.map((d) => (
              <div
                key={d.id}
                className="p-3 rounded-md bg-destructive/5 border border-destructive/20"
              >
                <div className="flex items-center justify-between mb-1">
                  <Badge
                    variant="outline"
                    className={
                      d.status === "Open"
                        ? "text-destructive border-destructive/30"
                        : "text-muted-foreground"
                    }
                  >
                    {d.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTs(d.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-foreground">{d.reason}</p>
                {d.resolution && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Resolution: {d.resolution}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Conditions */}
      {escrow.conditions?.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display">Conditions</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <ol className="flex flex-col gap-1.5">
              {escrow.conditions.map((c, idx) => (
                <li
                  key={`cond-${c.slice(0, 10)}-${idx}`}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <span className="text-muted-foreground shrink-0 mt-0.5 font-mono text-xs">
                    {idx + 1}.
                  </span>
                  {c}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
    </div>
  );
}

function TimelineEntry({
  entry,
  isLast,
}: {
  entry: StatusHistoryEntry;
  isLast: boolean;
}) {
  const dotColor =
    entry.status === EscrowStatus.Disputed
      ? "bg-destructive"
      : entry.status === EscrowStatus.Released
        ? "bg-accent"
        : entry.status === EscrowStatus.Funded
          ? "bg-primary"
          : "bg-muted-foreground";

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColor}`} />
        {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
      </div>
      <div className="pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-foreground">
            {entry.status}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTs(entry.timestamp)}
          </span>
        </div>
        {entry.note && (
          <p className="text-xs text-muted-foreground mt-0.5">{entry.note}</p>
        )}
      </div>
    </div>
  );
}
