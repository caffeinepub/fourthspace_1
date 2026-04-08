import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart2,
  DollarSign,
  FileText,
  FolderKanban,
  MessageSquare,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import type {
  AuditLog,
  Employee,
  EscrowContract,
  Note,
  Project,
  UserProfile,
} from "../../types";

const ACTIVITY_TREND = [
  { month: "Jan", notes: 24, tasks: 18, messages: 45 },
  { month: "Feb", notes: 30, tasks: 25, messages: 62 },
  { month: "Mar", notes: 18, tasks: 32, messages: 38 },
  { month: "Apr", notes: 42, tasks: 28, messages: 71 },
  { month: "May", notes: 35, tasks: 41, messages: 55 },
  { month: "Jun", notes: 48, tasks: 36, messages: 83 },
];

const GROWTH_DATA = [
  { week: "W1", users: 5 },
  { week: "W2", users: 8 },
  { week: "W3", users: 12 },
  { week: "W4", users: 15 },
  { week: "W5", users: 19 },
  { week: "W6", users: 24 },
];

const PIE_COLORS = [
  "oklch(0.65 0.24 264)",
  "oklch(0.62 0.22 48)",
  "oklch(0.58 0.19 172)",
  "oklch(0.55 0.22 142)",
  "oklch(0.68 0.18 88)",
];

const TOOLTIP_STYLE = {
  background: "oklch(var(--card))",
  border: "1px solid oklch(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
};

export default function AdminAnalyticsPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { activeWorkspaceId } = useWorkspace();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";

  const { data: profiles, isLoading: profilesLoading } = useQuery<
    UserProfile[]
  >({
    queryKey: ["profiles", tenantId],
    queryFn: async () => (actor ? actor.listProfiles(tenantId) : []),
    enabled: !!actor && !isFetching,
  });
  const { data: notes, isLoading: notesLoading } = useQuery<Note[]>({
    queryKey: ["notes", tenantId, workspaceId],
    queryFn: async () => (actor ? actor.listNotes(tenantId, workspaceId) : []),
    enabled: !!actor && !isFetching && !!workspaceId,
  });
  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["projects", tenantId, workspaceId],
    queryFn: async () =>
      actor ? actor.listProjects(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });
  const { data: employees, isLoading: employeesLoading } = useQuery<Employee[]>(
    {
      queryKey: ["employees", tenantId, workspaceId],
      queryFn: async () =>
        actor ? actor.listEmployees(tenantId, workspaceId) : [],
      enabled: !!actor && !isFetching && !!workspaceId,
    },
  );
  const { data: escrows, isLoading: escrowsLoading } = useQuery<
    EscrowContract[]
  >({
    queryKey: ["escrows", tenantId, workspaceId],
    queryFn: async () =>
      actor ? actor.listEscrows(tenantId, workspaceId, null) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });
  const { data: auditLogs } = useQuery<AuditLog[]>({
    queryKey: ["auditLogs", tenantId, workspaceId],
    queryFn: async () =>
      actor ? actor.listAuditLogs(tenantId, workspaceId, BigInt(50)) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const isLoading =
    profilesLoading ||
    notesLoading ||
    projectsLoading ||
    employeesLoading ||
    escrowsLoading;

  const statsData = [
    {
      label: "Team Members",
      value: profiles?.length ?? 0,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Notes",
      value: notes?.length ?? 0,
      icon: FileText,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Projects",
      value: projects?.length ?? 0,
      icon: FolderKanban,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "Employees",
      value: employees?.length ?? 0,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Escrow Contracts",
      value: escrows?.length ?? 0,
      icon: Shield,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Audit Events",
      value: auditLogs?.length ?? 0,
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  const categoryDistribution = [
    { name: "Notes", value: notes?.length ?? 0 },
    { name: "Projects", value: projects?.length ?? 0 },
    { name: "Employees", value: employees?.length ?? 0 },
    { name: "Escrows", value: escrows?.length ?? 0 },
    { name: "Users", value: profiles?.length ?? 0 },
  ].filter((d) => d.value > 0);

  const workspaceBarData = [
    { category: "Notes", count: notes?.length ?? 142 },
    { category: "Projects", count: projects?.length ?? 23 },
    { category: "Employees", count: employees?.length ?? 18 },
    { category: "Escrows", count: escrows?.length ?? 12 },
    { category: "Users", count: profiles?.length ?? 24 },
    { category: "Audits", count: auditLogs?.length ?? 89 },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: `/app/${workspaceId}/admin` as "/" })}
          aria-label="Back"
          className="hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10">
          <BarChart2 className="h-4 w-4 text-purple-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Workspace usage statistics and performance metrics
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statsData.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="border-border/50 bg-card shadow-card">
              <CardContent className="p-4">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg} mb-2`}
                >
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                {isLoading ? (
                  <Skeleton className="h-7 w-12 mb-1" />
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

      {/* Charts Row 1 */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="border-border/50 bg-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <BarChart2 className="h-4 w-4 text-purple-500" /> Workspace
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart
                data={workspaceBarData}
                margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar
                  dataKey="count"
                  radius={[6, 6, 0, 0]}
                  fill="oklch(0.65 0.24 264)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-primary" /> Category
              Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[230px] items-center justify-center text-sm text-muted-foreground">
                No data yet — add workspace content to see distribution.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="border-border/50 bg-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <MessageSquare className="h-4 w-4 text-teal-500" /> Activity
              Trends (6-Month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={ACTIVITY_TREND}
                margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px" }}
                />
                <Bar
                  dataKey="notes"
                  name="Notes"
                  fill="oklch(0.65 0.24 264)"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="tasks"
                  name="Tasks"
                  fill="oklch(0.62 0.22 48)"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="messages"
                  name="Messages"
                  fill="oklch(0.58 0.19 172)"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Users className="h-4 w-4 text-primary" /> User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={GROWTH_DATA}
                margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Line
                  type="monotone"
                  dataKey="users"
                  name="Users"
                  stroke="oklch(0.45 0.24 264)"
                  strokeWidth={2.5}
                  dot={{ fill: "oklch(0.45 0.24 264)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
