import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bot,
  Send,
  Settings,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useWorkspace } from "../../hooks/useWorkspace";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isError?: boolean;
}

const AI_STORAGE_KEY = "fourthspace_ai_config";
const CHAT_HISTORY_KEY = "fourthspace_ai_chat_history";

interface StoredConfig {
  provider: string;
  apiKey: string;
  model: string;
}
interface StoredMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
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

function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!raw) return [];
    const stored = JSON.parse(raw) as StoredMessage[];
    return stored.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

function saveHistory(messages: ChatMessage[]): void {
  try {
    const toStore: StoredMessage[] = messages
      .slice(-50)
      .map((m) => ({ ...m, timestamp: m.timestamp.toISOString() }));
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(toStore));
  } catch {
    /* ignore */
  }
}

async function callAIChat(
  config: StoredConfig,
  history: ChatMessage[],
  userMessage: string,
): Promise<string> {
  const systemPrompt =
    "You are the Fourthspace AI Assistant — a helpful, professional workspace assistant. You help users with notes, projects, tasks, calendar events, payroll, escrow contracts, and their crypto wallet. Be concise, helpful, and professional.";
  const conversationHistory = history
    .filter((m) => !m.isError)
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content }));
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
          ...conversationHistory,
          { role: "user", content: userMessage },
        ],
        max_tokens: 800,
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
      max_tokens: 800,
      system: systemPrompt,
      messages: [
        ...conversationHistory,
        { role: "user", content: userMessage },
      ],
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

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: loadAIConfig()?.apiKey
    ? "Hi! I'm your Fourthspace AI Assistant. I can help you with your workspace — notes, projects, tasks, calendar, payroll, escrow, and wallet. How can I help you today?"
    : "Hi! I'm your Fourthspace AI Assistant. No AI provider is configured yet — go to AI Settings to connect a real AI model. How can I help?",
  timestamp: new Date(),
};

const FALLBACK_RESPONSES = {
  help: "I'm running in demo mode. Configure your API key in AI Settings for intelligent responses.",
  default:
    "That's a great question! Configure your OpenAI or Anthropic API key in AI Settings to get real AI responses.",
};

function getFallbackResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("help") || ["hi", "hello", "hey"].includes(lower.trim()))
    return FALLBACK_RESPONSES.help;
  return FALLBACK_RESPONSES.default;
}

function renderContent(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const result: React.ReactNode[] = [];
  for (const [li, line] of lines.entries()) {
    const segments = line.split(/(\*\*[^*]+\*\*)/g);
    for (const seg of segments) {
      if (seg.startsWith("**") && seg.endsWith("**"))
        result.push(<strong key={`${li}-${seg}`}>{seg.slice(2, -2)}</strong>);
      else if (seg) result.push(seg);
    }
    if (li < lines.length - 1)
      result.push(<br key={`br-${li}-${line.slice(0, 8)}`} />);
  }
  return result;
}

export default function AIChatPage() {
  const navigate = useNavigate();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const config = loadAIConfig();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const history = loadHistory();
    return history.length > 0 ? history : [WELCOME_MESSAGE];
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setTyping(true);
    try {
      let responseContent: string;
      if (config?.apiKey) {
        responseContent = await callAIChat(config, messages, text);
      } else {
        await new Promise((r) => setTimeout(r, 800));
        responseContent = getFallbackResponse(text);
      }
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);
      saveHistory(finalMessages);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "AI request failed.";
      toast.error(errorMessage);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: new Date(),
        isError: true,
      };
      setMessages([...updatedMessages, errMsg]);
    } finally {
      setTyping(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-6" data-ocid="ai-chat">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: `/app/${workspaceId}/ai` as "/" })}
          data-ocid="ai-chat-back"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <h1 className="text-lg font-display font-semibold text-foreground leading-none">
              Chat Assistant
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {config?.apiKey
                ? `Connected · ${config.model}`
                : "Demo mode — configure AI for real responses"}
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
            data-ocid="ai-chat-settings"
          >
            <Settings className="w-3 h-3 mr-1.5" />
            Configure AI
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            localStorage.removeItem(CHAT_HISTORY_KEY);
            setMessages([
              {
                id: `welcome-${Date.now()}`,
                role: "assistant",
                content: "Conversation cleared. How can I help you today?",
                timestamp: new Date(),
              },
            ]);
          }}
          className="text-muted-foreground hover:text-destructive"
          data-ocid="ai-chat-clear"
        >
          <Trash2 className="w-4 h-4 mr-1.5" />
          Clear
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden rounded-xl border border-border/50 bg-muted/20">
        <ScrollArea className="h-full p-4">
          <div
            className="flex flex-col gap-4 pb-4"
            data-ocid="ai-chat-messages"
          >
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
                  className={`max-w-[75%] flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-tr-sm" : msg.isError ? "bg-destructive/10 border border-destructive/20 text-foreground rounded-tl-sm" : "bg-card border border-border/50 text-foreground rounded-tl-sm"}`}
                  >
                    {renderContent(msg.content)}
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
          placeholder={
            config?.apiKey
              ? "Ask me anything about your workspace..."
              : "Ask me anything (demo mode)..."
          }
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
          data-ocid="ai-chat-input"
        />
        <Button
          onClick={sendMessage}
          disabled={!input.trim() || typing}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 hover:opacity-90 px-5 active-press"
          data-ocid="ai-chat-send"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
