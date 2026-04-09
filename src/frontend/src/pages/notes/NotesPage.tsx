import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  BookOpen,
  Copy,
  FileText,
  LayoutTemplate,
  Plus,
  Search,
  Star,
  StickyNote,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { Note, NoteInput } from "../../types";

// ── Cover gradient presets (must match NoteDetailPage)
const COVER_GRADIENTS: Record<
  string,
  {
    label: string;
    value: string;
    cssFrom: string;
    cssMid: string;
    cssTo: string;
  }
> = {
  "indigo-purple": {
    label: "Indigo to Purple",
    value: "from-indigo-500 via-purple-500 to-pink-500",
    cssFrom: "#6366f1",
    cssMid: "#a855f7",
    cssTo: "#ec4899",
  },
  ocean: {
    label: "Ocean",
    value: "from-cyan-500 via-blue-500 to-indigo-600",
    cssFrom: "#06b6d4",
    cssMid: "#3b82f6",
    cssTo: "#4f46e5",
  },
  sunset: {
    label: "Sunset",
    value: "from-orange-400 via-rose-500 to-pink-600",
    cssFrom: "#fb923c",
    cssMid: "#f43f5e",
    cssTo: "#db2777",
  },
  forest: {
    label: "Forest",
    value: "from-emerald-400 via-teal-500 to-cyan-600",
    cssFrom: "#34d399",
    cssMid: "#14b8a6",
    cssTo: "#0891b2",
  },
  golden: {
    label: "Golden",
    value: "from-yellow-400 via-orange-400 to-red-500",
    cssFrom: "#facc15",
    cssMid: "#fb923c",
    cssTo: "#ef4444",
  },
  midnight: {
    label: "Midnight",
    value: "from-slate-700 via-purple-800 to-slate-900",
    cssFrom: "#334155",
    cssMid: "#6b21a8",
    cssTo: "#0f172a",
  },
};

// ── Extended note type with optional cover/icon
interface NoteExtended extends Note {
  coverGradient?: string;
  iconEmoji?: string;
  isFavorite?: boolean;
}

// ── NoteCard ─────────────────────────────────────────────────────────────────

function NoteCard({
  note,
  workspaceId,
  onFavorite,
  onDuplicate,
  onDelete,
}: {
  note: NoteExtended;
  workspaceId: string;
  onFavorite: (id: string, current: boolean) => void;
  onDuplicate: (note: NoteExtended) => void;
  onDelete: (id: string) => void;
}) {
  const n = note as NoteExtended;
  const cover = n.coverGradient ? COVER_GRADIENTS[n.coverGradient] : null;
  const icon = n.iconEmoji;

  // Extract preview from JSON blocks or fall back to plain text
  const preview = (() => {
    const raw = note.content;
    if (!raw || !raw.trim()) return "";
    try {
      const blocks = JSON.parse(raw);
      if (Array.isArray(blocks)) {
        const textBlocks = blocks
          .filter(
            (b) => b.type !== "divider" && b.type !== "image" && b.content,
          )
          .slice(0, 4);
        const text = textBlocks
          .map((b) => b.content as string)
          .join(" ")
          .trim();
        return text.slice(0, 100);
      }
    } catch {
      // Legacy markdown fallback
    }
    return raw
      .replace(/^#{1,3}\s+/gm, "")
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .slice(0, 90)
      .trim();
  })();
  const date = new Date(Number(note.updatedAt) / 1_000_000).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric" },
  );

  return (
    <div
      className="group relative flex flex-col rounded-xl border border-border/50 bg-card shadow-sm card-interactive hover:border-primary/30 hover:shadow-md transition-all overflow-hidden"
      data-ocid="note-card"
    >
      {/* Cover strip */}
      {cover && (
        <div
          className={`h-16 bg-gradient-to-r ${cover.value} w-full shrink-0`}
        />
      )}

      <Link
        to="/app/$workspaceId/notes/$noteId"
        params={{ workspaceId, noteId: note.id }}
        className="flex flex-col gap-2.5 p-4 flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
      >
        {/* Icon + title */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 min-w-0">
            {icon && (
              <span className="text-base shrink-0 leading-tight">{icon}</span>
            )}
            <h3 className="font-display font-semibold text-foreground text-sm line-clamp-2 min-w-0 leading-snug group-hover:text-primary transition-colors">
              {note.title}
            </h3>
          </div>
          <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5 opacity-60" />
        </div>

        {preview && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {preview}
            {note.content.length > 90 && "…"}
          </p>
        )}

        {/* Tags row */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
            {note.tags.length > 2 && (
              <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
                +{note.tags.length - 2}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mt-auto pt-1 border-t border-border/40">
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
      </Link>

      {/* Quick actions: appear on hover */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(note.id, !!n.isFavorite);
          }}
          className={`flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-background/90 hover:bg-muted transition-colors ${n.isFavorite ? "text-secondary" : "text-muted-foreground"}`}
          aria-label={n.isFavorite ? "Unfavorite" : "Favorite"}
          data-ocid={`note-favorite-${note.id}`}
        >
          <Star
            className={`h-3.5 w-3.5 ${n.isFavorite ? "fill-secondary" : ""}`}
          />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(n);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-background/90 hover:bg-muted text-muted-foreground transition-colors"
          aria-label="Duplicate"
          data-ocid={`note-duplicate-${note.id}`}
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-background/90 hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
          aria-label="Delete"
          data-ocid={`note-delete-${note.id}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

const SK = ["a", "b", "c", "d", "e", "f", "g", "h"];

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {SK.map((k) => (
        <div
          key={k}
          className="rounded-xl border border-border/50 bg-card overflow-hidden"
        >
          <Skeleton className="h-16 w-full rounded-none" />
          <div className="p-4 space-y-2.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <div className="flex gap-1.5 pt-1">
              <Skeleton className="h-4 w-12 rounded-full" />
              <Skeleton className="h-4 w-14 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  query,
  onClear,
  workspaceId,
  filter,
}: {
  query: string;
  onClear: () => void;
  workspaceId: string;
  filter: string;
}) {
  const isFiltered = !!query || !!filter;
  return (
    <div
      className="flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4"
      data-ocid="notes-empty-state"
    >
      <div className="rounded-2xl bg-primary/10 p-5 mb-4">
        <StickyNote className="h-10 w-10 text-primary" />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-1.5">
        {isFiltered
          ? filter === "favorites"
            ? "No favorite notes yet"
            : "No matching notes"
          : "No notes yet"}
      </h3>
      <p className="text-muted-foreground text-sm max-w-xs mb-5">
        {isFiltered
          ? query
            ? `No notes match "${query}".`
            : filter === "favorites"
              ? "Star notes to access them quickly here."
              : `No notes tagged "${filter}".`
          : "Capture your thoughts and ideas. Create your first note to get started."}
      </p>
      {isFiltered ? (
        <Button variant="outline" onClick={onClear} size="sm" className="gap-2">
          <X className="h-3.5 w-3.5" /> Clear filters
        </Button>
      ) : (
        <Button
          asChild
          size="sm"
          className="gap-2 active-press"
          data-ocid="notes-empty-cta"
        >
          <Link to="/app/$workspaceId/notes/new" params={{ workspaceId }}>
            <Plus className="h-3.5 w-3.5" /> Create your first note
          </Link>
        </Button>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function NotesPage() {
  const { workspaceId } = useParams({ from: "/app/$workspaceId/notes" });
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { data: notes = [], isLoading } = useQuery<NoteExtended[]>({
    queryKey: ["notes", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listNotes(tenantId, workspaceId) as Promise<NoteExtended[]>;
    },
    enabled: !!actor && !isFetching,
  });

  const allTags = useMemo(() => {
    const s = new Set<string>();
    for (const n of notes) for (const t of n.tags) s.add(t);
    return Array.from(s).sort();
  }, [notes]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return notes.filter((n) => {
      const matchSearch =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q);
      const matchTag = !activeTag || n.tags.includes(activeTag);
      const matchFav = !showFavoritesOnly || !!(n as NoteExtended).isFavorite;
      return matchSearch && matchTag && matchFav;
    });
  }, [notes, search, activeTag, showFavoritesOnly]);

  const favCount = useMemo(
    () => notes.filter((n) => !!(n as NoteExtended).isFavorite).length,
    [notes],
  );

  // ── Mutations ──

  const duplicateMutation = useMutation({
    mutationFn: async (n: NoteExtended) => {
      if (!actor) throw new Error("Not connected");
      const input: NoteInput = {
        title: `${n.title} (copy)`,
        content: n.content,
        tags: n.tags,
        crossLinks: n.crossLinks,
      };
      const result = await actor.createNote(tenantId, workspaceId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", tenantId, workspaceId],
      });
      toast.success("Note duplicated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.deleteNote(tenantId, workspaceId, id);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", tenantId, workspaceId],
      });
      toast.success("Note deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleClearFilters = () => {
    setSearch("");
    setActiveTag(null);
    setShowFavoritesOnly(false);
  };

  return (
    <div className="animate-fade-in-up p-4 sm:p-6 space-y-4 sm:space-y-5 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-primary" />
            Notes
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {notes.length} note{notes.length !== 1 ? "s" : ""} in your workspace
            {favCount > 0 && (
              <span className="text-muted-foreground/60 ml-1.5">
                · {favCount} favorited
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 h-9 text-xs flex-1 sm:flex-none justify-center"
            data-ocid="notes-templates-btn"
          >
            <Link
              to="/app/$workspaceId/notes/templates"
              params={{ workspaceId }}
            >
              <LayoutTemplate className="h-3 w-3" /> Templates
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 h-9 text-xs flex-1 sm:flex-none justify-center"
            data-ocid="notes-pages-btn"
          >
            <Link to="/app/$workspaceId/pages" params={{ workspaceId }}>
              <FileText className="h-3 w-3" /> Pages
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="gap-1.5 h-9 text-xs flex-1 sm:flex-none justify-center active-press"
            data-ocid="notes-new-btn"
          >
            <Link to="/app/$workspaceId/notes/new" params={{ workspaceId }}>
              <Plus className="h-3.5 w-3.5" /> New Note
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-2.5">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-sm border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30 w-full"
            data-ocid="notes-search"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 items-center">
          {/* Favorites pill */}
          <button
            type="button"
            onClick={() => setShowFavoritesOnly((v) => !v)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-smooth border min-h-[32px] inline-flex items-center gap-1 ${
              showFavoritesOnly
                ? "bg-secondary text-secondary-foreground border-secondary"
                : "bg-muted/60 text-muted-foreground border-transparent hover:border-border hover:text-foreground"
            }`}
            data-ocid="favorites-filter-btn"
          >
            <Star
              className={`h-3 w-3 ${showFavoritesOnly ? "fill-secondary-foreground" : ""}`}
            />
            Favorites{favCount > 0 ? ` (${favCount})` : ""}
          </button>

          {allTags.length > 0 && (
            <>
              <Tag className="h-3 w-3 text-muted-foreground shrink-0" />
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  data-ocid={`tag-filter-${tag}`}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-smooth border min-h-[32px] ${
                    activeTag === tag
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/60 text-muted-foreground border-transparent hover:border-border hover:text-foreground"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </>
          )}

          {(showFavoritesOnly || activeTag || search) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5 min-h-[32px]"
              data-ocid="notes-clear-filters"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <GridSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          query={search}
          onClear={handleClearFilters}
          workspaceId={workspaceId}
          filter={showFavoritesOnly ? "favorites" : activeTag || ""}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              workspaceId={workspaceId}
              onFavorite={(_id, _current) => {
                // Optimistically toggle — backend may or may not support favorites
                // as a field; we just show UI feedback
                toast.info("Use the star in the note editor to favorite");
              }}
              onDuplicate={(n) => duplicateMutation.mutate(n)}
              onDelete={(id) => {
                if (window.confirm("Delete this note?"))
                  deleteMutation.mutate(id);
              }}
            />
          ))}
        </div>
      )}

      {/* Count footer when filtered */}
      {!isLoading &&
        filtered.length > 0 &&
        (search || activeTag || showFavoritesOnly) && (
          <p className="text-xs text-muted-foreground text-center pb-2">
            Showing {filtered.length} of {notes.length} note
            {notes.length !== 1 ? "s" : ""}
            {activeTag && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {activeTag}
              </Badge>
            )}
          </p>
        )}
    </div>
  );
}
