import { g as createLucideIcon, b as useParams, a as useNavigate, h as getTenantId, e as useQuery, j as jsxRuntimeExports, B as Button, F as FolderKanban, T as TaskStatus, P as ProjectStatus, f as Link, i as TaskPriority } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { A as ArrowLeft } from "./arrow-left-mNBAKt8w.js";
import { U as Users } from "./users-0z2gux4W.js";
import { C as Clock } from "./clock-xD41YETq.js";
import { C as CircleCheck } from "./circle-check-gwasD9uJ.js";
import { C as CircleAlert } from "./circle-alert-2s6nWhnT.js";
import { P as Plus } from "./plus-DNap1HPx.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]];
const Circle = createLucideIcon("circle", __iconNode);
const COLUMNS = [
  {
    status: TaskStatus.Todo,
    label: "To Do",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-3.5 w-3.5" }),
    color: "text-muted-foreground",
    bg: "bg-muted/40"
  },
  {
    status: TaskStatus.InProgress,
    label: "In Progress",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
    color: "text-orange-500",
    bg: "bg-orange-500/5"
  },
  {
    status: TaskStatus.Done,
    label: "Done",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
    color: "text-emerald-500",
    bg: "bg-emerald-500/5"
  },
  {
    status: TaskStatus.Blocked,
    label: "Blocked",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3.5 w-3.5" }),
    color: "text-destructive",
    bg: "bg-destructive/5"
  }
];
const PRIORITY_BADGE = {
  [TaskPriority.Low]: "bg-muted text-muted-foreground border-border",
  [TaskPriority.Medium]: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400",
  [TaskPriority.High]: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800 dark:text-red-400",
  [TaskPriority.Critical]: "bg-red-600/20 text-red-700 border-red-300 dark:border-red-700 dark:text-red-300 font-semibold"
};
const PROJECT_STATUS_BADGE = {
  [ProjectStatus.Active]: {
    label: "Active",
    className: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400"
  },
  [ProjectStatus.OnHold]: {
    label: "On Hold",
    className: "bg-yellow-500/10 text-yellow-700 border-yellow-200"
  },
  [ProjectStatus.Completed]: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-200"
  },
  [ProjectStatus.Archived]: {
    label: "Archived",
    className: "bg-muted text-muted-foreground border-border"
  }
};
function TaskCard({
  task,
  projectId
}) {
  const dueDateMs = task.dueDate ? Number(task.dueDate) / 1e6 : null;
  const isOverdue = dueDateMs && dueDateMs < Date.now() && task.status !== TaskStatus.Done;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/app/projects/$projectId/tasks/$taskId",
      params: { projectId, taskId: task.id },
      "data-ocid": `task-card-${task.id}`,
      className: "block rounded-xl border border-border bg-card p-3.5 transition-smooth hover:shadow-sm hover:border-orange-200 dark:hover:border-orange-800 hover:-translate-y-0.5",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground leading-snug line-clamp-2 min-w-0", children: task.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: `shrink-0 text-[10px] px-1.5 py-0 ${PRIORITY_BADGE[task.priority]}`,
              children: task.priority
            }
          )
        ] }),
        task.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1 mb-2", children: task.description }),
        dueDateMs && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: `h-3 w-3 ${isOverdue ? "text-destructive" : ""}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isOverdue ? "text-destructive" : "", children: new Date(dueDateMs).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
          }) })
        ] })
      ]
    }
  );
}
function KanbanColumn({
  status,
  label,
  icon,
  color,
  bg,
  tasks,
  projectId
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-[260px] max-w-[320px] flex-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3 px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex items-center gap-1.5 font-semibold text-sm ${color}`,
          children: [
            icon,
            label,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full font-normal", children: tasks.length })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-6 w-6 text-muted-foreground hover:text-foreground",
          asChild: true,
          "aria-label": `Add task to ${label}`,
          "data-ocid": `add-task-col-${status}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/app/projects/$projectId/tasks/$taskId",
              params: { projectId, taskId: "new" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" })
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `flex flex-col gap-2 rounded-2xl ${bg} p-2 flex-1 min-h-[200px]`,
        children: [
          tasks.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center py-10 opacity-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No tasks" }) }),
          tasks.map((task) => /* @__PURE__ */ jsxRuntimeExports.jsx(TaskCard, { task, projectId }, task.id)),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "w-full justify-start gap-1.5 text-muted-foreground text-xs h-8 hover:text-foreground mt-auto",
              asChild: true,
              "data-ocid": `add-task-btn-${status}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/app/projects/$projectId/tasks/$taskId",
                  params: { projectId, taskId: "new" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                    "Add Task"
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
function ProjectDetailPage() {
  const { projectId } = useParams({ from: "/app/projects/$projectId" });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { data: project, isLoading: projectLoading } = useQuery(
    {
      queryKey: ["project", tenantId, projectId],
      queryFn: async () => {
        if (!actor) return null;
        const r = await actor.getProject(tenantId, projectId);
        return r.__kind__ === "ok" ? r.ok : null;
      },
      enabled: !!actor && !isFetching && !!projectId
    }
  );
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", tenantId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTasks(tenantId, projectId);
    },
    enabled: !!actor && !isFetching && !!projectId
  });
  if (projectLoading || tasksLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 rounded-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-56" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 pt-4", children: [1, 2, 3, 4].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-64 rounded-2xl" }, n)) })
    ] });
  }
  if (!project) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Project not found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          className: "mt-4",
          onClick: () => navigate({ to: "/app/projects" }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
            "Back to Projects"
          ]
        }
      )
    ] });
  }
  const statusBadge = PROJECT_STATUS_BADGE[project.status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full min-h-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 md:px-8 pt-5 pb-4 border-b border-border bg-card/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: "/app/projects" }),
          "aria-label": "Back to Projects",
          className: "shrink-0 mt-0.5",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-4 w-4 text-orange-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground truncate", children: project.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: `text-xs ${statusBadge.className}`,
              children: statusBadge.label
            }
          )
        ] }),
        project.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground ml-10 line-clamp-1", children: project.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1.5 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
        project.memberIds.length,
        " member",
        project.memberIds.length !== 1 ? "s" : ""
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-x-auto p-6 md:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 min-w-fit pb-4 h-full", children: COLUMNS.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      KanbanColumn,
      {
        status: col.status,
        label: col.label,
        icon: col.icon,
        color: col.color,
        bg: col.bg,
        tasks: tasks.filter((t) => t.status === col.status),
        projectId
      },
      col.status
    )) }) })
  ] });
}
export {
  ProjectDetailPage as default
};
