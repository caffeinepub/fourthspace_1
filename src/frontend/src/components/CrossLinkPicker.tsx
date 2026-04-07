import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Link2, Search, X } from "lucide-react";
import { useState } from "react";
import type { CrossLink, TenantId } from "../types";

const ENTITY_TYPES = [
  { value: "note", label: "Note", color: "bg-indigo-500" },
  { value: "project", label: "Project", color: "bg-orange-500" },
  { value: "task", label: "Task", color: "bg-amber-500" },
  { value: "event", label: "Event", color: "bg-red-500" },
  { value: "channel", label: "Channel", color: "bg-teal-500" },
  { value: "employee", label: "Employee", color: "bg-green-500" },
  { value: "escrow", label: "Escrow", color: "bg-yellow-500" },
];

interface CrossLinkPickerProps {
  tenantId: TenantId;
  value: CrossLink[];
  onChange: (links: CrossLink[]) => void;
  className?: string;
}

export function CrossLinkPicker({
  tenantId,
  value,
  onChange,
  className,
}: CrossLinkPickerProps) {
  const [open, setOpen] = useState(false);
  const [entityType, setEntityType] = useState("note");
  const [entityId, setEntityId] = useState("");
  const [linkLabel, setLinkLabel] = useState("");

  const handleAdd = () => {
    if (!entityId.trim() || !linkLabel.trim()) return;
    const newLink: CrossLink = {
      entityType,
      entityId: entityId.trim(),
      linkLabel: linkLabel.trim(),
      tenantId,
    };
    onChange([...value, newLink]);
    setEntityId("");
    setLinkLabel("");
    setOpen(false);
  };

  const handleRemove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2">
        {value.map((link, idx) => {
          const typeInfo = ENTITY_TYPES.find(
            (t) => t.value === link.entityType,
          );
          return (
            <Badge
              key={`${link.entityId}-${idx}`}
              variant="secondary"
              className="flex items-center gap-1.5 pl-2 pr-1"
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  typeInfo?.color ?? "bg-muted",
                )}
              />
              <span className="max-w-[120px] truncate text-xs">
                {link.linkLabel}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                aria-label={`Remove link to ${link.linkLabel}`}
                className="ml-0.5 rounded-sm hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        })}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="crosslink-add-trigger"
            className="gap-2 text-xs"
          >
            <Link2 className="h-3.5 w-3.5" />
            Add cross-link
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-3">
            <p className="text-sm font-medium">Link to another entity</p>

            <div className="flex flex-wrap gap-1.5">
              {ENTITY_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setEntityType(type.value)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-smooth",
                    entityType === type.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Entity ID"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                className="pl-8 text-sm"
                data-ocid="crosslink-entity-id"
              />
            </div>

            <Input
              placeholder="Label (e.g. 'Related task')"
              value={linkLabel}
              onChange={(e) => setLinkLabel(e.target.value)}
              className="text-sm"
              data-ocid="crosslink-label"
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleAdd}
                disabled={!entityId.trim() || !linkLabel.trim()}
                data-ocid="crosslink-add-confirm"
              >
                Add link
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default CrossLinkPicker;
