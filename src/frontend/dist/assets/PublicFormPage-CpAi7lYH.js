import { m as useParams, r as reactExports, j as jsxRuntimeExports, B as Button, e as useActor, h as useQuery, l as createActor } from "./index-1XRv9GHr.js";
import { C as Card, a as CardContent } from "./card-CFU1s52N.js";
import { C as Checkbox } from "./checkbox-CANCE-ko.js";
import { I as Input } from "./input-BOIU-9S_.js";
import { L as Label } from "./label-cy3JJ-Xo.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BNtSJS5c.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { T as Textarea } from "./textarea-DsJhlE90.js";
import { u as useMutation } from "./useMutation-X94w2CVk.js";
import { F as FileInput } from "./file-input-BY8DOvt2.js";
import { C as CircleAlert } from "./circle-alert-DOsaO_yO.js";
import { S as Send } from "./send-BhUdyFSk.js";
import { C as CircleCheck } from "./circle-check-DTEyto7g.js";
import "./index-DYs8jb_i.js";
import "./index-IXOTxK3N.js";
import "./chevron-up-BUdvSziG.js";
function usePublicForm(publicUrl) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["public-form", publicUrl],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPublicForm(publicUrl);
    },
    enabled: !!actor && !isFetching && !!publicUrl,
    retry: false
  });
}
function useSubmitForm() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      formId,
      data,
      submitterEmail
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitFormResponse(formId, data, submitterEmail);
    }
  });
}
function shouldShowField(field, fieldValues, fields) {
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
  onChange
}) {
  const id = `field-${field.id}`;
  const labelEl = /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: id, className: "text-sm font-medium text-foreground", children: [
    field.fieldLabel,
    field.required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive ml-1", children: "*" })
  ] });
  switch (field.fieldType) {
    case "Text":
    case "FileUpload":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        labelEl,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id,
            type: "text",
            value,
            onChange: (e) => onChange(e.target.value),
            required: field.required,
            placeholder: field.fieldType === "FileUpload" ? "Paste file URL here..." : `Enter ${field.fieldLabel.toLowerCase()}...`,
            "data-ocid": `public-field-${field.id}`
          }
        )
      ] });
    case "Email":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        labelEl,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id,
            type: "email",
            value,
            onChange: (e) => onChange(e.target.value),
            required: field.required,
            placeholder: "you@example.com",
            "data-ocid": `public-field-${field.id}`
          }
        )
      ] });
    case "Textarea":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        labelEl,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id,
            value,
            onChange: (e) => onChange(e.target.value),
            required: field.required,
            placeholder: `Enter ${field.fieldLabel.toLowerCase()}...`,
            rows: 4,
            "data-ocid": `public-field-${field.id}`
          }
        )
      ] });
    case "Dropdown":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        labelEl,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value,
            onValueChange: onChange,
            required: field.required,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id, "data-ocid": `public-field-${field.id}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select an option..." }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: field.options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt, children: opt }, opt)) })
            ]
          }
        )
      ] });
    case "Checkbox":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Checkbox,
          {
            id,
            checked: value === "true",
            onCheckedChange: (checked) => onChange(checked ? "true" : "false"),
            required: field.required,
            "data-ocid": `public-field-${field.id}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Label,
          {
            htmlFor: id,
            className: "text-sm font-medium text-foreground cursor-pointer leading-snug",
            children: [
              field.fieldLabel,
              field.required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive ml-1", children: "*" })
            ]
          }
        )
      ] });
    case "Date":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        labelEl,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id,
            type: "date",
            value,
            onChange: (e) => onChange(e.target.value),
            required: field.required,
            "data-ocid": `public-field-${field.id}`
          }
        )
      ] });
    default:
      return null;
  }
}
function SuccessState({ branding }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen flex flex-col items-center justify-center p-6",
      style: (branding == null ? void 0 : branding.backgroundColor) ? { backgroundColor: branding.backgroundColor } : void 0,
      "data-ocid": "public-form-success",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-5 max-w-sm w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 mx-auto ring-2 ring-emerald-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-10 w-10 text-emerald-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Submission received!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed mt-2", children: "Thank you for your response. We've recorded your submission and will be in touch shortly." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-16 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-xs text-muted-foreground hover:text-foreground transition-colors duration-200",
            children: [
              "Powered by",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary", children: "Fourthspace" })
            ]
          }
        ) })
      ]
    }
  );
}
function FormSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full max-w-lg mx-auto space-y-5",
      "data-ocid": "public-form-loading",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-36 mx-auto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-8 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-10 rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-48" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-64" })
            ] })
          ] }),
          [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
          ] }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
        ] }) })
      ]
    }
  );
}
function FormNotFound() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col items-center justify-center p-6",
      "data-ocid": "public-form-not-found",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-3 max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-7 w-7 text-destructive" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Form not found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This form may have been removed or the link is incorrect. Please contact the sender for a valid link." })
      ] })
    }
  );
}
function PublicFormPage() {
  const { publicUrl } = useParams({ from: "/forms/$publicUrl" });
  const { data: form, isLoading, isError } = usePublicForm(publicUrl);
  const submitForm = useSubmitForm();
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [submitError, setSubmitError] = reactExports.useState(null);
  const [fieldValues, setFieldValues] = reactExports.useState({});
  const [submitterEmail, setSubmitterEmail] = reactExports.useState("");
  const [currentStep, setCurrentStep] = reactExports.useState(0);
  if (submitted) return /* @__PURE__ */ jsxRuntimeExports.jsx(SuccessState, { branding: form == null ? void 0 : form.branding });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex flex-col items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FormSkeleton, {}) });
  }
  if (isError || !form || form.status !== "Published") return /* @__PURE__ */ jsxRuntimeExports.jsx(FormNotFound, {});
  const branding = form.branding ?? {};
  const handleFieldChange = (fieldId, value) => setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
  const visibleFields = form.fields.filter(
    (f) => shouldShowField(f, fieldValues, form.fields)
  );
  const STEP_SIZE = 5;
  const steps = [];
  for (let i = 0; i < visibleFields.length; i += STEP_SIZE) {
    steps.push(visibleFields.slice(i, i + STEP_SIZE));
  }
  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps - 1;
  const progressPct = totalSteps > 1 ? Math.round((currentStep + 1) / totalSteps * 100) : 100;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    for (const field of visibleFields) {
      if (field.required && !fieldValues[field.id]) {
        setSubmitError(`"${field.fieldLabel}" is required`);
        return;
      }
    }
    const data = visibleFields.map((field) => [
      field.fieldLabel,
      fieldValues[field.id] ?? ""
    ]);
    try {
      await submitForm.mutateAsync({ formId: form.id, data, submitterEmail });
      setSubmitted(true);
    } catch {
      setSubmitError("Failed to submit. Please try again.");
    }
  };
  const primaryColorStyle = branding.primaryColor ? { backgroundColor: branding.primaryColor } : void 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen flex flex-col",
      style: branding.backgroundColor ? { backgroundColor: branding.backgroundColor } : void 0,
      "data-ocid": "public-form-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center p-6 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
            branding.logoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: branding.logoUrl,
                alt: "Form logo",
                className: "h-14 object-contain mx-auto mb-3",
                onError: (e) => {
                  e.currentTarget.style.display = "none";
                }
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex h-12 w-12 items-center justify-center rounded-2xl mx-auto mb-3 shadow-lg",
                style: primaryColorStyle ?? {
                  backgroundColor: "oklch(var(--primary))"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-bold text-primary-foreground", children: "F" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest font-medium", children: "Fourthspace" })
          ] }),
          totalSteps > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Step ",
                currentStep + 1,
                " of ",
                totalSteps
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                progressPct,
                "% complete"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full bg-primary transition-all duration-500",
                style: { width: `${progressPct}%` }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: "border-border/50 shadow-card",
              "data-ocid": `form-${publicUrl}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-7", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "flex h-10 w-10 items-center justify-center rounded-xl shrink-0 mt-0.5",
                      style: primaryColorStyle ? { backgroundColor: `${branding.primaryColor}20` } : { backgroundColor: "oklch(var(--primary) / 0.1)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FileInput,
                        {
                          className: "h-5 w-5",
                          style: primaryColorStyle ? { color: branding.primaryColor } : void 0
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground leading-tight", children: form.title }),
                    form.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: form.description })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", noValidate: true, children: [
                  (steps[currentStep] ?? visibleFields).map((field) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FormFieldInput,
                    {
                      field,
                      value: fieldValues[field.id] ?? "",
                      onChange: (v) => handleFieldChange(field.id, v)
                    },
                    field.id
                  )),
                  isLastStep && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: "submitter-email",
                        className: "text-sm font-medium text-foreground",
                        children: "Your Email Address"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "submitter-email",
                        type: "email",
                        value: submitterEmail,
                        onChange: (e) => setSubmitterEmail(e.target.value),
                        placeholder: "you@example.com",
                        "data-ocid": "submitter-email-input"
                      }
                    )
                  ] }),
                  submitError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3",
                      "data-ocid": "submit-error",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-destructive shrink-0 mt-0.5" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: submitError })
                      ]
                    }
                  ),
                  totalSteps > 1 && !isLastStep ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      className: "w-full active-press",
                      style: primaryColorStyle,
                      onClick: () => setCurrentStep((s) => s + 1),
                      children: [
                        "Next ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1", children: "→" })
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "submit",
                      className: "w-full active-press",
                      style: primaryColorStyle,
                      disabled: submitForm.isPending,
                      "data-ocid": "form-submit-btn",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-2" }),
                        submitForm.isPending ? "Submitting…" : "Submit"
                      ]
                    }
                  ),
                  totalSteps > 1 && currentStep > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setCurrentStep((s) => s - 1),
                      className: "w-full text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 text-center",
                      children: "← Back"
                    }
                  )
                ] })
              ] })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "pb-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " Fourthspace · Your data is secured on the",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "https://internetcomputer.org",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "underline underline-offset-2 hover:text-foreground transition-colors duration-200",
              children: "Internet Computer"
            }
          ),
          " · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "underline underline-offset-2 hover:text-foreground transition-colors duration-200",
              children: "Built with Fourthspace"
            }
          )
        ] }) })
      ]
    }
  );
}
export {
  PublicFormPage as default
};
