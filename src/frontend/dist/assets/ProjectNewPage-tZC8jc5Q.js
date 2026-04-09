import { t as createLucideIcon, m as useParams, d as useNavigate, f as useWorkspace, n as useQueryClient, r as reactExports, j as jsxRuntimeExports, B as Button, i as Link, a as FolderKanban, x as cn, am as Target, as as TaskPriority } from "./index-CQ7TXF2a.js";
import { B as Badge } from "./badge-DOwzzuc_.js";
import { I as Input } from "./input-Dkit6sfw.js";
import { L as Label } from "./label-ANHtprqJ.js";
import { T as Textarea } from "./textarea-CkHQfDFp.js";
import { u as useMutation } from "./useMutation-fGi-GboX.js";
import { u as ue } from "./index-BGFcG_k-.js";
import { u as useBackend } from "./index--h8TKSCt.js";
import { A as ArrowLeft } from "./arrow-left-D6cz-lXM.js";
import { C as CircleCheck } from "./circle-check-B7zTmrRV.js";
import { A as ArrowRight } from "./arrow-right-BQVQG0b_.js";
import { L as LoaderCircle } from "./loader-circle-CcnovRzn.js";
import { S as Save } from "./save-DJl3ZDfM.js";
import { Z as Zap } from "./zap-Bi3i3wDK.js";
import { B as BookOpen } from "./book-open-DAGYjOgX.js";
import { B as Briefcase } from "./briefcase-CKGJVLR9.js";
import { C as Calendar } from "./calendar-BUBDkMEv.js";
import { U as Users } from "./users-Dh_2Am6J.js";
import { S as SquareCheckBig } from "./square-check-big-C0ziXCTP.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m3 11 18-5v12L3 14v-3z", key: "n962bs" }],
  ["path", { d: "M11.6 16.8a3 3 0 1 1-5.8-1.6", key: "1yl0tm" }]
];
const Megaphone = createLucideIcon("megaphone", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
      key: "m3kijz"
    }
  ],
  [
    "path",
    {
      d: "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
      key: "1fmvmk"
    }
  ],
  ["path", { d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0", key: "1f8sc4" }],
  ["path", { d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5", key: "qeys4" }]
];
const Rocket = createLucideIcon("rocket", __iconNode);
function toPriority(p) {
  if (p === "P0") return TaskPriority.Critical;
  if (p === "P1") return TaskPriority.High;
  if (p === "P2") return TaskPriority.Medium;
  return TaskPriority.Low;
}
const PROJECT_TEMPLATES = [
  // ── 1. AGILE SPRINT ────────────────────────────────────────────────────────
  {
    id: "agile-sprint",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5" }),
    name: "Agile Sprint",
    description: "Run a 2-week sprint with ceremonies and velocity tracking",
    category: "Engineering",
    color: "text-violet-500",
    taskCount: 15,
    previewTasks: [
      "Sprint Planning",
      "Frontend Development",
      "QA Testing",
      "Sprint Retrospective",
      "Release to Production"
    ],
    projectDescription: "A structured 2-week sprint template with all standard agile ceremonies pre-configured. Includes sprint planning, daily standups, sprint review, retrospective, and velocity tracking to keep the team aligned and shipping consistently.",
    createWhiteboard: false,
    tasks: [
      {
        title: "Sprint Planning",
        description: "Timebox to 2 hours. Define the sprint goal, pull stories from the backlog, assign story points, and populate the sprint board before the session ends.",
        priority: "P0",
        subtasks: [
          "Define sprint goal",
          "Review backlog",
          "Assign story points",
          "Create sprint board"
        ]
      },
      {
        title: "User Story Development",
        description: "Break each story into clearly scoped sub-tasks with explicit acceptance criteria. Ensure every story can be completed independently within the sprint.",
        priority: "P0",
        subtasks: [
          "Write acceptance criteria",
          "Break into subtasks",
          "Estimate complexity"
        ]
      },
      {
        title: "Frontend Development",
        description: "Implement UI components per sprint stories, wire up API calls, add error handling. Keep PRs small and focused — one story per PR where possible.",
        priority: "P1",
        subtasks: [
          "Implement UI components",
          "Wire up API calls",
          "Add error handling",
          "Write unit tests"
        ]
      },
      {
        title: "Backend Development",
        description: "Build the API endpoints required by sprint stories. Include data validation, write service-level tests, and deploy to staging for QA.",
        priority: "P1",
        subtasks: [
          "Build API endpoints",
          "Add data validation",
          "Write tests",
          "Deploy to staging"
        ]
      },
      {
        title: "Code Review",
        description: "All PRs require at least one approval. Aim to review open PRs within 4 working hours. Address all review comments before merging.",
        priority: "P1",
        subtasks: ["Review PRs", "Address feedback", "Merge approved PRs"]
      },
      {
        title: "QA Testing",
        description: "Test every story against its acceptance criteria on staging. Log any defects with steps to reproduce and mark done only after verification.",
        priority: "P1",
        subtasks: [
          "Write test cases",
          "Execute tests",
          "Log bugs",
          "Retest fixes"
        ]
      },
      {
        title: "Bug Fixes",
        description: "Triage all bugs found during QA. Fix critical and high-severity issues within the sprint. Defer low-priority issues to backlog with documented justification.",
        priority: "P1",
        subtasks: ["Triage bugs", "Fix critical issues", "Regression test"]
      },
      {
        title: "Daily Standups",
        description: "Run a 15-minute standup every day at the same time. Each member covers what they did yesterday, what they plan today, and any blockers.",
        priority: "P1",
        subtasks: ["Yesterday's progress", "Today's plan", "Blockers"]
      },
      {
        title: "Sprint Demo",
        description: "Prepare a 20-minute demo of all completed stories. Stakeholders should see working software. Record the demo as a fallback.",
        priority: "P0",
        subtasks: ["Prepare demo", "Present to stakeholders", "Record outcome"]
      },
      {
        title: "Sprint Retrospective",
        description: "Use Start/Stop/Continue format. Timebox to 60 minutes. Capture at least 2 actionable improvements with owners.",
        priority: "P1",
        subtasks: ["What went well", "What to improve", "Action items"]
      },
      {
        title: "Backlog Refinement",
        description: "Review and groom the backlog for the next sprint. Re-prioritize stories, break down large epics, and ensure top items are well-defined.",
        priority: "P2",
        subtasks: [
          "Prioritize backlog",
          "Break down epics",
          "Estimate new items"
        ]
      },
      {
        title: "Performance Monitoring",
        description: "Monitor application performance metrics during the sprint. Identify any regressions and create tracking tasks for any degradation.",
        priority: "P2",
        subtasks: [
          "Check error rates",
          "Monitor load times",
          "Review dashboards"
        ]
      },
      {
        title: "Dependency Management",
        description: "Identify any cross-team dependencies blocking sprint stories. Escalate blockers to engineering management with a clear resolution path.",
        priority: "P1",
        subtasks: [
          "Map dependencies",
          "Resolve blockers",
          "Communicate status"
        ]
      },
      {
        title: "Documentation Update",
        description: "Update API documentation, internal wikis, and developer runbooks to reflect all changes shipped in this sprint.",
        priority: "P2",
        subtasks: ["Update API docs", "Update wiki", "Update runbooks"]
      },
      {
        title: "Release to Production",
        description: "Deploy all sprint-completed stories to production using the agreed release runbook. Monitor error logs and key metrics for 2 hours post-deploy.",
        priority: "P0",
        subtasks: [
          "Deploy to production",
          "Monitor logs",
          "Notify stakeholders"
        ]
      }
    ]
  },
  // ── 2. PRODUCT ROADMAP ─────────────────────────────────────────────────────
  {
    id: "product-roadmap",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-5 w-5" }),
    name: "Product Roadmap",
    description: "Plan quarterly product roadmap with features and dependencies",
    category: "Product",
    color: "text-blue-500",
    taskCount: 12,
    previewTasks: [
      "Q1 Discovery",
      "Q1 Design",
      "Q2 Feature A",
      "Q4 Public Launch"
    ],
    projectDescription: "A full-year product roadmap covering four quarters of discovery, design, build, and launch. Includes feature discovery, competitive analysis, stakeholder reviews, and milestone-based launch planning.",
    createWhiteboard: true,
    tasks: [
      {
        title: "Q1 Discovery & Research",
        description: "Conduct user research interviews to validate assumptions, run competitive analysis, and define quantitative success metrics before any design begins.",
        priority: "P0",
        subtasks: [
          "User research interviews",
          "Competitive analysis",
          "Define success metrics"
        ]
      },
      {
        title: "Q1 UX Design",
        description: "Produce wireframes for all Q1 features, iterate to interactive prototypes, and run a design review with engineering and stakeholders before handoff.",
        priority: "P0",
        subtasks: [
          "Wireframes",
          "Interactive prototypes",
          "Design review with team"
        ]
      },
      {
        title: "Q1 Development",
        description: "Build Q1 features across backend services, frontend components, and end-to-end integration tests. All P0 features shipped and QA-verified by end of Q1.",
        priority: "P0",
        subtasks: [
          "Backend services",
          "Frontend components",
          "Integration tests"
        ]
      },
      {
        title: "Q1 Stakeholder Review",
        description: "Present Q1 progress to leadership. Align on Q2 priorities based on user feedback and business metrics gathered during Q1.",
        priority: "P1",
        subtasks: [
          "Prepare presentation",
          "Present Q1 results",
          "Align Q2 priorities"
        ]
      },
      {
        title: "Q2 Feature A",
        description: "Deliver the first Q2 feature from spec through implementation to QA sign-off. Spec must be finalized at least 2 weeks before development starts.",
        priority: "P1",
        subtasks: ["Spec document", "Implementation", "QA sign-off"]
      },
      {
        title: "Q2 Feature B",
        description: "Deliver the second Q2 feature. Align with Feature A to ensure shared components and APIs are reused rather than duplicated.",
        priority: "P1",
        subtasks: ["Spec document", "Implementation", "QA sign-off"]
      },
      {
        title: "Q3 Scale & Performance",
        description: "Run a full performance audit, conduct load testing at 3× peak traffic, and upgrade infrastructure bottlenecks identified during the audit.",
        priority: "P1",
        subtasks: [
          "Performance audit",
          "Load testing",
          "Infrastructure upgrade"
        ]
      },
      {
        title: "Q3 Feature C",
        description: "Research, build, and test the Q3 feature. Incorporate learnings from Q2 feature delivery to improve velocity and quality.",
        priority: "P1",
        subtasks: ["Research & spec", "Build", "Test & QA"]
      },
      {
        title: "Q4 Beta Program",
        description: "Recruit and onboard 50–100 beta users. Collect structured feedback and prioritize final fixes before public launch.",
        priority: "P0",
        subtasks: [
          "Recruit beta users",
          "Run beta program",
          "Prioritize feedback"
        ]
      },
      {
        title: "Q4 Launch Prep",
        description: "Prepare all go-to-market materials, finalize product documentation, and brief the support team at least 3 weeks before public launch.",
        priority: "P0",
        subtasks: [
          "Marketing materials",
          "Product documentation",
          "Support team brief"
        ]
      },
      {
        title: "Q4 Public Launch",
        description: "Execute the public launch: send the launch email, publish social posts, and monitor signups, activation rate, and error rate for the first 72 hours.",
        priority: "P0",
        subtasks: [
          "Launch email blast",
          "Social media posts",
          "Monitor metrics 72h"
        ]
      },
      {
        title: "Roadmap Retrospective",
        description: "Review the full year against original roadmap goals. Document wins, misses, and recommendations for next year's planning cycle.",
        priority: "P2",
        subtasks: [
          "Review against goals",
          "Document learnings",
          "Recommendations"
        ]
      }
    ]
  },
  // ── 3. BUG TRACKER ─────────────────────────────────────────────────────────
  {
    id: "bug-tracker",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-5 w-5" }),
    name: "Bug Tracker",
    description: "Systematic bug investigation with reproduction steps and verification",
    category: "Engineering",
    color: "text-red-500",
    taskCount: 13,
    previewTasks: [
      "Bug Triage",
      "Critical: Auth Login Failure",
      "Regression Testing",
      "Release Notes"
    ],
    projectDescription: "A disciplined bug tracking workflow covering triage, severity classification, reproduction, fixing, verification, and release notes. Designed to minimize time-to-resolution while ensuring no regression slips to production.",
    createWhiteboard: false,
    tasks: [
      {
        title: "Bug Triage Session",
        description: "Review all newly filed bugs. Reproduce each issue, assess severity (Critical/High/Medium/Low), and assign an owner. All triage must be completed within 24 hours.",
        priority: "P0",
        subtasks: [
          "Reproduce each bug",
          "Assess severity level",
          "Assign to owner"
        ]
      },
      {
        title: "Critical: Auth Login Failure",
        description: "Users are unable to log in using email/password on production. Investigate the root cause in the auth service, write and deploy a hotfix, verify in production.",
        priority: "P0",
        subtasks: [
          "Investigate root cause",
          "Write fix",
          "Deploy hotfix",
          "Verify in production"
        ]
      },
      {
        title: "High: Data Export Broken",
        description: "CSV and XLSX exports return empty file for datasets over 1,000 rows. Identify the export service failure, patch export handler, test edge cases.",
        priority: "P0",
        subtasks: [
          "Identify export service failure",
          "Patch export handler",
          "Test edge cases"
        ]
      },
      {
        title: "High: Performance Regression",
        description: "Page load times increased 3× after the last deploy. Profile the regression, identify the slow query or bundle change, and restore previous performance.",
        priority: "P0",
        subtasks: [
          "Profile regression",
          "Identify root cause",
          "Restore performance"
        ]
      },
      {
        title: "Medium: Dashboard Slow Load",
        description: "The main dashboard takes 6–12 seconds for workspaces with 200+ records. Profile page load, optimize slow queries, and add query result caching.",
        priority: "P1",
        subtasks: ["Profile page load", "Optimize queries", "Cache results"]
      },
      {
        title: "Medium: Email Notification Delay",
        description: "Email notifications are delayed by 10–30 minutes instead of being sent instantly. Debug the job queue and fix the delivery pipeline.",
        priority: "P1",
        subtasks: [
          "Debug job queue",
          "Fix delivery pipeline",
          "Test end-to-end"
        ]
      },
      {
        title: "Low: UI Alignment Issue",
        description: "Several table cells are misaligned on Safari 16 and Firefox. Inspect CSS, fix flexbox/grid issues, verify across Chrome, Firefox, and Safari.",
        priority: "P2",
        subtasks: [
          "Inspect CSS",
          "Fix spacing issues",
          "Cross-browser verification"
        ]
      },
      {
        title: "Low: Tooltip Positioning",
        description: "Tooltips overflow viewport on small screens. Implement boundary-aware positioning and test on 320px–1440px viewports.",
        priority: "P2",
        subtasks: [
          "Audit tooltip positions",
          "Implement boundary-aware logic",
          "Mobile testing"
        ]
      },
      {
        title: "Root Cause Analysis",
        description: "For each Critical and High severity bug, conduct a root cause analysis. Identify systemic patterns and create preventive measures.",
        priority: "P1",
        subtasks: [
          "Analyze Critical bugs",
          "Identify patterns",
          "Create preventive tasks"
        ]
      },
      {
        title: "Automated Test Coverage",
        description: "Write automated tests for every bug that was fixed to prevent regression. Target at least 80% coverage of the affected code paths.",
        priority: "P1",
        subtasks: [
          "Write regression tests",
          "Integrate into CI",
          "Review coverage"
        ]
      },
      {
        title: "Regression Testing",
        description: "After all fixes are merged, run the full automated test suite and perform a manual smoke test across the core user flows.",
        priority: "P1",
        subtasks: ["Run automated suite", "Manual smoke test", "Sign off"]
      },
      {
        title: "Staging Verification",
        description: "Verify all fixes on staging environment. Get QA sign-off before scheduling the production release.",
        priority: "P0",
        subtasks: ["Test on staging", "Get QA sign-off", "Schedule release"]
      },
      {
        title: "Release Notes & Documentation",
        description: "Update the known issues log and changelog to reflect all bugs fixed. Use plain language suitable for customer-facing release notes.",
        priority: "P2",
        subtasks: [
          "Update known issues log",
          "Write changelog",
          "Customer communication"
        ]
      }
    ]
  },
  // ── 4. MARKETING CAMPAIGN ─────────────────────────────────────────────────
  {
    id: "marketing-campaign",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-5 w-5" }),
    name: "Marketing Campaign",
    description: "Launch a targeted campaign from concept to final report",
    category: "Marketing",
    color: "text-orange-500",
    taskCount: 14,
    previewTasks: [
      "Campaign Strategy",
      "Content Creation",
      "Email Campaign",
      "Campaign Wrap-up"
    ],
    projectDescription: "A complete marketing campaign playbook from initial strategy through audience research, content creation, email execution, paid ads, and post-launch analysis. Built for cross-functional marketing teams.",
    createWhiteboard: false,
    tasks: [
      {
        title: "Campaign Strategy",
        description: "Define the target audience, set measurable campaign goals (CAC, MQL, pipeline), and allocate the budget across channels. Get sign-off from marketing leadership.",
        priority: "P0",
        subtasks: [
          "Define target audience",
          "Set campaign goals",
          "Allocate budget"
        ]
      },
      {
        title: "Audience Research",
        description: "Conduct research interviews with 5–8 target customers. Map the customer journey and document the top pain points the campaign will address.",
        priority: "P0",
        subtasks: [
          "Customer interviews",
          "Journey mapping",
          "Pain point analysis"
        ]
      },
      {
        title: "Messaging & Positioning",
        description: "Develop the core campaign message, value proposition, and key differentiators. Create a messaging guide to ensure consistency across all channels.",
        priority: "P0",
        subtasks: ["Core messaging", "Value proposition", "Messaging guide"]
      },
      {
        title: "Content Creation",
        description: "Write all blog posts, design ad creatives, and produce video scripts aligned to campaign messaging. All content reviewed against brand voice guide.",
        priority: "P0",
        subtasks: [
          "Write blog posts",
          "Design ad creatives",
          "Produce video scripts"
        ]
      },
      {
        title: "Landing Page",
        description: "Write conversion-focused copy, design the landing page layout with a single clear CTA, implement UTM tracking, and test all form fields before launch.",
        priority: "P0",
        subtasks: [
          "Write copy",
          "Design layout",
          "Implement tracking",
          "Test forms"
        ]
      },
      {
        title: "Social Media Scheduling",
        description: "Draft all social posts, schedule them in your social media tool at least 1 week ahead, and review captions for tone and accuracy before publishing.",
        priority: "P1",
        subtasks: ["Draft all posts", "Schedule in tool", "Review captions"]
      },
      {
        title: "Email Campaign",
        description: "Write email copy, design template in email platform, A/B test at least 2 subject lines on a 20% split, and schedule the send to the full list.",
        priority: "P0",
        subtasks: [
          "Write email copy",
          "Design template",
          "A/B test subject lines",
          "Schedule send"
        ]
      },
      {
        title: "Influencer Outreach",
        description: "Identify 5–10 relevant micro-influencers, send detailed creative briefs, and confirm deliverables in writing before the campaign starts.",
        priority: "P1",
        subtasks: [
          "Identify influencers",
          "Send creative briefs",
          "Confirm deliverables"
        ]
      },
      {
        title: "Paid Ads Setup",
        description: "Set up Google Ads search and display campaigns, configure Meta campaigns with custom audiences, and monitor ROAS daily during the first 2 weeks.",
        priority: "P0",
        subtasks: [
          "Set up Google Ads",
          "Configure Meta campaigns",
          "Monitor ROAS"
        ]
      },
      {
        title: "PR & Outreach",
        description: "Write and distribute a press release to targeted media contacts. Follow up with key journalists and secure at least 3 editorial placements.",
        priority: "P1",
        subtasks: [
          "Write press release",
          "Distribute to media",
          "Follow up with journalists"
        ]
      },
      {
        title: "Campaign Launch",
        description: "Execute the campaign launch day: publish all content, activate ads, send emails, and brief the team on how to amplify across personal channels.",
        priority: "P0",
        subtasks: [
          "Publish all content",
          "Activate ads",
          "Team amplification brief"
        ]
      },
      {
        title: "Mid-Campaign Analytics Review",
        description: "Track conversion rates and CPL across all channels weekly. Compile findings into a mid-campaign report and adjust budgets based on performance.",
        priority: "P1",
        subtasks: [
          "Track conversions",
          "Analyze CPL by channel",
          "Reallocate budget"
        ]
      },
      {
        title: "Customer Follow-up Sequence",
        description: "Build a nurture email sequence for leads generated by the campaign. Personalize based on which content the lead engaged with.",
        priority: "P1",
        subtasks: [
          "Build nurture sequence",
          "Personalize by engagement",
          "Set up automation"
        ]
      },
      {
        title: "Campaign Wrap-up Report",
        description: "Calculate final ROI against campaign goal. Document key learnings — what worked, what didn't, and what to do differently. Feed insights into the next plan.",
        priority: "P2",
        subtasks: [
          "Calculate ROI",
          "Document learnings",
          "Recommendations for next campaign"
        ]
      }
    ]
  },
  // ── 5. DESIGN SPRINT ──────────────────────────────────────────────────────
  {
    id: "design-sprint",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5" }),
    name: "Design Sprint",
    description: "5-day design sprint from problem framing to user testing",
    category: "Design",
    color: "text-pink-500",
    taskCount: 12,
    previewTasks: [
      "Day 1: Map",
      "Day 2: Sketch",
      "Day 3: Prototype",
      "Day 5: Test"
    ],
    projectDescription: "A complete 5-day design sprint template following Google Ventures methodology. Includes problem mapping, competitive research, solution sketching, prototyping, and user testing with structured daily deliverables.",
    createWhiteboard: true,
    tasks: [
      {
        title: "Day 1: Map the Problem",
        description: "Define the long-term goal, map the customer journey end-to-end, interview key experts (support, sales, engineering) to gather insights. Set the target and sprint question by EOD.",
        priority: "P0",
        subtasks: [
          "Define long-term goal",
          "Map customer journey",
          "Expert interviews",
          "Set sprint question"
        ]
      },
      {
        title: "Day 1: Competitive Analysis",
        description: "Collect and analyze competitive apps and lightning demos. Each person presents their favorite examples of how others have solved similar problems. Document key insights on sticky notes.",
        priority: "P0",
        subtasks: [
          "Identify competitors",
          "Collect lightning demos",
          "Document insights"
        ]
      },
      {
        title: "Day 2: Sketch Solutions",
        description: "Each sprint member independently sketches detailed 3-panel storyboards (Crazy 8s → Solution Sketch). No group brainstorming — individual thinking first.",
        priority: "P0",
        subtasks: [
          "Individual Crazy 8s",
          "Detailed solution sketch",
          "Annotate with notes"
        ]
      },
      {
        title: "Day 2: Decide on Direction",
        description: "Review all sketches silently, dot-vote on promising ideas, conduct a superstar vote, and select the winning solution direction via structured decision.",
        priority: "P0",
        subtasks: [
          "Silent review",
          "Dot voting",
          "Superstar vote",
          "Final decision"
        ]
      },
      {
        title: "Day 3: Storyboard",
        description: "Create a detailed 15-panel storyboard of the winning solution. Every frame of the prototype must be planned. Assign prototype creation tasks to the team.",
        priority: "P0",
        subtasks: [
          "Create 15-panel storyboard",
          "Assign prototype tasks",
          "Finalize user flow"
        ]
      },
      {
        title: "Day 4: Build Prototype",
        description: "Build a realistic-looking prototype using a prototyping tool (Figma, Keynote, or Marvel). Aim for facade fidelity — looks real, doesn't need to fully work.",
        priority: "P0",
        subtasks: [
          "Build in prototyping tool",
          "Link all screens",
          "Review with team",
          "Finish by 5pm"
        ]
      },
      {
        title: "Day 4: Prepare Interview Script",
        description: "Write the user interview script, prepare the prototype on the test device, and brief the team on their roles (interviewer, note-takers, observers).",
        priority: "P0",
        subtasks: [
          "Write interview script",
          "Set up test device",
          "Brief team roles"
        ]
      },
      {
        title: "Day 5: User Testing",
        description: "Conduct 5 moderated usability tests with target customers. Each test is 60 minutes. Observers take structured notes. Debrief after each session.",
        priority: "P0",
        subtasks: [
          "Run 5 user tests",
          "Take structured notes",
          "Debrief after each test"
        ]
      },
      {
        title: "Day 5: Synthesize Findings",
        description: "Cluster observation notes into patterns. Identify the top insights and map them to the sprint question. Mark clear wins and clear failures.",
        priority: "P0",
        subtasks: [
          "Cluster observations",
          "Identify top insights",
          "Map to sprint question"
        ]
      },
      {
        title: "Sprint Retrospective",
        description: "Review the sprint process with the team. What worked well in the sprint format? What would you change for next time? Document and share the retrospective.",
        priority: "P1",
        subtasks: [
          "Review sprint process",
          "Document improvements",
          "Share retrospective"
        ]
      },
      {
        title: "Sprint Report",
        description: "Write the sprint report including the sprint question, solution explored, testing findings, and recommended next steps. Share with all stakeholders.",
        priority: "P1",
        subtasks: [
          "Document sprint question",
          "Summarize findings",
          "Write next steps",
          "Share with stakeholders"
        ]
      },
      {
        title: "Next Steps Planning",
        description: "Based on testing results, decide: proceed to build, iterate with another sprint, or pivot. Define specific next actions with owners and timelines.",
        priority: "P1",
        subtasks: [
          "Decide proceed/iterate/pivot",
          "Define next actions",
          "Assign owners"
        ]
      }
    ]
  },
  // ── 6. CLIENT PROJECT ─────────────────────────────────────────────────────
  {
    id: "client-project",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-5 w-5" }),
    name: "Client Project",
    description: "End-to-end client delivery from kickoff to final invoice",
    category: "Operations",
    color: "text-sky-500",
    taskCount: 14,
    previewTasks: [
      "Client Kickoff",
      "Scope of Work",
      "Delivery Milestone 1",
      "Final Invoice"
    ],
    projectDescription: "A professional client project template for agencies and consultancies. Covers kickoff, scope of work, weekly check-ins, milestone delivery, revisions, client sign-off, and final invoicing.",
    createWhiteboard: false,
    tasks: [
      {
        title: "Client Kickoff Call",
        description: "Host a 60-minute kickoff call with all key stakeholders. Align on goals, success metrics, communication cadence, and escalation path. Send a recap within 24 hours.",
        priority: "P0",
        subtasks: [
          "Prepare kickoff agenda",
          "Run kickoff call",
          "Send written recap"
        ]
      },
      {
        title: "Scope of Work Document",
        description: "Document the full project scope: deliverables, timeline, milestones, out-of-scope items, revision policy, and payment schedule. Get client sign-off before work begins.",
        priority: "P0",
        subtasks: ["Define deliverables", "Write SOW", "Get client signature"]
      },
      {
        title: "Project Plan",
        description: "Build a detailed project plan with tasks, owners, dependencies, and due dates. Share with the client for visibility and buy-in before starting.",
        priority: "P0",
        subtasks: ["Build task list", "Assign owners", "Share with client"]
      },
      {
        title: "Weekly Status Reports",
        description: "Send a written status report every Friday. Include: progress this week, plan for next week, risks and blockers, and any decisions needed from the client.",
        priority: "P1",
        subtasks: [
          "Weekly progress summary",
          "Upcoming work",
          "Blockers & decisions needed"
        ]
      },
      {
        title: "Delivery: Milestone 1",
        description: "Complete and deliver the first project milestone. Prepare a short presentation of the deliverable, walk the client through it, and collect structured feedback.",
        priority: "P0",
        subtasks: [
          "Complete deliverable",
          "Present to client",
          "Collect feedback"
        ]
      },
      {
        title: "Revision Round 1",
        description: "Incorporate client feedback from Milestone 1 delivery. Follow the agreed revision policy (maximum 2 rounds per deliverable). Document all changes made.",
        priority: "P1",
        subtasks: [
          "Log all feedback",
          "Implement revisions",
          "Document changes"
        ]
      },
      {
        title: "Delivery: Milestone 2",
        description: "Complete and deliver the second project milestone. This delivery should be near-final quality based on learnings from Milestone 1 feedback.",
        priority: "P0",
        subtasks: [
          "Complete deliverable",
          "Present to client",
          "Collect feedback"
        ]
      },
      {
        title: "Revision Round 2",
        description: "Final round of revisions before project close. Ensure all previously agreed feedback points have been addressed.",
        priority: "P1",
        subtasks: ["Final revisions", "Client review", "Get written approval"]
      },
      {
        title: "Quality Assurance",
        description: "Conduct an internal quality review before final delivery. Use a checklist covering completeness, accuracy, and adherence to the original brief.",
        priority: "P0",
        subtasks: [
          "Internal QA review",
          "Checklist verification",
          "Fix any issues"
        ]
      },
      {
        title: "Final Delivery",
        description: "Deliver all final files and assets. Provide handover documentation covering file structure, naming conventions, and usage instructions.",
        priority: "P0",
        subtasks: [
          "Package all deliverables",
          "Write handover docs",
          "Client walkthrough"
        ]
      },
      {
        title: "Client Sign-off",
        description: "Get formal written sign-off from the client that all deliverables meet the agreed scope and they accept the final work product.",
        priority: "P0",
        subtasks: [
          "Prepare sign-off form",
          "Client review",
          "Receive written approval"
        ]
      },
      {
        title: "Post-Project Survey",
        description: "Send a short 5-question satisfaction survey within 1 day of project completion. Use results to improve your delivery process.",
        priority: "P2",
        subtasks: ["Create survey", "Send to client", "Review results"]
      },
      {
        title: "Final Invoice",
        description: "Issue the final invoice per the agreed payment schedule. Include a summary of all deliverables completed. Follow up every 5 days until paid.",
        priority: "P0",
        subtasks: [
          "Issue invoice",
          "Follow up until paid",
          "Reconcile payment"
        ]
      },
      {
        title: "Case Study",
        description: "Write a case study documenting the project challenge, solution, and results. Get client approval before publishing.",
        priority: "P2",
        subtasks: ["Draft case study", "Get client approval", "Publish"]
      }
    ]
  },
  // ── 7. EVENT PLANNING ──────────────────────────────────────────────────────
  {
    id: "event-planning",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5" }),
    name: "Event Planning",
    description: "Plan an event from concept to post-event follow-up",
    category: "Operations",
    color: "text-amber-500",
    taskCount: 15,
    previewTasks: [
      "Venue Sourcing",
      "Speaker Coordination",
      "Day-of Logistics",
      "Post-Event Report"
    ],
    projectDescription: "A comprehensive event planning template for corporate events, conferences, and team offsites. Covers venue, catering, marketing, registration, AV, speaker coordination, day-of execution, and post-event follow-up.",
    createWhiteboard: false,
    tasks: [
      {
        title: "Event Brief & Goals",
        description: "Define the event purpose, target audience, expected attendance, success metrics, and overall budget. Get sign-off from event sponsors before proceeding.",
        priority: "P0",
        subtasks: [
          "Define purpose & audience",
          "Set attendance target",
          "Define success metrics",
          "Approve budget"
        ]
      },
      {
        title: "Venue Sourcing",
        description: "Research and evaluate at least 3 venues based on capacity, AV capabilities, catering, location, accessibility, and cost. Conduct site visits and book with signed contract.",
        priority: "P0",
        subtasks: [
          "Research venues",
          "Request quotes",
          "Site visits",
          "Book venue"
        ]
      },
      {
        title: "Catering",
        description: "Confirm menu selection, collect all dietary requirements, finalize headcount 2 weeks before the event, and confirm the order with the caterer.",
        priority: "P0",
        subtasks: [
          "Menu selection",
          "Dietary requirements",
          "Final headcount",
          "Confirm order"
        ]
      },
      {
        title: "Speaker Coordination",
        description: "Confirm each speaker's participation, collect their bio and headshot for the event program, and send a detailed speaking brief including topic, time slot, and AV requirements.",
        priority: "P0",
        subtasks: [
          "Confirm speakers",
          "Collect bios & headshots",
          "Send speaking brief"
        ]
      },
      {
        title: "Audio/Visual Setup",
        description: "Rent all required AV equipment, run a full technical rehearsal at the venue at least 1 day before the event, and document a contingency plan for equipment failure.",
        priority: "P0",
        subtasks: [
          "Rent AV equipment",
          "Technical rehearsal",
          "Contingency plan"
        ]
      },
      {
        title: "Marketing & Invitations",
        description: "Design the event invitation, send to the target audience list, track RSVPs, and send a reminder 48 hours before the event.",
        priority: "P0",
        subtasks: [
          "Design invite",
          "Send invites",
          "Track RSVPs",
          "Send reminders"
        ]
      },
      {
        title: "Registration Setup",
        description: "Set up the registration form with all event details, process any ticket payments, and send confirmation emails with directions and agenda to all registered attendees.",
        priority: "P1",
        subtasks: [
          "Set up registration form",
          "Process payments",
          "Send confirmations"
        ]
      },
      {
        title: "Agenda & Run of Show",
        description: "Create a detailed run-of-show document with precise timings for every element: sessions, breaks, networking time, and transitions.",
        priority: "P0",
        subtasks: [
          "Draft agenda",
          "Create run-of-show doc",
          "Share with all staff"
        ]
      },
      {
        title: "Staff & Volunteer Briefing",
        description: "Identify and recruit all required staff and volunteers. Assign specific roles and responsibilities. Run a full briefing 1 week before the event.",
        priority: "P1",
        subtasks: [
          "Recruit staff/volunteers",
          "Assign roles",
          "Run briefing session"
        ]
      },
      {
        title: "Branded Materials",
        description: "Design and print all event-branded materials: name badges, signage, programs, slide decks, and promotional items.",
        priority: "P1",
        subtasks: ["Design materials", "Print & order", "Delivery to venue"]
      },
      {
        title: "Day-of Logistics",
        description: "Brief all staff on their roles, run through the full setup checklist, conduct a final rehearsal with speakers, and document contingency plans.",
        priority: "P0",
        subtasks: [
          "Staff briefing",
          "Setup checklist",
          "Final rehearsal",
          "Review contingencies"
        ]
      },
      {
        title: "Photography & Recording",
        description: "Arrange a photographer and/or videographer. Brief them on key moments to capture. Ensure all required permissions are in place for sharing footage.",
        priority: "P1",
        subtasks: [
          "Hire photographer",
          "Brief on key shots",
          "Arrange permissions"
        ]
      },
      {
        title: "Post-Event Thank-you",
        description: "Send personalized thank-you emails to speakers, sponsors, and attendees within 24 hours of the event.",
        priority: "P1",
        subtasks: ["Email speakers", "Email sponsors", "Email attendees"]
      },
      {
        title: "Content Distribution",
        description: "Share event photos, session recordings, and key takeaways with attendees. Publish a post-event recap on the company blog or social channels.",
        priority: "P2",
        subtasks: [
          "Share photos & recordings",
          "Write recap post",
          "Publish and distribute"
        ]
      },
      {
        title: "Post-Event Report",
        description: "Compile the event report covering attendance, budget vs actuals, NPS score, key feedback, and recommendations for future events.",
        priority: "P2",
        subtasks: [
          "Compile attendance data",
          "Budget vs actuals",
          "Gather NPS feedback",
          "Write report"
        ]
      }
    ]
  },
  // ── 8. ONBOARDING ──────────────────────────────────────────────────────────
  {
    id: "onboarding",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }),
    name: "Onboarding",
    description: "Structured 90-day employee onboarding program",
    category: "HR",
    color: "text-green-500",
    taskCount: 14,
    previewTasks: [
      "Welcome Package",
      "Day 1 Orientation",
      "30-Day Check-in",
      "90-Day Review"
    ],
    projectDescription: "A structured 90-day employee onboarding program designed to maximize new hire engagement and time-to-productivity. Covers pre-boarding, Day 1 orientation, role-specific training, cultural integration, and milestone check-ins.",
    createWhiteboard: false,
    tasks: [
      {
        title: "Pre-boarding: IT Setup",
        description: "Before the first day: set up laptop, provision all required accounts (email, Slack, GitHub, JIRA), order any additional hardware, and prepare credentials document.",
        priority: "P0",
        subtasks: [
          "Set up laptop",
          "Provision accounts",
          "Order hardware",
          "Prepare credentials"
        ]
      },
      {
        title: "Pre-boarding: Welcome Package",
        description: "Send a welcome package at least 3 days before the start date. Include a personalized welcome note, company handbook, first-day agenda, and parking/access instructions.",
        priority: "P0",
        subtasks: [
          "Personalized welcome note",
          "Company handbook",
          "First-day agenda",
          "Access instructions"
        ]
      },
      {
        title: "Day 1: Orientation",
        description: "Run a structured Day 1 orientation covering company mission, values, team introductions, office/tool tour, and key HR processes (time-off, expenses, etc.).",
        priority: "P0",
        subtasks: [
          "Company mission & values",
          "Team introductions",
          "Tool tour",
          "HR process overview"
        ]
      },
      {
        title: "Day 1: Role Overview",
        description: "Meet with direct manager to cover role expectations, 30/60/90 day goals, how success is measured, and how to prioritize work in the first few weeks.",
        priority: "P0",
        subtasks: [
          "Role expectations",
          "30/60/90 goals",
          "Success metrics",
          "First 2 weeks priorities"
        ]
      },
      {
        title: "Week 1: Product & Domain Training",
        description: "Provide a structured introduction to the product, target customers, and industry. Schedule sessions with product, sales, and support to get the full picture.",
        priority: "P1",
        subtasks: [
          "Product walkthrough",
          "Customer call shadowing",
          "Industry context session"
        ]
      },
      {
        title: "Week 1: Team Process Training",
        description: "Walk the new hire through team workflows, communication norms, meeting cadences, code review process (if engineering), and documentation standards.",
        priority: "P1",
        subtasks: [
          "Team workflow training",
          "Communication norms",
          "Meeting cadences"
        ]
      },
      {
        title: "Week 2: First Project Assignment",
        description: "Assign a well-scoped first task or project designed for quick success. Provide a clear brief, easy access to a buddy, and a low-stakes environment to learn.",
        priority: "P1",
        subtasks: [
          "Assign first project",
          "Provide clear brief",
          "Introduce buddy system"
        ]
      },
      {
        title: "Week 2: Key Stakeholder Meetings",
        description: "Schedule 30-minute coffee chats with at least 5 key stakeholders across teams (product, design, sales, engineering, leadership).",
        priority: "P1",
        subtasks: [
          "Identify key stakeholders",
          "Schedule coffees",
          "Document relationships"
        ]
      },
      {
        title: "30-Day Check-in",
        description: "Hold a structured 30-minute check-in at Day 30. Review progress against 30-day goals, identify any adoption gaps or blockers, and adjust the onboarding plan.",
        priority: "P1",
        subtasks: [
          "Review 30-day goals",
          "Identify blockers",
          "Adjust onboarding plan"
        ]
      },
      {
        title: "60-Day Feedback Session",
        description: "Gather structured feedback from the new hire's peers and manager at Day 60. Share findings constructively and update development goals accordingly.",
        priority: "P1",
        subtasks: [
          "Collect peer feedback",
          "Manager review",
          "Share & discuss findings"
        ]
      },
      {
        title: "60-Day Project Review",
        description: "Evaluate the new hire's work product at Day 60 against the role expectations defined on Day 1. Celebrate wins, address gaps with a development plan.",
        priority: "P1",
        subtasks: [
          "Review work product",
          "Celebrate wins",
          "Address skill gaps"
        ]
      },
      {
        title: "90-Day Formal Review",
        description: "Conduct the formal 90-day performance review. Assess progress against all 90-day goals, review role fit, and confirm next 90-day priorities.",
        priority: "P0",
        subtasks: [
          "Formal review session",
          "90-day goal assessment",
          "Set next 90-day goals"
        ]
      },
      {
        title: "Onboarding Survey",
        description: "Send a structured onboarding satisfaction survey at Day 90. Use results to identify systemic improvements to the onboarding program.",
        priority: "P2",
        subtasks: [
          "Create survey",
          "Send at day 90",
          "Analyze and improve program"
        ]
      },
      {
        title: "Benefits & Payroll Enrollment",
        description: "Ensure the new hire is fully enrolled in benefits, payroll, equity, and any other compensation programs. Confirm all elections are in place by end of Week 1.",
        priority: "P0",
        subtasks: [
          "Benefits enrollment",
          "Payroll setup",
          "Equity plan documents"
        ]
      }
    ]
  },
  // ── 9. CONTENT CALENDAR ────────────────────────────────────────────────────
  {
    id: "content-calendar",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5" }),
    name: "Content Calendar",
    description: "Plan and publish a month of multi-channel content",
    category: "Marketing",
    color: "text-teal-500",
    taskCount: 14,
    previewTasks: [
      "Content Strategy",
      "Blog Post: Topic A",
      "Social Media Week 1",
      "Performance Report"
    ],
    projectDescription: "A full monthly content calendar template covering strategy, editorial planning, content creation, SEO optimization, multi-channel distribution, and performance reporting for marketing and content teams.",
    createWhiteboard: false,
    tasks: [
      {
        title: "Monthly Content Strategy",
        description: "Define the content theme and goals for the month. Align with product launches, company announcements, and seasonal trends. Get sign-off from marketing leadership.",
        priority: "P0",
        subtasks: [
          "Define monthly theme",
          "Align with launches",
          "Finalize topic list"
        ]
      },
      {
        title: "Editorial Calendar Setup",
        description: "Map all content pieces to specific publish dates across all channels. Ensure adequate spacing between major publications and no date conflicts.",
        priority: "P0",
        subtasks: [
          "Map content to dates",
          "Assign channels",
          "Confirm no conflicts"
        ]
      },
      {
        title: "Keyword Research",
        description: "Research target keywords for each blog post and long-form content piece. Prioritize keywords with high search volume and achievable competition levels.",
        priority: "P1",
        subtasks: [
          "Research keywords per post",
          "Prioritize by volume/competition",
          "Map to content"
        ]
      },
      {
        title: "Blog Post: Topic A",
        description: "Research, outline, write, and edit the first key blog post of the month. Include target keywords naturally, add internal links, and optimize the meta description.",
        priority: "P0",
        subtasks: [
          "Research & outline",
          "Write first draft",
          "Edit & optimize",
          "Add internal links"
        ]
      },
      {
        title: "Blog Post: Topic B",
        description: "Research, outline, write, and edit the second key blog post. Aim for 1,500+ words, include expert quotes or data points, and add a clear CTA at the end.",
        priority: "P0",
        subtasks: [
          "Research & outline",
          "Write first draft",
          "Edit & optimize",
          "Include CTA"
        ]
      },
      {
        title: "Long-form Content Piece",
        description: "Create one in-depth guide, report, or whitepaper (2,000–5,000 words) that can serve as a pillar content piece for multiple quarters.",
        priority: "P1",
        subtasks: [
          "Outline & structure",
          "Write long-form draft",
          "Design layout",
          "Final review"
        ]
      },
      {
        title: "Social Media Week 1 & 2",
        description: "Create and schedule all social media posts for the first two weeks of the month across LinkedIn, Twitter/X, and Instagram. Include images and hashtags.",
        priority: "P1",
        subtasks: [
          "Draft posts for all channels",
          "Create images",
          "Schedule in tool"
        ]
      },
      {
        title: "Social Media Week 3 & 4",
        description: "Create and schedule all social media posts for weeks 3 and 4. Review performance from weeks 1–2 and optimize format, timing, or messaging if needed.",
        priority: "P1",
        subtasks: [
          "Draft posts",
          "Review early performance",
          "Schedule with optimizations"
        ]
      },
      {
        title: "Email Newsletter",
        description: "Write and design the monthly email newsletter. Feature top content, company updates, and one exclusive piece of value only available to subscribers.",
        priority: "P0",
        subtasks: [
          "Write newsletter copy",
          "Design template",
          "Exclusive subscriber value",
          "Schedule send"
        ]
      },
      {
        title: "Video Content",
        description: "Script, record, and edit one short-form video for YouTube/LinkedIn. Repurpose into short clips for Instagram Reels and LinkedIn posts.",
        priority: "P1",
        subtasks: [
          "Script",
          "Record video",
          "Edit & caption",
          "Create short clips"
        ]
      },
      {
        title: "Guest Post Outreach",
        description: "Identify 3–5 high-authority publications in your industry. Pitch a guest article to each with a clear topic angle and byline offer.",
        priority: "P2",
        subtasks: ["Identify publications", "Write pitch emails", "Follow up"]
      },
      {
        title: "Content Repurposing",
        description: "Take the two best-performing pieces from last month and repurpose them into a new format (e.g., blog post → infographic, webinar → blog recap).",
        priority: "P2",
        subtasks: [
          "Identify top performers",
          "Choose repurpose format",
          "Create repurposed content"
        ]
      },
      {
        title: "SEO Audit",
        description: "Run an SEO audit on newly published content. Check for meta descriptions, image alt tags, title tags, canonical URLs, and internal linking structure.",
        priority: "P1",
        subtasks: [
          "Meta descriptions",
          "Image alt tags",
          "Internal linking audit"
        ]
      },
      {
        title: "Monthly Performance Report",
        description: "Compile the month's content performance: organic traffic, social engagement, email open/click rates, and conversion attribution. Share with leadership.",
        priority: "P2",
        subtasks: [
          "Compile metrics",
          "Analyze trends",
          "Share with leadership"
        ]
      }
    ]
  },
  // ── 10. SALES PIPELINE ─────────────────────────────────────────────────────
  {
    id: "sales-pipeline",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "h-5 w-5" }),
    name: "Sales Pipeline",
    description: "Build and run a sales pipeline from prospect to close",
    category: "Sales",
    color: "text-yellow-500",
    taskCount: 13,
    previewTasks: ["Prospecting", "Discovery Calls", "Proposals", "Closed Won"],
    projectDescription: "A complete B2B sales pipeline covering prospecting, cold outreach, discovery calls using BANT, product demos, tailored proposals, negotiation, contract execution, and structured handoff to the customer success team.",
    createWhiteboard: false,
    tasks: [
      {
        title: "ICP Definition",
        description: "Define the Ideal Customer Profile: company size, industry, geography, tech stack, and buyer persona. Get alignment from sales leadership before prospecting.",
        priority: "P0",
        subtasks: [
          "Define firmographics",
          "Define buyer persona",
          "Get sales leadership buy-in"
        ]
      },
      {
        title: "Target Account List",
        description: "Build a targeted account list of 50–100 companies matching the ICP. Research each account to identify the key decision maker and primary pain points.",
        priority: "P0",
        subtasks: [
          "Build account list",
          "Research each account",
          "Identify decision makers"
        ]
      },
      {
        title: "Cold Outreach Sequences",
        description: "Write personalized cold email sequences (3–5 touchpoints). Execute LinkedIn connection requests with a note and run a structured follow-up cadence over 2 weeks.",
        priority: "P0",
        subtasks: [
          "Write email sequences",
          "LinkedIn outreach",
          "Follow-up cadence"
        ]
      },
      {
        title: "Discovery Calls",
        description: "Book and run at least 10 discovery calls this month. Use the BANT framework (Budget, Authority, Need, Timeline) to qualify each opportunity.",
        priority: "P0",
        subtasks: [
          "Book 10 discovery calls",
          "Run calls using BANT",
          "Document in CRM"
        ]
      },
      {
        title: "Opportunity Qualification",
        description: "Score each opportunity against MEDDIC (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion). Only advance qualified opps.",
        priority: "P0",
        subtasks: [
          "Score against MEDDIC",
          "Advance qualified opps",
          "Archive unqualified leads"
        ]
      },
      {
        title: "Product Demos",
        description: "Customize each product demo to the prospect's specific use case and pain points. Present clearly, handle objections confidently, and agree on next steps before ending.",
        priority: "P0",
        subtasks: [
          "Customize demo to prospect",
          "Present solution",
          "Handle objections",
          "Agree on next steps"
        ]
      },
      {
        title: "Champion Development",
        description: "Identify and develop the internal champion for each deal. Equip them with messaging and materials to sell internally on your behalf.",
        priority: "P1",
        subtasks: [
          "Identify internal champion",
          "Provide champion materials",
          "Coach champion on messaging"
        ]
      },
      {
        title: "Business Case",
        description: "Work with the champion to build a business case including ROI calculation, time-to-value estimate, and cost of inaction. This drives urgency and budget approval.",
        priority: "P1",
        subtasks: [
          "Build ROI model",
          "Quantify time-to-value",
          "Document cost of inaction"
        ]
      },
      {
        title: "Proposals",
        description: "Write a tailored proposal including a clear pricing breakdown, ROI justification, and proposed implementation timeline. Route through legal review before sending.",
        priority: "P0",
        subtasks: [
          "Write proposal",
          "Pricing breakdown",
          "Legal review",
          "Send to prospect"
        ]
      },
      {
        title: "Negotiation",
        description: "Identify the prospect's key blockers (price, terms, timeline). Escalate to management if needed and prepare a counter-offer strategy before negotiation calls.",
        priority: "P0",
        subtasks: [
          "Identify blockers",
          "Escalate if needed",
          "Counter-offer strategy"
        ]
      },
      {
        title: "Contract Sign",
        description: "Send the final contract via DocuSign. Follow up every 48 hours until signed. Confirm the agreed start date and kickoff timeline immediately after signature.",
        priority: "P0",
        subtasks: [
          "Send DocuSign",
          "Follow up on signature",
          "Confirm start date"
        ]
      },
      {
        title: "Revenue Recognition",
        description: "Record the closed deal in the CRM. Update forecasts, notify finance for revenue recognition, and celebrate the win with the broader team.",
        priority: "P1",
        subtasks: ["Update CRM", "Notify finance", "Team celebration"]
      },
      {
        title: "CS Handoff",
        description: "Run an internal handoff call with the CS team covering account context, key contacts, expectations, and any committed features. Send intro email to connect client with CSM.",
        priority: "P0",
        subtasks: [
          "Internal handoff call",
          "Share account context",
          "Intro email to CSM"
        ]
      }
    ]
  },
  // ── 11. FEATURE LAUNCH ─────────────────────────────────────────────────────
  {
    id: "feature-launch",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "h-5 w-5" }),
    name: "Feature Launch",
    description: "End-to-end feature from spec to public launch",
    category: "Product",
    color: "text-indigo-500",
    taskCount: 15,
    previewTasks: [
      "Feature Spec",
      "Engineering Build",
      "Beta Testing",
      "Public Launch"
    ],
    projectDescription: "A complete feature launch template covering discovery, specification, design, engineering, QA, beta testing, documentation, and public release. Built for product, engineering, and marketing teams working together.",
    createWhiteboard: true,
    tasks: [
      {
        title: "Discovery & Research",
        description: "Conduct customer interviews to validate the problem this feature solves. Analyze usage data to quantify the opportunity. Document findings in a discovery brief.",
        priority: "P0",
        subtasks: [
          "Customer interviews",
          "Usage data analysis",
          "Document discovery brief"
        ]
      },
      {
        title: "Feature Specification",
        description: "Write the full feature spec: problem statement, proposed solution, success metrics, technical constraints, edge cases, and out-of-scope items. Get stakeholder sign-off.",
        priority: "P0",
        subtasks: [
          "Problem statement",
          "Proposed solution",
          "Success metrics",
          "Stakeholder sign-off"
        ]
      },
      {
        title: "UX Design",
        description: "Design all feature screens in Figma, including empty states, error states, and loading states. Run a design review with engineering before development starts.",
        priority: "P0",
        subtasks: [
          "All feature screens",
          "Empty & error states",
          "Engineering design review"
        ]
      },
      {
        title: "Technical Design",
        description: "Write the technical design document covering architecture decisions, API contracts, database schema changes, and performance considerations. Review in an eng design review.",
        priority: "P0",
        subtasks: [
          "Architecture decisions",
          "API contracts",
          "DB schema changes",
          "Eng design review"
        ]
      },
      {
        title: "Backend Engineering",
        description: "Implement the backend API, database changes, and business logic. Follow the technical design document. All code must be peer-reviewed before merge.",
        priority: "P0",
        subtasks: [
          "Implement API endpoints",
          "DB changes",
          "Unit tests",
          "Code review"
        ]
      },
      {
        title: "Frontend Engineering",
        description: "Implement the UI per the Figma designs. Wire up backend API calls, implement loading/error states, and write component tests. Keep accessible (WCAG AA).",
        priority: "P0",
        subtasks: [
          "Implement UI",
          "Wire backend APIs",
          "Loading & error states",
          "Component tests"
        ]
      },
      {
        title: "Integration Testing",
        description: "Write and run end-to-end integration tests covering the key user flows for the feature. All integration tests must pass before moving to QA.",
        priority: "P0",
        subtasks: [
          "Write e2e tests",
          "Run on staging",
          "Fix failures",
          "Sign off"
        ]
      },
      {
        title: "QA Testing",
        description: "Execute manual QA against all acceptance criteria defined in the spec. Test edge cases, mobile responsiveness, and accessibility. Log all bugs found.",
        priority: "P0",
        subtasks: [
          "Test against acceptance criteria",
          "Edge cases",
          "Mobile & accessibility",
          "Log bugs"
        ]
      },
      {
        title: "Bug Fixes",
        description: "Fix all Critical and High severity bugs found during QA. Retest all fixed bugs before marking QA sign-off.",
        priority: "P0",
        subtasks: ["Fix Critical bugs", "Fix High bugs", "Retest and sign off"]
      },
      {
        title: "Beta Program",
        description: "Enable the feature for 10–50 beta customers. Collect structured feedback via surveys and interviews. Identify any showstopper issues before full rollout.",
        priority: "P1",
        subtasks: [
          "Enable for beta users",
          "Collect feedback",
          "Identify showstoppers"
        ]
      },
      {
        title: "Feature Flag Rollout",
        description: "Implement a feature flag to control the rollout. Start at 5% of users, monitor key metrics, then ramp to 25%, 50%, and 100% based on data.",
        priority: "P1",
        subtasks: [
          "Implement feature flag",
          "5% rollout",
          "Monitor and ramp to 100%"
        ]
      },
      {
        title: "Help Documentation",
        description: "Write user-facing help documentation for the feature. Include screenshots, step-by-step walkthroughs, FAQs, and a troubleshooting guide.",
        priority: "P1",
        subtasks: [
          "Write help articles",
          "Add screenshots",
          "FAQ section",
          "Publish to help center"
        ]
      },
      {
        title: "Internal Training",
        description: "Train the support, sales, and CS teams on the new feature before public launch. Provide demo scripts, FAQs, and a one-page feature summary.",
        priority: "P1",
        subtasks: [
          "Train support team",
          "Train sales team",
          "Train CS team",
          "Distribute materials"
        ]
      },
      {
        title: "Launch Marketing",
        description: "Prepare all launch marketing assets: in-app announcement, email to existing customers, social media posts, and a blog post about the new feature.",
        priority: "P0",
        subtasks: [
          "In-app announcement",
          "Customer email",
          "Social posts",
          "Blog post"
        ]
      },
      {
        title: "Public Launch & Monitoring",
        description: "Enable the feature for 100% of users. Monitor error rates, usage metrics, and support ticket volume for 72 hours post-launch. Respond quickly to any issues.",
        priority: "P0",
        subtasks: [
          "Enable for all users",
          "Monitor error rates",
          "Monitor usage",
          "Quick response plan"
        ]
      }
    ]
  },
  // ── 12. HIRING PIPELINE ────────────────────────────────────────────────────
  {
    id: "hiring-pipeline",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }),
    name: "Hiring Pipeline",
    description: "Recruiting from job posting to offer acceptance",
    category: "HR",
    color: "text-emerald-500",
    taskCount: 15,
    previewTasks: [
      "Job Description",
      "Resume Screening",
      "Interview Panel",
      "Offer Accepted"
    ],
    projectDescription: "A structured hiring pipeline covering job description writing, multi-channel posting, resume screening, phone screens, technical assessment, panel interviews, reference checks, offer letter, and first-day prep.",
    createWhiteboard: false,
    tasks: [
      {
        title: "Role Definition",
        description: "Meet with the hiring manager to define the role: key responsibilities, required skills, nice-to-haves, team structure, and compensation range. Document in a role brief.",
        priority: "P0",
        subtasks: [
          "Responsibilities list",
          "Required vs nice-to-have skills",
          "Compensation range"
        ]
      },
      {
        title: "Job Description",
        description: "Write a clear and inclusive JD covering responsibilities, required skills, compensation range, benefits, and company culture. Get formal sign-off before posting.",
        priority: "P0",
        subtasks: [
          "Write JD draft",
          "Inclusive language review",
          "Get hiring manager sign-off"
        ]
      },
      {
        title: "Job Posting",
        description: "Post the role on LinkedIn, Indeed, and relevant niche job boards. Share internally for employee referrals. Activate any sourcing tools.",
        priority: "P0",
        subtasks: [
          "Post on LinkedIn",
          "Post on Indeed",
          "Niche job boards",
          "Share internally"
        ]
      },
      {
        title: "Sourcing Campaign",
        description: "Proactively source candidates via LinkedIn Recruiter. Reach out to employee referrals within 48 hours. Target 20–30 outbound contacts per week.",
        priority: "P0",
        subtasks: [
          "LinkedIn Recruiter outreach",
          "Follow up referrals",
          "Track outbound contacts"
        ]
      },
      {
        title: "Application Tracking Setup",
        description: "Set up the ATS pipeline stages, create the scorecard rubric, assign reviewers, and establish SLAs for each stage to ensure a fast, fair process.",
        priority: "P0",
        subtasks: [
          "Set up ATS stages",
          "Create scorecard",
          "Assign reviewers",
          "Set SLAs"
        ]
      },
      {
        title: "Resume Screening",
        description: "Review all applications against the scorecard. Shortlist the top 15–20%. Send rejection emails with constructive feedback to non-advancing candidates.",
        priority: "P0",
        subtasks: [
          "Screen all applications",
          "Score against rubric",
          "Send rejections"
        ]
      },
      {
        title: "Phone Screens",
        description: "Conduct 20–30 minute screens to assess motivation, communication, salary alignment, and cultural fit. Document outcomes and advance top candidates.",
        priority: "P0",
        subtasks: [
          "Schedule phone screens",
          "Conduct screens",
          "Document outcomes"
        ]
      },
      {
        title: "Technical Assessment",
        description: "Send a role-relevant take-home assessment (60–90 minutes max). Evaluate each submission using a standardized scoring rubric. Rank candidates before interviews.",
        priority: "P1",
        subtasks: ["Send assessment", "Score submissions", "Rank candidates"]
      },
      {
        title: "Interview Coordination",
        description: "Schedule all panel interviews with 3–4 interviewers. Assign each interviewer a specific competency area. Send prep materials and scorecard to all interviewers.",
        priority: "P0",
        subtasks: [
          "Schedule panel interviews",
          "Assign competency areas",
          "Send prep materials"
        ]
      },
      {
        title: "Panel Interviews",
        description: "Conduct structured panel interviews. Each interviewer probes one specific competency. Conduct a calibration debrief within 24 hours of each panel.",
        priority: "P0",
        subtasks: [
          "Conduct interviews",
          "Take structured notes",
          "Calibration debrief"
        ]
      },
      {
        title: "Interview Debrief",
        description: "Run a structured debrief meeting with all interviewers. Each person shares their independent score before discussing. Reach a hiring decision within 48 hours.",
        priority: "P0",
        subtasks: [
          "Independent scoring first",
          "Group discussion",
          "Hiring decision"
        ]
      },
      {
        title: "Reference Checks",
        description: "Request 2–3 professional references from the finalist. Conduct structured reference calls using a standard script focused on performance, collaboration, and growth.",
        priority: "P1",
        subtasks: [
          "Request references",
          "Conduct structured calls",
          "Document findings"
        ]
      },
      {
        title: "Offer Letter",
        description: "Draft the offer letter with agreed compensation, title, start date, and benefits. Negotiate terms if needed and send the final signed offer for candidate signature.",
        priority: "P0",
        subtasks: [
          "Draft offer letter",
          "Negotiate if needed",
          "Send and await signature"
        ]
      },
      {
        title: "Background Check",
        description: "Initiate a background check once the offer is accepted. Use a reputable provider. Confirm results before the start date.",
        priority: "P1",
        subtasks: [
          "Initiate background check",
          "Confirm results",
          "Notify candidate"
        ]
      },
      {
        title: "Onboarding Prep",
        description: "Complete all pre-start-day logistics: set up IT equipment, provision system access, prepare a welcome pack, and build a detailed Day 1 agenda.",
        priority: "P0",
        subtasks: [
          "IT setup",
          "Access provisioning",
          "Welcome pack",
          "Day 1 agenda"
        ]
      }
    ]
  }
];
function ProjectNewPage() {
  const { workspaceId } = useParams({ from: "/app/$workspaceId/projects/new" });
  const navigate = useNavigate();
  const { actor } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();
  const [pickerDone, setPickerDone] = reactExports.useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = reactExports.useState(
    null
  );
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [nameError, setNameError] = reactExports.useState("");
  const [submitError, setSubmitError] = reactExports.useState("");
  const selectedTemplate = PROJECT_TEMPLATES.find((t) => t.id === selectedTemplateId) ?? null;
  const createMutation = useMutation({
    mutationFn: async ({
      projectName,
      projectDesc
    }) => {
      if (!actor) throw new Error("Not connected to backend");
      const projectResult = await actor.createProject(tenantId, workspaceId, {
        name: projectName,
        description: projectDesc,
        memberIds: []
      });
      if (projectResult.__kind__ === "err") throw new Error(projectResult.err);
      const project = projectResult.ok;
      if (selectedTemplate) {
        for (const task of selectedTemplate.tasks) {
          const taskResult = await actor.createTask(tenantId, workspaceId, {
            title: task.title,
            description: task.description,
            projectId: project.id,
            priority: toPriority(task.priority),
            crossLinks: []
          });
          if (taskResult.__kind__ === "err") {
            console.warn(
              `Failed to create task "${task.title}": ${taskResult.err}`
            );
          }
        }
        if (selectedTemplate.createWhiteboard) {
          await actor.createWhiteboard(tenantId, workspaceId, {
            title: `${selectedTemplate.name} — Planning Board`,
            templateId: selectedTemplate.id,
            templateName: selectedTemplate.name,
            projectId: project.id
          });
        }
      }
      return project;
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", tenantId, workspaceId]
      });
      ue.success(
        selectedTemplate ? `Project created with ${selectedTemplate.taskCount} tasks` : "Project created successfully"
      );
      void navigate({
        to: "/app/$workspaceId/projects/$projectId",
        params: { workspaceId, projectId: project.id }
      });
    },
    onError: (err) => {
      setSubmitError(
        err.message || "Failed to create project. Please try again."
      );
    }
  });
  function handleSelectTemplate(id) {
    setSelectedTemplateId((prev) => prev === id ? null : id);
  }
  function handleContinue(templateId) {
    setSelectedTemplateId(templateId);
    if (templateId) {
      const tpl = PROJECT_TEMPLATES.find((t) => t.id === templateId);
      setName((tpl == null ? void 0 : tpl.name) ?? "");
      setDescription((tpl == null ? void 0 : tpl.projectDescription) ?? "");
    } else {
      setName("");
      setDescription("");
    }
    setPickerDone(true);
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("Project name is required");
      return;
    }
    setNameError("");
    setSubmitError("");
    createMutation.mutate({
      projectName: name.trim(),
      projectDesc: description.trim()
    });
  }
  if (!pickerDone) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up min-h-full p-4 sm:p-6 max-w-5xl mx-auto space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            asChild: true,
            className: "h-8 w-8 shrink-0",
            "aria-label": "Back to Projects",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/$workspaceId/projects", params: { workspaceId }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-4 w-4 text-orange-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-bold text-foreground tracking-tight", children: "New Project" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground hidden sm:block", children: "Choose a template or start from scratch" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/50 bg-card shadow-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 border-b border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-semibold text-foreground", children: "Start with a template" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Templates come pre-loaded with tasks, priorities, and descriptions — edit everything after creation." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleContinue(null),
              className: "w-full flex items-center gap-3 rounded-lg border border-dashed border-border/60 bg-background hover:border-primary/40 hover:bg-primary/5 p-4 text-left transition-colors group",
              "data-ocid": "template-blank",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground", children: "Blank Project" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Start with an empty project and build your own structure" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: PROJECT_TEMPLATES.map((template) => {
            const isSelected = selectedTemplateId === template.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleSelectTemplate(template.id),
                className: cn(
                  "relative flex flex-col gap-2.5 rounded-lg border bg-background p-4 text-left transition-all duration-150 hover:shadow-sm",
                  isSelected ? "border-primary ring-1 ring-primary/30 bg-primary/5" : "border-border/60 hover:border-border"
                ),
                "data-ocid": `template-card-${template.id}`,
                "aria-pressed": isSelected,
                children: [
                  isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "absolute top-3 right-3 h-4 w-4 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 pr-6", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("shrink-0", template.color), children: template.icon }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground leading-tight truncate", children: template.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          variant: "secondary",
                          className: "text-[10px] px-1.5 py-0 h-4 mt-0.5 font-normal",
                          children: template.category
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 leading-relaxed", children: template.description }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1", children: [
                    template.previewTasks.slice(0, 3).map((task) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "li",
                      {
                        className: "flex items-center gap-1.5 text-xs text-muted-foreground",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: task })
                        ]
                      },
                      task
                    )),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-xs text-muted-foreground/60 pl-2.5", children: [
                      "+",
                      template.taskCount - 3,
                      " more tasks"
                    ] })
                  ] })
                ]
              },
              template.id
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 border-t border-border/40 p-4 sm:p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground hidden sm:block", children: selectedTemplate ? `"${selectedTemplate.name}" selected — ${selectedTemplate.taskCount} tasks included` : "Select a template above or start blank" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-auto w-full sm:w-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                asChild: true,
                className: "text-sm flex-1 sm:flex-none",
                "data-ocid": "template-cancel-btn",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/$workspaceId/projects", params: { workspaceId }, children: "Cancel" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                onClick: () => handleContinue(selectedTemplateId),
                className: "gap-1.5 text-sm flex-1 sm:flex-none",
                "data-ocid": "template-use-btn",
                disabled: false,
                children: [
                  selectedTemplate ? `Use "${selectedTemplate.name}"` : "Continue without template",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
                ]
              }
            )
          ] })
        ] })
      ] })
    ] });
  }
  const submitLabel = selectedTemplate ? `Create from ${selectedTemplate.name}` : "Create Project";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up min-h-full p-4 sm:p-6 max-w-2xl mx-auto space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => setPickerDone(false),
          className: "h-8 w-8 shrink-0",
          "aria-label": "Back to template picker",
          "data-ocid": "form-back-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 shrink-0", children: selectedTemplate ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: selectedTemplate.color, children: selectedTemplate.icon }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-4 w-4 text-orange-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-bold text-foreground tracking-tight", children: selectedTemplate ? `New ${selectedTemplate.name} Project` : "New Project" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground hidden sm:block", children: selectedTemplate ? `Starts with ${selectedTemplate.taskCount} pre-built tasks` : "Blank project — build your own structure" })
        ] })
      ] })
    ] }),
    selectedTemplate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("shrink-0 mt-0.5", selectedTemplate.color), children: selectedTemplate.icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-foreground", children: [
          selectedTemplate.name,
          " template"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-1.5", children: [
          "· ",
          selectedTemplate.taskCount,
          " tasks with priorities & descriptions"
        ] }),
        selectedTemplate.createWhiteboard && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-1.5", children: "· 1 planning whiteboard" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: handleSubmit,
        className: "rounded-xl border border-border/50 bg-card p-4 sm:p-6 space-y-5 shadow-card",
        "data-ocid": "project-new-form",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "project-name",
                className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                children: [
                  "Project Name ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "project-name",
                placeholder: "e.g. Q2 Marketing Campaign",
                value: name,
                onChange: (e) => {
                  setName(e.target.value);
                  if (nameError) setNameError("");
                },
                "data-ocid": "project-name-input",
                "aria-invalid": !!nameError,
                className: "border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
              }
            ),
            nameError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: nameError })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "project-desc",
                className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                children: "Description"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "project-desc",
                placeholder: "Describe the project goals and scope...",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                rows: 4,
                "data-ocid": "project-desc-input",
                className: "resize-none border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
              }
            )
          ] }),
          submitError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive", children: submitError }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2 border-t border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                onClick: () => setPickerDone(false),
                "data-ocid": "form-back-template-btn",
                className: "text-sm order-last sm:order-first",
                children: "← Back to templates"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  asChild: true,
                  "data-ocid": "project-cancel-btn",
                  className: "text-sm",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/$workspaceId/projects", params: { workspaceId }, children: "Cancel" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: createMutation.isPending,
                  className: "bg-orange-500 hover:bg-orange-600 text-white gap-1.5",
                  "data-ocid": "project-save-btn",
                  children: createMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Creating…" })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: submitLabel })
                  ] })
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] });
}
export {
  ProjectNewPage as default
};
