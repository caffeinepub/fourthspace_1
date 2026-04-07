import { g as createLucideIcon, j as jsxRuntimeExports, X, n as cn, a as useNavigate, d as useQueryClient, h as getTenantId, r as reactExports, e as useQuery, aw as BackupStatus, B as Button } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle } from "./card-wy6FYjGT.js";
import { R as Root, C as Content, b as Close, a as Title, D as Description, P as Portal, O as Overlay } from "./index-Cjvi6AGX.js";
import { I as Input } from "./input-C0aO0R3D.js";
import { L as Label } from "./label-CBtn2p-5.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { u as useMutation } from "./useMutation-BeBnUQJD.js";
import { u as ue } from "./index-p-k3Ndic.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { A as ArrowLeft } from "./arrow-left-mNBAKt8w.js";
import { A as ArchiveRestore } from "./archive-restore-DbP-zIzg.js";
import { P as Plus } from "./plus-DNap1HPx.js";
import { C as Clock } from "./clock-xD41YETq.js";
import { C as CircleAlert } from "./circle-alert-2s6nWhnT.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-gmG56FeV.js";
import { f as format } from "./format-BjBbZPfh.js";
import "./en-US-CJ_JRP0W.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5", key: "1osxxc" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M3 10h5", key: "r794hk" }],
  ["path", { d: "M17.5 17.5 16 16.3V14", key: "akvzfd" }],
  ["circle", { cx: "16", cy: "16", r: "6", key: "qoo3c4" }]
];
const CalendarClock = createLucideIcon("calendar-clock", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
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
const HardDrive = createLucideIcon("hard-drive", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode);
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "dialog", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Description,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
const STATUS_META = {
  [BackupStatus.Completed]: {
    icon: CircleCheckBig,
    className: "bg-green-500/10 text-green-600 border-green-200 dark:border-green-900",
    label: "Completed"
  },
  [BackupStatus.Running]: {
    icon: Clock,
    className: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900",
    label: "Running"
  },
  [BackupStatus.Failed]: {
    icon: CircleAlert,
    className: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900",
    label: "Failed"
  },
  [BackupStatus.Pending]: {
    icon: Clock,
    className: "bg-muted text-muted-foreground",
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
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const [showCreateDialog, setShowCreateDialog] = reactExports.useState(false);
  const [backupLabel, setBackupLabel] = reactExports.useState("");
  const [restoreTarget, setRestoreTarget] = reactExports.useState(null);
  const [isRestoring, setIsRestoring] = reactExports.useState(false);
  const { data: backups, isLoading } = useQuery({
    queryKey: ["backups", tenantId],
    queryFn: async () => actor ? actor.listBackups(tenantId) : [],
    enabled: !!actor && !isFetching
  });
  const { mutate: createBackup, isPending } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const label = backupLabel.trim() || `Backup ${(/* @__PURE__ */ new Date()).toLocaleString()}`;
      return actor.createBackup(tenantId, label);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: "/app/admin" }),
          "aria-label": "Back to admin",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArchiveRestore, { className: "h-4 w-4 text-indigo-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Backup & Restore" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Protect and recover your workspace data" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: () => setShowCreateDialog(true),
          "data-ocid": "backup-create-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-3.5 w-3.5" }),
            "Create Backup"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArchiveRestore, { className: "h-4 w-4 text-indigo-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold font-display text-foreground", children: isLoading ? "—" : (backups == null ? void 0 : backups.length) ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Backups" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-green-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold font-display text-foreground", children: isLoading ? "—" : completedBackups.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Completed" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "h-4 w-4 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold font-display text-foreground", children: isLoading ? "—" : `${totalSizeKB.toFixed(0)} KB` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Storage" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-sm font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "h-4 w-4 text-muted-foreground" }),
        "Scheduled Backups"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: SCHEDULED_BACKUPS.map((sched) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: sched.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                "Next: ",
                sched.next
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: sched.freq })
          ]
        },
        sched.label
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground text-sm", children: "Backup History" }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, n)) }) : backups && backups.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [...backups].sort((a, b) => Number(b.createdAt) - Number(a.createdAt)).map((backup) => {
        const meta = STATUS_META[backup.status];
        const Icon = meta.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:bg-muted/20 transition-smooth",
            "data-ocid": `backup-${backup.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArchiveRestore, { className: "h-4 w-4 text-indigo-500" }) }),
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
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: meta.className, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "mr-1 h-3 w-3" }),
                meta.label
              ] }),
              backup.status === BackupStatus.Completed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => setRestoreTarget(backup),
                  "data-ocid": `restore-btn-${backup.id}`,
                  className: "text-xs gap-1.5 shrink-0",
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
          className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center",
          "data-ocid": "backups-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArchiveRestore, { className: "h-10 w-10 text-muted-foreground mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No backups yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Create your first backup to protect workspace data." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "mt-4",
                onClick: () => setShowCreateDialog(true),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-3.5 w-3.5" }),
                  "Create Backup"
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
              "Confirm Restore"
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
                  ue.loading(
                    `Restoring from backup "${label}"... (simulated)`,
                    {
                      id: "restore-toast"
                    }
                  );
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
