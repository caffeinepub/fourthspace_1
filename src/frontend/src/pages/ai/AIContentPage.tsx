import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCheck,
  Copy,
  FileText,
  Loader2,
  Settings,
  Sparkles,
  WrapText,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useWorkspace } from "../../hooks/useWorkspace";

const AI_STORAGE_KEY = "fourthspace_ai_config";

interface StoredConfig {
  provider: string;
  apiKey: string;
  model: string;
}

function loadAIConfig(): StoredConfig | null {
  try {
    const raw = localStorage.getItem(AI_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredConfig) : null;
  } catch {
    return null;
  }
}

async function callAI(
  config: StoredConfig,
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  if (config.provider === "openai") {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 1500,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        (err as { error?: { message?: string } }).error?.message ??
          `OpenAI error ${res.status}`,
      );
    }
    const data = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    return data.choices[0]?.message?.content ?? "";
  }
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { error?: { message?: string } }).error?.message ??
        `Anthropic error ${res.status}`,
    );
  }
  const data = (await res.json()) as { content: { text: string }[] };
  return data.content[0]?.text ?? "";
}

type Action = "summarize" | "expand" | "rewrite" | "fix-grammar";

const ACTIONS: { id: Action; label: string; prompt: string; color: string }[] =
  [
    {
      id: "summarize",
      label: "Summarize",
      prompt:
        "Summarize the following text concisely, preserving the key points. Return only the summary.",
      color: "from-violet-600 to-purple-600",
    },
    {
      id: "expand",
      label: "Expand",
      prompt:
        "Expand and elaborate on the following text with more detail, examples, and context. Keep the same tone and style. Return only the expanded text.",
      color: "from-purple-600 to-indigo-600",
    },
    {
      id: "rewrite",
      label: "Rewrite",
      prompt:
        "Rewrite the following text to improve clarity, flow, and professionalism while preserving the original meaning. Return only the rewritten text.",
      color: "from-indigo-600 to-blue-600",
    },
    {
      id: "fix-grammar",
      label: "Fix Grammar",
      prompt:
        "Fix all grammar, spelling, and punctuation errors in the following text. Return only the corrected text without any explanation.",
      color: "from-blue-600 to-cyan-600",
    },
  ];

export default function AIContentPage() {
  const navigate = useNavigate();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState<Action | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<Action | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = loadAIConfig();

  const handleAction = async (action: Action) => {
    if (!inputText.trim()) {
      toast.error("Please enter some text first.");
      return;
    }
    if (!config?.apiKey) {
      toast.error("No AI provider configured. Go to AI Settings first.", {
        action: {
          label: "Settings",
          onClick: () =>
            navigate({ to: `/app/${workspaceId}/ai/settings` as "/" }),
        },
      });
      return;
    }
    const actionDef = ACTIONS.find((a) => a.id === action);
    if (!actionDef) return;
    setLoading(action);
    setResult(null);
    setError(null);
    setActiveAction(action);
    try {
      const systemPrompt =
        "You are an expert writing assistant for Fourthspace, a professional workspace platform. Follow the user's instruction precisely.";
      const output = await callAI(
        config,
        systemPrompt,
        `${actionDef.prompt}\n\n${inputText}`,
      );
      setResult(output);
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI request failed.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(null);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const isLoading = loading !== null;

  return (
    <div
      className="animate-fade-in-up flex flex-col min-h-full p-6 max-w-4xl mx-auto w-full"
      data-ocid="ai-content"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: `/app/${workspaceId}/ai` as "/" })}
          data-ocid="ai-content-back"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-violet-500" />
          </div>
          <div>
            <h1 className="text-lg font-display font-semibold text-foreground leading-none">
              Writing Assistant
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Summarize, expand, rewrite, or fix your text with AI
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {config?.apiKey ? (
            <Badge className="bg-violet-500/10 text-violet-600 border-violet-200 dark:border-violet-800 dark:text-violet-400">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered · {config.model}
            </Badge>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate({ to: `/app/${workspaceId}/ai/settings` as "/" })
              }
              className="text-xs"
              data-ocid="ai-content-settings-link"
            >
              <Settings className="w-3 h-3 mr-1.5" />
              Configure AI
            </Button>
          )}
        </div>
      </div>

      {!config?.apiKey && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-500/5 dark:border-amber-800 p-4">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            No AI provider configured. Actions will fail until you{" "}
            <button
              type="button"
              className="underline font-medium"
              onClick={() =>
                navigate({ to: `/app/${workspaceId}/ai/settings` as "/" })
              }
            >
              configure an API key
            </button>
            .
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Input Panel */}
        <Card className="shadow-card rounded-xl border border-border/50 bg-card flex flex-col">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-sm font-display font-semibold">
              Your text
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-1 pt-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <Label
                htmlFor="input-text"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Paste or type the text you want to improve
              </Label>
              <Textarea
                id="input-text"
                placeholder="Enter your text here... (e.g. a draft email, notes from a meeting, a paragraph from a report)"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={8}
                className="resize-none flex-1"
                data-ocid="ai-content-input"
              />
              <p className="text-xs text-muted-foreground text-right">
                {inputText.trim().split(/\s+/).filter(Boolean).length} words ·{" "}
                {inputText.length} chars
              </p>
            </div>
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {ACTIONS.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className={`text-sm border-border/50 hover:border-primary/50 transition-colors ${activeAction === action.id && result ? "border-primary bg-primary/5" : ""}`}
                  onClick={() => handleAction(action.id)}
                  disabled={isLoading}
                  data-ocid={`ai-action-${action.id}`}
                >
                  {loading === action.id ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <WrapText className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="shadow-card rounded-xl border border-border/50 bg-card flex flex-col">
          <CardHeader className="pb-3 flex-row items-center justify-between border-b border-border/40">
            <CardTitle className="text-sm font-display font-semibold">
              {activeAction
                ? `${ACTIONS.find((a) => a.id === activeAction)?.label} Result`
                : "Result"}
            </CardTitle>
            {result && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                data-ocid="ai-content-copy"
              >
                {copied ? (
                  <CheckCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1 pt-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
                </div>
                <p className="text-sm">Processing your text...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 px-4">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Action failed
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {error}
                  </p>
                </div>
              </div>
            ) : result ? (
              <div
                className="bg-muted/30 rounded-xl border border-border/40 p-4 text-sm font-body leading-relaxed whitespace-pre-wrap text-foreground max-h-[480px] overflow-y-auto"
                data-ocid="ai-content-output"
              >
                {result}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-sm text-center max-w-xs">
                  Enter your text on the left, then click Summarize, Expand,
                  Rewrite, or Fix Grammar.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
