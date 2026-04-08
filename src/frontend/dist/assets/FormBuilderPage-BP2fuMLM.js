import { s as createLucideIcon, m as useParams, d as useNavigate, r as reactExports, j as jsxRuntimeExports, B as Button, i as Link, P as Plus, e as useActor, f as useWorkspace, g as getTenantId, h as useQuery, n as useQueryClient, ac as ChevronDown, l as createActor } from "./index-CzyNqtbv.js";
import { B as Badge } from "./badge-B6elWcoD.js";
import { C as Card, a as CardContent } from "./card-BTCkNtDu.js";
import { I as Input } from "./input-982h_Ebl.js";
import { L as Label } from "./label-D31XgQrg.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DOERIIdP.js";
import { S as Switch } from "./switch-5ZixxZeQ.js";
import { T as Textarea } from "./textarea-BbzS3l8F.js";
import { u as useMutation } from "./useMutation-BsRk2Bod.js";
import { u as ue } from "./index-DaWH_LJ9.js";
import { A as ArrowLeft } from "./arrow-left-BnDr9sMT.js";
import { E as Eye } from "./eye-xKtoGGJP.js";
import { E as ExternalLink } from "./external-link-CRT1Ab4H.js";
import { S as Save } from "./save-R19D3P8T.js";
import { S as Send } from "./send-C-UOqMuX.js";
import { H as Hash } from "./hash-BbMZFyje.js";
import { S as Settings2 } from "./settings-2-BvHlQE4o.js";
import { F as FileInput } from "./file-input-vy-q1YSs.js";
import { G as GripVertical } from "./grip-vertical-CFqxRp3-.js";
import { T as Type } from "./type-B42vrWcp.js";
import { M as Mail } from "./mail-eGlwiGsX.js";
import { S as SquareCheckBig } from "./square-check-big-kPgmw6zy.js";
import { C as Calendar } from "./calendar-CTr0Yk3T.js";
import { Z as Zap } from "./zap-BMn2iNid.js";
import { T as Trash2 } from "./trash-2-8AcD7pMp.js";
import "./index-IXOTxK3N.js";
import "./index-DhDScjUU.js";
import "./chevron-up-DASmmm8S.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M17 18H3", key: "1amg6g" }],
  ["path", { d: "M21 6H3", key: "1jwq7v" }]
];
const AlignLeft = createLucideIcon("align-left", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",
      key: "e79jfc"
    }
  ],
  ["circle", { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor", key: "1okk4w" }],
  ["circle", { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor", key: "f64h9f" }],
  ["circle", { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor", key: "qy21gx" }],
  ["circle", { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor", key: "fotxhn" }]
];
const Palette = createLucideIcon("palette", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
const FIELD_TYPES = [
  { value: "Text", label: "Short Text", icon: Type },
  { value: "Email", label: "Email Address", icon: Mail },
  { value: "Textarea", label: "Long Text", icon: AlignLeft },
  { value: "Dropdown", label: "Dropdown", icon: ChevronDown },
  { value: "Checkbox", label: "Checkbox", icon: SquareCheckBig },
  { value: "Date", label: "Date Picker", icon: Calendar },
  { value: "FileUpload", label: "File Upload", icon: Upload }
];
function useForm(formId) {
  const { actor, isFetching } = useActor(createActor);
  const { activeWorkspaceId } = useWorkspace();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  return useQuery({
    queryKey: ["form", formId, workspaceId],
    queryFn: async () => {
      if (!actor || formId === "new") return null;
      return actor.getForm(tenantId, workspaceId, formId);
    },
    enabled: !!actor && !isFetching && !!workspaceId && formId !== "new"
  });
}
function useProjects() {
  const { actor, isFetching } = useActor(createActor);
  const { activeWorkspaceId } = useWorkspace();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  return useQuery({
    queryKey: ["projects-list", workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProjects(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
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
      input
    }) => {
      if (!actor) throw new Error("Not connected");
      if (formId === "new") {
        return actor.createForm(tenantId, workspaceId, input);
      }
      return actor.updateForm(tenantId, workspaceId, formId, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["forms"] })
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
  isLast
}) {
  var _a, _b, _c;
  const [showCondition, setShowCondition] = reactExports.useState(!!field.conditionalLogic);
  const conditionSources = allFields.filter((f) => f.id !== field.id);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: "border-border/50 bg-card",
      "data-ocid": `field-card-${index}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5 mt-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onMoveUp(index),
              disabled: isFirst,
              className: "text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors p-0.5",
              "aria-label": "Move up",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-3 w-3" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onMoveDown(index),
              disabled: isLast,
              className: "text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors p-0.5",
              "aria-label": "Move down",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-3 w-3" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-3 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-wrap sm:flex-nowrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[160px] space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `lbl-${field.id}`, className: "text-xs", children: "Field Label" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: `lbl-${field.id}`,
                  value: field.fieldLabel,
                  onChange: (e) => onUpdate(field.id, { fieldLabel: e.target.value }),
                  placeholder: "e.g. Full Name",
                  "data-ocid": `field-label-${index}`
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full sm:w-44 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `type-${field.id}`, className: "text-xs", children: "Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: field.fieldType,
                  onValueChange: (v) => onUpdate(field.id, { fieldType: v }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        id: `type-${field.id}`,
                        "data-ocid": `field-type-${index}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: FIELD_TYPES.map((ft) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: ft.value, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ft.icon, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                      ft.label
                    ] }) }, ft.value)) })
                  ]
                }
              )
            ] })
          ] }),
          field.fieldType === "Dropdown" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Options (comma-separated)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: field.options.join(", "),
                onChange: (e) => onUpdate(field.id, {
                  options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                }),
                placeholder: "Option A, Option B, Option C",
                "data-ocid": `field-options-${index}`
              }
            )
          ] }),
          field.fieldType === "FileUpload" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2", children: "File upload renders as a text input. Submitters paste a URL or filename." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                id: `req-${field.id}`,
                checked: field.required,
                onCheckedChange: (v) => onUpdate(field.id, { required: v }),
                "data-ocid": `field-required-${index}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: `req-${field.id}`,
                className: "text-xs text-muted-foreground cursor-pointer",
                children: "Required"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/40 pt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setShowCondition((v) => !v);
                  if (showCondition)
                    onUpdate(field.id, { conditionalLogic: null });
                },
                className: "flex items-center gap-1.5 text-xs text-primary hover:underline",
                "data-ocid": `toggle-condition-${index}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3" }),
                  showCondition ? "Remove Condition" : "Add Condition"
                ]
              }
            ),
            showCondition && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid gap-2 sm:grid-cols-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "If field…" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: ((_a = field.conditionalLogic) == null ? void 0 : _a.fieldId) ?? "",
                    onValueChange: (v) => onUpdate(field.id, {
                      conditionalLogic: {
                        ...field.conditionalLogic ?? {
                          operator: "equals",
                          value: ""
                        },
                        fieldId: v
                      }
                    }),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Pick a field" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: conditionSources.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: f.id, children: f.fieldLabel || `Field ${f.id.slice(0, 4)}` }, f.id)) })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Operator" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: ((_b = field.conditionalLogic) == null ? void 0 : _b.operator) ?? "equals",
                    onValueChange: (v) => onUpdate(field.id, {
                      conditionalLogic: {
                        ...field.conditionalLogic ?? {
                          fieldId: "",
                          value: ""
                        },
                        operator: v
                      }
                    }),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "equals", children: "equals" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "not_equals", children: "not equals" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "contains", children: "contains" })
                      ] })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Value" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: ((_c = field.conditionalLogic) == null ? void 0 : _c.value) ?? "",
                    onChange: (e) => onUpdate(field.id, {
                      conditionalLogic: {
                        ...field.conditionalLogic ?? {
                          fieldId: "",
                          operator: "equals"
                        },
                        value: e.target.value
                      }
                    }),
                    placeholder: "e.g. Yes",
                    "data-ocid": `condition-value-${index}`
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 mt-1",
            onClick: () => onRemove(field.id),
            "aria-label": "Remove field",
            "data-ocid": `remove-field-${index}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
          }
        )
      ] }) })
    }
  );
}
function FormBuilderPage() {
  const { workspaceId, formId } = useParams({
    from: "/app/$workspaceId/admin/forms/$formId/builder"
  });
  const navigate = useNavigate();
  const { data: existing } = useForm(formId);
  const { data: projects = [] } = useProjects();
  const saveForm = useSaveForm();
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [fields, setFields] = reactExports.useState([]);
  const [activeTab, setActiveTab] = reactExports.useState("fields");
  const [branding, setBranding] = reactExports.useState({
    logoUrl: "",
    primaryColor: "#6d28d9",
    backgroundColor: "#ffffff"
  });
  const [settings, setSettings] = reactExports.useState({
    autoCreateTask: false,
    projectId: "",
    taskTitleTemplate: "New submission: {{title}}"
  });
  const initialized = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (existing && !initialized.current) {
      initialized.current = true;
      setTitle(existing.title);
      setDescription(existing.description);
      setFields(existing.fields ?? []);
      if (existing.branding) setBranding(existing.branding);
      if (existing.settings) setSettings(existing.settings);
    }
  }, [existing]);
  const addField = () => setFields((prev) => [
    ...prev,
    {
      id: crypto.randomUUID(),
      fieldLabel: "",
      fieldType: "Text",
      required: false,
      options: [],
      conditionalLogic: null
    }
  ]);
  const updateField = (id, patch) => setFields(
    (prev) => prev.map((f) => f.id === id ? { ...f, ...patch } : f)
  );
  const removeField = (id) => setFields((prev) => prev.filter((f) => f.id !== id));
  const moveField = (idx, dir) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= fields.length) return;
    const copy = [...fields];
    [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
    setFields(copy);
  };
  const handleSave = async (status) => {
    if (!title.trim()) {
      ue.error("Form title is required");
      return;
    }
    try {
      const result = await saveForm.mutateAsync({
        formId,
        input: { title, description, fields, status, branding, settings }
      });
      if (result && "id" in result) {
        ue.success(
          status === "Published" ? "Form published!" : "Draft saved"
        );
        navigate({ to: `/app/${workspaceId}/admin/forms` });
      }
    } catch {
      ue.error("Failed to save form");
    }
  };
  const previewUrl = (existing == null ? void 0 : existing.publicUrl) ? `${window.location.origin}/forms/${existing.publicUrl}` : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex h-full flex-col overflow-hidden",
      "data-ocid": "form-builder-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex shrink-0 items-center gap-3 border-b border-border/40 bg-card px-5 py-3 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${workspaceId}/admin/forms`, "aria-label": "Back", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-base font-display font-semibold text-foreground", children: formId === "new" ? "New Form" : "Edit Form" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              fields.length,
              " field",
              fields.length !== 1 ? "s" : "",
              " · ",
              activeTab
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            previewUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                asChild: true,
                "data-ocid": "preview-btn",
                className: "hover:bg-muted",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: previewUrl, target: "_blank", rel: "noopener noreferrer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5 mr-1.5" }),
                  "Preview",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3 ml-1 opacity-60" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => handleSave("Draft"),
                disabled: saveForm.isPending,
                "data-ocid": "save-draft-btn",
                className: "active-press",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3.5 w-3.5 mr-1.5" }),
                  "Save Draft"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                onClick: () => handleSave("Published"),
                disabled: saveForm.isPending,
                "data-ocid": "publish-form-btn",
                className: "active-press",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3.5 w-3.5 mr-1.5" }),
                  "Publish"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex shrink-0 gap-1 border-b border-border/40 bg-background px-5 pt-2", children: ["fields", "branding", "settings"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setActiveTab(tab),
            className: `flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
            "data-ocid": `tab-${tab}`,
            children: [
              tab === "fields" && /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3.5 w-3.5" }),
              tab === "branding" && /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { className: "h-3.5 w-3.5" }),
              tab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "h-3.5 w-3.5" }),
              tab.charAt(0).toUpperCase() + tab.slice(1),
              tab === "fields" && fields.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] px-1.5 py-0 ml-0.5 rounded-full bg-muted text-muted-foreground border-border", children: fields.length })
            ]
          },
          tab
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto p-5 space-y-5", children: [
          activeTab === "fields" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "form-title", children: [
                  "Form Title ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "form-title",
                    value: title,
                    onChange: (e) => setTitle(e.target.value),
                    placeholder: "e.g. Client Intake Form",
                    "data-ocid": "form-title-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "form-desc", children: "Description" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "form-desc",
                    value: description,
                    onChange: (e) => setDescription(e.target.value),
                    placeholder: "Briefly describe what this form is for…",
                    rows: 2,
                    "data-ocid": "form-desc-input"
                  }
                )
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
                  "Fields (",
                  fields.length,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: addField,
                    "data-ocid": "add-field-btn",
                    className: "active-press",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1.5" }),
                      "Add Field"
                    ]
                  }
                )
              ] }),
              fields.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "border-2 border-dashed border-border/50 rounded-xl p-10 text-center",
                  "data-ocid": "empty-fields",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FileInput, { className: "h-8 w-8 text-muted-foreground/40 mx-auto mb-2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: 'No fields yet. Click "Add Field" to start building.' })
                  ]
                }
              ),
              fields.map((field, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                FieldCard,
                {
                  field,
                  index: idx,
                  allFields: fields,
                  onUpdate: updateField,
                  onRemove: removeField,
                  onMoveUp: () => moveField(idx, -1),
                  onMoveDown: () => moveField(idx, 1),
                  isFirst: idx === 0,
                  isLast: idx === fields.length - 1
                },
                field.id
              )),
              fields.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  className: "w-full border-dashed active-press",
                  onClick: addField,
                  "data-ocid": "add-field-bottom-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1.5" }),
                    "Add another field"
                  ]
                }
              )
            ] })
          ] }),
          activeTab === "branding" && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "logo-url", children: "Logo URL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "logo-url",
                  value: branding.logoUrl,
                  onChange: (e) => setBranding((b) => ({ ...b, logoUrl: e.target.value })),
                  placeholder: "https://example.com/logo.png",
                  "data-ocid": "logo-url-input"
                }
              ),
              branding.logoUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: branding.logoUrl,
                  alt: "Logo preview",
                  className: "h-12 object-contain rounded-lg border border-border mt-2"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "primary-color", children: "Primary Color" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "primary-color",
                      type: "color",
                      value: branding.primaryColor,
                      onChange: (e) => setBranding((b) => ({
                        ...b,
                        primaryColor: e.target.value
                      })),
                      className: "h-10 w-16 cursor-pointer rounded border border-input",
                      "data-ocid": "primary-color-picker"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: branding.primaryColor,
                      onChange: (e) => setBranding((b) => ({
                        ...b,
                        primaryColor: e.target.value
                      })),
                      className: "font-mono text-sm"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bg-color", children: "Background Color" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "bg-color",
                      type: "color",
                      value: branding.backgroundColor,
                      onChange: (e) => setBranding((b) => ({
                        ...b,
                        backgroundColor: e.target.value
                      })),
                      className: "h-10 w-16 cursor-pointer rounded border border-input",
                      "data-ocid": "bg-color-picker"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: branding.backgroundColor,
                      onChange: (e) => setBranding((b) => ({
                        ...b,
                        backgroundColor: e.target.value
                      })),
                      className: "font-mono text-sm"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl border border-border/50 p-4 text-sm",
                style: {
                  backgroundColor: branding.backgroundColor,
                  color: branding.primaryColor
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Preview:" }),
                  " Form buttons and accents will use",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: branding.primaryColor, fontWeight: 600 }, children: branding.primaryColor }),
                  " ",
                  "on a",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600 }, children: branding.backgroundColor }),
                  " ",
                  "background."
                ]
              }
            )
          ] }) }),
          activeTab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: "Auto-create Task on Submission" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Each submission will automatically create a task in the selected project." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: settings.autoCreateTask,
                  onCheckedChange: (v) => setSettings((s) => ({ ...s, autoCreateTask: v })),
                  "data-ocid": "auto-task-toggle"
                }
              )
            ] }),
            settings.autoCreateTask && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Target Project" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: settings.projectId,
                    onValueChange: (v) => setSettings((s) => ({ ...s, projectId: v })),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "task-project-picker", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose a project…" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: projects.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.name }, p.id)) })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "task-title-template", children: "Task Title Template" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "task-title-template",
                    value: settings.taskTitleTemplate,
                    onChange: (e) => setSettings((s) => ({
                      ...s,
                      taskTitleTemplate: e.target.value
                    })),
                    placeholder: "New submission: {{title}}",
                    "data-ocid": "task-title-template-input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "Use",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-xs bg-muted px-1 py-0.5 rounded", children: "{{title}}" }),
                  " ",
                  "to insert the form title."
                ] })
              ] })
            ] })
          ] }) })
        ] })
      ]
    }
  );
}
export {
  FormBuilderPage as default
};
