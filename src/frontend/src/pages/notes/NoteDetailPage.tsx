import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Edit2,
  ExternalLink,
  Link2,
  Loader2,
  Save,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CrossLinkPicker } from "../../components/CrossLinkPicker";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { CrossLink, Note, NoteInput } from "../../types";

const ENTITY_ROUTE_MAP: Record<string, string> = {
  note: "/app/notes",
  project: "/app/projects",
  task: "/app/projects",
  event: "/app/calendar",
  channel: "/app/chat",
  employee: "/app/payroll/employees",
  escrow: "/app/escrow",
};

function CrossLinkItem({ link }: { link: CrossLink }) {
  const basePath = ENTITY_ROUTE_MAP[link.entityType] ?? "/app";
  const href = `${basePath}/${link.entityId}`;

  return (
    <Link
      to={href as never}
      className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm hover:bg-muted hover:border-primary/40 transition-smooth group"
      data-ocid={`crosslink-item-${link.entityId}`}
    >
      <Link2 className="h-3.5 w-3.5 text-primary shrink-0" />
      <span className="min-w-0 flex-1 truncate text-foreground">
        {link.linkLabel}
      </span>
      <Badge variant="secondary" className="text-xs shrink-0">
        {link.entityType}
      </Badge>
      <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-smooth shrink-0" />
    </Link>
  );
}

function NoteDetailSkeleton() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-md" />
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export default function NoteDetailPage() {
  const { noteId } = useParams({ from: "/app/notes/$noteId" });
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTagInput, setEditTagInput] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editCrossLinks, setEditCrossLinks] = useState<CrossLink[]>([]);

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note | null>({
    queryKey: ["note", tenantId, noteId],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getNote(tenantId, noteId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    enabled: !!actor && !isFetching,
  });

  useEffect(() => {
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditTags([...note.tags]);
      setEditCrossLinks([...note.crossLinks]);
    }
  }, [note]);

  const { mutate: updateNote, isPending: isUpdating } = useMutation({
    mutationFn: async (input: NoteInput) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updateNote(tenantId, noteId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["note", tenantId, noteId], updated);
      queryClient.invalidateQueries({ queryKey: ["notes", tenantId] });
      toast.success("Note updated");
      setIsEditing(false);
    },
    onError: (err: Error) => {
      toast.error("Failed to update note", { description: err.message });
    },
  });

  const { mutate: deleteNote, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.deleteNote(tenantId, noteId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", tenantId] });
      toast.success("Note deleted");
      navigate({ to: "/app/notes" });
    },
    onError: (err: Error) => {
      toast.error("Failed to delete note", { description: err.message });
    },
  });

  const handleSave = () => {
    if (!editTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    updateNote({
      title: editTitle.trim(),
      content: editContent,
      tags: editTags,
      crossLinks: editCrossLinks,
    });
  };

  const handleCancelEdit = () => {
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditTags([...note.tags]);
      setEditCrossLinks([...note.crossLinks]);
    }
    setIsEditing(false);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTags = editTagInput
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0 && !editTags.includes(t));
      if (newTags.length > 0) setEditTags((prev) => [...prev, ...newTags]);
      setEditTagInput("");
    }
  };

  if (isLoading) return <NoteDetailSkeleton />;

  if (isError || !note) {
    return (
      <div className="p-6 lg:p-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/app/notes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium text-foreground mb-2">
            Note not found
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            This note may have been deleted or you don't have access to it.
          </p>
          <Button asChild variant="outline">
            <Link to="/app/notes">Back to Notes</Link>
          </Button>
        </div>
      </div>
    );
  }

  const createdDate = new Date(
    Number(note.createdAt) / 1_000_000,
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const updatedDate = new Date(
    Number(note.updatedAt) / 1_000_000,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link to="/app/notes" aria-label="Back to notes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          {!isEditing && (
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-bold text-foreground break-words">
                {note.title}
              </h1>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Created {createdDate}</span>
                {note.createdAt !== note.updatedAt && (
                  <span className="text-muted-foreground/60">
                    · Updated {updatedDate}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isEditing ? (
            <>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isUpdating || !editTitle.trim()}
                className="gap-2"
                data-ocid="note-save-edit-btn"
              >
                {isUpdating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                disabled={isUpdating}
                data-ocid="note-cancel-edit-btn"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="gap-2"
                data-ocid="note-edit-btn"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    data-ocid="note-delete-btn"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                    <AlertDialogDescription>
                      <strong>"{note.title}"</strong> will be permanently
                      deleted. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteNote()}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      data-ocid="note-delete-confirm-btn"
                    >
                      {isDeleting && (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      )}
                      Delete Note
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      {/* View Mode */}
      {!isEditing ? (
        <div className="space-y-6">
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              {note.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-primary/10 text-primary border-0 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="rounded-xl bg-card border border-border p-6">
            {note.content ? (
              <p className="text-foreground leading-relaxed whitespace-pre-wrap font-body text-sm">
                {note.content}
              </p>
            ) : (
              <p className="text-muted-foreground italic text-sm">
                No content — click Edit to add some.
              </p>
            )}
          </div>

          {note.crossLinks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">
                  Cross-links ({note.crossLinks.length})
                </h2>
              </div>
              <div className="space-y-2">
                {note.crossLinks.map((link, idx) => (
                  <CrossLinkItem key={`${link.entityId}-${idx}`} link={link} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Edit Mode */
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="edit-title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-base font-medium h-11"
              autoFocus
              required
              data-ocid="note-edit-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-content" className="text-sm font-medium">
              Content
            </Label>
            <Textarea
              id="edit-content"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[280px] resize-y leading-relaxed font-body"
              data-ocid="note-edit-content"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              Tags
            </Label>
            <div className="rounded-md border border-input bg-background p-3 space-y-2 focus-within:ring-2 focus-within:ring-ring">
              {editTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {editTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 pl-2 pr-1 bg-primary/10 text-primary border-0"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          setEditTags((prev) => prev.filter((t) => t !== tag))
                        }
                        aria-label={`Remove tag ${tag}`}
                        className="rounded-sm hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <Input
                placeholder="Add tags… (comma-separated)"
                value={editTagInput}
                onChange={(e) => setEditTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => {
                  if (editTagInput.trim()) {
                    const newTags = editTagInput
                      .split(",")
                      .map((t) => t.trim().toLowerCase())
                      .filter((t) => t.length > 0 && !editTags.includes(t));
                    if (newTags.length > 0)
                      setEditTags((prev) => [...prev, ...newTags]);
                    setEditTagInput("");
                  }
                }}
                className="border-0 px-0 h-8 focus-visible:ring-0 shadow-none bg-transparent"
                data-ocid="note-edit-tags"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Cross-links</Label>
            <div className="rounded-md border border-input bg-background p-4">
              <CrossLinkPicker
                tenantId={tenantId}
                value={editCrossLinks}
                onChange={setEditCrossLinks}
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
