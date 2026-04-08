import { s as createLucideIcon, d as useNavigate, f as useWorkspace, n as useQueryClient, g as getTenantId, r as reactExports, h as useQuery, aY as BackupStatus, j as jsxRuntimeExports, B as Button, P as Plus, p as Shield } from "./index-CzyNqtbv.js";
import { B as Badge } from "./badge-B6elWcoD.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-BTCkNtDu.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-Bj-8xTC_.js";
import { I as Input } from "./input-982h_Ebl.js";
import { L as Label } from "./label-D31XgQrg.js";
import { S as Skeleton } from "./skeleton-DMAdSNre.js";
import { u as useMutation } from "./useMutation-BsRk2Bod.js";
import { u as ue } from "./index-DaWH_LJ9.js";
import { u as useBackend } from "./index-CJtF1vtU.js";
import { A as ArrowLeft } from "./arrow-left-BnDr9sMT.js";
import { A as ArchiveRestore } from "./archive-restore-C0VgRVHX.js";
import { C as CalendarClock } from "./calendar-clock-CuEAUCj3.js";
import { C as Clock } from "./clock-DD8HS7VE.js";
import { C as CircleAlert } from "./circle-alert-aUZdVIV-.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-gmG56FeV.js";
import { f as format } from "./format-BjBbZPfh.js";
import { R as RotateCcw } from "./rotate-ccw-DkvEdE-R.js";
import "./index-Cl0AloCC.js";
import "./en-US-CJ_JRP0W.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "22", x2: "2", y1: "12", y2: "12", key: "1y58io" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ],
  ["line", { x1: "6", x2: "6.01", y1: "16", y2: "16", key: "sgf278" }],
  ["line", { x1: "10", x2: "10.01", y1: "16", y2: "16", key: "1l4acy" }]
];
const HardDrive = createLucideIcon("hard-drive", __iconNode);
const STATUS_META = {
  [BackupStatus.Completed]: {
    icon: CircleCheckBig,
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    label: "Completed"
  },
  [BackupStatus.Running]: {
    icon: Clock,
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    label: "Running"
  },
  [BackupStatus.Failed]: {
    icon: CircleAlert,
    className: "bg-destructive/10 text-destructive border-destructive/20",
    label: "Failed"
  },
  [BackupStatus.Pending]: {
    icon: Clock,
    className: "bg-muted text-muted-foreground border-border",
    label: "Pending"
  }
};
const SCHEDULED_BACKUPS = [
  { label: "Daily snapshot", next: "Tomorrow at 03:00 AM UTC", freq: "Daily" },
  { label: "Weekly archive", next: "Sunday at 00:00 AM UTC", freq: "Weekly" }
];
function AdminBackupPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { activeWorkspaceId } = useWorkspace();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  const [showCreateDialog, setShowCreateDialog] = reactExports.useState(false);
  const [backupLabel, setBackupLabel] = reactExports.useState("");
  const [restoreTarget, setRestoreTarget] = reactExports.useState(null);
  const [isRestoring, setIsRestoring] = reactExports.useState(false);
  const { data: backups, isLoading } = useQuery({
    queryKey: ["backups", tenantId, workspaceId],
    queryFn: async () => actor ? actor.listBackups(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { mutate: createBackup, isPending } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const label = backupLabel.trim() || `Backup ${(/* @__PURE__ */ new Date()).toLocaleString()}`;
      return actor.createBackup(tenantId, workspaceId, label);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["backups"] });
        ue.success("Backup initiated successfully!");
        setShowCreateDialog(false);
        setBackupLabel("");
      } else ue.error(result.err);
    },
    onError: () => ue.error("Failed to create backup")
  });
  const completedBackups = (backups == null ? void 0 : backups.filter((b) => b.status === BackupStatus.Completed)) ?? [];
  const totalSizeKB = completedBackups.reduce(
    (acc, b) => acc + (b.sizeBytes ? Number(b.sizeBytes) / 1024 : 0),
    0
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: `/app/${workspaceId}/admin` }),
          "aria-label": "Back to admin",
          className: "hover:bg-muted",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArchiveRestore, { className: "h-4 w-4 text-indigo-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: "Backup & Restore" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Protect and recover your workspace data" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: () => setShowCreateDialog(true),
          "data-ocid": "backup-create-btn",
          className: "active-press",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-3.5 w-3.5" }),
            "Create Backup"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-3", children: [
      {
        icon: ArchiveRestore,
        bg: "bg-indigo-500/10",
        color: "text-indigo-500",
        value: isLoading ? "—" : String((backups == null ? void 0 : backups.length) ?? 0),
        label: "Total Backups"
      },
      {
        icon: CircleCheckBig,
        bg: "bg-emerald-500/10",
        color: "text-emerald-500",
        value: isLoading ? "—" : String(completedBackups.length),
        label: "Completed"
      },
      {
        icon: HardDrive,
        bg: "bg-muted",
        color: "text-muted-foreground",
        value: isLoading ? "—" : `${totalSizeKB.toFixed(0)} KB`,
        label: "Total Storage"
      }
    ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `flex h-9 w-9 items-center justify-center rounded-xl ${s.bg}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: `h-4 w-4 ${s.color}` })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold font-display text-foreground", children: s.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.label })
      ] })
    ] }) }, s.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-sm font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "h-4 w-4 text-muted-foreground" }),
        "Scheduled Backups"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: SCHEDULED_BACKUPS.map((sched) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3 border border-border/40",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3.5 w-3.5 text-emerald-500" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: sched.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  "Next: ",
                  sched.next
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-xs rounded-full px-2.5 py-0.5 bg-muted text-muted-foreground border-border", children: sched.freq })
          ]
        },
        sched.label
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Backup History" }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, n)) }) : backups && backups.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border/50 overflow-hidden shadow-card divide-y divide-border/40", children: [...backups].sort((a, b) => Number(b.createdAt) - Number(a.createdAt)).map((backup) => {
        const meta = STATUS_META[backup.status];
        const Icon = meta.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-4 bg-card px-4 py-3.5 hover:bg-muted/30 transition-colors duration-150",
            "data-ocid": `backup-${backup.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArchiveRestore, { className: "h-4 w-4 text-indigo-500" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: backup.backupLabel }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  formatDistanceToNow(
                    Number(backup.createdAt) / 1e6
                  ),
                  " ",
                  "ago ·",
                  " ",
                  format(
                    new Date(Number(backup.createdAt) / 1e6),
                    "MMM d, yyyy"
                  )
                ] })
              ] }),
              backup.sizeBytes !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "h-3 w-3" }),
                (Number(backup.sizeBytes) / 1024).toFixed(1),
                " KB"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  className: `text-xs rounded-full px-2.5 py-0.5 ${meta.className}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "mr-1 h-3 w-3" }),
                    meta.label
                  ]
                }
              ),
              backup.status === BackupStatus.Completed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => setRestoreTarget(backup),
                  "data-ocid": `restore-btn-${backup.id}`,
                  className: "text-xs gap-1.5 shrink-0 active-press",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3 w-3" }),
                    "Restore"
                  ]
                }
              )
            ]
          },
          backup.id
        );
      }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 py-16 text-center",
          "data-ocid": "backups-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArchiveRestore, { className: "h-10 w-10 text-muted-foreground/40 mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No backups yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Create your first backup to protect workspace data." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "mt-4 active-press",
                onClick: () => setShowCreateDialog(true),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-3.5 w-3.5" }),
                  " Create Backup"
                ]
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showCreateDialog, onOpenChange: setShowCreateDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Create New Backup" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "A snapshot of your workspace data will be created." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "backup-label", children: "Backup Label" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "backup-label",
            value: backupLabel,
            onChange: (e) => setBackupLabel(e.target.value),
            placeholder: `Backup ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`,
            "data-ocid": "backup-label-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setShowCreateDialog(false),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => createBackup(),
            disabled: isPending,
            "data-ocid": "backup-confirm-btn",
            className: "active-press",
            children: isPending ? "Creating..." : "Create Backup"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!restoreTarget,
        onOpenChange: (open) => !open && setRestoreTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 text-destructive" }),
              " Confirm Restore"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
              "This will restore your workspace to the state of",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: restoreTarget == null ? void 0 : restoreTarget.backupLabel }),
              ". All changes made after this backup will be lost. This action cannot be undone."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setRestoreTarget(null), children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "destructive",
                disabled: isRestoring,
                onClick: () => {
                  const label = (restoreTarget == null ? void 0 : restoreTarget.backupLabel) ?? "backup";
                  setIsRestoring(true);
                  ue.loading(`Restoring from backup "${label}"...`, {
                    id: "restore-toast"
                  });
                  setTimeout(() => {
                    setIsRestoring(false);
                    setRestoreTarget(null);
                    ue.success(
                      `Workspace restored from "${label}" successfully.`,
                      { id: "restore-toast", duration: 5e3 }
                    );
                  }, 1500);
                },
                "data-ocid": "restore-confirm-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RotateCcw,
                    {
                      className: `mr-2 h-4 w-4 ${isRestoring ? "animate-spin" : ""}`
                    }
                  ),
                  isRestoring ? "Restoring..." : "Restore Workspace"
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  AdminBackupPage as default
};
