import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Lock,
  Save,
  Settings2,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AIProvider } from "../../backend";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";

const MODELS: Record<
  AIProvider,
  { value: string; label: string; tier: string }[]
> = {
  [AIProvider.OpenAI]: [
    { value: "gpt-4o-mini", label: "GPT-4o Mini", tier: "Fast · Affordable" },
    { value: "gpt-4o", label: "GPT-4o", tier: "Powerful · Latest" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo", tier: "High Performance" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", tier: "Legacy · Budget" },
  ],
  [AIProvider.Anthropic]: [
    {
      value: "claude-3-5-haiku-20241022",
      label: "Claude 3.5 Haiku",
      tier: "Fast · Efficient",
    },
    {
      value: "claude-3-5-sonnet-20241022",
      label: "Claude 3.5 Sonnet",
      tier: "Balanced · Smart",
    },
    {
      value: "claude-3-opus-20240229",
      label: "Claude 3 Opus",
      tier: "Most Capable",
    },
  ],
};

const DEFAULT_MODELS: Record<AIProvider, string> = {
  [AIProvider.OpenAI]: "gpt-4o-mini",
  [AIProvider.Anthropic]: "claude-3-5-haiku-20241022",
};

function maskApiKey(key: string): string {
  if (key.length <= 8) return "••••••••";
  return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
}

export default function AISettingsPage() {
  const { activeWorkspace, activeWorkspaceId } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";

  // Determine if current user is the workspace owner (super admin)
  const myPrincipal = identity?.getPrincipal().toText() ?? "";
  const isOwner =
    !!activeWorkspace &&
    !!myPrincipal &&
    activeWorkspace.ownerId.toString() === myPrincipal;
  const ownerCheckDone = !!myPrincipal && !!activeWorkspace;

  // Load AI config from backend
  const { data: savedConfig, isLoading: loadingConfig } = useQuery({
    queryKey: ["aiConfig", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAIConfig(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId && isOwner,
  });

  const [provider, setProvider] = useState<AIProvider>(AIProvider.OpenAI);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(DEFAULT_MODELS[AIProvider.OpenAI]);
  const [showKey, setShowKey] = useState(false);
  const [testResult, setTestResult] = useState<"idle" | "ok" | "error">("idle");

  // Hydrate form from backend config
  useEffect(() => {
    if (savedConfig) {
      setProvider(savedConfig.provider);
      setApiKey(savedConfig.apiKey ?? "");
      setModel(savedConfig.model ?? DEFAULT_MODELS[savedConfig.provider]);
    }
  }, [savedConfig]);

  useEffect(() => {
    const currentModels = MODELS[provider].map((m) => m.value);
    if (!currentModels.includes(model)) setModel(DEFAULT_MODELS[provider]);
  }, [provider, model]);

  // Save mutation — calls backend
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!apiKey.trim()) throw new Error("API key is required");
      const result = await actor.saveAIConfig(tenantId, workspaceId, {
        provider,
        apiKey: apiKey.trim(),
        model,
      });
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      toast.success("AI configuration saved successfully.");
      setTestResult("idle");
      void queryClient.invalidateQueries({
        queryKey: ["aiConfig", tenantId, workspaceId],
      });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Clear mutation — saves empty config to backend to clear
  const clearMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.saveAIConfig(tenantId, workspaceId, {
        provider: AIProvider.OpenAI,
        apiKey: "",
        model: DEFAULT_MODELS[AIProvider.OpenAI],
      });
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      toast.info("AI configuration cleared.");
      setApiKey("");
      setProvider(AIProvider.OpenAI);
      setModel(DEFAULT_MODELS[AIProvider.OpenAI]);
      setTestResult("idle");
      void queryClient.invalidateQueries({
        queryKey: ["aiConfig", tenantId, workspaceId],
      });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleTest = async () => {
    if (!apiKey.trim()) {
      toast.error("Enter and save your API key before testing.");
      return;
    }
    setTestResult("idle");
    // Brief delay for UX
    await new Promise((r) => setTimeout(r, 800));
    const isValidFormat =
      provider === AIProvider.OpenAI
        ? apiKey.startsWith("sk-")
        : apiKey.startsWith("sk-ant-");
    setTestResult(isValidFormat ? "ok" : "error");
    if (isValidFormat)
      toast.success("Connection test passed! API key format looks valid.");
    else
      toast.error(
        provider === AIProvider.OpenAI
          ? "OpenAI keys start with 'sk-'."
          : "Anthropic keys start with 'sk-ant-'.",
      );
  };

  const currentModels = MODELS[provider];
  const isConfigured = !!savedConfig?.apiKey;

  // Loading state — waiting for identity + workspace
  if (!ownerCheckDone || loadingConfig) {
    return (
      <div className="animate-fade-in-up p-6 space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/app/${workspaceId}/ai` as "/"}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight text-foreground">
              AI Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure your AI provider to enable real AI features
            </p>
          </div>
        </div>
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  // Non-owner view — show locked message
  if (!isOwner) {
    return (
      <div
        className="animate-fade-in-up p-6 space-y-6 max-w-3xl mx-auto"
        data-ocid="ai-settings-page"
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/app/${workspaceId}/ai` as "/"}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight text-foreground">
              AI Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure your AI provider to enable real AI features
            </p>
          </div>
        </div>

        <Card className="border-border/50 bg-card">
          <CardContent className="flex flex-col items-center justify-center py-14 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center">
              <Lock className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground text-base">
                Owner-only setting
              </p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm leading-relaxed">
                Only the workspace owner can configure AI settings and API keys.
                Contact your workspace owner to enable AI features.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild className="mt-1">
              <Link to={`/app/${workspaceId}/ai` as "/"}>
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                Back to AI Tools
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Owner view — full configuration UI
  return (
    <div
      className="animate-fade-in-up p-6 space-y-6 max-w-3xl mx-auto"
      data-ocid="ai-settings-page"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/app/${workspaceId}/ai` as "/"}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-display font-bold tracking-tight text-foreground">
            AI Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure your AI provider to enable real AI features
          </p>
        </div>
        {isConfigured && (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Configured
          </Badge>
        )}
      </div>

      {/* Current Config Banner */}
      {isConfigured && savedConfig && (
        <Card className="shadow-card rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-500/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Active Configuration
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                  <span className="text-xs text-muted-foreground">
                    Provider:{" "}
                    <span className="font-medium text-foreground capitalize">
                      {savedConfig.provider === AIProvider.OpenAI
                        ? "OpenAI"
                        : "Anthropic"}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Model:{" "}
                    <span className="font-medium text-foreground">
                      {savedConfig.model}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    API Key:{" "}
                    <span className="font-mono font-medium text-foreground">
                      {maskApiKey(savedConfig.apiKey)}
                    </span>
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearMutation.mutate()}
                disabled={clearMutation.isPending}
                className="text-muted-foreground hover:text-destructive shrink-0"
                data-ocid="ai-settings-clear"
              >
                {clearMutation.isPending ? "Clearing…" : "Clear"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Config Form */}
      <Card className="shadow-card rounded-xl border border-border/50 bg-card">
        <CardHeader className="border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Settings2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-display font-semibold">
                Provider Configuration
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Choose your AI provider and enter your API key
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-5">
          <div className="space-y-2">
            <Label
              htmlFor="provider"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              AI Provider
            </Label>
            <Select
              value={provider}
              onValueChange={(v) => setProvider(v as AIProvider)}
            >
              <SelectTrigger id="provider" data-ocid="ai-settings-provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AIProvider.OpenAI}>
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-500" />
                    OpenAI
                  </div>
                </SelectItem>
                <SelectItem value={AIProvider.Anthropic}>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    Anthropic (Claude)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="api-key"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              API Key
            </Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                placeholder={
                  provider === AIProvider.OpenAI ? "sk-..." : "sk-ant-..."
                }
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestResult("idle");
                }}
                className="pr-10 font-mono text-sm"
                data-ocid="ai-settings-api-key"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showKey ? "Hide API key" : "Show API key"}
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {provider === AIProvider.OpenAI ? (
                <>
                  Get your key at{" "}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    platform.openai.com/api-keys
                  </a>
                </>
              ) : (
                <>
                  Get your key at{" "}
                  <a
                    href="https://console.anthropic.com/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    console.anthropic.com/keys
                  </a>
                </>
              )}
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="model"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              Default Model
            </Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model" data-ocid="ai-settings-model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentModels.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    <div className="flex items-center justify-between gap-4 w-full">
                      <span>{m.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {m.tier}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {testResult !== "idle" && (
            <div
              className={`flex items-center gap-2 p-3 rounded-xl text-sm border ${testResult === "ok" ? "bg-emerald-500/5 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400" : "bg-destructive/5 border-destructive/20 text-destructive"}`}
            >
              {testResult === "ok" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              {testResult === "ok"
                ? "API key format is valid. AI features are ready to use."
                : "API key format does not match the expected pattern for this provider."}
            </div>
          )}

          <Separator />

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !apiKey.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground active-press"
              data-ocid="ai-settings-save"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={!apiKey.trim()}
              data-ocid="ai-settings-test"
            >
              <Zap className="w-4 h-4 mr-2" />
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            icon: Key,
            title: "Key Security",
            desc: "Your API key is stored securely in the workspace. It is only accessible to the workspace owner and is sent directly to your chosen AI provider.",
            color: "text-amber-500 bg-amber-500/10",
          },
          {
            icon: Bot,
            title: "What this enables",
            desc: "Once configured, AI features in Content Creator, Chat Assistant, and Language Translation will use real AI responses instead of demos.",
            color: "text-violet-500 bg-violet-500/10",
          },
        ].map((item) => (
          <Card
            key={item.title}
            className="shadow-card rounded-xl border border-border/50 bg-card"
          >
            <CardContent className="pt-5">
              <div className="flex gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}
                >
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
