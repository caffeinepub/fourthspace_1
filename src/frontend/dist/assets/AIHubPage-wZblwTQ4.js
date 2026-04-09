import { s as createLucideIcon, d as useNavigate, f as useWorkspace, j as jsxRuntimeExports, S as Sparkles, B as Button, E as Settings, F as FileText, b as MessageSquare } from "./index-1XRv9GHr.js";
import { B as Badge } from "./badge-rX4oLW6l.js";
import { Z as Zap } from "./zap-DOWG4j1S.js";
import { L as ListChecks } from "./list-checks-s22c6EGV.js";
import { C as ClipboardList } from "./clipboard-list-B76EUyvu.js";
import { L as Languages } from "./languages-BYHhsOhp.js";
import { A as ArrowRight } from "./arrow-right-B6MmcWz8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",
      key: "l5xja"
    }
  ],
  [
    "path",
    {
      d: "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",
      key: "ep3f8r"
    }
  ],
  ["path", { d: "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4", key: "1p4c4q" }],
  ["path", { d: "M17.599 6.5a3 3 0 0 0 .399-1.375", key: "tmeiqw" }],
  ["path", { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5", key: "105sqy" }],
  ["path", { d: "M3.477 10.896a4 4 0 0 1 .585-.396", key: "ql3yin" }],
  ["path", { d: "M19.938 10.5a4 4 0 0 1 .585.396", key: "1qfode" }],
  ["path", { d: "M6 18a4 4 0 0 1-1.967-.516", key: "2e4loj" }],
  ["path", { d: "M19.967 17.484A4 4 0 0 1 18 18", key: "159ez6" }]
];
const Brain = createLucideIcon("brain", __iconNode);
const CAPABILITIES = [
  { icon: Zap, label: "Instant Results", desc: "Sub-second AI processing" },
  { icon: Brain, label: "Context Aware", desc: "Understands your workspace" },
  { icon: Sparkles, label: "Smart Suggestions", desc: "Tailored to your role" }
];
function AIHubPage() {
  const navigate = useNavigate();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const AI_TOOLS = [
    {
      id: "content",
      icon: FileText,
      title: "Writing Assistant",
      description: "Summarize, expand, rewrite, or fix grammar on any text. Professional AI editing at your fingertips.",
      route: `/app/${workspaceId}/ai/content`,
      gradient: "from-violet-500 to-purple-600",
      bg: "bg-violet-500/10",
      iconColor: "text-violet-500",
      tag: "Write",
      tagColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800"
    },
    {
      id: "workspace-qa",
      icon: MessageSquare,
      title: "Workspace Q&A",
      description: "Ask questions about your workspace — tasks, notes, projects. Get instant AI-powered answers.",
      route: `/app/${workspaceId}/ai/workspace-qa`,
      gradient: "from-purple-500 to-indigo-600",
      bg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      tag: "Ask",
      tagColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
    },
    {
      id: "task-generator",
      icon: ListChecks,
      title: "Task Generator",
      description: "Describe a project or goal and get a full list of actionable tasks generated instantly by AI.",
      route: `/app/${workspaceId}/ai/task-generator`,
      gradient: "from-indigo-500 to-blue-600",
      bg: "bg-indigo-500/10",
      iconColor: "text-indigo-500",
      tag: "Generate",
      tagColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
    },
    {
      id: "meeting-summary",
      icon: ClipboardList,
      title: "Meeting Summary",
      description: "Paste raw meeting notes and get a structured summary with decisions, action items, and next steps.",
      route: `/app/${workspaceId}/ai/meeting-summary`,
      gradient: "from-blue-500 to-cyan-600",
      bg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      tag: "Summarize",
      tagColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
    },
    {
      id: "translate",
      icon: Languages,
      title: "Language Translation",
      description: "Translate content across 10+ languages with AI-powered accuracy and natural phrasing.",
      route: `/app/${workspaceId}/ai/translate`,
      gradient: "from-cyan-500 to-teal-600",
      bg: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
      tag: "Translate",
      tagColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800"
    },
    {
      id: "priority-suggester",
      icon: Brain,
      title: "Chat Assistant",
      description: "Conversational AI assistant for your entire workspace. Ask anything, get smart, contextual answers.",
      route: `/app/${workspaceId}/ai/chat`,
      gradient: "from-teal-500 to-green-600",
      bg: "bg-teal-500/10",
      iconColor: "text-teal-500",
      tag: "Chat",
      tagColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "animate-fade-in-up flex flex-col min-h-full",
      "data-ocid": "ai-hub",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 mx-6 mt-6 p-8 md:p-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4 blur-3xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4 blur-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5 text-white" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-white/20 text-white border-white/30 hover:bg-white/30", children: "Powered by Fourthspace AI" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-4xl font-display font-bold text-white mb-2", children: "Fourthspace AI" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-violet-200 text-lg max-w-xl", children: "Your intelligent workspace assistant — write, ask, generate, and summarize in seconds." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2.5 shrink-0", children: CAPABILITIES.map(({ icon: Icon, label, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5 backdrop-blur-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-violet-200 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white text-sm font-medium leading-none", children: label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-violet-300 text-xs mt-0.5", children: desc })
                  ] })
                ]
              },
              label
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-semibold text-foreground", children: "AI Tools" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Choose a tool to get started" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => navigate({ to: `/app/${workspaceId}/ai/settings` }),
                "data-ocid": "ai-settings-link",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-4 h-4 mr-1.5" }),
                  "Settings"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: AI_TOOLS.map(
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
              tagColor
            }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "group relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-left w-full",
                onClick: () => navigate({ to: route }),
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ")
                    navigate({ to: route });
                },
                "data-ocid": `ai-tool-card-${id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `w-11 h-11 rounded-xl ${bg} flex items-center justify-center`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-5 h-5 ${iconColor}` })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          variant: "outline",
                          className: `text-xs border ${tagColor}`,
                          children: tag
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-display font-semibold text-foreground mb-1.5", children: title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-4", children: description }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm font-medium text-foreground transition-all", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Open Tool" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ArrowRight,
                        {
                          className: `w-4 h-4 ${iconColor} group-hover:translate-x-0.5 transition-transform`
                        }
                      )
                    ] })
                  ] })
                ]
              },
              id
            )
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex items-center justify-center gap-2 text-muted-foreground text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-violet-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Configure your API key in AI Settings for full functionality." })
          ] })
        ] })
      ]
    }
  );
}
export {
  AIHubPage as default
};
