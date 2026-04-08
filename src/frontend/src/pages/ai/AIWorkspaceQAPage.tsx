import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  MessageSquare,
  Send,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useWorkspace } from "../../hooks/useWorkspace";

const AI_STORAGE_KEY = "fourthspace_ai_config";

interface StoredConfig {
  provider: string;
  apiKey: string;
  model: string;
}
interface QAMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isError?: boolean;
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
  messages: { role: "user" | "assistant"; content: string }[],
  userMessage: string,
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
          ...messages,
          { role: "user", content: userMessage },
        ],
        max_tokens: 1000,
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
      max_tokens: 1000,
      system: systemPrompt,
      messages: [...messages, { role: "user", content: userMessage }],
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

const SUGGESTED_QUESTIONS = [
  "What tasks are due this week?",
  "Summarize my recent project activity",
  "What are my highest priority items?",
  "Show me notes from the last meeting",
];

const SYSTEM_PROMPT =
  "You are the Fourthspace Workspace Q&A Assistant. You help users understand and navigate their workspace data — including notes, tasks, projects, calendar events, payroll, and team activity. Be concise, practical, and professional.";

export default function AIWorkspaceQAPage() {
  const navigate = useNavigate();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const config = loadAIConfig();

  const [messages, setMessages] = useState<QAMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: config?.apiKey
        ? "Hi! I'm your Workspace Q&A assistant. Ask me anything about your tasks, notes, projects, or team activity."
        : "Hi! I'm your Workspace Q&A assistant. Configure an API key in AI Settings to get real AI-powered answers.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const sendMessage = async (text?: string) => {
    const question = (text ?? input).trim();
    if (!question) return;
    const userMsg: QAMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: question,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    try {
      let responseContent: string;
      if (config?.apiKey) {
        const history = messages
          .filter((m) => !m.isError)
          .slice(-6)
          .map((m) => ({ role: m.role, content: m.content }));
        responseContent = await callAI(
          config,
          SYSTEM_PROMPT,
          history,
          question,
        );
      } else {
        await new Promise((r) => setTimeout(r, 700));
        responseContent = `I'm running in demo mode. To answer that question with real workspace data, please configure an AI provider in AI Settings.`;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: responseContent,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "AI request failed.";
      toast.error(errorMsg);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `Sorry, I encountered an error: ${errorMsg}`,
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setTyping(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div
      className="flex flex-col h-[calc(100vh-4rem)] p-6"
      data-ocid="ai-workspace-qa"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: `/app/${workspaceId}/ai` as "/" })}
          data-ocid="ai-qa-back"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <h1 className="text-lg font-display font-semibold text-foreground leading-none">
              Workspace Q&A
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ask questions about your workspace data
            </p>
          </div>
        </div>
        {config?.apiKey ? (
          <Badge className="ml-auto bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800 dark:text-purple-400">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Connected
          </Badge>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate({ to: `/app/${workspaceId}/ai/settings` as "/" })
            }
            className="ml-auto text-xs"
            data-ocid="ai-qa-settings"
          >
            <Settings className="w-3 h-3 mr-1.5" />
            Configure AI
          </Button>
        )}
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div className="mb-3 shrink-0">
          <p className="text-xs text-muted-foreground mb-2 font-medium">
            Try asking:
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                className="text-xs px-3 py-1.5 rounded-full border border-border/50 bg-card hover:bg-muted transition-colors text-foreground shadow-card"
                onClick={() => sendMessage(q)}
                data-ocid="ai-qa-suggestion"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-hidden rounded-xl border border-border/50 bg-muted/20">
        <ScrollArea className="h-full p-4">
          <div className="flex flex-col gap-4 pb-4" data-ocid="ai-qa-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${msg.role === "assistant" ? (msg.isError ? "bg-destructive/20" : "bg-gradient-to-br from-purple-500 to-indigo-600") : "bg-gradient-to-br from-violet-500 to-purple-600"}`}
                >
                  {msg.role === "assistant" ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[78%] flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-tr-sm" : msg.isError ? "bg-destructive/10 border border-destructive/20 text-foreground rounded-tl-sm" : "bg-card border border-border/50 text-foreground rounded-tl-sm"}`}
                  >
                    {msg.isError && (
                      <AlertCircle className="w-3.5 h-3.5 text-destructive inline mr-1.5" />
                    )}
                    {msg.content}
                  </div>
                  <span className="text-xs text-muted-foreground px-1">
                    {msg.timestamp.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-card border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5 items-center h-5">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="flex gap-3 mt-4 shrink-0">
        <Input
          ref={inputRef}
          placeholder="Ask anything about your workspace..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={typing}
          className="flex-1"
          data-ocid="ai-qa-input"
        />
        <Button
          onClick={() => sendMessage()}
          disabled={!input.trim() || typing}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 hover:opacity-90 px-5 active-press"
          data-ocid="ai-qa-send"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
