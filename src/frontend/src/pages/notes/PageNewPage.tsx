import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { PageInput } from "../../types";
import { BUILT_IN_TEMPLATES } from "./PagesPage";

interface TemplateOption {
  id: string;
  icon: string;
  name: string;
  description: string;
  blocksJson: string;
}

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: "blank",
    icon: "📄",
    name: "Blank page",
    description: "Start with an empty canvas",
    blocksJson: JSON.stringify([
      { id: "1", order: 0, blockType: "paragraph", content: "", metadata: "" },
    ]),
  },
  ...BUILT_IN_TEMPLATES.map((t) => ({
    id: t.id,
    icon: t.icon,
    name: t.name,
    description: t.description,
    blocksJson: t.blocksJson,
  })),
];

export default function PageNewPage() {
  const { workspaceId } = useParams({ from: "/app/$workspaceId/pages/new" });
  const { actor } = useBackend();
  const { tenantId } = useWorkspace();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: createPage, isPending } = useMutation({
    mutationFn: async (input: PageInput) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createPage(tenantId, workspaceId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (page) => {
      queryClient.invalidateQueries({
        queryKey: ["pages", tenantId, workspaceId],
      });
      toast.success("Page created");
      navigate({
        to: "/app/$workspaceId/pages/$pageId",
        params: { workspaceId, pageId: page.id },
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to create page", { description: err.message });
    },
  });

  const handleSelect = (tpl: TemplateOption) => {
    createPage({
      title: tpl.id === "blank" ? "" : tpl.name,
      icon: tpl.icon,
      blocks: [tpl.blocksJson],
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link
            to="/app/$workspaceId/pages"
            params={{ workspaceId }}
            aria-label="Back to pages"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            New Page
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Choose a template to get started
          </p>
        </div>
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TEMPLATE_OPTIONS.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            disabled={isPending}
            onClick={() => handleSelect(tpl)}
            data-ocid={`template-option-${tpl.id}`}
            className="group text-left rounded-2xl border-2 border-border bg-card p-6 hover:border-primary hover:shadow-lg transition-smooth disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="text-4xl mb-3">{tpl.icon}</div>
            <h3 className="font-display font-semibold text-foreground text-base mb-1 group-hover:text-primary transition-colors duration-200">
              {tpl.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tpl.description}
            </p>
          </button>
        ))}
      </div>

      {isPending && (
        <div className="flex items-center justify-center mt-8 gap-2 text-muted-foreground">
          <FileText className="h-4 w-4 animate-pulse" />
          <span className="text-sm">Creating page…</span>
        </div>
      )}
    </div>
  );
}
