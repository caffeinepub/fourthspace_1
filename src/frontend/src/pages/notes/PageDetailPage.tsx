import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronRight,
  Copy,
  PanelLeftClose,
  PanelLeftOpen,
  Save,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BacklinksPanel } from "../../components/notes/BacklinksPanel";
import { BlockEditor } from "../../components/notes/BlockEditor";
import { CoverImagePicker } from "../../components/notes/CoverImagePicker";
import { PageSidebar } from "../../components/notes/PageSidebar";
import { TableOfContents } from "../../components/notes/TableOfContents";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { Block, PageNode } from "../../types";

function BreadcrumbNav({
  page,
  pages,
  workspaceId,
}: {
  page: PageNode;
  pages: PageNode[];
  workspaceId: string;
}) {
  const crumbs: PageNode[] = [];
  let cur: PageNode | undefined = page;
  while (cur) {
    crumbs.unshift(cur);
    const parentId = cur.parentPageId;
    cur = parentId ? pages.find((p) => p.id === parentId) : undefined;
  }

  if (crumbs.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap"
    >
      {crumbs.map((crumb, i) => (
        <span key={crumb.id} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3" />}
          {i === crumbs.length - 1 ? (
            <span className="text-foreground font-medium truncate max-w-[140px]">
              {crumb.title || "Untitled"}
            </span>
          ) : (
            <Link
              to="/app/$workspaceId/pages/$pageId"
              params={{ workspaceId, pageId: crumb.id }}
              className="hover:text-foreground transition-colors truncate max-w-[120px]"
            >
              {crumb.title || "Untitled"}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

interface SaveArgs {
  title: string;
  icon: string;
  coverUrl: string | undefined;
  blocks: Block[];
}

export default function PageDetailPage() {
  const { workspaceId, pageId } = useParams({
    from: "/app/$workspaceId/pages/$pageId",
  });
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("📄");
  const [coverUrl, setCoverUrl] = useState<string | undefined>();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dirty, setDirty] = useState(false);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: page, isLoading } = useQuery<PageNode | null>({
    queryKey: ["page", tenantId, workspaceId, pageId],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getPage(tenantId, workspaceId, pageId);
      if (result.__kind__ === "err") return null;
      return result.ok;
    },
    enabled: !!actor && !isFetching,
  });

  const { data: allPages = [] } = useQuery<PageNode[]>({
    queryKey: ["pages", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPages(tenantId, workspaceId, null);
    },
    enabled: !!actor && !isFetching,
  });

  useEffect(() => {
    if (page) {
      setTitle(page.title);
      setIcon(page.icon || "📄");
      setCoverUrl(page.coverUrl ?? undefined);
      setBlocks(page.blocks ?? []);
      setDirty(false);
    }
  }, [page]);

  const { mutate: savePage, isPending: isSaving } = useMutation({
    mutationFn: async (args: SaveArgs) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updatePage(
        tenantId,
        workspaceId,
        pageId,
        args.title,
        args.icon,
        args.coverUrl ?? null,
        args.blocks,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(
        ["page", tenantId, workspaceId, pageId],
        updated,
      );
      queryClient.invalidateQueries({
        queryKey: ["pages", tenantId, workspaceId],
      });
      setDirty(false);
    },
    onError: (err: Error) => {
      toast.error("Auto-save failed", { description: err.message });
    },
  });

  const triggerSave = useCallback(
    (t: string, ic: string, cover: string | undefined, bks: Block[]) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        savePage({ title: t, icon: ic, coverUrl: cover, blocks: bks });
      }, 1000);
    },
    [savePage],
  );

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setDirty(true);
    triggerSave(val, icon, coverUrl, blocks);
  };

  const handleBlocksChange = (next: Block[]) => {
    setBlocks(next);
    setDirty(true);
    triggerSave(title, icon, coverUrl, next);
  };

  const handleIconChange = (ic: string) => {
    setIcon(ic);
    setDirty(true);
    triggerSave(title, ic, coverUrl, blocks);
  };

  const handleCoverChange = (url: string) => {
    const val = url || undefined;
    setCoverUrl(val);
    setDirty(true);
    triggerSave(title, icon, val, blocks);
  };

  const saveRef = useRef<() => void>(() => undefined);

  const handleManualSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    savePage({ title, icon, coverUrl, blocks });
  }, [savePage, title, icon, coverUrl, blocks]);

  useEffect(() => {
    saveRef.current = handleManualSave;
  }, [handleManualSave]);

  // Cmd/Ctrl+S to save
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        saveRef.current();
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full">
        <div className="flex-1 max-w-4xl mx-auto p-8 space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-12 w-2/3" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="p-8 flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-medium text-foreground mb-2">
          Page not found
        </p>
        <p className="text-muted-foreground text-sm mb-6">
          This page may have been deleted or you don't have access to it.
        </p>
        <Button asChild variant="outline">
          <Link to="/app/$workspaceId/pages" params={{ workspaceId }}>
            Back to Pages
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Sidebar */}
      {sidebarOpen && (
        <div className="hidden md:block w-56 shrink-0 overflow-hidden">
          <PageSidebar
            pages={allPages}
            currentPageId={pageId}
            tenantId={tenantId}
            workspaceId={workspaceId}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 border-b border-border/60 bg-card/90 backdrop-blur-subtle shadow-sm">
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth hidden md:flex"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="shrink-0 h-8 w-8"
          >
            <Link
              to="/app/$workspaceId/pages"
              params={{ workspaceId }}
              aria-label="Back to pages"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div className="flex-1 min-w-0">
            <BreadcrumbNav
              page={page}
              pages={allPages}
              workspaceId={workspaceId}
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {dirty && (
              <span className="text-xs text-muted-foreground hidden sm:block">
                Unsaved
              </span>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleManualSave}
              disabled={isSaving}
              className="gap-1.5 text-xs h-8"
              data-ocid="page-save-btn"
            >
              <Save className="h-3.5 w-3.5" />
              {isSaving ? "Saving…" : "Save"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs h-8 hidden sm:flex"
              title="Duplicate page"
              aria-label="Duplicate page"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Cover image */}
        <CoverImagePicker
          coverUrl={coverUrl}
          icon={icon}
          onIconChange={handleIconChange}
          onCoverChange={handleCoverChange}
        />

        {/* Page content */}
        <div className="flex gap-6 px-6 lg:px-12 pb-24 pt-4 max-w-5xl">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <div
              contentEditable
              suppressContentEditableWarning
              onInput={(e) =>
                handleTitleChange(e.currentTarget.textContent ?? "")
              }
              className="text-4xl font-bold font-display text-foreground outline-none mb-6 empty:before:content-['Untitled'] empty:before:text-muted-foreground/40 empty:before:pointer-events-none break-words"
              data-ocid="page-title-input"
            >
              {title}
            </div>

            {/* Block editor */}
            <BlockEditor blocks={blocks} onChange={handleBlocksChange} />

            {/* Backlinks */}
            <BacklinksPanel pageId={pageId} tenantId={tenantId} />
          </div>

          {/* Right: Table of Contents */}
          <TableOfContents blocks={blocks} />
        </div>
      </div>
    </div>
  );
}
