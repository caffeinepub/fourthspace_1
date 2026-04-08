import { s as createLucideIcon, m as useParams, f as useWorkspace, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, F as FileText, P as Plus, X } from "./index-BZqaRhAX.js";
import { I as Input } from "./input-BJtw5f9h.js";
import { S as Skeleton } from "./skeleton-CXUiMpVp.js";
import { u as useBackend } from "./useBackend-DSxJo5MU.js";
import { S as StickyNote } from "./sticky-note-DLcbmYDD.js";
import { S as Search } from "./search-D7yG9ybj.js";
import { T as Tag } from "./tag-CtPC3UkT.js";
import { B as BookOpen } from "./book-open-DArI0G94.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "7", x: "3", y: "3", rx: "1", key: "f1a2em" }],
  ["rect", { width: "9", height: "7", x: "3", y: "14", rx: "1", key: "jqznyg" }],
  ["rect", { width: "5", height: "7", x: "16", y: "14", rx: "1", key: "q5h2i8" }]
];
const LayoutTemplate = createLucideIcon("layout-template", __iconNode);
function NoteCard({ note, workspaceId }) {
  const preview = note.content.slice(0, 100).trim();
  const date = new Date(Number(note.updatedAt) / 1e6).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric" }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/app/$workspaceId/notes/$noteId",
      params: { workspaceId, noteId: note.id },
      "data-ocid": "note-card",
      className: "group flex flex-col gap-2.5 rounded-xl border border-border/50 bg-card p-4 shadow-card card-interactive hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-sm line-clamp-2 min-w-0 leading-snug group-hover:text-primary transition-colors", children: note.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5 opacity-60" })
        ] }),
        preview && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground line-clamp-2 leading-relaxed", children: [
          preview,
          note.content.length > 100 && "…"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 mt-auto pt-1 border-t border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
            note.tags.slice(0, 2).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "rounded-full px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary",
                children: tag
              },
              tag
            )),
            note.tags.length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground", children: [
              "+",
              note.tags.length - 2
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground shrink-0", children: date })
        ] })
      ]
    }
  );
}
const SK = ["a", "b", "c", "d", "e", "f", "g", "h"];
function GridSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3", children: SK.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-border/50 bg-card p-4 space-y-2.5",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-12 rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-14 rounded-full" })
        ] })
      ]
    },
    k
  )) });
}
function EmptyState({
  query,
  onClear,
  workspaceId
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4",
      "data-ocid": "notes-empty-state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-primary/10 p-5 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { className: "h-10 w-10 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold text-foreground mb-1.5", children: query ? "No matching notes" : "No notes yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mb-5", children: query ? `No notes match "${query}". Try a different search.` : "Capture your thoughts and ideas. Create your first note to get started." }),
        query ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: onClear, size: "sm", className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }),
          " Clear search"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            size: "sm",
            className: "gap-2 active-press",
            "data-ocid": "notes-empty-cta",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/$workspaceId/notes/new", params: { workspaceId }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Create your first note"
            ] })
          }
        )
      ]
    }
  );
}
function NotesPage() {
  const { workspaceId } = useParams({ from: "/app/$workspaceId/notes" });
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const [search, setSearch] = reactExports.useState("");
  const [activeTag, setActiveTag] = reactExports.useState(null);
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listNotes(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching
  });
  const allTags = reactExports.useMemo(() => {
    const s = /* @__PURE__ */ new Set();
    for (const n of notes) for (const t of n.tags) s.add(t);
    return Array.from(s).sort();
  }, [notes]);
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    return notes.filter((n) => {
      const matchesSearch = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
      const matchesTag = !activeTag || n.tags.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [notes, search, activeTag]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-4 sm:p-6 space-y-4 sm:space-y-5 pb-20 md:pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { className: "h-5 w-5 text-primary" }),
          "Notes"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          notes.length,
          " note",
          notes.length !== 1 ? "s" : "",
          " in your workspace"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            variant: "outline",
            size: "sm",
            className: "gap-1.5 h-9 text-xs flex-1 sm:flex-none justify-center",
            "data-ocid": "notes-templates-btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/app/$workspaceId/notes/templates",
                params: { workspaceId },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutTemplate, { className: "h-3 w-3" }),
                  " Templates"
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            variant: "outline",
            size: "sm",
            className: "gap-1.5 h-9 text-xs flex-1 sm:flex-none justify-center",
            "data-ocid": "notes-pages-btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/$workspaceId/pages", params: { workspaceId }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3 w-3" }),
              " Pages"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            size: "sm",
            className: "gap-1.5 h-9 text-xs flex-1 sm:flex-none justify-center active-press",
            "data-ocid": "notes-new-btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/$workspaceId/notes/new", params: { workspaceId }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
              " New Note"
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search notes…",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-9 h-10 text-sm border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30 w-full",
            "data-ocid": "notes-search"
          }
        ),
        search && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setSearch(""),
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2",
            "aria-label": "Clear search",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
          }
        )
      ] }),
      allTags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3 w-3 text-muted-foreground shrink-0" }),
        allTags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setActiveTag(activeTag === tag ? null : tag),
            "data-ocid": `tag-filter-${tag}`,
            className: `rounded-full px-2.5 py-1 text-xs font-medium transition-smooth border min-h-[32px] ${activeTag === tag ? "bg-primary text-primary-foreground border-primary" : "bg-muted/60 text-muted-foreground border-transparent hover:border-border hover:text-foreground"}`,
            children: tag
          },
          tag
        )),
        activeTag && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setActiveTag(null),
            className: "text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5 min-h-[32px]",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }),
              " Clear"
            ]
          }
        )
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(GridSkeleton, {}) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        query: search || activeTag || "",
        onClear: () => {
          setSearch("");
          setActiveTag(null);
        },
        workspaceId
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3", children: filtered.map((note) => /* @__PURE__ */ jsxRuntimeExports.jsx(NoteCard, { note, workspaceId }, note.id)) })
  ] });
}
export {
  NotesPage as default
};
