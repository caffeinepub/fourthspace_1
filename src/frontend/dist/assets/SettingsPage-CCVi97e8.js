import { t as createLucideIcon, f as useWorkspace, n as useQueryClient, g as getTenantId, r as reactExports, j as jsxRuntimeExports, ai as User, aq as Moon, b0 as Bell, k as Building2, p as Shield, x as cn, A as Avatar, q as AvatarFallback, B as Button, b1 as ThemeToggle, S as Sparkles, ah as Role } from "./index-CQ7TXF2a.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-DtVZ2GZq.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-B-WRR6Kl.js";
import { I as Input } from "./input-Dkit6sfw.js";
import { L as Label } from "./label-ANHtprqJ.js";
import { S as Separator } from "./separator-q6FGHgg-.js";
import { S as Switch } from "./switch-BGZRmkVS.js";
import { u as useMutation } from "./useMutation-fGi-GboX.js";
import { u as ue } from "./index-BGFcG_k-.js";
import { u as useBackend } from "./index--h8TKSCt.js";
import { S as Settings2 } from "./settings-2-BUgqP987.js";
import { M as Mail } from "./mail-DN-ybx31.js";
import { S as Save } from "./save-DJl3ZDfM.js";
import { Z as Zap } from "./zap-Bi3i3wDK.js";
import { G as Globe } from "./globe-CFCJUvx_.js";
import { D as Download } from "./download-Kj8sie5G.js";
import { T as TriangleAlert } from "./triangle-alert-BbQlAF2-.js";
import { T as Trash2 } from "./trash-2-CGgRyVAn.js";
import "./index-BlAsmRnL.js";
import "./index-CkN0xm2T.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M10 8h.01", key: "1r9ogq" }],
  ["path", { d: "M12 12h.01", key: "1mp3jc" }],
  ["path", { d: "M14 8h.01", key: "1primd" }],
  ["path", { d: "M16 12h.01", key: "1l6xoz" }],
  ["path", { d: "M18 8h.01", key: "emo2bl" }],
  ["path", { d: "M6 8h.01", key: "x9i8wu" }],
  ["path", { d: "M7 16h10", key: "wp8him" }],
  ["path", { d: "M8 12h.01", key: "czm47f" }],
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2", key: "18n3k1" }]
];
const Keyboard = createLucideIcon("keyboard", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M12 2v20", key: "t6zp3m" }],
  ["path", { d: "m15 19-3 3-3-3", key: "11eu04" }],
  ["path", { d: "m19 9 3 3-3 3", key: "1mg7y2" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }],
  ["path", { d: "m5 9-3 3 3 3", key: "j64kie" }],
  ["path", { d: "m9 5 3-3 3 3", key: "l8vdw6" }]
];
const Move = createLucideIcon("move", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M9 21V9", key: "1oto5p" }]
];
const PanelsTopLeft = createLucideIcon("panels-top-left", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "4", x2: "4", y1: "21", y2: "14", key: "1p332r" }],
  ["line", { x1: "4", x2: "4", y1: "10", y2: "3", key: "gb41h5" }],
  ["line", { x1: "12", x2: "12", y1: "21", y2: "12", key: "hf2csr" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "3", key: "1kfi7u" }],
  ["line", { x1: "20", x2: "20", y1: "21", y2: "16", key: "1lhrwl" }],
  ["line", { x1: "20", x2: "20", y1: "12", y2: "3", key: "16vvfq" }],
  ["line", { x1: "2", x2: "6", y1: "14", y2: "14", key: "1uebub" }],
  ["line", { x1: "10", x2: "14", y1: "8", y2: "8", key: "1yglbp" }],
  ["line", { x1: "18", x2: "22", y1: "16", y2: "16", key: "1jxqpz" }]
];
const SlidersVertical = createLucideIcon("sliders-vertical", __iconNode);
function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("fs_pref_changed"));
  } catch {
  }
}
const SETTINGS_NAV = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Moon },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "security", label: "Security & Roles", icon: Shield },
  { id: "advanced", label: "Advanced", icon: Settings2 }
];
const ACCENT_PRESETS = [
  { label: "Purple", value: "#6d28d9", css: "0.45 0.24 264" },
  { label: "Blue", value: "#2563eb", css: "0.52 0.24 240" },
  { label: "Teal", value: "#0d9488", css: "0.58 0.19 172" },
  { label: "Green", value: "#16a34a", css: "0.55 0.22 142" },
  { label: "Orange", value: "#ea580c", css: "0.65 0.24 40" },
  { label: "Pink", value: "#db2777", css: "0.60 0.24 330" },
  { label: "Indigo", value: "#4f46e5", css: "0.50 0.25 258" },
  { label: "Amber", value: "#d97706", css: "0.68 0.18 88" }
];
const FONT_SIZES = [
  { label: "Compact", value: "compact", base: "13px" },
  { label: "Default", value: "default", base: "14px" },
  { label: "Comfortable", value: "comfortable", base: "15px" }
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
  "Goals"
];
const DATE_FORMATS = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];
const LAYOUT_DENSITY = [
  { label: "Compact", value: "compact", desc: "Tighter spacing, more content" },
  { label: "Default", value: "default", desc: "Balanced layout" },
  { label: "Spacious", value: "spacious", desc: "Extra breathing room" }
];
const CONTENT_WIDTHS = [
  { label: "Narrow", value: "narrow", desc: "Max 800px" },
  { label: "Normal", value: "normal", desc: "Max 1200px" },
  { label: "Wide", value: "wide", desc: "Full width" }
];
const SIDEBAR_ACCENT_THEMES = [
  {
    label: "Default",
    value: "default",
    bg: "bg-card",
    border: "border-border"
  },
  {
    label: "Dark",
    value: "dark",
    bg: "bg-[#0d0d0d]",
    border: "border-neutral-800"
  },
  {
    label: "Muted",
    value: "muted",
    bg: "bg-muted/60",
    border: "border-border/60"
  },
  {
    label: "Glass",
    value: "glass",
    bg: "bg-card/40 backdrop-blur",
    border: "border-border/30"
  }
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
  "Pacific/Auckland"
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
  { combo: "G C", label: "Go to Chat" }
];
function SettingsPage() {
  const { userProfile, activeWorkspace } = useWorkspace();
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const [activeSection, setActiveSection] = reactExports.useState("profile");
  const [displayName, setDisplayName] = reactExports.useState(
    (userProfile == null ? void 0 : userProfile.displayName) ?? ""
  );
  const [email, setEmail] = reactExports.useState((userProfile == null ? void 0 : userProfile.email) ?? "");
  const [profileError, setProfileError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (userProfile) {
      setDisplayName(
        (prev) => prev === "" ? userProfile.displayName ?? "" : prev
      );
      setEmail((prev) => prev === "" ? userProfile.email ?? "" : prev);
    }
  }, [userProfile]);
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "??";
  const [accentColor, setAccentColor] = reactExports.useState(
    () => lsGet("fs_accent_color", "#6d28d9")
  );
  const [accentCss, setAccentCss] = reactExports.useState(
    () => lsGet("fs_accent_css", "0.45 0.24 264")
  );
  const [customAccent, setCustomAccent] = reactExports.useState("");
  const [fontSize, setFontSize] = reactExports.useState(
    () => lsGet("fs_font_size", "default")
  );
  const [iconsOnly, setIconsOnly] = reactExports.useState(
    () => lsGet("fs_sidebar_icons_only", false)
  );
  const [layoutDensity, setLayoutDensity] = reactExports.useState(
    () => lsGet("fs_layout_density", "default")
  );
  const [contentWidth, setContentWidth] = reactExports.useState(
    () => lsGet("fs_content_width", "normal")
  );
  const [sidebarTheme, setSidebarTheme] = reactExports.useState(
    () => lsGet("fs_sidebar_theme", "default")
  );
  const [reduceMotion, setReduceMotion] = reactExports.useState(
    () => lsGet("fs_reduce_motion", false)
  );
  const [notifEmail, setNotifEmail] = reactExports.useState(
    () => lsGet("fs_notif_email", true)
  );
  const [notifDesktop, setNotifDesktop] = reactExports.useState(
    () => lsGet("fs_notif_desktop", false)
  );
  const [notifDigest, setNotifDigest] = reactExports.useState(
    () => lsGet("fs_notif_digest", "Weekly")
  );
  const [notifTaskReminders, setNotifTaskReminders] = reactExports.useState(
    () => lsGet("fs_notif_task_reminders", true)
  );
  const [notifMentions, setNotifMentions] = reactExports.useState(
    () => lsGet("fs_notif_mentions", true)
  );
  const [notifTaskAssign, setNotifTaskAssign] = reactExports.useState(
    () => lsGet("fs_notif_task_assign", true)
  );
  const [notifPayroll, setNotifPayroll] = reactExports.useState(
    () => lsGet("fs_notif_payroll", true)
  );
  const [notifEscrow, setNotifEscrow] = reactExports.useState(
    () => lsGet("fs_notif_escrow", true)
  );
  const [notifWorkspaceInvites, setNotifWorkspaceInvites] = reactExports.useState(
    () => lsGet("fs_notif_workspace_invites", true)
  );
  const [defaultModule, setDefaultModule] = reactExports.useState(
    () => lsGet("fs_default_module", "Dashboard")
  );
  const [dateFormat, setDateFormat] = reactExports.useState(
    () => lsGet("fs_date_format", "MM/DD/YYYY")
  );
  const [timeFormat, setTimeFormat] = reactExports.useState(
    () => lsGet("fs_time_format", "12h")
  );
  const [timezone, setTimezone] = reactExports.useState(
    () => lsGet("fs_timezone", "UTC")
  );
  const [showShortcuts, setShowShortcuts] = reactExports.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = reactExports.useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = reactExports.useState("");
  const [workspaceName, setWorkspaceName] = reactExports.useState(
    (activeWorkspace == null ? void 0 : activeWorkspace.name) ?? ""
  );
  const [workspaceDescription, setWorkspaceDescription] = reactExports.useState(
    lsGet(`fs_ws_desc_${(activeWorkspace == null ? void 0 : activeWorkspace.id) ?? ""}`, "")
  );
  reactExports.useEffect(() => {
    if (activeWorkspace == null ? void 0 : activeWorkspace.name) {
      setWorkspaceName((prev) => prev === "" ? activeWorkspace.name : prev);
    }
  }, [activeWorkspace]);
  const workspaceSaveMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !activeWorkspace) throw new Error("Not connected");
      const res = await actor.updateWorkspace(
        tenantId,
        activeWorkspace.id,
        workspaceName
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      lsSet(`fs_ws_desc_${activeWorkspace.id}`, workspaceDescription);
      return res.ok;
    },
    onSuccess: () => {
      ue.success("Workspace settings saved");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (err) => {
      ue.error(err.message || "Failed to save workspace settings");
    }
  });
  function handleWorkspaceSave() {
    workspaceSaveMutation.mutate();
  }
  const applyVisualPrefs = reactExports.useCallback((css, size) => {
    const sizeObj = FONT_SIZES.find((f) => f.value === size);
    const root = document.documentElement;
    root.style.setProperty("--primary", css);
    root.style.setProperty("--ring", css);
    root.style.setProperty("--font-size-base", (sizeObj == null ? void 0 : sizeObj.base) ?? "14px");
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
  reactExports.useEffect(() => {
    applyVisualPrefs(accentCss, fontSize);
  }, [accentCss, fontSize, applyVisualPrefs]);
  function handleAccentPreset(preset) {
    setAccentColor(preset.value);
    setAccentCss(preset.css);
    lsSet("fs_accent_color", preset.value);
    lsSet("fs_accent_css", preset.css);
  }
  function handleCustomAccent() {
    const hex = customAccent.trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
      ue.error("Enter a valid hex color (e.g. #3b82f6)");
      return;
    }
    const css = "0.55 0.20 220";
    setAccentColor(hex);
    setAccentCss(css);
    lsSet("fs_accent_color", hex);
    lsSet("fs_accent_css", css);
    setCustomAccent("");
    ue.success("Accent color updated");
  }
  function handleFontSize(val) {
    setFontSize(val);
    lsSet("fs_font_size", val);
  }
  function handleIconsOnly(val) {
    setIconsOnly(val);
    lsSet("fs_sidebar_icons_only", val);
  }
  function handleLayoutDensity(val) {
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
  function handleContentWidth(val) {
    setContentWidth(val);
    lsSet("fs_content_width", val);
  }
  function handleSidebarTheme(val) {
    setSidebarTheme(val);
    lsSet("fs_sidebar_theme", val);
    window.dispatchEvent(new Event("fs_pref_changed"));
  }
  function handleReduceMotion(val) {
    setReduceMotion(val);
    lsSet("fs_reduce_motion", val);
    const root = document.documentElement;
    if (val) {
      root.style.setProperty("--transition-duration", "0ms");
    } else {
      root.style.removeProperty("--transition-duration");
    }
  }
  function handleNotifToggle(setter, key, val) {
    setter(val);
    lsSet(key, val);
  }
  function handleNotifDigest(val) {
    setNotifDigest(val);
    lsSet("fs_notif_digest", val);
  }
  function handleWorkspacePref(key, setter, val) {
    setter(val);
    lsSet(key, val);
  }
  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: async () => {
      if (!actor || !userProfile) throw new Error("Not connected");
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email address");
      }
      return actor.upsertProfile(tenantId, {
        displayName,
        email,
        role: userProfile.role,
        workspaceId: userProfile.workspaceId
      });
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        setDisplayName(result.ok.displayName);
        setEmail(result.ok.email);
        setProfileError(null);
        void queryClient.invalidateQueries({ queryKey: ["myProfile"] });
        ue.success("Profile updated successfully");
      } else {
        setProfileError(result.err ?? "Failed to update profile");
        ue.error(result.err ?? "Failed to update profile");
      }
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      setProfileError(msg);
      ue.error(msg);
    }
  });
  function NotifRow({
    label,
    desc,
    value,
    onChange,
    ocid
  }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 py-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: desc })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Switch,
        {
          checked: value,
          onCheckedChange: onChange,
          "data-ocid": ocid,
          className: "shrink-0"
        }
      )
    ] });
  }
  function SelectRow({
    label,
    desc,
    value,
    options,
    onChange,
    ocid
  }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 py-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: desc })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "select",
        {
          value,
          onChange: (e) => onChange(e.target.value),
          "data-ocid": ocid,
          className: "shrink-0 h-7 rounded-md border border-input bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
          children: options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o, children: o }, o))
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden md:flex w-52 shrink-0 flex-col border-r border-border/60 bg-card/50 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground", children: "Settings" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "space-y-0.5", children: SETTINGS_NAV.map((item) => {
        const Icon = item.icon;
        const active = activeSection === item.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setActiveSection(item.id),
            className: cn(
              "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-smooth",
              active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            ),
            "data-ocid": `settings-nav-${item.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 shrink-0" }),
              item.label
            ]
          },
          item.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-5 py-7 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden flex gap-1 overflow-x-auto pb-2", children: SETTINGS_NAV.map((item) => {
        const Icon = item.icon;
        const active = activeSection === item.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setActiveSection(item.id),
            className: cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-smooth shrink-0",
              active ? "bg-primary/10 text-primary" : "bg-muted/40 text-muted-foreground hover:text-foreground"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3" }),
              " ",
              item.label
            ]
          },
          item.id
        );
      }) }),
      activeSection === "profile" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 animate-fade-in-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground tracking-tight", children: "Profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Update your personal information" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-14 w-14", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary text-primary-foreground font-display text-lg font-bold", children: initials }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: displayName || "Your Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: email || "your@email.com" }),
              userProfile && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 mt-1 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-2.5 w-2.5" }),
                userProfile.role
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "settings-name",
                  className: "text-xs font-medium",
                  children: "Display Name"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "settings-name",
                  value: displayName,
                  onChange: (e) => setDisplayName(e.target.value),
                  className: "h-8 text-xs",
                  "data-ocid": "settings-name-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "settings-email",
                  className: "text-xs font-medium",
                  children: "Email"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "settings-email",
                    type: "email",
                    className: "pl-8 h-8 text-xs",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    "data-ocid": "settings-email-input"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            profileError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive text-right", children: profileError }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                onClick: () => saveProfile(),
                disabled: !displayName || isPending,
                className: "h-8 gap-1.5 text-xs font-semibold active-press",
                "data-ocid": "settings-save-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3.5 w-3.5" }),
                  isPending ? "Saving…" : "Save Profile"
                ]
              }
            ) })
          ] })
        ] }) })
      ] }),
      activeSection === "appearance" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 animate-fade-in-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground tracking-tight", children: "Appearance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Customize how Fourthspace looks" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Theme" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Switch between light and dark mode" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {})
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2 tracking-tight", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersVertical, { className: "h-4 w-4 text-primary" }),
            "Accent Color"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-5 pb-5 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Choose a primary accent color for buttons, links, and highlights." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2.5", children: ACCENT_PRESETS.map((preset) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                title: preset.label,
                "aria-label": `Set accent color to ${preset.label}`,
                onClick: () => handleAccentPreset(preset),
                "data-ocid": `accent-${preset.label.toLowerCase()}`,
                className: cn(
                  "h-7 w-7 rounded-full border-2 transition-smooth hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  accentColor === preset.value ? "border-foreground ring-2 ring-foreground/30 scale-110" : "border-transparent"
                ),
                style: { backgroundColor: preset.value }
              },
              preset.value
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "#3b82f6",
                  value: customAccent,
                  onChange: (e) => setCustomAccent(e.target.value),
                  className: "h-8 text-xs w-32 font-mono",
                  maxLength: 7,
                  "data-ocid": "accent-custom-input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: handleCustomAccent,
                  className: "h-8 text-xs",
                  "data-ocid": "accent-custom-apply",
                  children: "Apply custom"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-7 w-7 rounded-full border border-border shrink-0",
                  style: { backgroundColor: accentColor },
                  "aria-label": "Current accent color preview"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold tracking-tight", children: "Font Size" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-5 pb-5 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Adjust the base text size across the app." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: FONT_SIZES.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleFontSize(opt.value),
                "data-ocid": `font-size-${opt.value}`,
                className: cn(
                  "flex-1 rounded-md border py-2 text-xs font-medium transition-smooth",
                  fontSize === opt.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                ),
                children: [
                  opt.label,
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[10px] mt-0.5 opacity-60", children: opt.base })
                ]
              },
              opt.value
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Icons-only sidebar" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Collapse sidebar to show icons without labels" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: iconsOnly,
              onCheckedChange: handleIconsOnly,
              "data-ocid": "sidebar-icons-only-toggle"
            }
          )
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold tracking-tight flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Move, { className: "h-4 w-4 text-primary" }),
            "Layout Density"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-5 pb-5 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Control how much spacing is used between elements." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: LAYOUT_DENSITY.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleLayoutDensity(opt.value),
                "data-ocid": `layout-density-${opt.value}`,
                className: cn(
                  "flex-1 rounded-md border py-2.5 px-2 text-xs font-medium transition-smooth text-center",
                  layoutDensity === opt.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                ),
                children: [
                  opt.label,
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[10px] mt-0.5 opacity-60", children: opt.desc })
                ]
              },
              opt.value
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold tracking-tight flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PanelsTopLeft, { className: "h-4 w-4 text-primary" }),
            "Content Width"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-5 pb-5 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Set the maximum width of main content areas." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: CONTENT_WIDTHS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleContentWidth(opt.value),
                "data-ocid": `content-width-${opt.value}`,
                className: cn(
                  "flex-1 rounded-md border py-2.5 px-2 text-xs font-medium transition-smooth text-center",
                  contentWidth === opt.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                ),
                children: [
                  opt.label,
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[10px] mt-0.5 opacity-60", children: opt.desc })
                ]
              },
              opt.value
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold tracking-tight flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
            "Sidebar Style"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-5 pb-5 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Choose the sidebar background treatment." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-4", children: SIDEBAR_ACCENT_THEMES.map((theme) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleSidebarTheme(theme.value),
                "data-ocid": `sidebar-theme-${theme.value}`,
                className: cn(
                  "relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 text-xs font-medium transition-smooth",
                  sidebarTheme === theme.value ? "border-primary" : "border-transparent hover:border-border"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: cn(
                        "h-10 w-full rounded-md border",
                        theme.bg,
                        theme.border
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "text-[10px]",
                        sidebarTheme === theme.value ? "text-primary" : "text-muted-foreground"
                      ),
                      children: theme.label
                    }
                  )
                ]
              },
              theme.value
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold tracking-tight flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-primary" }),
            "Motion & Animation"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-5 space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Reduce motion" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Disable entrance animations and transitions" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: reduceMotion,
                onCheckedChange: handleReduceMotion,
                "data-ocid": "reduce-motion-toggle"
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Language" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "All content in English" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-2.5 py-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground", children: "English" })
          ] })
        ] }) }) })
      ] }),
      activeSection === "notifications" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 animate-fade-in-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground tracking-tight", children: "Notifications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Control when and how you get notified" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold tracking-tight", children: "Delivery Channels" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-5 pb-5 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NotifRow,
              {
                label: "Email notifications",
                desc: "Receive important updates by email",
                value: notifEmail,
                onChange: (v) => handleNotifToggle(setNotifEmail, "fs_notif_email", v),
                ocid: "notif-email-toggle"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NotifRow,
              {
                label: "Desktop notifications",
                desc: "Browser push notifications when Fourthspace is open",
                value: notifDesktop,
                onChange: (v) => handleNotifToggle(setNotifDesktop, "fs_notif_desktop", v),
                ocid: "notif-desktop-toggle"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectRow,
              {
                label: "Workspace activity digest",
                desc: "Periodic summary of workspace activity",
                value: notifDigest,
                options: ["Daily", "Weekly", "Off"],
                onChange: handleNotifDigest,
                ocid: "notif-digest-select"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold tracking-tight", children: "Notification Events" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-5 pb-5 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NotifRow,
              {
                label: "Mention alerts",
                desc: "When someone @mentions you in a note, task, or chat",
                value: notifMentions,
                onChange: (v) => handleNotifToggle(
                  setNotifMentions,
                  "fs_notif_mentions",
                  v
                ),
                ocid: "notif-mentions-toggle"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NotifRow,
              {
                label: "Task reminders",
                desc: "Reminders for upcoming task due dates",
                value: notifTaskReminders,
                onChange: (v) => handleNotifToggle(
                  setNotifTaskReminders,
                  "fs_notif_task_reminders",
                  v
                ),
                ocid: "notif-task-reminders-toggle"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NotifRow,
              {
                label: "Task assignments",
                desc: "When a task is assigned to you",
                value: notifTaskAssign,
                onChange: (v) => handleNotifToggle(
                  setNotifTaskAssign,
                  "fs_notif_task_assign",
                  v
                ),
                ocid: "notif-task-assign-toggle"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NotifRow,
              {
                label: "Payroll runs",
                desc: "When a payroll run completes or requires approval",
                value: notifPayroll,
                onChange: (v) => handleNotifToggle(setNotifPayroll, "fs_notif_payroll", v),
                ocid: "notif-payroll-toggle"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NotifRow,
              {
                label: "Escrow updates",
                desc: "Escrow milestone approvals and status changes",
                value: notifEscrow,
                onChange: (v) => handleNotifToggle(setNotifEscrow, "fs_notif_escrow", v),
                ocid: "notif-escrow-toggle"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NotifRow,
              {
                label: "Workspace invites",
                desc: "New workspace invitations sent to your account",
                value: notifWorkspaceInvites,
                onChange: (v) => handleNotifToggle(
                  setNotifWorkspaceInvites,
                  "fs_notif_workspace_invites",
                  v
                ),
                ocid: "notif-workspace-invites-toggle"
              }
            )
          ] })
        ] })
      ] }),
      activeSection === "workspace" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 animate-fade-in-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground tracking-tight", children: "Workspace" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Workspace settings and regional preferences" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2 tracking-tight", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4 text-primary" }),
            "General"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-5 pb-5 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium", children: "Workspace Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: workspaceName,
                  onChange: (e) => setWorkspaceName(e.target.value),
                  placeholder: "My Workspace",
                  className: "h-8 text-xs",
                  "data-ocid": "workspace-name-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: workspaceDescription,
                  onChange: (e) => setWorkspaceDescription(e.target.value),
                  placeholder: "What is this workspace for?",
                  className: "h-8 text-xs",
                  "data-ocid": "workspace-desc-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "gap-1.5 text-xs h-8 font-semibold active-press",
                onClick: handleWorkspaceSave,
                "data-ocid": "workspace-save-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3.5 w-3.5" }),
                  " Save Changes"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold tracking-tight", children: "Default Preferences" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-5 pb-5 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectRow,
              {
                label: "Default module on login",
                desc: "Which module opens when you enter a workspace",
                value: defaultModule,
                options: ALL_MODULES,
                onChange: (v) => handleWorkspacePref(
                  "fs_default_module",
                  setDefaultModule,
                  v
                ),
                ocid: "workspace-default-module-select"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectRow,
              {
                label: "Date format",
                desc: "How dates are displayed across the app",
                value: dateFormat,
                options: DATE_FORMATS,
                onChange: (v) => handleWorkspacePref("fs_date_format", setDateFormat, v),
                ocid: "workspace-date-format-select"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 py-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground", children: "Time format" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: "Display times in 12-hour or 24-hour format" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex rounded-md border border-input overflow-hidden shrink-0", children: ["12h", "24h"].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleWorkspacePref(
                    "fs_time_format",
                    setTimeFormat,
                    opt
                  ),
                  "data-ocid": `time-format-${opt}`,
                  className: cn(
                    "px-3 py-1.5 text-xs font-medium transition-smooth",
                    timeFormat === opt ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"
                  ),
                  children: opt
                },
                opt
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectRow,
              {
                label: "Timezone",
                desc: "Used for scheduling, calendar, and notifications",
                value: timezone,
                options: TIMEZONES,
                onChange: (v) => handleWorkspacePref("fs_timezone", setTimezone, v),
                ocid: "workspace-timezone-select"
              }
            )
          ] })
        ] })
      ] }),
      activeSection === "security" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 animate-fade-in-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground tracking-tight", children: "Security & Roles" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Role permissions and access control" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5 space-y-3", children: [
          {
            role: Role.Admin,
            desc: "Full access to all features, user management, and admin panel.",
            color: "bg-destructive/10 text-destructive border-destructive/20"
          },
          {
            role: Role.Manager,
            desc: "Can manage projects, payroll, and view analytics.",
            color: "bg-secondary/10 text-secondary-foreground border-secondary/20"
          },
          {
            role: Role.TeamMember,
            desc: "Access to notes, tasks, chat, and calendar.",
            color: "bg-primary/10 text-primary border-primary/20"
          }
        ].map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/40 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium shrink-0 mt-0.5 ${r.color}`,
                children: r.role
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: r.desc })
          ] })
        ] }, r.role)) }) })
      ] }),
      activeSection === "advanced" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 animate-fade-in-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground tracking-tight", children: "Advanced" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Power-user tools and account management" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Keyboard, { className: "h-4 w-4 text-primary" }),
              "Keyboard Shortcuts"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "View all available keyboard shortcuts" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => setShowShortcuts(true),
              className: "h-8 text-xs gap-1.5 shrink-0",
              "data-ocid": "keyboard-shortcuts-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Keyboard, { className: "h-3.5 w-3.5" }),
                "View shortcuts"
              ]
            }
          )
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 text-primary" }),
              "Export Data"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Download a copy of your workspace data as CSV" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => ue.success(
                "Export started — your file will be ready shortly."
              ),
              className: "h-8 text-xs gap-1.5 shrink-0",
              "data-ocid": "data-export-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
                "Export"
              ]
            }
          )
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-destructive/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold tracking-tight text-destructive flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
            "Danger Zone"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Delete Account" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Permanently delete your account and all associated data. This cannot be undone." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "destructive",
                onClick: () => setShowDeleteConfirm(true),
                className: "h-8 text-xs gap-1.5 shrink-0",
                "data-ocid": "delete-account-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
                  "Delete"
                ]
              }
            )
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-[10px] text-muted-foreground pt-4", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        ". Built with love using",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-primary hover:underline",
            children: "caffeine.ai"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showShortcuts, onOpenChange: setShowShortcuts, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "data-ocid": "shortcuts-modal", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Keyboard, { className: "h-4 w-4 text-primary" }),
        "Keyboard Shortcuts"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-80 overflow-y-auto space-y-1 pr-1", children: KEYBOARD_SHORTCUTS.map(({ combo, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/40 transition-smooth",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] text-foreground shrink-0", children: combo })
          ]
        },
        label
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showDeleteConfirm, onOpenChange: setShowDeleteConfirm, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "delete-confirm-modal", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-sm font-semibold flex items-center gap-2 text-destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
        "Delete Account"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
          "This will permanently delete your account, all your notes, projects, and workspace data. This action",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "cannot be undone" }),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium", children: [
            "Type ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-destructive", children: "DELETE" }),
            " ",
            "to confirm"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: deleteConfirmText,
              onChange: (e) => setDeleteConfirmText(e.target.value),
              placeholder: "DELETE",
              className: "h-8 text-xs font-mono",
              "data-ocid": "delete-confirm-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => {
                setShowDeleteConfirm(false);
                setDeleteConfirmText("");
              },
              className: "h-8 text-xs",
              "data-ocid": "delete-cancel-btn",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "destructive",
              disabled: deleteConfirmText !== "DELETE",
              onClick: () => {
                ue.error(
                  "Account deletion is not yet available in this version."
                );
                setShowDeleteConfirm(false);
                setDeleteConfirmText("");
              },
              className: "h-8 text-xs",
              "data-ocid": "delete-confirm-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5 mr-1.5" }),
                "Delete my account"
              ]
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  SettingsPage as default
};
