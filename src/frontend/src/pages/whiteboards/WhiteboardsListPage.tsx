import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BrainCircuit,
  Columns3,
  GitBranch,
  Layers,
  Network,
  Plus,
  Search,
  StickyNote,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WhiteboardElement {
  id: string;
  tool: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeWidth: number;
  text: string;
  points: number[];
  stickyText?: string;
  stickyColor?: string;
  converted?: boolean;
  imageUrl?: string;
}

interface Whiteboard {
  id: string;
  tenantId: string;
  projectId: string;
  title: string;
  elements: WhiteboardElement[];
  createdBy: string;
  createdAt: bigint;
  updatedAt: bigint;
}

interface WbTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  elements: WhiteboardElement[];
}

type WbActor = {
  listWhiteboards: (
    tenantId: string,
    workspaceId: string,
    projectId: string,
  ) => Promise<Whiteboard[]>;
  createWhiteboard: (
    tenantId: string,
    workspaceId: string,
    projectId: string,
    title: string,
    elements: WhiteboardElement[],
  ) => Promise<Whiteboard>;
  deleteWhiteboard: (
    tenantId: string,
    workspaceId: string,
    id: string,
  ) => Promise<boolean>;
};

// ─── Templates ────────────────────────────────────────────────────────────────

export const WHITEBOARD_TEMPLATES: WbTemplate[] = [
  {
    id: "brainstorm",
    name: "Brainstorm",
    description: "14 sticky notes across Features, UX, and Ecosystem groups",
    icon: BrainCircuit,
    color: "#8b5cf6",
    elements: [
      // Group label: Features
      {
        id: "bs-lbl-features",
        tool: "Text",
        x: 60,
        y: 30,
        width: 0,
        height: 0,
        color: "#8b5cf6",
        strokeWidth: 14,
        text: "✦ Features",
        points: [],
      },
      // Features stickies (6)
      {
        id: "bs-f1",
        tool: "Sticky",
        x: 60,
        y: 60,
        width: 180,
        height: 80,
        color: "#8b5cf6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "User authentication",
        stickyColor: "#ede9fe",
      },
      {
        id: "bs-f2",
        tool: "Sticky",
        x: 260,
        y: 60,
        width: 180,
        height: 80,
        color: "#8b5cf6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Real-time collaboration",
        stickyColor: "#ede9fe",
      },
      {
        id: "bs-f3",
        tool: "Sticky",
        x: 460,
        y: 60,
        width: 180,
        height: 80,
        color: "#8b5cf6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Mobile app support",
        stickyColor: "#ede9fe",
      },
      {
        id: "bs-f4",
        tool: "Sticky",
        x: 60,
        y: 160,
        width: 180,
        height: 80,
        color: "#8b5cf6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Dark mode toggle",
        stickyColor: "#ede9fe",
      },
      {
        id: "bs-f5",
        tool: "Sticky",
        x: 260,
        y: 160,
        width: 180,
        height: 80,
        color: "#8b5cf6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Export to PDF",
        stickyColor: "#ede9fe",
      },
      {
        id: "bs-f6",
        tool: "Sticky",
        x: 460,
        y: 160,
        width: 180,
        height: 80,
        color: "#8b5cf6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Integration with Slack",
        stickyColor: "#ede9fe",
      },
      // Group label: UX
      {
        id: "bs-lbl-ux",
        tool: "Text",
        x: 60,
        y: 280,
        width: 0,
        height: 0,
        color: "#3b82f6",
        strokeWidth: 14,
        text: "✦ UX",
        points: [],
      },
      // UX stickies (4)
      {
        id: "bs-u1",
        tool: "Sticky",
        x: 60,
        y: 310,
        width: 180,
        height: 80,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Simplified onboarding",
        stickyColor: "#dbeafe",
      },
      {
        id: "bs-u2",
        tool: "Sticky",
        x: 260,
        y: 310,
        width: 180,
        height: 80,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Keyboard shortcuts",
        stickyColor: "#dbeafe",
      },
      {
        id: "bs-u3",
        tool: "Sticky",
        x: 460,
        y: 310,
        width: 180,
        height: 80,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Drag-and-drop interface",
        stickyColor: "#dbeafe",
      },
      {
        id: "bs-u4",
        tool: "Sticky",
        x: 660,
        y: 310,
        width: 180,
        height: 80,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Accessibility improvements",
        stickyColor: "#dbeafe",
      },
      // Group label: Ecosystem
      {
        id: "bs-lbl-eco",
        tool: "Text",
        x: 60,
        y: 430,
        width: 0,
        height: 0,
        color: "#10b981",
        strokeWidth: 14,
        text: "✦ Ecosystem",
        points: [],
      },
      // Ecosystem stickies (4)
      {
        id: "bs-e1",
        tool: "Sticky",
        x: 60,
        y: 460,
        width: 180,
        height: 80,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "API for third-party devs",
        stickyColor: "#d1fae5",
      },
      {
        id: "bs-e2",
        tool: "Sticky",
        x: 260,
        y: 460,
        width: 180,
        height: 80,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Plugin marketplace",
        stickyColor: "#d1fae5",
      },
      {
        id: "bs-e3",
        tool: "Sticky",
        x: 460,
        y: 460,
        width: 180,
        height: 80,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Webhooks support",
        stickyColor: "#d1fae5",
      },
      {
        id: "bs-e4",
        tool: "Sticky",
        x: 660,
        y: 460,
        width: 180,
        height: 80,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Open-source SDK",
        stickyColor: "#d1fae5",
      },
    ],
  },
  {
    id: "flowchart",
    name: "Flow Chart",
    description: "User signup decision tree with 10 nodes and 9 connectors",
    icon: GitBranch,
    color: "#3b82f6",
    elements: [
      // Nodes
      {
        id: "fc-s1",
        tool: "Sticky",
        x: 310,
        y: 30,
        width: 200,
        height: 60,
        color: "#6d28d9",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "▶ Start: User visits site",
        stickyColor: "#ede9fe",
      },
      {
        id: "fc-s2",
        tool: "Sticky",
        x: 310,
        y: 130,
        width: 200,
        height: 60,
        color: "#f59e0b",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "◇ Is user logged in?",
        stickyColor: "#fef3c7",
      },
      {
        id: "fc-s3",
        tool: "Sticky",
        x: 80,
        y: 230,
        width: 200,
        height: 60,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Show login page",
        stickyColor: "#dbeafe",
      },
      {
        id: "fc-s4",
        tool: "Sticky",
        x: 80,
        y: 330,
        width: 200,
        height: 60,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "User enters email + password",
        stickyColor: "#dbeafe",
      },
      {
        id: "fc-s5",
        tool: "Sticky",
        x: 80,
        y: 430,
        width: 200,
        height: 60,
        color: "#f59e0b",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "◇ Credentials valid?",
        stickyColor: "#fef3c7",
      },
      {
        id: "fc-s6",
        tool: "Sticky",
        x: -160,
        y: 530,
        width: 200,
        height: 60,
        color: "#ef4444",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "✗ Show error message",
        stickyColor: "#fee2e2",
      },
      {
        id: "fc-s7",
        tool: "Sticky",
        x: 310,
        y: 530,
        width: 200,
        height: 60,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Create session token",
        stickyColor: "#d1fae5",
      },
      {
        id: "fc-s8",
        tool: "Sticky",
        x: 310,
        y: 630,
        width: 200,
        height: 60,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Redirect to dashboard",
        stickyColor: "#d1fae5",
      },
      {
        id: "fc-s9",
        tool: "Sticky",
        x: 540,
        y: 230,
        width: 200,
        height: 60,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "✓ Already authenticated",
        stickyColor: "#d1fae5",
      },
      {
        id: "fc-s10",
        tool: "Sticky",
        x: 310,
        y: 730,
        width: 200,
        height: 60,
        color: "#6d28d9",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "■ User is authenticated",
        stickyColor: "#ede9fe",
      },
      // Connectors (Lines)
      {
        id: "fc-c1",
        tool: "Line",
        x: 410,
        y: 90,
        width: 0,
        height: 40,
        color: "#6b7280",
        strokeWidth: 2,
        text: "",
        points: [],
      },
      {
        id: "fc-c2",
        tool: "Line",
        x: 310,
        y: 160,
        width: -130,
        height: 70,
        color: "#6b7280",
        strokeWidth: 2,
        text: "",
        points: [],
      },
      {
        id: "fc-c3",
        tool: "Line",
        x: 510,
        y: 160,
        width: 130,
        height: 70,
        color: "#6b7280",
        strokeWidth: 2,
        text: "",
        points: [],
      },
      {
        id: "fc-c4",
        tool: "Line",
        x: 180,
        y: 290,
        width: 0,
        height: 40,
        color: "#6b7280",
        strokeWidth: 2,
        text: "",
        points: [],
      },
      {
        id: "fc-c5",
        tool: "Line",
        x: 180,
        y: 390,
        width: 0,
        height: 40,
        color: "#6b7280",
        strokeWidth: 2,
        text: "",
        points: [],
      },
      {
        id: "fc-c6",
        tool: "Line",
        x: 80,
        y: 460,
        width: -140,
        height: 70,
        color: "#ef4444",
        strokeWidth: 2,
        text: "",
        points: [],
      },
      {
        id: "fc-c7",
        tool: "Line",
        x: 280,
        y: 460,
        width: 130,
        height: 70,
        color: "#10b981",
        strokeWidth: 2,
        text: "",
        points: [],
      },
      {
        id: "fc-c8",
        tool: "Line",
        x: 410,
        y: 590,
        width: 0,
        height: 40,
        color: "#6b7280",
        strokeWidth: 2,
        text: "",
        points: [],
      },
      {
        id: "fc-c9",
        tool: "Line",
        x: 410,
        y: 690,
        width: 0,
        height: 40,
        color: "#6b7280",
        strokeWidth: 2,
        text: "",
        points: [],
      },
    ],
  },
  {
    id: "retro",
    name: "Retro Board",
    description:
      "3 columns with 18 pre-filled stickies across sprint review themes",
    icon: StickyNote,
    color: "#10b981",
    elements: [
      // Column labels
      {
        id: "rb-lbl1",
        tool: "Text",
        x: 60,
        y: 20,
        width: 0,
        height: 0,
        color: "#10b981",
        strokeWidth: 16,
        text: "✅ Went Well",
        points: [],
      },
      {
        id: "rb-lbl2",
        tool: "Text",
        x: 340,
        y: 20,
        width: 0,
        height: 0,
        color: "#ef4444",
        strokeWidth: 16,
        text: "⚠ To Improve",
        points: [],
      },
      {
        id: "rb-lbl3",
        tool: "Text",
        x: 620,
        y: 20,
        width: 0,
        height: 0,
        color: "#3b82f6",
        strokeWidth: 16,
        text: "🔧 Action Items",
        points: [],
      },
      // Went Well (6 stickies)
      {
        id: "rb-w1",
        tool: "Sticky",
        x: 40,
        y: 60,
        width: 200,
        height: 70,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Team collaboration was excellent",
        stickyColor: "#d1fae5",
      },
      {
        id: "rb-w2",
        tool: "Sticky",
        x: 40,
        y: 145,
        width: 200,
        height: 70,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Deployed on schedule",
        stickyColor: "#d1fae5",
      },
      {
        id: "rb-w3",
        tool: "Sticky",
        x: 40,
        y: 230,
        width: 200,
        height: 70,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "No major production incidents",
        stickyColor: "#d1fae5",
      },
      {
        id: "rb-w4",
        tool: "Sticky",
        x: 40,
        y: 315,
        width: 200,
        height: 70,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Great sprint planning session",
        stickyColor: "#d1fae5",
      },
      {
        id: "rb-w5",
        tool: "Sticky",
        x: 40,
        y: 400,
        width: 200,
        height: 70,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Improved test coverage significantly",
        stickyColor: "#d1fae5",
      },
      {
        id: "rb-w6",
        tool: "Sticky",
        x: 40,
        y: 485,
        width: 200,
        height: 70,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Clear communication across teams",
        stickyColor: "#d1fae5",
      },
      // To Improve (6 stickies)
      {
        id: "rb-i1",
        tool: "Sticky",
        x: 320,
        y: 60,
        width: 200,
        height: 70,
        color: "#ef4444",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Unclear requirements caused rework",
        stickyColor: "#fee2e2",
      },
      {
        id: "rb-i2",
        tool: "Sticky",
        x: 320,
        y: 145,
        width: 200,
        height: 70,
        color: "#ef4444",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Too many unplanned interruptions",
        stickyColor: "#fee2e2",
      },
      {
        id: "rb-i3",
        tool: "Sticky",
        x: 320,
        y: 230,
        width: 200,
        height: 70,
        color: "#ef4444",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "PR reviews took too long",
        stickyColor: "#fee2e2",
      },
      {
        id: "rb-i4",
        tool: "Sticky",
        x: 320,
        y: 315,
        width: 200,
        height: 70,
        color: "#ef4444",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Scope creep in week 2",
        stickyColor: "#fee2e2",
      },
      {
        id: "rb-i5",
        tool: "Sticky",
        x: 320,
        y: 400,
        width: 200,
        height: 70,
        color: "#ef4444",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Not enough documentation",
        stickyColor: "#fee2e2",
      },
      {
        id: "rb-i6",
        tool: "Sticky",
        x: 320,
        y: 485,
        width: 200,
        height: 70,
        color: "#ef4444",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Staging environment issues",
        stickyColor: "#fee2e2",
      },
      // Action Items (6 stickies)
      {
        id: "rb-a1",
        tool: "Sticky",
        x: 600,
        y: 60,
        width: 200,
        height: 70,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Add definition of done checklist",
        stickyColor: "#dbeafe",
      },
      {
        id: "rb-a2",
        tool: "Sticky",
        x: 600,
        y: 145,
        width: 200,
        height: 70,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Block focus time on Fridays",
        stickyColor: "#dbeafe",
      },
      {
        id: "rb-a3",
        tool: "Sticky",
        x: 600,
        y: 230,
        width: 200,
        height: 70,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Set PR review SLA of 24h",
        stickyColor: "#dbeafe",
      },
      {
        id: "rb-a4",
        tool: "Sticky",
        x: 600,
        y: 315,
        width: 200,
        height: 70,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Freeze scope after sprint planning",
        stickyColor: "#dbeafe",
      },
      {
        id: "rb-a5",
        tool: "Sticky",
        x: 600,
        y: 400,
        width: 200,
        height: 70,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Assign a docs owner each sprint",
        stickyColor: "#dbeafe",
      },
      {
        id: "rb-a6",
        tool: "Sticky",
        x: 600,
        y: 485,
        width: 200,
        height: 70,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Fix CI/CD pipeline reliability",
        stickyColor: "#dbeafe",
      },
    ],
  },
  {
    id: "mindmap",
    name: "Mind Map",
    description: "Product Strategy with 5 branches and 13 leaf stickies",
    icon: Network,
    color: "#f59e0b",
    elements: [
      // Central node
      {
        id: "mm-center",
        tool: "Text",
        x: 340,
        y: 280,
        width: 0,
        height: 0,
        color: "#6d28d9",
        strokeWidth: 20,
        text: "Product Strategy",
        points: [],
      },
      // Branch nodes
      {
        id: "mm-b-market",
        tool: "Sticky",
        x: 80,
        y: 100,
        width: 160,
        height: 60,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "🌐 Market",
        stickyColor: "#dbeafe",
      },
      {
        id: "mm-b-product",
        tool: "Sticky",
        x: 620,
        y: 100,
        width: 160,
        height: 60,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "📦 Product",
        stickyColor: "#d1fae5",
      },
      {
        id: "mm-b-team",
        tool: "Sticky",
        x: 80,
        y: 400,
        width: 160,
        height: 60,
        color: "#f59e0b",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "👥 Team",
        stickyColor: "#fef3c7",
      },
      {
        id: "mm-b-revenue",
        tool: "Sticky",
        x: 620,
        y: 400,
        width: 160,
        height: 60,
        color: "#ef4444",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "💰 Revenue",
        stickyColor: "#fee2e2",
      },
      {
        id: "mm-b-tech",
        tool: "Sticky",
        x: 350,
        y: 520,
        width: 160,
        height: 60,
        color: "#8b5cf6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "⚙ Technology",
        stickyColor: "#ede9fe",
      },
      // Market leaves (3)
      {
        id: "mm-m1",
        tool: "Sticky",
        x: -120,
        y: 60,
        width: 180,
        height: 60,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Target segments",
        stickyColor: "#eff6ff",
      },
      {
        id: "mm-m2",
        tool: "Sticky",
        x: -120,
        y: 140,
        width: 180,
        height: 60,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Competitive landscape",
        stickyColor: "#eff6ff",
      },
      {
        id: "mm-m3",
        tool: "Sticky",
        x: -120,
        y: 220,
        width: 180,
        height: 60,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Pricing research",
        stickyColor: "#eff6ff",
      },
      // Product leaves (3)
      {
        id: "mm-p1",
        tool: "Sticky",
        x: 800,
        y: 60,
        width: 180,
        height: 60,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Core features",
        stickyColor: "#ecfdf5",
      },
      {
        id: "mm-p2",
        tool: "Sticky",
        x: 800,
        y: 140,
        width: 180,
        height: 60,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Roadmap milestones",
        stickyColor: "#ecfdf5",
      },
      {
        id: "mm-p3",
        tool: "Sticky",
        x: 800,
        y: 220,
        width: 180,
        height: 60,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "User feedback loops",
        stickyColor: "#ecfdf5",
      },
      // Team leaves (3)
      {
        id: "mm-t1",
        tool: "Sticky",
        x: -120,
        y: 360,
        width: 180,
        height: 60,
        color: "#f59e0b",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Hiring plan",
        stickyColor: "#fffbeb",
      },
      {
        id: "mm-t2",
        tool: "Sticky",
        x: -120,
        y: 440,
        width: 180,
        height: 60,
        color: "#f59e0b",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Culture & values",
        stickyColor: "#fffbeb",
      },
      {
        id: "mm-t3",
        tool: "Sticky",
        x: -120,
        y: 520,
        width: 180,
        height: 60,
        color: "#f59e0b",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "OKR alignment",
        stickyColor: "#fffbeb",
      },
      // Revenue leaves (3)
      {
        id: "mm-r1",
        tool: "Sticky",
        x: 800,
        y: 360,
        width: 180,
        height: 60,
        color: "#ef4444",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "MRR growth targets",
        stickyColor: "#fff1f2",
      },
      {
        id: "mm-r2",
        tool: "Sticky",
        x: 800,
        y: 440,
        width: 180,
        height: 60,
        color: "#ef4444",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Upsell strategy",
        stickyColor: "#fff1f2",
      },
      {
        id: "mm-r3",
        tool: "Sticky",
        x: 800,
        y: 520,
        width: 180,
        height: 60,
        color: "#ef4444",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Churn reduction",
        stickyColor: "#fff1f2",
      },
      // Technology leaves (2)
      {
        id: "mm-tech1",
        tool: "Sticky",
        x: 240,
        y: 620,
        width: 180,
        height: 60,
        color: "#8b5cf6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Infrastructure scaling",
        stickyColor: "#f5f3ff",
      },
      {
        id: "mm-tech2",
        tool: "Sticky",
        x: 440,
        y: 620,
        width: 180,
        height: 60,
        color: "#8b5cf6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Technical debt backlog",
        stickyColor: "#f5f3ff",
      },
      {
        id: "mm-tech3",
        tool: "Sticky",
        x: 640,
        y: 620,
        width: 180,
        height: 60,
        color: "#8b5cf6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Security review",
        stickyColor: "#f5f3ff",
      },
      // Connectors: center to branches
      {
        id: "mm-c-market",
        tool: "Line",
        x: 420,
        y: 290,
        width: -180,
        height: -160,
        color: "#3b82f6",
        strokeWidth: 2,
        text: "",
        points: [],
      },
      {
        id: "mm-c-product",
        tool: "Line",
        x: 420,
        y: 290,
        width: 280,
        height: -160,
        color: "#10b981",
        strokeWidth: 2,
        text: "",
        points: [],
      },
      {
        id: "mm-c-team",
        tool: "Line",
        x: 420,
        y: 310,
        width: -180,
        height: 120,
        color: "#f59e0b",
        strokeWidth: 2,
        text: "",
        points: [],
      },
      {
        id: "mm-c-revenue",
        tool: "Line",
        x: 420,
        y: 310,
        width: 280,
        height: 120,
        color: "#ef4444",
        strokeWidth: 2,
        text: "",
        points: [],
      },
      {
        id: "mm-c-tech",
        tool: "Line",
        x: 420,
        y: 320,
        width: 10,
        height: 200,
        color: "#8b5cf6",
        strokeWidth: 2,
        text: "",
        points: [],
      },
      // Branches to leaves
      {
        id: "mm-cl-m1",
        tool: "Line",
        x: 80,
        y: 130,
        width: -100,
        height: -40,
        color: "#93c5fd",
        strokeWidth: 1,
        text: "",
        points: [],
      },
      {
        id: "mm-cl-m2",
        tool: "Line",
        x: 80,
        y: 130,
        width: -100,
        height: 40,
        color: "#93c5fd",
        strokeWidth: 1,
        text: "",
        points: [],
      },
      {
        id: "mm-cl-m3",
        tool: "Line",
        x: 80,
        y: 130,
        width: -100,
        height: 120,
        color: "#93c5fd",
        strokeWidth: 1,
        text: "",
        points: [],
      },
      {
        id: "mm-cl-p1",
        tool: "Line",
        x: 780,
        y: 130,
        width: 100,
        height: -40,
        color: "#6ee7b7",
        strokeWidth: 1,
        text: "",
        points: [],
      },
      {
        id: "mm-cl-p2",
        tool: "Line",
        x: 780,
        y: 130,
        width: 100,
        height: 40,
        color: "#6ee7b7",
        strokeWidth: 1,
        text: "",
        points: [],
      },
      {
        id: "mm-cl-p3",
        tool: "Line",
        x: 780,
        y: 130,
        width: 100,
        height: 120,
        color: "#6ee7b7",
        strokeWidth: 1,
        text: "",
        points: [],
      },
    ],
  },
  {
    id: "kanban",
    name: "Kanban Planning",
    description:
      "4 columns with 20 tasks across Backlog, In Progress, In Review, Done",
    icon: Columns3,
    color: "#06b6d4",
    elements: [
      // Column labels
      {
        id: "kb-lbl-backlog",
        tool: "Text",
        x: 40,
        y: 20,
        width: 0,
        height: 0,
        color: "#6b7280",
        strokeWidth: 16,
        text: "📋 Backlog",
        points: [],
      },
      {
        id: "kb-lbl-inprogress",
        tool: "Text",
        x: 300,
        y: 20,
        width: 0,
        height: 0,
        color: "#f59e0b",
        strokeWidth: 16,
        text: "🔄 In Progress",
        points: [],
      },
      {
        id: "kb-lbl-review",
        tool: "Text",
        x: 560,
        y: 20,
        width: 0,
        height: 0,
        color: "#3b82f6",
        strokeWidth: 16,
        text: "👁 In Review",
        points: [],
      },
      {
        id: "kb-lbl-done",
        tool: "Text",
        x: 820,
        y: 20,
        width: 0,
        height: 0,
        color: "#10b981",
        strokeWidth: 16,
        text: "✅ Done",
        points: [],
      },
      // Backlog (6)
      {
        id: "kb-bl1",
        tool: "Sticky",
        x: 20,
        y: 60,
        width: 200,
        height: 70,
        color: "#6b7280",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Design new dashboard UI",
        stickyColor: "#f3f4f6",
      },
      {
        id: "kb-bl2",
        tool: "Sticky",
        x: 20,
        y: 145,
        width: 200,
        height: 70,
        color: "#6b7280",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Build notification system",
        stickyColor: "#f3f4f6",
      },
      {
        id: "kb-bl3",
        tool: "Sticky",
        x: 20,
        y: 230,
        width: 200,
        height: 70,
        color: "#6b7280",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Integrate payment gateway",
        stickyColor: "#f3f4f6",
      },
      {
        id: "kb-bl4",
        tool: "Sticky",
        x: 20,
        y: 315,
        width: 200,
        height: 70,
        color: "#6b7280",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Add multi-language support",
        stickyColor: "#f3f4f6",
      },
      {
        id: "kb-bl5",
        tool: "Sticky",
        x: 20,
        y: 400,
        width: 200,
        height: 70,
        color: "#6b7280",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Performance audit",
        stickyColor: "#f3f4f6",
      },
      {
        id: "kb-bl6",
        tool: "Sticky",
        x: 20,
        y: 485,
        width: 200,
        height: 70,
        color: "#6b7280",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Write API documentation",
        stickyColor: "#f3f4f6",
      },
      // In Progress (5)
      {
        id: "kb-ip1",
        tool: "Sticky",
        x: 280,
        y: 60,
        width: 200,
        height: 70,
        color: "#f59e0b",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Implement drag-and-drop",
        stickyColor: "#fef3c7",
      },
      {
        id: "kb-ip2",
        tool: "Sticky",
        x: 280,
        y: 145,
        width: 200,
        height: 70,
        color: "#f59e0b",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Fix mobile layout issues",
        stickyColor: "#fef3c7",
      },
      {
        id: "kb-ip3",
        tool: "Sticky",
        x: 280,
        y: 230,
        width: 200,
        height: 70,
        color: "#f59e0b",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Upgrade database schema",
        stickyColor: "#fef3c7",
      },
      {
        id: "kb-ip4",
        tool: "Sticky",
        x: 280,
        y: 315,
        width: 200,
        height: 70,
        color: "#f59e0b",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Conduct user interviews",
        stickyColor: "#fef3c7",
      },
      {
        id: "kb-ip5",
        tool: "Sticky",
        x: 280,
        y: 400,
        width: 200,
        height: 70,
        color: "#f59e0b",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Set up CI/CD pipeline",
        stickyColor: "#fef3c7",
      },
      // In Review (4)
      {
        id: "kb-rv1",
        tool: "Sticky",
        x: 540,
        y: 60,
        width: 200,
        height: 70,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "New onboarding flow",
        stickyColor: "#dbeafe",
      },
      {
        id: "kb-rv2",
        tool: "Sticky",
        x: 540,
        y: 145,
        width: 200,
        height: 70,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Password reset feature",
        stickyColor: "#dbeafe",
      },
      {
        id: "kb-rv3",
        tool: "Sticky",
        x: 540,
        y: 230,
        width: 200,
        height: 70,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Redesigned settings page",
        stickyColor: "#dbeafe",
      },
      {
        id: "kb-rv4",
        tool: "Sticky",
        x: 540,
        y: 315,
        width: 200,
        height: 70,
        color: "#3b82f6",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Bug fix: broken exports",
        stickyColor: "#dbeafe",
      },
      // Done (5)
      {
        id: "kb-dn1",
        tool: "Sticky",
        x: 800,
        y: 60,
        width: 200,
        height: 70,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "User authentication",
        stickyColor: "#d1fae5",
      },
      {
        id: "kb-dn2",
        tool: "Sticky",
        x: 800,
        y: 145,
        width: 200,
        height: 70,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Dark mode support",
        stickyColor: "#d1fae5",
      },
      {
        id: "kb-dn3",
        tool: "Sticky",
        x: 800,
        y: 230,
        width: 200,
        height: 70,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Email notifications",
        stickyColor: "#d1fae5",
      },
      {
        id: "kb-dn4",
        tool: "Sticky",
        x: 800,
        y: 315,
        width: 200,
        height: 70,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Team workspace creation",
        stickyColor: "#d1fae5",
      },
      {
        id: "kb-dn5",
        tool: "Sticky",
        x: 800,
        y: 400,
        width: 200,
        height: 70,
        color: "#10b981",
        strokeWidth: 0,
        text: "",
        points: [],
        stickyText: "Initial launch",
        stickyColor: "#d1fae5",
      },
    ],
  },
];

// ─── Template Picker ──────────────────────────────────────────────────────────

interface TemplatePickerProps {
  onSelect: (tpl: WbTemplate | null) => void;
}

function TemplatePicker({ onSelect }: TemplatePickerProps) {
  return (
    <div
      className="flex flex-col h-full overflow-auto"
      data-ocid="template-picker"
    >
      <div className="px-4 pt-6 pb-4 border-b border-border shrink-0">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Choose a template
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Start with a pre-built layout or begin with a blank canvas
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Blank option */}
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="w-full flex items-center gap-4 rounded-xl border border-dashed border-border p-4 mb-3 hover:bg-muted/30 hover:border-primary/40 transition-all text-left group"
          data-ocid="template-blank"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-dashed border-muted-foreground/40 bg-muted/30 group-hover:border-primary/40">
            <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground text-sm">Blank canvas</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Start from scratch with an empty whiteboard
            </p>
          </div>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {WHITEBOARD_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelect(tpl)}
              className="flex items-start gap-4 rounded-xl border border-border p-4 hover:bg-muted/30 hover:border-primary/30 transition-all text-left group"
              data-ocid={`template-pick-${tpl.id}`}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ background: `${tpl.color}20` }}
              >
                <tpl.icon className="h-6 w-6" style={{ color: tpl.color }} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm">
                  {tpl.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {tpl.description}
                </p>
                <Badge
                  variant="outline"
                  className="mt-2 text-[10px] h-4 px-1.5"
                >
                  {tpl.elements.length} elements
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Create Whiteboard Modal ──────────────────────────────────────────────────

interface CreateModalProps {
  onClose: () => void;
  onCreate: (title: string, elements: WhiteboardElement[]) => void;
  isPending: boolean;
}

function CreateWhiteboardModal({
  onClose,
  onCreate,
  isPending,
}: CreateModalProps) {
  const [step, setStep] = useState<"pick" | "form">("pick");
  const [selectedTpl, setSelectedTpl] = useState<WbTemplate | null | undefined>(
    undefined,
  );
  const [title, setTitle] = useState("");

  const handleTemplateSelect = (tpl: WbTemplate | null) => {
    setSelectedTpl(tpl);
    setTitle(tpl ? tpl.name : "");
    setStep("form");
  };

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreate(title.trim(), selectedTpl?.elements ?? []);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm p-0 sm:p-4"
      data-ocid="create-whiteboard-modal"
    >
      <div className="w-full sm:max-w-2xl bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            {step === "form" && (
              <button
                type="button"
                onClick={() => setStep("pick")}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
            <h3 className="font-display font-semibold text-foreground text-sm">
              {step === "pick" ? "New Whiteboard" : "Name your whiteboard"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180" />
          </button>
        </div>

        {step === "pick" ? (
          <div className="flex-1 overflow-hidden">
            <TemplatePicker onSelect={handleTemplateSelect} />
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {selectedTpl && (
              <div
                className="flex items-center gap-3 rounded-xl p-3 border border-border"
                style={{ background: `${selectedTpl.color}10` }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${selectedTpl.color}25` }}
                >
                  <selectedTpl.icon
                    className="h-5 w-5"
                    style={{ color: selectedTpl.color }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm">
                    {selectedTpl.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedTpl.elements.length} elements pre-filled
                  </p>
                </div>
              </div>
            )}
            {!selectedTpl && selectedTpl !== undefined && (
              <div className="flex items-center gap-3 rounded-xl p-3 border border-dashed border-border bg-muted/20">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/40">
                  <Plus className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Blank canvas</p>
              </div>
            )}
            <div className="space-y-1.5">
              <label
                htmlFor="wb-title"
                className="text-sm font-medium text-foreground"
              >
                Whiteboard name
              </label>
              <Input
                id="wb-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q2 Brainstorm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && title.trim()) handleCreate();
                }}
                data-ocid="wb-title-input"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!title.trim() || isPending}
                data-ocid="create-wb-btn"
              >
                {isPending ? "Creating…" : "Create Whiteboard"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WhiteboardsListPage() {
  const { workspaceId } = useParams({
    from: "/app/$workspaceId/whiteboards",
  });
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const wbActor = actor as unknown as WbActor | null;
  const STANDALONE_PROJECT_ID = "workspace-whiteboards";

  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: boards = [], isLoading } = useQuery<Whiteboard[]>({
    queryKey: ["whiteboards-standalone", tenantId, workspaceId],
    queryFn: async () => {
      if (!wbActor) return [];
      try {
        return await wbActor.listWhiteboards(
          tenantId,
          workspaceId,
          STANDALONE_PROJECT_ID,
        );
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });

  const createMutation = useMutation({
    mutationFn: async ({
      title,
      elements,
    }: { title: string; elements: WhiteboardElement[] }) => {
      if (!wbActor) throw new Error("Not connected");
      return wbActor.createWhiteboard(
        tenantId,
        workspaceId,
        STANDALONE_PROJECT_ID,
        title,
        elements,
      );
    },
    onSuccess: (board) => {
      queryClient.invalidateQueries({
        queryKey: ["whiteboards-standalone", tenantId, workspaceId],
      });
      setShowCreate(false);
      toast.success("Whiteboard created!");
      navigate({
        to: "/app/$workspaceId/whiteboards/$whiteboardId" as "/",
        params: { workspaceId, whiteboardId: board.id } as Record<
          string,
          string
        >,
      });
    },
    onError: () => toast.error("Failed to create whiteboard"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!wbActor) throw new Error("Not connected");
      return wbActor.deleteWhiteboard(tenantId, workspaceId, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["whiteboards-standalone", tenantId, workspaceId],
      });
      setDeletingId(null);
      toast.success("Whiteboard deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const filtered = boards.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()),
  );

  const formatDate = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className="flex flex-col h-full overflow-auto bg-background"
      data-ocid="whiteboards-list-page"
    >
      {/* Header */}
      <header className="sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-lg font-semibold text-foreground truncate">
              Whiteboards
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Visual collaboration boards for your workspace
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-52">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              placeholder="Search boards…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-input bg-background pl-8 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="wb-search"
            />
          </div>
          <Button
            size="sm"
            onClick={() => setShowCreate(true)}
            className="gap-1.5 shrink-0"
            data-ocid="create-wb-trigger"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New board</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((k) => (
              <Skeleton key={k} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 && boards.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 gap-5 text-center"
            data-ocid="whiteboards-empty-state"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Layers className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                No whiteboards yet
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Create your first whiteboard to start collaborating visually
                with your team
              </p>
            </div>
            <Button
              onClick={() => setShowCreate(true)}
              data-ocid="create-first-wb-btn"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Create whiteboard
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <Search className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No boards match "{search}"
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((board) => (
              <div
                key={board.id}
                className="group relative rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all overflow-hidden"
                data-ocid={`wb-card-${board.id}`}
              >
                {/* Preview area */}
                <Link
                  to="/app/$workspaceId/whiteboards/$whiteboardId"
                  params={{ workspaceId, whiteboardId: board.id }}
                  className="block"
                >
                  <div
                    className="h-32 bg-muted/30 flex items-center justify-center relative overflow-hidden"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, oklch(0.5 0.01 264 / 0.12) 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      {board.elements.length > 0 ? (
                        <div className="flex flex-wrap gap-1 p-3 justify-center">
                          {board.elements
                            .filter((e) => e.tool === "Sticky")
                            .slice(0, 6)
                            .map((el) => (
                              <div
                                key={el.id}
                                className="h-5 rounded px-1.5 text-[9px] font-medium truncate max-w-[80px]"
                                style={{
                                  background: el.stickyColor ?? "#fef08a",
                                  color: "#374151",
                                }}
                              >
                                {el.stickyText ?? ""}
                              </div>
                            ))}
                        </div>
                      ) : (
                        <Layers className="h-8 w-8 text-muted-foreground/30" />
                      )}
                    </div>
                  </div>
                </Link>

                {/* Card footer */}
                <div className="px-3 py-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      to="/app/$workspaceId/whiteboards/$whiteboardId"
                      params={{ workspaceId, whiteboardId: board.id }}
                      className="font-medium text-sm text-foreground truncate block hover:text-primary transition-colors"
                    >
                      {board.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {board.elements.length} element
                      {board.elements.length !== 1 ? "s" : ""} ·{" "}
                      {formatDate(board.updatedAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete "${board.title}"?`)) {
                        setDeletingId(board.id);
                        deleteMutation.mutate(board.id);
                      }
                    }}
                    disabled={
                      deletingId === board.id && deleteMutation.isPending
                    }
                    className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                    aria-label="Delete whiteboard"
                    data-ocid={`delete-wb-${board.id}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateWhiteboardModal
          onClose={() => setShowCreate(false)}
          onCreate={(title, elements) =>
            createMutation.mutate({ title, elements })
          }
          isPending={createMutation.isPending}
        />
      )}
    </div>
  );
}
