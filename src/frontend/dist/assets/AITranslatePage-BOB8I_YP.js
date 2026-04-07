import { a as useNavigate, r as reactExports, j as jsxRuntimeExports, B as Button, S as Sparkles } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-wy6FYjGT.js";
import { L as Label } from "./label-CBtn2p-5.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D0Yw2k_p.js";
import { S as Separator } from "./separator-B6dqygkP.js";
import { T as Textarea } from "./textarea-DoR08WA4.js";
import { u as ue } from "./index-p-k3Ndic.js";
import { A as ArrowLeft } from "./arrow-left-mNBAKt8w.js";
import { L as Languages } from "./languages-Bs-_FT8N.js";
import { A as ArrowRightLeft } from "./arrow-right-left-CG4euwl7.js";
import { L as LoaderCircle } from "./loader-circle-CEvzFFjS.js";
import { C as CheckCheck, a as Copy } from "./copy-Bjz05tAL.js";
import "./index-IXOTxK3N.js";
import "./index-BGFsRO7G.js";
import "./check-EW6vRiNm.js";
const LANGUAGE_LABELS = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  ja: "Japanese",
  zh: "Chinese",
  ar: "Arabic"
};
const FIXED_TRANSLATIONS = {
  en: "",
  es: "¡Hola! Esta es una traducción de demostración. Fourthspace admite traducción de idiomas con tecnología de IA para ayudar a su equipo a comunicarse globalmente. El futuro del trabajo es integrado, inteligente e inmediato.",
  fr: "Bonjour! Ceci est une traduction de démonstration. Fourthspace prend en charge la traduction linguistique alimentée par l'IA pour aider votre équipe à communiquer globalement. L'avenir du travail est intégré, intelligent et immédiat.",
  de: "Hallo! Dies ist eine Demo-Übersetzung. Fourthspace unterstützt KI-gestützte Sprachübersetzung, um Ihrem Team die globale Kommunikation zu erleichtern. Die Zukunft der Arbeit ist integriert, intelligent und unmittelbar.",
  ja: "こんにちは！これはデモ翻訳です。Fourthspaceは、チームがグローバルにコミュニケーションできるよう、AI搭載の言語翻訳をサポートしています。仕事の未来は統合的で、インテリジェントで、即時的です。",
  zh: "你好！这是一个演示翻译。Fourthspace支持AI驱动的语言翻译，帮助您的团队在全球范围内进行沟通。工作的未来是整合的、智能的、即时的。",
  ar: "مرحباً! هذه ترجمة تجريبية. يدعم Fourthspace الترجمة اللغوية المدعومة بالذكاء الاصطناعي لمساعدة فريقك على التواصل عالمياً. مستقبل العمل متكامل وذكي وفوري."
};
function AITranslatePage() {
  const navigate = useNavigate();
  const [sourceLang, setSourceLang] = reactExports.useState("en");
  const [targetLang, setTargetLang] = reactExports.useState("es");
  const [sourceText, setSourceText] = reactExports.useState("");
  const [result, setResult] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [copied, setCopied] = reactExports.useState(false);
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
    await new Promise((r) => setTimeout(r, 1e3));
    const translation = FIXED_TRANSLATIONS[targetLang] || `[${LANGUAGE_LABELS[targetLang]}] ${sourceText}`;
    setResult(translation);
    setLoading(false);
  };
  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    ue.success("Translation copied to clipboard!");
    setTimeout(() => setCopied(false), 2e3);
  };
  const wordCount = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col min-h-full p-6 max-w-5xl mx-auto w-full",
      "data-ocid": "ai-translate",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => navigate({ to: "/app/ai" }),
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Translate content across 7 languages instantly" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "ml-auto bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-800 dark:text-indigo-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3 mr-1" }),
            "AI Powered"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-6 p-4 bg-card border border-border rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "source-lang",
                className: "text-xs text-muted-foreground uppercase tracking-wide",
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
              className: "mt-5 shrink-0 hover:bg-indigo-500/10 hover:border-indigo-300 transition-colors",
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
                className: "text-xs text-muted-foreground uppercase tracking-wide",
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 flex-row items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: LANGUAGE_LABELS[sourceLang] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                wordCount,
                " ",
                wordCount === 1 ? "word" : "words",
                " ·",
                " ",
                sourceText.length,
                " chars"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex-1 flex flex-col gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  placeholder: "Enter text to translate...",
                  value: sourceText,
                  onChange: (e) => {
                    setSourceText(e.target.value);
                    setResult(null);
                  },
                  rows: 10,
                  className: "resize-none flex-1 min-h-[200px]",
                  "data-ocid": "ai-translate-source-text"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-0 hover:opacity-90 transition-opacity",
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 flex-row items-center justify-between", children: [
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
                    copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "w-3.5 h-3.5 mr-1.5 text-green-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5 mr-1.5" }),
                    copied ? "Copied!" : "Copy"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex-1", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 h-[200px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 text-indigo-500 animate-spin" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
                "Translating to ",
                LANGUAGE_LABELS[targetLang],
                "..."
              ] })
            ] }) : result ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "bg-muted/40 rounded-lg p-4 text-sm leading-relaxed text-foreground min-h-[200px] whitespace-pre-wrap",
                "data-ocid": "ai-translate-result",
                children: result
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 h-[200px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-center", children: "Your translation will appear here." })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3 inline mr-1 text-indigo-400" }),
          "Translations are simulated for this workspace build. Powered by Fourthspace AI."
        ] })
      ]
    }
  );
}
export {
  AITranslatePage as default
};
