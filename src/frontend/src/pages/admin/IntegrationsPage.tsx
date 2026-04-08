import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useBackend } from "@/hooks/useBackend";
import { getTenantId, useWorkspace } from "@/hooks/useWorkspace";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Github,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Integration {
  id: string;
  tenantId: string;
  provider: string;
  accessToken: string;
  config: string;
  status: string;
  createdAt: bigint;
  updatedAt: bigint;
}

interface IntegrationEvent {
  id: string;
  tenantId: string;
  integrationId: string;
  eventType: string;
  payload: string;
  triggerAction?: string;
  timestamp: bigint;
}

type Provider = "Slack" | "GitHub" | "GoogleDrive";
type TriggerAction = "create_task" | "send_notification";

interface AutomationTrigger {
  id: string;
  provider: Provider;
  eventType: string;
  action: TriggerAction;
  targetProject: string;
}

interface ProviderMeta {
  label: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  iconBg: string;
  color: string;
  features: string[];
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function SlackIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
  );
}

function GoogleDriveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── Provider Metadata ───────────────────────────────────────────────────────

const PROVIDER_META: Record<Provider, ProviderMeta> = {
  Slack: {
    label: "Slack",
    description:
      "Post notifications from Fourthspace to Slack channels automatically.",
    icon: SlackIcon,
    iconBg:
      "bg-[#4A154B]/10 text-[#4A154B] dark:bg-[#E01E5A]/10 dark:text-[#E01E5A]",
    color: "border-l-[#4A154B] dark:border-l-[#E01E5A]",
    features: ["Channel notifications", "Task updates", "Payroll alerts"],
  },
  GitHub: {
    label: "GitHub",
    description:
      "Sync GitHub issues to Fourthspace tasks and keep them in lock-step.",
    icon: Github,
    iconBg: "bg-foreground/8 text-foreground",
    color: "border-l-foreground",
    features: ["Issue sync", "PR status tasks", "Commit activity"],
  },
  GoogleDrive: {
    label: "Google Drive",
    description:
      "Attach and preview Google Drive files inside Fourthspace notes and projects.",
    icon: GoogleDriveIcon,
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    color: "border-l-blue-500",
    features: ["File attachments", "Live previews", "Folder sync"],
  },
};

const PROVIDERS: Provider[] = ["Slack", "GitHub", "GoogleDrive"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTs(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadge(status: string) {
  if (status === "connected") {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1 text-xs">
        <CheckCircle2 className="h-3 w-3" /> Connected
      </Badge>
    );
  }
  if (status === "error") {
    return (
      <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1 text-xs">
        <AlertCircle className="h-3 w-3" /> Error
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="gap-1 text-xs">
      <XCircle className="h-3 w-3" /> Not connected
    </Badge>
  );
}

// ─── OAuth Modal ─────────────────────────────────────────────────────────────

function OAuthModal({
  provider,
  open,
  onClose,
  onGrant,
  isGranting,
}: {
  provider: Provider;
  open: boolean;
  onClose: () => void;
  onGrant: () => void;
  isGranting: boolean;
}) {
  const meta = PROVIDER_META[provider];
  const Icon = meta.icon;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${meta.iconBg}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            Connect {meta.label}
          </DialogTitle>
          <DialogDescription>
            Grant Fourthspace access to your {meta.label} account to enable
            integration features.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="rounded-lg bg-muted/40 border border-border p-4 space-y-2">
            <p className="text-xs font-medium text-foreground">
              Fourthspace will be able to:
            </p>
            <ul className="space-y-1">
              {meta.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-3 h-3 shrink-0" />
            <span>Your credentials are stored securely and encrypted.</span>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isGranting}>
            Cancel
          </Button>
          <Button
            onClick={onGrant}
            disabled={isGranting}
            className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0 hover:opacity-90"
            data-ocid={`oauth-grant-${provider.toLowerCase()}`}
          >
            {isGranting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Grant Access
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Add Trigger Modal ────────────────────────────────────────────────────────

function AddTriggerModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (trigger: Omit<AutomationTrigger, "id">) => void;
}) {
  const [provider, setProvider] = useState<Provider>("Slack");
  const [eventType, setEventType] = useState("message_posted");
  const [action, setAction] = useState<TriggerAction>("create_task");
  const [targetProject, setTargetProject] = useState("");

  const handleAdd = () => {
    if (!targetProject.trim()) {
      toast.error("Please enter a target project name.");
      return;
    }
    onAdd({ provider, eventType, action, targetProject });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Automation Trigger</DialogTitle>
          <DialogDescription>
            Automatically perform an action when an integration event occurs.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="trigger-provider">Integration</Label>
            <Select
              value={provider}
              onValueChange={(v) => setProvider(v as Provider)}
            >
              <SelectTrigger
                id="trigger-provider"
                data-ocid="trigger-provider-select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {PROVIDER_META[p].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="trigger-event">Event Type</Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger
                id="trigger-event"
                data-ocid="trigger-event-select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="message_posted">Message Posted</SelectItem>
                <SelectItem value="issue_opened">Issue Opened</SelectItem>
                <SelectItem value="pr_merged">PR Merged</SelectItem>
                <SelectItem value="file_shared">File Shared</SelectItem>
                <SelectItem value="mention">Mention</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="trigger-action">Action</Label>
            <Select
              value={action}
              onValueChange={(v) => setAction(v as TriggerAction)}
            >
              <SelectTrigger
                id="trigger-action"
                data-ocid="trigger-action-select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="create_task">Create Task</SelectItem>
                <SelectItem value="send_notification">
                  Send Notification
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="trigger-project">Target Project</Label>
            <Input
              id="trigger-project"
              placeholder="e.g. Engineering Sprint 12"
              value={targetProject}
              onChange={(e) => setTargetProject(e.target.value)}
              data-ocid="trigger-project-input"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd} data-ocid="trigger-add-confirm">
            Add Trigger
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Integration Card ─────────────────────────────────────────────────────────

function IntegrationCard({
  provider,
  integration,
}: {
  provider: Provider;
  integration: Integration | undefined;
}) {
  const meta = PROVIDER_META[provider];
  const { actor } = useBackend();
  const qc = useQueryClient();
  const { activeWorkspaceId } = useWorkspace();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";

  const [showOAuth, setShowOAuth] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);

  const isConnected = !!integration && integration.status === "connected";
  const hasError = !!integration && integration.status === "error";

  const connectMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const fakeToken = `oauth_${provider.toLowerCase()}_${Date.now()}`;
      return (
        actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<Integration>
        >
      ).saveIntegration(tenantId, workspaceId, {
        provider,
        accessToken: fakeToken,
        config: JSON.stringify({ connectedAt: new Date().toISOString() }),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["integrations"] });
      setShowOAuth(false);
      toast.success(`${meta.label} connected successfully!`);
    },
    onError: () => toast.error(`Failed to connect ${meta.label}`),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !integration) throw new Error("No actor or integration");
      return (
        actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<boolean>
        >
      ).deleteIntegration(tenantId, workspaceId, integration.id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["integrations"] });
      setShowDisconnect(false);
      toast.success(`${meta.label} disconnected.`);
    },
    onError: () => toast.error(`Failed to disconnect ${meta.label}`),
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !integration) throw new Error("No actor");
      return (
        actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<IntegrationEvent>
        >
      ).addIntegrationEvent(
        tenantId,
        workspaceId,
        integration.id,
        "sync",
        "Manual sync triggered",
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activity-log"] });
      toast.success("Sync triggered!");
    },
  });

  const Icon = meta.icon;

  return (
    <>
      <Card
        className={`border-l-2 ${meta.color} border-border hover:shadow-md transition-shadow`}
        data-ocid={`integration-card-${provider.toLowerCase()}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.iconBg}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                <CardTitle className="text-base">{meta.label}</CardTitle>
                {integration
                  ? statusBadge(integration.status)
                  : statusBadge("disconnected")}
              </div>
              <CardDescription className="text-xs leading-relaxed">
                {meta.description}
              </CardDescription>
              {isConnected && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last updated {formatTs(integration.updatedAt)}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            {meta.features.map((f) => (
              <span
                key={f}
                className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                {f}
              </span>
            ))}
          </div>

          {!isConnected && !hasError ? (
            <Button
              size="sm"
              className="w-full"
              onClick={() => setShowOAuth(true)}
              data-ocid={`connect-btn-${provider.toLowerCase()}`}
            >
              Connect {meta.label}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => syncMutation.mutate()}
                disabled={syncMutation.isPending}
                data-ocid={`sync-btn-${provider.toLowerCase()}`}
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 mr-1.5 ${syncMutation.isPending ? "animate-spin" : ""}`}
                />
                Sync
              </Button>
              {!showDisconnect ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => setShowDisconnect(true)}
                  data-ocid={`disconnect-btn-${provider.toLowerCase()}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate()}
                    disabled={deleteMutation.isPending}
                    data-ocid="disconnect-confirm-btn"
                  >
                    {deleteMutation.isPending ? "..." : "Confirm"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowDisconnect(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <OAuthModal
        provider={provider}
        open={showOAuth}
        onClose={() => setShowOAuth(false)}
        onGrant={() => connectMutation.mutate()}
        isGranting={connectMutation.isPending}
      />
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const { actor, isFetching } = useBackend();
  const { activeWorkspaceId } = useWorkspace();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  const qc = useQueryClient();

  const [activityFilter, setActivityFilter] = useState<string>("all");
  const [showAddTrigger, setShowAddTrigger] = useState(false);
  const [triggers, setTriggers] = useState<AutomationTrigger[]>([
    {
      id: "t1",
      provider: "GitHub",
      eventType: "pr_merged",
      action: "create_task",
      targetProject: "Release Pipeline",
    },
    {
      id: "t2",
      provider: "Slack",
      eventType: "mention",
      action: "send_notification",
      targetProject: "Team Alerts",
    },
  ]);

  const { data: integrations = [], isLoading } = useQuery<Integration[]>({
    queryKey: ["integrations", workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return (
        actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<Integration[]>
        >
      ).getIntegrations(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const { data: activityLog = [], isLoading: logLoading } = useQuery<
    IntegrationEvent[]
  >({
    queryKey: ["activity-log", workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return (
        actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<IntegrationEvent[]>
        >
      ).getIntegrationActivityLog(tenantId, workspaceId, BigInt(50));
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const integrationByProvider = Object.fromEntries(
    integrations.map((i) => [i.provider, i]),
  );
  const connectedCount = integrations.filter(
    (i) => i.status === "connected",
  ).length;

  const filteredLog =
    activityFilter === "all"
      ? activityLog
      : activityLog.filter((e) => {
          const integration = integrations.find(
            (i) => i.id === e.integrationId,
          );
          return integration?.provider === activityFilter;
        });

  const handleAddTrigger = (t: Omit<AutomationTrigger, "id">) => {
    setTriggers((prev) => [...prev, { ...t, id: `t-${Date.now()}` }]);
    setShowAddTrigger(false);
    toast.success("Automation trigger added.");
    qc.invalidateQueries({ queryKey: ["activity-log"] });
  };

  const removeTrigger = (id: string) => {
    setTriggers((prev) => prev.filter((t) => t.id !== id));
    toast.success("Trigger removed.");
  };

  return (
    <div
      className="p-6 space-y-8 max-w-5xl mx-auto"
      data-ocid="integrations-page"
    >
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-display font-bold text-foreground">
            Integrations
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Connect Fourthspace to the tools your team already uses. All
          connections are workspace-scoped.
        </p>
      </div>

      {/* Stats */}
      {!isLoading && (
        <div className="flex items-center gap-4 flex-wrap">
          <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {connectedCount} of {PROVIDERS.length} connected
          </Badge>
          {triggers.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3 w-3" />
              {triggers.length} automation trigger
              {triggers.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      )}

      {/* Integration Cards */}
      <section>
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">
          Available Integrations
        </h2>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROVIDERS.map((p) => (
              <Card key={p} className="border-border">
                <CardHeader className="pb-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-4 w-24 mt-2" />
                  <Skeleton className="h-3 w-full mt-1" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROVIDERS.map((p) => (
              <IntegrationCard
                key={p}
                provider={p}
                integration={integrationByProvider[p]}
              />
            ))}
          </div>
        )}
      </section>

      {/* Automation Triggers */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-display font-semibold text-foreground">
              Automation Triggers
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Automatically create tasks or send notifications when integration
              events fire.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setShowAddTrigger(true)}
            data-ocid="add-trigger-btn"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Trigger
          </Button>
        </div>

        {triggers.length === 0 ? (
          <Card className="border-dashed border-border bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center gap-2">
              <Zap className="h-7 w-7 text-muted-foreground" />
              <p className="font-medium text-foreground text-sm">
                No triggers configured
              </p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Add a trigger to automatically create tasks or send
                notifications when something happens in your connected
                integrations.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Integration
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">
                    Event
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">
                    Action
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">
                    Target
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Remove
                  </th>
                </tr>
              </thead>
              <tbody>
                {triggers.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    data-ocid="trigger-row"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center ${PROVIDER_META[t.provider].iconBg}`}
                        >
                          {(() => {
                            const Icon = PROVIDER_META[t.provider].icon;
                            return <Icon className="w-3.5 h-3.5" />;
                          })()}
                        </div>
                        <span className="font-medium text-foreground text-xs">
                          {t.provider}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell font-mono">
                      {t.eventType}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge variant="outline" className="text-xs font-normal">
                        {t.action === "create_task"
                          ? "Create Task"
                          : "Send Notification"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell truncate max-w-[140px]">
                      {t.targetProject}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeTrigger(t.id)}
                        aria-label="Remove trigger"
                        data-ocid="remove-trigger-btn"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Activity Log */}
      <section>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-display font-semibold text-foreground">
              Activity Log
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Recent events from all connected integrations.
            </p>
          </div>
          <Select value={activityFilter} onValueChange={setActivityFilter}>
            <SelectTrigger className="w-40" data-ocid="activity-filter">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All integrations</SelectItem>
              {PROVIDERS.map((p) => (
                <SelectItem key={p} value={p}>
                  {PROVIDER_META[p].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {logLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filteredLog.length === 0 ? (
          <Card className="border-dashed border-border bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center gap-2">
              <Clock className="h-7 w-7 text-muted-foreground" />
              <p className="font-medium text-foreground text-sm">
                No activity yet
              </p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Activity will appear here once integrations are connected and
                events occur.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Time
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">
                    Integration
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Event
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLog.map((ev) => {
                  const integration = integrations.find(
                    (i) => i.id === ev.integrationId,
                  );
                  return (
                    <tr
                      key={ev.id}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                      data-ocid="activity-row"
                    >
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {formatTs(ev.timestamp)}
                      </td>
                      <td className="px-4 py-3 text-xs hidden sm:table-cell">
                        {integration ? (
                          <Badge
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {integration.provider}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-foreground">
                        {ev.eventType}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell truncate max-w-[200px]">
                        {ev.payload}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Coming Soon */}
      <Card className="border-dashed border-border bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center gap-2">
          <Zap className="h-7 w-7 text-muted-foreground" />
          <p className="font-medium text-foreground text-sm">
            More integrations coming soon
          </p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Jira, Linear, Notion, Figma, and more — suggest what you need most.
          </p>
        </CardContent>
      </Card>

      <AddTriggerModal
        open={showAddTrigger}
        onClose={() => setShowAddTrigger(false)}
        onAdd={handleAddTrigger}
      />
    </div>
  );
}
