import { s as createLucideIcon, m as useParams, d as useNavigate, f as useWorkspace, n as useQueryClient, r as reactExports, as as TaskPriority, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, P as Plus, X } from "./index-CzyNqtbv.js";
import { B as Badge } from "./badge-B6elWcoD.js";
import { I as Input } from "./input-982h_Ebl.js";
import { L as Label } from "./label-D31XgQrg.js";
import { S as Skeleton } from "./skeleton-DMAdSNre.js";
import { T as Textarea } from "./textarea-BbzS3l8F.js";
import { u as useMutation } from "./useMutation-BsRk2Bod.js";
import { u as ue } from "./index-DaWH_LJ9.js";
import { u as useBackend } from "./index-CJtF1vtU.js";
import { A as ArrowLeft } from "./arrow-left-BnDr9sMT.js";
import { S as Search } from "./search-DHDFYO8C.js";
import { S as SquareCheckBig } from "./square-check-big-kPgmw6zy.js";
import { L as LoaderCircle } from "./loader-circle-CdDQIoul.js";
import { S as Star } from "./star-B2aBRVXL.js";
import { T as Trash2 } from "./trash-2-8AcD7pMp.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m5 12-3 3 3 3", key: "oke12k" }],
  ["path", { d: "m9 18 3-3-3-3", key: "112psh" }]
];
const FileCode2 = createLucideIcon("file-code-2", __iconNode);
const PRIORITY_COLOR = {
  [TaskPriority.Low]: "bg-muted text-muted-foreground border-border",
  [TaskPriority.Medium]: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400",
  [TaskPriority.High]: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800 dark:text-red-400",
  [TaskPriority.Critical]: "bg-red-600/20 text-red-700 border-red-300 font-semibold"
};
const BUILT_IN_TASK_TEMPLATES = [
  {
    id: "builtin-bug-report",
    name: "Bug Report",
    description: "Structured bug investigation with steps to reproduce, root cause analysis, and verification",
    icon: "🐛",
    defaultPriority: TaskPriority.High,
    checklistItems: [
      "Reproduce the issue on local environment",
      "Document exact steps to reproduce (numbered list)",
      "Capture screenshots or screen recording of the bug",
      "Check browser console for JavaScript errors",
      "Identify affected users and environments (browser, OS, version)",
      "Search codebase for root cause — check logs and error tracking",
      "Write a failing test case that confirms the bug",
      "Implement fix and verify test now passes",
      "Confirm fix works in staging environment",
      "Request code review and get sign-off",
      "Deploy fix to production",
      "Monitor error tracking for 30 minutes post-deploy to confirm resolution"
    ]
  },
  {
    id: "builtin-feature-request",
    name: "Feature Request",
    description: "End-to-end flow from user story through design, build, tests, and deployment",
    icon: "✨",
    defaultPriority: TaskPriority.Medium,
    checklistItems: [
      "Define user story: 'As a [user], I want [feature], so that [outcome]'",
      "Write clear acceptance criteria (what 'done' looks like)",
      "Validate requirements with product manager before starting",
      "Create wireframes or mockups and get design approval",
      "Break implementation into technical subtasks",
      "Estimate effort in story points and confirm with engineering lead",
      "Add to sprint backlog and assign to engineer",
      "Implement feature following coding standards",
      "Write unit and integration tests for all new code paths",
      "Complete self-review checklist (no console logs, no hardcoded values)",
      "Submit for code review — address all reviewer comments",
      "Deploy to staging and perform smoke testing",
      "Get stakeholder sign-off on staging",
      "Deploy to production and notify the original requester"
    ]
  },
  {
    id: "builtin-code-review",
    name: "Code Review",
    description: "Thorough PR review checklist covering security, tests, logic, performance, and style",
    icon: "👀",
    defaultPriority: TaskPriority.Medium,
    checklistItems: [
      "Read the PR description and linked ticket to understand the intent",
      "Check that the PR scope matches what's described — no unrelated changes",
      "Review for security vulnerabilities (SQL injection, XSS, exposed secrets)",
      "Verify test coverage is adequate — new code should have corresponding tests",
      "Review logic for correctness and edge cases (null inputs, empty arrays, large datasets)",
      "Check for performance issues (N+1 queries, unnecessary re-renders, blocking calls)",
      "Ensure error handling is present and meaningful error messages are used",
      "Verify naming conventions are followed (variables, functions, files)",
      "Check that no TODO comments or debug code were left in",
      "Leave constructive inline comments with specific suggestions, not just 'fix this'",
      "Approve if all checks pass, or request changes with clear explanation"
    ]
  },
  {
    id: "builtin-documentation",
    name: "Documentation Task",
    description: "Research, draft, review, and publish documentation with examples and diagrams",
    icon: "📝",
    defaultPriority: TaskPriority.Low,
    checklistItems: [
      "Define the audience: who will read this and what do they need to know?",
      "Outline the document structure — section headings before writing prose",
      "Write first draft from existing code, specs, or subject matter expert interviews",
      "Add working code examples for every technical concept covered",
      "Add screenshots or diagrams where a visual explanation is clearer than text",
      "Run through a 'naive reader' test — would someone new understand this?",
      "Get technical accuracy review from the subject matter expert",
      "Get editorial review for clarity and tone",
      "Address all review feedback",
      "Publish to the documentation site in the correct section",
      "Add to the documentation site's search index",
      "Announce the new documentation in the team Slack channel"
    ]
  },
  {
    id: "builtin-deployment",
    name: "Deployment Checklist",
    description: "Full release flow from tests to production deploy, monitoring, and announcement",
    icon: "🚀",
    defaultPriority: TaskPriority.High,
    checklistItems: [
      "Run full automated test suite — all tests must pass before proceeding",
      "Review deployment diff: confirm only expected changes are included",
      "Update CHANGELOG with all changes included in this release",
      "Tag the release version in version control (e.g. v2.5.0)",
      "Deploy to staging environment",
      "Perform smoke testing on staging: test the 5 most critical user flows",
      "Get explicit QA sign-off for staging build",
      "Notify stakeholders of upcoming production deployment and timing",
      "Schedule maintenance window if downtime is expected",
      "Deploy to production",
      "Monitor error tracking dashboard for 30 minutes post-deploy",
      "Verify key metrics are within normal range (error rate, response time, conversion)",
      "Update status page to reflect successful deployment",
      "Send release announcement to team and relevant stakeholders"
    ]
  },
  {
    id: "builtin-design-review",
    name: "Design Review",
    description: "UI/UX review covering brand guidelines, accessibility, responsiveness, and user flows",
    icon: "🎨",
    defaultPriority: TaskPriority.Medium,
    checklistItems: [
      "Review designs against brand guidelines (colors, typography, spacing)",
      "Check WCAG 2.1 AA accessibility: color contrast ratios meet 4.5:1 minimum",
      "Validate responsive behavior on mobile (375px), tablet (768px), and desktop (1440px)",
      "Review all interactive states: default, hover, focus, active, disabled, loading, error",
      "Check user flow for edge cases: empty states, error states, long content, special characters",
      "Review copy and microcopy for correct tone, spelling, and grammar",
      "Confirm all icons have accessible labels (not just visual icons)",
      "Check that animations honor prefers-reduced-motion",
      "Get sign-off from product manager on user flows",
      "Get sign-off from engineering on technical feasibility",
      "Export final assets at correct sizes and formats (2× for retina)"
    ]
  },
  {
    id: "builtin-support-ticket",
    name: "Support Ticket",
    description: "Customer support workflow from acknowledgment through resolution and knowledge base update",
    icon: "🎫",
    defaultPriority: TaskPriority.Medium,
    checklistItems: [
      "Acknowledge customer within SLA window (e.g. 4 business hours for standard tier)",
      "Gather complete information: account ID, browser, OS, exact steps to reproduce",
      "Reproduce the issue on a test account to confirm behavior",
      "Search the knowledge base and existing bug tracker for known solutions",
      "If a workaround exists, communicate it to the customer immediately",
      "If engineering escalation is needed, create a bug ticket with full reproduction steps",
      "Communicate resolution timeline estimate to the customer",
      "Implement fix or coordinate with engineering if a code change is required",
      "Test resolution before closing — confirm in same environment as the customer",
      "Resolve ticket and document the solution clearly for future reference",
      "Follow up with customer 24 hours after resolution to confirm it worked",
      "Add solution to knowledge base if it could help other customers"
    ]
  },
  {
    id: "builtin-onboarding",
    name: "Employee Onboarding",
    description: "New hire setup from pre-boarding through 90-day performance review",
    icon: "🙋",
    defaultPriority: TaskPriority.Medium,
    checklistItems: [
      "Send welcome email 3 days before start date with day-1 logistics (time, location/Zoom, dress code)",
      "Provision all accounts: email, Slack, GitHub, project management tools, HR system",
      "Set up hardware and ensure laptop is ready before first day",
      "Schedule week-1 onboarding sessions: HR orientation, team intro, tool walkthroughs",
      "Assign an onboarding buddy — a peer (not manager) who can answer day-to-day questions",
      "Share the company handbook, code of conduct, and key policies",
      "Introduce new hire to the full team — post a welcome message in Slack",
      "Walk through the team's current projects, priorities, and how work gets done",
      "Assign a low-complexity first task to give the new hire an early win",
      "Week 2: first check-in with manager — answer questions, gather feedback on onboarding",
      "30-day review: assess ramp progress, address any gaps in training or knowledge",
      "90-day performance check-in: set 6-month goals and development plan"
    ]
  },
  {
    id: "builtin-content-creation",
    name: "Content Creation",
    description: "Full content lifecycle from research through publish, SEO, and distribution",
    icon: "✍️",
    defaultPriority: TaskPriority.Medium,
    checklistItems: [
      "Define target audience, goal, and primary call-to-action for this piece",
      "Research keywords and SEO angles — identify 1 primary and 3–5 secondary keywords",
      "Create a detailed outline and get approval before writing",
      "Write the first draft — focus on clarity and structure over perfection",
      "Self-review: cut anything that doesn't serve the reader",
      "Submit for internal review (subject matter accuracy + editorial)",
      "Revise based on all feedback",
      "SEO optimization pass: meta title, meta description, header tags, internal links",
      "Final proofreading — grammar, spelling, formatting consistency",
      "Add visuals: featured image, inline images, charts, or video where relevant",
      "Schedule or publish at the optimal time for audience engagement",
      "Share on all relevant social channels and internal Slack",
      "Track performance after 7 days (views, engagement, conversions) and report findings"
    ]
  },
  {
    id: "builtin-security-review",
    name: "Security Review",
    description: "Security audit covering authentication, injection attacks, encryption, and access control",
    icon: "🔒",
    defaultPriority: TaskPriority.High,
    checklistItems: [
      "Review authentication flows: token validation, session expiry, brute-force protection",
      "Check authorization logic: verify users can only access their own data",
      "Test for SQL injection vulnerabilities on all database query inputs",
      "Test for XSS attack vectors in all form fields and URL parameters",
      "Review data encryption at rest: sensitive fields (PII, passwords) must be encrypted",
      "Review data encryption in transit: all endpoints must use HTTPS/TLS",
      "Scan codebase for exposed secrets (API keys, passwords, tokens in code or .env)",
      "Review third-party dependencies for known vulnerabilities (run npm audit or equivalent)",
      "Check file upload handling for malicious file type injection",
      "Review rate limiting and DDoS protection on public-facing endpoints",
      "Document all findings with severity ratings (Critical / High / Medium / Low)",
      "Immediately remediate all Critical and High severity findings",
      "Schedule follow-up review in 90 days"
    ]
  },
  {
    id: "builtin-performance",
    name: "Performance Investigation",
    description: "Define baseline, profile bottlenecks, optimize, and benchmark improvements",
    icon: "⚡",
    defaultPriority: TaskPriority.High,
    checklistItems: [
      "Define performance baseline and measurable targets (e.g. LCP < 2.5s, API p95 < 200ms)",
      "Run Lighthouse audit and record current scores (Performance, Accessibility, SEO)",
      "Use profiling tools to identify the top 3 performance bottlenecks",
      "Analyze database query performance — identify slow queries with EXPLAIN ANALYZE",
      "Review API response times — flag any endpoints exceeding 500ms",
      "Analyze frontend bundle size — identify large dependencies or duplicate modules",
      "Check for unnecessary network requests, render-blocking resources, or large images",
      "Implement fixes for the top 3 identified bottlenecks",
      "Re-run profiling and Lighthouse to confirm improvement",
      "Verify changes don't introduce regressions in other areas",
      "Document findings, root causes, solutions, and benchmark comparisons",
      "Share results with team and add to performance monitoring dashboard"
    ]
  },
  {
    id: "builtin-sprint-planning",
    name: "Sprint Planning",
    description: "Sprint setup from backlog grooming through capacity confirmation and kickoff",
    icon: "🗓️",
    defaultPriority: TaskPriority.Medium,
    checklistItems: [
      "Review and groom the backlog — ensure all tickets have clear descriptions and acceptance criteria",
      "Confirm team capacity: account for PTO, holidays, and non-development time",
      "Select sprint goal: one clear sentence that describes the sprint's primary outcome",
      "Pull candidate tickets into the sprint based on priority and dependency order",
      "Estimate story points for each ticket as a team (Planning Poker recommended)",
      "Verify total story points don't exceed team capacity (use 80% of theoretical max)",
      "Assign tickets to team members based on skills and availability",
      "Identify and resolve blockers or missing dependencies before the sprint starts",
      "Update the project board — move all sprint tickets to 'To Do'",
      "Send sprint kickoff summary to the team: goal, tickets, capacity, key dates",
      "Schedule the sprint review and retrospective dates now"
    ]
  }
];
function ProjectTemplatesPage() {
  const params = useParams({ strict: false });
  const { projectId } = useParams({
    from: "/app/$workspaceId/projects/$projectId/templates"
  });
  const workspaceId = params.workspaceId;
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { tenantId, activeWorkspaceId } = useWorkspace();
  const effectiveWorkspaceId = workspaceId || activeWorkspaceId || "";
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [priority, setPriority] = reactExports.useState(TaskPriority.Medium);
  const [checklistInput, setChecklistInput] = reactExports.useState("");
  const [checklistItems, setChecklistItems] = reactExports.useState([]);
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["taskTemplates", tenantId, effectiveWorkspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTaskTemplates(tenantId, effectiveWorkspaceId);
    },
    enabled: !!actor && !isFetching
  });
  const projectTemplates = templates.filter(
    (t) => !t.projectId || t.projectId === projectId
  );
  const filteredBuiltIn = reactExports.useMemo(() => {
    if (!search.trim()) return BUILT_IN_TASK_TEMPLATES;
    const q = search.toLowerCase();
    return BUILT_IN_TASK_TEMPLATES.filter(
      (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }, [search]);
  const filteredCustom = reactExports.useMemo(() => {
    if (!search.trim()) return projectTemplates;
    const q = search.toLowerCase();
    return projectTemplates.filter(
      (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }, [search, projectTemplates]);
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.createTaskTemplate(tenantId, effectiveWorkspaceId, {
        name: name.trim(),
        description: description.trim(),
        projectId,
        checklistItems,
        defaultPriority: priority
      });
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taskTemplates", tenantId, effectiveWorkspaceId]
      });
      setShowForm(false);
      setName("");
      setDescription("");
      setChecklistItems([]);
      setChecklistInput("");
      ue.success("Template created");
    },
    onError: (e) => ue.error(e.message)
  });
  const useTaskTemplateMutation = useMutation({
    mutationFn: async (template) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.createTask(tenantId, effectiveWorkspaceId, {
        title: template.name,
        description: template.description,
        projectId,
        priority: template.defaultPriority,
        crossLinks: []
      });
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", tenantId, effectiveWorkspaceId, projectId]
      });
      ue.success("Task created from template");
      navigate({
        to: "/app/$workspaceId/projects/$projectId/tasks/$taskId",
        params: {
          workspaceId: effectiveWorkspaceId,
          projectId,
          taskId: task.id
        }
      });
    },
    onError: (e) => ue.error(e.message)
  });
  const useBuiltInTemplateMutation = useMutation({
    mutationFn: async (template) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.createTask(tenantId, effectiveWorkspaceId, {
        title: template.name,
        description: template.description,
        projectId,
        priority: template.defaultPriority,
        crossLinks: []
      });
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", tenantId, effectiveWorkspaceId, projectId]
      });
      ue.success("Task created from template");
      navigate({
        to: "/app/$workspaceId/projects/$projectId/tasks/$taskId",
        params: {
          workspaceId: effectiveWorkspaceId,
          projectId,
          taskId: task.id
        }
      });
    },
    onError: (e) => ue.error(e.message)
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.deleteTaskTemplate(
        tenantId,
        effectiveWorkspaceId,
        id
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taskTemplates", tenantId, effectiveWorkspaceId]
      });
      ue.success("Template deleted");
    },
    onError: (e) => ue.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full min-h-0 overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 md:px-8 pt-4 pb-4 border-b border-border/60 bg-card/80 sticky top-0 z-10 backdrop-blur-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-8 w-8",
          onClick: () => navigate({
            to: "/app/$workspaceId/projects/$projectId",
            params: { workspaceId: effectiveWorkspaceId, projectId }
          }),
          "aria-label": "Back",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/app/$workspaceId/projects",
            params: { workspaceId: effectiveWorkspaceId },
            className: "hover:text-foreground transition-colors",
            children: "Projects"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/app/$workspaceId/projects/$projectId",
            params: { workspaceId: effectiveWorkspaceId, projectId },
            className: "hover:text-foreground transition-colors",
            children: "Project"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "Templates" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "gap-1.5 h-8 text-xs active-press",
          onClick: () => setShowForm(true),
          "data-ocid": "create-template-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            " New Template"
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-8 py-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search templates…",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-9",
            "data-ocid": "template-search-input"
          }
        )
      ] }),
      showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-2xl border border-primary/30 bg-card p-5 space-y-4",
          "data-ocid": "template-create-form",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-bold text-foreground", children: "New Template" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "icon",
                  className: "h-7 w-7",
                  onClick: () => setShowForm(false),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Template Name *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "e.g. Bug Report",
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    className: "h-8 text-sm",
                    "data-ocid": "template-name-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Default Priority" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    value: priority,
                    onChange: (e) => setPriority(e.target.value),
                    className: "h-8 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
                    "data-ocid": "template-priority-select",
                    children: Object.values(TaskPriority).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p, children: p }, p))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Description" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    placeholder: "Task description...",
                    value: description,
                    onChange: (e) => setDescription(e.target.value),
                    className: "text-sm resize-none",
                    rows: 2,
                    "data-ocid": "template-desc-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Checklist Items" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      placeholder: "Add checklist item…",
                      value: checklistInput,
                      onChange: (e) => setChecklistInput(e.target.value),
                      onKeyDown: (e) => {
                        if (e.key === "Enter" && checklistInput.trim()) {
                          setChecklistItems((prev) => [
                            ...prev,
                            checklistInput.trim()
                          ]);
                          setChecklistInput("");
                        }
                      },
                      className: "h-8 text-sm",
                      "data-ocid": "template-checklist-input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "h-8 px-3 text-xs shrink-0",
                      onClick: () => {
                        if (checklistInput.trim()) {
                          setChecklistItems((prev) => [
                            ...prev,
                            checklistInput.trim()
                          ]);
                          setChecklistInput("");
                        }
                      },
                      children: "Add"
                    }
                  )
                ] }),
                checklistItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 mt-2", children: checklistItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-2 text-xs text-muted-foreground",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "h-3.5 w-3.5 text-primary" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: item }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "aria-label": "Remove",
                          onClick: () => setChecklistItems(
                            (prev) => prev.filter((i) => i !== item)
                          ),
                          className: "text-muted-foreground hover:text-destructive transition-colors",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
                        }
                      )
                    ]
                  },
                  item
                )) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  className: "gap-1.5 text-xs h-8",
                  disabled: !name.trim() || createMutation.isPending,
                  onClick: () => createMutation.mutate(),
                  "data-ocid": "template-save-btn",
                  children: [
                    createMutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
                    "Create Template"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  className: "text-xs h-8",
                  onClick: () => setShowForm(false),
                  children: "Cancel"
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-primary" }),
          "Built-in Templates",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs font-normal", children: filteredBuiltIn.length })
        ] }),
        filteredBuiltIn.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4 text-center", children: "No built-in templates match your search." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredBuiltIn.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 hover:shadow-sm transition-smooth",
            "data-ocid": `builtin-template-card-${t.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: t.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground text-sm truncate", children: t.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs shrink-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-2.5 w-2.5 mr-1" }),
                      "Built-in"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: t.description })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-xs ${PRIORITY_COLOR[t.defaultPriority]}`,
                    children: t.defaultPriority
                  }
                ),
                t.checklistItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "h-3 w-3" }),
                  t.checklistItems.length,
                  " items"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  className: "w-full gap-1.5 text-xs h-8 mt-auto",
                  onClick: () => useBuiltInTemplateMutation.mutate(t),
                  disabled: useBuiltInTemplateMutation.isPending,
                  "data-ocid": `use-builtin-template-${t.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                    "Use Template"
                  ]
                }
              )
            ]
          },
          t.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2", children: [
          "Your Templates",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs font-normal", children: filteredCustom.length })
        ] }),
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full rounded-2xl" }, n)) }),
        !isLoading && filteredCustom.length === 0 && !search.trim() && !showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 gap-4",
            "data-ocid": "templates-empty",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileCode2, { className: "h-7 w-7 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground", children: "No custom templates yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 max-w-xs", children: "Use a built-in template above, or create your own to speed up repetitive work." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  className: "gap-1.5 text-xs",
                  onClick: () => setShowForm(true),
                  "data-ocid": "create-first-template-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                    "Create Template"
                  ]
                }
              )
            ]
          }
        ),
        !isLoading && filteredCustom.length === 0 && search.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4 text-center", children: "No custom templates match your search." }),
        filteredCustom.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredCustom.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 hover:shadow-sm transition-smooth",
            "data-ocid": `template-card-${t.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground truncate", children: t.name }),
                  t.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground line-clamp-2 mt-0.5", children: t.description })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "icon",
                    className: "h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive",
                    onClick: () => deleteMutation.mutate(t.id),
                    "aria-label": "Delete template",
                    "data-ocid": `delete-template-${t.id}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-xs ${PRIORITY_COLOR[t.defaultPriority]}`,
                    children: t.defaultPriority
                  }
                ),
                t.checklistItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "h-3 w-3" }),
                  t.checklistItems.length,
                  " items"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  className: "w-full gap-1.5 text-xs h-8 mt-auto",
                  onClick: () => useTaskTemplateMutation.mutate(t),
                  disabled: useTaskTemplateMutation.isPending,
                  "data-ocid": `use-template-${t.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                    "Use Template"
                  ]
                }
              )
            ]
          },
          t.id
        )) })
      ] })
    ] })
  ] });
}
export {
  ProjectTemplatesPage as default
};
