import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Download,
  FileInput,
  Inbox,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { createActor } from "../../backend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";

interface FormSubmission {
  id: string;
  tenantId: string;
  formId: string;
  data: [string, string][];
  submittedAt: bigint;
  submitterEmail: string;
}

interface FormField {
  id: string;
  fieldLabel: string;
  fieldType: string;
  required: boolean;
  options: string[];
}
interface Form {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  status: string;
  publicUrl: string;
}
interface FieldAnalytic {
  fieldLabel: string;
  filled: number;
  total: number;
}
interface FormAnalytics {
  totalSubmissions: number;
  fieldCompletionRates: FieldAnalytic[];
}

function useForm(formId: string) {
  const { actor, isFetching } = useActor(createActor);
  const { activeWorkspaceId } = useWorkspace();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  return useQuery<Form | null>({
    queryKey: ["form", formId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return (
        actor as unknown as {
          getForm: (t: string, w: string, id: string) => Promise<Form | null>;
        }
      ).getForm(tenantId, workspaceId, formId);
    },
    enabled: !!actor && !isFetching && !!formId && !!workspaceId,
  });
}

function useFormSubmissions(formId: string) {
  const { actor, isFetching } = useActor(createActor);
  const { activeWorkspaceId } = useWorkspace();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  return useQuery<FormSubmission[]>({
    queryKey: ["form-submissions", formId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return (
        actor as unknown as {
          listFormSubmissions: (
            t: string,
            w: string,
            id: string,
          ) => Promise<FormSubmission[]>;
        }
      ).listFormSubmissions(tenantId, workspaceId, formId);
    },
    enabled: !!actor && !isFetching && !!formId && !!workspaceId,
  });
}

function useFormAnalytics(formId: string) {
  const { actor, isFetching } = useActor(createActor);
  const { activeWorkspaceId } = useWorkspace();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  return useQuery<FormAnalytics | null>({
    queryKey: ["form-analytics", formId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await (
          actor as unknown as {
            getFormAnalytics: (
              t: string,
              w: string,
              id: string,
            ) => Promise<FormAnalytics | null>;
          }
        ).getFormAnalytics(tenantId, workspaceId, formId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!formId && !!workspaceId,
  });
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));
}

function computeClientAnalytics(
  form: Form | null | undefined,
  submissions: FormSubmission[],
): FieldAnalytic[] {
  if (!form || !submissions.length) return [];
  return form.fields.map((field) => {
    const filled = submissions.filter((s) => {
      const entry = s.data.find(([label]) => label === field.fieldLabel);
      return entry?.[1]?.trim();
    }).length;
    return { fieldLabel: field.fieldLabel, filled, total: submissions.length };
  });
}

function exportCsv(
  form: Form | null | undefined,
  submissions: FormSubmission[],
) {
  if (!submissions.length) return;
  const fieldLabels = form?.fields.map((f) => f.fieldLabel) ?? [];
  const headers = ["Submission ID", "Email", "Submitted At", ...fieldLabels];
  const rows = submissions.map((s) => {
    const dataMap = Object.fromEntries(s.data);
    return [
      s.id,
      s.submitterEmail,
      formatTimestamp(s.submittedAt),
      ...fieldLabels.map((label) => dataMap[label] ?? ""),
    ];
  });
  const csvContent = [headers, ...rows]
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `submissions-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function AnalyticsSection({
  submissions,
  form,
  serverAnalytics,
}: {
  submissions: FormSubmission[];
  form: Form | null | undefined;
  serverAnalytics: FormAnalytics | null | undefined;
}) {
  const fieldRates = serverAnalytics?.fieldCompletionRates?.length
    ? serverAnalytics.fieldCompletionRates
    : computeClientAnalytics(form, submissions);
  const total = serverAnalytics?.totalSubmissions ?? submissions.length;
  if (!total) return null;

  const avgPct = fieldRates.length
    ? Math.round(
        (fieldRates.reduce(
          (acc, f) => acc + (f.total > 0 ? f.filled / f.total : 0),
          0,
        ) /
          fieldRates.length) *
          100,
      )
    : 0;

  return (
    <Card
      className="border-border/50 bg-card shadow-card"
      data-ocid="form-analytics"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" /> Submission Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-muted/40 p-4 text-center">
            <p className="text-2xl font-display font-bold text-foreground">
              {total}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Total Submissions
            </p>
          </div>
          <div className="rounded-xl bg-muted/40 p-4 text-center">
            <p className="text-2xl font-display font-bold text-foreground">
              {form?.fields.length ?? 0}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Form Fields</p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-4 text-center">
            <p className="text-2xl font-display font-bold text-emerald-600 dark:text-emerald-400">
              {avgPct}%
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Avg. Completion
            </p>
          </div>
        </div>
        {fieldRates.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Field Completion Rates
            </p>
            <div className="space-y-2.5">
              {fieldRates.map((f) => {
                const pct =
                  f.total > 0 ? Math.round((f.filled / f.total) * 100) : 0;
                return (
                  <div key={f.fieldLabel} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground font-medium truncate max-w-[60%]">
                        {f.fieldLabel}
                      </span>
                      <span className="text-muted-foreground shrink-0 ml-2">
                        {f.filled}/{f.total} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-destructive"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SubmissionRow({
  submission,
  fieldLabels,
}: { submission: FormSubmission; fieldLabels: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const dataMap = Object.fromEntries(submission.data);
  const initials = submission.submitterEmail.slice(0, 2).toUpperCase() || "??";
  const preview = submission.data[0]?.[1] ?? "";

  return (
    <>
      <button
        type="button"
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors duration-150 text-left"
        onClick={() => setExpanded((v) => !v)}
        data-ocid={`submission-row-${submission.id}`}
        aria-expanded={expanded}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <span className="text-xs font-bold text-primary">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {submission.submitterEmail || "Anonymous"}
          </p>
          {preview && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {preview}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <p className="text-xs text-muted-foreground hidden sm:block">
            {formatTimestamp(submission.submittedAt)}
          </p>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>
      {expanded && (
        <div
          className="px-5 pb-4 bg-muted/10 border-t border-border/40"
          data-ocid={`submission-detail-${submission.id}`}
        >
          <div className="grid gap-3 sm:grid-cols-2 pt-4">
            {fieldLabels.map((label) => (
              <div key={label} className="space-y-0.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {label}
                </p>
                <p className="text-sm text-foreground break-words">
                  {dataMap[label] || (
                    <span className="text-muted-foreground italic">—</span>
                  )}
                </p>
              </div>
            ))}
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Submitter Email
              </p>
              <p className="text-sm text-foreground">
                {submission.submitterEmail || "—"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function FormSubmissionsPage() {
  const { formId } = useParams({
    from: "/app/$workspaceId/admin/forms/$formId/submissions",
  });
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const { data: form, isLoading: formLoading } = useForm(formId);
  const { data: submissions = [], isLoading: subsLoading } =
    useFormSubmissions(formId);
  const { data: serverAnalytics } = useFormAnalytics(formId);
  const isLoading = formLoading || subsLoading;
  const fieldLabels = form?.fields.map((f) => f.fieldLabel) ?? [];

  return (
    <div
      className="p-6 space-y-6 animate-fade-in-up"
      data-ocid="form-submissions-page"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" asChild className="hover:bg-muted">
          <Link
            to={`/app/${workspaceId}/admin/forms` as "/"}
            aria-label="Back to forms"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          {formLoading ? (
            <Skeleton className="h-7 w-48 mb-1.5" />
          ) : (
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {form?.title ?? "Form Submissions"}
            </h1>
          )}
          <p className="text-sm text-muted-foreground">
            Responses received for this form
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportCsv(form, submissions)}
          disabled={submissions.length === 0}
          data-ocid="export-submissions-btn"
          className="active-press"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats badges */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <Badge className="flex items-center gap-1.5 text-xs rounded-full px-2.5 py-0.5 bg-muted text-muted-foreground border-border">
          <Inbox className="h-3.5 w-3.5" />
          {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
        </Badge>
        {form && (
          <Badge className="flex items-center gap-1.5 text-xs rounded-full px-2.5 py-0.5 bg-muted text-muted-foreground border-border">
            <FileInput className="h-3.5 w-3.5" />
            {form.fields.length} field{form.fields.length !== 1 ? "s" : ""}
          </Badge>
        )}
        {submissions.length > 0 && (
          <Badge className="flex items-center gap-1.5 text-xs rounded-full px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
            <TrendingUp className="h-3.5 w-3.5" />
            Analytics available
          </Badge>
        )}
      </div>

      {!isLoading && submissions.length > 0 && (
        <AnalyticsSection
          submissions={submissions}
          form={form}
          serverAnalytics={serverAnalytics}
        />
      )}

      {/* Submissions table */}
      <Card className="border-border/50 bg-card shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            All Submissions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && (
            <div className="divide-y divide-border/40">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <Skeleton className="h-9 w-9 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                  <Skeleton className="h-4 w-28 hidden sm:block" />
                </div>
              ))}
            </div>
          )}
          {!isLoading && submissions.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-16 text-center"
              data-ocid="submissions-empty-state"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-3">
                <Inbox className="h-6 w-6 text-muted-foreground/60" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                No submissions yet
              </p>
              <p className="text-xs text-muted-foreground">
                Share the public form link to start collecting responses.
              </p>
            </div>
          )}
          {!isLoading && submissions.length > 0 && (
            <div className="divide-y divide-border/40">
              {submissions.map((sub) => (
                <SubmissionRow
                  key={sub.id}
                  submission={sub}
                  fieldLabels={fieldLabels}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
