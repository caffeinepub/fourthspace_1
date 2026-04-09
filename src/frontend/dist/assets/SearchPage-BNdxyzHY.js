import { s as createLucideIcon, m as useParams, g as getTenantId, d as useNavigate, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, X, i as Link, A as Avatar, q as AvatarFallback } from "./index-1XRv9GHr.js";
import { B as Badge } from "./badge-rX4oLW6l.js";
import { I as Input } from "./input-BOIU-9S_.js";
import { L as Label } from "./label-cy3JJ-Xo.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BNtSJS5c.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { u as useBackend } from "./useBackend-DyFxq-Jw.js";
import { A as ArrowLeft } from "./arrow-left-B-gbON0E.js";
import { S as Search } from "./search-CWnD_rod.js";
import { H as Hash } from "./hash-Djb3fa_z.js";
import "./index-IXOTxK3N.js";
import "./index-DYs8jb_i.js";
import "./chevron-up-BUdvSziG.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z", key: "p1xzt8" }],
  ["path", { d: "M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1", key: "1cx29u" }]
];
const MessagesSquare = createLucideIcon("messages-square", __iconNode);
function formatTimestamp(ts) {
  const ms = Number(ts / 1000000n);
  const d = new Date(ms);
  const now = /* @__PURE__ */ new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 864e5);
  if (diffDays === 0) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return d.toLocaleDateString([], { weekday: "short" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}
function highlightMatch(text, query) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = [];
  let lastIndex = 0;
  let match = regex.exec(text);
  while (match !== null) {
    if (match.index > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, match.index),
        isMatch: false,
        id: `t${lastIndex}`
      });
    }
    parts.push({ text: match[0], isMatch: true, id: `m${match.index}` });
    lastIndex = match.index + match[0].length;
    match = regex.exec(text);
  }
  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      isMatch: false,
      id: `t${lastIndex}`
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: parts.map(
    (p) => p.isMatch ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "mark",
      {
        className: "bg-primary/20 text-primary rounded-sm px-0.5 not-italic",
        children: p.text
      },
      p.id
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.text }, p.id)
  ) });
}
function truncate(text, max) {
  return text.length <= max ? text : `${text.slice(0, max)}…`;
}
function senderInitials(id) {
  return id.slice(0, 2).toUpperCase();
}
function ResultCard({
  message,
  channel,
  query,
  workspaceId
}) {
  const channelName = (channel == null ? void 0 : channel.name) ?? message.channelId;
  const preview = truncate(message.content, 200);
  const senderId = message.senderId.toString();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/app/$workspaceId/chat/$channelId",
      params: { workspaceId, channelId: message.channelId },
      "data-ocid": `search-result-${message.id}`,
      className: "flex gap-4 rounded-2xl border border-border bg-card p-4 transition-smooth hover:shadow-md hover:-translate-y-0.5 hover:border-teal-500/30 group",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-9 w-9 shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold", children: senderInitials(senderId) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs font-medium text-teal-600 dark:text-teal-400 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3 w-3" }),
              channelName
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-auto shrink-0", children: formatTimestamp(message.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-1 truncate font-mono", children: [
            senderId.slice(0, 14),
            "…"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed break-words", children: highlightMatch(preview, query) })
        ] })
      ]
    }
  );
}
function ResultSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 rounded-2xl border border-border bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-full shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" })
    ] })
  ] });
}
function SearchPage() {
  var _a;
  const { workspaceId } = useParams({ from: "/app/$workspaceId/chat/search" });
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const navigate = useNavigate();
  const [query, setQuery] = reactExports.useState("");
  const [debouncedQuery, setDebouncedQuery] = reactExports.useState("");
  const [channelFilter, setChannelFilter] = reactExports.useState("all");
  const [senderFilter, setSenderFilter] = reactExports.useState("");
  const [fromDate, setFromDate] = reactExports.useState("");
  const [toDate, setToDate] = reactExports.useState("");
  const debounceRef = reactExports.useRef(null);
  const handleQueryChange = reactExports.useCallback((val) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(val);
    }, 300);
  }, []);
  reactExports.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);
  const { data: channels } = useQuery({
    queryKey: ["channels", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listChannels(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching
  });
  const hasQuery = debouncedQuery.trim().length > 0;
  const fromTime = fromDate ? BigInt(new Date(fromDate).getTime()) * 1000000n : null;
  const toTime = toDate ? BigInt((/* @__PURE__ */ new Date(`${toDate}T23:59:59`)).getTime()) * 1000000n : null;
  const channelId = channelFilter !== "all" ? channelFilter : null;
  const {
    data: results,
    isLoading: isSearching,
    isFetching: isRefetching
  } = useQuery({
    queryKey: [
      "searchMessages",
      tenantId,
      workspaceId,
      debouncedQuery,
      channelId,
      senderFilter,
      fromDate,
      toDate
    ],
    queryFn: async () => {
      if (!actor || !debouncedQuery.trim()) return [];
      return actor.searchMessages(
        tenantId,
        workspaceId,
        debouncedQuery.trim(),
        channelId,
        null,
        fromTime,
        toTime
      );
    },
    enabled: !!actor && !isFetching && hasQuery,
    staleTime: 15e3
  });
  const channelMap = new Map(
    (channels ?? []).map((c) => [c.id, c])
  );
  const filteredResults = (results ?? []).filter((m) => {
    if (!senderFilter.trim()) return true;
    return m.senderId.toString().includes(senderFilter.trim());
  });
  const hasResults = filteredResults.length > 0;
  const searched = hasQuery && !isSearching && !isRefetching;
  function clearFilters() {
    setChannelFilter("all");
    setSenderFilter("");
    setFromDate("");
    setToDate("");
  }
  const hasActiveFilters = channelFilter !== "all" || senderFilter.trim() !== "" || fromDate !== "" || toDate !== "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-3xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({
            to: "/app/$workspaceId/chat",
            params: { workspaceId }
          }),
          "aria-label": "Back to chat",
          "data-ocid": "search-back-btn",
          className: "shrink-0",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Message Search" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Search across all channels" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Search messages…",
          value: query,
          onChange: (e) => handleQueryChange(e.target.value),
          className: "pl-10 pr-10 h-11 text-base",
          "data-ocid": "search-input",
          autoFocus: true
        }
      ),
      query && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7",
          onClick: () => {
            setQuery("");
            setDebouncedQuery("");
          },
          "aria-label": "Clear search",
          "data-ocid": "search-clear-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Filters" }),
        hasActiveFilters && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: clearFilters,
            className: "h-6 text-xs text-muted-foreground hover:text-foreground px-2",
            "data-ocid": "search-clear-filters-btn",
            children: "Clear filters"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Channel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: channelFilter,
              onValueChange: setChannelFilter,
              "data-ocid": "search-channel-filter",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9", "data-ocid": "search-channel-trigger", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All channels" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All channels" }),
                  (channels ?? []).map((ch) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: ch.id, children: [
                    "#",
                    ch.name
                  ] }, ch.id))
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Sender (principal)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Partial principal ID…",
              value: senderFilter,
              onChange: (e) => setSenderFilter(e.target.value),
              className: "h-9 text-sm font-mono",
              "data-ocid": "search-sender-filter"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "From date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: fromDate,
              onChange: (e) => setFromDate(e.target.value),
              className: "h-9 text-sm",
              "data-ocid": "search-from-date"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "To date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: toDate,
              onChange: (e) => setToDate(e.target.value),
              className: "h-9 text-sm",
              "data-ocid": "search-to-date"
            }
          )
        ] })
      ] })
    ] }),
    !hasQuery ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "search-idle-state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessagesSquare, { className: "h-7 w-7 text-teal-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "Search your messages" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground max-w-xs", children: "Type a keyword above to search across all channels and conversations." })
        ]
      }
    ) : isSearching ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "search-loading-state", children: [1, 2, 3, 4].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(ResultSkeleton, {}, n)) }) : hasResults ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "search-results-list", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          filteredResults.length,
          " result",
          filteredResults.length !== 1 ? "s" : "",
          " for",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
            '"',
            debouncedQuery,
            '"'
          ] })
        ] }),
        channelFilter !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "outline",
            className: "text-xs gap-1 border-teal-500/30 text-teal-600 dark:text-teal-400",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-2.5 w-2.5" }),
              ((_a = channelMap.get(channelFilter)) == null ? void 0 : _a.name) ?? channelFilter
            ]
          }
        )
      ] }),
      filteredResults.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ResultCard,
        {
          message: msg,
          channel: channelMap.get(msg.channelId),
          query: debouncedQuery,
          workspaceId
        },
        msg.id
      ))
    ] }) : searched && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center",
        "data-ocid": "search-empty-state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-7 w-7 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "No messages found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground max-w-xs", children: "Try a different keyword, broaden your date range, or remove channel and sender filters." }),
          hasActiveFilters && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: clearFilters,
              className: "mt-5 text-teal-600 border-teal-500/30 hover:bg-teal-50 dark:hover:bg-teal-950/30",
              "data-ocid": "search-empty-clear-btn",
              children: "Clear all filters"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              asChild: true,
              className: "mt-3 text-muted-foreground",
              "data-ocid": "search-empty-back-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/$workspaceId/chat", params: { workspaceId }, children: "Back to channels" })
            }
          )
        ]
      }
    )
  ] });
}
export {
  SearchPage as default
};
