import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bold,
  Code,
  CornerDownRight,
  Italic,
  Link2,
  List,
  MessageSquare,
  Send,
  Smile,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import type { Message, Reaction } from "../../types";

// ─── Avatar helpers ──────────────────────────────────────────────────────────

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

function senderInitials(id: { toString(): string }): string {
  return id.toString().slice(0, 2).toUpperCase();
}

function formatRelativeTime(createdAt: bigint): string {
  const ms = Number(createdAt) / 1_000_000;
  const diffMs = Date.now() - ms;
  if (diffMs < 60_000) return "just now";
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)}m ago`;
  const d = new Date(ms);
  const today = new Date();
  if (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  ) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

// ─── Emoji quick-pick ────────────────────────────────────────────────────────

const QUICK_EMOJIS = ["👍", "❤️", "😂", "🎉", "🔥", "👀", "✅", "🙏"];

// ─── ThreadMessage ────────────────────────────────────────────────────────────

interface ThreadMessageProps {
  msg: Message;
  isParent?: boolean;
  onReact: (messageId: string, emoji: string) => void;
  myPrincipal: string;
}

function ThreadMessage({
  msg,
  isParent,
  onReact,
  myPrincipal,
}: ThreadMessageProps) {
  const [showPicker, setShowPicker] = useState(false);
  const reactions: Reaction[] =
    (msg as Message & { reactions?: Reaction[] }).reactions ?? [];

  return (
    <div
      className={`group relative flex items-start gap-3 px-4 py-3 rounded-xl transition-colors ${isParent ? "bg-muted/30 border border-border" : "hover:bg-muted/20"}`}
      data-ocid={`thread-msg-${msg.id}`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(msg.senderId)}`}
      >
        {senderInitials(msg.senderId)}
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-foreground">
            {msg.senderId.toString().slice(0, 10)}…
          </span>
          {isParent && (
            <Badge variant="outline" className="text-[10px] py-0 px-1.5">
              Original
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(msg.createdAt)}
          </span>
        </div>

        {msg.crossLinks.length > 0 && (
          <div className="flex flex-wrap gap-1">
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

        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
          {msg.content}
        </p>

        {reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {reactions.map((r) => {
              const isOwn = r.userIds.some((u) => u.toString() === myPrincipal);
              return (
                <button
                  key={r.emoji}
                  type="button"
                  onClick={() => onReact(msg.id, r.emoji)}
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors ${
                    isOwn
                      ? "border-teal-500/60 bg-teal-500/10 text-teal-700 dark:text-teal-300"
                      : "border-border bg-muted/40 hover:bg-muted/70"
                  }`}
                  data-ocid={`reaction-${msg.id}-${r.emoji}`}
                >
                  <span>{r.emoji}</span>
                  <span className="font-medium text-muted-foreground">
                    {r.userIds.length}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="absolute right-3 top-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            aria-label="React"
            data-ocid={`react-btn-${msg.id}`}
            onClick={() => setShowPicker((p) => !p)}
          >
            <Smile className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          {showPicker && (
            <div className="absolute right-0 top-7 z-50 flex gap-1 rounded-xl border border-border bg-card p-2 shadow-lg">
              {QUICK_EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  className="rounded-lg p-1 text-base hover:bg-muted/60 transition-colors"
                  onClick={() => {
                    onReact(msg.id, em);
                    setShowPicker(false);
                  }}
                  data-ocid={`emoji-pick-${em}`}
                >
                  {em}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Formatting toolbar ───────────────────────────────────────────────────────

interface FormatToolbarProps {
  onFormat: (prefix: string, suffix?: string) => void;
}

function FormatToolbar({ onFormat }: FormatToolbarProps) {
  return (
    <div className="flex items-center gap-0.5 px-1">
      {[
        {
          icon: <Bold className="h-3 w-3" />,
          title: "Bold (Ctrl+B)",
          prefix: "**",
          suffix: "**",
          ocid: "fmt-bold",
          label: "Bold",
        },
        {
          icon: <Italic className="h-3 w-3" />,
          title: "Italic (Ctrl+I)",
          prefix: "_",
          suffix: "_",
          ocid: "fmt-italic",
          label: "Italic",
        },
        {
          icon: <Code className="h-3 w-3" />,
          title: "Inline code",
          prefix: "`",
          suffix: "`",
          ocid: "fmt-code",
          label: "Code",
        },
        {
          icon: <List className="h-3 w-3" />,
          title: "Bullet list",
          prefix: "• ",
          suffix: undefined,
          ocid: "fmt-list",
          label: "Bullet list",
        },
      ].map((t) => (
        <Button
          key={t.ocid}
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          title={t.title}
          onClick={() => onFormat(t.prefix, t.suffix)}
          data-ocid={t.ocid}
          type="button"
          aria-label={t.label}
        >
          {t.icon}
        </Button>
      ))}
    </div>
  );
}

// ─── ThreadPage ───────────────────────────────────────────────────────────────

export default function ThreadPage() {
  const { workspaceId, channelId, messageId } = useParams({
    strict: false,
  }) as {
    workspaceId: string;
    channelId: string;
    messageId: string;
  };
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const { identity } = useInternetIdentity();

  // Derive myPrincipal from Internet Identity
  const myPrincipal = identity?.getPrincipal().toText() ?? "";

  const [replyText, setReplyText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Fetch parent message ──────────────────────────────────────────────────
  const { data: parentMessage } = useQuery<Message | null>({
    queryKey: ["message-parent", tenantId, workspaceId, channelId, messageId],
    queryFn: async () => {
      if (!actor) return null;
      const msgs = await actor.getMessages(
        tenantId,
        workspaceId,
        channelId,
        BigInt(200),
        null,
      );
      return msgs.find((m) => m.id === messageId) ?? null;
    },
    enabled: !!actor && !isFetching && !!workspaceId,
    staleTime: 10_000,
  });

  // ── Fetch thread replies (poll every 3s) ──────────────────────────────────
  const { data: threadMessages, isLoading } = useQuery<Message[]>({
    queryKey: ["thread-messages", tenantId, workspaceId, messageId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getThreadMessages(tenantId, workspaceId, messageId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
    refetchInterval: 3000,
  });

  // ── Auto-scroll on new replies ──────────────────────────────────────────────
  const prevCountRef = useRef(0);
  useEffect(() => {
    const count = threadMessages?.length ?? 0;
    if (count !== prevCountRef.current) {
      prevCountRef.current = count;
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [threadMessages]);

  // ── Send reply ────────────────────────────────────────────────────────────
  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.sendMessage(tenantId, workspaceId, {
        content: replyText.trim(),
        channelId,
        replyToId: messageId,
        crossLinks: [],
      });
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["thread-messages", tenantId, workspaceId, messageId],
      });
      queryClient.invalidateQueries({
        queryKey: ["messages", tenantId, workspaceId, channelId],
      });
      queryClient.invalidateQueries({
        queryKey: ["unreadCounts", tenantId, workspaceId],
      });
      setReplyText("");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ── Add/toggle reaction ──────────────────────────────────────────────────
  const reactMutation = useMutation({
    mutationFn: async ({ msgId, emoji }: { msgId: string; emoji: string }) => {
      if (!actor) throw new Error("Not connected");
      // Find the message to check if user already reacted
      const allMsgs = [
        ...(threadMessages ?? []),
        ...(parentMessage ? [parentMessage] : []),
      ];
      const targetMsg = allMsgs.find((m) => m.id === msgId);
      const alreadyReacted =
        targetMsg?.reactions?.some(
          (r) =>
            r.emoji === emoji &&
            r.userIds.some((u) => u.toString() === myPrincipal),
        ) ?? false;
      if (alreadyReacted) {
        const result = await actor.removeReaction(
          tenantId,
          workspaceId,
          msgId,
          emoji,
        );
        if (result.__kind__ === "err") throw new Error(result.err);
        return result.ok;
      }
      const result = await actor.addReaction(
        tenantId,
        workspaceId,
        msgId,
        emoji,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["thread-messages", tenantId, workspaceId, messageId],
      }),
    onError: (err: Error) => toast.error(err.message),
  });

  // ── Keyboard handlers ─────────────────────────────────────────────────────
  const applyFormat = useCallback(
    (prefix: string, suffix = "") => {
      const el = textareaRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const selected = replyText.slice(start, end);
      const newText = `${replyText.slice(0, start)}${prefix}${selected}${suffix}${replyText.slice(end)}`;
      setReplyText(newText);
      requestAnimationFrame(() => {
        el.setSelectionRange(start + prefix.length, end + prefix.length);
        el.focus();
      });
    },
    [replyText],
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (replyText.trim()) sendMutation.mutate();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "b") {
      e.preventDefault();
      applyFormat("**", "**");
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "i") {
      e.preventDefault();
      applyFormat("_", "_");
    }
  }

  const replyCount = threadMessages?.length ?? 0;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex h-14 items-center gap-3 border-b border-border/60 bg-card/90 backdrop-blur-subtle px-4 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-8 w-8"
          aria-label="Back to channel"
          data-ocid="thread-back-btn"
        >
          <Link
            to="/app/$workspaceId/chat/$channelId"
            params={{ workspaceId, channelId }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 shrink-0">
          <MessageSquare className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm tracking-tight">
            Thread
          </p>
          <p className="text-xs text-muted-foreground">
            {replyCount} {replyCount === 1 ? "reply" : "replies"}
          </p>
        </div>
      </div>

      {/* ── Thread body ─────────────────────────────────────────────────── */}
      <ScrollArea className="flex-1 overflow-y-auto" data-ocid="thread-scroll">
        <div className="mx-auto w-full max-w-2xl px-4 py-6 space-y-4">
          {parentMessage ? (
            <ThreadMessage
              msg={parentMessage}
              isParent
              onReact={(msgId, emoji) => reactMutation.mutate({ msgId, emoji })}
              myPrincipal={myPrincipal}
            />
          ) : (
            <div className="flex items-start gap-3 rounded-xl bg-muted/30 border border-border px-4 py-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-4 w-full max-w-sm" />
              </div>
            </div>
          )}

          <div
            className="flex items-center gap-3"
            data-ocid="thread-reply-count"
          >
            <div className="h-px flex-1 bg-border" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <CornerDownRight className="h-3 w-3" />
              {isLoading ? (
                <Skeleton className="h-3 w-16 inline-block" />
              ) : (
                <span>
                  {replyCount} {replyCount === 1 ? "reply" : "replies"}
                </span>
              )}
            </div>
            <div className="h-px flex-1 bg-border" />
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : threadMessages && threadMessages.length > 0 ? (
            <div className="space-y-1">
              {threadMessages.map((msg) => (
                <ThreadMessage
                  key={msg.id}
                  msg={msg}
                  onReact={(msgId, emoji) =>
                    reactMutation.mutate({ msgId, emoji })
                  }
                  myPrincipal={myPrincipal}
                />
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-10 text-center"
              data-ocid="thread-empty"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 mb-3">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                No replies yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                Be the first to reply to this thread.
              </p>
            </div>
          )}

          <div ref={bottomRef} className="h-2" />
        </div>
      </ScrollArea>

      {/* ── Reply composer ──────────────────────────────────────────────── */}
      <div
        className="border-t border-border bg-card px-4 pt-3 pb-4 shrink-0 space-y-2"
        data-ocid="thread-reply-composer"
      >
        <div className="flex items-center gap-1 border border-border rounded-t-lg bg-muted/30 px-2 py-1">
          <FormatToolbar onFormat={applyFormat} />
        </div>
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            placeholder="Reply in thread… (Enter to send, Shift+Enter for new line)"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
            data-ocid="thread-reply-input"
            rows={2}
            className="flex-1 resize-none rounded-t-none border-t-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoComplete="off"
          />
          <Button
            onClick={() => {
              if (replyText.trim()) sendMutation.mutate();
            }}
            disabled={!replyText.trim() || sendMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 self-end"
            data-ocid="thread-reply-send-btn"
            aria-label="Send reply"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Enter to send · Shift+Enter for new line · Ctrl+B bold · Ctrl+I italic
        </p>
      </div>
    </div>
  );
}
