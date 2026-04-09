import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Bitcoin, Check, Copy, QrCode, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { WalletAccount } from "../../types";

type TokenType = "ICP" | "ckBTC";

export default function WalletReceivePage() {
  const { workspaceId } = useParams({ strict: false }) as {
    workspaceId: string;
  };
  const { tenantId } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [tokenType, setTokenType] = useState<TokenType>("ICP");

  const { data: wallet, isLoading } = useQuery<WalletAccount | null>({
    queryKey: ["myWallet", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWalletAccount(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  // For ICP: use 64-char hex account ID. For ICRC-1: use principal+subaccount
  const displayAddress =
    tokenType === "ICP"
      ? (wallet?.accountId ?? "")
      : (wallet?.icrc1Account ?? wallet?.principalId ?? "");

  function handleCopy() {
    if (!displayAddress) return;
    void navigator.clipboard.writeText(displayAddress);
    setCopied(true);
    toast.success("Address copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  // Simple QR as SVG data URI (real apps would use a QR library; we show a placeholder pattern)
  const qrDataUri = displayAddress
    ? `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='white'/><text x='100' y='110' font-size='8' text-anchor='middle' font-family='monospace' fill='black'>${displayAddress.slice(0, 20)}…</text></svg>`)}`
    : null;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: `/app/${workspaceId}/wallet` as "/" })}
          data-ocid="receive-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <QrCode className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold font-display text-foreground">
              Receive Tokens
            </h1>
            <p className="text-sm text-muted-foreground">
              Share your address to receive funds
            </p>
          </div>
        </div>
      </div>

      {/* Token type selector */}
      <div className="flex gap-2">
        {(["ICP", "ckBTC"] as const).map((t) => (
          <button
            type="button"
            key={t}
            data-ocid={`receive-token-${t}`}
            onClick={() => setTokenType(t)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              tokenType === t
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
            }`}
          >
            {t === "ckBTC" ? (
              <Bitcoin className="w-4 h-4" />
            ) : (
              <Wallet className="w-4 h-4" />
            )}
            {t}
          </button>
        ))}
      </div>

      {/* Address card */}
      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : !wallet ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <Wallet className="w-10 h-10 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              No wallet found. Create one first.
            </p>
            <Button
              onClick={() =>
                navigate({ to: `/app/${workspaceId}/wallet` as "/" })
              }
            >
              Go to Wallet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display flex items-center gap-2">
              {tokenType === "ICP"
                ? "ICP Account ID"
                : "ICRC-1 Principal Address"}
              <Badge variant="outline" className="text-xs">
                {tokenType}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 items-center">
            {/* QR Code */}
            <div
              data-ocid="receive-qr-code"
              className="w-48 h-48 rounded-xl border border-border bg-card flex items-center justify-center overflow-hidden"
            >
              {qrDataUri ? (
                <img src={qrDataUri} alt="QR Code" className="w-full h-full" />
              ) : (
                <QrCode className="w-20 h-20 text-muted-foreground" />
              )}
            </div>

            {/* Address */}
            <div className="w-full">
              <p className="text-xs text-muted-foreground mb-2 text-center">
                {tokenType === "ICP"
                  ? "Share this 64-character hex address to receive ICP"
                  : "Share this principal ID to receive ckBTC or other ICRC-1 tokens"}
              </p>
              <div
                data-ocid="receive-address-display"
                className="bg-muted/50 rounded-lg px-4 py-3 border border-border"
              >
                <p className="text-xs font-mono break-all text-foreground text-center leading-relaxed">
                  {displayAddress || "—"}
                </p>
              </div>
            </div>

            {/* Copy button */}
            <Button
              data-ocid="receive-copy-btn"
              onClick={handleCopy}
              disabled={!displayAddress}
              className="w-full gap-2"
              variant={copied ? "outline" : "default"}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Address
                </>
              )}
            </Button>

            {/* Info note */}
            <p className="text-xs text-muted-foreground text-center max-w-xs">
              {tokenType === "ICP"
                ? "This 64-character hex address is derived from your Internet Identity principal. It works with any ICP-compatible wallet or exchange."
                : "ICRC-1 tokens (ckBTC, ckETH, etc.) use principal + subaccount format, not the 64-char hex account ID."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
