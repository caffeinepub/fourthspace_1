import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, FolderKanban, Layers, Plus, Users } from "lucide-react";
import { useState } from "react";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
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

function ProjectCard({ project }: { project: Project }) {
  const badge = STATUS_BADGE[project.status];
  return (
    <Link
      to="/app/projects/$projectId"
      params={{ projectId: project.id }}
      data-ocid={`project-card-${project.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-smooth hover:shadow-md hover:-translate-y-0.5 hover:border-orange-200 dark:hover:border-orange-800"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 group-hover:bg-orange-500/20 transition-smooth">
            <FolderKanban className="h-5 w-5 text-orange-500" />
          </div>
          <h3 className="font-display font-semibold text-foreground truncate text-sm leading-snug">
            {project.name}
          </h3>
        </div>
        <Badge
          variant="outline"
          className={`shrink-0 text-xs ${badge.className}`}
        >
          {badge.label}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {project.description || "No description provided."}
      </p>
      <div className="flex items-center gap-4 pt-1 border-t border-border/60">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {project.memberIds.length} member
          {project.memberIds.length !== 1 ? "s" : ""}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Layers className="h-3.5 w-3.5" />
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
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects", tenantId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProjects(tenantId);
    },
    enabled: !!actor && !isFetching,
  });

  const filtered =
    activeTab === "All"
      ? projects
      : projects.filter((p) => p.status === activeTab);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
              <FolderKanban className="h-4 w-4 text-orange-500" />
            </span>
            Projects
          </h1>
          <p className="mt-1 text-sm text-muted-foreground ml-[2.625rem]">
            Manage your team's projects and tasks
          </p>
        </div>
        <Button
          asChild
          className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
          data-ocid="projects-new-btn"
        >
          <Link to="/app/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div
        className="flex flex-wrap gap-1 p-1 rounded-xl bg-muted/60 w-fit"
        data-ocid="projects-filter-tabs"
      >
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            data-ocid={`tab-${tab.value}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth ${
              activeTab === tab.value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.value !== "All" && (
              <span className="ml-1.5 text-xs opacity-60">
                {projects.filter((p) => p.status === tab.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Skeleton key={n} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center"
          data-ocid="projects-empty"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 mb-4">
            <CheckCircle2 className="h-7 w-7 text-orange-500" />
          </div>
          <h3 className="font-display font-semibold text-foreground">
            {activeTab === "All"
              ? "No projects yet"
              : `No ${activeTab} projects`}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            {activeTab === "All"
              ? "Create your first project to start organizing tasks and collaborating with your team."
              : `There are no projects with ${activeTab} status right now.`}
          </p>
          {activeTab === "All" && (
            <Button
              asChild
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white"
              data-ocid="projects-empty-cta"
            >
              <Link to="/app/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Create your first project
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
