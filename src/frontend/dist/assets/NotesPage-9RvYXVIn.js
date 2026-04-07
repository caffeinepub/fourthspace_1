import { g as createLucideIcon, c as useWorkspace, r as reactExports, e as useQuery, j as jsxRuntimeExports, B as Button, f as Link, X } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { I as Input } from "./input-C0aO0R3D.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { P as Plus } from "./plus-DNap1HPx.js";
import { S as Search } from "./search-BaaXS-B8.js";
import { T as Tag } from "./tag-BAT9nNmt.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = createLucideIcon("book-open", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z", key: "qazsjp" }],
  ["path", { d: "M15 3v4a2 2 0 0 0 2 2h4", key: "40519r" }]
];
const StickyNote = createLucideIcon("sticky-note", __iconNode);
function NoteCard({ note }) {
  const preview = note.content.slice(0, 120).trim();
  const date = new Date(Number(note.updatedAt) / 1e6).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/app/notes/$noteId",
      params: { noteId: note.id },
      "data-ocid": "note-card",
      className: "group block rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-base line-clamp-2 min-w-0 group-hover:text-primary transition-colors duration-200", children: note.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4 text-primary/60 shrink-0 mt-0.5" })
        ] }),
        preview && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed", children: [
          preview,
          note.content.length > 120 && "…"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap mt-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
            note.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "text-xs px-2 py-0.5 bg-primary/10 text-primary border-0",
                children: tag
              },
              tag
            )),
            note.tags.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs px-2 py-0.5", children: [
              "+",
              note.tags.length - 3
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground shrink-0", children: date })
        ] }),
        note.crossLinks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 pt-3 border-t border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          note.crossLinks.length,
          " cross-link",
          note.crossLinks.length !== 1 ? "s" : ""
        ] }) })
      ]
    }
  );
}
const SKELETON_KEYS = [
  "sk-a",
  "sk-b",
  "sk-c",
  "sk-d",
  "sk-e",
  "sk-f",
  "sk-g",
  "sk-h"
];
function NotesGridSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-border bg-card p-5 space-y-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-3/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-2/3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-14 rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16 rounded-full" })
        ] })
      ]
    },
    k
  )) });
}
function EmptyState({
  query,
  onClear
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-24 text-center",
      "data-ocid": "notes-empty-state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-primary/10 p-6 mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { className: "h-12 w-12 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold text-foreground mb-2", children: query ? "No matching notes" : "No notes yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mb-6", children: query ? `No notes match "${query}". Try a different search or clear the filter.` : "Capture your thoughts, ideas, and knowledge. Create your first note to get started." }),
        query ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: onClear, className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          "Clear search"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "gap-2", "data-ocid": "notes-empty-cta", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/notes/new", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          "Create your first note"
        ] }) })
      ]
    }
  );
}
function NotesPage() {
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const [search, setSearch] = reactExports.useState("");
  const [activeTag, setActiveTag] = reactExports.useState(null);
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes", tenantId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listNotes(tenantId);
    },
    enabled: !!actor && !isFetching
  });
  const allTags = reactExports.useMemo(() => {
    const tagSet = /* @__PURE__ */ new Set();
    for (const n of notes) {
      for (const t of n.tags) {
        tagSet.add(t);
      }
    }
    return Array.from(tagSet).sort();
  }, [notes]);
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    return notes.filter((n) => {
      const matchesSearch = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
      const matchesTag = !activeTag || n.tags.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [notes, search, activeTag]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 lg:p-8 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          notes.length,
          " note",
          notes.length !== 1 ? "s" : "",
          " in your workspace"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "gap-2 shrink-0", "data-ocid": "notes-new-btn", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/notes/new", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        "New Note"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search notes by title or content…",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-9",
            "data-ocid": "notes-search"
          }
        ),
        search && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setSearch(""),
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
            "aria-label": "Clear search",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      allTags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "fieldset",
        {
          className: "flex flex-wrap gap-2 items-center border-0 p-0 m-0",
          "aria-label": "Filter by tag",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
            allTags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setActiveTag(activeTag === tag ? null : tag),
                "data-ocid": `tag-filter-${tag}`,
                className: `rounded-full px-3 py-1 text-xs font-medium transition-smooth border ${activeTag === tag ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-transparent hover:border-primary/40 hover:text-foreground"}`,
                children: tag
              },
              tag
            )),
            activeTag && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setActiveTag(null),
                className: "text-xs text-muted-foreground hover:text-foreground flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }),
                  "Clear"
                ]
              }
            )
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(NotesGridSkeleton, {}) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        query: search || activeTag || "",
        onClear: () => {
          setSearch("");
          setActiveTag(null);
        }
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: filtered.map((note) => /* @__PURE__ */ jsxRuntimeExports.jsx(NoteCard, { note }, note.id)) })
  ] });
}
export {
  NotesPage as default
};
