import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const EMOJI_OPTIONS = [
  "📄",
  "📝",
  "🗒️",
  "📋",
  "🗓️",
  "💡",
  "🎯",
  "🔖",
  "🏠",
  "⭐",
  "📌",
  "🚀",
  "💼",
  "🔍",
  "📊",
  "🎨",
  "⚙️",
  "💬",
  "🌟",
  "🔥",
  "✅",
  "📚",
  "🧠",
  "🎉",
  "🏆",
  "📈",
  "🌐",
  "🔐",
  "💡",
  "🎵",
];

interface CoverImagePickerProps {
  coverUrl?: string;
  icon: string;
  onIconChange: (icon: string) => void;
  onCoverChange: (url: string) => void;
}

export function CoverImagePicker({
  coverUrl,
  icon,
  onIconChange,
  onCoverChange,
}: CoverImagePickerProps) {
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showCoverInput, setShowCoverInput] = useState(false);
  const [coverInput, setCoverInput] = useState(coverUrl ?? "");

  return (
    <div className="relative">
      {/* Cover image area */}
      {coverUrl ? (
        <div className="group relative h-48 w-full overflow-hidden">
          <img
            src={coverUrl}
            alt="Page cover"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowCoverInput(true)}
              className="text-xs"
            >
              Change cover
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onCoverChange("")}
              className="text-xs"
            >
              Remove cover
            </Button>
          </div>
        </div>
      ) : (
        <div className="h-4 w-full" />
      )}

      {/* Cover URL input */}
      {showCoverInput && (
        <div className="flex gap-2 mt-2 px-6">
          <Input
            value={coverInput}
            onChange={(e) => setCoverInput(e.target.value)}
            placeholder="Paste image URL…"
            className="text-sm"
            data-ocid="cover-url-input"
          />
          <Button
            type="button"
            size="sm"
            onClick={() => {
              onCoverChange(coverInput);
              setShowCoverInput(false);
            }}
          >
            Apply
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setShowCoverInput(false)}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Icon + hover controls */}
      <div className="relative flex items-end gap-4 px-6 mt-2">
        <div className="relative group">
          <button
            type="button"
            onClick={() => setShowIconPicker((s) => !s)}
            className="text-5xl leading-none p-1 rounded-xl hover:bg-muted transition-colors duration-150"
            aria-label="Change page icon"
            data-ocid="page-icon-btn"
          >
            {icon || "📄"}
          </button>

          {showIconPicker && (
            <div className="absolute top-full left-0 mt-1 z-20 rounded-xl border border-border bg-popover shadow-xl p-3 w-64">
              <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wide">
                Choose icon
              </p>
              <div className="grid grid-cols-8 gap-1">
                {EMOJI_OPTIONS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => {
                      onIconChange(em);
                      setShowIconPicker(false);
                    }}
                    className="text-xl p-1 rounded hover:bg-muted transition-colors duration-150"
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {!coverUrl && (
          <button
            type="button"
            onClick={() => setShowCoverInput(true)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 pb-2"
            data-ocid="add-cover-btn"
          >
            + Add cover
          </button>
        )}
      </div>
    </div>
  );
}
