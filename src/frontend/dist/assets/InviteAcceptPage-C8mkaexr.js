import { m as useParams, e as useActor, g as getTenantId, r as reactExports, j as jsxRuntimeExports, B as Button, i as Link, l as createActor } from "./index-BZqaRhAX.js";
import { C as Card, a as CardContent } from "./card-DQu6DGwy.js";
import { S as Skeleton } from "./skeleton-CXUiMpVp.js";
import { u as useMutation } from "./useMutation-CLofsIuD.js";
import { L as LoaderCircle } from "./loader-circle-MfA_AsIp.js";
import { C as CircleAlert } from "./circle-alert-BzUnhcW5.js";
import { C as CircleCheck } from "./circle-check-wa2s5his.js";
import { U as Users } from "./users-hFv2lO5Q.js";
import { A as ArrowRight } from "./arrow-right-vB32eJ-w.js";
function BrandMark() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 mb-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-bold text-primary-foreground", children: "F" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-display font-bold text-foreground", children: "Fourthspace" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Your all-in-one workspace" })
    ] })
  ] });
}
function InviteAcceptPage() {
  const { token } = useParams({ from: "/invite/$token" });
  const { actor: rawActor, isFetching } = useActor(createActor);
  const actor = rawActor;
  const tenantId = getTenantId();
  const [step, setStep] = reactExports.useState("loading");
  const [guestUser, setGuestUser] = reactExports.useState(null);
  const acceptMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.acceptGuestInvitation(tenantId, token);
    },
    onSuccess: (user) => {
      if (user) {
        setGuestUser(user);
        setStep("success");
      } else setStep("error");
    },
    onError: () => setStep("error")
  });
  const { mutate, isIdle } = acceptMutation;
  reactExports.useEffect(() => {
    if (actor && !isFetching && isIdle) mutate();
  }, [actor, isFetching, isIdle, mutate]);
  if (step === "loading" || acceptMutation.isPending) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-6",
        "data-ocid": "invite-loading",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BrandMark, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "w-full max-w-md border-border/50 shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-8 space-y-6 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 text-primary animate-spin" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Verifying your invitation…" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Please wait while we validate your invite link." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4 mx-auto" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2 mx-auto" })
            ] })
          ] }) })
        ]
      }
    );
  }
  if (step === "error") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-6",
        "data-ocid": "invite-error",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BrandMark, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "w-full max-w-md border-border/50 shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-8 space-y-6 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-8 w-8 text-destructive" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Invitation not valid" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "This invitation link has expired, already been used, or is invalid. Please contact your project administrator for a new invitation." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/30 border border-border/40 p-4 text-left space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "What to do next:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-xs text-muted-foreground space-y-1 list-disc list-inside", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Ask your project admin to resend the invite" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Check your email for a newer invitation link" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Make sure you're using the exact URL from the invite email" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "w-full active-press",
                asChild: true,
                "data-ocid": "back-to-home-btn",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Go to Fourthspace" })
              }
            )
          ] }) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-6",
      "data-ocid": "invite-success",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BrandMark, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "w-full max-w-md border-border/50 shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-8 space-y-6 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 mx-auto ring-2 ring-emerald-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-8 w-8 text-emerald-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "You're in!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "You now have guest access to this project. You can view tasks, browse shared files, and leave comments." })
          ] }),
          guestUser && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl bg-muted/30 border border-border/40 p-4 text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold shrink-0", children: guestUser.email.charAt(0).toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: guestUser.email }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Guest · Read-only access" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto flex items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-medium shrink-0", children: "Active" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm text-muted-foreground text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-500 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "View project tasks and progress" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-emerald-500 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Access shared documents and files" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full active-press",
              asChild: true,
              "data-ocid": "go-to-project-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/app/projects/$projectId",
                  params: { projectId: (guestUser == null ? void 0 : guestUser.projectIds[0]) ?? "" },
                  children: [
                    "Go to Project ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 ml-2" })
                  ]
                }
              )
            }
          )
        ] }) })
      ]
    }
  );
}
export {
  InviteAcceptPage as default
};
