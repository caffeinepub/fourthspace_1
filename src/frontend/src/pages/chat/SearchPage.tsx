import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Hash, MessagesSquare, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import type { Channel, Message } from "../../types";

// ---- Helpers ----

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  const d = new Date(ms);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays === 0) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return d.toLocaleDateString([], { weekday: "short" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts: { text: string; isMatch: boolean; id: string }[] = [];
  let lastIndex = 0;
  let match = regex.exec(text);
  while (match !== null) {
    if (match.index > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, match.index),
        isMatch: false,
        id: `t${lastIndex}`,
      });
    }
    parts.push({ text: match[0], isMatch: true, id: `m${match.index}` });
    lastIndex = match.index + match[0].length;
    match = regex.exec(text);
  }
  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      isMatch: false,
      id: `t${lastIndex}`,
    });
  }
  return (
    <>
      {parts.map((p) =>
        p.isMatch ? (
          <mark
            key={p.id}
            className="bg-primary/20 text-primary rounded-sm px-0.5 not-italic"
          >
            {p.text}
          </mark>
        ) : (
          <span key={p.id}>{p.text}</span>
        ),
      )}
    </>
  );
}

function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max)}…`;
}

function senderInitials(id: string): string {
  return id.slice(0, 2).toUpperCase();
}

// ---- Sub-components ----

function ResultCard({
  message,
  channel,
  query,
  workspaceId,
}: {
  message: Message;
  channel?: Channel;
  query: string;
  workspaceId: string;
}) {
  const channelName = channel?.name ?? message.channelId;
  const preview = truncate(message.content, 200);
  const senderId = message.senderId.toString();

  return (
    <Link
      to="/app/$workspaceId/chat/$channelId"
      params={{ workspaceId, channelId: message.channelId }}
      data-ocid={`search-result-${message.id}`}
      className="flex gap-4 rounded-2xl border border-border bg-card p-4 transition-smooth hover:shadow-md hover:-translate-y-0.5 hover:border-teal-500/30 group"
    >
      <Avatar className="h-9 w-9 shrink-0 mt-0.5">
        <AvatarFallback className="bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold">
          {senderInitials(senderId)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="flex items-center gap-1 text-xs font-medium text-teal-600 dark:text-teal-400 shrink-0">
            <Hash className="h-3 w-3" />
            {channelName}
          </span>
          <span className="text-xs text-muted-foreground ml-auto shrink-0">
            {formatTimestamp(message.createdAt)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-1 truncate font-mono">
          {senderId.slice(0, 14)}…
        </p>
        <p className="text-sm text-foreground leading-relaxed break-words">
          {highlightMatch(preview, query)}
        </p>
      </div>
    </Link>
  );
}

function ResultSkeleton() {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-4">
      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

// ---- Main Page ----

export default function SearchPage() {
  const { workspaceId } = useParams({ from: "/app/$workspaceId/chat/search" });
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [senderFilter, setSenderFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleQueryChange = useCallback((val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(val);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const { data: channels } = useQuery<Channel[]>({
    queryKey: ["channels", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listChannels(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching,
  });

  const hasQuery = debouncedQuery.trim().length > 0;

  const fromTime: bigint | null = fromDate
    ? BigInt(new Date(fromDate).getTime()) * 1_000_000n
    : null;
  const toTime: bigint | null = toDate
    ? BigInt(new Date(`${toDate}T23:59:59`).getTime()) * 1_000_000n
    : null;
  const channelId: string | null =
    channelFilter !== "all" ? channelFilter : null;

  const {
    data: results,
    isLoading: isSearching,
    isFetching: isRefetching,
  } = useQuery<Message[]>({
    queryKey: [
      "searchMessages",
      tenantId,
      workspaceId,
      debouncedQuery,
      channelId,
      senderFilter,
      fromDate,
      toDate,
    ],
    queryFn: async () => {
      if (!actor || !debouncedQuery.trim()) return [];
      return actor.searchMessages(
        tenantId,
        workspaceId,
        debouncedQuery.trim(),
        channelId,
        null,
        fromTime,
        toTime,
      );
    },
    enabled: !!actor && !isFetching && hasQuery,
    staleTime: 15_000,
  });

  const channelMap = new Map<string, Channel>(
    (channels ?? []).map((c) => [c.id, c]),
  );

  const filteredResults = (results ?? []).filter((m) => {
    if (!senderFilter.trim()) return true;
    return m.senderId.toString().includes(senderFilter.trim());
  });

  const hasResults = filteredResults.length > 0;
  const searched = hasQuery && !isSearching && !isRefetching;

  function clearFilters() {
    setChannelFilter("all");
    setSenderFilter("");
    setFromDate("");
    setToDate("");
  }

  const hasActiveFilters =
    channelFilter !== "all" ||
    senderFilter.trim() !== "" ||
    fromDate !== "" ||
    toDate !== "";

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            navigate({
              to: "/app/$workspaceId/chat",
              params: { workspaceId },
            })
          }
          aria-label="Back to chat"
          data-ocid="search-back-btn"
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Message Search
          </h1>
          <p className="text-sm text-muted-foreground">
            Search across all channels
          </p>
        </div>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search messages…"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="pl-10 pr-10 h-11 text-base"
          data-ocid="search-input"
          autoFocus
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => {
              setQuery("");
              setDebouncedQuery("");
            }}
            aria-label="Clear search"
            data-ocid="search-clear-btn"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Filters
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 text-xs text-muted-foreground hover:text-foreground px-2"
              data-ocid="search-clear-filters-btn"
            >
              Clear filters
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Channel</Label>
            <Select
              value={channelFilter}
              onValueChange={setChannelFilter}
              data-ocid="search-channel-filter"
            >
              <SelectTrigger className="h-9" data-ocid="search-channel-trigger">
                <SelectValue placeholder="All channels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All channels</SelectItem>
                {(channels ?? []).map((ch) => (
                  <SelectItem key={ch.id} value={ch.id}>
                    #{ch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Sender (principal)</Label>
            <Input
              placeholder="Partial principal ID…"
              value={senderFilter}
              onChange={(e) => setSenderFilter(e.target.value)}
              className="h-9 text-sm font-mono"
              data-ocid="search-sender-filter"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">From date</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-9 text-sm"
              data-ocid="search-from-date"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">To date</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-9 text-sm"
              data-ocid="search-to-date"
            />
          </div>
        </div>
      </div>

      {/* Results area */}
      {!hasQuery ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="search-idle-state"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 mb-4">
            <MessagesSquare className="h-7 w-7 text-teal-500" />
          </div>
          <h3 className="font-display font-semibold text-foreground">
            Search your messages
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            Type a keyword above to search across all channels and
            conversations.
          </p>
        </div>
      ) : isSearching ? (
        <div className="space-y-3" data-ocid="search-loading-state">
          {[1, 2, 3, 4].map((n) => (
            <ResultSkeleton key={n} />
          ))}
        </div>
      ) : hasResults ? (
        <div className="space-y-3" data-ocid="search-results-list">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {filteredResults.length} result
              {filteredResults.length !== 1 ? "s" : ""} for{" "}
              <span className="font-medium text-foreground">
                "{debouncedQuery}"
              </span>
            </span>
            {channelFilter !== "all" && (
              <Badge
                variant="outline"
                className="text-xs gap-1 border-teal-500/30 text-teal-600 dark:text-teal-400"
              >
                <Hash className="h-2.5 w-2.5" />
                {channelMap.get(channelFilter)?.name ?? channelFilter}
              </Badge>
            )}
          </div>

          {filteredResults.map((msg) => (
            <ResultCard
              key={msg.id}
              message={msg}
              channel={channelMap.get(msg.channelId)}
              query={debouncedQuery}
              workspaceId={workspaceId}
            />
          ))}
        </div>
      ) : (
        searched && (
          <div
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center"
            data-ocid="search-empty-state"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
              <Search className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-foreground">
              No messages found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Try a different keyword, broaden your date range, or remove
              channel and sender filters.
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="mt-5 text-teal-600 border-teal-500/30 hover:bg-teal-50 dark:hover:bg-teal-950/30"
                data-ocid="search-empty-clear-btn"
              >
                Clear all filters
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="mt-3 text-muted-foreground"
              data-ocid="search-empty-back-btn"
            >
              <Link to="/app/$workspaceId/chat" params={{ workspaceId }}>
                Back to channels
              </Link>
            </Button>
          </div>
        )
      )}
    </div>
  );
}
