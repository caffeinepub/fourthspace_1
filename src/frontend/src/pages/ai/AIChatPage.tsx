import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bot, Send, Sparkles, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const BOT_RESPONSES: Record<string, string> = {
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

Head to /app/wallet to manage your funds. Need help sending ICP or setting up a recurring payment?`,
};

function getBotResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("help") || ["hi", "hello", "hey"].includes(lower.trim()))
    return BOT_RESPONSES.help;
  if (lower.includes("note")) return BOT_RESPONSES.notes;
  if (lower.includes("project") || lower.includes("task"))
    return BOT_RESPONSES.projects;
  if (
    lower.includes("payroll") ||
    lower.includes("salary") ||
    lower.includes("employee")
  )
    return BOT_RESPONSES.payroll;
  if (
    lower.includes("calendar") ||
    lower.includes("event") ||
    lower.includes("schedule") ||
    lower.includes("meeting")
  )
    return BOT_RESPONSES.calendar;
  if (lower.includes("escrow") || lower.includes("contract"))
    return BOT_RESPONSES.escrow;
  if (
    lower.includes("wallet") ||
    lower.includes("icp") ||
    lower.includes("balance") ||
    lower.includes("send")
  )
    return BOT_RESPONSES.wallet;

  return `That's a great question! While I don't have a specific answer for "${message.slice(0, 40)}${message.length > 40 ? "..." : ""}" right now, I can assist with:

• **Notes**, **Projects**, and **Tasks**
• **Calendar** and **Events**
• **Payroll**, **Escrow**, and **Wallet**
• General workspace productivity

Try asking about any of these topics, or type **"help"** to see everything I can do!`;
}

export default function AIChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `👋 Hi there! I'm your Fourthspace AI Assistant.\n\nI can help you navigate your workspace, answer questions about your projects, payroll, calendar, notes, escrow, and wallet.\n\nType **"help"** to see everything I can do, or just ask me anything!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    await new Promise((r) => setTimeout(r, 1000));
    setTyping(false);

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: "assistant",
      content: getBotResponse(text),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
        timestamp: new Date(),
      },
    ]);
  };

  const renderContent = (text: string): React.ReactNode[] => {
    const lines = text.split("\n");
    const result: React.ReactNode[] = [];
    for (const [li, line] of lines.entries()) {
      const segments = line.split(/(\*\*[^*]+\*\*)/g);
      for (const seg of segments) {
        if (seg.startsWith("**") && seg.endsWith("**")) {
          result.push(<strong key={`${li}-${seg}`}>{seg.slice(2, -2)}</strong>);
        } else if (seg) {
          result.push(seg);
        }
      }
      if (li < lines.length - 1)
        result.push(<br key={`br-${li}-${line.slice(0, 8)}`} />);
    }
    return result;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-6" data-ocid="ai-chat">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/app/ai" })}
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
              AI-powered workspace assistant
            </p>
          </div>
        </div>
        <Badge className="ml-auto bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800 dark:text-purple-400">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearConversation}
          className="text-muted-foreground hover:text-destructive"
          data-ocid="ai-chat-clear"
        >
          <Trash2 className="w-4 h-4 mr-1.5" />
          Clear
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden rounded-xl border border-border bg-muted/20">
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    msg.role === "assistant"
                      ? "bg-gradient-to-br from-purple-500 to-indigo-600"
                      : "bg-gradient-to-br from-violet-500 to-purple-600"
                  }`}
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
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-tr-sm"
                        : "bg-card border border-border text-foreground rounded-tl-sm"
                    }`}
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
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
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
          placeholder="Ask me anything about your workspace..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={typing}
          className="flex-1"
          data-ocid="ai-chat-input"
        />
        <Button
          onClick={sendMessage}
          disabled={!input.trim() || typing}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 hover:opacity-90 px-5"
          data-ocid="ai-chat-send"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
