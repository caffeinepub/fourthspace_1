import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  Globe,
  Hash,
  Lock,
  MessageCircle,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Variant_away_offline_online } from "../../backend";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import type { Channel, ChannelInput, WorkspaceMember } from "../../types";

// ---- Presence helpers ----
type StatusKind = "online" | "away" | "offline";

function toVariant(s: StatusKind): Variant_away_offline_online {
  const map: Record<StatusKind, Variant_away_offline_online> = {
    online: Variant_away_offline_online.online,
    away: Variant_away_offline_online.away,
    offline: Variant_away_offline_online.offline,
  };
  return map[s];
}

function PresenceDot({ status }: { status: StatusKind }) {
  const colorMap: Record<StatusKind, string> = {
    online: "bg-emerald-500",
    away: "bg-amber-400",
    offline: "bg-muted-foreground/40",
  };
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full shrink-0 ring-2 ring-background ${colorMap[status]}`}
      aria-label={`Status: ${status}`}
    />
  );
}

// ---- Set Status Popover ----
function SetStatusPopover({
  currentStatus,
  currentCustom,
  onSave,
  isSaving,
}: {
  currentStatus: StatusKind;
  currentCustom: string;
  onSave: (status: StatusKind, custom: string) => void;
  isSaving: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<StatusKind>(currentStatus);
  const [custom, setCustom] = useState(currentCustom);

  useEffect(() => {
    if (open) {
      setStatus(currentStatus);
      setCustom(currentCustom);
    }
  }, [open, currentStatus, currentCustom]);

  const statusOptions: { value: StatusKind; label: string; color: string }[] = [
    { value: "online", label: "Online", color: "bg-emerald-500" },
    { value: "away", label: "Away", color: "bg-amber-400" },
    { value: "offline", label: "Offline", color: "bg-muted-foreground/40" },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
          aria-label="Set your status"
          data-ocid="presence-dot-trigger"
        >
          <PresenceDot status={currentStatus} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-4 space-y-3"
        align="start"
        data-ocid="status-popover"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Set Status
        </p>
        <div className="space-y-1">
          {statusOptions.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => setStatus(opt.value)}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                status === opt.value
                  ? "bg-primary/10 text-foreground font-medium"
                  : "hover:bg-muted text-muted-foreground"
              }`}
              data-ocid={`status-option-${opt.value}`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full shrink-0 ${opt.color}`}
              />
              {opt.label}
            </button>
          ))}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="custom-status" className="text-xs">
            Custom status message
          </Label>
          <Input
            id="custom-status"
            placeholder="What are you up to?"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="h-8 text-sm"
            data-ocid="custom-status-input"
          />
        </div>
        <Button
          size="sm"
          className="w-full"
          disabled={isSaving}
          onClick={() => {
            onSave(status, custom);
            setOpen(false);
          }}
          data-ocid="status-save-btn"
        >
          {isSaving ? "Saving…" : "Save status"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}

// ---- ChannelCard ----
function ChannelCard({
  channel,
  workspaceId,
  onJoin,
  isJoining,
  unreadCount,
  hasMention,
}: {
  channel: Channel;
  workspaceId: string;
  onJoin?: (id: string) => void;
  isJoining?: boolean;
  unreadCount?: number;
  hasMention?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Link
        to="/app/$workspaceId/chat/$channelId"
        params={{ workspaceId, channelId: channel.id }}
        data-ocid={`channel-item-${channel.id}`}
        className="flex-1 flex items-center gap-3 rounded-xl border border-border/50 bg-card px-3.5 py-3 transition-smooth hover:shadow-sm hover:border-teal-300/40 dark:hover:border-teal-700/40 group min-w-0 card-interactive"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/10">
          <Hash className="h-3.5 w-3.5 text-teal-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-foreground truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-sm">
              #{channel.name}
            </span>
            {channel.isPublic ? (
              <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium border border-teal-500/30 text-teal-600 dark:text-teal-400 inline-flex items-center gap-0.5">
                <Globe className="h-2 w-2" /> Public
              </span>
            ) : (
              <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium border border-border text-muted-foreground inline-flex items-center gap-0.5">
                <Lock className="h-2 w-2" /> Private
              </span>
            )}
            {hasMention && (
              <span
                className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-amber-400 text-[10px] font-bold text-amber-950 shrink-0"
                aria-label="Unread mention"
                data-ocid={`channel-mention-${channel.id}`}
              >
                @
              </span>
            )}
          </div>
          {channel.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {channel.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="flex items-center gap-1 text-muted-foreground text-xs">
            <Users className="h-3 w-3" />
            {channel.memberIds.length}
          </span>
          {unreadCount != null && unreadCount > 0 && (
            <span
              className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold"
              aria-label={`${unreadCount} unread`}
              data-ocid={`channel-unread-${channel.id}`}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </Link>
      {onJoin && channel.isPublic && (
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 text-teal-600 border-teal-500/30 hover:bg-teal-50 dark:hover:bg-teal-950/30 text-xs h-8 px-3"
          onClick={() => onJoin(channel.id)}
          disabled={isJoining}
          data-ocid={`channel-join-${channel.id}`}
        >
          Join
        </Button>
      )}
    </div>
  );
}

// ---- DM Row ----
function DMRow({
  member,
  statusMap,
  unreadCount,
  onOpen,
  isOpening,
}: {
  member: WorkspaceMember;
  statusMap: Map<string, StatusKind>;
  unreadCount: number;
  onOpen: (userId: string) => void;
  isOpening: boolean;
}) {
  const userId = member.userId.toString();
  const status = statusMap.get(userId) ?? "offline";
  const initials = member.displayName
    ? member.displayName.slice(0, 2).toUpperCase()
    : userId.slice(0, 2).toUpperCase();

  return (
    <button
      type="button"
      onClick={() => onOpen(userId)}
      disabled={isOpening}
      data-ocid={`dm-row-${userId}`}
      className="flex w-full items-center gap-3 rounded-xl border border-border/50 bg-card px-3.5 py-3 transition-smooth hover:shadow-sm hover:border-teal-300/40 dark:hover:border-teal-700/40 group text-left min-w-0 card-interactive"
    >
      <div className="relative shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {initials}
        </div>
        <span className="absolute -bottom-0.5 -right-0.5">
          <PresenceDot status={status} />
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {member.displayName || `${userId.slice(0, 10)}…`}
        </p>
        <p className="text-xs text-muted-foreground capitalize">{status}</p>
      </div>
      {unreadCount > 0 && (
        <span
          className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold shrink-0"
          data-ocid={`dm-unread-${userId}`}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}

// ---- CreateChannelForm ----
function CreateChannelForm({
  workspaceId,
  onClose,
}: {
  workspaceId: string;
  onClose: () => void;
}) {
  const { actor } = useBackend();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const createMutation = useMutation({
    mutationFn: async (input: ChannelInput) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createChannel(tenantId, workspaceId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channels", tenantId, workspaceId],
      });
      toast.success("Channel created");
      onClose();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({
      name: name.trim(),
      description: description.trim(),
      isPublic,
      memberIds: [],
    });
  }

  return (
    <div className="rounded-2xl border border-teal-500/30 bg-card p-6 shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10">
            <Hash className="h-4 w-4 text-teal-500" />
          </div>
          <h2 className="font-display font-semibold text-foreground">
            Create Channel
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          data-ocid="create-channel-close"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="ch-name">Channel name</Label>
          <Input
            id="ch-name"
            placeholder="e.g. general, announcements, design"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-ocid="channel-name-input"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ch-desc">
            Description{" "}
            <span className="text-muted-foreground font-normal text-xs">
              (optional)
            </span>
          </Label>
          <Textarea
            id="ch-desc"
            placeholder="What's this channel about?"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            data-ocid="channel-description-input"
            className="resize-none"
          />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-3">
            {isPublic ? (
              <Globe className="h-4 w-4 text-teal-500" />
            ) : (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-medium text-foreground">
                {isPublic ? "Public" : "Private"} channel
              </p>
              <p className="text-xs text-muted-foreground">
                {isPublic
                  ? "Anyone in the workspace can join"
                  : "Only invited members can access"}
              </p>
            </div>
          </div>
          <Switch
            checked={isPublic}
            onCheckedChange={setIsPublic}
            data-ocid="channel-public-toggle"
          />
        </div>
        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!name.trim() || createMutation.isPending}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
            data-ocid="channel-save-btn"
          >
            {createMutation.isPending ? "Creating…" : "Create Channel"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// ---- Main ChatPage ----
const IDLE_TIMEOUT_MS = 5 * 60 * 1000;
const PRESENCE_PING_MS = 30_000;
const STATUS_POLL_MS = 10_000;
const UNREAD_POLL_MS = 10_000;

export default function ChatPage() {
  const { workspaceId } = useParams({ from: "/app/$workspaceId/chat" });
  const { actor, isFetching } = useBackend();
  const { identity } = useInternetIdentity();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [localStatus, setLocalStatus] = useState<StatusKind>("online");
  const [localCustom, setLocalCustom] = useState("");
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const presencePingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ---- Set status mutation ----
  const statusMutation = useMutation({
    mutationFn: async ({
      status,
      custom,
    }: {
      status: StatusKind;
      custom: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.setUserStatus(
        tenantId,
        workspaceId,
        toVariant(status),
        custom,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (data) => {
      setLocalStatus(data.status as StatusKind);
      setLocalCustom(data.customStatus);
    },
    onError: () => {
      /* silently ignore status update errors */
    },
  });

  // ---- Set online on mount + presence ping every 30s ----
  useEffect(() => {
    if (!actor || isFetching) return;
    const mutate = statusMutation.mutate;
    mutate({ status: "online", custom: "" });

    // Presence ping - updatePresence keeps us marked as online in the backend
    const pingInterval = setInterval(() => {
      if (!actor) return;
      actor.updatePresence(tenantId, workspaceId).catch(() => {});
    }, PRESENCE_PING_MS);
    presencePingRef.current = pingInterval;

    return () => {
      clearInterval(pingInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actor, isFetching, tenantId, workspaceId, statusMutation.mutate]);

  // ---- Idle detection (5 min -> away) ----
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    const mutate = statusMutation.mutate;
    if (localStatus === "away") {
      mutate({ status: "online", custom: localCustom });
    }
    idleTimerRef.current = setTimeout(() => {
      mutate({ status: "away", custom: localCustom });
    }, IDLE_TIMEOUT_MS);
  }, [localStatus, localCustom, statusMutation.mutate]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "pointerdown", "scroll"] as const;
    for (const ev of events) {
      window.addEventListener(ev, resetIdleTimer, { passive: true });
    }
    resetIdleTimer();
    return () => {
      for (const ev of events) {
        window.removeEventListener(ev, resetIdleTimer);
      }
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  // ---- Channels query ----
  const { data: channels, isLoading } = useQuery<Channel[]>({
    queryKey: ["channels", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listChannels(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching,
  });

  // ---- Workspace members (for DMs) ----
  const { data: members } = useQuery<WorkspaceMember[]>({
    queryKey: ["members", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaceMembers(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching,
  });

  // ---- Workspace statuses (online presence) ----
  const { data: statusList } = useQuery({
    queryKey: ["workspaceStatuses", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaceStatuses(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: STATUS_POLL_MS,
  });

  const statusMap = new Map<string, StatusKind>();
  if (statusList) {
    for (const s of statusList) {
      statusMap.set(s.id.toString(), s.status as StatusKind);
    }
  }

  // ---- Unread counts query ----
  const { data: unreadRaw } = useQuery<Array<[string, bigint]>>({
    queryKey: ["unreadCounts", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUnreadCounts(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: UNREAD_POLL_MS,
  });

  const unreadMap = new Map<string, number>();
  const mentionMap = new Map<string, boolean>();
  if (unreadRaw) {
    for (const [channelId, count] of unreadRaw) {
      unreadMap.set(channelId, Number(count));
    }
  }
  if (channels) {
    for (const ch of channels) {
      if (ch.mentionFlags) {
        const hasMention = ch.mentionFlags.some((mf) => mf.hasMention);
        if (hasMention) mentionMap.set(ch.id, true);
      }
    }
  }

  // Build a map from member userId -> DM channel id so DMRow can look up unread counts.
  // DM channels have deterministic names: "dm:<principalA>:<principalB>" (sorted).
  const myPrincipalText = identity?.getPrincipal().toText() ?? "";
  const dmChannelByUserId = new Map<string, string>();
  if (channels && myPrincipalText) {
    for (const ch of channels) {
      if (ch.name.startsWith("dm:")) {
        // Channel name format: "dm:principalA:principalB"
        const parts = ch.name.split(":");
        // parts[0] = "dm", parts[1] = principalA, parts[2] = principalB
        const pA = parts[1];
        const pB = parts[2];
        if (pA && pB) {
          // The other participant is whichever is not our principal
          const other = pA === myPrincipalText ? pB : pA;
          dmChannelByUserId.set(other, ch.id);
        }
      }
    }
  }

  // ---- Join mutation ----
  const joinMutation = useMutation({
    mutationFn: async (channelId: string) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.joinChannel(tenantId, workspaceId, channelId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channels", tenantId, workspaceId],
      });
      toast.success("Joined channel");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ---- Open DM mutation ----
  const openDMMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      if (!actor) throw new Error("Not connected");
      // Import Principal lazily — userId is already a string principal
      const { Principal } = await import("@icp-sdk/core/principal");
      const result = await actor.createOrGetDMChannel(
        tenantId,
        workspaceId,
        Principal.fromText(targetUserId),
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (channel) => {
      queryClient.invalidateQueries({
        queryKey: ["channels", tenantId, workspaceId],
      });
      void navigate({
        to: "/app/$workspaceId/chat/$channelId",
        params: { workspaceId, channelId: channel.id },
      });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const publicChannels = channels?.filter((c) => c.isPublic) ?? [];
  const privateChannels = channels?.filter((c) => !c.isPublic) ?? [];

  const totalUnread = unreadRaw
    ? unreadRaw.reduce((sum, [, n]) => sum + Number(n), 0)
    : 0;

  return (
    <div className="animate-fade-in-up p-4 sm:p-6 max-w-3xl mx-auto space-y-4 sm:space-y-5 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <SetStatusPopover
            currentStatus={localStatus}
            currentCustom={localCustom}
            onSave={(s, c) => {
              setLocalStatus(s);
              setLocalCustom(c);
              statusMutation.mutate({ status: s, custom: c });
            }}
            isSaving={statusMutation.isPending}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Chat
              </h1>
              {totalUnread > 0 && (
                <span
                  className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold"
                  data-ocid="chat-total-unread"
                >
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="capitalize">{localStatus}</span>
              {localCustom && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="truncate max-w-[180px]">{localCustom}</span>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 h-9 text-xs min-h-[44px] min-w-[44px]"
            onClick={() =>
              navigate({
                to: "/app/$workspaceId/chat/search",
                params: { workspaceId },
              })
            }
            data-ocid="chat-search-btn"
            aria-label="Search messages"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search</span>
          </Button>
          <Button
            onClick={() => setShowCreate((v) => !v)}
            size="sm"
            className="bg-teal-600 hover:bg-teal-700 text-white active-press gap-1.5 h-9 text-xs min-h-[44px]"
            data-ocid="create-channel-btn"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Channel</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      {showCreate && (
        <CreateChannelForm
          workspaceId={workspaceId}
          onClose={() => setShowCreate(false)}
        />
      )}

      {/* Channel list */}
      {isLoading ? (
        <div className="space-y-2.5">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : channels && channels.length > 0 ? (
        <div className="space-y-5">
          {publicChannels.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2.5">
                <Globe className="h-3 w-3 text-teal-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Public
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {publicChannels.length}
                </span>
              </div>
              <div className="space-y-1.5">
                {publicChannels.map((ch) => (
                  <ChannelCard
                    key={ch.id}
                    channel={ch}
                    workspaceId={workspaceId}
                    onJoin={(id) => joinMutation.mutate(id)}
                    isJoining={joinMutation.isPending}
                    unreadCount={unreadMap.get(ch.id)}
                    hasMention={mentionMap.get(ch.id)}
                  />
                ))}
              </div>
            </section>
          )}
          {privateChannels.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2.5">
                <Lock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Private
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {privateChannels.length}
                </span>
              </div>
              <div className="space-y-1.5">
                {privateChannels.map((ch) => (
                  <ChannelCard
                    key={ch.id}
                    channel={ch}
                    workspaceId={workspaceId}
                    unreadCount={unreadMap.get(ch.id)}
                    hasMention={mentionMap.get(ch.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center"
          data-ocid="channels-empty"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 mb-3">
            <Hash className="h-6 w-6 text-teal-500" />
          </div>
          <h3 className="font-display font-semibold text-foreground">
            No channels yet
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-xs">
            Create your first channel to start collaborating with your team.
          </p>
          <Button
            onClick={() => setShowCreate(true)}
            size="sm"
            className="mt-5 bg-teal-600 hover:bg-teal-700 text-white active-press gap-1.5"
            data-ocid="channels-empty-cta"
          >
            <Plus className="h-3.5 w-3.5" /> Create first channel
          </Button>
        </div>
      )}

      {/* Direct Messages section */}
      {members && members.length > 1 && (
        <section data-ocid="dm-section">
          <div className="flex items-center gap-2 mb-2.5">
            <MessageCircle className="h-3 w-3 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Direct Messages
            </span>
            <span className="ml-auto text-xs text-muted-foreground">
              {members.length - 1}
            </span>
          </div>
          <div className="space-y-1.5">
            {members.map((member) => {
              const uid = member.userId.toString();
              const dmChannelId = dmChannelByUserId.get(uid);
              return (
                <DMRow
                  key={uid}
                  member={member}
                  statusMap={statusMap}
                  unreadCount={
                    dmChannelId ? (unreadMap.get(dmChannelId) ?? 0) : 0
                  }
                  onOpen={(userId) => openDMMutation.mutate(userId)}
                  isOpening={openDMMutation.isPending}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
