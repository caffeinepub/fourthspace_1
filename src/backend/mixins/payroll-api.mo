import Common "../types/common";
import PayTypes "../types/payroll";
import PayLib "../lib/payroll";
import Int "mo:core/Int";

module {

  // ── Employee ──────────────────────────────────────────────────────────────────
  public func addEmployee(
    employees : [(Common.EntityId, PayTypes.Employee)],
    idCounter : Nat,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : PayTypes.EmployeeInput,
  ) : { #ok : (PayTypes.Employee, [(Common.EntityId, PayTypes.Employee)], Nat); #err : Text } {
    let newCounter = idCounter + 1;
    let id = PayLib.genId("pay", newCounter);
    let (emp, updated) = PayLib.addEmployee(employees, tenantId, workspaceId, caller, input, id);
    #ok((emp, updated, newCounter));
  };

  public func getEmployee(
    employees : [(Common.EntityId, PayTypes.Employee)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { #ok : PayTypes.Employee; #err : Text } {
    switch (PayLib.getEmployee(employees, tenantId, workspaceId, id)) {
      case (?emp) { #ok(emp) };
      case null { #err("Employee not found") };
    };
  };

  public func listEmployees(
    employees : [(Common.EntityId, PayTypes.Employee)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [PayTypes.Employee] {
    PayLib.listEmployees(employees, tenantId, workspaceId);
  };

  public func updateEmployee(
    employees : [(Common.EntityId, PayTypes.Employee)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : PayTypes.EmployeeInput,
  ) : { #ok : (PayTypes.Employee, [(Common.EntityId, PayTypes.Employee)]); #err : Text } {
    switch (PayLib.updateEmployee(employees, tenantId, workspaceId, id, caller, input)) {
      case (?(emp, updated)) { #ok((emp, updated)) };
      case null { #err("Employee not found") };
    };
  };

  public func deactivateEmployee(
    employees : [(Common.EntityId, PayTypes.Employee)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { #ok : (PayTypes.Employee, [(Common.EntityId, PayTypes.Employee)]); #err : Text } {
    switch (PayLib.deactivateEmployee(employees, tenantId, workspaceId, id, caller)) {
      case (?(emp, updated)) { #ok((emp, updated)) };
      case null { #err("Employee not found") };
    };
  };

  // ── Payroll Processing ────────────────────────────────────────────────────────
  public func processPayroll(
    employees : [(Common.EntityId, PayTypes.Employee)],
    payrollRecords : [(Common.EntityId, PayTypes.PayrollRecord)],
    deductions : [(Common.EntityId, PayTypes.Deduction)],
    payStubs : [(Common.EntityId, PayTypes.PayStub)],
    auditLog : [(Common.EntityId, PayTypes.AuditLogEntry)],
    idCounter : Nat,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    employeeId : Common.EntityId,
    period : Text,
    treasuryBalance : Nat,
  ) : {
    #ok : (
      PayTypes.PayrollRecord,
      [(Common.EntityId, PayTypes.PayrollRecord)],
      [(Common.EntityId, PayTypes.PayStub)],
      [(Common.EntityId, PayTypes.AuditLogEntry)],
      Nat,
    );
    #err : Text;
  } {
    // Balance gate: check BEFORE any state changes (state-before-transfer principle)
    let empOpt = PayLib.getEmployee(employees, tenantId, workspaceId, employeeId);
    switch (empOpt) {
      case null { return #err("Employee not found or inactive") };
      case (?emp) {
        if (not emp.isActive) { return #err("Employee not found or inactive") };
        // Estimate gross pay to validate treasury has enough funds
        let cycles : Float = switch (emp.payFrequency) {
          case (#Weekly) 52.0; case (#BiWeekly) 26.0; case (#SemiMonthly) 24.0;
          case (#Monthly) 12.0; case (#Quarterly) 4.0;
        };
        let estimatedNet = emp.salary.toFloat() / cycles;
        let estimatedNetNat = if (estimatedNet > 0.0) { Int.abs(estimatedNet.toInt()) } else { 0 };
        if (treasuryBalance < estimatedNetNat) {
          return #err("Insufficient treasury balance. Please fund your workspace wallet before processing payroll.");
        };
      };
    };
    var counter = idCounter + 1;
    let recordId = PayLib.genRecordId(counter);
    switch (PayLib.processPayroll(employees, payrollRecords, deductions, tenantId, workspaceId, caller, employeeId, period, recordId)) {
      case null { #err("Employee not found or inactive") };
      case (?(rec, updatedRecords)) {
        counter := counter + 1;
        let stubId = PayLib.genId("stub", counter);
        let (_, updatedStubs) = PayLib.generatePayStub(payStubs, tenantId, workspaceId, rec, stubId);
        counter := counter + 1;
        let auditId = PayLib.genId("audit", counter);
        let (_, updatedAudit) = PayLib.addAuditLogEntry(
          auditLog, tenantId, workspaceId, "PROCESS_PAYROLL", "PayrollRecord", recordId, caller,
          "Payroll processed for employee " # employeeId # " period " # period, auditId,
        );
        #ok((rec, updatedRecords, updatedStubs, updatedAudit, counter));
      };
    };
  };

  public func listPayrollRecords(
    payrollRecords : [(Common.EntityId, PayTypes.PayrollRecord)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    employeeId : ?Common.EntityId,
  ) : [PayTypes.PayrollRecord] {
    PayLib.listPayrollRecords(payrollRecords, tenantId, workspaceId, employeeId);
  };

  public func bulkApprovePayroll(
    payrollRecords : [(Common.EntityId, PayTypes.PayrollRecord)],
    auditLog : [(Common.EntityId, PayTypes.AuditLogEntry)],
    idCounter : Nat,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    recordIds : [Common.EntityId],
    treasuryBalance : Nat,
  ) : {
    #ok : (
      [(Common.EntityId, PayTypes.PayrollRecord)],
      [(Common.EntityId, PayTypes.AuditLogEntry)],
      Nat,
    );
    #err : Text;
  } {
    // Sum all pending payment amounts BEFORE any state changes (state-before-transfer principle)
    var totalAmount : Nat = 0;
    for (rid in recordIds.vals()) {
      let maybeRec = payrollRecords.find(func((k, r)) {
        k == rid and r.tenantId == tenantId and r.workspaceId == workspaceId and r.status == #PendingApproval
      });
      switch (maybeRec) {
        case (?(_, rec)) { totalAmount += rec.amount };
        case null {};
      };
    };
    if (treasuryBalance < totalAmount) {
      return #err("Insufficient treasury balance. Please fund your workspace wallet before processing payroll.");
    };
    let updatedRecords = PayLib.bulkApprovePayroll(payrollRecords, tenantId, workspaceId, recordIds, caller);
    let newCounter = idCounter + 1;
    let auditId = PayLib.genId("audit", newCounter);
    let (_, updatedAudit) = PayLib.addAuditLogEntry(
      auditLog, tenantId, workspaceId, "BULK_APPROVE_PAYROLL", "PayrollRecord", "bulk", caller,
      "Bulk approved " # recordIds.size().toText() # " payroll records", auditId,
    );
    #ok((updatedRecords, updatedAudit, newCounter));
  };

  public func rejectPayrollRecord(
    payrollRecords : [(Common.EntityId, PayTypes.PayrollRecord)],
    auditLog : [(Common.EntityId, PayTypes.AuditLogEntry)],
    idCounter : Nat,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    recordId : Common.EntityId,
    reason : Text,
  ) : {
    #ok : (
      PayTypes.PayrollRecord,
      [(Common.EntityId, PayTypes.PayrollRecord)],
      [(Common.EntityId, PayTypes.AuditLogEntry)],
      Nat,
    );
    #err : Text;
  } {
    switch (PayLib.rejectPayrollRecord(payrollRecords, tenantId, workspaceId, recordId, caller, reason)) {
      case null { #err("Payroll record not found") };
      case (?(rec, updatedRecords)) {
        let newCounter = idCounter + 1;
        let auditId = PayLib.genId("audit", newCounter);
        let (_, updatedAudit) = PayLib.addAuditLogEntry(
          auditLog, tenantId, workspaceId, "REJECT_PAYROLL", "PayrollRecord", recordId, caller,
          "Rejected: " # reason, auditId,
        );
        #ok((rec, updatedRecords, updatedAudit, newCounter));
      };
    };
  };

  // ── Contractors ───────────────────────────────────────────────────────────────
  public func addContractor(
    contractors : [(Common.EntityId, PayTypes.Contractor)],
    idCounter : Nat,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : PayTypes.ContractorInput,
  ) : { #ok : (PayTypes.Contractor, [(Common.EntityId, PayTypes.Contractor)], Nat); #err : Text } {
    let newCounter = idCounter + 1;
    let id = PayLib.genId("ctr", newCounter);
    let (c, updated) = PayLib.addContractor(contractors, tenantId, workspaceId, input, id);
    #ok((c, updated, newCounter));
  };

  public func getContractor(
    contractors : [(Common.EntityId, PayTypes.Contractor)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { #ok : PayTypes.Contractor; #err : Text } {
    switch (PayLib.getContractor(contractors, tenantId, workspaceId, id)) {
      case (?c) { #ok(c) };
      case null { #err("Contractor not found") };
    };
  };

  public func listContractors(
    contractors : [(Common.EntityId, PayTypes.Contractor)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [PayTypes.Contractor] {
    PayLib.listContractors(contractors, tenantId, workspaceId);
  };

  public func updateContractor(
    contractors : [(Common.EntityId, PayTypes.Contractor)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    input : PayTypes.ContractorInput,
  ) : { #ok : (PayTypes.Contractor, [(Common.EntityId, PayTypes.Contractor)]); #err : Text } {
    switch (PayLib.updateContractor(contractors, tenantId, workspaceId, id, input)) {
      case (?(c, updated)) { #ok((c, updated)) };
      case null { #err("Contractor not found") };
    };
  };

  public func addContractorPayment(
    payments : [(Common.EntityId, PayTypes.ContractorPayment)],
    idCounter : Nat,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : PayTypes.ContractorPaymentInput,
  ) : { #ok : (PayTypes.ContractorPayment, [(Common.EntityId, PayTypes.ContractorPayment)], Nat); #err : Text } {
    let newCounter = idCounter + 1;
    let id = PayLib.genId("cpay", newCounter);
    let (p, updated) = PayLib.addContractorPayment(payments, tenantId, workspaceId, input, id);
    #ok((p, updated, newCounter));
  };

  public func listContractorPayments(
    payments : [(Common.EntityId, PayTypes.ContractorPayment)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    contractorId : ?Common.EntityId,
  ) : [PayTypes.ContractorPayment] {
    PayLib.listContractorPayments(payments, tenantId, workspaceId, contractorId);
  };

  // ── Pay Schedules ─────────────────────────────────────────────────────────────
  public func addPaySchedule(
    schedules : [(Common.EntityId, PayTypes.PaySchedule)],
    idCounter : Nat,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : PayTypes.PayScheduleInput,
  ) : { #ok : (PayTypes.PaySchedule, [(Common.EntityId, PayTypes.PaySchedule)], Nat); #err : Text } {
    let newCounter = idCounter + 1;
    let id = PayLib.genId("sched", newCounter);
    let (s, updated) = PayLib.addPaySchedule(schedules, tenantId, workspaceId, input, id);
    #ok((s, updated, newCounter));
  };

  public func listPaySchedules(
    schedules : [(Common.EntityId, PayTypes.PaySchedule)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [PayTypes.PaySchedule] {
    PayLib.listPaySchedules(schedules, tenantId, workspaceId);
  };

  // ── Deductions ────────────────────────────────────────────────────────────────
  public func addDeduction(
    deductions : [(Common.EntityId, PayTypes.Deduction)],
    idCounter : Nat,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : PayTypes.DeductionInput,
  ) : { #ok : (PayTypes.Deduction, [(Common.EntityId, PayTypes.Deduction)], Nat); #err : Text } {
    let newCounter = idCounter + 1;
    let id = PayLib.genId("ded", newCounter);
    let (d, updated) = PayLib.addDeduction(deductions, tenantId, workspaceId, input, id);
    #ok((d, updated, newCounter));
  };

  public func listDeductions(
    deductions : [(Common.EntityId, PayTypes.Deduction)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    employeeId : ?Common.EntityId,
  ) : [PayTypes.Deduction] {
    PayLib.listDeductions(deductions, tenantId, workspaceId, employeeId);
  };

  public func updateDeduction(
    deductions : [(Common.EntityId, PayTypes.Deduction)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    isActive : Bool,
    amount : Float,
  ) : { #ok : (PayTypes.Deduction, [(Common.EntityId, PayTypes.Deduction)]); #err : Text } {
    switch (PayLib.updateDeduction(deductions, tenantId, workspaceId, id, isActive, amount)) {
      case (?(d, updated)) { #ok((d, updated)) };
      case null { #err("Deduction not found") };
    };
  };

  // ── Benefits ──────────────────────────────────────────────────────────────────
  public func addBenefit(
    benefits : [(Common.EntityId, PayTypes.Benefit)],
    idCounter : Nat,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : PayTypes.BenefitInput,
  ) : { #ok : (PayTypes.Benefit, [(Common.EntityId, PayTypes.Benefit)], Nat); #err : Text } {
    let newCounter = idCounter + 1;
    let id = PayLib.genId("ben", newCounter);
    let (b, updated) = PayLib.addBenefit(benefits, tenantId, workspaceId, input, id);
    #ok((b, updated, newCounter));
  };

  public func listBenefits(
    benefits : [(Common.EntityId, PayTypes.Benefit)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    employeeId : ?Common.EntityId,
  ) : [PayTypes.Benefit] {
    PayLib.listBenefits(benefits, tenantId, workspaceId, employeeId);
  };

  // ── Pay Stubs ─────────────────────────────────────────────────────────────────
  public func listPayStubs(
    stubs : [(Common.EntityId, PayTypes.PayStub)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    employeeId : ?Common.EntityId,
  ) : [PayTypes.PayStub] {
    PayLib.listPayStubs(stubs, tenantId, workspaceId, employeeId);
  };

  // ── Off-Cycle Payments ────────────────────────────────────────────────────────
  public func addOffCyclePayment(
    payments : [(Common.EntityId, PayTypes.OffCyclePayment)],
    idCounter : Nat,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : PayTypes.OffCyclePaymentInput,
  ) : { #ok : (PayTypes.OffCyclePayment, [(Common.EntityId, PayTypes.OffCyclePayment)], Nat); #err : Text } {
    let newCounter = idCounter + 1;
    let id = PayLib.genId("ocp", newCounter);
    let (p, updated) = PayLib.addOffCyclePayment(payments, tenantId, workspaceId, input, id);
    #ok((p, updated, newCounter));
  };

  public func listOffCyclePayments(
    payments : [(Common.EntityId, PayTypes.OffCyclePayment)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    employeeId : ?Common.EntityId,
  ) : [PayTypes.OffCyclePayment] {
    PayLib.listOffCyclePayments(payments, tenantId, workspaceId, employeeId);
  };

  // ── Audit Log ─────────────────────────────────────────────────────────────────
  public func listPayrollAuditLog(
    log : [(Common.EntityId, PayTypes.AuditLogEntry)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    limit : Nat,
  ) : [PayTypes.AuditLogEntry] {
    PayLib.listAuditLog(log, tenantId, workspaceId, limit);
  };
};
