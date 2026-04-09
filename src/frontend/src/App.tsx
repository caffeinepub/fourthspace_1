import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { getWorkspaceId } from "./hooks/useWorkspace";

// ---- Lazy page imports ----
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
// Workspace management
const WorkspaceNewPage = lazy(
  () => import("./pages/workspace/WorkspaceNewPage"),
);
const WorkspacesListPage = lazy(
  () => import("./pages/workspace/WorkspacesListPage"),
);
const WorkspaceSettingsPage = lazy(
  () => import("./pages/workspace/WorkspaceSettingsPage"),
);
const WorkspaceMembersPage = lazy(
  () => import("./pages/workspace/WorkspaceMembersPage"),
);
// Notes
const NotesPage = lazy(() => import("./pages/notes/NotesPage"));
const NoteDetailPage = lazy(() => import("./pages/notes/NoteDetailPage"));
const NoteNewPage = lazy(() => import("./pages/notes/NoteNewPage"));
const NoteTemplatesPage = lazy(() => import("./pages/notes/NoteTemplatesPage"));
// Pages (block-based)
const PagesPage = lazy(() => import("./pages/notes/PagesPage"));
const PageNewPage = lazy(() => import("./pages/notes/PageNewPage"));
const PageDetailPage = lazy(() => import("./pages/notes/PageDetailPage"));
// Projects
const ProjectsPage = lazy(() => import("./pages/projects/ProjectsPage"));
const ProjectDetailPage = lazy(
  () => import("./pages/projects/ProjectDetailPage"),
);
const ProjectNewPage = lazy(() => import("./pages/projects/ProjectNewPage"));
const TaskDetailPage = lazy(() => import("./pages/projects/TaskDetailPage"));
const TimeTrackingPage = lazy(
  () => import("./pages/projects/TimeTrackingPage"),
);
const GuestAccessPage = lazy(() => import("./pages/projects/GuestAccessPage"));
const WhiteboardPage = lazy(() => import("./pages/projects/WhiteboardPage"));
const SprintsPage = lazy(() => import("./pages/projects/SprintsPage"));
const SprintDetailPage = lazy(
  () => import("./pages/projects/SprintDetailPage"),
);
const MilestonesPage = lazy(() => import("./pages/projects/MilestonesPage"));
const ProjectTemplatesPage = lazy(
  () => import("./pages/projects/ProjectTemplatesPage"),
);
// Chat
const ChatPage = lazy(() => import("./pages/chat/ChatPage"));
const ChannelPage = lazy(() => import("./pages/chat/ChannelPage"));
const ChatSearchPage = lazy(() => import("./pages/chat/SearchPage"));
const ThreadPage = lazy(() => import("./pages/chat/ThreadPage"));
const ChannelSettingsPage = lazy(
  () => import("./pages/chat/ChannelSettingsPage"),
);
// Calendar
const CalendarPage = lazy(() => import("./pages/calendar/CalendarPage"));
const EventNewPage = lazy(() => import("./pages/calendar/EventNewPage"));
const EventDetailPage = lazy(() => import("./pages/calendar/EventDetailPage"));
const AvailabilityPage = lazy(
  () => import("./pages/calendar/AvailabilityPage"),
);
const CalendarSettingsPage = lazy(
  () => import("./pages/calendar/CalendarSettingsPage"),
);
// Payroll
const PayrollPage = lazy(() => import("./pages/payroll/PayrollPage"));
const EmployeesPage = lazy(() => import("./pages/payroll/EmployeesPage"));
const EmployeeDetailPage = lazy(
  () => import("./pages/payroll/EmployeeDetailPage"),
);
const PaySchedulesPage = lazy(() => import("./pages/payroll/PaySchedulesPage"));
const ContractorsPage = lazy(() => import("./pages/payroll/ContractorsPage"));
const AuditLogPage = lazy(() => import("./pages/payroll/AuditLogPage"));
const BulkApprovalPage = lazy(() => import("./pages/payroll/BulkApprovalPage"));
const OffCyclePaymentPage = lazy(
  () => import("./pages/payroll/OffCyclePaymentPage"),
);
// Escrow
const EscrowPage = lazy(() => import("./pages/escrow/EscrowPage"));
const EscrowNewPage = lazy(() => import("./pages/escrow/EscrowNewPage"));
const EscrowDetailPage = lazy(() => import("./pages/escrow/EscrowDetailPage"));
// Wallet
const WalletPage = lazy(() => import("./pages/wallet/WalletPage"));
const WalletSendPage = lazy(() => import("./pages/wallet/WalletSendPage"));
const WalletRecurringPage = lazy(
  () => import("./pages/wallet/WalletRecurringPage"),
);
const WalletReceivePage = lazy(
  () => import("./pages/wallet/WalletReceivePage"),
);
const WalletSpendingLimitsPage = lazy(
  () => import("./pages/wallet/WalletSpendingLimitsPage"),
);
// AI
const AIHubPage = lazy(() => import("./pages/ai/AIHubPage"));
const AIContentPage = lazy(() => import("./pages/ai/AIContentPage"));
const AIChatPage = lazy(() => import("./pages/ai/AIChatPage"));
const AITranslatePage = lazy(() => import("./pages/ai/AITranslatePage"));
const AISettingsPage = lazy(() => import("./pages/ai/AISettingsPage"));
const AIWorkspaceQAPage = lazy(() => import("./pages/ai/AIWorkspaceQAPage"));
const AITaskGeneratorPage = lazy(
  () => import("./pages/ai/AITaskGeneratorPage"),
);
const AIMeetingSummaryPage = lazy(
  () => import("./pages/ai/AIMeetingSummaryPage"),
);
// Admin
const AdminPage = lazy(() => import("./pages/admin/AdminPage"));
const AdminBackupPage = lazy(() => import("./pages/admin/AdminBackupPage"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminAuditPage = lazy(() => import("./pages/admin/AdminAuditPage"));
const AdminAutomationPage = lazy(
  () => import("./pages/admin/AdminAutomationPage"),
);
const AdminAnalyticsPage = lazy(
  () => import("./pages/admin/AdminAnalyticsPage"),
);
const IntegrationsPage = lazy(() => import("./pages/admin/IntegrationsPage"));
const TimeReportsPage = lazy(() => import("./pages/admin/TimeReportsPage"));
const WeeklyTimesheetPage = lazy(
  () => import("./pages/admin/WeeklyTimesheetPage"),
);
const FormsPage = lazy(() => import("./pages/admin/FormsPage"));
const FormBuilderPage = lazy(() => import("./pages/admin/FormBuilderPage"));
const FormSubmissionsPage = lazy(
  () => import("./pages/admin/FormSubmissionsPage"),
);
// Whiteboards (standalone module)
const WhiteboardsListPage = lazy(
  () => import("./pages/whiteboards/WhiteboardsListPage"),
);
const WhiteboardsDetailPage = lazy(
  () => import("./pages/whiteboards/WhiteboardPage"),
);
// Goals
const GoalsPage = lazy(() => import("./pages/goals/GoalsPage"));
const GoalNewPage = lazy(() => import("./pages/goals/GoalNewPage"));
const GoalDetailPage = lazy(() => import("./pages/goals/GoalDetailPage"));
const GoalTimelinePage = lazy(() => import("./pages/goals/GoalTimelinePage"));
const _PublicGoalsPage = lazy(() => import("./pages/goals/PublicGoalsPage"));
// Settings
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
// Public
const PublicFormPage = lazy(() => import("./pages/forms/PublicFormPage"));
const InviteAcceptPage = lazy(() => import("./pages/invite/InviteAcceptPage"));

const pageFallback = <LoadingSpinner size="lg" fullPage />;

// ---- Workspace Layout Wrapper (reads :workspaceId from URL) ----
function WorkspaceLayout() {
  const match = router.state.location.pathname.match(/\/app\/([^/]+)/);
  const wsId = match?.[1];
  return (
    <Layout workspaceId={wsId}>
      <Suspense fallback={pageFallback}>
        <Outlet />
      </Suspense>
    </Layout>
  );
}

// ---- Auth Guard ----
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity, isLoginSuccess } = useInternetIdentity();
  if (!isLoginSuccess && !identity) {
    return <LoadingSpinner size="lg" fullPage label="Connecting..." />;
  }
  if (!identity) {
    throw redirect({ to: "/login" });
  }
  return <>{children}</>;
}

// ---- Root Route ----
const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Outlet />
    </ThemeProvider>
  ),
});

// ---- Public Routes ----
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={pageFallback}>
      <LandingPage />
    </Suspense>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <Suspense fallback={pageFallback}>
      <LoginPage />
    </Suspense>
  ),
});

const publicFormRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forms/$publicUrl",
  component: () => (
    <Suspense fallback={pageFallback}>
      <PublicFormPage />
    </Suspense>
  ),
});

const publicGoalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/public/goals/$shareToken",
  component: () => (
    <Suspense fallback={pageFallback}>
      <_PublicGoalsPage />
    </Suspense>
  ),
});

const inviteAcceptRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/invite/$token",
  component: () => (
    <Suspense fallback={pageFallback}>
      <InviteAcceptPage />
    </Suspense>
  ),
});

// ---- App Shell (Auth guard) ----
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app",
  component: () => (
    <AuthGuard>
      <Outlet />
    </AuthGuard>
  ),
});

// Redirect /app -> /app/:workspaceId/dashboard (or /app/workspaces/new if no workspace)
const appIndexRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/",
  beforeLoad: () => {
    const wsId = getWorkspaceId();
    if (wsId) {
      throw redirect({ to: `/app/${wsId}/dashboard` as "/" });
    }
    throw redirect({ to: "/app/workspaces/new" });
  },
  component: () => null,
});

// ---- Workspace management routes (no :workspaceId in URL) ----
const workspacesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/workspaces",
  component: () => (
    <Layout>
      <Suspense fallback={pageFallback}>
        <WorkspacesListPage />
      </Suspense>
    </Layout>
  ),
});

const workspaceNewRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/workspaces/new",
  component: () => (
    <Layout>
      <Suspense fallback={pageFallback}>
        <WorkspaceNewPage />
      </Suspense>
    </Layout>
  ),
});

// ---- Workspace-scoped app shell ----
const wsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/$workspaceId",
  component: WorkspaceLayout,
});

// Redirect /app/:workspaceId -> /app/:workspaceId/dashboard
const wsIndexRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/",
  beforeLoad: ({ params }) => {
    throw redirect({ to: `/app/${params.workspaceId}/dashboard` as "/" });
  },
  component: () => null,
});

const dashboardRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/dashboard",
  component: () => <DashboardPage />,
});

// Notes
const notesRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/notes",
  component: () => <NotesPage />,
});
const noteNewRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/notes/new",
  component: () => <NoteNewPage />,
});
const noteDetailRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/notes/$noteId",
  component: () => <NoteDetailPage />,
});
const noteTemplatesRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/notes/templates",
  component: () => <NoteTemplatesPage />,
});
const pagesRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/pages",
  component: () => <PagesPage />,
});
const pageNewRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/pages/new",
  component: () => <PageNewPage />,
});
const pageDetailRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/pages/$pageId",
  component: () => <PageDetailPage />,
});

// Projects
const projectsRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/projects",
  component: () => <ProjectsPage />,
});
const projectNewRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/projects/new",
  component: () => <ProjectNewPage />,
});
const projectDetailRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/projects/$projectId",
  component: () => <ProjectDetailPage />,
});
const taskDetailRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/projects/$projectId/tasks/$taskId",
  component: () => <TaskDetailPage />,
});
const timeTrackingRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/projects/$projectId/time-tracking",
  component: () => <TimeTrackingPage />,
});
const guestAccessRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/projects/$projectId/guests",
  component: () => <GuestAccessPage />,
});
const whiteboardRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/projects/$projectId/whiteboard/$whiteboardId",
  component: () => <WhiteboardPage />,
});
const sprintsRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/projects/$projectId/sprints",
  component: () => <SprintsPage />,
});
const sprintDetailRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/projects/$projectId/sprints/$sprintId",
  component: () => <SprintDetailPage />,
});
const milestonesRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/projects/$projectId/milestones",
  component: () => <MilestonesPage />,
});
const projectTemplatesRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/projects/$projectId/templates",
  component: () => <ProjectTemplatesPage />,
});

// Chat
const chatRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/chat",
  component: () => <ChatPage />,
});
const channelRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/chat/$channelId",
  component: () => <ChannelPage />,
});
const chatSearchRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/chat/search",
  component: () => <ChatSearchPage />,
});
const threadRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/chat/$channelId/thread/$messageId",
  component: () => <ThreadPage />,
});
const channelSettingsRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/chat/$channelId/settings",
  component: () => <ChannelSettingsPage />,
});

// Calendar
const calendarRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/calendar",
  component: () => <CalendarPage />,
});
const eventNewRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/calendar/new",
  component: () => <EventNewPage />,
});
const eventDetailRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/calendar/events/$eventId",
  component: () => <EventDetailPage />,
});
const calendarAvailabilityRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/calendar/availability",
  component: () => <AvailabilityPage />,
});
const calendarSettingsRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/calendar/settings",
  component: () => <CalendarSettingsPage />,
});

// Payroll
const payrollRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/payroll",
  component: () => <PayrollPage />,
});
const employeesRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/payroll/employees",
  component: () => <EmployeesPage />,
});
const employeeDetailRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/payroll/employees/$employeeId",
  component: () => <EmployeeDetailPage />,
});
const paySchedulesRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/payroll/schedules",
  component: () => <PaySchedulesPage />,
});
const contractorsRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/payroll/contractors",
  component: () => <ContractorsPage />,
});
const auditLogRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/payroll/audit-log",
  component: () => <AuditLogPage />,
});
const bulkApprovalRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/payroll/bulk-approval",
  component: () => <BulkApprovalPage />,
});
const offCycleRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/payroll/off-cycle",
  component: () => <OffCyclePaymentPage />,
});

// Escrow
const escrowRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/escrow",
  component: () => <EscrowPage />,
});
const escrowNewRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/escrow/new",
  component: () => <EscrowNewPage />,
});
const escrowDetailRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/escrow/$escrowId",
  component: () => <EscrowDetailPage />,
});

// Wallet
const walletRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/wallet",
  component: () => <WalletPage />,
});
const walletSendRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/wallet/send",
  component: () => <WalletSendPage />,
});
const walletRecurringRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/wallet/recurring",
  component: () => <WalletRecurringPage />,
});
const walletReceiveRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/wallet/receive",
  component: () => <WalletReceivePage />,
});
const walletSpendingLimitsRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/wallet/spending-limits",
  component: () => <WalletSpendingLimitsPage />,
});

// AI
const aiRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/ai",
  component: () => <AIHubPage />,
});
const aiContentRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/ai/content",
  component: () => <AIContentPage />,
});
const aiChatRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/ai/chat",
  component: () => <AIChatPage />,
});
const aiTranslateRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/ai/translate",
  component: () => <AITranslatePage />,
});
const aiSettingsRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/ai/settings",
  component: () => <AISettingsPage />,
});
const aiWorkspaceQARoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/ai/workspace-qa",
  component: () => <AIWorkspaceQAPage />,
});
const aiTaskGeneratorRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/ai/task-generator",
  component: () => <AITaskGeneratorPage />,
});
const aiMeetingSummaryRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/ai/meeting-summary",
  component: () => <AIMeetingSummaryPage />,
});

// Admin
const adminRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/admin",
  component: () => <AdminPage />,
});
const adminBackupRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/admin/backup",
  component: () => <AdminBackupPage />,
});
const adminUsersRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/admin/users",
  component: () => <AdminUsersPage />,
});
const adminAuditRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/admin/audit",
  component: () => <AdminAuditPage />,
});
const adminAutomationRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/admin/automation",
  component: () => <AdminAutomationPage />,
});
const adminAnalyticsRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/admin/analytics",
  component: () => <AdminAnalyticsPage />,
});
const integrationsRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/admin/integrations",
  component: () => <IntegrationsPage />,
});
const timeReportsRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/admin/time-reports",
  component: () => <TimeReportsPage />,
});
const weeklyTimesheetRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/admin/timesheet",
  component: () => <WeeklyTimesheetPage />,
});
const formsRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/admin/forms",
  component: () => <FormsPage />,
});
const formBuilderRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/admin/forms/$formId/builder",
  component: () => <FormBuilderPage />,
});
const formSubmissionsRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/admin/forms/$formId/submissions",
  component: () => <FormSubmissionsPage />,
});

// Settings
const settingsRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/settings",
  component: () => <SettingsPage />,
});
const workspaceSettingsRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/workspace/settings",
  component: () => <WorkspaceSettingsPage />,
});
const workspaceMembersRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/workspace/members",
  component: () => <WorkspaceMembersPage />,
});

// Goals
const goalsRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/goals",
  component: () => <GoalsPage />,
});
const goalNewRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/goals/new",
  component: () => <GoalNewPage />,
});
const goalDetailRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/goals/$goalId",
  component: () => <GoalDetailPage />,
});
const goalTimelineRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/goals/timeline",
  component: () => <GoalTimelinePage />,
});

// Whiteboards (standalone)
const whiteboardsRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/whiteboards",
  component: () => <WhiteboardsListPage />,
});
const whiteboardsDetailRoute = createRoute({
  getParentRoute: () => wsRoute,
  path: "/whiteboards/$whiteboardId",
  component: () => <WhiteboardsDetailPage />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  publicFormRoute,
  publicGoalsRoute,
  inviteAcceptRoute,
  appRoute.addChildren([
    appIndexRoute,
    workspacesRoute,
    workspaceNewRoute,
    wsRoute.addChildren([
      wsIndexRoute,
      dashboardRoute,
      notesRoute,
      noteNewRoute,
      noteDetailRoute,
      noteTemplatesRoute,
      pagesRoute,
      pageNewRoute,
      pageDetailRoute,
      projectsRoute,
      projectNewRoute,
      projectDetailRoute,
      taskDetailRoute,
      timeTrackingRoute,
      guestAccessRoute,
      whiteboardRoute,
      sprintsRoute,
      sprintDetailRoute,
      milestonesRoute,
      projectTemplatesRoute,
      chatRoute,
      chatSearchRoute,
      channelRoute,
      threadRoute,
      channelSettingsRoute,
      calendarRoute,
      eventNewRoute,
      eventDetailRoute,
      calendarAvailabilityRoute,
      calendarSettingsRoute,
      payrollRoute,
      employeesRoute,
      employeeDetailRoute,
      paySchedulesRoute,
      contractorsRoute,
      auditLogRoute,
      bulkApprovalRoute,
      offCycleRoute,
      escrowRoute,
      escrowNewRoute,
      escrowDetailRoute,
      walletRoute,
      walletSendRoute,
      walletRecurringRoute,
      walletReceiveRoute,
      walletSpendingLimitsRoute,
      aiRoute,
      aiContentRoute,
      aiChatRoute,
      aiTranslateRoute,
      aiSettingsRoute,
      aiWorkspaceQARoute,
      aiTaskGeneratorRoute,
      aiMeetingSummaryRoute,
      adminRoute,
      adminBackupRoute,
      adminUsersRoute,
      adminAuditRoute,
      adminAutomationRoute,
      adminAnalyticsRoute,
      integrationsRoute,
      timeReportsRoute,
      weeklyTimesheetRoute,
      formsRoute,
      formBuilderRoute,
      formSubmissionsRoute,
      settingsRoute,
      workspaceSettingsRoute,
      workspaceMembersRoute,
      goalsRoute,
      goalNewRoute,
      goalDetailRoute,
      goalTimelineRoute,
      whiteboardsRoute,
      whiteboardsDetailRoute,
    ]),
  ]),
]);

const router = createRouter({ routeTree });

// NOTE: Router type registration is intentionally omitted here.
// Existing page components still use legacy /app/* paths (pre-workspace-routing).
// They will be updated incrementally to workspace-scoped /app/:workspaceId/* paths.
// Once all pages are updated, restore strict typing:
// declare module "@tanstack/react-router" { interface Register { router: typeof router; } }

export default function App() {
  return <RouterProvider router={router} />;
}
