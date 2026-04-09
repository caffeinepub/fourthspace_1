import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bold,
  ChevronUp,
  Code,
  CornerUpLeft,
  Download,
  FileText,
  Globe,
  Hash,
  Italic,
  Link2,
  List,
  Loader2,
  Lock,
  MessageCircle,
  MessageSquare,
  Pin,
  Send,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { EmojiPicker } from "../../components/chat/EmojiPicker";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import type { Channel, Message, Reaction, UserId } from "../../types";
import { clearDraft, getDraft, saveDraft } from "../../utils/chatDrafts";
import {
  applyBold,
  applyBulletList,
  applyCode,
  applyItalic,
  extractUrls,
  filenameFromUrl,
  isImageUrl,
  isPdfUrl,
  renderFormattedText,
} from "../../utils/messageFormat";

// ─── Helpers ────────────────────────────────────────────────────────────────

function senderInitials(id: { toString(): string }): string {
  return id.toString().slice(0, 2).toUpperCase();
}

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

function formatAbsoluteTime(createdAt: bigint): string {
  const ms = Number(createdAt) / 1_000_000;
  return new Date(ms).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── File Attachments ────────────────────────────────────────────────────────

function FileAttachments({ content }: { content: string }) {
  const urls = extractUrls(content);
  if (urls.length === 0) return null;
  return (
    <div className="mt-2 space-y-1.5">
      {urls.map((url) => {
        if (isImageUrl(url)) {
          return (
            <img
              key={url}
              src={url}
              alt="attachment"
              className="max-h-48 max-w-xs rounded-lg border border-border object-cover"
              loading="lazy"
            />
          );
        }
        if (isPdfUrl(url)) {
          return (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs hover:bg-muted transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-red-500 shrink-0" />
              <span className="truncate max-w-[180px]">
                {filenameFromUrl(url)}
              </span>
              <Badge variant="outline" className="text-[10px] py-0">
                PDF
              </Badge>
              <Download className="h-3 w-3 text-muted-foreground" />
            </a>
          );
        }
        return (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs hover:bg-muted transition-colors"
          >
            <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate max-w-[200px]">
              {filenameFromUrl(url)}
            </span>
            <Download className="h-3 w-3 text-muted-foreground" />
          </a>
        );
      })}
    </div>
  );
}

// ─── Formatted Content ───────────────────────────────────────────────────────

function FormattedContent({ html }: { html: string }) {
  return (
    <p
      className="text-sm text-foreground leading-relaxed"
      ref={(el) => {
        if (el) el.innerHTML = html;
      }}
    />
  );
}

// ─── Reaction Bar ─────────────────────────────────────────────────────────────

interface ReactionBarProps {
  reactions: Reaction[];
  myPrincipal: string;
  onToggle: (emoji: string, isOwn: boolean) => void;
}

function ReactionBar({ reactions, myPrincipal, onToggle }: ReactionBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 mt-1.5">
      {reactions.map((r) => {
        const isOwn = r.userIds.some((u) => u.toString() === myPrincipal);
        return (
          <button
            key={r.emoji}
            type="button"
            onClick={() => onToggle(r.emoji, isOwn)}
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors ${
              isOwn
                ? "border-teal-500/60 bg-teal-500/10 text-teal-700 dark:text-teal-300"
                : "border-border bg-muted/40 hover:bg-muted text-foreground"
            }`}
            data-ocid={`reaction-${r.emoji}`}
          >
            <span>{r.emoji}</span>
            <span className="font-medium">{r.userIds.length}</span>
          </button>
        );
      })}
      <EmojiPicker
        onEmojiSelect={(emoji) => {
          const existing = reactions.find((r) => r.emoji === emoji);
          const isOwn =
            existing?.userIds.some((u) => u.toString() === myPrincipal) ??
            false;
          onToggle(emoji, isOwn);
        }}
        trigger={
          <button
            type="button"
            className="inline-flex items-center rounded-full border border-border bg-muted/40 hover:bg-muted px-2 py-0.5 text-xs text-muted-foreground transition-colors"
            aria-label="Add reaction"
            data-ocid="add-reaction-btn"
          >
            +😊
          </button>
        }
      />
    </div>
  );
}

// ─── Message Bubble ──────────────────────────────────────────────────────────

interface MessageBubbleProps {
  msg: Message;
  replyTarget?: Message;
  onReply: (msg: Message) => void;
  onPin: (msgId: string) => void;
  onReaction: (msgId: string, emoji: string, isOwn: boolean) => void;
  isPinned: boolean;
  myPrincipal: string;
  isMention: boolean;
  workspaceId: string;
  isGrouped?: boolean;
  memberDisplayName?: string;
}

export function MessageBubble({
  msg,
  replyTarget,
  onReply,
  onPin,
  onReaction,
  isPinned,
  myPrincipal,
  isMention,
  workspaceId,
  isGrouped = false,
  memberDisplayName,
}: MessageBubbleProps) {
  const formattedHtml = renderFormattedText(msg.content);
  const senderLabel =
    memberDisplayName ?? `${msg.senderId.toString().slice(0, 12)}…`;

  return (
    <div
      className={`group flex items-start gap-3 px-4 rounded-xl transition-colors ${
        isMention
          ? "border-l-2 border-amber-500 bg-amber-500/5 hover:bg-amber-500/8 py-2"
          : isGrouped
            ? "py-0.5 hover:bg-muted/30"
            : "py-2 hover:bg-muted/30"
      }`}
      data-ocid={`message-${msg.id}`}
    >
      {isGrouped ? (
        <div className="w-8 shrink-0 flex items-center justify-center">
          <span className="text-[10px] text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {formatRelativeTime(msg.createdAt).split(" ").slice(-1)[0]}
          </span>
        </div>
      ) : (
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(msg.senderId)}`}
        >
          {senderInitials(msg.senderId)}
        </div>
      )}

      <div className="flex-1 min-w-0 space-y-0.5">
        {!isGrouped && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-foreground">
              {senderLabel}
            </span>
            <span
              className="text-xs text-muted-foreground cursor-default"
              title={formatAbsoluteTime(msg.createdAt)}
            >
              {formatRelativeTime(msg.createdAt)}
            </span>
            {isPinned && (
              <Badge
                variant="outline"
                className="text-[10px] py-0 gap-0.5 border-amber-500/40 text-amber-600 dark:text-amber-400"
              >
                <Pin className="h-2.5 w-2.5" /> Pinned
              </Badge>
            )}
          </div>
        )}

        {replyTarget && (
          <div className="flex items-start gap-2 rounded-lg border-l-2 border-teal-500 bg-teal-500/5 px-3 py-1.5 text-xs text-muted-foreground">
            <CornerUpLeft className="h-3 w-3 shrink-0 mt-0.5 text-teal-500" />
            <span className="line-clamp-1">{replyTarget.content}</span>
          </div>
        )}

        <FormattedContent html={formattedHtml} />
        <FileAttachments content={msg.content} />

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

        {msg.reactions && msg.reactions.length > 0 && (
          <ReactionBar
            reactions={msg.reactions}
            myPrincipal={myPrincipal}
            onToggle={(emoji, isOwn) => onReaction(msg.id, emoji, isOwn)}
          />
        )}

        {msg.threadCount !== undefined && msg.threadCount > BigInt(0) && (
          <Link
            to="/app/$workspaceId/chat/$channelId/thread/$messageId"
            params={{
              workspaceId,
              channelId: msg.channelId,
              messageId: msg.id,
            }}
            className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline mt-1"
            data-ocid={`thread-link-${msg.id}`}
          >
            <MessageSquare className="h-3 w-3" />
            {msg.threadCount.toString()} repl
            {msg.threadCount === BigInt(1) ? "y" : "ies"}
          </Link>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <EmojiPicker
          onEmojiSelect={(emoji) => {
            const existing = msg.reactions?.find((r) => r.emoji === emoji);
            const isOwn =
              existing?.userIds.some((u) => u.toString() === myPrincipal) ??
              false;
            onReaction(msg.id, emoji, isOwn);
          }}
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              aria-label="React"
              data-ocid={`react-btn-${msg.id}`}
            >
              <span className="text-xs">😊</span>
            </Button>
          }
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onPin(msg.id)}
          aria-label={isPinned ? "Unpin message" : "Pin message"}
          data-ocid={`pin-btn-${msg.id}`}
        >
          <Pin className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onReply(msg)}
          aria-label="Reply in thread"
          data-ocid={`reply-btn-${msg.id}`}
        >
          <CornerUpLeft className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}

// ─── Channel Info Panel ──────────────────────────────────────────────────────

export function ChannelInfoPanel({ channel }: { channel: Channel }) {
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
            <Globe className="h-2.5 w-2.5" /> Public
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs gap-1">
            <Lock className="h-2.5 w-2.5" /> Private
          </Badge>
        )}
        {channel.description && (
          <p className="text-xs text-muted-foreground pt-1 leading-relaxed">
            {channel.description}
          </p>
        )}
        {channel.topic && (
          <p className="text-xs text-teal-600 dark:text-teal-400 italic leading-relaxed border-t border-border pt-1">
            📌 {channel.topic}
          </p>
        )}
      </div>

      <Separator />

      {channel.pinnedMessageIds && channel.pinnedMessageIds.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Pin className="h-3.5 w-3.5 text-amber-500" />
          {channel.pinnedMessageIds.length} pinned message
          {channel.pinnedMessageIds.length !== 1 ? "s" : ""}
        </div>
      )}

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

// ─── Formatting Toolbar ──────────────────────────────────────────────────────

interface FormattingToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (v: string) => void;
}

function FormattingToolbar({
  textareaRef,
  value,
  onChange,
}: FormattingToolbarProps) {
  function apply(
    fn: (v: string, s: number, e: number) => [string, number, number],
  ) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const [newVal, newStart, newEnd] = fn(value, start, end);
    onChange(newVal);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newStart, newEnd);
    });
  }

  const tools = [
    {
      label: "Bold",
      icon: <Bold className="h-3.5 w-3.5" />,
      shortcut: "Cmd+B",
      fn: applyBold,
      ocid: "fmt-bold",
    },
    {
      label: "Italic",
      icon: <Italic className="h-3.5 w-3.5" />,
      shortcut: "Cmd+I",
      fn: applyItalic,
      ocid: "fmt-italic",
    },
    {
      label: "Code",
      icon: <Code className="h-3.5 w-3.5" />,
      shortcut: "Cmd+`",
      fn: applyCode,
      ocid: "fmt-code",
    },
    {
      label: "Bullet",
      icon: <List className="h-3.5 w-3.5" />,
      shortcut: "Cmd+Shift+8",
      fn: applyBulletList,
      ocid: "fmt-bullet",
    },
  ];

  return (
    <div className="flex items-center gap-0.5 border-b border-border pb-1.5 mb-1">
      {tools.map((t) => (
        <Button
          key={t.label}
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          title={`${t.label} (${t.shortcut})`}
          aria-label={t.label}
          onClick={() => apply(t.fn)}
          data-ocid={t.ocid}
        >
          {t.icon}
        </Button>
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const CHAR_WARN_THRESHOLD = 500;

export default function ChannelPage() {
  const { workspaceId, channelId } = useParams({ strict: false }) as {
    workspaceId: string;
    channelId: string;
  };
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const myPrincipal = identity?.getPrincipal().toText() ?? "";

  const [messageText, setMessageText] = useState(() => getDraft(channelId));
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [olderMessages, setOlderMessages] = useState<Message[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const markReadRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Channel query ──
  const { data: channel } = useQuery<Channel | null>({
    queryKey: ["channel", tenantId, workspaceId, channelId],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getChannel(tenantId, workspaceId, channelId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  // ── Workspace members (for display names) ──
  const { data: members } = useQuery({
    queryKey: ["members", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaceMembers(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching,
  });

  const memberDisplayNames = new Map<string, string>();
  if (members) {
    for (const m of members) {
      if (m.displayName)
        memberDisplayNames.set(m.userId.toString(), m.displayName);
    }
  }

  // ── Messages query (polls every 3s) ──
  const { data: recentMessages, isLoading } = useQuery<Message[]>({
    queryKey: ["messages", tenantId, workspaceId, channelId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessages(
        tenantId,
        workspaceId,
        channelId,
        BigInt(50),
        null,
      );
    },
    enabled: !!actor && !isFetching && !!workspaceId,
    refetchInterval: 3000,
  });

  // Combine older + recent, deduplicate by id
  const allMessages = (() => {
    const seen = new Set<string>();
    const combined: Message[] = [];
    for (const m of [...olderMessages, ...(recentMessages ?? [])]) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        combined.push(m);
      }
    }
    combined.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
    return combined;
  })();

  // ── Mark read on mount ──
  useEffect(() => {
    if (!actor || !channelId || isFetching || !workspaceId) return;
    actor
      .markChannelRead(tenantId, workspaceId, channelId)
      .then(() =>
        queryClient.invalidateQueries({
          queryKey: ["unreadCounts", tenantId, workspaceId],
        }),
      )
      .catch(() => {});
  }, [actor, channelId, isFetching, tenantId, workspaceId, queryClient]);

  // ── Mark read on scroll (IntersectionObserver) ──
  const scheduleMarkRead = useCallback(() => {
    if (markReadRef.current) clearTimeout(markReadRef.current);
    markReadRef.current = setTimeout(() => {
      if (!actor || isFetching) return;
      actor
        .markChannelRead(tenantId, workspaceId, channelId)
        .then(() =>
          queryClient.invalidateQueries({
            queryKey: ["unreadCounts", tenantId, workspaceId],
          }),
        )
        .catch(() => {});
    }, 1000);
  }, [actor, isFetching, tenantId, workspaceId, channelId, queryClient]);

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) scheduleMarkRead();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [scheduleMarkRead]);

  // ── Auto-scroll to bottom on new messages ──
  const prevMsgCountRef = useRef(0);
  useEffect(() => {
    const count = recentMessages?.length ?? 0;
    if (count !== prevMsgCountRef.current) {
      prevMsgCountRef.current = count;
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [recentMessages]);

  // ── Load more (older) messages ──
  async function handleLoadMore() {
    if (!actor || isLoadingMore || !allMessages.length) return;
    setIsLoadingMore(true);
    const oldest = allMessages[0];
    try {
      const older = await actor.getMessages(
        tenantId,
        workspaceId,
        channelId,
        BigInt(50),
        oldest.createdAt,
      );
      if (older.length < 50) setHasMore(false);
      if (older.length > 0) {
        setOlderMessages((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          return [...older.filter((m) => !ids.has(m.id)), ...prev];
        });
      } else {
        setHasMore(false);
      }
    } catch {
      toast.error("Failed to load older messages");
    } finally {
      setIsLoadingMore(false);
    }
  }

  // ── Detect DM channel ──
  const isDM = channel?.name.startsWith("dm:") ?? false;
  let dmOtherUserId: string | null = null;
  if (isDM && channel?.name) {
    const parts = channel.name.split(":");
    const pA = parts[1];
    const pB = parts[2];
    if (pA && pB) dmOtherUserId = pA === myPrincipal ? pB : pA;
  }
  const dmOtherName = dmOtherUserId
    ? (memberDisplayNames.get(dmOtherUserId) ??
      `${dmOtherUserId.slice(0, 12)}…`)
    : null;

  // ── Formatting helpers ──
  function handleTextChange(v: string) {
    setMessageText(v);
    saveDraft(channelId, v);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      return;
    }
    if (e.key === "Escape") {
      setReplyTo(null);
      return;
    }
    const meta = e.metaKey || e.ctrlKey;
    if (!meta) return;
    const el = textareaRef.current;
    if (!el) return;
    const s = el.selectionStart;
    const end = el.selectionEnd;
    if (e.key === "b") {
      e.preventDefault();
      const [v, ns, ne] = applyBold(messageText, s, end);
      handleTextChange(v);
      requestAnimationFrame(() => el.setSelectionRange(ns, ne));
    } else if (e.key === "i") {
      e.preventDefault();
      const [v, ns, ne] = applyItalic(messageText, s, end);
      handleTextChange(v);
      requestAnimationFrame(() => el.setSelectionRange(ns, ne));
    } else if (e.key === "`") {
      e.preventDefault();
      const [v, ns, ne] = applyCode(messageText, s, end);
      handleTextChange(v);
      requestAnimationFrame(() => el.setSelectionRange(ns, ne));
    }
  }

  // ── Mutations ──
  const pendingSendRef = useRef<{ content: string; replyToId?: string } | null>(
    null,
  );

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const payload = pendingSendRef.current;
      if (!payload) throw new Error("No message content");
      const result = await actor.sendMessage(tenantId, workspaceId, {
        content: payload.content,
        channelId,
        replyToId: payload.replyToId,
        crossLinks: [],
      });
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onMutate: async () => {
      const optimisticContent = pendingSendRef.current?.content ?? "";
      const optimisticReplyTo = pendingSendRef.current?.replyToId;
      await queryClient.cancelQueries({
        queryKey: ["messages", tenantId, workspaceId, channelId],
      });
      const previous = queryClient.getQueryData<Message[]>([
        "messages",
        tenantId,
        workspaceId,
        channelId,
      ]);
      const optimistic: Message = {
        id: `optimistic-${Date.now()}`,
        content: optimisticContent,
        channelId,
        senderId: { toString: () => myPrincipal } as UserId,
        createdAt: BigInt(Date.now()) * 1_000_000n,
        updatedAt: BigInt(Date.now()) * 1_000_000n,
        tenantId,
        workspaceId,
        crossLinks: [],
        replyToId: optimisticReplyTo,
        reactions: [],
        threadCount: BigInt(0),
      };
      queryClient.setQueryData<Message[]>(
        ["messages", tenantId, workspaceId, channelId],
        (old) => [...(old ?? []), optimistic],
      );
      requestAnimationFrame(() =>
        bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      );
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", tenantId, workspaceId, channelId],
      });
      queryClient.invalidateQueries({
        queryKey: ["unreadCounts", tenantId, workspaceId],
      });
    },
    onError: (err: Error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["messages", tenantId, workspaceId, channelId],
          context.previous,
        );
      }
      toast.error(err.message);
    },
  });

  const reactionMutation = useMutation({
    mutationFn: async ({
      messageId,
      emoji,
      isOwn,
    }: { messageId: string; emoji: string; isOwn: boolean }) => {
      if (!actor) throw new Error("Not connected");
      if (isOwn) {
        const r = await actor.removeReaction(
          tenantId,
          workspaceId,
          messageId,
          emoji,
        );
        if (r.__kind__ === "err") throw new Error(r.err);
      } else {
        const r = await actor.addReaction(
          tenantId,
          workspaceId,
          messageId,
          emoji,
        );
        if (r.__kind__ === "err") throw new Error(r.err);
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["messages", tenantId, workspaceId, channelId],
      }),
    onError: (err: Error) => toast.error(err.message),
  });

  const pinMutation = useMutation({
    mutationFn: async (messageId: string) => {
      if (!actor) throw new Error("Not connected");
      const isPinned = channel?.pinnedMessageIds?.includes(messageId);
      if (isPinned) {
        const r = await actor.unpinMessage(
          tenantId,
          workspaceId,
          channelId,
          messageId,
        );
        if (r.__kind__ === "err") throw new Error(r.err);
      } else {
        const r = await actor.pinMessage(
          tenantId,
          workspaceId,
          channelId,
          messageId,
        );
        if (r.__kind__ === "err") throw new Error(r.err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channel", tenantId, workspaceId, channelId],
      });
      toast.success("Pin updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ── Derived ──
  const messageMap = new Map<string, Message>(
    allMessages.map((m) => [m.id, m]),
  );
  const pinnedIds = new Set(channel?.pinnedMessageIds ?? []);

  function isGrouped(idx: number): boolean {
    if (idx === 0) return false;
    const prev = allMessages[idx - 1];
    const curr = allMessages[idx];
    if (prev.senderId.toString() !== curr.senderId.toString()) return false;
    const timeDiff = Number(curr.createdAt - prev.createdAt) / 1_000_000_000;
    return timeDiff < 300;
  }

  const myUnreadEntry = channel?.unreadCounts?.find(
    (u) => u.userId.toString() === myPrincipal,
  );
  const unreadCount = myUnreadEntry ? Number(myUnreadEntry.count) : 0;
  const unreadBoundaryIndex =
    allMessages.length > 0 && unreadCount > 0
      ? Math.max(0, allMessages.length - unreadCount)
      : -1;

  function handleSend() {
    if (!messageText.trim()) return;
    pendingSendRef.current = {
      content: messageText.trim(),
      replyToId: replyTo?.id,
    };
    clearDraft(channelId);
    setMessageText("");
    setReplyTo(null);
    sendMutation.mutate();
  }

  const charCount = messageText.length;
  const showCharCount = charCount > CHAR_WARN_THRESHOLD;

  return (
    <div className="flex h-full overflow-hidden pb-16 md:pb-0">
      {channel && !isDM && <ChannelInfoPanel channel={channel} />}

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* ── Top bar ── */}
        <div className="flex h-auto min-h-14 flex-col justify-center border-b border-border/60 bg-card/90 backdrop-blur-sm px-4 py-2 shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8"
              aria-label="Back to channels"
              data-ocid="channel-back-btn"
            >
              <Link to="/app/$workspaceId/chat" params={{ workspaceId }}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            {isDM ? (
              <>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0 ${dmOtherUserId ? avatarColor({ toString: () => dmOtherUserId! }) : "bg-primary/10 text-primary"}`}
                >
                  {dmOtherUserId
                    ? senderInitials({ toString: () => dmOtherUserId! })
                    : "DM"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate tracking-tight flex items-center gap-1.5">
                    <MessageCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                    {dmOtherName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Direct message
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10 shrink-0">
                  <Hash className="h-3.5 w-3.5 text-teal-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate tracking-tight">
                    {channel?.name ?? "Channel"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {channel?.memberIds.length ?? 0} members
                  </p>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground lg:hidden">
                  <Users className="h-3 w-3" />
                  <span className="text-xs">
                    {channel?.memberIds.length ?? 0}
                  </span>
                </div>
                {!isDM && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground h-7 px-2.5 hidden sm:flex"
                    onClick={() =>
                      navigate({
                        to: "/app/$workspaceId/chat/$channelId/settings",
                        params: { workspaceId, channelId },
                      })
                    }
                    data-ocid="channel-settings-link"
                  >
                    Settings
                  </Button>
                )}
              </>
            )}
          </div>
          {!isDM && channel?.topic && (
            <p className="text-xs text-teal-600 dark:text-teal-400 italic ml-11 mt-0.5 truncate">
              📌 {channel.topic}
            </p>
          )}
        </div>

        {/* ── Messages ── */}
        <ScrollArea className="flex-1 py-2" data-ocid="messages-list">
          {/* Load more button */}
          {!isLoading && allMessages.length > 0 && hasMore && (
            <div
              className="flex justify-center px-4 pt-3 pb-1"
              ref={topSentinelRef}
            >
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-8 border-dashed"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                data-ocid="load-more-btn"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" /> Loading…
                  </>
                ) : (
                  <>
                    <ChevronUp className="h-3 w-3" /> Load older messages
                  </>
                )}
              </Button>
            </div>
          )}

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
          ) : allMessages.length > 0 ? (
            <div className="py-2">
              {allMessages.map((msg, idx) => (
                <div key={msg.id}>
                  {idx === unreadBoundaryIndex && (
                    <div
                      className="flex items-center gap-2 px-4 py-1 my-1"
                      data-ocid="unread-separator"
                    >
                      <div className="flex-1 h-px bg-amber-500/40" />
                      <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap shrink-0">
                        {unreadCount} unread message
                        {unreadCount !== 1 ? "s" : ""}
                      </span>
                      <div className="flex-1 h-px bg-amber-500/40" />
                    </div>
                  )}
                  <MessageBubble
                    msg={msg}
                    replyTarget={
                      msg.replyToId ? messageMap.get(msg.replyToId) : undefined
                    }
                    onReply={setReplyTo}
                    onPin={(id) => pinMutation.mutate(id)}
                    onReaction={(msgId, emoji, isOwn) =>
                      reactionMutation.mutate({
                        messageId: msgId,
                        emoji,
                        isOwn,
                      })
                    }
                    isPinned={pinnedIds.has(msg.id)}
                    myPrincipal={myPrincipal}
                    isMention={
                      myPrincipal.length > 0 &&
                      msg.content.includes(`@${myPrincipal}`)
                    }
                    workspaceId={workspaceId}
                    isGrouped={isGrouped(idx)}
                    memberDisplayName={memberDisplayNames.get(
                      msg.senderId.toString(),
                    )}
                  />
                </div>
              ))}
              <div ref={bottomRef} className="h-4" />
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-24 text-center px-4"
              data-ocid="messages-empty"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 mb-3">
                {isDM ? (
                  <MessageCircle className="h-6 w-6 text-teal-500" />
                ) : (
                  <Hash className="h-6 w-6 text-teal-500" />
                )}
              </div>
              <p className="font-semibold text-foreground text-sm">
                {isDM
                  ? `Start a conversation with ${dmOtherName}`
                  : `Welcome to #${channel?.name}!`}
              </p>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                {isDM
                  ? "This is the beginning of your direct message history."
                  : "This is the beginning of the channel. Send a message to get the conversation started."}
              </p>
            </div>
          )}
        </ScrollArea>

        {/* ── Input bar ── */}
        <div
          className="border-t border-border bg-card px-4 py-3 space-y-1.5 shrink-0"
          data-ocid="message-input-area"
        >
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
          <div className="rounded-xl border border-input bg-background focus-within:ring-1 focus-within:ring-ring p-2">
            <FormattingToolbar
              textareaRef={textareaRef}
              value={messageText}
              onChange={handleTextChange}
            />
            <div className="flex items-end gap-2">
              <Textarea
                ref={textareaRef}
                placeholder={`Message ${isDM ? dmOtherName : `#${channel?.name ?? "channel"}`}…`}
                value={messageText}
                onChange={(e) => handleTextChange(e.target.value)}
                onKeyDown={handleKeyDown}
                data-ocid="message-input"
                className="flex-1 min-h-[2.25rem] max-h-40 resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent text-sm"
                rows={1}
                autoComplete="off"
              />
              <Button
                onClick={handleSend}
                disabled={!messageText.trim() || sendMutation.isPending}
                className="bg-teal-600 hover:bg-teal-700 text-white shrink-0 h-8 w-8 p-0"
                data-ocid="message-send-btn"
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground">
              Enter to send · Shift+Enter for new line · Cmd+B bold · Cmd+I
              italic
            </p>
            {showCharCount && (
              <span
                className={`text-[10px] font-medium ${charCount > 2000 ? "text-destructive" : "text-amber-500"}`}
              >
                {charCount}/2000
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
