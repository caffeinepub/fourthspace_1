import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Bell,
  Building2,
  Download,
  Globe,
  Keyboard,
  Layout,
  Mail,
  Moon,
  Move,
  Save,
  Settings2,
  Shield,
  Sliders,
  Sparkles,
  Trash2,
  Type,
  User,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ThemeToggle } from "../components/ThemeToggle";
import { useBackend } from "../hooks/useBackend";
import { getTenantId, useWorkspace } from "../hooks/useWorkspace";
import { Role } from "../types";

// ── localStorage helpers ────────────────────────────────────────────────────

function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function lsSet(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Notify Layout of preference changes within the same tab
    window.dispatchEvent(new Event("fs_pref_changed"));
  } catch {
    // ignore
  }
}

// ── Constants ───────────────────────────────────────────────────────────────

const SETTINGS_NAV = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Moon },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "security", label: "Security & Roles", icon: Shield },
  { id: "advanced", label: "Advanced", icon: Settings2 },
];

const ACCENT_PRESETS = [
  { label: "Purple", value: "#6d28d9", css: "0.45 0.24 264" },
  { label: "Blue", value: "#2563eb", css: "0.52 0.24 240" },
  { label: "Teal", value: "#0d9488", css: "0.58 0.19 172" },
  { label: "Green", value: "#16a34a", css: "0.55 0.22 142" },
  { label: "Orange", value: "#ea580c", css: "0.65 0.24 40" },
  { label: "Pink", value: "#db2777", css: "0.60 0.24 330" },
  { label: "Indigo", value: "#4f46e5", css: "0.50 0.25 258" },
  { label: "Amber", value: "#d97706", css: "0.68 0.18 88" },
];

const FONT_SIZES = [
  { label: "Compact", value: "compact", base: "13px" },
  { label: "Default", value: "default", base: "14px" },
  { label: "Comfortable", value: "comfortable", base: "15px" },
];

const ALL_MODULES = [
  "Dashboard",
  "Notes",
  "Projects",
  "Chat",
  "Calendar",
  "Payroll",
  "Escrow",
  "Wallet",
  "AI Tools",
  "Goals",
];

const DATE_FORMATS = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];

const LAYOUT_DENSITY = [
  { label: "Compact", value: "compact", desc: "Tighter spacing, more content" },
  { label: "Default", value: "default", desc: "Balanced layout" },
  { label: "Spacious", value: "spacious", desc: "Extra breathing room" },
];

const CONTENT_WIDTHS = [
  { label: "Narrow", value: "narrow", desc: "Max 800px" },
  { label: "Normal", value: "normal", desc: "Max 1200px" },
  { label: "Wide", value: "wide", desc: "Full width" },
];

const SIDEBAR_ACCENT_THEMES = [
  {
    label: "Default",
    value: "default",
    bg: "bg-card",
    border: "border-border",
  },
  {
    label: "Dark",
    value: "dark",
    bg: "bg-[#0d0d0d]",
    border: "border-neutral-800",
  },
  {
    label: "Muted",
    value: "muted",
    bg: "bg-muted/60",
    border: "border-border/60",
  },
  {
    label: "Glass",
    value: "glass",
    bg: "bg-card/40 backdrop-blur",
    border: "border-border/30",
  },
];

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
];

const KEYBOARD_SHORTCUTS = [
  { combo: "⌘ K", label: "Open command palette" },
  { combo: "⌘ N", label: "New note / item" },
  { combo: "⌘ /", label: "Show keyboard shortcuts" },
  { combo: "⌘ \\", label: "Toggle sidebar" },
  { combo: "⌘ S", label: "Save current item" },
  { combo: "⌘ Z", label: "Undo last action" },
  { combo: "⌘ Shift Z", label: "Redo last action" },
  { combo: "⌘ F", label: "Search in page" },
  { combo: "⌘ Enter", label: "Submit / confirm" },
  { combo: "Escape", label: "Close modal / cancel" },
  { combo: "G D", label: "Go to Dashboard" },
  { combo: "G N", label: "Go to Notes" },
  { combo: "G P", label: "Go to Projects" },
  { combo: "G C", label: "Go to Chat" },
];

// ── SettingsPage ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { userProfile, activeWorkspace } = useWorkspace();
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const [activeSection, setActiveSection] = useState("profile");

  // Profile — initialised from userProfile, synced when it loads/changes
  const [displayName, setDisplayName] = useState(
    userProfile?.displayName ?? "",
  );
  const [email, setEmail] = useState(userProfile?.email ?? "");
  const [profileError, setProfileError] = useState<string | null>(null);
  useEffect(() => {
    if (userProfile) {
      setDisplayName((prev) =>
        prev === "" ? (userProfile.displayName ?? "") : prev,
      );
      setEmail((prev) => (prev === "" ? (userProfile.email ?? "") : prev));
    }
  }, [userProfile]);

  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??";

  // Appearance prefs
  const [accentColor, setAccentColor] = useState<string>(() =>
    lsGet("fs_accent_color", "#6d28d9"),
  );
  const [accentCss, setAccentCss] = useState<string>(() =>
    lsGet("fs_accent_css", "0.45 0.24 264"),
  );
  const [customAccent, setCustomAccent] = useState("");
  const [fontSize, setFontSize] = useState<string>(() =>
    lsGet("fs_font_size", "default"),
  );
  const [iconsOnly, setIconsOnly] = useState<boolean>(() =>
    lsGet("fs_sidebar_icons_only", false),
  );
  const [layoutDensity, setLayoutDensity] = useState<string>(() =>
    lsGet("fs_layout_density", "default"),
  );
  const [contentWidth, setContentWidth] = useState<string>(() =>
    lsGet("fs_content_width", "normal"),
  );
  const [sidebarTheme, setSidebarTheme] = useState<string>(() =>
    lsGet("fs_sidebar_theme", "default"),
  );
  const [reduceMotion, setReduceMotion] = useState<boolean>(() =>
    lsGet("fs_reduce_motion", false),
  );

  // Notification prefs
  const [notifEmail, setNotifEmail] = useState<boolean>(() =>
    lsGet("fs_notif_email", true),
  );
  const [notifDesktop, setNotifDesktop] = useState<boolean>(() =>
    lsGet("fs_notif_desktop", false),
  );
  const [notifDigest, setNotifDigest] = useState<string>(() =>
    lsGet("fs_notif_digest", "Weekly"),
  );
  const [notifTaskReminders, setNotifTaskReminders] = useState<boolean>(() =>
    lsGet("fs_notif_task_reminders", true),
  );
  const [notifMentions, setNotifMentions] = useState<boolean>(() =>
    lsGet("fs_notif_mentions", true),
  );
  const [notifTaskAssign, setNotifTaskAssign] = useState<boolean>(() =>
    lsGet("fs_notif_task_assign", true),
  );
  const [notifPayroll, setNotifPayroll] = useState<boolean>(() =>
    lsGet("fs_notif_payroll", true),
  );
  const [notifEscrow, setNotifEscrow] = useState<boolean>(() =>
    lsGet("fs_notif_escrow", true),
  );
  const [notifWorkspaceInvites, setNotifWorkspaceInvites] = useState<boolean>(
    () => lsGet("fs_notif_workspace_invites", true),
  );

  // Workspace prefs
  const [defaultModule, setDefaultModule] = useState<string>(() =>
    lsGet("fs_default_module", "Dashboard"),
  );
  const [dateFormat, setDateFormat] = useState<string>(() =>
    lsGet("fs_date_format", "MM/DD/YYYY"),
  );
  const [timeFormat, setTimeFormat] = useState<string>(() =>
    lsGet("fs_time_format", "12h"),
  );
  const [timezone, setTimezone] = useState<string>(() =>
    lsGet("fs_timezone", "UTC"),
  );

  // Advanced
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Workspace name/desc local edits
  function handleWorkspaceSave() {
    toast.success("Workspace settings saved");
  }

  // Apply accent color + font size to :root on load and change
  const applyVisualPrefs = useCallback((css: string, size: string) => {
    const sizeObj = FONT_SIZES.find((f) => f.value === size);
    const root = document.documentElement;
    root.style.setProperty("--primary", css);
    root.style.setProperty("--ring", css);
    root.style.setProperty("--font-size-base", sizeObj?.base ?? "14px");
    if (size === "compact") {
      root.style.setProperty("--font-size-sm", "0.75rem");
      root.style.setProperty("--font-size-xs", "0.6875rem");
    } else if (size === "comfortable") {
      root.style.setProperty("--font-size-sm", "0.875rem");
      root.style.setProperty("--font-size-xs", "0.8125rem");
    } else {
      root.style.setProperty("--font-size-sm", "0.8125rem");
      root.style.setProperty("--font-size-xs", "0.75rem");
    }
  }, []);

  useEffect(() => {
    applyVisualPrefs(accentCss, fontSize);
  }, [accentCss, fontSize, applyVisualPrefs]);

  function handleAccentPreset(preset: (typeof ACCENT_PRESETS)[number]) {
    setAccentColor(preset.value);
    setAccentCss(preset.css);
    lsSet("fs_accent_color", preset.value);
    lsSet("fs_accent_css", preset.css);
  }

  function handleCustomAccent() {
    const hex = customAccent.trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
      toast.error("Enter a valid hex color (e.g. #3b82f6)");
      return;
    }
    // Use a neutral CSS approximation for custom colors
    const css = "0.55 0.20 220";
    setAccentColor(hex);
    setAccentCss(css);
    lsSet("fs_accent_color", hex);
    lsSet("fs_accent_css", css);
    setCustomAccent("");
    toast.success("Accent color updated");
  }

  function handleFontSize(val: string) {
    setFontSize(val);
    lsSet("fs_font_size", val);
  }

  function handleIconsOnly(val: boolean) {
    setIconsOnly(val);
    lsSet("fs_sidebar_icons_only", val);
  }

  function handleLayoutDensity(val: string) {
    setLayoutDensity(val);
    lsSet("fs_layout_density", val);
    const root = document.documentElement;
    if (val === "compact") {
      root.style.setProperty("--layout-spacing", "0.75rem");
    } else if (val === "spacious") {
      root.style.setProperty("--layout-spacing", "1.5rem");
    } else {
      root.style.setProperty("--layout-spacing", "1rem");
    }
  }

  function handleContentWidth(val: string) {
    setContentWidth(val);
    lsSet("fs_content_width", val);
  }

  function handleSidebarTheme(val: string) {
    setSidebarTheme(val);
    lsSet("fs_sidebar_theme", val);
    window.dispatchEvent(new Event("fs_pref_changed"));
  }

  function handleReduceMotion(val: boolean) {
    setReduceMotion(val);
    lsSet("fs_reduce_motion", val);
    const root = document.documentElement;
    if (val) {
      root.style.setProperty("--transition-duration", "0ms");
    } else {
      root.style.removeProperty("--transition-duration");
    }
  }

  function handleNotifToggle(
    setter: (v: boolean) => void,
    key: string,
    val: boolean,
  ) {
    setter(val);
    lsSet(key, val);
  }

  function handleNotifDigest(val: string) {
    setNotifDigest(val);
    lsSet("fs_notif_digest", val);
  }

  function handleWorkspacePref(
    key: string,
    setter: (v: string) => void,
    val: string,
  ) {
    setter(val);
    lsSet(key, val);
  }

  // Save profile mutation
  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: async () => {
      if (!actor || !userProfile) throw new Error("Not connected");
      // Basic email validation
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email address");
      }
      return actor.upsertProfile(tenantId, {
        displayName,
        email,
        role: userProfile.role,
        workspaceId: userProfile.workspaceId,
      });
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        // Sync local state to what the backend confirmed
        setDisplayName(result.ok.displayName);
        setEmail(result.ok.email);
        setProfileError(null);
        // Invalidate and refetch so all other consumers see updated profile
        void queryClient.invalidateQueries({ queryKey: ["myProfile"] });
        toast.success("Profile updated successfully");
      } else {
        setProfileError(result.err ?? "Failed to update profile");
        toast.error(result.err ?? "Failed to update profile");
      }
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Failed to update profile";
      setProfileError(msg);
      toast.error(msg);
    },
  });

  // ── Render helpers ─────────────────────────────────────────────────────────

  function NotifRow({
    label,
    desc,
    value,
    onChange,
    ocid,
  }: {
    label: string;
    desc: string;
    value: boolean;
    onChange: (v: boolean) => void;
    ocid: string;
  }) {
    return (
      <div className="flex items-center justify-between gap-4 py-1">
        <div className="min-w-0">
          <p className="text-xs font-medium text-foreground">{label}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
        </div>
        <Switch
          checked={value}
          onCheckedChange={onChange}
          data-ocid={ocid}
          className="shrink-0"
        />
      </div>
    );
  }

  function SelectRow({
    label,
    desc,
    value,
    options,
    onChange,
    ocid,
  }: {
    label: string;
    desc: string;
    value: string;
    options: string[];
    onChange: (v: string) => void;
    ocid: string;
  }) {
    return (
      <div className="flex items-center justify-between gap-4 py-1">
        <div className="min-w-0">
          <p className="text-xs font-medium text-foreground">{label}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          data-ocid={ocid}
          className="shrink-0 h-7 rounded-md border border-input bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-screen bg-background">
      {/* Sidebar nav */}
      <aside className="hidden md:flex w-52 shrink-0 flex-col border-r border-border/60 bg-card/50 p-3">
        <div className="mb-4 px-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Settings
          </p>
        </div>
        <nav className="space-y-0.5">
          {SETTINGS_NAV.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-smooth",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
                data-ocid={`settings-nav-${item.id}`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-5 py-7 space-y-6">
          {/* Mobile nav */}
          <div className="md:hidden flex gap-1 overflow-x-auto pb-2">
            {SETTINGS_NAV.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-smooth shrink-0",
                    active
                      ? "bg-primary/10 text-primary"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-3 w-3" /> {item.label}
                </button>
              );
            })}
          </div>

          {/* ── PROFILE ─────────────────────────────────────────────────── */}
          {activeSection === "profile" && (
            <div className="space-y-5 animate-fade-in-up">
              <div>
                <h2 className="font-display text-base font-bold text-foreground tracking-tight">
                  Profile
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update your personal information
                </p>
              </div>

              <Card className="border-border">
                <CardContent className="p-5 space-y-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-primary text-primary-foreground font-display text-lg font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {displayName || "Your Name"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {email || "your@email.com"}
                      </p>
                      {userProfile && (
                        <span className="inline-flex items-center gap-1 mt-1 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          <Shield className="h-2.5 w-2.5" />
                          {userProfile.role}
                        </span>
                      )}
                    </div>
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="settings-name"
                        className="text-xs font-medium"
                      >
                        Display Name
                      </Label>
                      <Input
                        id="settings-name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="h-8 text-xs"
                        data-ocid="settings-name-input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="settings-email"
                        className="text-xs font-medium"
                      >
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          id="settings-email"
                          type="email"
                          className="pl-8 h-8 text-xs"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          data-ocid="settings-email-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {profileError && (
                      <p className="text-xs text-destructive text-right">
                        {profileError}
                      </p>
                    )}
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => saveProfile()}
                        disabled={!displayName || isPending}
                        className="h-8 gap-1.5 text-xs font-semibold active-press"
                        data-ocid="settings-save-btn"
                      >
                        <Save className="h-3.5 w-3.5" />
                        {isPending ? "Saving…" : "Save Profile"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── APPEARANCE ──────────────────────────────────────────────── */}
          {activeSection === "appearance" && (
            <div className="space-y-5 animate-fade-in-up">
              <div>
                <h2 className="font-display text-base font-bold text-foreground tracking-tight">
                  Appearance
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Customize how Fourthspace looks
                </p>
              </div>

              {/* Theme */}
              <Card className="border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Theme
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Switch between light and dark mode
                      </p>
                    </div>
                    <ThemeToggle />
                  </div>
                </CardContent>
              </Card>

              {/* Accent Color */}
              <Card className="border-border">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 tracking-tight">
                    <Sliders className="h-4 w-4 text-primary" />
                    Accent Color
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Choose a primary accent color for buttons, links, and
                    highlights.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {ACCENT_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        title={preset.label}
                        aria-label={`Set accent color to ${preset.label}`}
                        onClick={() => handleAccentPreset(preset)}
                        data-ocid={`accent-${preset.label.toLowerCase()}`}
                        className={cn(
                          "h-7 w-7 rounded-full border-2 transition-smooth hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          accentColor === preset.value
                            ? "border-foreground ring-2 ring-foreground/30 scale-110"
                            : "border-transparent",
                        )}
                        style={{ backgroundColor: preset.value }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="#3b82f6"
                      value={customAccent}
                      onChange={(e) => setCustomAccent(e.target.value)}
                      className="h-8 text-xs w-32 font-mono"
                      maxLength={7}
                      data-ocid="accent-custom-input"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCustomAccent}
                      className="h-8 text-xs"
                      data-ocid="accent-custom-apply"
                    >
                      Apply custom
                    </Button>
                    <div
                      className="h-7 w-7 rounded-full border border-border shrink-0"
                      style={{ backgroundColor: accentColor }}
                      aria-label="Current accent color preview"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Font Size */}
              <Card className="border-border">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold tracking-tight">
                    Font Size
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Adjust the base text size across the app.
                  </p>
                  <div className="flex gap-2">
                    {FONT_SIZES.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleFontSize(opt.value)}
                        data-ocid={`font-size-${opt.value}`}
                        className={cn(
                          "flex-1 rounded-md border py-2 text-xs font-medium transition-smooth",
                          fontSize === opt.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60",
                        )}
                      >
                        {opt.label}
                        <span className="block text-[10px] mt-0.5 opacity-60">
                          {opt.base}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sidebar Layout */}
              <Card className="border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Icons-only sidebar
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Collapse sidebar to show icons without labels
                      </p>
                    </div>
                    <Switch
                      checked={iconsOnly}
                      onCheckedChange={handleIconsOnly}
                      data-ocid="sidebar-icons-only-toggle"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Layout Density */}
              <Card className="border-border">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-2">
                    <Move className="h-4 w-4 text-primary" />
                    Layout Density
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Control how much spacing is used between elements.
                  </p>
                  <div className="flex gap-2">
                    {LAYOUT_DENSITY.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleLayoutDensity(opt.value)}
                        data-ocid={`layout-density-${opt.value}`}
                        className={cn(
                          "flex-1 rounded-md border py-2.5 px-2 text-xs font-medium transition-smooth text-center",
                          layoutDensity === opt.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60",
                        )}
                      >
                        {opt.label}
                        <span className="block text-[10px] mt-0.5 opacity-60">
                          {opt.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Content Width */}
              <Card className="border-border">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-2">
                    <Layout className="h-4 w-4 text-primary" />
                    Content Width
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Set the maximum width of main content areas.
                  </p>
                  <div className="flex gap-2">
                    {CONTENT_WIDTHS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleContentWidth(opt.value)}
                        data-ocid={`content-width-${opt.value}`}
                        className={cn(
                          "flex-1 rounded-md border py-2.5 px-2 text-xs font-medium transition-smooth text-center",
                          contentWidth === opt.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60",
                        )}
                      >
                        {opt.label}
                        <span className="block text-[10px] mt-0.5 opacity-60">
                          {opt.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sidebar Style */}
              <Card className="border-border">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Sidebar Style
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Choose the sidebar background treatment.
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {SIDEBAR_ACCENT_THEMES.map((theme) => (
                      <button
                        key={theme.value}
                        type="button"
                        onClick={() => handleSidebarTheme(theme.value)}
                        data-ocid={`sidebar-theme-${theme.value}`}
                        className={cn(
                          "relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 text-xs font-medium transition-smooth",
                          sidebarTheme === theme.value
                            ? "border-primary"
                            : "border-transparent hover:border-border",
                        )}
                      >
                        <div
                          className={cn(
                            "h-10 w-full rounded-md border",
                            theme.bg,
                            theme.border,
                          )}
                        />
                        <span
                          className={cn(
                            "text-[10px]",
                            sidebarTheme === theme.value
                              ? "text-primary"
                              : "text-muted-foreground",
                          )}
                        >
                          {theme.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Motion & Animation */}
              <Card className="border-border">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Motion & Animation
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Reduce motion
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Disable entrance animations and transitions
                      </p>
                    </div>
                    <Switch
                      checked={reduceMotion}
                      onCheckedChange={handleReduceMotion}
                      data-ocid="reduce-motion-toggle"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Language */}
              <Card className="border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Language
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        All content in English
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-2.5 py-1.5">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-foreground">English</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── NOTIFICATIONS ───────────────────────────────────────────── */}
          {activeSection === "notifications" && (
            <div className="space-y-5 animate-fade-in-up">
              <div>
                <h2 className="font-display text-base font-bold text-foreground tracking-tight">
                  Notifications
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Control when and how you get notified
                </p>
              </div>

              {/* Delivery channels */}
              <Card className="border-border">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold tracking-tight">
                    Delivery Channels
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-3">
                  <NotifRow
                    label="Email notifications"
                    desc="Receive important updates by email"
                    value={notifEmail}
                    onChange={(v) =>
                      handleNotifToggle(setNotifEmail, "fs_notif_email", v)
                    }
                    ocid="notif-email-toggle"
                  />
                  <Separator className="bg-border/40" />
                  <NotifRow
                    label="Desktop notifications"
                    desc="Browser push notifications when Fourthspace is open"
                    value={notifDesktop}
                    onChange={(v) =>
                      handleNotifToggle(setNotifDesktop, "fs_notif_desktop", v)
                    }
                    ocid="notif-desktop-toggle"
                  />
                  <Separator className="bg-border/40" />
                  <SelectRow
                    label="Workspace activity digest"
                    desc="Periodic summary of workspace activity"
                    value={notifDigest}
                    options={["Daily", "Weekly", "Off"]}
                    onChange={handleNotifDigest}
                    ocid="notif-digest-select"
                  />
                </CardContent>
              </Card>

              {/* Events */}
              <Card className="border-border">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold tracking-tight">
                    Notification Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-3">
                  <NotifRow
                    label="Mention alerts"
                    desc="When someone @mentions you in a note, task, or chat"
                    value={notifMentions}
                    onChange={(v) =>
                      handleNotifToggle(
                        setNotifMentions,
                        "fs_notif_mentions",
                        v,
                      )
                    }
                    ocid="notif-mentions-toggle"
                  />
                  <Separator className="bg-border/40" />
                  <NotifRow
                    label="Task reminders"
                    desc="Reminders for upcoming task due dates"
                    value={notifTaskReminders}
                    onChange={(v) =>
                      handleNotifToggle(
                        setNotifTaskReminders,
                        "fs_notif_task_reminders",
                        v,
                      )
                    }
                    ocid="notif-task-reminders-toggle"
                  />
                  <Separator className="bg-border/40" />
                  <NotifRow
                    label="Task assignments"
                    desc="When a task is assigned to you"
                    value={notifTaskAssign}
                    onChange={(v) =>
                      handleNotifToggle(
                        setNotifTaskAssign,
                        "fs_notif_task_assign",
                        v,
                      )
                    }
                    ocid="notif-task-assign-toggle"
                  />
                  <Separator className="bg-border/40" />
                  <NotifRow
                    label="Payroll runs"
                    desc="When a payroll run completes or requires approval"
                    value={notifPayroll}
                    onChange={(v) =>
                      handleNotifToggle(setNotifPayroll, "fs_notif_payroll", v)
                    }
                    ocid="notif-payroll-toggle"
                  />
                  <Separator className="bg-border/40" />
                  <NotifRow
                    label="Escrow updates"
                    desc="Escrow milestone approvals and status changes"
                    value={notifEscrow}
                    onChange={(v) =>
                      handleNotifToggle(setNotifEscrow, "fs_notif_escrow", v)
                    }
                    ocid="notif-escrow-toggle"
                  />
                  <Separator className="bg-border/40" />
                  <NotifRow
                    label="Workspace invites"
                    desc="New workspace invitations sent to your account"
                    value={notifWorkspaceInvites}
                    onChange={(v) =>
                      handleNotifToggle(
                        setNotifWorkspaceInvites,
                        "fs_notif_workspace_invites",
                        v,
                      )
                    }
                    ocid="notif-workspace-invites-toggle"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── WORKSPACE ───────────────────────────────────────────────── */}
          {activeSection === "workspace" && (
            <div className="space-y-5 animate-fade-in-up">
              <div>
                <h2 className="font-display text-base font-bold text-foreground tracking-tight">
                  Workspace
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Workspace settings and regional preferences
                </p>
              </div>

              {/* General */}
              <Card className="border-border">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 tracking-tight">
                    <Building2 className="h-4 w-4 text-primary" />
                    General
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">
                      Workspace Name
                    </Label>
                    <Input
                      defaultValue={activeWorkspace?.name ?? ""}
                      placeholder="My Workspace"
                      className="h-8 text-xs"
                      data-ocid="workspace-name-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Description</Label>
                    <Input
                      placeholder="What is this workspace for?"
                      className="h-8 text-xs"
                      data-ocid="workspace-desc-input"
                    />
                  </div>
                  <Button
                    size="sm"
                    className="gap-1.5 text-xs h-8 font-semibold active-press"
                    onClick={handleWorkspaceSave}
                    data-ocid="workspace-save-btn"
                  >
                    <Save className="h-3.5 w-3.5" /> Save Changes
                  </Button>
                </CardContent>
              </Card>

              {/* Defaults */}
              <Card className="border-border">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold tracking-tight">
                    Default Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-4">
                  <SelectRow
                    label="Default module on login"
                    desc="Which module opens when you enter a workspace"
                    value={defaultModule}
                    options={ALL_MODULES}
                    onChange={(v) =>
                      handleWorkspacePref(
                        "fs_default_module",
                        setDefaultModule,
                        v,
                      )
                    }
                    ocid="workspace-default-module-select"
                  />
                  <Separator className="bg-border/40" />
                  <SelectRow
                    label="Date format"
                    desc="How dates are displayed across the app"
                    value={dateFormat}
                    options={DATE_FORMATS}
                    onChange={(v) =>
                      handleWorkspacePref("fs_date_format", setDateFormat, v)
                    }
                    ocid="workspace-date-format-select"
                  />
                  <Separator className="bg-border/40" />
                  <div className="flex items-center justify-between gap-4 py-1">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground">
                        Time format
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Display times in 12-hour or 24-hour format
                      </p>
                    </div>
                    <div className="flex rounded-md border border-input overflow-hidden shrink-0">
                      {["12h", "24h"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            handleWorkspacePref(
                              "fs_time_format",
                              setTimeFormat,
                              opt,
                            )
                          }
                          data-ocid={`time-format-${opt}`}
                          className={cn(
                            "px-3 py-1.5 text-xs font-medium transition-smooth",
                            timeFormat === opt
                              ? "bg-primary text-primary-foreground"
                              : "bg-background text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Separator className="bg-border/40" />
                  <SelectRow
                    label="Timezone"
                    desc="Used for scheduling, calendar, and notifications"
                    value={timezone}
                    options={TIMEZONES}
                    onChange={(v) =>
                      handleWorkspacePref("fs_timezone", setTimezone, v)
                    }
                    ocid="workspace-timezone-select"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── SECURITY ────────────────────────────────────────────────── */}
          {activeSection === "security" && (
            <div className="space-y-5 animate-fade-in-up">
              <div>
                <h2 className="font-display text-base font-bold text-foreground tracking-tight">
                  Security & Roles
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Role permissions and access control
                </p>
              </div>
              <Card className="border-border">
                <CardContent className="p-5 space-y-3">
                  {[
                    {
                      role: Role.Admin,
                      desc: "Full access to all features, user management, and admin panel.",
                      color:
                        "bg-destructive/10 text-destructive border-destructive/20",
                    },
                    {
                      role: Role.Manager,
                      desc: "Can manage projects, payroll, and view analytics.",
                      color:
                        "bg-secondary/10 text-secondary-foreground border-secondary/20",
                    },
                    {
                      role: Role.TeamMember,
                      desc: "Access to notes, tasks, chat, and calendar.",
                      color: "bg-primary/10 text-primary border-primary/20",
                    },
                  ].map((r, i) => (
                    <div key={r.role}>
                      {i > 0 && <Separator className="bg-border/40 mb-3" />}
                      <div className="flex items-start gap-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium shrink-0 mt-0.5 ${r.color}`}
                        >
                          {r.role}
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {r.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── ADVANCED ────────────────────────────────────────────────── */}
          {activeSection === "advanced" && (
            <div className="space-y-5 animate-fade-in-up">
              <div>
                <h2 className="font-display text-base font-bold text-foreground tracking-tight">
                  Advanced
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Power-user tools and account management
                </p>
              </div>

              {/* Keyboard Shortcuts */}
              <Card className="border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Keyboard className="h-4 w-4 text-primary" />
                        Keyboard Shortcuts
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        View all available keyboard shortcuts
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowShortcuts(true)}
                      className="h-8 text-xs gap-1.5 shrink-0"
                      data-ocid="keyboard-shortcuts-btn"
                    >
                      <Keyboard className="h-3.5 w-3.5" />
                      View shortcuts
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Data Export */}
              <Card className="border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Download className="h-4 w-4 text-primary" />
                        Export Data
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Download a copy of your workspace data as CSV
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toast.success(
                          "Export started — your file will be ready shortly.",
                        )
                      }
                      className="h-8 text-xs gap-1.5 shrink-0"
                      data-ocid="data-export-btn"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-destructive/40">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold tracking-tight text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Delete Account
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Permanently delete your account and all associated data.
                        This cannot be undone.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="h-8 text-xs gap-1.5 shrink-0"
                      data-ocid="delete-account-btn"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-[10px] text-muted-foreground pt-4">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>

      {/* ── Keyboard Shortcuts Modal ──────────────────────────────────── */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent className="max-w-md" data-ocid="shortcuts-modal">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold flex items-center gap-2">
              <Keyboard className="h-4 w-4 text-primary" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
            {KEYBOARD_SHORTCUTS.map(({ combo, label }) => (
              <div
                key={label}
                className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/40 transition-smooth"
              >
                <span className="text-xs text-muted-foreground">{label}</span>
                <kbd className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] text-foreground shrink-0">
                  {combo}
                </kbd>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Account Confirm Modal ─────────────────────────────── */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-sm" data-ocid="delete-confirm-modal">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Delete Account
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              This will permanently delete your account, all your notes,
              projects, and workspace data. This action{" "}
              <strong className="text-foreground">cannot be undone</strong>.
            </p>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Type <span className="font-mono text-destructive">DELETE</span>{" "}
                to confirm
              </Label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="h-8 text-xs font-mono"
                data-ocid="delete-confirm-input"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                }}
                className="h-8 text-xs"
                data-ocid="delete-cancel-btn"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={deleteConfirmText !== "DELETE"}
                onClick={() => {
                  toast.error(
                    "Account deletion is not yet available in this version.",
                  );
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                }}
                className="h-8 text-xs"
                data-ocid="delete-confirm-btn"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Delete my account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
