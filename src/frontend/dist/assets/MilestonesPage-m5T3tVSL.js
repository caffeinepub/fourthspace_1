import { m as useParams, d as useNavigate, f as useWorkspace, n as useQueryClient, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, P as Plus, X, w as MilestoneStatus } from "./index-CzyNqtbv.js";
import { B as Badge } from "./badge-B6elWcoD.js";
import { I as Input } from "./input-982h_Ebl.js";
import { L as Label } from "./label-D31XgQrg.js";
import { S as Skeleton } from "./skeleton-DMAdSNre.js";
import { T as Textarea } from "./textarea-BbzS3l8F.js";
import { u as useMutation } from "./useMutation-BsRk2Bod.js";
import { u as ue } from "./index-DaWH_LJ9.js";
import { u as useBackend } from "./index-CJtF1vtU.js";
import { A as ArrowLeft } from "./arrow-left-BnDr9sMT.js";
import { L as LoaderCircle } from "./loader-circle-CdDQIoul.js";
import { F as Flag } from "./flag-DFnbXOx9.js";
import { C as Clock } from "./clock-DD8HS7VE.js";
import { C as CircleCheck } from "./circle-check-Bz_M8Dh9.js";
import { T as Trash2 } from "./trash-2-8AcD7pMp.js";
import { T as TriangleAlert } from "./triangle-alert-B7NWtnMG.js";
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
  const { data: milestones = [], isLoading } = useQuery({
    queryKey: ["milestones", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMilestones(tenantId, workspaceId, projectId);
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
  const sorted = [...milestones].sort((a, b) => Number(a.dueDate - b.dueDate));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full min-h-0 overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 md:px-8 pt-4 pb-4 border-b border-border/60 bg-card/80 sticky top-0 z-10 backdrop-blur-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-8 w-8",
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
          className: "gap-1.5 h-8 text-xs active-press",
          onClick: () => setShowForm(true),
          "data-ocid": "create-milestone-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            " New Milestone"
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-8 py-6 space-y-6", children: [
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `flex-1 rounded-2xl border ${m.status === MilestoneStatus.reached ? "border-emerald-200 dark:border-emerald-800 bg-emerald-500/5" : m.status === MilestoneStatus.missed ? "border-destructive/30 bg-destructive/5" : "border-border bg-card"} p-4`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
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
                            " linked tasks"
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
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
                              "Mark Reached"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            type: "button",
                            variant: "ghost",
                            size: "icon",
                            className: "h-7 w-7 text-muted-foreground hover:text-destructive",
                            onClick: () => deleteMutation.mutate(m.id),
                            "aria-label": "Delete milestone",
                            "data-ocid": `delete-milestone-${m.id}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                          }
                        )
                      ] })
                    ] })
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
