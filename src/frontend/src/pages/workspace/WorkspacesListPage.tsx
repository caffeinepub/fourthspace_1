import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Building2, Clock, Layers, Plus, Users } from "lucide-react";
import { motion } from "motion/react";
import { createActor } from "../../backend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import type { Workspace } from "../../types";

function RoleBadge({ role }: { role: string }) {
  const variants: Record<string, string> = {
    Admin: "bg-destructive/10 text-destructive border-destructive/20",
    Manager: "bg-secondary/10 text-secondary-foreground border-secondary/20",
    TeamMember: "bg-primary/10 text-primary border-primary/20",
    Guest: "bg-muted text-muted-foreground border-border",
  };
  const cls = variants[role] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-tight ${cls}`}
    >
      {role}
    </span>
  );
}

function WorkspaceCard({
  workspace,
  role,
  index,
  onSelect,
}: {
  workspace: Workspace;
  role: string;
  index: number;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, duration: 0.3, ease: "easeOut" }}
    >
      <button
        type="button"
        className="group cursor-pointer rounded-xl border border-border bg-card p-5 card-interactive hover:border-primary/30 hover:shadow-card-hover w-full text-left"
        onClick={() => onSelect(workspace.id)}
        data-ocid={`workspace-card-${workspace.id}`}
      >
        {/* Card header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0 group-hover:from-primary/25 group-hover:to-primary/10 transition-smooth">
            <Building2 className="h-4.5 w-4.5 text-primary" />
          </div>
          <RoleBadge role={role} />
        </div>

        {/* Name */}
        <h3 className="font-display font-semibold text-sm text-foreground mb-2 truncate group-hover:text-primary transition-smooth tracking-tight">
          {workspace.name}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-muted-foreground text-xs">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3 shrink-0" />
            {workspace.members.length}{" "}
            {workspace.members.length === 1 ? "member" : "members"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 shrink-0" />
            Active
          </span>
        </div>

        {/* Hover action indicator */}
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-smooth">
          <span className="text-[10px] text-muted-foreground">
            Click to open
          </span>
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        </div>
      </button>
    </motion.div>
  );
}

function CreateNewCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, duration: 0.3, ease: "easeOut" }}
    >
      <Link to="/app/workspaces/new" data-ocid="workspace-create-new-card">
        <div className="group cursor-pointer rounded-xl border border-dashed border-border/70 bg-card/40 p-5 hover:border-primary/40 hover:bg-muted/20 transition-smooth min-h-[142px] flex flex-col items-center justify-center text-center">
          <div className="h-9 w-9 rounded-xl border border-dashed border-primary/40 flex items-center justify-center mb-3 group-hover:border-primary/70 group-hover:bg-primary/5 transition-smooth">
            <Plus className="h-4 w-4 text-primary/60 group-hover:text-primary transition-smooth" />
          </div>
          <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-smooth">
            New workspace
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">
            Isolated data & members
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center py-24 px-6"
      data-ocid="workspaces-empty-state"
    >
      <div className="h-16 w-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-5">
        <Layers className="h-8 w-8 text-muted-foreground/60" />
      </div>
      <h2 className="font-display text-lg font-semibold text-foreground mb-2 tracking-tight">
        No workspaces yet
      </h2>
      <p className="text-muted-foreground text-xs max-w-xs mb-6 leading-relaxed">
        Create your first workspace to get started. Each workspace keeps your
        team's data, members, and settings fully isolated.
      </p>
      <Button
        asChild
        size="sm"
        className="gap-1.5 font-semibold"
        data-ocid="workspaces-empty-create-btn"
      >
        <Link to="/app/workspaces/new">
          <Plus className="h-3.5 w-3.5" />
          Create workspace
        </Link>
      </Button>
    </motion.div>
  );
}

export default function WorkspacesListPage() {
  const { actor, isFetching } = useActor(createActor);
  const tenantId = getTenantId();
  const navigate = useNavigate();
  const { setActiveWorkspace } = useWorkspace();

  const { data: workspaces = [], isLoading } = useQuery<Workspace[]>({
    queryKey: ["workspaces", tenantId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaces(tenantId);
    },
    enabled: !!actor && !isFetching,
  });

  function handleSelectWorkspace(workspaceId: string) {
    // setActiveWorkspace updates localStorage AND invalidates all workspace-scoped caches
    setActiveWorkspace(workspaceId);
    void navigate({
      to: "/app/$workspaceId/dashboard",
      params: { workspaceId },
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            All workspaces
          </p>
          <h1 className="font-display text-xl font-bold text-foreground tracking-tight">
            Workspaces
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Select a workspace or create a new one.
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="gap-1.5 font-semibold h-8 text-xs"
          data-ocid="workspaces-header-create-btn"
        >
          <Link to="/app/workspaces/new">
            <Plus className="h-3.5 w-3.5" />
            New workspace
          </Link>
        </Button>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {["sk-a", "sk-b", "sk-c", "sk-d"].map((id) => (
            <Card key={id} className="border-border bg-card">
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-4 w-14 rounded-full" />
                </div>
                <Skeleton className="h-3.5 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/3 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && workspaces.length === 0 && <EmptyState />}

      {/* Workspace grid */}
      {!isLoading && workspaces.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws, i) => {
            const memberEntry = ws.members[0];
            const role = memberEntry ? memberEntry[1].role : "TeamMember";
            return (
              <WorkspaceCard
                key={ws.id}
                workspace={ws}
                role={role}
                index={i}
                onSelect={handleSelectWorkspace}
              />
            );
          })}
          <CreateNewCard index={workspaces.length} />
        </div>
      )}
    </div>
  );
}
