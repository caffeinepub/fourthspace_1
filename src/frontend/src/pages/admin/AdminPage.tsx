import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArchiveRestore,
  ArrowRight,
  BarChart2,
  ClipboardList,
  Clock,
  FileInput,
  Settings,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import type { AutomationRule, Backup, UserProfile } from "../../types";

export default function AdminPage() {
  const { actor, isFetching } = useBackend();
  const { activeWorkspaceId } = useWorkspace();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";

  const ADMIN_SECTIONS = [
    {
      label: "Backup & Restore",
      href: `/app/${workspaceId}/admin/backup`,
      icon: ArchiveRestore,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      desc: "Create backups and restore workspace data.",
    },
    {
      label: "User Management",
      href: `/app/${workspaceId}/admin/users`,
      icon: Users,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
      desc: "Manage team members, roles, and permissions.",
    },
    {
      label: "Audit Logs",
      href: `/app/${workspaceId}/admin/audit`,
      icon: ClipboardList,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      desc: "Review all system activity and user actions.",
    },
    {
      label: "Automation",
      href: `/app/${workspaceId}/admin/automation`,
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      desc: "Create triggers and automated workflow actions.",
    },
    {
      label: "Analytics",
      href: `/app/${workspaceId}/admin/analytics`,
      icon: BarChart2,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      desc: "View usage statistics and performance metrics.",
    },
    {
      label: "Integrations",
      href: `/app/${workspaceId}/admin/integrations`,
      icon: Zap,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      desc: "Connect Slack, GitHub, Google Drive, and more.",
    },
    {
      label: "Forms",
      href: `/app/${workspaceId}/admin/forms`,
      icon: FileInput,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      desc: "Build public intake forms and collect responses.",
    },
    {
      label: "Time Reports",
      href: `/app/${workspaceId}/admin/time-reports`,
      icon: Clock,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      desc: "Track billable hours and generate time reports.",
    },
  ];

  const { data: backups, isLoading: backupsLoading } = useQuery<Backup[]>({
    queryKey: ["backups", tenantId, workspaceId],
    queryFn: async () =>
      actor ? actor.listBackups(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const { data: profiles, isLoading: profilesLoading } = useQuery<
    UserProfile[]
  >({
    queryKey: ["profiles", tenantId],
    queryFn: async () => (actor ? actor.listProfiles(tenantId) : []),
    enabled: !!actor && !isFetching,
  });

  const { data: rules, isLoading: rulesLoading } = useQuery<AutomationRule[]>({
    queryKey: ["automationRules", tenantId, workspaceId],
    queryFn: async () =>
      actor ? actor.listAutomationRules(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const statsLoading = backupsLoading || profilesLoading || rulesLoading;

  const HEALTH_STATS = [
    {
      label: "Team Members",
      value: profiles?.length ?? 0,
      icon: Users,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
    },
    {
      label: "Total Backups",
      value: backups?.length ?? 0,
      icon: ArchiveRestore,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Active Rules",
      value: rules?.filter((r) => r.isActive).length ?? 0,
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "System Health",
      value: "100%",
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <Settings className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                Admin Panel
              </h1>
              <Badge className="hidden sm:flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Admin only
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Workspace configuration, users, and monitoring
            </p>
          </div>
        </div>
        <Badge className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
          All Systems Operational
        </Badge>
      </div>

      {/* Health Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {HEALTH_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card className="border-border/50 bg-card shadow-card">
              <CardContent className="p-5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg} mb-3`}
                >
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16 mb-1" />
                ) : (
                  <p className="font-display text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Section Cards */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Admin Areas
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ADMIN_SECTIONS.map((section, i) => (
            <motion.div
              key={section.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
            >
              <Link
                to={section.href as "/"}
                data-ocid={`admin-section-${section.label.toLowerCase().replace(/ /g, "-")}`}
                className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-5 transition-all duration-200 hover:shadow-card-hover hover:border-border hover:-translate-y-0.5 group h-full"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${section.bg}`}
                >
                  <section.icon className={`h-4.5 w-4.5 ${section.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm leading-snug">
                    {section.label}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {section.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-200">
                  Open <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
