import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/app" });
    }
  }, [isAuthenticated, navigate]);

  if (isLoading)
    return (
      <LoadingSpinner fullPage label="Connecting to Internet Identity..." />
    );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/3 top-1/4 h-[400px] w-[400px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute right-1/3 bottom-1/4 h-[300px] w-[300px] rounded-full bg-accent/8 blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md rounded-3xl border border-border bg-card p-10 shadow-xl text-center"
      >
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
          <span className="font-display text-xl font-bold text-primary-foreground">
            F
          </span>
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Welcome to Fourthspace
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Sign in with Internet Identity to access your workspace. Secure,
          decentralized, and private.
        </p>
        <Button
          size="lg"
          onClick={login}
          className="mt-8 w-full gap-2"
          data-ocid="login-btn"
        >
          <Sparkles className="h-4 w-4" />
          Sign in with Internet Identity
          <ArrowRight className="h-4 w-4" />
        </Button>
        <p className="mt-6 text-xs text-muted-foreground">
          No passwords. No email required. Your identity, your control.
        </p>
      </motion.div>
    </div>
  );
}
