import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

const EMOJI_CATEGORIES: { label: string; emojis: string[] }[] = [
  {
    label: "Reactions",
    emojis: ["👍", "👎", "❤️", "😂", "😮", "😢", "😡", "🎉", "🙏", "🔥"],
  },
  {
    label: "People",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😊", "😇", "🥰"],
  },
  {
    label: "Objects",
    emojis: ["💡", "✅", "❌", "⚡", "🚀", "💯", "📌", "📎", "🔑", "💬"],
  },
  {
    label: "Symbols",
    emojis: ["⭐", "✨", "💥", "🌟", "🎯", "🏆", "🥇", "💪", "👀", "🤔"],
  },
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  trigger?: React.ReactNode;
}

export function EmojiPicker({ onEmojiSelect, trigger }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  function handleSelect(emoji: string) {
    onEmojiSelect(emoji);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            aria-label="Add reaction"
            data-ocid="emoji-picker-trigger"
          >
            <span className="text-sm">😊</span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-2"
        side="top"
        align="start"
        data-ocid="emoji-picker-popover"
      >
        <div className="space-y-2">
          {EMOJI_CATEGORIES.map((cat) => (
            <div key={cat.label}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 px-1">
                {cat.label}
              </p>
              <div className="grid grid-cols-10 gap-0.5">
                {cat.emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleSelect(emoji)}
                    className="flex h-7 w-7 items-center justify-center rounded hover:bg-muted transition-colors text-base"
                    title={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
