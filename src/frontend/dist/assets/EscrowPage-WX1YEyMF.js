import { m as useParams, f as useWorkspace, d as useNavigate, r as reactExports, h as useQuery, j as jsxRuntimeExports, p as Shield, B as Button, P as Plus, ah as EscrowStatus } from "./index-1XRv9GHr.js";
import { B as Badge } from "./badge-rX4oLW6l.js";
import { C as Card, a as CardContent } from "./card-CFU1s52N.js";
import { I as Input } from "./input-BOIU-9S_.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { u as useBackend } from "./useBackend-DyFxq-Jw.js";
import { S as Search } from "./search-CWnD_rod.js";
import { f as format } from "./format-BjBbZPfh.js";
import { C as CircleAlert } from "./circle-alert-DOsaO_yO.js";
import { E as ExternalLink } from "./external-link-CvyMnUnS.js";
import { C as Clock } from "./clock-By6uj0s2.js";
import "./en-US-CJ_JRP0W.js";
const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: EscrowStatus.Pending },
  { label: "Funded", value: EscrowStatus.Funded },
  { label: "Released", value: EscrowStatus.Released },
  { label: "Disputed", value: EscrowStatus.Disputed },
  { label: "Cancelled", value: EscrowStatus.Cancelled }
];
const STATUS_COLORS = {
  [EscrowStatus.Pending]: "bg-muted text-muted-foreground",
  [EscrowStatus.Funded]: "bg-primary/10 text-primary",
  [EscrowStatus.Released]: "bg-accent/10 text-accent-foreground",
  [EscrowStatus.Disputed]: "bg-destructive/10 text-destructive",
  [EscrowStatus.Cancelled]: "bg-muted text-muted-foreground"
};
function formatICP(e8s) {
  return `${(Number(e8s) / 1e8).toFixed(4)} ICP`;
}
function EscrowPage() {
  const { workspaceId } = useParams({ strict: false });
  const { tenantId } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const { data: escrows = [], isLoading } = useQuery({
    queryKey: ["escrow", tenantId, workspaceId, activeStatus],
    queryFn: async () => {
      if (!actor) return [];
      const filter = activeStatus !== "all" ? { status: activeStatus } : null;
      return actor.listEscrows(tenantId, workspaceId, filter);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const filtered = reactExports.useMemo(() => {
    if (!search.trim()) return escrows;
    const q = search.toLowerCase();
    return escrows.filter(
      (e) => e.title.toLowerCase().includes(q) || e.payeeId.toString().toLowerCase().includes(q) || e.payerId.toString().toLowerCase().includes(q)
    );
  }, [escrows, search]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 p-4 sm:p-6 max-w-5xl mx-auto w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-foreground font-display", children: "Escrow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage agreements and milestone payments" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "escrow-new-btn",
          onClick: () => navigate({ to: `/app/${workspaceId}/escrow/new` }),
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "New Escrow"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          "data-ocid": "escrow-search",
          placeholder: "Search by title or counterparty...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "pl-9"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0 overflow-x-auto border-b border-border", children: STATUS_TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": `escrow-tab-${tab.value}`,
        onClick: () => setActiveStatus(tab.value),
        className: `px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors duration-200 ${activeStatus === tab.value ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
        children: tab.label
      },
      tab.value
    )) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-lg" }, k)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "escrow-empty-state",
        className: "flex flex-col items-center justify-center py-20 gap-4 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-7 h-7 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground font-display", children: "No escrows found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: search ? "Try a different search term." : "Create your first escrow agreement to get started." })
          ] }),
          !search && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => navigate({ to: `/app/${workspaceId}/escrow/new` }),
              className: "gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                "New Escrow"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: filtered.map((escrow) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      EscrowRow,
      {
        escrow,
        workspaceId
      },
      escrow.id
    )) })
  ] });
}
function EscrowRow({
  escrow,
  workspaceId
}) {
  const navigate = useNavigate();
  const createdDate = escrow.createdAt ? format(new Date(Number(escrow.createdAt) / 1e6), "MMM d, yyyy") : "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      "data-ocid": `escrow-row-${escrow.id}`,
      className: "cursor-pointer hover:border-primary/40 transition-colors duration-200 group",
      onClick: () => navigate({ to: `/app/${workspaceId}/escrow/${escrow.id}` }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-foreground truncate group-hover:text-primary transition-colors font-display text-sm", children: escrow.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: `text-xs shrink-0 ${STATUS_COLORS[escrow.status] ?? "bg-muted text-muted-foreground"}`,
                  variant: "outline",
                  children: escrow.status
                }
              ),
              escrow.status === EscrowStatus.Disputed && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-destructive shrink-0" })
            ] }),
            escrow.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1", children: escrow.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: formatICP(escrow.amount) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: escrow.currency })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-3 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Created ",
            createdDate
          ] }),
          escrow.dueDate && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Due",
              " ",
              format(
                new Date(Number(escrow.dueDate) / 1e6),
                "MMM d, yyyy"
              )
            ] })
          ] })
        ] })
      ] })
    }
  );
}
export {
  EscrowPage as default
};
