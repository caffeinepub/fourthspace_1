import { m as useParams, f as useWorkspace, d as useNavigate, n as useQueryClient, j as jsxRuntimeExports, B as Button, i as Link, r as reactExports, F as FileText, C as Check } from "./index-CQ7TXF2a.js";
import { B as Badge } from "./badge-DOwzzuc_.js";
import { I as Input } from "./input-Dkit6sfw.js";
import { u as useMutation } from "./useMutation-fGi-GboX.js";
import { u as ue } from "./index-BGFcG_k-.js";
import { u as useBackend } from "./index--h8TKSCt.js";
import { A as ArrowLeft } from "./arrow-left-D6cz-lXM.js";
import { L as LoaderCircle } from "./loader-circle-CcnovRzn.js";
import { A as ArrowRight } from "./arrow-right-BQVQG0b_.js";
const NOTE_TEMPLATES = [
  {
    id: "meeting-notes",
    emoji: "📋",
    name: "Meeting Notes",
    description: "Capture agenda, decisions, and action items from any meeting.",
    preview: "## Meeting Details\nDate · Attendees · Objective",
    tags: ["meeting", "notes"],
    content: `## Meeting Details
**Date:** [Today's date]
**Attendees:** [List everyone present]
**Facilitator:** [Your name]
**Objective:** [One sentence — what does a successful meeting look like?]

---

## Agenda
1. [Agenda item 1] — 10 min
2. [Agenda item 2] — 15 min
3. [Agenda item 3] — 10 min
4. Open Q&A — 5 min

---

## Discussion Notes

### [Agenda item 1]
- Key point raised: ...
- Supporting context: ...
- Outcome: ...

### [Agenda item 2]
- Key point raised: ...
- Supporting context: ...
- Outcome: ...

---

## Decisions Made
- Decision 1: [What was decided and why]
- Decision 2: [What was decided and why]

---

## Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Task description] | @person | [date] | 🔴 Open |
| [Task description] | @person | [date] | 🔴 Open |

---

## Next Meeting
**Date:** [Next meeting date]
**Pre-read:** [Link or description]
`
  },
  {
    id: "project-brief",
    emoji: "🚀",
    name: "Project Brief",
    description: "Define scope, goals, and timeline before work begins.",
    preview: "## Project Overview\nGoal · Scope · Success criteria",
    tags: ["project", "planning"],
    content: `## Project Overview
**Project Name:** [Project name]
**Owner:** [Your name]
**Start Date:** [Start date]
**Target Completion:** [End date]
**Status:** 🟡 Planning

---

## Problem Statement
Describe the problem this project solves in 2-3 sentences. Be specific about who is affected, how often, and what the current workaround costs.

---

## Goals & Success Criteria
- **Goal 1:** [Measurable outcome]
- **Goal 2:** [Measurable outcome]
- **Goal 3:** [Measurable outcome]

**Out of scope:**
- [What this project will NOT address]

---

## Proposed Solution
High-level description of the approach. Include any key technical decisions or architectural choices already made.

---

## Timeline
| Phase | Description | Owner | Target Date |
|-------|-------------|-------|-------------|
| Discovery | Research & requirements | @person | [date] |
| Design | Wireframes & spec | @person | [date] |
| Build | Implementation | @person | [date] |
| QA | Testing & review | @person | [date] |
| Launch | Release & monitoring | @person | [date] |

---

## Stakeholders
| Name | Role | Decision Authority |
|------|------|--------------------|
| [Name] | Sponsor | Final sign-off |
| [Name] | Lead | Technical decisions |

---

## Risks & Dependencies
- **Risk:** [Description] → **Mitigation:** [How you'll address it]
- **Dependency:** [What this project depends on] → **Owner:** @person
`
  },
  {
    id: "weekly-review",
    emoji: "📅",
    name: "Weekly Review",
    description: "Reflect on wins, blockers, and priorities for the week ahead.",
    preview: "## Week of [date]\nAccomplishments · Blockers · Next week",
    tags: ["review", "weekly"],
    content: `## Week of [Date]
**Review completed:** [Today's date]
**Mood this week:** [😊 / 😐 / 😔]

---

## ✅ Accomplishments
What did you finish or make meaningful progress on?
- [Shipped X feature]
- [Completed Y deliverable]
- [Had productive conversation about Z]

---

## 🚧 In Progress (carrying over)
- [Task or project] — [current status, what's blocking]
- [Task or project] — [what's left to do]

---

## 🚫 Blockers & Challenges
- **Blocker:** [What's stuck] → **Next step:** [Who can unblock, by when]

---

## 💡 Learnings
- [Insight or learning]
- [Tool, technique, or pattern discovered]

---

## 🎯 Priorities for Next Week
1. [Most important thing] — why it matters
2. [Second priority] — why it matters
3. [Third priority] — why it matters

**One big thing I must NOT let slip:** [specific task or commitment]
`
  },
  {
    id: "daily-standup",
    emoji: "☀️",
    name: "Daily Standup",
    description: "Quick async update: yesterday, today, and blockers.",
    preview: "## Standup — [date]\nYesterday · Today · Blockers",
    tags: ["standup", "daily"],
    content: `## Standup — [Today's date]

### ✅ Yesterday
- [Completed task or made progress on X]
- [Attended/led meeting about Y]

### 🎯 Today
- [Top priority task]
- [Secondary task]
- [Meeting or collaboration: time + topic]

### 🚫 Blockers
- [None] — or describe what's blocking you and who can help

---

*Posted by: [Your name] · [Team/Channel]*
`
  },
  {
    id: "product-requirements",
    emoji: "📐",
    name: "Product Requirements",
    description: "PRD template covering user stories, requirements, and acceptance criteria.",
    preview: "## Feature: [Name]\nUser stories · Requirements · Edge cases",
    tags: ["product", "requirements"],
    content: `## Feature: [Feature Name]
**Author:** [PM/Lead name]
**Status:** 🟡 Draft
**Last Updated:** [Date]

---

## Background & Motivation
Why are we building this? What user pain does it solve?

---

## User Stories
As a **[role]**, I want to **[action]** so that **[benefit]**.

- As a **Team Member**, I want to see a presence indicator so I know if teammates are available.
- As a **Manager**, I want to filter by availability so I can find someone online now.

---

## Functional Requirements
### Must Have (P0)
- [ ] [Requirement 1 — specific and testable]
- [ ] [Requirement 2]

### Should Have (P1)
- [ ] [Nice-to-have requirement]

### Won't Have (this release)
- [Out-of-scope item — why]

---

## Acceptance Criteria
- [ ] Given [context], when [action], then [outcome]
- [ ] All P0 requirements pass QA

---

## Open Questions
- [ ] [Question] — **Owner:** @person, **Due:** [date]
`
  },
  {
    id: "one-on-one",
    emoji: "🤝",
    name: "One-on-One",
    description: "Structured 1:1 agenda for managers and direct reports.",
    preview: "## 1:1 — [Name] & [Manager]\nUpdates · Growth · Feedback",
    tags: ["1:1", "management"],
    content: `## 1:1 — [Employee Name] & [Manager Name]
**Date:** [Date]
**Frequency:** [Weekly / Bi-weekly]
**Duration:** 30 min

---

## 🔄 Quick Updates (5 min)
- [Update 1]
- [Update 2]

---

## 🎯 Current Work (10 min)
**What are you most focused on right now?**
- [Project or task 1] — [status]
- [Project or task 2] — [status]

**Anything feeling stuck or unclear?**
- [Blocker or question] → **Manager can help by:** [action]

---

## 🌱 Career & Growth (5 min)
- Skills being built: [skill or area]
- Stretch goal for this quarter: [what they're working toward]

---

## 💬 Feedback Exchange (5 min)
**Employee → Manager:**
> [What's working well / what could be better]

**Manager → Employee:**
> [Specific positive observation] + [One area to grow]

---

## 📌 Action Items
| Action | Owner | Due |
|--------|-------|-----|
| [Task] | @employee | [date] |
| [Task] | @manager | [date] |
`
  },
  {
    id: "sprint-retrospective",
    emoji: "🔄",
    name: "Sprint Retrospective",
    description: "Structured retro: what went well, what didn't, and action items.",
    preview: "## Sprint [N] Retro\nWent well · Improve · Actions",
    tags: ["retro", "agile"],
    content: `## Sprint [Number] Retrospective
**Sprint:** [Sprint name/number]
**Date:** [Retro date]
**Team:** [Team name]
**Facilitator:** [Name]

---

## 📊 Sprint Summary
- **Planned:** [X] points / [Y] tasks
- **Completed:** [X] points / [Y] tasks
- **Carry-over:** [X] tasks → reason: [brief explanation]

---

## ✅ What Went Well
- [Specific example]
- [Specific example]

---

## 🔧 What Could Be Improved
- [Observation — focus on process, not people]
- [Observation]

---

## 💡 Ideas & Experiments
- [Idea to try next sprint]

---

## 🎯 Action Items
| Action | Owner | Sprint Target |
|--------|-------|---------------|
| [Specific, measurable change] | @person | Sprint [N+1] |

---

## 😊 Team Health Check
- **Collaboration:** [X/5]
- **Technical quality:** [X/5]
- **Morale:** [X/5]
`
  },
  {
    id: "interview-notes",
    emoji: "🎙️",
    name: "Interview Notes",
    description: "Capture candidate responses, scores, and hiring recommendation.",
    preview: "## Candidate: [Name]\nRole · Scorecard · Recommendation",
    tags: ["interview", "hiring"],
    content: `## Candidate: [Full Name]
**Role:** [Job title]
**Interview Round:** [Phone screen / Technical / Cultural / Final]
**Interviewer:** [Your name]
**Date:** [Date]

---

## Scorecard
Rate each dimension 1–4 (1 = No hire, 4 = Strong hire):

| Dimension | Score | Notes |
|-----------|-------|-------|
| Technical skills | [1–4] | [Key observation] |
| Problem-solving | [1–4] | [Key observation] |
| Communication | [1–4] | [Key observation] |
| Culture alignment | [1–4] | [Key observation] |

**Overall Score:** [X/16]

---

## Key Question Responses

### Q1: [Question asked]
**A:** [Candidate's response]
**Notes:** [Your observation]

### Q2: [Question asked]
**A:** [Candidate's response]
**Notes:** [Your observation]

---

## Strengths
- [Specific strength backed by evidence]

## Concerns
- [Specific concern] → [Mitigating factor, if any]

---

## Recommendation
- [ ] **Strong hire**
- [ ] **Hire**
- [ ] **Lean no** — [specific concern]
- [ ] **No hire** — [specific reason]

**Summary:** [2–3 sentences for the hiring panel]
`
  },
  {
    id: "research-document",
    emoji: "🔬",
    name: "Research Document",
    description: "Structure research findings, hypotheses, and conclusions.",
    preview: "## Research: [Topic]\nHypothesis · Findings · Conclusions",
    tags: ["research"],
    content: `## Research: [Topic]
**Researcher:** [Your name]
**Date:** [Date]
**Status:** 🔵 In Progress

---

## Research Question
What specific question are you trying to answer?

---

## Hypothesis
What do you expect to find, and why?

---

## Method
- **Type:** [User interviews / Survey / Data analysis / Competitive review]
- **Sample size:** [N participants / X data points]
- **Time period:** [Date range]

---

## Findings

### Finding 1: [Headline observation]
**Evidence:** [Data, quotes, or observations]
**Significance:** [Why this matters]

### Finding 2: [Headline observation]
**Evidence:** [Data, quotes, or observations]
**Significance:** [Why this matters]

---

## Conclusions
Does the evidence support or refute your hypothesis?

---

## Recommendations
1. [Actionable recommendation]
2. [Actionable recommendation]
`
  },
  {
    id: "decision-log",
    emoji: "⚖️",
    name: "Decision Log",
    description: "Record architectural or strategic decisions with rationale and trade-offs.",
    preview: "## Decision: [Title]\nContext · Options · Decision",
    tags: ["decision", "architecture"],
    content: `## Decision: [Decision Title]
**Date:** [Date]
**Deciders:** [Names of everyone involved]
**Status:** 🟡 Proposed

---

## Context & Problem
What situation or problem prompted this decision? Why does it need to be made now?

---

## Decision Drivers
- [Driver 1: must work within existing infrastructure]
- [Driver 2: must be reversible]

---

## Options Considered

### Option A: [Name]
**Pros:** [Advantage]
**Cons:** [Disadvantage]

### Option B: [Name]
**Pros:** [Advantage]
**Cons:** [Disadvantage]

---

## Decision
**We will go with Option [A/B].**

Rationale: [2–3 sentences explaining WHY this option was chosen.]

---

## Consequences

### Positive
- [Expected benefit]

### Trade-offs Accepted
- [Known downside we are accepting and why]

---

## Follow-up Actions
- [ ] [Action required] → **Owner:** @person, **Due:** [date]
`
  },
  {
    id: "goal-planning",
    emoji: "🎯",
    name: "Goal Planning",
    description: "Set quarterly goals with key results, milestones, and tracking.",
    preview: "## Q[N] Goals — [Name]\nObjectives · KRs · Milestones",
    tags: ["goals", "okr"],
    content: `## Q[N] [Year] Goals — [Your Name / Team Name]
**Period:** [Start date] → [End date]
**Last updated:** [Date]

---

## 🌟 Theme for This Quarter
[One sentence that captures the spirit of this quarter's focus]

---

## Objectives & Key Results

### Objective 1: [Outcome-oriented goal]
*Why this matters: [1–2 sentences on impact]*

| Key Result | Target | Current | Status |
|------------|--------|---------|--------|
| [Measurable KR 1] | [X%] | [Y%] | 🔴🟡🟢 |
| [Measurable KR 2] | [X] | [Y] | 🔴🟡🟢 |

### Objective 2: [Outcome-oriented goal]

| Key Result | Target | Current | Status |
|------------|--------|---------|--------|
| [Measurable KR 1] | [X] | [Y] | 🔴🟡🟢 |

---

## 🗓️ Milestones
| Milestone | Description | Due Date | Status |
|-----------|-------------|----------|--------|
| [Milestone 1] | [What gets shipped] | [date] | ⬜ |
| [Milestone 2] | [Description] | [date] | ⬜ |

---

## 🚫 What I'm NOT doing this quarter
- [Deprioritized item and why]

---

## 📋 Weekly Check-in Log
| Week | Progress | Blockers | Confidence |
|------|----------|----------|------------|
| Week 1 | [Summary] | [Blockers] | 🟡 On track |
`
  },
  {
    id: "incident-report",
    emoji: "🚨",
    name: "Incident Report",
    description: "Document incidents with timeline, impact, root cause, and remediation.",
    preview: "## Incident: [Name]\nTimeline · Root cause · Action items",
    tags: ["incident", "ops"],
    content: `## Incident: [Incident Name / ID]
**Severity:** P[0/1/2/3] — [Critical / High / Medium / Low]
**Status:** 🔴 Active
**Incident Commander:** [Name]
**Start Time:** [Datetime in UTC]
**End Time:** [Datetime in UTC]

---

## Executive Summary
[2–3 sentences describing what happened, who was affected, and current status.]

---

## Impact
- **Users affected:** [X users / % of user base]
- **Services affected:** [List impacted services]
- **Revenue impact:** [$X estimated]

---

## Timeline
| Time (UTC) | Event |
|------------|-------|
| [HH:MM] | [First alert or detection] |
| [HH:MM] | [Incident declared] |
| [HH:MM] | [Root cause identified] |
| [HH:MM] | [Fix deployed] |
| [HH:MM] | [Incident resolved] |

---

## Root Cause Analysis
**Root cause:** [The fundamental reason this happened]

**Contributing factors:**
- [Factor 1]
- [Factor 2]

---

## Action Items
| Action | Owner | Due | Priority |
|--------|-------|-----|----------|
| [Add monitoring for X] | @person | [date] | P1 |
| [Update runbook for Y] | @person | [date] | P2 |
`
  },
  {
    id: "knowledge-base",
    emoji: "📚",
    name: "Knowledge Base Article",
    description: "Evergreen documentation: how-tos, explanations, and troubleshooting.",
    preview: "## [Topic]\nOverview · Steps · Troubleshooting",
    tags: ["docs", "knowledge"],
    content: `## [Article Title]
**Category:** [Category / Tag]
**Author:** [Name]
**Last reviewed:** [Date]
**Audience:** [End users / Developers / Admins]

---

## Overview
[1–3 sentences explaining what this article covers and who it's for.]

---

## Prerequisites
Before following these steps, make sure you have:
- [ ] [Prerequisite 1]
- [ ] [Prerequisite 2]

---

## Step-by-Step Instructions

### Step 1: [Action]
[Clear, specific instruction. One action per step.]
> 💡 **Tip:** [Optional tip or clarification]

### Step 2: [Action]
[Instruction]

### Step 3: [Action]
[Instruction]
> ⚠️ **Note:** [Important warning or caveat]

---

## Troubleshooting

### Problem: [Issue description]
**Cause:** [Why this happens]
**Solution:** [Steps to fix it]

---

## FAQ
**Q: [Common question]?**
A: [Clear, direct answer]

---

## Related Articles
- [Link to related article 1]
- [Link to related article 2]
`
  },
  {
    id: "brainstorm",
    emoji: "💡",
    name: "Brainstorm Session",
    description: "Ideation with HMW questions, ideas, top picks, and next steps.",
    preview: "## Brainstorm: [Topic]\nHMW · Ideas · Top picks",
    tags: ["brainstorm", "ideation"],
    content: `## Brainstorm: [Topic]
**Date:** [Date]
**Participants:** [Names]
**Facilitator:** [Name]

---

## Problem Statement
[Describe the problem you're solving in 1–3 sentences. Be specific.]

---

## How Might We…
- How might we [reduce friction for new users]?
- How might we [make the experience feel more personal]?
- How might we [eliminate the need for manual setup]?

---

## Raw Ideas (no judgment)
1. [Idea]
2. [Idea]
3. [Idea]
4. [Idea]
5. [Idea]
6. [Idea]

---

## Top Picks (after dot voting)
- [Idea with most votes] — votes: [X]
- [Idea with most votes] — votes: [X]

---

## Next Steps
- [ ] [Action] — Owner: @person, Due: [date]
- [ ] [Action] — Owner: @person, Due: [date]
`
  },
  {
    id: "sales-call-notes",
    emoji: "📞",
    name: "Sales Call Notes",
    description: "Capture prospect details, pain points, next steps, and follow-ups.",
    preview: "## Call: [Company]\nProspect · Pain points · Next steps",
    tags: ["sales", "crm"],
    content: `## Sales Call: [Company Name]
**Date:** [Date]
**Duration:** [X min]
**Contact:** [Name, Title]
**Attendees:** [Internal team]
**Stage:** [Discovery / Demo / Proposal / Negotiation / Close]

---

## Prospect Background
- **Company:** [Name] | [Industry] | [Size]
- **Current solution:** [What they use today]
- **How they found us:** [Referral, inbound, outreach]

---

## Pain Points Identified
1. [Primary pain point — be specific, use their words]
2. [Secondary pain point]
3. [Nice-to-have they mentioned]

---

## Qualification (MEDDIC)
- **Metrics:** [How they measure success]
- **Economic Buyer:** [Who signs the check]
- **Decision Criteria:** [What matters most to them]
- **Decision Process:** [How they evaluate and decide]
- **Identified Pain:** [Explicit problem they need solved]
- **Champion:** [Internal advocate, if any]

---

## Demo / Discussion Notes
[Key moments from the call — what resonated, what fell flat, specific objections]

---

## Objections & Responses
- **Objection:** [What they said]
  **Response:** [How you addressed it]

---

## Next Steps
- [ ] [Action] — Owner: @person | Due: [date]
- [ ] [Action] — Owner: @person | Due: [date]

**Next meeting:** [Date + time] | **Agenda:** [Topic]
`
  },
  {
    id: "okr-template",
    emoji: "🏆",
    name: "OKR Framework",
    description: "Full OKR template with objectives, key results, and initiative tracking.",
    preview: "## OKRs — [Team/Period]\nObjectives · Key Results · Initiatives",
    tags: ["okr", "goals", "strategy"],
    content: `## OKRs — [Team Name] | [Q1 2025]
**Period:** [Start] → [End]
**Owner:** [Team lead]
**Last updated:** [Date]

---

## Company / Team Context
[1–2 sentences on the company strategy or team mission this OKR cycle serves.]

---

## Objective 1: [Ambitious, qualitative goal]

> *Why it matters:* [1 sentence on the impact]

| Key Result | Baseline | Target | Current | Status |
|------------|---------|--------|---------|--------|
| [Measurable outcome, not output] | [X] | [Y] | [Z] | 🔴/🟡/🟢 |
| [Measurable outcome] | [X] | [Y] | [Z] | 🔴/🟡/🟢 |
| [Measurable outcome] | [X] | [Y] | [Z] | 🔴/🟡/🟢 |

**Key initiatives:**
- [Initiative that drives KR1]
- [Initiative that drives KR2]

---

## Objective 2: [Ambitious, qualitative goal]

> *Why it matters:* [1 sentence]

| Key Result | Baseline | Target | Current | Status |
|------------|---------|--------|---------|--------|
| [Measurable outcome] | [X] | [Y] | [Z] | 🔴/🟡/🟢 |
| [Measurable outcome] | [X] | [Y] | [Z] | 🔴/🟡/🟢 |

---

## Check-in Log
| Date | Notes | Confidence |
|------|-------|------------|
| [Date] | [What changed, any blockers] | 🟡 On track |
`
  }
];
function TemplatePicker({ onSelect, isCreating }) {
  const [selected, setSelected] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return NOTE_TEMPLATES;
    return NOTE_TEMPLATES.filter(
      (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some((tag) => tag.includes(q))
    );
  }, [search]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up flex flex-col min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/60 px-4 sm:px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground tracking-tight", children: "Start with a template" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Choose a template to jump-start your note, or start blank." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Search templates…",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "max-w-sm h-9 text-sm border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30",
          "data-ocid": "template-search-input"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 px-4 sm:px-6 py-6 max-w-5xl mx-auto w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onSelect(null),
          disabled: isCreating,
          className: "w-full mb-6 flex items-center gap-3 rounded-xl border-2 border-dashed border-border/60 bg-muted/30 px-4 py-3.5 text-left hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group disabled:opacity-60",
          "data-ocid": "template-blank-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border/60 text-xl shrink-0 group-hover:border-primary/40 transition-colors", children: "✏️" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground group-hover:text-primary transition-colors", children: "Start blank" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Open an empty note and write freely" })
            ] }),
            isCreating ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "ml-auto h-4 w-4 text-muted-foreground animate-spin shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" })
          ]
        }
      ),
      filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-16 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
        'No templates match "',
        search,
        '"'
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: filtered.map((tpl) => {
        const isSelected = (selected == null ? void 0 : selected.id) === tpl.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            disabled: isCreating,
            onClick: () => setSelected(isSelected ? null : tpl),
            className: [
              "relative text-left rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md group disabled:opacity-60",
              isSelected ? "border-primary ring-2 ring-primary/30 shadow-md" : "border-border/60 hover:border-primary/40"
            ].join(" "),
            "data-ocid": `template-card-${tpl.id}`,
            children: [
              isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-primary-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl mb-2.5", children: tpl.emoji }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1", children: tpl.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2.5 line-clamp-2", children: tpl.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: tpl.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground",
                  children: tag
                },
                tag
              )) })
            ]
          },
          tpl.id
        );
      }) })
    ] }),
    selected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky bottom-0 z-10 border-t border-border/60 bg-background/95 backdrop-blur-sm px-4 sm:px-6 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg shrink-0", children: selected.emoji }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground truncate", children: selected.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "shrink-0 text-xs", children: "selected" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => onSelect(selected),
          disabled: isCreating,
          className: "gap-2 shrink-0",
          "data-ocid": "template-use-btn",
          children: [
            isCreating ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" }),
            isCreating ? "Creating…" : "Use Template"
          ]
        }
      )
    ] }) })
  ] });
}
function NoteNewPage() {
  const { workspaceId } = useParams({ from: "/app/$workspaceId/notes/new" });
  const { actor } = useBackend();
  const { tenantId } = useWorkspace();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: createNote, isPending } = useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createNote(tenantId, workspaceId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (note) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", tenantId, workspaceId]
      });
      ue.success("Note created");
      navigate({
        to: "/app/$workspaceId/notes/$noteId",
        params: { workspaceId, noteId: note.id }
      });
    },
    onError: (err) => ue.error("Failed to create note", { description: err.message })
  });
  const handleTemplateSelect = (tpl) => {
    if (tpl) {
      createNote({
        title: tpl.name,
        content: tpl.content,
        tags: tpl.tags,
        crossLinks: [],
        iconEmoji: tpl.emoji
      });
    } else {
      createNote({
        title: "Untitled",
        content: "",
        tags: [],
        crossLinks: []
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-4 z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        asChild: true,
        className: "h-8 w-8",
        "aria-label": "Back to notes",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/$workspaceId/notes", params: { workspaceId }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TemplatePicker, { onSelect: handleTemplateSelect, isCreating: isPending })
  ] });
}
export {
  NoteNewPage as default
};
