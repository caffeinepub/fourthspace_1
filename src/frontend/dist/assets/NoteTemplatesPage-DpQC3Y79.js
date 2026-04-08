import { s as createLucideIcon, m as useParams, f as useWorkspace, n as useQueryClient, d as useNavigate, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, P as Plus, S as Sparkles } from "./index-CzyNqtbv.js";
import { I as Input } from "./input-982h_Ebl.js";
import { L as Label } from "./label-D31XgQrg.js";
import { T as Textarea } from "./textarea-BbzS3l8F.js";
import { u as useMutation } from "./useMutation-BsRk2Bod.js";
import { u as ue } from "./index-DaWH_LJ9.js";
import { u as useBackend } from "./index-CJtF1vtU.js";
import { BUILT_IN_TEMPLATES } from "./PagesPage-C-hdHyn-.js";
import { A as ArrowLeft } from "./arrow-left-BnDr9sMT.js";
import { S as Search } from "./search-DHDFYO8C.js";
import { S as Star } from "./star-B2aBRVXL.js";
import { T as Trash2 } from "./trash-2-8AcD7pMp.js";
import "./skeleton-DMAdSNre.js";
import "./clock-DD8HS7VE.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 17h1.5", key: "1gkc67" }],
  ["path", { d: "M12 22h1.5", key: "1my7sn" }],
  ["path", { d: "M12 2h1.5", key: "19tvb7" }],
  ["path", { d: "M17.5 22H19a1 1 0 0 0 1-1", key: "10akbh" }],
  ["path", { d: "M17.5 2H19a1 1 0 0 1 1 1v1.5", key: "1vrfjs" }],
  ["path", { d: "M20 14v3h-2.5", key: "1naeju" }],
  ["path", { d: "M20 8.5V10", key: "1ctpfu" }],
  ["path", { d: "M4 10V8.5", key: "1o3zg5" }],
  ["path", { d: "M4 19.5V14", key: "ob81pf" }],
  ["path", { d: "M4 4.5A2.5 2.5 0 0 1 6.5 2H8", key: "s8vcyb" }],
  ["path", { d: "M8 22H6.5a1 1 0 0 1 0-5H8", key: "1cu73q" }]
];
const BookDashed = createLucideIcon("book-dashed", __iconNode);
const EMOJI_OPTIONS = [
  "📄",
  "📝",
  "🗒️",
  "📋",
  "🗓️",
  "💡",
  "🎯",
  "🔖",
  "🏠",
  "⭐",
  "📌",
  "🚀",
  "👤",
  "⚙️",
  "🔄",
  "🎤",
  "🐛",
  "🏁",
  "📢",
  "📜",
  "🎓",
  "📊",
  "☀️",
  "🔒"
];
function TemplateCard({
  icon,
  name,
  description,
  blockCount,
  badge,
  onUse,
  onDelete,
  id
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "group rounded-xl border border-border/50 bg-card p-4 flex flex-col gap-3 card-interactive shadow-card",
      "data-ocid": `template-card-${id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl shrink-0", children: icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-sm truncate", children: name }),
              badge && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-2.5 w-2.5" }),
                " ",
                badge
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 leading-relaxed", children: description })
          ] }),
          onDelete && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onDelete,
              className: "opacity-0 group-hover:opacity-100 p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0",
              "aria-label": `Delete template ${name}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-auto pt-2 border-t border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            blockCount,
            " block",
            blockCount !== 1 ? "s" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              className: "h-7 text-xs gap-1 px-3",
              onClick: onUse,
              "data-ocid": `use-template-${id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                " Use Template"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function NoteTemplatesPage() {
  const { workspaceId } = useParams({
    from: "/app/$workspaceId/notes/templates"
  });
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showForm, setShowForm] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [icon, setIcon] = reactExports.useState("📄");
  const [blocksJson, setBlocksJson] = reactExports.useState("[]");
  const { data: customTemplates = [], isLoading } = useQuery({
    queryKey: ["noteTemplates", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listNoteTemplates(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching
  });
  const getBlockCount = (json) => {
    try {
      const p = JSON.parse(json);
      return Array.isArray(p) ? p.length : 0;
    } catch {
      return 0;
    }
  };
  const filteredBuiltIn = reactExports.useMemo(() => {
    if (!search.trim()) return BUILT_IN_TEMPLATES;
    const q = search.toLowerCase();
    return BUILT_IN_TEMPLATES.filter(
      (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }, [search]);
  const filteredCustom = reactExports.useMemo(() => {
    if (!search.trim()) return customTemplates;
    const q = search.toLowerCase();
    return customTemplates.filter(
      (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }, [search, customTemplates]);
  const { mutate: createTemplate, isPending: isCreating } = useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createNoteTemplate(
        tenantId,
        workspaceId,
        input
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["noteTemplates", tenantId, workspaceId]
      });
      ue.success("Template created");
      setShowForm(false);
      setName("");
      setDescription("");
      setIcon("📄");
      setBlocksJson("[]");
    },
    onError: (err) => ue.error("Failed to create template", { description: err.message })
  });
  const { mutate: deleteTemplate } = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.deleteNoteTemplate(tenantId, workspaceId, id);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["noteTemplates", tenantId, workspaceId]
      });
      ue.success("Template deleted");
    },
    onError: (err) => ue.error("Failed to delete template", { description: err.message })
  });
  const handleUseTemplate = (tpl) => navigate({
    to: "/app/$workspaceId/pages/new",
    params: { workspaceId },
    search: { templateId: tpl.id }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-6 max-w-5xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/app/$workspaceId/notes",
          params: { workspaceId },
          "aria-label": "Back to notes",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookDashed, { className: "h-5 w-5 text-primary" }),
          " Note Templates"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
          BUILT_IN_TEMPLATES.length,
          " built-in · ",
          customTemplates.length,
          " ",
          "custom"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          size: "sm",
          className: "gap-1.5 active-press",
          onClick: () => setShowForm(!showForm),
          "data-ocid": "new-template-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            " Custom Template"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Search templates…",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "pl-9 h-9 text-sm border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30",
          "data-ocid": "template-search-input"
        }
      )
    ] }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: (e) => {
          e.preventDefault();
          if (!name.trim()) {
            ue.error("Name is required");
            return;
          }
          createTemplate({
            name: name.trim(),
            description,
            icon,
            blocksJson
          });
        },
        className: "rounded-xl border border-primary/30 bg-card p-5 space-y-4 shadow-card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-semibold text-foreground text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
            " New Custom Template"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "tpl-name",
                  className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                  children: "Name *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "tpl-name",
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  placeholder: "e.g. Sprint Retrospective",
                  required: true,
                  "data-ocid": "template-name-input",
                  className: "border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Icon" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: EMOJI_OPTIONS.map((em) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setIcon(em),
                  className: `text-base p-1.5 rounded-lg border transition-smooth ${icon === em ? "border-primary bg-primary/10" : "border-transparent hover:border-border hover:bg-muted/50"}`,
                  children: em
                },
                em
              )) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "tpl-description",
                className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                children: "Description"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "tpl-description",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                placeholder: "Brief description of this template",
                "data-ocid": "template-description-input",
                className: "border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "tpl-blocks",
                className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                children: "Blocks JSON"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "tpl-blocks",
                value: blocksJson,
                onChange: (e) => setBlocksJson(e.target.value),
                rows: 5,
                className: "font-mono text-xs border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30",
                placeholder: '[{"id":"1","order":0,"blockType":"heading1","content":"Title","metadata":""}]',
                "data-ocid": "template-blocks-input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "JSON array with id, order, blockType, content, metadata." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: isCreating,
                className: "gap-2 active-press text-xs",
                size: "sm",
                "data-ocid": "template-save-btn",
                children: isCreating ? "Saving…" : "Save Template"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                className: "text-xs",
                onClick: () => setShowForm(false),
                children: "Cancel"
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: "Built-in Templates" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground", children: filteredBuiltIn.length })
      ] }),
      filteredBuiltIn.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4 text-center", children: "No built-in templates match your search." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: filteredBuiltIn.map((tpl) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        TemplateCard,
        {
          id: tpl.id,
          icon: tpl.icon,
          name: tpl.name,
          description: tpl.description,
          blockCount: getBlockCount(tpl.blocksJson),
          badge: "Built-in",
          onUse: () => handleUseTemplate(tpl)
        },
        tpl.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: "Your Templates" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground", children: filteredCustom.length })
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }) : filteredCustom.length === 0 && !search.trim() ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-dashed border-border p-10 text-center",
          "data-ocid": "custom-templates-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-1", children: "No custom templates yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Use a built-in template above or create your own." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: () => setShowForm(true),
                className: "gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                  " Create one"
                ]
              }
            )
          ]
        }
      ) : filteredCustom.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4 text-center", children: "No custom templates match your search." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: filteredCustom.map((tpl) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        TemplateCard,
        {
          id: tpl.id,
          icon: tpl.icon,
          name: tpl.name,
          description: tpl.description,
          blockCount: getBlockCount(tpl.blocksJson),
          onUse: () => handleUseTemplate(tpl),
          onDelete: () => deleteTemplate(tpl.id)
        },
        tpl.id
      )) })
    ] })
  ] });
}
export {
  NoteTemplatesPage as default
};
