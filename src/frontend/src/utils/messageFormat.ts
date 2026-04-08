// Message text formatting utilities for chat input and display

/**
 * Apply bold formatting around selected text in a textarea.
 * Returns [newValue, newSelectionStart, newSelectionEnd].
 */
export function applyBold(
  value: string,
  selStart: number,
  selEnd: number,
): [string, number, number] {
  return wrapSelection(value, selStart, selEnd, "**", "**");
}

export function applyItalic(
  value: string,
  selStart: number,
  selEnd: number,
): [string, number, number] {
  return wrapSelection(value, selStart, selEnd, "_", "_");
}

export function applyCode(
  value: string,
  selStart: number,
  selEnd: number,
): [string, number, number] {
  return wrapSelection(value, selStart, selEnd, "`", "`");
}

export function applyBulletList(
  value: string,
  selStart: number,
  selEnd: number,
): [string, number, number] {
  // Insert "• " at start of the current line
  const lineStart = value.lastIndexOf("\n", selStart - 1) + 1;
  const before = value.slice(0, lineStart);
  const after = value.slice(lineStart);
  const newValue = `${before}• ${after}`;
  const offset = 2;
  return [newValue, selStart + offset, selEnd + offset];
}

function wrapSelection(
  value: string,
  selStart: number,
  selEnd: number,
  prefix: string,
  suffix: string,
): [string, number, number] {
  const selected = value.slice(selStart, selEnd);
  const newValue =
    value.slice(0, selStart) + prefix + selected + suffix + value.slice(selEnd);
  return [newValue, selStart + prefix.length, selEnd + prefix.length];
}

/**
 * Render formatted message content to React-safe HTML string.
 * Supports: **bold**, _italic_, `code`, • bullet lines, URLs.
 */
export function renderFormattedText(content: string): string {
  // Escape HTML first
  let html = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Italic
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");
  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="bg-muted px-1 py-0.5 rounded text-xs font-mono">$1</code>',
  );
  // Bullet lines
  html = html.replace(
    /^[•\-] (.+)$/gm,
    '<span class="flex gap-1.5"><span>•</span><span>$1</span></span>',
  );
  // Newlines
  html = html.replace(/\n/g, "<br/>");

  return html;
}

/** Detect image URL */
export function isImageUrl(url: string): boolean {
  return /\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i.test(url);
}

/** Detect PDF URL */
export function isPdfUrl(url: string): boolean {
  return /\.pdf(\?.*)?$/i.test(url);
}

/** Extract a bare filename from a URL */
export function filenameFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname;
    return decodeURIComponent(path.split("/").pop() ?? url);
  } catch {
    return url.split("/").pop() ?? url;
  }
}

/** Extract all URLs from a string */
export function extractUrls(content: string): string[] {
  const re = /https?:\/\/[^\s"'<>]+/g;
  return content.match(re) ?? [];
}
