import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Circle as CircleIcon,
  Eraser,
  Image as ImageIcon,
  Layers,
  Minus,
  Pencil,
  Redo2,
  RotateCcw,
  Save,
  Square,
  StickyNote,
  Type,
  Undo2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import { WHITEBOARD_TEMPLATES } from "./WhiteboardsListPage";

// ─── Types ────────────────────────────────────────────────────────────────────

type DrawingTool =
  | "Pen"
  | "Line"
  | "Rectangle"
  | "Circle"
  | "Text"
  | "Eraser"
  | "Sticky"
  | "Image";

interface WhiteboardElement {
  id: string;
  tool: DrawingTool;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeWidth: number;
  text: string;
  points: number[];
  stickyText?: string;
  stickyColor?: string;
  converted?: boolean;
  imageUrl?: string;
}

interface Whiteboard {
  id: string;
  tenantId: string;
  projectId: string;
  title: string;
  elements: WhiteboardElement[];
  createdBy: string;
  createdAt: bigint;
  updatedAt: bigint;
}

interface WbTemplate {
  id: string;
  name: string;
  description: string;
  elements: WhiteboardElement[];
}

type WbActor = {
  getWhiteboard: (
    tenantId: string,
    workspaceId: string,
    id: string,
  ) => Promise<Whiteboard | null>;
  updateWhiteboardElements: (
    tenantId: string,
    workspaceId: string,
    id: string,
    els: WhiteboardElement[],
  ) => Promise<Whiteboard | null>;
  listWhiteboardTemplates: (
    tenantId: string,
    workspaceId: string,
  ) => Promise<WbTemplate[]>;
  convertWhiteboardElementToTask: (
    tenantId: string,
    workspaceId: string,
    whiteboardId: string,
    elementId: string,
    projectId: string,
    taskTitle: string,
  ) => Promise<{ taskId: string } | null>;
  listProjects: (
    tenantId: string,
    workspaceId: string,
  ) => Promise<{ id: string; name?: string; title?: string }[]>;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const TOOLS: { id: DrawingTool; icon: React.ElementType; label: string }[] = [
  { id: "Pen", icon: Pencil, label: "Pen" },
  { id: "Line", icon: Minus, label: "Line" },
  { id: "Rectangle", icon: Square, label: "Rectangle" },
  { id: "Circle", icon: CircleIcon, label: "Circle" },
  { id: "Text", icon: Type, label: "Text" },
  { id: "Sticky", icon: StickyNote, label: "Sticky Note" },
  { id: "Image", icon: ImageIcon, label: "Image" },
  { id: "Eraser", icon: Eraser, label: "Eraser" },
];

const PRESET_COLORS = [
  "#6d28d9",
  "#f97316",
  "#10b981",
  "#ef4444",
  "#3b82f6",
  "#f59e0b",
  "#ec4899",
  "#000000",
];

const STICKY_COLORS = [
  "#fef08a",
  "#86efac",
  "#93c5fd",
  "#fca5a5",
  "#d8b4fe",
  "#fb923c",
];

// ─── Canvas Helpers ───────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function getCanvasPos(
  canvas: HTMLCanvasElement,
  e: { clientX: number; clientY: number },
) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function renderElement(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
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
    default:
      break;
  }
  ctx.restore();
}

function redrawAll(canvas: HTMLCanvasElement, elements: WhiteboardElement[]) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const el of elements) {
    if (el.tool !== "Sticky" && el.tool !== "Image") {
      renderElement(ctx, el);
    }
  }
}

// ─── Sticky Overlay ───────────────────────────────────────────────────────────

interface StickyOverlayProps {
  el: WhiteboardElement;
  zoom: number;
  onEdit: (id: string, text: string) => void;
  onConvertToTask: (el: WhiteboardElement) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

function StickyOverlay({
  el,
  zoom,
  onEdit,
  onConvertToTask,
}: StickyOverlayProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(el.stickyText ?? "");
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  return (
    <div
      style={{
        position: "absolute",
        left: el.x * zoom,
        top: el.y * zoom,
        width: (el.width || 160) * zoom,
        minHeight: (el.height || 80) * zoom,
        backgroundColor: el.stickyColor ?? "#fef08a",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        padding: "8px 10px",
        cursor: editing ? "text" : "pointer",
        zIndex: 10,
      }}
      onDoubleClick={() => setEditing(true)}
      onContextMenu={(e) => {
        e.preventDefault();
        setShowMenu((v) => !v);
      }}
      data-ocid={`sticky-${el.id}`}
    >
      {editing ? (
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => {
            setEditing(false);
            onEdit(el.id, text);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setEditing(false);
              onEdit(el.id, text);
            }
          }}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 13,
            fontFamily: "inherit",
            resize: "none",
            minHeight: 60,
          }}
          placeholder="Type here…"
        />
      ) : (
        <p
          style={{
            fontSize: 13,
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {el.stickyText || (
            <span style={{ opacity: 0.4 }}>Double-click to edit…</span>
          )}
          {el.converted && (
            <span style={{ marginLeft: 4, fontSize: 11, opacity: 0.7 }}>
              ✓ task
            </span>
          )}
        </p>
      )}

      {showMenu && !editing && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: "var(--color-card, #fff)",
            border: "1px solid var(--color-border, #e2e8f0)",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            padding: "4px 0",
            zIndex: 20,
            minWidth: 160,
          }}
        >
          <button
            type="button"
            onClick={() => {
              setShowMenu(false);
              onConvertToTask(el);
            }}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "8px 14px",
              fontSize: 13,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            🔧 Convert to Task
          </button>
          <button
            type="button"
            onClick={() => setShowMenu(false)}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "8px 14px",
              fontSize: 13,
              background: "none",
              border: "none",
              cursor: "pointer",
              opacity: 0.6,
            }}
          >
            Close Menu
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Image Overlay ────────────────────────────────────────────────────────────

function ImageOverlay({ el, zoom }: { el: WhiteboardElement; zoom: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: el.x * zoom,
        top: el.y * zoom,
        width: (el.width || 200) * zoom,
        height: (el.height || 150) * zoom,
        zIndex: 5,
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <img
        src={el.imageUrl}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}

// ─── Convert to Task Modal ────────────────────────────────────────────────────

interface ConvertModalProps {
  element: WhiteboardElement;
  projects: { id: string; name: string }[];
  onConfirm: (projectId: string) => void;
  onClose: () => void;
  isPending: boolean;
}

function ConvertToTaskModal({
  element,
  projects,
  onConfirm,
  onClose,
  isPending,
}: ConvertModalProps) {
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card shadow-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-foreground">
            Convert to Task
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="rounded-xl bg-muted/30 px-3 py-2 text-sm text-foreground">
          "{element.stickyText || "Sticky Note"}"
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="convert-project"
            className="text-sm font-medium text-foreground"
          >
            Target Project
          </label>
          {projects.length > 0 ? (
            <select
              id="convert-project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-muted-foreground">No projects found.</p>
          )}
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(projectId)}
            disabled={isPending || !projectId}
          >
            {isPending ? "Creating…" : "Create Task"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Templates Panel ──────────────────────────────────────────────────────────

interface TemplatesPanelProps {
  onApply: (tpl: {
    id: string;
    name: string;
    elements: WhiteboardElement[];
  }) => void;
  onClose: () => void;
}

function TemplatesPanel({ onApply, onClose }: TemplatesPanelProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      data-ocid="templates-panel"
    >
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="font-display font-semibold text-foreground">
              Whiteboard Templates
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Start with a pre-built layout
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 max-h-[60vh] overflow-auto">
          {WHITEBOARD_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              className="flex items-start gap-3 text-left rounded-xl border border-border p-4 hover:bg-muted/30 hover:border-primary/30 transition-all"
              onClick={() => {
                onApply(
                  tpl as unknown as {
                    id: string;
                    name: string;
                    elements: WhiteboardElement[];
                  },
                );
                onClose();
              }}
              data-ocid={`template-${tpl.id}`}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: `${tpl.color}20` }}
              >
                <tpl.icon className="h-5 w-5" style={{ color: tpl.color }} />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm">
                  {tpl.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {tpl.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Image URL Modal ──────────────────────────────────────────────────────────

function ImageUrlModal({
  onInsert,
  onClose,
}: { onInsert: (url: string) => void; onClose: () => void }) {
  const [url, setUrl] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card shadow-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-foreground">
            Insert Image
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="img-url"
            className="text-sm font-medium text-foreground"
          >
            Image URL
          </label>
          <input
            id="img-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (url.trim()) {
                onInsert(url.trim());
                onClose();
              }
            }}
          >
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile tool drawer ───────────────────────────────────────────────────────

interface MobileToolbarProps {
  tool: DrawingTool;
  color: string;
  strokeWidth: number;
  stickyColor: string;
  onToolChange: (t: DrawingTool) => void;
  onColorChange: (c: string) => void;
  onStrokeChange: (w: number) => void;
  onStickyColorChange: (c: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onTemplates: () => void;
  zoom: number;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  savedIndicator: boolean;
}

function MobileToolbar({
  tool,
  color,
  strokeWidth,
  stickyColor,
  onToolChange,
  onColorChange,
  onStrokeChange,
  onStickyColorChange,
  onUndo,
  onRedo,
  onClear,
  onSave,
  onZoomIn,
  onZoomOut,
  onTemplates,
  zoom,
  canUndo,
  canRedo,
  isSaving,
  savedIndicator,
}: MobileToolbarProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto px-2 py-1.5 border-b border-border bg-card shrink-0 scrollbar-none">
      {/* Tool buttons */}
      {TOOLS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onToolChange(t.id)}
          aria-label={t.label}
          aria-pressed={tool === t.id}
          data-ocid={`mob-tool-${t.id.toLowerCase()}`}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
            tool === t.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <t.icon className="h-3.5 w-3.5" />
        </button>
      ))}

      <div className="h-5 w-px bg-border shrink-0 mx-0.5" />

      {/* Colors */}
      {tool === "Sticky"
        ? STICKY_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onStickyColorChange(c)}
              className={`h-6 w-6 shrink-0 rounded-sm border-2 transition-transform ${stickyColor === c ? "border-foreground scale-110" : "border-transparent"}`}
              style={{ background: c }}
              aria-label="Sticky color"
            />
          ))
        : PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onColorChange(c)}
              className={`h-5 w-5 shrink-0 rounded-full border-2 transition-transform ${color === c ? "border-foreground scale-110" : "border-transparent"}`}
              style={{ background: c }}
              aria-label={`Color ${c}`}
            />
          ))}

      <div className="h-5 w-px bg-border shrink-0 mx-0.5" />

      {/* Stroke width */}
      <input
        type="range"
        min={1}
        max={20}
        value={strokeWidth}
        onChange={(e) => onStrokeChange(Number(e.target.value))}
        className="w-16 accent-primary shrink-0"
        aria-label="Stroke width"
      />

      <div className="h-5 w-px bg-border shrink-0 mx-0.5" />

      {/* Actions */}
      <button
        type="button"
        onClick={onTemplates}
        className="flex h-8 items-center gap-1 px-2 shrink-0 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors"
      >
        <Layers className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors"
        aria-label="Undo"
      >
        <Undo2 className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={onRedo}
        disabled={!canRedo}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors"
        aria-label="Redo"
      >
        <Redo2 className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={onZoomOut}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
        aria-label="Zoom out"
      >
        <ZoomOut className="h-3.5 w-3.5" />
      </button>
      <span className="text-xs text-muted-foreground w-8 text-center shrink-0">
        {Math.round(zoom * 100)}%
      </span>
      <button
        type="button"
        onClick={onZoomIn}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
        aria-label="Zoom in"
      >
        <ZoomIn className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={onClear}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
        aria-label="Clear all"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="flex h-8 items-center gap-1 px-2 shrink-0 rounded-lg border border-border text-xs text-foreground hover:bg-muted disabled:opacity-60 transition-colors"
        aria-label="Save"
      >
        {savedIndicator ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Save className="h-3.5 w-3.5" />
        )}
        <span className="hidden sm:inline">
          {savedIndicator ? "Saved" : "Save"}
        </span>
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WhiteboardPage() {
  const { workspaceId, whiteboardId } = useParams({
    from: "/app/$workspaceId/whiteboards/$whiteboardId",
  });
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();
  const wbActor = actor as unknown as WbActor | null;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const currentEl = useRef<WhiteboardElement | null>(null);

  const [tool, setTool] = useState<DrawingTool>("Pen");
  const [color, setColor] = useState("#6d28d9");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [elements, setElements] = useState<WhiteboardElement[]>([]);
  const [undoStack, setUndoStack] = useState<WhiteboardElement[][]>([]);
  const [redoStack, setRedoStack] = useState<WhiteboardElement[][]>([]);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [title, setTitle] = useState("Untitled Whiteboard");
  const [editingTitle, setEditingTitle] = useState(false);
  const [zoom, setZoom] = useState(1);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [textInput, setTextInput] = useState<{
    x: number;
    y: number;
    value: string;
  } | null>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const [stickyColor, setStickyColor] = useState(STICKY_COLORS[0]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [convertTarget, setConvertTarget] = useState<WhiteboardElement | null>(
    null,
  );
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);

  // Touch gesture state for pinch-zoom and two-finger pan
  const lastTouchDist = useRef<number | null>(null);
  const lastTouchMid = useRef<{ x: number; y: number } | null>(null);
  const panOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [panOffsetState, setPanOffsetState] = useState({ x: 0, y: 0 });

  const elementsRef = useRef<WhiteboardElement[]>(elements);
  elementsRef.current = elements;
  const saveMutateRef = useRef<(els: WhiteboardElement[]) => void>(() => {});

  useEffect(() => {
    if (editingTitle) titleInputRef.current?.focus();
  }, [editingTitle]);
  useEffect(() => {
    if (textInput !== null) textInputRef.current?.focus();
  }, [textInput]);

  useEffect(() => {
    if (!wbActor || isFetching) return;
    wbActor
      .listProjects(tenantId, workspaceId)
      .then((ps) => {
        setProjects(
          ps.map((p) => ({
            id: p.id,
            name: (p.name ?? p.title ?? p.id) as string,
          })),
        );
      })
      .catch(() => {});
  }, [wbActor, tenantId, workspaceId, isFetching]);

  const { data: whiteboard, isLoading } = useQuery<Whiteboard | null>({
    queryKey: ["whiteboard", tenantId, workspaceId, whiteboardId],
    queryFn: async (): Promise<Whiteboard | null> => {
      if (!wbActor) return null;
      return wbActor.getWhiteboard(tenantId, workspaceId, whiteboardId);
    },
    enabled: !!actor && !isFetching && !!whiteboardId,
    refetchInterval: 5000,
  });

  const saveMutation = useMutation({
    mutationFn: async (els: WhiteboardElement[]) => {
      if (!wbActor) return;
      await wbActor.updateWhiteboardElements(
        tenantId,
        workspaceId,
        whiteboardId,
        els,
      );
    },
    onSuccess: () => {
      setSavedIndicator(true);
      setTimeout(() => setSavedIndicator(false), 2000);
      queryClient.invalidateQueries({
        queryKey: ["whiteboard", tenantId, workspaceId, whiteboardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["whiteboards-standalone", tenantId, workspaceId],
      });
    },
  });

  saveMutateRef.current = saveMutation.mutate;

  const convertMutation = useMutation({
    mutationFn: async ({
      element,
      projectId: pid,
    }: { element: WhiteboardElement; projectId: string }) => {
      if (!wbActor) return;
      await wbActor.convertWhiteboardElementToTask(
        tenantId,
        workspaceId,
        whiteboardId,
        element.id,
        pid,
        element.stickyText || "Task from whiteboard",
      );
    },
    onSuccess: (_, vars) => {
      setElements((prev) =>
        prev.map((el) =>
          el.id === vars.element.id ? { ...el, converted: true } : el,
        ),
      );
      setConvertTarget(null);
      toast.success("Task created!");
      saveMutateRef.current(elementsRef.current);
    },
    onError: () => toast.error("Failed to create task"),
  });

  const wbId = whiteboard?.id;
  const wbTitle = whiteboard?.title;
  const wbElements = whiteboard?.elements;

  useEffect(() => {
    if (wbId) {
      setTitle(wbTitle ?? "Untitled Whiteboard");
      setElements((wbElements ?? []) as WhiteboardElement[]);
    }
  }, [wbId, wbTitle, wbElements]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    redrawAll(canvas, elements);
  }, [elements]);

  useEffect(() => {
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

  useEffect(() => {
    const id = setInterval(() => {
      if (elementsRef.current.length > 0)
        saveMutateRef.current(elementsRef.current);
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  const pushUndo = useCallback((prev: WhiteboardElement[]) => {
    setUndoStack((s) => [...s.slice(-9), prev]);
    setRedoStack([]);
  }, []);

  const startEl = useCallback(
    (pos: { x: number; y: number }): WhiteboardElement => ({
      id: uid(),
      tool,
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      color: tool === "Eraser" ? "#000000" : color,
      strokeWidth: tool === "Eraser" ? strokeWidth * 4 : strokeWidth,
      text: "",
      points: [pos.x, pos.y],
    }),
    [tool, color, strokeWidth],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const pos = getCanvasPos(canvas, e);
      if (tool === "Text") {
        setTextInput({ x: pos.x, y: pos.y, value: "" });
        return;
      }
      if (tool === "Sticky") {
        pushUndo(elements);
        setElements((prev) => [
          ...prev,
          {
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
            stickyColor,
          },
        ]);
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
    [tool, elements, pushUndo, startEl, color, stickyColor],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing.current || !currentEl.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const pos = getCanvasPos(canvas, e);
      const el = currentEl.current;
      const updated: WhiteboardElement = {
        ...el,
        width: pos.x - el.x,
        height: pos.y - el.y,
        points:
          el.tool === "Pen" || el.tool === "Eraser"
            ? [...el.points, pos.x, pos.y]
            : el.points,
      };
      currentEl.current = updated;
      redrawAll(canvas, [...elements, updated]);
    },
    [elements],
  );

  const handleMouseUp = useCallback(() => {
    if (!isDrawing.current || !currentEl.current) return;
    isDrawing.current = false;
    setElements((prev) => [...prev, currentEl.current!]);
    currentEl.current = null;
  }, []);

  const getTouchPos = useCallback(
    (canvas: HTMLCanvasElement, t: React.Touch) =>
      getCanvasPos(canvas, { clientX: t.clientX, clientY: t.clientY }),
    [],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (e.touches.length === 2) {
        // Two-finger gesture: pinch-zoom or pan
        isDrawing.current = false;
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const dist = Math.hypot(
          t1.clientX - t0.clientX,
          t1.clientY - t0.clientY,
        );
        lastTouchDist.current = dist;
        lastTouchMid.current = {
          x: (t0.clientX + t1.clientX) / 2,
          y: (t0.clientY + t1.clientY) / 2,
        };
        return;
      }

      const pos = getTouchPos(canvas, e.touches[0]);
      if (tool === "Text") {
        setTextInput({ x: pos.x, y: pos.y, value: "" });
        return;
      }
      if (tool === "Sticky") {
        pushUndo(elements);
        setElements((prev) => [
          ...prev,
          {
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
            stickyColor,
          },
        ]);
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
    [tool, elements, pushUndo, startEl, getTouchPos, color, stickyColor],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (e.touches.length === 2) {
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const dist = Math.hypot(
          t1.clientX - t0.clientX,
          t1.clientY - t0.clientY,
        );
        const mid = {
          x: (t0.clientX + t1.clientX) / 2,
          y: (t0.clientY + t1.clientY) / 2,
        };

        if (lastTouchDist.current !== null) {
          const ratio = dist / lastTouchDist.current;
          setZoom((z) => Math.min(Math.max(z * ratio, 0.25), 3));
        }
        if (lastTouchMid.current !== null) {
          const dx = mid.x - lastTouchMid.current.x;
          const dy = mid.y - lastTouchMid.current.y;
          panOffset.current = {
            x: panOffset.current.x + dx,
            y: panOffset.current.y + dy,
          };
          setPanOffsetState({ ...panOffset.current });
        }
        lastTouchDist.current = dist;
        lastTouchMid.current = mid;
        return;
      }

      if (!isDrawing.current || !currentEl.current) return;
      const pos = getTouchPos(canvas, e.touches[0]);
      const el = currentEl.current;
      const updated: WhiteboardElement = {
        ...el,
        width: pos.x - el.x,
        height: pos.y - el.y,
        points:
          el.tool === "Pen" || el.tool === "Eraser"
            ? [...el.points, pos.x, pos.y]
            : el.points,
      };
      currentEl.current = updated;
      redrawAll(canvas, [...elements, updated]);
    },
    [elements, getTouchPos],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      lastTouchDist.current = null;
      lastTouchMid.current = null;
      if (e.touches.length === 0) handleMouseUp();
    },
    [handleMouseUp],
  );

  const textInputStateRef = useRef(textInput);
  textInputStateRef.current = textInput;

  const commitText = useCallback(() => {
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
        points: [],
      },
    ]);
    setTextInput(null);
  }, [elements, color, strokeWidth, pushUndo]);

  const handleUndo = () => {
    if (!undoStack.length) return;
    setRedoStack((r) => [...r, elements]);
    setUndoStack((s) => s.slice(0, -1));
    setElements(undoStack[undoStack.length - 1]);
  };

  const handleRedo = () => {
    if (!redoStack.length) return;
    setUndoStack((s) => [...s, elements]);
    setRedoStack((r) => r.slice(0, -1));
    setElements(redoStack[redoStack.length - 1]);
  };

  const handleClear = () => {
    pushUndo(elements);
    setElements([]);
  };
  const handleSave = () => saveMutation.mutate(elements);

  const handleApplyTemplate = (tpl: {
    name: string;
    elements: WhiteboardElement[];
  }) => {
    pushUndo(elements);
    setElements((prev) => [
      ...prev,
      ...(tpl.elements.map((el) => ({
        ...el,
        id: uid(),
      })) as WhiteboardElement[]),
    ]);
    toast.success(`Template "${tpl.name}" applied`);
  };

  const handleInsertImage = (url: string) => {
    const canvas = canvasRef.current;
    const cx = canvas ? canvas.width / 2 / zoom - 100 : 200;
    const cy = canvas ? canvas.height / 2 / zoom - 75 : 150;
    pushUndo(elements);
    setElements((prev) => [
      ...prev,
      {
        id: uid(),
        tool: "Image",
        x: cx,
        y: cy,
        width: 200,
        height: 150,
        color,
        strokeWidth: 0,
        text: "",
        points: [],
        imageUrl: url,
      },
    ]);
  };

  const cursor =
    tool === "Eraser"
      ? "cell"
      : tool === "Text"
        ? "text"
        : tool === "Sticky"
          ? "copy"
          : "crosshair";

  if (isLoading) {
    return (
      <div className="flex h-full flex-col gap-4 p-8">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="flex-1 rounded-2xl" />
      </div>
    );
  }

  const stickyElements = elements.filter((el) => el.tool === "Sticky");
  const imageElements = elements.filter((el) => el.tool === "Image");

  const commonToolbarProps = {
    tool,
    color,
    strokeWidth,
    stickyColor,
    zoom,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    isSaving: saveMutation.isPending,
    savedIndicator,
    onToolChange: (t: DrawingTool) => {
      setTextInput(null);
      setTool(t);
    },
    onColorChange: setColor,
    onStrokeChange: setStrokeWidth,
    onStickyColorChange: setStickyColor,
    onUndo: handleUndo,
    onRedo: handleRedo,
    onClear: handleClear,
    onSave: handleSave,
    onZoomIn: () => setZoom((z) => Math.min(z + 0.25, 3)),
    onZoomOut: () => setZoom((z) => Math.max(z - 0.25, 0.25)),
    onTemplates: () => setShowTemplates(true),
  };

  return (
    <div
      className="flex h-full flex-col overflow-hidden bg-background"
      data-ocid="whiteboard-page"
    >
      {/* Header — desktop */}
      <header className="hidden sm:flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-3 shadow-sm">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            asChild
          >
            <Link to="/app/$workspaceId/whiteboards" params={{ workspaceId }}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          {editingTitle ? (
            <input
              ref={titleInputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setEditingTitle(false);
              }}
              className="min-w-0 rounded border border-input bg-background px-2 py-0.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="whiteboard-title-input"
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditingTitle(true)}
              className="truncate text-sm font-semibold text-foreground hover:text-primary transition-colors focus-visible:underline focus-visible:outline-none"
              aria-label="Edit whiteboard title"
              data-ocid="whiteboard-title"
            >
              {title}
            </button>
          )}
        </div>

        {/* Desktop toolbar inline */}
        <div
          className="flex items-center gap-0.5 rounded-xl border border-border bg-muted/40 p-1 overflow-x-auto"
          role="toolbar"
          aria-label="Drawing tools"
        >
          {TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTextInput(null);
                setTool(t.id);
              }}
              aria-label={t.label}
              aria-pressed={tool === t.id}
              data-ocid={`tool-${t.id.toLowerCase()}`}
              className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${tool === t.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              <t.icon className="h-3.5 w-3.5" />
            </button>
          ))}
          <div className="mx-1 h-5 w-px bg-border shrink-0" />
          {tool === "Sticky" ? (
            STICKY_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setStickyColor(c)}
                aria-label="Sticky color"
                className={`h-5 w-5 rounded-sm border-2 transition-transform hover:scale-110 ${stickyColor === c ? "border-foreground scale-110" : "border-transparent"}`}
                style={{ background: c }}
              />
            ))
          ) : (
            <div className="flex items-center gap-0.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                  className={`h-5 w-5 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? "border-foreground scale-110" : "border-transparent"}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          )}
          <div className="mx-1 h-5 w-px bg-border shrink-0" />
          <input
            type="range"
            min={1}
            max={20}
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="w-20 accent-primary"
            aria-label="Stroke width"
            data-ocid="stroke-width"
          />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
            aria-label="Zoom in"
            data-ocid="zoom-in-btn"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.25))}
            aria-label="Zoom out"
            data-ocid="zoom-out-btn"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="mx-1 h-5 w-px bg-border" />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground"
            onClick={() => setShowTemplates(true)}
            data-ocid="templates-btn"
          >
            <Layers className="h-3.5 w-3.5 mr-1" /> Templates
          </Button>
          <div className="mx-1 h-5 w-px bg-border" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={handleUndo}
            disabled={!undoStack.length}
            aria-label="Undo"
            data-ocid="undo-btn"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={handleRedo}
            disabled={!redoStack.length}
            aria-label="Redo"
            data-ocid="redo-btn"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={handleClear}
            aria-label="Clear all"
            data-ocid="clear-btn"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <div className="mx-1 h-5 w-px bg-border" />
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={handleSave}
            disabled={saveMutation.isPending}
            data-ocid="save-btn"
          >
            {savedIndicator ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {savedIndicator ? "Saved" : "Save"}
          </Button>
        </div>
      </header>

      {/* Mobile header */}
      <header className="flex sm:hidden items-center gap-2 border-b border-border bg-card px-3 py-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          asChild
        >
          <Link to="/app/$workspaceId/whiteboards" params={{ workspaceId }}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        {editingTitle ? (
          <input
            ref={titleInputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setEditingTitle(false);
            }}
            className="flex-1 min-w-0 rounded border border-input bg-background px-2 py-0.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditingTitle(true)}
            className="flex-1 min-w-0 truncate text-sm font-semibold text-foreground text-left"
          >
            {title}
          </button>
        )}
      </header>

      {/* Mobile scrollable toolbar */}
      <div className="sm:hidden">
        <MobileToolbar {...commonToolbarProps} />
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(var(--muted-foreground) / 0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        data-ocid="whiteboard-canvas-container"
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "top left",
            transform: `translate(${panOffsetState.x}px, ${panOffsetState.y}px) scale(${zoom})`,
          }}
        >
          {stickyElements.map((el) => (
            <StickyOverlay
              key={el.id}
              el={el}
              zoom={1}
              onEdit={(id, text) =>
                setElements((prev) =>
                  prev.map((e) =>
                    e.id === id ? { ...e, stickyText: text } : e,
                  ),
                )
              }
              onConvertToTask={(targetEl) => setConvertTarget(targetEl)}
              canvasRef={canvasRef}
            />
          ))}
          {imageElements.map((el) => (
            <ImageOverlay key={el.id} el={el} zoom={1} />
          ))}
        </div>

        <canvas
          ref={canvasRef}
          style={{
            cursor,
            touchAction: "none",
            display: "block",
            transform: `translate(${panOffsetState.x}px, ${panOffsetState.y}px) scale(${zoom})`,
            transformOrigin: "top left",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          data-ocid="whiteboard-canvas"
        />

        {textInput !== null && (
          <input
            ref={textInputRef}
            value={textInput.value}
            onChange={(e) =>
              setTextInput((prev) =>
                prev ? { ...prev, value: e.target.value } : null,
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") commitText();
              if (e.key === "Escape") setTextInput(null);
            }}
            onBlur={commitText}
            style={{
              position: "absolute",
              left: textInput.x * zoom + panOffsetState.x,
              top: (textInput.y - 20) * zoom + panOffsetState.y,
              fontSize: `${Math.max(strokeWidth * 4, 16)}px`,
              color,
              background: "transparent",
              border: "1px dashed rgba(0,0,0,0.3)",
              outline: "none",
              minWidth: 120,
              fontFamily: "Figtree, sans-serif",
              zIndex: 15,
            }}
            placeholder="Type here…"
            data-ocid="text-tool-input"
          />
        )}

        {elements.length === 0 && !isDrawing.current && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-30">
            <Pencil className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground font-medium">
              Select a tool and start drawing
            </p>
          </div>
        )}
      </div>

      {saveMutation.isPending && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-card border border-border px-3 py-2 text-xs text-muted-foreground shadow-sm z-30">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Saving…
        </div>
      )}

      {showTemplates && (
        <TemplatesPanel
          onApply={handleApplyTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {showImageModal && (
        <ImageUrlModal
          onInsert={handleInsertImage}
          onClose={() => setShowImageModal(false)}
        />
      )}

      {convertTarget && (
        <ConvertToTaskModal
          element={convertTarget}
          projects={projects}
          onConfirm={(pid) =>
            convertMutation.mutate({ element: convertTarget, projectId: pid })
          }
          onClose={() => setConvertTarget(null)}
          isPending={convertMutation.isPending}
        />
      )}
    </div>
  );
}
