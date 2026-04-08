import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Link2 } from "lucide-react";
import { useState } from "react";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { PageNode } from "../../types";

interface BacklinksPanelProps {
  pageId: string;
  tenantId: string;
}

export function BacklinksPanel({ pageId, tenantId }: BacklinksPanelProps) {
  const [open, setOpen] = useState(true);
  const { actor, isFetching } = useBackend();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";

  const { data: backlinks = [], isLoading } = useQuery<PageNode[]>({
    queryKey: ["backlinks", tenantId, workspaceId, pageId],
    queryFn: async () => {
      if (!actor) return [];
      // Fallback: list pages and filter those that mention this pageId in their content
      const pages = await actor.listPages(tenantId, workspaceId, null);
      return pages.filter((p: PageNode) =>
        p.blocks.some(
          (b) => b.content.includes(pageId) || b.metadata.includes(pageId),
        ),
      );
    },
    enabled: !!actor && !isFetching && !!pageId && !!workspaceId,
  });

  return (
    <div className="border-t border-border mt-8 pt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 w-full text-left group"
        data-ocid="backlinks-toggle"
      >
        <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-sm font-medium text-foreground flex-1">
          {backlinks.length > 0
            ? `${backlinks.length} Backlink${backlinks.length !== 1 ? "s" : ""}`
            : "Backlinks"}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "" : "-rotate-90"}`}
        />
      </button>

      {open && (
        <div className="mt-3 space-y-1">
          {isLoading ? (
            <p className="text-xs text-muted-foreground px-1">Loading…</p>
          ) : backlinks.length === 0 ? (
            <p className="text-xs text-muted-foreground px-1 italic">
              No pages link to this page yet
            </p>
          ) : (
            backlinks.map((page) => (
              <Link
                key={page.id}
                to="/app/$workspaceId/pages/$pageId"
                params={{ workspaceId, pageId: page.id }}
                className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-muted transition-colors duration-150 group"
                data-ocid={`backlink-${page.id}`}
              >
                <span className="text-sm">{page.icon || "📄"}</span>
                <span className="text-sm text-foreground truncate group-hover:text-primary transition-colors duration-150">
                  {page.title || "Untitled"}
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
