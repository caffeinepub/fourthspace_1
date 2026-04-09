import { cn } from "@/lib/utils";
import { useNavigate, useParams, useRouter } from "@tanstack/react-router";
import {
  CalendarDays,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";

interface TabDef {
  label: string;
  module: string;
  icon: React.ElementType;
}

const TABS: TabDef[] = [
  { label: "Dashboard", module: "dashboard", icon: LayoutDashboard },
  { label: "Notes", module: "notes", icon: FileText },
  { label: "Projects", module: "projects", icon: FolderKanban },
  { label: "Chat", module: "chat", icon: MessageSquare },
  { label: "Calendar", module: "calendar", icon: CalendarDays },
];

export function BottomTabBar() {
  const params = useParams({ strict: false }) as { workspaceId?: string };
  const navigate = useNavigate();
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const wsId = params.workspaceId ?? "";

  function isActive(module: string) {
    return wsId ? pathname.includes(`/${wsId}/${module}`) : false;
  }

  function navTo(module: string) {
    const href = wsId ? `/app/${wsId}/${module}` : "/app/workspaces/new";
    void navigate({ to: href as "/" });
  }

  return (
    <nav
      className="block md:hidden fixed bottom-0 left-0 right-0 z-40 rounded-tl-xl rounded-tr-xl border-t border-border/60 bg-card/95 backdrop-blur-xl shadow-lg"
      data-ocid="bottom-tab-bar"
      aria-label="Primary navigation"
    >
      <div className="flex items-stretch pb-safe">
        {TABS.map(({ label, module, icon: Icon }) => {
          const active = isActive(module);
          return (
            <button
              key={module}
              type="button"
              onClick={() => navTo(module)}
              data-ocid={`tab-${module}`}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] min-w-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center rounded-lg w-9 h-7 transition-colors duration-150",
                  active ? "bg-primary/10" : "bg-transparent",
                )}
              >
                <Icon
                  className="h-5 w-5 shrink-0"
                  strokeWidth={active ? 2.2 : 1.8}
                />
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium tracking-wide leading-none block",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomTabBar;
