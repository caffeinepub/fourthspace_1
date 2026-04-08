import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Crown, Search, Shield, Trash2, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import { getTenantId } from "../../hooks/useWorkspace";
import { WorkspaceRole } from "../../types";
import type { WorkspaceMember } from "../../types";

const ROLE_COLORS: Record<string, string> = {
  Admin:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Manager: "bg-secondary/10 text-secondary-foreground border-secondary/20",
  TeamMember: "bg-primary/10 text-primary border-primary/20",
  Guest: "bg-muted text-muted-foreground border-border",
};

function MemberRow({
  member,
  onRemove,
  onRoleChange,
}: {
  member: WorkspaceMember;
  onRemove: (userId: Principal) => void;
  onRoleChange: (userId: Principal, role: WorkspaceRole) => void;
}) {
  const initials = member.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const memberKey = member.userId.toString();

  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors duration-150 border-t border-border/40"
      data-ocid={`member-row-${memberKey}`}
    >
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {member.displayName}
        </p>
        <p className="text-xs text-muted-foreground truncate">{member.email}</p>
      </div>
      <Badge
        className={`shrink-0 text-xs rounded-full px-2.5 py-0.5 ${ROLE_COLORS[member.role] ?? ROLE_COLORS.Guest}`}
      >
        {member.role === WorkspaceRole.Admin && (
          <Crown className="mr-1 h-3 w-3" />
        )}
        {member.role}
      </Badge>
      <Select
        value={member.role}
        onValueChange={(v) => onRoleChange(member.userId, v as WorkspaceRole)}
      >
        <SelectTrigger
          className="h-7 w-[120px] text-xs"
          aria-label="Change role"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={WorkspaceRole.Admin}>Admin</SelectItem>
          <SelectItem value={WorkspaceRole.Manager}>Manager</SelectItem>
          <SelectItem value={WorkspaceRole.TeamMember}>Team Member</SelectItem>
          <SelectItem value={WorkspaceRole.Guest}>Guest</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        onClick={() => onRemove(member.userId)}
        aria-label={`Remove ${member.displayName}`}
        data-ocid={`remove-member-${memberKey}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export default function WorkspaceMembersPage() {
  const { workspaceId } = useParams({ strict: false }) as {
    workspaceId: string;
  };
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const [search, setSearch] = useState("");

  const membersQuery = useQuery<WorkspaceMember[]>({
    queryKey: ["workspace-members", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor || !workspaceId) return [];
      return actor.listWorkspaceMembers(tenantId, workspaceId);
    },
    enabled: !!actor && !!workspaceId,
  });

  const removeMutation = useMutation({
    mutationFn: async (userId: Principal) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.removeWorkspaceMember(
        tenantId,
        workspaceId,
        userId,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", tenantId, workspaceId],
      });
      toast.success("Member removed");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const roleChangeMutation = useMutation({
    mutationFn: async ({
      userId,
      role,
    }: { userId: Principal; role: WorkspaceRole }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updateWorkspaceMemberRole(
        tenantId,
        workspaceId,
        userId,
        role,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", tenantId, workspaceId],
      });
      toast.success("Role updated");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const members = membersQuery.data ?? [];
  const filtered = search
    ? members.filter(
        (m) =>
          m.displayName.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase()),
      )
    : members;

  const adminCount = members.filter(
    (m) => m.role === WorkspaceRole.Admin,
  ).length;
  const managerCount = members.filter(
    (m) => m.role === WorkspaceRole.Manager,
  ).length;
  const memberCount = members.filter(
    (m) => m.role === WorkspaceRole.TeamMember,
  ).length;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Workspace Members
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage who has access to this workspace and their roles.
          </p>
        </div>
        <Button
          className="gap-2 shrink-0 active-press"
          data-ocid="invite-member-btn"
        >
          <UserPlus className="h-4 w-4" />
          Invite member
        </Button>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Admins",
            count: adminCount,
            color: "text-amber-500 bg-amber-500/10",
            icon: Crown,
          },
          {
            label: "Managers",
            count: managerCount,
            color: "text-secondary-foreground bg-secondary/10",
            icon: Shield,
          },
          {
            label: "Members",
            count: memberCount,
            color: "text-primary bg-primary/10",
            icon: Users,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card p-3 shadow-card"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.color}`}
            >
              <s.icon className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-base font-bold font-display text-foreground">
                {membersQuery.isLoading ? "—" : s.count}
              </p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search members…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-ocid="member-search-input"
        />
      </div>

      {/* Members list */}
      <div className="rounded-xl border border-border/50 overflow-hidden shadow-card bg-card">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[1fr_1fr_120px_120px_40px] gap-4 bg-muted/30 px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40">
          <span>Member</span>
          <span>Email</span>
          <span>Role</span>
          <span>Change</span>
          <span />
        </div>

        {membersQuery.isLoading &&
          ["a", "b", "c", "d"].map((k) => (
            <div
              key={`sk-${k}`}
              className="flex items-center gap-3 px-4 py-3.5 border-t border-border/40"
            >
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}

        {!membersQuery.isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm font-medium text-foreground">
              No members found
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search
                ? "Try a different search term."
                : "Invite team members to get started."}
            </p>
          </div>
        )}

        {filtered.map((member) => (
          <MemberRow
            key={member.userId.toString()}
            member={member}
            onRemove={(userId) => removeMutation.mutate(userId)}
            onRoleChange={(userId, role) =>
              roleChangeMutation.mutate({ userId, role })
            }
          />
        ))}
      </div>

      {members.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          {members.length} member{members.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
