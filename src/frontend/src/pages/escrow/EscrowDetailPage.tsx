import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  Shield,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import { type EscrowContract, EscrowStatus } from "../../types";

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

function formatAmount(amount: bigint, currency: string): string {
  const num = Number(amount) / 100;
  return `${currency} ${num.toLocaleString("en-US", {
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

export default function EscrowDetailPage() {
  const { contractId } = useParams({ from: "/app/escrow/$contractId" });
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: contract, isLoading } = useQuery<EscrowContract | null>({
    queryKey: ["escrow", tenantId, contractId],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getEscrow(tenantId, contractId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled: !!actor && !isFetching,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["escrow", tenantId, contractId],
    });
    queryClient.invalidateQueries({ queryKey: ["escrows", tenantId] });
  };

  const fundMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.fundEscrow(tenantId, contractId);
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
      const r = await actor.releaseEscrow(tenantId, contractId);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Funds released to payee");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const disputeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.disputeEscrow(tenantId, contractId);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      toast.warning("Dispute raised");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.cancelEscrow(tenantId, contractId);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      toast.info("Escrow contract cancelled");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const isBusy =
    fundMutation.isPending ||
    releaseMutation.isPending ||
    disputeMutation.isPending ||
    cancelMutation.isPending;

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
          onClick={() => navigate({ to: "/app/escrow" })}
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

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/app/escrow" })}
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

      {/* Action buttons */}
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
                  <Button
                    variant="outline"
                    onClick={() => disputeMutation.mutate()}
                    disabled={isBusy}
                    data-ocid="escrow-dispute-btn"
                    className="gap-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    {disputeMutation.isPending ? "Raising..." : "Raise Dispute"}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
              <p
                className="text-xs text-foreground font-mono truncate"
                title={contract.payerId.toString()}
              >
                {contract.payerId.toString().slice(0, 24)}…
              </p>
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

      {/* Description */}
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

      {/* Conditions */}
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

      {/* Cross-links */}
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
  );
}
