import { r as reactExports, j as jsxRuntimeExports, z as cn, X, B as Button } from "./index-1XRv9GHr.js";
import { B as Badge } from "./badge-rX4oLW6l.js";
import { I as Input } from "./input-BOIU-9S_.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-Cv78KGce.js";
import { L as Link2 } from "./link-2-sNukA1XD.js";
import { S as Search } from "./search-CWnD_rod.js";
const ENTITY_TYPES = [
  { value: "note", label: "Note", color: "bg-indigo-500" },
  { value: "project", label: "Project", color: "bg-orange-500" },
  { value: "task", label: "Task", color: "bg-amber-500" },
  { value: "event", label: "Event", color: "bg-red-500" },
  { value: "channel", label: "Channel", color: "bg-teal-500" },
  { value: "employee", label: "Employee", color: "bg-green-500" },
  { value: "escrow", label: "Escrow", color: "bg-yellow-500" }
];
function CrossLinkPicker({
  tenantId,
  value,
  onChange,
  className
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [entityType, setEntityType] = reactExports.useState("note");
  const [entityId, setEntityId] = reactExports.useState("");
  const [linkLabel, setLinkLabel] = reactExports.useState("");
  const handleAdd = () => {
    if (!entityId.trim() || !linkLabel.trim()) return;
    const newLink = {
      entityType,
      entityId: entityId.trim(),
      linkLabel: linkLabel.trim(),
      tenantId
    };
    onChange([...value, newLink]);
    setEntityId("");
    setLinkLabel("");
    setOpen(false);
  };
  const handleRemove = (idx) => {
    onChange(value.filter((_, i) => i !== idx));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("space-y-2", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: value.map((link, idx) => {
      const typeInfo = ENTITY_TYPES.find(
        (t) => t.value === link.entityType
      );
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "secondary",
          className: "flex items-center gap-1.5 pl-2 pr-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "h-2 w-2 rounded-full",
                  (typeInfo == null ? void 0 : typeInfo.color) ?? "bg-muted"
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "max-w-[120px] truncate text-xs", children: link.linkLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => handleRemove(idx),
                "aria-label": `Remove link to ${link.linkLabel}`,
                className: "ml-0.5 rounded-sm hover:text-destructive",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
              }
            )
          ]
        },
        `${link.entityId}-${idx}`
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          "data-ocid": "crosslink-add-trigger",
          className: "gap-2 text-xs",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3.5 w-3.5" }),
            "Add cross-link"
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-80 p-4", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Link to another entity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: ENTITY_TYPES.map((type) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setEntityType(type.value),
            className: cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-smooth",
              entityType === type.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            ),
            children: type.label
          },
          type.value
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Entity ID",
              value: entityId,
              onChange: (e) => setEntityId(e.target.value),
              className: "pl-8 text-sm",
              "data-ocid": "crosslink-entity-id"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Label (e.g. 'Related task')",
            value: linkLabel,
            onChange: (e) => setLinkLabel(e.target.value),
            className: "text-sm",
            "data-ocid": "crosslink-label"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: () => setOpen(false),
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              onClick: handleAdd,
              disabled: !entityId.trim() || !linkLabel.trim(),
              "data-ocid": "crosslink-add-confirm",
              children: "Add link"
            }
          )
        ] })
      ] }) })
    ] })
  ] });
}
export {
  CrossLinkPicker as C
};
