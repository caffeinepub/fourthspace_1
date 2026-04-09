import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft, FileSearch, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { AuditLogEntry } from "../../types";

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-primary/10 text-primary",
  APPROVE: "bg-accent/10 text-accent-foreground",
  REJECT: "bg-destructive/10 text-destructive",
  PROCESS: "bg-secondary/10 text-secondary-foreground",
  UPDATE: "bg-muted text-muted-foreground",
};

function getActionColor(action: string): string {
  const upper = action.toUpperCase();
  for (const [key, val] of Object.entries(ACTION_COLORS)) {
    if (upper.includes(key)) return val;
  }
  return "bg-muted text-muted-foreground";
}

function formatTs(ts: bigint): string {
  return format(new Date(Number(ts) / 1_000_000), "MMM d, yyyy HH:mm:ss");
}

export default function AuditLogPage() {
  const { workspaceId } = useParams({ strict: false }) as {
    workspaceId: string;
  };
  const { tenantId } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [limit] = useState(50);

  const {
    data: entries = [],
    isLoading,
    refetch,
  } = useQuery<AuditLogEntry[]>({
    queryKey: ["payrollAuditLog", tenantId, workspaceId, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPayrollAuditLog(tenantId, workspaceId, BigInt(limit));
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (e) =>
        e.action.toLowerCase().includes(q) ||
        e.entityType.toLowerCase().includes(q) ||
        e.details.toLowerCase().includes(q) ||
        e.entityId.toLowerCase().includes(q),
    );
  }, [entries, search]);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              navigate({ to: `/app/${workspaceId}/payroll` as "/" })
            }
            data-ocid="audit-log-back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileSearch className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold font-display text-foreground">
                Payroll Audit Log
              </h1>
              <p className="text-sm text-muted-foreground">
                {entries.length} entr{entries.length !== 1 ? "ies" : "y"} — full
                history
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          data-ocid="audit-log-refresh"
          className="gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          data-ocid="audit-log-search"
          placeholder="Search by action, entity type, or details..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {(["a", "b", "c", "d", "e"] as const).map((k) => (
            <Skeleton key={k} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="audit-log-empty"
          className="flex flex-col items-center justify-center py-16 gap-3 text-center rounded-lg border border-dashed border-border"
        >
          <FileSearch className="w-10 h-10 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground font-display">
              No audit log entries
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {search
                ? "Try a different search."
                : "Payroll actions will appear here."}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {filtered.map((entry) => (
            <AuditEntry key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

function AuditEntry({ entry }: { entry: AuditLogEntry }) {
  return (
    <Card
      data-ocid={`audit-entry-${entry.id}`}
      className="hover:bg-muted/20 transition-colors"
    >
      <CardContent className="p-4 flex items-start gap-3">
        <Badge
          variant="outline"
          className={`text-xs shrink-0 mt-0.5 ${getActionColor(entry.action)}`}
        >
          {entry.action}
        </Badge>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-foreground">
              {entry.entityType}
            </p>
            <span className="text-xs font-mono text-muted-foreground">
              #{entry.entityId.slice(0, 8)}
            </span>
          </div>
          {entry.details && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {entry.details}
            </p>
          )}
          <p className="text-xs font-mono text-muted-foreground mt-1">
            By: {entry.performedBy.toString().slice(0, 20)}…
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            {formatTs(entry.timestamp)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
