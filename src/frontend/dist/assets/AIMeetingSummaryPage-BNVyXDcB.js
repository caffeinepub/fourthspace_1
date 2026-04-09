import { d as useNavigate, f as useWorkspace, r as reactExports, j as jsxRuntimeExports, B as Button, S as Sparkles, y as Settings } from "./index-CQ7TXF2a.js";
import { B as Badge } from "./badge-DOwzzuc_.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DtVZ2GZq.js";
import { L as Label } from "./label-ANHtprqJ.js";
import { S as Separator } from "./separator-q6FGHgg-.js";
import { T as Textarea } from "./textarea-CkHQfDFp.js";
import { u as ue } from "./index-BGFcG_k-.js";
import { A as ArrowLeft } from "./arrow-left-D6cz-lXM.js";
import { C as ClipboardList } from "./clipboard-list-DUR-P1Qy.js";
import { L as LoaderCircle } from "./loader-circle-CcnovRzn.js";
import { C as CheckCheck } from "./check-check-QZiFe05W.js";
import { C as Copy } from "./copy-D2FV6GwB.js";
import { C as CircleAlert } from "./circle-alert-BAI5A_4F.js";
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
const SYSTEM_PROMPT = `You are a professional meeting summarizer. Given raw meeting notes or transcript, produce a structured summary with these sections:

## Summary
One paragraph overview.

## Key Decisions
Bullet list of decisions made.

## Action Items
Numbered list with owner and deadline if mentioned.

## Next Steps
What needs to happen next.

Be concise and professional.`;
const EXAMPLE_NOTES = `Q3 Planning — July 12 2026
Attendees: Sarah (PM), Jake (Eng), Priya (Design), Marcus (Sales)

- Sarah opened with Q2 recap — we hit 87% of revenue target, missed 3 features
- Jake said the API v2 rewrite needs 3 more weeks, blocked on auth service
- Priya showed new onboarding designs — everyone approved except the color palette on mobile
- Marcus raised that enterprise clients are asking for SSO — need to prioritize
- Decided to push Feature X to Q4 and focus on SSO + API v2 this quarter
- Sarah will write up the Q3 roadmap by Friday
- Jake to unblock auth service by next Monday
- Priya to revise mobile colors and share updated designs by Thursday
- Next sync: July 19th 10am`;
function AIMeetingSummaryPage() {
  const navigate = useNavigate();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const config = loadAIConfig();
  const [notes, setNotes] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const [copied, setCopied] = reactExports.useState(false);
  const handleSummarize = async () => {
    if (!notes.trim()) {
      ue.error("Please paste your meeting notes first.");
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
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const output = await callAI(
        config,
        SYSTEM_PROMPT,
        `Summarize these meeting notes:

${notes}`
      );
      setResult(output);
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI request failed.";
      setError(message);
      ue.error(message);
    } finally {
      setLoading(false);
    }
  };
  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    ue.success("Summary copied to clipboard!");
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "animate-fade-in-up flex flex-col min-h-full p-6 max-w-4xl mx-auto w-full",
      "data-ocid": "ai-meeting-summary",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => navigate({ to: `/app/${workspaceId}/ai` }),
              "data-ocid": "ai-meeting-back",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }),
                "Back"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-4 h-4 text-blue-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-display font-semibold text-foreground leading-none", children: "Meeting Summary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Paste meeting notes and get a structured AI summary" })
            ] })
          ] }),
          (config == null ? void 0 : config.apiKey) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "ml-auto bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3 mr-1" }),
            "AI Powered · ",
            config.model
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => navigate({ to: `/app/${workspaceId}/ai/settings` }),
              className: "ml-auto text-xs",
              "data-ocid": "ai-meeting-settings-link",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-3 h-3 mr-1.5" }),
                "Configure AI"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card rounded-xl border border-border/50 bg-card flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3 flex-row items-center justify-between border-b border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-display font-semibold", children: "Meeting Notes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: "text-xs text-muted-foreground",
                  onClick: () => {
                    setNotes(EXAMPLE_NOTES);
                    setResult(null);
                    setError(null);
                  },
                  "data-ocid": "ai-meeting-load-example",
                  children: "Load example"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col gap-4 flex-1 pt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "meeting-notes",
                    className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                    children: "Paste your raw notes or transcript"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "meeting-notes",
                    placeholder: "Paste meeting notes, transcript, or bullet points here... Include attendees, topics discussed, decisions made, and any action items.",
                    value: notes,
                    onChange: (e) => {
                      setNotes(e.target.value);
                      setResult(null);
                      setError(null);
                    },
                    rows: 10,
                    className: "resize-none flex-1 min-h-[220px]",
                    "data-ocid": "ai-meeting-input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
                  notes.trim().split(/\s+/).filter(Boolean).length,
                  " words"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0 hover:opacity-90 active-press",
                  onClick: handleSummarize,
                  disabled: loading || !notes.trim(),
                  "data-ocid": "ai-meeting-summarize",
                  children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
                    "Summarizing..."
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-4 h-4 mr-2" }),
                    "Summarize Meeting"
                  ] })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card rounded-xl border border-border/50 bg-card flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3 flex-row items-center justify-between border-b border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-display font-semibold", children: "Structured Summary" }),
              result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: handleCopy,
                  "data-ocid": "ai-meeting-copy",
                  children: [
                    copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "w-3.5 h-3.5 mr-1.5 text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5 mr-1.5" }),
                    copied ? "Copied!" : "Copy"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex-1 pt-4", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 text-blue-500 animate-spin" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Analyzing your meeting notes..." })
            ] }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 py-12 px-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-6 h-6 text-destructive" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-1", children: "Summarization failed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: error })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: handleSummarize,
                  disabled: loading,
                  children: "Try again"
                }
              )
            ] }) : result ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "bg-muted/30 rounded-xl border border-border/40 p-4 text-sm font-body leading-relaxed whitespace-pre-wrap text-foreground max-h-[480px] overflow-y-auto",
                "data-ocid": "ai-meeting-output",
                children: result
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-6 h-6" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-1", children: "Your summary will appear here" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "The AI will extract key decisions, action items, and next steps from your raw notes." })
              ] })
            ] }) })
          ] })
        ] })
      ]
    }
  );
}
export {
  AIMeetingSummaryPage as default
};
