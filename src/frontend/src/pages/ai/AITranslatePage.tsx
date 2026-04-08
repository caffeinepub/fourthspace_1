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
  AlertCircle,
  ArrowLeft,
  ArrowRightLeft,
  CheckCheck,
  Copy,
  Languages,
  Loader2,
  Settings,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useWorkspace } from "../../hooks/useWorkspace";

type LangCode =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "ja"
  | "zh"
  | "ar"
  | "pt"
  | "it"
  | "ko";

const LANGUAGE_LABELS: Record<LangCode, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  ja: "Japanese",
  zh: "Chinese (Simplified)",
  ar: "Arabic",
  pt: "Portuguese",
  it: "Italian",
  ko: "Korean",
};

const AI_STORAGE_KEY = "fourthspace_ai_config";

interface StoredConfig {
  provider: string;
  apiKey: string;
  model: string;
}

function loadAIConfig(): StoredConfig | null {
  try {
    const raw = localStorage.getItem(AI_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredConfig) : null;
  } catch {
    return null;
  }
}

async function callAITranslate(
  config: StoredConfig,
  text: string,
  sourceLang: LangCode,
  targetLang: LangCode,
): Promise<string> {
  const systemPrompt =
    "You are a professional translator. Translate the provided text accurately and naturally. Return only the translation.";
  const userPrompt = `Translate from ${LANGUAGE_LABELS[sourceLang]} to ${LANGUAGE_LABELS[targetLang]}:\n\n${text}`;
  if (config.provider === "openai") {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 2000,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        (err as { error?: { message?: string } }).error?.message ??
          `OpenAI error ${res.status}`,
      );
    }
    const data = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    return data.choices[0]?.message?.content ?? "";
  }
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { error?: { message?: string } }).error?.message ??
        `Anthropic error ${res.status}`,
    );
  }
  const data = (await res.json()) as { content: { text: string }[] };
  return data.content[0]?.text ?? "";
}

const DEMO_TRANSLATIONS: Record<LangCode, string> = {
  en: "",
  es: "Esta es una traducción de demostración. Configure su proveedor de IA para obtener traducciones reales.",
  fr: "Ceci est une traduction de démonstration. Configurez votre fournisseur d'IA pour obtenir de vraies traductions.",
  de: "Dies ist eine Demo-Übersetzung. Konfigurieren Sie Ihren KI-Anbieter für echte Übersetzungen.",
  ja: "これはデモ翻訳です。本格的な翻訳を得るには、AI設定でAIプロバイダーを設定してください。",
  zh: "这是一个演示翻译。请在AI设置中配置您的AI提供商以获得真实翻译。",
  ar: "هذه ترجمة تجريبية. قم بتكوين مزود الذكاء الاصطناعي للحصول على ترجمات حقيقية.",
  pt: "Esta é uma tradução de demonstração. Configure seu provedor de IA para obter traduções reais.",
  it: "Questa è una traduzione dimostrativa. Configura il tuo provider AI per ottenere traduzioni reali.",
  ko: "이것은 데모 번역입니다. AI 설정에서 AI 공급자를 구성하세요.",
};

export default function AITranslatePage() {
  const navigate = useNavigate();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const config = loadAIConfig();

  const [sourceLang, setSourceLang] = useState<LangCode>("en");
  const [targetLang, setTargetLang] = useState<LangCode>("es");
  const [sourceText, setSourceText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    try {
      if (config?.apiKey) {
        const translation = await callAITranslate(
          config,
          sourceText,
          sourceLang,
          targetLang,
        );
        setResult(translation);
      } else {
        await new Promise((r) => setTimeout(r, 1000));
        setResult(
          DEMO_TRANSLATIONS[targetLang] ||
            `[${LANGUAGE_LABELS[targetLang]}] ${sourceText}`,
        );
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Translation failed.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Translation copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="animate-fade-in-up flex flex-col min-h-full p-6 max-w-5xl mx-auto w-full"
      data-ocid="ai-translate"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: `/app/${workspaceId}/ai` as "/" })}
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
              {config?.apiKey
                ? `Real-time via ${config.model}`
                : "Demo mode — configure AI for real translations"}
            </p>
          </div>
        </div>
        {config?.apiKey ? (
          <Badge className="ml-auto bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-800 dark:text-indigo-400">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate({ to: `/app/${workspaceId}/ai/settings` as "/" })
            }
            className="ml-auto text-xs"
            data-ocid="ai-translate-settings-link"
          >
            <Settings className="w-3 h-3 mr-1.5" />
            Configure AI
          </Button>
        )}
      </div>

      {/* Language Selector Bar */}
      <div className="flex items-end gap-4 mb-6 p-4 bg-card border border-border/50 rounded-xl shadow-card">
        <div className="flex flex-col gap-1.5 flex-1">
          <Label
            htmlFor="source-lang"
            className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
          >
            Translate from
          </Label>
          <Select
            value={sourceLang}
            onValueChange={(v) => {
              setSourceLang(v as LangCode);
              setResult(null);
              setError(null);
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
          className="shrink-0 hover:bg-indigo-500/10 hover:border-indigo-300 transition-colors mb-0.5"
          onClick={handleSwap}
          aria-label="Swap languages"
          data-ocid="ai-translate-swap"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </Button>
        <div className="flex flex-col gap-1.5 flex-1">
          <Label
            htmlFor="target-lang"
            className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
          >
            Translate to
          </Label>
          <Select
            value={targetLang}
            onValueChange={(v) => {
              setTargetLang(v as LangCode);
              setResult(null);
              setError(null);
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
        <Card className="shadow-card rounded-xl border border-border/50 bg-card flex flex-col">
          <CardHeader className="pb-2 flex-row items-center justify-between border-b border-border/40">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {LANGUAGE_LABELS[sourceLang]}
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {sourceText.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-3 pt-4">
            <Textarea
              placeholder="Enter text to translate..."
              value={sourceText}
              onChange={(e) => {
                setSourceText(e.target.value);
                setResult(null);
                setError(null);
              }}
              rows={10}
              className="resize-none flex-1 min-h-[200px]"
              data-ocid="ai-translate-source-text"
            />
            <Button
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-0 hover:opacity-90 active-press"
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
        <Card className="shadow-card rounded-xl border border-border/50 bg-card flex flex-col">
          <CardHeader className="pb-2 flex-row items-center justify-between border-b border-border/40">
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
                  <CheckCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1 pt-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 h-[200px] text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                </div>
                <p className="text-sm">
                  Translating to {LANGUAGE_LABELS[targetLang]}...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center gap-3 h-[200px]">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
                <div className="text-center px-4">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Translation failed
                  </p>
                  <p className="text-xs text-muted-foreground">{error}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleTranslate}>
                  Try again
                </Button>
              </div>
            ) : result ? (
              <div
                className="bg-muted/30 rounded-xl border border-border/40 p-4 text-sm leading-relaxed text-foreground min-h-[200px] whitespace-pre-wrap"
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
    </div>
  );
}
