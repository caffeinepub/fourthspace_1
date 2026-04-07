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
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Plus, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import { AutomationAction, AutomationTrigger } from "../../types";
import type { AutomationRule } from "../../types";

const TRIGGER_LABELS: Record<AutomationTrigger, string> = {
  [AutomationTrigger.Scheduled]: "Scheduled",
  [AutomationTrigger.OnTaskStatusChange]: "Task Status Changed",
  [AutomationTrigger.OnNoteCreated]: "Note Created",
  [AutomationTrigger.OnPaymentDue]: "Payment Due",
  [AutomationTrigger.OnEscrowUpdate]: "Escrow Updated",
  [AutomationTrigger.OnEventReminder]: "Event Reminder",
};

const ACTION_LABELS: Record<AutomationAction, string> = {
  [AutomationAction.SendNotification]: "Send Notification",
  [AutomationAction.RunPayroll]: "Run Payroll",
  [AutomationAction.CreateTask]: "Create Task",
  [AutomationAction.UpdateStatus]: "Update Status",
};

export default function AdminAutomationPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [trigger, setTrigger] = useState<AutomationTrigger>(
    AutomationTrigger.Scheduled,
  );
  const [action, setAction] = useState<AutomationAction>(
    AutomationAction.SendNotification,
  );

  const { data: rules, isLoading } = useQuery<AutomationRule[]>({
    queryKey: ["automationRules", tenantId],
    queryFn: async () => (actor ? actor.listAutomationRules(tenantId) : []),
    enabled: !!actor && !isFetching,
  });

  const { mutate: create, isPending } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.createAutomationRule(
        tenantId,
        name.trim(),
        description.trim(),
        trigger,
        action,
      );
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["automationRules"] });
        toast.success("Automation rule created!");
        setShowForm(false);
        setName("");
        setDescription("");
        setTrigger(AutomationTrigger.Scheduled);
        setAction(AutomationAction.SendNotification);
      } else toast.error(result.err);
    },
    onError: () => toast.error("Failed to create rule"),
  });

  const { mutate: toggle } = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.toggleAutomationRule(tenantId, id);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["automationRules"] });
        toast.success(
          result.ok.isActive ? "Rule activated" : "Rule deactivated",
        );
      }
    },
    onError: () => toast.error("Failed to toggle rule"),
  });

  const activeCount = (rules ?? []).filter((r) => r.isActive).length;
  const totalCount = rules?.length ?? 0;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/app/admin" })}
          aria-label="Back to admin"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500/10">
          <Zap className="h-4 w-4 text-yellow-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Automation Rules
          </h1>
          <p className="text-sm text-muted-foreground">
            Automate repetitive tasks with triggers and actions
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          data-ocid="automation-new-btn"
        >
          <Plus className="mr-2 h-3.5 w-3.5" />
          New Rule
        </Button>
      </div>

      {/* Summary */}
      {!isLoading && totalCount > 0 && (
        <div className="flex items-center gap-4 rounded-xl bg-muted/40 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm text-foreground font-medium">
              {activeCount} active
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm text-muted-foreground">
            {totalCount - activeCount} paused
          </span>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm text-muted-foreground">
            {totalCount} total rules
          </span>
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Create Automation Rule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="automation-name">Rule Name</Label>
                <Input
                  id="automation-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Daily Payroll Run"
                  data-ocid="automation-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="automation-desc">Description</Label>
                <Input
                  id="automation-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this rule do?"
                  data-ocid="automation-desc"
                />
              </div>
              <div className="space-y-2">
                <Label>Trigger</Label>
                <Select
                  value={trigger}
                  onValueChange={(v) => setTrigger(v as AutomationTrigger)}
                >
                  <SelectTrigger data-ocid="automation-trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AutomationTrigger).map((t) => (
                      <SelectItem key={t} value={t}>
                        {TRIGGER_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Action</Label>
                <Select
                  value={action}
                  onValueChange={(v) => setAction(v as AutomationAction)}
                >
                  <SelectTrigger data-ocid="automation-action">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AutomationAction).map((a) => (
                      <SelectItem key={a} value={a}>
                        {ACTION_LABELS[a]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Preview */}
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-3 text-sm">
              <Badge variant="outline" className="text-xs shrink-0">
                {TRIGGER_LABELS[trigger]}
              </Badge>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <Badge
                variant="outline"
                className="text-xs shrink-0 bg-yellow-500/10 text-yellow-600 border-yellow-200"
              >
                {ACTION_LABELS[action]}
              </Badge>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => create()}
                disabled={!name.trim() || isPending}
                data-ocid="automation-save-btn"
              >
                {isPending ? "Creating..." : "Create Rule"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rules List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : rules && rules.length > 0 ? (
        <div className="space-y-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:bg-muted/20 transition-smooth"
              data-ocid={`rule-${rule.id}`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10">
                <Zap className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">
                  {rule.name}
                </p>
                {rule.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {rule.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {TRIGGER_LABELS[rule.trigger]}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <Badge
                    variant="outline"
                    className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-200"
                  >
                    {ACTION_LABELS[rule.action]}
                  </Badge>
                </div>
              </div>
              <Badge
                className={
                  rule.isActive
                    ? "bg-green-500/10 text-green-600 border-green-200 dark:border-green-900 shrink-0"
                    : "bg-muted text-muted-foreground shrink-0"
                }
              >
                {rule.isActive ? "Active" : "Paused"}
              </Badge>
              <Switch
                checked={rule.isActive}
                onCheckedChange={() => toggle(rule.id)}
                aria-label={rule.isActive ? "Deactivate rule" : "Activate rule"}
                data-ocid={`rule-toggle-${rule.id}`}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center"
          data-ocid="automation-empty"
        >
          <Zap className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-semibold text-foreground">
            No automation rules yet
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Create rules to automate repetitive tasks and save time.
          </p>
          <Button size="sm" className="mt-4" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-3.5 w-3.5" />
            Create First Rule
          </Button>
        </div>
      )}
    </div>
  );
}
