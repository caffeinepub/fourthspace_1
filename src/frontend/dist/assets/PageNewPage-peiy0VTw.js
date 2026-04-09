import { m as useParams, f as useWorkspace, d as useNavigate, n as useQueryClient, j as jsxRuntimeExports, B as Button, i as Link, F as FileText } from "./index-1XRv9GHr.js";
import { u as useMutation } from "./useMutation-X94w2CVk.js";
import { u as ue } from "./index-BOWFyaIB.js";
import { u as useBackend } from "./useBackend-DyFxq-Jw.js";
import { BUILT_IN_TEMPLATES } from "./PagesPage-CqGiwBbT.js";
import { A as ArrowLeft } from "./arrow-left-B-gbON0E.js";
import "./index-wZVP6u7e.js";
import "./clock-By6uj0s2.js";
const TEMPLATE_OPTIONS = [
  {
    id: "blank",
    icon: "📄",
    name: "Blank page",
    description: "Start with an empty canvas",
    blocksJson: JSON.stringify([
      { id: "1", order: 0, blockType: "paragraph", content: "", metadata: "" }
    ])
  },
  ...BUILT_IN_TEMPLATES.map((t) => ({
    id: t.id,
    icon: t.icon,
    name: t.name,
    description: t.description,
    blocksJson: t.blocksJson
  }))
];
function PageNewPage() {
  const { workspaceId } = useParams({ from: "/app/$workspaceId/pages/new" });
  const { actor } = useBackend();
  const { tenantId } = useWorkspace();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: createPage, isPending } = useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createPage(tenantId, workspaceId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (page) => {
      queryClient.invalidateQueries({
        queryKey: ["pages", tenantId, workspaceId]
      });
      ue.success("Page created");
      navigate({
        to: "/app/$workspaceId/pages/$pageId",
        params: { workspaceId, pageId: page.id }
      });
    },
    onError: (err) => {
      ue.error("Failed to create page", { description: err.message });
    }
  });
  const handleSelect = (tpl) => {
    createPage({
      title: tpl.id === "blank" ? "" : tpl.name,
      icon: tpl.icon,
      blocks: [tpl.blocksJson]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 lg:p-8 max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/app/$workspaceId/pages",
          params: { workspaceId },
          "aria-label": "Back to pages",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "New Page" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Choose a template to get started" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: TEMPLATE_OPTIONS.map((tpl) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        disabled: isPending,
        onClick: () => handleSelect(tpl),
        "data-ocid": `template-option-${tpl.id}`,
        className: "group text-left rounded-2xl border-2 border-border bg-card p-6 hover:border-primary hover:shadow-lg transition-smooth disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-3", children: tpl.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-base mb-1 group-hover:text-primary transition-colors duration-200", children: tpl.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: tpl.description })
        ]
      },
      tpl.id
    )) }),
    isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center mt-8 gap-2 text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Creating page…" })
    ] })
  ] });
}
export {
  PageNewPage as default
};
