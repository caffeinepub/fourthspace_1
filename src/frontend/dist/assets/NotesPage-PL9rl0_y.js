import { s as createLucideIcon, m as useParams, f as useWorkspace, n as useQueryClient, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, F as FileText, P as Plus, X } from "./index-1XRv9GHr.js";
import { B as Badge } from "./badge-rX4oLW6l.js";
import { I as Input } from "./input-BOIU-9S_.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { u as useMutation } from "./useMutation-X94w2CVk.js";
import { u as ue } from "./index-BOWFyaIB.js";
import { u as useBackend } from "./useBackend-DyFxq-Jw.js";
import { S as StickyNote } from "./sticky-note-BwYe4cKm.js";
import { S as Search } from "./search-CWnD_rod.js";
import { S as Star } from "./star-DzO5N11f.js";
import { T as Tag } from "./tag-DIykFwsm.js";
import { B as BookOpen } from "./book-open-mivKUcaP.js";
import { C as Copy } from "./copy-BH7dsCoj.js";
import { T as Trash2 } from "./trash-2-DiWEnbCD.js";
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
const COVER_GRADIENTS = {
  "indigo-purple": {
    label: "Indigo to Purple",
    value: "from-indigo-500 via-purple-500 to-pink-500",
    cssFrom: "#6366f1",
    cssMid: "#a855f7",
    cssTo: "#ec4899"
  },
  ocean: {
    label: "Ocean",
    value: "from-cyan-500 via-blue-500 to-indigo-600",
    cssFrom: "#06b6d4",
    cssMid: "#3b82f6",
    cssTo: "#4f46e5"
  },
  sunset: {
    label: "Sunset",
    value: "from-orange-400 via-rose-500 to-pink-600",
    cssFrom: "#fb923c",
    cssMid: "#f43f5e",
    cssTo: "#db2777"
  },
  forest: {
    label: "Forest",
    value: "from-emerald-400 via-teal-500 to-cyan-600",
    cssFrom: "#34d399",
    cssMid: "#14b8a6",
    cssTo: "#0891b2"
  },
  golden: {
    label: "Golden",
    value: "from-yellow-400 via-orange-400 to-red-500",
    cssFrom: "#facc15",
    cssMid: "#fb923c",
    cssTo: "#ef4444"
  },
  midnight: {
    label: "Midnight",
    value: "from-slate-700 via-purple-800 to-slate-900",
    cssFrom: "#334155",
    cssMid: "#6b21a8",
    cssTo: "#0f172a"
  }
};
function NoteCard({
  note,
  workspaceId,
  onFavorite,
  onDuplicate,
  onDelete
}) {
  const n = note;
  const cover = n.coverGradient ? COVER_GRADIENTS[n.coverGradient] : null;
  const icon = n.iconEmoji;
  const preview = (() => {
    const raw = note.content;
    if (!raw || !raw.trim()) return "";
    try {
      const blocks = JSON.parse(raw);
      if (Array.isArray(blocks)) {
        const textBlocks = blocks.filter(
          (b) => b.type !== "divider" && b.type !== "image" && b.content
        ).slice(0, 4);
        const text = textBlocks.map((b) => b.content).join(" ").trim();
        return text.slice(0, 100);
      }
    } catch {
    }
    return raw.replace(/^#{1,3}\s+/gm, "").replace(/\*\*/g, "").replace(/`/g, "").slice(0, 90).trim();
  })();
  const date = new Date(Number(note.updatedAt) / 1e6).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric" }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "group relative flex flex-col rounded-xl border border-border/50 bg-card shadow-sm card-interactive hover:border-primary/30 hover:shadow-md transition-all overflow-hidden",
      "data-ocid": "note-card",
      children: [
        cover && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `h-16 bg-gradient-to-r ${cover.value} w-full shrink-0`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/app/$workspaceId/notes/$noteId",
            params: { workspaceId, noteId: note.id },
            className: "flex flex-col gap-2.5 p-4 flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 min-w-0", children: [
                  icon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base shrink-0 leading-tight", children: icon }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-sm line-clamp-2 min-w-0 leading-snug group-hover:text-primary transition-colors", children: note.title })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5 opacity-60" })
              ] }),
              preview && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground line-clamp-2 leading-relaxed", children: [
                preview,
                note.content.length > 90 && "…"
              ] }),
              note.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between gap-2 mt-auto pt-1 border-t border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: date }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: (e) => {
                e.stopPropagation();
                onFavorite(note.id, !!n.isFavorite);
              },
              className: `flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-background/90 hover:bg-muted transition-colors ${n.isFavorite ? "text-secondary" : "text-muted-foreground"}`,
              "aria-label": n.isFavorite ? "Unfavorite" : "Favorite",
              "data-ocid": `note-favorite-${note.id}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Star,
                {
                  className: `h-3.5 w-3.5 ${n.isFavorite ? "fill-secondary" : ""}`
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: (e) => {
                e.stopPropagation();
                onDuplicate(n);
              },
              className: "flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-background/90 hover:bg-muted text-muted-foreground transition-colors",
              "aria-label": "Duplicate",
              "data-ocid": `note-duplicate-${note.id}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: (e) => {
                e.stopPropagation();
                onDelete(note.id);
              },
              className: "flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-background/90 hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors",
              "aria-label": "Delete",
              "data-ocid": `note-delete-${note.id}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
            }
          )
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
      className: "rounded-xl border border-border/50 bg-card overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-12 rounded-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-14 rounded-full" })
          ] })
        ] })
      ]
    },
    k
  )) });
}
function EmptyState({
  query,
  onClear,
  workspaceId,
  filter
}) {
  const isFiltered = !!query || !!filter;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4",
      "data-ocid": "notes-empty-state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-primary/10 p-5 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { className: "h-10 w-10 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold text-foreground mb-1.5", children: isFiltered ? filter === "favorites" ? "No favorite notes yet" : "No matching notes" : "No notes yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mb-5", children: isFiltered ? query ? `No notes match "${query}".` : filter === "favorites" ? "Star notes to access them quickly here." : `No notes tagged "${filter}".` : "Capture your thoughts and ideas. Create your first note to get started." }),
        isFiltered ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: onClear, size: "sm", className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }),
          " Clear filters"
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
  const queryClient = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [activeTag, setActiveTag] = reactExports.useState(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = reactExports.useState(false);
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
      const matchSearch = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
      const matchTag = !activeTag || n.tags.includes(activeTag);
      const matchFav = !showFavoritesOnly || !!n.isFavorite;
      return matchSearch && matchTag && matchFav;
    });
  }, [notes, search, activeTag, showFavoritesOnly]);
  const favCount = reactExports.useMemo(
    () => notes.filter((n) => !!n.isFavorite).length,
    [notes]
  );
  const duplicateMutation = useMutation({
    mutationFn: async (n) => {
      if (!actor) throw new Error("Not connected");
      const input = {
        title: `${n.title} (copy)`,
        content: n.content,
        tags: n.tags,
        crossLinks: n.crossLinks
      };
      const result = await actor.createNote(tenantId, workspaceId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", tenantId, workspaceId]
      });
      ue.success("Note duplicated");
    },
    onError: (err) => ue.error(err.message)
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.deleteNote(tenantId, workspaceId, id);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", tenantId, workspaceId]
      });
      ue.success("Note deleted");
    },
    onError: (err) => ue.error(err.message)
  });
  const handleClearFilters = () => {
    setSearch("");
    setActiveTag(null);
    setShowFavoritesOnly(false);
  };
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
          " in your workspace",
          favCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground/60 ml-1.5", children: [
            "· ",
            favCount,
            " favorited"
          ] })
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowFavoritesOnly((v) => !v),
            className: `rounded-full px-2.5 py-1 text-xs font-medium transition-smooth border min-h-[32px] inline-flex items-center gap-1 ${showFavoritesOnly ? "bg-secondary text-secondary-foreground border-secondary" : "bg-muted/60 text-muted-foreground border-transparent hover:border-border hover:text-foreground"}`,
            "data-ocid": "favorites-filter-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Star,
                {
                  className: `h-3 w-3 ${showFavoritesOnly ? "fill-secondary-foreground" : ""}`
                }
              ),
              "Favorites",
              favCount > 0 ? ` (${favCount})` : ""
            ]
          }
        ),
        allTags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
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
          ))
        ] }),
        (showFavoritesOnly || activeTag || search) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: handleClearFilters,
            className: "text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5 min-h-[32px]",
            "data-ocid": "notes-clear-filters",
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
        query: search,
        onClear: handleClearFilters,
        workspaceId,
        filter: showFavoritesOnly ? "favorites" : activeTag || ""
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3", children: filtered.map((note) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteCard,
      {
        note,
        workspaceId,
        onFavorite: (_id, _current) => {
          ue.info("Use the star in the note editor to favorite");
        },
        onDuplicate: (n) => duplicateMutation.mutate(n),
        onDelete: (id) => {
          if (window.confirm("Delete this note?"))
            deleteMutation.mutate(id);
        }
      },
      note.id
    )) }),
    !isLoading && filtered.length > 0 && (search || activeTag || showFavoritesOnly) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center pb-2", children: [
      "Showing ",
      filtered.length,
      " of ",
      notes.length,
      " note",
      notes.length !== 1 ? "s" : "",
      activeTag && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-2 text-xs", children: activeTag })
    ] })
  ] });
}
export {
  NotesPage as default
};
