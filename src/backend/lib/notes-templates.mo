import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Types "../types/notes";
import Common "../types/common";

module {

  func toMap(store : [(Common.EntityId, Types.NoteTemplate)]) : Map.Map<Common.EntityId, Types.NoteTemplate> {
    Map.fromArray(store)
  };

  func toStore(m : Map.Map<Common.EntityId, Types.NoteTemplate>) : [(Common.EntityId, Types.NoteTemplate)] {
    m.toArray()
  };

  func genId(salt : Text) : Common.EntityId {
    let ts = Time.now();
    ts.toText() # "-" # salt
  };

  func builtins(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId) : [Types.NoteTemplate] {
    let anonPrincipal = Principal.fromText("aaaaa-aa");
    [
      {
        id = "builtin-meeting-notes";
        tenantId;
        workspaceId;
        name = "Meeting Notes";
        description = "Capture attendees, agenda, key decisions, and action items from any meeting";
        icon = "📝";
        blocksJson = "[{\"id\":\"b1\",\"parentId\":null,\"order\":0,\"blockType\":\"heading1\",\"content\":\"Meeting Notes\",\"metadata\":\"{}\"},{\"id\":\"b2\",\"parentId\":null,\"order\":1,\"blockType\":\"paragraph\",\"content\":\"📅 Date: [Insert date]   ⏰ Time: [Start time] – [End time]   📍 Location / Link: [In-person or video link]\",\"metadata\":\"{}\"},{\"id\":\"b3\",\"parentId\":null,\"order\":2,\"blockType\":\"heading2\",\"content\":\"👥 Attendees\",\"metadata\":\"{}\"},{\"id\":\"b4\",\"parentId\":null,\"order\":3,\"blockType\":\"bulletList\",\"content\":\"[Name] — [Role / Team]\",\"metadata\":\"{}\"},{\"id\":\"b5\",\"parentId\":null,\"order\":4,\"blockType\":\"bulletList\",\"content\":\"[Name] — [Role / Team]\",\"metadata\":\"{}\"},{\"id\":\"b6\",\"parentId\":null,\"order\":5,\"blockType\":\"heading2\",\"content\":\"📋 Agenda\",\"metadata\":\"{}\"},{\"id\":\"b7\",\"parentId\":null,\"order\":6,\"blockType\":\"numberedList\",\"content\":\"[Topic 1] — [Owner] — [Time allotted]\",\"metadata\":\"{}\"},{\"id\":\"b8\",\"parentId\":null,\"order\":7,\"blockType\":\"numberedList\",\"content\":\"[Topic 2] — [Owner] — [Time allotted]\",\"metadata\":\"{}\"},{\"id\":\"b9\",\"parentId\":null,\"order\":8,\"blockType\":\"numberedList\",\"content\":\"[Topic 3] — [Owner] — [Time allotted]\",\"metadata\":\"{}\"},{\"id\":\"b10\",\"parentId\":null,\"order\":9,\"blockType\":\"heading2\",\"content\":\"🗒️ Discussion Notes\",\"metadata\":\"{}\"},{\"id\":\"b11\",\"parentId\":null,\"order\":10,\"blockType\":\"heading3\",\"content\":\"Topic 1: [Name]\",\"metadata\":\"{}\"},{\"id\":\"b12\",\"parentId\":null,\"order\":11,\"blockType\":\"paragraph\",\"content\":\"Key points discussed:\",\"metadata\":\"{}\"},{\"id\":\"b13\",\"parentId\":null,\"order\":12,\"blockType\":\"bulletList\",\"content\":\"[Point]\",\"metadata\":\"{}\"},{\"id\":\"b14\",\"parentId\":null,\"order\":13,\"blockType\":\"heading2\",\"content\":\"✅ Decisions Made\",\"metadata\":\"{}\"},{\"id\":\"b15\",\"parentId\":null,\"order\":14,\"blockType\":\"bulletList\",\"content\":\"Decision: [What was decided] — Rationale: [Why]\",\"metadata\":\"{}\"},{\"id\":\"b16\",\"parentId\":null,\"order\":15,\"blockType\":\"heading2\",\"content\":\"⚡ Action Items\",\"metadata\":\"{}\"},{\"id\":\"b17\",\"parentId\":null,\"order\":16,\"blockType\":\"bulletList\",\"content\":\"[ ] [Owner] — [Action] — Due: [Date]\",\"metadata\":\"{}\"},{\"id\":\"b18\",\"parentId\":null,\"order\":17,\"blockType\":\"bulletList\",\"content\":\"[ ] [Owner] — [Action] — Due: [Date]\",\"metadata\":\"{}\"},{\"id\":\"b19\",\"parentId\":null,\"order\":18,\"blockType\":\"heading2\",\"content\":\"📅 Next Meeting\",\"metadata\":\"{}\"},{\"id\":\"b20\",\"parentId\":null,\"order\":19,\"blockType\":\"paragraph\",\"content\":\"Date: [Next meeting date]   Agenda preview: [Topics to cover]\",\"metadata\":\"{}\"}]";
        authorId = anonPrincipal;
        createdAt = 0;
      },
      {
        id = "builtin-project-brief";
        tenantId;
        workspaceId;
        name = "Project Brief";
        description = "Define project goals, scope, timeline, stakeholders, and success metrics";
        icon = "🎯";
        blocksJson = "[{\"id\":\"b1\",\"parentId\":null,\"order\":0,\"blockType\":\"heading1\",\"content\":\"Project Brief\",\"metadata\":\"{}\"},{\"id\":\"b2\",\"parentId\":null,\"order\":1,\"blockType\":\"callout\",\"content\":\"📌 Status: [Draft / In Review / Approved]   Owner: [Name]   Last updated: [Date]\",\"metadata\":\"{}\"},{\"id\":\"b3\",\"parentId\":null,\"order\":2,\"blockType\":\"heading2\",\"content\":\"🔍 Problem Statement\",\"metadata\":\"{}\"},{\"id\":\"b4\",\"parentId\":null,\"order\":3,\"blockType\":\"paragraph\",\"content\":\"What problem are we solving and for whom? Why does it matter now?\",\"metadata\":\"{}\"},{\"id\":\"b5\",\"parentId\":null,\"order\":4,\"blockType\":\"heading2\",\"content\":\"🎯 Goals & Success Metrics\",\"metadata\":\"{}\"},{\"id\":\"b6\",\"parentId\":null,\"order\":5,\"blockType\":\"bulletList\",\"content\":\"Goal 1: [Specific, measurable outcome] — Metric: [KPI]\",\"metadata\":\"{}\"},{\"id\":\"b7\",\"parentId\":null,\"order\":6,\"blockType\":\"bulletList\",\"content\":\"Goal 2: [Specific, measurable outcome] — Metric: [KPI]\",\"metadata\":\"{}\"},{\"id\":\"b8\",\"parentId\":null,\"order\":7,\"blockType\":\"heading2\",\"content\":\"📦 Scope\",\"metadata\":\"{}\"},{\"id\":\"b9\",\"parentId\":null,\"order\":8,\"blockType\":\"heading3\",\"content\":\"In Scope\",\"metadata\":\"{}\"},{\"id\":\"b10\",\"parentId\":null,\"order\":9,\"blockType\":\"bulletList\",\"content\":\"[Feature / deliverable]\",\"metadata\":\"{}\"},{\"id\":\"b11\",\"parentId\":null,\"order\":10,\"blockType\":\"heading3\",\"content\":\"Out of Scope\",\"metadata\":\"{}\"},{\"id\":\"b12\",\"parentId\":null,\"order\":11,\"blockType\":\"bulletList\",\"content\":\"[What we are explicitly NOT doing]\",\"metadata\":\"{}\"},{\"id\":\"b13\",\"parentId\":null,\"order\":12,\"blockType\":\"heading2\",\"content\":\"🗓️ Timeline & Milestones\",\"metadata\":\"{}\"},{\"id\":\"b14\",\"parentId\":null,\"order\":13,\"blockType\":\"bulletList\",\"content\":\"[Date] — Milestone: [Name]\",\"metadata\":\"{}\"},{\"id\":\"b15\",\"parentId\":null,\"order\":14,\"blockType\":\"bulletList\",\"content\":\"[Date] — Milestone: [Name]\",\"metadata\":\"{}\"},{\"id\":\"b16\",\"parentId\":null,\"order\":15,\"blockType\":\"heading2\",\"content\":\"👥 Stakeholders & Roles\",\"metadata\":\"{}\"},{\"id\":\"b17\",\"parentId\":null,\"order\":16,\"blockType\":\"bulletList\",\"content\":\"[Name] — [Role]: Responsible for [area]\",\"metadata\":\"{}\"},{\"id\":\"b18\",\"parentId\":null,\"order\":17,\"blockType\":\"heading2\",\"content\":\"⚠️ Risks & Mitigations\",\"metadata\":\"{}\"},{\"id\":\"b19\",\"parentId\":null,\"order\":18,\"blockType\":\"bulletList\",\"content\":\"Risk: [Description] — Likelihood: [H/M/L] — Mitigation: [Plan]\",\"metadata\":\"{}\"},{\"id\":\"b20\",\"parentId\":null,\"order\":19,\"blockType\":\"heading2\",\"content\":\"💰 Budget & Resources\",\"metadata\":\"{}\"},{\"id\":\"b21\",\"parentId\":null,\"order\":20,\"blockType\":\"paragraph\",\"content\":\"Estimated budget: [Amount]   Headcount: [Number]   Tools/licenses required: [List]\",\"metadata\":\"{}\"}]";
        authorId = anonPrincipal;
        createdAt = 0;
      },
      {
        id = "builtin-weekly-review";
        tenantId;
        workspaceId;
        name = "Weekly Review";
        description = "Reflect on wins, challenges, learnings, and set goals for next week";
        icon = "📅";
        blocksJson = "[{\"id\":\"b1\",\"parentId\":null,\"order\":0,\"blockType\":\"heading1\",\"content\":\"Weekly Review\",\"metadata\":\"{}\"},{\"id\":\"b2\",\"parentId\":null,\"order\":1,\"blockType\":\"paragraph\",\"content\":\"📅 Week of: [Monday date] – [Friday date]\",\"metadata\":\"{}\"},{\"id\":\"b3\",\"parentId\":null,\"order\":2,\"blockType\":\"heading2\",\"content\":\"🏆 Wins & Accomplishments\",\"metadata\":\"{}\"},{\"id\":\"b4\",\"parentId\":null,\"order\":3,\"blockType\":\"bulletList\",\"content\":\"[What went well? What are you proud of?]\",\"metadata\":\"{}\"},{\"id\":\"b5\",\"parentId\":null,\"order\":4,\"blockType\":\"heading2\",\"content\":\"🚧 Challenges & Obstacles\",\"metadata\":\"{}\"},{\"id\":\"b6\",\"parentId\":null,\"order\":5,\"blockType\":\"bulletList\",\"content\":\"[What was difficult? What slowed you down?]\",\"metadata\":\"{}\"},{\"id\":\"b7\",\"parentId\":null,\"order\":6,\"blockType\":\"heading2\",\"content\":\"📚 Key Learnings\",\"metadata\":\"{}\"},{\"id\":\"b8\",\"parentId\":null,\"order\":7,\"blockType\":\"bulletList\",\"content\":\"[What did you learn this week? What would you do differently?]\",\"metadata\":\"{}\"},{\"id\":\"b9\",\"parentId\":null,\"order\":8,\"blockType\":\"heading2\",\"content\":\"🔢 Key Metrics This Week\",\"metadata\":\"{}\"},{\"id\":\"b10\",\"parentId\":null,\"order\":9,\"blockType\":\"bulletList\",\"content\":\"[Metric name]: [Value] (vs last week: [Value])\",\"metadata\":\"{}\"},{\"id\":\"b11\",\"parentId\":null,\"order\":10,\"blockType\":\"heading2\",\"content\":\"🎯 Next Week Goals\",\"metadata\":\"{}\"},{\"id\":\"b12\",\"parentId\":null,\"order\":11,\"blockType\":\"numberedList\",\"content\":\"[Top priority for next week] — Owner: [Name] — Due: [Date]\",\"metadata\":\"{}\"},{\"id\":\"b13\",\"parentId\":null,\"order\":12,\"blockType\":\"numberedList\",\"content\":\"[Second priority] — Owner: [Name] — Due: [Date]\",\"metadata\":\"{}\"},{\"id\":\"b14\",\"parentId\":null,\"order\":13,\"blockType\":\"numberedList\",\"content\":\"[Third priority] — Owner: [Name] — Due: [Date]\",\"metadata\":\"{}\"},{\"id\":\"b15\",\"parentId\":null,\"order\":14,\"blockType\":\"heading2\",\"content\":\"😊 Energy & Wellbeing Check-in\",\"metadata\":\"{}\"},{\"id\":\"b16\",\"parentId\":null,\"order\":15,\"blockType\":\"paragraph\",\"content\":\"Energy level this week (1–10): [Score]   Notes: [How are you feeling overall?]\",\"metadata\":\"{}\"}]";
        authorId = anonPrincipal;
        createdAt = 0;
      },
      {
        id = "builtin-daily-standup";
        tenantId;
        workspaceId;
        name = "Daily Standup";
        description = "Track yesterday's progress, today's plan, and blockers in 5 minutes";
        icon = "☀️";
        blocksJson = "[{\"id\":\"b1\",\"parentId\":null,\"order\":0,\"blockType\":\"heading1\",\"content\":\"Daily Standup\",\"metadata\":\"{}\"},{\"id\":\"b2\",\"parentId\":null,\"order\":1,\"blockType\":\"paragraph\",\"content\":\"📅 Date: [Today's date]   ⏰ Time: [Standup time]   👥 Team: [Team name]\",\"metadata\":\"{}\"},{\"id\":\"b3\",\"parentId\":null,\"order\":2,\"blockType\":\"heading2\",\"content\":\"✅ Yesterday\",\"metadata\":\"{}\"},{\"id\":\"b4\",\"parentId\":null,\"order\":3,\"blockType\":\"bulletList\",\"content\":\"[Name]: [What did you complete? Link tasks if possible]\",\"metadata\":\"{}\"},{\"id\":\"b5\",\"parentId\":null,\"order\":4,\"blockType\":\"heading2\",\"content\":\"🔨 Today\",\"metadata\":\"{}\"},{\"id\":\"b6\",\"parentId\":null,\"order\":5,\"blockType\":\"bulletList\",\"content\":\"[Name]: [What are you working on today?]\",\"metadata\":\"{}\"},{\"id\":\"b7\",\"parentId\":null,\"order\":6,\"blockType\":\"heading2\",\"content\":\"🚨 Blockers\",\"metadata\":\"{}\"},{\"id\":\"b8\",\"parentId\":null,\"order\":7,\"blockType\":\"bulletList\",\"content\":\"[Name]: [Blocker description] — Needs help from: [Person/Team]\",\"metadata\":\"{}\"},{\"id\":\"b9\",\"parentId\":null,\"order\":8,\"blockType\":\"heading2\",\"content\":\"📢 Announcements\",\"metadata\":\"{}\"},{\"id\":\"b10\",\"parentId\":null,\"order\":9,\"blockType\":\"bulletList\",\"content\":\"[Any team-wide updates or important reminders]\",\"metadata\":\"{}\"}]";
        authorId = anonPrincipal;
        createdAt = 0;
      },
      {
        id = "builtin-product-requirements";
        tenantId;
        workspaceId;
        name = "Product Requirements Document (PRD)";
        description = "Define product features, user stories, acceptance criteria, and technical requirements";
        icon = "📦";
        blocksJson = "[{\"id\":\"b1\",\"parentId\":null,\"order\":0,\"blockType\":\"heading1\",\"content\":\"Product Requirements Document\",\"metadata\":\"{}\"},{\"id\":\"b2\",\"parentId\":null,\"order\":1,\"blockType\":\"callout\",\"content\":\"Feature: [Feature name]   Status: [Draft / In Review / Approved]   PM: [Name]   Eng Lead: [Name]   Target release: [Version / Date]\",\"metadata\":\"{}\"},{\"id\":\"b3\",\"parentId\":null,\"order\":2,\"blockType\":\"heading2\",\"content\":\"🎯 Problem & Opportunity\",\"metadata\":\"{}\"},{\"id\":\"b4\",\"parentId\":null,\"order\":3,\"blockType\":\"paragraph\",\"content\":\"Describe the user problem we are solving and the business opportunity. Include data or research that validates the need.\",\"metadata\":\"{}\"},{\"id\":\"b5\",\"parentId\":null,\"order\":4,\"blockType\":\"heading2\",\"content\":\"👤 User Stories\",\"metadata\":\"{}\"},{\"id\":\"b6\",\"parentId\":null,\"order\":5,\"blockType\":\"bulletList\",\"content\":\"As a [user type], I want to [action] so that [benefit].\",\"metadata\":\"{}\"},{\"id\":\"b7\",\"parentId\":null,\"order\":6,\"blockType\":\"bulletList\",\"content\":\"As a [user type], I want to [action] so that [benefit].\",\"metadata\":\"{}\"},{\"id\":\"b8\",\"parentId\":null,\"order\":7,\"blockType\":\"heading2\",\"content\":\"✅ Functional Requirements\",\"metadata\":\"{}\"},{\"id\":\"b9\",\"parentId\":null,\"order\":8,\"blockType\":\"numberedList\",\"content\":\"REQ-001: [System must / should do X]\",\"metadata\":\"{}\"},{\"id\":\"b10\",\"parentId\":null,\"order\":9,\"blockType\":\"numberedList\",\"content\":\"REQ-002: [System must / should do Y]\",\"metadata\":\"{}\"},{\"id\":\"b11\",\"parentId\":null,\"order\":10,\"blockType\":\"heading2\",\"content\":\"🚫 Non-Functional Requirements\",\"metadata\":\"{}\"},{\"id\":\"b12\",\"parentId\":null,\"order\":11,\"blockType\":\"bulletList\",\"content\":\"Performance: [e.g., page load < 2s for 99th percentile]\",\"metadata\":\"{}\"},{\"id\":\"b13\",\"parentId\":null,\"order\":12,\"blockType\":\"bulletList\",\"content\":\"Security: [e.g., all data encrypted at rest and in transit]\",\"metadata\":\"{}\"},{\"id\":\"b14\",\"parentId\":null,\"order\":13,\"blockType\":\"heading2\",\"content\":\"🎨 UX / Design Notes\",\"metadata\":\"{}\"},{\"id\":\"b15\",\"parentId\":null,\"order\":14,\"blockType\":\"paragraph\",\"content\":\"Link to Figma designs: [URL]   Key UX principles: [e.g., mobile-first, minimal friction]\",\"metadata\":\"{}\"},{\"id\":\"b16\",\"parentId\":null,\"order\":15,\"blockType\":\"heading2\",\"content\":\"✋ Out of Scope\",\"metadata\":\"{}\"},{\"id\":\"b17\",\"parentId\":null,\"order\":16,\"blockType\":\"bulletList\",\"content\":\"[What is explicitly not included in this release]\",\"metadata\":\"{}\"},{\"id\":\"b18\",\"parentId\":null,\"order\":17,\"blockType\":\"heading2\",\"content\":\"📊 Success Metrics\",\"metadata\":\"{}\"},{\"id\":\"b19\",\"parentId\":null,\"order\":18,\"blockType\":\"bulletList\",\"content\":\"Primary: [Metric] — Target: [Value] — Timeframe: [e.g., 30 days post-launch]\",\"metadata\":\"{}\"},{\"id\":\"b20\",\"parentId\":null,\"order\":19,\"blockType\":\"heading2\",\"content\":\"🔗 Dependencies & Open Questions\",\"metadata\":\"{}\"},{\"id\":\"b21\",\"parentId\":null,\"order\":20,\"blockType\":\"bulletList\",\"content\":\"Dependency: [What this feature depends on]\",\"metadata\":\"{}\"},{\"id\":\"b22\",\"parentId\":null,\"order\":21,\"blockType\":\"bulletList\",\"content\":\"Open question: [Unresolved decision] — Owner: [Name]\",\"metadata\":\"{}\"}]";
        authorId = anonPrincipal;
        createdAt = 0;
      },
      {
        id = "builtin-sprint-planning";
        tenantId;
        workspaceId;
        name = "Sprint Planning";
        description = "Plan your sprint with goals, capacity, task breakdown, and definition of done";
        icon = "🏃";
        blocksJson = "[{\"id\":\"b1\",\"parentId\":null,\"order\":0,\"blockType\":\"heading1\",\"content\":\"Sprint Planning\",\"metadata\":\"{}\"},{\"id\":\"b2\",\"parentId\":null,\"order\":1,\"blockType\":\"paragraph\",\"content\":\"📅 Sprint: [Sprint #]   Start: [Date]   End: [Date]   Team: [Team name]\",\"metadata\":\"{}\"},{\"id\":\"b3\",\"parentId\":null,\"order\":2,\"blockType\":\"heading2\",\"content\":\"🎯 Sprint Goal\",\"metadata\":\"{}\"},{\"id\":\"b4\",\"parentId\":null,\"order\":3,\"blockType\":\"callout\",\"content\":\"By the end of this sprint, we will [deliver X] which [achieves Y outcome] as evidenced by [measurable indicator].\",\"metadata\":\"{}\"},{\"id\":\"b5\",\"parentId\":null,\"order\":4,\"blockType\":\"heading2\",\"content\":\"👥 Team Capacity\",\"metadata\":\"{}\"},{\"id\":\"b6\",\"parentId\":null,\"order\":5,\"blockType\":\"bulletList\",\"content\":\"[Name]: [Available days] / [Sprint days] — [Story points capacity]\",\"metadata\":\"{}\"},{\"id\":\"b7\",\"parentId\":null,\"order\":6,\"blockType\":\"bulletList\",\"content\":\"Total team capacity: [X story points]\",\"metadata\":\"{}\"},{\"id\":\"b8\",\"parentId\":null,\"order\":7,\"blockType\":\"heading2\",\"content\":\"📋 Sprint Backlog\",\"metadata\":\"{}\"},{\"id\":\"b9\",\"parentId\":null,\"order\":8,\"blockType\":\"bulletList\",\"content\":\"[ ] [Task title] — Owner: [Name] — Points: [#] — Priority: [High/Med/Low]\",\"metadata\":\"{}\"},{\"id\":\"b10\",\"parentId\":null,\"order\":9,\"blockType\":\"bulletList\",\"content\":\"[ ] [Task title] — Owner: [Name] — Points: [#] — Priority: [High/Med/Low]\",\"metadata\":\"{}\"},{\"id\":\"b11\",\"parentId\":null,\"order\":10,\"blockType\":\"heading2\",\"content\":\"✅ Definition of Done\",\"metadata\":\"{}\"},{\"id\":\"b12\",\"parentId\":null,\"order\":11,\"blockType\":\"bulletList\",\"content\":\"[ ] Code reviewed and approved by at least one peer\",\"metadata\":\"{}\"},{\"id\":\"b13\",\"parentId\":null,\"order\":12,\"blockType\":\"bulletList\",\"content\":\"[ ] Unit and integration tests written and passing\",\"metadata\":\"{}\"},{\"id\":\"b14\",\"parentId\":null,\"order\":13,\"blockType\":\"bulletList\",\"content\":\"[ ] Documentation updated\",\"metadata\":\"{}\"},{\"id\":\"b15\",\"parentId\":null,\"order\":14,\"blockType\":\"bulletList\",\"content\":\"[ ] Deployed to staging and QA sign-off received\",\"metadata\":\"{}\"},{\"id\":\"b16\",\"parentId\":null,\"order\":15,\"blockType\":\"heading2\",\"content\":\"⚠️ Risks & Dependencies\",\"metadata\":\"{}\"},{\"id\":\"b17\",\"parentId\":null,\"order\":16,\"blockType\":\"bulletList\",\"content\":\"Risk: [Description] — Mitigation: [Plan]\",\"metadata\":\"{}\"}]";
        authorId = anonPrincipal;
        createdAt = 0;
      },
      {
        id = "builtin-retrospective";
        tenantId;
        workspaceId;
        name = "Sprint Retrospective";
        description = "Structured retrospective to capture what worked, what didn't, and team commitments";
        icon = "🔄";
        blocksJson = "[{\"id\":\"b1\",\"parentId\":null,\"order\":0,\"blockType\":\"heading1\",\"content\":\"Sprint Retrospective\",\"metadata\":\"{}\"},{\"id\":\"b2\",\"parentId\":null,\"order\":1,\"blockType\":\"paragraph\",\"content\":\"📅 Sprint: [Sprint #]   Date: [Retro date]   Facilitator: [Name]   Team: [Team name]\",\"metadata\":\"{}\"},{\"id\":\"b3\",\"parentId\":null,\"order\":2,\"blockType\":\"heading2\",\"content\":\"😊 What Went Well (Keep)\",\"metadata\":\"{}\"},{\"id\":\"b4\",\"parentId\":null,\"order\":3,\"blockType\":\"bulletList\",\"content\":\"[Add team wins here — processes, tools, collaboration that worked well]\",\"metadata\":\"{}\"},{\"id\":\"b5\",\"parentId\":null,\"order\":4,\"blockType\":\"heading2\",\"content\":\"😞 What Didn't Go Well (Stop / Fix)\",\"metadata\":\"{}\"},{\"id\":\"b6\",\"parentId\":null,\"order\":5,\"blockType\":\"bulletList\",\"content\":\"[Add pain points, friction, or failures here — be specific and factual, not personal]\",\"metadata\":\"{}\"},{\"id\":\"b7\",\"parentId\":null,\"order\":6,\"blockType\":\"heading2\",\"content\":\"💡 What to Try (Start)\",\"metadata\":\"{}\"},{\"id\":\"b8\",\"parentId\":null,\"order\":7,\"blockType\":\"bulletList\",\"content\":\"[Experiments or improvements the team wants to try next sprint]\",\"metadata\":\"{}\"},{\"id\":\"b9\",\"parentId\":null,\"order\":8,\"blockType\":\"heading2\",\"content\":\"⚡ Action Items\",\"metadata\":\"{}\"},{\"id\":\"b10\",\"parentId\":null,\"order\":9,\"blockType\":\"bulletList\",\"content\":\"[ ] [Owner] — [Specific action to take] — By: [Next retro / Sprint end]\",\"metadata\":\"{}\"},{\"id\":\"b11\",\"parentId\":null,\"order\":10,\"blockType\":\"heading2\",\"content\":\"📊 Sprint Metrics\",\"metadata\":\"{}\"},{\"id\":\"b12\",\"parentId\":null,\"order\":11,\"blockType\":\"bulletList\",\"content\":\"Velocity: [Story points completed] / [Story points committed]\",\"metadata\":\"{}\"},{\"id\":\"b13\",\"parentId\":null,\"order\":12,\"blockType\":\"bulletList\",\"content\":\"Team happiness score (avg): [1–10]\",\"metadata\":\"{}\"},{\"id\":\"b14\",\"parentId\":null,\"order\":13,\"blockType\":\"paragraph\",\"content\":\"Facilitator notes: [Any additional observations or patterns noticed]\",\"metadata\":\"{}\"}]";
        authorId = anonPrincipal;
        createdAt = 0;
      },
      {
        id = "builtin-one-on-one";
        tenantId;
        workspaceId;
        name = "1-on-1 Meeting";
        description = "Manager and direct report check-in with agenda, feedback, and career development";
        icon = "🤝";
        blocksJson = "[{\"id\":\"b1\",\"parentId\":null,\"order\":0,\"blockType\":\"heading1\",\"content\":\"1-on-1 Meeting\",\"metadata\":\"{}\"},{\"id\":\"b2\",\"parentId\":null,\"order\":1,\"blockType\":\"paragraph\",\"content\":\"📅 Date: [Date]   👤 Manager: [Name]   👤 Direct Report: [Name]   Frequency: [Weekly / Bi-weekly]\",\"metadata\":\"{}\"},{\"id\":\"b3\",\"parentId\":null,\"order\":2,\"blockType\":\"heading2\",\"content\":\"📋 Agenda Items\",\"metadata\":\"{}\"},{\"id\":\"b4\",\"parentId\":null,\"order\":3,\"blockType\":\"bulletList\",\"content\":\"[Direct report adds their topics first — this meeting is for them]\",\"metadata\":\"{}\"},{\"id\":\"b5\",\"parentId\":null,\"order\":4,\"blockType\":\"bulletList\",\"content\":\"[Manager adds topics]\",\"metadata\":\"{}\"},{\"id\":\"b6\",\"parentId\":null,\"order\":5,\"blockType\":\"heading2\",\"content\":\"🌟 Recent Wins\",\"metadata\":\"{}\"},{\"id\":\"b7\",\"parentId\":null,\"order\":6,\"blockType\":\"bulletList\",\"content\":\"[Accomplishments since last 1-on-1]\",\"metadata\":\"{}\"},{\"id\":\"b8\",\"parentId\":null,\"order\":7,\"blockType\":\"heading2\",\"content\":\"🚨 Current Challenges\",\"metadata\":\"{}\"},{\"id\":\"b9\",\"parentId\":null,\"order\":8,\"blockType\":\"bulletList\",\"content\":\"[What is hard right now? Any blockers?]\",\"metadata\":\"{}\"},{\"id\":\"b10\",\"parentId\":null,\"order\":9,\"blockType\":\"heading2\",\"content\":\"💬 Feedback\",\"metadata\":\"{}\"},{\"id\":\"b11\",\"parentId\":null,\"order\":10,\"blockType\":\"heading3\",\"content\":\"Manager → Direct Report\",\"metadata\":\"{}\"},{\"id\":\"b12\",\"parentId\":null,\"order\":11,\"blockType\":\"paragraph\",\"content\":\"[Specific, actionable feedback on recent work and behaviors]\",\"metadata\":\"{}\"},{\"id\":\"b13\",\"parentId\":null,\"order\":12,\"blockType\":\"heading3\",\"content\":\"Direct Report → Manager\",\"metadata\":\"{}\"},{\"id\":\"b14\",\"parentId\":null,\"order\":13,\"blockType\":\"paragraph\",\"content\":\"[Feedback for manager — what support do you need? What can they do better?]\",\"metadata\":\"{}\"},{\"id\":\"b15\",\"parentId\":null,\"order\":14,\"blockType\":\"heading2\",\"content\":\"🚀 Career & Growth\",\"metadata\":\"{}\"},{\"id\":\"b16\",\"parentId\":null,\"order\":15,\"blockType\":\"bulletList\",\"content\":\"Current goals: [Short-term / long-term career aspirations]\",\"metadata\":\"{}\"},{\"id\":\"b17\",\"parentId\":null,\"order\":16,\"blockType\":\"bulletList\",\"content\":\"Skills to develop: [Technical, soft skills]\",\"metadata\":\"{}\"},{\"id\":\"b18\",\"parentId\":null,\"order\":17,\"blockType\":\"heading2\",\"content\":\"⚡ Action Items\",\"metadata\":\"{}\"},{\"id\":\"b19\",\"parentId\":null,\"order\":18,\"blockType\":\"bulletList\",\"content\":\"[ ] [Owner] — [Action] — By: [Date]\",\"metadata\":\"{}\"}]";
        authorId = anonPrincipal;
        createdAt = 0;
      },
      {
        id = "builtin-okr-planning";
        tenantId;
        workspaceId;
        name = "OKR Planning";
        description = "Set quarterly objectives with key results, initiatives, and tracking cadence";
        icon = "🏔️";
        blocksJson = "[{\"id\":\"b1\",\"parentId\":null,\"order\":0,\"blockType\":\"heading1\",\"content\":\"OKR Planning\",\"metadata\":\"{}\"},{\"id\":\"b2\",\"parentId\":null,\"order\":1,\"blockType\":\"paragraph\",\"content\":\"📅 Quarter: [Q1/Q2/Q3/Q4 YYYY]   Team: [Team / Department]   Owner: [Name]\",\"metadata\":\"{}\"},{\"id\":\"b3\",\"parentId\":null,\"order\":2,\"blockType\":\"heading2\",\"content\":\"🎯 Objective 1\",\"metadata\":\"{}\"},{\"id\":\"b4\",\"parentId\":null,\"order\":3,\"blockType\":\"callout\",\"content\":\"[Inspirational, qualitative statement of what you want to achieve — e.g., 'Become the most reliable platform for our customers']\",\"metadata\":\"{}\"},{\"id\":\"b5\",\"parentId\":null,\"order\":4,\"blockType\":\"heading3\",\"content\":\"Key Results\",\"metadata\":\"{}\"},{\"id\":\"b6\",\"parentId\":null,\"order\":5,\"blockType\":\"bulletList\",\"content\":\"KR1: [Measurable outcome] — Baseline: [X] → Target: [Y] — Progress: [%]\",\"metadata\":\"{}\"},{\"id\":\"b7\",\"parentId\":null,\"order\":6,\"blockType\":\"bulletList\",\"content\":\"KR2: [Measurable outcome] — Baseline: [X] → Target: [Y] — Progress: [%]\",\"metadata\":\"{}\"},{\"id\":\"b8\",\"parentId\":null,\"order\":7,\"blockType\":\"bulletList\",\"content\":\"KR3: [Measurable outcome] — Baseline: [X] → Target: [Y] — Progress: [%]\",\"metadata\":\"{}\"},{\"id\":\"b9\",\"parentId\":null,\"order\":8,\"blockType\":\"heading2\",\"content\":\"🎯 Objective 2\",\"metadata\":\"{}\"},{\"id\":\"b10\",\"parentId\":null,\"order\":9,\"blockType\":\"callout\",\"content\":\"[Second objective]\",\"metadata\":\"{}\"},{\"id\":\"b11\",\"parentId\":null,\"order\":10,\"blockType\":\"heading3\",\"content\":\"Key Results\",\"metadata\":\"{}\"},{\"id\":\"b12\",\"parentId\":null,\"order\":11,\"blockType\":\"bulletList\",\"content\":\"KR1: [Measurable outcome] — Baseline: [X] → Target: [Y] — Progress: [%]\",\"metadata\":\"{}\"},{\"id\":\"b13\",\"parentId\":null,\"order\":12,\"blockType\":\"heading2\",\"content\":\"📋 Initiatives & Projects\",\"metadata\":\"{}\"},{\"id\":\"b14\",\"parentId\":null,\"order\":13,\"blockType\":\"bulletList\",\"content\":\"[Project / initiative name] — Supports: [OKR] — Owner: [Name] — Status: [On track / At risk / Behind]\",\"metadata\":\"{}\"},{\"id\":\"b15\",\"parentId\":null,\"order\":14,\"blockType\":\"heading2\",\"content\":\"📅 Check-in Cadence\",\"metadata\":\"{}\"},{\"id\":\"b16\",\"parentId\":null,\"order\":15,\"blockType\":\"bulletList\",\"content\":\"Weekly: [Async status update in Fourthspace]\",\"metadata\":\"{}\"},{\"id\":\"b17\",\"parentId\":null,\"order\":16,\"blockType\":\"bulletList\",\"content\":\"Monthly: [Scoring review meeting — 30 min]\",\"metadata\":\"{}\"},{\"id\":\"b18\",\"parentId\":null,\"order\":17,\"blockType\":\"bulletList\",\"content\":\"End of quarter: [Grading + retrospective + planning for next quarter]\",\"metadata\":\"{}\"}]";
        authorId = anonPrincipal;
        createdAt = 0;
      },
      {
        id = "builtin-design-doc";
        tenantId;
        workspaceId;
        name = "Technical Design Document";
        description = "Document system architecture, data models, API design, and implementation plan";
        icon = "🏗️";
        blocksJson = "[{\"id\":\"b1\",\"parentId\":null,\"order\":0,\"blockType\":\"heading1\",\"content\":\"Technical Design Document\",\"metadata\":\"{}\"},{\"id\":\"b2\",\"parentId\":null,\"order\":1,\"blockType\":\"callout\",\"content\":\"Feature: [Feature name]   Author: [Name]   Reviewers: [Names]   Status: [Draft / In Review / Approved]\",\"metadata\":\"{}\"},{\"id\":\"b3\",\"parentId\":null,\"order\":2,\"blockType\":\"heading2\",\"content\":\"🎯 Background & Motivation\",\"metadata\":\"{}\"},{\"id\":\"b4\",\"parentId\":null,\"order\":3,\"blockType\":\"paragraph\",\"content\":\"Why are we building this? What problem does it solve from a technical perspective?\",\"metadata\":\"{}\"},{\"id\":\"b5\",\"parentId\":null,\"order\":4,\"blockType\":\"heading2\",\"content\":\"🏗️ High-Level Architecture\",\"metadata\":\"{}\"},{\"id\":\"b6\",\"parentId\":null,\"order\":5,\"blockType\":\"paragraph\",\"content\":\"[Describe or embed a diagram of the overall system. What components are involved? How do they communicate?]\",\"metadata\":\"{}\"},{\"id\":\"b7\",\"parentId\":null,\"order\":6,\"blockType\":\"heading2\",\"content\":\"🗃️ Data Models\",\"metadata\":\"{}\"},{\"id\":\"b8\",\"parentId\":null,\"order\":7,\"blockType\":\"code\",\"content\":\"// Example\\ntype Entity = {\\n  id : Text;\\n  name : Text;\\n  createdAt : Int;\\n};\",\"metadata\":\"{}\"},{\"id\":\"b9\",\"parentId\":null,\"order\":8,\"blockType\":\"heading2\",\"content\":\"🔌 API Design\",\"metadata\":\"{}\"},{\"id\":\"b10\",\"parentId\":null,\"order\":9,\"blockType\":\"bulletList\",\"content\":\"POST /endpoint — [Description] — Request: [Schema] — Response: [Schema]\",\"metadata\":\"{}\"},{\"id\":\"b11\",\"parentId\":null,\"order\":10,\"blockType\":\"heading2\",\"content\":\"🔒 Security Considerations\",\"metadata\":\"{}\"},{\"id\":\"b12\",\"parentId\":null,\"order\":11,\"blockType\":\"bulletList\",\"content\":\"[Authentication / authorization approach]\",\"metadata\":\"{}\"},{\"id\":\"b13\",\"parentId\":null,\"order\":12,\"blockType\":\"bulletList\",\"content\":\"[Data validation, input sanitization]\",\"metadata\":\"{}\"},{\"id\":\"b14\",\"parentId\":null,\"order\":13,\"blockType\":\"heading2\",\"content\":\"📈 Performance & Scalability\",\"metadata\":\"{}\"},{\"id\":\"b15\",\"parentId\":null,\"order\":14,\"blockType\":\"bulletList\",\"content\":\"Expected load: [Requests/day, data volume]\",\"metadata\":\"{}\"},{\"id\":\"b16\",\"parentId\":null,\"order\":15,\"blockType\":\"bulletList\",\"content\":\"Bottlenecks: [Known performance risks and mitigations]\",\"metadata\":\"{}\"},{\"id\":\"b17\",\"parentId\":null,\"order\":16,\"blockType\":\"heading2\",\"content\":\"🧪 Testing Plan\",\"metadata\":\"{}\"},{\"id\":\"b18\",\"parentId\":null,\"order\":17,\"blockType\":\"bulletList\",\"content\":\"Unit tests: [What to cover]\",\"metadata\":\"{}\"},{\"id\":\"b19\",\"parentId\":null,\"order\":18,\"blockType\":\"bulletList\",\"content\":\"Integration tests: [End-to-end scenarios]\",\"metadata\":\"{}\"},{\"id\":\"b20\",\"parentId\":null,\"order\":19,\"blockType\":\"heading2\",\"content\":\"🗓️ Implementation Plan\",\"metadata\":\"{}\"},{\"id\":\"b21\",\"parentId\":null,\"order\":20,\"blockType\":\"bulletList\",\"content\":\"Phase 1 ([Date range]): [What will be built]\",\"metadata\":\"{}\"},{\"id\":\"b22\",\"parentId\":null,\"order\":21,\"blockType\":\"heading2\",\"content\":\"❓ Open Questions\",\"metadata\":\"{}\"},{\"id\":\"b23\",\"parentId\":null,\"order\":22,\"blockType\":\"bulletList\",\"content\":\"[ ] [Question] — Owner: [Name] — Needed by: [Date]\",\"metadata\":\"{}\"}]";
        authorId = anonPrincipal;
        createdAt = 0;
      },
      {
        id = "builtin-postmortem";
        tenantId;
        workspaceId;
        name = "Incident Postmortem";
        description = "Blameless postmortem to document incidents, root causes, and prevention actions";
        icon = "🚨";
        blocksJson = "[{\"id\":\"b1\",\"parentId\":null,\"order\":0,\"blockType\":\"heading1\",\"content\":\"Incident Postmortem\",\"metadata\":\"{}\"},{\"id\":\"b2\",\"parentId\":null,\"order\":1,\"blockType\":\"callout\",\"content\":\"⚠️ Severity: [P1 / P2 / P3]   Incident date: [Date]   Duration: [X hours/minutes]   Affected: [Service / Users]   Author: [Name]\",\"metadata\":\"{}\"},{\"id\":\"b3\",\"parentId\":null,\"order\":2,\"blockType\":\"heading2\",\"content\":\"📋 Executive Summary\",\"metadata\":\"{}\"},{\"id\":\"b4\",\"parentId\":null,\"order\":3,\"blockType\":\"paragraph\",\"content\":\"[2-3 sentence summary of what happened, its impact, and what resolved it.]\",\"metadata\":\"{}\"},{\"id\":\"b5\",\"parentId\":null,\"order\":4,\"blockType\":\"heading2\",\"content\":\"📉 Impact\",\"metadata\":\"{}\"},{\"id\":\"b6\",\"parentId\":null,\"order\":5,\"blockType\":\"bulletList\",\"content\":\"Users affected: [Number / %]\",\"metadata\":\"{}\"},{\"id\":\"b7\",\"parentId\":null,\"order\":6,\"blockType\":\"bulletList\",\"content\":\"Revenue impact: [Estimate]\",\"metadata\":\"{}\"},{\"id\":\"b8\",\"parentId\":null,\"order\":7,\"blockType\":\"bulletList\",\"content\":\"SLA breach: [Yes/No] — Details: []\",\"metadata\":\"{}\"},{\"id\":\"b9\",\"parentId\":null,\"order\":8,\"blockType\":\"heading2\",\"content\":\"⏱️ Timeline\",\"metadata\":\"{}\"},{\"id\":\"b10\",\"parentId\":null,\"order\":9,\"blockType\":\"bulletList\",\"content\":\"[HH:MM] — [Event description]\",\"metadata\":\"{}\"},{\"id\":\"b11\",\"parentId\":null,\"order\":10,\"blockType\":\"bulletList\",\"content\":\"[HH:MM] — Incident detected / alerted\",\"metadata\":\"{}\"},{\"id\":\"b12\",\"parentId\":null,\"order\":11,\"blockType\":\"bulletList\",\"content\":\"[HH:MM] — Root cause identified\",\"metadata\":\"{}\"},{\"id\":\"b13\",\"parentId\":null,\"order\":12,\"blockType\":\"bulletList\",\"content\":\"[HH:MM] — Fix deployed / service restored\",\"metadata\":\"{}\"},{\"id\":\"b14\",\"parentId\":null,\"order\":13,\"blockType\":\"heading2\",\"content\":\"🔍 Root Cause Analysis\",\"metadata\":\"{}\"},{\"id\":\"b15\",\"parentId\":null,\"order\":14,\"blockType\":\"paragraph\",\"content\":\"What was the root cause? Use 5 Whys if helpful: Why did X happen? Because Y. Why Y? Because Z...\",\"metadata\":\"{}\"},{\"id\":\"b16\",\"parentId\":null,\"order\":15,\"blockType\":\"heading2\",\"content\":\"✅ What Went Well\",\"metadata\":\"{}\"},{\"id\":\"b17\",\"parentId\":null,\"order\":16,\"blockType\":\"bulletList\",\"content\":\"[Detection was fast, team communicated well, runbook was helpful...]\",\"metadata\":\"{}\"},{\"id\":\"b18\",\"parentId\":null,\"order\":17,\"blockType\":\"heading2\",\"content\":\"⚡ Action Items (Prevention)\",\"metadata\":\"{}\"},{\"id\":\"b19\",\"parentId\":null,\"order\":18,\"blockType\":\"bulletList\",\"content\":\"[ ] [Owner] — [Action to prevent recurrence] — Due: [Date]\",\"metadata\":\"{}\"}]";
        authorId = anonPrincipal;
        createdAt = 0;
      },
      {
        id = "builtin-research-notes";
        tenantId;
        workspaceId;
        name = "Research Notes";
        description = "Capture structured research with sources, insights, gaps, and conclusions";
        icon = "🔬";
        blocksJson = "[{\"id\":\"b1\",\"parentId\":null,\"order\":0,\"blockType\":\"heading1\",\"content\":\"Research Notes\",\"metadata\":\"{}\"},{\"id\":\"b2\",\"parentId\":null,\"order\":1,\"blockType\":\"paragraph\",\"content\":\"📅 Date: [Date]   Researcher: [Name]   Topic: [Research topic / question]\",\"metadata\":\"{}\"},{\"id\":\"b3\",\"parentId\":null,\"order\":2,\"blockType\":\"heading2\",\"content\":\"❓ Research Question\",\"metadata\":\"{}\"},{\"id\":\"b4\",\"parentId\":null,\"order\":3,\"blockType\":\"callout\",\"content\":\"[The specific question this research aims to answer]\",\"metadata\":\"{}\"},{\"id\":\"b5\",\"parentId\":null,\"order\":4,\"blockType\":\"heading2\",\"content\":\"📚 Sources\",\"metadata\":\"{}\"},{\"id\":\"b6\",\"parentId\":null,\"order\":5,\"blockType\":\"bulletList\",\"content\":\"[Source title / URL] — [Type: Article / Paper / Interview / Data] — [Key takeaway]\",\"metadata\":\"{}\"},{\"id\":\"b7\",\"parentId\":null,\"order\":6,\"blockType\":\"heading2\",\"content\":\"💡 Key Insights\",\"metadata\":\"{}\"},{\"id\":\"b8\",\"parentId\":null,\"order\":7,\"blockType\":\"bulletList\",\"content\":\"[Insight 1 — with source reference]\",\"metadata\":\"{}\"},{\"id\":\"b9\",\"parentId\":null,\"order\":8,\"blockType\":\"bulletList\",\"content\":\"[Insight 2 — with source reference]\",\"metadata\":\"{}\"},{\"id\":\"b10\",\"parentId\":null,\"order\":9,\"blockType\":\"heading2\",\"content\":\"🕳️ Gaps & Unknowns\",\"metadata\":\"{}\"},{\"id\":\"b11\",\"parentId\":null,\"order\":10,\"blockType\":\"bulletList\",\"content\":\"[What questions remain unanswered? What research is still needed?]\",\"metadata\":\"{}\"},{\"id\":\"b12\",\"parentId\":null,\"order\":11,\"blockType\":\"heading2\",\"content\":\"📊 Data & Evidence\",\"metadata\":\"{}\"},{\"id\":\"b13\",\"parentId\":null,\"order\":12,\"blockType\":\"paragraph\",\"content\":\"[Add charts, tables, or data points here]\",\"metadata\":\"{}\"},{\"id\":\"b14\",\"parentId\":null,\"order\":13,\"blockType\":\"heading2\",\"content\":\"🏁 Conclusions & Recommendations\",\"metadata\":\"{}\"},{\"id\":\"b15\",\"parentId\":null,\"order\":14,\"blockType\":\"paragraph\",\"content\":\"[Summary of what the research found and what action should be taken based on it]\",\"metadata\":\"{}\"}]";
        authorId = anonPrincipal;
        createdAt = 0;
      },
      {
        id = "builtin-user-interview";
        tenantId;
        workspaceId;
        name = "User Interview Notes";
        description = "Structured user interview guide with screener, questions, observations, and insights";
        icon = "🎙️";
        blocksJson = "[{\"id\":\"b1\",\"parentId\":null,\"order\":0,\"blockType\":\"heading1\",\"content\":\"User Interview Notes\",\"metadata\":\"{}\"},{\"id\":\"b2\",\"parentId\":null,\"order\":1,\"blockType\":\"paragraph\",\"content\":\"📅 Date: [Date]   Interviewer: [Name]   Participant ID: [P001]   Interview type: [Moderated / Unmoderated]\",\"metadata\":\"{}\"},{\"id\":\"b3\",\"parentId\":null,\"order\":2,\"blockType\":\"heading2\",\"content\":\"👤 Participant Profile\",\"metadata\":\"{}\"},{\"id\":\"b4\",\"parentId\":null,\"order\":3,\"blockType\":\"bulletList\",\"content\":\"Role: [Job title / role]\",\"metadata\":\"{}\"},{\"id\":\"b5\",\"parentId\":null,\"order\":4,\"blockType\":\"bulletList\",\"content\":\"Company size: [e.g., 50–200 employees]\",\"metadata\":\"{}\"},{\"id\":\"b6\",\"parentId\":null,\"order\":5,\"blockType\":\"bulletList\",\"content\":\"Relevant experience: [Years, tools used]\",\"metadata\":\"{}\"},{\"id\":\"b7\",\"parentId\":null,\"order\":6,\"blockType\":\"heading2\",\"content\":\"🗣️ Interview Questions & Responses\",\"metadata\":\"{}\"},{\"id\":\"b8\",\"parentId\":null,\"order\":7,\"blockType\":\"heading3\",\"content\":\"Q1: [Question text]\",\"metadata\":\"{}\"},{\"id\":\"b9\",\"parentId\":null,\"order\":8,\"blockType\":\"paragraph\",\"content\":\"Response: [Verbatim or paraphrased quote]\",\"metadata\":\"{}\"},{\"id\":\"b10\",\"parentId\":null,\"order\":9,\"blockType\":\"heading3\",\"content\":\"Q2: [Question text]\",\"metadata\":\"{}\"},{\"id\":\"b11\",\"parentId\":null,\"order\":10,\"blockType\":\"paragraph\",\"content\":\"Response: [Verbatim or paraphrased quote]\",\"metadata\":\"{}\"},{\"id\":\"b12\",\"parentId\":null,\"order\":11,\"blockType\":\"heading2\",\"content\":\"😊 Moments of Delight\",\"metadata\":\"{}\"},{\"id\":\"b13\",\"parentId\":null,\"order\":12,\"blockType\":\"bulletList\",\"content\":\"[What did the participant respond positively to?]\",\"metadata\":\"{}\"},{\"id\":\"b14\",\"parentId\":null,\"order\":13,\"blockType\":\"heading2\",\"content\":\"😤 Friction Points\",\"metadata\":\"{}\"},{\"id\":\"b15\",\"parentId\":null,\"order\":14,\"blockType\":\"bulletList\",\"content\":\"[What confused, frustrated, or blocked the participant?]\",\"metadata\":\"{}\"},{\"id\":\"b16\",\"parentId\":null,\"order\":15,\"blockType\":\"heading2\",\"content\":\"💡 Key Insights & Quotes\",\"metadata\":\"{}\"},{\"id\":\"b17\",\"parentId\":null,\"order\":16,\"blockType\":\"bulletList\",\"content\":\"[Insight] — Supporting quote: \\\"[exact quote]\\\"\",\"metadata\":\"{}\"}]";
        authorId = anonPrincipal;
        createdAt = 0;
      },
      {
        id = "builtin-roadmap";
        tenantId;
        workspaceId;
        name = "Product Roadmap";
        description = "Quarterly product roadmap with themes, initiatives, and milestone tracking";
        icon = "🗺️";
        blocksJson = "[{\"id\":\"b1\",\"parentId\":null,\"order\":0,\"blockType\":\"heading1\",\"content\":\"Product Roadmap\",\"metadata\":\"{}\"},{\"id\":\"b2\",\"parentId\":null,\"order\":1,\"blockType\":\"paragraph\",\"content\":\"📅 Period: [H1 / H2 / Full year YYYY]   Owner: [Product Lead]   Last updated: [Date]\",\"metadata\":\"{}\"},{\"id\":\"b3\",\"parentId\":null,\"order\":2,\"blockType\":\"callout\",\"content\":\"North Star: [The single most important outcome this roadmap drives toward]\",\"metadata\":\"{}\"},{\"id\":\"b4\",\"parentId\":null,\"order\":3,\"blockType\":\"heading2\",\"content\":\"🏆 Q1 — [Theme Name]\",\"metadata\":\"{}\"},{\"id\":\"b5\",\"parentId\":null,\"order\":4,\"blockType\":\"bulletList\",\"content\":\"[Initiative name] — Status: [Now / Next / Later] — Owner: [Name]\",\"metadata\":\"{}\"},{\"id\":\"b6\",\"parentId\":null,\"order\":5,\"blockType\":\"bulletList\",\"content\":\"[Initiative name] — Status: [Now / Next / Later] — Owner: [Name]\",\"metadata\":\"{}\"},{\"id\":\"b7\",\"parentId\":null,\"order\":6,\"blockType\":\"heading2\",\"content\":\"🏆 Q2 — [Theme Name]\",\"metadata\":\"{}\"},{\"id\":\"b8\",\"parentId\":null,\"order\":7,\"blockType\":\"bulletList\",\"content\":\"[Initiative name] — Status: [Now / Next / Later] — Owner: [Name]\",\"metadata\":\"{}\"},{\"id\":\"b9\",\"parentId\":null,\"order\":8,\"blockType\":\"heading2\",\"content\":\"🏆 Q3 — [Theme Name]\",\"metadata\":\"{}\"},{\"id\":\"b10\",\"parentId\":null,\"order\":9,\"blockType\":\"bulletList\",\"content\":\"[Initiative name] — Status: [Now / Next / Later] — Owner: [Name]\",\"metadata\":\"{}\"},{\"id\":\"b11\",\"parentId\":null,\"order\":10,\"blockType\":\"heading2\",\"content\":\"🏆 Q4 — [Theme Name]\",\"metadata\":\"{}\"},{\"id\":\"b12\",\"parentId\":null,\"order\":11,\"blockType\":\"bulletList\",\"content\":\"[Initiative name] — Status: [Now / Next / Later] — Owner: [Name]\",\"metadata\":\"{}\"},{\"id\":\"b13\",\"parentId\":null,\"order\":12,\"blockType\":\"heading2\",\"content\":\"🔮 Backlog / Future Bets\",\"metadata\":\"{}\"},{\"id\":\"b14\",\"parentId\":null,\"order\":13,\"blockType\":\"bulletList\",\"content\":\"[Ideas not yet scheduled — keep here until prioritized]\",\"metadata\":\"{}\"},{\"id\":\"b15\",\"parentId\":null,\"order\":14,\"blockType\":\"heading2\",\"content\":\"📊 Key Metrics to Track\",\"metadata\":\"{}\"},{\"id\":\"b16\",\"parentId\":null,\"order\":15,\"blockType\":\"bulletList\",\"content\":\"[Metric] — Current: [Value] — Target: [Value] — Owner: [Name]\",\"metadata\":\"{}\"}]";
        authorId = anonPrincipal;
        createdAt = 0;
      },
      {
        id = "builtin-competitor-analysis";
        tenantId;
        workspaceId;
        name = "Competitor Analysis";
        description = "Structured competitor research with feature comparison, positioning, and strategic insights";
        icon = "🔭";
        blocksJson = "[{\"id\":\"b1\",\"parentId\":null,\"order\":0,\"blockType\":\"heading1\",\"content\":\"Competitor Analysis\",\"metadata\":\"{}\"},{\"id\":\"b2\",\"parentId\":null,\"order\":1,\"blockType\":\"paragraph\",\"content\":\"📅 Date: [Date]   Author: [Name]   Market: [Market segment]\",\"metadata\":\"{}\"},{\"id\":\"b3\",\"parentId\":null,\"order\":2,\"blockType\":\"heading2\",\"content\":\"🏢 Competitor 1: [Company Name]\",\"metadata\":\"{}\"},{\"id\":\"b4\",\"parentId\":null,\"order\":3,\"blockType\":\"bulletList\",\"content\":\"Website: [URL]   Pricing: [Pricing model]   Target customer: [ICP]\",\"metadata\":\"{}\"},{\"id\":\"b5\",\"parentId\":null,\"order\":4,\"blockType\":\"heading3\",\"content\":\"Key Features\",\"metadata\":\"{}\"},{\"id\":\"b6\",\"parentId\":null,\"order\":5,\"blockType\":\"bulletList\",\"content\":\"[Feature 1 — how it works, how it differs]\",\"metadata\":\"{}\"},{\"id\":\"b7\",\"parentId\":null,\"order\":6,\"blockType\":\"heading3\",\"content\":\"Strengths\",\"metadata\":\"{}\"},{\"id\":\"b8\",\"parentId\":null,\"order\":7,\"blockType\":\"bulletList\",\"content\":\"[What they do well]\",\"metadata\":\"{}\"},{\"id\":\"b9\",\"parentId\":null,\"order\":8,\"blockType\":\"heading3\",\"content\":\"Weaknesses / Gaps\",\"metadata\":\"{}\"},{\"id\":\"b10\",\"parentId\":null,\"order\":9,\"blockType\":\"bulletList\",\"content\":\"[Where they fall short — customer complaints, missing features]\",\"metadata\":\"{}\"},{\"id\":\"b11\",\"parentId\":null,\"order\":10,\"blockType\":\"heading2\",\"content\":\"🏢 Competitor 2: [Company Name]\",\"metadata\":\"{}\"},{\"id\":\"b12\",\"parentId\":null,\"order\":11,\"blockType\":\"bulletList\",\"content\":\"Website: [URL]   Pricing: [Pricing model]   Target customer: [ICP]\",\"metadata\":\"{}\"},{\"id\":\"b13\",\"parentId\":null,\"order\":12,\"blockType\":\"heading2\",\"content\":\"📊 Feature Comparison Matrix\",\"metadata\":\"{}\"},{\"id\":\"b14\",\"parentId\":null,\"order\":13,\"blockType\":\"paragraph\",\"content\":\"Feature | Us | Competitor 1 | Competitor 2\\n--- | --- | --- | ---\\n[Feature] | ✅ | ✅ | ❌\",\"metadata\":\"{}\"},{\"id\":\"b15\",\"parentId\":null,\"order\":14,\"blockType\":\"heading2\",\"content\":\"🎯 Our Differentiation\",\"metadata\":\"{}\"},{\"id\":\"b16\",\"parentId\":null,\"order\":15,\"blockType\":\"bulletList\",\"content\":\"[What makes Fourthspace uniquely better for our target customers]\",\"metadata\":\"{}\"},{\"id\":\"b17\",\"parentId\":null,\"order\":16,\"blockType\":\"heading2\",\"content\":\"💡 Strategic Implications\",\"metadata\":\"{}\"},{\"id\":\"b18\",\"parentId\":null,\"order\":17,\"blockType\":\"bulletList\",\"content\":\"[What should we do / build / change based on this analysis?]\",\"metadata\":\"{}\"}]";
        authorId = anonPrincipal;
        createdAt = 0;
      },
      {
        id = "builtin-hiring-interview";
        tenantId;
        workspaceId;
        name = "Hiring Interview Scorecard";
        description = "Structured interview evaluation with competencies, ratings, and hiring recommendation";
        icon = "👔";
        blocksJson = "[{\"id\":\"b1\",\"parentId\":null,\"order\":0,\"blockType\":\"heading1\",\"content\":\"Hiring Interview Scorecard\",\"metadata\":\"{}\"},{\"id\":\"b2\",\"parentId\":null,\"order\":1,\"blockType\":\"paragraph\",\"content\":\"📅 Date: [Date]   Candidate: [Name]   Role: [Position]   Interviewer: [Name]   Interview type: [Technical / Behavioral / Culture]\",\"metadata\":\"{}\"},{\"id\":\"b3\",\"parentId\":null,\"order\":2,\"blockType\":\"heading2\",\"content\":\"🎯 Role Requirements\",\"metadata\":\"{}\"},{\"id\":\"b4\",\"parentId\":null,\"order\":3,\"blockType\":\"bulletList\",\"content\":\"Must-have: [Required skill / experience]\",\"metadata\":\"{}\"},{\"id\":\"b5\",\"parentId\":null,\"order\":4,\"blockType\":\"bulletList\",\"content\":\"Nice-to-have: [Preferred skill / experience]\",\"metadata\":\"{}\"},{\"id\":\"b6\",\"parentId\":null,\"order\":5,\"blockType\":\"heading2\",\"content\":\"💬 Interview Questions & Notes\",\"metadata\":\"{}\"},{\"id\":\"b7\",\"parentId\":null,\"order\":6,\"blockType\":\"heading3\",\"content\":\"Competency 1: [e.g., Problem Solving]\",\"metadata\":\"{}\"},{\"id\":\"b8\",\"parentId\":null,\"order\":7,\"blockType\":\"bulletList\",\"content\":\"Q: [Question asked]\",\"metadata\":\"{}\"},{\"id\":\"b9\",\"parentId\":null,\"order\":8,\"blockType\":\"bulletList\",\"content\":\"A: [Candidate's response — use STAR: Situation, Task, Action, Result]\",\"metadata\":\"{}\"},{\"id\":\"b10\",\"parentId\":null,\"order\":9,\"blockType\":\"bulletList\",\"content\":\"Rating (1–5): [Score]   Notes: [What stood out?]\",\"metadata\":\"{}\"},{\"id\":\"b11\",\"parentId\":null,\"order\":10,\"blockType\":\"heading2\",\"content\":\"📊 Competency Ratings Summary\",\"metadata\":\"{}\"},{\"id\":\"b12\",\"parentId\":null,\"order\":11,\"blockType\":\"bulletList\",\"content\":\"[Competency]: [1–5]   [Competency]: [1–5]   [Competency]: [1–5]\",\"metadata\":\"{}\"},{\"id\":\"b13\",\"parentId\":null,\"order\":12,\"blockType\":\"bulletList\",\"content\":\"Overall score: [Average / Total]\",\"metadata\":\"{}\"},{\"id\":\"b14\",\"parentId\":null,\"order\":13,\"blockType\":\"heading2\",\"content\":\"✅ Strengths\",\"metadata\":\"{}\"},{\"id\":\"b15\",\"parentId\":null,\"order\":14,\"blockType\":\"bulletList\",\"content\":\"[What impressed you about this candidate?]\",\"metadata\":\"{}\"},{\"id\":\"b16\",\"parentId\":null,\"order\":15,\"blockType\":\"heading2\",\"content\":\"⚠️ Concerns\",\"metadata\":\"{}\"},{\"id\":\"b17\",\"parentId\":null,\"order\":16,\"blockType\":\"bulletList\",\"content\":\"[Any red flags or areas of concern?]\",\"metadata\":\"{}\"},{\"id\":\"b18\",\"parentId\":null,\"order\":17,\"blockType\":\"heading2\",\"content\":\"🏁 Recommendation\",\"metadata\":\"{}\"},{\"id\":\"b19\",\"parentId\":null,\"order\":18,\"blockType\":\"callout\",\"content\":\"Decision: [ ] Strong Hire   [ ] Hire   [ ] No Hire   [ ] Strong No Hire   Rationale: [1-2 sentences]\",\"metadata\":\"{}\"}]";
        authorId = anonPrincipal;
        createdAt = 0;
      },
      {
        id = "builtin-launch-plan";
        tenantId;
        workspaceId;
        name = "Product Launch Plan";
        description = "End-to-end launch checklist covering marketing, sales, engineering, and support readiness";
        icon = "🚀";
        blocksJson = "[{\"id\":\"b1\",\"parentId\":null,\"order\":0,\"blockType\":\"heading1\",\"content\":\"Product Launch Plan\",\"metadata\":\"{}\"},{\"id\":\"b2\",\"parentId\":null,\"order\":1,\"blockType\":\"callout\",\"content\":\"Feature/Product: [Name]   Launch date: [Date]   Launch type: [Soft / Hard / Beta]   DRI: [Name]\",\"metadata\":\"{}\"},{\"id\":\"b3\",\"parentId\":null,\"order\":2,\"blockType\":\"heading2\",\"content\":\"🎯 Launch Goals\",\"metadata\":\"{}\"},{\"id\":\"b4\",\"parentId\":null,\"order\":3,\"blockType\":\"bulletList\",\"content\":\"[What does success look like 30 days post-launch? Define metrics.]\",\"metadata\":\"{}\"},{\"id\":\"b5\",\"parentId\":null,\"order\":4,\"blockType\":\"heading2\",\"content\":\"✅ Pre-Launch Checklist\",\"metadata\":\"{}\"},{\"id\":\"b6\",\"parentId\":null,\"order\":5,\"blockType\":\"heading3\",\"content\":\"Engineering\",\"metadata\":\"{}\"},{\"id\":\"b7\",\"parentId\":null,\"order\":6,\"blockType\":\"bulletList\",\"content\":\"[ ] Feature complete and deployed to production\",\"metadata\":\"{}\"},{\"id\":\"b8\",\"parentId\":null,\"order\":7,\"blockType\":\"bulletList\",\"content\":\"[ ] Monitoring and alerting configured\",\"metadata\":\"{}\"},{\"id\":\"b9\",\"parentId\":null,\"order\":8,\"blockType\":\"bulletList\",\"content\":\"[ ] Rollback plan documented\",\"metadata\":\"{}\"},{\"id\":\"b10\",\"parentId\":null,\"order\":9,\"blockType\":\"heading3\",\"content\":\"Marketing\",\"metadata\":\"{}\"},{\"id\":\"b11\",\"parentId\":null,\"order\":10,\"blockType\":\"bulletList\",\"content\":\"[ ] Announcement blog post / landing page live\",\"metadata\":\"{}\"},{\"id\":\"b12\",\"parentId\":null,\"order\":11,\"blockType\":\"bulletList\",\"content\":\"[ ] Social media posts scheduled\",\"metadata\":\"{}\"},{\"id\":\"b13\",\"parentId\":null,\"order\":12,\"blockType\":\"heading3\",\"content\":\"Support\",\"metadata\":\"{}\"},{\"id\":\"b14\",\"parentId\":null,\"order\":13,\"blockType\":\"bulletList\",\"content\":\"[ ] Help docs / FAQ updated\",\"metadata\":\"{}\"},{\"id\":\"b15\",\"parentId\":null,\"order\":14,\"blockType\":\"bulletList\",\"content\":\"[ ] Support team trained\",\"metadata\":\"{}\"},{\"id\":\"b16\",\"parentId\":null,\"order\":15,\"blockType\":\"heading2\",\"content\":\"📅 Launch Day Timeline\",\"metadata\":\"{}\"},{\"id\":\"b17\",\"parentId\":null,\"order\":16,\"blockType\":\"bulletList\",\"content\":\"[Time]: [Action] — Owner: [Name]\",\"metadata\":\"{}\"},{\"id\":\"b18\",\"parentId\":null,\"order\":17,\"blockType\":\"heading2\",\"content\":\"📊 Post-Launch Monitoring (Week 1)\",\"metadata\":\"{}\"},{\"id\":\"b19\",\"parentId\":null,\"order\":18,\"blockType\":\"bulletList\",\"content\":\"[Metric]: [Target] — Actual: [Track daily]\",\"metadata\":\"{}\"}]";
        authorId = anonPrincipal;
        createdAt = 0;
      },
    ]
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────

  public func listTemplates(
    store : [(Common.EntityId, Types.NoteTemplate)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.NoteTemplate] {
    let m = toMap(store);
    let custom = m.values().filter(func(t : Types.NoteTemplate) : Bool {
      t.tenantId == tenantId and t.workspaceId == workspaceId
    }).toArray();
    builtins(tenantId, workspaceId).concat(custom)
  };

  public func createTemplate(
    store : [(Common.EntityId, Types.NoteTemplate)],
    input : Types.NoteTemplateInput,
    authorId : Common.UserId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Types.NoteTemplate, [(Common.EntityId, Types.NoteTemplate)]) {
    let now = Time.now();
    let id = genId(authorId.toText());
    let tmpl : Types.NoteTemplate = {
      id;
      tenantId;
      workspaceId;
      name = input.name;
      description = input.description;
      icon = input.icon;
      blocksJson = input.blocksJson;
      authorId;
      createdAt = now;
    };
    let m = toMap(store);
    m.add(id, tmpl);
    (tmpl, toStore(m))
  };

  public func getTemplate(
    store : [(Common.EntityId, Types.NoteTemplate)],
    templateId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : ?Types.NoteTemplate {
    let m = toMap(store);
    switch (m.get(templateId)) {
      case (?t) { if (t.tenantId == tenantId and t.workspaceId == workspaceId) ?t else null };
      case null null;
    }
  };

  public func deleteTemplate(
    store : [(Common.EntityId, Types.NoteTemplate)],
    templateId : Common.EntityId,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : (Bool, [(Common.EntityId, Types.NoteTemplate)]) {
    let m = toMap(store);
    switch (m.get(templateId)) {
      case (?t) {
        if (t.tenantId != tenantId or t.workspaceId != workspaceId) return (false, store);
        m.remove(templateId);
        (true, toStore(m))
      };
      case null (false, store);
    }
  };
};
