import { m as useParams, f as useWorkspace, r as reactExports, h as useQuery, j as jsxRuntimeExports, a as FolderKanban, B as Button, i as Link, P as Plus, t as ProjectStatus } from "./index-BZqaRhAX.js";
import { S as Skeleton } from "./skeleton-CXUiMpVp.js";
import { u as useBackend } from "./useBackend-DSxJo5MU.js";
import { C as CircleCheck } from "./circle-check-wa2s5his.js";
import { U as Users } from "./users-hFv2lO5Q.js";
const STATUS_TABS = [
  { label: "All", value: "All" },
  { label: "Active", value: ProjectStatus.Active },
  { label: "On Hold", value: ProjectStatus.OnHold },
  { label: "Completed", value: ProjectStatus.Completed },
  { label: "Archived", value: ProjectStatus.Archived }
];
const STATUS_BADGE = {
  [ProjectStatus.Active]: {
    label: "Active",
    className: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400"
  },
  [ProjectStatus.OnHold]: {
    label: "On Hold",
    className: "bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:border-yellow-800 dark:text-yellow-400"
  },
  [ProjectStatus.Completed]: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400"
  },
  [ProjectStatus.Archived]: {
    label: "Archived",
    className: "bg-muted text-muted-foreground border-border"
  }
};
function ProjectCard({
  project,
  workspaceId
}) {
  const badge = STATUS_BADGE[project.status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/app/$workspaceId/projects/$projectId",
      params: { workspaceId, projectId: project.id },
      "data-ocid": `project-card-${project.id}`,
      className: "group flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-4 shadow-card card-interactive hover:border-orange-300/50 dark:hover:border-orange-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-4 w-4 text-orange-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground truncate text-sm leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors", children: project.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `shrink-0 rounded-full px-2 py-0.5 text-xs font-medium border ${badge.className}`,
              children: badge.label
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[2rem]", children: project.description || "No description provided." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-2 border-t border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
            project.memberIds.length,
            " member",
            project.memberIds.length !== 1 ? "s" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-1 text-xs text-muted-foreground ml-auto", children: new Date(Number(project.createdAt) / 1e6).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric"
            }
          ) })
        ] })
      ]
    }
  );
}
function ProjectsPage() {
  const { workspaceId } = useParams({ from: "/app/$workspaceId/projects" });
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const [activeTab, setActiveTab] = reactExports.useState("All");
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProjects(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching
  });
  const filtered = activeTab === "All" ? projects : projects.filter((p) => p.status === activeTab);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-4 sm:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-5 pb-20 md:pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-3.5 w-3.5 text-orange-500" }) }),
          "Projects"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-sm text-muted-foreground", children: "Manage your team's projects and tasks" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          asChild: true,
          size: "sm",
          className: "bg-orange-500 hover:bg-orange-600 text-white active-press gap-1.5 min-h-[44px]",
          "data-ocid": "projects-new-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/$workspaceId/projects/new", params: { workspaceId }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "New Project" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "New" })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex gap-1 p-1 rounded-xl bg-muted/50 w-max min-w-full sm:w-fit",
        "data-ocid": "projects-filter-tabs",
        children: STATUS_TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setActiveTab(tab.value),
            "data-ocid": `tab-${tab.value}`,
            className: `px-3 py-2 rounded-lg text-xs font-medium transition-smooth whitespace-nowrap min-h-[36px] ${activeTab === tab.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
            children: [
              tab.label,
              tab.value !== "All" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 opacity-60", children: projects.filter((p) => p.status === tab.value).length })
            ]
          },
          tab.value
        ))
      }
    ) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", children: [1, 2, 3, 4, 5, 6].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" }, n)) }) : filtered.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", children: filtered.map((project) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProjectCard,
      {
        project,
        workspaceId
      },
      project.id
    )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-12 sm:py-16 text-center px-4",
        "data-ocid": "projects-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-6 w-6 text-orange-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: activeTab === "All" ? "No projects yet" : `No ${activeTab} projects` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground max-w-xs", children: activeTab === "All" ? "Create your first project to start organizing tasks and collaborating." : `No projects with ${activeTab} status.` }),
          activeTab === "All" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              size: "sm",
              className: "mt-5 bg-orange-500 hover:bg-orange-600 text-white active-press gap-1.5",
              "data-ocid": "projects-empty-cta",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/app/$workspaceId/projects/new",
                  params: { workspaceId },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                    " Create your first project"
                  ]
                }
              )
            }
          )
        ]
      }
    )
  ] });
}
export {
  ProjectsPage as default
};
