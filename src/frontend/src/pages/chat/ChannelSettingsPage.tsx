import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Globe,
  Hash,
  Lock,
  MessageSquareDiff,
  Pin,
  PinOff,
  Settings,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import type { Channel, Message } from "../../types";

// ---- Shared avatar helpers ----
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
function memberInitials(id: { toString(): string }): string {
  return id.toString().slice(0, 2).toUpperCase();
}

// ---- Pinned message row ----
interface PinnedRowProps {
  msg: Message;
  canEdit: boolean;
  onUnpin: (msgId: string) => void;
  unpinPending: boolean;
}
function PinnedRow({ msg, canEdit, onUnpin, unpinPending }: PinnedRowProps) {
  const tsMs = Number(msg.createdAt) / 1_000_000;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-3 group">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(msg.senderId)}`}
      >
        {memberInitials(msg.senderId)}
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">
            {msg.senderId.toString().slice(0, 10)}…
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(tsMs, { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-foreground leading-relaxed line-clamp-3">
          {msg.content}
        </p>
      </div>
      {canEdit && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
          onClick={() => onUnpin(msg.id)}
          disabled={unpinPending}
          aria-label="Unpin message"
          data-ocid={`unpin-btn-${msg.id}`}
        >
          <PinOff className="h-3 w-3" />
          Unpin
        </Button>
      )}
    </div>
  );
}

// ---- Main page ----
export default function ChannelSettingsPage() {
  const { workspaceId, channelId } = useParams({
    from: "/app/$workspaceId/chat/$channelId/settings",
  });
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const { identity } = useInternetIdentity();

  // Channel data
  const { data: channel, isLoading: channelLoading } = useQuery<Channel | null>(
    {
      queryKey: ["channel", tenantId, workspaceId, channelId],
      queryFn: async () => {
        if (!actor) return null;
        const r = await actor.getChannel(tenantId, workspaceId, channelId);
        return r.__kind__ === "ok" ? r.ok : null;
      },
      enabled: !!actor && !isFetching,
    },
  );

  // Pinned messages
  const { data: pinnedMessages, isLoading: pinsLoading } = useQuery<Message[]>({
    queryKey: ["channelPins", tenantId, workspaceId, channelId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChannelPins(tenantId, workspaceId, channelId);
    },
    enabled: !!actor && !isFetching,
  });

  const myPrincipal = identity?.getPrincipal();
  const isCreator =
    myPrincipal && channel
      ? channel.createdBy.toString() === myPrincipal.toString()
      : false;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");

  useEffect(() => {
    if (channel) {
      setName(channel.name);
      setDescription(channel.description ?? "");
      setTopic(channel.topic ?? "");
    }
  }, [channel]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updateChannel(
        tenantId,
        workspaceId,
        channelId,
        name.trim(),
        description.trim(),
        topic.trim(),
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channel", tenantId, workspaceId, channelId],
      });
      queryClient.invalidateQueries({
        queryKey: ["channels", tenantId, workspaceId],
      });
      toast.success("Channel settings saved");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Unpin mutation
  const unpinMutation = useMutation({
    mutationFn: async (messageId: string) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.unpinMessage(
        tenantId,
        workspaceId,
        channelId,
        messageId,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channelPins", tenantId, workspaceId, channelId],
      });
      queryClient.invalidateQueries({
        queryKey: ["channel", tenantId, workspaceId, channelId],
      });
      toast.success("Message unpinned");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Channel name is required");
      return;
    }
    saveMutation.mutate();
  }

  return (
    <div className="flex flex-col h-full overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="flex h-13 items-center gap-3 border-b border-border/60 bg-card/90 backdrop-blur-subtle px-4 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-8 w-8"
          aria-label="Back to channel"
          data-ocid="channel-settings-back-btn"
        >
          <Link
            to="/app/$workspaceId/chat/$channelId"
            params={{ workspaceId, channelId }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10">
          <Settings className="h-3.5 w-3.5 text-teal-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate tracking-tight">
            Channel Settings
          </p>
          {channel && (
            <p className="text-xs text-muted-foreground truncate">
              #{channel.name}
            </p>
          )}
        </div>
        {channel && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium border inline-flex items-center gap-1 ${channel.isPublic ? "border-teal-500/30 text-teal-600 dark:text-teal-400" : "border-border text-muted-foreground"}`}
          >
            {channel.isPublic ? (
              <>
                <Globe className="h-2.5 w-2.5" /> Public
              </>
            ) : (
              <>
                <Lock className="h-2.5 w-2.5" /> Private
              </>
            )}
          </span>
        )}
      </div>

      {/* Body */}
      <ScrollArea className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
          {/* ---- Settings form ---- */}
          <section data-ocid="channel-settings-form-section">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Hash className="h-3.5 w-3.5 text-primary" />
              </div>
              <h2 className="font-display font-bold text-foreground text-sm uppercase tracking-wider">
                General
              </h2>
            </div>

            {channelLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <Skeleton key={n} className="h-10 w-full" />
                ))}
              </div>
            ) : isCreator ? (
              <form onSubmit={handleSave} className="space-y-5">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="channel-name"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Channel Name
                  </Label>
                  <Input
                    id="channel-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. general"
                    data-ocid="channel-name-input"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  {channel?.description && (
                    <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 border border-border">
                      <span className="font-semibold text-foreground">
                        Current description:{" "}
                      </span>
                      {channel.description}
                    </p>
                  )}
                  <Label
                    htmlFor="channel-description"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="channel-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this channel about?"
                    rows={3}
                    data-ocid="channel-description-input"
                  />
                </div>

                <div className="space-y-1.5">
                  {channel?.topic && (
                    <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 border border-border">
                      <span className="font-semibold text-foreground">
                        Current topic:{" "}
                      </span>
                      {channel.topic}
                    </p>
                  )}
                  <Label
                    htmlFor="channel-topic"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Topic
                  </Label>
                  <Input
                    id="channel-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Current sprint goals, team updates…"
                    data-ocid="channel-topic-input"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <Button
                    type="submit"
                    disabled={saveMutation.isPending || !name.trim()}
                    data-ocid="channel-settings-save-btn"
                    className="gap-2"
                  >
                    {saveMutation.isPending ? "Saving…" : "Save Changes"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="rounded-xl border border-border bg-card/60 divide-y divide-border">
                <div className="px-4 py-3 space-y-0.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Name
                  </p>
                  <p className="text-sm text-foreground font-medium">
                    #{channel?.name}
                  </p>
                </div>
                {channel?.description && (
                  <div className="px-4 py-3 space-y-0.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Description
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {channel.description}
                    </p>
                  </div>
                )}
                {channel?.topic && (
                  <div className="px-4 py-3 space-y-0.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Topic
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {channel.topic}
                    </p>
                  </div>
                )}
                <div className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className="text-xs text-muted-foreground"
                  >
                    Only the channel creator can edit settings
                  </Badge>
                </div>
              </div>
            )}
          </section>

          <Separator />

          {/* ---- Pinned Messages ---- */}
          <section data-ocid="channel-pinned-section">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/20">
                  <Pin className="h-3.5 w-3.5 text-secondary" />
                </div>
                <h2 className="font-display font-bold text-foreground text-sm uppercase tracking-wider">
                  Pinned Messages
                </h2>
              </div>
              {!pinsLoading && (
                <Badge variant="secondary" className="text-xs">
                  {pinnedMessages?.length ?? 0} pinned
                </Badge>
              )}
            </div>

            {pinsLoading ? (
              <div className="space-y-3">
                {[1, 2].map((n) => (
                  <div key={n} className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-4 w-full max-w-sm" />
                    </div>
                  </div>
                ))}
              </div>
            ) : pinnedMessages && pinnedMessages.length > 0 ? (
              <div className="space-y-2" data-ocid="pinned-messages-list">
                {pinnedMessages.map((msg) => (
                  <PinnedRow
                    key={msg.id}
                    msg={msg}
                    canEdit={isCreator}
                    onUnpin={(id) => unpinMutation.mutate(id)}
                    unpinPending={unpinMutation.isPending}
                  />
                ))}
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-10 text-center rounded-xl border border-dashed border-border bg-muted/20"
                data-ocid="pinned-messages-empty"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted mb-2">
                  <MessageSquareDiff className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  No pinned messages yet
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  Pin important messages from the channel to surface them here.
                </p>
              </div>
            )}
          </section>

          <Separator />

          {/* ---- Members ---- */}
          <section data-ocid="channel-members-section">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/20">
                <Users className="h-3.5 w-3.5 text-accent" />
              </div>
              <h2 className="font-display font-bold text-foreground text-sm uppercase tracking-wider">
                Members
              </h2>
              {channel && (
                <Badge variant="outline" className="text-xs ml-auto">
                  {channel.memberIds.length}{" "}
                  {channel.memberIds.length === 1 ? "member" : "members"}
                </Badge>
              )}
            </div>

            {channelLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center gap-3 py-1.5">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <Skeleton className="h-3.5 w-40" />
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="divide-y divide-border rounded-xl border border-border bg-card/60 overflow-hidden"
                data-ocid="channel-members-list"
              >
                {channel?.memberIds.map((memberId) => {
                  const isOwner =
                    channel.createdBy.toString() === memberId.toString();
                  return (
                    <div
                      key={memberId.toString()}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(memberId)}`}
                      >
                        {memberInitials(memberId)}
                      </div>
                      <span className="text-sm text-foreground font-medium flex-1 min-w-0 truncate">
                        {memberId.toString().slice(0, 16)}…
                      </span>
                      {isOwner && (
                        <Badge
                          variant="outline"
                          className="text-[10px] border-teal-500/30 text-teal-600 dark:text-teal-400 shrink-0"
                        >
                          Creator
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
