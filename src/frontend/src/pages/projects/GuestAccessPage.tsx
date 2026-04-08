import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Copy,
  Mail,
  Shield,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import { useWorkspace } from "../../hooks/useWorkspace";

type GuestStatus = "Pending" | "Active" | "Revoked";

interface GuestUser {
  id: string;
  tenantId: string;
  email: string;
  projectIds: string[];
  status: GuestStatus;
  createdAt: bigint;
}

interface GuestInvitation {
  id: string;
  tenantId: string;
  projectId: string;
  inviteeEmail: string;
  inviteToken: string;
  expiresAt: bigint;
  accepted: boolean;
  createdAt: bigint;
}

interface GuestActor {
  listGuestUsers: (
    tenantId: string,
    workspaceId: string,
  ) => Promise<GuestUser[]>;
  createGuestInvitation: (input: {
    tenantId: string;
    workspaceId: string;
    projectId: string;
    inviteeEmail: string;
    expiresInDays: number;
  }) => Promise<GuestInvitation>;
  updateGuestStatus: (
    tenantId: string,
    workspaceId: string,
    id: string,
    status: string,
  ) => Promise<GuestUser | null>;
}

const STATUS_COLORS: Record<GuestStatus, string> = {
  Active:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Pending:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Revoked: "bg-muted text-muted-foreground border-border",
};

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function GuestAccessPage() {
  const { workspaceId, projectId } = useParams({
    from: "/app/$workspaceId/projects/$projectId/guests",
  });
  const { actor: rawActor, isFetching } = useActor(createActor);
  const actor = rawActor as unknown as GuestActor | null;
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("30");
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: guests = [], isLoading } = useQuery<GuestUser[]>({
    queryKey: ["guestUsers", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listGuestUsers(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching,
  });

  const inviteMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.createGuestInvitation({
        tenantId,
        workspaceId,
        projectId,
        inviteeEmail: email,
        expiresInDays: Number(expiresInDays),
      });
    },
    onSuccess: (invitation) => {
      const link = `${window.location.origin}/invite/${invitation.inviteToken}`;
      setInviteLink(link);
      setEmail("");
      toast.success("Invitation created", {
        description: `Invite link generated for ${invitation.inviteeEmail}`,
      });
      queryClient.invalidateQueries({
        queryKey: ["guestUsers", tenantId, workspaceId, projectId],
      });
    },
    onError: () => toast.error("Failed to create invitation"),
  });

  const revokeMutation = useMutation({
    mutationFn: async (guestId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateGuestStatus(tenantId, workspaceId, guestId, "Revoked");
    },
    onSuccess: () => {
      toast.success("Guest access revoked");
      queryClient.invalidateQueries({
        queryKey: ["guestUsers", tenantId, workspaceId, projectId],
      });
    },
    onError: () => toast.error("Failed to revoke access"),
  });

  const handleCopy = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeCount = guests.filter((g) => g.status === "Active").length;
  const pendingCount = guests.filter((g) => g.status === "Pending").length;

  return (
    <div
      className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto animate-fade-in-up"
      data-ocid="guest-access-page"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="shrink-0 hover:bg-muted"
        >
          <Link
            to="/app/$workspaceId/projects/$projectId"
            params={{ workspaceId, projectId }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <Users className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Guest Access
          </h1>
          <p className="text-sm text-muted-foreground">
            Invite external collaborators with read-only access
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Active Guests",
            value: activeCount,
            icon: Users,
            color: "text-emerald-500 bg-emerald-500/10",
          },
          {
            label: "Pending Invites",
            value: pendingCount,
            icon: Mail,
            color: "text-amber-500 bg-amber-500/10",
          },
          {
            label: "Access Level",
            value: "Guest",
            icon: Shield,
            color: "text-primary bg-primary/10",
          },
        ].map((s) => (
          <Card key={s.label} className="border-border/50 bg-card shadow-card">
            <CardContent className="p-3 md:p-4 flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${s.color}`}
              >
                <s.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-display font-bold text-foreground leading-tight">
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {s.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invite Form */}
        <Card
          className="border-border/50 bg-card shadow-card"
          data-ocid="invite-form-card"
        >
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              Invite Guest
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guest-email">Email address</Label>
              <Input
                id="guest-email"
                type="email"
                placeholder="guest@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-ocid="guest-email-input"
              />
            </div>
            <div className="space-y-2">
              <Label>Permission Level</Label>
              <div className="flex h-10 items-center rounded-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground gap-2">
                <Shield className="h-4 w-4 shrink-0 text-primary" />
                <span>Guest — read-only access to this project</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry-select">Invitation expires</Label>
              <Select value={expiresInDays} onValueChange={setExpiresInDays}>
                <SelectTrigger id="expiry-select" data-ocid="expiry-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">In 7 days</SelectItem>
                  <SelectItem value="30">In 30 days</SelectItem>
                  <SelectItem value="90">In 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full active-press"
              onClick={() => inviteMutation.mutate()}
              disabled={!email.trim() || inviteMutation.isPending}
              data-ocid="send-invite-btn"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {inviteMutation.isPending ? "Sending…" : "Send Invitation"}
            </Button>
            {inviteLink && (
              <div
                className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3"
                data-ocid="invite-link-box"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="h-4 w-4 shrink-0" />
                  Invitation created — share this link
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 truncate text-xs bg-muted rounded px-2 py-1.5 font-mono text-foreground">
                    {inviteLink}
                  </code>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 shrink-0 active-press"
                    onClick={handleCopy}
                    aria-label="Copy invite link"
                    data-ocid="copy-invite-link-btn"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Guest List */}
        <Card
          className="border-border/50 bg-card shadow-card"
          data-ocid="guest-list-card"
        >
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Active Guests
              {guests.length > 0 && (
                <Badge className="ml-auto text-xs rounded-full px-2.5 py-0.5 bg-muted text-muted-foreground border-border">
                  {guests.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="px-6 pb-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : guests.length === 0 ? (
              <div
                className="px-6 pb-8 pt-4 text-center"
                data-ocid="guests-empty-state"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto mb-3">
                  <Users className="h-5 w-5 text-muted-foreground/60" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No guests yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Send an invitation to add external collaborators.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {guests.map((guest) => (
                  <div
                    key={guest.id}
                    className="flex items-start gap-3 px-4 py-3.5 hover:bg-muted/20 transition-colors duration-150"
                    data-ocid={`guest-row-${guest.id}`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
                      {guest.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {guest.email}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          className={`text-xs rounded-full px-2 py-0.5 ${STATUS_COLORS[guest.status] ?? ""}`}
                        >
                          {guest.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Invited {formatDate(guest.createdAt)}
                        </span>
                      </div>
                    </div>
                    {guest.status === "Active" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                        onClick={() => revokeMutation.mutate(guest.id)}
                        disabled={revokeMutation.isPending}
                        aria-label={`Revoke access for ${guest.email}`}
                        data-ocid={`revoke-guest-${guest.id}`}
                      >
                        <UserMinus className="h-3.5 w-3.5 mr-1" />
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
