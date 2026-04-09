var _a;
import { d as useNavigate, f as useWorkspace, r as reactExports, j as jsxRuntimeExports, B as Button, S as Sparkles, E as Settings, ak as User } from "./index-1XRv9GHr.js";
import { B as Badge } from "./badge-rX4oLW6l.js";
import { I as Input } from "./input-BOIU-9S_.js";
import { S as ScrollArea } from "./scroll-area-dZ4XYbND.js";
import { S as Separator } from "./separator-FbNW0zML.js";
import { u as ue } from "./index-BOWFyaIB.js";
import { A as ArrowLeft } from "./arrow-left-B-gbON0E.js";
import { B as Bot } from "./bot-q19V-X94.js";
import { T as Trash2 } from "./trash-2-DiWEnbCD.js";
import { S as Send } from "./send-BhUdyFSk.js";
import "./index-IXOTxK3N.js";
const AI_STORAGE_KEY = "fourthspace_ai_config";
const CHAT_HISTORY_KEY = "fourthspace_ai_chat_history";
function loadAIConfig() {
  try {
    const raw = localStorage.getItem(AI_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function loadHistory() {
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!raw) return [];
    const stored = JSON.parse(raw);
    return stored.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}
function saveHistory(messages) {
  try {
    const toStore = messages.slice(-50).map((m) => ({ ...m, timestamp: m.timestamp.toISOString() }));
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(toStore));
  } catch {
  }
}
async function callAIChat(config, history, userMessage) {
  var _a2, _b, _c, _d, _e;
  const systemPrompt = "You are the Fourthspace AI Assistant — a helpful, professional workspace assistant. You help users with notes, projects, tasks, calendar events, payroll, escrow contracts, and their crypto wallet. Be concise, helpful, and professional.";
  const conversationHistory = history.filter((m) => !m.isError).slice(-10).map((m) => ({ role: m.role, content: m.content }));
  if (config.provider === "openai") {
    const res2 = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory,
          { role: "user", content: userMessage }
        ],
        max_tokens: 800
      })
    });
    if (!res2.ok) {
      const err = await res2.json().catch(() => ({}));
      throw new Error(
        ((_a2 = err.error) == null ? void 0 : _a2.message) ?? `OpenAI error ${res2.status}`
      );
    }
    const data2 = await res2.json();
    return ((_c = (_b = data2.choices[0]) == null ? void 0 : _b.message) == null ? void 0 : _c.content) ?? "";
  }
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 800,
      system: systemPrompt,
      messages: [
        ...conversationHistory,
        { role: "user", content: userMessage }
      ]
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      ((_d = err.error) == null ? void 0 : _d.message) ?? `Anthropic error ${res.status}`
    );
  }
  const data = await res.json();
  return ((_e = data.content[0]) == null ? void 0 : _e.text) ?? "";
}
const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant",
  content: ((_a = loadAIConfig()) == null ? void 0 : _a.apiKey) ? "Hi! I'm your Fourthspace AI Assistant. I can help you with your workspace — notes, projects, tasks, calendar, payroll, escrow, and wallet. How can I help you today?" : "Hi! I'm your Fourthspace AI Assistant. No AI provider is configured yet — go to AI Settings to connect a real AI model. How can I help?",
  timestamp: /* @__PURE__ */ new Date()
};
const FALLBACK_RESPONSES = {
  help: "I'm running in demo mode. Configure your API key in AI Settings for intelligent responses.",
  default: "That's a great question! Configure your OpenAI or Anthropic API key in AI Settings to get real AI responses."
};
function getFallbackResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes("help") || ["hi", "hello", "hey"].includes(lower.trim()))
    return FALLBACK_RESPONSES.help;
  return FALLBACK_RESPONSES.default;
}
function renderContent(text) {
  const lines = text.split("\n");
  const result = [];
  for (const [li, line] of lines.entries()) {
    const segments = line.split(/(\*\*[^*]+\*\*)/g);
    for (const seg of segments) {
      if (seg.startsWith("**") && seg.endsWith("**"))
        result.push(/* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: seg.slice(2, -2) }, `${li}-${seg}`));
      else if (seg) result.push(seg);
    }
    if (li < lines.length - 1)
      result.push(/* @__PURE__ */ jsxRuntimeExports.jsx("br", {}, `br-${li}-${line.slice(0, 8)}`));
  }
  return result;
}
function AIChatPage() {
  const navigate = useNavigate();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const config = loadAIConfig();
  const [messages, setMessages] = reactExports.useState(() => {
    const history = loadHistory();
    return history.length > 0 ? history : [WELCOME_MESSAGE];
  });
  const [input, setInput] = reactExports.useState("");
  const [typing, setTyping] = reactExports.useState(false);
  const bottomRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    var _a2;
    (_a2 = bottomRef.current) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth" });
  });
  const sendMessage = async () => {
    var _a2;
    const text = input.trim();
    if (!text) return;
    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: /* @__PURE__ */ new Date()
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setTyping(true);
    try {
      let responseContent;
      if (config == null ? void 0 : config.apiKey) {
        responseContent = await callAIChat(config, messages, text);
      } else {
        await new Promise((r) => setTimeout(r, 800));
        responseContent = getFallbackResponse(text);
      }
      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: responseContent,
        timestamp: /* @__PURE__ */ new Date()
      };
      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);
      saveHistory(finalMessages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "AI request failed.";
      ue.error(errorMessage);
      const errMsg = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: /* @__PURE__ */ new Date(),
        isError: true
      };
      setMessages([...updatedMessages, errMsg]);
    } finally {
      setTyping(false);
      (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-[calc(100vh-4rem)] p-6", "data-ocid": "ai-chat", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => navigate({ to: `/app/${workspaceId}/ai` }),
          "data-ocid": "ai-chat-back",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }),
            "Back"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-4 h-4 text-purple-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-display font-semibold text-foreground leading-none", children: "Chat Assistant" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: (config == null ? void 0 : config.apiKey) ? `Connected · ${config.model}` : "Demo mode — configure AI for real responses" })
        ] })
      ] }),
      (config == null ? void 0 : config.apiKey) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "ml-auto bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800 dark:text-purple-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3 mr-1" }),
        "AI Connected"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => navigate({ to: `/app/${workspaceId}/ai/settings` }),
          className: "ml-auto text-xs",
          "data-ocid": "ai-chat-settings",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-3 h-3 mr-1.5" }),
            "Configure AI"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => {
            localStorage.removeItem(CHAT_HISTORY_KEY);
            setMessages([
              {
                id: `welcome-${Date.now()}`,
                role: "assistant",
                content: "Conversation cleared. How can I help you today?",
                timestamp: /* @__PURE__ */ new Date()
              }
            ]);
          },
          className: "text-muted-foreground hover:text-destructive",
          "data-ocid": "ai-chat-clear",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 mr-1.5" }),
            "Clear"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden rounded-xl border border-border/50 bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-full p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col gap-4 pb-4",
        "data-ocid": "ai-chat-messages",
        children: [
          messages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${msg.role === "assistant" ? msg.isError ? "bg-destructive/20" : "bg-gradient-to-br from-purple-500 to-indigo-600" : "bg-gradient-to-br from-violet-500 to-purple-600"}`,
                    children: msg.role === "assistant" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-4 h-4 text-white" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-white" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `max-w-[75%] flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-tr-sm" : msg.isError ? "bg-destructive/10 border border-destructive/20 text-foreground rounded-tl-sm" : "bg-card border border-border/50 text-foreground rounded-tl-sm"}`,
                          children: renderContent(msg.content)
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground px-1", children: msg.timestamp.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit"
                      }) })
                    ]
                  }
                )
              ]
            },
            msg.id
          )),
          typing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-4 h-4 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 items-center h-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0ms]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-4 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          ref: inputRef,
          placeholder: (config == null ? void 0 : config.apiKey) ? "Ask me anything about your workspace..." : "Ask me anything (demo mode)...",
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          },
          disabled: typing,
          className: "flex-1",
          "data-ocid": "ai-chat-input"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: sendMessage,
          disabled: !input.trim() || typing,
          className: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 hover:opacity-90 px-5 active-press",
          "data-ocid": "ai-chat-send",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" })
        }
      )
    ] })
  ] });
}
export {
  AIChatPage as default
};
