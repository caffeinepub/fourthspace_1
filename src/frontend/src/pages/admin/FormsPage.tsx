import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Briefcase,
  Bug,
  Calendar,
  Copy,
  ExternalLink,
  FileInput,
  FileText,
  Layers,
  MessageSquare,
  Plus,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";

type FormFieldType =
  | "Text"
  | "Email"
  | "Textarea"
  | "Dropdown"
  | "Checkbox"
  | "Date"
  | "FileUpload";
type FormStatus = "Draft" | "Published";

interface FormField {
  id: string;
  fieldLabel: string;
  fieldType: FormFieldType;
  required: boolean;
  options: string[];
  conditionalLogic?: {
    fieldId: string;
    operator: "equals" | "notEquals" | "contains";
    value: string;
  } | null;
}

interface Form {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  fields: FormField[];
  status: FormStatus;
  publicUrl: string;
  createdBy: string;
  createdAt: bigint;
  updatedAt: bigint;
}

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  fields: Omit<FormField, "id">[];
}

const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: "bug-report",
    name: "Bug Report",
    description: "Collect bug reports with environment details",
    icon: Bug,
    color: "text-red-500 bg-red-500/10",
    fields: [
      {
        fieldLabel: "Bug Title",
        fieldType: "Text",
        required: true,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Description",
        fieldType: "Textarea",
        required: true,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Severity",
        fieldType: "Dropdown",
        required: true,
        options: ["Critical", "High", "Medium", "Low"],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Browser / OS",
        fieldType: "Text",
        required: false,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Steps to Reproduce",
        fieldType: "Textarea",
        required: false,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Expected Behavior",
        fieldType: "Textarea",
        required: false,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Attach Screenshot URL",
        fieldType: "Text",
        required: false,
        options: [],
        conditionalLogic: null,
      },
    ],
  },
  {
    id: "feature-request",
    name: "Feature Request",
    description: "Let users propose new features and improvements",
    icon: Sparkles,
    color: "text-violet-500 bg-violet-500/10",
    fields: [
      {
        fieldLabel: "Feature Name",
        fieldType: "Text",
        required: true,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Problem It Solves",
        fieldType: "Textarea",
        required: true,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Proposed Solution",
        fieldType: "Textarea",
        required: true,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Priority",
        fieldType: "Dropdown",
        required: false,
        options: ["Nice to Have", "Important", "Critical"],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Use Case / Example",
        fieldType: "Textarea",
        required: false,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "I am affected by this",
        fieldType: "Checkbox",
        required: false,
        options: [],
        conditionalLogic: null,
      },
    ],
  },
  {
    id: "job-application",
    name: "Job Application",
    description: "Collect applications for open positions",
    icon: Briefcase,
    color: "text-blue-500 bg-blue-500/10",
    fields: [
      {
        fieldLabel: "Full Name",
        fieldType: "Text",
        required: true,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Email Address",
        fieldType: "Email",
        required: true,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Position Applying For",
        fieldType: "Text",
        required: true,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Resume / CV URL",
        fieldType: "Text",
        required: true,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Cover Letter",
        fieldType: "Textarea",
        required: false,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Years of Experience",
        fieldType: "Dropdown",
        required: true,
        options: [
          "0–1 years",
          "1–3 years",
          "3–5 years",
          "5–10 years",
          "10+ years",
        ],
        conditionalLogic: null,
      },
    ],
  },
  {
    id: "contact-us",
    name: "Contact Us",
    description: "General inquiry and contact form",
    icon: MessageSquare,
    color: "text-emerald-500 bg-emerald-500/10",
    fields: [
      {
        fieldLabel: "Full Name",
        fieldType: "Text",
        required: true,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Email Address",
        fieldType: "Email",
        required: true,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Subject",
        fieldType: "Dropdown",
        required: true,
        options: [
          "General Inquiry",
          "Sales",
          "Support",
          "Partnership",
          "Other",
        ],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Message",
        fieldType: "Textarea",
        required: true,
        options: [],
        conditionalLogic: null,
      },
    ],
  },
  {
    id: "event-registration",
    name: "Event Registration",
    description: "Register attendees for upcoming events",
    icon: Calendar,
    color: "text-orange-500 bg-orange-500/10",
    fields: [
      {
        fieldLabel: "Full Name",
        fieldType: "Text",
        required: true,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Email Address",
        fieldType: "Email",
        required: true,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Ticket Type",
        fieldType: "Dropdown",
        required: true,
        options: ["General Admission", "VIP", "Student", "Speaker", "Sponsor"],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Number of Attendees",
        fieldType: "Text",
        required: true,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Dietary Restrictions",
        fieldType: "Text",
        required: false,
        options: [],
        conditionalLogic: null,
      },
    ],
  },
  {
    id: "client-intake",
    name: "Client Intake",
    description: "Onboard new clients and gather project details",
    icon: User,
    color: "text-cyan-500 bg-cyan-500/10",
    fields: [
      {
        fieldLabel: "Client / Company Name",
        fieldType: "Text",
        required: true,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Contact Email",
        fieldType: "Email",
        required: true,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Project Type",
        fieldType: "Dropdown",
        required: true,
        options: [
          "Web Design",
          "Mobile App",
          "Branding",
          "Marketing",
          "Consulting",
          "Other",
        ],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Project Description",
        fieldType: "Textarea",
        required: true,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Estimated Budget (USD)",
        fieldType: "Text",
        required: false,
        options: [],
        conditionalLogic: null,
      },
      {
        fieldLabel: "Desired Start Date",
        fieldType: "Date",
        required: false,
        options: [],
        conditionalLogic: null,
      },
    ],
  },
];

const STATUS_COLORS: Record<FormStatus, string> = {
  Published:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Draft: "bg-muted text-muted-foreground border-border",
};

function useForms() {
  const { actor, isFetching } = useActor(createActor);
  const { activeWorkspaceId } = useWorkspace();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  return useQuery<Form[]>({
    queryKey: ["forms", workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return (
        actor as unknown as {
          listForms: (t: string, w: string) => Promise<Form[]>;
        }
      ).listForms(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });
}

function useCreateForm() {
  const { actor } = useActor(createActor);
  const { activeWorkspaceId } = useWorkspace();
  const qc = useQueryClient();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  return useMutation({
    mutationFn: async (input: {
      title: string;
      description: string;
      fields: FormField[];
      status: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (
        actor as unknown as {
          createForm: (t: string, w: string, i: typeof input) => Promise<Form>;
        }
      ).createForm(tenantId, workspaceId, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["forms"] }),
  });
}

function useDeleteForm() {
  const { actor } = useActor(createActor);
  const { activeWorkspaceId } = useWorkspace();
  const qc = useQueryClient();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return (
        actor as unknown as {
          deleteForm: (t: string, w: string, id: string) => Promise<boolean>;
        }
      ).deleteForm(tenantId, workspaceId, id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["forms"] }),
  });
}

function TemplatePanel({
  onClose,
  onApply,
  isApplying,
}: {
  onClose: () => void;
  onApply: (t: FormTemplate) => void;
  isApplying: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      data-ocid="template-panel"
    >
      <div className="w-full max-w-2xl rounded-2xl border border-border/50 bg-card shadow-dropdown">
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <div>
            <h3 className="font-display font-semibold text-foreground">
              Use a Template
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Start with a pre-built form and customize it
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
            className="hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 max-h-[60vh] overflow-auto">
          {FORM_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              className="flex items-start gap-3 text-left rounded-xl border border-border/50 p-4 hover:bg-muted/30 hover:border-primary/30 transition-all group"
              onClick={() => onApply(tpl)}
              disabled={isApplying}
              data-ocid={`template-${tpl.id}`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tpl.color}`}
              >
                <tpl.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm">
                  {tpl.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {tpl.description}
                </p>
                <p className="text-xs text-primary mt-1">
                  {tpl.fields.length} fields included
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FormCard({ form, workspaceId }: { form: Form; workspaceId: string }) {
  const deleteForm = useDeleteForm();

  const handleDelete = async () => {
    if (!confirm("Delete this form? All submissions will be lost.")) return;
    try {
      await deleteForm.mutateAsync(form.id);
      toast.success("Form deleted");
    } catch {
      toast.error("Failed to delete form");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/forms/${form.publicUrl}`,
    );
    toast.success("Link copied to clipboard!");
  };

  return (
    <Card
      className="border-border/50 bg-card shadow-card hover:shadow-card-hover transition-all duration-200 group"
      data-ocid={`form-card-${form.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
            <FileInput className="h-5 w-5 text-primary" />
          </div>
          <Badge
            className={`text-xs shrink-0 rounded-full px-2.5 py-0.5 ${STATUS_COLORS[form.status]}`}
          >
            {form.status}
          </Badge>
        </div>
        <div className="mt-2">
          <CardTitle className="text-base leading-snug">{form.title}</CardTitle>
          {form.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {form.description}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center text-xs text-muted-foreground">
          <Layers className="h-3 w-3 mr-1" />
          {form.fields.length} field{form.fields.length !== 1 ? "s" : ""}
        </div>
        <Separator className="bg-border/40" />
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs active-press"
            asChild
            data-ocid={`edit-form-${form.id}`}
          >
            <Link
              to={`/app/${workspaceId}/admin/forms/${form.id}/builder` as "/"}
            >
              Edit
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs active-press"
            asChild
            data-ocid={`view-submissions-${form.id}`}
          >
            <Link
              to={
                `/app/${workspaceId}/admin/forms/${form.id}/submissions` as "/"
              }
            >
              Submissions
            </Link>
          </Button>
        </div>
        <div className="flex gap-1.5">
          {form.status === "Published" && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={copyLink}
                aria-label="Copy form link"
                data-ocid={`copy-link-${form.id}`}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                asChild
                aria-label="Open public form"
                data-ocid={`open-form-${form.id}`}
              >
                <Link
                  to="/forms/$publicUrl"
                  params={{ publicUrl: form.publicUrl }}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive ml-auto"
            onClick={handleDelete}
            aria-label="Delete form"
            data-ocid={`delete-form-${form.id}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FormsPage() {
  const { data: forms = [], isLoading } = useForms();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const navigate = useNavigate();
  const createForm = useCreateForm();
  const [showTemplates, setShowTemplates] = useState(false);

  const handleApplyTemplate = async (template: FormTemplate) => {
    try {
      const fieldsWithIds = template.fields.map((f) => ({
        ...f,
        id: crypto.randomUUID(),
      }));
      const result = await createForm.mutateAsync({
        title: template.name,
        description: template.description,
        fields: fieldsWithIds,
        status: "Draft",
      });
      setShowTemplates(false);
      toast.success(
        `"${template.name}" template applied! Customize it in the builder.`,
      );
      navigate({
        to: `/app/${workspaceId}/admin/forms/${result.id}/builder` as "/",
      });
    } catch {
      toast.error("Failed to create form from template");
    }
  };

  const publishedCount = forms.filter((f) => f.status === "Published").length;

  return (
    <div className="p-6 space-y-6 animate-fade-in-up" data-ocid="forms-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Forms
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create public intake forms for external submissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowTemplates(true)}
            data-ocid="use-template-btn"
            className="active-press"
          >
            <FileText className="h-4 w-4 mr-2" />
            Use Template
          </Button>
          <Button
            onClick={() =>
              navigate({
                to: `/app/${workspaceId}/admin/forms/new/builder` as "/",
              })
            }
            data-ocid="create-form-btn"
            className="active-press"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Form
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{forms.length}</span>{" "}
        forms
        <span className="text-border">·</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
          {publishedCount}
        </span>{" "}
        published
        <span className="text-border">·</span>
        <span className="font-medium">{forms.length - publishedCount}</span>{" "}
        drafts
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="border-border/50 h-52 animate-pulse bg-muted/20"
            />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <FormCard key={form.id} form={form} workspaceId={workspaceId} />
          ))}
          {forms.length === 0 ? (
            <div className="col-span-full" data-ocid="forms-empty-state">
              <Card className="border-dashed border-border bg-muted/10">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                    <FileInput className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1">
                    No forms yet
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                    Build a custom form or start from one of our 6 pre-built
                    templates.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowTemplates(true)}
                      data-ocid="use-template-empty-btn"
                      className="active-press"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                    <Button
                      onClick={() =>
                        navigate({
                          to: `/app/${workspaceId}/admin/forms/new/builder` as "/",
                        })
                      }
                      data-ocid="create-first-form-btn"
                      className="active-press"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create from scratch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card
              className="border-dashed border-border/50 bg-muted/10 hover:bg-muted/20 transition-all cursor-pointer flex items-center justify-center min-h-[200px]"
              onClick={() =>
                navigate({
                  to: `/app/${workspaceId}/admin/forms/new/builder` as "/",
                })
              }
              data-ocid="new-form-card"
            >
              <div className="text-center p-6">
                <Plus className="h-7 w-7 text-muted-foreground/60 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">New form</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Builder with drag & drop
                </p>
              </div>
            </Card>
          )}
        </div>
      )}

      {showTemplates && (
        <TemplatePanel
          onClose={() => setShowTemplates(false)}
          onApply={handleApplyTemplate}
          isApplying={createForm.isPending}
        />
      )}
    </div>
  );
}
