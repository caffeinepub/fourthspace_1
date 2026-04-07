import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock,
  DollarSign,
  FileText,
  FolderKanban,
  Plus,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useBackend } from "../hooks/useBackend";
import { useWorkspace } from "../hooks/useWorkspace";
import { getTenantId } from "../hooks/useWorkspace";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

interface QuickAction {
  label: string;
  href: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

interface ActivityEntry {
  id: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  title: string;
  time: string;
  category: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "New Note",
    href: "/app/notes/new",
    icon: FileText,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10 hover:bg-indigo-500/20",
  },
  {
    label: "New Project",
    href: "/app/projects/new",
    icon: FolderKanban,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/10 hover:bg-orange-500/20",
  },
  {
    label: "New Event",
    href: "/app/calendar/new",
    icon: CalendarDays,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10 hover:bg-red-500/20",
  },
  {
    label: "Send Payment",
    href: "/app/wallet/send",
    icon: Wallet,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-500/10 hover:bg-pink-500/20",
  },
];

const MOCK_STATS: StatCard[] = [
  {
    label: "Total Notes",
    value: "24",
    trend: "+3 this week",
    trendUp: true,
    icon: FileText,
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
  },
  {
    label: "Active Projects",
    value: "7",
    trend: "+1 this month",
    trendUp: true,
    icon: FolderKanban,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
  },
  {
    label: "Pending Tasks",
    value: "18",
    trend: "5 due today",
    trendUp: false,
    icon: TrendingUp,
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-500",
  },
  {
    label: "Upcoming Events",
    value: "6",
    trend: "Next: 2pm today",
    trendUp: true,
    icon: CalendarDays,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
  },
  {
    label: "Active Employees",
    value: "12",
    trend: "All active",
    trendUp: true,
    icon: DollarSign,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
  },
  {
    label: "Active Escrows",
    value: "3",
    trend: "1 awaiting release",
    trendUp: true,
    icon: Shield,
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-500",
  },
  {
    label: "Wallet Balance",
    value: "142.50 ICP",
    trend: "+2.4 ICP today",
    trendUp: true,
    icon: Wallet,
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-500",
  },
];

const MOCK_ACTIVITY: ActivityEntry[] = [
  {
    id: "1",
    icon: FolderKanban,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    title: "Q3 Roadmap project updated",
    time: "2 hours ago",
    category: "Projects",
  },
  {
    id: "2",
    icon: FileText,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    title: "Product spec draft created",
    time: "4 hours ago",
    category: "Notes",
  },
  {
    id: "3",
    icon: Shield,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    title: "Contract funded: Dev Sprint",
    time: "Yesterday",
    category: "Escrow",
  },
  {
    id: "4",
    icon: DollarSign,
    color: "text-green-500",
    bg: "bg-green-500/10",
    title: "Payroll processed for April",
    time: "2 days ago",
    category: "Payroll",
  },
  {
    id: "5",
    icon: Wallet,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    title: "Received 10 ICP to main wallet",
    time: "3 days ago",
    category: "Wallet",
  },
];

const MOCK_NOTES = [
  {
    id: "1",
    title: "Q3 Planning Notes",
    preview:
      "Key objectives for Q3 include expanding the partner network and launching the mobile app beta...",
  },
  {
    id: "2",
    title: "Team Retrospective",
    preview:
      "What went well: shipping on time, cross-team collaboration. Areas to improve: documentation...",
  },
  {
    id: "3",
    title: "API Design Decisions",
    preview:
      "RESTful design with optional GraphQL layer for complex queries. Authentication via JWT...",
  },
];

const MOCK_PROJECTS = [
  { id: "1", name: "Mobile App Beta", progress: 78, status: "Active" },
  { id: "2", name: "Partner API Integration", progress: 45, status: "Active" },
  { id: "3", name: "Design System v2", progress: 92, status: "Active" },
];

const MOCK_EVENTS = [
  { id: "1", title: "Design Review", time: "Today, 2:00 PM", attendees: 4 },
  {
    id: "2",
    title: "Engineering Standup",
    time: "Tomorrow, 9:30 AM",
    attendees: 8,
  },
  { id: "3", title: "Product Demo", time: "Apr 10, 3:00 PM", attendees: 12 },
];

const CHART_DATA = [
  { name: "Notes", value: 24, color: "#6366f1" },
  { name: "Projects", value: 7, color: "#f97316" },
  { name: "Tasks", value: 18, color: "#14b8a6" },
  { name: "Events", value: 6, color: "#ef4444" },
  { name: "Payroll", value: 12, color: "#22c55e" },
  { name: "Escrow", value: 3, color: "#eab308" },
  { name: "Wallet", value: 9, color: "#ec4899" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-5">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-28" />
      </CardContent>
    </Card>
  );
}

function StatCardItem({ stat, index }: { stat: StatCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Card className="border-border bg-card hover:shadow-md transition-smooth group cursor-default">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </p>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.iconBg}`}
            >
              <stat.icon className={`h-4.5 w-4.5 ${stat.iconColor}`} />
            </div>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground leading-tight">
            {stat.value}
          </p>
          <div className="mt-1.5 flex items-center gap-1">
            {stat.trendUp ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-orange-500" />
            )}
            <p
              className={`text-xs ${stat.trendUp ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}`}
            >
              {stat.trend}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { userProfile, workspace, isLoading } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();

  const firstName = userProfile?.displayName?.split(" ")[0] ?? "there";
  const workspaceName = workspace?.name ?? "Fourthspace Workspace";

  // Try to get real notes for the panel
  const notesQuery = useQuery({
    queryKey: ["dashboard-notes", tenantId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.listNotes(tenantId);
    },
    enabled: !!actor && !isFetching,
  });

  // Try to get real projects for the panel
  const projectsQuery = useQuery({
    queryKey: ["dashboard-projects", tenantId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.listProjects(tenantId);
    },
    enabled: !!actor && !isFetching,
  });

  // Try to get real upcoming events
  const eventsQuery = useQuery({
    queryKey: ["dashboard-events", tenantId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.listMyEvents(tenantId);
    },
    enabled: !!actor && !isFetching,
  });

  // Try to get wallet
  const walletQuery = useQuery({
    queryKey: ["dashboard-wallet", tenantId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWalletAccount(tenantId);
    },
    enabled: !!actor && !isFetching,
  });

  // Use real data or fall back to mock
  const recentNotes = notesQuery.data?.slice(0, 3) ?? null;
  const activeProjects = projectsQuery.data?.slice(0, 3) ?? null;
  const upcomingEvents = eventsQuery.data?.slice(0, 3) ?? null;
  const walletAccount = walletQuery.data ?? null;

  const icpBalance = walletAccount
    ? (Number(walletAccount.icpBalance) / 1e8).toFixed(4)
    : "142.5000";

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto space-y-7">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Workspace Overview · {workspaceName}
          </p>
          {isLoading ? (
            <Skeleton className="mt-2 h-10 w-72" />
          ) : (
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-3xl font-bold text-foreground md:text-4xl mt-1"
            >
              {getGreeting()}, {firstName}!
            </motion.h1>
          )}
        </div>
        <p className="text-sm text-muted-foreground shrink-0">{formatDate()}</p>
      </div>

      {/* ── Quick Actions ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-wrap gap-2"
        data-ocid="quick-actions"
      >
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            to={action.href}
            data-ocid={`quick-action-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <Button
              variant="outline"
              size="sm"
              className={`gap-2 border-border font-medium transition-smooth ${action.bg}`}
            >
              <Plus className={`h-3.5 w-3.5 ${action.color}`} />
              <span className={action.color}>{action.label}</span>
            </Button>
          </Link>
        ))}
      </motion.div>

      {/* ── Stats Row ──────────────────────────────────────────────────────── */}
      <div>
        <h2 className="mb-3 font-display text-base font-semibold text-foreground">
          Key Performance Stats
        </h2>
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {[
              "notes",
              "projects",
              "tasks",
              "events",
              "employees",
              "escrows",
              "wallet",
            ].map((k) => (
              <StatCardSkeleton key={k} />
            ))}
          </div>
        ) : (
          <div
            className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            data-ocid="stats-grid"
          >
            {MOCK_STATS.map((stat, i) => (
              <StatCardItem key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* ── Main Content Grid ──────────────────────────────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left Column (2/3) */}
        <div className="xl:col-span-2 space-y-6">
          {/* ── Category Panels ─────────────────────────────────────────── */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Notes Panel */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-border bg-card h-full">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/10">
                      <FileText className="h-3.5 w-3.5 text-indigo-500" />
                    </div>
                    Recent Notes
                  </CardTitle>
                  <Link to="/app/notes" data-ocid="notes-panel-link">
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground hover:text-foreground transition-smooth" />
                  </Link>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {(recentNotes ?? MOCK_NOTES).map((note) => (
                    <Link
                      key={note.id}
                      to="/app/notes/$noteId"
                      params={{ noteId: note.id }}
                      data-ocid={`note-panel-item-${note.id}`}
                      className="block rounded-lg p-2.5 hover:bg-muted/50 transition-smooth group"
                    >
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-smooth">
                        {"title" in note
                          ? note.title
                          : (note as { title: string }).title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {"content" in note
                          ? (note as { content: string }).content.slice(0, 80)
                          : (note as { preview: string }).preview}
                      </p>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Projects Panel */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-border bg-card h-full">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-500/10">
                      <FolderKanban className="h-3.5 w-3.5 text-orange-500" />
                    </div>
                    Active Projects
                  </CardTitle>
                  <Link to="/app/projects" data-ocid="projects-panel-link">
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground hover:text-foreground transition-smooth" />
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  {(activeProjects ?? MOCK_PROJECTS).map((proj) => {
                    const name =
                      "name" in proj
                        ? proj.name
                        : (proj as { name: string }).name;
                    const progress =
                      "progress" in proj
                        ? (proj as { progress: number }).progress
                        : Math.floor(Math.random() * 80) + 20;
                    return (
                      <Link
                        key={proj.id}
                        to="/app/projects/$projectId"
                        params={{ projectId: proj.id }}
                        data-ocid={`project-panel-item-${proj.id}`}
                        className="block group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-smooth max-w-[75%]">
                            {name}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {progress}%
                          </span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Calendar Panel */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-border bg-card h-full">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-red-500/10">
                      <CalendarDays className="h-3.5 w-3.5 text-red-500" />
                    </div>
                    Upcoming Events
                  </CardTitle>
                  <Link to="/app/calendar" data-ocid="calendar-panel-link">
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground hover:text-foreground transition-smooth" />
                  </Link>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {(upcomingEvents ?? MOCK_EVENTS).map((event) => {
                    const title =
                      "title" in event
                        ? event.title
                        : (event as { title: string }).title;
                    const timeStr =
                      "time" in event
                        ? (event as { time: string }).time
                        : new Date(
                            Number((event as { startTime: bigint }).startTime) /
                              1e6,
                          ).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          });
                    return (
                      <div
                        key={event.id}
                        className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-muted/50 transition-smooth"
                      >
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 flex-col items-center justify-center rounded-lg bg-red-500/10">
                          <Clock className="h-3.5 w-3.5 text-red-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {timeStr}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Wallet Panel */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-border bg-gradient-to-br from-pink-500/5 via-card to-purple-500/5 h-full">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-pink-500/10">
                      <Wallet className="h-3.5 w-3.5 text-pink-500" />
                    </div>
                    Wallet
                  </CardTitle>
                  <Link to="/app/wallet" data-ocid="wallet-panel-link">
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground hover:text-foreground transition-smooth" />
                  </Link>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="rounded-xl bg-gradient-to-r from-primary/10 to-pink-500/10 border border-primary/10 p-4 mb-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      ICP Balance
                    </p>
                    <p className="font-display text-3xl font-bold text-foreground">
                      {icpBalance}
                      <span className="text-lg text-muted-foreground ml-1.5">
                        ICP
                      </span>
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                      <p className="text-xs text-green-600 dark:text-green-400">
                        +2.4 ICP today
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/app/wallet/send"
                      className="flex-1"
                      data-ocid="wallet-send-btn"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-1.5 text-xs border-border hover:border-primary/40 transition-smooth"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        Send
                      </Button>
                    </Link>
                    <Link
                      to="/app/wallet"
                      className="flex-1"
                      data-ocid="wallet-receive-btn"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-1.5 text-xs border-border hover:border-pink-400/40 transition-smooth"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Receive
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ── Workspace Activity Chart ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-base font-semibold">
                    Workspace Activity Distribution
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="text-xs font-normal border-border text-muted-foreground"
                  >
                    All categories
                  </Badge>
                </div>
              </CardHeader>
              <CardContent data-ocid="workspace-chart">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={CHART_DATA}
                    margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                    barSize={28}
                    barCategoryGap="30%"
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "hsl(var(--foreground))",
                      }}
                      cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {CHART_DATA.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={entry.color}
                          fillOpacity={0.85}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-5">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-base font-semibold">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0" data-ocid="recent-activity">
                {MOCK_ACTIVITY.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 border-b border-border px-5 py-3 last:border-0 hover:bg-muted/30 transition-smooth"
                    data-ocid={`activity-item-${item.id}`}
                  >
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.bg}`}
                    >
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground leading-snug truncate">
                        {item.title}
                      </p>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 h-4 font-normal"
                        >
                          {item.category}
                        </Badge>
                        <p className="text-xs text-muted-foreground shrink-0">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Promo */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-accent/8 to-secondary/10 border border-primary/15 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground text-sm">
                    AI-Powered Tools
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Create, translate & automate
                  </p>
                </div>
              </div>
              <Link to="/app/ai" data-ocid="dashboard-ai-cta">
                <Button
                  size="sm"
                  className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth"
                >
                  Explore AI Tools
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Quick Nav to Admin if applicable */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border-border bg-muted/40">
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Quick Links
                </p>
                <div className="space-y-1">
                  {[
                    {
                      label: "Admin Panel",
                      href: "/app/admin",
                      icon: Shield,
                      color: "text-muted-foreground",
                    },
                    {
                      label: "Automation Rules",
                      href: "/app/admin/automation",
                      icon: Sparkles,
                      color: "text-muted-foreground",
                    },
                    {
                      label: "Analytics",
                      href: "/app/admin/analytics",
                      icon: TrendingUp,
                      color: "text-muted-foreground",
                    },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      data-ocid={`quick-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-background transition-smooth"
                    >
                      <link.icon className="h-4 w-4 shrink-0" />
                      {link.label}
                      <ArrowRight className="ml-auto h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-smooth" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
