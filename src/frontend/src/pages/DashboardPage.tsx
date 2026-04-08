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
  CircleDollarSign,
  FileText,
  FolderKanban,
  MessageSquare,
  Plus,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import type { ActivityEntry, DashboardStats } from "../backend";
import { useBackend } from "../hooks/useBackend";
import { getTenantId, useWorkspace } from "../hooks/useWorkspace";

/* ─── types ─────────────────────────────────────────── */

interface QuickAction {
  label: string;
  href: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

/* ─── static helpers ─────────────────────────────────── */

function getQuickActions(wid: string): QuickAction[] {
  return [
    {
      label: "New Note",
      href: `/app/${wid}/notes/new`,
      icon: FileText,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20 hover:border-indigo-500/40",
    },
    {
      label: "New Project",
      href: `/app/${wid}/projects/new`,
      icon: FolderKanban,
      color: "text-orange-500",
      bg: "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20 hover:border-orange-500/40",
    },
    {
      label: "New Chat",
      href: `/app/${wid}/chat`,
      icon: MessageSquare,
      color: "text-teal-500",
      bg: "bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/20 hover:border-teal-500/40",
    },
    {
      label: "View Goals",
      href: `/app/${wid}/goals`,
      icon: Target,
      color: "text-primary",
      bg: "bg-primary/10 hover:bg-primary/20 border-primary/20 hover:border-primary/40",
    },
  ];
}

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
  });
}

function relativeTime(nanoTimestamp: bigint): string {
  const ms = Number(nanoTimestamp) / 1_000_000;
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function shortPrincipal(id: string): string {
  if (!id || id.length < 10) return id;
  return `${id.slice(0, 5)}…${id.slice(-4)}`;
}

function activityIcon(entityType: string): {
  icon: React.ElementType;
  color: string;
  bg: string;
  category: string;
} {
  switch (entityType.toLowerCase()) {
    case "note":
      return {
        icon: FileText,
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
        category: "Notes",
      };
    case "project":
      return {
        icon: FolderKanban,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        category: "Projects",
      };
    case "task":
      return {
        icon: Target,
        color: "text-teal-500",
        bg: "bg-teal-500/10",
        category: "Tasks",
      };
    case "message":
      return {
        icon: MessageSquare,
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
        category: "Chat",
      };
    case "wallet":
      return {
        icon: Wallet,
        color: "text-pink-500",
        bg: "bg-pink-500/10",
        category: "Wallet",
      };
    case "escrow":
      return {
        icon: Shield,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
        category: "Escrow",
      };
    case "goal":
      return {
        icon: Target,
        color: "text-primary",
        bg: "bg-primary/10",
        category: "Goals",
      };
    default:
      return {
        icon: Sparkles,
        color: "text-muted-foreground",
        bg: "bg-muted",
        category: entityType,
      };
  }
}

const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-green-500",
  "bg-pink-500",
  "bg-primary",
];

function getAvatarColor(str: string): string {
  const idx = (str.charCodeAt(0) ?? 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function categoryBadgeClass(category: string): string {
  switch (category) {
    case "Projects":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
    case "Chat":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    case "Payroll":
      return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
    case "Wallet":
      return "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20";
    case "Escrow":
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
    case "Goals":
      return "bg-primary/10 text-primary border-primary/20";
    default:
      return "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20";
  }
}

/* ─── sub-components ─────────────────────────────────── */

function StatCardSkeleton() {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4 sm:p-5">
        <Skeleton className="h-3 w-20 mb-3" />
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-2.5 w-28" />
      </CardContent>
    </Card>
  );
}

interface StatDisplayCard {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

function StatCardItem({
  stat,
  index,
}: { stat: StatDisplayCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
    >
      <Card className="border-border bg-card hover:shadow-card-hover transition-smooth card-interactive h-full">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground tracking-tight">
              {stat.label}
            </p>
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg ${stat.iconBg}`}
            >
              <stat.icon className={`h-3.5 w-3.5 ${stat.iconColor}`} />
            </div>
          </div>
          <p className="font-display text-2xl font-bold text-foreground tracking-tight leading-none mb-1.5">
            {stat.value}
          </p>
          <p className="text-[10px] text-muted-foreground tracking-tight">
            {stat.sub}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── main component ─────────────────────────────────── */

export default function DashboardPage() {
  const { userProfile, activeWorkspace, activeWorkspaceId, isLoading } =
    useWorkspace();
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  const firstName = userProfile?.displayName?.split(" ")[0] ?? "there";
  const workspaceName = activeWorkspace?.name ?? "Fourthspace Workspace";
  const QUICK_ACTIONS = getQuickActions(workspaceId);

  /* ── queries ── */
  const statsQuery = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) throw new Error("no actor");
      return actor.getWorkspaceDashboardStats(workspaceId, tenantId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const activityQuery = useQuery<ActivityEntry[]>({
    queryKey: ["dashboard-activity", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkspaceRecentActivity(
        workspaceId,
        tenantId,
        BigInt(10),
      );
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const notesQuery = useQuery({
    queryKey: ["dashboard-notes", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listNotes(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const projectsQuery = useQuery({
    queryKey: ["dashboard-projects", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProjects(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const eventsQuery = useQuery({
    queryKey: ["dashboard-events", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyEvents(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const treasuryQuery = useQuery({
    queryKey: ["dashboard-treasury", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWorkspaceTreasury(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const escrowQuery = useQuery({
    queryKey: ["dashboard-escrow", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEscrows(tenantId, workspaceId, null);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const payrollQuery = useQuery({
    queryKey: ["dashboard-payroll", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPayrollRecords(tenantId, workspaceId, null);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  /* ── derived values ── */
  const stats = statsQuery.data;
  const statsLoading = isLoading || statsQuery.isLoading;

  const recentNotes = notesQuery.data?.slice(0, 3) ?? [];
  const activeProjects = projectsQuery.data?.slice(0, 3) ?? [];
  const upcomingEvents = eventsQuery.data?.slice(0, 3) ?? [];

  const treasury = treasuryQuery.data ?? null;
  const icpBalance = treasury
    ? (Number(treasury.icpBalance) / 1e8).toFixed(4)
    : null;

  const escrowList = escrowQuery.data ?? [];
  const pendingEscrow = escrowList.filter(
    (e) => e.status !== "Released" && e.status !== "Cancelled",
  ).length;

  const payrollList = payrollQuery.data ?? [];
  const latestPayroll = payrollList[payrollList.length - 1] ?? null;

  const statCards: StatDisplayCard[] = [
    {
      label: "Total Notes",
      value: stats ? String(stats.noteCount) : "0",
      sub:
        stats && stats.noteCount > 0
          ? `${stats.noteCount} note entries`
          : "No notes yet",
      icon: FileText,
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-500",
    },
    {
      label: "Active Projects",
      value: stats ? String(stats.projectCount) : "0",
      sub:
        stats && stats.projectCount > 0
          ? `${stats.projectCount} projects`
          : "No active projects",
      icon: FolderKanban,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
    {
      label: "Team Members",
      value: stats ? String(stats.memberCount) : "0",
      sub:
        stats && stats.memberCount > 0
          ? `${stats.memberCount} members`
          : "No members yet",
      icon: Users,
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-500",
    },
    {
      label: "Active Goals",
      value: stats ? String(stats.goalCount) : "0",
      sub:
        stats && stats.goalCount > 0
          ? `${stats.goalCount} goals tracked`
          : "No goals set",
      icon: Target,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
  ];

  return (
    <div className="p-4 sm:p-5 md:p-6 max-w-7xl mx-auto space-y-5 sm:space-y-6 pb-20 md:pb-6">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1.5">
        <div>
          {isLoading ? (
            <Skeleton className="h-7 w-56 mt-1" />
          ) : (
            <motion.h1
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight"
            >
              {getGreeting()}, {firstName}
            </motion.h1>
          )}
        </div>
        <p className="text-xs text-muted-foreground shrink-0">{formatDate()}</p>
      </div>

      {/* ── Hero card — Workspace Overview ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        data-ocid="workspace-hero-card"
      >
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary via-primary/80 to-purple-700/70 p-5 sm:p-7">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-purple-400/10 blur-2xl" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5 min-w-0">
              {isLoading ? (
                <Skeleton className="h-8 w-48 bg-white/20" />
              ) : (
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight truncate">
                  {workspaceName}
                </h2>
              )}
              <p className="text-sm text-white/70 font-medium">
                {stats
                  ? `${stats.memberCount} Member${stats.memberCount !== BigInt(1) ? "s" : ""}`
                  : "Workspace"}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/20 text-[11px] h-5 px-2 font-medium">
                  {(userProfile as { role?: string } | null)?.role ?? "Member"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-start">
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-400/20 border border-emerald-400/30 px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold text-emerald-300">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* hero quick stats row */}
          <div className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {statsLoading
              ? [1, 2, 3, 4].map((k) => (
                  <div
                    key={k}
                    className="rounded-lg bg-white/10 border border-white/10 p-3"
                  >
                    <Skeleton className="h-2 w-12 mb-2 bg-white/20" />
                    <Skeleton className="h-5 w-8 bg-white/20" />
                  </div>
                ))
              : statCards.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg bg-white/10 border border-white/10 p-3"
                  >
                    <p className="text-[10px] text-white/60 mb-1">{s.label}</p>
                    <p className="font-display text-lg font-bold text-white tracking-tight">
                      {s.value}
                    </p>
                  </div>
                ))}
          </div>
        </div>
      </motion.div>

      {/* ── Quick actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
        data-ocid="quick-actions"
      >
        {QUICK_ACTIONS.map((action, i) => (
          <Link
            key={action.href}
            to={action.href as "/"}
            data-ocid={`quick-action-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.12 + i * 0.04 }}
            >
              <Button
                variant="outline"
                size="sm"
                className={`gap-1.5 rounded-full border text-xs h-8 font-medium transition-smooth active-press ${action.bg}`}
              >
                <Plus className={`h-3 w-3 ${action.color}`} />
                <action.icon className={`h-3 w-3 ${action.color}`} />
                <span className={action.color}>{action.label}</span>
              </Button>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* ── Metrics grid ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-sm font-semibold text-foreground tracking-tight">
            Workspace Overview
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <Badge
              variant="outline"
              className="text-[10px] h-4 px-1.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium"
            >
              Live
            </Badge>
          </div>
        </div>
        {statsLoading ? (
          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
            {[1, 2, 3, 4].map((k) => (
              <StatCardSkeleton key={k} />
            ))}
          </div>
        ) : (
          <div
            className="grid gap-3 grid-cols-2 md:grid-cols-4"
            data-ocid="stats-grid"
          >
            {statCards.map((stat, i) => (
              <StatCardItem key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* ── Financial summary ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-sm font-semibold text-foreground tracking-tight">
            Financial Summary
          </h2>
          <Link
            to={`/app/${workspaceId}/wallet` as "/"}
            data-ocid="financial-see-all"
          >
            <span className="text-[10px] text-muted-foreground hover:text-primary transition-smooth flex items-center gap-0.5">
              See all <ArrowRight className="h-2.5 w-2.5" />
            </span>
          </Link>
        </div>
        <div
          className="grid gap-3 grid-cols-1 sm:grid-cols-3"
          data-ocid="financial-grid"
        >
          {/* Wallet */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0, duration: 0.25 }}
          >
            <Link
              to={`/app/${workspaceId}/wallet` as "/"}
              data-ocid="financial-card-0"
            >
              <Card className="border-border bg-gradient-to-br from-pink-500/5 via-card to-primary/5 transition-smooth card-interactive h-full">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-500/10">
                      <Wallet className="h-3.5 w-3.5 text-pink-500" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Wallet Balance
                    </p>
                  </div>
                  {treasuryQuery.isLoading ? (
                    <Skeleton className="h-7 w-24" />
                  ) : (
                    <p className="font-display text-xl font-bold text-foreground tracking-tight leading-none mb-1">
                      {icpBalance !== null ? `${icpBalance} ICP` : "—"}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground">
                    {treasury ? "On-chain balance" : "No wallet found"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          {/* Payroll */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06, duration: 0.25 }}
          >
            <Link
              to={`/app/${workspaceId}/payroll` as "/"}
              data-ocid="financial-card-1"
            >
              <Card className="border-border bg-card transition-smooth card-interactive h-full">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500/10">
                      <CircleDollarSign className="h-3.5 w-3.5 text-green-500" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Payroll This Month
                    </p>
                  </div>
                  {payrollQuery.isLoading ? (
                    <Skeleton className="h-7 w-24" />
                  ) : (
                    <p className="font-display text-xl font-bold text-foreground tracking-tight leading-none mb-1">
                      {latestPayroll
                        ? new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(latestPayroll.grossAmount ?? 0)
                        : "—"}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground">
                    {payrollList.length > 0
                      ? `${payrollList.length} record${payrollList.length !== 1 ? "s" : ""}`
                      : "No payroll records"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          {/* Escrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12, duration: 0.25 }}
          >
            <Link
              to={`/app/${workspaceId}/escrow` as "/"}
              data-ocid="financial-card-2"
            >
              <Card className="border-border bg-card transition-smooth card-interactive h-full">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-500/10">
                      <Shield className="h-3.5 w-3.5 text-yellow-500" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Active Escrow
                    </p>
                  </div>
                  {escrowQuery.isLoading ? (
                    <Skeleton className="h-7 w-24" />
                  ) : (
                    <p className="font-display text-xl font-bold text-foreground tracking-tight leading-none mb-1">
                      {pendingEscrow > 0
                        ? `${pendingEscrow} pending`
                        : "None active"}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground">
                    {escrowList.length > 0
                      ? `${escrowList.length} total agreements`
                      : "No escrow agreements"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>

        {/* Wallet action row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-3"
        >
          <Card className="border-border bg-card">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">
                  Wallet Balance
                </p>
                {treasuryQuery.isLoading ? (
                  <Skeleton className="h-8 w-32" />
                ) : (
                  <p className="font-display text-2xl font-bold text-foreground tracking-tight">
                    {icpBalance !== null ? (
                      <>
                        {icpBalance}
                        <span className="text-sm text-muted-foreground ml-1.5">
                          ICP
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground text-lg">
                        No wallet
                      </span>
                    )}
                  </p>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">
                  Escrow Status
                </p>
                {escrowQuery.isLoading ? (
                  <Skeleton className="h-6 w-28" />
                ) : (
                  <p className="font-display text-lg font-semibold text-foreground">
                    {pendingEscrow > 0
                      ? `${pendingEscrow} pending payment${pendingEscrow !== 1 ? "s" : ""}`
                      : "No pending payments"}
                  </p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  to={`/app/${workspaceId}/wallet/send` as "/"}
                  data-ocid="wallet-deposit-btn"
                >
                  <Button
                    size="sm"
                    className="h-8 text-xs font-semibold active-press"
                  >
                    Deposit Funds
                  </Button>
                </Link>
                <Link
                  to={`/app/${workspaceId}/wallet` as "/"}
                  data-ocid="wallet-withdraw-btn"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs border-border hover:border-primary/40 transition-smooth"
                  >
                    Withdraw
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Main content grid ── */}
      <div className="grid gap-5 xl:grid-cols-3">
        {/* Left / 2-col panel */}
        <div className="xl:col-span-2 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Notes */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-border bg-card h-full">
                <CardHeader className="pb-2 flex flex-row items-center justify-between pt-4 px-4">
                  <CardTitle className="text-xs font-semibold flex items-center gap-1.5 tracking-tight">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-indigo-500/10">
                      <FileText className="h-3 w-3 text-indigo-500" />
                    </div>
                    Recent Notes
                  </CardTitle>
                  <Link
                    to={`/app/${workspaceId}/notes` as "/"}
                    data-ocid="notes-panel-link"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-smooth" />
                  </Link>
                </CardHeader>
                <CardContent className="pt-1 px-2 pb-3">
                  {notesQuery.isLoading ? (
                    <div className="space-y-2 p-2">
                      {[1, 2, 3].map((k) => (
                        <Skeleton key={k} className="h-9 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : recentNotes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <FileText className="h-6 w-6 text-muted-foreground/30 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        No notes yet
                      </p>
                      <Link to={`/app/${workspaceId}/notes/new` as "/"}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-xs h-7 px-2"
                        >
                          Create one
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {recentNotes.map((note) => (
                        <Link
                          key={note.id}
                          to={`/app/${workspaceId}/notes/${note.id}` as "/"}
                          data-ocid={`note-panel-item-${note.id}`}
                          className="block rounded-lg p-2 hover:bg-muted/40 transition-smooth group"
                        >
                          <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-smooth">
                            {note.title}
                          </p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1">
                            {(note as { content?: string }).content?.slice(
                              0,
                              70,
                            ) ?? ""}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Projects */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-border bg-card h-full">
                <CardHeader className="pb-2 flex flex-row items-center justify-between pt-4 px-4">
                  <CardTitle className="text-xs font-semibold flex items-center gap-1.5 tracking-tight">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-orange-500/10">
                      <FolderKanban className="h-3 w-3 text-orange-500" />
                    </div>
                    Active Projects
                  </CardTitle>
                  <Link
                    to={`/app/${workspaceId}/projects` as "/"}
                    data-ocid="projects-panel-link"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-smooth" />
                  </Link>
                </CardHeader>
                <CardContent className="pt-1 px-4 pb-4">
                  {projectsQuery.isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((k) => (
                        <Skeleton key={k} className="h-8 w-full rounded" />
                      ))}
                    </div>
                  ) : activeProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <FolderKanban className="h-6 w-6 text-muted-foreground/30 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        No active projects
                      </p>
                      <Link to={`/app/${workspaceId}/projects/new` as "/"}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-xs h-7 px-2"
                        >
                          Create one
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeProjects.map((proj) => (
                        <Link
                          key={proj.id}
                          to={`/app/${workspaceId}/projects/${proj.id}` as "/"}
                          data-ocid={`project-panel-item-${proj.id}`}
                          className="block group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-smooth max-w-[80%]">
                              {proj.name}
                            </p>
                          </div>
                          <Progress value={0} className="h-1" />
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
            >
              <Card className="border-border bg-card h-full">
                <CardHeader className="pb-2 flex flex-row items-center justify-between pt-4 px-4">
                  <CardTitle className="text-xs font-semibold flex items-center gap-1.5 tracking-tight">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-red-500/10">
                      <CalendarDays className="h-3 w-3 text-red-500" />
                    </div>
                    Upcoming Events
                  </CardTitle>
                  <Link
                    to={`/app/${workspaceId}/calendar` as "/"}
                    data-ocid="calendar-panel-link"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-smooth" />
                  </Link>
                </CardHeader>
                <CardContent className="pt-1 px-2 pb-3">
                  {eventsQuery.isLoading ? (
                    <div className="space-y-2 p-2">
                      {[1, 2, 3].map((k) => (
                        <Skeleton key={k} className="h-9 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : upcomingEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <CalendarDays className="h-6 w-6 text-muted-foreground/30 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        No upcoming events
                      </p>
                      <Link to={`/app/${workspaceId}/calendar` as "/"}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-xs h-7 px-2"
                        >
                          Schedule one
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {upcomingEvents.map((event) => {
                        const timeStr = new Date(
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
                            className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-muted/40 transition-smooth"
                          >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                              <CalendarDays className="h-3 w-3 text-red-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-foreground truncate">
                                {event.title}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {timeStr}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* AI tools card */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
            >
              <div className="rounded-xl bg-gradient-to-br from-primary/10 via-card to-secondary/10 border border-primary/15 p-5 h-full flex flex-col">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
                    <Sparkles className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground text-sm tracking-tight">
                      AI-Powered Tools
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Create, translate & automate
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mb-4 flex-1 leading-relaxed">
                  Use AI to summarize notes, generate tasks from descriptions,
                  or get workspace insights — powered by your data.
                </p>
                <Link
                  to={`/app/${workspaceId}/ai` as "/"}
                  data-ocid="dashboard-ai-cta"
                >
                  <Button
                    size="sm"
                    className="w-full gap-1.5 h-8 text-xs font-semibold active-press"
                  >
                    Explore AI Tools <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-border bg-card">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-sm font-semibold tracking-tight">
                    Recent Activity
                  </CardTitle>
                  <Link
                    to={`/app/${workspaceId}/projects` as "/"}
                    data-ocid="activity-see-all"
                  >
                    <span className="text-[10px] text-muted-foreground hover:text-primary transition-smooth">
                      See all
                    </span>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0" data-ocid="recent-activity">
                {activityQuery.isLoading ? (
                  <div className="space-y-0">
                    {[1, 2, 3, 4].map((k) => (
                      <div
                        key={k}
                        className="flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0"
                      >
                        <Skeleton className="h-7 w-7 rounded-full shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-2.5 w-3/4" />
                          <Skeleton className="h-4 w-16 mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !activityQuery.data || activityQuery.data.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center py-10 px-4 text-center"
                    data-ocid="activity-empty"
                  >
                    <Sparkles className="h-8 w-8 text-muted-foreground/30 mb-2" />
                    <p className="text-xs font-medium text-foreground mb-1">
                      No recent activity
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Start by creating a note or project to see activity here.
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Link to={`/app/${workspaceId}/notes/new` as "/"}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                        >
                          New Note
                        </Button>
                      </Link>
                      <Link to={`/app/${workspaceId}/projects/new` as "/"}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                        >
                          New Project
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  activityQuery.data.map((item, idx) => {
                    const meta = activityIcon(item.entityType);
                    const initials = shortPrincipal(item.actorId)
                      .slice(0, 2)
                      .toUpperCase();
                    return (
                      <motion.div
                        key={`${item.actorId}-${item.timestamp}-${idx}`}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-start gap-3 border-b border-border/50 px-4 py-3 last:border-0 hover:bg-muted/20 transition-smooth"
                        data-ocid={`activity-item-${idx}`}
                      >
                        <div
                          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${getAvatarColor(initials)}`}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-foreground leading-snug truncate">
                            {item.entityTitle}
                          </p>
                          <p className="text-[10px] text-muted-foreground line-clamp-1 mb-1">
                            {item.action}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <Badge
                              variant="secondary"
                              className={`text-[9px] px-1.5 py-0 h-4 font-medium ${categoryBadgeClass(meta.category)}`}
                            >
                              {meta.category}
                            </Badge>
                            <p className="text-[10px] text-muted-foreground shrink-0">
                              {relativeTime(item.timestamp)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick nav */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border bg-muted/30">
              <CardContent className="p-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Quick Links
                </p>
                <div className="space-y-0.5">
                  {[
                    {
                      label: "Admin Panel",
                      href: `/app/${workspaceId}/admin`,
                      icon: Shield,
                    },
                    {
                      label: "Automation Rules",
                      href: `/app/${workspaceId}/admin/automation`,
                      icon: Sparkles,
                    },
                    {
                      label: "Analytics",
                      href: `/app/${workspaceId}/admin/analytics`,
                      icon: TrendingUp,
                    },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      to={link.href as "/"}
                      data-ocid={`quick-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center gap-2 rounded px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-background transition-smooth"
                    >
                      <link.icon className="h-3 w-3 shrink-0" />
                      {link.label}
                      <ArrowRight className="ml-auto h-3 w-3 opacity-50" />
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
