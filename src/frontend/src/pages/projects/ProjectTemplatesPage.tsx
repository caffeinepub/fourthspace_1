import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FolderKanban,
  Loader2,
  Megaphone,
  Rocket,
  Search,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";

// ─── Template Data ────────────────────────────────────────────────────────────

interface ProjectTemplateCard {
  id: string;
  icon: React.ReactNode;
  name: string;
  description: string;
  category: string;
  categoryColor: string;
  taskCount: number;
  createWhiteboard?: boolean;
  previewTasks: string[];
  fullTaskList: string[];
}

const PROJECT_TEMPLATES: ProjectTemplateCard[] = [
  {
    id: "agile-sprint",
    icon: <Zap className="h-5 w-5" />,
    name: "Agile Sprint",
    description:
      "Run a 2-week sprint with ceremonies, velocity tracking, and retrospectives. Pre-loaded with planning, development, QA, and release tasks.",
    category: "Engineering",
    categoryColor:
      "text-violet-500 bg-violet-500/10 border-violet-200 dark:border-violet-800",
    taskCount: 15,
    createWhiteboard: false,
    previewTasks: [
      "Sprint Planning",
      "User Story Development",
      "Frontend Development",
      "Backend Development",
      "Code Review",
    ],
    fullTaskList: [
      "Sprint Planning",
      "User Story Development",
      "Frontend Development",
      "Backend Development",
      "Code Review",
      "QA Testing",
      "Bug Fixes",
      "Daily Standups",
      "Sprint Demo",
      "Sprint Retrospective",
      "Backlog Refinement",
      "Performance Monitoring",
      "Dependency Management",
      "Documentation Update",
      "Release to Production",
    ],
  },
  {
    id: "product-roadmap",
    icon: <Target className="h-5 w-5" />,
    name: "Product Roadmap",
    description:
      "Plan a full-year product roadmap across four quarters with discovery, design, development, and launch phases.",
    category: "Product",
    categoryColor:
      "text-blue-500 bg-blue-500/10 border-blue-200 dark:border-blue-800",
    taskCount: 12,
    createWhiteboard: true,
    previewTasks: [
      "Q1 Discovery & Research",
      "Q1 UX Design",
      "Q1 Development",
      "Q1 Stakeholder Review",
      "Q2 Feature A",
    ],
    fullTaskList: [
      "Q1 Discovery & Research",
      "Q1 UX Design",
      "Q1 Development",
      "Q1 Stakeholder Review",
      "Q2 Feature A",
      "Q2 Feature B",
      "Q3 Scale & Performance",
      "Q3 Feature C",
      "Q4 Beta Program",
      "Q4 Launch Prep",
      "Q4 Public Launch",
      "Roadmap Retrospective",
    ],
  },
  {
    id: "bug-tracker",
    icon: <BookOpen className="h-5 w-5" />,
    name: "Bug Tracker",
    description:
      "Systematic bug investigation with triage, root cause analysis, automated tests, staging verification, and release notes.",
    category: "Engineering",
    categoryColor:
      "text-red-500 bg-red-500/10 border-red-200 dark:border-red-800",
    taskCount: 13,
    createWhiteboard: false,
    previewTasks: [
      "Bug Triage Session",
      "Critical: Auth Login Failure",
      "High: Data Export Broken",
      "Root Cause Analysis",
      "Regression Testing",
    ],
    fullTaskList: [
      "Bug Triage Session",
      "Critical: Auth Login Failure",
      "High: Data Export Broken",
      "High: Performance Regression",
      "Medium: Dashboard Slow Load",
      "Medium: Email Notification Delay",
      "Low: UI Alignment Issue",
      "Low: Tooltip Positioning",
      "Root Cause Analysis",
      "Automated Test Coverage",
      "Regression Testing",
      "Staging Verification",
      "Release Notes & Documentation",
    ],
  },
  {
    id: "marketing-campaign",
    icon: <Megaphone className="h-5 w-5" />,
    name: "Marketing Campaign",
    description:
      "Launch a targeted campaign from strategy through audience research, content, paid ads, email, influencers, and post-campaign analysis.",
    category: "Marketing",
    categoryColor:
      "text-orange-500 bg-orange-500/10 border-orange-200 dark:border-orange-800",
    taskCount: 14,
    createWhiteboard: false,
    previewTasks: [
      "Campaign Strategy",
      "Audience Research",
      "Messaging & Positioning",
      "Content Creation",
      "Landing Page",
    ],
    fullTaskList: [
      "Campaign Strategy",
      "Audience Research",
      "Messaging & Positioning",
      "Content Creation",
      "Landing Page",
      "Social Media Scheduling",
      "Email Campaign",
      "Influencer Outreach",
      "Paid Ads Setup",
      "PR & Outreach",
      "Campaign Launch",
      "Mid-Campaign Analytics Review",
      "Customer Follow-up Sequence",
      "Campaign Wrap-up Report",
    ],
  },
  {
    id: "design-sprint",
    icon: <Zap className="h-5 w-5" />,
    name: "Design Sprint",
    description:
      "5-day design sprint following Google Ventures methodology — problem mapping, sketching, prototyping, and user testing.",
    category: "Design",
    categoryColor:
      "text-pink-500 bg-pink-500/10 border-pink-200 dark:border-pink-800",
    taskCount: 12,
    createWhiteboard: true,
    previewTasks: [
      "Day 1: Map the Problem",
      "Day 1: Competitive Analysis",
      "Day 2: Sketch Solutions",
      "Day 4: Build Prototype",
      "Day 5: User Testing",
    ],
    fullTaskList: [
      "Day 1: Map the Problem",
      "Day 1: Competitive Analysis",
      "Day 2: Sketch Solutions",
      "Day 2: Decide on Direction",
      "Day 3: Storyboard",
      "Day 4: Build Prototype",
      "Day 4: Prepare Interview Script",
      "Day 5: User Testing",
      "Day 5: Synthesize Findings",
      "Sprint Retrospective",
      "Sprint Report",
      "Next Steps Planning",
    ],
  },
  {
    id: "client-project",
    icon: <Briefcase className="h-5 w-5" />,
    name: "Client Project",
    description:
      "End-to-end client delivery from kickoff through scope of work, milestones, revisions, QA, final delivery, and invoicing.",
    category: "Operations",
    categoryColor:
      "text-sky-500 bg-sky-500/10 border-sky-200 dark:border-sky-800",
    taskCount: 14,
    createWhiteboard: false,
    previewTasks: [
      "Client Kickoff Call",
      "Scope of Work Document",
      "Project Plan",
      "Delivery: Milestone 1",
      "Revision Round 1",
    ],
    fullTaskList: [
      "Client Kickoff Call",
      "Scope of Work Document",
      "Project Plan",
      "Weekly Status Reports",
      "Delivery: Milestone 1",
      "Revision Round 1",
      "Delivery: Milestone 2",
      "Revision Round 2",
      "Quality Assurance",
      "Final Delivery",
      "Client Sign-off",
      "Post-Project Survey",
      "Final Invoice",
      "Case Study",
    ],
  },
  {
    id: "event-planning",
    icon: <Calendar className="h-5 w-5" />,
    name: "Event Planning",
    description:
      "Plan a corporate event or conference from venue sourcing through catering, speakers, marketing, day-of logistics, and post-event report.",
    category: "Operations",
    categoryColor:
      "text-amber-500 bg-amber-500/10 border-amber-200 dark:border-amber-800",
    taskCount: 15,
    createWhiteboard: false,
    previewTasks: [
      "Event Brief & Goals",
      "Venue Sourcing",
      "Catering",
      "Speaker Coordination",
      "Audio/Visual Setup",
    ],
    fullTaskList: [
      "Event Brief & Goals",
      "Venue Sourcing",
      "Catering",
      "Speaker Coordination",
      "Audio/Visual Setup",
      "Marketing & Invitations",
      "Registration Setup",
      "Agenda & Run of Show",
      "Staff & Volunteer Briefing",
      "Branded Materials",
      "Day-of Logistics",
      "Photography & Recording",
      "Post-Event Thank-you",
      "Content Distribution",
      "Post-Event Report",
    ],
  },
  {
    id: "onboarding",
    icon: <Users className="h-5 w-5" />,
    name: "Onboarding",
    description:
      "Structured 90-day employee onboarding from IT setup and Day 1 orientation through 30/60/90-day check-ins and performance reviews.",
    category: "HR",
    categoryColor:
      "text-green-500 bg-green-500/10 border-green-200 dark:border-green-800",
    taskCount: 14,
    createWhiteboard: false,
    previewTasks: [
      "Pre-boarding: IT Setup",
      "Pre-boarding: Welcome Package",
      "Day 1: Orientation",
      "Week 1: Product Training",
      "30-Day Check-in",
    ],
    fullTaskList: [
      "Pre-boarding: IT Setup",
      "Pre-boarding: Welcome Package",
      "Day 1: Orientation",
      "Day 1: Role Overview",
      "Week 1: Product & Domain Training",
      "Week 1: Team Process Training",
      "Week 2: First Project Assignment",
      "Week 2: Key Stakeholder Meetings",
      "30-Day Check-in",
      "60-Day Feedback Session",
      "60-Day Project Review",
      "90-Day Formal Review",
      "Onboarding Survey",
      "Benefits & Payroll Enrollment",
    ],
  },
  {
    id: "content-calendar",
    icon: <Calendar className="h-5 w-5" />,
    name: "Content Calendar",
    description:
      "Plan and publish a month of multi-channel content — strategy, blog posts, social media, email newsletter, video, SEO, and performance reporting.",
    category: "Marketing",
    categoryColor:
      "text-teal-500 bg-teal-500/10 border-teal-200 dark:border-teal-800",
    taskCount: 14,
    createWhiteboard: false,
    previewTasks: [
      "Monthly Content Strategy",
      "Editorial Calendar Setup",
      "Keyword Research",
      "Blog Post: Topic A",
      "Email Newsletter",
    ],
    fullTaskList: [
      "Monthly Content Strategy",
      "Editorial Calendar Setup",
      "Keyword Research",
      "Blog Post: Topic A",
      "Blog Post: Topic B",
      "Long-form Content Piece",
      "Social Media Week 1 & 2",
      "Social Media Week 3 & 4",
      "Email Newsletter",
      "Video Content",
      "Guest Post Outreach",
      "Content Repurposing",
      "SEO Audit",
      "Monthly Performance Report",
    ],
  },
  {
    id: "sales-pipeline",
    icon: <Target className="h-5 w-5" />,
    name: "Sales Pipeline",
    description:
      "Build and run a complete B2B sales pipeline — ICP definition, prospecting, discovery calls, demos, proposals, negotiation, and CS handoff.",
    category: "Sales",
    categoryColor:
      "text-yellow-600 bg-yellow-500/10 border-yellow-200 dark:border-yellow-800",
    taskCount: 13,
    createWhiteboard: false,
    previewTasks: [
      "ICP Definition",
      "Target Account List",
      "Cold Outreach Sequences",
      "Discovery Calls",
      "Product Demos",
    ],
    fullTaskList: [
      "ICP Definition",
      "Target Account List",
      "Cold Outreach Sequences",
      "Discovery Calls",
      "Opportunity Qualification",
      "Product Demos",
      "Champion Development",
      "Business Case",
      "Proposals",
      "Negotiation",
      "Contract Sign",
      "Revenue Recognition",
      "CS Handoff",
    ],
  },
  {
    id: "feature-launch",
    icon: <Rocket className="h-5 w-5" />,
    name: "Feature Launch",
    description:
      "End-to-end feature from discovery through spec, design, engineering, QA, beta testing, documentation, and public launch with monitoring.",
    category: "Product",
    categoryColor:
      "text-indigo-500 bg-indigo-500/10 border-indigo-200 dark:border-indigo-800",
    taskCount: 15,
    createWhiteboard: true,
    previewTasks: [
      "Discovery & Research",
      "Feature Specification",
      "UX Design",
      "Backend Engineering",
      "QA Testing",
    ],
    fullTaskList: [
      "Discovery & Research",
      "Feature Specification",
      "UX Design",
      "Technical Design",
      "Backend Engineering",
      "Frontend Engineering",
      "Integration Testing",
      "QA Testing",
      "Bug Fixes",
      "Beta Program",
      "Feature Flag Rollout",
      "Help Documentation",
      "Internal Training",
      "Launch Marketing",
      "Public Launch & Monitoring",
    ],
  },
  {
    id: "hiring-pipeline",
    icon: <Users className="h-5 w-5" />,
    name: "Hiring Pipeline",
    description:
      "Full recruiting flow from job description through posting, screening, phone screens, panel interviews, offer letter, and onboarding prep.",
    category: "HR",
    categoryColor:
      "text-emerald-500 bg-emerald-500/10 border-emerald-200 dark:border-emerald-800",
    taskCount: 15,
    createWhiteboard: false,
    previewTasks: [
      "Role Definition",
      "Job Description",
      "Job Posting",
      "Resume Screening",
      "Panel Interviews",
    ],
    fullTaskList: [
      "Role Definition",
      "Job Description",
      "Job Posting",
      "Sourcing Campaign",
      "Application Tracking Setup",
      "Resume Screening",
      "Phone Screens",
      "Technical Assessment",
      "Interview Coordination",
      "Panel Interviews",
      "Interview Debrief",
      "Reference Checks",
      "Offer Letter",
      "Background Check",
      "Onboarding Prep",
    ],
  },
];

const CATEGORIES = [
  "All",
  "Engineering",
  "Product",
  "Marketing",
  "Design",
  "Operations",
  "Sales",
  "HR",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProjectTemplatesPage() {
  const { workspaceId } = useParams({ strict: false }) as {
    workspaceId: string;
  };
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTemplate, setSelectedTemplate] =
    useState<ProjectTemplateCard | null>(null);
  const [projectName, setProjectName] = useState("");
  const [creatingId, setCreatingId] = useState<string | null>(null);

  const filtered = PROJECT_TEMPLATES.filter((t) => {
    const matchCategory =
      activeCategory === "All" || t.category === activeCategory;
    const matchSearch =
      !search.trim() ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const createMutation = useMutation({
    mutationFn: async ({
      template,
      name,
    }: { template: ProjectTemplateCard; name: string }) => {
      if (!actor) throw new Error("Not connected");
      setCreatingId(template.id);
      const result = await actor.createProjectFromTemplate(
        tenantId,
        workspaceId,
        template.id,
        name.trim() || template.name,
        template.description,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (projectId) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", tenantId, workspaceId],
      });
      toast.success("Project created with all tasks and milestones!");
      setCreatingId(null);
      setSelectedTemplate(null);
      navigate({
        to: "/app/$workspaceId/projects/$projectId",
        params: { workspaceId, projectId },
      });
    },
    onError: (err: Error) => {
      setCreatingId(null);
      toast.error(err.message || "Failed to create project from template");
    },
  });

  function handleUseTemplate(template: ProjectTemplateCard) {
    setSelectedTemplate(template);
    setProjectName(template.name);
  }

  function handleConfirmCreate() {
    if (!selectedTemplate) return;
    createMutation.mutate({ template: selectedTemplate, name: projectName });
  }

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto pb-20 md:pb-0">
      {/* Header */}
      <div className="px-4 sm:px-6 md:px-8 pt-4 pb-4 border-b border-border/60 bg-card/80 sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-3 max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 min-h-[44px] min-w-[44px] shrink-0"
            onClick={() =>
              navigate({
                to: "/app/$workspaceId/projects",
                params: { workspaceId },
              })
            }
            aria-label="Back to Projects"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 shrink-0">
              <FolderKanban className="h-3.5 w-3.5 text-orange-500" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-base sm:text-lg font-bold text-foreground tracking-tight">
                Project Templates
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {PROJECT_TEMPLATES.length} templates — each pre-loaded with real
                tasks, milestones, and priorities
              </p>
            </div>
          </div>
          <div className="ml-auto shrink-0">
            <Button
              size="sm"
              variant="outline"
              asChild
              className="gap-1.5 h-9 text-xs min-h-[44px]"
              data-ocid="new-blank-project-btn"
            >
              <Link
                to="/app/$workspaceId/projects/new"
                params={{ workspaceId }}
              >
                <FolderKanban className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Blank Project</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 py-5 max-w-6xl mx-auto w-full space-y-5">
        {/* Search + category filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search templates…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
              data-ocid="template-search"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors min-h-[36px] whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                data-ocid={`cat-filter-${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Confirm dialog */}
        {selectedTemplate && (
          <div
            className="rounded-2xl border border-primary/30 bg-card p-5 space-y-4 shadow-lg"
            data-ocid="template-confirm-panel"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {selectedTemplate.icon}
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">
                    Use "{selectedTemplate.name}" Template
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Creates a new project with {selectedTemplate.taskCount}{" "}
                    pre-built tasks
                    {selectedTemplate.createWhiteboard
                      ? " + 1 planning whiteboard"
                      : ""}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setSelectedTemplate(null)}
                className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1.5">
              <label
                className="text-xs font-medium text-muted-foreground"
                htmlFor="confirm-project-name"
              >
                Project Name
              </label>
              <Input
                id="confirm-project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder={selectedTemplate.name}
                className="h-9 text-sm"
                data-ocid="confirm-project-name-input"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleConfirmCreate}
                disabled={createMutation.isPending || isFetching}
                className="gap-1.5 text-xs min-h-[44px]"
                data-ocid="confirm-create-btn"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Creating project…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Create Project
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedTemplate(null)}
                className="text-xs min-h-[44px]"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Template grid */}
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 gap-4"
            data-ocid="templates-empty"
          >
            <FolderKanban className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              No templates match your search.
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((template) => {
              const isCreating = creatingId === template.id;
              return (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isCreating={isCreating}
                  isSelected={selectedTemplate?.id === template.id}
                  onSelect={() => handleUseTemplate(template)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Template Card ────────────────────────────────────────────────────────────

function TemplateCard({
  template,
  isCreating,
  isSelected,
  onSelect,
}: {
  template: ProjectTemplateCard;
  isCreating: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`flex flex-col rounded-2xl border bg-card overflow-hidden transition-all duration-150 hover:shadow-md ${
        isSelected
          ? "border-primary ring-1 ring-primary/20"
          : "border-border/50 hover:border-primary/30"
      }`}
      data-ocid={`template-card-${template.id}`}
    >
      {/* Header */}
      <div className="p-4 pb-3 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-foreground">
          {template.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-bold text-foreground text-sm">
              {template.name}
            </h3>
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 h-4 font-medium shrink-0 ${template.categoryColor}`}
            >
              {template.category}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {template.description}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-4 pb-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
          {template.taskCount} tasks
        </span>
        {template.createWhiteboard && (
          <span className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-secondary/60" />1
            whiteboard
          </span>
        )}
      </div>

      {/* Preview tasks */}
      <div className="px-4 pb-3 space-y-1.5">
        {(expanded ? template.fullTaskList : template.previewTasks).map(
          (task) => (
            <div
              key={task}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <div className="h-1 w-1 rounded-full bg-muted-foreground/40 shrink-0" />
              <span className="truncate">{task}</span>
            </div>
          ),
        )}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-[11px] text-primary hover:underline mt-1"
          data-ocid={`toggle-tasks-${template.id}`}
        >
          {expanded ? (
            <>Show fewer tasks</>
          ) : (
            <>
              <ChevronRight className="h-3 w-3" />+
              {template.fullTaskList.length - template.previewTasks.length} more
              tasks
            </>
          )}
        </button>
      </div>

      {/* Action */}
      <div className="mt-auto px-4 pb-4 pt-1">
        <Button
          size="sm"
          className="w-full gap-1.5 text-xs h-9 min-h-[44px]"
          onClick={onSelect}
          disabled={isCreating}
          data-ocid={`use-template-btn-${template.id}`}
        >
          {isCreating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Creating…
            </>
          ) : isSelected ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Selected
            </>
          ) : (
            <>
              <FolderKanban className="h-3.5 w-3.5" />
              Use Template
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
