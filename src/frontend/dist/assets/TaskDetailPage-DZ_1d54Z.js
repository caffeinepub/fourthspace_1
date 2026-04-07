import { b as useParams, a as useNavigate, h as getTenantId, d as useQueryClient, e as useQuery, r as reactExports, T as TaskStatus, i as TaskPriority, j as jsxRuntimeExports, B as Button, f as Link, F as FolderKanban } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { I as Input } from "./input-C0aO0R3D.js";
import { L as Label } from "./label-CBtn2p-5.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D0Yw2k_p.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { T as Textarea } from "./textarea-DoR08WA4.js";
import { u as useMutation } from "./useMutation-BeBnUQJD.js";
import { u as ue } from "./index-p-k3Ndic.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { A as ArrowLeft } from "./arrow-left-mNBAKt8w.js";
import { L as LoaderCircle } from "./loader-circle-CEvzFFjS.js";
import { T as Trash2 } from "./trash-2-5DF1cbxg.js";
import { C as Calendar } from "./calendar-ts51vnwj.js";
import { C as Clock } from "./clock-xD41YETq.js";
import { C as CircleAlert } from "./circle-alert-2s6nWhnT.js";
import { S as Save } from "./save-gMXGM8pU.js";
import { L as Link2 } from "./link-2-CZnDvFVS.js";
import "./index-IXOTxK3N.js";
import "./index-BGFsRO7G.js";
import "./check-EW6vRiNm.js";
const PRIORITY_OPTIONS = [
  { value: TaskPriority.Low, label: "Low" },
  { value: TaskPriority.Medium, label: "Medium" },
  { value: TaskPriority.High, label: "High" },
  { value: TaskPriority.Critical, label: "Critical" }
];
const STATUS_OPTIONS = [
  { value: TaskStatus.Todo, label: "To Do" },
  { value: TaskStatus.InProgress, label: "In Progress" },
  { value: TaskStatus.Done, label: "Done" },
  { value: TaskStatus.Blocked, label: "Blocked" }
];
const PRIORITY_COLOR = {
  [TaskPriority.Low]: "bg-muted text-muted-foreground border-border",
  [TaskPriority.Medium]: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400",
  [TaskPriority.High]: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800 dark:text-red-400",
  [TaskPriority.Critical]: "bg-red-600/20 text-red-700 border-red-300 font-semibold"
};
const STATUS_COLOR = {
  [TaskStatus.Todo]: "bg-muted text-muted-foreground border-border",
  [TaskStatus.InProgress]: "bg-orange-500/10 text-orange-600 border-orange-200",
  [TaskStatus.Done]: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  [TaskStatus.Blocked]: "bg-destructive/10 text-destructive border-destructive/30"
};
function formatDateValue(ts) {
  if (!ts) return "";
  return new Date(Number(ts) / 1e6).toISOString().split("T")[0];
}
function parseDateToTimestamp(dateStr) {
  if (!dateStr) return void 0;
  return BigInt(new Date(dateStr).getTime() * 1e6);
}
function TaskDetailPage() {
  var _a;
  const { projectId, taskId } = useParams({
    from: "/app/projects/$projectId/tasks/$taskId"
  });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();
  const isNew = taskId === "new";
  const { data: task, isLoading } = useQuery({
    queryKey: ["task", tenantId, taskId],
    queryFn: async () => {
      if (!actor || isNew) return null;
      const r = await actor.getTask(tenantId, taskId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled: !!actor && !isFetching && !isNew
  });
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState(TaskStatus.Todo);
  const [priority, setPriority] = reactExports.useState(TaskPriority.Medium);
  const [dueDate, setDueDate] = reactExports.useState("");
  const [crossLinks, setCrossLinks] = reactExports.useState([]);
  const [isDirty, setIsDirty] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(formatDateValue(task.dueDate));
      setCrossLinks(task.crossLinks);
      setIsDirty(false);
    }
  }, [task]);
  const saveMutation = useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      if (isNew) {
        const result2 = await actor.createTask(tenantId, input);
        if (result2.__kind__ === "err") throw new Error(result2.err);
        return result2.ok;
      }
      const result = await actor.updateTask(tenantId, taskId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", tenantId, projectId]
      });
      queryClient.invalidateQueries({ queryKey: ["task", tenantId, taskId] });
      ue.success(isNew ? "Task created" : "Task saved");
      setIsDirty(false);
      if (isNew) {
        navigate({
          to: "/app/projects/$projectId/tasks/$taskId",
          params: { projectId, taskId: saved.id }
        });
      }
    },
    onError: (err) => {
      ue.error(err.message || "Failed to save task");
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.deleteTask(tenantId, taskId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", tenantId, projectId]
      });
      ue.success("Task deleted");
      navigate({ to: "/app/projects/$projectId", params: { projectId } });
    },
    onError: (err) => {
      ue.error(err.message || "Failed to delete task");
    }
  });
  function handleSave() {
    if (!title.trim()) {
      ue.error("Task title is required");
      return;
    }
    saveMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      projectId,
      priority,
      dueDate: parseDateToTimestamp(dueDate),
      crossLinks
    });
  }
  if (isLoading && !isNew) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-2xl mx-auto space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 rounded-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-48" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-2xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          asChild: true,
          "aria-label": "Back to Project",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/projects/$projectId", params: { projectId }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-4 w-4 text-orange-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground truncate", children: isNew ? "New Task" : title || "Task Detail" }),
        !isNew && task && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: `text-xs ${STATUS_COLOR[status]}`,
              children: (_a = STATUS_OPTIONS.find((o) => o.value === status)) == null ? void 0 : _a.label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: `text-xs ${PRIORITY_COLOR[priority]}`,
              children: priority
            }
          )
        ] })
      ] }),
      !isNew && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5 shrink-0",
          onClick: () => deleteMutation.mutate(),
          disabled: deleteMutation.isPending,
          "data-ocid": "task-delete-btn",
          "aria-label": "Delete task",
          children: deleteMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-2xl border border-border bg-card p-6 space-y-5",
        "data-ocid": "task-detail-form",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "task-title", children: [
              "Title ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "task-title",
                placeholder: "e.g. Design homepage wireframes",
                value: title,
                onChange: (e) => {
                  setTitle(e.target.value);
                  setIsDirty(true);
                },
                "data-ocid": "task-title-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "task-desc", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "task-desc",
                placeholder: "Describe what needs to be done...",
                value: description,
                onChange: (e) => {
                  setDescription(e.target.value);
                  setIsDirty(true);
                },
                rows: 4,
                className: "resize-none",
                "data-ocid": "task-desc-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "task-status", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: status,
                  onValueChange: (v) => {
                    setStatus(v);
                    setIsDirty(true);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "task-status", "data-ocid": "task-status-select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: STATUS_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o.value, children: o.label }, o.value)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "task-priority", children: "Priority" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: priority,
                  onValueChange: (v) => {
                    setPriority(v);
                    setIsDirty(true);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        id: "task-priority",
                        "data-ocid": "task-priority-select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: PRIORITY_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o.value, children: o.label }, o.value)) })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "task-due", className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5 text-muted-foreground" }),
              "Due Date"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "task-due",
                type: "date",
                value: dueDate,
                onChange: (e) => {
                  setDueDate(e.target.value);
                  setIsDirty(true);
                },
                "data-ocid": "task-due-input"
              }
            )
          ] }),
          task && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
              "Created",
              " ",
              new Date(Number(task.createdAt) / 1e6).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
              "Updated",
              " ",
              new Date(Number(task.updatedAt) / 1e6).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-3 pt-2 border-t border-border/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", asChild: true, "data-ocid": "task-cancel-btn", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/projects/$projectId", params: { projectId }, children: "Cancel" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: handleSave,
                disabled: saveMutation.isPending || !isNew && !isDirty,
                className: "bg-orange-500 hover:bg-orange-600 text-white",
                "data-ocid": "task-save-btn",
                children: [
                  saveMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-4 w-4" }),
                  isNew ? "Create Task" : "Save Changes"
                ]
              }
            )
          ] })
        ]
      }
    ),
    crossLinks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "flex items-center gap-2 text-sm font-semibold text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-4 w-4 text-orange-500" }),
        "Cross-Links"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: crossLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "outline",
          className: "text-xs gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground capitalize", children: link.entityType }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: link.linkLabel })
          ]
        },
        `${link.entityId}-${link.linkLabel}`
      )) })
    ] })
  ] });
}
export {
  TaskDetailPage as default
};
