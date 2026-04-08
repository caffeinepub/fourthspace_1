import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Loader2,
  Plus,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import {
  getTenantId,
  setWorkspaceId,
  useWorkspace,
} from "../../hooks/useWorkspace";

export default function WorkspaceNewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { actor, isFetching } = useActor(createActor);
  const { userProfile } = useWorkspace();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tenantId = getTenantId();
  const isFirstWorkspace = !localStorage.getItem("fourthspace_has_workspace");

  const actorReady = !!actor && !isFetching;

  async function handleCreate() {
    setError(null);

    if (!name.trim()) {
      setError("Workspace name is required.");
      return;
    }

    if (!actor) {
      setError(
        "Still connecting to backend. Please wait a moment and try again.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const ownerDisplayName = userProfile?.displayName ?? "Workspace Owner";
      const ownerEmail = userProfile?.email ?? "";

      const result = await actor.createWorkspace(
        tenantId,
        { name: name.trim() },
        ownerDisplayName,
        ownerEmail,
      );

      if (result.__kind__ === "ok") {
        const workspace = result.ok;
        setWorkspaceId(workspace.id);
        localStorage.setItem("activeWorkspaceId", workspace.id);
        localStorage.setItem("fourthspace_has_workspace", "true");
        // Invalidate all caches so the new workspace data loads fresh
        await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        await queryClient.invalidateQueries({ queryKey: ["myProfile"] });
        toast.success(`Workspace "${workspace.name}" created!`);
        void navigate({
          to: "/app/$workspaceId/dashboard",
          params: { workspaceId: workspace.id },
        });
      } else {
        const errMsg =
          result.__kind__ === "err"
            ? String(result.err)
            : "Failed to create workspace. Please try again.";
        setError(errMsg);
        toast.error(errMsg);
      }
    } catch (e) {
      let msg = "Something went wrong. Please try again.";
      if (e instanceof Error) {
        // Surface IC0508 canister stopped error in a friendly way
        if (e.message.includes("IC0508") || e.message.includes("stopped")) {
          msg =
            "The backend is temporarily unavailable (canister stopped). Please try again in a moment.";
        } else {
          msg = e.message;
        }
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full bg-accent/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Header bar */}
      <header className="relative h-14 bg-card/80 border-b border-border backdrop-blur-sm flex items-center px-6 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <Building2 className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground tracking-tight">
            Fourthspace
          </span>
        </div>
        {!isFirstWorkspace && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto gap-1.5 text-muted-foreground hover:text-foreground transition-smooth"
            onClick={() => void navigate({ to: "/app/workspaces" })}
            data-ocid="new-workspace-back"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to workspaces
          </Button>
        )}
      </header>

      {/* Main content */}
      <main className="relative flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Hero Icon + Heading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.35 }}
            className="text-center mb-7"
          >
            <div className="relative inline-flex mb-5">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                <Plus className="h-2.5 w-2.5 text-primary-foreground" />
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight mb-2">
              {isFirstWorkspace
                ? "Welcome to Fourthspace!"
                : "Create workspace"}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {isFirstWorkspace
                ? "Create your first workspace to organize your team's notes, projects, and more."
                : "Set up a new isolated workspace for a team or project."}
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
          >
            <Card className="border-border shadow-sm bg-card/90 backdrop-blur-sm">
              <CardContent className="p-6 space-y-5">
                {/* Actor loading warning */}
                {!actorReady && !isSubmitting && (
                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 border border-border px-3 py-2">
                    <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Connecting to backend…
                    </p>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <Alert variant="destructive" className="py-2.5">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Name input */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="workspace-name"
                    className="text-sm font-medium"
                  >
                    Workspace name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="workspace-name"
                    placeholder="e.g. Acme Team, Marketing, Design"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && name.trim() && actorReady) {
                        void handleCreate();
                      }
                    }}
                    disabled={isSubmitting}
                    autoFocus
                    className="h-10 text-sm border-input focus-visible:ring-primary/30 focus-visible:border-primary/60 transition-smooth"
                    data-ocid="new-workspace-name-input"
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be visible to all workspace members.
                  </p>
                </div>

                {/* Description textarea */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="workspace-description"
                    className="text-sm font-medium"
                  >
                    Description{" "}
                    <span className="text-muted-foreground font-normal text-xs">
                      (optional)
                    </span>
                  </Label>
                  <Textarea
                    id="workspace-description"
                    placeholder="What is this workspace for? (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSubmitting}
                    rows={2}
                    className="text-sm resize-none border-input focus-visible:ring-primary/30 focus-visible:border-primary/60 transition-smooth"
                    data-ocid="new-workspace-description-input"
                  />
                </div>

                {/* Submit button */}
                <Button
                  className="w-full h-10 gap-2 font-semibold active-press"
                  size="lg"
                  onClick={() => void handleCreate()}
                  disabled={!name.trim() || isSubmitting || !actorReady}
                  data-ocid="new-workspace-submit"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating workspace…
                    </>
                  ) : !actorReady ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Connecting…
                    </>
                  ) : (
                    <>
                      <Building2 className="h-4 w-4" />
                      {isFirstWorkspace
                        ? "Create my workspace"
                        : "Create workspace"}
                    </>
                  )}
                </Button>

                {!actorReady && (
                  <p className="text-center text-xs text-muted-foreground">
                    Waiting for backend connection…
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Feature hints */}
          {isFirstWorkspace && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground"
            >
              {["Notes & Projects", "Chat & Calendar", "Payroll & Escrow"].map(
                (feat) => (
                  <span key={feat} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-primary/50" />
                    {feat}
                  </span>
                ),
              )}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
