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

function CrossLinkItem({ link }: { link: CrossLink }) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-muted/40 px-3 py-2 text-sm group"
      data-ocid={`crosslink-item-${link.entityId}`}
    >
      <Link2 className="h-3 w-3 text-primary shrink-0" />
      <span className="min-w-0 flex-1 truncate text-foreground text-xs">
        {link.linkLabel}
      </span>
      <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground shrink-0">
        {link.entityType}
      </span>
      <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-smooth shrink-0" />
    </div>
  );
}

export default function NoteDetailPage() {
  const { workspaceId, noteId } = useParams({
    from: "/app/$workspaceId/notes/$noteId",
  });
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
    queryKey: ["note", tenantId, workspaceId, noteId],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getNote(tenantId, workspaceId, noteId);
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
      const result = await actor.updateNote(
        tenantId,
        workspaceId,
        noteId,
        input,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(
        ["note", tenantId, workspaceId, noteId],
        updated,
      );
      queryClient.invalidateQueries({
        queryKey: ["notes", tenantId, workspaceId],
      });
      toast.success("Note updated");
      setIsEditing(false);
    },
    onError: (err: Error) =>
      toast.error("Failed to update note", { description: err.message }),
  });

  const { mutate: deleteNote, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.deleteNote(tenantId, workspaceId, noteId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", tenantId, workspaceId],
      });
      toast.success("Note deleted");
      navigate({ to: "/app/$workspaceId/notes", params: { workspaceId } });
    },
    onError: (err: Error) =>
      toast.error("Failed to delete note", { description: err.message }),
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

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-3xl space-y-5 pb-20 md:pb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-3.5 w-32" />
          </div>
        </div>
        <div className="space-y-2.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Skeleton
              key={n}
              className={`h-3.5 ${n % 2 === 0 ? "w-4/5" : "w-full"}`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !note) {
    return (
      <div className="p-4 sm:p-6 max-w-3xl pb-20 md:pb-6">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/app/$workspaceId/notes" params={{ workspaceId }}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-base font-medium text-foreground mb-1.5">
            Note not found
          </p>
          <p className="text-muted-foreground text-sm mb-5">
            This note may have been deleted.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/app/$workspaceId/notes" params={{ workspaceId }}>
              Back to Notes
            </Link>
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
    <div className="animate-fade-in-up p-4 sm:p-6 max-w-3xl pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="shrink-0 h-9 w-9 min-h-[44px] min-w-[44px]"
          >
            <Link
              to="/app/$workspaceId/notes"
              params={{ workspaceId }}
              aria-label="Back to notes"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          {!isEditing && (
            <div className="min-w-0">
              <h1 className="font-display text-lg sm:text-xl font-bold text-foreground break-words tracking-tight">
                {note.title}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground flex-wrap">
                <Calendar className="h-3 w-3 shrink-0" />
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
        <div className="flex items-center gap-1 shrink-0">
          {isEditing ? (
            <>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isUpdating || !editTitle.trim()}
                className="gap-1.5 h-9 text-xs active-press min-h-[44px]"
                data-ocid="note-save-edit-btn"
              >
                {isUpdating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Save className="h-3 w-3" />
                )}
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="h-9 text-xs min-h-[44px]"
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
                className="gap-1.5 h-9 text-xs min-h-[44px]"
                data-ocid="note-edit-btn"
              >
                <Edit2 className="h-3 w-3" />{" "}
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1.5 h-9 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 min-h-[44px]"
                    data-ocid="note-delete-btn"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="mx-4 max-w-sm sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                    <AlertDialogDescription>
                      <strong>"{note.title}"</strong> will be permanently
                      deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
                    <AlertDialogCancel className="w-full sm:w-auto">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteNote()}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
                      data-ocid="note-delete-confirm-btn"
                    >
                      {isDeleting && (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      )}{" "}
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      {!isEditing ? (
        <div className="space-y-5">
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <Tag className="h-3 w-3 text-muted-foreground" />
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="rounded-xl bg-card border border-border/50 p-4 sm:p-6 shadow-card">
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
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">
                  Cross-links ({note.crossLinks.length})
                </h2>
              </div>
              <div className="space-y-1.5">
                {note.crossLinks.map((link, idx) => (
                  <CrossLinkItem key={`${link.entityId}-${idx}`} link={link} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-5"
          noValidate
        >
          <div className="space-y-1.5">
            <Label
              htmlFor="edit-title"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-base font-medium h-11 border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
              autoFocus
              required
              data-ocid="note-edit-title"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="edit-content"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Content
            </Label>
            <Textarea
              id="edit-content"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[240px] sm:min-h-[280px] resize-y leading-relaxed font-body border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
              data-ocid="note-edit-content"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Tag className="h-3 w-3" /> Tags
            </Label>
            <div className="rounded-lg border border-border/60 bg-background p-3 space-y-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30">
              {editTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {editTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          setEditTags((prev) => prev.filter((t) => t !== tag))
                        }
                        aria-label={`Remove tag ${tag}`}
                        className="rounded-sm hover:text-destructive min-h-[24px] min-w-[24px] flex items-center justify-center"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
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
                className="border-0 px-0 h-7 focus-visible:ring-0 shadow-none bg-transparent text-sm"
                data-ocid="note-edit-tags"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cross-links
            </Label>
            <div className="rounded-lg border border-border/60 bg-background p-3.5">
              <CrossLinkPicker
                tenantId={tenantId}
                value={editCrossLinks}
                onChange={setEditCrossLinks}
              />
            </div>
          </div>
          {/* Mobile save button */}
          <div className="flex gap-2 pt-2 sm:hidden">
            <Button
              type="submit"
              size="sm"
              disabled={isUpdating || !editTitle.trim()}
              className="flex-1 gap-1.5 active-press"
            >
              {isUpdating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Save className="h-3 w-3" />
              )}
              Save Note
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isUpdating}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
