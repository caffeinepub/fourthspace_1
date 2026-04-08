import EscTypes "types/escrow";
import WalTypes "types/wallet";
import Common "types/common";

module {

  // ── Old types (inline — from previously deployed version) ─────────────────
  // These are structurally identical to the new types minus the added fields.
  // We reuse new-version sub-types for nested records where structure is unchanged.

  // Old EscrowContract — structurally identical to the current deployed version
  // (fundedAmount and fundingBlockHeight were added in a prior migration and are now deployed)
  type OldEscrowContract = {
    id : Common.EntityId;
    tenantId : Common.TenantId;
    workspaceId : Common.WorkspaceId;
    title : Text;
    description : Text;
    amount : Nat;
    currency : Text;
    payerId : Common.UserId;
    payeeId : Common.UserId;
    status : EscTypes.EscrowStatus;
    conditions : [Text];
    dueDate : ?Common.Timestamp;
    crossLinks : [Common.CrossLink];
    statusHistory : [EscTypes.StatusHistoryEntry];
    fundedAmount : ?Nat;
    fundingBlockHeight : ?Nat;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  // Old WalletTransaction — structurally identical to the current deployed version
  // (memoValue was added in a prior migration and is now deployed)
  type OldWalletTransaction = {
    id : Common.EntityId;
    tenantId : Common.TenantId;
    workspaceId : Common.WorkspaceId;
    accountId : Common.EntityId;
    txType : WalTypes.TransactionType;
    asset : WalTypes.AssetType;
    amount : Nat;
    toAddress : ?Text;
    fromAddress : ?Text;
    status : WalTypes.TransactionStatus;
    memo : ?Text;
    memoValue : ?Nat64;
    requiredApprovals : Nat;
    approvals : [WalTypes.TransactionApproval];
    ledgerBlockHeight : ?Nat;
    ledgerTxHash : ?Text;
    createdAt : Common.Timestamp;
  };

  // ── Input / Output types ──────────────────────────────────────────────────

  public type OldActor = {
    escrowContracts : [(Common.EntityId, OldEscrowContract)];
    walletTxs       : [(Common.EntityId, OldWalletTransaction)];
  };

  public type NewActor = {
    escrowContracts : [(Common.EntityId, EscTypes.EscrowContract)];
    walletTxs       : [(Common.EntityId, WalTypes.WalletTransaction)];
  };

  // ── Migration function ────────────────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    // OldEscrowContract and EscTypes.EscrowContract are structurally identical —
    // all fields already present in deployed state. Pass through directly.
    let newEscrow : [(Common.EntityId, EscTypes.EscrowContract)] = old.escrowContracts.map<
      (Common.EntityId, OldEscrowContract),
      (Common.EntityId, EscTypes.EscrowContract)
    >(func((id, c)) { (id, c) });

    // OldWalletTransaction and WalTypes.WalletTransaction are structurally identical —
    // all fields already present in deployed state. Pass through directly.
    let newWalletTxs : [(Common.EntityId, WalTypes.WalletTransaction)] = old.walletTxs.map<
      (Common.EntityId, OldWalletTransaction),
      (Common.EntityId, WalTypes.WalletTransaction)
    >(func((id, tx)) { (id, tx) });

    {
      escrowContracts = newEscrow;
      walletTxs       = newWalletTxs;
    };
  };
};
