import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlignLeft,
  ArrowLeft,
  Calendar,
  CheckSquare,
  ChevronDown,
  ExternalLink,
  Eye,
  FileInput,
  GripVertical,
  Hash,
  Mail,
  Palette,
  Plus,
  Save,
  Send,
  Settings2,
  Trash2,
  Type,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
interface ConditionalLogic {
  fieldId: string;
  operator: "equals" | "not_equals" | "contains";
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
  logoUrl: string;
  primaryColor: string;
  backgroundColor: string;
}
interface FormSettings {
  autoCreateTask: boolean;
  projectId: string;
  taskTitleTemplate: string;
}
interface Form {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  fields: FormField[];
  status: string;
  publicUrl: string;
  branding?: FormBranding;
  settings?: FormSettings;
  createdBy: string;
  createdAt: bigint;
  updatedAt: bigint;
}

const FIELD_TYPES: {
  value: FormFieldType;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "Text", label: "Short Text", icon: Type },
  { value: "Email", label: "Email Address", icon: Mail },
  { value: "Textarea", label: "Long Text", icon: AlignLeft },
  { value: "Dropdown", label: "Dropdown", icon: ChevronDown },
  { value: "Checkbox", label: "Checkbox", icon: CheckSquare },
  { value: "Date", label: "Date Picker", icon: Calendar },
  { value: "FileUpload", label: "File Upload", icon: Upload },
];

function useForm(formId: string) {
  const { actor, isFetching } = useActor(createActor);
  const { activeWorkspaceId } = useWorkspace();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  return useQuery<Form | null>({
    queryKey: ["form", formId, workspaceId],
    queryFn: async () => {
      if (!actor || formId === "new") return null;
      return (
        actor as unknown as {
          getForm: (t: string, w: string, id: string) => Promise<Form | null>;
        }
      ).getForm(tenantId, workspaceId, formId);
    },
    enabled: !!actor && !isFetching && !!workspaceId && formId !== "new",
  });
}

function useProjects() {
  const { actor, isFetching } = useActor(createActor);
  const { activeWorkspaceId } = useWorkspace();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  return useQuery<{ id: string; name: string }[]>({
    queryKey: ["projects-list", workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return (
        actor as unknown as {
          listProjects: (
            t: string,
            w: string,
          ) => Promise<{ id: string; name: string }[]>;
        }
      ).listProjects(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });
}

function useSaveForm() {
  const { actor } = useActor(createActor);
  const { activeWorkspaceId } = useWorkspace();
  const qc = useQueryClient();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  return useMutation({
    mutationFn: async ({
      formId,
      input,
    }: { formId: string; input: Partial<Form> }) => {
      if (!actor) throw new Error("Not connected");
      if (formId === "new") {
        return (
          actor as unknown as {
            createForm: (
              t: string,
              w: string,
              i: Partial<Form>,
            ) => Promise<Form>;
          }
        ).createForm(tenantId, workspaceId, input);
      }
      return (
        actor as unknown as {
          updateForm: (
            t: string,
            w: string,
            id: string,
            i: Partial<Form>,
          ) => Promise<Form | null>;
        }
      ).updateForm(tenantId, workspaceId, formId, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["forms"] }),
  });
}

function FieldCard({
  field,
  index,
  allFields,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  field: FormField;
  index: number;
  allFields: FormField[];
  onUpdate: (id: string, patch: Partial<FormField>) => void;
  onRemove: (id: string) => void;
  onMoveUp: (idx: number) => void;
  onMoveDown: (idx: number) => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [showCondition, setShowCondition] = useState(!!field.conditionalLogic);
  const conditionSources = allFields.filter((f) => f.id !== field.id);

  return (
    <Card
      className="border-border/50 bg-card"
      data-ocid={`field-card-${index}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-0.5 mt-2 shrink-0">
            <button
              type="button"
              onClick={() => onMoveUp(index)}
              disabled={isFirst}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors p-0.5"
              aria-label="Move up"
            >
              <GripVertical className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => onMoveDown(index)}
              disabled={isLast}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors p-0.5"
              aria-label="Move down"
            >
              <GripVertical className="h-3 w-3" />
            </button>
          </div>
          <div className="flex-1 space-y-3 min-w-0">
            <div className="flex gap-3 flex-wrap sm:flex-nowrap">
              <div className="flex-1 min-w-[160px] space-y-1">
                <Label htmlFor={`lbl-${field.id}`} className="text-xs">
                  Field Label
                </Label>
                <Input
                  id={`lbl-${field.id}`}
                  value={field.fieldLabel}
                  onChange={(e) =>
                    onUpdate(field.id, { fieldLabel: e.target.value })
                  }
                  placeholder="e.g. Full Name"
                  data-ocid={`field-label-${index}`}
                />
              </div>
              <div className="w-full sm:w-44 space-y-1">
                <Label htmlFor={`type-${field.id}`} className="text-xs">
                  Type
                </Label>
                <Select
                  value={field.fieldType}
                  onValueChange={(v) =>
                    onUpdate(field.id, { fieldType: v as FormFieldType })
                  }
                >
                  <SelectTrigger
                    id={`type-${field.id}`}
                    data-ocid={`field-type-${index}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_TYPES.map((ft) => (
                      <SelectItem key={ft.value} value={ft.value}>
                        <span className="flex items-center gap-2">
                          <ft.icon className="h-3.5 w-3.5 text-muted-foreground" />
                          {ft.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {field.fieldType === "Dropdown" && (
              <div className="space-y-1">
                <Label className="text-xs">Options (comma-separated)</Label>
                <Input
                  value={field.options.join(", ")}
                  onChange={(e) =>
                    onUpdate(field.id, {
                      options: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Option A, Option B, Option C"
                  data-ocid={`field-options-${index}`}
                />
              </div>
            )}
            {field.fieldType === "FileUpload" && (
              <p className="text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
                File upload renders as a text input. Submitters paste a URL or
                filename.
              </p>
            )}
            <div className="flex items-center gap-2">
              <Switch
                id={`req-${field.id}`}
                checked={field.required}
                onCheckedChange={(v) => onUpdate(field.id, { required: v })}
                data-ocid={`field-required-${index}`}
              />
              <Label
                htmlFor={`req-${field.id}`}
                className="text-xs text-muted-foreground cursor-pointer"
              >
                Required
              </Label>
            </div>
            <div className="border-t border-border/40 pt-3">
              <button
                type="button"
                onClick={() => {
                  setShowCondition((v) => !v);
                  if (showCondition)
                    onUpdate(field.id, { conditionalLogic: null });
                }}
                className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                data-ocid={`toggle-condition-${index}`}
              >
                <Zap className="h-3 w-3" />
                {showCondition ? "Remove Condition" : "Add Condition"}
              </button>
              {showCondition && (
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-xs">If field…</Label>
                    <Select
                      value={field.conditionalLogic?.fieldId ?? ""}
                      onValueChange={(v) =>
                        onUpdate(field.id, {
                          conditionalLogic: {
                            ...(field.conditionalLogic ?? {
                              operator: "equals",
                              value: "",
                            }),
                            fieldId: v,
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pick a field" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditionSources.map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.fieldLabel || `Field ${f.id.slice(0, 4)}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Operator</Label>
                    <Select
                      value={field.conditionalLogic?.operator ?? "equals"}
                      onValueChange={(v) =>
                        onUpdate(field.id, {
                          conditionalLogic: {
                            ...(field.conditionalLogic ?? {
                              fieldId: "",
                              value: "",
                            }),
                            operator: v as ConditionalLogic["operator"],
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">equals</SelectItem>
                        <SelectItem value="not_equals">not equals</SelectItem>
                        <SelectItem value="contains">contains</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Value</Label>
                    <Input
                      value={field.conditionalLogic?.value ?? ""}
                      onChange={(e) =>
                        onUpdate(field.id, {
                          conditionalLogic: {
                            ...(field.conditionalLogic ?? {
                              fieldId: "",
                              operator: "equals",
                            }),
                            value: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Yes"
                      data-ocid={`condition-value-${index}`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 mt-1"
            onClick={() => onRemove(field.id)}
            aria-label="Remove field"
            data-ocid={`remove-field-${index}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FormBuilderPage() {
  const { workspaceId, formId } = useParams({
    from: "/app/$workspaceId/admin/forms/$formId/builder",
  });
  const navigate = useNavigate();
  const { data: existing } = useForm(formId);
  const { data: projects = [] } = useProjects();
  const saveForm = useSaveForm();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [activeTab, setActiveTab] = useState<
    "fields" | "branding" | "settings"
  >("fields");
  const [branding, setBranding] = useState<FormBranding>({
    logoUrl: "",
    primaryColor: "#6d28d9",
    backgroundColor: "#ffffff",
  });
  const [settings, setSettings] = useState<FormSettings>({
    autoCreateTask: false,
    projectId: "",
    taskTitleTemplate: "New submission: {{title}}",
  });
  const initialized = useRef(false);

  useEffect(() => {
    if (existing && !initialized.current) {
      initialized.current = true;
      setTitle(existing.title);
      setDescription(existing.description);
      setFields(existing.fields ?? []);
      if (existing.branding) setBranding(existing.branding);
      if (existing.settings) setSettings(existing.settings);
    }
  }, [existing]);

  const addField = () =>
    setFields((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        fieldLabel: "",
        fieldType: "Text",
        required: false,
        options: [],
        conditionalLogic: null,
      },
    ]);
  const updateField = (id: string, patch: Partial<FormField>) =>
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    );
  const removeField = (id: string) =>
    setFields((prev) => prev.filter((f) => f.id !== id));
  const moveField = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= fields.length) return;
    const copy = [...fields];
    [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
    setFields(copy);
  };

  const handleSave = async (status: "Draft" | "Published") => {
    if (!title.trim()) {
      toast.error("Form title is required");
      return;
    }
    try {
      const result = await saveForm.mutateAsync({
        formId,
        input: { title, description, fields, status, branding, settings },
      });
      if (result && "id" in result) {
        toast.success(
          status === "Published" ? "Form published!" : "Draft saved",
        );
        navigate({ to: `/app/${workspaceId}/admin/forms` as "/" });
      }
    } catch {
      toast.error("Failed to save form");
    }
  };

  const previewUrl = existing?.publicUrl
    ? `${window.location.origin}/forms/${existing.publicUrl}`
    : null;

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      data-ocid="form-builder-page"
    >
      {/* Header */}
      <header className="flex shrink-0 items-center gap-3 border-b border-border/40 bg-card px-5 py-3 shadow-sm">
        <Button variant="ghost" size="icon" asChild className="hover:bg-muted">
          <Link to={`/app/${workspaceId}/admin/forms` as "/"} aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-display font-semibold text-foreground">
            {formId === "new" ? "New Form" : "Edit Form"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {fields.length} field{fields.length !== 1 ? "s" : ""} · {activeTab}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {previewUrl && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              data-ocid="preview-btn"
              className="hover:bg-muted"
            >
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                Preview
                <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
              </a>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave("Draft")}
            disabled={saveForm.isPending}
            data-ocid="save-draft-btn"
            className="active-press"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Draft
          </Button>
          <Button
            size="sm"
            onClick={() => handleSave("Published")}
            disabled={saveForm.isPending}
            data-ocid="publish-form-btn"
            className="active-press"
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            Publish
          </Button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="flex shrink-0 gap-1 border-b border-border/40 bg-background px-5 pt-2">
        {(["fields", "branding", "settings"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            data-ocid={`tab-${tab}`}
          >
            {tab === "fields" && <Hash className="h-3.5 w-3.5" />}
            {tab === "branding" && <Palette className="h-3.5 w-3.5" />}
            {tab === "settings" && <Settings2 className="h-3.5 w-3.5" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === "fields" && fields.length > 0 && (
              <Badge className="text-[10px] px-1.5 py-0 ml-0.5 rounded-full bg-muted text-muted-foreground border-border">
                {fields.length}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-5 space-y-5">
        {/* ── Fields Tab ── */}
        {activeTab === "fields" && (
          <>
            <Card className="border-border/50 bg-card">
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="form-title">
                    Form Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="form-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Client Intake Form"
                    data-ocid="form-title-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="form-desc">Description</Label>
                  <Textarea
                    id="form-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe what this form is for…"
                    rows={2}
                    data-ocid="form-desc-input"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  Fields ({fields.length})
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addField}
                  data-ocid="add-field-btn"
                  className="active-press"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Field
                </Button>
              </div>
              {fields.length === 0 && (
                <div
                  className="border-2 border-dashed border-border/50 rounded-xl p-10 text-center"
                  data-ocid="empty-fields"
                >
                  <FileInput className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No fields yet. Click "Add Field" to start building.
                  </p>
                </div>
              )}
              {fields.map((field, idx) => (
                <FieldCard
                  key={field.id}
                  field={field}
                  index={idx}
                  allFields={fields}
                  onUpdate={updateField}
                  onRemove={removeField}
                  onMoveUp={() => moveField(idx, -1)}
                  onMoveDown={() => moveField(idx, 1)}
                  isFirst={idx === 0}
                  isLast={idx === fields.length - 1}
                />
              ))}
              {fields.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full border-dashed active-press"
                  onClick={addField}
                  data-ocid="add-field-bottom-btn"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add another field
                </Button>
              )}
            </div>
          </>
        )}

        {/* ── Branding Tab ── */}
        {activeTab === "branding" && (
          <Card className="border-border/50 bg-card">
            <CardContent className="p-5 space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="logo-url">Logo URL</Label>
                <Input
                  id="logo-url"
                  value={branding.logoUrl}
                  onChange={(e) =>
                    setBranding((b) => ({ ...b, logoUrl: e.target.value }))
                  }
                  placeholder="https://example.com/logo.png"
                  data-ocid="logo-url-input"
                />
                {branding.logoUrl && (
                  <img
                    src={branding.logoUrl}
                    alt="Logo preview"
                    className="h-12 object-contain rounded-lg border border-border mt-2"
                  />
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="primary-color"
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) =>
                        setBranding((b) => ({
                          ...b,
                          primaryColor: e.target.value,
                        }))
                      }
                      className="h-10 w-16 cursor-pointer rounded border border-input"
                      data-ocid="primary-color-picker"
                    />
                    <Input
                      value={branding.primaryColor}
                      onChange={(e) =>
                        setBranding((b) => ({
                          ...b,
                          primaryColor: e.target.value,
                        }))
                      }
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bg-color">Background Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="bg-color"
                      type="color"
                      value={branding.backgroundColor}
                      onChange={(e) =>
                        setBranding((b) => ({
                          ...b,
                          backgroundColor: e.target.value,
                        }))
                      }
                      className="h-10 w-16 cursor-pointer rounded border border-input"
                      data-ocid="bg-color-picker"
                    />
                    <Input
                      value={branding.backgroundColor}
                      onChange={(e) =>
                        setBranding((b) => ({
                          ...b,
                          backgroundColor: e.target.value,
                        }))
                      }
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
              <div
                className="rounded-xl border border-border/50 p-4 text-sm"
                style={{
                  backgroundColor: branding.backgroundColor,
                  color: branding.primaryColor,
                }}
              >
                <strong>Preview:</strong> Form buttons and accents will use{" "}
                <span style={{ color: branding.primaryColor, fontWeight: 600 }}>
                  {branding.primaryColor}
                </span>{" "}
                on a{" "}
                <span style={{ fontWeight: 600 }}>
                  {branding.backgroundColor}
                </span>{" "}
                background.
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Settings Tab ── */}
        {activeTab === "settings" && (
          <Card className="border-border/50 bg-card">
            <CardContent className="p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">
                    Auto-create Task on Submission
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Each submission will automatically create a task in the
                    selected project.
                  </p>
                </div>
                <Switch
                  checked={settings.autoCreateTask}
                  onCheckedChange={(v) =>
                    setSettings((s) => ({ ...s, autoCreateTask: v }))
                  }
                  data-ocid="auto-task-toggle"
                />
              </div>
              {settings.autoCreateTask && (
                <>
                  <div className="space-y-1.5">
                    <Label>Target Project</Label>
                    <Select
                      value={settings.projectId}
                      onValueChange={(v) =>
                        setSettings((s) => ({ ...s, projectId: v }))
                      }
                    >
                      <SelectTrigger data-ocid="task-project-picker">
                        <SelectValue placeholder="Choose a project…" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="task-title-template">
                      Task Title Template
                    </Label>
                    <Input
                      id="task-title-template"
                      value={settings.taskTitleTemplate}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          taskTitleTemplate: e.target.value,
                        }))
                      }
                      placeholder="New submission: {{title}}"
                      data-ocid="task-title-template-input"
                    />
                    <p className="text-xs text-muted-foreground">
                      Use{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {"{{title}}"}
                      </code>{" "}
                      to insert the form title.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
