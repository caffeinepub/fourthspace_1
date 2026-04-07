import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BookOpen, Plus, Search, StickyNote, Tag, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { Note } from "../../types";

function NoteCard({ note }: { note: Note }) {
  const preview = note.content.slice(0, 120).trim();
  const date = new Date(Number(note.updatedAt) / 1_000_000).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" },
  );

  return (
    <Link
      to="/app/notes/$noteId"
      params={{ noteId: note.id }}
      data-ocid="note-card"
      className="group block rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-display font-semibold text-foreground text-base line-clamp-2 min-w-0 group-hover:text-primary transition-colors duration-200">
          {note.title}
        </h3>
        <BookOpen className="h-4 w-4 text-primary/60 shrink-0 mt-0.5" />
      </div>

      {preview && (
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
          {preview}
          {note.content.length > 120 && "…"}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 flex-wrap mt-auto">
        <div className="flex flex-wrap gap-1.5">
          {note.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-0"
            >
              {tag}
            </Badge>
          ))}
          {note.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              +{note.tags.length - 3}
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{date}</span>
      </div>

      {note.crossLinks.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/60">
          <span className="text-xs text-muted-foreground">
            {note.crossLinks.length} cross-link
            {note.crossLinks.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </Link>
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
  "sk-h",
];

function NotesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {SKELETON_KEYS.map((k) => (
        <div
          key={k}
          className="rounded-xl border border-border bg-card p-5 space-y-3"
        >
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 text-center"
      data-ocid="notes-empty-state"
    >
      <div className="rounded-2xl bg-primary/10 p-6 mb-5">
        <StickyNote className="h-12 w-12 text-primary" />
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground mb-2">
        {query ? "No matching notes" : "No notes yet"}
      </h3>
      <p className="text-muted-foreground text-sm max-w-xs mb-6">
        {query
          ? `No notes match "${query}". Try a different search or clear the filter.`
          : "Capture your thoughts, ideas, and knowledge. Create your first note to get started."}
      </p>
      {query ? (
        <Button variant="outline" onClick={onClear} className="gap-2">
          <X className="h-4 w-4" />
          Clear search
        </Button>
      ) : (
        <Button asChild className="gap-2" data-ocid="notes-empty-cta">
          <Link to="/app/notes/new">
            <Plus className="h-4 w-4" />
            Create your first note
          </Link>
        </Button>
      )}
    </div>
  );
}

export default function NotesPage() {
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ["notes", tenantId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listNotes(tenantId);
    },
    enabled: !!actor && !isFetching,
  });

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const n of notes) {
      for (const t of n.tags) {
        tagSet.add(t);
      }
    }
    return Array.from(tagSet).sort();
  }, [notes]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return notes.filter((n) => {
      const matchesSearch =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q);
      const matchesTag = !activeTag || n.tags.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [notes, search, activeTag]);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Notes
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {notes.length} note{notes.length !== 1 ? "s" : ""} in your workspace
          </p>
        </div>
        <Button asChild className="gap-2 shrink-0" data-ocid="notes-new-btn">
          <Link to="/app/notes/new">
            <Plus className="h-4 w-4" />
            New Note
          </Link>
        </Button>
      </div>

      {/* Search + Tag filters */}
      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search notes by title or content…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-ocid="notes-search"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {allTags.length > 0 && (
          <fieldset
            className="flex flex-wrap gap-2 items-center border-0 p-0 m-0"
            aria-label="Filter by tag"
          >
            <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                data-ocid={`tag-filter-${tag}`}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-smooth border ${
                  activeTag === tag
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-transparent hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {tag}
              </button>
            ))}
            {activeTag && (
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            )}
          </fieldset>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <NotesGridSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          query={search || activeTag || ""}
          onClear={() => {
            setSearch("");
            setActiveTag(null);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
