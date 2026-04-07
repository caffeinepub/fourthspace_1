import { b as useParams, c as useWorkspace, a as useNavigate, d as useQueryClient, r as reactExports, e as useQuery, j as jsxRuntimeExports, B as Button, f as Link, X } from "./index-D7inqmxR.js";
import { A as AlertDialog, a as AlertDialogTrigger, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-BaULY9v5.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { I as Input } from "./input-C0aO0R3D.js";
import { L as Label } from "./label-CBtn2p-5.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { T as Textarea } from "./textarea-DoR08WA4.js";
import { u as useMutation } from "./useMutation-BeBnUQJD.js";
import { u as ue } from "./index-p-k3Ndic.js";
import { C as CrossLinkPicker } from "./CrossLinkPicker-BbxKwuNH.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { A as ArrowLeft } from "./arrow-left-mNBAKt8w.js";
import { C as Calendar } from "./calendar-ts51vnwj.js";
import { L as LoaderCircle } from "./loader-circle-CEvzFFjS.js";
import { S as Save } from "./save-gMXGM8pU.js";
import { P as Pen } from "./pen-B9Zo65Ev.js";
import { T as Trash2 } from "./trash-2-5DF1cbxg.js";
import { T as Tag } from "./tag-BAT9nNmt.js";
import { L as Link2 } from "./link-2-CZnDvFVS.js";
import { E as ExternalLink } from "./external-link-RatDOdkB.js";
import "./index-Cjvi6AGX.js";
import "./search-BaaXS-B8.js";
const ENTITY_ROUTE_MAP = {
  note: "/app/notes",
  project: "/app/projects",
  task: "/app/projects",
  event: "/app/calendar",
  channel: "/app/chat",
  employee: "/app/payroll/employees",
  escrow: "/app/escrow"
};
function CrossLinkItem({ link }) {
  const basePath = ENTITY_ROUTE_MAP[link.entityType] ?? "/app";
  const href = `${basePath}/${link.entityId}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: href,
      className: "flex items-center gap-2.5 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm hover:bg-muted hover:border-primary/40 transition-smooth group",
      "data-ocid": `crosslink-item-${link.entityId}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3.5 w-3.5 text-primary shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 flex-1 truncate text-foreground", children: link.linkLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs shrink-0", children: link.entityType }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-smooth shrink-0" })
      ]
    }
  );
}
function NoteDetailSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 lg:p-8 max-w-3xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-md" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-48" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-5/6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4/6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" })
    ] })
  ] });
}
function NoteDetailPage() {
  const { noteId } = useParams({ from: "/app/notes/$noteId" });
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
  const {
    data: note,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["note", tenantId, noteId],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getNote(tenantId, noteId);
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
    }
  }, [note]);
  const { mutate: updateNote, isPending: isUpdating } = useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updateNote(tenantId, noteId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["note", tenantId, noteId], updated);
      queryClient.invalidateQueries({ queryKey: ["notes", tenantId] });
      ue.success("Note updated");
      setIsEditing(false);
    },
    onError: (err) => {
      ue.error("Failed to update note", { description: err.message });
    }
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
      ue.success("Note deleted");
      navigate({ to: "/app/notes" });
    },
    onError: (err) => {
      ue.error("Failed to delete note", { description: err.message });
    }
  });
  const handleSave = () => {
    if (!editTitle.trim()) {
      ue.error("Title is required");
      return;
    }
    updateNote({
      title: editTitle.trim(),
      content: editContent,
      tags: editTags,
      crossLinks: editCrossLinks
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
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTags = editTagInput.split(",").map((t) => t.trim().toLowerCase()).filter((t) => t.length > 0 && !editTags.includes(t));
      if (newTags.length > 0) setEditTags((prev) => [...prev, ...newTags]);
      setEditTagInput("");
    }
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(NoteDetailSkeleton, {});
  if (isError || !note) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 lg:p-8 max-w-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/notes", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium text-foreground mb-2", children: "Note not found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "This note may have been deleted or you don't have access to it." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/notes", children: "Back to Notes" }) })
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 lg:p-8 max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/notes", "aria-label": "Back to notes", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
        !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground break-words", children: note.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
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
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 shrink-0", children: isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: handleSave,
            disabled: isUpdating || !editTitle.trim(),
            className: "gap-2",
            "data-ocid": "note-save-edit-btn",
            children: [
              isUpdating ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3.5 w-3.5" }),
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
            "data-ocid": "note-cancel-edit-btn",
            children: "Cancel"
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => setIsEditing(true),
            className: "gap-2",
            "data-ocid": "note-edit-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3.5 w-3.5" }),
              "Edit"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "ghost",
              className: "gap-2 text-destructive hover:text-destructive hover:bg-destructive/10",
              "data-ocid": "note-delete-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
                "Delete"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this note?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  '"',
                  note.title,
                  '"'
                ] }),
                " will be permanently deleted. This action cannot be undone."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                AlertDialogAction,
                {
                  onClick: () => deleteNote(),
                  disabled: isDeleting,
                  className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                  "data-ocid": "note-delete-confirm-btn",
                  children: [
                    isDeleting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-2" }),
                    "Delete Note"
                  ]
                }
              )
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    !isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      note.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3.5 w-3.5 text-muted-foreground" }),
        note.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "secondary",
            className: "bg-primary/10 text-primary border-0 text-xs",
            children: tag
          },
          tag
        ))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-card border border-border p-6", children: note.content ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground leading-relaxed whitespace-pre-wrap font-body text-sm", children: note.content }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground italic text-sm", children: "No content — click Edit to add some." }) }),
      note.crossLinks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground", children: [
            "Cross-links (",
            note.crossLinks.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: note.crossLinks.map((link, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(CrossLinkItem, { link }, `${link.entityId}-${idx}`)) })
      ] })
    ] }) : (
      /* Edit Mode */
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "form",
        {
          onSubmit: (e) => {
            e.preventDefault();
            handleSave();
          },
          className: "space-y-6",
          noValidate: true,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "edit-title", className: "text-sm font-medium", children: [
                "Title ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "edit-title",
                  value: editTitle,
                  onChange: (e) => setEditTitle(e.target.value),
                  className: "text-base font-medium h-11",
                  autoFocus: true,
                  required: true,
                  "data-ocid": "note-edit-title"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-content", className: "text-sm font-medium", children: "Content" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "edit-content",
                  value: editContent,
                  onChange: (e) => setEditContent(e.target.value),
                  className: "min-h-[280px] resize-y leading-relaxed font-body",
                  "data-ocid": "note-edit-content"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3.5 w-3.5" }),
                "Tags"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-input bg-background p-3 space-y-2 focus-within:ring-2 focus-within:ring-ring", children: [
                editTags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: editTags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "secondary",
                    className: "gap-1 pl-2 pr-1 bg-primary/10 text-primary border-0",
                    children: [
                      tag,
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setEditTags((prev) => prev.filter((t) => t !== tag)),
                          "aria-label": `Remove tag ${tag}`,
                          className: "rounded-sm hover:text-destructive",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
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
                    className: "border-0 px-0 h-8 focus-visible:ring-0 shadow-none bg-transparent",
                    "data-ocid": "note-edit-tags"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: "Cross-links" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-input bg-background p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                CrossLinkPicker,
                {
                  tenantId,
                  value: editCrossLinks,
                  onChange: setEditCrossLinks
                }
              ) })
            ] })
          ]
        }
      )
    )
  ] });
}
export {
  NoteDetailPage as default
};
