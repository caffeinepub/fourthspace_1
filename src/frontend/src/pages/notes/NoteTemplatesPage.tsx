import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookTemplate,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { NoteTemplate, NoteTemplateInput } from "../../types";
import { BUILT_IN_TEMPLATES } from "./PagesPage";

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
  "🔒",
];

function TemplateCard({
  icon,
  name,
  description,
  blockCount,
  badge,
  onUse,
  onDelete,
  id,
}: {
  icon: string;
  name: string;
  description: string;
  blockCount: number;
  badge?: string;
  onUse: () => void;
  onDelete?: () => void;
  id: string;
}) {
  return (
    <div
      className="group rounded-xl border border-border/50 bg-card p-4 flex flex-col gap-3 card-interactive shadow-card"
      data-ocid={`template-card-${id}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="font-semibold text-foreground text-sm truncate">
              {name}
            </h3>
            {badge && (
              <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary inline-flex items-center gap-1">
                <Star className="h-2.5 w-2.5" /> {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0"
            aria-label={`Delete template ${name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
        <span className="text-xs text-muted-foreground">
          {blockCount} block{blockCount !== 1 ? "s" : ""}
        </span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1 px-3"
          onClick={onUse}
          data-ocid={`use-template-${id}`}
        >
          <Plus className="h-3 w-3" /> Use Template
        </Button>
      </div>
    </div>
  );
}

export default function NoteTemplatesPage() {
  const { workspaceId } = useParams({
    from: "/app/$workspaceId/notes/templates",
  });
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("📄");
  const [blocksJson, setBlocksJson] = useState("[]");

  const { data: customTemplates = [], isLoading } = useQuery<NoteTemplate[]>({
    queryKey: ["noteTemplates", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listNoteTemplates(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching,
  });

  const getBlockCount = (json: string) => {
    try {
      const p = JSON.parse(json);
      return Array.isArray(p) ? p.length : 0;
    } catch {
      return 0;
    }
  };

  const filteredBuiltIn = useMemo(() => {
    if (!search.trim()) return BUILT_IN_TEMPLATES;
    const q = search.toLowerCase();
    return BUILT_IN_TEMPLATES.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    );
  }, [search]);

  const filteredCustom = useMemo(() => {
    if (!search.trim()) return customTemplates;
    const q = search.toLowerCase();
    return customTemplates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    );
  }, [search, customTemplates]);

  const { mutate: createTemplate, isPending: isCreating } = useMutation({
    mutationFn: async (input: NoteTemplateInput) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createNoteTemplate(
        tenantId,
        workspaceId,
        input,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["noteTemplates", tenantId, workspaceId],
      });
      toast.success("Template created");
      setShowForm(false);
      setName("");
      setDescription("");
      setIcon("📄");
      setBlocksJson("[]");
    },
    onError: (err: Error) =>
      toast.error("Failed to create template", { description: err.message }),
  });

  const { mutate: deleteTemplate } = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.deleteNoteTemplate(tenantId, workspaceId, id);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["noteTemplates", tenantId, workspaceId],
      });
      toast.success("Template deleted");
    },
    onError: (err: Error) =>
      toast.error("Failed to delete template", { description: err.message }),
  });

  const handleUseTemplate = (tpl: NoteTemplate) =>
    navigate({
      to: "/app/$workspaceId/pages/new",
      params: { workspaceId },
      search: { templateId: tpl.id },
    });

  return (
    <div className="animate-fade-in-up p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
          <Link
            to="/app/$workspaceId/notes"
            params={{ workspaceId }}
            aria-label="Back to notes"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <BookTemplate className="h-5 w-5 text-primary" /> Note Templates
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {BUILT_IN_TEMPLATES.length} built-in · {customTemplates.length}{" "}
            custom
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="gap-1.5 active-press"
          onClick={() => setShowForm(!showForm)}
          data-ocid="new-template-btn"
        >
          <Plus className="h-3.5 w-3.5" /> Custom Template
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search templates…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-sm border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
          data-ocid="template-search-input"
        />
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) {
              toast.error("Name is required");
              return;
            }
            createTemplate({
              name: name.trim(),
              description,
              icon,
              blocksJson,
            });
          }}
          className="rounded-xl border border-primary/30 bg-card p-5 space-y-4 shadow-card"
        >
          <h2 className="font-display font-semibold text-foreground text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> New Custom Template
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="tpl-name"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Name *
              </Label>
              <Input
                id="tpl-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sprint Retrospective"
                required
                data-ocid="template-name-input"
                className="border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Icon
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {EMOJI_OPTIONS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setIcon(em)}
                    className={`text-base p-1.5 rounded-lg border transition-smooth ${icon === em ? "border-primary bg-primary/10" : "border-transparent hover:border-border hover:bg-muted/50"}`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="tpl-description"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Description
            </Label>
            <Input
              id="tpl-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this template"
              data-ocid="template-description-input"
              className="border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="tpl-blocks"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Blocks JSON
            </Label>
            <Textarea
              id="tpl-blocks"
              value={blocksJson}
              onChange={(e) => setBlocksJson(e.target.value)}
              rows={5}
              className="font-mono text-xs border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
              placeholder='[{"id":"1","order":0,"blockType":"heading1","content":"Title","metadata":""}]'
              data-ocid="template-blocks-input"
            />
            <p className="text-xs text-muted-foreground">
              JSON array with id, order, blockType, content, metadata.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isCreating}
              className="gap-2 active-press text-xs"
              size="sm"
              data-ocid="template-save-btn"
            >
              {isCreating ? "Saving…" : "Save Template"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Built-in */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Built-in Templates
          </span>
          <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
            {filteredBuiltIn.length}
          </span>
        </div>
        {filteredBuiltIn.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No built-in templates match your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredBuiltIn.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                id={tpl.id}
                icon={tpl.icon}
                name={tpl.name}
                description={tpl.description}
                blockCount={getBlockCount(tpl.blocksJson)}
                badge="Built-in"
                onUse={() => handleUseTemplate(tpl)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Custom */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Your Templates
          </span>
          <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
            {filteredCustom.length}
          </span>
        </div>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : filteredCustom.length === 0 && !search.trim() ? (
          <div
            className="rounded-xl border border-dashed border-border p-10 text-center"
            data-ocid="custom-templates-empty"
          >
            <p className="text-sm text-muted-foreground mb-1">
              No custom templates yet
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Use a built-in template above or create your own.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowForm(true)}
              className="gap-2"
            >
              <Plus className="h-3.5 w-3.5" /> Create one
            </Button>
          </div>
        ) : filteredCustom.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No custom templates match your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCustom.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                id={tpl.id}
                icon={tpl.icon}
                name={tpl.name}
                description={tpl.description}
                blockCount={getBlockCount(tpl.blocksJson)}
                onUse={() => handleUseTemplate(tpl)}
                onDelete={() => deleteTemplate(tpl.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
