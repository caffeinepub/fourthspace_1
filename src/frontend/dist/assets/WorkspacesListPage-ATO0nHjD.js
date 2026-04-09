import { e as useActor, g as getTenantId, d as useNavigate, f as useWorkspace, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, P as Plus, k as Building2, l as createActor } from "./index-CQ7TXF2a.js";
import { C as Card, a as CardContent } from "./card-DtVZ2GZq.js";
import { S as Skeleton } from "./skeleton-CzZABium.js";
import { m as motion } from "./proxy-Dv1CLJBo.js";
import { L as Layers } from "./layers-bBrlstaN.js";
import { U as Users } from "./users-Dh_2Am6J.js";
import { C as Clock } from "./clock-c3PUUUEP.js";
function RoleBadge({ role }) {
  const variants = {
    Admin: "bg-destructive/10 text-destructive border-destructive/20",
    Manager: "bg-secondary/10 text-secondary-foreground border-secondary/20",
    TeamMember: "bg-primary/10 text-primary border-primary/20",
    Guest: "bg-muted text-muted-foreground border-border"
  };
  const cls = variants[role] ?? "bg-muted text-muted-foreground border-border";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-tight ${cls}`,
      children: role
    }
  );
}
function WorkspaceCard({
  workspace,
  role,
  index,
  onSelect
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.055, duration: 0.3, ease: "easeOut" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "group cursor-pointer rounded-xl border border-border bg-card p-5 card-interactive hover:border-primary/30 hover:shadow-card-hover w-full text-left",
          onClick: () => onSelect(workspace.id),
          "data-ocid": `workspace-card-${workspace.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0 group-hover:from-primary/25 group-hover:to-primary/10 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4.5 w-4.5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground mb-2 truncate group-hover:text-primary transition-smooth tracking-tight", children: workspace.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-muted-foreground text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3 shrink-0" }),
                workspace.members.length,
                " ",
                workspace.members.length === 1 ? "member" : "members"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 shrink-0" }),
                "Active"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-border/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-smooth", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Click to open" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-primary animate-pulse" })
            ] })
          ]
        }
      )
    }
  );
}
function CreateNewCard({ index }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.055, duration: 0.3, ease: "easeOut" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/workspaces/new", "data-ocid": "workspace-create-new-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group cursor-pointer rounded-xl border border-dashed border-border/70 bg-card/40 p-5 hover:border-primary/40 hover:bg-muted/20 transition-smooth min-h-[142px] flex flex-col items-center justify-center text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl border border-dashed border-primary/40 flex items-center justify-center mb-3 group-hover:border-primary/70 group-hover:bg-primary/5 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 text-primary/60 group-hover:text-primary transition-smooth" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-smooth", children: "New workspace" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60 mt-0.5", children: "Isolated data & members" })
      ] }) })
    }
  );
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      className: "flex flex-col items-center justify-center text-center py-24 px-6",
      "data-ocid": "workspaces-empty-state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-8 w-8 text-muted-foreground/60" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground mb-2 tracking-tight", children: "No workspaces yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs max-w-xs mb-6 leading-relaxed", children: "Create your first workspace to get started. Each workspace keeps your team's data, members, and settings fully isolated." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            size: "sm",
            className: "gap-1.5 font-semibold",
            "data-ocid": "workspaces-empty-create-btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/workspaces/new", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
              "Create workspace"
            ] })
          }
        )
      ]
    }
  );
}
function WorkspacesListPage() {
  const { actor, isFetching } = useActor(createActor);
  const tenantId = getTenantId();
  const navigate = useNavigate();
  const { setActiveWorkspace } = useWorkspace();
  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ["workspaces", tenantId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaces(tenantId);
    },
    enabled: !!actor && !isFetching
  });
  function handleSelectWorkspace(workspaceId) {
    setActiveWorkspace(workspaceId);
    void navigate({
      to: "/app/$workspaceId/dashboard",
      params: { workspaceId }
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8 sm:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1", children: "All workspaces" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground tracking-tight", children: "Workspaces" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-0.5", children: "Select a workspace or create a new one." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          asChild: true,
          size: "sm",
          className: "gap-1.5 font-semibold h-8 text-xs",
          "data-ocid": "workspaces-header-create-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/workspaces/new", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            "New workspace"
          ] })
        }
      )
    ] }),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: ["sk-a", "sk-b", "sk-c", "sk-d"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-10 rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-14 rounded-full" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-3/4 rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/3 rounded" })
    ] }) }, id)) }),
    !isLoading && workspaces.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {}),
    !isLoading && workspaces.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [
      workspaces.map((ws, i) => {
        const memberEntry = ws.members[0];
        const role = memberEntry ? memberEntry[1].role : "TeamMember";
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          WorkspaceCard,
          {
            workspace: ws,
            role,
            index: i,
            onSelect: handleSelectWorkspace
          },
          ws.id
        );
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CreateNewCard, { index: workspaces.length })
    ] })
  ] });
}
export {
  WorkspacesListPage as default
};
