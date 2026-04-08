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

interface FeatureCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
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
  avatarBg: string;
}

const CATEGORIES: FeatureCategory[] = [
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
      "Full-text search",
    ],
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
      "Deadline alerts",
    ],
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
      "Cross-link to tasks",
    ],
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
      "Reminders",
    ],
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
      "Audit history",
    ],
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
      "Full audit trail",
    ],
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
      { label: "Admin & Analytics", included: false },
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
      { label: "Priority support + SLA", included: true },
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
    avatarBg: "bg-indigo-500",
  },
  {
    name: "Priya Krishnamurthy",
    role: "Head of Operations",
    company: "ClearPath Finance",
    quote:
      "The Escrow and Payroll modules are genuinely enterprise-grade. We process contractor payments and hold funds in escrow all from one dashboard. Audit trails are excellent.",
    rating: 5,
    initials: "PK",
    avatarBg: "bg-teal-500",
  },
  {
    name: "Marcus Webb",
    role: "Senior Engineer",
    company: "Orbits Studio",
    quote:
      "I was skeptical that one tool could do everything well — most try and fail. Fourthspace actually pulled it off. The Wallet for ICP payments plus project management in one place is a game changer.",
    rating: 5,
    initials: "MW",
    avatarBg: "bg-rose-500",
  },
];

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
    const handler = () => setScrolled(window.scrollY > 24);
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
          ? "bg-card/92 backdrop-blur-subtle border-b border-border/60 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Zap className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground tracking-tight">
              Fourthspace
            </span>
          </div>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs font-medium"
              onClick={onLogin}
            >
              Sign In
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs font-semibold gap-1.5 active-press"
              onClick={onLogin}
              data-ocid="nav-cta"
            >
              Get Started <ArrowRight className="w-3 h-3" />
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4 pt-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs h-8"
              onClick={onLogin}
            >
              Sign In
            </Button>
            <Button
              size="sm"
              className="w-full text-xs h-8 font-semibold"
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14">
      {/* Background layers */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(var(--primary)/0.12),transparent)]" />
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-primary/6 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-[400px] h-[400px] rounded-full bg-accent/6 blur-3xl pointer-events-none" />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 mb-8"
          data-ocid="hero-badge"
        >
          <Zap className="w-2.5 h-2.5 text-primary" />
          <span className="text-xs font-semibold text-primary tracking-tight">
            All-in-One Workspace
          </span>
        </div>

        <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[1.06] tracking-[-0.03em] mb-6">
          Your Work,{" "}
          <span className="relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-500 to-teal-400">
              One Space
            </span>
            <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/40 via-violet-500/40 to-teal-400/40 blur-sm" />
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
          Fourthspace unifies Notes, Projects, Chat, Calendar, Payroll, Escrow,
          and Wallet in a single beautifully crafted platform — saving your team
          time, money, and the chaos of juggling seven tools.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <Button
            size="lg"
            className="font-bold text-sm px-8 h-11 shadow-lg hover:shadow-xl transition-all duration-300 active-press gap-2"
            onClick={onLogin}
            data-ocid="hero-cta-primary"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Button>
          <a href="#features">
            <Button
              variant="outline"
              size="lg"
              className="font-semibold text-sm px-7 h-11 border-border/60 hover:border-border transition-smooth"
              data-ocid="hero-cta-secondary"
            >
              Explore Features <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          {[
            "No credit card required",
            "14-day Pro trial",
            "Cancel anytime",
          ].map((txt) => (
            <div key={txt} className="flex items-center gap-1.5">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/15">
                <Check className="w-2.5 h-2.5 text-emerald-500" />
              </div>
              <span>{txt}</span>
            </div>
          ))}
        </div>

        {/* Floating module badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 ${cat.bg} ${cat.border}`}
              >
                <Icon className={`w-3 h-3 ${cat.color}`} />
                <span className={`text-[10px] font-semibold ${cat.color}`}>
                  {cat.name}
                </span>
              </div>
            );
          })}
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
      className="relative cursor-default rounded-xl border border-border bg-card p-5 transition-all duration-250 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-primary/20"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ transitionDelay: `${index * 30}ms` }}
      data-ocid={`feature-card-${category.id}`}
    >
      <div
        className={`w-10 h-10 rounded-lg ${category.bg} border ${category.border} flex items-center justify-center mb-3 transition-transform duration-200 ${hovered ? "scale-105" : ""}`}
      >
        <Icon className={`w-5 h-5 ${category.color}`} />
      </div>
      <h3 className="font-display font-semibold text-sm text-foreground mb-1 tracking-tight">
        {category.name}
      </h3>
      <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
        {category.tagline}
      </p>
      <div className="text-[10px] text-muted-foreground/60 line-through">
        Standalone: ${category.price}/mo
      </div>

      {/* Hover overlay */}
      <div
        className={`absolute inset-0 rounded-xl border border-primary/30 bg-card/98 backdrop-blur-sm shadow-card-hover p-5 flex flex-col justify-between transition-all duration-200 ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-98 pointer-events-none"}`}
        style={{ zIndex: 10 }}
      >
        <div>
          <div
            className={`w-10 h-10 rounded-lg ${category.bg} border ${category.border} flex items-center justify-center mb-3`}
          >
            <Icon className={`w-5 h-5 ${category.color}`} />
          </div>
          <h3 className="font-display font-semibold text-sm text-foreground mb-2 tracking-tight">
            {category.name}
          </h3>
          <ul className="space-y-1.5">
            {category.features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-xs text-foreground"
              >
                <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-3 pt-3 border-t border-border/50">
          <span className="text-xs font-semibold text-primary">
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
    <section id="features" className="py-20 bg-muted/20" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-12 transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 mb-4">
            <span className="text-xs font-semibold text-primary">
              7 Categories
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-3 tracking-[-0.02em]">
            Everything your team needs
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Hover any category to see what's included. All deeply integrated —
            link a note to a task, a task to a calendar event, an event to a
            payment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              className={`transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${i * 60}ms` }}
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
    <section id="savings" className="py-20 bg-background" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-12 transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/8 px-3 py-1 mb-4">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Cost Savings
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-3 tracking-[-0.02em]">
            How much could you save?
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            See what 7 separate tools cost compared to Fourthspace. Adjust your
            team size.
          </p>
        </div>

        <div
          className={`grid lg:grid-cols-2 gap-8 items-start transition-all duration-600 delay-150 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {/* Tool breakdown */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-display font-semibold text-sm text-foreground mb-4 tracking-tight">
              Cost of 7 Separate Tools
            </h3>
            <div className="space-y-2.5 mb-5">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded ${cat.bg} border ${cat.border} flex items-center justify-center`}
                      >
                        <Icon className={`w-3 h-3 ${cat.color}`} />
                      </div>
                      <span className="text-xs font-medium text-foreground">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ${(cat.price * teamSize).toLocaleString()}/mo
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-border/60 pt-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Total (7 tools)
              </span>
              <span className="font-display font-bold text-base text-foreground">
                ${toolsTotal.toLocaleString()}/mo
              </span>
            </div>
          </div>

          {/* Calculator */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <label
                htmlFor="team-size-slider"
                className="block font-display font-semibold text-sm text-foreground mb-3 tracking-tight"
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
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-primary"
                data-ocid="savings-slider"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                <span>1</span>
                <span>25</span>
                <span>50</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary to-violet-600 rounded-xl p-5 text-primary-foreground">
              <div className="text-xs font-medium opacity-80 mb-1">
                Monthly with Fourthspace
              </div>
              <div className="font-display font-bold text-3xl mb-0.5 tracking-tight">
                ${FOURTHSPACE_COST}/mo
              </div>
              <div className="text-xs opacity-70 mb-4">
                Flat rate, all features included
              </div>
              <div className="bg-white/15 rounded-lg p-3.5 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">Monthly savings</span>
                  <span className="font-display font-bold text-lg tracking-tight">
                    ${monthlySavings.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">Annual savings</span>
                  <span className="font-display font-bold text-lg tracking-tight">
                    ${yearlySavings.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-white/20 pt-2.5">
                  <span className="text-xs font-medium">You save</span>
                  <span className="font-display font-bold text-2xl tracking-tight">
                    {savingsPct}%
                  </span>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              variant="outline"
              className="w-full font-semibold text-sm h-10 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-250 active-press"
              onClick={onLogin}
              data-ocid="savings-cta"
            >
              Start Saving Today <ArrowRight className="w-4 h-4 ml-1.5" />
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
    <section id="pricing" className="py-20 bg-muted/20" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-12 transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 mb-4">
            <span className="text-xs font-semibold text-primary">Pricing</span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-3 tracking-[-0.02em]">
            Simple, transparent pricing
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            One flat rate replaces seven subscriptions. No hidden fees, no
            per-seat gouging.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 items-start">
          {PRICING.map((tier, i) => (
            <div
              key={tier.name}
              className={`relative rounded-xl border p-6 flex flex-col transition-all duration-600 ${
                tier.highlighted
                  ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20 md:-mt-4 md:mb-4"
                  : "bg-card border-border hover:shadow-card-hover hover:-translate-y-0.5"
              } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
              data-ocid={`pricing-tier-${tier.name.toLowerCase()}`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-secondary-foreground">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h3
                  className={`font-display font-bold text-lg mb-0.5 tracking-tight ${tier.highlighted ? "text-primary-foreground" : "text-foreground"}`}
                >
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-1.5">
                  <span
                    className={`font-display font-bold text-3xl tracking-tight ${tier.highlighted ? "text-primary-foreground" : "text-foreground"}`}
                  >
                    {tier.price}
                  </span>
                  {tier.price !== "Custom" && (
                    <span
                      className={`text-xs ${tier.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                    >
                      /month
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs leading-relaxed ${tier.highlighted ? "text-primary-foreground/75" : "text-muted-foreground"}`}
                >
                  {tier.description}
                </p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {tier.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-2">
                    <div
                      className={`mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        f.included
                          ? tier.highlighted
                            ? "bg-primary-foreground/20"
                            : "bg-primary/12"
                          : tier.highlighted
                            ? "bg-primary-foreground/8"
                            : "bg-muted"
                      }`}
                    >
                      {f.included ? (
                        <Check
                          className={`w-2 h-2 ${tier.highlighted ? "text-primary-foreground" : "text-primary"}`}
                        />
                      ) : (
                        <X
                          className={`w-2 h-2 ${tier.highlighted ? "text-primary-foreground/30" : "text-muted-foreground/50"}`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-xs leading-relaxed ${
                        f.included
                          ? tier.highlighted
                            ? "text-primary-foreground"
                            : "text-foreground"
                          : tier.highlighted
                            ? "text-primary-foreground/45"
                            : "text-muted-foreground"
                      }`}
                    >
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                size="sm"
                className={`w-full h-8 text-xs font-bold active-press gap-1.5 ${tier.highlighted ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" : ""}`}
                variant={tier.highlighted ? "secondary" : "outline"}
                onClick={onLogin}
                data-ocid={`pricing-cta-${tier.name.toLowerCase()}`}
              >
                {tier.cta} <ArrowRight className="w-3 h-3" />
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
    <section id="testimonials" className="py-20 bg-background" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-12 transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 mb-4">
            <span className="text-xs font-semibold text-primary">
              Testimonials
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-3 tracking-[-0.02em]">
            Loved by teams worldwide
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Real teams replaced multiple tools and never looked back.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`bg-card border border-border rounded-xl p-6 flex flex-col transition-all duration-600 hover:shadow-card-hover hover:-translate-y-0.5 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
              data-ocid={`testimonial-${i}`}
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star
                    key={`${t.name}-star-${si}`}
                    className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <blockquote className="text-xs text-muted-foreground leading-relaxed flex-1 mb-5">
                "{t.quote}"
              </blockquote>
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-full ${t.avatarBg} flex items-center justify-center text-white font-display font-bold text-xs flex-shrink-0`}
                >
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <div className="font-display font-semibold text-xs text-foreground truncate tracking-tight">
                    {t.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
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
    <section className="py-20 bg-muted/20" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="relative bg-gradient-to-br from-primary via-violet-600 to-teal-500 rounded-2xl p-12 overflow-hidden">
            <div className="absolute top-0 left-1/3 w-64 h-64 rounded-full bg-white/8 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-white/8 blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3 tracking-[-0.02em]">
                Ready to unify your workspace?
              </h2>
              <p className="text-white/75 text-sm mb-7 max-w-lg mx-auto leading-relaxed">
                Join thousands of teams who replaced seven tools with one. Start
                free — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-primary font-bold hover:bg-white/92 shadow-lg h-11 px-8 text-sm active-press gap-2"
                  onClick={onLogin}
                  data-ocid="banner-cta-primary"
                >
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Button>
                <a href="#pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/35 text-white hover:bg-white/10 h-11 px-7 text-sm font-semibold"
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
    Legal: ["Privacy Policy", "Terms of Service", "Security"],
    Support: ["Documentation", "Help Center", "Status"],
  };

  return (
    <footer className="bg-card border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                <Zap className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-sm text-foreground tracking-tight">
                Fourthspace
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[180px]">
              Your all-in-one workspace for teams that move fast and stay
              organized.
            </p>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-display font-semibold text-xs text-foreground mb-3 tracking-tight">
                {section}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="/#"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} Fourthspace. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
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
