import { g as createLucideIcon, u as useAuth, j as jsxRuntimeExports, r as reactExports, B as Button, X, a2 as Menu, m as FileText, F as FolderKanban, a3 as MessageSquare, a4 as CalendarDays, D as DollarSign, a5 as Wallet } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { Z as Zap } from "./zap-Czf8pMIS.js";
import { A as ArrowRight } from "./arrow-right-D7-RcTtv.js";
import { C as ChevronRight } from "./chevron-right-DhEmnM__.js";
import { C as Check } from "./check-EW6vRiNm.js";
import { S as ShieldCheck } from "./shield-check-D0m_kNM_.js";
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
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode);
const CATEGORIES = [
  {
    id: "notes",
    name: "Notes",
    icon: FileText,
    color: "text-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    price: 10,
    tagline: "Capture ideas, never lose a thought",
    features: [
      "Rich text editor",
      "Cross-category linking",
      "Tag & organize",
      "Full-text search"
    ]
  },
  {
    id: "projects",
    name: "Projects",
    icon: FolderKanban,
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    price: 15,
    tagline: "Ship work on time, every time",
    features: [
      "Kanban boards",
      "Milestone tracking",
      "Task assignments",
      "Deadline alerts"
    ]
  },
  {
    id: "chat",
    name: "Chat",
    icon: MessageSquare,
    color: "text-teal-600",
    bg: "bg-teal-50 dark:bg-teal-950/40",
    price: 8,
    tagline: "Collaborate without switching apps",
    features: [
      "Team channels",
      "Direct messages",
      "File sharing",
      "Cross-link to tasks"
    ]
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: CalendarDays,
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    price: 5,
    tagline: "Time management, unified",
    features: [
      "Event scheduling",
      "Recurring events",
      "Team availability",
      "Reminders"
    ]
  },
  {
    id: "payroll",
    name: "Payroll",
    icon: DollarSign,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    price: 30,
    tagline: "Pay your team without the headache",
    features: [
      "Employee management",
      "Automated calculations",
      "Pay frequency options",
      "Audit history"
    ]
  },
  {
    id: "escrow",
    name: "Escrow",
    icon: ShieldCheck,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    price: 25,
    tagline: "Secure transactions, protected both sides",
    features: [
      "Smart contracts",
      "Milestone releases",
      "Dispute resolution",
      "Full audit trail"
    ]
  },
  {
    id: "wallet",
    name: "Wallet",
    icon: Wallet,
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    price: 12,
    tagline: "Crypto & fiat in one place",
    features: [
      "ICP support",
      "Recurring payments",
      "Transaction history",
      "Secure transfers"
    ]
  }
];
const TOTAL_TOOLS_COST = CATEGORIES.reduce((sum, c) => sum + c.price, 0);
const FOURTHSPACE_COST = 39;
const PRICING = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for individuals and small teams getting started.",
    cta: "Get Started Free",
    highlighted: false,
    features: [
      { label: "Up to 3 team members", included: true },
      { label: "Notes (100 notes)", included: true },
      { label: "Projects (2 projects)", included: true },
      { label: "Chat (3 channels)", included: true },
      { label: "Calendar", included: true },
      { label: "Payroll", included: false },
      { label: "Escrow", included: false },
      { label: "Wallet", included: false },
      { label: "Admin & Analytics", included: false },
      { label: "Priority support", included: false }
    ]
  },
  {
    name: "Pro",
    price: "$39",
    description: "All 7 categories, unlimited usage, powerful automation.",
    cta: "Start Pro Trial",
    highlighted: true,
    features: [
      { label: "Unlimited team members", included: true },
      { label: "Notes (unlimited)", included: true },
      { label: "Projects (unlimited)", included: true },
      { label: "Chat (unlimited channels)", included: true },
      { label: "Calendar", included: true },
      { label: "Payroll", included: true },
      { label: "Escrow", included: true },
      { label: "Wallet", included: true },
      { label: "Admin & Analytics", included: true },
      { label: "Priority support", included: false }
    ]
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Dedicated infrastructure, SLAs, and white-glove onboarding.",
    cta: "Contact Sales",
    highlighted: false,
    features: [
      { label: "Unlimited team members", included: true },
      { label: "Notes (unlimited)", included: true },
      { label: "Projects (unlimited)", included: true },
      { label: "Chat (unlimited channels)", included: true },
      { label: "Calendar", included: true },
      { label: "Payroll", included: true },
      { label: "Escrow", included: true },
      { label: "Wallet", included: true },
      { label: "Admin & Analytics", included: true },
      { label: "Priority support", included: true }
    ]
  }
];
const TESTIMONIALS = [
  {
    name: "Amara Osei",
    role: "Founder & CEO",
    company: "NovaBuild Ltd",
    quote: "We replaced Notion, Jira, Slack, and three other tools with Fourthspace. Our team is more focused than ever, and we're saving over $800 a month. The cross-linking between notes and tasks alone is worth the switch.",
    rating: 5,
    initials: "AO",
    avatarColor: "bg-indigo-500"
  },
  {
    name: "Priya Krishnamurthy",
    role: "Head of Operations",
    company: "ClearPath Finance",
    quote: "The Escrow and Payroll modules are genuinely enterprise-grade. We process contractor payments and hold funds in escrow all from one dashboard. Audit trails are excellent. I can't imagine going back.",
    rating: 5,
    initials: "PK",
    avatarColor: "bg-teal-500"
  },
  {
    name: "Marcus Webb",
    role: "Senior Engineer",
    company: "Orbits Studio",
    quote: "I was skeptical that one tool could do everything well — most try and fail. Fourthspace actually pulled it off. The Wallet for ICP payments plus project management in one place is a game changer for our distributed team.",
    rating: 5,
    initials: "MW",
    avatarColor: "bg-rose-500"
  }
];
function useIntersection(threshold = 0.12) {
  const ref = reactExports.useRef(null);
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}
function Nav({ onLogin }) {
  const [scrolled, setScrolled] = reactExports.useState(false);
  const [menuOpen, setMenuOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Savings", href: "#savings" },
    { label: "Pricing", href: "#pricing" },
    { label: "Testimonials", href: "#testimonials" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "nav",
    {
      className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-card/95 backdrop-blur border-b border-border shadow-sm" : "bg-transparent"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between h-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-primary-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-xl text-foreground", children: "Fourthspace" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:flex items-center gap-8", children: navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: link.href,
              className: "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200",
              children: link.label
            },
            link.href
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: onLogin, children: "Sign In" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "font-semibold",
                onClick: onLogin,
                "data-ocid": "nav-cta",
                children: [
                  "Get Started",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3.5 h-3.5 ml-1.5" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors",
              onClick: () => setMenuOpen((o) => !o),
              "aria-label": "Toggle menu",
              children: menuOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-5 h-5" })
            }
          )
        ] }) }),
        menuOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden bg-card border-b border-border px-4 pb-4 pt-2", children: [
          navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: link.href,
              onClick: () => setMenuOpen(false),
              className: "block py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
              children: link.label
            },
            link.href
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "w-full",
                onClick: onLogin,
                children: "Sign In"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                className: "w-full",
                onClick: onLogin,
                "data-ocid": "nav-cta-mobile",
                children: "Get Started"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function Hero({ onLogin }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative min-h-screen flex items-center justify-center overflow-hidden pt-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-indigo-50 via-background to-teal-50/40 dark:from-indigo-950/30 dark:via-background dark:to-teal-950/20" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          className: "mb-6 inline-flex gap-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15",
          "data-ocid": "hero-badge",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3" }),
            "All-in-One Workspace"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[1.08] tracking-tight mb-6", children: [
        "Your Work,",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-500 to-teal-500", children: "One Space" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10", children: "Fourthspace unifies Notes, Projects, Chat, Calendar, Payroll, Escrow, and Wallet in a single beautifully crafted platform — saving your team time, money, and the chaos of juggling seven tools." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4 mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "lg",
            className: "font-semibold text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300",
            onClick: onLogin,
            "data-ocid": "hero-cta-primary",
            children: [
              "Get Started Free",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#features", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "lg",
            className: "font-semibold text-base px-8 py-6",
            "data-ocid": "hero-cta-secondary",
            children: [
              "Explore Features",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 ml-2" })
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground", children: [
        "No credit card required",
        "14-day Pro trial",
        "Cancel anytime"
      ].map((txt) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-emerald-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: txt })
      ] }, txt)) })
    ] })
  ] });
}
function FeatureCard({
  category,
  index
}) {
  const [hovered, setHovered] = reactExports.useState(false);
  const Icon = category.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative group cursor-default rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30",
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      style: { transitionDelay: `${index * 40}ms` },
      "data-ocid": `feature-card-${category.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-12 h-12 rounded-xl ${category.bg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-6 h-6 ${category.color}` })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-lg text-foreground mb-1", children: category.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3 leading-relaxed", children: category.tagline }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground line-through", children: [
          "Standalone: $",
          category.price,
          "/mo"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `absolute inset-0 rounded-2xl bg-card border border-primary/40 shadow-xl p-6 flex flex-col justify-between transition-all duration-300 ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`,
            style: { zIndex: 10 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-12 h-12 rounded-xl ${category.bg} flex items-center justify-center mb-4`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-6 h-6 ${category.color}` })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-lg text-foreground mb-3", children: category.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: category.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "li",
                  {
                    className: "flex items-center gap-2 text-sm text-foreground",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" }),
                      f
                    ]
                  },
                  f
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-primary", children: "Included in all paid plans →" }) })
            ]
          }
        )
      ]
    }
  );
}
function FeaturesSection() {
  const { ref, visible } = useIntersection();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "features", className: "py-24 bg-muted/30", ref, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "mb-4 bg-primary/10 text-primary border-primary/20", children: "7 Categories" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-4xl sm:text-5xl text-foreground mb-4", children: "Everything your team needs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: "Hover over any category to see what's included. All deeply integrated — link a note to a task, a task to a calendar event, an event to a payment." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5", children: CATEGORIES.map((cat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`,
        style: { transitionDelay: `${i * 80}ms` },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { category: cat, index: i })
      },
      cat.id
    )) })
  ] }) });
}
function SavingsCalculator({ onLogin }) {
  const { ref, visible } = useIntersection();
  const [teamSize, setTeamSize] = reactExports.useState(5);
  const toolsTotal = TOTAL_TOOLS_COST * teamSize;
  const monthlySavings = toolsTotal - FOURTHSPACE_COST;
  const yearlySavings = monthlySavings * 12;
  const savingsPct = Math.round(monthlySavings / toolsTotal * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "savings", className: "py-24 bg-background", ref, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "mb-4 bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800", children: "Cost Savings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-4xl sm:text-5xl text-foreground mb-4", children: "How much could you save?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: "See what 7 separate tools cost compared to Fourthspace. Adjust your team size below." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `grid lg:grid-cols-2 gap-10 items-start transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-lg text-foreground mb-5", children: "Cost of 7 Separate Tools" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 mb-6", children: CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-between",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `w-7 h-7 rounded-lg ${cat.bg} flex items-center justify-center`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-3.5 h-3.5 ${cat.color}` })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: cat.name })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                      "$",
                      (cat.price * teamSize).toLocaleString(),
                      "/mo"
                    ] })
                  ]
                },
                cat.id
              );
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Total (7 tools)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-lg text-foreground", children: [
                "$",
                toolsTotal.toLocaleString(),
                "/mo"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  htmlFor: "team-size-slider",
                  className: "block font-display font-semibold text-foreground mb-4",
                  children: [
                    "Team Size:",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary", children: [
                      teamSize,
                      " ",
                      teamSize === 1 ? "person" : "people"
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "range",
                  min: 1,
                  max: 50,
                  value: teamSize,
                  onChange: (e) => setTeamSize(Number(e.target.value)),
                  id: "team-size-slider",
                  className: "w-full h-2 rounded-full appearance-none cursor-pointer accent-primary",
                  "data-ocid": "savings-slider"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "25" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "50" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-primary to-violet-600 rounded-2xl p-6 text-primary-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium opacity-80 mb-2", children: "Monthly with Fourthspace" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display font-bold text-4xl mb-1", children: [
                "$",
                FOURTHSPACE_COST,
                "/mo"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm opacity-80 mb-6", children: "Flat rate, all features included" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/15 rounded-xl p-4 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Monthly savings" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-xl", children: [
                    "$",
                    monthlySavings.toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Annual savings" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-xl", children: [
                    "$",
                    yearlySavings.toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-t border-white/20 pt-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "You save" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-2xl", children: [
                    savingsPct,
                    "%"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "lg",
                variant: "outline",
                className: "w-full font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300",
                onClick: onLogin,
                "data-ocid": "savings-cta",
                children: [
                  "Start Saving Today",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
                ]
              }
            )
          ] })
        ]
      }
    )
  ] }) });
}
function PricingSection({ onLogin }) {
  const { ref, visible } = useIntersection();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "pricing", className: "py-24 bg-muted/30", ref, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "mb-4 bg-primary/10 text-primary border-primary/20", children: "Pricing" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-4xl sm:text-5xl text-foreground mb-4", children: "Simple, transparent pricing" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-muted-foreground max-w-xl mx-auto", children: "One flat rate replaces seven subscriptions. No hidden fees, no per-seat gouging." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-6 items-start", children: PRICING.map((tier, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `relative rounded-2xl border p-7 flex flex-col transition-all duration-700 ${tier.highlighted ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20 md:-mt-4 md:mb-4" : "bg-card border-border hover:shadow-md"} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`,
        style: { transitionDelay: `${i * 120}ms` },
        "data-ocid": `pricing-tier-${tier.name.toLowerCase()}`,
        children: [
          tier.highlighted && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3.5 left-1/2 -translate-x-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-secondary text-secondary-foreground border-0 font-semibold px-3", children: "Most Popular" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h3",
              {
                className: `font-display font-bold text-xl mb-1 ${tier.highlighted ? "text-primary-foreground" : "text-foreground"}`,
                children: tier.name
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `font-display font-bold text-4xl ${tier.highlighted ? "text-primary-foreground" : "text-foreground"}`,
                  children: tier.price
                }
              ),
              tier.price !== "Custom" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: tier.highlighted ? "text-primary-foreground/70" : "text-muted-foreground",
                  children: "/month"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-sm ${tier.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`,
                children: tier.description
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3 mb-8 flex-1", children: tier.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${f.included ? tier.highlighted ? "bg-primary-foreground/20" : "bg-primary/10" : tier.highlighted ? "bg-primary-foreground/10" : "bg-muted"}`,
                children: f.included ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Check,
                  {
                    className: `w-2.5 h-2.5 ${tier.highlighted ? "text-primary-foreground" : "text-primary"}`
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  X,
                  {
                    className: `w-2.5 h-2.5 ${tier.highlighted ? "text-primary-foreground/40" : "text-muted-foreground"}`
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-sm ${f.included ? tier.highlighted ? "text-primary-foreground" : "text-foreground" : tier.highlighted ? "text-primary-foreground/50" : "text-muted-foreground"}`,
                children: f.label
              }
            )
          ] }, f.label)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: `w-full font-semibold ${tier.highlighted ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" : ""}`,
              variant: tier.highlighted ? "secondary" : "outline",
              onClick: onLogin,
              "data-ocid": `pricing-cta-${tier.name.toLowerCase()}`,
              children: [
                tier.cta,
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3.5 h-3.5 ml-1.5" })
              ]
            }
          )
        ]
      },
      tier.name
    )) })
  ] }) });
}
function TestimonialsSection() {
  const { ref, visible } = useIntersection();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "testimonials", className: "py-24 bg-background", ref, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "mb-4 bg-primary/10 text-primary border-primary/20", children: "Testimonials" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-4xl sm:text-5xl text-foreground mb-4", children: "Loved by teams worldwide" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-muted-foreground max-w-xl mx-auto", children: "Real teams replaced multiple tools and never looked back." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-6", children: TESTIMONIALS.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `bg-card border border-border rounded-2xl p-7 flex flex-col transition-all duration-700 hover:shadow-lg hover:-translate-y-1 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`,
        style: { transitionDelay: `${i * 120}ms` },
        "data-ocid": `testimonial-${i}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5 mb-5", children: Array.from({ length: t.rating }).map((_, si) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Star,
            {
              className: "w-4 h-4 fill-amber-400 text-amber-400"
            },
            `star-${t.name}-${si}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "text-sm text-muted-foreground leading-relaxed flex-1 mb-6", children: [
            '"',
            t.quote,
            '"'
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-10 h-10 rounded-full ${t.avatarColor} flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0`,
                children: t.initials
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold text-sm text-foreground truncate", children: t.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground truncate", children: [
                t.role,
                " · ",
                t.company
              ] })
            ] })
          ] })
        ]
      },
      t.name
    )) })
  ] }) });
}
function CTABanner({ onLogin }) {
  const { ref, visible } = useIntersection();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 bg-muted/30", ref, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-gradient-to-br from-primary via-violet-600 to-teal-500 rounded-3xl p-12 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 opacity-10 pointer-events-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-8 w-40 h-40 rounded-full bg-white blur-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 right-8 w-32 h-32 rounded-full bg-white blur-2xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-3xl sm:text-4xl text-white mb-4", children: "Ready to unify your workspace?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-lg mb-8 max-w-xl mx-auto", children: "Join thousands of teams who replaced seven tools with one. Start free — no credit card required." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "lg",
                className: "bg-white text-primary font-bold hover:bg-white/90 shadow-lg px-8 py-6",
                onClick: onLogin,
                "data-ocid": "banner-cta-primary",
                children: [
                  "Get Started Free",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#pricing", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "lg",
                variant: "outline",
                className: "border-white/40 text-white hover:bg-white/10 px-8 py-6",
                "data-ocid": "banner-cta-secondary",
                children: "View Pricing"
              }
            ) })
          ] })
        ] })
      ] })
    }
  ) }) });
}
function Footer() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const footerLinks = {
    Product: ["Features", "Pricing", "Changelog", "Roadmap"],
    Company: ["About", "Blog", "Careers", "Press"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"],
    Support: ["Documentation", "Help Center", "Status", "Contact"]
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-card border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-8 mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 md:col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-primary-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-lg text-foreground", children: "Fourthspace" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed max-w-xs", children: "Your all-in-one workspace for teams that move fast and stay organized." })
      ] }),
      Object.entries(footerLinks).map(([section, links]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-semibold text-sm text-foreground mb-4", children: section }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5", children: links.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "/#",
            className: "text-sm text-muted-foreground hover:text-foreground transition-colors duration-200",
            children: link
          }
        ) }, link)) })
      ] }, section))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "© ",
        year,
        " Fourthspace. All rights reserved."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Built with love using",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-primary hover:underline font-medium",
            children: "caffeine.ai"
          }
        )
      ] })
    ] })
  ] }) });
}
function LandingPage() {
  const { login, isAuthenticated } = useAuth();
  const handleCTA = () => {
    if (isAuthenticated) {
      window.location.href = "/app";
    } else {
      login();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, { onLogin: handleCTA }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, { onLogin: handleCTA }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FeaturesSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SavingsCalculator, { onLogin: handleCTA }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PricingSection, { onLogin: handleCTA }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TestimonialsSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CTABanner, { onLogin: handleCTA }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  LandingPage as default
};
