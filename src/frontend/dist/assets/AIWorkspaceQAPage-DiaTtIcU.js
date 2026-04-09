import { d as useNavigate, f as useWorkspace, r as reactExports, j as jsxRuntimeExports, B as Button, b as MessageSquare, S as Sparkles, y as Settings, ai as User } from "./index-CQ7TXF2a.js";
import { B as Badge } from "./badge-DOwzzuc_.js";
import { I as Input } from "./input-Dkit6sfw.js";
import { S as ScrollArea } from "./scroll-area-_pStEkgn.js";
import { S as Separator } from "./separator-q6FGHgg-.js";
import { u as ue } from "./index-BGFcG_k-.js";
import { A as ArrowLeft } from "./arrow-left-D6cz-lXM.js";
import { B as Bot } from "./bot-CcvipM0d.js";
import { C as CircleAlert } from "./circle-alert-BAI5A_4F.js";
import { S as Send } from "./send-DNZwJrYP.js";
import "./index-IXOTxK3N.js";
const AI_STORAGE_KEY = "fourthspace_ai_config";
function loadAIConfig() {
  try {
    const raw = localStorage.getItem(AI_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
async function callAI(config, systemPrompt, messages, userMessage) {
  var _a, _b, _c, _d, _e;
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
          ...messages,
          { role: "user", content: userMessage }
        ],
        max_tokens: 1e3
      })
    });
    if (!res2.ok) {
      const err = await res2.json().catch(() => ({}));
      throw new Error(
        ((_a = err.error) == null ? void 0 : _a.message) ?? `OpenAI error ${res2.status}`
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
      max_tokens: 1e3,
      system: systemPrompt,
      messages: [...messages, { role: "user", content: userMessage }]
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
const SUGGESTED_QUESTIONS = [
  "What tasks are due this week?",
  "Summarize my recent project activity",
  "What are my highest priority items?",
  "Show me notes from the last meeting"
];
const SYSTEM_PROMPT = "You are the Fourthspace Workspace Q&A Assistant. You help users understand and navigate their workspace data — including notes, tasks, projects, calendar events, payroll, and team activity. Be concise, practical, and professional.";
function AIWorkspaceQAPage() {
  const navigate = useNavigate();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const config = loadAIConfig();
  const [messages, setMessages] = reactExports.useState([
    {
      id: "welcome",
      role: "assistant",
      content: (config == null ? void 0 : config.apiKey) ? "Hi! I'm your Workspace Q&A assistant. Ask me anything about your tasks, notes, projects, or team activity." : "Hi! I'm your Workspace Q&A assistant. Configure an API key in AI Settings to get real AI-powered answers.",
      timestamp: /* @__PURE__ */ new Date()
    }
  ]);
  const [input, setInput] = reactExports.useState("");
  const [typing, setTyping] = reactExports.useState(false);
  const bottomRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    var _a;
    (_a = bottomRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  });
  const sendMessage = async (text) => {
    var _a;
    const question = (text ?? input).trim();
    if (!question) return;
    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: question,
      timestamp: /* @__PURE__ */ new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    try {
      let responseContent;
      if (config == null ? void 0 : config.apiKey) {
        const history = messages.filter((m) => !m.isError).slice(-6).map((m) => ({ role: m.role, content: m.content }));
        responseContent = await callAI(
          config,
          SYSTEM_PROMPT,
          history,
          question
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
          timestamp: /* @__PURE__ */ new Date()
        }
      ]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "AI request failed.";
      ue.error(errorMsg);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `Sorry, I encountered an error: ${errorMsg}`,
          timestamp: /* @__PURE__ */ new Date(),
          isError: true
        }
      ]);
    } finally {
      setTyping(false);
      (_a = inputRef.current) == null ? void 0 : _a.focus();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-[calc(100vh-4rem)] p-6",
      "data-ocid": "ai-workspace-qa",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => navigate({ to: `/app/${workspaceId}/ai` }),
              "data-ocid": "ai-qa-back",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }),
                "Back"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4 text-purple-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-display font-semibold text-foreground leading-none", children: "Workspace Q&A" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Ask questions about your workspace data" })
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
              "data-ocid": "ai-qa-settings",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-3 h-3 mr-1.5" }),
                "Configure AI"
              ]
            }
          )
        ] }),
        messages.length <= 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2 font-medium", children: "Try asking:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: SUGGESTED_QUESTIONS.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "text-xs px-3 py-1.5 rounded-full border border-border/50 bg-card hover:bg-muted transition-colors text-foreground shadow-card",
              onClick: () => sendMessage(q),
              "data-ocid": "ai-qa-suggestion",
              children: q
            },
            q
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden rounded-xl border border-border/50 bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-full p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 pb-4", "data-ocid": "ai-qa-messages", children: [
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
                    className: `max-w-[78%] flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: `rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-tr-sm" : msg.isError ? "bg-destructive/10 border border-destructive/20 text-foreground rounded-tl-sm" : "bg-card border border-border/50 text-foreground rounded-tl-sm"}`,
                          children: [
                            msg.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5 text-destructive inline mr-1.5" }),
                            msg.content
                          ]
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
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              ref: inputRef,
              placeholder: "Ask anything about your workspace...",
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
              "data-ocid": "ai-qa-input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => sendMessage(),
              disabled: !input.trim() || typing,
              className: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 hover:opacity-90 px-5 active-press",
              "data-ocid": "ai-qa-send",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" })
            }
          )
        ] })
      ]
    }
  );
}
export {
  AIWorkspaceQAPage as default
};
