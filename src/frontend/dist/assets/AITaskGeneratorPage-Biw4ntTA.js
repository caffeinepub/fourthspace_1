import { s as createLucideIcon, d as useNavigate, f as useWorkspace, r as reactExports, j as jsxRuntimeExports, B as Button, S as Sparkles, E as Settings } from "./index-1XRv9GHr.js";
import { B as Badge } from "./badge-rX4oLW6l.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-CFU1s52N.js";
import { L as Label } from "./label-cy3JJ-Xo.js";
import { S as Separator } from "./separator-FbNW0zML.js";
import { T as Textarea } from "./textarea-DsJhlE90.js";
import { u as ue } from "./index-BOWFyaIB.js";
import { A as ArrowLeft } from "./arrow-left-B-gbON0E.js";
import { L as ListChecks } from "./list-checks-s22c6EGV.js";
import { L as LoaderCircle } from "./loader-circle-CtmMa9i8.js";
import { C as CircleAlert } from "./circle-alert-DOsaO_yO.js";
import { C as CircleCheck } from "./circle-check-DTEyto7g.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  ["path", { d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2", key: "4jdomd" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v4", key: "3hqy98" }],
  ["path", { d: "M21 14H11", key: "1bme5i" }],
  ["path", { d: "m15 10-4 4 4 4", key: "5dvupr" }]
];
const ClipboardCopy = createLucideIcon("clipboard-copy", __iconNode);
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
        max_tokens: 1200
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
      max_tokens: 1200,
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
function parseTaskList(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines.map(
    (line) => line.replace(/^[\d]+[.)]\s*/, "").replace(/^[-*•]\s*/, "").trim()
  ).filter((l) => l.length > 3);
}
const EXAMPLE_PROMPTS = [
  "Launch a new SaaS product for small businesses",
  "Migrate our infrastructure to the cloud",
  "Build and launch a company blog",
  "Run a user research study for our app"
];
function AITaskGeneratorPage() {
  const navigate = useNavigate();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const config = loadAIConfig();
  const [description, setDescription] = reactExports.useState("");
  const [tasks, setTasks] = reactExports.useState([]);
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const handleGenerate = async () => {
    if (!description.trim()) {
      ue.error("Please describe your project first.");
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
    setTasks([]);
    setSelected(/* @__PURE__ */ new Set());
    setError(null);
    try {
      const systemPrompt = "You are a project management expert. Generate a numbered list of actionable, specific tasks for the given project or goal. Each task should be a clear action item. Return 8-15 tasks, one per line, numbered. No extra commentary.";
      const raw = await callAI(
        config,
        systemPrompt,
        `Generate tasks for: ${description}`
      );
      const parsed = parseTaskList(raw);
      if (parsed.length === 0)
        throw new Error("No tasks could be parsed from the AI response.");
      setTasks(parsed);
      setSelected(new Set(parsed.map((_, i) => i)));
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI request failed.";
      setError(message);
      ue.error(message);
    } finally {
      setLoading(false);
    }
  };
  const toggleTask = (idx) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };
  const handleCopySelected = async () => {
    const lines = tasks.filter((_, i) => selected.has(i)).map((t, i) => `${i + 1}. ${t}`).join("\n");
    await navigator.clipboard.writeText(lines);
    ue.success(
      `${selected.size} task${selected.size !== 1 ? "s" : ""} copied to clipboard!`
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "animate-fade-in-up flex flex-col min-h-full p-6 max-w-4xl mx-auto w-full",
      "data-ocid": "ai-task-generator",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => navigate({ to: `/app/${workspaceId}/ai` }),
              "data-ocid": "ai-tasks-back",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }),
                "Back"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: "w-4 h-4 text-indigo-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-display font-semibold text-foreground leading-none", children: "Task Generator" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Describe a project and get a full task list instantly" })
            ] })
          ] }),
          (config == null ? void 0 : config.apiKey) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "ml-auto bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-800 dark:text-indigo-400", children: [
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
              "data-ocid": "ai-tasks-settings-link",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-3 h-3 mr-1.5" }),
                "Configure AI"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card rounded-xl border border-border/50 bg-card flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-display font-semibold", children: "Describe your project" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col gap-4 flex-1 pt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "project-desc",
                    className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                    children: "What are you trying to accomplish?"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "project-desc",
                    placeholder: "e.g. Launch a marketing campaign for our new product, Build a mobile app MVP, Run a quarterly performance review...",
                    value: description,
                    onChange: (e) => setDescription(e.target.value),
                    rows: 6,
                    className: "resize-none",
                    "data-ocid": "ai-tasks-description"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Try an example:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: EXAMPLE_PROMPTS.map((ex) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "text-left text-xs px-3 py-2 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/60 transition-colors text-foreground",
                    onClick: () => setDescription(ex),
                    "data-ocid": "ai-tasks-example",
                    children: ex
                  },
                  ex
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-0 hover:opacity-90 active-press",
                  onClick: handleGenerate,
                  disabled: loading,
                  "data-ocid": "ai-tasks-generate",
                  children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
                    "Generating tasks..."
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: "w-4 h-4 mr-2" }),
                    "Generate Tasks"
                  ] })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card rounded-xl border border-border/50 bg-card flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-display font-semibold", children: "Generated Tasks" }),
              tasks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
                  selected.size,
                  " / ",
                  tasks.length,
                  " selected"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: handleCopySelected,
                    disabled: selected.size === 0,
                    "data-ocid": "ai-tasks-copy",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCopy, { className: "w-3.5 h-3.5 mr-1.5" }),
                      "Copy"
                    ]
                  }
                )
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex-1 flex flex-col pt-4", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 flex-1 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 text-indigo-500 animate-spin" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Generating your task list..." })
            ] }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-6 h-6 text-destructive" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center", children: error })
            ] }) : tasks.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "text-xs text-muted-foreground hover:text-foreground transition-colors",
                    onClick: () => setSelected(new Set(tasks.map((_, i) => i))),
                    children: "Select all"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "text-xs text-muted-foreground hover:text-foreground transition-colors",
                    onClick: () => setSelected(/* @__PURE__ */ new Set()),
                    children: "Clear all"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex flex-col gap-1.5 overflow-y-auto max-h-[420px]",
                  "data-ocid": "ai-tasks-list",
                  children: tasks.map((task, idx) => {
                    const taskId = `task-${idx}-${task.slice(0, 10).replace(/\s/g, "-")}`;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "label",
                      {
                        htmlFor: taskId,
                        className: `flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selected.has(idx) ? "border-indigo-200 bg-indigo-500/5 dark:border-indigo-800" : "border-border/50 bg-muted/20 hover:bg-muted/40"}`,
                        "data-ocid": "ai-task-item",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              id: taskId,
                              type: "checkbox",
                              checked: selected.has(idx),
                              onChange: () => toggleTask(idx),
                              className: "mt-1 shrink-0 accent-indigo-600"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: `text-sm leading-relaxed ${selected.has(idx) ? "text-foreground" : "text-muted-foreground"}`,
                              children: task
                            }
                          ),
                          selected.has(idx) && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 text-indigo-500 shrink-0 ml-auto mt-0.5" })
                        ]
                      },
                      taskId
                    );
                  })
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 flex-1 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: "w-6 h-6" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-center max-w-xs", children: 'Describe your project and click "Generate Tasks" to get a complete, actionable task list.' })
            ] }) })
          ] })
        ] })
      ]
    }
  );
}
export {
  AITaskGeneratorPage as default
};
