import { s as createLucideIcon, m as useParams, f as useWorkspace, j as jsxRuntimeExports, B as Button, i as Link, e as useActor, g as getTenantId, h as useQuery, r as reactExports, w as ChevronDown, l as createActor } from "./index-1XRv9GHr.js";
import { B as Badge } from "./badge-rX4oLW6l.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-CFU1s52N.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { A as ArrowLeft } from "./arrow-left-B-gbON0E.js";
import { D as Download } from "./download-B8M1zj2A.js";
import { F as FileInput } from "./file-input-BY8DOvt2.js";
import { T as TrendingUp } from "./trending-up-rksXqIQ8.js";
import { C as ChartColumn } from "./chart-column-CjOK8mN4.js";
import { C as ChevronUp } from "./chevron-up-BUdvSziG.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["polyline", { points: "22 12 16 12 14 15 10 15 8 12 2 12", key: "o97t9d" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ]
];
const Inbox = createLucideIcon("inbox", __iconNode);
function useForm(formId) {
  const { actor, isFetching } = useActor(createActor);
  const { activeWorkspaceId } = useWorkspace();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  return useQuery({
    queryKey: ["form", formId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getForm(tenantId, workspaceId, formId);
    },
    enabled: !!actor && !isFetching && !!formId && !!workspaceId
  });
}
function useFormSubmissions(formId) {
  const { actor, isFetching } = useActor(createActor);
  const { activeWorkspaceId } = useWorkspace();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  return useQuery({
    queryKey: ["form-submissions", formId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFormSubmissions(tenantId, workspaceId, formId);
    },
    enabled: !!actor && !isFetching && !!formId && !!workspaceId
  });
}
function useFormAnalytics(formId) {
  const { actor, isFetching } = useActor(createActor);
  const { activeWorkspaceId } = useWorkspace();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  return useQuery({
    queryKey: ["form-analytics", formId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getFormAnalytics(tenantId, workspaceId, formId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!formId && !!workspaceId
  });
}
function formatTimestamp(ts) {
  const ms = Number(ts / 1000000n);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(ms));
}
function computeClientAnalytics(form, submissions) {
  if (!form || !submissions.length) return [];
  return form.fields.map((field) => {
    const filled = submissions.filter((s) => {
      var _a;
      const entry = s.data.find(([label]) => label === field.fieldLabel);
      return (_a = entry == null ? void 0 : entry[1]) == null ? void 0 : _a.trim();
    }).length;
    return { fieldLabel: field.fieldLabel, filled, total: submissions.length };
  });
}
function exportCsv(form, submissions) {
  if (!submissions.length) return;
  const fieldLabels = (form == null ? void 0 : form.fields.map((f) => f.fieldLabel)) ?? [];
  const headers = ["Submission ID", "Email", "Submitted At", ...fieldLabels];
  const rows = submissions.map((s) => {
    const dataMap = Object.fromEntries(s.data);
    return [
      s.id,
      s.submitterEmail,
      formatTimestamp(s.submittedAt),
      ...fieldLabels.map((label) => dataMap[label] ?? "")
    ];
  });
  const csvContent = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
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
  serverAnalytics
}) {
  var _a;
  const fieldRates = ((_a = serverAnalytics == null ? void 0 : serverAnalytics.fieldCompletionRates) == null ? void 0 : _a.length) ? serverAnalytics.fieldCompletionRates : computeClientAnalytics(form, submissions);
  const total = (serverAnalytics == null ? void 0 : serverAnalytics.totalSubmissions) ?? submissions.length;
  if (!total) return null;
  const avgPct = fieldRates.length ? Math.round(
    fieldRates.reduce(
      (acc, f) => acc + (f.total > 0 ? f.filled / f.total : 0),
      0
    ) / fieldRates.length * 100
  ) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "border-border/50 bg-card shadow-card",
      "data-ocid": "form-analytics",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-primary" }),
          " Submission Analytics"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/40 p-4 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: total }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Total Submissions" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/40 p-4 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: (form == null ? void 0 : form.fields.length) ?? 0 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Form Fields" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-emerald-500/10 p-4 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-display font-bold text-emerald-600 dark:text-emerald-400", children: [
                avgPct,
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Avg. Completion" })
            ] })
          ] }),
          fieldRates.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Field Completion Rates" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: fieldRates.map((f) => {
              const pct = f.total > 0 ? Math.round(f.filled / f.total * 100) : 0;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium truncate max-w-[60%]", children: f.fieldLabel }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground shrink-0 ml-2", children: [
                    f.filled,
                    "/",
                    f.total,
                    " (",
                    pct,
                    "%)"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `h-full rounded-full transition-all ${pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-destructive"}`,
                    style: { width: `${pct}%` }
                  }
                ) })
              ] }, f.fieldLabel);
            }) })
          ] })
        ] })
      ]
    }
  );
}
function SubmissionRow({
  submission,
  fieldLabels
}) {
  var _a;
  const [expanded, setExpanded] = reactExports.useState(false);
  const dataMap = Object.fromEntries(submission.data);
  const initials = submission.submitterEmail.slice(0, 2).toUpperCase() || "??";
  const preview = ((_a = submission.data[0]) == null ? void 0 : _a[1]) ?? "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: "w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors duration-150 text-left",
        onClick: () => setExpanded((v) => !v),
        "data-ocid": `submission-row-${submission.id}`,
        "aria-expanded": expanded,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-primary", children: initials }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: submission.submitterEmail || "Anonymous" }),
            preview && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: preview })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground hidden sm:block", children: formatTimestamp(submission.submittedAt) }),
            expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })
          ] })
        ]
      }
    ),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "px-5 pb-4 bg-muted/10 border-t border-border/40",
        "data-ocid": `submission-detail-${submission.id}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2 pt-4", children: [
          fieldLabels.map((label) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground break-words", children: dataMap[label] || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground italic", children: "—" }) })
          ] }, label)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Submitter Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: submission.submitterEmail || "—" })
          ] })
        ] })
      }
    )
  ] });
}
function FormSubmissionsPage() {
  const { formId } = useParams({
    from: "/app/$workspaceId/admin/forms/$formId/submissions"
  });
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const { data: form, isLoading: formLoading } = useForm(formId);
  const { data: submissions = [], isLoading: subsLoading } = useFormSubmissions(formId);
  const { data: serverAnalytics } = useFormAnalytics(formId);
  const isLoading = formLoading || subsLoading;
  const fieldLabels = (form == null ? void 0 : form.fields.map((f) => f.fieldLabel)) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-6 space-y-6 animate-fade-in-up",
      "data-ocid": "form-submissions-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: `/app/${workspaceId}/admin/forms`,
              "aria-label": "Back to forms",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            formLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-48 mb-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: (form == null ? void 0 : form.title) ?? "Form Submissions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Responses received for this form" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => exportCsv(form, submissions),
              disabled: submissions.length === 0,
              "data-ocid": "export-submissions-btn",
              className: "active-press",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
                "Export CSV"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "flex items-center gap-1.5 text-xs rounded-full px-2.5 py-0.5 bg-muted text-muted-foreground border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "h-3.5 w-3.5" }),
            submissions.length,
            " submission",
            submissions.length !== 1 ? "s" : ""
          ] }),
          form && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "flex items-center gap-1.5 text-xs rounded-full px-2.5 py-0.5 bg-muted text-muted-foreground border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileInput, { className: "h-3.5 w-3.5" }),
            form.fields.length,
            " field",
            form.fields.length !== 1 ? "s" : ""
          ] }),
          submissions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "flex items-center gap-1.5 text-xs rounded-full px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5" }),
            "Analytics available"
          ] })
        ] }),
        !isLoading && submissions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          AnalyticsSection,
          {
            submissions,
            form,
            serverAnalytics
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card shadow-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold", children: "All Submissions" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-0", children: [
            isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/40", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 px-5 py-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-xl" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-64" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28 hidden sm:block" })
            ] }, i)) }),
            !isLoading && submissions.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center justify-center py-16 text-center",
                "data-ocid": "submissions-empty-state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "h-6 w-6 text-muted-foreground/60" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-1", children: "No submissions yet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Share the public form link to start collecting responses." })
                ]
              }
            ),
            !isLoading && submissions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/40", children: submissions.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              SubmissionRow,
              {
                submission: sub,
                fieldLabels
              },
              sub.id
            )) })
          ] })
        ] })
      ]
    }
  );
}
export {
  FormSubmissionsPage as default
};
