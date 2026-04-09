import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckSquare,
  FileCode2,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import { TaskPriority, type TaskTemplate } from "../../types";

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  [TaskPriority.Low]: "bg-muted text-muted-foreground border-border",
  [TaskPriority.Medium]:
    "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400",
  [TaskPriority.High]:
    "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800 dark:text-red-400",
  [TaskPriority.Critical]:
    "bg-red-600/20 text-red-700 border-red-300 font-semibold",
};

interface BuiltInTaskTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultPriority: TaskPriority;
  checklistItems: string[];
}

const BUILT_IN_TASK_TEMPLATES: BuiltInTaskTemplate[] = [
  {
    id: "builtin-bug-report",
    name: "Bug Report",
    description:
      "Structured bug investigation with steps to reproduce, root cause analysis, and verification",
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
      "Monitor error tracking for 30 minutes post-deploy to confirm resolution",
    ],
  },
  {
    id: "builtin-feature-request",
    name: "Feature Request",
    description:
      "End-to-end flow from user story through design, build, tests, and deployment",
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
      "Deploy to production and notify the original requester",
    ],
  },
  {
    id: "builtin-code-review",
    name: "Code Review",
    description:
      "Thorough PR review checklist covering security, tests, logic, performance, and style",
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
      "Approve if all checks pass, or request changes with clear explanation",
    ],
  },
  {
    id: "builtin-documentation",
    name: "Documentation Task",
    description:
      "Research, draft, review, and publish documentation with examples and diagrams",
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
      "Announce the new documentation in the team Slack channel",
    ],
  },
  {
    id: "builtin-deployment",
    name: "Deployment Checklist",
    description:
      "Full release flow from tests to production deploy, monitoring, and announcement",
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
      "Send release announcement to team and relevant stakeholders",
    ],
  },
  {
    id: "builtin-design-review",
    name: "Design Review",
    description:
      "UI/UX review covering brand guidelines, accessibility, responsiveness, and user flows",
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
      "Export final assets at correct sizes and formats (2× for retina)",
    ],
  },
  {
    id: "builtin-support-ticket",
    name: "Support Ticket",
    description:
      "Customer support workflow from acknowledgment through resolution and knowledge base update",
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
      "Add solution to knowledge base if it could help other customers",
    ],
  },
  {
    id: "builtin-onboarding",
    name: "Employee Onboarding",
    description:
      "New hire setup from pre-boarding through 90-day performance review",
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
      "90-day performance check-in: set 6-month goals and development plan",
    ],
  },
  {
    id: "builtin-content-creation",
    name: "Content Creation",
    description:
      "Full content lifecycle from research through publish, SEO, and distribution",
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
      "Track performance after 7 days (views, engagement, conversions) and report findings",
    ],
  },
  {
    id: "builtin-security-review",
    name: "Security Review",
    description:
      "Security audit covering authentication, injection attacks, encryption, and access control",
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
      "Schedule follow-up review in 90 days",
    ],
  },
  {
    id: "builtin-performance",
    name: "Performance Investigation",
    description:
      "Define baseline, profile bottlenecks, optimize, and benchmark improvements",
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
      "Share results with team and add to performance monitoring dashboard",
    ],
  },
  {
    id: "builtin-sprint-planning",
    name: "Sprint Planning",
    description:
      "Sprint setup from backlog grooming through capacity confirmation and kickoff",
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
      "Schedule the sprint review and retrospective dates now",
    ],
  },
];

export default function ProjectTemplatesPage() {
  const params = useParams({ strict: false });
  const { projectId } = useParams({
    from: "/app/$workspaceId/projects/$projectId/templates",
  });
  const workspaceId = params.workspaceId as string;
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { tenantId, activeWorkspaceId } = useWorkspace();
  const effectiveWorkspaceId = workspaceId || activeWorkspaceId || "";
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
  const [checklistInput, setChecklistInput] = useState("");
  const [checklistItems, setChecklistItems] = useState<string[]>([]);

  const { data: templates = [], isLoading } = useQuery<TaskTemplate[]>({
    queryKey: ["taskTemplates", tenantId, effectiveWorkspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTaskTemplates(tenantId, effectiveWorkspaceId);
    },
    enabled: !!actor && !isFetching,
  });

  const projectTemplates = templates.filter(
    (t) => !t.projectId || t.projectId === projectId,
  );

  const filteredBuiltIn = useMemo(() => {
    if (!search.trim()) return BUILT_IN_TASK_TEMPLATES;
    const q = search.toLowerCase();
    return BUILT_IN_TASK_TEMPLATES.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    );
  }, [search]);

  const filteredCustom = useMemo(() => {
    if (!search.trim()) return projectTemplates;
    const q = search.toLowerCase();
    return projectTemplates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
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
        defaultPriority: priority,
      });
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taskTemplates", tenantId, effectiveWorkspaceId],
      });
      setShowForm(false);
      setName("");
      setDescription("");
      setChecklistItems([]);
      setChecklistInput("");
      toast.success("Template created");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const useTaskTemplateMutation = useMutation({
    mutationFn: async (template: TaskTemplate) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.createTask(tenantId, effectiveWorkspaceId, {
        title: template.name,
        description: template.description,
        projectId,
        priority: template.defaultPriority,
        crossLinks: [],
      });
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", tenantId, effectiveWorkspaceId, projectId],
      });
      toast.success("Task created from template");
      navigate({
        to: "/app/$workspaceId/projects/$projectId/tasks/$taskId",
        params: {
          workspaceId: effectiveWorkspaceId,
          projectId,
          taskId: task.id,
        },
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const useBuiltInTemplateMutation = useMutation({
    mutationFn: async (template: BuiltInTaskTemplate) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.createTask(tenantId, effectiveWorkspaceId, {
        title: template.name,
        description: template.description,
        projectId,
        priority: template.defaultPriority,
        crossLinks: [],
      });
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", tenantId, effectiveWorkspaceId, projectId],
      });
      toast.success("Task created from template");
      navigate({
        to: "/app/$workspaceId/projects/$projectId/tasks/$taskId",
        params: {
          workspaceId: effectiveWorkspaceId,
          projectId,
          taskId: task.id,
        },
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.deleteTaskTemplate(
        tenantId,
        effectiveWorkspaceId,
        id,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taskTemplates", tenantId, effectiveWorkspaceId],
      });
      toast.success("Template deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      {/* Header */}
      <div className="px-4 sm:px-6 md:px-8 pt-4 pb-4 border-b border-border/60 bg-card/80 sticky top-0 z-10 backdrop-blur-subtle">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              navigate({
                to: "/app/$workspaceId/projects/$projectId",
                params: { workspaceId: effectiveWorkspaceId, projectId },
              })
            }
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
            <Link
              to="/app/$workspaceId/projects"
              params={{ workspaceId: effectiveWorkspaceId }}
              className="hover:text-foreground transition-colors"
            >
              Projects
            </Link>
            <span>/</span>
            <Link
              to="/app/$workspaceId/projects/$projectId"
              params={{ workspaceId: effectiveWorkspaceId, projectId }}
              className="hover:text-foreground transition-colors"
            >
              Project
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Templates</span>
          </div>
          <div className="ml-auto">
            <Button
              size="sm"
              className="gap-1.5 h-8 text-xs active-press"
              onClick={() => setShowForm(true)}
              data-ocid="create-template-btn"
            >
              <Plus className="h-3.5 w-3.5" /> New Template
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search templates…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-ocid="template-search-input"
          />
        </div>

        {/* Create form */}
        {showForm && (
          <div
            className="rounded-2xl border border-primary/30 bg-card p-5 space-y-4"
            data-ocid="template-create-form"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-foreground">
                New Template
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setShowForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Template Name *</Label>
                <Input
                  placeholder="e.g. Bug Report"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="template-name-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Default Priority</Label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="h-8 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  data-ocid="template-priority-select"
                >
                  {Object.values(TaskPriority).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs">Description</Label>
                <Textarea
                  placeholder="Task description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-sm resize-none"
                  rows={2}
                  data-ocid="template-desc-input"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs">Checklist Items</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add checklist item…"
                    value={checklistInput}
                    onChange={(e) => setChecklistInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && checklistInput.trim()) {
                        setChecklistItems((prev) => [
                          ...prev,
                          checklistInput.trim(),
                        ]);
                        setChecklistInput("");
                      }
                    }}
                    className="h-8 text-sm"
                    data-ocid="template-checklist-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs shrink-0"
                    onClick={() => {
                      if (checklistInput.trim()) {
                        setChecklistItems((prev) => [
                          ...prev,
                          checklistInput.trim(),
                        ]);
                        setChecklistInput("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                {checklistItems.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {checklistItems.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <CheckSquare className="h-3.5 w-3.5 text-primary" />
                        <span className="flex-1">{item}</span>
                        <button
                          type="button"
                          aria-label="Remove"
                          onClick={() =>
                            setChecklistItems((prev) =>
                              prev.filter((i) => i !== item),
                            )
                          }
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                size="sm"
                className="gap-1.5 text-xs h-8"
                disabled={!name.trim() || createMutation.isPending}
                onClick={() => createMutation.mutate()}
                data-ocid="template-save-btn"
              >
                {createMutation.isPending && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                Create Template
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs h-8"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Built-in templates section */}
        <section>
          <h2 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Built-in Templates
            <Badge variant="secondary" className="text-xs font-normal">
              {filteredBuiltIn.length}
            </Badge>
          </h2>
          {filteredBuiltIn.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No built-in templates match your search.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBuiltIn.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 hover:shadow-sm transition-smooth"
                  data-ocid={`builtin-template-card-${t.id}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{t.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-bold text-foreground text-sm truncate">
                          {t.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          <Star className="h-2.5 w-2.5 mr-1" />
                          Built-in
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {t.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${PRIORITY_COLOR[t.defaultPriority]}`}
                    >
                      {t.defaultPriority}
                    </Badge>
                    {t.checklistItems.length > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckSquare className="h-3 w-3" />
                        {t.checklistItems.length} items
                      </span>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 text-xs h-8 mt-auto"
                    onClick={() => useBuiltInTemplateMutation.mutate(t)}
                    disabled={useBuiltInTemplateMutation.isPending}
                    data-ocid={`use-builtin-template-${t.id}`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Use Template
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Custom templates section */}
        <section>
          <h2 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            Your Templates
            <Badge variant="secondary" className="text-xs font-normal">
              {filteredCustom.length}
            </Badge>
          </h2>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-40 w-full rounded-2xl" />
              ))}
            </div>
          )}

          {!isLoading &&
            filteredCustom.length === 0 &&
            !search.trim() &&
            !showForm && (
              <div
                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 gap-4"
                data-ocid="templates-empty"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <FileCode2 className="h-7 w-7 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="font-display font-bold text-foreground">
                    No custom templates yet
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    Use a built-in template above, or create your own to speed
                    up repetitive work.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => setShowForm(true)}
                  data-ocid="create-first-template-btn"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create Template
                </Button>
              </div>
            )}

          {!isLoading && filteredCustom.length === 0 && search.trim() && (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No custom templates match your search.
            </p>
          )}

          {filteredCustom.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCustom.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 hover:shadow-sm transition-smooth"
                  data-ocid={`template-card-${t.id}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-foreground truncate">
                        {t.name}
                      </h3>
                      {t.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                          {t.description}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteMutation.mutate(t.id)}
                      aria-label="Delete template"
                      data-ocid={`delete-template-${t.id}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${PRIORITY_COLOR[t.defaultPriority]}`}
                    >
                      {t.defaultPriority}
                    </Badge>
                    {t.checklistItems.length > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckSquare className="h-3 w-3" />
                        {t.checklistItems.length} items
                      </span>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 text-xs h-8 mt-auto"
                    onClick={() => useTaskTemplateMutation.mutate(t)}
                    disabled={useTaskTemplateMutation.isPending}
                    data-ocid={`use-template-${t.id}`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Use Template
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
