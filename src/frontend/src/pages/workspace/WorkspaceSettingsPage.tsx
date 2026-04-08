import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Principal } from "@icp-sdk/core/principal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Calendar,
  Copy,
  ExternalLink,
  Globe,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Trash2,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import { getTenantId, setWorkspaceId } from "../../hooks/useWorkspace";
import type { Workspace, WorkspaceMember } from "../../types";
import { WorkspaceRole } from "../../types";

const ROLE_LABELS: Record<WorkspaceRole, string> = {
  [WorkspaceRole.Admin]: "Admin",
  [WorkspaceRole.Manager]: "Manager",
  [WorkspaceRole.TeamMember]: "Team Member",
  [WorkspaceRole.Guest]: "Guest",
};

const ROLE_BADGE_CLASS: Record<WorkspaceRole, string> = {
  [WorkspaceRole.Admin]:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  [WorkspaceRole.Manager]:
    "bg-secondary/10 text-secondary-foreground border-secondary/20",
  [WorkspaceRole.TeamMember]: "bg-primary/10 text-primary border-primary/20",
  [WorkspaceRole.Guest]: "bg-muted text-muted-foreground border-border",
};

function RoleBadge({ role }: { role: WorkspaceRole }) {
  const cls =
    ROLE_BADGE_CLASS[role] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}
    >
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}

function formatDate(ts: bigint | number): string {
  const ms = typeof ts === "bigint" ? Number(ts) / 1_000_000 : ts;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PublicGoalsSection({
  tenantId,
  workspaceId,
}: { tenantId: string; workspaceId: string }) {
  const { actor, isFetching } = useActor(createActor);
  const [shareToken, setShareToken] = useState<string>("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const publicUrl = shareToken
    ? `${window.location.origin}/public/goals/${shareToken}`
    : "";

  const { isLoading: isLoadingToken } = useQuery<string>({
    queryKey: ["workspaceShareToken", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return "";
      const token = await actor.getOrCreateWorkspaceShareToken(
        workspaceId,
        tenantId,
      );
      setShareToken(token);
      return token;
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const handleCopyLink = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    toast.success("Link copied to clipboard");
  };

  const handleRegenerate = async () => {
    if (!actor) return;
    setIsRegenerating(true);
    try {
      const newToken = await actor.regenerateWorkspaceShareToken(
        workspaceId,
        tenantId,
      );
      setShareToken(newToken);
      toast.success("Share link regenerated — previous link is now invalid");
    } catch {
      toast.error("Failed to regenerate link");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <Card
      className="border-border/50 bg-card shadow-card"
      data-ocid="public-goals-link-section"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          Public Goals Link
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Share with external stakeholders so they can view OKR progress without
          logging in.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoadingToken ? (
          <Skeleton className="h-10 w-full rounded-md" />
        ) : (
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Shareable URL
            </Label>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={publicUrl}
                placeholder="Generating link…"
                className="flex-1 font-mono text-xs text-muted-foreground bg-muted/30 cursor-default focus-visible:ring-0"
                onClick={(e) => (e.target as HTMLInputElement).select()}
                data-ocid="public-goals-url-input"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                disabled={!publicUrl}
                className="shrink-0 active-press"
                data-ocid="public-goals-copy-btn"
              >
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                Copy
              </Button>
              {publicUrl && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-9 w-9 hover:bg-muted"
                  asChild
                  aria-label="Open public goals page"
                >
                  <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
        <div className="flex items-start justify-between gap-4 pt-1">
          <p className="text-xs text-muted-foreground max-w-sm">
            Regenerating the link will invalidate the previous URL.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            disabled={isRegenerating || isLoadingToken}
            className="shrink-0 active-press"
            data-ocid="public-goals-regenerate-btn"
          >
            {isRegenerating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            )}
            Regenerate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function GeneralTab({
  workspace,
  tenantId,
  workspaceId,
  isAdmin,
}: {
  workspace: Workspace;
  tenantId: string;
  workspaceId: string;
  isAdmin: boolean;
}) {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [name, setName] = useState(workspace.name);
  const [isRenaming, setIsRenaming] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [confirmName, setConfirmName] = useState("");

  const handleSave = async () => {
    if (!actor || !name.trim()) return;
    setIsRenaming(true);
    try {
      const res = await actor.updateWorkspace(
        tenantId,
        workspaceId,
        name.trim(),
      );
      if (res.__kind__ === "ok") {
        queryClient.invalidateQueries({
          queryKey: ["workspace", tenantId, workspaceId],
        });
        queryClient.invalidateQueries({ queryKey: ["workspaces", tenantId] });
        toast.success("Workspace name updated");
      } else toast.error(res.err ?? "Update failed");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsRenaming(false);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(workspaceId);
    toast.success("Workspace ID copied");
  };

  const handleDelete = () => {
    setWorkspaceId("");
    queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    toast.success("Workspace removed from your account");
    navigate({ to: "/app/workspaces" });
  };

  return (
    <div className="space-y-5">
      <Card className="border-border/50 bg-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Workspace name
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              placeholder="Workspace name"
              className="flex-1"
              data-ocid="workspace-settings-name-input"
            />
            <Button
              onClick={handleSave}
              disabled={isRenaming || !name.trim() || name === workspace.name}
              className="active-press"
              data-ocid="workspace-settings-save-name"
            >
              {isRenaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Workspace ID
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-muted/30 rounded-lg px-3 py-2 text-sm font-mono text-muted-foreground truncate border border-border/40">
              {workspaceId}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyId}
              className="active-press"
              data-ocid="workspace-settings-copy-id"
            >
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              Copy
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Use this ID when integrating with external tools or referencing via
            API.
          </p>
        </CardContent>
      </Card>

      {isAdmin && (
        <PublicGoalsSection tenantId={tenantId} workspaceId={workspaceId} />
      )}

      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-4 w-4" />
            Danger zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Delete this workspace
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permanent and cannot be undone. All data in this workspace will
                be lost.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              data-ocid="workspace-settings-delete-btn"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{workspace.name}</strong> and
              all of its data. Type the workspace name to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            className="my-2"
            placeholder={workspace.name}
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            data-ocid="workspace-delete-confirm-input"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={confirmName !== workspace.name}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
              data-ocid="workspace-delete-confirm-action"
            >
              Delete workspace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function MembersTab({
  workspace,
  tenantId,
  workspaceId,
}: { workspace: Workspace; tenantId: string; workspaceId: string }) {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteDisplayName, setInviteDisplayName] = useState("");
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>(
    WorkspaceRole.TeamMember,
  );
  const [isInviting, setIsInviting] = useState(false);

  const { data: members = [], isLoading } = useQuery<WorkspaceMember[]>({
    queryKey: ["workspaceMembers", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaceMembers(tenantId, workspaceId);
    },
    enabled: !!actor,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["workspaceMembers", tenantId, workspaceId],
    });
    queryClient.invalidateQueries({
      queryKey: ["workspace", tenantId, workspaceId],
    });
  }, [queryClient, tenantId, workspaceId]);

  const handleInvite = async () => {
    if (!actor || !inviteEmail.trim()) return;
    setIsInviting(true);
    try {
      let userPrincipal: Principal;
      try {
        userPrincipal = Principal.fromText(inviteEmail.trim());
      } catch {
        userPrincipal = Principal.anonymous();
      }
      const res = await actor.addWorkspaceMember(
        tenantId,
        workspaceId,
        userPrincipal,
        inviteRole,
        inviteDisplayName.trim() || inviteEmail.trim(),
        inviteEmail.trim(),
      );
      if (res.__kind__ === "ok") {
        toast.success("Member added");
        setInviteEmail("");
        setInviteDisplayName("");
        setInviteRole(WorkspaceRole.TeamMember);
        invalidate();
      } else toast.error(res.err ?? "Failed to add member");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: WorkspaceRole) => {
    if (!actor) return;
    try {
      const res = await actor.updateWorkspaceMemberRole(
        tenantId,
        workspaceId,
        Principal.fromText(userId),
        newRole,
      );
      if (res.__kind__ === "ok") {
        toast.success("Role updated");
        invalidate();
      } else toast.error(res.err ?? "Failed to update role");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleRemove = async (userId: string) => {
    if (!actor) return;
    try {
      const res = await actor.removeWorkspaceMember(
        tenantId,
        workspaceId,
        Principal.fromText(userId),
      );
      if (res.__kind__ === "ok") {
        toast.success("Member removed");
        invalidate();
      } else toast.error(res.err ?? "Failed to remove member");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-5">
      <Card className="border-border/50 bg-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            Add member
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-3 items-end">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Display name
              </Label>
              <Input
                placeholder="Jane Doe"
                value={inviteDisplayName}
                onChange={(e) => setInviteDisplayName(e.target.value)}
                data-ocid="workspace-invite-name-input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Email / user ID
              </Label>
              <Input
                type="email"
                placeholder="jane@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleInvite();
                }}
                data-ocid="workspace-invite-email-input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Role</Label>
              <Select
                value={inviteRole}
                onValueChange={(v) => setInviteRole(v as WorkspaceRole)}
              >
                <SelectTrigger
                  className="w-36"
                  data-ocid="workspace-invite-role-select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(WorkspaceRole).map((r) => (
                    <SelectItem key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleInvite}
              disabled={!inviteEmail.trim() || isInviting}
              className="active-press"
              data-ocid="workspace-invite-submit"
            >
              {isInviting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Add"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Members{" "}
            <span className="text-muted-foreground font-normal text-sm">
              ({members.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          )}
          {!isLoading && members.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No members yet. Add one above.
            </div>
          )}
          {!isLoading && members.length > 0 && (
            <div className="divide-y divide-border/40">
              {members.map((member, idx) => {
                const memberIdStr = member.userId.toString();
                const ownerIdStr = workspace.ownerId.toString();
                const isOwner = memberIdStr === ownerIdStr;
                return (
                  <div
                    key={memberIdStr}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/20 transition-colors"
                    data-ocid={`workspace-member-row-${idx}`}
                  >
                    <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary font-semibold text-sm">
                      {(member.displayName || member.email || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {member.displayName || member.email || memberIdStr}
                        {isOwner && (
                          <span className="ml-2 text-xs text-muted-foreground font-normal">
                            (Owner)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.email}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Calendar className="h-3 w-3" />
                      {formatDate(member.joinedAt)}
                    </div>
                    {!isOwner ? (
                      <Select
                        value={member.role}
                        onValueChange={(v) =>
                          handleRoleChange(memberIdStr, v as WorkspaceRole)
                        }
                      >
                        <SelectTrigger
                          className="w-32 h-7 text-xs"
                          data-ocid={`workspace-member-role-select-${idx}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(WorkspaceRole).map((r) => (
                            <SelectItem key={r} value={r} className="text-xs">
                              {ROLE_LABELS[r]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <RoleBadge role={member.role} />
                    )}
                    {!isOwner && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                        onClick={() => handleRemove(memberIdStr)}
                        aria-label={`Remove ${member.displayName ?? member.email}`}
                        data-ocid={`workspace-member-remove-${idx}`}
                      >
                        <UserMinus className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function WorkspaceSettingsPage() {
  const { workspaceId } = useParams({
    from: "/app/$workspaceId/workspace/settings",
  });
  const { actor, isFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const tenantId = getTenantId();

  const { data: workspace, isLoading } = useQuery<Workspace | null>({
    queryKey: ["workspace", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      const res = await actor.getWorkspace(tenantId, workspaceId);
      if (res.__kind__ === "ok") return res.ok;
      return null;
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const { data: members = [] } = useQuery<WorkspaceMember[]>({
    queryKey: ["workspaceMembers", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaceMembers(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const currentPrincipal = identity?.getPrincipal()?.toText() ?? "";
  const currentMember = members.find(
    (m) => m.userId.toString() === currentPrincipal,
  );
  const isAdmin =
    !!workspace &&
    (currentMember?.role === WorkspaceRole.Admin || members.length === 0);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-muted-foreground">
        Workspace not found.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 animate-fade-in-up">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Workspace settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage <strong>{workspace.name}</strong> — general settings, members,
          and roles.
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList
          className="mb-6 bg-muted/40 border border-border/40"
          data-ocid="workspace-settings-tabs"
        >
          <TabsTrigger
            value="general"
            data-ocid="workspace-settings-tab-general"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="members"
            data-ocid="workspace-settings-tab-members"
          >
            Members &amp; Roles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralTab
            workspace={workspace}
            tenantId={tenantId}
            workspaceId={workspaceId}
            isAdmin={isAdmin}
          />
        </TabsContent>

        <TabsContent value="members">
          <MembersTab
            workspace={workspace}
            tenantId={tenantId}
            workspaceId={workspaceId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
