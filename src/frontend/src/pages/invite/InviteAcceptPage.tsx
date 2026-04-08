import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createActor } from "../../backend";
import { getTenantId } from "../../hooks/useWorkspace";

type AcceptStep = "loading" | "success" | "error";

interface GuestUser {
  id: string;
  tenantId: string;
  email: string;
  projectIds: string[];
  status: string;
  createdAt: bigint;
}

interface InviteActor {
  acceptGuestInvitation: (
    tenantId: string,
    token: string,
  ) => Promise<GuestUser | null>;
}

function BrandMark() {
  return (
    <div className="flex flex-col items-center gap-2 mb-2">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg">
        <span className="font-display text-lg font-bold text-primary-foreground">
          F
        </span>
      </div>
      <div className="text-center">
        <p className="text-base font-display font-bold text-foreground">
          Fourthspace
        </p>
        <p className="text-xs text-muted-foreground">
          Your all-in-one workspace
        </p>
      </div>
    </div>
  );
}

export default function InviteAcceptPage() {
  const { token } = useParams({ from: "/invite/$token" });
  const { actor: rawActor, isFetching } = useActor(createActor);
  const actor = rawActor as unknown as InviteActor | null;
  const tenantId = getTenantId();
  const [step, setStep] = useState<AcceptStep>("loading");
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);

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
    onError: () => setStep("error"),
  });

  const { mutate, isIdle } = acceptMutation;

  useEffect(() => {
    if (actor && !isFetching && isIdle) mutate();
  }, [actor, isFetching, isIdle, mutate]);

  if (step === "loading" || acceptMutation.isPending) {
    return (
      <div
        className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-6"
        data-ocid="invite-loading"
      >
        <BrandMark />
        <Card className="w-full max-w-md border-border/50 shadow-card">
          <CardContent className="p-8 space-y-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-xl font-bold text-foreground">
                Verifying your invitation…
              </h2>
              <p className="text-sm text-muted-foreground">
                Please wait while we validate your invite link.
              </p>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-3/4 mx-auto" />
              <Skeleton className="h-3 w-1/2 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div
        className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-6"
        data-ocid="invite-error"
      >
        <BrandMark />
        <Card className="w-full max-w-md border-border/50 shadow-card">
          <CardContent className="p-8 space-y-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mx-auto">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-xl font-bold text-foreground">
                Invitation not valid
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This invitation link has expired, already been used, or is
                invalid. Please contact your project administrator for a new
                invitation.
              </p>
            </div>
            <div className="rounded-xl bg-muted/30 border border-border/40 p-4 text-left space-y-2">
              <p className="text-xs font-semibold text-foreground">
                What to do next:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Ask your project admin to resend the invite</li>
                <li>Check your email for a newer invitation link</li>
                <li>
                  Make sure you're using the exact URL from the invite email
                </li>
              </ul>
            </div>
            <Button
              variant="outline"
              className="w-full active-press"
              asChild
              data-ocid="back-to-home-btn"
            >
              <Link to="/">Go to Fourthspace</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-6"
      data-ocid="invite-success"
    >
      <BrandMark />
      <Card className="w-full max-w-md border-border/50 shadow-card">
        <CardContent className="p-8 space-y-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 mx-auto ring-2 ring-emerald-500/20">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-xl font-bold text-foreground">
              You're in!
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You now have guest access to this project. You can view tasks,
              browse shared files, and leave comments.
            </p>
          </div>

          {guestUser && (
            <div className="flex items-center gap-3 rounded-xl bg-muted/30 border border-border/40 p-4 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold shrink-0">
                {guestUser.email.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {guestUser.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  Guest · Read-only access
                </p>
              </div>
              <div className="ml-auto flex items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-medium shrink-0">
                Active
              </div>
            </div>
          )}

          <div className="space-y-2 text-sm text-muted-foreground text-left">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>View project tasks and progress</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Access shared documents and files</span>
            </div>
          </div>

          <Button
            className="w-full active-press"
            asChild
            data-ocid="go-to-project-btn"
          >
            <Link
              to="/app/projects/$projectId"
              params={{ projectId: guestUser?.projectIds[0] ?? "" }}
            >
              Go to Project <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
