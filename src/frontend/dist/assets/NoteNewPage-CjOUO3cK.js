import { c as useWorkspace, a as useNavigate, d as useQueryClient, r as reactExports, j as jsxRuntimeExports, B as Button, f as Link, X } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { I as Input } from "./input-C0aO0R3D.js";
import { L as Label } from "./label-CBtn2p-5.js";
import { T as Textarea } from "./textarea-DoR08WA4.js";
import { u as useMutation } from "./useMutation-BeBnUQJD.js";
import { u as ue } from "./index-p-k3Ndic.js";
import { C as CrossLinkPicker } from "./CrossLinkPicker-BbxKwuNH.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { A as ArrowLeft } from "./arrow-left-mNBAKt8w.js";
import { T as Tag } from "./tag-BAT9nNmt.js";
import { L as LoaderCircle } from "./loader-circle-CEvzFFjS.js";
import { S as Save } from "./save-gMXGM8pU.js";
import "./link-2-CZnDvFVS.js";
import "./search-BaaXS-B8.js";
function NoteNewPage() {
  const { actor } = useBackend();
  const { tenantId } = useWorkspace();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = reactExports.useState("");
  const [content, setContent] = reactExports.useState("");
  const [tagInput, setTagInput] = reactExports.useState("");
  const [tags, setTags] = reactExports.useState([]);
  const [crossLinks, setCrossLinks] = reactExports.useState([]);
  const { mutate: createNote, isPending } = useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createNote(tenantId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", tenantId] });
      ue.success("Note created", {
        description: "Your note has been saved."
      });
      navigate({ to: "/app/notes" });
    },
    onError: (err) => {
      ue.error("Failed to create note", { description: err.message });
    }
  });
  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTags(tagInput);
    }
  };
  const addTags = (input) => {
    const newTags = input.split(",").map((t) => t.trim().toLowerCase()).filter((t) => t.length > 0 && !tags.includes(t));
    if (newTags.length > 0) setTags((prev) => [...prev, ...newTags]);
    setTagInput("");
  };
  const removeTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      ue.error("Title is required");
      return;
    }
    createNote({ title: title.trim(), content, tags, crossLinks });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 lg:p-8 max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/notes", "aria-label": "Back to notes", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "New Note" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Capture your thoughts and ideas" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", noValidate: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "note-title", className: "text-sm font-medium", children: [
          "Title ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "note-title",
            placeholder: "Give your note a clear title…",
            value: title,
            onChange: (e) => setTitle(e.target.value),
            className: "text-base font-medium h-11",
            autoFocus: true,
            required: true,
            "data-ocid": "note-title-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "note-content", className: "text-sm font-medium", children: "Content" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "note-content",
            placeholder: "Write your note here… You can use plain text, bullet points, or any format you like.",
            value: content,
            onChange: (e) => setContent(e.target.value),
            className: "min-h-[280px] resize-y leading-relaxed font-body",
            "data-ocid": "note-content-input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
          content.length,
          " character",
          content.length !== 1 ? "s" : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Label,
          {
            htmlFor: "note-tags",
            className: "text-sm font-medium flex items-center gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3.5 w-3.5" }),
              "Tags"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-input bg-background p-3 space-y-2 focus-within:ring-2 focus-within:ring-ring focus-within:border-ring", children: [
          tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
                    onClick: () => removeTag(tag),
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
              id: "note-tags",
              placeholder: "Add tags… (comma-separated, press Enter to add)",
              value: tagInput,
              onChange: (e) => setTagInput(e.target.value),
              onKeyDown: handleTagInputKeyDown,
              onBlur: () => tagInput.trim() && addTags(tagInput),
              className: "border-0 px-0 h-8 focus-visible:ring-0 shadow-none bg-transparent",
              "data-ocid": "note-tags-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Press Enter or comma to add a tag" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: "Cross-links" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-input bg-background p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "Link this note to other entities in your workspace" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CrossLinkPicker,
            {
              tenantId,
              value: crossLinks,
              onChange: setCrossLinks
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-2 border-t border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "submit",
            disabled: !title.trim() || isPending,
            className: "gap-2",
            "data-ocid": "note-save-btn",
            children: [
              isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
              isPending ? "Saving…" : "Save Note"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            asChild: true,
            "data-ocid": "note-cancel-btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/notes", children: "Cancel" })
          }
        )
      ] })
    ] })
  ] });
}
export {
  NoteNewPage as default
};
