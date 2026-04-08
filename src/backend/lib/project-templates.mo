import Common "../types/common";
import PTypes "../types/projects";
import WBTypes "../types/whiteboards";

module {

  public type TemplateTask = {
    title : Text;
    description : Text;
    priority : PTypes.TaskPriority;
    status : PTypes.TaskStatus;
    dayOffset : Nat; // days from project start for optional due date context
  };

  public type TemplateMilestone = {
    title : Text;
    description : Text;
    dayOffset : Nat; // days from project start for due date
  };

  public type LinkedWhiteboard = {
    templateId : Text;
    nameSuffix : Text; // appended to projectName to form the whiteboard title
  };

  public type ProjectTemplate = {
    id : Text;
    name : Text;
    category : Text;
    tasks : [TemplateTask];
    milestones : [TemplateMilestone];
    linkedWhiteboard : ?LinkedWhiteboard;
  };

  // ── Day-in-nanoseconds helper ─────────────────────────────────────────────────

  public func daysToNs(days : Nat) : Int {
    days * 24 * 3600 * 1_000_000_000
  };

  // ── Template definitions ──────────────────────────────────────────────────────

  public let templates : [ProjectTemplate] = [
    {
      id = "agile-sprint";
      name = "Agile Sprint";
      category = "Engineering";
      tasks = [
        { title = "Sprint Planning"; description = "Define sprint scope, assign story points, and confirm team capacity for this sprint cycle."; priority = #High; status = #Todo; dayOffset = 0 },
        { title = "Define Sprint Goal"; description = "Write a clear, achievable sprint goal that aligns with product roadmap priorities and team velocity."; priority = #High; status = #Todo; dayOffset = 0 },
        { title = "User Story Refinement"; description = "Break down backlog items into well-defined user stories with acceptance criteria and estimation."; priority = #Medium; status = #Todo; dayOffset = 1 },
        { title = "Frontend Development"; description = "Implement UI components, pages, and interactions per the sprint backlog user stories."; priority = #High; status = #InProgress; dayOffset = 2 },
        { title = "Backend Development"; description = "Build API endpoints, business logic, and data models required for sprint user stories."; priority = #High; status = #InProgress; dayOffset = 2 },
        { title = "Unit Tests"; description = "Write unit tests for all new functions and components. Target minimum 80% coverage for new code."; priority = #Medium; status = #Todo; dayOffset = 5 },
        { title = "Integration Tests"; description = "Write end-to-end and integration tests covering key user flows introduced this sprint."; priority = #Medium; status = #Todo; dayOffset = 6 },
        { title = "Code Review"; description = "Conduct peer code reviews for all PRs. Ensure coding standards, security, and performance are met."; priority = #Medium; status = #Todo; dayOffset = 7 },
        { title = "QA Testing"; description = "Execute manual and automated QA testing across all sprint features. Document and triage all bugs."; priority = #High; status = #Todo; dayOffset = 8 },
        { title = "Bug Fixes"; description = "Address critical and high-priority bugs discovered during QA. Verify fixes with regression tests."; priority = #Medium; status = #Todo; dayOffset = 9 },
        { title = "Sprint Review Preparation"; description = "Prepare demo script, screenshots, and talking points for the sprint review presentation."; priority = #Low; status = #Todo; dayOffset = 13 },
        { title = "Sprint Retrospective"; description = "Facilitate team retrospective: what went well, what to improve, action items for next sprint."; priority = #Low; status = #Todo; dayOffset = 14 },
        { title = "Deployment to Staging"; description = "Deploy all sprint deliverables to staging environment. Run smoke tests to verify stability."; priority = #High; status = #Todo; dayOffset = 11 },
        { title = "Production Deployment"; description = "Deploy tested and approved sprint deliverables to production with rollback plan ready."; priority = #High; status = #Todo; dayOffset = 14 },
        { title = "Sprint Demo"; description = "Present completed user stories to stakeholders. Gather feedback and update product backlog accordingly."; priority = #Medium; status = #Todo; dayOffset = 14 },
      ];
      milestones = [
        { title = "Sprint Kickoff"; description = "Sprint planning complete, team aligned on goals and capacity."; dayOffset = 0 },
        { title = "Midpoint Review"; description = "Mid-sprint check-in: verify pace, unblock dependencies, rebalance tasks if needed."; dayOffset = 7 },
        { title = "Sprint Complete"; description = "All sprint tasks done, demos delivered, retrospective completed, code deployed."; dayOffset = 14 },
      ];
      linkedWhiteboard = null;
    },

    {
      id = "product-roadmap";
      name = "Product Roadmap";
      category = "Product";
      tasks = [
        { title = "Q1 Feature Prioritization"; description = "Score and rank backlog features by customer impact, engineering effort, and strategic alignment using a prioritization framework."; priority = #High; status = #Todo; dayOffset = 0 },
        { title = "Competitive Analysis"; description = "Research top 5 competitors. Document feature gaps, pricing differences, and positioning opportunities."; priority = #Medium; status = #Todo; dayOffset = 1 },
        { title = "User Research Summary"; description = "Synthesize latest user interviews and NPS feedback into actionable insights for roadmap decisions."; priority = #High; status = #Todo; dayOffset = 2 },
        { title = "Define OKRs"; description = "Set quarterly Objectives and Key Results with measurable targets for each product team."; priority = #High; status = #Todo; dayOffset = 3 },
        { title = "Feature Specification Writing"; description = "Write detailed product requirement documents (PRDs) for all Q1 features, including user stories and acceptance criteria."; priority = #High; status = #Todo; dayOffset = 5 },
        { title = "Design Mockups"; description = "Create high-fidelity mockups and interactive prototypes for all major Q1 features."; priority = #Medium; status = #Todo; dayOffset = 7 },
        { title = "Stakeholder Review"; description = "Present roadmap to leadership and key stakeholders. Capture feedback and finalize priorities."; priority = #High; status = #Todo; dayOffset = 10 },
        { title = "Engineering Estimation"; description = "Work with engineering leads to size all Q1 features. Identify technical risks and dependencies."; priority = #Medium; status = #Todo; dayOffset = 11 },
        { title = "Resource Allocation"; description = "Assign engineering squads, designers, and PMs to each roadmap initiative for Q1."; priority = #Medium; status = #Todo; dayOffset = 12 },
        { title = "Risk Assessment"; description = "Identify and document top risks for each roadmap item. Create mitigation plans for critical risks."; priority = #Medium; status = #Todo; dayOffset = 13 },
        { title = "Q2 Planning"; description = "Begin collecting Q2 inputs: customer feedback, OKR progress, and emerging market opportunities."; priority = #Low; status = #Todo; dayOffset = 80 },
        { title = "Roadmap Communication"; description = "Publish updated roadmap to internal teams and prepare customer-facing version for key accounts."; priority = #Low; status = #Todo; dayOffset = 14 },
      ];
      milestones = [
        { title = "Roadmap Approved"; description = "Roadmap signed off by leadership. All features prioritized and resourced."; dayOffset = 14 },
        { title = "Q1 Kickoff"; description = "Q1 development begins with all squads aligned on their roadmap commitments."; dayOffset = 30 },
        { title = "Q2 Planning Begins"; description = "Q2 roadmap planning initiated with input from Q1 metrics and user feedback."; dayOffset = 90 },
      ];
      linkedWhiteboard = ?{ templateId = "tpl-mindmap"; nameSuffix = " - Roadmap Overview" };
    },

    {
      id = "bug-tracker";
      name = "Bug Tracker";
      category = "Engineering";
      tasks = [
        { title = "Triage Incoming Bugs"; description = "Review all newly reported bugs. Assign severity (Critical/High/Medium/Low), priority, and owning team."; priority = #High; status = #Todo; dayOffset = 0 },
        { title = "Reproduce Bug #001"; description = "Set up reproduction environment matching the reporter's configuration. Document exact steps to reproduce."; priority = #High; status = #Todo; dayOffset = 0 },
        { title = "Document Reproduction Steps"; description = "Write clear, numbered steps to reproduce the bug with expected vs. actual behavior and screenshots."; priority = #High; status = #Todo; dayOffset = 1 },
        { title = "Root Cause Analysis"; description = "Investigate the codebase to identify the root cause. Document findings and affected code paths."; priority = #High; status = #Todo; dayOffset = 1 },
        { title = "Implement Fix"; description = "Develop the bug fix following the root cause analysis. Ensure the fix is minimal and targeted."; priority = #High; status = #InProgress; dayOffset = 2 },
        { title = "Write Regression Test"; description = "Write automated test(s) that would have caught this bug. Add to the CI test suite."; priority = #Medium; status = #Todo; dayOffset = 3 },
        { title = "Code Review Fix"; description = "Submit fix for peer code review. Reviewer verifies fix correctness and no regression risk."; priority = #Medium; status = #Todo; dayOffset = 4 },
        { title = "QA Verification"; description = "QA engineer verifies the fix resolves the reported bug and no regressions have been introduced."; priority = #High; status = #Todo; dayOffset = 5 },
        { title = "Deploy Fix to Staging"; description = "Deploy fix to staging environment. Run full regression suite and smoke tests."; priority = #Medium; status = #Todo; dayOffset = 6 },
        { title = "Deploy Fix to Production"; description = "Deploy verified fix to production with monitoring enabled. Follow change management process."; priority = #High; status = #Todo; dayOffset = 7 },
        { title = "Monitor After Deploy"; description = "Monitor error rates, performance metrics, and user reports for 24 hours post-deployment."; priority = #Medium; status = #Todo; dayOffset = 8 },
        { title = "Close Bug Report"; description = "Update bug report with resolution details, fix version, and close with appropriate status."; priority = #Low; status = #Todo; dayOffset = 9 },
        { title = "Update Documentation"; description = "Update any affected technical documentation, runbooks, or user guides impacted by the fix."; priority = #Low; status = #Todo; dayOffset = 10 },
      ];
      milestones = [
        { title = "Bug Identified & Triaged"; description = "Bug confirmed, severity assigned, and assigned to owning team."; dayOffset = 0 },
        { title = "Fix Deployed to Staging"; description = "Fix implemented, code reviewed, and deployed to staging for QA."; dayOffset = 7 },
        { title = "Verified in Production"; description = "Fix confirmed in production with monitoring showing no regressions."; dayOffset = 10 },
      ];
      linkedWhiteboard = null;
    },

    {
      id = "marketing-campaign";
      name = "Marketing Campaign";
      category = "Marketing";
      tasks = [
        { title = "Define Campaign Goals"; description = "Set SMART campaign goals: target reach, lead generation numbers, conversion rates, and revenue attribution."; priority = #High; status = #Todo; dayOffset = 0 },
        { title = "Identify Target Audience"; description = "Define ideal customer profiles, segment audiences, and map messaging to each segment's pain points."; priority = #High; status = #Todo; dayOffset = 1 },
        { title = "Develop Campaign Messaging"; description = "Create core value proposition, headline options, and key message pillars for each audience segment."; priority = #High; status = #Todo; dayOffset = 2 },
        { title = "Create Content Calendar"; description = "Plan all content assets by channel, date, and owner. Map content to campaign phases: awareness, consideration, conversion."; priority = #Medium; status = #Todo; dayOffset = 3 },
        { title = "Design Campaign Assets"; description = "Create visual assets: banner ads, social graphics, email headers, landing page design, and video thumbnails."; priority = #High; status = #Todo; dayOffset = 4 },
        { title = "Set Up Landing Page"; description = "Build and test campaign landing page with clear CTA, form, and conversion tracking pixel installed."; priority = #High; status = #Todo; dayOffset = 5 },
        { title = "Configure Email Sequences"; description = "Build automated nurture sequences for new leads: welcome email, education series, and conversion follow-ups."; priority = #Medium; status = #Todo; dayOffset = 6 },
        { title = "Social Media Scheduling"; description = "Schedule all organic social posts across LinkedIn, Twitter, and Instagram using scheduling tool."; priority = #Medium; status = #Todo; dayOffset = 7 },
        { title = "Paid Ad Setup"; description = "Configure paid campaigns on Google Ads and LinkedIn. Set audiences, budgets, bid strategies, and conversion tracking."; priority = #High; status = #Todo; dayOffset = 8 },
        { title = "Influencer Outreach"; description = "Identify and contact relevant industry influencers or thought leaders for partnership opportunities."; priority = #Low; status = #Todo; dayOffset = 5 },
        { title = "Launch Campaign"; description = "Execute campaign launch across all channels simultaneously. Verify all tracking, CTAs, and automations are working."; priority = #High; status = #Todo; dayOffset = 14 },
        { title = "Monitor KPIs Daily"; description = "Track daily campaign KPIs: impressions, clicks, CTR, conversions, CAC, and pipeline generated."; priority = #Medium; status = #InProgress; dayOffset = 15 },
        { title = "Mid-Campaign Analysis"; description = "Analyze performance data at campaign midpoint. Reallocate budget to best-performing channels and pause underperformers."; priority = #Medium; status = #Todo; dayOffset = 22 },
        { title = "Final Report"; description = "Compile campaign performance report with results vs goals, ROI, learnings, and recommendations for next campaign."; priority = #Medium; status = #Todo; dayOffset = 30 },
      ];
      milestones = [
        { title = "Campaign Approved"; description = "Campaign strategy, budget, and creative assets approved by stakeholders."; dayOffset = 5 },
        { title = "Launch Day"; description = "Campaign live across all channels with full tracking enabled."; dayOffset = 14 },
        { title = "Campaign End & Reporting"; description = "Campaign concluded, final performance report delivered to stakeholders."; dayOffset = 30 },
      ];
      linkedWhiteboard = null;
    },

    {
      id = "design-sprint";
      name = "Design Sprint";
      category = "Design";
      tasks = [
        { title = "Understand Phase - Map the Challenge"; description = "Map the user journey and identify the critical problem area to focus the sprint on. Interview experts and document key insights."; priority = #High; status = #Todo; dayOffset = 0 },
        { title = "Define Long-Term Goal"; description = "Write a clear long-term sprint goal and identify the most critical sprint questions to answer by Friday."; priority = #High; status = #Todo; dayOffset = 0 },
        { title = "Sketch Solutions"; description = "Each team member independently sketches solution concepts using the 4-step sketch process (notes, ideas, crazy 8s, solution sketch)."; priority = #High; status = #Todo; dayOffset = 1 },
        { title = "Decide on Best Solution"; description = "Present solution sketches, conduct silent critique, conduct a straw poll, and make a final decision using the Decider."; priority = #High; status = #Todo; dayOffset = 2 },
        { title = "Build Prototype"; description = "Build a realistic, high-fidelity prototype in one day. Assign roles: makers, stitcher, writer, asset collector, interviewer."; priority = #High; status = #InProgress; dayOffset = 3 },
        { title = "Prototype Review"; description = "Internal review of prototype with sprint team. Fix critical issues before user testing sessions."; priority = #Medium; status = #Todo; dayOffset = 3 },
        { title = "Recruit Test Users"; description = "Confirm 5 target users for Friday testing. Send reminders, collect NDA forms, and prepare interview guide."; priority = #Medium; status = #Todo; dayOffset = 2 },
        { title = "User Testing Day 1"; description = "Conduct first 3 user testing sessions (60 min each). Sprint team observes and takes notes in real time."; priority = #High; status = #Todo; dayOffset = 4 },
        { title = "User Testing Day 2"; description = "Conduct final 2 user testing sessions. Focus on validating assumptions from Day 1 findings."; priority = #High; status = #Todo; dayOffset = 4 },
        { title = "Synthesize Feedback"; description = "Debrief as team after all sessions. Group sticky notes into themes. Identify patterns and key insights."; priority = #High; status = #Todo; dayOffset = 4 },
        { title = "Document Learnings"; description = "Write sprint report with: prototype decisions, key insights from testing, validated assumptions, and recommended next steps."; priority = #Medium; status = #Todo; dayOffset = 5 },
        { title = "Present Results"; description = "Present sprint outcomes to leadership and stakeholders. Include prototype demo, findings, and recommendation."; priority = #Medium; status = #Todo; dayOffset = 5 },
      ];
      milestones = [
        { title = "Map & Goal Complete"; description = "Problem space mapped, sprint goal defined, and team aligned on focus area."; dayOffset = 1 },
        { title = "Prototype Ready"; description = "High-fidelity prototype complete and ready for user testing."; dayOffset = 3 },
        { title = "Testing & Synthesis Complete"; description = "All 5 user tests conducted, insights synthesized, and learnings documented."; dayOffset = 5 },
      ];
      linkedWhiteboard = ?{ templateId = "tpl-brainstorm"; nameSuffix = " - Design Sprint Board" };
    },

    {
      id = "client-project";
      name = "Client Project";
      category = "Operations";
      tasks = [
        { title = "Kickoff Meeting"; description = "Run project kickoff: introductions, goals, timeline, communication norms, and escalation paths. Send meeting notes."; priority = #High; status = #Todo; dayOffset = 0 },
        { title = "Requirements Gathering"; description = "Conduct structured requirements workshops. Document functional, non-functional, technical, and business requirements."; priority = #High; status = #Todo; dayOffset = 1 },
        { title = "Project Scope Document"; description = "Write detailed project scope: deliverables, timelines, assumptions, exclusions, acceptance criteria, and change control process."; priority = #High; status = #Todo; dayOffset = 3 },
        { title = "Client Sign-Off on Scope"; description = "Present scope document to client. Address questions and obtain written approval before work begins."; priority = #High; status = #Todo; dayOffset = 5 },
        { title = "Wireframe Review"; description = "Present UX wireframes for all major flows. Gather feedback and document requested changes."; priority = #Medium; status = #Todo; dayOffset = 8 },
        { title = "Design Approval"; description = "Present final visual designs to client. Obtain written approval before development begins."; priority = #High; status = #Todo; dayOffset = 14 },
        { title = "Development Phase 1"; description = "Build core infrastructure, authentication, data models, and primary user flows as defined in scope."; priority = #High; status = #InProgress; dayOffset = 15 },
        { title = "Development Phase 2"; description = "Build secondary features, integrations, and admin functionality. Perform internal QA throughout."; priority = #High; status = #Todo; dayOffset = 35 },
        { title = "Testing Round 1"; description = "Internal QA: functional testing, cross-browser testing, mobile responsiveness, and performance testing."; priority = #Medium; status = #Todo; dayOffset = 45 },
        { title = "Client UAT"; description = "Client conducts user acceptance testing. Provide test scripts and a dedicated feedback channel."; priority = #High; status = #Todo; dayOffset = 50 },
        { title = "Revisions from UAT"; description = "Address all UAT feedback items. Prioritize with client, fix critical issues, document deferred items."; priority = #Medium; status = #Todo; dayOffset = 54 },
        { title = "Final Delivery"; description = "Deploy to production, transfer ownership, provide handover documentation and training session."; priority = #High; status = #Todo; dayOffset = 60 },
        { title = "Invoice Submission"; description = "Submit final invoice per project contract. Include project summary and deliverables checklist."; priority = #Medium; status = #Todo; dayOffset = 60 },
        { title = "Post-Project Retrospective"; description = "Internal retrospective: what went well, what to improve, lessons learned, and process improvements."; priority = #Low; status = #Todo; dayOffset = 63 },
      ];
      milestones = [
        { title = "Kickoff Complete"; description = "Project kicked off, scope signed off, and team aligned on deliverables."; dayOffset = 3 },
        { title = "Design Approved"; description = "All designs reviewed and formally approved by client."; dayOffset = 14 },
        { title = "Project Delivered"; description = "Final deliverables deployed to production and handed over to client."; dayOffset = 60 },
      ];
      linkedWhiteboard = null;
    },

    {
      id = "event-planning";
      name = "Event Planning";
      category = "Operations";
      tasks = [
        { title = "Define Event Concept"; description = "Align stakeholders on event type, format, theme, goals, and target audience. Document in event brief."; priority = #High; status = #Todo; dayOffset = 0 },
        { title = "Set Date and Venue"; description = "Research and shortlist venue options. Confirm date, availability, capacity, and initial pricing."; priority = #High; status = #Todo; dayOffset = 1 },
        { title = "Create Event Budget"; description = "Build detailed event budget covering venue, catering, AV, marketing, speakers, and contingency reserve."; priority = #High; status = #Todo; dayOffset = 2 },
        { title = "Book Venue"; description = "Sign venue contract, pay deposit, and confirm all venue requirements: layout, catering, AV, and parking."; priority = #High; status = #Todo; dayOffset = 7 },
        { title = "Confirm Speakers/Performers"; description = "Finalize speaker lineup, send confirmation letters, collect bios and headshots, and schedule prep calls."; priority = #High; status = #Todo; dayOffset = 10 },
        { title = "Design Event Materials"; description = "Create event branding: logo, banners, slide templates, badges, signage, and social media graphics."; priority = #Medium; status = #Todo; dayOffset = 14 },
        { title = "Set Up Registration Page"; description = "Build event registration page with ticketing, capacity limits, and confirmation email automation."; priority = #High; status = #Todo; dayOffset = 14 },
        { title = "Send Invitations"; description = "Launch invitations via email, social media, and paid channels. Track RSVPs and send reminders at 2-week mark."; priority = #High; status = #Todo; dayOffset = 21 },
        { title = "Sponsor Outreach"; description = "Identify potential sponsors, send sponsorship packages, and follow up with interested parties."; priority = #Medium; status = #Todo; dayOffset = 14 },
        { title = "Logistics Coordination"; description = "Coordinate all day-of logistics: catering orders, AV equipment, volunteer briefings, and vendor deliveries."; priority = #High; status = #InProgress; dayOffset = 55 },
        { title = "Day-Of Run Sheet"; description = "Create minute-by-minute run sheet for event day. Share with all team members and vendors."; priority = #High; status = #Todo; dayOffset = 58 },
        { title = "AV and Tech Setup"; description = "Arrive early for AV setup, microphone tests, slide run-through, and livestream technical check."; priority = #Medium; status = #Todo; dayOffset = 60 },
        { title = "Post-Event Survey"; description = "Send attendee satisfaction survey within 24 hours. Target 30%+ response rate for meaningful data."; priority = #Medium; status = #Todo; dayOffset = 61 },
        { title = "Thank You Emails"; description = "Send personalized thank you emails to speakers, sponsors, and key attendees within 48 hours."; priority = #Low; status = #Todo; dayOffset = 62 },
        { title = "Event Report"; description = "Compile event report: attendance, satisfaction scores, budget vs actual, media coverage, and ROI analysis."; priority = #Medium; status = #Todo; dayOffset = 65 },
      ];
      milestones = [
        { title = "Venue Booked"; description = "Venue confirmed and contract signed. Core event framework established."; dayOffset = 7 },
        { title = "Invitations Sent"; description = "Registration page live and invitations sent to all target attendees."; dayOffset = 21 },
        { title = "Event Day"; description = "Event successfully executed as planned."; dayOffset = 60 },
      ];
      linkedWhiteboard = null;
    },

    {
      id = "onboarding";
      name = "Employee Onboarding";
      category = "HR";
      tasks = [
        { title = "Send Welcome Email"; description = "Send personalized welcome email 1 week before start date with: start time/location, first-day agenda, and what to bring."; priority = #High; status = #Todo; dayOffset = 0 },
        { title = "Prepare Workstation"; description = "Set up laptop/desktop, install required software, create accounts, order any needed peripherals and desk setup."; priority = #High; status = #Todo; dayOffset = 0 },
        { title = "Set Up Accounts and Access"; description = "Provision all required system access: email, Slack, project management, code repositories, cloud tools, and VPN."; priority = #High; status = #Todo; dayOffset = 0 },
        { title = "Assign Onboarding Buddy"; description = "Pair new hire with a buddy from their team. Brief the buddy on their responsibilities and suggested activities."; priority = #Medium; status = #Todo; dayOffset = 0 },
        { title = "Day 1 Orientation"; description = "Welcome session covering company mission, values, culture, org chart, key processes, and team introductions."; priority = #High; status = #Todo; dayOffset = 1 },
        { title = "Team Introductions"; description = "Schedule 1:1 coffee chats with all direct team members and key cross-functional collaborators in week 1."; priority = #Medium; status = #Todo; dayOffset = 1 },
        { title = "Role-Specific Training Week 1"; description = "Complete week 1 role training: tools, processes, key responsibilities, and first project assignment."; priority = #High; status = #InProgress; dayOffset = 2 },
        { title = "Role-Specific Training Week 2"; description = "Continue role training: deeper dive into workflows, attend relevant team meetings, start contributing."; priority = #High; status = #Todo; dayOffset = 8 },
        { title = "HR Paperwork Completion"; description = "Complete all required HR paperwork: employment contract, tax forms, emergency contact, direct deposit setup."; priority = #High; status = #Todo; dayOffset = 1 },
        { title = "Benefits Enrollment"; description = "Walk new hire through benefits options: health insurance, retirement plan, PTO policy, and other perks."; priority = #Medium; status = #Todo; dayOffset = 2 },
        { title = "30-Day Check-In"; description = "Manager conducts 30-day check-in: role clarity, team integration, any concerns, and 60-day goal setting."; priority = #Medium; status = #Todo; dayOffset = 30 },
        { title = "60-Day Check-In"; description = "Review progress against 30-day goals, address any challenges, and confirm 90-day performance expectations."; priority = #Medium; status = #Todo; dayOffset = 60 },
        { title = "90-Day Performance Review"; description = "Formal 90-day review: assess performance against role expectations, set long-term goals, and confirm path forward."; priority = #High; status = #Todo; dayOffset = 90 },
        { title = "Onboarding Survey"; description = "Send onboarding experience survey to new hire to capture feedback and continuously improve the program."; priority = #Low; status = #Todo; dayOffset = 90 },
      ];
      milestones = [
        { title = "Day 1 Complete"; description = "First day complete — new hire oriented, accounts set up, and team introductions made."; dayOffset = 1 },
        { title = "30-Day Review"; description = "New hire settled in role, check-in complete, and 60-day goals established."; dayOffset = 30 },
        { title = "90-Day Review"; description = "Full onboarding complete. New hire fully ramped and contributing independently."; dayOffset = 90 },
      ];
      linkedWhiteboard = null;
    },

    {
      id = "content-calendar";
      name = "Content Calendar";
      category = "Marketing";
      tasks = [
        { title = "Audit Existing Content"; description = "Inventory all existing content assets. Assess performance, relevance, gaps, and opportunities for repurposing."; priority = #Medium; status = #Todo; dayOffset = 0 },
        { title = "Define Content Pillars"; description = "Establish 3-5 core content pillars that align with audience needs and business goals. Document with rationale."; priority = #High; status = #Todo; dayOffset = 1 },
        { title = "Keyword Research"; description = "Conduct SEO keyword research for each content pillar. Identify high-volume, low-competition opportunities."; priority = #High; status = #Todo; dayOffset = 2 },
        { title = "Monthly Blog Posts Plan"; description = "Plan 4 blog posts for the month: topic, target keyword, outline, assigned writer, and publish date."; priority = #High; status = #Todo; dayOffset = 3 },
        { title = "Social Media Content Plan"; description = "Plan social posts by platform (LinkedIn, Twitter, Instagram): topics, formats, posting schedule, and hashtag strategy."; priority = #Medium; status = #Todo; dayOffset = 3 },
        { title = "Newsletter Schedule"; description = "Plan monthly newsletter: main story, curated links, product updates, and CTA. Assign editor and set send date."; priority = #Medium; status = #Todo; dayOffset = 4 },
        { title = "Video Content Plan"; description = "Plan any video content: topics, scripts, production timeline, distribution channels, and SEO optimization."; priority = #Low; status = #Todo; dayOffset = 5 },
        { title = "Assign Writers"; description = "Assign all content pieces to writers/creators with clear briefs, deadlines, and style guide references."; priority = #High; status = #Todo; dayOffset = 5 },
        { title = "Draft Blog Post 1"; description = "Write first blog post draft following SEO brief. Include primary keyword, meta description, and internal links."; priority = #High; status = #InProgress; dayOffset = 7 },
        { title = "Draft Blog Post 2"; description = "Write second blog post draft. Ensure unique angle, strong headline, and clear CTA for lead generation."; priority = #Medium; status = #Todo; dayOffset = 10 },
        { title = "Social Graphics Creation"; description = "Design social media graphics for all planned posts. Maintain brand consistency across all assets."; priority = #Medium; status = #Todo; dayOffset = 8 },
        { title = "Review and Approve Content"; description = "All content reviewed for accuracy, brand voice, SEO optimization, and legal compliance before publishing."; priority = #High; status = #Todo; dayOffset = 12 },
        { title = "Schedule and Publish"; description = "Load all approved content into scheduling tool. Verify all links, images, and CTAs before going live."; priority = #High; status = #Todo; dayOffset = 14 },
        { title = "Track Performance Metrics"; description = "Monitor content performance: page views, time on page, social engagement, leads generated, and SEO ranking changes."; priority = #Medium; status = #Todo; dayOffset = 30 },
      ];
      milestones = [
        { title = "Content Plan Approved"; description = "Full month content plan reviewed and approved. All assignments confirmed."; dayOffset = 7 },
        { title = "First Batch Published"; description = "First two weeks of content live across all channels."; dayOffset = 14 },
        { title = "Monthly Review"; description = "Month-end performance review complete with insights for next month's plan."; dayOffset = 30 },
      ];
      linkedWhiteboard = null;
    },

    {
      id = "sales-pipeline";
      name = "Sales Pipeline";
      category = "Sales";
      tasks = [
        { title = "Define Ideal Customer Profile"; description = "Document ICP: company size, industry, tech stack, pain points, budget range, and key decision makers."; priority = #High; status = #Todo; dayOffset = 0 },
        { title = "Build Prospect List"; description = "Source 100+ qualified prospects matching ICP from LinkedIn Sales Navigator, intent data, and referrals."; priority = #High; status = #Todo; dayOffset = 1 },
        { title = "Cold Outreach Sequence"; description = "Build multi-touch email sequence: day 1 intro, day 4 value add, day 8 case study, day 14 breakup email."; priority = #High; status = #Todo; dayOffset = 2 },
        { title = "LinkedIn Outreach"; description = "Connect with decision makers on LinkedIn with personalized connection requests and follow-up messages."; priority = #Medium; status = #Todo; dayOffset = 3 },
        { title = "Follow-Up Sequence Setup"; description = "Configure automated follow-up sequences in CRM for leads who opened emails but did not respond."; priority = #Medium; status = #Todo; dayOffset = 3 },
        { title = "Discovery Call Script"; description = "Develop discovery call script: opening, qualification questions (BANT/MEDDIC), pain probing, and next steps."; priority = #High; status = #Todo; dayOffset = 4 },
        { title = "Demo Preparation"; description = "Prepare personalized demo script and slides tailored to prospect's industry and stated pain points."; priority = #High; status = #Todo; dayOffset = 5 },
        { title = "Proposal Template"; description = "Create professional proposal template: problem statement, solution, pricing, ROI calculation, and timeline."; priority = #High; status = #InProgress; dayOffset = 7 },
        { title = "Negotiate Terms"; description = "Negotiate pricing, contract length, SLAs, and implementation timeline with qualified prospects."; priority = #Medium; status = #Todo; dayOffset = 20 },
        { title = "Close Deal"; description = "Obtain signed contract and initial payment. Hand off to customer success for onboarding."; priority = #High; status = #Todo; dayOffset = 30 },
        { title = "Onboard New Customer"; description = "Coordinate customer onboarding: kickoff call, setup, training, and success metrics definition."; priority = #High; status = #Todo; dayOffset = 32 },
        { title = "CRM Update"; description = "Keep CRM updated with all prospect interactions, stage changes, deal values, and next actions."; priority = #Medium; status = #Todo; dayOffset = 35 },
        { title = "Win/Loss Analysis"; description = "Analyze closed deals for win/loss patterns. Document learnings to improve pipeline and messaging."; priority = #Medium; status = #Todo; dayOffset = 35 },
      ];
      milestones = [
        { title = "Outreach Live"; description = "First outreach sequence launched with 100+ prospects in pipeline."; dayOffset = 7 },
        { title = "First Demo Booked"; description = "First qualified discovery/demo call scheduled."; dayOffset = 14 },
        { title = "First Deal Closed"; description = "First new customer contract signed and onboarding initiated."; dayOffset = 30 },
      ];
      linkedWhiteboard = null;
    },

    {
      id = "feature-launch";
      name = "Feature Launch";
      category = "Product";
      tasks = [
        { title = "Feature Specification"; description = "Write comprehensive feature spec: problem statement, user stories, scope, out-of-scope items, and success metrics."; priority = #High; status = #Todo; dayOffset = 0 },
        { title = "Acceptance Criteria"; description = "Define measurable acceptance criteria for every user story. Ensure criteria are testable and unambiguous."; priority = #High; status = #Todo; dayOffset = 1 },
        { title = "Design Mockups"; description = "Create high-fidelity UI mockups for all feature screens and states including empty, loading, and error states."; priority = #High; status = #Todo; dayOffset = 2 },
        { title = "Design Review"; description = "Present mockups to product, engineering, and QA. Incorporate feedback and obtain final design sign-off."; priority = #Medium; status = #Todo; dayOffset = 5 },
        { title = "Engineering Implementation"; description = "Build feature following approved designs and acceptance criteria. Daily standups to track progress and blockers."; priority = #High; status = #InProgress; dayOffset = 7 },
        { title = "Unit Tests"; description = "Write comprehensive unit tests for all new logic. Maintain 80%+ coverage. All tests must pass in CI."; priority = #High; status = #Todo; dayOffset = 15 },
        { title = "Integration Tests"; description = "Write integration tests for all API endpoints and cross-service interactions. Test happy path and edge cases."; priority = #Medium; status = #Todo; dayOffset = 16 },
        { title = "QA Testing"; description = "Full QA testing cycle: functional, regression, cross-browser, mobile, and accessibility testing."; priority = #High; status = #Todo; dayOffset = 18 },
        { title = "Beta Testing with Users"; description = "Roll out to 10% beta users. Monitor analytics, collect feedback via in-app survey and user interviews."; priority = #High; status = #Todo; dayOffset = 21 },
        { title = "Beta Feedback Analysis"; description = "Analyze beta feedback and usage data. Prioritize any critical fixes before full rollout."; priority = #Medium; status = #Todo; dayOffset = 25 },
        { title = "Documentation"; description = "Write user-facing documentation: feature guide, FAQ, and update help center with new articles."; priority = #Medium; status = #Todo; dayOffset = 28 },
        { title = "Marketing Copy"; description = "Write all marketing materials: email announcement, blog post, release notes, and social media posts."; priority = #Medium; status = #Todo; dayOffset = 28 },
        { title = "In-App Announcement"; description = "Configure in-app announcement banner/tooltip to notify existing users of the new feature at launch."; priority = #Medium; status = #Todo; dayOffset = 33 },
        { title = "Launch Day Monitoring"; description = "Monitor error rates, performance metrics, and user feedback closely for 48 hours post-launch."; priority = #High; status = #Todo; dayOffset = 35 },
        { title = "Post-Launch Retro"; description = "Team retrospective: launch process review, what worked, what to improve for future feature launches."; priority = #Low; status = #Todo; dayOffset = 40 },
      ];
      milestones = [
        { title = "Design Approved"; description = "Feature designs finalized and approved. Engineering can begin implementation."; dayOffset = 7 },
        { title = "Beta Launch"; description = "Feature launched to 10% beta audience for validation."; dayOffset = 21 },
        { title = "Public Launch"; description = "Feature rolled out to 100% of users."; dayOffset = 35 },
      ];
      linkedWhiteboard = ?{ templateId = "tpl-kanban"; nameSuffix = " - Launch Board" };
    },

    {
      id = "hiring-pipeline";
      name = "Hiring Pipeline";
      category = "HR";
      tasks = [
        { title = "Write Job Description"; description = "Craft compelling JD: role summary, responsibilities, required/preferred qualifications, and company culture section."; priority = #High; status = #Todo; dayOffset = 0 },
        { title = "Get Approval on JD"; description = "Route JD to hiring manager, HR, and finance for headcount/budget approval before posting."; priority = #High; status = #Todo; dayOffset = 1 },
        { title = "Post Job Listings"; description = "Publish JD on LinkedIn, Indeed, company careers page, and relevant niche job boards for the role."; priority = #High; status = #Todo; dayOffset = 3 },
        { title = "Source Passive Candidates"; description = "Proactively source 25+ passive candidates on LinkedIn. Send personalized outreach messages."; priority = #Medium; status = #Todo; dayOffset = 3 },
        { title = "Screen Resumes"; description = "Review all inbound applications. Score against must-have criteria and advance top 20% to phone screen."; priority = #High; status = #InProgress; dayOffset = 7 },
        { title = "Phone Screen Round 1"; description = "Conduct 30-min phone screens with top candidates: background, motivations, salary expectations, and basic fit."; priority = #High; status = #Todo; dayOffset = 10 },
        { title = "Technical Assessment"; description = "Send technical assessment or work sample to advancing candidates. Set 72-hour completion window."; priority = #High; status = #Todo; dayOffset = 14 },
        { title = "Panel Interview"; description = "Schedule 4-person panel interviews with hiring manager, team lead, peer, and cross-functional partner."; priority = #High; status = #Todo; dayOffset = 18 },
        { title = "Collect Interview Feedback"; description = "Gather structured interview scorecards from all interviewers within 24 hours of each interview."; priority = #High; status = #Todo; dayOffset = 20 },
        { title = "Reference Checks"; description = "Conduct 3 professional reference checks for finalist candidate. Focus on work style, strengths, and growth areas."; priority = #Medium; status = #Todo; dayOffset = 28 },
        { title = "Extend Offer"; description = "Verbal offer call with hiring manager. Follow up with written offer letter within 24 hours."; priority = #High; status = #Todo; dayOffset = 30 },
        { title = "Offer Negotiation"; description = "Negotiate compensation, start date, and any special terms within pre-approved ranges."; priority = #Medium; status = #Todo; dayOffset = 31 },
        { title = "Background Check"; description = "Initiate background check upon verbal acceptance. Standard check: identity, employment history, criminal."; priority = #High; status = #Todo; dayOffset = 32 },
        { title = "Send Offer Letter"; description = "Send final signed offer letter. Confirm start date and initiate pre-boarding checklist."; priority = #High; status = #Todo; dayOffset = 34 },
        { title = "Prepare Onboarding"; description = "Set up accounts, order equipment, assign onboarding buddy, and brief team on new hire start date."; priority = #Medium; status = #Todo; dayOffset = 35 },
      ];
      milestones = [
        { title = "Job Posted"; description = "JD approved and live on all job boards. Sourcing initiated."; dayOffset = 3 },
        { title = "Interviews Complete"; description = "All panel interviews completed and candidate decision made."; dayOffset = 21 },
        { title = "Offer Accepted"; description = "Candidate has accepted offer and start date is confirmed."; dayOffset = 35 },
      ];
      linkedWhiteboard = null;
    },
  ];

  // ── Lookup ────────────────────────────────────────────────────────────────────

  public func findTemplate(templateId : Text) : ?ProjectTemplate {
    templates.find(func(t : ProjectTemplate) : Bool { t.id == templateId })
  };
};
