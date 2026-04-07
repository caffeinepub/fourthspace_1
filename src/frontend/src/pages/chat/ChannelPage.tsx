import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  CornerUpLeft,
  Globe,
  Hash,
  Link2,
  Lock,
  Send,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import type { Channel, Message } from "../../types";

// Derive sender initials from Principal string
function senderInitials(id: { toString(): string }): string {
  const s = id.toString();
  return s.slice(0, 2).toUpperCase();
}

// Color bucket based on principal string
const AVATAR_COLORS = [
  "bg-teal-500/20 text-teal-700 dark:text-teal-300",
  "bg-violet-500/20 text-violet-700 dark:text-violet-300",
  "bg-orange-500/20 text-orange-700 dark:text-orange-300",
  "bg-sky-500/20 text-sky-700 dark:text-sky-300",
  "bg-pink-500/20 text-pink-700 dark:text-pink-300",
];
function avatarColor(id: { toString(): string }): string {
  let hash = 0;
  const s = id.toString();
  for (let i = 0; i < s.length; i++)
    hash = (hash * 31 + s.charCodeAt(i)) & 0xffff;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

interface MessageBubbleProps {
  msg: Message;
  replyTarget?: Message;
  onReply: (msg: Message) => void;
}

function MessageBubble({ msg, replyTarget, onReply }: MessageBubbleProps) {
  const timestampMs = Number(msg.createdAt) / 1_000_000;
  return (
    <div
      className="group flex items-start gap-3 px-4 py-2 rounded-xl hover:bg-muted/30 transition-colors"
      data-ocid={`message-${msg.id}`}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(msg.senderId)}`}
      >
        {senderInitials(msg.senderId)}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">
            {msg.senderId.toString().slice(0, 10)}…
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(timestampMs, { addSuffix: true })}
          </span>
        </div>

        {/* Reply quote */}
        {replyTarget && (
          <div className="flex items-start gap-2 rounded-lg border-l-2 border-teal-500 bg-teal-500/5 px-3 py-1.5 text-xs text-muted-foreground">
            <CornerUpLeft className="h-3 w-3 shrink-0 mt-0.5 text-teal-500" />
            <span className="line-clamp-1">{replyTarget.content}</span>
          </div>
        )}

        <p className="text-sm text-foreground leading-relaxed">{msg.content}</p>

        {/* Cross links */}
        {msg.crossLinks.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {msg.crossLinks.map((link) => (
              <Badge
                key={link.entityId}
                variant="outline"
                className="text-xs gap-1 py-0"
              >
                <Link2 className="h-2.5 w-2.5" />
                {link.linkLabel || link.entityType}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Reply action */}
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        onClick={() => onReply(msg)}
        aria-label="Reply"
        data-ocid={`reply-btn-${msg.id}`}
      >
        <CornerUpLeft className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>
    </div>
  );
}

// Left info panel
function ChannelInfoPanel({ channel }: { channel: Channel }) {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card/60 p-4 space-y-4 shrink-0">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-teal-500" />
          <span className="font-display font-bold text-foreground text-sm">
            {channel.name}
          </span>
        </div>
        {channel.isPublic ? (
          <Badge
            variant="outline"
            className="text-xs gap-1 border-teal-500/30 text-teal-600 dark:text-teal-400"
          >
            <Globe className="h-2.5 w-2.5" />
            Public
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs gap-1">
            <Lock className="h-2.5 w-2.5" />
            Private
          </Badge>
        )}
        {channel.description && (
          <p className="text-xs text-muted-foreground pt-1 leading-relaxed">
            {channel.description}
          </p>
        )}
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          Members ({channel.memberIds.length})
        </div>
        <div className="space-y-1.5">
          {channel.memberIds.slice(0, 8).map((memberId) => (
            <div key={memberId.toString()} className="flex items-center gap-2">
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${avatarColor(memberId)}`}
              >
                {senderInitials(memberId)}
              </div>
              <span className="text-xs text-foreground truncate">
                {memberId.toString().slice(0, 12)}…
              </span>
            </div>
          ))}
          {channel.memberIds.length > 8 && (
            <p className="text-xs text-muted-foreground pl-8">
              +{channel.memberIds.length - 8} more
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

export default function ChannelPage() {
  const { channelId } = useParams({ from: "/app/chat/$channelId" });
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const [messageText, setMessageText] = useState("");
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const { data: channel } = useQuery<Channel | null>({
    queryKey: ["channel", tenantId, channelId],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getChannel(tenantId, channelId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled: !!actor && !isFetching,
  });

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["messages", tenantId, channelId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessages(tenantId, channelId, BigInt(50), null);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000,
  });

  // Build a map for reply lookup
  const messageMap = new Map<string, Message>(
    messages?.map((m) => [m.id, m]) ?? [],
  );

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.sendMessage(tenantId, {
        content: messageText.trim(),
        channelId,
        replyToId: replyTo?.id,
        crossLinks: [],
      });
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", tenantId, channelId],
      });
      setMessageText("");
      setReplyTo(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function handleSend() {
    if (!messageText.trim()) return;
    sendMutation.mutate();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape") setReplyTo(null);
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left info panel (lg+) */}
      {channel && <ChannelInfoPanel channel={channel} />}

      {/* Main chat area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <div className="flex h-14 items-center gap-3 border-b border-border bg-card px-4 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="Back to channels"
            data-ocid="channel-back-btn"
          >
            <Link to="/app/chat">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10">
            <Hash className="h-4 w-4 text-teal-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm truncate">
              {channel?.name ?? "Channel"}
            </p>
            <p className="text-xs text-muted-foreground">
              {channel?.memberIds.length ?? 0} members
            </p>
          </div>
          {/* Mobile member count */}
          <div className="flex items-center gap-1 text-muted-foreground lg:hidden">
            <Users className="h-3.5 w-3.5" />
            <span className="text-xs">{channel?.memberIds.length ?? 0}</span>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 py-2" data-ocid="messages-list">
          {isLoading ? (
            <div className="space-y-3 px-4 py-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-4 w-full max-w-xs" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages && messages.length > 0 ? (
            <div className="py-2">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  replyTarget={
                    msg.replyToId ? messageMap.get(msg.replyToId) : undefined
                  }
                  onReply={setReplyTo}
                />
              ))}
              <div
                ref={(el) => {
                  el?.scrollIntoView();
                }}
              />
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-24 text-center px-4"
              data-ocid="messages-empty"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 mb-3">
                <Hash className="h-6 w-6 text-teal-500" />
              </div>
              <p className="font-semibold text-foreground text-sm">
                Welcome to #{channel?.name}!
              </p>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                This is the beginning of the channel. Send a message to get the
                conversation started.
              </p>
            </div>
          )}
        </ScrollArea>

        {/* Input bar */}
        <div className="border-t border-border bg-card px-4 py-3 space-y-2 shrink-0">
          {/* Reply banner */}
          {replyTo && (
            <div className="flex items-center gap-2 rounded-lg border-l-2 border-teal-500 bg-teal-500/5 px-3 py-1.5">
              <CornerUpLeft className="h-3 w-3 text-teal-500 shrink-0" />
              <span className="text-xs text-muted-foreground flex-1 truncate">
                Replying to: {replyTo.content}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => setReplyTo(null)}
                aria-label="Cancel reply"
                data-ocid="cancel-reply-btn"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              placeholder={`Message #${channel?.name ?? "channel"}…`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              data-ocid="message-input"
              className="flex-1"
              autoComplete="off"
            />
            <Button
              onClick={handleSend}
              disabled={!messageText.trim() || sendMutation.isPending}
              className="bg-teal-600 hover:bg-teal-700 text-white shrink-0"
              data-ocid="message-send-btn"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
