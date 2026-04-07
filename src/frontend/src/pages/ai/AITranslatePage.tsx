import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRightLeft,
  CheckCheck,
  Copy,
  Languages,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type LangCode = "en" | "es" | "fr" | "de" | "ja" | "zh" | "ar";

const LANGUAGE_LABELS: Record<LangCode, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  ja: "Japanese",
  zh: "Chinese",
  ar: "Arabic",
};

const FIXED_TRANSLATIONS: Record<LangCode, string> = {
  en: "",
  es: "¡Hola! Esta es una traducción de demostración. Fourthspace admite traducción de idiomas con tecnología de IA para ayudar a su equipo a comunicarse globalmente. El futuro del trabajo es integrado, inteligente e inmediato.",
  fr: "Bonjour! Ceci est une traduction de démonstration. Fourthspace prend en charge la traduction linguistique alimentée par l'IA pour aider votre équipe à communiquer globalement. L'avenir du travail est intégré, intelligent et immédiat.",
  de: "Hallo! Dies ist eine Demo-Übersetzung. Fourthspace unterstützt KI-gestützte Sprachübersetzung, um Ihrem Team die globale Kommunikation zu erleichtern. Die Zukunft der Arbeit ist integriert, intelligent und unmittelbar.",
  ja: "こんにちは！これはデモ翻訳です。Fourthspaceは、チームがグローバルにコミュニケーションできるよう、AI搭載の言語翻訳をサポートしています。仕事の未来は統合的で、インテリジェントで、即時的です。",
  zh: "你好！这是一个演示翻译。Fourthspace支持AI驱动的语言翻译，帮助您的团队在全球范围内进行沟通。工作的未来是整合的、智能的、即时的。",
  ar: "مرحباً! هذه ترجمة تجريبية. يدعم Fourthspace الترجمة اللغوية المدعومة بالذكاء الاصطناعي لمساعدة فريقك على التواصل عالمياً. مستقبل العمل متكامل وذكي وفوري.",
};

export default function AITranslatePage() {
  const navigate = useNavigate();
  const [sourceLang, setSourceLang] = useState<LangCode>("en");
  const [targetLang, setTargetLang] = useState<LangCode>("es");
  const [sourceText, setSourceText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
      toast.error("Please enter some text to translate.");
      return;
    }
    if (sourceLang === targetLang) {
      toast.error("Source and target languages must be different.");
      return;
    }
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 1000));
    // Use fixed translation if available, otherwise use a prefix + source text
    const translation =
      FIXED_TRANSLATIONS[targetLang] ||
      `[${LANGUAGE_LABELS[targetLang]}] ${sourceText}`;
    setResult(translation);
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Translation copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = sourceText.trim()
    ? sourceText.trim().split(/\s+/).length
    : 0;

  return (
    <div
      className="flex flex-col min-h-full p-6 max-w-5xl mx-auto w-full"
      data-ocid="ai-translate"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/app/ai" })}
          data-ocid="ai-translate-back"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Languages className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-lg font-display font-semibold text-foreground leading-none">
              Language Translation
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Translate content across 7 languages instantly
            </p>
          </div>
        </div>
        <Badge className="ml-auto bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-800 dark:text-indigo-400">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* Language Selector Bar */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-card border border-border rounded-xl">
        <div className="flex flex-col gap-1.5 flex-1">
          <Label
            htmlFor="source-lang"
            className="text-xs text-muted-foreground uppercase tracking-wide"
          >
            Translate from
          </Label>
          <Select
            value={sourceLang}
            onValueChange={(v) => {
              setSourceLang(v as LangCode);
              setResult(null);
            }}
          >
            <SelectTrigger
              id="source-lang"
              data-ocid="ai-translate-source-lang"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(LANGUAGE_LABELS) as [LangCode, string][]).map(
                ([code, label]) => (
                  <SelectItem key={code} value={code}>
                    {label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="mt-5 shrink-0 hover:bg-indigo-500/10 hover:border-indigo-300 transition-colors"
          onClick={handleSwap}
          aria-label="Swap languages"
          data-ocid="ai-translate-swap"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </Button>

        <div className="flex flex-col gap-1.5 flex-1">
          <Label
            htmlFor="target-lang"
            className="text-xs text-muted-foreground uppercase tracking-wide"
          >
            Translate to
          </Label>
          <Select
            value={targetLang}
            onValueChange={(v) => {
              setTargetLang(v as LangCode);
              setResult(null);
            }}
          >
            <SelectTrigger
              id="target-lang"
              data-ocid="ai-translate-target-lang"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(LANGUAGE_LABELS) as [LangCode, string][]).map(
                ([code, label]) => (
                  <SelectItem key={code} value={code}>
                    {label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Translation Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1">
        {/* Source */}
        <Card className="border-border flex flex-col">
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {LANGUAGE_LABELS[sourceLang]}
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {wordCount} {wordCount === 1 ? "word" : "words"} ·{" "}
              {sourceText.length} chars
            </span>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-3">
            <Textarea
              placeholder="Enter text to translate..."
              value={sourceText}
              onChange={(e) => {
                setSourceText(e.target.value);
                setResult(null);
              }}
              rows={10}
              className="resize-none flex-1 min-h-[200px]"
              data-ocid="ai-translate-source-text"
            />
            <Button
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-0 hover:opacity-90 transition-opacity"
              onClick={handleTranslate}
              disabled={loading || !sourceText.trim()}
              data-ocid="ai-translate-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Languages className="w-4 h-4 mr-2" />
                  Translate to {LANGUAGE_LABELS[targetLang]}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Target */}
        <Card className="border-border flex flex-col">
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {LANGUAGE_LABELS[targetLang]}
            </CardTitle>
            {result && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 text-xs"
                data-ocid="ai-translate-copy"
              >
                {copied ? (
                  <CheckCheck className="w-3.5 h-3.5 mr-1.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 h-[200px] text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                </div>
                <p className="text-sm">
                  Translating to {LANGUAGE_LABELS[targetLang]}...
                </p>
              </div>
            ) : result ? (
              <div
                className="bg-muted/40 rounded-lg p-4 text-sm leading-relaxed text-foreground min-h-[200px] whitespace-pre-wrap"
                data-ocid="ai-translate-result"
              >
                {result}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 h-[200px] text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Languages className="w-5 h-5" />
                </div>
                <p className="text-sm text-center">
                  Your translation will appear here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-5">
        <Sparkles className="w-3 h-3 inline mr-1 text-indigo-400" />
        Translations are simulated for this workspace build. Powered by
        Fourthspace AI.
      </p>
    </div>
  );
}
