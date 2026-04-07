import { g as createLucideIcon, a as useNavigate, j as jsxRuntimeExports, S as Sparkles, m as FileText, B as Button } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-wy6FYjGT.js";
import { Z as Zap } from "./zap-Czf8pMIS.js";
import { B as Bot } from "./bot-Dsr6Ahxu.js";
import { L as Languages } from "./languages-Bs-_FT8N.js";
import { A as ArrowRight } from "./arrow-right-D7-RcTtv.js";
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
const AI_TOOLS = [
  {
    id: "content",
    icon: FileText,
    title: "Content Creator",
    description: "Generate blog posts, emails, meeting notes, project summaries, and social media content from a simple prompt.",
    route: "/app/ai/content",
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-500/10",
    iconColor: "text-violet-500",
    tag: "Generate"
  },
  {
    id: "chat",
    icon: Bot,
    title: "Chat Assistant",
    description: "Ask anything about your workspace — notes, projects, payroll, calendar, escrow, and more. Get instant helpful answers.",
    route: "/app/ai/chat",
    gradient: "from-purple-500 to-indigo-600",
    bg: "bg-purple-500/10",
    iconColor: "text-purple-500",
    tag: "Interactive"
  },
  {
    id: "translate",
    icon: Languages,
    title: "Language Translation",
    description: "Instantly translate content into 7 languages — Spanish, French, German, Japanese, Chinese, Arabic, and more.",
    route: "/app/ai/translate",
    gradient: "from-indigo-500 to-blue-600",
    bg: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
    tag: "Translate"
  }
];
const CAPABILITIES = [
  { icon: Zap, label: "Instant Results", desc: "Sub-second AI processing" },
  { icon: Brain, label: "Context Aware", desc: "Understands your workspace" },
  { icon: Sparkles, label: "Smart Suggestions", desc: "Tailored to your role" }
];
function AIHubPage() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-full", "data-ocid": "ai-hub", children: [
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-violet-200 text-lg max-w-xl", children: "Your intelligent workspace assistant — create content, get answers, and translate in seconds." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3 shrink-0", children: CAPABILITIES.map(({ icon: Icon, label, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-semibold text-foreground mb-1", children: "AI Tools" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Choose a tool to get started" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5", children: AI_TOOLS.map(
        ({
          id,
          icon: Icon,
          title,
          description,
          route,
          gradient,
          bg,
          iconColor,
          tag
        }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "group relative overflow-hidden border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer",
            onClick: () => navigate({ to: route }),
            "data-ocid": `ai-tool-card-${id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `w-12 h-12 rounded-xl ${bg} flex items-center justify-center`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-6 h-6 ${iconColor}` })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: tag })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg font-display", children: title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-sm leading-relaxed", children: description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  className: `w-full bg-gradient-to-r ${gradient} text-white border-0 hover:opacity-90 transition-opacity`,
                  "data-ocid": `ai-open-${id}`,
                  children: [
                    "Open Tool",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
                  ]
                }
              ) })
            ]
          },
          id
        )
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex items-center justify-center gap-2 text-muted-foreground text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-violet-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Powered by Fourthspace AI — All responses are simulated for this workspace." })
      ] })
    ] })
  ] });
}
export {
  AIHubPage as default
};
