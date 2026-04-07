import { a as useNavigate, r as reactExports, j as jsxRuntimeExports, B as Button, S as Sparkles, U as User } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { I as Input } from "./input-C0aO0R3D.js";
import { S as ScrollArea, a as Send } from "./scroll-area-CzbWO35w.js";
import { S as Separator } from "./separator-B6dqygkP.js";
import { A as ArrowLeft } from "./arrow-left-mNBAKt8w.js";
import { B as Bot } from "./bot-Dsr6Ahxu.js";
import { T as Trash2 } from "./trash-2-5DF1cbxg.js";
import "./index-IXOTxK3N.js";
const BOT_RESPONSES = {
  help: `Welcome to Fourthspace AI Assistant! Here's what I can help you with:

• **Notes** — Create, search, and organize your workspace notes
• **Projects** — Track tasks, deadlines, and team progress
• **Chat** — Manage channels and team communications
• **Calendar** — Schedule events, set reminders, manage availability
• **Payroll** — View payslips, manage employees, run payroll reports
• **Escrow** — Create and manage escrow contracts
• **Wallet** — Check balances, send ICP, manage recurring payments

Just ask me anything about any of these areas!`,
  notes: `Your Notes section is where all your workspace knowledge lives.

📝 **Recent Notes**: 12 notes created this month
📂 **Folders**: Team Docs, Personal, Meeting Notes
🔍 **Search**: Use the search bar to find any note instantly
🔗 **Cross-linking**: Notes can be linked to tasks and projects

Navigate to /app/notes to manage your notes. Would you like help with anything specific?`,
  projects: `Your Projects section gives you full visibility into team progress.

📊 **Active Projects**: 4 projects in progress
✅ **Tasks Completed This Week**: 17
⚠️ **Overdue Tasks**: 3 need attention
👥 **Team Assignments**: 8 members actively assigned

Head to /app/projects to dive in. Is there a specific project you'd like to discuss?`,
  payroll: `Payroll management is fully handled within Fourthspace.

💰 **Next Payroll Run**: Scheduled for the 1st of next month
👥 **Active Employees**: 24 on payroll
📈 **Monthly Payroll Total**: $148,500
🏦 **Last Payment Status**: All processed successfully

Visit /app/payroll to manage payroll. Is there a specific employee or payment you need help with?`,
  calendar: `Your Calendar is synced across the workspace.

📅 **Events This Week**: 6 scheduled
🔔 **Upcoming Deadline**: Product review on Friday
👥 **Team Meetings**: 2 this week
⏰ **Available Slots**: Tuesday 2–4 PM, Thursday 3–5 PM

Navigate to /app/calendar to manage your schedule. Need help creating an event?`,
  escrow: `Fourthspace Escrow keeps your contracts secure and transparent.

🔐 **Active Contracts**: 3 in progress
⏳ **Pending Release**: 1 awaiting milestone confirmation
💸 **Total Value in Escrow**: 4,250 ICP
✅ **Completed This Month**: 2 contracts settled

Visit /app/escrow to manage contracts. Would you like to create a new escrow contract?`,
  wallet: `Your Fourthspace Wallet gives you full control over your ICP assets.

💳 **ICP Balance**: 1,247.83 ICP
📤 **Sent This Month**: 350 ICP across 4 transactions
📥 **Received This Month**: 825 ICP
🔄 **Recurring Payments**: 2 active

Head to /app/wallet to manage your funds. Need help sending ICP or setting up a recurring payment?`
};
function getBotResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes("help") || ["hi", "hello", "hey"].includes(lower.trim()))
    return BOT_RESPONSES.help;
  if (lower.includes("note")) return BOT_RESPONSES.notes;
  if (lower.includes("project") || lower.includes("task"))
    return BOT_RESPONSES.projects;
  if (lower.includes("payroll") || lower.includes("salary") || lower.includes("employee"))
    return BOT_RESPONSES.payroll;
  if (lower.includes("calendar") || lower.includes("event") || lower.includes("schedule") || lower.includes("meeting"))
    return BOT_RESPONSES.calendar;
  if (lower.includes("escrow") || lower.includes("contract"))
    return BOT_RESPONSES.escrow;
  if (lower.includes("wallet") || lower.includes("icp") || lower.includes("balance") || lower.includes("send"))
    return BOT_RESPONSES.wallet;
  return `That's a great question! While I don't have a specific answer for "${message.slice(0, 40)}${message.length > 40 ? "..." : ""}" right now, I can assist with:

• **Notes**, **Projects**, and **Tasks**
• **Calendar** and **Events**
• **Payroll**, **Escrow**, and **Wallet**
• General workspace productivity

Try asking about any of these topics, or type **"help"** to see everything I can do!`;
}
function AIChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = reactExports.useState([
    {
      id: "welcome",
      role: "assistant",
      content: `👋 Hi there! I'm your Fourthspace AI Assistant.

I can help you navigate your workspace, answer questions about your projects, payroll, calendar, notes, escrow, and wallet.

Type **"help"** to see everything I can do, or just ask me anything!`,
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
  const sendMessage = async () => {
    var _a;
    const text = input.trim();
    if (!text) return;
    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: /* @__PURE__ */ new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    await new Promise((r) => setTimeout(r, 1e3));
    setTyping(false);
    const aiMsg = {
      id: `ai-${Date.now()}`,
      role: "assistant",
      content: getBotResponse(text),
      timestamp: /* @__PURE__ */ new Date()
    };
    setMessages((prev) => [...prev, aiMsg]);
    (_a = inputRef.current) == null ? void 0 : _a.focus();
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const clearConversation = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: "Conversation cleared. How can I help you today?",
        timestamp: /* @__PURE__ */ new Date()
      }
    ]);
  };
  const renderContent = (text) => {
    const lines = text.split("\n");
    const result = [];
    for (const [li, line] of lines.entries()) {
      const segments = line.split(/(\*\*[^*]+\*\*)/g);
      for (const seg of segments) {
        if (seg.startsWith("**") && seg.endsWith("**")) {
          result.push(/* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: seg.slice(2, -2) }, `${li}-${seg}`));
        } else if (seg) {
          result.push(seg);
        }
      }
      if (li < lines.length - 1)
        result.push(/* @__PURE__ */ jsxRuntimeExports.jsx("br", {}, `br-${li}-${line.slice(0, 8)}`));
    }
    return result;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-[calc(100vh-4rem)] p-6", "data-ocid": "ai-chat", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => navigate({ to: "/app/ai" }),
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "AI-powered workspace assistant" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "ml-auto bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800 dark:text-purple-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3 mr-1" }),
        "AI Powered"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: clearConversation,
          className: "text-muted-foreground hover:text-destructive",
          "data-ocid": "ai-chat-clear",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 mr-1.5" }),
            "Clear"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden rounded-xl border border-border bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-full p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
                    className: `w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${msg.role === "assistant" ? "bg-gradient-to-br from-purple-500 to-indigo-600" : "bg-gradient-to-br from-violet-500 to-purple-600"}`,
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
                          className: `rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-tr-sm" : "bg-card border border-border text-foreground rounded-tl-sm"}`,
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 items-center h-5", children: [
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
          placeholder: "Ask me anything about your workspace...",
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: handleKeyDown,
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
          className: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 hover:opacity-90 px-5",
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
