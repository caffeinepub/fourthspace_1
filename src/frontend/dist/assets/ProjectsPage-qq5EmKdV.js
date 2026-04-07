import { g as createLucideIcon, h as getTenantId, r as reactExports, e as useQuery, j as jsxRuntimeExports, F as FolderKanban, B as Button, f as Link, P as ProjectStatus } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { P as Plus } from "./plus-DNap1HPx.js";
import { C as CircleCheck } from "./circle-check-gwasD9uJ.js";
import { U as Users } from "./users-0z2gux4W.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode);
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
function ProjectCard({ project }) {
  const badge = STATUS_BADGE[project.status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/app/projects/$projectId",
      params: { projectId: project.id },
      "data-ocid": `project-card-${project.id}`,
      className: "group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-smooth hover:shadow-md hover:-translate-y-0.5 hover:border-orange-200 dark:hover:border-orange-800",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 group-hover:bg-orange-500/20 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-5 w-5 text-orange-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground truncate text-sm leading-snug", children: project.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: `shrink-0 text-xs ${badge.className}`,
              children: badge.label
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 leading-relaxed", children: project.description || "No description provided." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 pt-1 border-t border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
            project.memberIds.length,
            " member",
            project.memberIds.length !== 1 ? "s" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3.5 w-3.5" }),
            new Date(Number(project.createdAt) / 1e6).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function ProjectsPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const [activeTab, setActiveTab] = reactExports.useState("All");
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", tenantId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProjects(tenantId);
    },
    enabled: !!actor && !isFetching
  });
  const filtered = activeTab === "All" ? projects : projects.filter((p) => p.status === activeTab);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-6xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-4 w-4 text-orange-500" }) }),
          "Projects"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground ml-[2.625rem]", children: "Manage your team's projects and tasks" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          asChild: true,
          className: "bg-orange-500 hover:bg-orange-600 text-white shadow-sm",
          "data-ocid": "projects-new-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/projects/new", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
            "New Project"
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex flex-wrap gap-1 p-1 rounded-xl bg-muted/60 w-fit",
        "data-ocid": "projects-filter-tabs",
        children: STATUS_TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setActiveTab(tab.value),
            "data-ocid": `tab-${tab.value}`,
            className: `px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth ${activeTab === tab.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
            children: [
              tab.label,
              tab.value !== "All" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 text-xs opacity-60", children: projects.filter((p) => p.status === tab.value).length })
            ]
          },
          tab.value
        ))
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: [1, 2, 3, 4, 5, 6].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-44 rounded-2xl" }, n)) }) : filtered.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: filtered.map((project) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProjectCard, { project }, project.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center",
        "data-ocid": "projects-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-7 w-7 text-orange-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: activeTab === "All" ? "No projects yet" : `No ${activeTab} projects` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground max-w-xs", children: activeTab === "All" ? "Create your first project to start organizing tasks and collaborating with your team." : `There are no projects with ${activeTab} status right now.` }),
          activeTab === "All" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              className: "mt-6 bg-orange-500 hover:bg-orange-600 text-white",
              "data-ocid": "projects-empty-cta",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/projects/new", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                "Create your first project"
              ] })
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
