import { m as useParams, d as useNavigate, f as useWorkspace, n as useQueryClient, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, P as Plus, X, v as MilestoneStatus, T as TaskStatus, w as ChevronDown, a as FolderKanban } from "./index-1XRv9GHr.js";
import { B as Badge } from "./badge-rX4oLW6l.js";
import { I as Input } from "./input-BOIU-9S_.js";
import { L as Label } from "./label-cy3JJ-Xo.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { T as Textarea } from "./textarea-DsJhlE90.js";
import { u as useMutation } from "./useMutation-X94w2CVk.js";
import { u as ue } from "./index-BOWFyaIB.js";
import { u as useBackend } from "./useBackend-DyFxq-Jw.js";
import { A as ArrowLeft } from "./arrow-left-B-gbON0E.js";
import { L as LoaderCircle } from "./loader-circle-CtmMa9i8.js";
import { F as Flag } from "./flag-_dwFYLb_.js";
import { C as Clock } from "./clock-By6uj0s2.js";
import { C as ChevronRight } from "./chevron-right-DIrUI6zt.js";
import { C as CircleCheck } from "./circle-check-DTEyto7g.js";
import { T as Trash2 } from "./trash-2-DiWEnbCD.js";
import { T as TriangleAlert } from "./triangle-alert-Dm4aJj7p.js";
const STATUS_CONFIG = {
  [MilestoneStatus.upcoming]: {
    label: "Upcoming",
    color: "bg-primary/10 text-primary border-primary/30",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" })
  },
  [MilestoneStatus.reached]: {
    label: "Reached",
    color: "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" })
  },
  [MilestoneStatus.missed]: {
    label: "Missed",
    color: "bg-destructive/10 text-destructive border-destructive/30",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" })
  }
};
const TASK_STATUS_BADGE = {
  [TaskStatus.Todo]: {
    label: "To Do",
    className: "bg-muted text-muted-foreground border-border"
  },
  [TaskStatus.InProgress]: {
    label: "In Progress",
    className: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400"
  },
  [TaskStatus.Done]: {
    label: "Done",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400"
  },
  [TaskStatus.Blocked]: {
    label: "Blocked",
    className: "bg-destructive/10 text-destructive border-destructive/30"
  }
};
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
function parseDateToTs(s) {
  return BigInt(new Date(s).getTime() * 1e6);
}
function MilestonesPage() {
  const { workspaceId, projectId } = useParams({
    from: "/app/$workspaceId/projects/$projectId/milestones"
  });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [dueDate, setDueDate] = reactExports.useState("");
  const [expandedMilestones, setExpandedMilestones] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const { data: milestones = [], isLoading } = useQuery({
    queryKey: ["milestones", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMilestones(tenantId, workspaceId, projectId);
    },
    enabled: !!actor && !isFetching
  });
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTasks(tenantId, workspaceId, projectId);
    },
    enabled: !!actor && !isFetching
  });
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.createMilestone(tenantId, workspaceId, {
        title: title.trim(),
        description: description.trim(),
        projectId,
        dueDate: parseDateToTs(dueDate),
        linkedTaskIds: []
      });
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["milestones", tenantId, workspaceId, projectId]
      });
      setShowForm(false);
      setTitle("");
      setDescription("");
      setDueDate("");
      ue.success("Milestone created");
    },
    onError: (e) => ue.error(e.message)
  });
  const markReachedMutation = useMutation({
    mutationFn: async (m) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.updateMilestone(
        tenantId,
        workspaceId,
        m.id,
        m.title,
        MilestoneStatus.reached,
        m.dueDate
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["milestones", tenantId, workspaceId, projectId]
      });
      ue.success("Milestone reached! 🎉");
    },
    onError: (e) => ue.error(e.message)
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.deleteMilestone(tenantId, workspaceId, id);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["milestones", tenantId, workspaceId, projectId]
      });
      ue.success("Milestone deleted");
    },
    onError: (e) => ue.error(e.message)
  });
  function toggleExpand(id) {
    setExpandedMilestones((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  const sorted = [...milestones].sort((a, b) => Number(a.dueDate - b.dueDate));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full min-h-0 overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 sm:px-6 md:px-8 pt-4 pb-4 border-b border-border/60 bg-card/80 sticky top-0 z-10 backdrop-blur-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-8 w-8 min-h-[44px] min-w-[44px]",
          onClick: () => navigate({
            to: "/app/$workspaceId/projects/$projectId",
            params: { workspaceId, projectId }
          }),
          "aria-label": "Back",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/app/$workspaceId/projects",
            params: { workspaceId },
            className: "hover:text-foreground transition-colors",
            children: "Projects"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/app/$workspaceId/projects/$projectId",
            params: { workspaceId, projectId },
            className: "hover:text-foreground transition-colors",
            children: "Project"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "Milestones" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "gap-1.5 h-8 text-xs active-press min-h-[44px]",
          onClick: () => setShowForm(true),
          "data-ocid": "create-milestone-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            " New Milestone"
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 sm:px-6 md:px-8 py-6 space-y-6", children: [
      showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-2xl border border-primary/30 bg-card p-5 space-y-4",
          "data-ocid": "milestone-create-form",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-bold text-foreground", children: "New Milestone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "icon",
                  className: "h-7 w-7",
                  onClick: () => setShowForm(false),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Title *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "e.g. Beta Launch",
                    value: title,
                    onChange: (e) => setTitle(e.target.value),
                    className: "h-8 text-sm",
                    "data-ocid": "milestone-title-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Due Date *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "date",
                    value: dueDate,
                    onChange: (e) => setDueDate(e.target.value),
                    className: "h-8 text-sm",
                    "data-ocid": "milestone-due-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Description" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    placeholder: "Describe this milestone...",
                    value: description,
                    onChange: (e) => setDescription(e.target.value),
                    className: "text-sm resize-none",
                    rows: 2,
                    "data-ocid": "milestone-desc-input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  className: "gap-1.5 text-xs h-8",
                  disabled: !title.trim() || !dueDate || createMutation.isPending,
                  onClick: () => createMutation.mutate(),
                  "data-ocid": "milestone-save-btn",
                  children: [
                    createMutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
                    "Create Milestone"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  className: "text-xs h-8",
                  onClick: () => setShowForm(false),
                  children: "Cancel"
                }
              )
            ] })
          ]
        }
      ),
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-2xl" }, n)) }),
      !isLoading && milestones.length === 0 && !showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 gap-4",
          "data-ocid": "milestones-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-7 w-7 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground", children: "No milestones yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Mark key project checkpoints as milestones." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "gap-1.5 text-xs",
                onClick: () => setShowForm(true),
                "data-ocid": "create-first-milestone-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                  "Create First Milestone"
                ]
              }
            )
          ]
        }
      ),
      sorted.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute left-5 top-0 bottom-0 w-px bg-border",
            "aria-hidden": true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: sorted.map((m) => {
          const cfg = STATUS_CONFIG[m.status];
          const isUpcoming = m.status === MilestoneStatus.upcoming;
          const isExpanded = expandedMilestones.has(m.id);
          const linkedTasks = tasks.filter(
            (t) => m.linkedTaskIds.includes(t.id)
          );
          const linkedDone = linkedTasks.filter(
            (t) => t.status === TaskStatus.Done
          ).length;
          const linkedTotal = linkedTasks.length;
          const pct = linkedTotal > 0 ? Math.round(linkedDone / linkedTotal * 100) : 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative flex gap-4 pl-12",
              "data-ocid": `milestone-${m.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `absolute left-3 top-3 h-4 w-4 rotate-45 rounded-sm border-2 ${m.status === MilestoneStatus.reached ? "bg-emerald-500 border-emerald-500" : m.status === MilestoneStatus.missed ? "bg-destructive border-destructive" : "bg-primary border-primary"}`,
                    "aria-hidden": true
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `flex-1 rounded-2xl border ${m.status === MilestoneStatus.reached ? "border-emerald-200 dark:border-emerald-800 bg-emerald-500/5" : m.status === MilestoneStatus.missed ? "border-destructive/30 bg-destructive/5" : "border-border bg-card"} p-4`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground", children: m.title }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              Badge,
                              {
                                variant: "outline",
                                className: `text-xs gap-1 ${cfg.color}`,
                                children: [
                                  cfg.icon,
                                  cfg.label
                                ]
                              }
                            )
                          ] }),
                          m.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: m.description }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2 text-xs text-muted-foreground", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
                              "Due ",
                              formatDate(m.dueDate)
                            ] }),
                            m.linkedTaskIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                              m.linkedTaskIds.length,
                              " linked task",
                              m.linkedTaskIds.length !== 1 ? "s" : ""
                            ] })
                          ] }),
                          linkedTotal > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[11px] text-muted-foreground", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                                linkedDone,
                                "/",
                                linkedTotal,
                                " tasks done"
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold text-foreground", children: [
                                pct,
                                "%"
                              ] })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "h-full bg-primary rounded-full transition-all",
                                style: { width: `${pct}%` }
                              }
                            ) })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                          linkedTasks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "button",
                            {
                              type: "button",
                              onClick: () => toggleExpand(m.id),
                              className: "flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors min-h-[44px] px-1",
                              "aria-label": isExpanded ? "Collapse tasks" : "Show tasks",
                              "data-ocid": `milestone-expand-${m.id}`,
                              children: [
                                isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-[11px]", children: isExpanded ? "Hide" : "Tasks" })
                              ]
                            }
                          ),
                          isUpcoming && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Button,
                            {
                              type: "button",
                              variant: "outline",
                              size: "sm",
                              className: "h-7 gap-1 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-500/10 dark:border-emerald-800 dark:text-emerald-400",
                              onClick: () => markReachedMutation.mutate(m),
                              disabled: markReachedMutation.isPending,
                              "data-ocid": `mark-reached-${m.id}`,
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Mark Reached" })
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Button,
                            {
                              type: "button",
                              variant: "ghost",
                              size: "icon",
                              className: "h-7 w-7 text-muted-foreground hover:text-destructive min-h-[44px] min-w-[44px]",
                              onClick: () => deleteMutation.mutate(m.id),
                              "aria-label": "Delete milestone",
                              "data-ocid": `delete-milestone-${m.id}`,
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                            }
                          )
                        ] })
                      ] }),
                      isExpanded && linkedTasks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-border/60 space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground mb-2", children: "Linked Tasks" }),
                        linkedTasks.map((t) => {
                          const tb = TASK_STATUS_BADGE[t.status] ?? TASK_STATUS_BADGE[TaskStatus.Todo];
                          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Link,
                            {
                              to: "/app/$workspaceId/projects/$projectId/tasks/$taskId",
                              params: {
                                workspaceId,
                                projectId,
                                taskId: t.id
                              },
                              className: "flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-muted/50 transition-colors group",
                              "data-ocid": `milestone-task-${t.id}`,
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm text-foreground truncate group-hover:text-primary transition-colors", children: t.title }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "span",
                                  {
                                    className: `shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium border ${tb.className}`,
                                    children: tb.label
                                  }
                                )
                              ]
                            },
                            t.id
                          );
                        })
                      ] })
                    ]
                  }
                )
              ]
            },
            m.id
          );
        }) })
      ] })
    ] })
  ] });
}
export {
  MilestonesPage as default
};
