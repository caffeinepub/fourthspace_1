import Time "mo:core/Time";
import Types "../types/escrow";
import Common "../types/common";

module {

  // ── ID generation ─────────────────────────────────────────────────────────────
  public func genId(counter : Nat) : Common.EntityId {
    "esc-" # counter.toText();
  };

  func genMilestoneId(counter : Nat) : Common.EntityId {
    "esm-" # counter.toText();
  };

  func genDisputeId(counter : Nat) : Common.EntityId {
    "esd-" # counter.toText();
  };

  // ── Escrow lifecycle ──────────────────────────────────────────────────────────
  public func createEscrow(
    contracts : [(Common.EntityId, Types.EscrowContract)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : Types.EscrowInput,
    id : Common.EntityId,
  ) : (Types.EscrowContract, [(Common.EntityId, Types.EscrowContract)]) {
    let now = Time.now();
    let initialHistory : Types.StatusHistoryEntry = {
      status = #Pending;
      timestamp = now;
      changedBy = caller;
      note = ?"Contract created";
    };
    let contract : Types.EscrowContract = {
      id;
      tenantId;
      workspaceId;
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
      statusHistory = [initialHistory];
      fundedAmount = null;
      fundingBlockHeight = null;
      createdAt = now;
      updatedAt = now;
    };
    let updated = contracts.concat([(id, contract)]);
    (contract, updated);
  };

  public func getEscrow(
    contracts : [(Common.EntityId, Types.EscrowContract)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : ?Types.EscrowContract {
    let found = contracts.find(
      func((k, v)) { k == id and v.tenantId == tenantId and v.workspaceId == workspaceId },
    );
    switch (found) {
      case (?(_, c)) { ?c };
      case null { null };
    };
  };

  public func listEscrows(
    contracts : [(Common.EntityId, Types.EscrowContract)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    filter : ?Types.EscrowFilter,
  ) : [Types.EscrowContract] {
    let filtered = contracts.filter(
      func((_, c)) {
        if (not (c.tenantId == tenantId and c.workspaceId == workspaceId and (c.payerId == caller or c.payeeId == caller))) {
          return false;
        };
        switch (filter) {
          case null true;
          case (?f) {
            let statusOk = switch (f.status) {
              case null true;
              case (?s) { c.status == s };
            };
            let fromOk = switch (f.fromDate) {
              case null true;
              case (?d) { c.createdAt >= d };
            };
            let toOk = switch (f.toDate) {
              case null true;
              case (?d) { c.createdAt <= d };
            };
            statusOk and fromOk and toOk
          };
        };
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
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    checkAccess : (Types.EscrowContract) -> Bool,
    checkStatus : (Types.EscrowContract) -> Bool,
    newStatus : Types.EscrowStatus,
    note : ?Text,
  ) : ?(Types.EscrowContract, [(Common.EntityId, Types.EscrowContract)]) {
    let now = Time.now();
    var found = false;
    var result : ?Types.EscrowContract = null;

    let updated = contracts.map(
      func((k, c)) {
        if (k == id and c.tenantId == tenantId and c.workspaceId == workspaceId and checkAccess(c) and checkStatus(c)) {
          found := true;
          let entry : Types.StatusHistoryEntry = {
            status = newStatus;
            timestamp = now;
            changedBy = caller;
            note;
          };
          let newC : Types.EscrowContract = {
            c with
            status = newStatus;
            statusHistory = c.statusHistory.concat([entry]);
            updatedAt = now
          };
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
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : ?(Types.EscrowContract, [(Common.EntityId, Types.EscrowContract)]) {
    applyTransition(
      contracts, tenantId, workspaceId, id, caller,
      func(c) { c.payerId == caller },
      func(c) { c.status == #Pending },
      #Funded,
      ?"Funded by payer",
    );
  };

  // Payee releases: #Funded -> #Released
  public func releaseEscrow(
    contracts : [(Common.EntityId, Types.EscrowContract)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : ?(Types.EscrowContract, [(Common.EntityId, Types.EscrowContract)]) {
    applyTransition(
      contracts, tenantId, workspaceId, id, caller,
      func(c) { c.payeeId == caller },
      func(c) { c.status == #Funded },
      #Released,
      ?"Released by payee",
    );
  };

  // Either party disputes: #Funded -> #Disputed
  public func disputeEscrow(
    contracts : [(Common.EntityId, Types.EscrowContract)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : ?(Types.EscrowContract, [(Common.EntityId, Types.EscrowContract)]) {
    applyTransition(
      contracts, tenantId, workspaceId, id, caller,
      func(c) { c.payerId == caller or c.payeeId == caller },
      func(c) { c.status == #Funded },
      #Disputed,
      ?"Dispute raised",
    );
  };

  // Payer cancels: #Pending -> #Cancelled
  public func cancelEscrow(
    contracts : [(Common.EntityId, Types.EscrowContract)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : ?(Types.EscrowContract, [(Common.EntityId, Types.EscrowContract)]) {
    applyTransition(
      contracts, tenantId, workspaceId, id, caller,
      func(c) { c.payerId == caller },
      func(c) { c.status == #Pending },
      #Cancelled,
      ?"Cancelled by payer",
    );
  };

  // ── Milestones ────────────────────────────────────────────────────────────────

  public func addEscrowMilestone(
    milestones : [(Common.EntityId, Types.EscrowMilestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    escrowId : Common.EntityId,
    input : Types.EscrowMilestoneInput,
    counter : Nat,
  ) : (Types.EscrowMilestone, [(Common.EntityId, Types.EscrowMilestone)]) {
    let now = Time.now();
    let id = genMilestoneId(counter);
    let milestone : Types.EscrowMilestone = {
      id;
      tenantId;
      workspaceId;
      escrowId;
      title = input.title;
      description = input.description;
      amount = input.amount;
      status = #Pending;
      ledgerBlockHeight = null;
      createdAt = now;
      updatedAt = now;
    };
    let updated = milestones.concat([(id, milestone)]);
    (milestone, updated);
  };

  public func updateEscrowMilestone(
    milestones : [(Common.EntityId, Types.EscrowMilestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    milestoneId : Common.EntityId,
    input : Types.EscrowMilestoneInput,
  ) : ?(Types.EscrowMilestone, [(Common.EntityId, Types.EscrowMilestone)]) {
    let now = Time.now();
    var found = false;
    var result : ?Types.EscrowMilestone = null;
    let updated = milestones.map(
      func((k, m)) {
        if (k == milestoneId and m.tenantId == tenantId and m.workspaceId == workspaceId) {
          found := true;
          let newM : Types.EscrowMilestone = {
            m with
            title = input.title;
            description = input.description;
            amount = input.amount;
            updatedAt = now;
          };
          result := ?newM;
          (k, newM);
        } else { (k, m) };
      },
    );
    if (found) {
      switch (result) {
        case (?m) { ?(m, updated) };
        case null { null };
      };
    } else { null };
  };

  public func approveMilestone(
    milestones : [(Common.EntityId, Types.EscrowMilestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    milestoneId : Common.EntityId,
  ) : ?(Types.EscrowMilestone, [(Common.EntityId, Types.EscrowMilestone)]) {
    let now = Time.now();
    var found = false;
    var result : ?Types.EscrowMilestone = null;
    let updated = milestones.map(
      func((k, m)) {
        if (k == milestoneId and m.tenantId == tenantId and m.workspaceId == workspaceId and m.status == #Pending) {
          found := true;
          let newM : Types.EscrowMilestone = { m with status = #Approved; updatedAt = now };
          result := ?newM;
          (k, newM);
        } else { (k, m) };
      },
    );
    if (found) {
      switch (result) {
        case (?m) { ?(m, updated) };
        case null { null };
      };
    } else { null };
  };

  /// Set milestone to #Releasing (state-before-transfer): marks that the ledger call is in-flight.
  /// Only transitions from #Approved. Must be called BEFORE the ledger transfer call.
  public func setMilestoneReleasing(
    milestones : [(Common.EntityId, Types.EscrowMilestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    milestoneId : Common.EntityId,
  ) : ?(Types.EscrowMilestone, [(Common.EntityId, Types.EscrowMilestone)]) {
    let now = Time.now();
    var found = false;
    var result : ?Types.EscrowMilestone = null;
    let updated = milestones.map(
      func((k, m)) {
        if (k == milestoneId and m.tenantId == tenantId and m.workspaceId == workspaceId and m.status == #Approved) {
          found := true;
          let newM : Types.EscrowMilestone = { m with status = #Releasing; updatedAt = now };
          result := ?newM;
          (k, newM);
        } else { (k, m) };
      },
    );
    if (found) {
      switch (result) {
        case (?m) { ?(m, updated) };
        case null { null };
      };
    } else { null };
  };

  /// Revert milestone from #Releasing back to #Approved when ledger call fails.
  public func revertMilestoneReleasing(
    milestones : [(Common.EntityId, Types.EscrowMilestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    milestoneId : Common.EntityId,
  ) : [(Common.EntityId, Types.EscrowMilestone)] {
    let now = Time.now();
    milestones.map(
      func((k, m)) {
        if (k == milestoneId and m.tenantId == tenantId and m.workspaceId == workspaceId and m.status == #Releasing) {
          (k, { m with status = #Approved; updatedAt = now })
        } else { (k, m) };
      },
    );
  };

  public func releaseMilestoneFunds(
    milestones : [(Common.EntityId, Types.EscrowMilestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    milestoneId : Common.EntityId,
  ) : ?(Types.EscrowMilestone, [(Common.EntityId, Types.EscrowMilestone)]) {
    let now = Time.now();
    var found = false;
    var result : ?Types.EscrowMilestone = null;
    let updated = milestones.map(
      func((k, m)) {
        // Accept #Releasing (state-before-transfer path) OR #Approved (legacy direct path)
        let eligible = m.status == #Releasing or m.status == #Approved;
        if (k == milestoneId and m.tenantId == tenantId and m.workspaceId == workspaceId and eligible) {
          found := true;
          let newM : Types.EscrowMilestone = { m with status = #Released; ledgerBlockHeight = null; updatedAt = now };
          result := ?newM;
          (k, newM);
        } else { (k, m) };
      },
    );
    if (found) {
      switch (result) {
        case (?m) { ?(m, updated) };
        case null { null };
      };
    } else { null };
  };

  /// Release milestone funds and record the ledger block height from a real ICP transfer.
  /// Requires #Releasing status (set by setMilestoneReleasing before the ledger call).
  public func releaseMilestoneFundsWithBlock(
    milestones : [(Common.EntityId, Types.EscrowMilestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    milestoneId : Common.EntityId,
    blockHeight : Nat,
  ) : ?(Types.EscrowMilestone, [(Common.EntityId, Types.EscrowMilestone)]) {
    let now = Time.now();
    var found = false;
    var result : ?Types.EscrowMilestone = null;
    let updated = milestones.map(
      func((k, m)) {
        // Accept #Releasing (normal state-before-transfer path) or #Approved (legacy)
        let eligible = m.status == #Releasing or m.status == #Approved;
        if (k == milestoneId and m.tenantId == tenantId and m.workspaceId == workspaceId and eligible) {
          found := true;
          let newM : Types.EscrowMilestone = {
            m with
            status = #Released;
            ledgerBlockHeight = ?blockHeight;
            updatedAt = now;
          };
          result := ?newM;
          (k, newM);
        } else { (k, m) };
      },
    );
    if (found) {
      switch (result) {
        case (?m) { ?(m, updated) };
        case null { null };
      };
    } else { null };
  };

  /// Get a milestone by ID for use in release operations.
  public func getMilestone(
    milestones : [(Common.EntityId, Types.EscrowMilestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    milestoneId : Common.EntityId,
  ) : ?Types.EscrowMilestone {
    let found = milestones.find(
      func((k, m)) { k == milestoneId and m.tenantId == tenantId and m.workspaceId == workspaceId },
    );
    switch (found) {
      case (?(_, m)) ?m;
      case null null;
    };
  };

  public func listEscrowMilestones(
    milestones : [(Common.EntityId, Types.EscrowMilestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    escrowId : Common.EntityId,
  ) : [Types.EscrowMilestone] {
    milestones.filter(
      func((_, m)) { m.tenantId == tenantId and m.workspaceId == workspaceId and m.escrowId == escrowId },
    ).map<(Common.EntityId, Types.EscrowMilestone), Types.EscrowMilestone>(
      func((_, m)) { m },
    );
  };

  // ── Disputes ──────────────────────────────────────────────────────────────────

  public func raiseEscrowDispute(
    disputes : [(Common.EntityId, Types.EscrowDispute)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    escrowId : Common.EntityId,
    caller : Principal,
    reason : Text,
    counter : Nat,
  ) : (Types.EscrowDispute, [(Common.EntityId, Types.EscrowDispute)]) {
    let now = Time.now();
    let id = genDisputeId(counter);
    let dispute : Types.EscrowDispute = {
      id;
      tenantId;
      workspaceId;
      escrowId;
      raisedBy = caller;
      reason;
      arbiter = null;
      resolution = null;
      status = #Open;
      createdAt = now;
      updatedAt = now;
    };
    let updated = disputes.concat([(id, dispute)]);
    (dispute, updated);
  };

  public func assignArbiter(
    disputes : [(Common.EntityId, Types.EscrowDispute)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    disputeId : Common.EntityId,
    arbiter : Principal,
  ) : ?(Types.EscrowDispute, [(Common.EntityId, Types.EscrowDispute)]) {
    let now = Time.now();
    var found = false;
    var result : ?Types.EscrowDispute = null;
    let updated = disputes.map(
      func((k, d)) {
        if (k == disputeId and d.tenantId == tenantId and d.workspaceId == workspaceId and d.status == #Open) {
          found := true;
          let newD : Types.EscrowDispute = { d with arbiter = ?arbiter; updatedAt = now };
          result := ?newD;
          (k, newD);
        } else { (k, d) };
      },
    );
    if (found) {
      switch (result) {
        case (?d) { ?(d, updated) };
        case null { null };
      };
    } else { null };
  };

  public func resolveDispute(
    disputes : [(Common.EntityId, Types.EscrowDispute)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    disputeId : Common.EntityId,
    resolution : Text,
  ) : ?(Types.EscrowDispute, [(Common.EntityId, Types.EscrowDispute)]) {
    let now = Time.now();
    var found = false;
    var result : ?Types.EscrowDispute = null;
    let updated = disputes.map(
      func((k, d)) {
        if (k == disputeId and d.tenantId == tenantId and d.workspaceId == workspaceId and d.status == #Open) {
          found := true;
          let newD : Types.EscrowDispute = {
            d with
            resolution = ?resolution;
            status = #Resolved;
            updatedAt = now;
          };
          result := ?newD;
          (k, newD);
        } else { (k, d) };
      },
    );
    if (found) {
      switch (result) {
        case (?d) { ?(d, updated) };
        case null { null };
      };
    } else { null };
  };

  public func getEscrowDispute(
    disputes : [(Common.EntityId, Types.EscrowDispute)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    disputeId : Common.EntityId,
  ) : ?Types.EscrowDispute {
    let found = disputes.find(
      func((k, d)) { k == disputeId and d.tenantId == tenantId and d.workspaceId == workspaceId },
    );
    switch (found) {
      case (?(_, d)) { ?d };
      case null { null };
    };
  };

  public func listEscrowDisputes(
    disputes : [(Common.EntityId, Types.EscrowDispute)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    escrowId : Common.EntityId,
  ) : [Types.EscrowDispute] {
    disputes.filter(
      func((_, d)) { d.tenantId == tenantId and d.workspaceId == workspaceId and d.escrowId == escrowId },
    ).map<(Common.EntityId, Types.EscrowDispute), Types.EscrowDispute>(
      func((_, d)) { d },
    );
  };

  // ── Summary ───────────────────────────────────────────────────────────────────

  /// Record a successful on-chain deposit: set status to #Funded, store funded amount and block height.
  /// Called by main.mo AFTER icrc2_transfer_from succeeds (Protection 3: ICRC-2 approve/transfer_from).
  public func recordEscrowDeposit(
    contracts : [(Common.EntityId, Types.EscrowContract)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    fundedAmount : Nat,
    blockHeight : Nat,
  ) : ?(Types.EscrowContract, [(Common.EntityId, Types.EscrowContract)]) {
    let now = Time.now();
    var found = false;
    var result : ?Types.EscrowContract = null;
    let updated = contracts.map(
      func((k, c)) {
        if (k == id and c.tenantId == tenantId and c.workspaceId == workspaceId and c.payerId == caller and c.status == #Pending) {
          found := true;
          let entry : Types.StatusHistoryEntry = {
            status = #Funded;
            timestamp = now;
            changedBy = caller;
            note = ?"Funded via ICRC-2 on-chain deposit";
          };
          let newC : Types.EscrowContract = {
            c with
            status = #Funded;
            fundedAmount = ?fundedAmount;
            fundingBlockHeight = ?blockHeight;
            statusHistory = c.statusHistory.concat([entry]);
            updatedAt = now;
          };
          result := ?newC;
          (k, newC);
        } else { (k, c) };
      },
    );
    if (found) {
      switch (result) {
        case (?c) { ?(c, updated) };
        case null { null };
      };
    } else { null };
  };

  public func getEscrowSummary(
    contracts : [(Common.EntityId, Types.EscrowContract)],
    milestones : [(Common.EntityId, Types.EscrowMilestone)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : ?Types.EscrowSummary {
    switch (getEscrow(contracts, tenantId, workspaceId, id)) {
      case null { null };
      case (?c) {
        let mCount = milestones.filter(
          func((_, m)) { m.escrowId == id and m.tenantId == tenantId and m.workspaceId == workspaceId },
        ).size();
        ?{
          id = c.id;
          title = c.title;
          payerId = c.payerId.toText();
          payeeId = c.payeeId.toText();
          amount = c.amount;
          currency = c.currency;
          status = c.status;
          conditions = c.conditions;
          milestoneCount = mCount;
          statusHistory = c.statusHistory;
          createdAt = c.createdAt;
        };
      };
    };
  };
};
