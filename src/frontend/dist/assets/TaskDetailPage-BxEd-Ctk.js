import { s as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, f as useWorkspace, n as useQueryClient, h as useQuery, P as Plus, T as TaskStatus, ap as TaskPriority, aQ as useInternetIdentity, b as MessageSquare, X, b0 as ActivityEventType, b1 as TaskRelationshipType, i as Link, aZ as Bell, m as useParams, d as useNavigate, a as FolderKanban, ab as ChevronDown } from "./index-BZqaRhAX.js";
import { B as Badge } from "./index--nGTycyb.js";
import { I as Input } from "./input-BJtw5f9h.js";
import { L as Label } from "./label-CvyzRjc5.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CkiaF30e.js";
import { S as Skeleton } from "./skeleton-CXUiMpVp.js";
import { T as Textarea } from "./textarea-CZBafaSY.js";
import { u as useMutation } from "./useMutation-CLofsIuD.js";
import { u as ue } from "./index-BRf-248B.js";
import { T as Timer } from "./timer-DQAYHX6s.js";
import { C as Clock } from "./clock-BL9M8ZaB.js";
import { P as Pause } from "./pause-8_e3Pumg.js";
import { P as Play } from "./play-GvfN7bTG.js";
import { u as useBackend } from "./useBackend-DSxJo5MU.js";
import { S as SquareCheckBig } from "./square-check-big-DBKF0v09.js";
import { S as Square } from "./square-KW8NNjiy.js";
import { T as Trash2 } from "./trash-2-B2tpJk42.js";
import { C as CircleCheck } from "./circle-check-wa2s5his.js";
import { C as Circle } from "./circle-BjnPthQb.js";
import { S as Save } from "./save-7muzwGmu.js";
import { P as Pen } from "./pen-ByMLEEeW.js";
import { C as Copy } from "./copy-ltoxOxzI.js";
import { L as Link2 } from "./link-2-D7MBFLBt.js";
import { T as TriangleAlert } from "./triangle-alert-DZo5ldlW.js";
import { L as Lock } from "./lock-D4SeUQX2.js";
import { E as Eye } from "./eye-UnGsrwvr.js";
import { A as ArrowLeft } from "./arrow-left-BCLeiEG1.js";
import { L as LoaderCircle } from "./loader-circle-MfA_AsIp.js";
import { C as Calendar } from "./calendar-DNogRdhP.js";
import { C as CircleAlert } from "./circle-alert-BzUnhcW5.js";
import { L as ListChecks } from "./list-checks-DZKL2Ng9.js";
import { Z as Zap } from "./zap-DypWY2Qj.js";
import { C as ChevronRight } from "./chevron-right-CJImBI0a.js";
import "./index-IXOTxK3N.js";
import "./index-38IBqnCJ.js";
import "./chevron-up-Dd5ZqoJs.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742",
      key: "178tsu"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05", key: "1hqiys" }]
];
const BellOff = createLucideIcon("bell-off", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "18", cy: "18", r: "3", key: "1xkwt0" }],
  ["circle", { cx: "6", cy: "6", r: "3", key: "1lh9wr" }],
  ["path", { d: "M6 21V9a9 9 0 0 0 9 9", key: "7kw0sc" }]
];
const GitMerge = createLucideIcon("git-merge", __iconNode);
function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m`;
  if (m > 0) return `${m}m ${s.toString().padStart(2, "0")}s`;
  return `${s}s`;
}
function formatTime(ts) {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}
function formatDate(ts) {
  const d = new Date(ts);
  const today = /* @__PURE__ */ new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function TimeTracker({
  taskId,
  projectId,
  entries,
  isLoading,
  onStart,
  onStop
}) {
  const [isRunning, setIsRunning] = reactExports.useState(false);
  const [elapsed, setElapsed] = reactExports.useState(0);
  const [activeEntryId, setActiveEntryId] = reactExports.useState(null);
  const intervalRef = reactExports.useRef(null);
  const startTimeRef = reactExports.useRef(0);
  const totalSeconds = entries.reduce(
    (acc, e) => acc + (e.durationSeconds ?? 0),
    0
  );
  const recentEntries = [...entries].sort((a, b) => b.startedAt - a.startedAt).slice(0, 5);
  const startTimer = reactExports.useCallback(() => {
    startTimeRef.current = Date.now();
    setElapsed(0);
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1e3));
    }, 1e3);
    const tempId = `temp-${Date.now()}`;
    setActiveEntryId(tempId);
    onStart == null ? void 0 : onStart({
      tenantId: "",
      userId: "",
      projectId,
      taskId,
      description: "",
      startedAt: startTimeRef.current,
      durationSeconds: 0,
      status: "running",
      tags: []
    });
  }, [projectId, taskId, onStart]);
  const stopTimer = reactExports.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    const finalElapsed = Math.floor((Date.now() - startTimeRef.current) / 1e3);
    setElapsed(finalElapsed);
    if (activeEntryId) {
      onStop == null ? void 0 : onStop(activeEntryId, finalElapsed);
      setActiveEntryId(null);
    }
  }, [activeEntryId, onStop]);
  reactExports.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl border border-border bg-card p-5 space-y-4",
      "data-ocid": "time-tracker-widget",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-4 w-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Time Tracker" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono font-semibold text-foreground", children: formatDuration(totalSeconds + (isRunning ? elapsed : 0)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "total" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: isRunning ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-2 w-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-primary" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "Recording" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-mono font-bold text-primary tabular-nums", children: formatDuration(elapsed) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Start timer to log time on this task" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: isRunning ? "outline" : "default",
              size: "sm",
              onClick: isRunning ? stopTimer : startTimer,
              className: "shrink-0 gap-2",
              "data-ocid": "timer-toggle-btn",
              children: isRunning ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-3.5 w-3.5" }),
                " Stop"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3.5 w-3.5" }),
                " Start"
              ] })
            }
          )
        ] }),
        recentEntries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Recent Entries" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border rounded-xl border border-border overflow-hidden", children: recentEntries.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-3 px-3 py-2.5 bg-card",
              "data-ocid": `time-entry-row-${entry.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
                  formatDate(entry.startedAt),
                  " · ",
                  formatTime(entry.startedAt)
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 shrink-0", children: entry.status === "running" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/10 text-primary border-primary/20 text-xs", children: "Running" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono font-semibold text-foreground tabular-nums", children: formatDuration(entry.durationSeconds) }) })
              ]
            },
            entry.id
          )) })
        ] }),
        recentEntries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-3", "data-ocid": "time-tracker-empty", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No time logged yet. Start the timer above." }) })
      ]
    }
  );
}
function ChecklistSection({ taskId }) {
  const { actor, isFetching } = useBackend();
  const { tenantId, activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();
  const [adding, setAdding] = reactExports.useState(false);
  const [newText, setNewText] = reactExports.useState("");
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["checklist", tenantId, workspaceId, taskId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listChecklistItems(tenantId, workspaceId, taskId);
    },
    enabled: !!actor && !isFetching
  });
  const addMutation = useMutation({
    mutationFn: async (content) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.addChecklistItem(tenantId, workspaceId, {
        content,
        order: BigInt(items.length),
        completed: false,
        taskId
      });
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checklist", tenantId, workspaceId, taskId]
      });
      setNewText("");
      setAdding(false);
    },
    onError: (e) => ue.error(e.message)
  });
  const toggleMutation = useMutation({
    mutationFn: async ({
      id,
      content,
      completed
    }) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.updateChecklistItem(
        tenantId,
        workspaceId,
        id,
        content,
        completed
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["checklist", tenantId, workspaceId, taskId]
    }),
    onError: (e) => ue.error(e.message)
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.deleteChecklistItem(tenantId, workspaceId, id);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["checklist", tenantId, workspaceId, taskId]
    }),
    onError: (e) => ue.error(e.message)
  });
  const doneCount = items.filter((i) => i.completed).length;
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "checklist-section", children: [
    items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500",
          style: { width: `${doneCount / items.length * 100}%` }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground shrink-0 tabular-nums", children: [
        doneCount,
        "/",
        items.length
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "group flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-muted/50 transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": item.completed ? "Uncheck item" : "Check item",
              onClick: () => toggleMutation.mutate({
                id: item.id,
                content: item.content,
                completed: !item.completed
              }),
              className: "shrink-0 text-muted-foreground hover:text-primary transition-colors",
              children: item.completed ? /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `flex-1 text-sm ${item.completed ? "line-through text-muted-foreground" : "text-foreground"}`,
              children: item.content
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": "Delete item",
              onClick: () => deleteMutation.mutate(item.id),
              className: "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
            }
          )
        ]
      },
      item.id
    )) }),
    adding ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          autoFocus: true,
          placeholder: "Add item...",
          value: newText,
          onChange: (e) => setNewText(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter" && newText.trim())
              addMutation.mutate(newText.trim());
            if (e.key === "Escape") {
              setAdding(false);
              setNewText("");
            }
          },
          className: "h-8 text-sm",
          "data-ocid": "checklist-item-input"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          size: "sm",
          className: "h-8 px-3 text-xs",
          disabled: !newText.trim() || addMutation.isPending,
          onClick: () => newText.trim() && addMutation.mutate(newText.trim()),
          "data-ocid": "checklist-save-btn",
          children: "Add"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          className: "h-8 px-2 text-xs",
          onClick: () => {
            setAdding(false);
            setNewText("");
          },
          children: "Cancel"
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        variant: "ghost",
        size: "sm",
        className: "h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground",
        onClick: () => setAdding(true),
        "data-ocid": "checklist-add-btn",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
          "Add item"
        ]
      }
    )
  ] });
}
function SubtaskList({ taskId, projectId }) {
  const { actor, isFetching } = useBackend();
  const { tenantId, activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();
  const [adding, setAdding] = reactExports.useState(false);
  const [newTitle, setNewTitle] = reactExports.useState("");
  const { data: subtasks = [], isLoading } = useQuery({
    queryKey: ["subtasks", tenantId, workspaceId, taskId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSubtasks(tenantId, workspaceId, taskId);
    },
    enabled: !!actor && !isFetching
  });
  const createMutation = useMutation({
    mutationFn: async (title) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.createSubtask(tenantId, workspaceId, {
        title,
        description: "",
        projectId,
        parentTaskId: taskId,
        priority: TaskPriority.Medium,
        status: TaskStatus.Todo,
        order: BigInt(subtasks.length)
      });
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subtasks", tenantId, workspaceId, taskId]
      });
      setNewTitle("");
      setAdding(false);
    },
    onError: (e) => ue.error(e.message)
  });
  const toggleMutation = useMutation({
    mutationFn: async ({
      id,
      title,
      done
    }) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.updateSubtask(
        tenantId,
        workspaceId,
        id,
        title,
        done ? TaskStatus.Done : TaskStatus.Todo
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["subtasks", tenantId, workspaceId, taskId]
    }),
    onError: (e) => ue.error(e.message)
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.deleteSubtask(tenantId, workspaceId, id);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["subtasks", tenantId, workspaceId, taskId]
    }),
    onError: (e) => ue.error(e.message)
  });
  const doneCount = subtasks.filter((s) => s.status === TaskStatus.Done).length;
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-xl" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "subtask-list", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: subtasks.length > 0 ? `${doneCount}/${subtasks.length} completed` : "No subtasks" }),
      subtasks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 mx-3 h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full bg-primary rounded-full transition-all duration-300",
          style: {
            width: subtasks.length > 0 ? `${doneCount / subtasks.length * 100}%` : "0%"
          }
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: subtasks.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted/50 transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": sub.status === TaskStatus.Done ? "Mark incomplete" : "Mark complete",
              onClick: () => toggleMutation.mutate({
                id: sub.id,
                title: sub.title,
                done: sub.status !== TaskStatus.Done
              }),
              className: "shrink-0 text-muted-foreground hover:text-primary transition-colors",
              children: sub.status === TaskStatus.Done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `flex-1 text-sm min-w-0 truncate ${sub.status === TaskStatus.Done ? "line-through text-muted-foreground" : "text-foreground"}`,
              children: sub.title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": "Delete subtask",
              onClick: () => deleteMutation.mutate(sub.id),
              className: "shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
            }
          )
        ]
      },
      sub.id
    )) }),
    adding ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          autoFocus: true,
          placeholder: "Subtask title...",
          value: newTitle,
          onChange: (e) => setNewTitle(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter" && newTitle.trim())
              createMutation.mutate(newTitle.trim());
            if (e.key === "Escape") {
              setAdding(false);
              setNewTitle("");
            }
          },
          className: "h-8 text-sm",
          "data-ocid": "subtask-new-input"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          size: "sm",
          className: "h-8 px-3 text-xs",
          disabled: !newTitle.trim() || createMutation.isPending,
          onClick: () => newTitle.trim() && createMutation.mutate(newTitle.trim()),
          "data-ocid": "subtask-save-btn",
          children: "Add"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          className: "h-8 px-2 text-xs",
          onClick: () => {
            setAdding(false);
            setNewTitle("");
          },
          children: "Cancel"
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        variant: "ghost",
        size: "sm",
        className: "h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground mt-1",
        onClick: () => setAdding(true),
        "data-ocid": "subtask-add-btn",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
          "Add subtask"
        ]
      }
    )
  ] });
}
function formatTs$1(ts) {
  const ms = Number(ts) / 1e6;
  const d = new Date(ms);
  const now = Date.now();
  const diff = now - ms;
  if (diff < 6e4) return "just now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function initials(id) {
  return id.slice(0, 2).toUpperCase();
}
const ACTIVITY_ICONS = {
  [ActivityEventType.taskCreated]: "✨",
  [ActivityEventType.taskUpdated]: "✏️",
  [ActivityEventType.taskStatusChanged]: "🔄",
  [ActivityEventType.taskAssigned]: "👤",
  [ActivityEventType.commentAdded]: "💬",
  [ActivityEventType.commentEdited]: "📝",
  [ActivityEventType.subtaskAdded]: "📋",
  [ActivityEventType.checklistItemAdded]: "☑️",
  [ActivityEventType.checklistItemCompleted]: "✅",
  [ActivityEventType.watcherAdded]: "👁️",
  [ActivityEventType.dependencyAdded]: "🔗",
  [ActivityEventType.sprintStarted]: "🚀",
  [ActivityEventType.sprintCompleted]: "🏁",
  [ActivityEventType.milestoneCreated]: "🎯"
};
function TaskComments({ taskId, projectId }) {
  const { actor, isFetching } = useBackend();
  const { tenantId, activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  const myPrincipal = (identity == null ? void 0 : identity.getPrincipal().toText()) ?? "";
  const [tab, setTab] = reactExports.useState("comments");
  const [newComment, setNewComment] = reactExports.useState("");
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editText, setEditText] = reactExports.useState("");
  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", tenantId, workspaceId, taskId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listComments(tenantId, workspaceId, taskId);
    },
    enabled: !!actor && !isFetching
  });
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["activity", tenantId, workspaceId, taskId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listActivityEvents(tenantId, workspaceId, taskId);
    },
    enabled: !!actor && !isFetching && tab === "activity"
  });
  const addMutation = useMutation({
    mutationFn: async (content) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.addComment(tenantId, workspaceId, projectId, {
        content,
        taskId
      });
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", tenantId, workspaceId, taskId]
      });
      setNewComment("");
    },
    onError: (e) => ue.error(e.message)
  });
  const editMutation = useMutation({
    mutationFn: async ({ id, content }) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.editComment(tenantId, workspaceId, id, content);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", tenantId, workspaceId, taskId]
      });
      setEditingId(null);
      setEditText("");
    },
    onError: (e) => ue.error(e.message)
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.deleteComment(tenantId, workspaceId, id);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["comments", tenantId, workspaceId, taskId]
    }),
    onError: (e) => ue.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "task-comments", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setTab("comments"),
          className: `flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${tab === "comments" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
          "data-ocid": "comments-tab",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3.5 w-3.5" }),
            "Comments",
            comments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "text-[10px] px-1.5 py-0 h-4 min-w-4",
                children: comments.length
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setTab("activity"),
          className: `flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${tab === "activity" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
          "data-ocid": "activity-tab",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-3.5 w-3.5" }),
            "Activity"
          ]
        }
      )
    ] }),
    tab === "comments" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      commentsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-xl" }, n)) }) : comments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "py-8 text-center text-sm text-muted-foreground",
          "data-ocid": "comments-empty",
          children: "No comments yet. Be the first to comment."
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: comments.map((c) => {
        var _a, _b;
        const isOwn = typeof c.authorId === "object" ? ((_b = (_a = c.authorId).toText) == null ? void 0 : _b.call(_a)) === myPrincipal : String(c.authorId) === myPrincipal;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex gap-2.5",
            "data-ocid": `comment-${c.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary", children: initials(c.id) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: "Team Member" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: formatTs$1(c.createdAt) }),
                  c.editedAt && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground italic", children: "(edited)" })
                ] }),
                editingId === c.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      autoFocus: true,
                      value: editText,
                      onChange: (e) => setEditText(e.target.value),
                      className: "text-sm resize-none min-h-[60px]",
                      rows: 2
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        type: "button",
                        size: "sm",
                        className: "h-7 gap-1.5 text-xs",
                        disabled: !editText.trim() || editMutation.isPending,
                        onClick: () => editMutation.mutate({
                          id: c.id,
                          content: editText.trim()
                        }),
                        "data-ocid": "comment-save-edit-btn",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3 w-3" }),
                          "Save"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        type: "button",
                        variant: "ghost",
                        size: "sm",
                        className: "h-7 gap-1.5 text-xs",
                        onClick: () => {
                          setEditingId(null);
                          setEditText("");
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }),
                          "Cancel"
                        ]
                      }
                    )
                  ] })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground break-words", children: c.content }),
                isOwn && editingId !== c.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      className: "text-[11px] text-muted-foreground hover:text-foreground transition-colors",
                      onClick: () => {
                        setEditingId(c.id);
                        setEditText(c.content);
                      },
                      "data-ocid": `comment-edit-${c.id}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3 w-3 inline mr-0.5" }),
                        "Edit"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "text-[11px] text-muted-foreground hover:text-destructive transition-colors",
                      onClick: () => deleteMutation.mutate(c.id),
                      "data-ocid": `comment-delete-${c.id}`,
                      children: "Delete"
                    }
                  )
                ] })
              ] })
            ]
          },
          c.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5 pt-1 border-t border-border/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary", children: initials(myPrincipal || "me") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              placeholder: "Add a comment...",
              value: newComment,
              onChange: (e) => setNewComment(e.target.value),
              className: "text-sm resize-none min-h-[60px]",
              rows: 2,
              "data-ocid": "new-comment-input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              className: "h-8 gap-1.5 text-xs",
              disabled: !newComment.trim() || addMutation.isPending,
              onClick: () => newComment.trim() && addMutation.mutate(newComment.trim()),
              "data-ocid": "add-comment-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3.5 w-3.5" }),
                "Add comment"
              ]
            }
          )
        ] })
      ] })
    ] }),
    tab === "activity" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: eventsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-lg" }, n)) }) : events.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "py-8 text-center text-sm text-muted-foreground",
        "data-ocid": "activity-empty",
        children: "No activity yet."
      }
    ) : [...events].reverse().map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-2.5 px-1 py-1.5 rounded-lg hover:bg-muted/40 transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base shrink-0 mt-0.5", children: ACTIVITY_ICONS[e.eventType] ?? "📌" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground", children: e.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: formatTs$1(e.createdAt) })
          ] })
        ]
      },
      e.id
    )) })
  ] });
}
const REL_CONFIG = {
  [TaskRelationshipType.blocks]: {
    label: "Blocks",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5" }),
    color: "bg-destructive/10 text-destructive border-destructive/30"
  },
  [TaskRelationshipType.blockedBy]: {
    label: "Blocked by",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
    color: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400"
  },
  [TaskRelationshipType.relatedTo]: {
    label: "Related to",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3.5 w-3.5" }),
    color: "bg-primary/10 text-primary border-primary/30"
  },
  [TaskRelationshipType.duplicateOf]: {
    label: "Duplicate of",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" }),
    color: "bg-muted text-muted-foreground border-border"
  }
};
function TaskRelationships({
  taskId,
  projectId
}) {
  const { actor, isFetching } = useBackend();
  const { tenantId, activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();
  const [adding, setAdding] = reactExports.useState(false);
  const [relType, setRelType] = reactExports.useState(
    TaskRelationshipType.relatedTo
  );
  const [targetId, setTargetId] = reactExports.useState("");
  const { data: relationships = [], isLoading } = useQuery({
    queryKey: ["relationships", tenantId, workspaceId, taskId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTaskRelationships(tenantId, workspaceId, taskId);
    },
    enabled: !!actor && !isFetching
  });
  const addMutation = useMutation({
    mutationFn: async ({
      target,
      type
    }) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.addTaskRelationship(
        tenantId,
        workspaceId,
        taskId,
        target,
        type
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["relationships", tenantId, workspaceId, taskId]
      });
      setTargetId("");
      setAdding(false);
    },
    onError: (e) => ue.error(e.message)
  });
  const removeMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.removeTaskRelationship(tenantId, workspaceId, id);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["relationships", tenantId, workspaceId, taskId]
    }),
    onError: (e) => ue.error(e.message)
  });
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-xl" });
  const grouped = Object.values(TaskRelationshipType).reduce((acc, type) => {
    acc[type] = relationships.filter((r) => r.relationshipType === type);
    return acc;
  }, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "task-relationships", children: [
    relationships.length === 0 && !adding && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No relationships added." }),
    Object.entries(grouped).map(([type, rels]) => {
      if (rels.length === 0) return null;
      const cfg = REL_CONFIG[type];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs font-medium text-muted-foreground", children: [
          cfg.icon,
          cfg.label
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 pl-1", children: rels.map((rel) => {
          const otherId = rel.sourceTaskId === taskId ? rel.targetTaskId : rel.sourceTaskId;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: `text-xs gap-1.5 ${cfg.color}`,
                children: [
                  cfg.icon,
                  cfg.label
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/app/$workspaceId/projects/$projectId/tasks/$taskId",
                params: { workspaceId, projectId, taskId: otherId },
                className: "text-xs text-primary hover:underline truncate flex-1 min-w-0",
                "data-ocid": `rel-link-${rel.id}`,
                children: otherId
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Remove relationship",
                onClick: () => removeMutation.mutate(rel.id),
                className: "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
              }
            )
          ] }, rel.id);
        }) })
      ] }, type);
    }),
    adding ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-lg border border-border bg-muted/30 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: relType,
            onValueChange: (v) => setRelType(v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-8 text-xs",
                  "data-ocid": "rel-type-select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.entries(REL_CONFIG).map(([val, cfg]) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: val, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                cfg.icon,
                cfg.label
              ] }) }, val)) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Target task ID...",
            value: targetId,
            onChange: (e) => setTargetId(e.target.value),
            className: "h-8 text-xs font-mono",
            "data-ocid": "rel-target-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            size: "sm",
            className: "h-7 text-xs px-3",
            disabled: !targetId.trim() || addMutation.isPending,
            onClick: () => targetId.trim() && addMutation.mutate({ target: targetId.trim(), type: relType }),
            "data-ocid": "rel-add-confirm-btn",
            children: "Add"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            className: "h-7 text-xs px-2",
            onClick: () => {
              setAdding(false);
              setTargetId("");
            },
            children: "Cancel"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        variant: "ghost",
        size: "sm",
        className: "h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground",
        onClick: () => setAdding(true),
        "data-ocid": "add-relationship-btn",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
          "Add relationship"
        ]
      }
    )
  ] });
}
function TaskWatchers({ taskId }) {
  const { actor, isFetching } = useBackend();
  const { tenantId, activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  const myPrincipal = identity == null ? void 0 : identity.getPrincipal();
  const { data: watchers = [], isLoading } = useQuery({
    queryKey: ["watchers", tenantId, workspaceId, taskId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTaskWatchers(tenantId, workspaceId, taskId);
    },
    enabled: !!actor && !isFetching
  });
  const { data: isWatching = false } = useQuery({
    queryKey: [
      "isWatching",
      tenantId,
      workspaceId,
      taskId,
      myPrincipal == null ? void 0 : myPrincipal.toText()
    ],
    queryFn: async () => {
      if (!actor || !myPrincipal) return false;
      return actor.isWatching(tenantId, workspaceId, taskId, myPrincipal);
    },
    enabled: !!actor && !isFetching && !!myPrincipal
  });
  const watchMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !myPrincipal) throw new Error("Not connected");
      const r = await actor.addTaskWatcher(
        tenantId,
        workspaceId,
        taskId,
        myPrincipal
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["watchers", tenantId, workspaceId, taskId]
      });
      queryClient.invalidateQueries({
        queryKey: ["isWatching", tenantId, workspaceId, taskId]
      });
      ue.success("Watching this task");
    },
    onError: (e) => ue.error(e.message)
  });
  const unwatchMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !myPrincipal) throw new Error("Not connected");
      const r = await actor.removeTaskWatcher(
        tenantId,
        workspaceId,
        taskId,
        myPrincipal
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["watchers", tenantId, workspaceId, taskId]
      });
      queryClient.invalidateQueries({
        queryKey: ["isWatching", tenantId, workspaceId, taskId]
      });
      ue.success("Stopped watching");
    },
    onError: (e) => ue.error(e.message)
  });
  const removeMutation = useMutation({
    mutationFn: async (userId) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.removeTaskWatcher(
        tenantId,
        workspaceId,
        taskId,
        userId
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["watchers", tenantId, workspaceId, taskId]
    }),
    onError: (e) => ue.error(e.message)
  });
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-xl" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", "data-ocid": "task-watchers", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          watchers.length,
          " watching"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: isWatching ? "outline" : "secondary",
          size: "sm",
          className: "h-7 gap-1.5 text-xs",
          onClick: () => isWatching ? unwatchMutation.mutate() : watchMutation.mutate(),
          disabled: watchMutation.isPending || unwatchMutation.isPending,
          "data-ocid": "watch-toggle-btn",
          children: isWatching ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "h-3.5 w-3.5" }),
            "Unwatch"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-3.5 w-3.5" }),
            "Watch"
          ] })
        }
      )
    ] }),
    watchers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: watchers.map((w) => {
      var _a, _b;
      const uid = typeof w.userId === "object" ? ((_b = (_a = w.userId).toText) == null ? void 0 : _b.call(_a)) ?? `${String(w.userId)}` : `${String(w.userId)}`;
      const isMe = uid === (myPrincipal == null ? void 0 : myPrincipal.toText());
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "group flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-foreground",
          "data-ocid": `watcher-${uid.slice(0, 8)}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary shrink-0", children: uid.slice(0, 2).toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "max-w-[80px] truncate", children: isMe ? "You" : `${uid.slice(0, 8)}…` }),
            isMe && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Remove watcher",
                onClick: () => removeMutation.mutate(w.userId),
                className: "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
              }
            )
          ]
        },
        uid
      );
    }) })
  ] });
}
const PRIORITY_OPTIONS = [
  { value: TaskPriority.Low, label: "Low", color: "text-muted-foreground" },
  { value: TaskPriority.Medium, label: "Normal", color: "text-blue-500" },
  { value: TaskPriority.High, label: "High", color: "text-orange-500" },
  { value: TaskPriority.Critical, label: "Urgent", color: "text-destructive" }
];
const STATUS_OPTIONS = [
  {
    value: TaskStatus.Todo,
    label: "To Do",
    color: "text-muted-foreground",
    bg: "bg-muted text-muted-foreground border-border"
  },
  {
    value: TaskStatus.InProgress,
    label: "In Progress",
    color: "text-blue-500",
    bg: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400"
  },
  {
    value: TaskStatus.Done,
    label: "Done",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400"
  },
  {
    value: TaskStatus.Blocked,
    label: "Blocked",
    color: "text-destructive",
    bg: "bg-destructive/10 text-destructive border-destructive/30"
  }
];
const PRIORITY_BADGE = {
  [TaskPriority.Low]: "bg-muted text-muted-foreground border-border",
  [TaskPriority.Medium]: "bg-blue-500/10 text-blue-600 border-blue-200 dark:text-blue-400",
  [TaskPriority.High]: "bg-orange-500/10 text-orange-600 border-orange-200 dark:text-orange-400",
  [TaskPriority.Critical]: "bg-destructive/10 text-destructive border-destructive/30 font-semibold"
};
function formatDateValue(ts) {
  if (!ts) return "";
  return new Date(Number(ts) / 1e6).toISOString().split("T")[0];
}
function parseDateToTimestamp(dateStr) {
  if (!dateStr) return void 0;
  return BigInt(new Date(dateStr).getTime() * 1e6);
}
function formatTs(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = true
}) {
  const [open, setOpen] = reactExports.useState(defaultOpen);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((v) => !v),
        className: "flex w-full items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors py-1 min-h-[44px]",
        children: [
          open ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
          icon,
          title
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-1", children })
  ] });
}
const MOCK_TIME_ENTRIES = [];
function TaskDetailPage() {
  var _a;
  const { workspaceId, projectId, taskId } = useParams({
    from: "/app/$workspaceId/projects/$projectId/tasks/$taskId"
  });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();
  const isNew = taskId === "new";
  const { data: task, isLoading } = useQuery({
    queryKey: ["task", tenantId, workspaceId, taskId],
    queryFn: async () => {
      if (!actor || isNew) return null;
      const r = await actor.getTask(tenantId, workspaceId, taskId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled: !!actor && !isFetching && !isNew
  });
  const { data: sprints = [] } = useQuery({
    queryKey: ["sprints", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSprints(tenantId, workspaceId, projectId);
    },
    enabled: !!actor && !isFetching && !isNew
  });
  const taskSprint = sprints.find((s) => s.taskIds.includes(taskId));
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState(TaskStatus.Todo);
  const [priority, setPriority] = reactExports.useState(TaskPriority.Medium);
  const [dueDate, setDueDate] = reactExports.useState("");
  const [crossLinks, setCrossLinks] = reactExports.useState([]);
  const [isDirty, setIsDirty] = reactExports.useState(false);
  const [timeEntries, setTimeEntries] = reactExports.useState(
    isNew ? [] : MOCK_TIME_ENTRIES
  );
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
        const result2 = await actor.createTask(tenantId, workspaceId, input);
        if (result2.__kind__ === "err") throw new Error(result2.err);
        return result2.ok;
      }
      const result = await actor.updateTask(
        tenantId,
        workspaceId,
        taskId,
        input
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", tenantId, workspaceId, projectId]
      });
      queryClient.invalidateQueries({
        queryKey: ["task", tenantId, workspaceId, taskId]
      });
      ue.success(isNew ? "Task created" : "Task saved");
      setIsDirty(false);
      if (isNew) {
        navigate({
          to: "/app/$workspaceId/projects/$projectId/tasks/$taskId",
          params: { workspaceId, projectId, taskId: saved.id }
        });
      }
    },
    onError: (err) => ue.error(err.message || "Failed to save task")
  });
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.deleteTask(tenantId, workspaceId, taskId);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", tenantId, workspaceId, projectId]
      });
      ue.success("Task deleted");
      navigate({
        to: "/app/$workspaceId/projects/$projectId",
        params: { workspaceId, projectId }
      });
    },
    onError: (err) => ue.error(err.message || "Failed to delete task")
  });
  function handleStatusChange(v) {
    setStatus(v);
    setIsDirty(true);
    if (!isNew && task) {
      saveMutation.mutate({
        title,
        description,
        projectId,
        priority,
        dueDate: parseDateToTimestamp(dueDate),
        crossLinks
      });
    }
  }
  function handlePriorityChange(v) {
    setPriority(v);
    setIsDirty(true);
  }
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
  function handleTimerStart(entry) {
    const newEntry = {
      ...entry,
      id: `te-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setTimeEntries((prev) => [newEntry, ...prev]);
  }
  function handleTimerStop(entryId, durationSeconds) {
    setTimeEntries(
      (prev) => prev.map(
        (e) => e.id === entryId ? {
          ...e,
          status: "stopped",
          stoppedAt: Date.now(),
          durationSeconds,
          updatedAt: Date.now()
        } : e
      )
    );
  }
  if (isLoading && !isNew) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-4 pb-20 md:pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" })
      ] })
    ] });
  }
  const statusCfg = STATUS_OPTIONS.find((o) => o.value === status) ?? STATUS_OPTIONS[0];
  const priorityLabel = ((_a = PRIORITY_OPTIONS.find((o) => o.value === priority)) == null ? void 0 : _a.label) ?? priority;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full min-h-0 overflow-y-auto pb-20 md:pb-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 sm:px-6 md:px-8 pt-3 pb-3 border-b border-border/60 bg-card/80 sticky top-0 z-10 backdrop-blur-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          asChild: true,
          className: "h-9 w-9 min-h-[44px] min-w-[44px]",
          "aria-label": "Back to Project",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/app/$workspaceId/projects/$projectId",
              params: { workspaceId, projectId },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-3.5 w-3.5 text-orange-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-sm sm:text-base font-bold text-foreground truncate tracking-tight", children: isNew ? "New Task" : title || "Task Detail" }),
        !isNew && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-1.5 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `rounded-full px-2 py-0.5 text-xs font-medium border ${statusCfg.bg}`,
              children: statusCfg.label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `rounded-full px-2 py-0.5 text-xs font-medium border ${PRIORITY_BADGE[priority]}`,
              children: priorityLabel
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
        !isNew && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5 h-9 w-9 p-0 min-h-[44px] min-w-[44px]",
            onClick: () => deleteMutation.mutate(),
            disabled: deleteMutation.isPending,
            "data-ocid": "task-delete-btn",
            "aria-label": "Delete task",
            children: deleteMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: handleSave,
            disabled: saveMutation.isPending || !isNew && !isDirty,
            className: "gap-1.5 h-9 text-xs active-press min-h-[44px]",
            "data-ocid": "task-save-btn",
            children: [
              saveMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3 w-3" }),
              isNew ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Create Task" }) : "Save"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 sm:px-6 md:px-8 py-5 max-w-5xl mx-auto w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "task-title",
              placeholder: "Task title...",
              value: title,
              onChange: (e) => {
                setTitle(e.target.value);
                setIsDirty(true);
              },
              onBlur: () => {
                if (!isNew && isDirty && title.trim()) handleSave();
              },
              className: "text-base sm:text-lg font-display font-bold border-0 border-b border-border rounded-none px-0 h-auto py-2 focus-visible:ring-0 bg-transparent",
              "data-ocid": "task-title-input"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Description" }),
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
                onBlur: () => {
                  if (!isNew && isDirty) handleSave();
                },
                rows: 4,
                className: "resize-none text-sm",
                "data-ocid": "task-desc-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: status,
                  onValueChange: (v) => handleStatusChange(v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "h-10 sm:h-8 text-xs",
                        "data-ocid": "task-status-select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: STATUS_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o.value, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs ${o.color}`, children: o.label }) }, o.value)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Priority" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: priority,
                  onValueChange: (v) => handlePriorityChange(v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "h-10 sm:h-8 text-xs",
                        "data-ocid": "task-priority-select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: PRIORITY_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o.value, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs ${o.color}`, children: o.label }) }, o.value)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
                " Due Date"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "date",
                  value: dueDate,
                  onChange: (e) => {
                    setDueDate(e.target.value);
                    setIsDirty(true);
                  },
                  className: "h-10 sm:h-8 text-xs",
                  "data-ocid": "task-due-input"
                }
              )
            ] })
          ] }),
          task && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
              " Created",
              " ",
              formatTs(task.createdAt)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
              " Updated",
              " ",
              formatTs(task.updatedAt)
            ] })
          ] }),
          !isNew && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-card p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            CollapsibleSection,
            {
              title: "Subtasks",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: "h-4 w-4 text-primary" }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SubtaskList, { taskId, projectId })
            }
          ) }),
          !isNew && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-card p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            CollapsibleSection,
            {
              title: "Checklist",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "h-4 w-4 text-accent" }),
              defaultOpen: false,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChecklistSection, { taskId })
            }
          ) }),
          !isNew && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-card p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            CollapsibleSection,
            {
              title: "Discussion",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-4 w-4 text-secondary" }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(TaskComments, { taskId, projectId })
            }
          ) })
        ] }),
        !isNew && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-72 shrink-0 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm font-semibold text-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-primary" }),
              " Sprint"
            ] }),
            taskSprint ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/app/$workspaceId/projects/$projectId/sprints/$sprintId",
                params: { workspaceId, projectId, sprintId: taskSprint.id },
                className: "text-xs text-primary hover:underline",
                "data-ocid": "task-sprint-link",
                children: taskSprint.name
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Not in a sprint" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm font-semibold text-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4 text-muted-foreground" }),
              " Watchers"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TaskWatchers, { taskId })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm font-semibold text-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(GitMerge, { className: "h-4 w-4 text-muted-foreground" }),
              " ",
              "Relationships"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TaskRelationships, { taskId, projectId })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TimeTracker,
            {
              taskId,
              projectId,
              entries: timeEntries,
              onStart: handleTimerStart,
              onStop: handleTimerStop
            }
          ),
          crossLinks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm font-semibold text-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-4 w-4 text-orange-500" }),
              " Cross-Links"
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
        ] })
      ] }),
      isNew && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t border-border/60 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", asChild: true, "data-ocid": "task-cancel-btn", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/app/$workspaceId/projects/$projectId",
            params: { workspaceId, projectId },
            children: "Cancel"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: handleSave,
            disabled: saveMutation.isPending,
            "data-ocid": "task-create-btn",
            children: [
              saveMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-4 w-4" }),
              "Create Task"
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  TaskDetailPage as default
};
