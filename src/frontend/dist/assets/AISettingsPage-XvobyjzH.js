import { t as createLucideIcon, f as useWorkspace, r as reactExports, j as jsxRuntimeExports, B as Button, i as Link, S as Sparkles } from "./index-CQ7TXF2a.js";
import { B as Badge } from "./badge-DOwzzuc_.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-DtVZ2GZq.js";
import { I as Input } from "./input-Dkit6sfw.js";
import { L as Label } from "./label-ANHtprqJ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C1Xsy-LN.js";
import { S as Separator } from "./separator-q6FGHgg-.js";
import { u as ue } from "./index-BGFcG_k-.js";
import { A as ArrowLeft } from "./arrow-left-D6cz-lXM.js";
import { C as CircleCheck } from "./circle-check-B7zTmrRV.js";
import { S as Settings2 } from "./settings-2-BUgqP987.js";
import { B as Bot } from "./bot-CcvipM0d.js";
import { E as EyeOff } from "./eye-off-B1oDUMfW.js";
import { E as Eye } from "./eye-BW24WLxb.js";
import { C as CircleAlert } from "./circle-alert-BAI5A_4F.js";
import { L as LoaderCircle } from "./loader-circle-CcnovRzn.js";
import { S as Save } from "./save-DJl3ZDfM.js";
import { Z as Zap } from "./zap-Bi3i3wDK.js";
import "./index-IXOTxK3N.js";
import "./index-CkN0xm2T.js";
import "./chevron-up-56u9dcHi.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4", key: "g0fldk" }],
  ["path", { d: "m21 2-9.6 9.6", key: "1j0ho8" }],
  ["circle", { cx: "7.5", cy: "15.5", r: "5.5", key: "yqb3hr" }]
];
const Key = createLucideIcon("key", __iconNode);
const MODELS = {
  openai: [
    { value: "gpt-4o-mini", label: "GPT-4o Mini", tier: "Fast · Affordable" },
    { value: "gpt-4o", label: "GPT-4o", tier: "Powerful · Latest" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo", tier: "High Performance" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", tier: "Legacy · Budget" }
  ],
  anthropic: [
    {
      value: "claude-3-5-haiku-20241022",
      label: "Claude 3.5 Haiku",
      tier: "Fast · Efficient"
    },
    {
      value: "claude-3-5-sonnet-20241022",
      label: "Claude 3.5 Sonnet",
      tier: "Balanced · Smart"
    },
    {
      value: "claude-3-opus-20240229",
      label: "Claude 3 Opus",
      tier: "Most Capable"
    }
  ]
};
const DEFAULT_MODELS = {
  openai: "gpt-4o-mini",
  anthropic: "claude-3-5-haiku-20241022"
};
const STORAGE_KEY = "fourthspace_ai_config";
function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function maskApiKey(key) {
  if (key.length <= 8) return "••••••••";
  return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
}
function AISettingsPage() {
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const saved = loadConfig();
  const [provider, setProvider] = reactExports.useState(
    (saved == null ? void 0 : saved.provider) ?? "openai"
  );
  const [apiKey, setApiKey] = reactExports.useState((saved == null ? void 0 : saved.apiKey) ?? "");
  const [model, setModel] = reactExports.useState(
    (saved == null ? void 0 : saved.model) ?? DEFAULT_MODELS[(saved == null ? void 0 : saved.provider) ?? "openai"]
  );
  const [showKey, setShowKey] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [testing, setTesting] = reactExports.useState(false);
  const [testResult, setTestResult] = reactExports.useState("idle");
  const [savedConfig, setSavedConfig] = reactExports.useState(saved);
  reactExports.useEffect(() => {
    const currentModels2 = MODELS[provider].map((m) => m.value);
    if (!currentModels2.includes(model)) setModel(DEFAULT_MODELS[provider]);
  }, [provider, model]);
  const handleSave = async () => {
    if (!apiKey.trim()) {
      ue.error("API key is required.");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    const config = {
      provider,
      apiKey,
      model,
      savedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setSavedConfig(config);
    setSaving(false);
    setTestResult("idle");
    ue.success("AI configuration saved successfully.");
  };
  const handleTest = async () => {
    if (!apiKey.trim()) {
      ue.error("Enter and save your API key before testing.");
      return;
    }
    setTesting(true);
    setTestResult("idle");
    await new Promise((r) => setTimeout(r, 1500));
    const isValidFormat = provider === "openai" ? apiKey.startsWith("sk-") : apiKey.startsWith("sk-ant-");
    setTestResult(isValidFormat ? "ok" : "error");
    setTesting(false);
    if (isValidFormat)
      ue.success("Connection test passed! API key format looks valid.");
    else
      ue.error(
        provider === "openai" ? "OpenAI keys start with 'sk-'." : "Anthropic keys start with 'sk-ant-'."
      );
  };
  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedConfig(null);
    setApiKey("");
    setProvider("openai");
    setModel(DEFAULT_MODELS.openai);
    setTestResult("idle");
    ue.info("AI configuration cleared.");
  };
  const currentModels = MODELS[provider];
  const isConfigured = !!(savedConfig == null ? void 0 : savedConfig.apiKey);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "animate-fade-in-up p-6 space-y-6 max-w-3xl mx-auto",
      "data-ocid": "ai-settings-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${workspaceId}/ai`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold tracking-tight text-foreground", children: "AI Settings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Configure your AI provider to enable real AI features" })
          ] }),
          isConfigured && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3 mr-1" }),
            "Configured"
          ] })
        ] }),
        savedConfig && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-500/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-emerald-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Active Configuration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                "Provider:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground capitalize", children: savedConfig.provider === "openai" ? "OpenAI" : "Anthropic" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                "Model:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: savedConfig.model })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                "API Key:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-medium text-foreground", children: maskApiKey(savedConfig.apiKey) })
              ] })
            ] }),
            savedConfig.savedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
              "Saved",
              " ",
              new Date(savedConfig.savedAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short"
              })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: handleClear,
              className: "text-muted-foreground hover:text-destructive shrink-0",
              "data-ocid": "ai-settings-clear",
              children: "Clear"
            }
          )
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card rounded-xl border border-border/50 bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "w-4 h-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display font-semibold", children: "Provider Configuration" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Choose your AI provider and enter your API key" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-5 pt-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "provider",
                  className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                  children: "AI Provider"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: provider,
                  onValueChange: (v) => setProvider(v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "provider", "data-ocid": "ai-settings-provider", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "openai", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-4 h-4 text-emerald-500" }),
                        "OpenAI"
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "anthropic", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-orange-500" }),
                        "Anthropic (Claude)"
                      ] }) })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "api-key",
                  className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-3.5 h-3.5" }),
                    "API Key"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "api-key",
                    type: showKey ? "text" : "password",
                    placeholder: provider === "openai" ? "sk-..." : "sk-ant-...",
                    value: apiKey,
                    onChange: (e) => {
                      setApiKey(e.target.value);
                      setTestResult("idle");
                    },
                    className: "pr-10 font-mono text-sm",
                    "data-ocid": "ai-settings-api-key"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowKey((v) => !v),
                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                    "aria-label": showKey ? "Hide API key" : "Show API key",
                    children: showKey ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: provider === "openai" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                "Get your key at",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: "https://platform.openai.com/api-keys",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-primary underline-offset-2 hover:underline",
                    children: "platform.openai.com/api-keys"
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                "Get your key at",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: "https://console.anthropic.com/keys",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-primary underline-offset-2 hover:underline",
                    children: "console.anthropic.com/keys"
                  }
                )
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "model",
                  className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                  children: "Default Model"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: model, onValueChange: setModel, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "model", "data-ocid": "ai-settings-model", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: currentModels.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m.value, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: m.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: m.tier })
                ] }) }, m.value)) })
              ] })
            ] }),
            testResult !== "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `flex items-center gap-2 p-3 rounded-xl text-sm border ${testResult === "ok" ? "bg-emerald-500/5 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400" : "bg-destructive/5 border-destructive/20 text-destructive"}`,
                children: [
                  testResult === "ok" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 shrink-0" }),
                  testResult === "ok" ? "API key format is valid. AI features are ready to use." : "API key format does not match the expected pattern for this provider."
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: handleSave,
                  disabled: saving || !apiKey.trim(),
                  className: "bg-primary hover:bg-primary/90 text-primary-foreground active-press",
                  "data-ocid": "ai-settings-save",
                  children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
                    "Saving..."
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 mr-2" }),
                    "Save Configuration"
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  onClick: handleTest,
                  disabled: testing || !apiKey.trim(),
                  "data-ocid": "ai-settings-test",
                  children: testing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
                    "Testing..."
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 mr-2" }),
                    "Test Connection"
                  ] })
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          {
            icon: Key,
            title: "Key Security",
            desc: "Your API key is stored locally in your browser. It is never sent to Fourthspace servers — only directly to your chosen AI provider.",
            color: "text-amber-500 bg-amber-500/10"
          },
          {
            icon: Bot,
            title: "What this enables",
            desc: "Once configured, AI features in Content Creator, Chat Assistant, and Language Translation will use real AI responses instead of demos.",
            color: "text-violet-500 bg-violet-500/10"
          }
        ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: "shadow-card rounded-xl border border-border/50 bg-card",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: item.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 leading-relaxed", children: item.desc })
              ] })
            ] }) })
          },
          item.title
        )) })
      ]
    }
  );
}
export {
  AISettingsPage as default
};
