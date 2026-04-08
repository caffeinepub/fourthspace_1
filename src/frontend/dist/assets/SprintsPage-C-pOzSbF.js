import { m as useParams, d as useNavigate, f as useWorkspace, n as useQueryClient, r as reactExports, h as useQuery, w as SprintStatus, j as jsxRuntimeExports, B as Button, i as Link, P as Plus, X } from "./index-DemOGW1B.js";
import { B as Badge } from "./badge-BgvX66QS.js";
import { I as Input } from "./input-1iXuA55D.js";
import { L as Label } from "./label-mmRgUQzR.js";
import { S as Skeleton } from "./skeleton-M5HtR2mS.js";
import { u as useMutation } from "./useMutation-4TvYOXEz.js";
import { u as ue } from "./index-BBpqu5x7.js";
import { u as useBackend } from "./index-CeqQA3r7.js";
import { A as ArrowLeft } from "./arrow-left-lpbCbWBz.js";
import { L as LoaderCircle } from "./loader-circle-DNkeklbO.js";
import { C as CalendarRange } from "./calendar-range-2csRA5Tb.js";
import { Z as Zap } from "./zap-B-hC9wa2.js";
import { F as Flag } from "./flag-BI5uxM_6.js";
import { C as Clock } from "./clock-dgG5UHWp.js";
import { C as CircleCheck } from "./circle-check-DcbnON2v.js";
import { T as Trash2 } from "./trash-2-UJLUw61l.js";
import { C as Circle } from "./circle-BvQ-q35D.js";
const STATUS_CONFIG = {
  [SprintStatus.planned]: {
    label: "Planned",
    color: "bg-muted text-muted-foreground border-border",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-3.5 w-3.5" })
  },
  [SprintStatus.active]: {
    label: "Active",
    color: "bg-primary/10 text-primary border-primary/30",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5" })
  },
  [SprintStatus.completed]: {
    label: "Completed",
    color: "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" })
  }
};
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function parseDateToTs(s) {
  return BigInt(new Date(s).getTime() * 1e6);
}
function SprintsPage() {
  const { workspaceId, projectId } = useParams({
    from: "/app/$workspaceId/projects/$projectId/sprints"
  });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("");
  const [goal, setGoal] = reactExports.useState("");
  const [startDate, setStartDate] = reactExports.useState("");
  const [endDate, setEndDate] = reactExports.useState("");
  const { data: sprints = [], isLoading } = useQuery({
    queryKey: ["sprints", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSprints(tenantId, workspaceId, projectId);
    },
    enabled: !!actor && !isFetching
  });
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.createSprint(tenantId, workspaceId, {
        name,
        goal,
        projectId,
        taskIds: [],
        startDate: parseDateToTs(startDate),
        endDate: parseDateToTs(endDate)
      });
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sprints", tenantId, workspaceId, projectId]
      });
      setShowForm(false);
      setName("");
      setGoal("");
      setStartDate("");
      setEndDate("");
      ue.success("Sprint created");
    },
    onError: (e) => ue.error(e.message)
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.deleteSprint(tenantId, workspaceId, id);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sprints", tenantId, workspaceId, projectId]
      });
      ue.success("Sprint deleted");
    },
    onError: (e) => ue.error(e.message)
  });
  const activeSprints = sprints.filter((s) => s.status === SprintStatus.active);
  const otherSprints = sprints.filter((s) => s.status !== SprintStatus.active);
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
            className: "hover:text-foreground transition-colors truncate",
            children: "Project"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "Sprints" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "gap-1.5 h-8 text-xs active-press",
          onClick: () => setShowForm(true),
          "data-ocid": "create-sprint-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            " New Sprint"
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-8 py-6 space-y-6", children: [
      showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-2xl border border-primary/30 bg-card p-5 space-y-4",
          "data-ocid": "sprint-create-form",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-bold text-foreground", children: "New Sprint" }),
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Sprint Name *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "Sprint 1",
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    className: "h-8 text-sm",
                    "data-ocid": "sprint-name-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Sprint Goal" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "What do you want to achieve?",
                    value: goal,
                    onChange: (e) => setGoal(e.target.value),
                    className: "h-8 text-sm",
                    "data-ocid": "sprint-goal-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Start Date *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "date",
                    value: startDate,
                    onChange: (e) => setStartDate(e.target.value),
                    className: "h-8 text-sm",
                    "data-ocid": "sprint-start-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "End Date *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "date",
                    value: endDate,
                    onChange: (e) => setEndDate(e.target.value),
                    className: "h-8 text-sm",
                    "data-ocid": "sprint-end-input"
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
                  disabled: !name.trim() || !startDate || !endDate || createMutation.isPending,
                  onClick: () => createMutation.mutate(),
                  "data-ocid": "sprint-save-btn",
                  children: [
                    createMutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
                    "Create Sprint"
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
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-2xl" }, n)) }),
      !isLoading && sprints.length === 0 && !showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 gap-4",
          "data-ocid": "sprints-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarRange, { className: "h-7 w-7 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground", children: "No sprints yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Create your first sprint to organize work into time-boxed iterations." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "gap-1.5 text-xs",
                onClick: () => setShowForm(true),
                "data-ocid": "create-first-sprint-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                  "Create First Sprint"
                ]
              }
            )
          ]
        }
      ),
      activeSprints.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-sm font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-primary" }),
          "Active Sprint"
        ] }),
        activeSprints.map((sprint) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          SprintCard,
          {
            sprint,
            projectId,
            workspaceId,
            onDelete: (id) => deleteMutation.mutate(id)
          },
          sprint.id
        ))
      ] }),
      otherSprints.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-sm font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-4 w-4 text-muted-foreground" }),
          "All Sprints"
        ] }),
        otherSprints.map((sprint) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          SprintCard,
          {
            sprint,
            projectId,
            workspaceId,
            onDelete: (id) => deleteMutation.mutate(id)
          },
          sprint.id
        ))
      ] })
    ] })
  ] });
}
function SprintCard({
  sprint,
  projectId,
  workspaceId,
  onDelete
}) {
  const cfg = STATUS_CONFIG[sprint.status];
  const isActive = sprint.status === SprintStatus.active;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `rounded-2xl border ${isActive ? "border-primary/40 bg-primary/5" : "border-border bg-card"} p-5 transition-smooth hover:shadow-sm`,
      "data-ocid": `sprint-card-${sprint.id}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/app/$workspaceId/projects/$projectId/sprints/$sprintId",
                params: { workspaceId, projectId, sprintId: sprint.id },
                className: "font-display font-bold text-foreground hover:text-primary transition-colors text-base",
                "data-ocid": `sprint-link-${sprint.id}`,
                children: sprint.name
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: `text-xs gap-1 ${cfg.color}`, children: [
              cfg.icon,
              cfg.label
            ] })
          ] }),
          sprint.goal && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground line-clamp-1", children: sprint.goal }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
              formatDate(sprint.startDate),
              " – ",
              formatDate(sprint.endDate)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
              sprint.taskIds.length,
              " tasks"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "icon",
            className: "h-7 w-7 text-muted-foreground hover:text-destructive",
            "aria-label": "Delete sprint",
            onClick: () => onDelete(sprint.id),
            "data-ocid": `sprint-delete-${sprint.id}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
          }
        ) })
      ] })
    }
  );
}
export {
  SprintsPage as default
};
