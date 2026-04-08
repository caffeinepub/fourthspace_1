import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  ClipboardList,
  FileText,
  Languages,
  ListChecks,
  MessageSquare,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import { useWorkspace } from "../../hooks/useWorkspace";

const CAPABILITIES = [
  { icon: Zap, label: "Instant Results", desc: "Sub-second AI processing" },
  { icon: Brain, label: "Context Aware", desc: "Understands your workspace" },
  { icon: Sparkles, label: "Smart Suggestions", desc: "Tailored to your role" },
];

export default function AIHubPage() {
  const navigate = useNavigate();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";

  const AI_TOOLS = [
    {
      id: "content",
      icon: FileText,
      title: "Writing Assistant",
      description:
        "Summarize, expand, rewrite, or fix grammar on any text. Professional AI editing at your fingertips.",
      route: `/app/${workspaceId}/ai/content`,
      gradient: "from-violet-500 to-purple-600",
      bg: "bg-violet-500/10",
      iconColor: "text-violet-500",
      tag: "Write",
      tagColor:
        "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800",
    },
    {
      id: "workspace-qa",
      icon: MessageSquare,
      title: "Workspace Q&A",
      description:
        "Ask questions about your workspace — tasks, notes, projects. Get instant AI-powered answers.",
      route: `/app/${workspaceId}/ai/workspace-qa`,
      gradient: "from-purple-500 to-indigo-600",
      bg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      tag: "Ask",
      tagColor:
        "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    },
    {
      id: "task-generator",
      icon: ListChecks,
      title: "Task Generator",
      description:
        "Describe a project or goal and get a full list of actionable tasks generated instantly by AI.",
      route: `/app/${workspaceId}/ai/task-generator`,
      gradient: "from-indigo-500 to-blue-600",
      bg: "bg-indigo-500/10",
      iconColor: "text-indigo-500",
      tag: "Generate",
      tagColor:
        "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
    },
    {
      id: "meeting-summary",
      icon: ClipboardList,
      title: "Meeting Summary",
      description:
        "Paste raw meeting notes and get a structured summary with decisions, action items, and next steps.",
      route: `/app/${workspaceId}/ai/meeting-summary`,
      gradient: "from-blue-500 to-cyan-600",
      bg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      tag: "Summarize",
      tagColor:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    },
    {
      id: "translate",
      icon: Languages,
      title: "Language Translation",
      description:
        "Translate content across 10+ languages with AI-powered accuracy and natural phrasing.",
      route: `/app/${workspaceId}/ai/translate`,
      gradient: "from-cyan-500 to-teal-600",
      bg: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
      tag: "Translate",
      tagColor:
        "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
    },
    {
      id: "priority-suggester",
      icon: Brain,
      title: "Chat Assistant",
      description:
        "Conversational AI assistant for your entire workspace. Ask anything, get smart, contextual answers.",
      route: `/app/${workspaceId}/ai/chat`,
      gradient: "from-teal-500 to-green-600",
      bg: "bg-teal-500/10",
      iconColor: "text-teal-500",
      tag: "Chat",
      tagColor:
        "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800",
    },
  ];

  return (
    <div
      className="animate-fade-in-up flex flex-col min-h-full"
      data-ocid="ai-hub"
    >
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 mx-6 mt-6 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4 blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                Powered by Fourthspace AI
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              Fourthspace AI
            </h1>
            <p className="text-violet-200 text-lg max-w-xl">
              Your intelligent workspace assistant — write, ask, generate, and
              summarize in seconds.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 shrink-0">
            {CAPABILITIES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5 backdrop-blur-sm"
              >
                <Icon className="w-4 h-4 text-violet-200 shrink-0" />
                <div>
                  <div className="text-white text-sm font-medium leading-none">
                    {label}
                  </div>
                  <div className="text-violet-300 text-xs mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tool Cards */}
      <div className="p-6 flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-display font-semibold text-foreground">
              AI Tools
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Choose a tool to get started
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate({ to: `/app/${workspaceId}/ai/settings` as "/" })
            }
            data-ocid="ai-settings-link"
          >
            <Settings className="w-4 h-4 mr-1.5" />
            Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AI_TOOLS.map(
            ({
              id,
              icon: Icon,
              title,
              description,
              route,
              gradient,
              bg,
              iconColor,
              tag,
              tagColor,
            }) => (
              <button
                key={id}
                type="button"
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-left w-full"
                onClick={() => navigate({ to: route as "/" })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    navigate({ to: route as "/" });
                }}
                data-ocid={`ai-tool-card-${id}`}
              >
                {/* Gradient top bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient}`}
                />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}
                    >
                      <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs border ${tagColor}`}
                    >
                      {tag}
                    </Badge>
                  </div>
                  <h3 className="text-base font-display font-semibold text-foreground mb-1.5">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {description}
                  </p>
                  <div className="flex items-center justify-between text-sm font-medium text-foreground transition-all">
                    <span>Open Tool</span>
                    <ArrowRight
                      className={`w-4 h-4 ${iconColor} group-hover:translate-x-0.5 transition-transform`}
                    />
                  </div>
                </div>
              </button>
            ),
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Sparkles className="w-4 h-4 text-violet-500" />
          <span>
            Configure your API key in AI Settings for full functionality.
          </span>
        </div>
      </div>
    </div>
  );
}
