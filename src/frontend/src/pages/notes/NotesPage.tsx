import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  BookOpen,
  FileText,
  LayoutTemplate,
  Plus,
  Search,
  StickyNote,
  Tag,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { Note } from "../../types";

function NoteCard({ note, workspaceId }: { note: Note; workspaceId: string }) {
  const preview = note.content.slice(0, 100).trim();
  const date = new Date(Number(note.updatedAt) / 1_000_000).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric" },
  );

  return (
    <Link
      to="/app/$workspaceId/notes/$noteId"
      params={{ workspaceId, noteId: note.id }}
      data-ocid="note-card"
      className="group flex flex-col gap-2.5 rounded-xl border border-border/50 bg-card p-4 shadow-card card-interactive hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display font-semibold text-foreground text-sm line-clamp-2 min-w-0 leading-snug group-hover:text-primary transition-colors">
          {note.title}
        </h3>
        <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5 opacity-60" />
      </div>

      {preview && (
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {preview}
          {note.content.length > 100 && "…"}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 mt-auto pt-1 border-t border-border/40">
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
        <span className="text-xs text-muted-foreground shrink-0">{date}</span>
      </div>
    </Link>
  );
}

const SK = ["a", "b", "c", "d", "e", "f", "g", "h"];

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {SK.map((k) => (
        <div
          key={k}
          className="rounded-xl border border-border/50 bg-card p-4 space-y-2.5"
        >
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex gap-1.5 pt-1">
            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-4 w-14 rounded-full" />
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
}: { query: string; onClear: () => void; workspaceId: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4"
      data-ocid="notes-empty-state"
    >
      <div className="rounded-2xl bg-primary/10 p-5 mb-4">
        <StickyNote className="h-10 w-10 text-primary" />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-1.5">
        {query ? "No matching notes" : "No notes yet"}
      </h3>
      <p className="text-muted-foreground text-sm max-w-xs mb-5">
        {query
          ? `No notes match "${query}". Try a different search.`
          : "Capture your thoughts and ideas. Create your first note to get started."}
      </p>
      {query ? (
        <Button variant="outline" onClick={onClear} size="sm" className="gap-2">
          <X className="h-3.5 w-3.5" /> Clear search
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

export default function NotesPage() {
  const { workspaceId } = useParams({ from: "/app/$workspaceId/notes" });
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ["notes", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listNotes(tenantId, workspaceId);
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
      const matchesSearch =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q);
      const matchesTag = !activeTag || n.tags.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [notes, search, activeTag]);

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

      {/* Search + tag filters */}
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

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
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
            {activeTag && (
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5 min-h-[32px]"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <GridSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          query={search || activeTag || ""}
          onClear={() => {
            setSearch("");
            setActiveTag(null);
          }}
          workspaceId={workspaceId}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((note) => (
            <NoteCard key={note.id} note={note} workspaceId={workspaceId} />
          ))}
        </div>
      )}
    </div>
  );
}
