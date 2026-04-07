import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  DollarSign,
  FileText,
  FolderKanban,
  Menu,
  MessageSquare,
  ShieldCheck,
  Star,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FeatureCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  price: number;
  tagline: string;
  features: string[];
}

interface PricingTier {
  name: string;
  price: string;
  description: string;
  cta: string;
  highlighted: boolean;
  features: { label: string; included: boolean }[];
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  initials: string;
  avatarColor: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES: FeatureCategory[] = [
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
      "Full-text search",
    ],
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
      "Deadline alerts",
    ],
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
      "Cross-link to tasks",
    ],
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
      "Reminders",
    ],
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
      "Audit history",
    ],
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
      "Full audit trail",
    ],
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
      "Secure transfers",
    ],
  },
];

const TOTAL_TOOLS_COST = CATEGORIES.reduce((sum, c) => sum + c.price, 0);
const FOURTHSPACE_COST = 39;

const PRICING: PricingTier[] = [
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
      { label: "Priority support", included: false },
    ],
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
      { label: "Priority support", included: false },
    ],
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
      { label: "Priority support", included: true },
    ],
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Amara Osei",
    role: "Founder & CEO",
    company: "NovaBuild Ltd",
    quote:
      "We replaced Notion, Jira, Slack, and three other tools with Fourthspace. Our team is more focused than ever, and we're saving over $800 a month. The cross-linking between notes and tasks alone is worth the switch.",
    rating: 5,
    initials: "AO",
    avatarColor: "bg-indigo-500",
  },
  {
    name: "Priya Krishnamurthy",
    role: "Head of Operations",
    company: "ClearPath Finance",
    quote:
      "The Escrow and Payroll modules are genuinely enterprise-grade. We process contractor payments and hold funds in escrow all from one dashboard. Audit trails are excellent. I can't imagine going back.",
    rating: 5,
    initials: "PK",
    avatarColor: "bg-teal-500",
  },
  {
    name: "Marcus Webb",
    role: "Senior Engineer",
    company: "Orbits Studio",
    quote:
      "I was skeptical that one tool could do everything well — most try and fail. Fourthspace actually pulled it off. The Wallet for ICP payments plus project management in one place is a game changer for our distributed team.",
    rating: 5,
    initials: "MW",
    avatarColor: "bg-rose-500",
  },
];

// ─── Hook: visibility trigger ─────────────────────────────────────────────────

function useIntersection(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav({ onLogin }: { onLogin: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Savings", href: "#savings" },
    { label: "Pricing", href: "#pricing" },
    { label: "Testimonials", href: "#testimonials" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/95 backdrop-blur border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Fourthspace
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onLogin}>
              Sign In
            </Button>
            <Button
              size="sm"
              className="font-semibold"
              onClick={onLogin}
              data-ocid="nav-cta"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4 pt-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onLogin}
            >
              Sign In
            </Button>
            <Button
              size="sm"
              className="w-full"
              onClick={onLogin}
              data-ocid="nav-cta-mobile"
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ onLogin }: { onLogin: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-background to-teal-50/40 dark:from-indigo-950/30 dark:via-background dark:to-teal-950/20" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge
          className="mb-6 inline-flex gap-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
          data-ocid="hero-badge"
        >
          <Zap className="w-3 h-3" />
          All-in-One Workspace
        </Badge>

        <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[1.08] tracking-tight mb-6">
          Your Work,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-500 to-teal-500">
            One Space
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
          Fourthspace unifies Notes, Projects, Chat, Calendar, Payroll, Escrow,
          and Wallet in a single beautifully crafted platform — saving your team
          time, money, and the chaos of juggling seven tools.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            size="lg"
            className="font-semibold text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={onLogin}
            data-ocid="hero-cta-primary"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <a href="#features">
            <Button
              variant="outline"
              size="lg"
              className="font-semibold text-base px-8 py-6"
              data-ocid="hero-cta-secondary"
            >
              Explore Features
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          {[
            "No credit card required",
            "14-day Pro trial",
            "Cancel anytime",
          ].map((txt) => (
            <div key={txt} className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>{txt}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({
  category,
  index,
}: { category: FeatureCategory; index: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = category.icon;

  return (
    <div
      className="relative group cursor-default rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ transitionDelay: `${index * 40}ms` }}
      data-ocid={`feature-card-${category.id}`}
    >
      <div
        className={`w-12 h-12 rounded-xl ${category.bg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className={`w-6 h-6 ${category.color}`} />
      </div>
      <h3 className="font-display font-semibold text-lg text-foreground mb-1">
        {category.name}
      </h3>
      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
        {category.tagline}
      </p>
      <div className="text-xs text-muted-foreground line-through">
        Standalone: ${category.price}/mo
      </div>

      {/* Hover overlay */}
      <div
        className={`absolute inset-0 rounded-2xl bg-card border border-primary/40 shadow-xl p-6 flex flex-col justify-between transition-all duration-300 ${
          hovered
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{ zIndex: 10 }}
      >
        <div>
          <div
            className={`w-12 h-12 rounded-xl ${category.bg} flex items-center justify-center mb-4`}
          >
            <Icon className={`w-6 h-6 ${category.color}`} />
          </div>
          <h3 className="font-display font-semibold text-lg text-foreground mb-3">
            {category.name}
          </h3>
          <ul className="space-y-2">
            {category.features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <span className="text-sm font-semibold text-primary">
            Included in all paid plans →
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────

function FeaturesSection() {
  const { ref, visible } = useIntersection();
  return (
    <section id="features" className="py-24 bg-muted/30" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            7 Categories
          </Badge>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4">
            Everything your team needs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hover over any category to see what's included. All deeply
            integrated — link a note to a task, a task to a calendar event, an
            event to a payment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <FeatureCard category={cat} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Savings Calculator ───────────────────────────────────────────────────────

function SavingsCalculator({ onLogin }: { onLogin: () => void }) {
  const { ref, visible } = useIntersection();
  const [teamSize, setTeamSize] = useState(5);

  const toolsTotal = TOTAL_TOOLS_COST * teamSize;
  const monthlySavings = toolsTotal - FOURTHSPACE_COST;
  const yearlySavings = monthlySavings * 12;
  const savingsPct = Math.round((monthlySavings / toolsTotal) * 100);

  return (
    <section id="savings" className="py-24 bg-background" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
            Cost Savings
          </Badge>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4">
            How much could you save?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what 7 separate tools cost compared to Fourthspace. Adjust your
            team size below.
          </p>
        </div>

        <div
          className={`grid lg:grid-cols-2 gap-10 items-start transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Tool breakdown */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-display font-semibold text-lg text-foreground mb-5">
              Cost of 7 Separate Tools
            </h3>
            <div className="space-y-3 mb-6">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg ${cat.bg} flex items-center justify-center`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${cat.color}`} />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ${(cat.price * teamSize).toLocaleString()}/mo
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-border pt-4 flex items-center justify-between">
              <span className="font-semibold text-foreground">
                Total (7 tools)
              </span>
              <span className="font-bold text-lg text-foreground">
                ${toolsTotal.toLocaleString()}/mo
              </span>
            </div>
          </div>

          {/* Calculator */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <label
                htmlFor="team-size-slider"
                className="block font-display font-semibold text-foreground mb-4"
              >
                Team Size:{" "}
                <span className="text-primary">
                  {teamSize} {teamSize === 1 ? "person" : "people"}
                </span>
              </label>
              <input
                type="range"
                min={1}
                max={50}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                id="team-size-slider"
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary"
                data-ocid="savings-slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>1</span>
                <span>25</span>
                <span>50</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary to-violet-600 rounded-2xl p-6 text-primary-foreground">
              <div className="text-sm font-medium opacity-80 mb-2">
                Monthly with Fourthspace
              </div>
              <div className="font-display font-bold text-4xl mb-1">
                ${FOURTHSPACE_COST}/mo
              </div>
              <div className="text-sm opacity-80 mb-6">
                Flat rate, all features included
              </div>
              <div className="bg-white/15 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Monthly savings</span>
                  <span className="font-bold text-xl">
                    ${monthlySavings.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Annual savings</span>
                  <span className="font-bold text-xl">
                    ${yearlySavings.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-white/20 pt-3">
                  <span className="text-sm font-medium">You save</span>
                  <span className="font-display font-bold text-2xl">
                    {savingsPct}%
                  </span>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              variant="outline"
              className="w-full font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              onClick={onLogin}
              data-ocid="savings-cta"
            >
              Start Saving Today
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

function PricingSection({ onLogin }: { onLogin: () => void }) {
  const { ref, visible } = useIntersection();

  return (
    <section id="pricing" className="py-24 bg-muted/30" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Pricing
          </Badge>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            One flat rate replaces seven subscriptions. No hidden fees, no
            per-seat gouging.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PRICING.map((tier, i) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-7 flex flex-col transition-all duration-700 ${
                tier.highlighted
                  ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20 md:-mt-4 md:mb-4"
                  : "bg-card border-border hover:shadow-md"
              } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ transitionDelay: `${i * 120}ms` }}
              data-ocid={`pricing-tier-${tier.name.toLowerCase()}`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-secondary text-secondary-foreground border-0 font-semibold px-3">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`font-display font-bold text-xl mb-1 ${tier.highlighted ? "text-primary-foreground" : "text-foreground"}`}
                >
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span
                    className={`font-display font-bold text-4xl ${tier.highlighted ? "text-primary-foreground" : "text-foreground"}`}
                  >
                    {tier.price}
                  </span>
                  {tier.price !== "Custom" && (
                    <span
                      className={
                        tier.highlighted
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }
                    >
                      /month
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm ${tier.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                >
                  {tier.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-2.5">
                    <div
                      className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                        f.included
                          ? tier.highlighted
                            ? "bg-primary-foreground/20"
                            : "bg-primary/10"
                          : tier.highlighted
                            ? "bg-primary-foreground/10"
                            : "bg-muted"
                      }`}
                    >
                      {f.included ? (
                        <Check
                          className={`w-2.5 h-2.5 ${tier.highlighted ? "text-primary-foreground" : "text-primary"}`}
                        />
                      ) : (
                        <X
                          className={`w-2.5 h-2.5 ${tier.highlighted ? "text-primary-foreground/40" : "text-muted-foreground"}`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        f.included
                          ? tier.highlighted
                            ? "text-primary-foreground"
                            : "text-foreground"
                          : tier.highlighted
                            ? "text-primary-foreground/50"
                            : "text-muted-foreground"
                      }`}
                    >
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full font-semibold ${tier.highlighted ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" : ""}`}
                variant={tier.highlighted ? "secondary" : "outline"}
                onClick={onLogin}
                data-ocid={`pricing-cta-${tier.name.toLowerCase()}`}
              >
                {tier.cta}
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function TestimonialsSection() {
  const { ref, visible } = useIntersection();

  return (
    <section id="testimonials" className="py-24 bg-background" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Testimonials
          </Badge>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4">
            Loved by teams worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Real teams replaced multiple tools and never looked back.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`bg-card border border-border rounded-2xl p-7 flex flex-col transition-all duration-700 hover:shadow-lg hover:-translate-y-1 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
              data-ocid={`testimonial-${i}`}
            >
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star
                    key={`star-${t.name}-${si}`}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <blockquote className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                "{t.quote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.avatarColor} flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0`}
                >
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <div className="font-display font-semibold text-sm text-foreground truncate">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {t.role} · {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CTABanner({ onLogin }: { onLogin: () => void }) {
  const { ref, visible } = useIntersection();

  return (
    <section className="py-20 bg-muted/30" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="relative bg-gradient-to-br from-primary via-violet-600 to-teal-500 rounded-3xl p-12 overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-4 left-8 w-40 h-40 rounded-full bg-white blur-2xl" />
              <div className="absolute bottom-4 right-8 w-32 h-32 rounded-full bg-white blur-2xl" />
            </div>
            <div className="relative">
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
                Ready to unify your workspace?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of teams who replaced seven tools with one. Start
                free — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-primary font-bold hover:bg-white/90 shadow-lg px-8 py-6"
                  onClick={onLogin}
                  data-ocid="banner-cta-primary"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <a href="#pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 text-white hover:bg-white/10 px-8 py-6"
                    data-ocid="banner-cta-secondary"
                  >
                    View Pricing
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  const footerLinks: Record<string, string[]> = {
    Product: ["Features", "Pricing", "Changelog", "Roadmap"],
    Company: ["About", "Blog", "Careers", "Press"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"],
    Support: ["Documentation", "Help Center", "Status", "Contact"],
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                Fourthspace
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Your all-in-one workspace for teams that move fast and stay
              organized.
            </p>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-display font-semibold text-sm text-foreground mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="/#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {year} Fourthspace. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { login, isAuthenticated } = useAuth();

  const handleCTA = () => {
    if (isAuthenticated) {
      window.location.href = "/app";
    } else {
      login();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav onLogin={handleCTA} />
      <Hero onLogin={handleCTA} />
      <FeaturesSection />
      <SavingsCalculator onLogin={handleCTA} />
      <PricingSection onLogin={handleCTA} />
      <TestimonialsSection />
      <CTABanner onLogin={handleCTA} />
      <Footer />
    </div>
  );
}
