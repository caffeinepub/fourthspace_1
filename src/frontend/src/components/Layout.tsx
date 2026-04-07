import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  DollarSign,
  FileText,
  FolderKanban,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  Sparkles,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { useWorkspace } from "../hooks/useWorkspace";
import { Role } from "../types";
import { ThemeToggle } from "./ThemeToggle";

const NAV_ITEMS = [
  {
    label: "Notes",
    href: "/app/notes",
    icon: FileText,
    accent: "text-indigo-500",
    bg: "bg-indigo-500/10",
    active: "bg-indigo-500",
  },
  {
    label: "Projects",
    href: "/app/projects",
    icon: FolderKanban,
    accent: "text-orange-500",
    bg: "bg-orange-500/10",
    active: "bg-orange-500",
  },
  {
    label: "Chat",
    href: "/app/chat",
    icon: MessageSquare,
    accent: "text-teal-500",
    bg: "bg-teal-500/10",
    active: "bg-teal-500",
  },
  {
    label: "Calendar",
    href: "/app/calendar",
    icon: CalendarDays,
    accent: "text-red-500",
    bg: "bg-red-500/10",
    active: "bg-red-500",
  },
  {
    label: "Payroll",
    href: "/app/payroll",
    icon: DollarSign,
    accent: "text-green-500",
    bg: "bg-green-500/10",
    active: "bg-green-500",
  },
  {
    label: "Escrow",
    href: "/app/escrow",
    icon: Shield,
    accent: "text-yellow-500",
    bg: "bg-yellow-500/10",
    active: "bg-yellow-500",
  },
  {
    label: "Wallet",
    href: "/app/wallet",
    icon: Wallet,
    accent: "text-pink-500",
    bg: "bg-pink-500/10",
    active: "bg-pink-500",
  },
  {
    label: "AI Tools",
    href: "/app/ai",
    icon: Sparkles,
    accent: "text-purple-500",
    bg: "bg-purple-500/10",
    active: "bg-purple-500",
  },
];

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const { workspace, userProfile } = useWorkspace();
  const router = useRouter();
  const pathname = router.state.location.pathname;

  const isAdmin = userProfile?.role === Role.Admin;
  const displayName = userProfile?.displayName ?? "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isActive = (href: string) => pathname.startsWith(href);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border px-4",
          collapsed ? "justify-center" : "gap-3",
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary">
          <span className="font-display text-sm font-bold text-primary-foreground">
            F
          </span>
        </div>
        {!collapsed && (
          <span className="font-display text-lg font-bold text-sidebar-foreground">
            Fourthspace
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav
        className="flex-1 overflow-y-auto p-3 space-y-0.5"
        data-ocid="sidebar-nav"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              data-ocid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-smooth",
                collapsed ? "justify-center px-2" : "",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                  active ? "bg-white/20" : item.bg,
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4",
                    active ? "text-primary-foreground" : item.accent,
                  )}
                />
              </div>
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {!collapsed && active && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white/80" />
              )}
            </Link>
          );
        })}

        {/* Divider + Admin/Settings */}
        <div className="my-2 border-t border-sidebar-border" />

        {isAdmin && (
          <Link
            to="/app/admin"
            onClick={() => setMobileOpen(false)}
            data-ocid="nav-admin"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-smooth",
              collapsed ? "justify-center px-2" : "",
              isActive("/app/admin")
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent",
            )}
          >
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                isActive("/app/admin") ? "bg-white/20" : "bg-muted/60",
              )}
            >
              <Settings
                className={cn(
                  "h-4 w-4",
                  isActive("/app/admin")
                    ? "text-primary-foreground"
                    : "text-muted-foreground",
                )}
              />
            </div>
            {!collapsed && <span className="text-sm font-medium">Admin</span>}
          </Link>
        )}

        <Link
          to="/app/settings"
          onClick={() => setMobileOpen(false)}
          data-ocid="nav-settings"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-smooth",
            collapsed ? "justify-center px-2" : "",
            isActive("/app/settings")
              ? "bg-primary text-primary-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent",
          )}
        >
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
              isActive("/app/settings") ? "bg-white/20" : "bg-muted/60",
            )}
          >
            <Settings
              className={cn(
                "h-4 w-4",
                isActive("/app/settings")
                  ? "text-primary-foreground"
                  : "text-muted-foreground",
              )}
            />
          </div>
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "w-full text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed ? "justify-center px-2" : "justify-start gap-2",
          )}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-smooth",
              collapsed ? "rotate-180" : "",
            )}
          />
          {!collapsed && <span className="text-sm">Collapse</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden flex-col bg-card border-r border-sidebar-border transition-all duration-300 md:flex",
          collapsed ? "w-16" : "w-64",
        )}
        data-ocid="sidebar"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            role="button"
            tabIndex={0}
            aria-label="Close menu"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-card border-r border-sidebar-border shadow-lg">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header
          className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-card px-4 shadow-sm"
          data-ocid="app-header"
        >
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="md:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Workspace Name */}
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {workspace?.name ?? "Fourthspace"}
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-1">
            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              data-ocid="notifications-btn"
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2 h-9"
                  data-ocid="user-menu-trigger"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:block max-w-[100px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild data-ocid="menu-profile">
                  <Link to="/app/settings" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile & Settings
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild data-ocid="menu-admin">
                    <Link to="/app/admin" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive"
                  data-ocid="menu-logout"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main
          className="flex-1 overflow-y-auto bg-background"
          data-ocid="main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
