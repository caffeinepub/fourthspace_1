import { u as useAuth, a as useNavigate, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner, B as Button, S as Sparkles } from "./index-D7inqmxR.js";
import { m as motion } from "./proxy-XUMZAs9G.js";
import { A as ArrowRight } from "./arrow-right-D7-RcTtv.js";
function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/app" });
    }
  }, [isAuthenticated, navigate]);
  if (isLoading)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { fullPage: true, label: "Connecting to Internet Identity..." });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen items-center justify-center bg-background p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none fixed inset-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-1/3 top-1/4 h-[400px] w-[400px] rounded-full bg-primary/8 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-1/3 bottom-1/4 h-[300px] w-[300px] rounded-full bg-accent/8 blur-3xl" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        className: "relative w-full max-w-md rounded-3xl border border-border bg-card p-10 shadow-xl text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold text-primary-foreground", children: "F" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Welcome to Fourthspace" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Sign in with Internet Identity to access your workspace. Secure, decentralized, and private." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "lg",
              onClick: login,
              className: "mt-8 w-full gap-2",
              "data-ocid": "login-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
                "Sign in with Internet Identity",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-xs text-muted-foreground", children: "No passwords. No email required. Your identity, your control." })
        ]
      }
    )
  ] });
}
export {
  LoginPage as default
};
