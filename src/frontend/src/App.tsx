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
import { Layout } from "./components/Layout";
import { LoadingSpinner } from "./components/LoadingSpinner";

// ---- Lazy page imports ----
import { Suspense, lazy } from "react";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
// Notes
const NotesPage = lazy(() => import("./pages/notes/NotesPage"));
const NoteDetailPage = lazy(() => import("./pages/notes/NoteDetailPage"));
const NoteNewPage = lazy(() => import("./pages/notes/NoteNewPage"));
// Projects
const ProjectsPage = lazy(() => import("./pages/projects/ProjectsPage"));
const ProjectDetailPage = lazy(
  () => import("./pages/projects/ProjectDetailPage"),
);
const ProjectNewPage = lazy(() => import("./pages/projects/ProjectNewPage"));
const TaskDetailPage = lazy(() => import("./pages/projects/TaskDetailPage"));
// Chat
const ChatPage = lazy(() => import("./pages/chat/ChatPage"));
const ChannelPage = lazy(() => import("./pages/chat/ChannelPage"));
// Calendar
const CalendarPage = lazy(() => import("./pages/calendar/CalendarPage"));
const EventNewPage = lazy(() => import("./pages/calendar/EventNewPage"));
const EventDetailPage = lazy(() => import("./pages/calendar/EventDetailPage"));
// Payroll
const PayrollPage = lazy(() => import("./pages/payroll/PayrollPage"));
const EmployeesPage = lazy(() => import("./pages/payroll/EmployeesPage"));
const EmployeeDetailPage = lazy(
  () => import("./pages/payroll/EmployeeDetailPage"),
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
// AI
const AIHubPage = lazy(() => import("./pages/ai/AIHubPage"));
const AIContentPage = lazy(() => import("./pages/ai/AIContentPage"));
const AIChatPage = lazy(() => import("./pages/ai/AIChatPage"));
const AITranslatePage = lazy(() => import("./pages/ai/AITranslatePage"));
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
// Settings
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

const pageFallback = <LoadingSpinner size="lg" fullPage />;

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

// ---- App Shell ----
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app",
  component: () => (
    <AuthGuard>
      <Layout>
        <Suspense fallback={pageFallback}>
          <Outlet />
        </Suspense>
      </Layout>
    </AuthGuard>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/",
  component: () => <DashboardPage />,
});

// Notes
const notesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/notes",
  component: () => <NotesPage />,
});
const noteNewRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/notes/new",
  component: () => <NoteNewPage />,
});
const noteDetailRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/notes/$noteId",
  component: () => <NoteDetailPage />,
});

// Projects
const projectsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/projects",
  component: () => <ProjectsPage />,
});
const projectNewRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/projects/new",
  component: () => <ProjectNewPage />,
});
const projectDetailRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/projects/$projectId",
  component: () => <ProjectDetailPage />,
});
const taskDetailRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/projects/$projectId/tasks/$taskId",
  component: () => <TaskDetailPage />,
});

// Chat
const chatRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/chat",
  component: () => <ChatPage />,
});
const channelRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/chat/$channelId",
  component: () => <ChannelPage />,
});

// Calendar
const calendarRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/calendar",
  component: () => <CalendarPage />,
});
const eventNewRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/calendar/new",
  component: () => <EventNewPage />,
});
const eventDetailRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/calendar/$eventId",
  component: () => <EventDetailPage />,
});

// Payroll
const payrollRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/payroll",
  component: () => <PayrollPage />,
});
const employeesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/payroll/employees",
  component: () => <EmployeesPage />,
});
const employeeDetailRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/payroll/employees/$employeeId",
  component: () => <EmployeeDetailPage />,
});

// Escrow
const escrowRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/escrow",
  component: () => <EscrowPage />,
});
const escrowNewRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/escrow/new",
  component: () => <EscrowNewPage />,
});
const escrowDetailRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/escrow/$contractId",
  component: () => <EscrowDetailPage />,
});

// Wallet
const walletRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/wallet",
  component: () => <WalletPage />,
});
const walletSendRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/wallet/send",
  component: () => <WalletSendPage />,
});
const walletRecurringRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/wallet/recurring",
  component: () => <WalletRecurringPage />,
});

// AI
const aiRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/ai",
  component: () => <AIHubPage />,
});
const aiContentRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/ai/content",
  component: () => <AIContentPage />,
});
const aiChatRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/ai/chat",
  component: () => <AIChatPage />,
});
const aiTranslateRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/ai/translate",
  component: () => <AITranslatePage />,
});

// Admin
const adminRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/admin",
  component: () => <AdminPage />,
});
const adminBackupRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/admin/backup",
  component: () => <AdminBackupPage />,
});
const adminUsersRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/admin/users",
  component: () => <AdminUsersPage />,
});
const adminAuditRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/admin/audit",
  component: () => <AdminAuditPage />,
});
const adminAutomationRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/admin/automation",
  component: () => <AdminAutomationPage />,
});
const adminAnalyticsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/admin/analytics",
  component: () => <AdminAnalyticsPage />,
});

// Settings
const settingsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/settings",
  component: () => <SettingsPage />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  appRoute.addChildren([
    dashboardRoute,
    notesRoute,
    noteNewRoute,
    noteDetailRoute,
    projectsRoute,
    projectNewRoute,
    projectDetailRoute,
    taskDetailRoute,
    chatRoute,
    channelRoute,
    calendarRoute,
    eventNewRoute,
    eventDetailRoute,
    payrollRoute,
    employeesRoute,
    employeeDetailRoute,
    escrowRoute,
    escrowNewRoute,
    escrowDetailRoute,
    walletRoute,
    walletSendRoute,
    walletRecurringRoute,
    aiRoute,
    aiContentRoute,
    aiChatRoute,
    aiTranslateRoute,
    adminRoute,
    adminBackupRoute,
    adminUsersRoute,
    adminAuditRoute,
    adminAutomationRoute,
    adminAnalyticsRoute,
    settingsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
