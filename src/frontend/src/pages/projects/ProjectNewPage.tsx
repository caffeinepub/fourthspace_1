import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FolderKanban, Loader2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import { type ProjectInput, ProjectStatus } from "../../types";

export default function ProjectNewPage() {
  const navigate = useNavigate();
  const { actor } = useBackend();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.Active);
  const [membersInput, setMembersInput] = useState("");
  const [nameError, setNameError] = useState("");

  const createMutation = useMutation({
    mutationFn: async (input: ProjectInput) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createProject(tenantId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["projects", tenantId] });
      toast.success("Project created successfully");
      navigate({
        to: "/app/projects/$projectId",
        params: { projectId: project.id },
      });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create project");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("Project name is required");
      return;
    }
    setNameError("");
    const memberIds = membersInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    createMutation.mutate({
      name: name.trim(),
      description: description.trim(),
      memberIds: memberIds as never[],
    });
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          asChild
          aria-label="Back to Projects"
        >
          <Link to="/app/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
            <FolderKanban className="h-4 w-4 text-orange-500" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              New Project
            </h1>
            <p className="text-xs text-muted-foreground">
              Set up a new project for your team
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-card p-6 space-y-5"
        data-ocid="project-new-form"
      >
        <div className="space-y-1.5">
          <Label htmlFor="project-name">
            Project Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="project-name"
            placeholder="e.g. Q2 Marketing Campaign"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            data-ocid="project-name-input"
            aria-invalid={!!nameError}
          />
          {nameError && <p className="text-xs text-destructive">{nameError}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="project-desc">Description</Label>
          <Textarea
            id="project-desc"
            placeholder="Describe the project goals and scope..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            data-ocid="project-desc-input"
            className="resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="project-status">Status</Label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as ProjectStatus)}
          >
            <SelectTrigger
              id="project-status"
              data-ocid="project-status-select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ProjectStatus.Active}>Active</SelectItem>
              <SelectItem value={ProjectStatus.OnHold}>On Hold</SelectItem>
              <SelectItem value={ProjectStatus.Completed}>Completed</SelectItem>
              <SelectItem value={ProjectStatus.Archived}>Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="project-members">Team Members</Label>
          <Input
            id="project-members"
            placeholder="Enter principal IDs separated by commas"
            value={membersInput}
            onChange={(e) => setMembersInput(e.target.value)}
            data-ocid="project-members-input"
          />
          <p className="text-xs text-muted-foreground">
            Separate multiple member IDs with commas. You can add members later.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/60">
          <Button
            type="button"
            variant="ghost"
            asChild
            data-ocid="project-cancel-btn"
          >
            <Link to="/app/projects">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            data-ocid="project-save-btn"
          >
            {createMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Create Project
          </Button>
        </div>
      </form>
    </div>
  );
}
