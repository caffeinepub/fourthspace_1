import { r as reactExports, j as jsxRuntimeExports, B as Button } from "./index-1XRv9GHr.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-Cv78KGce.js";
const EMOJI_CATEGORIES = [
  {
    label: "Reactions",
    emojis: ["👍", "👎", "❤️", "😂", "😮", "😢", "😡", "🎉", "🙏", "🔥"]
  },
  {
    label: "People",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😊", "😇", "🥰"]
  },
  {
    label: "Objects",
    emojis: ["💡", "✅", "❌", "⚡", "🚀", "💯", "📌", "📎", "🔑", "💬"]
  },
  {
    label: "Symbols",
    emojis: ["⭐", "✨", "💥", "🌟", "🎯", "🏆", "🥇", "💪", "👀", "🤔"]
  }
];
function EmojiPicker({ onEmojiSelect, trigger }) {
  const [open, setOpen] = reactExports.useState(false);
  function handleSelect(emoji) {
    onEmojiSelect(emoji);
    setOpen(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: trigger ?? /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "h-6 w-6 text-muted-foreground hover:text-foreground",
        "aria-label": "Add reaction",
        "data-ocid": "emoji-picker-trigger",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "😊" })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PopoverContent,
      {
        className: "w-72 p-2",
        side: "top",
        align: "start",
        "data-ocid": "emoji-picker-popover",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: EMOJI_CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 px-1", children: cat.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-10 gap-0.5", children: cat.emojis.map((emoji) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => handleSelect(emoji),
              className: "flex h-7 w-7 items-center justify-center rounded hover:bg-muted transition-colors text-base",
              title: emoji,
              children: emoji
            },
            emoji
          )) })
        ] }, cat.label)) })
      }
    )
  ] });
}
export {
  EmojiPicker as E
};
