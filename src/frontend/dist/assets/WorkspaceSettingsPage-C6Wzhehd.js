import { r as reactExports, ax as useDirection, J as useControllableState, j as jsxRuntimeExports, O as Primitive, K as useId, aU as Root, aV as Item, Q as composeEventHandlers, N as Presence, aW as createRovingFocusGroupScope, _ as createContextScope, x as cn, m as useParams, e as useActor, an as useInternetIdentity, g as getTenantId, h as useQuery, o as WorkspaceRole, n as useQueryClient, d as useNavigate, B as Button, ar as setWorkspaceId, aX as Principal, l as createActor } from "./index-CQ7TXF2a.js";
import { A as AlertDialog, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-DES_njqi.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DtVZ2GZq.js";
import { I as Input } from "./input-Dkit6sfw.js";
import { L as Label } from "./label-ANHtprqJ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C1Xsy-LN.js";
import { S as Skeleton } from "./skeleton-CzZABium.js";
import { u as ue } from "./index-BGFcG_k-.js";
import { L as LoaderCircle } from "./loader-circle-CcnovRzn.js";
import { C as Copy } from "./copy-D2FV6GwB.js";
import { S as ShieldAlert } from "./shield-alert-Bm8DKB1s.js";
import { T as Trash2 } from "./trash-2-CGgRyVAn.js";
import { U as UserPlus } from "./user-plus-CZHggzrT.js";
import { C as Calendar } from "./calendar-BUBDkMEv.js";
import { U as UserMinus } from "./user-minus-DuoBQ4yA.js";
import { G as Globe } from "./globe-CFCJUvx_.js";
import { E as ExternalLink } from "./external-link-DkhI2mPR.js";
import { R as RefreshCw } from "./refresh-cw-DpvTmWmJ.js";
import "./index-BlAsmRnL.js";
import "./index-IXOTxK3N.js";
import "./index-CkN0xm2T.js";
import "./chevron-up-56u9dcHi.js";
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
const ROLE_LABELS = {
  [WorkspaceRole.Admin]: "Admin",
  [WorkspaceRole.Manager]: "Manager",
  [WorkspaceRole.TeamMember]: "Team Member",
  [WorkspaceRole.Guest]: "Guest"
};
const ROLE_BADGE_CLASS = {
  [WorkspaceRole.Admin]: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  [WorkspaceRole.Manager]: "bg-secondary/10 text-secondary-foreground border-secondary/20",
  [WorkspaceRole.TeamMember]: "bg-primary/10 text-primary border-primary/20",
  [WorkspaceRole.Guest]: "bg-muted text-muted-foreground border-border"
};
function RoleBadge({ role }) {
  const cls = ROLE_BADGE_CLASS[role] ?? "bg-muted text-muted-foreground border-border";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`,
      children: ROLE_LABELS[role] ?? role
    }
  );
}
function formatDate(ts) {
  const ms = typeof ts === "bigint" ? Number(ts) / 1e6 : ts;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function PublicGoalsSection({
  tenantId,
  workspaceId
}) {
  const { actor, isFetching } = useActor(createActor);
  const [shareToken, setShareToken] = reactExports.useState("");
  const [isRegenerating, setIsRegenerating] = reactExports.useState(false);
  const publicUrl = shareToken ? `${window.location.origin}/public/goals/${shareToken}` : "";
  const { isLoading: isLoadingToken } = useQuery({
    queryKey: ["workspaceShareToken", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return "";
      const token = await actor.getOrCreateWorkspaceShareToken(
        workspaceId,
        tenantId
      );
      setShareToken(token);
      return token;
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const handleCopyLink = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    ue.success("Link copied to clipboard");
  };
  const handleRegenerate = async () => {
    if (!actor) return;
    setIsRegenerating(true);
    try {
      const newToken = await actor.regenerateWorkspaceShareToken(
        workspaceId,
        tenantId
      );
      setShareToken(newToken);
      ue.success("Share link regenerated — previous link is now invalid");
    } catch {
      ue.error("Failed to regenerate link");
    } finally {
      setIsRegenerating(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "border-border/50 bg-card shadow-card",
      "data-ocid": "public-goals-link-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4 text-primary" }),
            "Public Goals Link"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Share with external stakeholders so they can view OKR progress without logging in." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          isLoadingToken ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-md" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Shareable URL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  readOnly: true,
                  value: publicUrl,
                  placeholder: "Generating link…",
                  className: "flex-1 font-mono text-xs text-muted-foreground bg-muted/30 cursor-default focus-visible:ring-0",
                  onClick: (e) => e.target.select(),
                  "data-ocid": "public-goals-url-input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: handleCopyLink,
                  disabled: !publicUrl,
                  className: "shrink-0 active-press",
                  "data-ocid": "public-goals-copy-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5 mr-1.5" }),
                    "Copy"
                  ]
                }
              ),
              publicUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "shrink-0 h-9 w-9 hover:bg-muted",
                  asChild: true,
                  "aria-label": "Open public goals page",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: publicUrl, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5" }) })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-sm", children: "Regenerating the link will invalidate the previous URL." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: handleRegenerate,
                disabled: isRegenerating || isLoadingToken,
                className: "shrink-0 active-press",
                "data-ocid": "public-goals-regenerate-btn",
                children: [
                  isRegenerating ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5 mr-1.5" }),
                  "Regenerate"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function GeneralTab({
  workspace,
  tenantId,
  workspaceId,
  isAdmin
}) {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [name, setName] = reactExports.useState(workspace.name);
  const [isRenaming, setIsRenaming] = reactExports.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = reactExports.useState(false);
  const [confirmName, setConfirmName] = reactExports.useState("");
  const handleSave = async () => {
    if (!actor || !name.trim()) return;
    setIsRenaming(true);
    try {
      const res = await actor.updateWorkspace(
        tenantId,
        workspaceId,
        name.trim()
      );
      if (res.__kind__ === "ok") {
        queryClient.invalidateQueries({
          queryKey: ["workspace", tenantId, workspaceId]
        });
        queryClient.invalidateQueries({ queryKey: ["workspaces", tenantId] });
        ue.success("Workspace name updated");
      } else ue.error(res.err ?? "Update failed");
    } catch {
      ue.error("Something went wrong");
    } finally {
      setIsRenaming(false);
    }
  };
  const handleCopyId = () => {
    navigator.clipboard.writeText(workspaceId);
    ue.success("Workspace ID copied");
  };
  const handleDelete = () => {
    setWorkspaceId("");
    queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    ue.success("Workspace removed from your account");
    navigate({ to: "/app/workspaces" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold", children: "Workspace name" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: name,
            onChange: (e) => setName(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") handleSave();
            },
            placeholder: "Workspace name",
            className: "flex-1",
            "data-ocid": "workspace-settings-name-input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleSave,
            disabled: isRenaming || !name.trim() || name === workspace.name,
            className: "active-press",
            "data-ocid": "workspace-settings-save-name",
            children: isRenaming ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Save"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold", children: "Workspace ID" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "flex-1 bg-muted/30 rounded-lg px-3 py-2 text-sm font-mono text-muted-foreground truncate border border-border/40", children: workspaceId }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: handleCopyId,
              className: "active-press",
              "data-ocid": "workspace-settings-copy-id",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5 mr-1.5" }),
                "Copy"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Use this ID when integrating with external tools or referencing via API." })
      ] })
    ] }),
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(PublicGoalsSection, { tenantId, workspaceId }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-destructive/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2 text-destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4" }),
        "Danger zone"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Delete this workspace" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Permanent and cannot be undone. All data in this workspace will be lost." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "destructive",
            size: "sm",
            onClick: () => setShowDeleteDialog(true),
            "data-ocid": "workspace-settings-delete-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-1.5" }),
              "Delete"
            ]
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: showDeleteDialog, onOpenChange: setShowDeleteDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete workspace?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "This will permanently delete ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: workspace.name }),
          " and all of its data. Type the workspace name to confirm."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          className: "my-2",
          placeholder: workspace.name,
          value: confirmName,
          onChange: (e) => setConfirmName(e.target.value),
          "data-ocid": "workspace-delete-confirm-input"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            onClick: handleDelete,
            disabled: confirmName !== workspace.name,
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50",
            "data-ocid": "workspace-delete-confirm-action",
            children: "Delete workspace"
          }
        )
      ] })
    ] }) })
  ] });
}
function MembersTab({
  workspace,
  tenantId,
  workspaceId
}) {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = reactExports.useState("");
  const [inviteDisplayName, setInviteDisplayName] = reactExports.useState("");
  const [inviteRole, setInviteRole] = reactExports.useState(
    WorkspaceRole.TeamMember
  );
  const [isInviting, setIsInviting] = reactExports.useState(false);
  const { data: members = [], isLoading } = useQuery({
    queryKey: ["workspaceMembers", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaceMembers(tenantId, workspaceId);
    },
    enabled: !!actor
  });
  const invalidate = reactExports.useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["workspaceMembers", tenantId, workspaceId]
    });
    queryClient.invalidateQueries({
      queryKey: ["workspace", tenantId, workspaceId]
    });
  }, [queryClient, tenantId, workspaceId]);
  const handleInvite = async () => {
    if (!actor || !inviteEmail.trim()) return;
    setIsInviting(true);
    try {
      let userPrincipal;
      try {
        userPrincipal = Principal.fromText(inviteEmail.trim());
      } catch {
        userPrincipal = Principal.anonymous();
      }
      const res = await actor.addWorkspaceMember(
        tenantId,
        workspaceId,
        userPrincipal,
        inviteRole,
        inviteDisplayName.trim() || inviteEmail.trim(),
        inviteEmail.trim()
      );
      if (res.__kind__ === "ok") {
        ue.success("Member added");
        setInviteEmail("");
        setInviteDisplayName("");
        setInviteRole(WorkspaceRole.TeamMember);
        invalidate();
      } else ue.error(res.err ?? "Failed to add member");
    } catch {
      ue.error("Something went wrong");
    } finally {
      setIsInviting(false);
    }
  };
  const handleRoleChange = async (userId, newRole) => {
    if (!actor) return;
    try {
      const res = await actor.updateWorkspaceMemberRole(
        tenantId,
        workspaceId,
        Principal.fromText(userId),
        newRole
      );
      if (res.__kind__ === "ok") {
        ue.success("Role updated");
        invalidate();
      } else ue.error(res.err ?? "Failed to update role");
    } catch {
      ue.error("Something went wrong");
    }
  };
  const handleRemove = async (userId) => {
    if (!actor) return;
    try {
      const res = await actor.removeWorkspaceMember(
        tenantId,
        workspaceId,
        Principal.fromText(userId)
      );
      if (res.__kind__ === "ok") {
        ue.success("Member removed");
        invalidate();
      } else ue.error(res.err ?? "Failed to remove member");
    } catch {
      ue.error("Something went wrong");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 text-primary" }),
        "Add member"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-3 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Display name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Jane Doe",
              value: inviteDisplayName,
              onChange: (e) => setInviteDisplayName(e.target.value),
              "data-ocid": "workspace-invite-name-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Email / user ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "email",
              placeholder: "jane@example.com",
              value: inviteEmail,
              onChange: (e) => setInviteEmail(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") handleInvite();
              },
              "data-ocid": "workspace-invite-email-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: inviteRole,
              onValueChange: (v) => setInviteRole(v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "w-36",
                    "data-ocid": "workspace-invite-role-select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(WorkspaceRole).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: ROLE_LABELS[r] }, r)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleInvite,
            disabled: !inviteEmail.trim() || isInviting,
            className: "active-press",
            "data-ocid": "workspace-invite-submit",
            children: isInviting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Add"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-semibold", children: [
        "Members",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal text-sm", children: [
          "(",
          members.length,
          ")"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-0", children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-36" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 rounded-full" })
        ] }, i)) }),
        !isLoading && members.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-muted-foreground text-sm", children: "No members yet. Add one above." }),
        !isLoading && members.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/40", children: members.map((member, idx) => {
          const memberIdStr = member.userId.toString();
          const ownerIdStr = workspace.ownerId.toString();
          const isOwner = memberIdStr === ownerIdStr;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-3 px-4 py-3.5 hover:bg-muted/20 transition-colors",
              "data-ocid": `workspace-member-row-${idx}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary font-semibold text-sm", children: (member.displayName || member.email || "?").charAt(0).toUpperCase() }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground truncate", children: [
                    member.displayName || member.email || memberIdStr,
                    isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-xs text-muted-foreground font-normal", children: "(Owner)" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: member.email })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-1 text-xs text-muted-foreground shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
                  formatDate(member.joinedAt)
                ] }),
                !isOwner ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: member.role,
                    onValueChange: (v) => handleRoleChange(memberIdStr, v),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectTrigger,
                        {
                          className: "w-32 h-7 text-xs",
                          "data-ocid": `workspace-member-role-select-${idx}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(WorkspaceRole).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, className: "text-xs", children: ROLE_LABELS[r] }, r)) })
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: member.role }),
                !isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0",
                    onClick: () => handleRemove(memberIdStr),
                    "aria-label": `Remove ${member.displayName ?? member.email}`,
                    "data-ocid": `workspace-member-remove-${idx}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserMinus, { className: "h-3.5 w-3.5" })
                  }
                )
              ]
            },
            memberIdStr
          );
        }) })
      ] })
    ] })
  ] });
}
function WorkspaceSettingsPage() {
  var _a;
  const { workspaceId } = useParams({
    from: "/app/$workspaceId/workspace/settings"
  });
  const { actor, isFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const tenantId = getTenantId();
  const { data: workspace, isLoading } = useQuery({
    queryKey: ["workspace", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      const res = await actor.getWorkspace(tenantId, workspaceId);
      if (res.__kind__ === "ok") return res.ok;
      return null;
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: members = [] } = useQuery({
    queryKey: ["workspaceMembers", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaceMembers(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const currentPrincipal = ((_a = identity == null ? void 0 : identity.getPrincipal()) == null ? void 0 : _a.toText()) ?? "";
  const currentMember = members.find(
    (m) => m.userId.toString() === currentPrincipal
  );
  const isAdmin = !!workspace && ((currentMember == null ? void 0 : currentMember.role) === WorkspaceRole.Admin || members.length === 0);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-8 sm:px-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-48" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-72" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-64" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 rounded-xl" })
    ] });
  }
  if (!workspace) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[40vh] text-muted-foreground", children: "Workspace not found." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-8 sm:px-6 animate-fade-in-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: "Workspace settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-1", children: [
        "Manage ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: workspace.name }),
        " — general settings, members, and roles."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "general", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TabsList,
        {
          className: "mb-6 bg-muted/40 border border-border/40",
          "data-ocid": "workspace-settings-tabs",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                value: "general",
                "data-ocid": "workspace-settings-tab-general",
                children: "General"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                value: "members",
                "data-ocid": "workspace-settings-tab-members",
                children: "Members & Roles"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "general", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        GeneralTab,
        {
          workspace,
          tenantId,
          workspaceId,
          isAdmin
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "members", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        MembersTab,
        {
          workspace,
          tenantId,
          workspaceId
        }
      ) })
    ] })
  ] });
}
export {
  WorkspaceSettingsPage as default
};
