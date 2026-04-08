import { u as useAuth, j as jsxRuntimeExports, r as reactExports, B as Button, X, M as Menu, C as Check, F as FileText, a as FolderKanban, b as MessageSquare, c as CalendarDays, D as DollarSign, W as Wallet } from "./index-CzyNqtbv.js";
import { Z as Zap } from "./zap-BMn2iNid.js";
import { A as ArrowRight } from "./arrow-right-D3_42nyU.js";
import { C as ChevronRight } from "./chevron-right-DXQKKc3K.js";
import { S as ShieldCheck } from "./shield-check-CNwi0Zhb.js";
import { S as Star } from "./star-B2aBRVXL.js";
const CATEGORIES = [
  {
    id: "notes",
    name: "Notes",
    icon: FileText,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
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
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
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
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
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
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
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
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
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
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
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
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
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
    description: "Perfect for individuals and small teams.",
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
      { label: "Admin & Analytics", included: false }
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
      { label: "Admin & Analytics", included: true }
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
      { label: "Priority support + SLA", included: true }
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
    avatarBg: "bg-indigo-500"
  },
  {
    name: "Priya Krishnamurthy",
    role: "Head of Operations",
    company: "ClearPath Finance",
    quote: "The Escrow and Payroll modules are genuinely enterprise-grade. We process contractor payments and hold funds in escrow all from one dashboard. Audit trails are excellent.",
    rating: 5,
    initials: "PK",
    avatarBg: "bg-teal-500"
  },
  {
    name: "Marcus Webb",
    role: "Senior Engineer",
    company: "Orbits Studio",
    quote: "I was skeptical that one tool could do everything well — most try and fail. Fourthspace actually pulled it off. The Wallet for ICP payments plus project management in one place is a game changer.",
    rating: 5,
    initials: "MW",
    avatarBg: "bg-rose-500"
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
    const handler = () => setScrolled(window.scrollY > 24);
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
      className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-card/92 backdrop-blur-subtle border-b border-border/60 shadow-sm" : "bg-transparent"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between h-14", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 text-primary-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-lg text-foreground tracking-tight", children: "Fourthspace" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:flex items-center gap-7", children: navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: link.href,
              className: "text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-150",
              children: link.label
            },
            link.href
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "h-7 text-xs font-medium",
                onClick: onLogin,
                children: "Sign In"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "h-7 text-xs font-semibold gap-1.5 active-press",
                onClick: onLogin,
                "data-ocid": "nav-cta",
                children: [
                  "Get Started ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3 h-3" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors",
              onClick: () => setMenuOpen((o) => !o),
              "aria-label": "Toggle menu",
              children: menuOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-4 h-4" })
            }
          )
        ] }) }),
        menuOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden bg-card border-b border-border px-4 pb-4 pt-1", children: [
          navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: link.href,
              onClick: () => setMenuOpen(false),
              className: "block py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors",
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
                className: "w-full text-xs h-8",
                onClick: onLogin,
                children: "Sign In"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                className: "w-full text-xs h-8 font-semibold",
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative min-h-screen flex items-center justify-center overflow-hidden pt-14", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(var(--primary)/0.12),transparent)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-primary/6 blur-3xl pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-1/4 -right-40 w-[400px] h-[400px] rounded-full bg-accent/6 blur-3xl pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 opacity-[0.03]",
        style: {
          backgroundImage: "radial-gradient(circle, oklch(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 mb-8",
          "data-ocid": "hero-badge",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-2.5 h-2.5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-primary tracking-tight", children: "All-in-One Workspace" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[1.06] tracking-[-0.03em] mb-6", children: [
        "Your Work,",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-500 to-teal-400", children: "One Space" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/40 via-violet-500/40 to-teal-400/40 blur-sm" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10", children: "Fourthspace unifies Notes, Projects, Chat, Calendar, Payroll, Escrow, and Wallet in a single beautifully crafted platform — saving your team time, money, and the chaos of juggling seven tools." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-3 mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "lg",
            className: "font-bold text-sm px-8 h-11 shadow-lg hover:shadow-xl transition-all duration-300 active-press gap-2",
            onClick: onLogin,
            "data-ocid": "hero-cta-primary",
            children: [
              "Get Started Free ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#features", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "lg",
            className: "font-semibold text-sm px-7 h-11 border-border/60 hover:border-border transition-smooth",
            "data-ocid": "hero-cta-secondary",
            children: [
              "Explore Features ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 ml-1" })
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground", children: [
        "No credit card required",
        "14-day Pro trial",
        "Cancel anytime"
      ].map((txt) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-2.5 h-2.5 text-emerald-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: txt })
      ] }, txt)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-16 flex flex-wrap items-center justify-center gap-2", children: CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex items-center gap-1.5 rounded-full border px-3 py-1 ${cat.bg} ${cat.border}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-3 h-3 ${cat.color}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-semibold ${cat.color}`, children: cat.name })
            ]
          },
          cat.id
        );
      }) })
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
      className: "relative cursor-default rounded-xl border border-border bg-card p-5 transition-all duration-250 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-primary/20",
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      style: { transitionDelay: `${index * 30}ms` },
      "data-ocid": `feature-card-${category.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-10 h-10 rounded-lg ${category.bg} border ${category.border} flex items-center justify-center mb-3 transition-transform duration-200 ${hovered ? "scale-105" : ""}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-5 h-5 ${category.color}` })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground mb-1 tracking-tight", children: category.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2 leading-relaxed", children: category.tagline }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground/60 line-through", children: [
          "Standalone: $",
          category.price,
          "/mo"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `absolute inset-0 rounded-xl border border-primary/30 bg-card/98 backdrop-blur-sm shadow-card-hover p-5 flex flex-col justify-between transition-all duration-200 ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-98 pointer-events-none"}`,
            style: { zIndex: 10 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-10 h-10 rounded-lg ${category.bg} border ${category.border} flex items-center justify-center mb-3`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-5 h-5 ${category.color}` })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground mb-2 tracking-tight", children: category.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: category.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "li",
                  {
                    className: "flex items-center gap-2 text-xs text-foreground",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-1 rounded-full bg-primary flex-shrink-0" }),
                      f
                    ]
                  },
                  f
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 pt-3 border-t border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-primary", children: "Included in all paid plans →" }) })
            ]
          }
        )
      ]
    }
  );
}
function FeaturesSection() {
  const { ref, visible } = useIntersection();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "features", className: "py-20 bg-muted/20", ref, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `text-center mb-12 transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-primary", children: "7 Categories" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-4xl sm:text-5xl text-foreground mb-3 tracking-[-0.02em]", children: "Everything your team needs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed", children: "Hover any category to see what's included. All deeply integrated — link a note to a task, a task to a calendar event, an event to a payment." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: CATEGORIES.map((cat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`,
        style: { transitionDelay: `${i * 60}ms` },
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "savings", className: "py-20 bg-background", ref, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `text-center mb-12 transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/8 px-3 py-1 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-emerald-600 dark:text-emerald-400", children: "Cost Savings" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-4xl sm:text-5xl text-foreground mb-3 tracking-[-0.02em]", children: "How much could you save?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xl mx-auto", children: "See what 7 separate tools cost compared to Fourthspace. Adjust your team size." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `grid lg:grid-cols-2 gap-8 items-start transition-all duration-600 delay-150 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground mb-4 tracking-tight", children: "Cost of 7 Separate Tools" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5 mb-5", children: CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-between",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `w-6 h-6 rounded ${cat.bg} border ${cat.border} flex items-center justify-center`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-3 h-3 ${cat.color}` })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: cat.name })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      "$",
                      (cat.price * teamSize).toLocaleString(),
                      "/mo"
                    ] })
                  ]
                },
                cat.id
              );
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/60 pt-3 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: "Total (7 tools)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-base text-foreground", children: [
                "$",
                toolsTotal.toLocaleString(),
                "/mo"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  htmlFor: "team-size-slider",
                  className: "block font-display font-semibold text-sm text-foreground mb-3 tracking-tight",
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
                  className: "w-full h-1.5 rounded-full appearance-none cursor-pointer accent-primary",
                  "data-ocid": "savings-slider"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] text-muted-foreground mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "25" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "50" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-primary to-violet-600 rounded-xl p-5 text-primary-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium opacity-80 mb-1", children: "Monthly with Fourthspace" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display font-bold text-3xl mb-0.5 tracking-tight", children: [
                "$",
                FOURTHSPACE_COST,
                "/mo"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs opacity-70 mb-4", children: "Flat rate, all features included" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/15 rounded-lg p-3.5 space-y-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: "Monthly savings" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-lg tracking-tight", children: [
                    "$",
                    monthlySavings.toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: "Annual savings" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-lg tracking-tight", children: [
                    "$",
                    yearlySavings.toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-t border-white/20 pt-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: "You save" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-2xl tracking-tight", children: [
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
                className: "w-full font-semibold text-sm h-10 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-250 active-press",
                onClick: onLogin,
                "data-ocid": "savings-cta",
                children: [
                  "Start Saving Today ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 ml-1.5" })
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "pricing", className: "py-20 bg-muted/20", ref, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `text-center mb-12 transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-primary", children: "Pricing" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-4xl sm:text-5xl text-foreground mb-3 tracking-[-0.02em]", children: "Simple, transparent pricing" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-lg mx-auto", children: "One flat rate replaces seven subscriptions. No hidden fees, no per-seat gouging." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-5 items-start", children: PRICING.map((tier, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `relative rounded-xl border p-6 flex flex-col transition-all duration-600 ${tier.highlighted ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20 md:-mt-4 md:mb-4" : "bg-card border-border hover:shadow-card-hover hover:-translate-y-0.5"} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`,
        style: { transitionDelay: `${i * 100}ms` },
        "data-ocid": `pricing-tier-${tier.name.toLowerCase()}`,
        children: [
          tier.highlighted && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-secondary-foreground", children: "Most Popular" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h3",
              {
                className: `font-display font-bold text-lg mb-0.5 tracking-tight ${tier.highlighted ? "text-primary-foreground" : "text-foreground"}`,
                children: tier.name
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1 mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `font-display font-bold text-3xl tracking-tight ${tier.highlighted ? "text-primary-foreground" : "text-foreground"}`,
                  children: tier.price
                }
              ),
              tier.price !== "Custom" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-xs ${tier.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`,
                  children: "/month"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-xs leading-relaxed ${tier.highlighted ? "text-primary-foreground/75" : "text-muted-foreground"}`,
                children: tier.description
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5 mb-6 flex-1", children: tier.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${f.included ? tier.highlighted ? "bg-primary-foreground/20" : "bg-primary/12" : tier.highlighted ? "bg-primary-foreground/8" : "bg-muted"}`,
                children: f.included ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Check,
                  {
                    className: `w-2 h-2 ${tier.highlighted ? "text-primary-foreground" : "text-primary"}`
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  X,
                  {
                    className: `w-2 h-2 ${tier.highlighted ? "text-primary-foreground/30" : "text-muted-foreground/50"}`
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-xs leading-relaxed ${f.included ? tier.highlighted ? "text-primary-foreground" : "text-foreground" : tier.highlighted ? "text-primary-foreground/45" : "text-muted-foreground"}`,
                children: f.label
              }
            )
          ] }, f.label)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: `w-full h-8 text-xs font-bold active-press gap-1.5 ${tier.highlighted ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" : ""}`,
              variant: tier.highlighted ? "secondary" : "outline",
              onClick: onLogin,
              "data-ocid": `pricing-cta-${tier.name.toLowerCase()}`,
              children: [
                tier.cta,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3 h-3" })
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "testimonials", className: "py-20 bg-background", ref, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `text-center mb-12 transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-primary", children: "Testimonials" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-4xl sm:text-5xl text-foreground mb-3 tracking-[-0.02em]", children: "Loved by teams worldwide" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-md mx-auto", children: "Real teams replaced multiple tools and never looked back." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-5", children: TESTIMONIALS.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `bg-card border border-border rounded-xl p-6 flex flex-col transition-all duration-600 hover:shadow-card-hover hover:-translate-y-0.5 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`,
        style: { transitionDelay: `${i * 100}ms` },
        "data-ocid": `testimonial-${i}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5 mb-4", children: Array.from({ length: t.rating }).map((_, si) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Star,
            {
              className: "w-3.5 h-3.5 fill-amber-400 text-amber-400"
            },
            `${t.name}-star-${si}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "text-xs text-muted-foreground leading-relaxed flex-1 mb-5", children: [
            '"',
            t.quote,
            '"'
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-8 h-8 rounded-full ${t.avatarBg} flex items-center justify-center text-white font-display font-bold text-xs flex-shrink-0`,
                children: t.initials
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold text-xs text-foreground truncate tracking-tight", children: t.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground truncate", children: [
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 bg-muted/20", ref, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-gradient-to-br from-primary via-violet-600 to-teal-500 rounded-2xl p-12 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-1/3 w-64 h-64 rounded-full bg-white/8 blur-3xl pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-white/8 blur-3xl pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-3xl sm:text-4xl text-white mb-3 tracking-[-0.02em]", children: "Ready to unify your workspace?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/75 text-sm mb-7 max-w-lg mx-auto leading-relaxed", children: "Join thousands of teams who replaced seven tools with one. Start free — no credit card required." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "lg",
                className: "bg-white text-primary font-bold hover:bg-white/92 shadow-lg h-11 px-8 text-sm active-press gap-2",
                onClick: onLogin,
                "data-ocid": "banner-cta-primary",
                children: [
                  "Get Started Free ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#pricing", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "lg",
                variant: "outline",
                className: "border-white/35 text-white hover:bg-white/10 h-11 px-7 text-sm font-semibold",
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
    Legal: ["Privacy Policy", "Terms of Service", "Security"],
    Support: ["Documentation", "Help Center", "Status"]
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-card border-t border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-8 mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 md:col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 text-primary-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-sm text-foreground tracking-tight", children: "Fourthspace" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed max-w-[180px]", children: "Your all-in-one workspace for teams that move fast and stay organized." })
      ] }),
      Object.entries(footerLinks).map(([section, links]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-semibold text-xs text-foreground mb-3 tracking-tight", children: section }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: links.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "/#",
            className: "text-xs text-muted-foreground hover:text-foreground transition-colors duration-150",
            children: link
          }
        ) }, link)) })
      ] }, section))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "© ",
        year,
        " Fourthspace. All rights reserved."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
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
