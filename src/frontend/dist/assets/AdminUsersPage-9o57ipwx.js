import { g as createLucideIcon, a as useNavigate, d as useQueryClient, h as getTenantId, r as reactExports, e as useQuery, a1 as Role, j as jsxRuntimeExports, B as Button, l as Shield, U as User } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { C as Card, c as CardContent } from "./card-wy6FYjGT.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D0Yw2k_p.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { u as useMutation } from "./useMutation-BeBnUQJD.js";
import { u as ue } from "./index-p-k3Ndic.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { A as ArrowLeft } from "./arrow-left-mNBAKt8w.js";
import { U as Users } from "./users-0z2gux4W.js";
import { f as format } from "./format-BjBbZPfh.js";
import "./index-IXOTxK3N.js";
import "./index-BGFsRO7G.js";
import "./check-EW6vRiNm.js";
import "./en-US-CJ_JRP0W.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
];
const Crown = createLucideIcon("crown", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = createLucideIcon("user-check", __iconNode);
const ROLE_META = {
  [Role.Admin]: {
    label: "Admin",
    icon: Crown,
    className: "bg-primary/10 text-primary border-primary/20"
  },
  [Role.Manager]: {
    label: "Manager",
    icon: Shield,
    className: "bg-secondary/10 text-secondary-foreground border-secondary/20"
  },
  [Role.TeamMember]: {
    label: "Team Member",
    icon: User,
    className: "bg-muted text-muted-foreground"
  }
};
const ROLE_FILTERS = ["All", "Admin", "Manager", "TeamMember"];
function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}
function AdminUsersPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const [roleFilter, setRoleFilter] = reactExports.useState("All");
  const [updatingId, setUpdatingId] = reactExports.useState(null);
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["profiles", tenantId],
    queryFn: async () => actor ? actor.listProfiles(tenantId) : [],
    enabled: !!actor && !isFetching
  });
  const { mutate: updateRole } = useMutation({
    mutationFn: async ({
      profile,
      newRole
    }) => {
      if (!actor) throw new Error("Not connected");
      setUpdatingId(profile.userId.toString());
      return actor.upsertProfile(tenantId, {
        displayName: profile.displayName,
        email: profile.email,
        role: newRole,
        workspaceId: profile.workspaceId
      });
    },
    onSuccess: (result) => {
      setUpdatingId(null);
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["profiles"] });
        ue.success("Role updated successfully");
      } else {
        ue.error(result.err);
      }
    },
    onError: () => {
      setUpdatingId(null);
      ue.error("Failed to update role");
    }
  });
  const filtered = (profiles ?? []).filter(
    (p) => roleFilter === "All" || p.role === roleFilter
  );
  const adminCount = (profiles == null ? void 0 : profiles.filter((p) => p.role === Role.Admin).length) ?? 0;
  const managerCount = (profiles == null ? void 0 : profiles.filter((p) => p.role === Role.Manager).length) ?? 0;
  const memberCount = (profiles == null ? void 0 : profiles.filter((p) => p.role === Role.TeamMember).length) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-5xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: "/app/admin" }),
          "aria-label": "Back to admin",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-teal-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "User Management" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage team members, roles, and access" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-3", children: [
      {
        label: "Admins",
        count: adminCount,
        icon: Crown,
        color: "text-primary",
        bg: "bg-primary/10"
      },
      {
        label: "Managers",
        count: managerCount,
        icon: Shield,
        color: "text-secondary-foreground",
        bg: "bg-secondary/10"
      },
      {
        label: "Team Members",
        count: memberCount,
        icon: UserCheck,
        color: "text-teal-500",
        bg: "bg-teal-500/10"
      }
    ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: `h-4 w-4 ${stat.color}` })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-8" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold font-display text-foreground", children: stat.count }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: stat.label })
      ] })
    ] }) }, stat.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Filter by role:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: ROLE_FILTERS.map((filter) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setRoleFilter(filter),
          "data-ocid": `role-filter-${filter.toLowerCase()}`,
          type: "button",
          className: `rounded-full px-3 py-1 text-xs font-medium transition-smooth ${roleFilter === filter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`,
          children: filter === "TeamMember" ? "Team Member" : filter
        },
        filter
      )) })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3, 4].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, n)) }) : filtered.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_140px] gap-4 bg-muted/40 px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Member" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Workspace" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Joined" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Role" })
      ] }),
      filtered.map((profile) => {
        const meta = ROLE_META[profile.role];
        const RoleIcon = meta.icon;
        const isUpdating = updatingId === profile.userId.toString();
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr_1fr_140px] gap-4 items-center border-t border-border bg-card px-5 py-4 hover:bg-muted/20 transition-smooth",
            "data-ocid": `user-${profile.userId.toString()}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary", children: getInitials(profile.displayName) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground text-sm truncate", children: profile.displayName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground truncate", children: profile.email || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono truncate", children: [
                profile.workspaceId.slice(0, 10),
                "..."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: format(
                new Date(Number(profile.createdAt) / 1e6),
                "MMM d, yyyy"
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    className: `${meta.className} shrink-0 hidden md:flex`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RoleIcon, { className: "mr-1 h-3 w-3" }),
                      meta.label
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: profile.role,
                    onValueChange: (v) => updateRole({ profile, newRole: v }),
                    disabled: isUpdating,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectTrigger,
                        {
                          className: "h-7 text-xs w-[120px]",
                          "data-ocid": `role-select-${profile.userId.toString()}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: Role.Admin, children: "Admin" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: Role.Manager, children: "Manager" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: Role.TeamMember, children: "Team Member" })
                      ] })
                    ]
                  }
                )
              ] })
            ]
          },
          profile.userId.toString()
        );
      })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center",
        "data-ocid": "users-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10 text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No users found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: roleFilter !== "All" ? `No users with the ${roleFilter} role.` : "Invite team members to get started." })
        ]
      }
    )
  ] });
}
export {
  AdminUsersPage as default
};
