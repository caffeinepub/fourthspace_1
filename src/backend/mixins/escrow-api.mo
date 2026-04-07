import Common "../types/common";
import EscTypes "../types/escrow";
import EscLib "../lib/escrow";

module {

  public func createEscrow(
    contracts : [(Common.EntityId, EscTypes.EscrowContract)],
    idCounter : Nat,
    tenantId : Common.TenantId,
    caller : Common.UserId,
    input : EscTypes.EscrowInput,
  ) : { #ok : (EscTypes.EscrowContract, [(Common.EntityId, EscTypes.EscrowContract)], Nat); #err : Text } {
    let newCounter = idCounter + 1;
    let id = EscLib.genId(newCounter);
    let (contract, updated) = EscLib.createEscrow(contracts, tenantId, caller, input, id);
    #ok((contract, updated, newCounter));
  };

  public func getEscrow(
    contracts : [(Common.EntityId, EscTypes.EscrowContract)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
  ) : { #ok : EscTypes.EscrowContract; #err : Text } {
    switch (EscLib.getEscrow(contracts, tenantId, id)) {
      case (?c) { #ok(c) };
      case null { #err("Escrow contract not found") };
    };
  };

  public func listEscrows(
    contracts : [(Common.EntityId, EscTypes.EscrowContract)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
  ) : [EscTypes.EscrowContract] {
    EscLib.listEscrows(contracts, tenantId, caller);
  };

  public func fundEscrow(
    contracts : [(Common.EntityId, EscTypes.EscrowContract)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { #ok : (EscTypes.EscrowContract, [(Common.EntityId, EscTypes.EscrowContract)]); #err : Text } {
    switch (EscLib.fundEscrow(contracts, tenantId, id, caller)) {
      case (?(c, updated)) { #ok((c, updated)) };
      case null { #err("Cannot fund: contract not found, wrong status, or unauthorized") };
    };
  };

  public func releaseEscrow(
    contracts : [(Common.EntityId, EscTypes.EscrowContract)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { #ok : (EscTypes.EscrowContract, [(Common.EntityId, EscTypes.EscrowContract)]); #err : Text } {
    switch (EscLib.releaseEscrow(contracts, tenantId, id, caller)) {
      case (?(c, updated)) { #ok((c, updated)) };
      case null { #err("Cannot release: contract not found, wrong status, or unauthorized") };
    };
  };

  public func disputeEscrow(
    contracts : [(Common.EntityId, EscTypes.EscrowContract)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { #ok : (EscTypes.EscrowContract, [(Common.EntityId, EscTypes.EscrowContract)]); #err : Text } {
    switch (EscLib.disputeEscrow(contracts, tenantId, id, caller)) {
      case (?(c, updated)) { #ok((c, updated)) };
      case null { #err("Cannot dispute: contract not found, wrong status, or unauthorized") };
    };
  };

  public func cancelEscrow(
    contracts : [(Common.EntityId, EscTypes.EscrowContract)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { #ok : (EscTypes.EscrowContract, [(Common.EntityId, EscTypes.EscrowContract)]); #err : Text } {
    switch (EscLib.cancelEscrow(contracts, tenantId, id, caller)) {
      case (?(c, updated)) { #ok((c, updated)) };
      case null { #err("Cannot cancel: contract not found, wrong status, or unauthorized") };
    };
  };
};
