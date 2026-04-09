import { m as useParams, f as useWorkspace, d as useNavigate, n as useQueryClient, r as reactExports, h as useQuery, ac as PayrollStatus, j as jsxRuntimeExports, B as Button, W as Wallet } from "./index-1XRv9GHr.js";
import { B as Badge } from "./badge-rX4oLW6l.js";
import { C as Card, a as CardContent } from "./card-CFU1s52N.js";
import { C as Checkbox } from "./checkbox-CANCE-ko.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { u as useMutation } from "./useMutation-X94w2CVk.js";
import { u as ue } from "./index-BOWFyaIB.js";
import { u as useBackend } from "./useBackend-DyFxq-Jw.js";
import { A as ArrowLeft } from "./arrow-left-B-gbON0E.js";
import { C as CircleCheck } from "./circle-check-DTEyto7g.js";
import { T as TriangleAlert } from "./triangle-alert-Dm4aJj7p.js";
import { L as LoaderCircle } from "./loader-circle-CtmMa9i8.js";
import "./index-DYs8jb_i.js";
function formatICP(e8s) {
  return `${(Number(e8s) / 1e8).toFixed(4)} ICP`;
}
function BulkApprovalPage() {
  const { workspaceId } = useParams({ strict: false });
  const { tenantId } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const { data: treasury, isLoading: loadingTreasury } = useQuery({
    queryKey: ["treasury", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWorkspaceTreasury(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: records = [], isLoading: loadingRecords } = useQuery({
    queryKey: ["payroll", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPayrollRecords(tenantId, workspaceId, null);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const pending = records.filter(
    (r) => r.status === PayrollStatus.PendingApproval
  );
  const hasTreasuryBalance = treasury != null && treasury.icpBalance > 0n;
  const selectedTotal = pending.filter((r) => selected.has(r.id)).reduce((sum, r) => sum + (r.amount ?? 0n), 0n);
  function toggleAll() {
    if (selected.size === pending.length) {
      setSelected(/* @__PURE__ */ new Set());
    } else {
      setSelected(new Set(pending.map((r) => r.id)));
    }
  }
  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  const bulkApproveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const ids = Array.from(selected);
      const r = await actor.bulkApprovePayroll(tenantId, workspaceId, ids);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      ue.success(`Approved ${selected.size} payroll records`);
      setSelected(/* @__PURE__ */ new Set());
      void queryClient.invalidateQueries({ queryKey: ["payroll"] });
      void queryClient.invalidateQueries({ queryKey: ["treasury"] });
    },
    onError: (e) => ue.error(e.message)
  });
  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.rejectPayrollRecord(
        tenantId,
        workspaceId,
        id,
        reason
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      ue.success("Payroll record rejected");
      void queryClient.invalidateQueries({ queryKey: ["payroll"] });
    },
    onError: (e) => ue.error(e.message)
  });
  const canApprove = selected.size > 0 && hasTreasuryBalance && !bulkApproveMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 p-4 sm:p-6 max-w-4xl mx-auto w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: `/app/${workspaceId}/payroll` }),
          "data-ocid": "bulk-approval-back",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold font-display text-foreground", children: "Bulk Approval" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            pending.length,
            " record",
            pending.length !== 1 ? "s" : "",
            " pending approval"
          ] })
        ] })
      ] })
    ] }),
    loadingTreasury ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-lg" }) : !hasTreasuryBalance ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "bulk-approval-balance-warning",
        className: "flex items-start gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-destructive mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-destructive", children: "Insufficient treasury balance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Insufficient treasury balance. Please fund the workspace treasury before processing payroll." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => navigate({ to: `/app/${workspaceId}/wallet` }),
              "data-ocid": "bulk-fund-treasury-btn",
              className: "shrink-0 gap-1.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-3.5 h-3.5" }),
                "Fund Treasury"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-4 h-4 text-primary" }),
        "Treasury:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: formatICP(treasury.icpBalance) })
      ] }),
      selected.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Selected total:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: formatICP(selectedTotal) })
      ] })
    ] }),
    pending.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Checkbox,
          {
            id: "select-all",
            "data-ocid": "bulk-select-all",
            checked: selected.size === pending.length && pending.length > 0,
            onCheckedChange: toggleAll
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            htmlFor: "select-all",
            className: "text-sm text-muted-foreground cursor-pointer",
            children: [
              "Select all (",
              pending.length,
              ")"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          "data-ocid": "bulk-approve-btn",
          disabled: !canApprove,
          onClick: () => bulkApproveMutation.mutate(),
          className: "gap-1.5",
          size: "sm",
          children: bulkApproveMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }),
            "Approving…"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
            "Approve (",
            selected.size,
            ")"
          ] })
        }
      ) })
    ] }),
    loadingRecords ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-lg" }, k)) }) : pending.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "bulk-empty-state",
        className: "flex flex-col items-center justify-center py-16 gap-3 text-center rounded-lg border border-dashed border-border",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-10 h-10 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground font-display", children: "All caught up" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "No payroll records pending approval." })
          ] })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: pending.map((record) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        "data-ocid": `bulk-record-${record.id}`,
        className: `transition-colors ${selected.has(record.id) ? "border-primary/40 bg-primary/2" : ""}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Checkbox,
            {
              "data-ocid": `bulk-checkbox-${record.id}`,
              checked: selected.has(record.id),
              onCheckedChange: () => toggle(record.id)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
              "Period: ",
              record.period
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Employee #",
              record.employeeId.slice(0, 8),
              " ·",
              " ",
              record.currency
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
              record.grossAmount.toLocaleString(),
              " gross"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Net: ",
              record.netAmount.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "text-xs shrink-0 bg-secondary/10 text-secondary-foreground",
              children: record.status
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "ghost",
              className: "text-xs text-destructive hover:text-destructive h-7 px-2 shrink-0",
              "data-ocid": `bulk-reject-${record.id}`,
              onClick: () => rejectMutation.mutate({
                id: record.id,
                reason: "Rejected by admin"
              }),
              disabled: rejectMutation.isPending,
              children: "Reject"
            }
          )
        ] })
      },
      record.id
    )) })
  ] });
}
export {
  BulkApprovalPage as default
};
