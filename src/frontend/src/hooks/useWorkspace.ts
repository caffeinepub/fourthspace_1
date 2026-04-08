import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { createActor } from "../backend";
import type { UserProfile, Workspace } from "../types";

const TENANT_KEY = "fourthspace_tenant_id";
const WORKSPACE_KEY = "fourthspace_workspace_id";

// ---- Non-hook helpers (safe for use outside components) ----
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

// ---- Hook return type ----
export interface WorkspaceState {
  /** All workspaces the user belongs to */
  workspaces: Workspace[];
  /** The currently active workspace object */
  activeWorkspace: Workspace | null;
  /** The currently active workspace ID (from localStorage) */
  activeWorkspaceId: string | null;
  /** Switch the active workspace and invalidate all workspace-scoped caches */
  setActiveWorkspace: (workspaceId: string) => void;
  /** User profile */
  userProfile: UserProfile | null;
  /** Tenant ID (from localStorage or default) */
  tenantId: string;
  isLoading: boolean;
  isFetched: boolean;
  error: Error | null;
  // Legacy compat
  workspace: Workspace | null;
}

// Workspace-scoped query key prefixes that must be invalidated on switch
const WORKSPACE_SCOPED_KEYS = [
  "workspaces",
  "notes",
  "projects",
  "tasks",
  "channels",
  "messages",
  "events",
  "employees",
  "payroll",
  "escrow",
  "wallet",
  "goals",
  "whiteboards",
  "forms",
  "timeEntries",
  "integrations",
  "sprints",
  "milestones",
  "myProfile",
  "dashboard",
  "activity",
  "pages",
  "members",
  "calendars",
  "aiConfigs",
  "spendingLimits",
  "treasury",
];

export function useWorkspace(): WorkspaceState {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const tenantId = getTenantId();

  // Fetch user profile
  const profileQuery = useQuery<UserProfile | null>({
    queryKey: ["myProfile", tenantId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile(tenantId);
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  // Fetch all workspaces for this tenant
  const workspacesQuery = useQuery<Workspace[]>({
    queryKey: ["workspaces", tenantId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaces(tenantId);
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  const workspaces = workspacesQuery.data ?? [];

  // Determine active workspace ID — from localStorage, or auto-select first
  let activeWorkspaceId = getWorkspaceId();
  if (!activeWorkspaceId && workspaces.length > 0) {
    activeWorkspaceId = workspaces[0].id;
    setWorkspaceId(workspaces[0].id);
  }

  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) ?? null;

  const setActiveWorkspace = useCallback(
    (workspaceId: string) => {
      setWorkspaceId(workspaceId);
      // Invalidate ALL workspace-scoped queries so the new workspace's data loads fresh
      void Promise.all(
        WORKSPACE_SCOPED_KEYS.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      );
    },
    [queryClient],
  );

  const isLoading =
    isFetching || profileQuery.isLoading || workspacesQuery.isLoading;
  const isFetched =
    !!actor && profileQuery.isFetched && workspacesQuery.isFetched;
  const error =
    (profileQuery.error as Error | null) ??
    (workspacesQuery.error as Error | null);

  return {
    workspaces,
    activeWorkspace,
    activeWorkspaceId,
    setActiveWorkspace,
    userProfile: profileQuery.data ?? null,
    tenantId,
    isLoading,
    isFetched,
    error,
    // Legacy compat: expose activeWorkspace as workspace
    workspace: activeWorkspace,
  };
}
