import { m as useParams, d as useNavigate, f as useWorkspace, n as useQueryClient, r as reactExports, j as jsxRuntimeExports, B as Button, a as FolderKanban, i as Link, X, x as Target } from "./index-1XRv9GHr.js";
import { B as Badge } from "./badge-rX4oLW6l.js";
import { I as Input } from "./input-BOIU-9S_.js";
import { u as useMutation } from "./useMutation-X94w2CVk.js";
import { u as ue } from "./index-BOWFyaIB.js";
import { u as useBackend } from "./useBackend-DyFxq-Jw.js";
import { A as ArrowLeft } from "./arrow-left-B-gbON0E.js";
import { S as Search } from "./search-CWnD_rod.js";
import { L as LoaderCircle } from "./loader-circle-CtmMa9i8.js";
import { C as CircleCheck } from "./circle-check-DTEyto7g.js";
import { Z as Zap } from "./zap-DOWG4j1S.js";
import { B as BookOpen } from "./book-open-mivKUcaP.js";
import { M as Megaphone, R as Rocket } from "./rocket-COtm1UI5.js";
import { B as Briefcase } from "./briefcase-D0L-D-kw.js";
import { C as Calendar } from "./calendar-AxllVY2A.js";
import { U as Users } from "./users-BwTeKVE_.js";
import { C as ChevronRight } from "./chevron-right-DIrUI6zt.js";
const PROJECT_TEMPLATES = [
  {
    id: "agile-sprint",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5" }),
    name: "Agile Sprint",
    description: "Run a 2-week sprint with ceremonies, velocity tracking, and retrospectives. Pre-loaded with planning, development, QA, and release tasks.",
    category: "Engineering",
    categoryColor: "text-violet-500 bg-violet-500/10 border-violet-200 dark:border-violet-800",
    taskCount: 15,
    createWhiteboard: false,
    previewTasks: [
      "Sprint Planning",
      "User Story Development",
      "Frontend Development",
      "Backend Development",
      "Code Review"
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
      "Release to Production"
    ]
  },
  {
    id: "product-roadmap",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-5 w-5" }),
    name: "Product Roadmap",
    description: "Plan a full-year product roadmap across four quarters with discovery, design, development, and launch phases.",
    category: "Product",
    categoryColor: "text-blue-500 bg-blue-500/10 border-blue-200 dark:border-blue-800",
    taskCount: 12,
    createWhiteboard: true,
    previewTasks: [
      "Q1 Discovery & Research",
      "Q1 UX Design",
      "Q1 Development",
      "Q1 Stakeholder Review",
      "Q2 Feature A"
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
      "Roadmap Retrospective"
    ]
  },
  {
    id: "bug-tracker",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-5 w-5" }),
    name: "Bug Tracker",
    description: "Systematic bug investigation with triage, root cause analysis, automated tests, staging verification, and release notes.",
    category: "Engineering",
    categoryColor: "text-red-500 bg-red-500/10 border-red-200 dark:border-red-800",
    taskCount: 13,
    createWhiteboard: false,
    previewTasks: [
      "Bug Triage Session",
      "Critical: Auth Login Failure",
      "High: Data Export Broken",
      "Root Cause Analysis",
      "Regression Testing"
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
      "Release Notes & Documentation"
    ]
  },
  {
    id: "marketing-campaign",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-5 w-5" }),
    name: "Marketing Campaign",
    description: "Launch a targeted campaign from strategy through audience research, content, paid ads, email, influencers, and post-campaign analysis.",
    category: "Marketing",
    categoryColor: "text-orange-500 bg-orange-500/10 border-orange-200 dark:border-orange-800",
    taskCount: 14,
    createWhiteboard: false,
    previewTasks: [
      "Campaign Strategy",
      "Audience Research",
      "Messaging & Positioning",
      "Content Creation",
      "Landing Page"
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
      "Campaign Wrap-up Report"
    ]
  },
  {
    id: "design-sprint",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5" }),
    name: "Design Sprint",
    description: "5-day design sprint following Google Ventures methodology — problem mapping, sketching, prototyping, and user testing.",
    category: "Design",
    categoryColor: "text-pink-500 bg-pink-500/10 border-pink-200 dark:border-pink-800",
    taskCount: 12,
    createWhiteboard: true,
    previewTasks: [
      "Day 1: Map the Problem",
      "Day 1: Competitive Analysis",
      "Day 2: Sketch Solutions",
      "Day 4: Build Prototype",
      "Day 5: User Testing"
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
      "Next Steps Planning"
    ]
  },
  {
    id: "client-project",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-5 w-5" }),
    name: "Client Project",
    description: "End-to-end client delivery from kickoff through scope of work, milestones, revisions, QA, final delivery, and invoicing.",
    category: "Operations",
    categoryColor: "text-sky-500 bg-sky-500/10 border-sky-200 dark:border-sky-800",
    taskCount: 14,
    createWhiteboard: false,
    previewTasks: [
      "Client Kickoff Call",
      "Scope of Work Document",
      "Project Plan",
      "Delivery: Milestone 1",
      "Revision Round 1"
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
      "Case Study"
    ]
  },
  {
    id: "event-planning",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5" }),
    name: "Event Planning",
    description: "Plan a corporate event or conference from venue sourcing through catering, speakers, marketing, day-of logistics, and post-event report.",
    category: "Operations",
    categoryColor: "text-amber-500 bg-amber-500/10 border-amber-200 dark:border-amber-800",
    taskCount: 15,
    createWhiteboard: false,
    previewTasks: [
      "Event Brief & Goals",
      "Venue Sourcing",
      "Catering",
      "Speaker Coordination",
      "Audio/Visual Setup"
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
      "Post-Event Report"
    ]
  },
  {
    id: "onboarding",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }),
    name: "Onboarding",
    description: "Structured 90-day employee onboarding from IT setup and Day 1 orientation through 30/60/90-day check-ins and performance reviews.",
    category: "HR",
    categoryColor: "text-green-500 bg-green-500/10 border-green-200 dark:border-green-800",
    taskCount: 14,
    createWhiteboard: false,
    previewTasks: [
      "Pre-boarding: IT Setup",
      "Pre-boarding: Welcome Package",
      "Day 1: Orientation",
      "Week 1: Product Training",
      "30-Day Check-in"
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
      "Benefits & Payroll Enrollment"
    ]
  },
  {
    id: "content-calendar",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5" }),
    name: "Content Calendar",
    description: "Plan and publish a month of multi-channel content — strategy, blog posts, social media, email newsletter, video, SEO, and performance reporting.",
    category: "Marketing",
    categoryColor: "text-teal-500 bg-teal-500/10 border-teal-200 dark:border-teal-800",
    taskCount: 14,
    createWhiteboard: false,
    previewTasks: [
      "Monthly Content Strategy",
      "Editorial Calendar Setup",
      "Keyword Research",
      "Blog Post: Topic A",
      "Email Newsletter"
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
      "Monthly Performance Report"
    ]
  },
  {
    id: "sales-pipeline",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-5 w-5" }),
    name: "Sales Pipeline",
    description: "Build and run a complete B2B sales pipeline — ICP definition, prospecting, discovery calls, demos, proposals, negotiation, and CS handoff.",
    category: "Sales",
    categoryColor: "text-yellow-600 bg-yellow-500/10 border-yellow-200 dark:border-yellow-800",
    taskCount: 13,
    createWhiteboard: false,
    previewTasks: [
      "ICP Definition",
      "Target Account List",
      "Cold Outreach Sequences",
      "Discovery Calls",
      "Product Demos"
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
      "CS Handoff"
    ]
  },
  {
    id: "feature-launch",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "h-5 w-5" }),
    name: "Feature Launch",
    description: "End-to-end feature from discovery through spec, design, engineering, QA, beta testing, documentation, and public launch with monitoring.",
    category: "Product",
    categoryColor: "text-indigo-500 bg-indigo-500/10 border-indigo-200 dark:border-indigo-800",
    taskCount: 15,
    createWhiteboard: true,
    previewTasks: [
      "Discovery & Research",
      "Feature Specification",
      "UX Design",
      "Backend Engineering",
      "QA Testing"
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
      "Public Launch & Monitoring"
    ]
  },
  {
    id: "hiring-pipeline",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }),
    name: "Hiring Pipeline",
    description: "Full recruiting flow from job description through posting, screening, phone screens, panel interviews, offer letter, and onboarding prep.",
    category: "HR",
    categoryColor: "text-emerald-500 bg-emerald-500/10 border-emerald-200 dark:border-emerald-800",
    taskCount: 15,
    createWhiteboard: false,
    previewTasks: [
      "Role Definition",
      "Job Description",
      "Job Posting",
      "Resume Screening",
      "Panel Interviews"
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
      "Onboarding Prep"
    ]
  }
];
const CATEGORIES = [
  "All",
  "Engineering",
  "Product",
  "Marketing",
  "Design",
  "Operations",
  "Sales",
  "HR"
];
function ProjectTemplatesPage() {
  const { workspaceId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [activeCategory, setActiveCategory] = reactExports.useState("All");
  const [selectedTemplate, setSelectedTemplate] = reactExports.useState(null);
  const [projectName, setProjectName] = reactExports.useState("");
  const [creatingId, setCreatingId] = reactExports.useState(null);
  const filtered = PROJECT_TEMPLATES.filter((t) => {
    const matchCategory = activeCategory === "All" || t.category === activeCategory;
    const matchSearch = !search.trim() || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });
  const createMutation = useMutation({
    mutationFn: async ({
      template,
      name
    }) => {
      if (!actor) throw new Error("Not connected");
      setCreatingId(template.id);
      const result = await actor.createProjectFromTemplate(
        tenantId,
        workspaceId,
        template.id,
        name.trim() || template.name,
        template.description
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (projectId) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", tenantId, workspaceId]
      });
      ue.success("Project created with all tasks and milestones!");
      setCreatingId(null);
      setSelectedTemplate(null);
      navigate({
        to: "/app/$workspaceId/projects/$projectId",
        params: { workspaceId, projectId }
      });
    },
    onError: (err) => {
      setCreatingId(null);
      ue.error(err.message || "Failed to create project from template");
    }
  });
  function handleUseTemplate(template) {
    setSelectedTemplate(template);
    setProjectName(template.name);
  }
  function handleConfirmCreate() {
    if (!selectedTemplate) return;
    createMutation.mutate({ template: selectedTemplate, name: projectName });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full min-h-0 overflow-y-auto pb-20 md:pb-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 sm:px-6 md:px-8 pt-4 pb-4 border-b border-border/60 bg-card/80 sticky top-0 z-10 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-9 w-9 min-h-[44px] min-w-[44px] shrink-0",
          onClick: () => navigate({
            to: "/app/$workspaceId/projects",
            params: { workspaceId }
          }),
          "aria-label": "Back to Projects",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-3.5 w-3.5 text-orange-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-base sm:text-lg font-bold text-foreground tracking-tight", children: "Project Templates" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground hidden sm:block", children: [
            PROJECT_TEMPLATES.length,
            " templates — each pre-loaded with real tasks, milestones, and priorities"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          variant: "outline",
          asChild: true,
          className: "gap-1.5 h-9 text-xs min-h-[44px]",
          "data-ocid": "new-blank-project-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/app/$workspaceId/projects/new",
              params: { workspaceId },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Blank Project" })
              ]
            }
          )
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 sm:px-6 md:px-8 py-5 max-w-6xl mx-auto w-full space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search templates…",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "pl-9 h-9",
              "data-ocid": "template-search"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5", children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setActiveCategory(cat),
            className: `shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors min-h-[36px] whitespace-nowrap ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"}`,
            "data-ocid": `cat-filter-${cat}`,
            children: cat
          },
          cat
        )) })
      ] }),
      selectedTemplate && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-2xl border border-primary/30 bg-card p-5 space-y-4 shadow-lg",
          "data-ocid": "template-confirm-panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary", children: selectedTemplate.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-sm font-bold text-foreground", children: [
                    'Use "',
                    selectedTemplate.name,
                    '" Template'
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                    "Creates a new project with ",
                    selectedTemplate.taskCount,
                    " ",
                    "pre-built tasks",
                    selectedTemplate.createWhiteboard ? " + 1 planning whiteboard" : ""
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": "Close",
                  onClick: () => setSelectedTemplate(null),
                  className: "h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  className: "text-xs font-medium text-muted-foreground",
                  htmlFor: "confirm-project-name",
                  children: "Project Name"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "confirm-project-name",
                  value: projectName,
                  onChange: (e) => setProjectName(e.target.value),
                  placeholder: selectedTemplate.name,
                  className: "h-9 text-sm",
                  "data-ocid": "confirm-project-name-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  onClick: handleConfirmCreate,
                  disabled: createMutation.isPending || isFetching,
                  className: "gap-1.5 text-xs min-h-[44px]",
                  "data-ocid": "confirm-create-btn",
                  children: createMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
                    "Creating project…"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
                    "Create Project"
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  onClick: () => setSelectedTemplate(null),
                  className: "text-xs min-h-[44px]",
                  children: "Cancel"
                }
              )
            ] })
          ]
        }
      ),
      filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 gap-4",
          "data-ocid": "templates-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-10 w-10 text-muted-foreground/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No templates match your search." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                onClick: () => {
                  setSearch("");
                  setActiveCategory("All");
                },
                children: "Clear filters"
              }
            )
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: filtered.map((template) => {
        const isCreating = creatingId === template.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          TemplateCard,
          {
            template,
            isCreating,
            isSelected: (selectedTemplate == null ? void 0 : selectedTemplate.id) === template.id,
            onSelect: () => handleUseTemplate(template)
          },
          template.id
        );
      }) })
    ] })
  ] });
}
function TemplateCard({
  template,
  isCreating,
  isSelected,
  onSelect
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex flex-col rounded-2xl border bg-card overflow-hidden transition-all duration-150 hover:shadow-md ${isSelected ? "border-primary ring-1 ring-primary/20" : "border-border/50 hover:border-primary/30"}`,
      "data-ocid": `template-card-${template.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 pb-3 flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-foreground", children: template.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground text-sm", children: template.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `text-[10px] px-1.5 py-0 h-4 font-medium shrink-0 ${template.categoryColor}`,
                  children: template.category
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed", children: template.description })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-3 flex items-center gap-3 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-primary/50" }),
            template.taskCount,
            " tasks"
          ] }),
          template.createWhiteboard && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-secondary/60" }),
            "1 whiteboard"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-3 space-y-1.5", children: [
          (expanded ? template.fullTaskList : template.previewTasks).map(
            (task) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 text-xs text-muted-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-1 rounded-full bg-muted-foreground/40 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: task })
                ]
              },
              task
            )
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setExpanded((v) => !v),
              className: "flex items-center gap-1 text-[11px] text-primary hover:underline mt-1",
              "data-ocid": `toggle-tasks-${template.id}`,
              children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Show fewer tasks" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" }),
                "+",
                template.fullTaskList.length - template.previewTasks.length,
                " more tasks"
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto px-4 pb-4 pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            className: "w-full gap-1.5 text-xs h-9 min-h-[44px]",
            onClick: onSelect,
            disabled: isCreating,
            "data-ocid": `use-template-btn-${template.id}`,
            children: isCreating ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
              "Creating…"
            ] }) : isSelected ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
              "Selected"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-3.5 w-3.5" }),
              "Use Template"
            ] })
          }
        ) })
      ]
    }
  );
}
export {
  ProjectTemplatesPage as default
};
