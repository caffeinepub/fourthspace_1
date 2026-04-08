import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Loader2,
  Save,
  StickyNote,
  Tag,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CrossLinkPicker } from "../../components/CrossLinkPicker";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { CrossLink, NoteInput } from "../../types";

// ─── Template definitions ────────────────────────────────────────────────────

interface NoteTemplate {
  id: string;
  emoji: string;
  name: string;
  description: string;
  preview: string; // first ~2 lines shown in card
  content: string; // full pre-filled content
}

const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    id: "meeting-notes",
    emoji: "📋",
    name: "Meeting Notes",
    description:
      "Capture agenda, decisions, and action items from any meeting.",
    preview: "## Meeting Details\nDate · Attendees · Objective",
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
- [ ] Decision 1: [What was decided and why]
- [ ] Decision 2: [What was decided and why]

---

## Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Task description] | @person | [date] | 🔴 Open |
| [Task description] | @person | [date] | 🔴 Open |

---

## Parking Lot (deferred topics)
- [Topic] — revisit in [meeting/date]

---

## Next Meeting
**Date:** [Next meeting date]
**Pre-read:** [Link or description]
`,
  },
  {
    id: "project-brief",
    emoji: "🚀",
    name: "Project Brief",
    description: "Define scope, goals, and timeline before work begins.",
    preview: "## Project Overview\nGoal · Scope · Success criteria",
    content: `## Project Overview
**Project Name:** [Project name]
**Owner:** [Your name]
**Start Date:** [Start date]
**Target Completion:** [End date]
**Status:** 🟡 Planning

---

## Problem Statement
Describe the problem this project solves in 2-3 sentences. Be specific — who is affected, how often, and what the current workaround costs in time or money.

> Example: "Our support team spends 3 hours/day manually routing tickets because the current system has no auto-assignment rules. This causes avg. first-response time to spike to 6 hours on Mondays."

---

## Goals & Success Criteria
- **Goal 1:** [Measurable outcome, e.g. "Reduce first-response time to <2 hours"]
- **Goal 2:** [Measurable outcome]
- **Goal 3:** [Measurable outcome]

**Out of scope:**
- [What this project will NOT address]
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
| [Name] | Contributor | Execution |

---

## Risks & Dependencies
- **Risk:** [Description] → **Mitigation:** [How you'll address it]
- **Dependency:** [What this project depends on] → **Owner:** @person

---

## Resources Required
- Engineering: [X] engineers × [Y] weeks
- Design: [X] designers × [Y] weeks
- Budget: $[amount] for [what]
`,
  },
  {
    id: "weekly-review",
    emoji: "📅",
    name: "Weekly Review",
    description:
      "Reflect on wins, blockers, and priorities for the week ahead.",
    preview: "## Week of [date]\nAccomplishments · Blockers · Next week",
    content: `## Week of [Date]
**Review completed:** [Today's date]
**Mood this week:** [😊 / 😐 / 😔]

---

## ✅ Accomplishments
What did you finish or make meaningful progress on?
- [Shipped X feature — link to PR/task]
- [Completed Y deliverable — link]
- [Had productive conversation about Z — outcome]

---

## 🚧 In Progress (carrying over)
- [Task or project] — [current status, what's blocking]
- [Task or project] — [what's left to do]

---

## 🚫 Blockers & Challenges
- **Blocker:** [What's stuck] → **Next step:** [Who can unblock, by when]
- **Challenge:** [Difficult situation] → **How I'm handling it:** [approach]

---

## 📊 Key Metrics This Week
| Metric | Target | Actual | Trend |
|--------|--------|--------|-------|
| [KPI 1] | [goal] | [result] | ↑↓→ |
| [KPI 2] | [goal] | [result] | ↑↓→ |

---

## 💡 Learnings
What did you learn this week that's worth remembering?
- [Insight or learning]
- [Tool, technique, or pattern discovered]
- [Something about a person, team, or process]

---

## 🎯 Priorities for Next Week
1. [Most important thing] — why it matters
2. [Second priority] — why it matters
3. [Third priority] — why it matters

**One big thing I must NOT let slip:** [specific task or commitment]

---

## 📝 Notes & Miscellaneous
- [Anything else worth capturing]
`,
  },
  {
    id: "daily-standup",
    emoji: "☀️",
    name: "Daily Standup",
    description: "Quick async update: yesterday, today, and blockers.",
    preview: "## Standup — [date]\nYesterday · Today · Blockers",
    content: `## Standup — [Today's date]

### ✅ Yesterday
- [Completed task or made progress on X]
- [Attended/led meeting about Y]
- [Reviewed/approved Z]

### 🎯 Today
- [Top priority task — link to ticket]
- [Secondary task]
- [Meeting or collaboration: time + topic]

### 🚫 Blockers
- [None] — or describe what's blocking you and who can help

---

*Posted by: [Your name] · [Team/Channel]*
`,
  },
  {
    id: "product-requirements",
    emoji: "📐",
    name: "Product Requirements",
    description:
      "PRD template covering user stories, requirements, and acceptance criteria.",
    preview: "## Feature: [Name]\nUser stories · Requirements · Edge cases",
    content: `## Feature: [Feature Name]
**Author:** [PM/Lead name]
**Status:** 🟡 Draft → 🟢 Approved → 🔵 In Development → ✅ Shipped
**Last Updated:** [Date]

---

## Background & Motivation
Why are we building this? What user pain does it solve?

> Example: "Users with large teams struggle to see who is online vs. offline in real-time. This leads to duplicate messages and wasted async back-and-forth."

---

## User Stories
As a **[role]**, I want to **[action]** so that **[benefit]**.

- As a **Team Member**, I want to see a presence indicator next to each teammate's name so I know if they're available for a quick sync.
- As a **Manager**, I want to filter the members list by availability so I can find someone who's online right now.
- As a **Guest**, I want my presence to be hidden by default so I have privacy when reviewing shared documents.

---

## Functional Requirements
### Must Have (P0)
- [ ] [Requirement 1 — specific and testable]
- [ ] [Requirement 2]
- [ ] [Requirement 3]

### Should Have (P1)
- [ ] [Nice-to-have requirement]
- [ ] [Nice-to-have requirement]

### Won't Have (this release)
- [Out-of-scope item — why]

---

## Non-Functional Requirements
- **Performance:** [e.g. "Presence updates must reflect within 5 seconds"]
- **Accessibility:** [e.g. "Status indicators must have text labels, not color alone"]
- **Privacy:** [e.g. "Users can opt out of sharing presence"]

---

## Design & UX Notes
- [Link to Figma designs]
- [Key UX decision: why we chose X over Y]
- [Mobile considerations]

---

## Edge Cases & Error Handling
- **Edge case:** [Scenario] → **Expected behavior:** [What should happen]
- **Error state:** [What fails] → **User message:** [What they see]

---

## Acceptance Criteria
- [ ] Given [context], when [action], then [outcome]
- [ ] Given [context], when [action], then [outcome]
- [ ] All P0 requirements pass QA

---

## Open Questions
- [ ] [Question] — **Owner:** @person, **Due:** [date]
- [ ] [Question] — **Owner:** @person, **Due:** [date]
`,
  },
  {
    id: "one-on-one",
    emoji: "🤝",
    name: "One-on-One",
    description: "Structured 1:1 agenda for managers and direct reports.",
    preview: "## 1:1 — [Name] & [Manager]\nUpdates · Growth · Feedback",
    content: `## 1:1 — [Employee Name] & [Manager Name]
**Date:** [Date]
**Frequency:** [Weekly / Bi-weekly]
**Duration:** 30 min

---

## 🔄 Quick Updates (5 min)
*Employee shares top-of-mind items — wins, blockers, anything urgent.*
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
**How are you feeling about your development?**
- Skills being built: [skill or area]
- Stretch goal for this quarter: [what they're working toward]
- Support needed: [training, mentoring, exposure to X]

---

## 💬 Feedback Exchange (5 min)
**Employee → Manager:**
> [What's working well / what could be better about our working relationship or the team]

**Manager → Employee:**
> [Specific positive observation] + [One area to grow]

---

## 📌 Action Items
| Action | Owner | Due |
|--------|-------|-----|
| [Task] | @employee | [date] |
| [Task] | @manager | [date] |

---

## 📝 Notes for Next Time
- [Topic to revisit]
- [Follow-up on previous action item]
`,
  },
  {
    id: "sprint-retrospective",
    emoji: "🔄",
    name: "Sprint Retrospective",
    description:
      "Structured retro: what went well, what didn't, and action items.",
    preview: "## Sprint [N] Retro\nWent well · Improve · Actions",
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
*These are things we should protect and do more of.*
- [Specific example: "Daily standups were focused and under 15 min"]
- [Specific example: "PR review turnaround was <24 hours"]
- [Specific example: "We shipped the auth refactor with zero regressions"]

---

## 🔧 What Could Be Improved
*Frame as observations, not blame. Focus on process, not people.*
- [Observation: "Acceptance criteria were unclear on 3 of 8 tickets — caused scope creep"]
- [Observation: "Deployments happened manually — we spent 2 hours on Friday release process"]
- [Observation: "Design handoff happened same day as dev start — compressed time"]

---

## 💡 Ideas & Experiments
*Novel approaches the team wants to try.*
- [Idea: "Add a 'definition of ready' checklist before tickets enter the sprint"]
- [Idea: "Try async demo instead of live demo — record a Loom by Thursday"]

---

## 🎯 Action Items
| Action | Owner | Sprint Target |
|--------|-------|---------------|
| [Specific, measurable change] | @person | Sprint [N+1] |
| [Specific, measurable change] | @person | Sprint [N+1] |

---

## 😊 Team Health Check
Rate 1–5 (5 = excellent):
- **Collaboration:** [X/5] — [comment]
- **Technical quality:** [X/5] — [comment]
- **Morale:** [X/5] — [comment]
- **Process clarity:** [X/5] — [comment]
`,
  },
  {
    id: "interview-notes",
    emoji: "🎙️",
    name: "Interview Notes",
    description:
      "Capture candidate responses, scores, and hiring recommendation.",
    preview: "## Candidate: [Name]\nRole · Scorecard · Recommendation",
    content: `## Candidate: [Full Name]
**Role:** [Job title]
**Interview Round:** [Phone screen / Technical / Cultural / Final]
**Interviewer:** [Your name]
**Date:** [Date]
**Duration:** [45 min]

---

## Candidate Background
- **Current/Last Role:** [Title at Company]
- **Years of Experience:** [X years in Y domain]
- **Referral:** [Source — job board, referral, recruiter]

---

## Scorecard
Rate each dimension 1–4 (1 = No hire, 2 = Lean no, 3 = Lean yes, 4 = Strong hire):

| Dimension | Score | Notes |
|-----------|-------|-------|
| Technical skills | [1–4] | [Key observation] |
| Problem-solving | [1–4] | [Key observation] |
| Communication | [1–4] | [Key observation] |
| Culture alignment | [1–4] | [Key observation] |
| Leadership potential | [1–4] | [Key observation] |

**Overall Score:** [X/20]

---

## Interview Questions & Answers

### Q1: [Question asked]
**A:** [Candidate's response — be specific, include examples they gave]
**Notes:** [Your observation — did they use the STAR method? Was the answer concrete?]

### Q2: [Question asked]
**A:** [Candidate's response]
**Notes:** [Your observation]

### Q3: [Technical question or case]
**A:** [Their approach and solution]
**Notes:** [What was strong? What was missing?]

---

## Strengths
- [Specific strength backed by evidence from the interview]
- [Specific strength]

---

## Concerns
- [Specific concern] → [Mitigating factor, if any]
- [Specific concern]

---

## Recommendation
- [ ] **Strong hire** — exceeded expectations in [X] dimensions
- [ ] **Hire** — meets bar, good fit for the role
- [ ] **Lean no** — [specific concern holding back]
- [ ] **No hire** — [specific reason]

**Summary for hiring panel:**
[2–3 sentences summarizing the candidate and your recommendation]
`,
  },
  {
    id: "research-document",
    emoji: "🔬",
    name: "Research Document",
    description: "Structure research findings, hypotheses, and conclusions.",
    preview: "## Research: [Topic]\nHypothesis · Findings · Conclusions",
    content: `## Research: [Topic]
**Researcher:** [Your name]
**Date:** [Date]
**Status:** 🔵 In Progress / ✅ Complete

---

## Research Question
What specific question are you trying to answer?

> Example: "What are the primary reasons users abandon the onboarding flow before completing profile setup?"

---

## Hypothesis
What do you expect to find, and why?

> Example: "We expect that users abandon because the required fields (phone, company size) create too much friction — not because they lack intent to complete setup."

---

## Method
How did you conduct this research?
- **Type:** [User interviews / Survey / Data analysis / Competitive review / Literature review]
- **Sample size:** [N participants / X data points]
- **Time period:** [Date range]
- **Tools:** [Mixpanel, Hotjar, Google Sheets, etc.]

---

## Findings

### Finding 1: [Headline observation]
**Evidence:** [Data, quotes, or observations that support this]
**Significance:** [Why this matters]

### Finding 2: [Headline observation]
**Evidence:** [Data, quotes, or observations]
**Significance:** [Why this matters]

### Finding 3: [Headline observation]
**Evidence:** [Data, quotes, or observations]
**Significance:** [Why this matters]

---

## Data Summary
| Metric | Value | Source |
|--------|-------|--------|
| [Metric 1] | [X%] | [Source] |
| [Metric 2] | [X] | [Source] |

---

## Conclusions
Does the evidence support or refute your hypothesis?

[2–3 sentences synthesizing the key takeaways]

---

## Recommendations
1. [Actionable recommendation based on the research]
2. [Actionable recommendation]
3. [Actionable recommendation]

---

## Open Questions & Next Steps
- [ ] [Unresolved question] → [Who will investigate, by when]
- [ ] [Follow-up research needed] → [Owner]
`,
  },
  {
    id: "user-story",
    emoji: "👤",
    name: "User Story",
    description: "Detailed user story with acceptance criteria and edge cases.",
    preview: "## Story: [Title]\nAs a [role], I want [action]…",
    content: `## Story: [Story Title]
**Epic:** [Parent epic or feature area]
**Author:** [Name]
**Status:** 📝 Backlog / 🔵 In Dev / ✅ Done
**Points:** [Story points]
**Sprint:** [Sprint name/number]

---

## User Story
As a **[role/persona]**,
I want to **[specific action or capability]**,
so that **[benefit or value delivered]**.

> Example: "As a **project manager**, I want to **filter tasks by assignee**, so that **I can quickly see workload distribution across my team**."

---

## Context & Background
[Why is this story important? What triggered it — user feedback, analytics, stakeholder request?]

---

## Acceptance Criteria
All criteria must pass for the story to be "done":
- [ ] **Given** [precondition], **when** [action], **then** [expected outcome]
- [ ] **Given** [precondition], **when** [action], **then** [expected outcome]
- [ ] **Given** [precondition], **when** [action], **then** [expected outcome]
- [ ] UI matches approved designs (link to Figma)
- [ ] Works on mobile (320px+) and desktop

---

## Design Notes
- [Link to Figma / Storybook]
- [Key interaction or animation detail]
- [Responsive behavior note]

---

## Technical Notes
- [Implementation approach or constraint]
- [API endpoint or data model affected]
- [Performance consideration]

---

## Edge Cases
- **Edge case:** [Scenario] → **Expected behavior:** [What should happen]
- **Edge case:** [Scenario] → **Expected behavior:** [What should happen]
- **Error state:** [What fails] → **User message:** [What they see]

---

## Definition of Done
- [ ] Code reviewed and approved
- [ ] Unit tests written and passing
- [ ] QA signed off
- [ ] Feature flag enabled in staging
- [ ] Documentation updated (if applicable)
`,
  },
  {
    id: "release-notes",
    emoji: "🚢",
    name: "Release Notes",
    description:
      "Communicate what changed, what's fixed, and what's new in a release.",
    preview: "## v[X.Y] Release Notes\nNew · Fixed · Breaking changes",
    content: `## v[X.Y.Z] Release Notes
**Release Date:** [Date]
**Release Type:** [Major / Minor / Patch / Hotfix]
**Release Manager:** [Name]

---

## 🎉 What's New
These features are available to all users starting [date].

### [Feature 1 Name]
[1–2 sentence description of the feature and why it matters to users]
- [Specific capability 1]
- [Specific capability 2]
*How to access: [Navigation path or instruction]*

### [Feature 2 Name]
[Description]
- [Specific capability]
*How to access: [Instruction]*

---

## 🔧 Improvements
- **[Area]:** [What improved and how — e.g. "Dashboard load time reduced by 40% by caching workspace data"]
- **[Area]:** [Improvement]
- **[Area]:** [Improvement]

---

## 🐛 Bug Fixes
- Fixed: [Brief description of what was wrong and now works correctly]
- Fixed: [Brief description]
- Fixed: [Brief description]

---

## ⚠️ Breaking Changes
> If none, write "None in this release."

- **[Change]:** [What changed] → **Action required:** [What users/developers need to do]

---

## 📦 Dependencies Updated
| Package | From | To | Notes |
|---------|------|----|-------|
| [package] | [old] | [new] | [security fix / new feature] |

---

## 🗺️ What's Next
Preview of what's coming in the next release:
- [Upcoming feature 1]
- [Upcoming feature 2]

---

*Questions? Reach out to [contact] or visit [support link].*
`,
  },
  {
    id: "decision-log",
    emoji: "⚖️",
    name: "Decision Log",
    description:
      "Record architectural or strategic decisions with rationale and trade-offs.",
    preview: "## Decision: [Title]\nContext · Options · Decision",
    content: `## Decision: [Decision Title]
**Date:** [Date]
**Deciders:** [Names of everyone involved in the decision]
**Status:** 🟡 Proposed / ✅ Accepted / ❌ Superseded by [link]

---

## Context & Problem
What situation or problem prompted this decision? Why does it need to be made now?

[2–3 sentences explaining the context. Be specific about constraints, deadlines, and what happens if no decision is made.]

---

## Decision Drivers
The key factors that this decision must satisfy:
- [Driver 1: e.g. "Must work within existing infrastructure — no new third-party services"]
- [Driver 2: e.g. "Must be reversible — we may change direction in 6 months"]
- [Driver 3: e.g. "Must be understood by a junior engineer"]

---

## Options Considered

### Option A: [Name]
**Description:** [How this option works]
**Pros:**
- [Advantage]
- [Advantage]
**Cons:**
- [Disadvantage]
- [Disadvantage]
**Estimated effort:** [Low / Medium / High]

### Option B: [Name]
**Description:** [How this option works]
**Pros:**
- [Advantage]
**Cons:**
- [Disadvantage]
**Estimated effort:** [Low / Medium / High]

### Option C: Do Nothing
**Description:** Keep the current approach
**Pros:** [No migration cost, no risk]
**Cons:** [What problem remains unsolved]

---

## Decision
**We will go with Option [A/B/C].**

Rationale: [2–3 sentences explaining WHY this option was chosen over the others. Reference the decision drivers.]

---

## Consequences

### Positive
- [Expected benefit]
- [Expected benefit]

### Negative / Trade-offs Accepted
- [Known downside we are accepting and why]
- [Known downside]

### Risks
- [Risk] → [Mitigation plan]

---

## Follow-up Actions
- [ ] [Action required] → **Owner:** @person, **Due:** [date]
`,
  },
  {
    id: "architecture-doc",
    emoji: "🏗️",
    name: "Architecture Doc",
    description:
      "Document system design, data flow, and component interactions.",
    preview: "## Architecture: [System]\nOverview · Components · Data flow",
    content: `## Architecture: [System or Component Name]
**Author:** [Name]
**Date:** [Date]
**Version:** 1.0
**Status:** 🔵 Draft / ✅ Approved

---

## Overview
[2–4 sentences describing what this system does, who uses it, and why it exists.]

---

## Goals & Non-Goals
**Goals:**
- [What this system is designed to do]
- [What this system is designed to do]

**Non-Goals:**
- [What this system intentionally does NOT do]
- [What this system intentionally does NOT do]

---

## System Context Diagram
\`\`\`
[User] ──── [Frontend] ──── [API Gateway]
                               │
              ┌────────────────┼────────────────┐
              │                │                │
         [Service A]      [Service B]      [Service C]
              │
         [Database]
\`\`\`
*Replace with actual diagram tool link or ASCII art of your system.*

---

## Components

### [Component 1 Name]
- **Responsibility:** [What it does in one sentence]
- **Technology:** [Language, framework, or runtime]
- **Interfaces:** [API, events, or queues it exposes]
- **Dependencies:** [What it depends on]

### [Component 2 Name]
- **Responsibility:** [What it does]
- **Technology:** [Stack]
- **Interfaces:** [API or events]
- **Dependencies:** [Dependencies]

---

## Data Flow
Describe the most important data flows through the system:

**Flow 1: [Name, e.g. "User authentication"]**
1. User submits credentials via [Client]
2. [Service A] validates and issues [token/session]
3. Token stored in [location] and sent in [header/cookie]
4. Downstream services validate token via [mechanism]

---

## Data Model
\`\`\`
Entity: [Name]
  id: string (UUID)
  tenantId: string
  [field]: [type]
  [field]: [type]
  createdAt: timestamp
  updatedAt: timestamp
\`\`\`

---

## Security Considerations
- **Authentication:** [How users are authenticated]
- **Authorization:** [How access is controlled]
- **Data in transit:** [TLS, encryption approach]
- **Data at rest:** [Encryption, key management]
- **Known attack vectors:** [XSS, CSRF, injection — and mitigations]

---

## Performance & Scalability
- **Expected load:** [Requests/sec, data volume]
- **Bottlenecks identified:** [Component or query that could be a bottleneck]
- **Caching strategy:** [What's cached, TTL, invalidation]
- **Scaling approach:** [Horizontal, vertical, or sharding]

---

## Open Questions
- [ ] [Unresolved design question] → **Owner:** @person, **Due:** [date]
`,
  },
  {
    id: "goal-planning",
    emoji: "🎯",
    name: "Goal Planning",
    description:
      "Set quarterly goals with key results, milestones, and tracking.",
    preview: "## Q[N] Goals — [Name]\nObjectives · KRs · Milestones",
    content: `## Q[N] [Year] Goals — [Your Name / Team Name]
**Period:** [Start date] → [End date]
**Last updated:** [Date]

---

## 🌟 Theme for This Quarter
[One sentence that captures the spirit of this quarter's focus]
> Example: "Ship the collaboration layer and prove we can grow without adding headcount."

---

## Objectives & Key Results

### Objective 1: [Outcome-oriented goal]
*Why this matters: [1–2 sentences on impact]*

| Key Result | Target | Current | Status |
|------------|--------|---------|--------|
| [Measurable KR 1] | [X%] | [Y%] | 🔴🟡🟢 |
| [Measurable KR 2] | [X] | [Y] | 🔴🟡🟢 |
| [Measurable KR 3] | [X] | [Y] | 🔴🟡🟢 |

### Objective 2: [Outcome-oriented goal]
*Why this matters: [1–2 sentences]*

| Key Result | Target | Current | Status |
|------------|--------|---------|--------|
| [Measurable KR 1] | [X] | [Y] | 🔴🟡🟢 |
| [Measurable KR 2] | [X] | [Y] | 🔴🟡🟢 |

### Objective 3: [Outcome-oriented goal]
*Why this matters: [1–2 sentences]*

| Key Result | Target | Current | Status |
|------------|--------|---------|--------|
| [Measurable KR 1] | [X] | [Y] | 🔴🟡🟢 |
| [Measurable KR 2] | [X] | [Y] | 🔴🟡🟢 |

---

## 🗓️ Milestones
| Milestone | Description | Due Date | Status |
|-----------|-------------|----------|--------|
| [Milestone 1] | [What gets shipped or decided] | [date] | ⬜ / ✅ |
| [Milestone 2] | [Description] | [date] | ⬜ / ✅ |
| [Milestone 3] | [Description] | [date] | ⬜ / ✅ |

---

## 🚫 What I'm NOT doing this quarter
Being intentional about what's out of scope:
- [Deprioritized item and why]
- [Deprioritized item and why]

---

## 📋 Weekly Check-in Log
| Week | Progress | Blockers | Confidence |
|------|----------|----------|------------|
| Week 1 | [Summary] | [Blockers] | 🟡 On track |
| Week 2 | [Summary] | [Blockers] | 🟢 Ahead |
| Week 3 | | | |

---

## 🔚 End-of-Quarter Reflection
*(Fill in at the end)*
- **What I'm proud of:** ...
- **What I'd do differently:** ...
- **Carry-over to next quarter:** ...
`,
  },
  {
    id: "incident-report",
    emoji: "🚨",
    name: "Incident Report",
    description:
      "Document incidents with timeline, impact, root cause, and remediation.",
    preview: "## Incident: [Name]\nTimeline · Root cause · Action items",
    content: `## Incident: [Incident Name / ID]
**Severity:** P[0/1/2/3] — [Critical / High / Medium / Low]
**Status:** 🔴 Active / 🟡 Mitigated / ✅ Resolved
**Incident Commander:** [Name]
**Start Time:** [Datetime in UTC]
**End Time:** [Datetime in UTC] / [Ongoing]
**Total Duration:** [X hours Y minutes]

---

## Executive Summary
[2–3 sentences describing what happened, who was affected, and current status. Written for a non-technical audience.]

---

## Impact
- **Users affected:** [X users / % of user base / specific cohort]
- **Services affected:** [List impacted services]
- **Data affected:** [None / [describe any data loss or corruption]]
- **Revenue impact:** [$X estimated / Not quantified]

---

## Timeline
| Time (UTC) | Event |
|------------|-------|
| [HH:MM] | [First alert or detection — what triggered it] |
| [HH:MM] | [Incident declared — who declared it] |
| [HH:MM] | [Initial diagnosis — what was investigated first] |
| [HH:MM] | [Mitigation attempt — what was tried] |
| [HH:MM] | [Root cause identified] |
| [HH:MM] | [Fix deployed — what was changed] |
| [HH:MM] | [Incident resolved — confirmed by monitoring] |

---

## Root Cause Analysis
**Root cause:** [The fundamental reason this happened, not just the proximate cause]

**Contributing factors:**
- [Factor 1: e.g. "No alerting on this specific metric"]
- [Factor 2: e.g. "Config change was not reviewed before deploy"]
- [Factor 3: e.g. "Runbook for this scenario was out of date"]

---

## What Went Well
- [E.g. "Incident was detected within 2 minutes by automated alerting"]
- [E.g. "Team communication was clear and centralized in incident channel"]

---

## What Could Be Improved
- [E.g. "Time to mitigation was 45 min — root cause was known at 15 min but deploy process slowed response"]
- [E.g. "Customer communication template did not exist — had to write from scratch"]

---

## Action Items
| Action | Owner | Due | Priority |
|--------|-------|-----|----------|
| [Add monitoring for X] | @person | [date] | P1 |
| [Update runbook for Y] | @person | [date] | P2 |
| [Fix underlying bug Z] | @person | [date] | P1 |

---

## Communication Sent
- [HH:MM] Status page updated: "[message]"
- [HH:MM] Customer email sent to [segment]: "[subject]"
`,
  },
  {
    id: "knowledge-base",
    emoji: "📚",
    name: "Knowledge Base Article",
    description:
      "Evergreen documentation: how-tos, explanations, and troubleshooting.",
    preview: "## [Topic]\nOverview · Steps · Troubleshooting",
    content: `## [Article Title]
**Category:** [Category / Tag]
**Author:** [Name]
**Last reviewed:** [Date]
**Audience:** [End users / Developers / Admins]

---

## Overview
[1–3 sentences explaining what this article covers and who it's for.]

> Example: "This article explains how to set up two-factor authentication (2FA) on your Fourthspace account. It covers authenticator app setup and backup code generation."

---

## Prerequisites
Before following these steps, make sure you have:
- [ ] [Prerequisite 1 — e.g. "An active Fourthspace account"]
- [ ] [Prerequisite 2 — e.g. "An authenticator app installed (e.g. Authy, Google Authenticator)"]

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

## Common Use Cases
- **[Use case 1]:** [How to handle this scenario]
- **[Use case 2]:** [How to handle this scenario]
- **[Use case 3]:** [How to handle this scenario]

---

## Troubleshooting

### Problem: [Issue description]
**Cause:** [Why this happens]
**Solution:** [Steps to fix it]

### Problem: [Issue description]
**Cause:** [Why this happens]
**Solution:** [Steps to fix it]

---

## FAQ
**Q: [Common question]?**
A: [Clear, direct answer]

**Q: [Common question]?**
A: [Answer]

---

## Related Articles
- [Link to related article 1]
- [Link to related article 2]

---

## Feedback
Was this article helpful? [Yes / No — link to feedback form]
*Last reviewed by [Name] on [date]. [Report an issue with this article.]*
`,
  },
];

// ─── Template Picker Component ───────────────────────────────────────────────

interface TemplatePickerProps {
  onSelect: (template: NoteTemplate | null) => void;
}

function TemplatePicker({ onSelect }: TemplatePickerProps) {
  const [selected, setSelected] = useState<NoteTemplate | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return NOTE_TEMPLATES;
    return NOTE_TEMPLATES.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <div className="animate-fade-in-up flex flex-col min-h-screen bg-background">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/60 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground tracking-tight">
                Start with a template
              </h1>
              <p className="text-xs text-muted-foreground">
                Choose a template to jump-start your note, or start blank.
              </p>
            </div>
          </div>
          <Input
            placeholder="Search templates…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm h-9 text-sm border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
            data-ocid="template-search-input"
          />
        </div>
      </div>

      {/* Template grid */}
      <div className="flex-1 px-4 sm:px-6 py-6 max-w-5xl mx-auto w-full">
        {/* Start blank */}
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="w-full mb-6 flex items-center gap-3 rounded-xl border-2 border-dashed border-border/60 bg-muted/30 px-4 py-3.5 text-left hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
          data-ocid="template-blank-btn"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border/60 text-xl shrink-0 group-hover:border-primary/40 transition-colors">
            ✏️
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              Start blank
            </p>
            <p className="text-xs text-muted-foreground">
              Open an empty note and write freely
            </p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
        </button>

        {/* Templates */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm">No templates match "{search}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((tpl) => {
              const isSelected = selected?.id === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setSelected(isSelected ? null : tpl)}
                  className={[
                    "relative text-left rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md group",
                    isSelected
                      ? "border-primary ring-2 ring-primary/30 shadow-md"
                      : "border-border/60 hover:border-primary/40",
                  ].join(" ")}
                  data-ocid={`template-card-${tpl.id}`}
                >
                  {isSelected && (
                    <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </span>
                  )}
                  <div className="text-2xl mb-2.5">{tpl.emoji}</div>
                  <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {tpl.description}
                  </p>
                  <pre className="text-xs text-muted-foreground/80 font-mono bg-muted/50 rounded-md p-2 line-clamp-2 overflow-hidden whitespace-pre-wrap break-words">
                    {tpl.preview}
                  </pre>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky footer CTA */}
      {selected && (
        <div className="sticky bottom-0 z-10 border-t border-border/60 bg-background/95 backdrop-blur-sm px-4 sm:px-6 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-lg shrink-0">{selected.emoji}</span>
              <span className="text-sm font-medium text-foreground truncate">
                {selected.name}
              </span>
              <Badge variant="secondary" className="shrink-0 text-xs">
                selected
              </Badge>
            </div>
            <Button
              onClick={() => onSelect(selected)}
              className="gap-2 shrink-0"
              data-ocid="template-use-btn"
            >
              Use Template
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NoteNewPage() {
  const { workspaceId } = useParams({ from: "/app/$workspaceId/notes/new" });
  const { actor } = useBackend();
  const { tenantId } = useWorkspace();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Template picker step — null means not yet chosen
  const [pickerDone, setPickerDone] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [crossLinks, setCrossLinks] = useState<CrossLink[]>([]);

  const { mutate: createNote, isPending } = useMutation({
    mutationFn: async (input: NoteInput) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createNote(tenantId, workspaceId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", tenantId, workspaceId],
      });
      toast.success("Note created", {
        description: "Your note has been saved.",
      });
      navigate({ to: "/app/$workspaceId/notes", params: { workspaceId } });
    },
    onError: (err: Error) =>
      toast.error("Failed to create note", { description: err.message }),
  });

  const addTags = (input: string) => {
    const newTags = input
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0 && !tags.includes(t));
    if (newTags.length > 0) setTags((prev) => [...prev, ...newTags]);
    setTagInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    createNote({ title: title.trim(), content, tags, crossLinks });
  };

  // Handle template selection (null = blank)
  const handleTemplateSelect = (tpl: NoteTemplate | null) => {
    if (tpl) {
      setTitle(tpl.name);
      setContent(tpl.content);
    }
    setPickerDone(true);
  };

  // ── Step 1: Template picker ──────────────────────────────────────────────
  if (!pickerDone) {
    return <TemplatePicker onSelect={handleTemplateSelect} />;
  }

  // ── Step 2: Note creation form ───────────────────────────────────────────
  return (
    <div className="animate-fade-in-up p-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPickerDone(false)}
          className="shrink-0 h-8 w-8"
          aria-label="Back to template picker"
          data-ocid="note-back-to-templates-btn"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <StickyNote className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground tracking-tight">
              New Note
            </h1>
            <p className="text-xs text-muted-foreground">
              Capture your thoughts and ideas
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Title */}
        <div className="space-y-1.5">
          <Label
            htmlFor="note-title"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="note-title"
            placeholder="Give your note a clear title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-base font-semibold h-11 border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
            autoFocus
            required
            data-ocid="note-title-input"
          />
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <Label
            htmlFor="note-content"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Content
          </Label>
          <Textarea
            id="note-content"
            placeholder="Write your note here… plain text, bullet points, or any format you like."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[260px] resize-y leading-relaxed font-body text-sm border-border/60 focus:border-primary focus:ring-1 focus:ring-primary/30"
            data-ocid="note-content-input"
          />
          <p className="text-xs text-muted-foreground text-right">
            {content.length} character{content.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <Label
            htmlFor="note-tags"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
          >
            <Tag className="h-3 w-3" /> Tags
          </Label>
          <div className="rounded-lg border border-border/60 bg-background p-3 space-y-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() =>
                        setTags((prev) => prev.filter((t) => t !== tag))
                      }
                      aria-label={`Remove tag ${tag}`}
                      className="hover:text-destructive"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <Input
              id="note-tags"
              placeholder="Add tags… (comma-separated, Enter to add)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTags(tagInput);
                }
              }}
              onBlur={() => tagInput.trim() && addTags(tagInput)}
              className="border-0 px-0 h-7 focus-visible:ring-0 shadow-none bg-transparent text-sm"
              data-ocid="note-tags-input"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Press Enter or comma to add a tag
          </p>
        </div>

        {/* Cross-links */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Cross-links
          </Label>
          <div className="rounded-lg border border-border/60 bg-background p-3.5">
            <p className="text-xs text-muted-foreground mb-3">
              Link this note to other entities in your workspace
            </p>
            <CrossLinkPicker
              tenantId={tenantId}
              value={crossLinks}
              onChange={setCrossLinks}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-border/40">
          <Button
            type="submit"
            disabled={!title.trim() || isPending}
            className="gap-2 active-press"
            data-ocid="note-save-btn"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isPending ? "Saving…" : "Save Note"}
          </Button>
          <Button
            type="button"
            variant="outline"
            asChild
            data-ocid="note-cancel-btn"
          >
            <Link to="/app/$workspaceId/notes" params={{ workspaceId }}>
              Cancel
            </Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
