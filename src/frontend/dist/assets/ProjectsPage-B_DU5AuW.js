import { s as createLucideIcon, m as useParams, f as useWorkspace, r as reactExports, h as useQuery, j as jsxRuntimeExports, a as FolderKanban, at as ProjectStatus, B as Button, i as Link, P as Plus } from "./index-1XRv9GHr.js";
import { I as Input } from "./input-BOIU-9S_.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { u as useBackend } from "./useBackend-DyFxq-Jw.js";
import { L as LayoutList } from "./layout-list-_6-AowQ7.js";
import { S as Search } from "./search-CWnD_rod.js";
import { C as CircleCheck } from "./circle-check-DTEyto7g.js";
import { U as Users } from "./users-BwTeKVE_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
];
const LayoutGrid = createLucideIcon("layout-grid", __iconNode);
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
function getInitials(name) {
  return name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
}
function MemberAvatars({
  members,
  memberIds
}) {
  const shown = memberIds.slice(0, 4);
  const extra = memberIds.length - shown.length;
  const colors = [
    "bg-primary/20 text-primary",
    "bg-secondary/20 text-secondary",
    "bg-accent/20 text-accent",
    "bg-orange-400/20 text-orange-600"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center -space-x-1.5", children: [
    shown.map((id, i) => {
      const m = members.find((mem) => mem.userId.toString() === id);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `flex h-5 w-5 items-center justify-center rounded-full border border-card text-[9px] font-bold ${colors[i % colors.length]}`,
          title: m == null ? void 0 : m.displayName,
          children: m ? getInitials(m.displayName) : "?"
        },
        id
      );
    }),
    extra > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-5 w-5 items-center justify-center rounded-full border border-card bg-muted text-[9px] font-bold text-muted-foreground", children: [
      "+",
      extra
    ] })
  ] });
}
function TaskProgressBar({
  done,
  total,
  className = ""
}) {
  if (total === 0) return null;
  const pct = Math.round(done / total * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `space-y-1 ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[11px] text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        done,
        "/",
        total,
        " tasks done"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold text-foreground", children: [
        pct,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-full bg-primary rounded-full transition-all",
        style: { width: `${pct}%` }
      }
    ) })
  ] });
}
function ProjectGridCard({
  project,
  workspaceId,
  tasks,
  members
}) {
  const badge = STATUS_BADGE[project.status];
  const doneTasks = tasks.filter((t) => t.status === "Done").length;
  const updatedMs = Number(project.updatedAt) / 1e6;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/app/$workspaceId/projects/$projectId",
      params: { workspaceId, projectId: project.id },
      "data-ocid": `project-card-${project.id}`,
      className: "group flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-4 shadow-sm hover:shadow-md hover:border-primary/30 dark:hover:border-primary/40 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-4 w-4 text-orange-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground truncate text-sm group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors", children: project.name })
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(TaskProgressBar, { done: doneTasks, total: tasks.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-2 border-t border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MemberAvatars,
            {
              members,
              memberIds: project.memberIds.map((id) => id.toString())
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
            project.memberIds.length,
            " member",
            project.memberIds.length !== 1 ? "s" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-auto", children: new Date(updatedMs).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
          }) })
        ] })
      ]
    }
  );
}
function ProjectListRow({
  project,
  workspaceId,
  tasks,
  members
}) {
  const badge = STATUS_BADGE[project.status];
  const doneTasks = tasks.filter((t) => t.status === "Done").length;
  const pct = tasks.length > 0 ? Math.round(doneTasks / tasks.length * 100) : 0;
  const updatedMs = Number(project.updatedAt) / 1e6;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/app/$workspaceId/projects/$projectId",
      params: { workspaceId, projectId: project.id },
      "data-ocid": `project-row-${project.id}`,
      className: "group flex items-center gap-3 sm:gap-4 rounded-xl border border-border/50 bg-card p-3 sm:p-4 hover:shadow-sm hover:border-primary/30 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-4 w-4 text-orange-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-foreground text-sm group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate", children: project.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `shrink-0 rounded-full px-2 py-0.5 text-xs font-medium border ${badge.className}`,
                children: badge.label
              }
            )
          ] }),
          project.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: project.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-4 shrink-0", children: [
          tasks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-[100px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-primary rounded-full transition-all",
                style: { width: `${pct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-mono whitespace-nowrap", children: [
              doneTasks,
              "/",
              tasks.length
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MemberAvatars,
            {
              members,
              memberIds: project.memberIds.map((id) => id.toString())
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground whitespace-nowrap", children: new Date(updatedMs).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          }) })
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
  const [viewMode, setViewMode] = reactExports.useState("grid");
  const [search, setSearch] = reactExports.useState("");
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProjects(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching
  });
  const { data: allTasks = [] } = useQuery({
    queryKey: ["all-tasks", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor || projects.length === 0) return [];
      const results = await Promise.all(
        projects.map((p) => actor.listTasks(tenantId, workspaceId, p.id))
      );
      return results.flat();
    },
    enabled: !!actor && !isFetching && projects.length > 0
  });
  const { data: members = [] } = useQuery({
    queryKey: ["members", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaceMembers(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching
  });
  const tasksByProject = reactExports.useMemo(() => {
    const map = {};
    for (const t of allTasks) {
      if (!map[t.projectId]) map[t.projectId] = [];
      map[t.projectId].push(t);
    }
    return map;
  }, [allTasks]);
  const filtered = reactExports.useMemo(() => {
    let list = activeTab === "All" ? projects : projects.filter((p) => p.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [projects, activeTab, search]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-4 sm:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-5 pb-20 md:pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-3.5 w-3.5 text-orange-500" }) }),
          "Projects"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-sm text-muted-foreground", children: projects.length > 0 ? `${projects.filter((p) => p.status === ProjectStatus.Active).length} active project${projects.filter((p) => p.status === ProjectStatus.Active).length !== 1 ? "s" : ""}` : "Manage your team's projects and tasks" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-0.5 rounded-lg border border-border p-0.5 bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setViewMode("grid"),
              className: `flex h-7 w-7 items-center justify-center rounded-md transition-colors ${viewMode === "grid" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
              "aria-label": "Grid view",
              "data-ocid": "view-grid-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setViewMode("list"),
              className: `flex h-7 w-7 items-center justify-center rounded-md transition-colors ${viewMode === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
              "aria-label": "List view",
              "data-ocid": "view-list-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutList, { className: "h-3.5 w-3.5" })
            }
          )
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
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 sm:max-w-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search projects…",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-8 h-9 text-sm",
            "data-ocid": "projects-search"
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
              className: `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap min-h-[36px] ${activeTab === tab.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
              children: [
                tab.label,
                tab.value !== "All" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 opacity-60", children: projects.filter((p) => p.status === tab.value).length })
              ]
            },
            tab.value
          ))
        }
      ) })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: viewMode === "grid" ? "grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "space-y-2",
        children: [1, 2, 3, 4, 5, 6].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: viewMode === "grid" ? "h-44 rounded-xl" : "h-16 rounded-xl"
          },
          n
        ))
      }
    ) : filtered.length > 0 ? viewMode === "grid" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", children: filtered.map((project) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProjectGridCard,
      {
        project,
        workspaceId,
        tasks: tasksByProject[project.id] ?? [],
        members
      },
      project.id
    )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: filtered.map((project) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProjectListRow,
      {
        project,
        workspaceId,
        tasks: tasksByProject[project.id] ?? [],
        members
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
          activeTab === "All" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-5 flex-wrap justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                asChild: true,
                size: "sm",
                className: "bg-orange-500 hover:bg-orange-600 text-white active-press gap-1.5",
                "data-ocid": "projects-empty-cta",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: "/app/$workspaceId/projects/new",
                    params: { workspaceId },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                      " New Project"
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                asChild: true,
                size: "sm",
                variant: "outline",
                className: "gap-1.5",
                "data-ocid": "projects-empty-template-cta",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: "/app/$workspaceId/projects/templates",
                    params: { workspaceId },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
                      " Use a Template"
                    ]
                  }
                )
              }
            )
          ] })
        ]
      }
    )
  ] });
}
export {
  ProjectsPage as default
};
