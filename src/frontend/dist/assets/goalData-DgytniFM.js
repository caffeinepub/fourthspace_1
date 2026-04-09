import { s as createLucideIcon } from "./index-1XRv9GHr.js";
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
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb"
    }
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }]
];
const Lightbulb = createLucideIcon("lightbulb", __iconNode);
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
    description: "Improve hiring velocity, reduce turnover, and build programs that make this workspace a destination employer.",
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
  Lightbulb as L,
  OKR_TEMPLATES as O
};
