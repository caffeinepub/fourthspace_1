import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNavigate, useRouter } from "@tanstack/react-router";
import {
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronsUpDown,
  DollarSign,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Plug,
  Plus,
  Settings,
  Shield,
  Sparkles,
  Target,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { useWorkspace } from "../hooks/useWorkspace";
import { Role } from "../types";
import { BottomTabBar } from "./BottomTabBar";
import { ThemeToggle } from "./ThemeToggle";

interface NavModuleDef {
  label: string;
  module: string;
  icon: React.ElementType;
  accent: string;
  bg: string;
}

const NAV_MODULES: NavModuleDef[] = [
  {
    label: "Dashboard",
    module: "dashboard",
    icon: LayoutDashboard,
    accent: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Notes",
    module: "notes",
    icon: FileText,
    accent: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    label: "Projects",
    module: "projects",
    icon: FolderKanban,
    accent: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    label: "Chat",
    module: "chat",
    icon: MessageSquare,
    accent: "text-teal-500",
    bg: "bg-teal-500/10",
  },
  {
    label: "Calendar",
    module: "calendar",
    icon: CalendarDays,
    accent: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    label: "Payroll",
    module: "payroll",
    icon: DollarSign,
    accent: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    label: "Escrow",
    module: "escrow",
    icon: Shield,
    accent: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    label: "Wallet",
    module: "wallet",
    icon: Wallet,
    accent: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    label: "AI Tools",
    module: "ai",
    icon: Sparkles,
    accent: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    label: "Goals",
    module: "goals",
    icon: Target,
    accent: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
];

interface LayoutProps {
  children: ReactNode;
  workspaceId?: string;
}

export function Layout({ children, workspaceId }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wsSwitcherOpen, setWsSwitcherOpen] = useState(false);
  const { logout } = useAuth();
  const { workspaces, activeWorkspace, setActiveWorkspace, userProfile } =
    useWorkspace();
  const router = useRouter();
  const navigate = useNavigate();
  const pathname = router.state.location.pathname;

  // Read sidebar icon-only preference from localStorage
  const [iconsOnly, setIconsOnly] = useState<boolean>(() => {
    try {
      return localStorage.getItem("fs_sidebar_icons_only") === "true";
    } catch {
      return false;
    }
  });

  // Listen for sidebar preference changes from SettingsPage
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === "fs_sidebar_icons_only") {
        setIconsOnly(e.newValue === "true");
      }
    }
    window.addEventListener("storage", handleStorage);
    // Also check on mount in case it was set in the same tab
    const check = () => {
      try {
        const val = localStorage.getItem("fs_sidebar_icons_only") === "true";
        setIconsOnly(val);
      } catch {
        // ignore
      }
    };
    window.addEventListener("fs_pref_changed", check);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("fs_pref_changed", check);
    };
  }, []);

  // Effective collapsed state: icon-only preference OR manual collapse
  const effectiveCollapsed = collapsed || iconsOnly;

  const prevPathnameRef = useRef(pathname);
  if (prevPathnameRef.current !== pathname) {
    prevPathnameRef.current = pathname;
    setMobileOpen(false);
  }

  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const wsId = workspaceId ?? activeWorkspace?.id ?? "";
  const isAdmin = userProfile?.role === Role.Admin;
  const displayName = userProfile?.displayName ?? "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isActive = (segment: string) =>
    wsId ? pathname.includes(`/${wsId}/${segment}`) : false;

  function navTo(path: string) {
    setMobileOpen(false);
    void navigate({ to: path as "/" });
  }

  function handleSwitchWorkspace(id: string) {
    setActiveWorkspace(id);
    setWsSwitcherOpen(false);
    setMobileOpen(false);
    void navigate({ to: `/app/${id}/dashboard` as "/" });
  }

  function handleLogoClick() {
    if (wsId) {
      navTo(`/app/${wsId}/dashboard`);
    } else {
      navTo("/app/workspaces");
    }
  }

  // ---- Workspace Switcher ----
  const workspaceSwitcher = (
    <div className={cn("px-2 pt-2 pb-1.5", effectiveCollapsed && "px-1.5")}>
      <DropdownMenu open={wsSwitcherOpen} onOpenChange={setWsSwitcherOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            data-ocid="workspace-switcher-trigger"
            className={cn(
              "flex w-full min-h-[44px] items-center rounded-lg border border-sidebar-border/70 bg-sidebar-accent/40 px-2.5 py-2 text-left transition-smooth hover:bg-sidebar-accent hover:border-sidebar-border active-press",
              effectiveCollapsed && "justify-center px-2",
            )}
            aria-label="Switch workspace"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary shadow-sm">
              <Building2 className="h-3 w-3 text-primary-foreground" />
            </div>
            {!effectiveCollapsed && (
              <>
                <div className="ml-2 flex-1 min-w-0">
                  <p className="truncate text-xs font-semibold text-sidebar-foreground leading-tight">
                    {activeWorkspace?.name ?? "Select Workspace"}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                    {workspaces.length} workspace
                    {workspaces.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 text-muted-foreground/70" />
              </>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={4}
          className="w-[min(224px,calc(100vw-24px))] shadow-dropdown border-border bg-popover/95 backdrop-blur-subtle"
          data-ocid="workspace-switcher-menu"
        >
          {workspaces.length === 0 && (
            <div className="px-3 py-4 text-center text-xs text-muted-foreground">
              No workspaces yet
            </div>
          )}
          {workspaces.map((ws) => (
            <DropdownMenuItem
              key={ws.id}
              onClick={() => handleSwitchWorkspace(ws.id)}
              className="flex items-center gap-2.5 cursor-pointer py-2 min-h-[44px]"
              data-ocid={`workspace-item-${ws.id}`}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
                <Building2 className="h-3 w-3 text-primary" />
              </div>
              <span className="flex-1 truncate text-xs font-medium">
                {ws.name}
              </span>
              {ws.id === wsId && (
                <Check className="h-3 w-3 text-primary shrink-0" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setWsSwitcherOpen(false);
              navTo("/app/workspaces/new");
            }}
            className="flex items-center gap-2.5 cursor-pointer py-2 min-h-[44px]"
            data-ocid="create-workspace-btn"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted border border-border">
              <Plus className="h-3 w-3 text-muted-foreground" />
            </div>
            <span className="text-xs font-medium">Create workspace</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  // ---- Nav Link Helper ----
  function NavLink({
    segment,
    label,
    icon: Icon,
    accent,
    bg,
    ocid,
    isMobile,
  }: {
    segment: string;
    label: string;
    icon: React.ElementType;
    accent: string;
    bg: string;
    ocid: string;
    isMobile?: boolean;
  }) {
    const active = isActive(segment);
    const href = wsId ? `/app/${wsId}/${segment}` : "/app/workspaces/new";
    // On mobile drawer, always show label. On desktop, follow collapsed state.
    const showLabel = isMobile || !effectiveCollapsed;

    const linkEl = (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          navTo(href);
        }}
        data-ocid={ocid}
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2.5 transition-smooth cursor-pointer group",
          "min-h-[44px]",
          !showLabel && "justify-center px-2",
          active
            ? "bg-primary/15 text-primary"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
        )}
      >
        <div
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded",
            active ? "bg-primary/20" : bg,
          )}
        >
          <Icon className={cn("h-3 w-3", active ? "text-primary" : accent)} />
        </div>
        {showLabel && (
          <span className="text-xs font-medium tracking-tight">{label}</span>
        )}
        {showLabel && active && (
          <div className="ml-auto h-1 w-1 rounded-full bg-primary" />
        )}
      </a>
    );

    if (!showLabel) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {label}
          </TooltipContent>
        </Tooltip>
      );
    }
    return linkEl;
  }

  function UtilNavLink({
    segment,
    label,
    icon: Icon,
    ocid,
    isMobile,
  }: {
    segment: string;
    label: string;
    icon: React.ElementType;
    ocid: string;
    isMobile?: boolean;
  }) {
    const active = isActive(segment);
    const href = wsId ? `/app/${wsId}/${segment}` : "/app/workspaces/new";
    const showLabel = isMobile || !effectiveCollapsed;

    const linkEl = (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          navTo(href);
        }}
        data-ocid={ocid}
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2.5 transition-smooth cursor-pointer",
          "min-h-[44px]",
          !showLabel && "justify-center px-2",
          active
            ? "bg-primary/15 text-primary"
            : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
        )}
      >
        <div
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded",
            active ? "bg-primary/20" : "bg-muted/40",
          )}
        >
          <Icon
            className={cn(
              "h-3 w-3",
              active ? "text-primary" : "text-muted-foreground",
            )}
          />
        </div>
        {showLabel && (
          <span className="text-xs font-medium tracking-tight">{label}</span>
        )}
      </a>
    );

    if (!showLabel) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {label}
          </TooltipContent>
        </Tooltip>
      );
    }
    return linkEl;
  }

  // ---- Sidebar Content (shared between desktop and mobile) ----
  function SidebarContent({ isMobile = false }: { isMobile?: boolean }) {
    return (
      <div className="flex h-full flex-col">
        {/* Logo — clickable, navigates to dashboard */}
        <div
          className={cn(
            "flex h-14 items-center border-b border-sidebar-border/60 px-3",
            !isMobile && effectiveCollapsed ? "justify-center" : "gap-2.5",
          )}
        >
          <button
            type="button"
            onClick={handleLogoClick}
            aria-label="Go to dashboard"
            className={cn(
              "flex items-center rounded-md transition-smooth hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isMobile || !effectiveCollapsed ? "gap-2.5" : "",
            )}
            data-ocid="logo-home-btn"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary shadow-sm">
              <span className="font-display text-xs font-bold text-primary-foreground">
                F
              </span>
            </div>
            {(isMobile || !effectiveCollapsed) && (
              <span className="font-display text-sm font-bold text-sidebar-foreground tracking-tight">
                Fourthspace
              </span>
            )}
          </button>
          {/* Close button on mobile */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="ml-auto h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Workspace Switcher */}
        {workspaceSwitcher}

        {/* Divider */}
        <div
          className={cn(
            "mx-2 mb-1 border-t border-sidebar-border/40",
            !isMobile && effectiveCollapsed && "mx-1.5",
          )}
        />

        {/* Nav Items */}
        <TooltipProvider delayDuration={0}>
          <nav
            className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5"
            data-ocid="sidebar-nav"
          >
            {NAV_MODULES.map((item) => (
              <NavLink
                key={item.module}
                segment={item.module}
                label={item.label}
                icon={item.icon}
                accent={item.accent}
                bg={item.bg}
                ocid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
                isMobile={isMobile}
              />
            ))}

            <div className="my-2 border-t border-sidebar-border/40" />

            {isAdmin && wsId && (
              <UtilNavLink
                segment="admin"
                label="Admin"
                icon={Settings}
                ocid="nav-admin"
                isMobile={isMobile}
              />
            )}
            {isAdmin && wsId && (
              <UtilNavLink
                segment="admin/integrations"
                label="Integrations"
                icon={Plug}
                ocid="nav-integrations"
                isMobile={isMobile}
              />
            )}
            {wsId && (
              <UtilNavLink
                segment="settings"
                label="Settings"
                icon={Settings}
                ocid="nav-settings"
                isMobile={isMobile}
              />
            )}
          </nav>
        </TooltipProvider>

        {/* Collapse Toggle — desktop only, hidden when icons-only pref is set */}
        {!isMobile && !iconsOnly && (
          <div className="border-t border-sidebar-border/40 p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={cn(
                "w-full h-9 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 transition-smooth text-xs",
                collapsed ? "justify-center px-0" : "justify-start gap-2 px-2",
              )}
            >
              <ChevronLeft
                className={cn(
                  "h-3 w-3 transition-smooth duration-200",
                  collapsed ? "rotate-180" : "",
                )}
              />
              {!collapsed && <span className="text-xs">Collapse</span>}
            </Button>
          </div>
        )}

        {/* Bottom safe area on mobile */}
        {isMobile && <div className="pb-safe h-6 shrink-0" />}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden flex-col bg-card border-r border-sidebar-border/60 transition-all duration-200 md:flex shrink-0",
          effectiveCollapsed ? "w-[52px]" : "w-56",
        )}
        data-ocid="sidebar"
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" id="mobile-sidebar">
          {/* Backdrop */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
                setMobileOpen(false);
              }
            }}
          />
          {/* Drawer panel */}
          <dialog
            open
            aria-label="Navigation menu"
            className="absolute left-0 top-0 m-0 h-full w-64 max-w-[85vw] p-0 bg-card border-0 border-r border-sidebar-border/60 shadow-mobile-drawer animate-slide-in-left"
          >
            <SidebarContent isMobile />
          </dialog>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header
          className="flex h-14 md:h-12 shrink-0 items-center gap-2 md:gap-3 border-b border-border/60 bg-card/90 backdrop-blur-sm px-3 md:px-4"
          data-ocid="app-header"
        >
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-sidebar"
            className="md:hidden min-h-[44px] min-w-[44px] h-9 w-9 text-foreground/70 hover:text-foreground"
            data-ocid="mobile-menu-toggle"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Page label / workspace name — clickable to go to dashboard */}
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex-1 min-w-0 text-left group"
            aria-label="Go to dashboard"
            data-ocid="header-logo-btn"
          >
            <p className="truncate text-xs font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors duration-150">
              {activeWorkspace?.name ?? "Fourthspace"}
            </p>
          </button>

          {/* Header Actions */}
          <div className="flex items-center gap-0.5">
            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              data-ocid="notifications-btn"
              className="min-h-[44px] min-w-[44px] h-8 w-8 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Bell className="h-4 w-4 md:h-3.5 md:w-3.5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1.5 px-1.5 min-h-[44px] h-9 ml-0.5"
                  data-ocid="user-menu-trigger"
                >
                  <Avatar className="h-6 w-6 md:h-5 md:w-5">
                    <AvatarFallback className="bg-primary text-primary-foreground text-[9px] font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-xs font-medium md:block max-w-[80px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-44 shadow-dropdown border-border bg-popover/95 backdrop-blur-subtle"
              >
                <DropdownMenuItem
                  onClick={() =>
                    navTo(wsId ? `/app/${wsId}/settings` : "/app/workspaces")
                  }
                  data-ocid="menu-profile"
                  className="flex items-center gap-2 text-xs py-2.5 min-h-[44px]"
                >
                  <User className="h-3.5 w-3.5" />
                  Profile & Settings
                </DropdownMenuItem>
                {isAdmin && wsId && (
                  <DropdownMenuItem
                    onClick={() => navTo(`/app/${wsId}/admin`)}
                    data-ocid="menu-admin"
                    className="flex items-center gap-2 text-xs py-2.5 min-h-[44px]"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive text-xs py-2.5 min-h-[44px]"
                  data-ocid="menu-logout"
                >
                  <LogOut className="h-3.5 w-3.5 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main
          className="flex-1 overflow-y-auto bg-background animate-fade-in-up pb-16 md:pb-0"
          data-ocid="main-content"
        >
          {children}
        </main>
      </div>

      {/* Bottom Tab Bar — mobile only */}
      <BottomTabBar />
    </div>
  );
}

export default Layout;
