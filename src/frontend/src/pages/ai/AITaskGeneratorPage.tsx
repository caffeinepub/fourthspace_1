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
  CheckCircle2,
  ClipboardCopy,
  ListChecks,
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
        max_tokens: 1200,
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
      max_tokens: 1200,
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

function parseTaskList(text: string): string[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return lines
    .map((line) =>
      line
        .replace(/^[\d]+[.)]\s*/, "")
        .replace(/^[-*•]\s*/, "")
        .trim(),
    )
    .filter((l) => l.length > 3);
}

const EXAMPLE_PROMPTS = [
  "Launch a new SaaS product for small businesses",
  "Migrate our infrastructure to the cloud",
  "Build and launch a company blog",
  "Run a user research study for our app",
];

export default function AITaskGeneratorPage() {
  const navigate = useNavigate();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const config = loadAIConfig();

  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error("Please describe your project first.");
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
    setTasks([]);
    setSelected(new Set());
    setError(null);
    try {
      const systemPrompt =
        "You are a project management expert. Generate a numbered list of actionable, specific tasks for the given project or goal. Each task should be a clear action item. Return 8-15 tasks, one per line, numbered. No extra commentary.";
      const raw = await callAI(
        config,
        systemPrompt,
        `Generate tasks for: ${description}`,
      );
      const parsed = parseTaskList(raw);
      if (parsed.length === 0)
        throw new Error("No tasks could be parsed from the AI response.");
      setTasks(parsed);
      setSelected(new Set(parsed.map((_, i) => i)));
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI request failed.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleCopySelected = async () => {
    const lines = tasks
      .filter((_, i) => selected.has(i))
      .map((t, i) => `${i + 1}. ${t}`)
      .join("\n");
    await navigator.clipboard.writeText(lines);
    toast.success(
      `${selected.size} task${selected.size !== 1 ? "s" : ""} copied to clipboard!`,
    );
  };

  return (
    <div
      className="animate-fade-in-up flex flex-col min-h-full p-6 max-w-4xl mx-auto w-full"
      data-ocid="ai-task-generator"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: `/app/${workspaceId}/ai` as "/" })}
          data-ocid="ai-tasks-back"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <ListChecks className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-lg font-display font-semibold text-foreground leading-none">
              Task Generator
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Describe a project and get a full task list instantly
            </p>
          </div>
        </div>
        {config?.apiKey ? (
          <Badge className="ml-auto bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-800 dark:text-indigo-400">
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
            data-ocid="ai-tasks-settings-link"
          >
            <Settings className="w-3 h-3 mr-1.5" />
            Configure AI
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Input */}
        <Card className="shadow-card rounded-xl border border-border/50 bg-card flex flex-col">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-sm font-display font-semibold">
              Describe your project
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-1 pt-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <Label
                htmlFor="project-desc"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                What are you trying to accomplish?
              </Label>
              <Textarea
                id="project-desc"
                placeholder="e.g. Launch a marketing campaign for our new product, Build a mobile app MVP, Run a quarterly performance review..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="resize-none"
                data-ocid="ai-tasks-description"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Try an example:
              </p>
              <div className="flex flex-col gap-1.5">
                {EXAMPLE_PROMPTS.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    className="text-left text-xs px-3 py-2 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/60 transition-colors text-foreground"
                    onClick={() => setDescription(ex)}
                    data-ocid="ai-tasks-example"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-0 hover:opacity-90 active-press"
              onClick={handleGenerate}
              disabled={loading}
              data-ocid="ai-tasks-generate"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating tasks...
                </>
              ) : (
                <>
                  <ListChecks className="w-4 h-4 mr-2" />
                  Generate Tasks
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Task List */}
        <Card className="shadow-card rounded-xl border border-border/50 bg-card flex flex-col">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-display font-semibold">
                Generated Tasks
              </CardTitle>
              {tasks.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {selected.size} / {tasks.length} selected
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopySelected}
                    disabled={selected.size === 0}
                    data-ocid="ai-tasks-copy"
                  >
                    <ClipboardCopy className="w-3.5 h-3.5 mr-1.5" />
                    Copy
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 flex-1 text-muted-foreground">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                </div>
                <p className="text-sm">Generating your task list...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {error}
                </p>
              </div>
            ) : tasks.length > 0 ? (
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setSelected(new Set(tasks.map((_, i) => i)))}
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setSelected(new Set())}
                  >
                    Clear all
                  </button>
                </div>
                <div
                  className="flex flex-col gap-1.5 overflow-y-auto max-h-[420px]"
                  data-ocid="ai-tasks-list"
                >
                  {tasks.map((task, idx) => {
                    const taskId = `task-${idx}-${task.slice(0, 10).replace(/\s/g, "-")}`;
                    return (
                      <label
                        key={taskId}
                        htmlFor={taskId}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selected.has(idx) ? "border-indigo-200 bg-indigo-500/5 dark:border-indigo-800" : "border-border/50 bg-muted/20 hover:bg-muted/40"}`}
                        data-ocid="ai-task-item"
                      >
                        <input
                          id={taskId}
                          type="checkbox"
                          checked={selected.has(idx)}
                          onChange={() => toggleTask(idx)}
                          className="mt-1 shrink-0 accent-indigo-600"
                        />
                        <span
                          className={`text-sm leading-relaxed ${selected.has(idx) ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {task}
                        </span>
                        {selected.has(idx) && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 ml-auto mt-0.5" />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 flex-1 text-muted-foreground">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <ListChecks className="w-6 h-6" />
                </div>
                <p className="text-sm text-center max-w-xs">
                  Describe your project and click "Generate Tasks" to get a
                  complete, actionable task list.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
