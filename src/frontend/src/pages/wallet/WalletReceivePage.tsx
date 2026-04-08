import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bitcoin,
  CheckCircle2,
  ClipboardCopy,
  QrCode,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import type { WalletAccount } from "../../types";

/** Deterministic QR-like grid based on actual address bytes */
function QRCodeDisplay({ value }: { value: string }) {
  const size = 14;
  const encoded = value.split("").map((c) => c.charCodeAt(0));
  const flatCells: { key: string; filled: boolean }[] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const idx = (row * size + col) % (encoded.length || 1);
      const filled = (encoded[idx] ^ (row * 7 + col * 13)) % 2 === 0;
      flatCells.push({ key: `cell-${row * size + col}`, filled });
    }
  }
  return (
    <div
      className="inline-block p-4 bg-card border-2 border-border rounded-2xl shadow-card"
      aria-label="QR code for wallet address"
    >
      <div
        className="grid gap-0.5"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {flatCells.map(({ key, filled }) => (
          <div
            key={key}
            className={`h-4 w-4 rounded-sm ${filled ? "bg-foreground" : "bg-background"}`}
          />
        ))}
      </div>
    </div>
  );
}

function AddressBox({
  label,
  sublabel,
  value,
  icon,
}: { label: string; sublabel?: string; value: string; icon: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {icon}
            {label}
          </div>
          {sublabel && (
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {sublabel}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${label}`}
          data-ocid={`copy-${label.toLowerCase().replace(/\s+/g, "-")}`}
          className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${copied ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "border-border bg-background hover:bg-muted text-muted-foreground"}`}
        >
          {copied ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <ClipboardCopy className="h-4 w-4" />
          )}
        </button>
      </div>
      <code className="block font-mono text-xs text-foreground break-all leading-relaxed">
        {value}
      </code>
    </div>
  );
}

type ReceiveTab = "icp" | "ckbtc";

export default function WalletReceivePage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const navigate = useNavigate();
  const [activeToken, setActiveToken] = useState<ReceiveTab>("icp");

  const { data: account, isLoading } = useQuery<WalletAccount | null>({
    queryKey: ["walletAccount", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWalletAccount(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  // ICP uses the 64-char hex accountId; ckBTC uses the ICRC-1 account format
  const qrValue =
    activeToken === "icp"
      ? (account?.accountId ?? "")
      : (account?.icrc1Account ?? "");

  return (
    <div className="animate-fade-in-up p-6 space-y-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: `/app/${workspaceId}/wallet` })}
          aria-label="Back to wallet"
          data-ocid="receive-back-btn"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <QrCode className="h-6 w-6 text-violet-500" />
            Receive Assets
          </h1>
          <p className="text-sm text-muted-foreground">
            Share your address to receive ICP or ckBTC
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      ) : !account ? (
        <div className="rounded-2xl border border-border/50 bg-card shadow-card p-8 text-center">
          <Wallet className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            No wallet account found. Create one from the Wallet page.
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => navigate({ to: `/app/${workspaceId}/wallet` })}
          >
            Back to Wallet
          </Button>
        </div>
      ) : (
        <>
          {/* Token selector */}
          <fieldset className="flex gap-1.5 p-1.5 rounded-xl bg-muted border-0">
            <legend className="sr-only">Select token to receive</legend>
            {(
              [
                {
                  id: "icp" as ReceiveTab,
                  label: "ICP",
                  icon: <Wallet className="h-3.5 w-3.5" />,
                },
                {
                  id: "ckbtc" as ReceiveTab,
                  label: "ckBTC",
                  icon: <Bitcoin className="h-3.5 w-3.5" />,
                },
              ] as const
            ).map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveToken(id)}
                data-ocid={`receive-token-${id}`}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${activeToken === id ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {icon}
                {label}
              </button>
            ))}
          </fieldset>

          {/* QR Display */}
          <div className="rounded-2xl border border-border/50 bg-card shadow-card p-6 flex flex-col items-center gap-5">
            <div className="text-center">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Your {activeToken === "icp" ? "ICP" : "ckBTC"} Receive Address
              </p>
              <p className="text-xs text-muted-foreground">
                Screenshot or copy the address below to share
              </p>
            </div>
            <QRCodeDisplay value={qrValue} />
          </div>

          {/* Address fields */}
          <div className="space-y-3">
            {activeToken === "icp" ? (
              <>
                <AddressBox
                  label="ICP Account Address"
                  sublabel="Use this to receive ICP from any compatible wallet or exchange"
                  value={account.accountId}
                  icon={<Wallet className="h-3.5 w-3.5" />}
                />
                <AddressBox
                  label="Principal ID"
                  sublabel="Your Internet Identity principal"
                  value={account.principalId}
                  icon={<Wallet className="h-3.5 w-3.5" />}
                />
              </>
            ) : (
              <>
                <AddressBox
                  label="ICRC-1 Account (ckBTC)"
                  sublabel="Use this to receive ckBTC and other ICRC-1 tokens"
                  value={account.icrc1Account}
                  icon={<Bitcoin className="h-3.5 w-3.5" />}
                />
                <AddressBox
                  label="Principal ID"
                  sublabel="Your Internet Identity principal"
                  value={account.principalId}
                  icon={<Wallet className="h-3.5 w-3.5" />}
                />
              </>
            )}
          </div>

          {/* Info notice */}
          <div className="rounded-xl bg-violet-500/5 border border-violet-500/20 px-4 py-3">
            <p className="text-xs text-violet-700 dark:text-violet-400 leading-relaxed">
              <strong>On-chain addresses:</strong>{" "}
              {activeToken === "icp"
                ? "Your ICP Account Address is derived from your principal ID and is permanent. Send it to anyone who wants to transfer ICP to you."
                : "Your ICRC-1 Account is required for receiving ckBTC and other ICRC-1 tokens. Use this address when withdrawing from exchanges that support ckBTC."}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
