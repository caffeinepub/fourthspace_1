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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  Edit2,
  ExternalLink,
  Link2,
  Loader2,
  Save,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CrossLinkPicker } from "../../components/CrossLinkPicker";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type {
  CrossLink,
  Note,
  NoteEditorPresence,
  NoteInput,
} from "../../types";

// ── Cover gradient presets ────────────────────────────────────────────────────

const COVER_GRADIENTS = [
  {
    id: "indigo-purple",
    label: "Indigo to Purple",
    value: "from-indigo-500 via-purple-500 to-pink-500",
  },
  {
    id: "ocean",
    label: "Ocean",
    value: "from-cyan-500 via-blue-500 to-indigo-600",
  },
  {
    id: "sunset",
    label: "Sunset",
    value: "from-orange-400 via-rose-500 to-pink-600",
  },
  {
    id: "forest",
    label: "Forest",
    value: "from-emerald-400 via-teal-500 to-cyan-600",
  },
  {
    id: "golden",
    label: "Golden",
    value: "from-yellow-400 via-orange-400 to-red-500",
  },
  {
    id: "midnight",
    label: "Midnight",
    value: "from-slate-700 via-purple-800 to-slate-900",
  },
];

// ── Common emoji set ──────────────────────────────────────────────────────────

const COMMON_EMOJIS = [
  "📝",
  "📋",
  "📚",
  "📌",
  "📎",
  "🔖",
  "💡",
  "🎯",
  "🚀",
  "⭐",
  "✅",
  "🔥",
  "💬",
  "🎨",
  "🔍",
  "📊",
  "🗓️",
  "📁",
  "🔑",
  "💻",
  "🌟",
  "🏆",
  "📧",
  "🔔",
  "⚡",
  "🎉",
  "🌈",
  "💎",
  "🎸",
  "🌿",
  "🦋",
  "🌺",
  "☕",
  "🍀",
  "🔮",
  "🎭",
  "🌙",
  "☀️",
  "🦁",
  "🐬",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRelativeTime(nsTimestamp: bigint): string {
  const ms = Number(nsTimestamp) / 1_000_000;
  const diff = Date.now() - ms;
  const secs = Math.floor(diff / 1000);
  if (secs < 30) return "just now";
  if (secs < 60) return `${secs} seconds ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

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

// ── Save status indicator ─────────────────────────────────────────────────────

type SaveStatus = "idle" | "saving" | "saved";

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs transition-all duration-300 ${status === "saved" ? "text-accent" : "text-muted-foreground"}`}
    >
      {status === "saving" ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" /> Saving…
        </>
      ) : (
        <>
          <Check className="h-3 w-3" /> Saved
        </>
      )}
    </span>
  );
}

// ── Presence bar ──────────────────────────────────────────────────────────────

function PresenceBar({ editors }: { editors: NoteEditorPresence[] }) {
  if (editors.length === 0) return null;
  return (
    <div
      className="flex items-center gap-2 py-1.5"
      data-ocid="note-presence-bar"
    >
      <div className="flex -space-x-1.5">
        {editors.slice(0, 5).map((ed) => (
          <div
            key={ed.userId.toString()}
            title={`${ed.displayName} is viewing`}
            className="relative h-6 w-6 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center"
          >
            <span className="text-[9px] font-bold text-primary leading-none">
              {getInitials(ed.displayName)}
            </span>
            <span
              className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent border border-background"
              aria-label="Active"
            />
          </div>
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {editors.length === 1
          ? `${editors[0].displayName} is viewing`
          : `${editors.length} people viewing`}
      </span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

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

  // Cover & icon
  const [cover, setCover] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Save status
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Presence
  const [activeEditors, setActiveEditors] = useState<NoteEditorPresence[]>([]);
  const [lastEdit, setLastEdit] = useState<{
    displayName: string;
    editedAt: bigint;
  } | null>(null);
  const presenceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

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
      // Seed cover gradient and emoji icon from persisted note data when available
      const noteWithMeta = note as Note & {
        coverGradient?: string;
        iconEmoji?: string;
      };
      if (noteWithMeta.coverGradient) setCover(noteWithMeta.coverGradient);
      if (noteWithMeta.iconEmoji) setIcon(noteWithMeta.iconEmoji);
    }
  }, [note]);

  // Fetch last edit info on load
  useEffect(() => {
    if (!actor || !noteId || isFetching) return;
    actor
      .getLastNoteEdit(tenantId, workspaceId, noteId)
      .then((result) => {
        if (result)
          setLastEdit({
            displayName: result.displayName,
            editedAt: result.editedAt,
          });
      })
      .catch(() => {});
  }, [actor, tenantId, workspaceId, noteId, isFetching]);

  // Presence polling: update every 5s while visible
  useEffect(() => {
    if (!actor || !noteId || isFetching) return;

    const updatePresence = async () => {
      try {
        const profile = await actor.getMyProfile(tenantId);
        const displayName = profile
          ? `${(profile as { firstName?: string }).firstName ?? ""} ${(profile as { lastName?: string }).lastName ?? ""}`.trim() ||
            "Anonymous"
          : "Anonymous";
        await actor.updateNotePresence(
          tenantId,
          workspaceId,
          noteId,
          displayName,
        );
        const editors = await actor.getNoteActiveEditors(
          tenantId,
          workspaceId,
          noteId,
        );
        setActiveEditors(editors);
      } catch {
        // presence is best-effort
      }
    };

    updatePresence();
    presenceIntervalRef.current = setInterval(updatePresence, 5000);
    return () => {
      if (presenceIntervalRef.current)
        clearInterval(presenceIntervalRef.current);
    };
  }, [actor, tenantId, workspaceId, noteId, isFetching]);

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
    onMutate: () => setSaveStatus("saving"),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        ["note", tenantId, workspaceId, noteId],
        updated,
      );
      queryClient.invalidateQueries({
        queryKey: ["notes", tenantId, workspaceId],
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
      setIsEditing(false);
      // Refresh last edit
      if (actor) {
        actor
          .getLastNoteEdit(tenantId, workspaceId, noteId)
          .then((r) => {
            if (r)
              setLastEdit({ displayName: r.displayName, editedAt: r.editedAt });
          })
          .catch(() => {});
      }
    },
    onError: (err: Error) => {
      setSaveStatus("idle");
      toast.error("Failed to update note", { description: err.message });
    },
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

  const handleSave = useCallback(() => {
    if (!editTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    // Build the base payload (always valid against NoteInput)
    const payload: NoteInput = {
      title: editTitle.trim(),
      content: editContent,
      tags: editTags,
      crossLinks: editCrossLinks,
    };
    // Attach cover gradient and icon emoji when backend supports them
    if (cover) {
      (payload as NoteInput & { coverGradient?: string }).coverGradient = cover;
    }
    if (icon) {
      (payload as NoteInput & { iconEmoji?: string }).iconEmoji = icon;
    }
    updateNote(payload);
  }, [
    editTitle,
    editContent,
    editTags,
    editCrossLinks,
    cover,
    icon,
    updateNote,
  ]);

  // Autosave with 1.5s debounce — use ref to avoid stale closure
  const handleSaveRef = useRef(handleSave);
  useEffect(() => {
    handleSaveRef.current = handleSave;
  }, [handleSave]);

  useEffect(() => {
    if (!isEditing) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (editTitle.trim()) handleSaveRef.current();
    }, 1500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [editTitle, isEditing]);

  const handleCancelEdit = () => {
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditTags([...note.tags]);
      setEditCrossLinks([...note.crossLinks]);
    }
    setIsEditing(false);
    setSaveStatus("idle");
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

  const activeCover = COVER_GRADIENTS.find((c) => c.id === cover);

  return (
    <div className="animate-fade-in-up pb-20 md:pb-8">
      {/* Cover image banner */}
      {activeCover ? (
        <div
          className={`relative h-40 sm:h-48 bg-gradient-to-r ${activeCover.value} rounded-t-xl overflow-hidden mb-0 group`}
          data-ocid="note-cover-banner"
        >
          <div className="absolute inset-0 flex items-end justify-between px-4 pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="secondary"
              className="text-xs h-7 gap-1.5 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowCoverPicker(true)}
              data-ocid="note-change-cover-btn"
            >
              <ChevronDown className="h-3 w-3" /> Change cover
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="text-xs h-7 bg-background/80 backdrop-blur-sm"
              onClick={() => {
                setCover("");
                setShowCoverPicker(false);
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : null}

      <div className="p-4 sm:p-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
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
              <div className="min-w-0 flex items-start gap-2.5">
                {/* Emoji icon */}
                <Popover
                  open={showEmojiPicker}
                  onOpenChange={setShowEmojiPicker}
                >
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="shrink-0 text-2xl h-9 w-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                      aria-label="Set note icon"
                      data-ocid="note-icon-btn"
                    >
                      {icon || (
                        <span className="text-muted-foreground/50 text-sm font-medium">
                          +
                        </span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2" align="start">
                    <p className="text-xs font-medium text-muted-foreground mb-2 px-1">
                      Pick an icon
                    </p>
                    <div className="grid grid-cols-10 gap-0.5">
                      {COMMON_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            setIcon(emoji);
                            setShowEmojiPicker(false);
                          }}
                          className="h-7 w-7 flex items-center justify-center rounded text-lg hover:bg-muted transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    {icon && (
                      <button
                        type="button"
                        onClick={() => {
                          setIcon("");
                          setShowEmojiPicker(false);
                        }}
                        className="mt-2 w-full text-xs text-muted-foreground hover:text-foreground text-center py-1"
                      >
                        Remove icon
                      </button>
                    )}
                  </PopoverContent>
                </Popover>

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
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <SaveIndicator status={saveStatus} />
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
                {!activeCover && (
                  <Popover
                    open={showCoverPicker}
                    onOpenChange={setShowCoverPicker}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-9 text-xs min-h-[44px] text-muted-foreground"
                        data-ocid="note-add-cover-btn"
                      >
                        Add cover
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3" align="end">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Choose a gradient
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {COVER_GRADIENTS.map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => {
                              setCover(g.id);
                              setShowCoverPicker(false);
                            }}
                            className={`h-10 rounded-lg bg-gradient-to-r ${g.value} hover:ring-2 hover:ring-primary/60 transition-all ${cover === g.id ? "ring-2 ring-primary" : ""}`}
                            aria-label={g.label}
                          />
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="gap-1.5 h-9 text-xs min-h-[44px]"
                  data-ocid="note-edit-btn"
                >
                  <Edit2 className="h-3 w-3" />
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

        {/* Presence bar */}
        <PresenceBar editors={activeEditors} />

        {!isEditing ? (
          <div className="space-y-5 mt-2">
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
                    <CrossLinkItem
                      key={`${link.entityId}-${idx}`}
                      link={link}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Last edited footer */}
            {lastEdit && (
              <div
                className="pt-4 border-t border-border/40"
                data-ocid="note-last-edited-footer"
              >
                <p className="text-xs text-muted-foreground">
                  Last edited by{" "}
                  <span className="text-foreground font-medium">
                    {lastEdit.displayName}
                  </span>
                  {" · "}
                  {formatRelativeTime(lastEdit.editedAt)}
                </p>
              </div>
            )}
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-5 mt-2"
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
    </div>
  );
}
