import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft, Crown, Shield, User, UserCheck, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import { Role } from "../../types";
import type { UserProfile } from "../../types";

const ROLE_META: Record<
  Role,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    className: string;
  }
> = {
  [Role.Admin]: {
    label: "Admin",
    icon: Crown,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  [Role.Manager]: {
    label: "Manager",
    icon: Shield,
    className: "bg-secondary/10 text-secondary-foreground border-secondary/20",
  },
  [Role.TeamMember]: {
    label: "Team Member",
    icon: User,
    className: "bg-muted text-muted-foreground",
  },
};

const ROLE_FILTERS = ["All", "Admin", "Manager", "TeamMember"] as const;
type RoleFilter = (typeof ROLE_FILTERS)[number];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data: profiles, isLoading } = useQuery<UserProfile[]>({
    queryKey: ["profiles", tenantId],
    queryFn: async () => (actor ? actor.listProfiles(tenantId) : []),
    enabled: !!actor && !isFetching,
  });

  const { mutate: updateRole } = useMutation({
    mutationFn: async ({
      profile,
      newRole,
    }: {
      profile: UserProfile;
      newRole: Role;
    }) => {
      if (!actor) throw new Error("Not connected");
      setUpdatingId(profile.userId.toString());
      return actor.upsertProfile(tenantId, {
        displayName: profile.displayName,
        email: profile.email,
        role: newRole,
        workspaceId: profile.workspaceId,
      });
    },
    onSuccess: (result) => {
      setUpdatingId(null);
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["profiles"] });
        toast.success("Role updated successfully");
      } else {
        toast.error(result.err);
      }
    },
    onError: () => {
      setUpdatingId(null);
      toast.error("Failed to update role");
    },
  });

  const filtered = (profiles ?? []).filter(
    (p) => roleFilter === "All" || p.role === roleFilter,
  );

  const adminCount = profiles?.filter((p) => p.role === Role.Admin).length ?? 0;
  const managerCount =
    profiles?.filter((p) => p.role === Role.Manager).length ?? 0;
  const memberCount =
    profiles?.filter((p) => p.role === Role.TeamMember).length ?? 0;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/app/admin" })}
          aria-label="Back to admin"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10">
          <Users className="h-4 w-4 text-teal-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage team members, roles, and access
          </p>
        </div>
      </div>

      {/* Role Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Admins",
            count: adminCount,
            icon: Crown,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Managers",
            count: managerCount,
            icon: Shield,
            color: "text-secondary-foreground",
            bg: "bg-secondary/10",
          },
          {
            label: "Team Members",
            count: memberCount,
            icon: UserCheck,
            color: "text-teal-500",
            bg: "bg-teal-500/10",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}
              >
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div>
                {isLoading ? (
                  <Skeleton className="h-6 w-8" />
                ) : (
                  <p className="text-xl font-bold font-display text-foreground">
                    {stat.count}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Filter by role:
        </span>
        <div className="flex gap-2 flex-wrap">
          {ROLE_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setRoleFilter(filter)}
              data-ocid={`role-filter-${filter.toLowerCase()}`}
              type="button"
              className={`rounded-full px-3 py-1 text-xs font-medium transition-smooth ${
                roleFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {filter === "TeamMember" ? "Team Member" : filter}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="rounded-2xl border border-border overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_140px] gap-4 bg-muted/40 px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Member</span>
            <span>Email</span>
            <span>Workspace</span>
            <span>Joined</span>
            <span>Role</span>
          </div>
          {filtered.map((profile) => {
            const meta = ROLE_META[profile.role];
            const RoleIcon = meta.icon;
            const isUpdating = updatingId === profile.userId.toString();
            return (
              <div
                key={profile.userId.toString()}
                className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr_1fr_140px] gap-4 items-center border-t border-border bg-card px-5 py-4 hover:bg-muted/20 transition-smooth"
                data-ocid={`user-${profile.userId.toString()}`}
              >
                {/* Name + Avatar */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {getInitials(profile.displayName)}
                  </div>
                  <span className="font-medium text-foreground text-sm truncate">
                    {profile.displayName}
                  </span>
                </div>
                {/* Email */}
                <p className="text-sm text-muted-foreground truncate">
                  {profile.email || "—"}
                </p>
                {/* Workspace */}
                <p className="text-xs text-muted-foreground font-mono truncate">
                  {profile.workspaceId.slice(0, 10)}...
                </p>
                {/* Joined date */}
                <p className="text-xs text-muted-foreground">
                  {format(
                    new Date(Number(profile.createdAt) / 1_000_000),
                    "MMM d, yyyy",
                  )}
                </p>
                {/* Role selector */}
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${meta.className} shrink-0 hidden md:flex`}
                  >
                    <RoleIcon className="mr-1 h-3 w-3" />
                    {meta.label}
                  </Badge>
                  <Select
                    value={profile.role}
                    onValueChange={(v) =>
                      updateRole({ profile, newRole: v as Role })
                    }
                    disabled={isUpdating}
                  >
                    <SelectTrigger
                      className="h-7 text-xs w-[120px]"
                      data-ocid={`role-select-${profile.userId.toString()}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Role.Admin}>Admin</SelectItem>
                      <SelectItem value={Role.Manager}>Manager</SelectItem>
                      <SelectItem value={Role.TeamMember}>
                        Team Member
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center"
          data-ocid="users-empty"
        >
          <Users className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-semibold text-foreground">No users found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {roleFilter !== "All"
              ? `No users with the ${roleFilter} role.`
              : "Invite team members to get started."}
          </p>
        </div>
      )}
    </div>
  );
}
