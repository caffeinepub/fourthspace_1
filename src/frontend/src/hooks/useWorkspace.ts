import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { UserProfile, Workspace } from "../types";

const TENANT_KEY = "fourthspace_tenant_id";
const WORKSPACE_KEY = "fourthspace_workspace_id";

export function getTenantId(): string {
  return localStorage.getItem(TENANT_KEY) ?? "default";
}

export function setTenantId(id: string): void {
  localStorage.setItem(TENANT_KEY, id);
}

export function getWorkspaceId(): string | null {
  return localStorage.getItem(WORKSPACE_KEY);
}

export function setWorkspaceId(id: string): void {
  localStorage.setItem(WORKSPACE_KEY, id);
}

export interface WorkspaceState {
  workspace: Workspace | null;
  tenantId: string;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isFetched: boolean;
}

export function useWorkspace(): WorkspaceState {
  const { actor, isFetching } = useActor(createActor);
  const tenantId = getTenantId();

  const profileQuery = useQuery<UserProfile | null>({
    queryKey: ["myProfile", tenantId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile(tenantId);
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  const workspaceId = getWorkspaceId();
  const workspaceQuery = useQuery<Workspace | null>({
    queryKey: ["workspace", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor || !workspaceId) return null;
      const result = await actor.getWorkspace(tenantId, workspaceId);
      if (result.__kind__ === "ok") return result.ok;
      return null;
    },
    enabled: !!actor && !isFetching && !!workspaceId,
    retry: false,
  });

  const isLoading =
    isFetching || profileQuery.isLoading || workspaceQuery.isLoading;
  const isFetched = !!actor && profileQuery.isFetched;

  return {
    workspace: workspaceQuery.data ?? null,
    tenantId,
    userProfile: profileQuery.data ?? null,
    isLoading,
    isFetched,
  };
}
