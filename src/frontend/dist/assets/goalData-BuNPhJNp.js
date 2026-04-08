const STATUS_COLORS = {
  Active: "bg-blue-500/10 text-blue-600 border-blue-200",
  OnTrack: "bg-accent/10 text-accent border-accent/20",
  AtRisk: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  Behind: "bg-destructive/10 text-destructive border-destructive/20",
  Completed: "bg-muted text-muted-foreground border-border"
};
const STATUS_LABELS = {
  Active: "Active",
  OnTrack: "On Track",
  AtRisk: "At Risk",
  Behind: "Behind",
  Completed: "Completed"
};
const MOCK_GOALS = [
  {
    id: "g1",
    title: "Achieve Product-Market Fit for Enterprise Tier",
    description: "Validate our enterprise offering by securing reference customers and achieving measurable retention targets across our top 10 accounts.",
    owner: "Alex Martinez",
    ownerInitials: "AM",
    contributors: ["Sam Kim", "Jordan Lee"],
    period: "Q2 2026",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    status: "OnTrack",
    progress: 62,
    keyResults: 3,
    keyResultList: [
      {
        id: "kr1-1",
        title: "Close 5 enterprise deals worth $50K+ ARR each",
        currentValue: 3,
        targetValue: 5,
        unit: "deals",
        description: "Focus on SaaS companies with 50-500 employees",
        status: "OnTrack"
      },
      {
        id: "kr1-2",
        title: "Achieve 90% quarterly retention on enterprise accounts",
        currentValue: 87,
        targetValue: 90,
        unit: "%",
        description: "Measure based on renewal rate within 30 days of contract end",
        status: "OnTrack"
      },
      {
        id: "kr1-3",
        title: "Receive NPS of 45+ from enterprise customers",
        currentValue: 38,
        targetValue: 45,
        unit: "NPS",
        description: "Survey all enterprise contacts quarterly",
        status: "AtRisk"
      }
    ],
    checkIns: [
      {
        id: "ci1-1",
        author: "Alex Martinez",
        initials: "AM",
        oldValue: 1,
        newValue: 3,
        note: "Closed two deals this week — Acme Corp and TechBlue. Pipeline looking strong for Q2.",
        date: "Apr 5, 2026"
      },
      {
        id: "ci1-2",
        author: "Sam Kim",
        initials: "SK",
        oldValue: 0,
        newValue: 1,
        note: "First enterprise close of the quarter. Customer onboarding is underway.",
        date: "Mar 28, 2026"
      }
    ]
  },
  {
    id: "g2",
    title: "Reduce Customer Churn to Under 2% Monthly",
    description: "Improve customer success processes, launch proactive health monitoring, and build automated intervention flows to reduce monthly churn.",
    owner: "Sam Kim",
    ownerInitials: "SK",
    contributors: ["Riley Okafor"],
    period: "Q2 2026",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    status: "AtRisk",
    progress: 38,
    keyResults: 2,
    keyResultList: [
      {
        id: "kr2-1",
        title: "Monthly churn rate drops from 4.2% to under 2%",
        currentValue: 3.1,
        targetValue: 2,
        unit: "%",
        description: "Track rolling 30-day churn, excluding involuntary churn",
        status: "AtRisk"
      },
      {
        id: "kr2-2",
        title: "Launch automated health score alerts for 100% of accounts",
        currentValue: 55,
        targetValue: 100,
        unit: "%",
        description: "Integrate health score into CRM with Slack notifications",
        status: "Behind"
      }
    ],
    checkIns: [
      {
        id: "ci2-1",
        author: "Sam Kim",
        initials: "SK",
        oldValue: 4.2,
        newValue: 3.1,
        note: "Proactive outreach reduced churn by 1.1% this month. Still behind target.",
        date: "Apr 6, 2026"
      }
    ]
  },
  {
    id: "g3",
    title: "Ship Mobile App v2.0 with 4.5+ Star Rating",
    description: "Complete the mobile app redesign with improved UX, offline support, and push notifications. Launch on both iOS and Android with strong ratings.",
    owner: "Jordan Lee",
    ownerInitials: "JL",
    contributors: ["Morgan Chen", "Alex Martinez"],
    period: "Q2 2026",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    status: "Active",
    progress: 45,
    keyResults: 3,
    keyResultList: [
      {
        id: "kr3-1",
        title: "Ship mobile app v2.0 to production",
        currentValue: 0,
        targetValue: 1,
        unit: "release",
        description: "Full launch on iOS App Store and Google Play",
        status: "Active"
      },
      {
        id: "kr3-2",
        title: "Achieve 4.5+ star rating within 30 days of launch",
        currentValue: 0,
        targetValue: 4.5,
        unit: "stars",
        description: "Minimum 100 reviews required",
        status: "Active"
      },
      {
        id: "kr3-3",
        title: "2,500 daily active users within first 60 days",
        currentValue: 0,
        targetValue: 2500,
        unit: "DAU",
        description: "Measured via analytics platform",
        status: "Active"
      }
    ],
    checkIns: []
  },
  {
    id: "g4",
    title: "Grow Organic Traffic by 150%",
    description: "Execute a comprehensive SEO and content strategy to triple our organic search traffic and reduce CAC from paid channels.",
    owner: "Morgan Chen",
    ownerInitials: "MC",
    contributors: ["Riley Okafor"],
    period: "Q2 2026",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    status: "OnTrack",
    progress: 71,
    keyResults: 2,
    keyResultList: [
      {
        id: "kr4-1",
        title: "Increase organic sessions from 20K to 50K/month",
        currentValue: 34200,
        targetValue: 5e4,
        unit: "sessions",
        description: "Track via Google Analytics",
        status: "OnTrack"
      },
      {
        id: "kr4-2",
        title: "Publish 20 long-form SEO articles targeting high-intent keywords",
        currentValue: 14,
        targetValue: 20,
        unit: "articles",
        description: "Minimum 1,500 words each, with primary keyword in title",
        status: "OnTrack"
      }
    ],
    checkIns: [
      {
        id: "ci4-1",
        author: "Morgan Chen",
        initials: "MC",
        oldValue: 2e4,
        newValue: 34200,
        note: "Strong growth from new blog series and backlink campaign. On pace for Q2 target.",
        date: "Apr 4, 2026"
      }
    ]
  },
  {
    id: "g5",
    title: "Build World-Class Engineering Culture",
    description: "Improve engineering velocity, reduce incidents, and make Fourthspace engineering a destination team through strong hiring and culture initiatives.",
    owner: "Riley Okafor",
    ownerInitials: "RO",
    contributors: ["Jordan Lee"],
    period: "H1 2026",
    startDate: "2026-01-01",
    endDate: "2026-06-30",
    status: "Completed",
    progress: 100,
    keyResults: 3,
    keyResultList: [
      {
        id: "kr5-1",
        title: "Achieve deployment frequency of 5+ deploys per day",
        currentValue: 7,
        targetValue: 5,
        unit: "deploys/day",
        description: "Track via CI/CD dashboard",
        status: "Completed"
      },
      {
        id: "kr5-2",
        title: "Reduce P0 incidents from 8 to 2 per quarter",
        currentValue: 1,
        targetValue: 2,
        unit: "incidents",
        description: "P0 = customer-facing outage > 15 min",
        status: "Completed"
      },
      {
        id: "kr5-3",
        title: "Hire 4 senior engineers with offer acceptance rate > 80%",
        currentValue: 4,
        targetValue: 4,
        unit: "hires",
        description: "Measure from offer sent to signed",
        status: "Completed"
      }
    ],
    checkIns: [
      {
        id: "ci5-1",
        author: "Riley Okafor",
        initials: "RO",
        oldValue: 2,
        newValue: 4,
        note: "Final two senior engineers signed this week. All KRs complete!",
        date: "Mar 15, 2026"
      }
    ]
  }
];
const OKR_TEMPLATES = [
  {
    id: "tmpl-eng",
    name: "Engineering OKR",
    category: "Engineering",
    title: "Improve Engineering Velocity and Quality",
    description: "Drive faster, higher-quality delivery through better practices, tooling, and team health.",
    period: "Q2 2026",
    suggestedKRs: [
      {
        title: "Achieve deployment frequency of 5+ deploys per day",
        targetValue: 5,
        unit: "deploys/day",
        description: "Track via CI/CD pipeline metrics"
      },
      {
        title: "Reduce P0 incidents to under 2 per quarter",
        targetValue: 2,
        unit: "incidents",
        description: "Customer-facing outages > 15 minutes"
      },
      {
        title: "Increase test coverage from 60% to 85%",
        targetValue: 85,
        unit: "%",
        description: "Unit + integration tests across all services"
      },
      {
        title: "Reduce average PR review time to under 4 hours",
        targetValue: 4,
        unit: "hours",
        description: "Measured from PR open to first review"
      }
    ]
  },
  {
    id: "tmpl-mkt",
    name: "Marketing OKR",
    category: "Marketing",
    title: "Drive Qualified Pipeline Through Organic and Paid Channels",
    description: "Scale demand generation to deliver high-quality leads and reduce customer acquisition cost.",
    period: "Q2 2026",
    suggestedKRs: [
      {
        title: "Increase MQLs from 500 to 1,200 per month",
        targetValue: 1200,
        unit: "MQLs/mo",
        description: "Measured from CRM inbound"
      },
      {
        title: "Grow organic traffic by 120%",
        targetValue: 120,
        unit: "% growth",
        description: "Track via Google Analytics"
      },
      {
        title: "Launch 3 high-converting landing pages",
        targetValue: 3,
        unit: "pages",
        description: "Each must achieve > 5% CVR"
      },
      {
        title: "Reduce CAC from $480 to $300",
        targetValue: 300,
        unit: "$ CAC",
        description: "Blended acquisition cost"
      }
    ]
  },
  {
    id: "tmpl-sales",
    name: "Sales OKR",
    category: "Sales",
    title: "Hit $2M ARR by End of Quarter",
    description: "Close high-value accounts, improve win rate, and shorten the sales cycle to hit our revenue milestone.",
    period: "Q2 2026",
    suggestedKRs: [
      {
        title: "Close $2M in new ARR",
        targetValue: 2e6,
        unit: "$",
        description: "Net new ARR excluding expansions"
      },
      {
        title: "Improve win rate from 18% to 28%",
        targetValue: 28,
        unit: "%",
        description: "Opportunities created this quarter"
      },
      {
        title: "Reduce average sales cycle from 45 to 28 days",
        targetValue: 28,
        unit: "days",
        description: "From first demo to signed contract"
      },
      {
        title: "Achieve 100% CRM data completeness on active deals",
        targetValue: 100,
        unit: "%",
        description: "All required fields populated"
      }
    ]
  },
  {
    id: "tmpl-product",
    name: "Product OKR",
    category: "Product",
    title: "Deliver Features That Drive Activation and Retention",
    description: "Ship high-impact product improvements that increase user activation and reduce churn through better product-market fit.",
    period: "Q2 2026",
    suggestedKRs: [
      {
        title: "Increase activation rate (day 7) from 32% to 50%",
        targetValue: 50,
        unit: "%",
        description: "Users completing core onboarding flow"
      },
      {
        title: "Ship 3 retention-driving features based on churn interviews",
        targetValue: 3,
        unit: "features",
        description: "Validated by at-risk customer feedback"
      },
      {
        title: "Reduce time-to-first-value from 14 min to 5 min",
        targetValue: 5,
        unit: "minutes",
        description: "From signup to first meaningful action"
      },
      {
        title: "Achieve NPS of 45+ from active users",
        targetValue: 45,
        unit: "NPS",
        description: "Survey users with 7+ days activity"
      }
    ]
  },
  {
    id: "tmpl-hr",
    name: "HR OKR",
    category: "People & HR",
    title: "Build a High-Performing, Inclusive Workplace",
    description: "Improve hiring velocity, reduce turnover, and build programs that make Fourthspace a destination employer.",
    period: "Q2 2026",
    suggestedKRs: [
      {
        title: "Hire 8 open positions with avg. offer acceptance rate of 85%+",
        targetValue: 8,
        unit: "hires",
        description: "Track from offer sent to signed"
      },
      {
        title: "Reduce voluntary turnover from 18% to 10% annualized",
        targetValue: 10,
        unit: "%",
        description: "Rolling 12-month voluntary attrition"
      },
      {
        title: "Achieve employee engagement score of 75+ (eNPS)",
        targetValue: 75,
        unit: "eNPS",
        description: "Company-wide quarterly survey"
      },
      {
        title: "Launch leadership development program with 100% manager participation",
        targetValue: 100,
        unit: "%",
        description: "All people managers enrolled"
      }
    ]
  }
];
export {
  MOCK_GOALS as M,
  OKR_TEMPLATES as O,
  STATUS_LABELS as S,
  STATUS_COLORS as a
};
