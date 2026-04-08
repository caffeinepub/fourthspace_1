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
  ClipboardList,
  Copy,
  Loader2,
  Settings,
  Sparkles,
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

const SYSTEM_PROMPT = `You are a professional meeting summarizer. Given raw meeting notes or transcript, produce a structured summary with these sections:

## Summary
One paragraph overview.

## Key Decisions
Bullet list of decisions made.

## Action Items
Numbered list with owner and deadline if mentioned.

## Next Steps
What needs to happen next.

Be concise and professional.`;

const EXAMPLE_NOTES = `Q3 Planning — July 12 2026
Attendees: Sarah (PM), Jake (Eng), Priya (Design), Marcus (Sales)

- Sarah opened with Q2 recap — we hit 87% of revenue target, missed 3 features
- Jake said the API v2 rewrite needs 3 more weeks, blocked on auth service
- Priya showed new onboarding designs — everyone approved except the color palette on mobile
- Marcus raised that enterprise clients are asking for SSO — need to prioritize
- Decided to push Feature X to Q4 and focus on SSO + API v2 this quarter
- Sarah will write up the Q3 roadmap by Friday
- Jake to unblock auth service by next Monday
- Priya to revise mobile colors and share updated designs by Thursday
- Next sync: July 19th 10am`;

export default function AIMeetingSummaryPage() {
  const navigate = useNavigate();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const config = loadAIConfig();

  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!notes.trim()) {
      toast.error("Please paste your meeting notes first.");
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
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const output = await callAI(
        config,
        SYSTEM_PROMPT,
        `Summarize these meeting notes:\n\n${notes}`,
      );
      setResult(output);
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI request failed.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Summary copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="animate-fade-in-up flex flex-col min-h-full p-6 max-w-4xl mx-auto w-full"
      data-ocid="ai-meeting-summary"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: `/app/${workspaceId}/ai` as "/" })}
          data-ocid="ai-meeting-back"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h1 className="text-lg font-display font-semibold text-foreground leading-none">
              Meeting Summary
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Paste meeting notes and get a structured AI summary
            </p>
          </div>
        </div>
        {config?.apiKey ? (
          <Badge className="ml-auto bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400">
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
            className="ml-auto text-xs"
            data-ocid="ai-meeting-settings-link"
          >
            <Settings className="w-3 h-3 mr-1.5" />
            Configure AI
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Input Panel */}
        <Card className="shadow-card rounded-xl border border-border/50 bg-card flex flex-col">
          <CardHeader className="pb-3 flex-row items-center justify-between border-b border-border/40">
            <CardTitle className="text-sm font-display font-semibold">
              Meeting Notes
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => {
                setNotes(EXAMPLE_NOTES);
                setResult(null);
                setError(null);
              }}
              data-ocid="ai-meeting-load-example"
            >
              Load example
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-1 pt-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <Label
                htmlFor="meeting-notes"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Paste your raw notes or transcript
              </Label>
              <Textarea
                id="meeting-notes"
                placeholder="Paste meeting notes, transcript, or bullet points here... Include attendees, topics discussed, decisions made, and any action items."
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setResult(null);
                  setError(null);
                }}
                rows={10}
                className="resize-none flex-1 min-h-[220px]"
                data-ocid="ai-meeting-input"
              />
              <p className="text-xs text-muted-foreground text-right">
                {notes.trim().split(/\s+/).filter(Boolean).length} words
              </p>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0 hover:opacity-90 active-press"
              onClick={handleSummarize}
              disabled={loading || !notes.trim()}
              data-ocid="ai-meeting-summarize"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Summarize Meeting
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="shadow-card rounded-xl border border-border/50 bg-card flex flex-col">
          <CardHeader className="pb-3 flex-row items-center justify-between border-b border-border/40">
            <CardTitle className="text-sm font-display font-semibold">
              Structured Summary
            </CardTitle>
            {result && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                data-ocid="ai-meeting-copy"
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
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
                <p className="text-sm">Analyzing your meeting notes...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 px-4">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Summarization failed
                  </p>
                  <p className="text-xs text-muted-foreground">{error}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSummarize}
                  disabled={loading}
                >
                  Try again
                </Button>
              </div>
            ) : result ? (
              <div
                className="bg-muted/30 rounded-xl border border-border/40 p-4 text-sm font-body leading-relaxed whitespace-pre-wrap text-foreground max-h-[480px] overflow-y-auto"
                data-ocid="ai-meeting-output"
              >
                {result}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div className="text-center max-w-xs">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Your summary will appear here
                  </p>
                  <p className="text-xs">
                    The AI will extract key decisions, action items, and next
                    steps from your raw notes.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
