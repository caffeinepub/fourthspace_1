import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, FileText, Plus } from "lucide-react";
import { useState } from "react";
import type { PageNode } from "../../types";

interface TreeNode extends PageNode {
  children: TreeNode[];
}

function buildTree(pages: PageNode[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  for (const p of pages) {
    map.set(p.id, { ...p, children: [] });
  }
  const roots: TreeNode[] = [];
  for (const [, node] of map) {
    if (node.parentPageId) {
      const parent = map.get(node.parentPageId);
      if (parent) parent.children.push(node);
      else roots.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

function TreeItem({
  node,
  depth,
  currentPageId,
  workspaceId,
}: {
  node: TreeNode;
  depth: number;
  currentPageId?: string;
  workspaceId: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const isActive = node.id === currentPageId;

  return (
    <li>
      <div
        className={`group flex items-center gap-1.5 rounded-md px-2 py-1.5 cursor-pointer transition-colors duration-150 ${
          isActive
            ? "bg-primary/15 text-primary font-medium"
            : "text-foreground hover:bg-muted"
        }`}
        style={{ paddingLeft: `${(depth + 1) * 12}px` }}
      >
        {node.children.length > 0 ? (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <ChevronRight
              className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
            />
          </button>
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        <Link
          to="/app/$workspaceId/pages/$pageId"
          params={{ workspaceId, pageId: node.id }}
          className="flex items-center gap-2 flex-1 min-w-0"
          data-ocid={`sidebar-page-${node.id}`}
        >
          <span className="shrink-0 text-sm">{node.icon || "📄"}</span>
          <span className="text-sm truncate">{node.title || "Untitled"}</span>
        </Link>
      </div>
      {expanded && node.children.length > 0 && (
        <ul>
          {node.children
            .sort((a, b) => Number(b.updatedAt - a.updatedAt))
            .map((child) => (
              <TreeItem
                key={child.id}
                node={child}
                depth={depth + 1}
                currentPageId={currentPageId}
                workspaceId={workspaceId}
              />
            ))}
        </ul>
      )}
    </li>
  );
}

interface PageSidebarProps {
  pages: PageNode[];
  currentPageId?: string;
  tenantId: string;
  workspaceId: string;
}

export function PageSidebar({
  pages,
  currentPageId,
  tenantId: _tenantId,
  workspaceId,
}: PageSidebarProps) {
  const navigate = useNavigate();
  const tree = buildTree(pages);

  return (
    <aside className="flex flex-col h-full overflow-hidden bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center justify-between px-3 py-3 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-sidebar-foreground">
            Pages
          </span>
        </div>
        <button
          type="button"
          onClick={() =>
            navigate({
              to: "/app/$workspaceId/pages/new",
              params: { workspaceId },
            })
          }
          className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
          aria-label="New page"
          data-ocid="sidebar-new-page-btn"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-1">
        {tree.length === 0 ? (
          <div className="px-3 py-4 text-center">
            <p className="text-xs text-muted-foreground">No pages yet</p>
            <button
              type="button"
              onClick={() =>
                navigate({
                  to: "/app/$workspaceId/pages/new",
                  params: { workspaceId },
                })
              }
              className="mt-2 text-xs text-primary hover:underline"
            >
              Create first page
            </button>
          </div>
        ) : (
          <ul className="space-y-0.5">
            {tree.map((node) => (
              <TreeItem
                key={node.id}
                node={node}
                depth={0}
                currentPageId={currentPageId}
                workspaceId={workspaceId}
              />
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
