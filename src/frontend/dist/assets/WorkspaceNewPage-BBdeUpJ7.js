import { j as jsxRuntimeExports, x as cn, an as cva, d as useNavigate, n as useQueryClient, e as useActor, f as useWorkspace, r as reactExports, g as getTenantId, k as Building2, B as Button, S as Sparkles, P as Plus, ao as setWorkspaceId, l as createActor } from "./index-BZqaRhAX.js";
import { C as Card, a as CardContent } from "./card-DQu6DGwy.js";
import { I as Input } from "./input-BJtw5f9h.js";
import { L as Label } from "./label-CvyzRjc5.js";
import { T as Textarea } from "./textarea-CZBafaSY.js";
import { u as ue } from "./index-BRf-248B.js";
import { A as ArrowLeft } from "./arrow-left-BCLeiEG1.js";
import { m as motion } from "./proxy-Dsq4P-mS.js";
import { L as LoaderCircle } from "./loader-circle-MfA_AsIp.js";
import { C as CircleAlert } from "./circle-alert-BzUnhcW5.js";
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Alert({
  className,
  variant,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert",
      role: "alert",
      className: cn(alertVariants({ variant }), className),
      ...props
    }
  );
}
function AlertDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-description",
      className: cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      ),
      ...props
    }
  );
}
function WorkspaceNewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { actor, isFetching } = useActor(createActor);
  const { userProfile } = useWorkspace();
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const tenantId = getTenantId();
  const isFirstWorkspace = !localStorage.getItem("fourthspace_has_workspace");
  const actorReady = !!actor && !isFetching;
  async function handleCreate() {
    setError(null);
    if (!name.trim()) {
      setError("Workspace name is required.");
      return;
    }
    if (!actor) {
      setError(
        "Still connecting to backend. Please wait a moment and try again."
      );
      return;
    }
    setIsSubmitting(true);
    try {
      const ownerDisplayName = (userProfile == null ? void 0 : userProfile.displayName) ?? "Workspace Owner";
      const ownerEmail = (userProfile == null ? void 0 : userProfile.email) ?? "";
      const result = await actor.createWorkspace(
        tenantId,
        { name: name.trim() },
        ownerDisplayName,
        ownerEmail
      );
      if (result.__kind__ === "ok") {
        const workspace = result.ok;
        setWorkspaceId(workspace.id);
        localStorage.setItem("activeWorkspaceId", workspace.id);
        localStorage.setItem("fourthspace_has_workspace", "true");
        await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        await queryClient.invalidateQueries({ queryKey: ["myProfile"] });
        ue.success(`Workspace "${workspace.name}" created!`);
        void navigate({
          to: "/app/$workspaceId/dashboard",
          params: { workspaceId: workspace.id }
        });
      } else {
        const errMsg = result.__kind__ === "err" ? String(result.err) : "Failed to create workspace. Please try again.";
        setError(errMsg);
        ue.error(errMsg);
      }
    } catch (e) {
      let msg = "Something went wrong. Please try again.";
      if (e instanceof Error) {
        if (e.message.includes("IC0508") || e.message.includes("stopped")) {
          msg = "The backend is temporarily unavailable (canister stopped). Please try again in a moment.";
        } else {
          msg = e.message;
        }
      }
      setError(msg);
      ue.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full bg-accent/5 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-0 opacity-[0.025]",
          style: {
            backgroundImage: "radial-gradient(circle, oklch(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative h-14 bg-card/80 border-b border-border backdrop-blur-sm flex items-center px-6 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-lg bg-primary flex items-center justify-center shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3.5 w-3.5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-foreground tracking-tight", children: "Fourthspace" })
      ] }),
      !isFirstWorkspace && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "ml-auto gap-1.5 text-muted-foreground hover:text-foreground transition-smooth",
          onClick: () => void navigate({ to: "/app/workspaces" }),
          "data-ocid": "new-workspace-back",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
            "Back to workspaces"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "relative flex-1 flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, ease: "easeOut" },
        className: "w-full max-w-md",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.08, duration: 0.35 },
              className: "text-center mb-7",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-flex mb-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-8 w-8 text-primary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center border-2 border-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-2.5 w-2.5 text-primary-foreground" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground tracking-tight mb-2", children: isFirstWorkspace ? "Welcome to Fourthspace!" : "Create workspace" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto", children: isFirstWorkspace ? "Create your first workspace to organize your team's notes, projects, and more." : "Set up a new isolated workspace for a team or project." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.15, duration: 0.35 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border shadow-sm bg-card/90 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 space-y-5", children: [
                !actorReady && !isSubmitting && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg bg-muted/50 border border-border px-3 py-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 text-muted-foreground animate-spin shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Connecting to backend…" })
                ] }),
                error && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", className: "py-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-xs", children: error })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: "workspace-name",
                      className: "text-sm font-medium",
                      children: [
                        "Workspace name ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "workspace-name",
                      placeholder: "e.g. Acme Team, Marketing, Design",
                      value: name,
                      onChange: (e) => {
                        setName(e.target.value);
                        if (error) setError(null);
                      },
                      onKeyDown: (e) => {
                        if (e.key === "Enter" && name.trim() && actorReady) {
                          void handleCreate();
                        }
                      },
                      disabled: isSubmitting,
                      autoFocus: true,
                      className: "h-10 text-sm border-input focus-visible:ring-primary/30 focus-visible:border-primary/60 transition-smooth",
                      "data-ocid": "new-workspace-name-input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "This will be visible to all workspace members." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: "workspace-description",
                      className: "text-sm font-medium",
                      children: [
                        "Description",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs", children: "(optional)" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: "workspace-description",
                      placeholder: "What is this workspace for? (optional)",
                      value: description,
                      onChange: (e) => setDescription(e.target.value),
                      disabled: isSubmitting,
                      rows: 2,
                      className: "text-sm resize-none border-input focus-visible:ring-primary/30 focus-visible:border-primary/60 transition-smooth",
                      "data-ocid": "new-workspace-description-input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    className: "w-full h-10 gap-2 font-semibold active-press",
                    size: "lg",
                    onClick: () => void handleCreate(),
                    disabled: !name.trim() || isSubmitting || !actorReady,
                    "data-ocid": "new-workspace-submit",
                    children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                      "Creating workspace…"
                    ] }) : !actorReady ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                      "Connecting…"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4" }),
                      isFirstWorkspace ? "Create my workspace" : "Create workspace"
                    ] })
                  }
                ),
                !actorReady && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: "Waiting for backend connection…" })
              ] }) })
            }
          ),
          isFirstWorkspace && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.3, duration: 0.4 },
              className: "mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground",
              children: ["Notes & Projects", "Chat & Calendar", "Payroll & Escrow"].map(
                (feat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-primary/50" }),
                  feat
                ] }, feat)
              )
            }
          )
        ]
      }
    ) })
  ] });
}
export {
  WorkspaceNewPage as default
};
