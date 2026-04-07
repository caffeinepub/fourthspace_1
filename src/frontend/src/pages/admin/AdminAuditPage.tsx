import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowLeft, ClipboardList, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import type { AuditLog } from "../../types";

const ENTITY_COLORS: Record<string, string> = {
  note: "bg-indigo-500/10 text-indigo-600",
  project: "bg-orange-500/10 text-orange-600",
  task: "bg-orange-400/10 text-orange-500",
  channel: "bg-teal-500/10 text-teal-600",
  message: "bg-teal-400/10 text-teal-500",
  event: "bg-red-500/10 text-red-600",
  employee: "bg-green-500/10 text-green-600",
  payroll: "bg-green-400/10 text-green-500",
  escrow: "bg-yellow-500/10 text-yellow-600",
  wallet: "bg-pink-500/10 text-pink-600",
  backup: "bg-blue-500/10 text-blue-600",
  automation: "bg-purple-500/10 text-purple-600",
  user: "bg-primary/10 text-primary",
};

function getEntityColor(entityType: string): string {
  const key = entityType.toLowerCase();
  return ENTITY_COLORS[key] ?? "bg-muted text-muted-foreground";
}

export default function AdminAuditPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const [entityFilter, setEntityFilter] = useState<string>("All");

  const {
    data: logs,
    isLoading,
    refetch,
    isFetching: isRefetching,
  } = useQuery<AuditLog[]>({
    queryKey: ["auditLogs", tenantId],
    queryFn: async () =>
      actor ? actor.listAuditLogs(tenantId, BigInt(100)) : [],
    enabled: !!actor && !isFetching,
  });

  const entityTypes = logs
    ? ["All", ...Array.from(new Set(logs.map((l) => l.entityType))).sort()]
    : ["All"];

  const filtered = (logs ?? [])
    .filter((l) => entityFilter === "All" || l.entityType === entityFilter)
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/app/admin" })}
          aria-label="Back to admin"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
          <ClipboardList className="h-4 w-4 text-orange-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Audit Logs
          </h1>
          <p className="text-sm text-muted-foreground">
            All system activity, sorted newest first
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isRefetching}
          data-ocid="audit-refresh-btn"
          className="gap-1.5"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground">
          Filter by entity:
        </span>
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger
            className="h-8 w-[160px] text-sm"
            data-ocid="audit-entity-filter"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {entityTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!isLoading && (
          <span className="text-xs text-muted-foreground ml-auto">
            {filtered.length} entries
          </span>
        )}
      </div>

      {/* Logs Table */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <Skeleton key={n} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-4 bg-muted/40 px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Action</span>
            <span>Entity Type</span>
            <span>Entity ID</span>
            <span>User</span>
            <span>Time</span>
          </div>
          {filtered.map((log) => (
            <div
              key={log.id}
              className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-3 md:gap-4 items-start md:items-center border-t border-border bg-card px-5 py-3.5 hover:bg-muted/20 transition-smooth"
              data-ocid={`audit-log-${log.id}`}
            >
              {/* Action */}
              <div className="flex flex-col gap-1">
                <Badge variant="outline" className="w-fit text-xs font-mono">
                  {log.action}
                </Badge>
                {log.details && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {log.details}
                  </p>
                )}
              </div>
              {/* Entity Type */}
              <Badge
                className={`w-fit text-xs ${getEntityColor(log.entityType)}`}
              >
                {log.entityType}
              </Badge>
              {/* Entity ID */}
              <p className="text-xs text-muted-foreground font-mono truncate">
                {log.entityId.slice(0, 12)}...
              </p>
              {/* User */}
              <p className="text-xs text-muted-foreground font-mono truncate">
                {log.userId.toString().slice(0, 12)}...
              </p>
              {/* Timestamp */}
              <div>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(Number(log.timestamp) / 1_000_000)} ago
                </p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  {format(
                    new Date(Number(log.timestamp) / 1_000_000),
                    "MMM d, HH:mm",
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center"
          data-ocid="audit-empty"
        >
          <ClipboardList className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-semibold text-foreground">No audit logs yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            {entityFilter !== "All"
              ? `No activity for entity type "${entityFilter}".`
              : "Activity will be logged here as the workspace is used."}
          </p>
        </div>
      )}
    </div>
  );
}
