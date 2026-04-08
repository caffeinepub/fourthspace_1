import { d as useNavigate, f as useWorkspace, r as reactExports, j as jsxRuntimeExports, B as Button, S as Sparkles, y as Settings } from "./index-BZqaRhAX.js";
import { B as Badge } from "./index--nGTycyb.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DQu6DGwy.js";
import { L as Label } from "./label-CvyzRjc5.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CkiaF30e.js";
import { S as Separator } from "./separator-J7DkFB-P.js";
import { T as Textarea } from "./textarea-CZBafaSY.js";
import { u as ue } from "./index-BRf-248B.js";
import { A as ArrowLeft } from "./arrow-left-BCLeiEG1.js";
import { L as Languages } from "./languages-YVZiSHrd.js";
import { A as ArrowRightLeft } from "./arrow-right-left-D3Q9IcV8.js";
import { L as LoaderCircle } from "./loader-circle-MfA_AsIp.js";
import { C as CheckCheck } from "./check-check-BY5-OcOq.js";
import { C as Copy } from "./copy-ltoxOxzI.js";
import { C as CircleAlert } from "./circle-alert-BzUnhcW5.js";
import "./index-IXOTxK3N.js";
import "./index-38IBqnCJ.js";
import "./chevron-up-Dd5ZqoJs.js";
const LANGUAGE_LABELS = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  ja: "Japanese",
  zh: "Chinese (Simplified)",
  ar: "Arabic",
  pt: "Portuguese",
  it: "Italian",
  ko: "Korean"
};
const AI_STORAGE_KEY = "fourthspace_ai_config";
function loadAIConfig() {
  try {
    const raw = localStorage.getItem(AI_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
async function callAITranslate(config, text, sourceLang, targetLang) {
  var _a, _b, _c, _d, _e;
  const systemPrompt = "You are a professional translator. Translate the provided text accurately and naturally. Return only the translation.";
  const userPrompt = `Translate from ${LANGUAGE_LABELS[sourceLang]} to ${LANGUAGE_LABELS[targetLang]}:

${text}`;
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
        max_tokens: 2e3
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
      max_tokens: 2e3,
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
const DEMO_TRANSLATIONS = {
  en: "",
  es: "Esta es una traducción de demostración. Configure su proveedor de IA para obtener traducciones reales.",
  fr: "Ceci est une traduction de démonstration. Configurez votre fournisseur d'IA pour obtenir de vraies traductions.",
  de: "Dies ist eine Demo-Übersetzung. Konfigurieren Sie Ihren KI-Anbieter für echte Übersetzungen.",
  ja: "これはデモ翻訳です。本格的な翻訳を得るには、AI設定でAIプロバイダーを設定してください。",
  zh: "这是一个演示翻译。请在AI设置中配置您的AI提供商以获得真实翻译。",
  ar: "هذه ترجمة تجريبية. قم بتكوين مزود الذكاء الاصطناعي للحصول على ترجمات حقيقية.",
  pt: "Esta é uma tradução de demonstração. Configure seu provedor de IA para obter traduções reais.",
  it: "Questa è una traduzione dimostrativa. Configura il tuo provider AI per ottenere traduzioni reali.",
  ko: "이것은 데모 번역입니다. AI 설정에서 AI 공급자를 구성하세요."
};
function AITranslatePage() {
  const navigate = useNavigate();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const config = loadAIConfig();
  const [sourceLang, setSourceLang] = reactExports.useState("en");
  const [targetLang, setTargetLang] = reactExports.useState("es");
  const [sourceText, setSourceText] = reactExports.useState("");
  const [result, setResult] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [copied, setCopied] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const handleSwap = () => {
    const prevSource = sourceLang;
    const prevTarget = targetLang;
    const prevResult = result;
    setSourceLang(prevTarget);
    setTargetLang(prevSource);
    if (prevResult) {
      setSourceText(prevResult);
      setResult(null);
    }
  };
  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      ue.error("Please enter some text to translate.");
      return;
    }
    if (sourceLang === targetLang) {
      ue.error("Source and target languages must be different.");
      return;
    }
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      if (config == null ? void 0 : config.apiKey) {
        const translation = await callAITranslate(
          config,
          sourceText,
          sourceLang,
          targetLang
        );
        setResult(translation);
      } else {
        await new Promise((r) => setTimeout(r, 1e3));
        setResult(
          DEMO_TRANSLATIONS[targetLang] || `[${LANGUAGE_LABELS[targetLang]}] ${sourceText}`
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Translation failed.";
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
    ue.success("Translation copied to clipboard!");
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "animate-fade-in-up flex flex-col min-h-full p-6 max-w-5xl mx-auto w-full",
      "data-ocid": "ai-translate",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => navigate({ to: `/app/${workspaceId}/ai` }),
              "data-ocid": "ai-translate-back",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }),
                "Back"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { className: "w-4 h-4 text-indigo-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-display font-semibold text-foreground leading-none", children: "Language Translation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: (config == null ? void 0 : config.apiKey) ? `Real-time via ${config.model}` : "Demo mode — configure AI for real translations" })
            ] })
          ] }),
          (config == null ? void 0 : config.apiKey) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "ml-auto bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-800 dark:text-indigo-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3 mr-1" }),
            "AI Powered"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => navigate({ to: `/app/${workspaceId}/ai/settings` }),
              className: "ml-auto text-xs",
              "data-ocid": "ai-translate-settings-link",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-3 h-3 mr-1.5" }),
                "Configure AI"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-4 mb-6 p-4 bg-card border border-border/50 rounded-xl shadow-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "source-lang",
                className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Translate from"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: sourceLang,
                onValueChange: (v) => {
                  setSourceLang(v);
                  setResult(null);
                  setError(null);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      id: "source-lang",
                      "data-ocid": "ai-translate-source-lang",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.entries(LANGUAGE_LABELS).map(
                    ([code, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: code, children: label }, code)
                  ) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              className: "shrink-0 hover:bg-indigo-500/10 hover:border-indigo-300 transition-colors mb-0.5",
              onClick: handleSwap,
              "aria-label": "Swap languages",
              "data-ocid": "ai-translate-swap",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "target-lang",
                className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Translate to"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: targetLang,
                onValueChange: (v) => {
                  setTargetLang(v);
                  setResult(null);
                  setError(null);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      id: "target-lang",
                      "data-ocid": "ai-translate-target-lang",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.entries(LANGUAGE_LABELS).map(
                    ([code, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: code, children: label }, code)
                  ) })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card rounded-xl border border-border/50 bg-card flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 flex-row items-center justify-between border-b border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: LANGUAGE_LABELS[sourceLang] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                sourceText.trim().split(/\s+/).filter(Boolean).length,
                " words"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex-1 flex flex-col gap-3 pt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  placeholder: "Enter text to translate...",
                  value: sourceText,
                  onChange: (e) => {
                    setSourceText(e.target.value);
                    setResult(null);
                    setError(null);
                  },
                  rows: 10,
                  className: "resize-none flex-1 min-h-[200px]",
                  "data-ocid": "ai-translate-source-text"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-0 hover:opacity-90 active-press",
                  onClick: handleTranslate,
                  disabled: loading || !sourceText.trim(),
                  "data-ocid": "ai-translate-submit",
                  children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
                    "Translating..."
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { className: "w-4 h-4 mr-2" }),
                    "Translate to ",
                    LANGUAGE_LABELS[targetLang]
                  ] })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card rounded-xl border border-border/50 bg-card flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 flex-row items-center justify-between border-b border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: LANGUAGE_LABELS[targetLang] }),
              result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: handleCopy,
                  className: "h-7 text-xs",
                  "data-ocid": "ai-translate-copy",
                  children: [
                    copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "w-3.5 h-3.5 mr-1.5 text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5 mr-1.5" }),
                    copied ? "Copied!" : "Copy"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex-1 pt-4", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 h-[200px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 text-indigo-500 animate-spin" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
                "Translating to ",
                LANGUAGE_LABELS[targetLang],
                "..."
              ] })
            ] }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 h-[200px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 text-destructive" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center px-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-1", children: "Translation failed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: error })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: handleTranslate, children: "Try again" })
            ] }) : result ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "bg-muted/30 rounded-xl border border-border/40 p-4 text-sm leading-relaxed text-foreground min-h-[200px] whitespace-pre-wrap",
                "data-ocid": "ai-translate-result",
                children: result
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 h-[200px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-center", children: "Your translation will appear here." })
            ] }) })
          ] })
        ] })
      ]
    }
  );
}
export {
  AITranslatePage as default
};
