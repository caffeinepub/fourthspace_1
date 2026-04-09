import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Variant_away_offline_online } from "../backend";
import type { MessageSearchFilters, UserId } from "../types";
import { useBackend } from "./useBackend";

const POLL_INTERVAL = 3000;

// ── Query Hooks ──────────────────────────────────────────────────────────────

export function useThreadMessages(
  tenantId: string,
  workspaceId: string,
  parentMessageId: string,
) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["thread", tenantId, workspaceId, parentMessageId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getThreadMessages(tenantId, workspaceId, parentMessageId);
    },
    enabled: !!actor && !isFetching && !!parentMessageId,
    refetchInterval: POLL_INTERVAL,
  });
}

export function useSearchMessages(
  tenantId: string,
  workspaceId: string,
  query: string,
  filters: MessageSearchFilters = {},
) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["messages-search", tenantId, workspaceId, query, filters],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchMessages(
        tenantId,
        workspaceId,
        query,
        filters.channelId ?? null,
        null,
        filters.fromTime ?? null,
        filters.toTime ?? null,
      );
    },
    enabled: !!actor && !isFetching && !!query.trim(),
    refetchInterval: POLL_INTERVAL,
  });
}

export function useChannelPins(
  tenantId: string,
  workspaceId: string,
  channelId: string,
) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["channel-pins", tenantId, workspaceId, channelId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChannelPins(tenantId, workspaceId, channelId);
    },
    enabled: !!actor && !isFetching && !!channelId,
    refetchInterval: POLL_INTERVAL,
  });
}

export function useUnreadCounts(tenantId: string, workspaceId: string) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["unreadCounts", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [] as [string, bigint][];
      return actor.getUnreadCounts(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: POLL_INTERVAL,
  });
}

export function useUserStatus(
  tenantId: string,
  workspaceId: string,
  userId: UserId | null,
) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["user-status", tenantId, workspaceId, userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return null;
      return actor.getUserStatus(tenantId, workspaceId, userId);
    },
    enabled: !!actor && !isFetching && !!userId,
    refetchInterval: POLL_INTERVAL,
  });
}

// ── Mutation Hooks ───────────────────────────────────────────────────────────

export function useAddReaction() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tenantId,
      workspaceId,
      messageId,
      emoji,
    }: {
      tenantId: string;
      workspaceId: string;
      messageId: string;
      emoji: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.addReaction(
        tenantId,
        workspaceId,
        messageId,
        emoji,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ["messages", vars.tenantId, vars.workspaceId],
      });
      qc.invalidateQueries({
        queryKey: ["thread", vars.tenantId, vars.workspaceId],
      });
    },
  });
}

export function useRemoveReaction() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tenantId,
      workspaceId,
      messageId,
      emoji,
    }: {
      tenantId: string;
      workspaceId: string;
      messageId: string;
      emoji: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.removeReaction(
        tenantId,
        workspaceId,
        messageId,
        emoji,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ["messages", vars.tenantId, vars.workspaceId],
      });
      qc.invalidateQueries({
        queryKey: ["thread", vars.tenantId, vars.workspaceId],
      });
    },
  });
}

export function usePinMessage() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tenantId,
      workspaceId,
      channelId,
      messageId,
    }: {
      tenantId: string;
      workspaceId: string;
      channelId: string;
      messageId: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.pinMessage(
        tenantId,
        workspaceId,
        channelId,
        messageId,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: [
          "channel-pins",
          vars.tenantId,
          vars.workspaceId,
          vars.channelId,
        ],
      });
      qc.invalidateQueries({
        queryKey: ["channels", vars.tenantId, vars.workspaceId],
      });
    },
  });
}

export function useUnpinMessage() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tenantId,
      workspaceId,
      channelId,
      messageId,
    }: {
      tenantId: string;
      workspaceId: string;
      channelId: string;
      messageId: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.unpinMessage(
        tenantId,
        workspaceId,
        channelId,
        messageId,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: [
          "channel-pins",
          vars.tenantId,
          vars.workspaceId,
          vars.channelId,
        ],
      });
      qc.invalidateQueries({
        queryKey: ["channels", vars.tenantId, vars.workspaceId],
      });
    },
  });
}

export function useSetUserStatus() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tenantId,
      workspaceId,
      status,
      customStatus,
    }: {
      tenantId: string;
      workspaceId: string;
      status: Variant_away_offline_online;
      customStatus: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.setUserStatus(
        tenantId,
        workspaceId,
        status,
        customStatus,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ["user-status", vars.tenantId, vars.workspaceId],
      });
    },
  });
}

export function useMarkChannelRead() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tenantId,
      workspaceId,
      channelId,
    }: {
      tenantId: string;
      workspaceId: string;
      channelId: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.markChannelRead(
        tenantId,
        workspaceId,
        channelId,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ["unreadCounts", vars.tenantId, vars.workspaceId],
      });
    },
  });
}

export function useUpdateChannel() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tenantId,
      workspaceId,
      channelId,
      name,
      description,
      topic,
    }: {
      tenantId: string;
      workspaceId: string;
      channelId: string;
      name: string;
      description: string;
      topic: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.updateChannel(
        tenantId,
        workspaceId,
        channelId,
        name,
        description,
        topic,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ["channels", vars.tenantId, vars.workspaceId],
      });
      qc.invalidateQueries({
        queryKey: ["channel", vars.tenantId, vars.workspaceId, vars.channelId],
      });
    },
  });
}
