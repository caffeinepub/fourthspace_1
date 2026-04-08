import { m as useParams, f as useWorkspace, d as useNavigate, h as useQuery, j as jsxRuntimeExports, F as FileText, B as Button, i as Link, P as Plus } from "./index-CzyNqtbv.js";
import { S as Skeleton } from "./skeleton-DMAdSNre.js";
import { u as useBackend } from "./index-CJtF1vtU.js";
import { C as Clock } from "./clock-DD8HS7VE.js";
const BUILT_IN_TEMPLATES = [
  {
    id: "tpl-meeting",
    tenantId: "system",
    name: "Meeting Notes",
    description: "Structured notes for team meetings with agenda and action items",
    icon: "🗓️",
    blocksJson: JSON.stringify([
      {
        id: "1",
        order: 0,
        blockType: "heading1",
        content: "Meeting Notes",
        metadata: ""
      },
      {
        id: "2",
        order: 1,
        blockType: "paragraph",
        content: "📅 Date: [Insert date]   |   👥 Attendees: [List names]   |   ⏱️ Duration: 60 min",
        metadata: ""
      },
      {
        id: "3",
        order: 2,
        blockType: "callout",
        content: "Take notes in real time. Assign every action item to a named owner before the call ends.",
        metadata: "📋"
      },
      {
        id: "4",
        order: 3,
        blockType: "heading2",
        content: "Agenda",
        metadata: ""
      },
      {
        id: "5",
        order: 4,
        blockType: "bulletList",
        content: "1. Review last meeting's action items (10 min)",
        metadata: ""
      },
      {
        id: "6",
        order: 5,
        blockType: "bulletList",
        content: "2. Q3 roadmap priorities discussion (20 min)",
        metadata: ""
      },
      {
        id: "7",
        order: 6,
        blockType: "bulletList",
        content: "3. Blockers and risks round-table (15 min)",
        metadata: ""
      },
      {
        id: "8",
        order: 7,
        blockType: "bulletList",
        content: "4. Action items recap and next steps (10 min)",
        metadata: ""
      },
      {
        id: "9",
        order: 8,
        blockType: "heading2",
        content: "Discussion Points",
        metadata: ""
      },
      {
        id: "10",
        order: 9,
        blockType: "heading3",
        content: "Q3 Roadmap Priorities",
        metadata: ""
      },
      {
        id: "11",
        order: 10,
        blockType: "paragraph",
        content: "The team aligned on focusing authentication improvements and onboarding flow as the top two priorities. The mobile app overhaul was pushed to Q4 due to resource constraints.",
        metadata: ""
      },
      {
        id: "12",
        order: 11,
        blockType: "heading3",
        content: "Blockers & Risks",
        metadata: ""
      },
      {
        id: "13",
        order: 12,
        blockType: "bulletList",
        content: "API integration with third-party payment provider is delayed — waiting on vendor sandbox access",
        metadata: ""
      },
      {
        id: "14",
        order: 13,
        blockType: "bulletList",
        content: "Design review for new dashboard is blocked on finalized copy",
        metadata: ""
      },
      {
        id: "15",
        order: 14,
        blockType: "heading2",
        content: "Decisions Made",
        metadata: ""
      },
      {
        id: "16",
        order: 15,
        blockType: "bulletList",
        content: "✅ Ship the redesigned onboarding by August 15",
        metadata: ""
      },
      {
        id: "17",
        order: 16,
        blockType: "bulletList",
        content: "✅ Defer mobile app work to Q4 sprint cycle",
        metadata: ""
      },
      {
        id: "18",
        order: 17,
        blockType: "bulletList",
        content: "✅ Sarah to lead the authentication feature as DRI",
        metadata: ""
      },
      {
        id: "19",
        order: 18,
        blockType: "heading2",
        content: "Action Items",
        metadata: ""
      },
      {
        id: "20",
        order: 19,
        blockType: "bulletList",
        content: "[ ] @Sarah — Draft authentication spec by Friday",
        metadata: ""
      },
      {
        id: "21",
        order: 20,
        blockType: "bulletList",
        content: "[ ] @Marcus — Follow up with payment vendor for sandbox credentials",
        metadata: ""
      },
      {
        id: "22",
        order: 21,
        blockType: "bulletList",
        content: "[ ] @Design — Finalize onboarding copy and share with eng",
        metadata: ""
      },
      {
        id: "23",
        order: 22,
        blockType: "heading3",
        content: "Next Meeting",
        metadata: ""
      },
      {
        id: "24",
        order: 23,
        blockType: "paragraph",
        content: "📅 [Next date] at [time] — Focus: Authentication spec review and Q3 milestone check-in",
        metadata: ""
      }
    ]),
    workspaceId: "",
    authorId: {},
    createdAt: BigInt(0)
  },
  {
    id: "tpl-project-brief",
    tenantId: "system",
    name: "Project Brief",
    description: "Define project goals, scope, and success criteria",
    icon: "🎯",
    blocksJson: JSON.stringify([
      {
        id: "1",
        order: 0,
        blockType: "heading1",
        content: "Project Brief",
        metadata: ""
      },
      {
        id: "2",
        order: 1,
        blockType: "callout",
        content: "Complete this brief before kickoff. Every team member should read and sign off on this document before work begins.",
        metadata: "🎯"
      },
      {
        id: "3",
        order: 2,
        blockType: "paragraph",
        content: "📌 Project Name: [Name]   |   👤 Owner: [Name]   |   📅 Start Date: [Date]   |   🏁 Target Date: [Date]",
        metadata: ""
      },
      {
        id: "4",
        order: 3,
        blockType: "heading2",
        content: "Problem Statement",
        metadata: ""
      },
      {
        id: "5",
        order: 4,
        blockType: "paragraph",
        content: "Our current onboarding flow has a 62% drop-off rate at step 3. New users are confused by the account setup process, leading to high churn in the first 7 days. We need a redesigned onboarding experience that guides users to their first meaningful action within 5 minutes.",
        metadata: ""
      },
      {
        id: "6",
        order: 5,
        blockType: "heading2",
        content: "Project Goal",
        metadata: ""
      },
      {
        id: "7",
        order: 6,
        blockType: "paragraph",
        content: "Redesign the end-to-end onboarding experience to reduce drop-off by 40% and increase 7-day retention from 38% to 55%.",
        metadata: ""
      },
      {
        id: "8",
        order: 7,
        blockType: "heading2",
        content: "Scope — What's In",
        metadata: ""
      },
      {
        id: "9",
        order: 8,
        blockType: "bulletList",
        content: "New welcome screen with value proposition",
        metadata: ""
      },
      {
        id: "10",
        order: 9,
        blockType: "bulletList",
        content: "Step-by-step account setup wizard (3 steps max)",
        metadata: ""
      },
      {
        id: "11",
        order: 10,
        blockType: "bulletList",
        content: "Guided first-action tooltip overlay",
        metadata: ""
      },
      {
        id: "12",
        order: 11,
        blockType: "bulletList",
        content: "Email drip sequence for days 1, 3, and 7",
        metadata: ""
      },
      {
        id: "13",
        order: 12,
        blockType: "heading2",
        content: "Scope — What's Out",
        metadata: ""
      },
      {
        id: "14",
        order: 13,
        blockType: "bulletList",
        content: "Mobile app onboarding (separate project)",
        metadata: ""
      },
      {
        id: "15",
        order: 14,
        blockType: "bulletList",
        content: "Paid tier upgrade prompts during onboarding",
        metadata: ""
      },
      {
        id: "16",
        order: 15,
        blockType: "heading2",
        content: "Team & Stakeholders",
        metadata: ""
      },
      {
        id: "17",
        order: 16,
        blockType: "bulletList",
        content: "DRI: [Name] (Product Manager)",
        metadata: ""
      },
      {
        id: "18",
        order: 17,
        blockType: "bulletList",
        content: "Engineering Lead: [Name]",
        metadata: ""
      },
      {
        id: "19",
        order: 18,
        blockType: "bulletList",
        content: "Design Lead: [Name]",
        metadata: ""
      },
      {
        id: "20",
        order: 19,
        blockType: "bulletList",
        content: "Stakeholders: CEO, Head of Growth",
        metadata: ""
      },
      {
        id: "21",
        order: 20,
        blockType: "heading2",
        content: "Timeline",
        metadata: ""
      },
      {
        id: "22",
        order: 21,
        blockType: "bulletList",
        content: "Week 1–2: Discovery and wireframes",
        metadata: ""
      },
      {
        id: "23",
        order: 22,
        blockType: "bulletList",
        content: "Week 3–4: Design and copy finalization",
        metadata: ""
      },
      {
        id: "24",
        order: 23,
        blockType: "bulletList",
        content: "Week 5–6: Engineering implementation",
        metadata: ""
      },
      {
        id: "25",
        order: 24,
        blockType: "bulletList",
        content: "Week 7: QA and staging review",
        metadata: ""
      },
      {
        id: "26",
        order: 25,
        blockType: "bulletList",
        content: "Week 8: Launch and monitor",
        metadata: ""
      },
      {
        id: "27",
        order: 26,
        blockType: "heading2",
        content: "Success Criteria",
        metadata: ""
      },
      {
        id: "28",
        order: 27,
        blockType: "bulletList",
        content: "[ ] Onboarding drop-off reduced from 62% to ≤22% at step 3",
        metadata: ""
      },
      {
        id: "29",
        order: 28,
        blockType: "bulletList",
        content: "[ ] 7-day retention improves from 38% to 55%",
        metadata: ""
      },
      {
        id: "30",
        order: 29,
        blockType: "bulletList",
        content: "[ ] Average time-to-first-action under 5 minutes",
        metadata: ""
      }
    ]),
    workspaceId: "",
    authorId: {},
    createdAt: BigInt(0)
  },
  {
    id: "tpl-weekly-review",
    tenantId: "system",
    name: "Weekly Review",
    description: "Reflect on the past week and plan the next one",
    icon: "📊",
    blocksJson: JSON.stringify([
      {
        id: "1",
        order: 0,
        blockType: "heading1",
        content: "Weekly Review",
        metadata: ""
      },
      {
        id: "2",
        order: 1,
        blockType: "paragraph",
        content: "📅 Week of: [Date range]   |   ✍️ Author: [Your name]",
        metadata: ""
      },
      {
        id: "3",
        order: 2,
        blockType: "callout",
        content: "Set aside 30 minutes every Friday to complete this review. Consistency makes the difference — even a short review beats no review.",
        metadata: "💡"
      },
      {
        id: "4",
        order: 3,
        blockType: "heading2",
        content: "🏆 This Week's Wins",
        metadata: ""
      },
      {
        id: "5",
        order: 4,
        blockType: "paragraph",
        content: "What went well? What are you proud of? Even small wins count.",
        metadata: ""
      },
      {
        id: "6",
        order: 5,
        blockType: "bulletList",
        content: "Shipped the new authentication flow — under budget and on time",
        metadata: ""
      },
      {
        id: "7",
        order: 6,
        blockType: "bulletList",
        content: "Resolved a critical production bug within 2 hours of detection",
        metadata: ""
      },
      {
        id: "8",
        order: 7,
        blockType: "bulletList",
        content: "Had a breakthrough conversation with the design team on the dashboard layout",
        metadata: ""
      },
      {
        id: "9",
        order: 8,
        blockType: "heading2",
        content: "🔴 Challenges",
        metadata: ""
      },
      {
        id: "10",
        order: 9,
        blockType: "paragraph",
        content: "What was hard? What slowed you down or didn't go as planned?",
        metadata: ""
      },
      {
        id: "11",
        order: 10,
        blockType: "bulletList",
        content: "Third-party API integration took 3× longer than estimated due to poor documentation",
        metadata: ""
      },
      {
        id: "12",
        order: 11,
        blockType: "bulletList",
        content: "Team communication broke down on the hotfix deployment — need clearer runbook",
        metadata: ""
      },
      {
        id: "13",
        order: 12,
        blockType: "heading2",
        content: "📈 Metrics This Week",
        metadata: ""
      },
      {
        id: "14",
        order: 13,
        blockType: "paragraph",
        content: "Record 2–4 key numbers that reflect your work's impact.",
        metadata: ""
      },
      {
        id: "15",
        order: 14,
        blockType: "bulletList",
        content: "Active users: 4,312 (↑8% vs last week)",
        metadata: ""
      },
      {
        id: "16",
        order: 15,
        blockType: "bulletList",
        content: "Support tickets resolved: 47 of 52 (90% resolution rate)",
        metadata: ""
      },
      {
        id: "17",
        order: 16,
        blockType: "bulletList",
        content: "Build pipeline success rate: 94% (target: 95%)",
        metadata: ""
      },
      {
        id: "18",
        order: 17,
        blockType: "heading2",
        content: "📋 Next Week's Priorities",
        metadata: ""
      },
      {
        id: "19",
        order: 18,
        blockType: "bulletList",
        content: "[ ] Complete code review for data export feature (due Monday)",
        metadata: ""
      },
      {
        id: "20",
        order: 19,
        blockType: "bulletList",
        content: "[ ] Kick off sprint planning for Q3 milestone 2",
        metadata: ""
      },
      {
        id: "21",
        order: 20,
        blockType: "bulletList",
        content: "[ ] Finalize API documentation draft and share with partners",
        metadata: ""
      },
      {
        id: "22",
        order: 21,
        blockType: "bulletList",
        content: "[ ] 1:1 with Alex — discuss career development goals",
        metadata: ""
      },
      {
        id: "23",
        order: 22,
        blockType: "heading2",
        content: "💬 Reflection",
        metadata: ""
      },
      {
        id: "24",
        order: 23,
        blockType: "paragraph",
        content: "One thing to do differently next week:",
        metadata: ""
      }
    ]),
    workspaceId: "",
    authorId: {},
    createdAt: BigInt(0)
  },
  {
    id: "tpl-daily-standup",
    tenantId: "system",
    name: "Daily Standup",
    description: "Quick daily sync — yesterday, today, blockers",
    icon: "☀️",
    blocksJson: JSON.stringify([
      {
        id: "1",
        order: 0,
        blockType: "heading1",
        content: "Daily Standup",
        metadata: ""
      },
      {
        id: "2",
        order: 1,
        blockType: "paragraph",
        content: "📅 Date: [Today's date]   |   👤 Team member: [Your name]   |   ⏱️ Target: Keep to 15 min total",
        metadata: ""
      },
      {
        id: "3",
        order: 2,
        blockType: "callout",
        content: "Focus on what's relevant to the team. Flag blockers early — don't wait for the next standup.",
        metadata: "⚡"
      },
      {
        id: "4",
        order: 3,
        blockType: "heading2",
        content: "✅ Yesterday I Completed",
        metadata: ""
      },
      {
        id: "5",
        order: 4,
        blockType: "bulletList",
        content: "[ ] Finished unit tests for the payment module (12 tests, all passing)",
        metadata: ""
      },
      {
        id: "6",
        order: 5,
        blockType: "bulletList",
        content: "[ ] Reviewed and approved Anna's PR for the notification system",
        metadata: ""
      },
      {
        id: "7",
        order: 6,
        blockType: "bulletList",
        content: "[ ] Fixed intermittent login bug reported in staging (ticket #284)",
        metadata: ""
      },
      {
        id: "8",
        order: 7,
        blockType: "heading2",
        content: "🔨 Today I Will",
        metadata: ""
      },
      {
        id: "9",
        order: 8,
        blockType: "bulletList",
        content: "[ ] Begin integration of Stripe webhook handler",
        metadata: ""
      },
      {
        id: "10",
        order: 9,
        blockType: "bulletList",
        content: "[ ] Sync with design team on revised dashboard mockups",
        metadata: ""
      },
      {
        id: "11",
        order: 10,
        blockType: "bulletList",
        content: "[ ] Write documentation for the new API endpoints",
        metadata: ""
      },
      {
        id: "12",
        order: 11,
        blockType: "heading2",
        content: "🚧 Blockers",
        metadata: ""
      },
      {
        id: "13",
        order: 12,
        blockType: "bulletList",
        content: "Waiting on Stripe test credentials from DevOps — needed to proceed with webhook handler",
        metadata: ""
      },
      {
        id: "14",
        order: 13,
        blockType: "paragraph",
        content: "Escalating to: @DevOps team — please share sandbox API keys by 11am",
        metadata: ""
      },
      {
        id: "15",
        order: 14,
        blockType: "heading2",
        content: "📝 Notes",
        metadata: ""
      },
      {
        id: "16",
        order: 15,
        blockType: "paragraph",
        content: "OOO tomorrow afternoon — async standup via Slack by 10am",
        metadata: ""
      }
    ]),
    workspaceId: "",
    authorId: {},
    createdAt: BigInt(0)
  },
  {
    id: "tpl-one-on-one",
    tenantId: "system",
    name: "One-on-One Meeting",
    description: "Manager/report 1:1 with wins, development, goals, and action items",
    icon: "👤",
    blocksJson: JSON.stringify([
      {
        id: "1",
        order: 0,
        blockType: "heading1",
        content: "One-on-One Meeting",
        metadata: ""
      },
      {
        id: "2",
        order: 1,
        blockType: "paragraph",
        content: "📅 Date: [Date]   |   👔 Manager: [Name]   |   👤 Report: [Name]   |   ⏱️ Duration: 30–45 min",
        metadata: ""
      },
      {
        id: "3",
        order: 2,
        blockType: "callout",
        content: "This is your time. Come with topics that matter to you. The agenda is shared — both sides can add to it before the meeting.",
        metadata: "💬"
      },
      {
        id: "4",
        order: 3,
        blockType: "heading2",
        content: "🏆 Wins Since Last 1:1",
        metadata: ""
      },
      {
        id: "5",
        order: 4,
        blockType: "paragraph",
        content: "What's the employee most proud of since we last met?",
        metadata: ""
      },
      {
        id: "6",
        order: 5,
        blockType: "bulletList",
        content: "Led the incident response for the outage on July 12 — resolved in under 2 hours",
        metadata: ""
      },
      {
        id: "7",
        order: 6,
        blockType: "bulletList",
        content: "Mentored two junior engineers on async patterns this sprint",
        metadata: ""
      },
      {
        id: "8",
        order: 7,
        blockType: "heading2",
        content: "💼 Current Project Status",
        metadata: ""
      },
      {
        id: "9",
        order: 8,
        blockType: "paragraph",
        content: "How are current projects going? Any concerns about scope, timeline, or quality?",
        metadata: ""
      },
      {
        id: "10",
        order: 9,
        blockType: "bulletList",
        content: "Authentication feature: on track, landing page is 80% complete",
        metadata: ""
      },
      {
        id: "11",
        order: 10,
        blockType: "bulletList",
        content: "Concern: the backend refactor scope is expanding — may slip by a week",
        metadata: ""
      },
      {
        id: "12",
        order: 11,
        blockType: "heading2",
        content: "🌱 Development & Career Goals",
        metadata: ""
      },
      {
        id: "13",
        order: 12,
        blockType: "paragraph",
        content: "What skills is the employee building? What are their 6–12 month career goals?",
        metadata: ""
      },
      {
        id: "14",
        order: 13,
        blockType: "bulletList",
        content: "Goal: Move into a senior engineer role within 12 months",
        metadata: ""
      },
      {
        id: "15",
        order: 14,
        blockType: "bulletList",
        content: "Development area: Improve system design skills — wants to lead next architecture review",
        metadata: ""
      },
      {
        id: "16",
        order: 15,
        blockType: "bulletList",
        content: "Development area: Public speaking — interested in giving a tech talk at the all-hands",
        metadata: ""
      },
      {
        id: "17",
        order: 16,
        blockType: "heading2",
        content: "🔄 Manager's Feedback",
        metadata: ""
      },
      {
        id: "18",
        order: 17,
        blockType: "paragraph",
        content: "Specific, recent, actionable feedback from manager:",
        metadata: ""
      },
      {
        id: "19",
        order: 18,
        blockType: "bulletList",
        content: "Strength: Strong ownership — you drive tasks to completion without being asked twice",
        metadata: ""
      },
      {
        id: "20",
        order: 19,
        blockType: "bulletList",
        content: "Opportunity: Be more vocal in group design reviews — your opinions are valuable",
        metadata: ""
      },
      {
        id: "21",
        order: 20,
        blockType: "heading2",
        content: "✅ Action Items",
        metadata: ""
      },
      {
        id: "22",
        order: 21,
        blockType: "bulletList",
        content: "[ ] @Report — Share system design resources with manager by next week",
        metadata: ""
      },
      {
        id: "23",
        order: 22,
        blockType: "bulletList",
        content: "[ ] @Manager — Connect report with principal engineer for architecture mentorship",
        metadata: ""
      },
      {
        id: "24",
        order: 23,
        blockType: "bulletList",
        content: "[ ] @Report — Raise the scope concern in the sprint planning meeting on Friday",
        metadata: ""
      }
    ]),
    workspaceId: "",
    authorId: {},
    createdAt: BigInt(0)
  },
  {
    id: "tpl-prd",
    tenantId: "system",
    name: "Product Requirements Doc",
    description: "Full product spec: problem, user stories, acceptance criteria, and timeline",
    icon: "📋",
    blocksJson: JSON.stringify([
      {
        id: "1",
        order: 0,
        blockType: "heading1",
        content: "Product Requirements Document",
        metadata: ""
      },
      {
        id: "2",
        order: 1,
        blockType: "callout",
        content: "Status: Draft   |   Owner: [PM Name]   |   Last Updated: [Date]   |   Version: 1.0",
        metadata: "📋"
      },
      {
        id: "3",
        order: 2,
        blockType: "heading2",
        content: "Problem Statement",
        metadata: ""
      },
      {
        id: "4",
        order: 3,
        blockType: "paragraph",
        content: "Teams using our platform spend an average of 4 hours per week manually exporting data to spreadsheets for reporting. This is error-prone and breaks down as team size grows. We need a native reporting feature that auto-generates the reports teams already do manually.",
        metadata: ""
      },
      {
        id: "5",
        order: 4,
        blockType: "heading2",
        content: "User Personas",
        metadata: ""
      },
      {
        id: "6",
        order: 5,
        blockType: "bulletList",
        content: "Operations Manager (primary) — creates weekly status reports, needs automation and scheduling",
        metadata: ""
      },
      {
        id: "7",
        order: 6,
        blockType: "bulletList",
        content: "Executive (secondary) — reads reports, needs high-level summaries and trend charts",
        metadata: ""
      },
      {
        id: "8",
        order: 7,
        blockType: "bulletList",
        content: "Team Member (tertiary) — wants to see personal performance data at a glance",
        metadata: ""
      },
      {
        id: "9",
        order: 8,
        blockType: "heading2",
        content: "User Stories",
        metadata: ""
      },
      {
        id: "10",
        order: 9,
        blockType: "bulletList",
        content: "As an Operations Manager, I want to schedule a weekly report so that it lands in my inbox every Monday morning without manual effort.",
        metadata: ""
      },
      {
        id: "11",
        order: 10,
        blockType: "bulletList",
        content: "As an Executive, I want to see a summary dashboard so that I can understand team performance in under 2 minutes.",
        metadata: ""
      },
      {
        id: "12",
        order: 11,
        blockType: "bulletList",
        content: "As a Team Member, I want to filter data by my name so that I can quickly review my own contributions.",
        metadata: ""
      },
      {
        id: "13",
        order: 12,
        blockType: "heading2",
        content: "Acceptance Criteria",
        metadata: ""
      },
      {
        id: "14",
        order: 13,
        blockType: "bulletList",
        content: "[ ] Reports can be scheduled on daily, weekly, or monthly cadences",
        metadata: ""
      },
      {
        id: "15",
        order: 14,
        blockType: "bulletList",
        content: "[ ] Exports are available as CSV and PDF",
        metadata: ""
      },
      {
        id: "16",
        order: 15,
        blockType: "bulletList",
        content: "[ ] Charts render correctly on mobile and desktop",
        metadata: ""
      },
      {
        id: "17",
        order: 16,
        blockType: "bulletList",
        content: "[ ] Report generation completes in under 10 seconds for up to 10,000 rows",
        metadata: ""
      },
      {
        id: "18",
        order: 17,
        blockType: "heading2",
        content: "Out of Scope",
        metadata: ""
      },
      {
        id: "19",
        order: 18,
        blockType: "bulletList",
        content: "Custom SQL query builder (Phase 2)",
        metadata: ""
      },
      {
        id: "20",
        order: 19,
        blockType: "bulletList",
        content: "White-label report branding for enterprise tier",
        metadata: ""
      },
      {
        id: "21",
        order: 20,
        blockType: "heading2",
        content: "Timeline",
        metadata: ""
      },
      {
        id: "22",
        order: 21,
        blockType: "bulletList",
        content: "Design: [Start] → [End]",
        metadata: ""
      },
      {
        id: "23",
        order: 22,
        blockType: "bulletList",
        content: "Development (Phase 1 — core): [Start] → [End]",
        metadata: ""
      },
      {
        id: "24",
        order: 23,
        blockType: "bulletList",
        content: "Beta / user testing: [Date]",
        metadata: ""
      },
      {
        id: "25",
        order: 24,
        blockType: "bulletList",
        content: "General availability launch: [Date]",
        metadata: ""
      }
    ]),
    workspaceId: "",
    authorId: {},
    createdAt: BigInt(0)
  },
  {
    id: "tpl-eng-design",
    tenantId: "system",
    name: "Engineering Design Doc",
    description: "Technical design with proposal, trade-offs, and implementation plan",
    icon: "⚙️",
    blocksJson: JSON.stringify([
      {
        id: "1",
        order: 0,
        blockType: "heading1",
        content: "Engineering Design Document",
        metadata: ""
      },
      {
        id: "2",
        order: 1,
        blockType: "callout",
        content: "Status: Draft   |   Author: [Name]   |   Reviewers: [Names]   |   Target decision date: [Date]",
        metadata: "⚙️"
      },
      {
        id: "3",
        order: 2,
        blockType: "heading2",
        content: "Summary",
        metadata: ""
      },
      {
        id: "4",
        order: 3,
        blockType: "paragraph",
        content: "We propose replacing the current polling-based notification system with a server-sent events (SSE) architecture to reduce latency from ~30 seconds to under 1 second for real-time updates, while cutting API server load by an estimated 40%.",
        metadata: ""
      },
      {
        id: "5",
        order: 4,
        blockType: "heading2",
        content: "Background & Motivation",
        metadata: ""
      },
      {
        id: "6",
        order: 5,
        blockType: "paragraph",
        content: "The current system polls the /notifications endpoint every 30 seconds per client. With 5,000 active users, this generates ~600K requests/hour. Users frequently miss time-sensitive events. Competitors offer real-time notification delivery — this is becoming a product gap.",
        metadata: ""
      },
      {
        id: "7",
        order: 6,
        blockType: "heading2",
        content: "Design Proposal",
        metadata: ""
      },
      {
        id: "8",
        order: 7,
        blockType: "paragraph",
        content: "Use Server-Sent Events (SSE) via a persistent HTTP connection. Each authenticated user maintains a single SSE connection. The server pushes events directly when they occur. No client-side polling needed. SSE is simpler than WebSockets for unidirectional push and works natively in all modern browsers.",
        metadata: ""
      },
      {
        id: "9",
        order: 8,
        blockType: "heading3",
        content: "Architecture",
        metadata: ""
      },
      {
        id: "10",
        order: 9,
        blockType: "bulletList",
        content: "Client opens GET /api/events with auth token — server holds connection open",
        metadata: ""
      },
      {
        id: "11",
        order: 10,
        blockType: "bulletList",
        content: "EventBus dispatches notifications to SSE handler via in-process pub/sub",
        metadata: ""
      },
      {
        id: "12",
        order: 11,
        blockType: "bulletList",
        content: "SSE handler serializes and streams event to client",
        metadata: ""
      },
      {
        id: "13",
        order: 12,
        blockType: "bulletList",
        content: "Client reconnects automatically on disconnect (built-in browser behavior)",
        metadata: ""
      },
      {
        id: "14",
        order: 13,
        blockType: "heading2",
        content: "Alternatives Considered",
        metadata: ""
      },
      {
        id: "15",
        order: 14,
        blockType: "bulletList",
        content: "Option A: WebSockets — Pros: bidirectional, low latency. Cons: complex protocol, harder to scale, overkill for notifications-only use case.",
        metadata: ""
      },
      {
        id: "16",
        order: 15,
        blockType: "bulletList",
        content: "Option B: Continue polling with reduced interval (5s) — Pros: no backend change. Cons: 6× more requests, still 5s lag, doesn't fix the core problem.",
        metadata: ""
      },
      {
        id: "17",
        order: 16,
        blockType: "bulletList",
        content: "Option C: SSE (chosen) — Pros: simple, HTTP-native, browser-supported, low overhead. Cons: unidirectional only (acceptable for notifications).",
        metadata: ""
      },
      {
        id: "18",
        order: 17,
        blockType: "heading2",
        content: "Implementation Plan",
        metadata: ""
      },
      {
        id: "19",
        order: 18,
        blockType: "numberedList",
        content: "Phase 1: Build SSE endpoint and EventBus integration (1 week)",
        metadata: ""
      },
      {
        id: "20",
        order: 19,
        blockType: "numberedList",
        content: "Phase 2: Update frontend to subscribe to SSE and remove polling (3 days)",
        metadata: ""
      },
      {
        id: "21",
        order: 20,
        blockType: "numberedList",
        content: "Phase 3: Load test with simulated 10K concurrent connections (2 days)",
        metadata: ""
      },
      {
        id: "22",
        order: 21,
        blockType: "numberedList",
        content: "Phase 4: Canary deploy to 5% of users, monitor for 48h (2 days)",
        metadata: ""
      },
      {
        id: "23",
        order: 22,
        blockType: "numberedList",
        content: "Phase 5: Full rollout and deprecate polling endpoint (1 day)",
        metadata: ""
      },
      {
        id: "24",
        order: 23,
        blockType: "heading2",
        content: "Open Questions",
        metadata: ""
      },
      {
        id: "25",
        order: 24,
        blockType: "bulletList",
        content: "[ ] How do we handle SSE connections behind corporate proxies that timeout idle connections?",
        metadata: ""
      },
      {
        id: "26",
        order: 25,
        blockType: "bulletList",
        content: "[ ] Should we add a heartbeat ping every 25 seconds to prevent proxy timeouts?",
        metadata: ""
      },
      {
        id: "27",
        order: 26,
        blockType: "bulletList",
        content: "[ ] Maximum concurrent SSE connections per server instance — needs benchmarking",
        metadata: ""
      }
    ]),
    workspaceId: "",
    authorId: {},
    createdAt: BigInt(0)
  },
  {
    id: "tpl-retrospective",
    tenantId: "system",
    name: "Retrospective",
    description: "Agile sprint retro with what went well, improvements, and action items",
    icon: "🔄",
    blocksJson: JSON.stringify([
      {
        id: "1",
        order: 0,
        blockType: "heading1",
        content: "Sprint Retrospective",
        metadata: ""
      },
      {
        id: "2",
        order: 1,
        blockType: "paragraph",
        content: "🗓️ Sprint: [Sprint #]   |   👥 Team: [Team name]   |   📅 Date: [Date]   |   Facilitator: [Name]",
        metadata: ""
      },
      {
        id: "3",
        order: 2,
        blockType: "callout",
        content: "All voices welcome. Retros are a safe space — speak candidly, listen openly, and leave with clear actions.",
        metadata: "🔄"
      },
      {
        id: "4",
        order: 3,
        blockType: "heading2",
        content: "Sprint Overview",
        metadata: ""
      },
      {
        id: "5",
        order: 4,
        blockType: "paragraph",
        content: "Sprint goal: Deliver the redesigned dashboard and fix the top 5 reported bugs. Velocity: 42 story points (target: 45). Overall: strong sprint — one ticket slipped due to an unexpected infrastructure issue.",
        metadata: ""
      },
      {
        id: "6",
        order: 5,
        blockType: "heading2",
        content: "🟢 What Went Well",
        metadata: ""
      },
      {
        id: "7",
        order: 6,
        blockType: "bulletList",
        content: "✅ Dashboard redesign shipped on time and received positive feedback in user testing",
        metadata: ""
      },
      {
        id: "8",
        order: 7,
        blockType: "bulletList",
        content: "✅ Daily standups were focused and stayed under 15 minutes every day",
        metadata: ""
      },
      {
        id: "9",
        order: 8,
        blockType: "bulletList",
        content: "✅ Strong cross-team collaboration between design and engineering on the new components",
        metadata: ""
      },
      {
        id: "10",
        order: 9,
        blockType: "bulletList",
        content: "✅ 4 of 5 target bugs resolved — QA turnaround improved vs. last sprint",
        metadata: ""
      },
      {
        id: "11",
        order: 10,
        blockType: "heading2",
        content: "🔴 What Didn't Go Well",
        metadata: ""
      },
      {
        id: "12",
        order: 11,
        blockType: "bulletList",
        content: "❌ The data migration ticket slipped — underestimated complexity of the legacy schema",
        metadata: ""
      },
      {
        id: "13",
        order: 12,
        blockType: "bulletList",
        content: "❌ Mid-sprint scope change from leadership disrupted two engineers for a full day",
        metadata: ""
      },
      {
        id: "14",
        order: 13,
        blockType: "bulletList",
        content: "❌ PR review turnaround was slow — several PRs sat for 48+ hours",
        metadata: ""
      },
      {
        id: "15",
        order: 14,
        blockType: "heading2",
        content: "✅ Action Items for Next Sprint",
        metadata: ""
      },
      {
        id: "16",
        order: 15,
        blockType: "bulletList",
        content: "[ ] @TeamLead — Implement a 24-hour PR review SLA starting next sprint",
        metadata: ""
      },
      {
        id: "17",
        order: 16,
        blockType: "bulletList",
        content: "[ ] @PM — Establish a change freeze for the first 3 days of each sprint",
        metadata: ""
      },
      {
        id: "18",
        order: 17,
        blockType: "bulletList",
        content: "[ ] @DataEng — Spike the legacy schema migration to produce a realistic estimate",
        metadata: ""
      },
      {
        id: "19",
        order: 18,
        blockType: "bulletList",
        content: "[ ] @Everyone — Add complexity flags to tickets during refinement when schema changes are involved",
        metadata: ""
      }
    ]),
    workspaceId: "",
    authorId: {},
    createdAt: BigInt(0)
  },
  {
    id: "tpl-decision-log",
    tenantId: "system",
    name: "Decision Log",
    description: "Track major decisions with context, options considered, and rationale",
    icon: "📌",
    blocksJson: JSON.stringify([
      {
        id: "1",
        order: 0,
        blockType: "heading1",
        content: "Decision Log",
        metadata: ""
      },
      {
        id: "2",
        order: 1,
        blockType: "callout",
        content: "Document every major decision here while the context is fresh. Future team members will thank you for the 'why', not just the 'what'.",
        metadata: "📌"
      },
      {
        id: "3",
        order: 2,
        blockType: "heading2",
        content: "Decision Summary",
        metadata: ""
      },
      {
        id: "4",
        order: 3,
        blockType: "paragraph",
        content: "We will adopt PostgreSQL as the primary database for the new billing service, replacing the current MongoDB setup.",
        metadata: ""
      },
      {
        id: "5",
        order: 4,
        blockType: "paragraph",
        content: "📅 Date: [Date]   |   👥 Decision makers: [Names]   |   Status: ✅ Approved",
        metadata: ""
      },
      {
        id: "6",
        order: 5,
        blockType: "heading2",
        content: "Context & Background",
        metadata: ""
      },
      {
        id: "7",
        order: 6,
        blockType: "paragraph",
        content: "The billing service handles financial transactions that require ACID compliance. Our current MongoDB-based approach has caused data inconsistency issues in 3 incidents this quarter. The team evaluated whether to fix the existing setup or migrate to a relational database.",
        metadata: ""
      },
      {
        id: "8",
        order: 7,
        blockType: "heading2",
        content: "Options Considered",
        metadata: ""
      },
      {
        id: "9",
        order: 8,
        blockType: "bulletList",
        content: "Option A — Harden MongoDB setup: Pros: no migration cost, team familiarity. Cons: requires multi-document transactions (performance overhead), schema flexibility is unnecessary for billing, does not fully resolve ACID concerns.",
        metadata: ""
      },
      {
        id: "10",
        order: 9,
        blockType: "bulletList",
        content: "Option B — Migrate to PostgreSQL (chosen): Pros: full ACID compliance, strong financial data tooling, team has PostgreSQL expertise. Cons: 2-week migration effort, temporary dual-write period required.",
        metadata: ""
      },
      {
        id: "11",
        order: 10,
        blockType: "bulletList",
        content: "Option C — Use a third-party billing platform (Stripe Billing): Pros: zero maintenance. Cons: loses flexibility for custom billing logic, would require major refactor of downstream systems.",
        metadata: ""
      },
      {
        id: "12",
        order: 11,
        blockType: "heading2",
        content: "Decision Rationale",
        metadata: ""
      },
      {
        id: "13",
        order: 12,
        blockType: "paragraph",
        content: "PostgreSQL provides the ACID guarantees required for financial data, is well-supported by our infrastructure team, and aligns with the rest of the platform's stack direction. The 2-week migration cost is justified by eliminating the class of consistency bugs we've been fighting.",
        metadata: ""
      },
      {
        id: "14",
        order: 13,
        blockType: "heading2",
        content: "Risks & Mitigations",
        metadata: ""
      },
      {
        id: "15",
        order: 14,
        blockType: "bulletList",
        content: "Risk: Data loss during migration → Mitigation: Dual-write for 72h with full audit log comparison before cutover",
        metadata: ""
      },
      {
        id: "16",
        order: 15,
        blockType: "bulletList",
        content: "Risk: Team PostgreSQL knowledge gaps → Mitigation: 2-day internal workshop scheduled for next week",
        metadata: ""
      }
    ]),
    workspaceId: "",
    authorId: {},
    createdAt: BigInt(0)
  },
  {
    id: "tpl-customer-interview",
    tenantId: "system",
    name: "Customer Interview Notes",
    description: "User research template with goals, questions, and key insights",
    icon: "🎤",
    blocksJson: JSON.stringify([
      {
        id: "1",
        order: 0,
        blockType: "heading1",
        content: "Customer Interview Notes",
        metadata: ""
      },
      {
        id: "2",
        order: 1,
        blockType: "paragraph",
        content: "🎤 Interviewer: [Name]   |   📅 Date: [Date]   |   ⏱️ Duration: 45 min   |   📋 Session #: [#]",
        metadata: ""
      },
      {
        id: "3",
        order: 2,
        blockType: "callout",
        content: "Ask open-ended questions. Listen more than you talk. Note direct quotes with quotation marks — they're the most powerful artifacts from the interview.",
        metadata: "💡"
      },
      {
        id: "4",
        order: 3,
        blockType: "heading2",
        content: "Customer Profile",
        metadata: ""
      },
      {
        id: "5",
        order: 4,
        blockType: "bulletList",
        content: "Name/Role: [e.g. Jamie Chen, Head of Operations]",
        metadata: ""
      },
      {
        id: "6",
        order: 5,
        blockType: "bulletList",
        content: "Company: [e.g. Meridian Logistics, 80 employees, Series A]",
        metadata: ""
      },
      {
        id: "7",
        order: 6,
        blockType: "bulletList",
        content: "Current tools: [e.g. Airtable, Slack, Google Sheets]",
        metadata: ""
      },
      {
        id: "8",
        order: 7,
        blockType: "bulletList",
        content: "How they found us: [e.g. referral from a colleague]",
        metadata: ""
      },
      {
        id: "9",
        order: 8,
        blockType: "heading2",
        content: "Interview Goal",
        metadata: ""
      },
      {
        id: "10",
        order: 9,
        blockType: "paragraph",
        content: "Understand how operations leads at logistics companies currently track team performance and what frustrates them about existing solutions.",
        metadata: ""
      },
      {
        id: "11",
        order: 10,
        blockType: "heading2",
        content: "Key Questions",
        metadata: ""
      },
      {
        id: "12",
        order: 11,
        blockType: "numberedList",
        content: "Walk me through how you track team performance today — from start to end.",
        metadata: ""
      },
      {
        id: "13",
        order: 12,
        blockType: "numberedList",
        content: "What's the most frustrating part of that process?",
        metadata: ""
      },
      {
        id: "14",
        order: 13,
        blockType: "numberedList",
        content: "Tell me about a time when your current tools let you down — what happened?",
        metadata: ""
      },
      {
        id: "15",
        order: 14,
        blockType: "numberedList",
        content: "If you could wave a magic wand and change one thing about your current workflow, what would it be?",
        metadata: ""
      },
      {
        id: "16",
        order: 15,
        blockType: "numberedList",
        content: "How does your team currently share performance data with leadership?",
        metadata: ""
      },
      {
        id: "17",
        order: 16,
        blockType: "heading2",
        content: "Responses & Key Quotes",
        metadata: ""
      },
      {
        id: "18",
        order: 17,
        blockType: "paragraph",
        content: "Record verbatim quotes where possible. Use quotation marks.",
        metadata: ""
      },
      {
        id: "19",
        order: 18,
        blockType: "bulletList",
        content: `Q1: "We use Airtable for tracking but it breaks every time we add a new team. By the end of the week it's a mess."`,
        metadata: ""
      },
      {
        id: "20",
        order: 19,
        blockType: "bulletList",
        content: `Q3: "Last month I spent an entire Friday building a report that I needed Monday morning. That's not sustainable."`,
        metadata: ""
      },
      {
        id: "21",
        order: 20,
        blockType: "heading2",
        content: "Insights & Patterns",
        metadata: ""
      },
      {
        id: "22",
        order: 21,
        blockType: "bulletList",
        content: "Manual reporting is the primary pain point — operations leads spend 4–6 hours/week on it",
        metadata: ""
      },
      {
        id: "23",
        order: 22,
        blockType: "bulletList",
        content: "Existing tools (Airtable, Sheets) don't scale beyond ~50 people — break points are frequent",
        metadata: ""
      },
      {
        id: "24",
        order: 23,
        blockType: "bulletList",
        content: "Leadership visibility is a shared concern — executives want dashboards, not raw data",
        metadata: ""
      },
      {
        id: "25",
        order: 24,
        blockType: "heading2",
        content: "Recommended Actions",
        metadata: ""
      },
      {
        id: "26",
        order: 25,
        blockType: "bulletList",
        content: "[ ] Prioritize automated reporting feature in Q3 roadmap",
        metadata: ""
      },
      {
        id: "27",
        order: 26,
        blockType: "bulletList",
        content: "[ ] Test executive summary dashboard concept in next round of interviews",
        metadata: ""
      }
    ]),
    workspaceId: "",
    authorId: {},
    createdAt: BigInt(0)
  },
  {
    id: "tpl-brainstorm",
    tenantId: "system",
    name: "Brainstorm Session",
    description: "Ideation with HMW questions, ideas, top picks, and next steps",
    icon: "💡",
    blocksJson: JSON.stringify([
      {
        id: "1",
        order: 0,
        blockType: "heading1",
        content: "Brainstorm Session",
        metadata: ""
      },
      {
        id: "2",
        order: 1,
        blockType: "paragraph",
        content: "📅 Date: [Date]   |   👥 Participants: [Names]   |   ⏱️ Duration: 60 min   |   Facilitator: [Name]",
        metadata: ""
      },
      {
        id: "3",
        order: 2,
        blockType: "callout",
        content: "Rule 1: No bad ideas during ideation. Rule 2: Build on each other's ideas. Rule 3: Go for quantity first, quality later. Defer judgment until the voting round.",
        metadata: "💡"
      },
      {
        id: "4",
        order: 3,
        blockType: "heading2",
        content: "Problem Statement",
        metadata: ""
      },
      {
        id: "5",
        order: 4,
        blockType: "paragraph",
        content: "New users who sign up for a free trial leave before completing setup — 58% never return after day 2. We need to dramatically improve the first-week experience.",
        metadata: ""
      },
      {
        id: "6",
        order: 5,
        blockType: "heading2",
        content: "How Might We…",
        metadata: ""
      },
      {
        id: "7",
        order: 6,
        blockType: "bulletList",
        content: "How might we make the first action so obvious a 5-year-old could do it?",
        metadata: ""
      },
      {
        id: "8",
        order: 7,
        blockType: "bulletList",
        content: "How might we celebrate the user's first win immediately?",
        metadata: ""
      },
      {
        id: "9",
        order: 8,
        blockType: "bulletList",
        content: "How might we personalize the experience based on the user's role?",
        metadata: ""
      },
      {
        id: "10",
        order: 9,
        blockType: "bulletList",
        content: "How might we turn the setup process into something users look forward to?",
        metadata: ""
      },
      {
        id: "11",
        order: 10,
        blockType: "heading2",
        content: "Ideas (Dump Everything)",
        metadata: ""
      },
      {
        id: "12",
        order: 11,
        blockType: "bulletList",
        content: "Interactive demo that pre-populates with the user's real data",
        metadata: ""
      },
      {
        id: "13",
        order: 12,
        blockType: "bulletList",
        content: "Progress bar with % complete and reward at 100% (e.g. unlock a premium feature)",
        metadata: ""
      },
      {
        id: "14",
        order: 13,
        blockType: "bulletList",
        content: '"Quick win" template — user can create their first project in 60 seconds',
        metadata: ""
      },
      {
        id: "15",
        order: 14,
        blockType: "bulletList",
        content: "Short video walkthrough (90 sec) that plays automatically on first login",
        metadata: ""
      },
      {
        id: "16",
        order: 15,
        blockType: "bulletList",
        content: "Role-based onboarding — different setup paths for managers vs. team members",
        metadata: ""
      },
      {
        id: "17",
        order: 16,
        blockType: "bulletList",
        content: "Live chat bubble that appears after 2 minutes of inactivity",
        metadata: ""
      },
      {
        id: "18",
        order: 17,
        blockType: "bulletList",
        content: "Email sequence that sends usage tips based on what the user hasn't done yet",
        metadata: ""
      },
      {
        id: "19",
        order: 18,
        blockType: "heading2",
        content: "Top 3 Ideas to Explore",
        metadata: ""
      },
      {
        id: "20",
        order: 19,
        blockType: "numberedList",
        content: "Role-based onboarding paths — highest potential for personalization without added complexity",
        metadata: ""
      },
      {
        id: "21",
        order: 20,
        blockType: "numberedList",
        content: "Progress bar + reward unlock — low effort, likely high engagement",
        metadata: ""
      },
      {
        id: "22",
        order: 21,
        blockType: "numberedList",
        content: "Behavioral email tips — complements in-app onboarding, easy to A/B test",
        metadata: ""
      },
      {
        id: "23",
        order: 22,
        blockType: "heading2",
        content: "Next Steps",
        metadata: ""
      },
      {
        id: "24",
        order: 23,
        blockType: "bulletList",
        content: "[ ] @Product — Prototype role-based onboarding flow by end of week",
        metadata: ""
      },
      {
        id: "25",
        order: 24,
        blockType: "bulletList",
        content: "[ ] @Growth — Draft 3-email sequence for behavioral tips",
        metadata: ""
      },
      {
        id: "26",
        order: 25,
        blockType: "bulletList",
        content: "[ ] @Design — Sketch progress bar component in Figma",
        metadata: ""
      }
    ]),
    workspaceId: "",
    authorId: {},
    createdAt: BigInt(0)
  },
  {
    id: "tpl-bug-report-note",
    tenantId: "system",
    name: "Bug Report",
    description: "Structured developer bug report with reproduction steps and severity",
    icon: "🐛",
    blocksJson: JSON.stringify([
      {
        id: "1",
        order: 0,
        blockType: "heading1",
        content: "Bug Report",
        metadata: ""
      },
      {
        id: "2",
        order: 1,
        blockType: "callout",
        content: "Reproducible bugs get fixed faster. The more detail you provide, the quicker engineering can identify the root cause.",
        metadata: "🐛"
      },
      {
        id: "3",
        order: 2,
        blockType: "paragraph",
        content: "🆔 Ticket #: [ID]   |   📅 Reported: [Date]   |   👤 Reporter: [Name]   |   🔴 Severity: [Critical / High / Medium / Low]",
        metadata: ""
      },
      {
        id: "4",
        order: 3,
        blockType: "heading2",
        content: "Bug Summary",
        metadata: ""
      },
      {
        id: "5",
        order: 4,
        blockType: "paragraph",
        content: 'Example: Clicking "Export to CSV" on the reports page downloads an empty file when date filters are applied.',
        metadata: ""
      },
      {
        id: "6",
        order: 5,
        blockType: "heading2",
        content: "Steps to Reproduce",
        metadata: ""
      },
      {
        id: "7",
        order: 6,
        blockType: "numberedList",
        content: "Log in with any account that has at least 10 rows of data",
        metadata: ""
      },
      {
        id: "8",
        order: 7,
        blockType: "numberedList",
        content: "Navigate to Reports → Activity Report",
        metadata: ""
      },
      {
        id: "9",
        order: 8,
        blockType: "numberedList",
        content: "Apply a date filter: set Start to Jan 1, End to Jan 31",
        metadata: ""
      },
      {
        id: "10",
        order: 9,
        blockType: "numberedList",
        content: 'Click "Export to CSV"',
        metadata: ""
      },
      {
        id: "11",
        order: 10,
        blockType: "numberedList",
        content: "Open the downloaded file",
        metadata: ""
      },
      {
        id: "12",
        order: 11,
        blockType: "heading2",
        content: "Expected Behavior",
        metadata: ""
      },
      {
        id: "13",
        order: 12,
        blockType: "paragraph",
        content: "The downloaded CSV file should contain all rows that match the applied date filter — in this case, 47 rows of activity data from January.",
        metadata: ""
      },
      {
        id: "14",
        order: 13,
        blockType: "heading2",
        content: "Actual Behavior",
        metadata: ""
      },
      {
        id: "15",
        order: 14,
        blockType: "paragraph",
        content: "The downloaded file is empty (0 bytes). The file header row is missing as well. No error message is shown to the user.",
        metadata: ""
      },
      {
        id: "16",
        order: 15,
        blockType: "heading2",
        content: "Environment",
        metadata: ""
      },
      {
        id: "17",
        order: 16,
        blockType: "bulletList",
        content: "Browser: Chrome 115.0.5790.110 (also reproduced in Firefox 116)",
        metadata: ""
      },
      {
        id: "18",
        order: 17,
        blockType: "bulletList",
        content: "OS: macOS Ventura 13.4",
        metadata: ""
      },
      {
        id: "19",
        order: 18,
        blockType: "bulletList",
        content: "App version: v2.14.3 (production)",
        metadata: ""
      },
      {
        id: "20",
        order: 19,
        blockType: "bulletList",
        content: "Account: [Test account ID if applicable]",
        metadata: ""
      },
      {
        id: "21",
        order: 20,
        blockType: "heading2",
        content: "Screenshots / Logs",
        metadata: ""
      },
      {
        id: "22",
        order: 21,
        blockType: "paragraph",
        content: "Attach screenshots, screen recordings, or browser console errors here. Console showed: TypeError: Cannot read properties of null (reading 'map') at exportService.ts:142",
        metadata: ""
      },
      {
        id: "23",
        order: 22,
        blockType: "heading2",
        content: "Severity & Impact",
        metadata: ""
      },
      {
        id: "24",
        order: 23,
        blockType: "bulletList",
        content: "Severity: High — core feature is broken for all filtered exports",
        metadata: ""
      },
      {
        id: "25",
        order: 24,
        blockType: "bulletList",
        content: "Affected users: Anyone using date filters on the reports page (~300 active users)",
        metadata: ""
      },
      {
        id: "26",
        order: 25,
        blockType: "bulletList",
        content: "Workaround: Removing date filters produces a working (but unfiltered) export",
        metadata: ""
      }
    ]),
    workspaceId: "",
    authorId: {},
    createdAt: BigInt(0)
  },
  {
    id: "tpl-project-retro",
    tenantId: "system",
    name: "Project Retrospective",
    description: "End-of-project review with goals vs. actuals and lessons learned",
    icon: "🏁",
    blocksJson: JSON.stringify([
      {
        id: "1",
        order: 0,
        blockType: "heading1",
        content: "Project Retrospective",
        metadata: ""
      },
      {
        id: "2",
        order: 1,
        blockType: "paragraph",
        content: "📌 Project: [Name]   |   📅 Dates: [Start] → [End]   |   👥 Team: [Names]   |   🗓️ Retro date: [Date]",
        metadata: ""
      },
      {
        id: "3",
        order: 2,
        blockType: "callout",
        content: "The purpose is learning, not blame. Focus on systems and processes — not individuals.",
        metadata: "🏁"
      },
      {
        id: "4",
        order: 3,
        blockType: "heading2",
        content: "Project Summary",
        metadata: ""
      },
      {
        id: "5",
        order: 4,
        blockType: "paragraph",
        content: "The Billing 2.0 project redesigned the end-to-end billing system, including subscription management, invoice generation, and payment retry logic. The project shipped to all users on September 30.",
        metadata: ""
      },
      {
        id: "6",
        order: 5,
        blockType: "heading2",
        content: "Goals vs. Actuals",
        metadata: ""
      },
      {
        id: "7",
        order: 6,
        blockType: "bulletList",
        content: "Timeline — Goal: 8 weeks. Actual: 11 weeks (+3 weeks due to scope expansion)",
        metadata: ""
      },
      {
        id: "8",
        order: 7,
        blockType: "bulletList",
        content: "Budget — Goal: $120K. Actual: $134K (+11%)",
        metadata: ""
      },
      {
        id: "9",
        order: 8,
        blockType: "bulletList",
        content: "Scope — All planned features shipped + 2 additional integrations added mid-project",
        metadata: ""
      },
      {
        id: "10",
        order: 9,
        blockType: "bulletList",
        content: "Quality — 2 P1 bugs found post-launch (both resolved within 24h)",
        metadata: ""
      },
      {
        id: "11",
        order: 10,
        blockType: "heading2",
        content: "Team Highlights",
        metadata: ""
      },
      {
        id: "12",
        order: 11,
        blockType: "bulletList",
        content: "Marcus delivered an outstanding performance on the payment retry engine — handled unexpected complexity with zero dropped balls",
        metadata: ""
      },
      {
        id: "13",
        order: 12,
        blockType: "bulletList",
        content: "Cross-team collaboration between Finance and Engineering was the best it has ever been",
        metadata: ""
      },
      {
        id: "14",
        order: 13,
        blockType: "heading2",
        content: "Lessons Learned",
        metadata: ""
      },
      {
        id: "15",
        order: 14,
        blockType: "numberedList",
        content: "Scope changes must go through a formal change request — two mid-project additions cost us 3 weeks without going through proper evaluation",
        metadata: ""
      },
      {
        id: "16",
        order: 15,
        blockType: "numberedList",
        content: "Involve QA from week 1, not week 6 — many bugs caught late could have been prevented with earlier test case design",
        metadata: ""
      },
      {
        id: "17",
        order: 16,
        blockType: "numberedList",
        content: "External dependencies (3rd party APIs) need buffer time built into the project plan — assume 1 week delay for each integration",
        metadata: ""
      },
      {
        id: "18",
        order: 17,
        blockType: "heading2",
        content: "Recommendations for Future Projects",
        metadata: ""
      },
      {
        id: "19",
        order: 18,
        blockType: "bulletList",
        content: "[ ] Use a formal change request process for any scope addition after kickoff",
        metadata: ""
      },
      {
        id: "20",
        order: 19,
        blockType: "bulletList",
        content: "[ ] Include QA in sprint planning from day one",
        metadata: ""
      },
      {
        id: "21",
        order: 20,
        blockType: "bulletList",
        content: "[ ] Add 20% buffer to timelines when external API integrations are in scope",
        metadata: ""
      }
    ]),
    workspaceId: "",
    authorId: {},
    createdAt: BigInt(0)
  },
  {
    id: "tpl-team-update",
    tenantId: "system",
    name: "Team Update",
    description: "Weekly or monthly team update with highlights and upcoming priorities",
    icon: "📢",
    blocksJson: JSON.stringify([
      {
        id: "1",
        order: 0,
        blockType: "heading1",
        content: "Team Update",
        metadata: ""
      },
      {
        id: "2",
        order: 1,
        blockType: "paragraph",
        content: "📅 Week of: [Date range]   |   ✍️ Author: [Name]   |   👥 Audience: [e.g. Engineering team, leadership]",
        metadata: ""
      },
      {
        id: "3",
        order: 2,
        blockType: "callout",
        content: "Keep this concise and scannable. Leadership reads in 2 minutes. Use bold for decisions and bullet points for everything else.",
        metadata: "📢"
      },
      {
        id: "4",
        order: 3,
        blockType: "heading2",
        content: "🏆 This Week's Accomplishments",
        metadata: ""
      },
      {
        id: "5",
        order: 4,
        blockType: "bulletList",
        content: "Launched redesigned checkout flow to 100% of users — early data shows +12% conversion lift",
        metadata: ""
      },
      {
        id: "6",
        order: 5,
        blockType: "bulletList",
        content: "Resolved 43 of 47 open support tickets — 91% resolution rate (team record)",
        metadata: ""
      },
      {
        id: "7",
        order: 6,
        blockType: "bulletList",
        content: "Completed security audit for payment module — zero critical findings",
        metadata: ""
      },
      {
        id: "8",
        order: 7,
        blockType: "heading2",
        content: "🔄 In Progress",
        metadata: ""
      },
      {
        id: "9",
        order: 8,
        blockType: "bulletList",
        content: "API documentation rewrite — 70% complete, targeting next Friday",
        metadata: ""
      },
      {
        id: "10",
        order: 9,
        blockType: "bulletList",
        content: "Database migration for reports module — running in staging, full production cutover next week",
        metadata: ""
      },
      {
        id: "11",
        order: 10,
        blockType: "heading2",
        content: "🚧 Blockers Needing Escalation",
        metadata: ""
      },
      {
        id: "12",
        order: 11,
        blockType: "bulletList",
        content: "🔴 Sandbox API credentials from Twilio still outstanding — blocking SMS notification feature. Owner: DevOps. Need by: Monday",
        metadata: ""
      },
      {
        id: "13",
        order: 12,
        blockType: "heading2",
        content: "📅 Upcoming Milestones",
        metadata: ""
      },
      {
        id: "14",
        order: 13,
        blockType: "bulletList",
        content: "[ ] API docs v2 — due [Date]",
        metadata: ""
      },
      {
        id: "15",
        order: 14,
        blockType: "bulletList",
        content: "[ ] Reports DB migration to production — due [Date]",
        metadata: ""
      },
      {
        id: "16",
        order: 15,
        blockType: "bulletList",
        content: "[ ] Sprint 24 kickoff — [Date]",
        metadata: ""
      },
      {
        id: "17",
        order: 16,
        blockType: "heading2",
        content: "🌟 Team Spotlight",
        metadata: ""
      },
      {
        id: "18",
        order: 17,
        blockType: "paragraph",
        content: "A huge shoutout to @Anna for jumping in on the weekend to hotfix the invoice generation bug before Monday's billing cycle. Customers didn't notice — which is exactly the goal.",
        metadata: ""
      }
    ]),
    workspaceId: "",
    authorId: {},
    createdAt: BigInt(0)
  },
  {
    id: "tpl-proposal",
    tenantId: "system",
    name: "Proposal Template",
    description: "Business proposal with executive summary, solution, ROI, and next steps",
    icon: "📜",
    blocksJson: JSON.stringify([
      {
        id: "1",
        order: 0,
        blockType: "heading1",
        content: "Proposal",
        metadata: ""
      },
      {
        id: "2",
        order: 1,
        blockType: "callout",
        content: "Prepared for: [Client / Stakeholder]   |   Prepared by: [Your name / company]   |   Date: [Date]   |   Version: 1.0",
        metadata: "📜"
      },
      {
        id: "3",
        order: 2,
        blockType: "heading2",
        content: "Executive Summary",
        metadata: ""
      },
      {
        id: "4",
        order: 3,
        blockType: "paragraph",
        content: "We propose a 10-week engagement to migrate Meridian Logistics' operations tracking from fragmented spreadsheets to a unified platform. The initiative will reduce weekly reporting time by an estimated 6 hours per operations manager and provide leadership with a live dashboard — expected ROI of 4× within the first year.",
        metadata: ""
      },
      {
        id: "5",
        order: 4,
        blockType: "heading2",
        content: "Problem / Opportunity",
        metadata: ""
      },
      {
        id: "6",
        order: 5,
        blockType: "paragraph",
        content: "Meridian's operations team manages 12 separate spreadsheets across 4 departments. This creates data silos, error-prone manual aggregation, and a 2-day delay between events and visibility for leadership. As the company scales from 80 to 200 employees, this process will break entirely.",
        metadata: ""
      },
      {
        id: "7",
        order: 6,
        blockType: "heading2",
        content: "Proposed Solution",
        metadata: ""
      },
      {
        id: "8",
        order: 7,
        blockType: "paragraph",
        content: "Implement Fourthspace as the unified operations platform, replacing all 12 spreadsheets with a connected workspace. Includes custom onboarding, data migration, team training, and 90-day post-launch support.",
        metadata: ""
      },
      {
        id: "9",
        order: 8,
        blockType: "heading2",
        content: "Scope of Work",
        metadata: ""
      },
      {
        id: "10",
        order: 9,
        blockType: "bulletList",
        content: "Phase 1 — Discovery & Setup (Weeks 1–2): Requirements gathering, workspace configuration, user account provisioning",
        metadata: ""
      },
      {
        id: "11",
        order: 10,
        blockType: "bulletList",
        content: "Phase 2 — Migration (Weeks 3–6): Historical data migration, workflow mapping, integration with existing tools",
        metadata: ""
      },
      {
        id: "12",
        order: 11,
        blockType: "bulletList",
        content: "Phase 3 — Training & Launch (Weeks 7–8): Team onboarding sessions, documentation, pilot with 10 power users",
        metadata: ""
      },
      {
        id: "13",
        order: 12,
        blockType: "bulletList",
        content: "Phase 4 — Rollout & Support (Weeks 9–10): Full company rollout, 90-day support SLA, monthly check-in calls",
        metadata: ""
      },
      {
        id: "14",
        order: 13,
        blockType: "heading2",
        content: "Investment & Timeline",
        metadata: ""
      },
      {
        id: "15",
        order: 14,
        blockType: "bulletList",
        content: "Total investment: $28,500 (one-time setup + first year platform license)",
        metadata: ""
      },
      {
        id: "16",
        order: 15,
        blockType: "bulletList",
        content: "Timeline: 10 weeks from signed agreement to full launch",
        metadata: ""
      },
      {
        id: "17",
        order: 16,
        blockType: "bulletList",
        content: "Payment terms: 50% on signing, 50% on Phase 3 completion",
        metadata: ""
      },
      {
        id: "18",
        order: 17,
        blockType: "heading2",
        content: "ROI & Benefits",
        metadata: ""
      },
      {
        id: "19",
        order: 18,
        blockType: "bulletList",
        content: "6 hrs/week saved per operations manager × 4 managers = 24 hrs/week recaptured",
        metadata: ""
      },
      {
        id: "20",
        order: 19,
        blockType: "bulletList",
        content: "Leadership visibility within hours vs. 2-day lag — enables faster decision-making",
        metadata: ""
      },
      {
        id: "21",
        order: 20,
        blockType: "bulletList",
        content: "Scales to 200+ employees without additional process overhead",
        metadata: ""
      },
      {
        id: "22",
        order: 21,
        blockType: "heading2",
        content: "Next Steps",
        metadata: ""
      },
      {
        id: "23",
        order: 22,
        blockType: "bulletList",
        content: "[ ] Review proposal and share with internal stakeholders",
        metadata: ""
      },
      {
        id: "24",
        order: 23,
        blockType: "bulletList",
        content: "[ ] Schedule a 30-min Q&A call if questions arise",
        metadata: ""
      },
      {
        id: "25",
        order: 24,
        blockType: "bulletList",
        content: "[ ] Sign agreement to reserve project start date",
        metadata: ""
      }
    ]),
    workspaceId: "",
    authorId: {},
    createdAt: BigInt(0)
  },
  {
    id: "tpl-lesson-learned",
    tenantId: "system",
    name: "Lesson Learned",
    description: "Knowledge capture: situation, root cause, impact, and preventive actions",
    icon: "🎓",
    blocksJson: JSON.stringify([
      {
        id: "1",
        order: 0,
        blockType: "heading1",
        content: "Lesson Learned",
        metadata: ""
      },
      {
        id: "2",
        order: 1,
        blockType: "callout",
        content: "Write this within 48 hours of the event while details are fresh. Be specific — vague lessons don't help future teams. Focus on what the system should do differently, not individual blame.",
        metadata: "🎓"
      },
      {
        id: "3",
        order: 2,
        blockType: "paragraph",
        content: "📅 Date of event: [Date]   |   ✍️ Author: [Name]   |   👥 Team: [Team name]",
        metadata: ""
      },
      {
        id: "4",
        order: 3,
        blockType: "heading2",
        content: "Situation Context",
        metadata: ""
      },
      {
        id: "5",
        order: 4,
        blockType: "paragraph",
        content: "During the Q2 production deployment on June 14, a database migration script ran without a corresponding rollback script. When the new release introduced an unexpected bug, we were unable to roll back the schema change, extending the incident from 20 minutes to 4 hours.",
        metadata: ""
      },
      {
        id: "6",
        order: 5,
        blockType: "heading2",
        content: "What Happened",
        metadata: ""
      },
      {
        id: "7",
        order: 6,
        blockType: "bulletList",
        content: "14:03 — Deployment began, including a new database column migration",
        metadata: ""
      },
      {
        id: "8",
        order: 7,
        blockType: "bulletList",
        content: "14:18 — Post-deploy smoke test failed on the user profile endpoint",
        metadata: ""
      },
      {
        id: "9",
        order: 8,
        blockType: "bulletList",
        content: "14:22 — Decision to roll back — discovered no rollback migration script existed",
        metadata: ""
      },
      {
        id: "10",
        order: 9,
        blockType: "bulletList",
        content: "14:23–18:07 — Engineering wrote and tested an emergency rollback script under live pressure",
        metadata: ""
      },
      {
        id: "11",
        order: 10,
        blockType: "bulletList",
        content: "18:07 — Service fully restored; affected users: 1,200",
        metadata: ""
      },
      {
        id: "12",
        order: 11,
        blockType: "heading2",
        content: "Root Cause Analysis",
        metadata: ""
      },
      {
        id: "13",
        order: 12,
        blockType: "paragraph",
        content: "Primary cause: The deployment checklist did not include a requirement to write and review a rollback migration script before merging. Secondary cause: Code review did not flag the missing rollback script as a blocker.",
        metadata: ""
      },
      {
        id: "14",
        order: 13,
        blockType: "heading2",
        content: "Impact Assessment",
        metadata: ""
      },
      {
        id: "15",
        order: 14,
        blockType: "bulletList",
        content: "Users affected: ~1,200 (all users on Professional tier)",
        metadata: ""
      },
      {
        id: "16",
        order: 15,
        blockType: "bulletList",
        content: "Downtime: 3 hours 49 minutes",
        metadata: ""
      },
      {
        id: "17",
        order: 16,
        blockType: "bulletList",
        content: "Estimated revenue impact: ~$4,200 in SLA credits",
        metadata: ""
      },
      {
        id: "18",
        order: 17,
        blockType: "heading2",
        content: "What We'll Do Differently",
        metadata: ""
      },
      {
        id: "19",
        order: 18,
        blockType: "bulletList",
        content: "Every database migration PR must include a corresponding rollback migration — enforced via PR template checklist",
        metadata: ""
      },
      {
        id: "20",
        order: 19,
        blockType: "bulletList",
        content: "Code reviewers must verify rollback script exists before approving PRs with schema changes",
        metadata: ""
      },
      {
        id: "21",
        order: 20,
        blockType: "bulletList",
        content: "Rollback scripts are tested in staging before deployment to production",
        metadata: ""
      },
      {
        id: "22",
        order: 21,
        blockType: "heading2",
        content: "Preventive Measures",
        metadata: ""
      },
      {
        id: "23",
        order: 22,
        blockType: "bulletList",
        content: "[ ] Update PR template to require rollback script checkbox for all migration PRs",
        metadata: ""
      },
      {
        id: "24",
        order: 23,
        blockType: "bulletList",
        content: "[ ] Add staging rollback test step to deployment runbook",
        metadata: ""
      },
      {
        id: "25",
        order: 24,
        blockType: "bulletList",
        content: "[ ] Run a rollback drill in staging every quarter to verify scripts work",
        metadata: ""
      },
      {
        id: "26",
        order: 25,
        blockType: "bulletList",
        content: "[ ] Review all existing migration files for missing rollback scripts — backfill as needed",
        metadata: ""
      }
    ]),
    workspaceId: "",
    authorId: {},
    createdAt: BigInt(0)
  }
];
function PageCard({
  page,
  workspaceId
}) {
  var _a;
  const firstText = ((_a = page.blocks.find((b) => b.blockType === "paragraph" && b.content)) == null ? void 0 : _a.content) ?? "";
  const preview = firstText.slice(0, 90);
  const date = new Date(Number(page.updatedAt) / 1e6).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric" }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/app/$workspaceId/pages/$pageId",
      params: { workspaceId, pageId: page.id },
      "data-ocid": `page-card-${page.id}`,
      className: "group flex flex-col gap-2.5 rounded-xl border border-border/50 bg-card p-4 shadow-card card-interactive hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl shrink-0", children: page.icon || "📄" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-sm line-clamp-2 min-w-0 group-hover:text-primary transition-colors leading-snug pt-0.5", children: page.title || "Untitled" })
        ] }),
        preview && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 leading-relaxed", children: preview }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-auto pt-2 border-t border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: date }),
          page.blocks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground", children: [
            page.blocks.length,
            " block",
            page.blocks.length !== 1 ? "s" : ""
          ] })
        ] })
      ]
    }
  );
}
function TemplateCard({
  tpl,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      "data-ocid": `template-card-${tpl.id}`,
      className: "text-left rounded-xl border border-border/50 bg-card p-3.5 card-interactive hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group shadow-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: tpl.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-xs text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1", children: tpl.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 leading-relaxed", children: tpl.description })
      ]
    }
  );
}
function PagesPage() {
  const { workspaceId } = useParams({ from: "/app/$workspaceId/pages" });
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const navigate = useNavigate();
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["pages", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPages(tenantId, workspaceId, null);
    },
    enabled: !!actor && !isFetching
  });
  const recent = [...pages].sort((a, b) => Number(b.updatedAt - a.updatedAt)).slice(0, 8);
  const roots = pages.filter((p) => !p.parentPageId);
  const featuredTemplates = BUILT_IN_TEMPLATES.slice(0, 8);
  const handleTemplateClick = (tpl) => {
    navigate({
      to: "/app/$workspaceId/pages/new",
      params: { workspaceId },
      search: { templateId: tpl.id }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-6 max-w-6xl mx-auto space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground tracking-tight flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5 text-primary" }),
          " Pages"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          pages.length,
          " page",
          pages.length !== 1 ? "s" : "",
          " in your workspace"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          asChild: true,
          size: "sm",
          className: "gap-1.5 active-press",
          "data-ocid": "pages-new-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/$workspaceId/pages/new", params: { workspaceId }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            " New Page"
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: "Templates" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground", children: BUILT_IN_TEMPLATES.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            asChild: true,
            className: "text-xs text-muted-foreground hover:text-foreground gap-1 h-7",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/app/$workspaceId/notes/templates",
                params: { workspaceId },
                children: "View all →"
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5", children: featuredTemplates.map((tpl) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        TemplateCard,
        {
          tpl,
          onClick: () => handleTemplateClick(tpl)
        },
        tpl.id
      )) })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3", children: [1, 2, 3, 4].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border/50 bg-card p-4 space-y-2.5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" })
        ]
      },
      k
    )) }) : recent.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: "Recent" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3", children: recent.map((page) => /* @__PURE__ */ jsxRuntimeExports.jsx(PageCard, { page, workspaceId }, page.id)) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "pages-empty-state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-primary/10 p-5 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-10 w-10 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold text-foreground mb-1.5", children: "Create your first page" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mb-5", children: "Pages are flexible documents with rich blocks. Start from a template or a blank page." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              size: "sm",
              className: "gap-1.5 active-press",
              "data-ocid": "pages-empty-cta",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/$workspaceId/pages/new", params: { workspaceId }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                " New Page"
              ] })
            }
          )
        ]
      }
    ),
    roots.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground block mb-3", children: "All pages" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3", children: roots.map((page) => /* @__PURE__ */ jsxRuntimeExports.jsx(PageCard, { page, workspaceId }, page.id)) })
    ] })
  ] });
}
export {
  BUILT_IN_TEMPLATES,
  PagesPage as default
};
