import { s as createLucideIcon, f as useWorkspace, d as useNavigate, r as reactExports, j as jsxRuntimeExports, B as Button, F as FileText, P as Plus, e as useActor, g as getTenantId, h as useQuery, n as useQueryClient, i as Link, X, S as Sparkles, b as MessageSquare, ah as User, l as createActor } from "./index-BZqaRhAX.js";
import { B as Badge } from "./index--nGTycyb.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-DQu6DGwy.js";
import { S as Separator } from "./separator-J7DkFB-P.js";
import { u as useMutation } from "./useMutation-CLofsIuD.js";
import { u as ue } from "./index-BRf-248B.js";
import { F as FileInput } from "./file-input-BHivYBan.js";
import { L as Layers } from "./layers-D2OloIh5.js";
import { C as Copy } from "./copy-ltoxOxzI.js";
import { E as ExternalLink } from "./external-link-Cetn1x_C.js";
import { T as Trash2 } from "./trash-2-B2tpJk42.js";
import { B as Briefcase } from "./briefcase-BhJUGSoZ.js";
import { C as Calendar } from "./calendar-DNogRdhP.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m8 2 1.88 1.88", key: "fmnt4t" }],
  ["path", { d: "M14.12 3.88 16 2", key: "qol33r" }],
  ["path", { d: "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1", key: "d7y7pr" }],
  [
    "path",
    {
      d: "M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6",
      key: "xs1cw7"
    }
  ],
  ["path", { d: "M12 20v-9", key: "1qisl0" }],
  ["path", { d: "M6.53 9C4.6 8.8 3 7.1 3 5", key: "32zzws" }],
  ["path", { d: "M6 13H2", key: "82j7cp" }],
  ["path", { d: "M3 21c0-2.1 1.7-3.9 3.8-4", key: "4p0ekp" }],
  ["path", { d: "M20.97 5c0 2.1-1.6 3.8-3.5 4", key: "18gb23" }],
  ["path", { d: "M22 13h-4", key: "1jl80f" }],
  ["path", { d: "M17.2 17c2.1.1 3.8 1.9 3.8 4", key: "k3fwyw" }]
];
const Bug = createLucideIcon("bug", __iconNode);
const FORM_TEMPLATES = [
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
        conditionalLogic: null
      },
      {
        fieldLabel: "Description",
        fieldType: "Textarea",
        required: true,
        options: [],
        conditionalLogic: null
      },
      {
        fieldLabel: "Severity",
        fieldType: "Dropdown",
        required: true,
        options: ["Critical", "High", "Medium", "Low"],
        conditionalLogic: null
      },
      {
        fieldLabel: "Browser / OS",
        fieldType: "Text",
        required: false,
        options: [],
        conditionalLogic: null
      },
      {
        fieldLabel: "Steps to Reproduce",
        fieldType: "Textarea",
        required: false,
        options: [],
        conditionalLogic: null
      },
      {
        fieldLabel: "Expected Behavior",
        fieldType: "Textarea",
        required: false,
        options: [],
        conditionalLogic: null
      },
      {
        fieldLabel: "Attach Screenshot URL",
        fieldType: "Text",
        required: false,
        options: [],
        conditionalLogic: null
      }
    ]
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
        conditionalLogic: null
      },
      {
        fieldLabel: "Problem It Solves",
        fieldType: "Textarea",
        required: true,
        options: [],
        conditionalLogic: null
      },
      {
        fieldLabel: "Proposed Solution",
        fieldType: "Textarea",
        required: true,
        options: [],
        conditionalLogic: null
      },
      {
        fieldLabel: "Priority",
        fieldType: "Dropdown",
        required: false,
        options: ["Nice to Have", "Important", "Critical"],
        conditionalLogic: null
      },
      {
        fieldLabel: "Use Case / Example",
        fieldType: "Textarea",
        required: false,
        options: [],
        conditionalLogic: null
      },
      {
        fieldLabel: "I am affected by this",
        fieldType: "Checkbox",
        required: false,
        options: [],
        conditionalLogic: null
      }
    ]
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
        conditionalLogic: null
      },
      {
        fieldLabel: "Email Address",
        fieldType: "Email",
        required: true,
        options: [],
        conditionalLogic: null
      },
      {
        fieldLabel: "Position Applying For",
        fieldType: "Text",
        required: true,
        options: [],
        conditionalLogic: null
      },
      {
        fieldLabel: "Resume / CV URL",
        fieldType: "Text",
        required: true,
        options: [],
        conditionalLogic: null
      },
      {
        fieldLabel: "Cover Letter",
        fieldType: "Textarea",
        required: false,
        options: [],
        conditionalLogic: null
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
          "10+ years"
        ],
        conditionalLogic: null
      }
    ]
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
        conditionalLogic: null
      },
      {
        fieldLabel: "Email Address",
        fieldType: "Email",
        required: true,
        options: [],
        conditionalLogic: null
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
          "Other"
        ],
        conditionalLogic: null
      },
      {
        fieldLabel: "Message",
        fieldType: "Textarea",
        required: true,
        options: [],
        conditionalLogic: null
      }
    ]
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
        conditionalLogic: null
      },
      {
        fieldLabel: "Email Address",
        fieldType: "Email",
        required: true,
        options: [],
        conditionalLogic: null
      },
      {
        fieldLabel: "Ticket Type",
        fieldType: "Dropdown",
        required: true,
        options: ["General Admission", "VIP", "Student", "Speaker", "Sponsor"],
        conditionalLogic: null
      },
      {
        fieldLabel: "Number of Attendees",
        fieldType: "Text",
        required: true,
        options: [],
        conditionalLogic: null
      },
      {
        fieldLabel: "Dietary Restrictions",
        fieldType: "Text",
        required: false,
        options: [],
        conditionalLogic: null
      }
    ]
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
        conditionalLogic: null
      },
      {
        fieldLabel: "Contact Email",
        fieldType: "Email",
        required: true,
        options: [],
        conditionalLogic: null
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
          "Other"
        ],
        conditionalLogic: null
      },
      {
        fieldLabel: "Project Description",
        fieldType: "Textarea",
        required: true,
        options: [],
        conditionalLogic: null
      },
      {
        fieldLabel: "Estimated Budget (USD)",
        fieldType: "Text",
        required: false,
        options: [],
        conditionalLogic: null
      },
      {
        fieldLabel: "Desired Start Date",
        fieldType: "Date",
        required: false,
        options: [],
        conditionalLogic: null
      }
    ]
  }
];
const STATUS_COLORS = {
  Published: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Draft: "bg-muted text-muted-foreground border-border"
};
function useForms() {
  const { actor, isFetching } = useActor(createActor);
  const { activeWorkspaceId } = useWorkspace();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  return useQuery({
    queryKey: ["forms", workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listForms(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
}
function useCreateForm() {
  const { actor } = useActor(createActor);
  const { activeWorkspaceId } = useWorkspace();
  const qc = useQueryClient();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      return actor.createForm(tenantId, workspaceId, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["forms"] })
  });
}
function useDeleteForm() {
  const { actor } = useActor(createActor);
  const { activeWorkspaceId } = useWorkspace();
  const qc = useQueryClient();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteForm(tenantId, workspaceId, id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["forms"] })
  });
}
function TemplatePanel({
  onClose,
  onApply,
  isApplying
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm p-4",
      "data-ocid": "template-panel",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-2xl rounded-2xl border border-border/50 bg-card shadow-dropdown", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-5 border-b border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "Use a Template" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Start with a pre-built form and customize it" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: onClose,
              "aria-label": "Close",
              className: "hover:bg-muted",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 max-h-[60vh] overflow-auto", children: FORM_TEMPLATES.map((tpl) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "flex items-start gap-3 text-left rounded-xl border border-border/50 p-4 hover:bg-muted/30 hover:border-primary/30 transition-all group",
            onClick: () => onApply(tpl),
            disabled: isApplying,
            "data-ocid": `template-${tpl.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tpl.color}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(tpl.icon, { className: "h-5 w-5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground text-sm", children: tpl.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: tpl.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-primary mt-1", children: [
                  tpl.fields.length,
                  " fields included"
                ] })
              ] })
            ]
          },
          tpl.id
        )) })
      ] })
    }
  );
}
function FormCard({ form, workspaceId }) {
  const deleteForm = useDeleteForm();
  const handleDelete = async () => {
    if (!confirm("Delete this form? All submissions will be lost.")) return;
    try {
      await deleteForm.mutateAsync(form.id);
      ue.success("Form deleted");
    } catch {
      ue.error("Failed to delete form");
    }
  };
  const copyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/forms/${form.publicUrl}`
    );
    ue.success("Link copied to clipboard!");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "border-border/50 bg-card shadow-card hover:shadow-card-hover transition-all duration-200 group",
      "data-ocid": `form-card-${form.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileInput, { className: "h-5 w-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                className: `text-xs shrink-0 rounded-full px-2.5 py-0.5 ${STATUS_COLORS[form.status]}`,
                children: form.status
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base leading-snug", children: form.title }),
            form.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-2", children: form.description })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3 pt-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3 w-3 mr-1" }),
            form.fields.length,
            " field",
            form.fields.length !== 1 ? "s" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "flex-1 text-xs active-press",
                asChild: true,
                "data-ocid": `edit-form-${form.id}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: `/app/${workspaceId}/admin/forms/${form.id}/builder`,
                    children: "Edit"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "flex-1 text-xs active-press",
                asChild: true,
                "data-ocid": `view-submissions-${form.id}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: `/app/${workspaceId}/admin/forms/${form.id}/submissions`,
                    children: "Submissions"
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
            form.status === "Published" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8 text-muted-foreground hover:text-foreground",
                  onClick: copyLink,
                  "aria-label": "Copy form link",
                  "data-ocid": `copy-link-${form.id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8 text-muted-foreground hover:text-foreground",
                  asChild: true,
                  "aria-label": "Open public form",
                  "data-ocid": `open-form-${form.id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/forms/$publicUrl",
                      params: { publicUrl: form.publicUrl },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5" })
                    }
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 text-muted-foreground hover:text-destructive ml-auto",
                onClick: handleDelete,
                "aria-label": "Delete form",
                "data-ocid": `delete-form-${form.id}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function FormsPage() {
  const { data: forms = [], isLoading } = useForms();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const navigate = useNavigate();
  const createForm = useCreateForm();
  const [showTemplates, setShowTemplates] = reactExports.useState(false);
  const handleApplyTemplate = async (template) => {
    try {
      const fieldsWithIds = template.fields.map((f) => ({
        ...f,
        id: crypto.randomUUID()
      }));
      const result = await createForm.mutateAsync({
        title: template.name,
        description: template.description,
        fields: fieldsWithIds,
        status: "Draft"
      });
      setShowTemplates(false);
      ue.success(
        `"${template.name}" template applied! Customize it in the builder.`
      );
      navigate({
        to: `/app/${workspaceId}/admin/forms/${result.id}/builder`
      });
    } catch {
      ue.error("Failed to create form from template");
    }
  };
  const publishedCount = forms.filter((f) => f.status === "Published").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 animate-fade-in-up", "data-ocid": "forms-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: "Forms" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Create public intake forms for external submissions" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => setShowTemplates(true),
            "data-ocid": "use-template-btn",
            className: "active-press",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 mr-2" }),
              "Use Template"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => navigate({
              to: `/app/${workspaceId}/admin/forms/new/builder`
            }),
            "data-ocid": "create-form-btn",
            className: "active-press",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
              "New Form"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: forms.length }),
      " ",
      "forms",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "·" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 dark:text-emerald-400 font-medium", children: publishedCount }),
      " ",
      "published",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "·" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: forms.length - publishedCount }),
      " ",
      "drafts"
    ] }),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "border-border/50 h-52 animate-pulse bg-muted/20"
      },
      i
    )) }),
    !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: [
      forms.map((form) => /* @__PURE__ */ jsxRuntimeExports.jsx(FormCard, { form, workspaceId }, form.id)),
      forms.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full", "data-ocid": "forms-empty-state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-dashed border-border bg-muted/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center py-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileInput, { className: "h-7 w-7 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-1", children: "No forms yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4 max-w-xs", children: "Build a custom form or start from one of our 6 pre-built templates." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => setShowTemplates(true),
              "data-ocid": "use-template-empty-btn",
              className: "active-press",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 mr-2" }),
                "Use Template"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => navigate({
                to: `/app/${workspaceId}/admin/forms/new/builder`
              }),
              "data-ocid": "create-first-form-btn",
              className: "active-press",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
                "Create from scratch"
              ]
            }
          )
        ] })
      ] }) }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "border-dashed border-border/50 bg-muted/10 hover:bg-muted/20 transition-all cursor-pointer flex items-center justify-center min-h-[200px]",
          onClick: () => navigate({
            to: `/app/${workspaceId}/admin/forms/new/builder`
          }),
          "data-ocid": "new-form-card",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-7 w-7 text-muted-foreground/60 mx-auto mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "New form" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Builder with drag & drop" })
          ] })
        }
      )
    ] }),
    showTemplates && /* @__PURE__ */ jsxRuntimeExports.jsx(
      TemplatePanel,
      {
        onClose: () => setShowTemplates(false),
        onApply: handleApplyTemplate,
        isApplying: createForm.isPending
      }
    )
  ] });
}
export {
  FormsPage as default
};
