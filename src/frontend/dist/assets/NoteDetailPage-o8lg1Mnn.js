import { m as useParams, f as useWorkspace, d as useNavigate, n as useQueryClient, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, s as ChevronDown, X, C as Check } from "./index-DemOGW1B.js";
import { A as AlertDialog, a as AlertDialogTrigger, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-BlMvH9cn.js";
import { I as Input } from "./input-1iXuA55D.js";
import { L as Label } from "./label-mmRgUQzR.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-BPsRruq-.js";
import { S as Skeleton } from "./skeleton-M5HtR2mS.js";
import { T as Textarea } from "./textarea-DdbmcPlU.js";
import { u as useMutation } from "./useMutation-4TvYOXEz.js";
import { u as ue } from "./index-BBpqu5x7.js";
import { C as CrossLinkPicker } from "./CrossLinkPicker-Hq1KNb7a.js";
import { u as useBackend } from "./index-CeqQA3r7.js";
import { A as ArrowLeft } from "./arrow-left-lpbCbWBz.js";
import { C as Calendar } from "./calendar-Cfj8q013.js";
import { L as LoaderCircle } from "./loader-circle-DNkeklbO.js";
import { S as Save } from "./save-_P0zvLPW.js";
import { P as Pen } from "./pen-DRNa4kxD.js";
import { T as Trash2 } from "./trash-2-UJLUw61l.js";
import { T as Tag } from "./tag-zZZWEqNo.js";
import { L as Link2 } from "./link-2-CeDyFl-9.js";
import { E as ExternalLink } from "./external-link-BGpFW10O.js";
import "./index-BTkz9mih.js";
import "./badge-BgvX66QS.js";
import "./search-CqVwSPFD.js";
const COVER_GRADIENTS = [
  {
    id: "indigo-purple",
    label: "Indigo to Purple",
    value: "from-indigo-500 via-purple-500 to-pink-500"
  },
  {
    id: "ocean",
    label: "Ocean",
    value: "from-cyan-500 via-blue-500 to-indigo-600"
  },
  {
    id: "sunset",
    label: "Sunset",
    value: "from-orange-400 via-rose-500 to-pink-600"
  },
  {
    id: "forest",
    label: "Forest",
    value: "from-emerald-400 via-teal-500 to-cyan-600"
  },
  {
    id: "golden",
    label: "Golden",
    value: "from-yellow-400 via-orange-400 to-red-500"
  },
  {
    id: "midnight",
    label: "Midnight",
    value: "from-slate-700 via-purple-800 to-slate-900"
  }
];
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
  "🐬"
];
function formatRelativeTime(nsTimestamp) {
  const ms = Number(nsTimestamp) / 1e6;
  const diff = Date.now() - ms;
  const secs = Math.floor(diff / 1e3);
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
    year: "numeric"
  });
}
function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function CrossLinkItem({ link }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-2.5 rounded-lg border border-border/50 bg-muted/40 px-3 py-2 text-sm group",
      "data-ocid": `crosslink-item-${link.entityId}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3 w-3 text-primary shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 flex-1 truncate text-foreground text-xs", children: link.linkLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground shrink-0", children: link.entityType }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-smooth shrink-0" })
      ]
    }
  );
}
function SaveIndicator({ status }) {
  if (status === "idle") return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center gap-1 text-xs transition-all duration-300 ${status === "saved" ? "text-accent" : "text-muted-foreground"}`,
      children: status === "saving" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }),
        " Saving…"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }),
        " Saved"
      ] })
    }
  );
}
function PresenceBar({ editors }) {
  if (editors.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-2 py-1.5",
      "data-ocid": "note-presence-bar",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex -space-x-1.5", children: editors.slice(0, 5).map((ed) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            title: `${ed.displayName} is viewing`,
            className: "relative h-6 w-6 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-primary leading-none", children: getInitials(ed.displayName) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent border border-background",
                  "aria-label": "Active"
                }
              )
            ]
          },
          ed.userId.toString()
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: editors.length === 1 ? `${editors[0].displayName} is viewing` : `${editors.length} people viewing` })
      ]
    }
  );
}
function NoteDetailPage() {
  const { workspaceId, noteId } = useParams({
    from: "/app/$workspaceId/notes/$noteId"
  });
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [editTitle, setEditTitle] = reactExports.useState("");
  const [editContent, setEditContent] = reactExports.useState("");
  const [editTagInput, setEditTagInput] = reactExports.useState("");
  const [editTags, setEditTags] = reactExports.useState([]);
  const [editCrossLinks, setEditCrossLinks] = reactExports.useState([]);
  const [cover, setCover] = reactExports.useState("");
  const [icon, setIcon] = reactExports.useState("");
  const [showCoverPicker, setShowCoverPicker] = reactExports.useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = reactExports.useState(false);
  const [saveStatus, setSaveStatus] = reactExports.useState("idle");
  const debounceRef = reactExports.useRef(null);
  const [activeEditors, setActiveEditors] = reactExports.useState([]);
  const [lastEdit, setLastEdit] = reactExports.useState(null);
  const presenceIntervalRef = reactExports.useRef(
    null
  );
  const {
    data: note,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["note", tenantId, workspaceId, noteId],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getNote(tenantId, workspaceId, noteId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    enabled: !!actor && !isFetching
  });
  reactExports.useEffect(() => {
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditTags([...note.tags]);
      setEditCrossLinks([...note.crossLinks]);
      const noteWithMeta = note;
      if (noteWithMeta.coverGradient) setCover(noteWithMeta.coverGradient);
      if (noteWithMeta.iconEmoji) setIcon(noteWithMeta.iconEmoji);
    }
  }, [note]);
  reactExports.useEffect(() => {
    if (!actor || !noteId || isFetching) return;
    actor.getLastNoteEdit(tenantId, workspaceId, noteId).then((result) => {
      if (result)
        setLastEdit({
          displayName: result.displayName,
          editedAt: result.editedAt
        });
    }).catch(() => {
    });
  }, [actor, tenantId, workspaceId, noteId, isFetching]);
  reactExports.useEffect(() => {
    if (!actor || !noteId || isFetching) return;
    const updatePresence = async () => {
      try {
        const profile = await actor.getMyProfile(tenantId);
        const displayName = profile ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() || "Anonymous" : "Anonymous";
        await actor.updateNotePresence(
          tenantId,
          workspaceId,
          noteId,
          displayName
        );
        const editors = await actor.getNoteActiveEditors(
          tenantId,
          workspaceId,
          noteId
        );
        setActiveEditors(editors);
      } catch {
      }
    };
    updatePresence();
    presenceIntervalRef.current = setInterval(updatePresence, 5e3);
    return () => {
      if (presenceIntervalRef.current)
        clearInterval(presenceIntervalRef.current);
    };
  }, [actor, tenantId, workspaceId, noteId, isFetching]);
  const { mutate: updateNote, isPending: isUpdating } = useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updateNote(
        tenantId,
        workspaceId,
        noteId,
        input
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onMutate: () => setSaveStatus("saving"),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        ["note", tenantId, workspaceId, noteId],
        updated
      );
      queryClient.invalidateQueries({
        queryKey: ["notes", tenantId, workspaceId]
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3e3);
      setIsEditing(false);
      if (actor) {
        actor.getLastNoteEdit(tenantId, workspaceId, noteId).then((r) => {
          if (r)
            setLastEdit({ displayName: r.displayName, editedAt: r.editedAt });
        }).catch(() => {
        });
      }
    },
    onError: (err) => {
      setSaveStatus("idle");
      ue.error("Failed to update note", { description: err.message });
    }
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
        queryKey: ["notes", tenantId, workspaceId]
      });
      ue.success("Note deleted");
      navigate({ to: "/app/$workspaceId/notes", params: { workspaceId } });
    },
    onError: (err) => ue.error("Failed to delete note", { description: err.message })
  });
  const handleSave = reactExports.useCallback(() => {
    if (!editTitle.trim()) {
      ue.error("Title is required");
      return;
    }
    const payload = {
      title: editTitle.trim(),
      content: editContent,
      tags: editTags,
      crossLinks: editCrossLinks
    };
    if (cover) {
      payload.coverGradient = cover;
    }
    if (icon) {
      payload.iconEmoji = icon;
    }
    updateNote(payload);
  }, [
    editTitle,
    editContent,
    editTags,
    editCrossLinks,
    cover,
    icon,
    updateNote
  ]);
  const handleSaveRef = reactExports.useRef(handleSave);
  reactExports.useEffect(() => {
    handleSaveRef.current = handleSave;
  }, [handleSave]);
  reactExports.useEffect(() => {
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
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTags = editTagInput.split(",").map((t) => t.trim().toLowerCase()).filter((t) => t.length > 0 && !editTags.includes(t));
      if (newTags.length > 0) setEditTags((prev) => [...prev, ...newTags]);
      setEditTagInput("");
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 max-w-3xl space-y-5 pb-20 md:pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 rounded-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-48" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-32" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Skeleton,
        {
          className: `h-3.5 ${n % 2 === 0 ? "w-4/5" : "w-full"}`
        },
        n
      )) })
    ] });
  }
  if (isError || !note) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 max-w-3xl pb-20 md:pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/$workspaceId/notes", params: { workspaceId }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium text-foreground mb-1.5", children: "Note not found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-5", children: "This note may have been deleted." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/$workspaceId/notes", params: { workspaceId }, children: "Back to Notes" }) })
      ] })
    ] });
  }
  const createdDate = new Date(
    Number(note.createdAt) / 1e6
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  const updatedDate = new Date(
    Number(note.updatedAt) / 1e6
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const activeCover = COVER_GRADIENTS.find((c) => c.id === cover);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up pb-20 md:pb-8", children: [
    activeCover ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `relative h-40 sm:h-48 bg-gradient-to-r ${activeCover.value} rounded-t-xl overflow-hidden mb-0 group`,
        "data-ocid": "note-cover-banner",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex items-end justify-between px-4 pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "secondary",
              className: "text-xs h-7 gap-1.5 bg-background/80 backdrop-blur-sm",
              onClick: () => setShowCoverPicker(true),
              "data-ocid": "note-change-cover-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" }),
                " Change cover"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "secondary",
              className: "text-xs h-7 bg-background/80 backdrop-blur-sm",
              onClick: () => {
                setCover("");
                setShowCoverPicker(false);
              },
              children: "Remove"
            }
          )
        ] })
      }
    ) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 max-w-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              asChild: true,
              className: "shrink-0 h-9 w-9 min-h-[44px] min-w-[44px]",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/app/$workspaceId/notes",
                  params: { workspaceId },
                  "aria-label": "Back to notes",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
                }
              )
            }
          ),
          !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex items-start gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Popover,
              {
                open: showEmojiPicker,
                onOpenChange: setShowEmojiPicker,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "shrink-0 text-2xl h-9 w-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors",
                      "aria-label": "Set note icon",
                      "data-ocid": "note-icon-btn",
                      children: icon || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 text-sm font-medium", children: "+" })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(PopoverContent, { className: "w-64 p-2", align: "start", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground mb-2 px-1", children: "Pick an icon" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-10 gap-0.5", children: COMMON_EMOJIS.map((emoji) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setIcon(emoji);
                          setShowEmojiPicker(false);
                        },
                        className: "h-7 w-7 flex items-center justify-center rounded text-lg hover:bg-muted transition-colors",
                        children: emoji
                      },
                      emoji
                    )) }),
                    icon && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setIcon("");
                          setShowEmojiPicker(false);
                        },
                        className: "mt-2 w-full text-xs text-muted-foreground hover:text-foreground text-center py-1",
                        children: "Remove icon"
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg sm:text-xl font-bold text-foreground break-words tracking-tight", children: note.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Created ",
                  createdDate
                ] }),
                note.createdAt !== note.updatedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground/60", children: [
                  "· Updated ",
                  updatedDate
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SaveIndicator, { status: saveStatus }),
          isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                onClick: handleSave,
                disabled: isUpdating || !editTitle.trim(),
                className: "gap-1.5 h-9 text-xs active-press min-h-[44px]",
                "data-ocid": "note-save-edit-btn",
                children: [
                  isUpdating ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3 w-3" }),
                  "Save"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                onClick: handleCancelEdit,
                disabled: isUpdating,
                className: "h-9 text-xs min-h-[44px]",
                "data-ocid": "note-cancel-edit-btn",
                children: "Cancel"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            !activeCover && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Popover,
              {
                open: showCoverPicker,
                onOpenChange: setShowCoverPicker,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      className: "h-9 text-xs min-h-[44px] text-muted-foreground",
                      "data-ocid": "note-add-cover-btn",
                      children: "Add cover"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(PopoverContent, { className: "w-64 p-3", align: "end", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground mb-2", children: "Choose a gradient" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: COVER_GRADIENTS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setCover(g.id);
                          setShowCoverPicker(false);
                        },
                        className: `h-10 rounded-lg bg-gradient-to-r ${g.value} hover:ring-2 hover:ring-primary/60 transition-all ${cover === g.id ? "ring-2 ring-primary" : ""}`,
                        "aria-label": g.label
                      },
                      g.id
                    )) })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => setIsEditing(true),
                className: "gap-1.5 h-9 text-xs min-h-[44px]",
                "data-ocid": "note-edit-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3 w-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Edit" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  className: "gap-1.5 h-9 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 min-h-[44px]",
                  "data-ocid": "note-delete-btn",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "mx-4 max-w-sm sm:max-w-md", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this note?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                      '"',
                      note.title,
                      '"'
                    ] }),
                    " will be permanently deleted."
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { className: "flex-col-reverse sm:flex-row gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "w-full sm:w-auto", children: "Cancel" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    AlertDialogAction,
                    {
                      onClick: () => deleteNote(),
                      disabled: isDeleting,
                      className: "bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto",
                      "data-ocid": "note-delete-confirm-btn",
                      children: [
                        isDeleting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-2" }),
                        " ",
                        "Delete"
                      ]
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PresenceBar, { editors: activeEditors }),
      !isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 mt-2", children: [
        note.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3 w-3 text-muted-foreground" }),
          note.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary",
              children: tag
            },
            tag
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-card border border-border/50 p-4 sm:p-6 shadow-card", children: note.content ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground leading-relaxed whitespace-pre-wrap font-body text-sm", children: note.content }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground italic text-sm", children: "No content — click Edit to add some." }) }),
        note.crossLinks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground", children: [
              "Cross-links (",
              note.crossLinks.length,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: note.crossLinks.map((link, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            CrossLinkItem,
            {
              link
            },
            `${link.entityId}-${idx}`
          )) })
        ] }),
        lastEdit && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "pt-4 border-t border-border/40",
            "data-ocid": "note-last-edited-footer",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Last edited by",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: lastEdit.displayName }),
              " · ",
              formatRelativeTime(lastEdit.editedAt)
            ] })
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "form",
        {
          onSubmit: (e) => {
            e.preventDefault();
            handleSave();
          },
          className: "space-y-5 mt-2",
          noValidate: true,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "edit-title",
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                  children: [
                    "Title ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "edit-title",
                  value: editTitle,
                  onChange: (e) => setEditTitle(e.target.value),
                  className: "text-base font-medium h-11 border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30",
                  autoFocus: true,
                  required: true,
                  "data-ocid": "note-edit-title"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "edit-content",
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                  children: "Content"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "edit-content",
                  value: editContent,
                  onChange: (e) => setEditContent(e.target.value),
                  className: "min-h-[240px] sm:min-h-[280px] resize-y leading-relaxed font-body border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30",
                  "data-ocid": "note-edit-content"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3 w-3" }),
                " Tags"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/60 bg-background p-3 space-y-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30", children: [
                editTags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: editTags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary",
                    children: [
                      tag,
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setEditTags((prev) => prev.filter((t) => t !== tag)),
                          "aria-label": `Remove tag ${tag}`,
                          className: "rounded-sm hover:text-destructive min-h-[24px] min-w-[24px] flex items-center justify-center",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-2.5 w-2.5" })
                        }
                      )
                    ]
                  },
                  tag
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "Add tags… (comma-separated)",
                    value: editTagInput,
                    onChange: (e) => setEditTagInput(e.target.value),
                    onKeyDown: handleTagKeyDown,
                    onBlur: () => {
                      if (editTagInput.trim()) {
                        const newTags = editTagInput.split(",").map((t) => t.trim().toLowerCase()).filter((t) => t.length > 0 && !editTags.includes(t));
                        if (newTags.length > 0)
                          setEditTags((prev) => [...prev, ...newTags]);
                        setEditTagInput("");
                      }
                    },
                    className: "border-0 px-0 h-7 focus-visible:ring-0 shadow-none bg-transparent text-sm",
                    "data-ocid": "note-edit-tags"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Cross-links" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border/60 bg-background p-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                CrossLinkPicker,
                {
                  tenantId,
                  value: editCrossLinks,
                  onChange: setEditCrossLinks
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2 sm:hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "submit",
                  size: "sm",
                  disabled: isUpdating || !editTitle.trim(),
                  className: "flex-1 gap-1.5 active-press",
                  children: [
                    isUpdating ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3 w-3" }),
                    "Save Note"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  onClick: handleCancelEdit,
                  disabled: isUpdating,
                  className: "flex-1",
                  children: "Cancel"
                }
              )
            ] })
          ]
        }
      )
    ] })
  ] });
}
export {
  NoteDetailPage as default
};
