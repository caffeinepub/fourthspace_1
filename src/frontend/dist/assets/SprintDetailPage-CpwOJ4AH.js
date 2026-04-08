import { m as useParams, d as useNavigate, f as useWorkspace, n as useQueryClient, r as reactExports, h as useQuery, T as TaskStatus, j as jsxRuntimeExports, B as Button, w as SprintStatus, P as Plus, i as Link } from "./index-DemOGW1B.js";
import { B as Badge } from "./badge-BgvX66QS.js";
import { S as Skeleton } from "./skeleton-M5HtR2mS.js";
import { u as useMutation } from "./useMutation-4TvYOXEz.js";
import { u as ue } from "./index-BBpqu5x7.js";
import { u as useBackend } from "./index-CeqQA3r7.js";
import { A as ArrowLeft } from "./arrow-left-lpbCbWBz.js";
import { Z as Zap } from "./zap-B-hC9wa2.js";
import { C as CircleCheck } from "./circle-check-DcbnON2v.js";
import { C as Circle } from "./circle-BvQ-q35D.js";
import { C as Clock } from "./clock-dgG5UHWp.js";
import { L as LoaderCircle } from "./loader-circle-DNkeklbO.js";
import { M as Minus } from "./minus-DF2mmh7x.js";
import { C as CircleAlert } from "./circle-alert-7dgEwAPW.js";
const COLUMNS = [
  {
    status: TaskStatus.Todo,
    label: "To Do",
    color: "text-muted-foreground",
    bg: "bg-muted/40",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-3.5 w-3.5" })
  },
  {
    status: TaskStatus.InProgress,
    label: "In Progress",
    color: "text-blue-500",
    bg: "bg-blue-500/5",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" })
  },
  {
    status: TaskStatus.Done,
    label: "Done",
    color: "text-emerald-500",
    bg: "bg-emerald-500/5",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" })
  },
  {
    status: TaskStatus.Blocked,
    label: "Blocked",
    color: "text-destructive",
    bg: "bg-destructive/5",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3.5 w-3.5" })
  }
];
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function SprintDetailPage() {
  const { workspaceId, projectId, sprintId } = useParams({
    from: "/app/$workspaceId/projects/$projectId/sprints/$sprintId"
  });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();
  const [showAddPanel, setShowAddPanel] = reactExports.useState(false);
  const { data: sprint, isLoading: sprintLoading } = useQuery({
    queryKey: ["sprint", tenantId, workspaceId, sprintId],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getSprint(tenantId, workspaceId, sprintId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled: !!actor && !isFetching
  });
  const { data: allTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTasks(tenantId, workspaceId, projectId);
    },
    enabled: !!actor && !isFetching
  });
  const sprintTaskIds = new Set((sprint == null ? void 0 : sprint.taskIds) ?? []);
  const sprintTasks = allTasks.filter((t) => sprintTaskIds.has(t.id));
  const backlog = allTasks.filter((t) => !sprintTaskIds.has(t.id));
  const doneTasks = sprintTasks.filter(
    (t) => t.status === TaskStatus.Done
  ).length;
  const addTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.addTaskToSprint(
        tenantId,
        workspaceId,
        sprintId,
        taskId
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sprint", tenantId, workspaceId, sprintId]
      });
      ue.success("Task added to sprint");
    },
    onError: (e) => ue.error(e.message)
  });
  const removeTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.removeTaskFromSprint(
        tenantId,
        workspaceId,
        sprintId,
        taskId
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["sprint", tenantId, workspaceId, sprintId]
    }),
    onError: (e) => ue.error(e.message)
  });
  const updateStatusMutation = useMutation({
    mutationFn: async (status) => {
      if (!actor || !sprint) throw new Error("Not connected");
      const r = await actor.updateSprint(
        tenantId,
        workspaceId,
        sprintId,
        sprint.name,
        sprint.goal,
        status,
        sprint.taskIds
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: (s) => {
      queryClient.setQueryData(["sprint", tenantId, workspaceId, sprintId], s);
      ue.success(
        `Sprint ${s.status === SprintStatus.active ? "started" : "completed"}`
      );
    },
    onError: (e) => ue.error(e.message)
  });
  if (sprintLoading || tasksLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4", children: [1, 2, 3, 4].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-56 rounded-2xl" }, n)) })
    ] });
  }
  if (!sprint) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Sprint not found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          className: "mt-4",
          onClick: () => navigate({
            to: "/app/$workspaceId/projects/$projectId/sprints",
            params: { workspaceId, projectId }
          }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
            " Back to Sprints"
          ]
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full min-h-0 overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 md:px-8 pt-4 pb-4 border-b border-border/60 bg-card/80 sticky top-0 z-10 backdrop-blur-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-8 w-8 shrink-0 mt-0.5",
          onClick: () => navigate({
            to: "/app/$workspaceId/projects/$projectId/sprints",
            params: { workspaceId, projectId }
          }),
          "aria-label": "Back",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: sprint.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: sprint.status === SprintStatus.active ? "bg-primary/10 text-primary border-primary/30 gap-1" : sprint.status === SprintStatus.completed ? "bg-emerald-500/10 text-emerald-700 border-emerald-200 gap-1" : "bg-muted text-muted-foreground border-border gap-1",
              children: [
                sprint.status === SprintStatus.active ? /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3" }) : sprint.status === SprintStatus.completed ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-3 w-3" }),
                sprint.status === SprintStatus.active ? "Active" : sprint.status === SprintStatus.completed ? "Completed" : "Planned"
              ]
            }
          )
        ] }),
        sprint.goal && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5 truncate", children: sprint.goal }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
            formatDate(sprint.startDate),
            " – ",
            formatDate(sprint.endDate)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 text-emerald-500" }),
            doneTasks,
            "/",
            sprintTasks.length,
            " done"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
        sprint.status === SprintStatus.planned && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "gap-1.5 h-8 text-xs bg-primary",
            onClick: () => updateStatusMutation.mutate(SprintStatus.active),
            disabled: updateStatusMutation.isPending,
            "data-ocid": "start-sprint-btn",
            children: [
              updateStatusMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5" }),
              "Start Sprint"
            ]
          }
        ),
        sprint.status === SprintStatus.active && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "gap-1.5 h-8 text-xs",
            onClick: () => updateStatusMutation.mutate(SprintStatus.completed),
            disabled: updateStatusMutation.isPending,
            "data-ocid": "complete-sprint-btn",
            children: [
              updateStatusMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
              "Complete Sprint"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "gap-1.5 h-8 text-xs",
            onClick: () => setShowAddPanel((v) => !v),
            "data-ocid": "add-tasks-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
              "Add Tasks"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-8 py-6 flex gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 min-w-fit pb-4", children: COLUMNS.map((col) => {
        const colTasks = sprintTasks.filter(
          (t) => t.status === col.status
        );
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col min-w-[240px] max-w-[300px] flex-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex items-center gap-1.5 font-semibold text-sm mb-3 ${col.color}`,
                  children: [
                    col.icon,
                    " ",
                    col.label,
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full font-normal", children: colTasks.length })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex flex-col gap-2 rounded-2xl ${col.bg} p-2 flex-1 min-h-[160px]`,
                  children: [
                    colTasks.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8 opacity-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No tasks" }) }),
                    colTasks.map((task) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "group relative rounded-xl border border-border bg-card p-3 transition-smooth hover:shadow-sm",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Link,
                            {
                              to: "/app/$workspaceId/projects/$projectId/tasks/$taskId",
                              params: { workspaceId, projectId, taskId: task.id },
                              className: "block text-sm font-medium text-foreground leading-snug line-clamp-2 hover:text-primary transition-colors",
                              "data-ocid": `sprint-task-${task.id}`,
                              children: task.title
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              "aria-label": "Remove from sprint",
                              onClick: () => removeTaskMutation.mutate(task.id),
                              className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all",
                              "data-ocid": `remove-sprint-task-${task.id}`,
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3.5 w-3.5" })
                            }
                          )
                        ]
                      },
                      task.id
                    ))
                  ]
                }
              )
            ]
          },
          col.status
        );
      }) }) }),
      showAddPanel && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "w-72 shrink-0 space-y-3 rounded-2xl border border-border bg-card p-4",
          "data-ocid": "add-tasks-panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-bold text-foreground", children: "Backlog" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": "Close",
                  onClick: () => setShowAddPanel(false),
                  className: "text-muted-foreground hover:text-foreground transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" })
                }
              )
            ] }),
            backlog.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground py-4 text-center", children: "All tasks are in sprints." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 max-h-[400px] overflow-y-auto", children: backlog.map((task) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 rounded-lg p-2 hover:bg-muted/50 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "flex-1 text-xs text-foreground truncate", children: task.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "icon",
                      className: "h-6 w-6 shrink-0 text-muted-foreground hover:text-primary",
                      onClick: () => addTaskMutation.mutate(task.id),
                      "aria-label": "Add to sprint",
                      "data-ocid": `add-to-sprint-${task.id}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" })
                    }
                  )
                ]
              },
              task.id
            )) })
          ]
        }
      )
    ] })
  ] });
}
export {
  SprintDetailPage as default
};
