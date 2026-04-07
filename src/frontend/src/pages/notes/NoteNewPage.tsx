import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Save, Tag, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CrossLinkPicker } from "../../components/CrossLinkPicker";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { CrossLink, NoteInput } from "../../types";

export default function NoteNewPage() {
  const { actor } = useBackend();
  const { tenantId } = useWorkspace();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [crossLinks, setCrossLinks] = useState<CrossLink[]>([]);

  const { mutate: createNote, isPending } = useMutation({
    mutationFn: async (input: NoteInput) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createNote(tenantId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", tenantId] });
      toast.success("Note created", {
        description: "Your note has been saved.",
      });
      navigate({ to: "/app/notes" });
    },
    onError: (err: Error) => {
      toast.error("Failed to create note", { description: err.message });
    },
  });

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTags(tagInput);
    }
  };

  const addTags = (input: string) => {
    const newTags = input
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0 && !tags.includes(t));
    if (newTags.length > 0) setTags((prev) => [...prev, ...newTags]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    createNote({ title: title.trim(), content, tags, crossLinks });
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link to="/app/notes" aria-label="Back to notes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            New Note
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Capture your thoughts and ideas
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="note-title" className="text-sm font-medium">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="note-title"
            placeholder="Give your note a clear title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-base font-medium h-11"
            autoFocus
            required
            data-ocid="note-title-input"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="note-content" className="text-sm font-medium">
            Content
          </Label>
          <Textarea
            id="note-content"
            placeholder="Write your note here… You can use plain text, bullet points, or any format you like."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[280px] resize-y leading-relaxed font-body"
            data-ocid="note-content-input"
          />
          <p className="text-xs text-muted-foreground text-right">
            {content.length} character{content.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label
            htmlFor="note-tags"
            className="text-sm font-medium flex items-center gap-1.5"
          >
            <Tag className="h-3.5 w-3.5" />
            Tags
          </Label>
          <div className="rounded-md border border-input bg-background p-3 space-y-2 focus-within:ring-2 focus-within:ring-ring focus-within:border-ring">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-1 pl-2 pr-1 bg-primary/10 text-primary border-0"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
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
              id="note-tags"
              placeholder="Add tags… (comma-separated, press Enter to add)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              onBlur={() => tagInput.trim() && addTags(tagInput)}
              className="border-0 px-0 h-8 focus-visible:ring-0 shadow-none bg-transparent"
              data-ocid="note-tags-input"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Press Enter or comma to add a tag
          </p>
        </div>

        {/* Cross-links */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Cross-links</Label>
          <div className="rounded-md border border-input bg-background p-4">
            <p className="text-xs text-muted-foreground mb-3">
              Link this note to other entities in your workspace
            </p>
            <CrossLinkPicker
              tenantId={tenantId}
              value={crossLinks}
              onChange={setCrossLinks}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <Button
            type="submit"
            disabled={!title.trim() || isPending}
            className="gap-2"
            data-ocid="note-save-btn"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isPending ? "Saving…" : "Save Note"}
          </Button>
          <Button
            type="button"
            variant="outline"
            asChild
            data-ocid="note-cancel-btn"
          >
            <Link to="/app/notes">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
