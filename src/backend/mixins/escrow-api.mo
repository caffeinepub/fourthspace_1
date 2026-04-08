import Common "../types/common";
import EscTypes "../types/escrow";
import EscLib "../lib/escrow";

module {

  public func createEscrow(
    contracts : [(Common.EntityId, EscTypes.EscrowContract)],
    idCounter : Nat,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : EscTypes.EscrowInput,
  ) : { #ok : (EscTypes.EscrowContract, [(Common.EntityId, EscTypes.EscrowContract)], Nat); #err : Text } {
    let newCounter = idCounter + 1;
    let id = EscLib.genId(newCounter);
    let (contract, updated) = EscLib.createEscrow(contracts, tenantId, workspaceId, caller, input, id);
    #ok((contract, updated, newCounter));
  };

  public func getEscrow(
    contracts : [(Common.EntityId, EscTypes.EscrowContract)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { #ok : EscTypes.EscrowContract; #err : Text } {
    switch (EscLib.getEscrow(contracts, tenantId, workspaceId, id)) {
      case (?c) { #ok(c) };
      case null { #err("Escrow contract not found") };
    };
  };

  public func listEscrows(
    contracts : [(Common.EntityId, EscTypes.EscrowContract)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    filter : ?EscTypes.EscrowFilter,
  ) : [EscTypes.EscrowContract] {
    EscLib.listEscrows(contracts, tenantId, workspaceId, caller, filter);
  };

  public func fundEscrow(
    contracts : [(Common.EntityId, EscTypes.EscrowContract)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { #ok : (EscTypes.EscrowContract, [(Common.EntityId, EscTypes.EscrowContract)]); #err : Text } {
    switch (EscLib.fundEscrow(contracts, tenantId, workspaceId, id, caller)) {
      case (?(c, updated)) { #ok((c, updated)) };
      case null { #err("Cannot fund: contract not found, wrong status, or unauthorized") };
    };
  };

  public func releaseEscrow(
    contracts : [(Common.EntityId, EscTypes.EscrowContract)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { #ok : (EscTypes.EscrowContract, [(Common.EntityId, EscTypes.EscrowContract)]); #err : Text } {
    switch (EscLib.releaseEscrow(contracts, tenantId, workspaceId, id, caller)) {
      case (?(c, updated)) { #ok((c, updated)) };
      case null { #err("Cannot release: contract not found, wrong status, or unauthorized") };
    };
  };

  public func disputeEscrow(
    contracts : [(Common.EntityId, EscTypes.EscrowContract)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { #ok : (EscTypes.EscrowContract, [(Common.EntityId, EscTypes.EscrowContract)]); #err : Text } {
    switch (EscLib.disputeEscrow(contracts, tenantId, workspaceId, id, caller)) {
      case (?(c, updated)) { #ok((c, updated)) };
      case null { #err("Cannot dispute: contract not found, wrong status, or unauthorized") };
    };
  };

  public func cancelEscrow(
    contracts : [(Common.EntityId, EscTypes.EscrowContract)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { #ok : (EscTypes.EscrowContract, [(Common.EntityId, EscTypes.EscrowContract)]); #err : Text } {
    switch (EscLib.cancelEscrow(contracts, tenantId, workspaceId, id, caller)) {
      case (?(c, updated)) { #ok((c, updated)) };
      case null { #err("Cannot cancel: contract not found, wrong status, or unauthorized") };
    };
  };

  // ── Milestones ────────────────────────────────────────────────────────────────

  public func addEscrowMilestone(
    milestones : [(Common.EntityId, EscTypes.EscrowMilestone)],
    idCounter : Nat,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    escrowId : Common.EntityId,
    input : EscTypes.EscrowMilestoneInput,
  ) : { #ok : (EscTypes.EscrowMilestone, [(Common.EntityId, EscTypes.EscrowMilestone)], Nat); #err : Text } {
    let newCounter = idCounter + 1;
    let (m, updated) = EscLib.addEscrowMilestone(milestones, tenantId, workspaceId, escrowId, input, newCounter);
    #ok((m, updated, newCounter));
  };

  public func updateEscrowMilestone(
    milestones : [(Common.EntityId, EscTypes.EscrowMilestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    milestoneId : Common.EntityId,
    input : EscTypes.EscrowMilestoneInput,
  ) : { #ok : (EscTypes.EscrowMilestone, [(Common.EntityId, EscTypes.EscrowMilestone)]); #err : Text } {
    switch (EscLib.updateEscrowMilestone(milestones, tenantId, workspaceId, milestoneId, input)) {
      case (?(m, updated)) { #ok((m, updated)) };
      case null { #err("Milestone not found") };
    };
  };

  public func approveMilestone(
    milestones : [(Common.EntityId, EscTypes.EscrowMilestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    milestoneId : Common.EntityId,
  ) : { #ok : (EscTypes.EscrowMilestone, [(Common.EntityId, EscTypes.EscrowMilestone)]); #err : Text } {
    switch (EscLib.approveMilestone(milestones, tenantId, workspaceId, milestoneId)) {
      case (?(m, updated)) { #ok((m, updated)) };
      case null { #err("Milestone not found or already approved") };
    };
  };

  public func releaseMilestoneFunds(
    milestones : [(Common.EntityId, EscTypes.EscrowMilestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    milestoneId : Common.EntityId,
  ) : { #ok : (EscTypes.EscrowMilestone, [(Common.EntityId, EscTypes.EscrowMilestone)]); #err : Text } {
    switch (EscLib.releaseMilestoneFunds(milestones, tenantId, workspaceId, milestoneId)) {
      case (?(m, updated)) { #ok((m, updated)) };
      case null { #err("Milestone not found or not approved") };
    };
  };

  public func listEscrowMilestones(
    milestones : [(Common.EntityId, EscTypes.EscrowMilestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    escrowId : Common.EntityId,
  ) : [EscTypes.EscrowMilestone] {
    EscLib.listEscrowMilestones(milestones, tenantId, workspaceId, escrowId);
  };

  // ── Disputes ──────────────────────────────────────────────────────────────────

  public func raiseEscrowDispute(
    disputes : [(Common.EntityId, EscTypes.EscrowDispute)],
    idCounter : Nat,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    escrowId : Common.EntityId,
    caller : Principal,
    reason : Text,
  ) : { #ok : (EscTypes.EscrowDispute, [(Common.EntityId, EscTypes.EscrowDispute)], Nat); #err : Text } {
    let newCounter = idCounter + 1;
    let (d, updated) = EscLib.raiseEscrowDispute(disputes, tenantId, workspaceId, escrowId, caller, reason, newCounter);
    #ok((d, updated, newCounter));
  };

  public func assignArbiter(
    disputes : [(Common.EntityId, EscTypes.EscrowDispute)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    disputeId : Common.EntityId,
    arbiter : Principal,
  ) : { #ok : (EscTypes.EscrowDispute, [(Common.EntityId, EscTypes.EscrowDispute)]); #err : Text } {
    switch (EscLib.assignArbiter(disputes, tenantId, workspaceId, disputeId, arbiter)) {
      case (?(d, updated)) { #ok((d, updated)) };
      case null { #err("Dispute not found or already resolved") };
    };
  };

  public func resolveDispute(
    disputes : [(Common.EntityId, EscTypes.EscrowDispute)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    disputeId : Common.EntityId,
    resolution : Text,
  ) : { #ok : (EscTypes.EscrowDispute, [(Common.EntityId, EscTypes.EscrowDispute)]); #err : Text } {
    switch (EscLib.resolveDispute(disputes, tenantId, workspaceId, disputeId, resolution)) {
      case (?(d, updated)) { #ok((d, updated)) };
      case null { #err("Dispute not found or already resolved") };
    };
  };

  public func getEscrowDispute(
    disputes : [(Common.EntityId, EscTypes.EscrowDispute)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    disputeId : Common.EntityId,
  ) : { #ok : EscTypes.EscrowDispute; #err : Text } {
    switch (EscLib.getEscrowDispute(disputes, tenantId, workspaceId, disputeId)) {
      case (?d) { #ok(d) };
      case null { #err("Dispute not found") };
    };
  };

  public func listEscrowDisputes(
    disputes : [(Common.EntityId, EscTypes.EscrowDispute)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    escrowId : Common.EntityId,
  ) : [EscTypes.EscrowDispute] {
    EscLib.listEscrowDisputes(disputes, tenantId, workspaceId, escrowId);
  };

  // ── Summary ───────────────────────────────────────────────────────────────────

  public func depositEscrow(
    contracts : [(Common.EntityId, EscTypes.EscrowContract)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    fundedAmount : Nat,
    blockHeight : Nat,
  ) : { #ok : (EscTypes.EscrowContract, [(Common.EntityId, EscTypes.EscrowContract)]); #err : Text } {
    switch (EscLib.recordEscrowDeposit(contracts, tenantId, workspaceId, id, caller, fundedAmount, blockHeight)) {
      case (?(c, updated)) { #ok((c, updated)) };
      case null { #err("Cannot deposit: contract not found, wrong status (#Pending required), or caller is not payer") };
    };
  };

  public func getEscrowSummary(
    contracts : [(Common.EntityId, EscTypes.EscrowContract)],
    milestones : [(Common.EntityId, EscTypes.EscrowMilestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { #ok : EscTypes.EscrowSummary; #err : Text } {
    switch (EscLib.getEscrowSummary(contracts, milestones, tenantId, workspaceId, id)) {
      case (?s) { #ok(s) };
      case null { #err("Escrow contract not found") };
    };
  };
};
