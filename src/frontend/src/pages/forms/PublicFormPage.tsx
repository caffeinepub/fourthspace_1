import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, FileInput, Send } from "lucide-react";
import { useState } from "react";
import { createActor } from "../../backend";

type FormFieldType =
  | "Text"
  | "Email"
  | "Textarea"
  | "Dropdown"
  | "Checkbox"
  | "Date"
  | "FileUpload";
interface ConditionalLogic {
  fieldId: string;
  operator: "equals" | "notEquals" | "contains";
  value: string;
}
interface FormField {
  id: string;
  fieldLabel: string;
  fieldType: FormFieldType;
  required: boolean;
  options: string[];
  conditionalLogic?: ConditionalLogic | null;
}
interface FormBranding {
  logoUrl?: string;
  primaryColor?: string;
  backgroundColor?: string;
}
interface PublicForm {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  status: string;
  publicUrl: string;
  branding?: FormBranding;
}

function usePublicForm(publicUrl: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PublicForm | null>({
    queryKey: ["public-form", publicUrl],
    queryFn: async () => {
      if (!actor) return null;
      return (
        actor as unknown as {
          getPublicForm: (u: string) => Promise<PublicForm | null>;
        }
      ).getPublicForm(publicUrl);
    },
    enabled: !!actor && !isFetching && !!publicUrl,
    retry: false,
  });
}

function useSubmitForm() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      formId,
      data,
      submitterEmail,
    }: {
      formId: string;
      data: [string, string][];
      submitterEmail: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (
        actor as unknown as {
          submitFormResponse: (
            id: string,
            d: [string, string][],
            email: string,
          ) => Promise<unknown>;
        }
      ).submitFormResponse(formId, data, submitterEmail);
    },
  });
}

function shouldShowField(
  field: FormField,
  fieldValues: Record<string, string>,
  fields: FormField[],
): boolean {
  const logic = field.conditionalLogic;
  if (!logic || !logic.fieldId) return true;
  const targetField = fields.find((f) => f.id === logic.fieldId);
  if (!targetField) return true;
  const targetValue = fieldValues[logic.fieldId] ?? "";
  switch (logic.operator) {
    case "equals":
      return targetValue === logic.value;
    case "notEquals":
      return targetValue !== logic.value;
    case "contains":
      return targetValue.toLowerCase().includes(logic.value.toLowerCase());
    default:
      return true;
  }
}

function FormFieldInput({
  field,
  value,
  onChange,
}: { field: FormField; value: string; onChange: (v: string) => void }) {
  const id = `field-${field.id}`;
  const labelEl = (
    <Label htmlFor={id} className="text-sm font-medium text-foreground">
      {field.fieldLabel}
      {field.required && <span className="text-destructive ml-1">*</span>}
    </Label>
  );

  switch (field.fieldType) {
    case "Text":
    case "FileUpload":
      return (
        <div className="space-y-1.5">
          {labelEl}
          <Input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            placeholder={
              field.fieldType === "FileUpload"
                ? "Paste file URL here..."
                : `Enter ${field.fieldLabel.toLowerCase()}...`
            }
            data-ocid={`public-field-${field.id}`}
          />
        </div>
      );
    case "Email":
      return (
        <div className="space-y-1.5">
          {labelEl}
          <Input
            id={id}
            type="email"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            placeholder="you@example.com"
            data-ocid={`public-field-${field.id}`}
          />
        </div>
      );
    case "Textarea":
      return (
        <div className="space-y-1.5">
          {labelEl}
          <Textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            placeholder={`Enter ${field.fieldLabel.toLowerCase()}...`}
            rows={4}
            data-ocid={`public-field-${field.id}`}
          />
        </div>
      );
    case "Dropdown":
      return (
        <div className="space-y-1.5">
          {labelEl}
          <Select
            value={value}
            onValueChange={onChange}
            required={field.required}
          >
            <SelectTrigger id={id} data-ocid={`public-field-${field.id}`}>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    case "Checkbox":
      return (
        <div className="flex items-start gap-3 py-1">
          <Checkbox
            id={id}
            checked={value === "true"}
            onCheckedChange={(checked) => onChange(checked ? "true" : "false")}
            required={field.required}
            data-ocid={`public-field-${field.id}`}
          />
          <Label
            htmlFor={id}
            className="text-sm font-medium text-foreground cursor-pointer leading-snug"
          >
            {field.fieldLabel}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        </div>
      );
    case "Date":
      return (
        <div className="space-y-1.5">
          {labelEl}
          <Input
            id={id}
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            data-ocid={`public-field-${field.id}`}
          />
        </div>
      );
    default:
      return null;
  }
}

function SuccessState({ branding }: { branding?: FormBranding }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={
        branding?.backgroundColor
          ? { backgroundColor: branding.backgroundColor }
          : undefined
      }
      data-ocid="public-form-success"
    >
      <div className="text-center space-y-5 max-w-sm w-full">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 mx-auto ring-2 ring-emerald-500/20">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Submission received!
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mt-2">
            Thank you for your response. We've recorded your submission and will
            be in touch shortly.
          </p>
        </div>
      </div>
      <div className="mt-16 text-center">
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          Powered by{" "}
          <span className="font-semibold text-primary">Fourthspace</span>
        </a>
      </div>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div
      className="w-full max-w-lg mx-auto space-y-5"
      data-ocid="public-form-loading"
    >
      <Skeleton className="h-6 w-36 mx-auto" />
      <Card className="border-border/50 shadow-card">
        <CardContent className="p-8 space-y-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

function FormNotFound() {
  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center p-6"
      data-ocid="public-form-not-found"
    >
      <div className="text-center space-y-3 max-w-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 mx-auto">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>
        <h2 className="font-display text-xl font-bold text-foreground">
          Form not found
        </h2>
        <p className="text-sm text-muted-foreground">
          This form may have been removed or the link is incorrect. Please
          contact the sender for a valid link.
        </p>
      </div>
    </div>
  );
}

export default function PublicFormPage() {
  const { publicUrl } = useParams({ from: "/forms/$publicUrl" });
  const { data: form, isLoading, isError } = usePublicForm(publicUrl);
  const submitForm = useSubmitForm();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  if (submitted) return <SuccessState branding={form?.branding} />;
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <FormSkeleton />
      </div>
    );
  }
  if (isError || !form || form.status !== "Published") return <FormNotFound />;

  const branding = form.branding ?? {};
  const handleFieldChange = (fieldId: string, value: string) =>
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
  const visibleFields = form.fields.filter((f) =>
    shouldShowField(f, fieldValues, form.fields),
  );

  // Split into steps of 5 fields for multi-step appearance
  const STEP_SIZE = 5;
  const steps: FormField[][] = [];
  for (let i = 0; i < visibleFields.length; i += STEP_SIZE) {
    steps.push(visibleFields.slice(i, i + STEP_SIZE));
  }
  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps - 1;
  const progressPct =
    totalSteps > 1 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    for (const field of visibleFields) {
      if (field.required && !fieldValues[field.id]) {
        setSubmitError(`"${field.fieldLabel}" is required`);
        return;
      }
    }
    const data: [string, string][] = visibleFields.map((field) => [
      field.fieldLabel,
      fieldValues[field.id] ?? "",
    ]);
    try {
      await submitForm.mutateAsync({ formId: form.id, data, submitterEmail });
      setSubmitted(true);
    } catch {
      setSubmitError("Failed to submit. Please try again.");
    }
  };

  const primaryColorStyle = branding.primaryColor
    ? { backgroundColor: branding.primaryColor }
    : undefined;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={
        branding.backgroundColor
          ? { backgroundColor: branding.backgroundColor }
          : undefined
      }
      data-ocid="public-form-page"
    >
      <div className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-lg">
          {/* Brand Header */}
          <div className="text-center mb-8">
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt="Form logo"
                className="h-14 object-contain mx-auto mb-3"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl mx-auto mb-3 shadow-lg"
                style={
                  primaryColorStyle ?? {
                    backgroundColor: "oklch(var(--primary))",
                  }
                }
              >
                <span className="font-display text-lg font-bold text-primary-foreground">
                  F
                </span>
              </div>
            )}
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              Fourthspace
            </p>
          </div>

          {/* Progress bar (multi-step) */}
          {totalSteps > 1 && (
            <div className="mb-5 space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  Step {currentStep + 1} of {totalSteps}
                </span>
                <span>{progressPct}% complete</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          <Card
            className="border-border/50 shadow-card"
            data-ocid={`form-${publicUrl}`}
          >
            <CardContent className="p-8">
              {/* Form header */}
              <div className="flex items-start gap-3 mb-7">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0 mt-0.5"
                  style={
                    primaryColorStyle
                      ? { backgroundColor: `${branding.primaryColor}20` }
                      : { backgroundColor: "oklch(var(--primary) / 0.1)" }
                  }
                >
                  <FileInput
                    className="h-5 w-5"
                    style={
                      primaryColorStyle
                        ? { color: branding.primaryColor }
                        : undefined
                    }
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="font-display text-xl font-bold text-foreground leading-tight">
                    {form.title}
                  </h1>
                  {form.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {form.description}
                    </p>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {(steps[currentStep] ?? visibleFields).map((field) => (
                  <FormFieldInput
                    key={field.id}
                    field={field}
                    value={fieldValues[field.id] ?? ""}
                    onChange={(v) => handleFieldChange(field.id, v)}
                  />
                ))}

                {isLastStep && (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="submitter-email"
                      className="text-sm font-medium text-foreground"
                    >
                      Your Email Address
                    </Label>
                    <Input
                      id="submitter-email"
                      type="email"
                      value={submitterEmail}
                      onChange={(e) => setSubmitterEmail(e.target.value)}
                      placeholder="you@example.com"
                      data-ocid="submitter-email-input"
                    />
                  </div>
                )}

                {submitError && (
                  <div
                    className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3"
                    data-ocid="submit-error"
                  >
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{submitError}</p>
                  </div>
                )}

                {totalSteps > 1 && !isLastStep ? (
                  <Button
                    type="button"
                    className="w-full active-press"
                    style={primaryColorStyle}
                    onClick={() => setCurrentStep((s) => s + 1)}
                  >
                    Next <span className="ml-1">→</span>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full active-press"
                    style={primaryColorStyle}
                    disabled={submitForm.isPending}
                    data-ocid="form-submit-btn"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {submitForm.isPending ? "Submitting…" : "Submit"}
                  </Button>
                )}

                {totalSteps > 1 && currentStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((s) => s - 1)}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 text-center"
                  >
                    ← Back
                  </button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="pb-6 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Fourthspace · Your data is secured on the{" "}
          <a
            href="https://internetcomputer.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors duration-200"
          >
            Internet Computer
          </a>
          {" · "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors duration-200"
          >
            Built with Fourthspace
          </a>
        </p>
      </footer>
    </div>
  );
}
