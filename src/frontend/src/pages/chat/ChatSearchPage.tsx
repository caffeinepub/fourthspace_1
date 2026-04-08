import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchMessages } from "@/hooks/useChat";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  MessageSquare,
  Search as SearchIcon,
} from "lucide-react";
import { useState } from "react";

const SKELETON_IDS = ["sk-a", "sk-b", "sk-c", "sk-d"];

function formatTs(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleString();
}

export default function ChatSearchPage() {
  const { tenantId } = useWorkspace();
  const { workspaceId } = useParams({ strict: false }) as {
    workspaceId: string;
  };
  const [query, setQuery] = useState("");

  const { data: results = [], isLoading } = useSearchMessages(
    tenantId,
    workspaceId ?? "",
    query,
  );

  return (
    <div className="flex flex-col h-full bg-background animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border/60 bg-card/90 backdrop-blur-subtle shadow-sm">
        <Link
          to="/app/$workspaceId/chat"
          params={{ workspaceId: workspaceId ?? "" }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Back to chat"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="relative flex-1 max-w-xl">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search messages…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-9 text-sm border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
            autoFocus
            data-ocid="chat-search-input"
          />
        </div>
      </div>

      {/* Results */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-2"
        data-ocid="chat-search-results"
      >
        {isLoading &&
          query &&
          SKELETON_IDS.map((id) => (
            <div
              key={id}
              className="flex gap-3 p-3 rounded-xl border border-border/50 bg-card"
            >
              <Skeleton className="h-7 w-7 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3.5 w-full" />
              </div>
            </div>
          ))}

        {!isLoading && query && results.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-ocid="chat-search-empty"
          >
            <div className="rounded-2xl bg-muted/50 p-5 mb-3">
              <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground">
              No messages found
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              No results for "{query}"
            </p>
          </div>
        )}

        {!query && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-2xl bg-muted/50 p-5 mb-3">
              <SearchIcon className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Search all messages
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Type to search across all channels
            </p>
          </div>
        )}

        {results.map((msg) => (
          <Link
            key={msg.id}
            to="/app/$workspaceId/chat/$channelId"
            params={{
              workspaceId: workspaceId ?? "",
              channelId: msg.channelId,
            }}
            className="block"
          >
            <div
              className="flex gap-3 p-3 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-colors cursor-pointer card-interactive"
              data-ocid={`search-result-${msg.id}`}
            >
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MessageSquare className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground shrink-0">
                    #{msg.channelId.slice(0, 8)}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                    <Clock className="h-2.5 w-2.5 shrink-0" />
                    {formatTs(msg.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-foreground line-clamp-2 leading-relaxed">
                  {msg.content}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
