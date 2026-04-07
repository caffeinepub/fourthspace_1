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
  Bot,
  Brain,
  FileText,
  Languages,
  Sparkles,
  Zap,
} from "lucide-react";

const AI_TOOLS = [
  {
    id: "content",
    icon: FileText,
    title: "Content Creator",
    description:
      "Generate blog posts, emails, meeting notes, project summaries, and social media content from a simple prompt.",
    route: "/app/ai/content",
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-500/10",
    iconColor: "text-violet-500",
    tag: "Generate",
  },
  {
    id: "chat",
    icon: Bot,
    title: "Chat Assistant",
    description:
      "Ask anything about your workspace — notes, projects, payroll, calendar, escrow, and more. Get instant helpful answers.",
    route: "/app/ai/chat",
    gradient: "from-purple-500 to-indigo-600",
    bg: "bg-purple-500/10",
    iconColor: "text-purple-500",
    tag: "Interactive",
  },
  {
    id: "translate",
    icon: Languages,
    title: "Language Translation",
    description:
      "Instantly translate content into 7 languages — Spanish, French, German, Japanese, Chinese, Arabic, and more.",
    route: "/app/ai/translate",
    gradient: "from-indigo-500 to-blue-600",
    bg: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
    tag: "Translate",
  },
];

const CAPABILITIES = [
  { icon: Zap, label: "Instant Results", desc: "Sub-second AI processing" },
  { icon: Brain, label: "Context Aware", desc: "Understands your workspace" },
  { icon: Sparkles, label: "Smart Suggestions", desc: "Tailored to your role" },
];

export default function AIHubPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full" data-ocid="ai-hub">
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
              Your intelligent workspace assistant — create content, get
              answers, and translate in seconds.
            </p>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
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
        <h2 className="text-xl font-display font-semibold text-foreground mb-1">
          AI Tools
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Choose a tool to get started
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
            }) => (
              <Card
                key={id}
                className="group relative overflow-hidden border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate({ to: route as "/" })}
                data-ocid={`ai-tool-card-${id}`}
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}
                />

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-display">
                    {title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Button
                    className={`w-full bg-gradient-to-r ${gradient} text-white border-0 hover:opacity-90 transition-opacity`}
                    data-ocid={`ai-open-${id}`}
                  >
                    Open Tool
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ),
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Sparkles className="w-4 h-4 text-violet-500" />
          <span>
            Powered by Fourthspace AI — All responses are simulated for this
            workspace.
          </span>
        </div>
      </div>
    </div>
  );
}
