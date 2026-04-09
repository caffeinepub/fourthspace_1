import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  CheckCircle2,
  FolderKanban,
  LayoutGrid,
  LayoutList,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import {
  type Project,
  ProjectStatus,
  type Task,
  type WorkspaceMember,
} from "../../types";

type FilterTab = "All" | ProjectStatus;
type ViewMode = "grid" | "list";

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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function MemberAvatars({
  members,
  memberIds,
}: { members: WorkspaceMember[]; memberIds: string[] }) {
  const shown = memberIds.slice(0, 4);
  const extra = memberIds.length - shown.length;
  const colors = [
    "bg-primary/20 text-primary",
    "bg-secondary/20 text-secondary",
    "bg-accent/20 text-accent",
    "bg-orange-400/20 text-orange-600",
  ];
  return (
    <div className="flex items-center -space-x-1.5">
      {shown.map((id, i) => {
        const m = members.find((mem) => mem.userId.toString() === id);
        return (
          <div
            key={id}
            className={`flex h-5 w-5 items-center justify-center rounded-full border border-card text-[9px] font-bold ${colors[i % colors.length]}`}
            title={m?.displayName}
          >
            {m ? getInitials(m.displayName) : "?"}
          </div>
        );
      })}
      {extra > 0 && (
        <div className="flex h-5 w-5 items-center justify-center rounded-full border border-card bg-muted text-[9px] font-bold text-muted-foreground">
          +{extra}
        </div>
      )}
    </div>
  );
}

function TaskProgressBar({
  done,
  total,
  className = "",
}: {
  done: number;
  total: number;
  className?: string;
}) {
  if (total === 0) return null;
  const pct = Math.round((done / total) * 100);
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          {done}/{total} tasks done
        </span>
        <span className="font-mono font-semibold text-foreground">{pct}%</span>
      </div>
      <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ProjectGridCard({
  project,
  workspaceId,
  tasks,
  members,
}: {
  project: Project;
  workspaceId: string;
  tasks: Task[];
  members: WorkspaceMember[];
}) {
  const badge = STATUS_BADGE[project.status];
  const doneTasks = tasks.filter((t) => t.status === "Done").length;
  const updatedMs = Number(project.updatedAt) / 1_000_000;

  return (
    <Link
      to="/app/$workspaceId/projects/$projectId"
      params={{ workspaceId, projectId: project.id }}
      data-ocid={`project-card-${project.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-4 shadow-sm hover:shadow-md hover:border-primary/30 dark:hover:border-primary/40 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
            <FolderKanban className="h-4 w-4 text-orange-500" />
          </div>
          <h3 className="font-display font-semibold text-foreground truncate text-sm group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
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
      <TaskProgressBar done={doneTasks} total={tasks.length} />
      <div className="flex items-center gap-3 pt-2 border-t border-border/40">
        <MemberAvatars
          members={members}
          memberIds={project.memberIds.map((id) => id.toString())}
        />
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          {project.memberIds.length} member
          {project.memberIds.length !== 1 ? "s" : ""}
        </span>
        <span className="text-xs text-muted-foreground ml-auto">
          {new Date(updatedMs).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </Link>
  );
}

function ProjectListRow({
  project,
  workspaceId,
  tasks,
  members,
}: {
  project: Project;
  workspaceId: string;
  tasks: Task[];
  members: WorkspaceMember[];
}) {
  const badge = STATUS_BADGE[project.status];
  const doneTasks = tasks.filter((t) => t.status === "Done").length;
  const pct =
    tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;
  const updatedMs = Number(project.updatedAt) / 1_000_000;

  return (
    <Link
      to="/app/$workspaceId/projects/$projectId"
      params={{ workspaceId, projectId: project.id }}
      data-ocid={`project-row-${project.id}`}
      className="group flex items-center gap-3 sm:gap-4 rounded-xl border border-border/50 bg-card p-3 sm:p-4 hover:shadow-sm hover:border-primary/30 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
        <FolderKanban className="h-4 w-4 text-orange-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display font-semibold text-foreground text-sm group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
            {project.name}
          </span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium border ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>
        {project.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {project.description}
          </p>
        )}
      </div>
      <div className="hidden sm:flex items-center gap-4 shrink-0">
        {tasks.length > 0 && (
          <div className="flex items-center gap-2 min-w-[100px]">
            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
              {doneTasks}/{tasks.length}
            </span>
          </div>
        )}
        <MemberAvatars
          members={members}
          memberIds={project.memberIds.map((id) => id.toString())}
        />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {new Date(updatedMs).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
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
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProjects(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching,
  });

  const { data: allTasks = [] } = useQuery<Task[]>({
    queryKey: ["all-tasks", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor || projects.length === 0) return [];
      const results = await Promise.all(
        projects.map((p) => actor.listTasks(tenantId, workspaceId, p.id)),
      );
      return results.flat();
    },
    enabled: !!actor && !isFetching && projects.length > 0,
  });

  const { data: members = [] } = useQuery<WorkspaceMember[]>({
    queryKey: ["members", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaceMembers(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching,
  });

  const tasksByProject = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const t of allTasks) {
      if (!map[t.projectId]) map[t.projectId] = [];
      map[t.projectId].push(t);
    }
    return map;
  }, [allTasks]);

  const filtered = useMemo(() => {
    let list =
      activeTab === "All"
        ? projects
        : projects.filter((p) => p.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    return list;
  }, [projects, activeTab, search]);

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
            {projects.length > 0
              ? `${projects.filter((p) => p.status === ProjectStatus.Active).length} active project${projects.filter((p) => p.status === ProjectStatus.Active).length !== 1 ? "s" : ""}`
              : "Manage your team's projects and tasks"}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* View toggle */}
          <div className="hidden sm:flex items-center gap-0.5 rounded-lg border border-border p-0.5 bg-muted/30">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${viewMode === "grid" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              aria-label="Grid view"
              data-ocid="view-grid-btn"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${viewMode === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              aria-label="List view"
              data-ocid="view-list-btn"
            >
              <LayoutList className="h-3.5 w-3.5" />
            </button>
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
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
            data-ocid="projects-search"
          />
        </div>
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
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap min-h-[36px] ${
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
      </div>

      {/* Content */}
      {isLoading ? (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "space-y-2"
          }
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Skeleton
              key={n}
              className={
                viewMode === "grid" ? "h-44 rounded-xl" : "h-16 rounded-xl"
              }
            />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectGridCard
                key={project.id}
                project={project}
                workspaceId={workspaceId}
                tasks={tasksByProject[project.id] ?? []}
                members={members}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((project) => (
              <ProjectListRow
                key={project.id}
                project={project}
                workspaceId={workspaceId}
                tasks={tasksByProject[project.id] ?? []}
                members={members}
              />
            ))}
          </div>
        )
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
            <div className="flex items-center gap-2 mt-5 flex-wrap justify-center">
              <Button
                asChild
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white active-press gap-1.5"
                data-ocid="projects-empty-cta"
              >
                <Link
                  to="/app/$workspaceId/projects/new"
                  params={{ workspaceId }}
                >
                  <Plus className="h-3.5 w-3.5" /> New Project
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="gap-1.5"
                data-ocid="projects-empty-template-cta"
              >
                <Link
                  to="/app/$workspaceId/projects/templates"
                  params={{ workspaceId }}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Use a Template
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
