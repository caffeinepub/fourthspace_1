import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Edit2,
  Eye,
  EyeOff,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import { CalendarType } from "../../types";
import type { CalendarDef, CalendarDefInput } from "../../types";

const CALENDAR_COLORS = [
  "#6366f1",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#f97316",
];

const TYPE_OPTIONS = [
  { value: CalendarType.personal, label: "Personal" },
  { value: CalendarType.team, label: "Team" },
  { value: CalendarType.project, label: "Project" },
  { value: CalendarType.company, label: "Company-wide" },
];

const TYPE_BADGES: Record<string, { bg: string; text: string }> = {
  [CalendarType.personal]: {
    bg: "bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-300",
  },
  [CalendarType.team]: {
    bg: "bg-green-500/10",
    text: "text-green-700 dark:text-green-300",
  },
  [CalendarType.project]: {
    bg: "bg-orange-500/10",
    text: "text-orange-700 dark:text-orange-300",
  },
  [CalendarType.company]: {
    bg: "bg-purple-500/10",
    text: "text-purple-700 dark:text-purple-300",
  },
};

interface CalendarFormState {
  name: string;
  calendarType: CalendarType;
  color: string;
  isVisible: boolean;
}

function defaultForm(): CalendarFormState {
  return {
    name: "",
    calendarType: CalendarType.personal,
    color: CALENDAR_COLORS[0],
    isVisible: true,
  };
}

function CalendarForm({
  initial,
  onSave,
  onCancel,
  isSaving,
}: {
  initial: CalendarFormState;
  onSave: (f: CalendarFormState) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<CalendarFormState>(initial);

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cal-name">
          Calendar Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="cal-name"
          placeholder="e.g. My Work Calendar"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          data-ocid="cal-settings-name"
        />
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <Select
          value={form.calendarType}
          onValueChange={(v) =>
            setForm((f) => ({ ...f, calendarType: v as CalendarType }))
          }
        >
          <SelectTrigger data-ocid="cal-settings-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {CALENDAR_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setForm((f) => ({ ...f, color }))}
              className={cn(
                "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110",
                form.color === color
                  ? "border-foreground scale-110"
                  : "border-transparent",
              )}
              style={{ backgroundColor: color }}
              aria-label={`Color ${color}`}
              data-ocid={`cal-settings-color-${color.replace("#", "")}`}
            />
          ))}
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={form.color}
              onChange={(e) =>
                setForm((f) => ({ ...f, color: e.target.value }))
              }
              className="h-7 w-14 cursor-pointer p-0.5 rounded-full"
              data-ocid="cal-settings-custom-color"
            />
            <span className="text-xs text-muted-foreground">Custom</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
        <Label className="cursor-pointer">Show on calendar</Label>
        <Switch
          checked={form.isVisible}
          onCheckedChange={(v) => setForm((f) => ({ ...f, isVisible: v }))}
          data-ocid="cal-settings-visible"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          data-ocid="cal-settings-cancel"
        >
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={!form.name.trim() || isSaving}
          onClick={() => onSave(form)}
          data-ocid="cal-settings-save"
        >
          {isSaving ? "Saving…" : "Save Calendar"}
        </Button>
      </div>
    </div>
  );
}

export default function CalendarSettingsPage() {
  const navigate = useNavigate();
  const { workspaceId } = useParams({
    from: "/app/$workspaceId/calendar/settings",
  });
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();

  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: calendars = [], isLoading } = useQuery<CalendarDef[]>({
    queryKey: ["calendars", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCalendars(tenantId, workspaceId, null);
    },
    enabled: !!actor && !isFetching,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["calendars", tenantId, workspaceId],
    });

  const { mutate: createCalendar, isPending: isCreating } = useMutation({
    mutationFn: async (form: CalendarFormState) => {
      if (!actor) throw new Error("Not connected");
      const input: CalendarDefInput = {
        name: form.name.trim(),
        calendarType: form.calendarType,
        color: form.color,
        isVisible: form.isVisible,
      };
      return actor.createCalendar(tenantId, workspaceId, input);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        invalidate();
        toast.success("Calendar created!");
        setShowCreate(false);
      } else toast.error(result.err);
    },
    onError: () => toast.error("Failed to create calendar"),
  });

  const { mutate: updateCalendar, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      id,
      form,
    }: { id: string; form: CalendarFormState }) => {
      if (!actor) throw new Error("Not connected");
      const input: CalendarDefInput = {
        name: form.name.trim(),
        calendarType: form.calendarType,
        color: form.color,
        isVisible: form.isVisible,
      };
      return actor.updateCalendar(tenantId, workspaceId, id, input);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        invalidate();
        toast.success("Calendar updated!");
        setEditingId(null);
      } else toast.error(result.err);
    },
    onError: () => toast.error("Failed to update calendar"),
  });

  const { mutate: deleteCalendar } = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteCalendar(tenantId, workspaceId, id);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        invalidate();
        toast.success("Calendar deleted");
      } else toast.error(result.err);
    },
    onError: () => toast.error("Failed to delete calendar"),
  });

  const toggleVisible = (cal: CalendarDef) => {
    if (!actor) return;
    updateCalendar({
      id: cal.id,
      form: {
        name: cal.name,
        calendarType: cal.calendarType,
        color: cal.color,
        isVisible: !cal.isVisible,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in-up">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border/60 bg-card/90 backdrop-blur-subtle px-6 py-3.5 shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                navigate({
                  to: "/app/$workspaceId/calendar",
                  params: { workspaceId },
                })
              }
              aria-label="Back"
              data-ocid="cal-settings-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
                <Settings className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold text-foreground tracking-tight">
                  Calendar Settings
                </h1>
                <p className="text-xs text-muted-foreground">
                  Manage your calendars
                </p>
              </div>
            </div>
          </div>
          <Button
            size="sm"
            className="gap-1.5 h-8 text-xs active-press"
            onClick={() => {
              setShowCreate(true);
              setEditingId(null);
            }}
            data-ocid="cal-settings-new-btn"
          >
            <Plus className="h-3.5 w-3.5" /> New Calendar
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8 space-y-4">
        {showCreate && (
          <CalendarForm
            initial={defaultForm()}
            onSave={(form) => createCalendar(form)}
            onCancel={() => setShowCreate(false)}
            isSaving={isCreating}
          />
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-16 rounded-xl bg-muted/30 animate-pulse"
              />
            ))}
          </div>
        ) : calendars.length === 0 && !showCreate ? (
          <div
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center"
            data-ocid="cal-settings-empty"
          >
            <Settings className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="font-display font-semibold text-foreground">
              No calendars yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a calendar to get started.
            </p>
            <Button
              size="sm"
              className="mt-4"
              onClick={() => setShowCreate(true)}
              data-ocid="cal-settings-empty-cta"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              New Calendar
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {calendars.map((cal) => {
              const tStyle =
                TYPE_BADGES[cal.calendarType] ??
                TYPE_BADGES[CalendarType.personal];
              return (
                <div key={cal.id}>
                  {editingId === cal.id ? (
                    <CalendarForm
                      initial={{
                        name: cal.name,
                        calendarType: cal.calendarType,
                        color: cal.color,
                        isVisible: cal.isVisible,
                      }}
                      onSave={(form) => updateCalendar({ id: cal.id, form })}
                      onCancel={() => setEditingId(null)}
                      isSaving={isUpdating}
                    />
                  ) : (
                    <div
                      className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
                      data-ocid={`cal-settings-item-${cal.id}`}
                    >
                      <div
                        className="h-4 w-4 rounded-full shrink-0"
                        style={{ backgroundColor: cal.color || "#6366f1" }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "font-semibold text-sm",
                              !cal.isVisible &&
                                "text-muted-foreground line-through",
                            )}
                          >
                            {cal.name}
                          </span>
                          <Badge
                            className={cn(
                              "text-xs px-1.5 py-0 border-0",
                              tStyle.bg,
                              tStyle.text,
                            )}
                          >
                            {TYPE_OPTIONS.find(
                              (t) => t.value === cal.calendarType,
                            )?.label ?? cal.calendarType}
                          </Badge>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleVisible(cal)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted"
                        aria-label={
                          cal.isVisible ? "Hide calendar" : "Show calendar"
                        }
                        data-ocid={`cal-settings-toggle-${cal.id}`}
                      >
                        {cal.isVisible ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(cal.id);
                          setShowCreate(false);
                        }}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted"
                        aria-label="Edit calendar"
                        data-ocid={`cal-settings-edit-${cal.id}`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/5"
                            aria-label="Delete calendar"
                            data-ocid={`cal-settings-delete-${cal.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete "{cal.name}"?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will delete the calendar. Events assigned to
                              it will remain but lose their calendar
                              association.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteCalendar(cal.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              data-ocid={`cal-settings-delete-confirm-${cal.id}`}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
