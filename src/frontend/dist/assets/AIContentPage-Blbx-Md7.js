import { s as createLucideIcon, d as useNavigate, f as useWorkspace, r as reactExports, j as jsxRuntimeExports, B as Button, F as FileText, S as Sparkles, y as Settings } from "./index-BZqaRhAX.js";
import { B as Badge } from "./index--nGTycyb.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DQu6DGwy.js";
import { L as Label } from "./label-CvyzRjc5.js";
import { S as Separator } from "./separator-J7DkFB-P.js";
import { T as Textarea } from "./textarea-CZBafaSY.js";
import { u as ue } from "./index-BRf-248B.js";
import { A as ArrowLeft } from "./arrow-left-BCLeiEG1.js";
import { C as CircleAlert } from "./circle-alert-BzUnhcW5.js";
import { L as LoaderCircle } from "./loader-circle-MfA_AsIp.js";
import { C as CheckCheck } from "./check-check-BY5-OcOq.js";
import { C as Copy } from "./copy-ltoxOxzI.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 16-2 2 2 2", key: "kkc6pm" }],
  ["path", { d: "M3 12h15a3 3 0 1 1 0 6h-4", key: "1cl7v7" }],
  ["path", { d: "M3 18h7", key: "sq21v6" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }]
];
const WrapText = createLucideIcon("wrap-text", __iconNode);
const AI_STORAGE_KEY = "fourthspace_ai_config";
function loadAIConfig() {
  try {
    const raw = localStorage.getItem(AI_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
async function callAI(config, systemPrompt, userPrompt) {
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
          { role: "user", content: userPrompt }
        ],
        max_tokens: 1500
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
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
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
const ACTIONS = [
  {
    id: "summarize",
    label: "Summarize",
    prompt: "Summarize the following text concisely, preserving the key points. Return only the summary.",
    color: "from-violet-600 to-purple-600"
  },
  {
    id: "expand",
    label: "Expand",
    prompt: "Expand and elaborate on the following text with more detail, examples, and context. Keep the same tone and style. Return only the expanded text.",
    color: "from-purple-600 to-indigo-600"
  },
  {
    id: "rewrite",
    label: "Rewrite",
    prompt: "Rewrite the following text to improve clarity, flow, and professionalism while preserving the original meaning. Return only the rewritten text.",
    color: "from-indigo-600 to-blue-600"
  },
  {
    id: "fix-grammar",
    label: "Fix Grammar",
    prompt: "Fix all grammar, spelling, and punctuation errors in the following text. Return only the corrected text without any explanation.",
    color: "from-blue-600 to-cyan-600"
  }
];
function AIContentPage() {
  var _a;
  const navigate = useNavigate();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const [inputText, setInputText] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(null);
  const [result, setResult] = reactExports.useState(null);
  const [activeAction, setActiveAction] = reactExports.useState(null);
  const [copied, setCopied] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const config = loadAIConfig();
  const handleAction = async (action) => {
    if (!inputText.trim()) {
      ue.error("Please enter some text first.");
      return;
    }
    if (!(config == null ? void 0 : config.apiKey)) {
      ue.error("No AI provider configured. Go to AI Settings first.", {
        action: {
          label: "Settings",
          onClick: () => navigate({ to: `/app/${workspaceId}/ai/settings` })
        }
      });
      return;
    }
    const actionDef = ACTIONS.find((a) => a.id === action);
    if (!actionDef) return;
    setLoading(action);
    setResult(null);
    setError(null);
    setActiveAction(action);
    try {
      const systemPrompt = "You are an expert writing assistant for Fourthspace, a professional workspace platform. Follow the user's instruction precisely.";
      const output = await callAI(
        config,
        systemPrompt,
        `${actionDef.prompt}

${inputText}`
      );
      setResult(output);
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI request failed.";
      setError(message);
      ue.error(message);
    } finally {
      setLoading(null);
    }
  };
  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    ue.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2e3);
  };
  const isLoading = loading !== null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "animate-fade-in-up flex flex-col min-h-full p-6 max-w-4xl mx-auto w-full",
      "data-ocid": "ai-content",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => navigate({ to: `/app/${workspaceId}/ai` }),
              "data-ocid": "ai-content-back",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }),
                "Back"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-violet-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-display font-semibold text-foreground leading-none", children: "Writing Assistant" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Summarize, expand, rewrite, or fix your text with AI" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto flex items-center gap-2", children: (config == null ? void 0 : config.apiKey) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-violet-500/10 text-violet-600 border-violet-200 dark:border-violet-800 dark:text-violet-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3 mr-1" }),
            "AI Powered · ",
            config.model
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => navigate({ to: `/app/${workspaceId}/ai/settings` }),
              className: "text-xs",
              "data-ocid": "ai-content-settings-link",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-3 h-3 mr-1.5" }),
                "Configure AI"
              ]
            }
          ) })
        ] }),
        !(config == null ? void 0 : config.apiKey) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-500/5 dark:border-amber-800 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-amber-700 dark:text-amber-400", children: [
            "No AI provider configured. Actions will fail until you",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "underline font-medium",
                onClick: () => navigate({ to: `/app/${workspaceId}/ai/settings` }),
                children: "configure an API key"
              }
            ),
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card rounded-xl border border-border/50 bg-card flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-display font-semibold", children: "Your text" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col gap-4 flex-1 pt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "input-text",
                    className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                    children: "Paste or type the text you want to improve"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "input-text",
                    placeholder: "Enter your text here... (e.g. a draft email, notes from a meeting, a paragraph from a report)",
                    value: inputText,
                    onChange: (e) => setInputText(e.target.value),
                    rows: 8,
                    className: "resize-none flex-1",
                    "data-ocid": "ai-content-input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
                  inputText.trim().split(/\s+/).filter(Boolean).length,
                  " words ·",
                  " ",
                  inputText.length,
                  " chars"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: ACTIONS.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  className: `text-sm border-border/50 hover:border-primary/50 transition-colors ${activeAction === action.id && result ? "border-primary bg-primary/5" : ""}`,
                  onClick: () => handleAction(action.id),
                  disabled: isLoading,
                  "data-ocid": `ai-action-${action.id}`,
                  children: [
                    loading === action.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 mr-1.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(WrapText, { className: "w-3.5 h-3.5 mr-1.5" }),
                    action.label
                  ]
                },
                action.id
              )) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card rounded-xl border border-border/50 bg-card flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3 flex-row items-center justify-between border-b border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-display font-semibold", children: activeAction ? `${(_a = ACTIONS.find((a) => a.id === activeAction)) == null ? void 0 : _a.label} Result` : "Result" }),
              result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: handleCopy,
                  "data-ocid": "ai-content-copy",
                  children: [
                    copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "w-3.5 h-3.5 mr-1.5 text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5 mr-1.5" }),
                    copied ? "Copied!" : "Copy"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex-1 pt-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 text-violet-500 animate-spin" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Processing your text..." })
            ] }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 py-12 px-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-6 h-6 text-destructive" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-1", children: "Action failed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: error })
              ] })
            ] }) : result ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "bg-muted/30 rounded-xl border border-border/40 p-4 text-sm font-body leading-relaxed whitespace-pre-wrap text-foreground max-h-[480px] overflow-y-auto",
                "data-ocid": "ai-content-output",
                children: result
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-6 h-6" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-center max-w-xs", children: "Enter your text on the left, then click Summarize, Expand, Rewrite, or Fix Grammar." })
            ] }) })
          ] })
        ] })
      ]
    }
  );
}
export {
  AIContentPage as default
};
