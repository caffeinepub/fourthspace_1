import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  ExternalLink,
  Flag,
  Gavel,
  Layers,
  Shield,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type {
  EscrowDispute,
  EscrowMilestone,
  EscrowSummary,
} from "../../backend";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import { type EscrowContract, EscrowStatus } from "../../types";

// Use backend types directly for variant checks
import { DisputeStatus as DS, MilestoneStatus__1 as MS } from "../../backend";

interface StatusCfg {
  label: string;
  className: string;
  icon: React.ElementType;
  description: string;
}

const STATUS_CONFIG: Record<EscrowStatus, StatusCfg> = {
  [EscrowStatus.Pending]: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    icon: Clock,
    description: "Awaiting funding by the payer",
  },
  [EscrowStatus.Funded]: {
    label: "Funded",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: DollarSign,
    description: "Funds are held in escrow",
  },
  [EscrowStatus.Released]: {
    label: "Released",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle2,
    description: "Funds have been released to payee",
  },
  [EscrowStatus.Disputed]: {
    label: "Disputed",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: AlertTriangle,
    description: "Contract is under dispute",
  },
  [EscrowStatus.Cancelled]: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground",
    icon: XCircle,
    description: "Contract has been cancelled",
  },
};

const TIMELINE_STEPS: EscrowStatus[] = [
  EscrowStatus.Pending,
  EscrowStatus.Funded,
  EscrowStatus.Released,
];

function formatAmount(amount: bigint, currency?: string): string {
  const num = Number(amount) / 100;
  const curr = currency ?? "USD";
  return `${curr} ${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatusTimeline({ status }: { status: EscrowStatus }) {
  const isDisputed = status === EscrowStatus.Disputed;
  const isCancelled = status === EscrowStatus.Cancelled;

  if (isDisputed || isCancelled) {
    const Icon = isDisputed ? AlertTriangle : XCircle;
    const color = isDisputed ? "text-red-500" : "text-muted-foreground";
    const bg = isDisputed ? "bg-red-50 dark:bg-red-900/20" : "bg-muted";
    return (
      <div className={`flex items-center gap-3 rounded-xl p-4 ${bg}`}>
        <Icon className={`h-5 w-5 shrink-0 ${color}`} />
        <p className={`text-sm font-medium ${color}`}>
          {isDisputed
            ? "This contract is under dispute"
            : "This contract was cancelled"}
        </p>
      </div>
    );
  }

  const currentIdx = TIMELINE_STEPS.indexOf(status);

  return (
    <div className="flex items-center">
      {TIMELINE_STEPS.map((s, idx) => {
        const cfg = STATUS_CONFIG[s];
        const Icon = cfg.icon;
        const isPast = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isFuture = idx > currentIdx;

        return (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-smooth ${
                  isPast
                    ? "border-amber-500 bg-amber-500 text-white"
                    : isCurrent
                      ? "border-amber-500 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                      : "border-border bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span
                className={`text-[10px] font-medium whitespace-nowrap ${
                  isFuture ? "text-muted-foreground" : "text-foreground"
                }`}
              >
                {cfg.label}
              </span>
            </div>
            {idx < TIMELINE_STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 mb-4 rounded-full transition-smooth ${
                  isPast ? "bg-amber-500" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

const MILESTONE_STATUS_STYLES: Record<MS, string> = {
  [MS.Pending]:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  [MS.Approved]:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  [MS.Releasing]:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  [MS.Released]:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

type TabId = "overview" | "milestones" | "timeline" | "dispute";

export default function EscrowDetailPage() {
  const { escrowId: contractId } = useParams({
    from: "/app/$workspaceId/escrow/$escrowId",
  });
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get current user identity to determine if they are the payer
  const { identity } = useInternetIdentity();
  const currentPrincipalText = identity?.getPrincipal().toString() ?? "";

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [disputeReason, setDisputeReason] = useState("");
  const [arbiterPrincipal, setArbiterPrincipal] = useState("");
  const [disputeResolution, setDisputeResolution] = useState("");
  const [showDisputeForm, setShowDisputeForm] = useState(false);

  const { data: contract, isLoading } = useQuery<EscrowContract | null>({
    queryKey: ["escrow", tenantId, workspaceId, contractId],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getEscrow(tenantId, workspaceId, contractId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const { data: milestones } = useQuery<EscrowMilestone[]>({
    queryKey: ["escrowMilestones", tenantId, workspaceId, contractId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEscrowMilestones(tenantId, workspaceId, contractId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const { data: disputes } = useQuery<EscrowDispute[]>({
    queryKey: ["escrowDisputes", tenantId, workspaceId, contractId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEscrowDisputes(tenantId, workspaceId, contractId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const { data: summary } = useQuery<EscrowSummary | null>({
    queryKey: ["escrowSummary", tenantId, workspaceId, contractId],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getEscrowSummary(tenantId, workspaceId, contractId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled:
      !!actor && !isFetching && !!workspaceId && activeTab === "overview",
  });

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["escrow", tenantId, workspaceId, contractId],
    });
    queryClient.invalidateQueries({
      queryKey: ["escrows", tenantId, workspaceId],
    });
    queryClient.invalidateQueries({
      queryKey: ["escrowMilestones", tenantId, workspaceId, contractId],
    });
    queryClient.invalidateQueries({
      queryKey: ["escrowDisputes", tenantId, workspaceId, contractId],
    });
  };

  const fundMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.fundEscrow(tenantId, workspaceId, contractId);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Escrow funded successfully");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const releaseMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.releaseEscrow(tenantId, workspaceId, contractId);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Funds released to payee");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.cancelEscrow(tenantId, workspaceId, contractId);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      toast.info("Escrow contract cancelled");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const approveMilestoneMutation = useMutation({
    mutationFn: async (milestoneId: string) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.approveMilestone(
        tenantId,
        workspaceId,
        milestoneId,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Milestone approved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const releaseMilestoneMutation = useMutation({
    mutationFn: async (milestoneId: string) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.releaseMilestoneFunds(
        tenantId,
        workspaceId,
        milestoneId,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Milestone funds released");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const raiseDisputeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.raiseEscrowDispute(
        tenantId,
        workspaceId,
        contractId,
        disputeReason,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      toast.warning("Dispute raised");
      setShowDisputeForm(false);
      setDisputeReason("");
      setArbiterPrincipal("");
      setActiveTab("dispute");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const resolveDisputeMutation = useMutation({
    mutationFn: async (disputeId: string) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.resolveDispute(
        tenantId,
        workspaceId,
        disputeId,
        disputeResolution,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Dispute resolved");
      setDisputeResolution("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const isBusy =
    fundMutation.isPending ||
    releaseMutation.isPending ||
    cancelMutation.isPending ||
    raiseDisputeMutation.isPending;

  function handleDownloadSummary() {
    if (!summary) {
      toast.error("Summary not available");
      return;
    }
    const lines = [
      "Escrow Summary",
      "==============",
      `Title: ${summary.title}`,
      `Status: ${summary.status}`,
      `Amount: ${summary.currency} ${(Number(summary.amount) / 100).toFixed(2)}`,
      `Payer: ${summary.payerId}`,
      `Payee: ${summary.payeeId}`,
      `Created: ${new Date(Number(summary.createdAt) / 1_000_000).toLocaleString("en-US")}`,
      `Milestone Count: ${Number(summary.milestoneCount)}`,
      "",
      "Conditions:",
      ...summary.conditions.map((c, i) => `  ${i + 1}. ${c}`),
      "",
      "Status History:",
      ...summary.statusHistory.map(
        (h) =>
          `  ${h.status} — ${new Date(Number(h.timestamp) / 1_000_000).toLocaleString("en-US")} by ${h.changedBy.toString()}`,
      ),
    ];
    const text = lines.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `escrow-${contractId.slice(0, 8)}-summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Summary downloaded");
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto text-center py-20">
        <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="font-semibold text-foreground">Contract not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate({ to: `/app/${workspaceId}/escrow` })}
        >
          Back to Escrow
        </Button>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[contract.status];
  const StatusIcon = cfg.icon;
  const isTerminal =
    contract.status === EscrowStatus.Released ||
    contract.status === EscrowStatus.Cancelled;
  const milestoneList = milestones ?? [];
  const disputeList = disputes ?? [];
  const openDispute = disputeList.find((d) => d.status === DS.Open) ?? null;

  // The payer is the creator of the escrow — only they can approve milestones
  const isPayer =
    currentPrincipalText.length > 0 &&
    contract.payerId.toString() === currentPrincipalText;

  const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: Shield },
    {
      id: "milestones",
      label: `Milestones${milestoneList.length > 0 ? ` (${milestoneList.length})` : ""}`,
      icon: Layers,
    },
    { id: "timeline", label: "Status History", icon: Clock },
    {
      id: "dispute",
      label: `Dispute${disputeList.length > 0 ? ` (${disputeList.length})` : ""}`,
      icon: Gavel,
    },
  ];

  return (
    <div className="animate-fade-in-up p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: `/app/${workspaceId}/escrow` })}
          aria-label="Back to escrow"
          className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-smooth shrink-0"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-xl font-bold text-foreground truncate">
              {contract.title}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}
            >
              <StatusIcon className="h-3 w-3" />
              {cfg.label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {cfg.description}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadSummary}
          disabled={!summary}
          data-ocid="escrow-download-summary"
          className="shrink-0 gap-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          Summary
        </Button>
      </div>

      {/* Amount hero */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 p-6 text-white shadow-lg">
        <p className="text-sm font-medium text-white/80 mb-1">
          Contract Amount
        </p>
        <p className="font-display text-4xl font-bold tracking-tight">
          {formatAmount(contract.amount, contract.currency)}
        </p>
        {contract.dueDate && (
          <p className="text-sm text-white/70 mt-2 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Due {formatDate(contract.dueDate)}
          </p>
        )}
      </div>

      {/* Action buttons — visible to all workspace members for viewing context, but only payer can trigger fund/release */}
      {!isTerminal && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {contract.status === EscrowStatus.Pending && (
                <>
                  <Button
                    onClick={() => fundMutation.mutate()}
                    disabled={isBusy}
                    data-ocid="escrow-fund-btn"
                    className="bg-amber-500 hover:bg-amber-600 text-white gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    {fundMutation.isPending ? "Funding..." : "Fund Escrow"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => cancelMutation.mutate()}
                    disabled={isBusy}
                    data-ocid="escrow-cancel-contract-btn"
                    className="gap-2 border-destructive/40 text-destructive hover:bg-destructive/10"
                  >
                    <XCircle className="h-4 w-4" />
                    {cancelMutation.isPending ? "Cancelling..." : "Cancel"}
                  </Button>
                </>
              )}
              {contract.status === EscrowStatus.Funded && (
                <>
                  <Button
                    onClick={() => releaseMutation.mutate()}
                    disabled={isBusy}
                    data-ocid="escrow-release-btn"
                    className="bg-green-600 hover:bg-green-700 text-white gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {releaseMutation.isPending
                      ? "Releasing..."
                      : "Release Funds"}
                  </Button>
                  {!openDispute && (
                    <Button
                      variant="outline"
                      onClick={() => setShowDisputeForm(!showDisputeForm)}
                      disabled={isBusy}
                      data-ocid="escrow-dispute-btn"
                      className="gap-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Flag className="h-4 w-4" />
                      Raise Dispute
                    </Button>
                  )}
                </>
              )}
            </div>
            {/* Inline dispute form */}
            {showDisputeForm && (
              <div className="mt-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10 p-4 space-y-3">
                <p className="text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Raise a Dispute
                </p>
                <div className="space-y-1.5">
                  <Label htmlFor="dispute-reason" className="text-xs">
                    Reason <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="dispute-reason"
                    placeholder="Describe the reason for the dispute..."
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    rows={3}
                    data-ocid="dispute-reason-textarea"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="arbiter-principal" className="text-xs">
                    Arbiter Principal ID{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="arbiter-principal"
                    placeholder="Enter arbiter's principal ID"
                    value={arbiterPrincipal}
                    onChange={(e) => setArbiterPrincipal(e.target.value)}
                    className="font-mono text-xs"
                    data-ocid="arbiter-principal-input"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => raiseDisputeMutation.mutate()}
                    disabled={
                      !disputeReason.trim() || raiseDisputeMutation.isPending
                    }
                    className="bg-red-600 hover:bg-red-700 text-white"
                    data-ocid="dispute-submit-btn"
                  >
                    {raiseDisputeMutation.isPending
                      ? "Submitting..."
                      : "Submit Dispute"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowDisputeForm(false);
                      setDisputeReason("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                data-ocid={`escrow-tab-${tab.id}`}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-smooth whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-amber-500 text-amber-600 dark:text-amber-400"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <TabIcon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Status timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground">
                Status Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StatusTimeline status={contract.status} />
            </CardContent>
          </Card>

          {/* Details grid */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-amber-500" />
                  Parties
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                    Payer
                  </p>
                  <div className="flex items-center gap-1.5">
                    <p
                      className="text-xs text-foreground font-mono truncate"
                      title={contract.payerId.toString()}
                    >
                      {contract.payerId.toString().slice(0, 24)}…
                    </p>
                    {isPayer && (
                      <span className="shrink-0 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 rounded px-1.5 py-0.5">
                        You
                      </span>
                    )}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                    Payee
                  </p>
                  <p
                    className="text-xs text-foreground font-mono truncate"
                    title={contract.payeeId.toString()}
                  >
                    {contract.payeeId.toString().slice(0, 24)}…
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                    Created
                  </p>
                  <p className="text-sm text-foreground">
                    {formatDate(contract.createdAt)}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                    Due Date
                  </p>
                  <p className="text-sm text-foreground">
                    {contract.dueDate ? formatDate(contract.dueDate) : "—"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {contract.description && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed">
                  {contract.description}
                </p>
              </CardContent>
            </Card>
          )}

          {contract.conditions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-500" />
                  Release Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {contract.conditions.map((cond, idx) => (
                    <li
                      key={`cond-${cond.slice(0, 20)}-${idx}`}
                      className="flex gap-3 text-sm text-foreground"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{cond}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {contract.crossLinks.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-amber-500" />
                  Cross-Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {contract.crossLinks.map((link, idx) => (
                    <Badge
                      key={`${link.entityType}-${link.entityId}-${idx}`}
                      variant="secondary"
                      className="gap-1.5 py-1 px-2.5 text-xs"
                    >
                      <span className="capitalize text-muted-foreground">
                        {link.entityType}:
                      </span>
                      <span className="font-medium">{link.linkLabel}</span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tab: Milestones — visible to all workspace members, approve only for payer */}
      {activeTab === "milestones" && (
        <div className="space-y-3">
          {milestoneList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-12 text-center">
              <Layers className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                No milestones for this contract
              </p>
            </div>
          ) : (
            milestoneList.map((milestone) => (
              <Card key={milestone.id}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm text-foreground truncate">
                          {milestone.title}
                        </p>
                        <Badge
                          className={`text-[10px] px-1.5 py-0.5 ${MILESTONE_STATUS_STYLES[milestone.status]}`}
                          variant="secondary"
                        >
                          {milestone.status}
                        </Badge>
                      </div>
                      {milestone.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {milestone.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Created {formatDate(milestone.createdAt)}
                      </p>
                    </div>
                    <div className="text-right shrink-0 space-y-2">
                      <p className="font-bold text-sm text-amber-600 dark:text-amber-400">
                        {formatAmount(milestone.amount, contract.currency)}
                      </p>
                      <div className="flex gap-1.5 justify-end">
                        {/* Approve milestone — payer only */}
                        {milestone.status === MS.Pending && isPayer && (
                          <Button
                            size="sm"
                            onClick={() =>
                              approveMilestoneMutation.mutate(milestone.id)
                            }
                            disabled={approveMilestoneMutation.isPending}
                            className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                            data-ocid={`milestone-approve-${milestone.id}`}
                          >
                            Approve
                          </Button>
                        )}
                        {/* Show pending indicator to non-payers */}
                        {milestone.status === MS.Pending && !isPayer && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            Awaiting payer
                          </span>
                        )}
                        {milestone.status === MS.Approved && (
                          <Button
                            size="sm"
                            onClick={() =>
                              releaseMilestoneMutation.mutate(milestone.id)
                            }
                            disabled={releaseMilestoneMutation.isPending}
                            className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                            data-ocid={`milestone-release-${milestone.id}`}
                          >
                            Release Funds
                          </Button>
                        )}
                        {milestone.status === MS.Released && (
                          <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Released
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Tab: Status History — visible to all workspace members */}
      {activeTab === "timeline" && (
        <div>
          {!summary && (
            <div className="space-y-0">
              <div className="relative pl-8">
                <div className="absolute left-0 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white">
                  <StatusIcon className="h-3 w-3" />
                </div>
                <div className="pb-4 border-b border-border last:border-0">
                  <p className="text-sm font-semibold text-foreground">
                    {cfg.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Current status
                  </p>
                </div>
              </div>
              <div className="relative pl-8 mt-3">
                <div className="absolute left-0 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-muted border border-border">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="pb-4">
                  <p className="text-sm font-semibold text-foreground">
                    Created
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(contract.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Full status history from summary */}
          {summary && summary.statusHistory.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-amber-500" />
                  Full Status History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {summary.statusHistory.map((h, idx) => (
                    <div
                      key={`${h.status}-${idx}`}
                      className="flex items-start gap-3 py-2 border-b border-border last:border-0"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 shrink-0 mt-0.5">
                        <Clock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {h.status}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            Number(h.timestamp) / 1_000_000,
                          ).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                        <p
                          className="text-xs text-muted-foreground font-mono truncate"
                          title={h.changedBy.toString()}
                        >
                          {h.changedBy.toString().slice(0, 24)}…
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tab: Dispute — visible to all workspace members */}
      {activeTab === "dispute" && (
        <div className="space-y-4">
          {disputeList.length === 0 && !showDisputeForm ? (
            <div className="rounded-2xl border border-dashed border-border py-12 text-center">
              <Gavel className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                No disputes for this contract
              </p>
              {contract.status === EscrowStatus.Funded && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDisputeForm(true)}
                  className="mt-4 gap-1.5 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  data-ocid="dispute-raise-btn"
                >
                  <Flag className="h-3.5 w-3.5" />
                  Raise Dispute
                </Button>
              )}
            </div>
          ) : (
            disputeList.map((dispute) => (
              <Card
                key={dispute.id}
                className={
                  dispute.status === DS.Open
                    ? "border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10"
                    : ""
                }
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Gavel className="h-4 w-4 text-red-500" />
                      Dispute
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className={
                        dispute.status === DS.Open
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }
                    >
                      {dispute.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                      Reason
                    </p>
                    <p className="text-sm text-foreground">{dispute.reason}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                        Raised By
                      </p>
                      <p
                        className="text-xs text-foreground font-mono truncate"
                        title={dispute.raisedBy.toString()}
                      >
                        {dispute.raisedBy.toString().slice(0, 18)}…
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                        Date
                      </p>
                      <p className="text-xs text-foreground">
                        {formatDateTime(dispute.createdAt)}
                      </p>
                    </div>
                  </div>
                  {dispute.arbiter && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                        Arbiter
                      </p>
                      <p className="text-xs text-foreground font-mono truncate">
                        {dispute.arbiter.toString().slice(0, 24)}…
                      </p>
                    </div>
                  )}
                  {dispute.resolution && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                        Resolution
                      </p>
                      <p className="text-sm text-foreground">
                        {dispute.resolution}
                      </p>
                    </div>
                  )}
                  {dispute.status === DS.Open && (
                    <div className="pt-2 space-y-2">
                      <Separator />
                      <p className="text-xs font-medium text-foreground">
                        Resolve Dispute (Arbiter only)
                      </p>
                      <Textarea
                        placeholder="Enter resolution details..."
                        value={disputeResolution}
                        onChange={(e) => setDisputeResolution(e.target.value)}
                        rows={2}
                        data-ocid="dispute-resolution-textarea"
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          resolveDisputeMutation.mutate(dispute.id)
                        }
                        disabled={
                          !disputeResolution.trim() ||
                          resolveDisputeMutation.isPending
                        }
                        className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                        data-ocid="dispute-resolve-btn"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {resolveDisputeMutation.isPending
                          ? "Resolving..."
                          : "Resolve Dispute"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}

          {/* Inline raise form in dispute tab */}
          {showDisputeForm && disputeList.length === 0 && (
            <Card className="border-red-200 dark:border-red-800">
              <CardContent className="pt-4 space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="dispute-reason-tab" className="text-xs">
                    Reason *
                  </Label>
                  <Textarea
                    id="dispute-reason-tab"
                    placeholder="Describe the reason..."
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    rows={3}
                    data-ocid="dispute-reason-tab-textarea"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => raiseDisputeMutation.mutate()}
                    disabled={
                      !disputeReason.trim() || raiseDisputeMutation.isPending
                    }
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {raiseDisputeMutation.isPending
                      ? "Submitting..."
                      : "Submit"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowDisputeForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
