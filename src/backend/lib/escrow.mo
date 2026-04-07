import Time "mo:core/Time";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Types "../types/escrow";
import Common "../types/common";

module {

  // ── ID generation ─────────────────────────────────────────────────────────────
  public func genId(counter : Nat) : Common.EntityId {
    "esc-" # counter.toText();
  };

  // ── Escrow lifecycle ──────────────────────────────────────────────────────────
  public func createEscrow(
    contracts : [(Common.EntityId, Types.EscrowContract)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
    input : Types.EscrowInput,
    id : Common.EntityId,
  ) : (Types.EscrowContract, [(Common.EntityId, Types.EscrowContract)]) {
    let now = Time.now();
    let contract : Types.EscrowContract = {
      id;
      tenantId;
      title = input.title;
      description = input.description;
      amount = input.amount;
      currency = input.currency;
      payerId = caller;
      payeeId = input.payeeId;
      status = #Pending;
      conditions = input.conditions;
      dueDate = input.dueDate;
      crossLinks = input.crossLinks;
      createdAt = now;
      updatedAt = now;
    };
    let updated = contracts.concat([(id, contract)]);
    (contract, updated);
  };

  public func getEscrow(
    contracts : [(Common.EntityId, Types.EscrowContract)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
  ) : ?Types.EscrowContract {
    let found = contracts.find(
      func((k, v)) { k == id and v.tenantId == tenantId },
    );
    switch (found) {
      case (?(_, c)) { ?c };
      case null { null };
    };
  };

  public func listEscrows(
    contracts : [(Common.EntityId, Types.EscrowContract)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
  ) : [Types.EscrowContract] {
    let filtered = contracts.filter(
      func((_, c)) {
        c.tenantId == tenantId and (c.payerId == caller or c.payeeId == caller);
      },
    );
    filtered.map<(Common.EntityId, Types.EscrowContract), Types.EscrowContract>(
      func((_, c)) { c },
    );
  };

  // ── Transition helpers ────────────────────────────────────────────────────────

  func applyTransition(
    contracts : [(Common.EntityId, Types.EscrowContract)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
    checkAccess : (Types.EscrowContract) -> Bool,
    checkStatus : (Types.EscrowContract) -> Bool,
    newStatus : Types.EscrowStatus,
  ) : ?(Types.EscrowContract, [(Common.EntityId, Types.EscrowContract)]) {
    let now = Time.now();
    var found = false;
    var result : ?Types.EscrowContract = null;

    let updated = contracts.map(
      func((k, c)) {
        if (k == id and c.tenantId == tenantId and checkAccess(c) and checkStatus(c)) {
          found := true;
          let newC : Types.EscrowContract = { c with status = newStatus; updatedAt = now };
          result := ?newC;
          (k, newC);
        } else {
          (k, c);
        };
      },
    );

    if (found) {
      switch (result) {
        case (?c) { ?(c, updated) };
        case null { null };
      };
    } else {
      null;
    };
  };

  // Payer funds: #Pending -> #Funded
  public func fundEscrow(
    contracts : [(Common.EntityId, Types.EscrowContract)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : ?(Types.EscrowContract, [(Common.EntityId, Types.EscrowContract)]) {
    applyTransition(
      contracts, tenantId, id, caller,
      func(c) { c.payerId == caller },
      func(c) { c.status == #Pending },
      #Funded,
    );
  };

  // Payee releases: #Funded -> #Released
  public func releaseEscrow(
    contracts : [(Common.EntityId, Types.EscrowContract)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : ?(Types.EscrowContract, [(Common.EntityId, Types.EscrowContract)]) {
    applyTransition(
      contracts, tenantId, id, caller,
      func(c) { c.payeeId == caller },
      func(c) { c.status == #Funded },
      #Released,
    );
  };

  // Either party disputes: #Funded -> #Disputed
  public func disputeEscrow(
    contracts : [(Common.EntityId, Types.EscrowContract)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : ?(Types.EscrowContract, [(Common.EntityId, Types.EscrowContract)]) {
    applyTransition(
      contracts, tenantId, id, caller,
      func(c) { c.payerId == caller or c.payeeId == caller },
      func(c) { c.status == #Funded },
      #Disputed,
    );
  };

  // Payer cancels: #Pending -> #Cancelled
  public func cancelEscrow(
    contracts : [(Common.EntityId, Types.EscrowContract)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : ?(Types.EscrowContract, [(Common.EntityId, Types.EscrowContract)]) {
    applyTransition(
      contracts, tenantId, id, caller,
      func(c) { c.payerId == caller },
      func(c) { c.status == #Pending },
      #Cancelled,
    );
  };
};
