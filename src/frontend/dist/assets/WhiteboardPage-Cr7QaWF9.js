import { m as useParams, f as useWorkspace, n as useQueryClient, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, X } from "./index-CzyNqtbv.js";
import { S as Skeleton } from "./skeleton-DMAdSNre.js";
import { u as useMutation } from "./useMutation-BsRk2Bod.js";
import { u as ue } from "./index-DaWH_LJ9.js";
import { u as useBackend } from "./index-CJtF1vtU.js";
import { WHITEBOARD_TEMPLATES } from "./WhiteboardsListPage-DsiU7Hs1.js";
import { A as ArrowLeft } from "./arrow-left-BnDr9sMT.js";
import { P as Pencil, E as Eraser, Z as ZoomIn, a as ZoomOut, U as Undo2, R as Redo2 } from "./zoom-out-DTTR_qto.js";
import { M as Minus } from "./minus-BdCnNZ2p.js";
import { S as Square } from "./square-BXpzUwqv.js";
import { C as Circle } from "./circle-BHDlcKVC.js";
import { T as Type } from "./type-B42vrWcp.js";
import { S as StickyNote } from "./sticky-note-BvVl7dtt.js";
import { I as Image } from "./image-BKqm_W24.js";
import { L as Layers } from "./layers-BQMy8vD8.js";
import { R as RotateCcw } from "./rotate-ccw-DkvEdE-R.js";
import { C as CircleCheck } from "./circle-check-Bz_M8Dh9.js";
import { S as Save } from "./save-R19D3P8T.js";
import "./badge-B6elWcoD.js";
import "./input-982h_Ebl.js";
import "./search-DHDFYO8C.js";
import "./trash-2-8AcD7pMp.js";
const TOOLS = [
  { id: "Pen", icon: Pencil, label: "Pen" },
  { id: "Line", icon: Minus, label: "Line" },
  { id: "Rectangle", icon: Square, label: "Rectangle" },
  { id: "Circle", icon: Circle, label: "Circle" },
  { id: "Text", icon: Type, label: "Text" },
  { id: "Sticky", icon: StickyNote, label: "Sticky Note" },
  { id: "Image", icon: Image, label: "Image" },
  { id: "Eraser", icon: Eraser, label: "Eraser" }
];
const PRESET_COLORS = [
  "#6d28d9",
  "#f97316",
  "#10b981",
  "#ef4444",
  "#3b82f6",
  "#f59e0b",
  "#ec4899",
  "#000000"
];
const STICKY_COLORS = [
  "#fef08a",
  "#86efac",
  "#93c5fd",
  "#fca5a5",
  "#d8b4fe",
  "#fb923c"
];
function uid() {
  return Math.random().toString(36).slice(2, 10);
}
function getCanvasPos(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}
function renderElement(ctx, el) {
  ctx.save();
  ctx.strokeStyle = el.color;
  ctx.fillStyle = el.color;
  ctx.lineWidth = el.strokeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  switch (el.tool) {
    case "Pen": {
      if (el.points.length < 4) break;
      ctx.beginPath();
      ctx.moveTo(el.points[0], el.points[1]);
      for (let i = 2; i < el.points.length; i += 2) {
        ctx.lineTo(el.points[i], el.points[i + 1]);
      }
      ctx.stroke();
      break;
    }
    case "Eraser": {
      if (el.points.length < 4) break;
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = el.strokeWidth * 4;
      ctx.beginPath();
      ctx.moveTo(el.points[0], el.points[1]);
      for (let i = 2; i < el.points.length; i += 2) {
        ctx.lineTo(el.points[i], el.points[i + 1]);
      }
      ctx.stroke();
      break;
    }
    case "Line": {
      ctx.beginPath();
      ctx.moveTo(el.x, el.y);
      ctx.lineTo(el.x + el.width, el.y + el.height);
      ctx.stroke();
      break;
    }
    case "Rectangle": {
      ctx.beginPath();
      ctx.strokeRect(el.x, el.y, el.width, el.height);
      break;
    }
    case "Circle": {
      const rx = Math.abs(el.width) / 2;
      const ry = Math.abs(el.height) / 2;
      const cx = el.x + el.width / 2;
      const cy = el.y + el.height / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case "Text": {
      ctx.font = `${Math.max(el.strokeWidth * 4, 16)}px Figtree, sans-serif`;
      ctx.fillText(el.text, el.x, el.y);
      break;
    }
  }
  ctx.restore();
}
function redrawAll(canvas, elements) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const el of elements) {
    if (el.tool !== "Sticky" && el.tool !== "Image") {
      renderElement(ctx, el);
    }
  }
}
function StickyOverlay({
  el,
  zoom,
  onEdit,
  onConvertToTask,
  canvasRef
}) {
  var _a;
  const [editing, setEditing] = reactExports.useState(false);
  const [text, setText] = reactExports.useState(el.stickyText ?? "");
  const [showMenu, setShowMenu] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    var _a2;
    if (editing) (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
  }, [editing]);
  const canvasRect = (_a = canvasRef.current) == null ? void 0 : _a.getBoundingClientRect();
  const offsetX = canvasRect ? 0 : 0;
  const offsetY = canvasRect ? 0 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        position: "absolute",
        left: el.x * zoom + offsetX,
        top: el.y * zoom + offsetY,
        width: (el.width || 160) * zoom,
        minHeight: (el.height || 80) * zoom,
        backgroundColor: el.stickyColor ?? "#fef08a",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        padding: "8px 10px",
        cursor: editing ? "text" : "pointer",
        zIndex: 10
      },
      onDoubleClick: () => setEditing(true),
      onContextMenu: (e) => {
        e.preventDefault();
        setShowMenu((v) => !v);
      },
      "data-ocid": `sticky-${el.id}`,
      children: [
        editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            ref: inputRef,
            value: text,
            onChange: (e) => setText(e.target.value),
            onBlur: () => {
              setEditing(false);
              onEdit(el.id, text);
            },
            onKeyDown: (e) => {
              if (e.key === "Escape") {
                setEditing(false);
                onEdit(el.id, text);
              }
            },
            style: {
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 13,
              fontFamily: "inherit",
              resize: "none",
              minHeight: 60
            },
            placeholder: "Type here…"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            style: {
              fontSize: 13,
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word"
            },
            children: [
              el.stickyText || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: 0.4 }, children: "Double-click to edit…" }),
              el.converted && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { marginLeft: 4, fontSize: 11, opacity: 0.7 }, children: "✓ task" })
            ]
          }
        ),
        showMenu && !editing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              position: "absolute",
              top: "100%",
              left: 0,
              background: "var(--color-card, #fff)",
              border: "1px solid var(--color-border, #e2e8f0)",
              borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              padding: "4px 0",
              zIndex: 20,
              minWidth: 160
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setShowMenu(false);
                    onConvertToTask(el);
                  },
                  style: {
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 14px",
                    fontSize: 13,
                    background: "none",
                    border: "none",
                    cursor: "pointer"
                  },
                  children: "🔧 Convert to Task"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowMenu(false),
                  style: {
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 14px",
                    fontSize: 13,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    opacity: 0.6
                  },
                  children: "Close Menu"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function ImageOverlay({ el, zoom }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        position: "absolute",
        left: el.x * zoom,
        top: el.y * zoom,
        width: (el.width || 200) * zoom,
        height: (el.height || 150) * zoom,
        zIndex: 5,
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.1)"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: el.imageUrl,
          alt: "",
          style: { width: "100%", height: "100%", objectFit: "cover" }
        }
      )
    }
  );
}
function ConvertToTaskModal({
  element,
  projects,
  onConfirm,
  onClose,
  isPending
}) {
  var _a;
  const [projectId, setProjectId] = reactExports.useState(((_a = projects[0]) == null ? void 0 : _a.id) ?? "");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4",
      "data-ocid": "convert-task-modal",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm rounded-2xl border border-border bg-card shadow-xl p-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "Convert to Task" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: onClose,
              "aria-label": "Close",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/30 px-3 py-2 text-sm text-foreground", children: [
          '"',
          element.stickyText || "Sticky Note",
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "convert-project",
              className: "text-sm font-medium text-foreground",
              children: "Target Project"
            }
          ),
          projects.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              id: "convert-project",
              value: projectId,
              onChange: (e) => setProjectId(e.target.value),
              className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
              "data-ocid": "convert-project-select",
              children: projects.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.name }, p.id))
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No projects found in this workspace." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => onConfirm(projectId),
              disabled: isPending || !projectId,
              "data-ocid": "confirm-convert-btn",
              children: isPending ? "Creating…" : "Create Task"
            }
          )
        ] })
      ] })
    }
  );
}
function TemplatesPanel({
  serverTemplates,
  onApply,
  onClose
}) {
  const allTemplates = [
    ...WHITEBOARD_TEMPLATES.map((t) => ({
      ...t,
      elements: t.elements
    })),
    ...serverTemplates
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm p-4",
      "data-ocid": "templates-panel",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-2xl rounded-2xl border border-border bg-card shadow-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-5 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "Whiteboard Templates" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Start with a pre-built layout and customize it" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: onClose,
              "aria-label": "Close",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 max-h-[60vh] overflow-auto", children: allTemplates.map((tpl) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "flex items-start gap-3 text-left rounded-xl border border-border p-4 hover:bg-muted/30 hover:border-primary/30 transition-all",
            onClick: () => {
              onApply(tpl);
              onClose();
            },
            "data-ocid": `template-${tpl.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-5 w-5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground text-sm", children: tpl.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: tpl.description ?? `${tpl.elements.length} elements` })
              ] })
            ]
          },
          tpl.id
        )) })
      ] })
    }
  );
}
function ImageUrlModal({
  onInsert,
  onClose
}) {
  const [url, setUrl] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm rounded-2xl border border-border bg-card shadow-xl p-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "Insert Image" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: onClose,
          "aria-label": "Close",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "label",
        {
          htmlFor: "img-url",
          className: "text-sm font-medium text-foreground",
          children: "Image URL"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id: "img-url",
          type: "url",
          value: url,
          onChange: (e) => setUrl(e.target.value),
          placeholder: "https://example.com/image.jpg",
          className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
          "data-ocid": "image-url-input"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => {
            if (url.trim()) {
              onInsert(url.trim());
              onClose();
            }
          },
          "data-ocid": "insert-image-btn",
          children: "Insert"
        }
      )
    ] })
  ] }) });
}
function WhiteboardPage() {
  const { workspaceId, projectId, whiteboardId } = useParams({
    from: "/app/$workspaceId/projects/$projectId/whiteboard/$whiteboardId"
  });
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();
  const wbActor = actor;
  const canvasRef = reactExports.useRef(null);
  const containerRef = reactExports.useRef(null);
  const isDrawing = reactExports.useRef(false);
  const currentEl = reactExports.useRef(null);
  const [tool, setTool] = reactExports.useState("Pen");
  const [color, setColor] = reactExports.useState("#6d28d9");
  const [strokeWidth, setStrokeWidth] = reactExports.useState(3);
  const [elements, setElements] = reactExports.useState([]);
  const [undoStack, setUndoStack] = reactExports.useState([]);
  const [redoStack, setRedoStack] = reactExports.useState([]);
  const [savedIndicator, setSavedIndicator] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState("Untitled Whiteboard");
  const [editingTitle, setEditingTitle] = reactExports.useState(false);
  const [zoom, setZoom] = reactExports.useState(1);
  const titleInputRef = reactExports.useRef(null);
  const [textInput, setTextInput] = reactExports.useState(null);
  const textInputRef = reactExports.useRef(null);
  const [stickyColor, setStickyColor] = reactExports.useState(STICKY_COLORS[0]);
  const [showTemplates, setShowTemplates] = reactExports.useState(false);
  const [showImageModal, setShowImageModal] = reactExports.useState(false);
  const [convertTarget, setConvertTarget] = reactExports.useState(
    null
  );
  const [projects, setProjects] = reactExports.useState([]);
  const elementsRef = reactExports.useRef(elements);
  elementsRef.current = elements;
  const saveMutateRef = reactExports.useRef(() => {
  });
  reactExports.useEffect(() => {
    var _a;
    if (editingTitle) (_a = titleInputRef.current) == null ? void 0 : _a.focus();
  }, [editingTitle]);
  reactExports.useEffect(() => {
    var _a;
    if (textInput !== null) (_a = textInputRef.current) == null ? void 0 : _a.focus();
  }, [textInput]);
  reactExports.useEffect(() => {
    if (!wbActor || isFetching) return;
    wbActor.listProjects(tenantId, workspaceId).then((ps) => {
      setProjects(
        ps.map((p) => ({
          id: p.id,
          name: p.name ?? p.title ?? p.id
        }))
      );
    }).catch(() => {
    });
  }, [wbActor, tenantId, workspaceId, isFetching]);
  const { data: whiteboard, isLoading } = useQuery({
    queryKey: ["whiteboard", tenantId, workspaceId, whiteboardId],
    queryFn: async () => {
      if (!wbActor) return null;
      return wbActor.getWhiteboard(tenantId, workspaceId, whiteboardId);
    },
    enabled: !!actor && !isFetching && !!whiteboardId,
    refetchInterval: 5e3
  });
  const { data: serverTemplates = [] } = useQuery({
    queryKey: ["wb-templates", tenantId, workspaceId],
    queryFn: async () => {
      if (!wbActor) return [];
      try {
        return await wbActor.listWhiteboardTemplates(tenantId, workspaceId);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching
  });
  const saveMutation = useMutation({
    mutationFn: async (els) => {
      if (!wbActor) return;
      await wbActor.updateWhiteboardElements(
        tenantId,
        workspaceId,
        whiteboardId,
        els
      );
    },
    onSuccess: () => {
      setSavedIndicator(true);
      setTimeout(() => setSavedIndicator(false), 2e3);
      queryClient.invalidateQueries({
        queryKey: ["whiteboard", tenantId, workspaceId, whiteboardId]
      });
      queryClient.invalidateQueries({
        queryKey: ["whiteboards", tenantId, workspaceId, projectId]
      });
    }
  });
  saveMutateRef.current = saveMutation.mutate;
  const convertMutation = useMutation({
    mutationFn: async ({
      element,
      projectId: pid
    }) => {
      if (!wbActor) return;
      const taskTitle = element.stickyText || "Task from whiteboard";
      await wbActor.convertWhiteboardElementToTask(
        tenantId,
        workspaceId,
        whiteboardId,
        element.id,
        pid,
        taskTitle
      );
    },
    onSuccess: (_, vars) => {
      setElements(
        (prev) => prev.map(
          (el) => el.id === vars.element.id ? { ...el, converted: true } : el
        )
      );
      setConvertTarget(null);
      ue.success("Task created!");
      saveMutateRef.current(elementsRef.current);
    },
    onError: () => {
      ue.error("Failed to create task");
    }
  });
  const wbId = whiteboard == null ? void 0 : whiteboard.id;
  const wbTitle = whiteboard == null ? void 0 : whiteboard.title;
  const wbElements = whiteboard == null ? void 0 : whiteboard.elements;
  reactExports.useEffect(() => {
    if (wbId) {
      setTitle(wbTitle ?? "Untitled Whiteboard");
      setElements(wbElements ?? []);
    }
  }, [wbId, wbTitle, wbElements]);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    redrawAll(canvas, elements);
  }, [elements]);
  reactExports.useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      redrawAll(canvas, elementsRef.current);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);
  reactExports.useEffect(() => {
    const id = setInterval(() => {
      if (elementsRef.current.length > 0)
        saveMutateRef.current(elementsRef.current);
    }, 3e4);
    return () => clearInterval(id);
  }, []);
  const pushUndo = reactExports.useCallback((prev) => {
    setUndoStack((s) => [...s.slice(-9), prev]);
    setRedoStack([]);
  }, []);
  const startEl = reactExports.useCallback(
    (pos) => ({
      id: uid(),
      tool,
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      color: tool === "Eraser" ? "#000000" : color,
      strokeWidth: tool === "Eraser" ? strokeWidth * 4 : strokeWidth,
      text: "",
      points: [pos.x, pos.y]
    }),
    [tool, color, strokeWidth]
  );
  const handleMouseDown = reactExports.useCallback(
    (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const pos = getCanvasPos(canvas, e);
      if (tool === "Text") {
        setTextInput({ x: pos.x, y: pos.y, value: "" });
        return;
      }
      if (tool === "Sticky") {
        pushUndo(elements);
        const sticky = {
          id: uid(),
          tool: "Sticky",
          x: pos.x,
          y: pos.y,
          width: 160,
          height: 80,
          color,
          strokeWidth: 0,
          text: "",
          points: [],
          stickyText: "",
          stickyColor
        };
        setElements((prev) => [...prev, sticky]);
        return;
      }
      if (tool === "Image") {
        setShowImageModal(true);
        return;
      }
      pushUndo(elements);
      currentEl.current = startEl(pos);
      isDrawing.current = true;
    },
    [tool, elements, pushUndo, startEl, color, stickyColor]
  );
  const handleMouseMove = reactExports.useCallback(
    (e) => {
      if (!isDrawing.current || !currentEl.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const pos = getCanvasPos(canvas, e);
      const el = currentEl.current;
      const updated = {
        ...el,
        width: pos.x - el.x,
        height: pos.y - el.y,
        points: el.tool === "Pen" || el.tool === "Eraser" ? [...el.points, pos.x, pos.y] : el.points
      };
      currentEl.current = updated;
      redrawAll(canvas, [...elements, updated]);
    },
    [elements]
  );
  const handleMouseUp = reactExports.useCallback(() => {
    if (!isDrawing.current || !currentEl.current) return;
    isDrawing.current = false;
    setElements((prev) => [...prev, currentEl.current]);
    currentEl.current = null;
  }, []);
  const getTouchPos = reactExports.useCallback(
    (canvas, t) => getCanvasPos(canvas, { clientX: t.clientX, clientY: t.clientY }),
    []
  );
  const handleTouchStart = reactExports.useCallback(
    (e) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const pos = getTouchPos(canvas, e.touches[0]);
      if (tool === "Text") {
        setTextInput({ x: pos.x, y: pos.y, value: "" });
        return;
      }
      pushUndo(elements);
      currentEl.current = startEl(pos);
      isDrawing.current = true;
    },
    [tool, elements, pushUndo, startEl, getTouchPos]
  );
  const handleTouchMove = reactExports.useCallback(
    (e) => {
      e.preventDefault();
      if (!isDrawing.current || !currentEl.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const pos = getTouchPos(canvas, e.touches[0]);
      const el = currentEl.current;
      const updated = {
        ...el,
        width: pos.x - el.x,
        height: pos.y - el.y,
        points: el.tool === "Pen" || el.tool === "Eraser" ? [...el.points, pos.x, pos.y] : el.points
      };
      currentEl.current = updated;
      redrawAll(canvas, [...elements, updated]);
    },
    [elements, getTouchPos]
  );
  const handleTouchEnd = reactExports.useCallback(() => handleMouseUp(), [handleMouseUp]);
  const textInputStateRef = reactExports.useRef(textInput);
  textInputStateRef.current = textInput;
  const commitText = reactExports.useCallback(() => {
    const ti = textInputStateRef.current;
    if (!ti || !ti.value.trim()) {
      setTextInput(null);
      return;
    }
    pushUndo(elements);
    setElements((prev) => [
      ...prev,
      {
        id: uid(),
        tool: "Text",
        x: ti.x,
        y: ti.y,
        width: 0,
        height: 0,
        color,
        strokeWidth,
        text: ti.value,
        points: []
      }
    ]);
    setTextInput(null);
  }, [elements, color, strokeWidth, pushUndo]);
  const handleUndo = () => {
    if (!undoStack.length) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack((r) => [...r, elements]);
    setUndoStack((s) => s.slice(0, -1));
    setElements(prev);
  };
  const handleRedo = () => {
    if (!redoStack.length) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((s) => [...s, elements]);
    setRedoStack((r) => r.slice(0, -1));
    setElements(next);
  };
  const handleClear = () => {
    pushUndo(elements);
    setElements([]);
  };
  const handleSave = () => saveMutation.mutate(elements);
  const handleStickyEdit = (id, text) => {
    setElements(
      (prev) => prev.map((el) => el.id === id ? { ...el, stickyText: text } : el)
    );
  };
  const handleInsertImage = (url) => {
    const canvas = canvasRef.current;
    const centerX = canvas ? canvas.width / 2 / zoom - 100 : 200;
    const centerY = canvas ? canvas.height / 2 / zoom - 75 : 150;
    pushUndo(elements);
    setElements((prev) => [
      ...prev,
      {
        id: uid(),
        tool: "Image",
        x: centerX,
        y: centerY,
        width: 200,
        height: 150,
        color,
        strokeWidth: 0,
        text: "",
        points: [],
        imageUrl: url
      }
    ]);
  };
  const handleApplyTemplate = (tpl) => {
    pushUndo(elements);
    const newEls = tpl.elements.map((el) => ({
      ...el,
      id: uid()
    }));
    setElements((prev) => [...prev, ...newEls]);
    ue.success(`Template "${tpl.name}" applied`);
  };
  const cursor = tool === "Eraser" ? "cell" : tool === "Text" ? "text" : tool === "Sticky" ? "copy" : "crosshair";
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col gap-4 p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-64 rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "flex-1 rounded-2xl" })
    ] });
  }
  const stickyElements = elements.filter((el) => el.tool === "Sticky");
  const imageElements = elements.filter((el) => el.tool === "Image");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex h-full flex-col overflow-hidden bg-background",
      "data-ocid": "whiteboard-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex h-13 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-3 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 shrink-0",
                asChild: true,
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
            editingTitle ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: titleInputRef,
                value: title,
                onChange: (e) => setTitle(e.target.value),
                onBlur: () => setEditingTitle(false),
                onKeyDown: (e) => {
                  if (e.key === "Enter") setEditingTitle(false);
                },
                className: "min-w-0 rounded border border-input bg-background px-2 py-0.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                "data-ocid": "whiteboard-title-input"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setEditingTitle(true),
                className: "truncate text-sm font-semibold text-foreground hover:text-primary transition-colors focus-visible:underline focus-visible:outline-none",
                "aria-label": "Edit whiteboard title",
                "data-ocid": "whiteboard-title",
                children: title
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-0.5 rounded-xl border border-border bg-muted/40 p-1 overflow-x-auto",
              role: "toolbar",
              "aria-label": "Drawing tools",
              children: [
                TOOLS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setTextInput(null);
                      setTool(t.id);
                    },
                    "aria-label": t.label,
                    "aria-pressed": tool === t.id,
                    "data-ocid": `tool-${t.id.toLowerCase()}`,
                    className: `flex h-7 w-7 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary ${tool === t.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "h-3.5 w-3.5" })
                  },
                  t.id
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-1 h-5 w-px bg-border shrink-0" }),
                tool === "Sticky" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5", children: STICKY_COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setStickyColor(c),
                    "aria-label": "Sticky note color",
                    className: `h-5 w-5 rounded-sm border-2 transition-transform hover:scale-110 ${stickyColor === c ? "border-foreground scale-110" : "border-transparent"}`,
                    style: { background: c }
                  },
                  c
                )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5", children: [
                  PRESET_COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setColor(c),
                      "aria-label": `Color ${c}`,
                      className: `h-5 w-5 rounded-full border-2 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary ${color === c ? "border-foreground scale-110" : "border-transparent"}`,
                      style: { background: c }
                    },
                    c
                  )),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "label",
                    {
                      className: "flex items-center ml-0.5 relative cursor-pointer",
                      "aria-label": "Custom color",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "color",
                            value: color,
                            onChange: (e) => setColor(e.target.value),
                            className: "h-5 w-5 cursor-pointer rounded-full border-0 p-0 opacity-0 absolute inset-0",
                            "data-ocid": "color-picker"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "h-5 w-5 rounded-full border-2 border-dashed border-muted-foreground",
                            style: { background: color },
                            "aria-hidden": true
                          }
                        )
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-1 h-5 w-px bg-border shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground w-3", children: strokeWidth }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "range",
                      min: 1,
                      max: 20,
                      value: strokeWidth,
                      onChange: (e) => setStrokeWidth(Number(e.target.value)),
                      className: "w-20 accent-primary",
                      "aria-label": "Stroke width",
                      "data-ocid": "stroke-width"
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 text-muted-foreground",
                onClick: () => setZoom((z) => Math.min(z + 0.25, 3)),
                "aria-label": "Zoom in",
                "data-ocid": "zoom-in-btn",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground w-10 text-center", children: [
              Math.round(zoom * 100),
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 text-muted-foreground",
                onClick: () => setZoom((z) => Math.max(z - 0.25, 0.25)),
                "aria-label": "Zoom out",
                "data-ocid": "zoom-out-btn",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomOut, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-1 h-5 w-px bg-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "h-8 text-xs text-muted-foreground",
                onClick: () => setShowTemplates(true),
                "data-ocid": "templates-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3.5 w-3.5 mr-1" }),
                  " Templates"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-1 h-5 w-px bg-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 text-muted-foreground",
                onClick: handleUndo,
                disabled: !undoStack.length,
                "aria-label": "Undo",
                "data-ocid": "undo-btn",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 text-muted-foreground",
                onClick: handleRedo,
                disabled: !redoStack.length,
                "aria-label": "Redo",
                "data-ocid": "redo-btn",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Redo2, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 text-muted-foreground",
                onClick: handleClear,
                "aria-label": "Clear all",
                "data-ocid": "clear-btn",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-1 h-5 w-px bg-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "h-8 gap-1.5 text-xs",
                onClick: handleSave,
                disabled: saveMutation.isPending,
                "data-ocid": "save-btn",
                children: [
                  savedIndicator ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3.5 w-3.5" }),
                  savedIndicator ? "Saved" : "Save"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref: containerRef,
            className: "relative flex-1 overflow-hidden",
            style: {
              backgroundImage: "radial-gradient(circle, oklch(var(--muted-foreground) / 0.15) 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            },
            "data-ocid": "whiteboard-canvas-container",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    position: "absolute",
                    inset: 0,
                    transformOrigin: "top left",
                    transform: `scale(${zoom})`
                  },
                  children: [
                    stickyElements.map((el) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      StickyOverlay,
                      {
                        el,
                        zoom: 1,
                        onEdit: handleStickyEdit,
                        onConvertToTask: (targetEl) => setConvertTarget(targetEl),
                        canvasRef
                      },
                      el.id
                    )),
                    imageElements.map((el) => /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOverlay, { el, zoom: 1 }, el.id))
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "canvas",
                {
                  ref: canvasRef,
                  style: {
                    cursor,
                    touchAction: "none",
                    display: "block",
                    transform: `scale(${zoom})`,
                    transformOrigin: "top left"
                  },
                  onMouseDown: handleMouseDown,
                  onMouseMove: handleMouseMove,
                  onMouseUp: handleMouseUp,
                  onMouseLeave: handleMouseUp,
                  onTouchStart: handleTouchStart,
                  onTouchMove: handleTouchMove,
                  onTouchEnd: handleTouchEnd,
                  "data-ocid": "whiteboard-canvas"
                }
              ),
              textInput !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: textInputRef,
                  value: textInput.value,
                  onChange: (e) => setTextInput(
                    (prev) => prev ? { ...prev, value: e.target.value } : null
                  ),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") commitText();
                    if (e.key === "Escape") setTextInput(null);
                  },
                  onBlur: commitText,
                  style: {
                    position: "absolute",
                    left: textInput.x * zoom,
                    top: (textInput.y - 20) * zoom,
                    fontSize: `${Math.max(strokeWidth * 4, 16)}px`,
                    color,
                    background: "transparent",
                    border: "1px dashed rgba(0,0,0,0.3)",
                    outline: "none",
                    minWidth: 120,
                    fontFamily: "Figtree, sans-serif",
                    zIndex: 15
                  },
                  placeholder: "Type here…",
                  "data-ocid": "text-tool-input"
                }
              ),
              elements.length === 0 && !isDrawing.current && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-12 w-12 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-medium", children: "Select a tool and start drawing" })
              ] })
            ]
          }
        ),
        saveMutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-card border border-border px-3 py-2 text-xs text-muted-foreground shadow-sm z-30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" }),
          "Saving…"
        ] }),
        showTemplates && /* @__PURE__ */ jsxRuntimeExports.jsx(
          TemplatesPanel,
          {
            serverTemplates,
            onApply: handleApplyTemplate,
            onClose: () => setShowTemplates(false)
          }
        ),
        showImageModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ImageUrlModal,
          {
            onInsert: handleInsertImage,
            onClose: () => setShowImageModal(false)
          }
        ),
        convertTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ConvertToTaskModal,
          {
            element: convertTarget,
            projects,
            onConfirm: (pid) => convertMutation.mutate({ element: convertTarget, projectId: pid }),
            onClose: () => setConvertTarget(null),
            isPending: convertMutation.isPending
          }
        )
      ]
    }
  );
}
export {
  WhiteboardPage as default
};
