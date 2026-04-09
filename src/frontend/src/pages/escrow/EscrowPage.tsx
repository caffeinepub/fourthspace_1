import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  AlertCircle,
  Clock,
  ExternalLink,
  Plus,
  Search,
  Shield,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { EscrowContract } from "../../types";
import { EscrowStatus } from "../../types";

const STATUS_TABS: { label: string; value: EscrowStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: EscrowStatus.Pending },
  { label: "Funded", value: EscrowStatus.Funded },
  { label: "Released", value: EscrowStatus.Released },
  { label: "Disputed", value: EscrowStatus.Disputed },
  { label: "Cancelled", value: EscrowStatus.Cancelled },
];

const STATUS_COLORS: Record<string, string> = {
  [EscrowStatus.Pending]: "bg-muted text-muted-foreground",
  [EscrowStatus.Funded]: "bg-primary/10 text-primary",
  [EscrowStatus.Released]: "bg-accent/10 text-accent-foreground",
  [EscrowStatus.Disputed]: "bg-destructive/10 text-destructive",
  [EscrowStatus.Cancelled]: "bg-muted text-muted-foreground",
};

function formatICP(e8s: bigint): string {
  return `${(Number(e8s) / 1e8).toFixed(4)} ICP`;
}

export default function EscrowPage() {
  const { workspaceId } = useParams({ strict: false }) as {
    workspaceId: string;
  };
  const { tenantId } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState<EscrowStatus | "all">("all");
  const [search, setSearch] = useState("");

  const { data: escrows = [], isLoading } = useQuery<EscrowContract[]>({
    queryKey: ["escrow", tenantId, workspaceId, activeStatus],
    queryFn: async () => {
      if (!actor) return [];
      const filter = activeStatus !== "all" ? { status: activeStatus } : null;
      return actor.listEscrows(tenantId, workspaceId, filter);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return escrows;
    const q = search.toLowerCase();
    return escrows.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.payeeId.toString().toLowerCase().includes(q) ||
        e.payerId.toString().toLowerCase().includes(q),
    );
  }, [escrows, search]);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground font-display">
              Escrow
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage agreements and milestone payments
            </p>
          </div>
        </div>
        <Button
          data-ocid="escrow-new-btn"
          onClick={() =>
            navigate({ to: `/app/${workspaceId}/escrow/new` as "/" })
          }
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          New Escrow
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          data-ocid="escrow-search"
          placeholder="Search by title or counterparty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Status tabs */}
      <div className="flex gap-0 overflow-x-auto border-b border-border">
        {STATUS_TABS.map((tab) => (
          <button
            type="button"
            key={tab.value}
            data-ocid={`escrow-tab-${tab.value}`}
            onClick={() => setActiveStatus(tab.value)}
            className={`px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors duration-200 ${
              activeStatus === tab.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {(["a", "b", "c", "d"] as const).map((k) => (
            <Skeleton key={k} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="escrow-empty-state"
          className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground font-display">
              No escrows found
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {search
                ? "Try a different search term."
                : "Create your first escrow agreement to get started."}
            </p>
          </div>
          {!search && (
            <Button
              onClick={() =>
                navigate({ to: `/app/${workspaceId}/escrow/new` as "/" })
              }
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              New Escrow
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((escrow) => (
            <EscrowRow
              key={escrow.id}
              escrow={escrow}
              workspaceId={workspaceId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EscrowRow({
  escrow,
  workspaceId,
}: { escrow: EscrowContract; workspaceId: string }) {
  const navigate = useNavigate();
  const createdDate = escrow.createdAt
    ? format(new Date(Number(escrow.createdAt) / 1_000_000), "MMM d, yyyy")
    : "—";

  return (
    <Card
      data-ocid={`escrow-row-${escrow.id}`}
      className="cursor-pointer hover:border-primary/40 transition-colors duration-200 group"
      onClick={() =>
        navigate({ to: `/app/${workspaceId}/escrow/${escrow.id}` as "/" })
      }
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors font-display text-sm">
                {escrow.title}
              </h3>
              <Badge
                className={`text-xs shrink-0 ${STATUS_COLORS[escrow.status] ?? "bg-muted text-muted-foreground"}`}
                variant="outline"
              >
                {escrow.status}
              </Badge>
              {escrow.status === EscrowStatus.Disputed && (
                <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
              )}
            </div>
            {escrow.description && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {escrow.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {formatICP(escrow.amount)}
              </p>
              <p className="text-xs text-muted-foreground">{escrow.currency}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>Created {createdDate}</span>
          {escrow.dueDate && (
            <>
              <span>·</span>
              <span>
                Due{" "}
                {format(
                  new Date(Number(escrow.dueDate) / 1_000_000),
                  "MMM d, yyyy",
                )}
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
