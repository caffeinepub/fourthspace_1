import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Globe, Hash, Lock, Plus, Users, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import type { Channel, ChannelInput } from "../../types";

function ChannelCard({
  channel,
  onJoin,
  isJoining,
}: {
  channel: Channel;
  onJoin?: (id: string) => void;
  isJoining?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Link
        to="/app/chat/$channelId"
        params={{ channelId: channel.id }}
        data-ocid={`channel-item-${channel.id}`}
        className="flex-1 flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-smooth hover:shadow-md hover:-translate-y-0.5 group min-w-0"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/10">
          <Hash className="h-5 w-5 text-teal-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-sm">
              #{channel.name}
            </span>
            {channel.isPublic ? (
              <Badge
                variant="outline"
                className="shrink-0 text-xs gap-1 border-teal-500/30 text-teal-600 dark:text-teal-400 py-0"
              >
                <Globe className="h-2.5 w-2.5" />
                Public
              </Badge>
            ) : (
              <Badge variant="outline" className="shrink-0 text-xs gap-1 py-0">
                <Lock className="h-2.5 w-2.5" />
                Private
              </Badge>
            )}
          </div>
          {channel.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {channel.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
          <Users className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">
            {channel.memberIds.length}
          </span>
        </div>
      </Link>
      {onJoin && channel.isPublic && (
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 text-teal-600 border-teal-500/30 hover:bg-teal-50 dark:hover:bg-teal-950/30"
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

function CreateChannelForm({ onClose }: { onClose: () => void }) {
  const { actor } = useBackend();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const createMutation = useMutation({
    mutationFn: async (input: ChannelInput) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createChannel(tenantId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels", tenantId] });
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

export default function ChatPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);

  const { data: channels, isLoading } = useQuery<Channel[]>({
    queryKey: ["channels", tenantId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listChannels(tenantId);
    },
    enabled: !!actor && !isFetching,
  });

  const joinMutation = useMutation({
    mutationFn: async (channelId: string) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.joinChannel(tenantId, channelId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_, channelId) => {
      queryClient.invalidateQueries({ queryKey: ["channels", tenantId] });
      toast.success("Joined channel");
      void channelId;
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const publicChannels = channels?.filter((c) => c.isPublic) ?? [];
  const privateChannels = channels?.filter((c) => !c.isPublic) ?? [];

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Chat
          </h1>
          <p className="text-sm text-muted-foreground">
            Team channels and conversations
          </p>
        </div>
        <Button
          onClick={() => setShowCreate((v) => !v)}
          className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
          data-ocid="create-channel-btn"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Channel</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {/* Create form */}
      {showCreate && <CreateChannelForm onClose={() => setShowCreate(false)} />}

      {/* Channel list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-[72px] rounded-2xl" />
          ))}
        </div>
      ) : channels && channels.length > 0 ? (
        <div className="space-y-6">
          {publicChannels.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-3.5 w-3.5 text-teal-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Public
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {publicChannels.length}
                </span>
              </div>
              <div className="space-y-2">
                {publicChannels.map((ch) => (
                  <ChannelCard
                    key={ch.id}
                    channel={ch}
                    onJoin={(id) => joinMutation.mutate(id)}
                    isJoining={joinMutation.isPending}
                  />
                ))}
              </div>
            </section>
          )}
          {privateChannels.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Private
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {privateChannels.length}
                </span>
              </div>
              <div className="space-y-2">
                {privateChannels.map((ch) => (
                  <ChannelCard key={ch.id} channel={ch} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center"
          data-ocid="channels-empty"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 mb-4">
            <Hash className="h-7 w-7 text-teal-500" />
          </div>
          <h3 className="font-display font-semibold text-foreground">
            No channels yet
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            Create your first channel to start collaborating with your team.
          </p>
          <Button
            onClick={() => setShowCreate(true)}
            className="mt-6 bg-teal-600 hover:bg-teal-700 text-white"
            data-ocid="channels-empty-cta"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create first channel
          </Button>
        </div>
      )}
    </div>
  );
}
