import { m as useParams, e as useActor, n as useQueryClient, g as getTenantId, r as reactExports, h as useQuery, o as WorkspaceRole, j as jsxRuntimeExports, B as Button, p as Shield, A as Avatar, q as AvatarFallback, l as createActor } from "./index-DemOGW1B.js";
import { B as Badge } from "./badge-BgvX66QS.js";
import { I as Input } from "./input-1iXuA55D.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-NwajN2eF.js";
import { S as Skeleton } from "./skeleton-M5HtR2mS.js";
import { u as useMutation } from "./useMutation-4TvYOXEz.js";
import { u as ue } from "./index-BBpqu5x7.js";
import { U as UserPlus } from "./user-plus-BO-C8ErO.js";
import { C as Crown } from "./crown-Ck6V-VxX.js";
import { U as Users } from "./users-CP73E1L-.js";
import { S as Search } from "./search-CqVwSPFD.js";
import { T as Trash2 } from "./trash-2-UJLUw61l.js";
import "./index-IXOTxK3N.js";
import "./index-DnYpjSFd.js";
import "./chevron-up-3jVPN2OD.js";
const ROLE_COLORS = {
  Admin: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Manager: "bg-secondary/10 text-secondary-foreground border-secondary/20",
  TeamMember: "bg-primary/10 text-primary border-primary/20",
  Guest: "bg-muted text-muted-foreground border-border"
};
function MemberRow({
  member,
  onRemove,
  onRoleChange
}) {
  const initials = member.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const memberKey = member.userId.toString();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors duration-150 border-t border-border/40",
      "data-ocid": `member-row-${memberKey}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-9 w-9 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/10 text-primary text-xs font-semibold", children: initials }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: member.displayName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: member.email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            className: `shrink-0 text-xs rounded-full px-2.5 py-0.5 ${ROLE_COLORS[member.role] ?? ROLE_COLORS.Guest}`,
            children: [
              member.role === WorkspaceRole.Admin && /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "mr-1 h-3 w-3" }),
              member.role
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: member.role,
            onValueChange: (v) => onRoleChange(member.userId, v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-7 w-[120px] text-xs",
                  "aria-label": "Change role",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: WorkspaceRole.Admin, children: "Admin" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: WorkspaceRole.Manager, children: "Manager" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: WorkspaceRole.TeamMember, children: "Team Member" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: WorkspaceRole.Guest, children: "Guest" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            onClick: () => onRemove(member.userId),
            "aria-label": `Remove ${member.displayName}`,
            "data-ocid": `remove-member-${memberKey}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
          }
        )
      ]
    }
  );
}
function WorkspaceMembersPage() {
  const { workspaceId } = useParams({ strict: false });
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const [search, setSearch] = reactExports.useState("");
  const membersQuery = useQuery({
    queryKey: ["workspace-members", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor || !workspaceId) return [];
      return actor.listWorkspaceMembers(tenantId, workspaceId);
    },
    enabled: !!actor && !!workspaceId
  });
  const removeMutation = useMutation({
    mutationFn: async (userId) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.removeWorkspaceMember(
        tenantId,
        workspaceId,
        userId
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", tenantId, workspaceId]
      });
      ue.success("Member removed");
    },
    onError: (e) => ue.error(e.message)
  });
  const roleChangeMutation = useMutation({
    mutationFn: async ({
      userId,
      role
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updateWorkspaceMemberRole(
        tenantId,
        workspaceId,
        userId,
        role
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", tenantId, workspaceId]
      });
      ue.success("Role updated");
    },
    onError: (e) => ue.error(e.message)
  });
  const members = membersQuery.data ?? [];
  const filtered = search ? members.filter(
    (m) => m.displayName.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
  ) : members;
  const adminCount = members.filter(
    (m) => m.role === WorkspaceRole.Admin
  ).length;
  const managerCount = members.filter(
    (m) => m.role === WorkspaceRole.Manager
  ).length;
  const memberCount = members.filter(
    (m) => m.role === WorkspaceRole.TeamMember
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-3xl mx-auto space-y-6 animate-fade-in-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: "Workspace Members" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Manage who has access to this workspace and their roles." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "gap-2 shrink-0 active-press",
          "data-ocid": "invite-member-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
            "Invite member"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: [
      {
        label: "Admins",
        count: adminCount,
        color: "text-amber-500 bg-amber-500/10",
        icon: Crown
      },
      {
        label: "Managers",
        count: managerCount,
        color: "text-secondary-foreground bg-secondary/10",
        icon: Shield
      },
      {
        label: "Members",
        count: memberCount,
        color: "text-primary bg-primary/10",
        icon: Users
      }
    ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2.5 rounded-xl border border-border/50 bg-card p-3 shadow-card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex h-8 w-8 items-center justify-center rounded-lg ${s.color}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold font-display text-foreground", children: membersQuery.isLoading ? "—" : s.count }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.label })
          ] })
        ]
      },
      s.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Search members…",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "pl-9",
          "data-ocid": "member-search-input"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/50 overflow-hidden shadow-card bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:grid grid-cols-[1fr_1fr_120px_120px_40px] gap-4 bg-muted/30 px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Member" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Change" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
      ] }),
      membersQuery.isLoading && ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3 px-4 py-3.5 border-t border-border/40",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-full shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
            ] })
          ]
        },
        `sk-${k}`
      )),
      !membersQuery.isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-14 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "mx-auto mb-3 h-10 w-10 text-muted-foreground/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No members found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: search ? "Try a different search term." : "Invite team members to get started." })
      ] }),
      filtered.map((member) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        MemberRow,
        {
          member,
          onRemove: (userId) => removeMutation.mutate(userId),
          onRoleChange: (userId, role) => roleChangeMutation.mutate({ userId, role })
        },
        member.userId.toString()
      ))
    ] }),
    members.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
      members.length,
      " member",
      members.length !== 1 ? "s" : ""
    ] })
  ] });
}
export {
  WorkspaceMembersPage as default
};
