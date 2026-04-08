import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { CheckCircle2, FolderKanban, Plus, Users } from "lucide-react";
import { useState } from "react";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import { type Project, ProjectStatus } from "../../types";

type FilterTab = "All" | ProjectStatus;

const STATUS_TABS: { label: string; value: FilterTab }[] = [
  { label: "All", value: "All" },
  { label: "Active", value: ProjectStatus.Active },
  { label: "On Hold", value: ProjectStatus.OnHold },
  { label: "Completed", value: ProjectStatus.Completed },
  { label: "Archived", value: ProjectStatus.Archived },
];

const STATUS_BADGE: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  [ProjectStatus.Active]: {
    label: "Active",
    className:
      "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400",
  },
  [ProjectStatus.OnHold]: {
    label: "On Hold",
    className:
      "bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:border-yellow-800 dark:text-yellow-400",
  },
  [ProjectStatus.Completed]: {
    label: "Completed",
    className:
      "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
  },
  [ProjectStatus.Archived]: {
    label: "Archived",
    className: "bg-muted text-muted-foreground border-border",
  },
};

function ProjectCard({
  project,
  workspaceId,
}: { project: Project; workspaceId: string }) {
  const badge = STATUS_BADGE[project.status];
  return (
    <Link
      to="/app/$workspaceId/projects/$projectId"
      params={{ workspaceId, projectId: project.id }}
      data-ocid={`project-card-${project.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-4 shadow-card card-interactive hover:border-orange-300/50 dark:hover:border-orange-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-smooth">
            <FolderKanban className="h-4 w-4 text-orange-500" />
          </div>
          <h3 className="font-display font-semibold text-foreground truncate text-sm leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {project.name}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium border ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[2rem]">
        {project.description || "No description provided."}
      </p>
      <div className="flex items-center gap-3 pt-2 border-t border-border/40">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          {project.memberIds.length} member
          {project.memberIds.length !== 1 ? "s" : ""}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
          {new Date(Number(project.createdAt) / 1_000_000).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            },
          )}
        </span>
      </div>
    </Link>
  );
}

export default function ProjectsPage() {
  const { workspaceId } = useParams({ from: "/app/$workspaceId/projects" });
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProjects(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching,
  });

  const filtered =
    activeTab === "All"
      ? projects
      : projects.filter((p) => p.status === activeTab);

  return (
    <div className="animate-fade-in-up p-4 sm:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-5 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10">
              <FolderKanban className="h-3.5 w-3.5 text-orange-500" />
            </span>
            Projects
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage your team's projects and tasks
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 text-white active-press gap-1.5 min-h-[44px]"
          data-ocid="projects-new-btn"
        >
          <Link to="/app/$workspaceId/projects/new" params={{ workspaceId }}>
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Project</span>
            <span className="sm:hidden">New</span>
          </Link>
        </Button>
      </div>

      {/* Filter Tabs — horizontally scrollable on mobile */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-none">
        <div
          className="flex gap-1 p-1 rounded-xl bg-muted/50 w-max min-w-full sm:w-fit"
          data-ocid="projects-filter-tabs"
        >
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              data-ocid={`tab-${tab.value}`}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-smooth whitespace-nowrap min-h-[36px] ${
                activeTab === tab.value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.value !== "All" && (
                <span className="ml-1.5 opacity-60">
                  {projects.filter((p) => p.status === tab.value).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Skeleton key={n} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              workspaceId={workspaceId}
            />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-12 sm:py-16 text-center px-4"
          data-ocid="projects-empty"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 mb-3">
            <CheckCircle2 className="h-6 w-6 text-orange-500" />
          </div>
          <h3 className="font-display font-semibold text-foreground">
            {activeTab === "All"
              ? "No projects yet"
              : `No ${activeTab} projects`}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-xs">
            {activeTab === "All"
              ? "Create your first project to start organizing tasks and collaborating."
              : `No projects with ${activeTab} status.`}
          </p>
          {activeTab === "All" && (
            <Button
              asChild
              size="sm"
              className="mt-5 bg-orange-500 hover:bg-orange-600 text-white active-press gap-1.5"
              data-ocid="projects-empty-cta"
            >
              <Link
                to="/app/$workspaceId/projects/new"
                params={{ workspaceId }}
              >
                <Plus className="h-3.5 w-3.5" /> Create your first project
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
