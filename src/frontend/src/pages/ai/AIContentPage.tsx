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
  CheckCheck,
  Copy,
  FileText,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ContentType = "blog" | "email" | "meeting" | "project" | "social";
type Tone = "professional" | "casual" | "formal" | "creative";

const MOCK_RESPONSES: Record<ContentType, string> = {
  blog: `# The Future of Remote Work: Building High-Performing Teams Across Time Zones

The modern workplace has undergone a seismic shift. What began as a temporary response to global disruption has evolved into a permanent paradigm — one that demands new leadership strategies, communication frameworks, and cultural norms.

## Key Insights

**1. Asynchronous-First Communication**
High-performing remote teams don't rely on synchronous meetings for every decision. They build robust documentation habits and leverage structured async workflows that respect teammates' time zones.

**2. Outcome-Based Performance Metrics**
Rather than measuring hours worked, leading organizations have shifted to outcome-based metrics. This creates accountability while preserving the autonomy that makes remote work so appealing.

**3. Intentional Culture Building**
Culture doesn't happen by accident in distributed teams. It requires deliberate investment — virtual team rituals, recognition systems, and opportunities for informal connection.

## Practical Next Steps

Start with a communication audit. Map out every channel your team uses and ask: is this the right medium for this message? Then establish clear norms and watch productivity — and morale — climb.

*Ready to transform your remote work strategy? The tools are here. The question is how you use them.*`,

  email: `Subject: Q3 Performance Review — Action Items & Next Steps

Hi Team,

I hope this message finds you well. Following our Q3 performance review session yesterday, I wanted to summarize the key takeaways and outline the action items we've agreed upon.

**Key Highlights**
- Revenue target achieved at 94% — strong performance given market headwinds
- Customer satisfaction scores improved by 8 points quarter-over-quarter
- Two critical product features shipped ahead of schedule

**Action Items**

| Owner     | Task                          | Deadline |
|-----------|-------------------------------|----------|
| Marketing | Finalize Q4 campaign brief    | Oct 15   |
| Product   | Prioritize backlog for sprint | Oct 12   |
| Sales     | Submit pipeline forecast      | Oct 10   |

Our next all-hands is scheduled for October 20th at 10:00 AM EST. Please come prepared with your team updates and blockers.

Thank you all for a strong quarter. Let's keep the momentum going.

Best regards,
The Leadership Team`,

  meeting: `# Meeting Notes — Quarterly Business Review
Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
Attendees: Sarah Chen, Marcus Rodriguez, Priya Patel, James O'Brien

---

## Agenda Items Covered

### 1. Q3 Performance Summary
- Revenue: $2.4M vs $2.55M target (94% attainment)
- Active users up 22% YoY
- Customer churn reduced to 3.2% (from 4.8%)

### 2. Product Roadmap Update
- Feature A shipped Sept 28 — positive early adoption signals
- Feature B delayed 2 weeks due to infrastructure dependency
- Mobile app v2.1 on track for October release

### 3. Team Capacity & Headcount
- Engineering: 2 open roles in final interview stages
- Q4 capacity looks healthy pending closures

---

## Decisions Made
- Prioritize mobile over web for next sprint cycle
- Freeze scope on Feature C until Q1
- Move weekly syncs from Monday to Tuesday

## Follow-Ups
- Marcus to share updated roadmap by EOD Friday
- Priya to coordinate onboarding plan for new hires`,

  project: `# Project Summary: Platform Infrastructure Modernization

**Status:** In Progress (Phase 2 of 4)
**Lead:** Engineering Team
**Last Updated:** ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

---

## Executive Summary

The platform migration is progressing on schedule. Phase 1 (database schema migration) completed 3 days ahead of schedule. Phase 2 (API layer refactoring) is currently 65% complete with no critical blockers.

## Progress Overview

| Phase | Description       | Status       | Completion |
|-------|-------------------|--------------|------------|
| 1     | Database Migration| Complete     | 100%       |
| 2     | API Refactoring   | In Progress  | 65%        |
| 3     | Frontend Integration| Pending    | 0%         |
| 4     | QA & Deployment   | Pending      | 0%         |

## Budget Status
- Allocated: $180,000
- Spent to date: $94,500 (52.5%)
- Forecast to complete: $165,000 (under budget by $15K)

## Next Milestones
- API layer complete: Oct 18
- Phase 3 kickoff: Oct 21
- Final deployment: Nov 10`,

  social: `🚀 Big things are happening at Fourthspace this quarter.

We've been heads down building features our users actually asked for — and the results speak for themselves: 22% more active users, faster load times, and a brand-new AI workspace assistant that's already saving teams hours every week.

The best products aren't built in boardrooms. They're built with feedback from the people who use them every day. Thank you for being part of this journey.

What feature would YOU like to see next? Drop it in the comments 👇

#ProductUpdate #WorkspaceTools #Fourthspace #BuildInPublic #SaaS`,
};

export default function AIContentPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState<ContentType>("blog");
  const [tone, setTone] = useState<Tone>("professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first.");
      return;
    }
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 1500));
    setResult(MOCK_RESPONSES[contentType]);
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNote = () => {
    toast.success("Saved as note! Find it in your Notes section.");
  };

  return (
    <div
      className="flex flex-col min-h-full p-6 max-w-4xl mx-auto w-full"
      data-ocid="ai-content"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/app/ai" })}
          data-ocid="ai-content-back"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-violet-500" />
          </div>
          <div>
            <h1 className="text-lg font-display font-semibold text-foreground leading-none">
              Content Creator
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Generate professional content instantly
            </p>
          </div>
        </div>
        <Badge className="ml-auto bg-violet-500/10 text-violet-600 border-violet-200 dark:border-violet-800 dark:text-violet-400">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Input Panel */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">
              Describe what you want to create
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="prompt" className="text-sm font-medium">
                Prompt
              </Label>
              <Textarea
                id="prompt"
                placeholder="Describe what you want to create..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                className="resize-none"
                data-ocid="ai-content-prompt"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="content-type" className="text-sm font-medium">
                  Content Type
                </Label>
                <Select
                  value={contentType}
                  onValueChange={(v) => setContentType(v as ContentType)}
                >
                  <SelectTrigger
                    id="content-type"
                    data-ocid="ai-content-type-select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog">Blog Post</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">Meeting Notes</SelectItem>
                    <SelectItem value="project">Project Summary</SelectItem>
                    <SelectItem value="social">Social Media Post</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="tone" className="text-sm font-medium">
                  Tone
                </Label>
                <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                  <SelectTrigger id="tone" data-ocid="ai-content-tone-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0 hover:opacity-90 transition-opacity"
              onClick={handleGenerate}
              disabled={loading}
              data-ocid="ai-content-generate"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="border-border flex flex-col">
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-base font-display">
              Generated Content
            </CardTitle>
            {result && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveNote}
                  data-ocid="ai-content-save-note"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Save as Note
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  data-ocid="ai-content-copy"
                >
                  {copied ? (
                    <CheckCheck className="w-3.5 h-3.5 mr-1.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
                </div>
                <p className="text-sm">Generating your content...</p>
              </div>
            ) : result ? (
              <div
                className="bg-muted/40 rounded-lg p-4 text-sm font-body leading-relaxed whitespace-pre-wrap text-foreground max-h-[480px] overflow-y-auto"
                data-ocid="ai-content-output"
              >
                {result}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-sm text-center">
                  Enter a prompt, select content type and tone, then click
                  Generate.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
