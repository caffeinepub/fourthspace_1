import Time "mo:core/Time";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Types "../types/payroll";
import Common "../types/common";

module {

  // ── ID generation ─────────────────────────────────────────────────────────────
  public func genId(prefix : Text, counter : Nat) : Common.EntityId {
    prefix # "-" # counter.toText();
  };

  public func genRecordId(counter : Nat) : Common.EntityId {
    "prec-" # counter.toText();
  };

  // ── Helper: pay cycles per year ───────────────────────────────────────────────
  func payCyclesPerYear(freq : Common.PayFrequency) : Float {
    switch freq {
      case (#Weekly) 52.0;
      case (#BiWeekly) 26.0;
      case (#SemiMonthly) 24.0;
      case (#Monthly) 12.0;
      case (#Quarterly) 4.0;
    };
  };

  // ── Employee CRUD ─────────────────────────────────────────────────────────────
  public func addEmployee(
    employees : [(Common.EntityId, Types.Employee)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : Types.EmployeeInput,
    id : Common.EntityId,
  ) : (Types.Employee, [(Common.EntityId, Types.Employee)]) {
    let now = Time.now();
    let emp : Types.Employee = {
      id;
      tenantId;
      workspaceId;
      userId = input.userId;
      firstName = input.firstName;
      lastName = input.lastName;
      email = input.email;
      salary = input.salary;
      currency = input.currency;
      payFrequency = input.payFrequency;
      taxRate = input.taxRate;
      startDate = input.startDate;
      isActive = true;
      contractorFlag = input.contractorFlag;
      payScheduleId = input.payScheduleId;
      timeZone = input.timeZone;
      createdAt = now;
    };
    let updated = employees.concat([(id, emp)]);
    (emp, updated);
  };

  public func getEmployee(
    employees : [(Common.EntityId, Types.Employee)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : ?Types.Employee {
    let found = employees.find(
      func((k, v)) { k == id and v.tenantId == tenantId and v.workspaceId == workspaceId },
    );
    switch (found) {
      case (?(_, emp)) { ?emp };
      case null { null };
    };
  };

  public func listEmployees(
    employees : [(Common.EntityId, Types.Employee)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.Employee] {
    let filtered = employees.filter(
      func((_, emp)) { emp.tenantId == tenantId and emp.workspaceId == workspaceId },
    );
    filtered.map<(Common.EntityId, Types.Employee), Types.Employee>(
      func((_, emp)) { emp },
    );
  };

  public func updateEmployee(
    employees : [(Common.EntityId, Types.Employee)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : Types.EmployeeInput,
  ) : ?(Types.Employee, [(Common.EntityId, Types.Employee)]) {
    var found = false;
    var result : ?Types.Employee = null;
    let updated = employees.map(
      func((k, emp)) {
        if (k == id and emp.tenantId == tenantId and emp.workspaceId == workspaceId) {
          found := true;
          let newEmp : Types.Employee = {
            emp with
            userId = input.userId;
            firstName = input.firstName;
            lastName = input.lastName;
            email = input.email;
            salary = input.salary;
            currency = input.currency;
            payFrequency = input.payFrequency;
            taxRate = input.taxRate;
            startDate = input.startDate;
            contractorFlag = input.contractorFlag;
            payScheduleId = input.payScheduleId;
            timeZone = input.timeZone;
          };
          result := ?newEmp;
          (k, newEmp);
        } else {
          (k, emp);
        };
      },
    );
    if (found) {
      switch (result) {
        case (?emp) { ?(emp, updated) };
        case null { null };
      };
    } else {
      null;
    };
  };

  public func deactivateEmployee(
    employees : [(Common.EntityId, Types.Employee)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : ?(Types.Employee, [(Common.EntityId, Types.Employee)]) {
    var found = false;
    var result : ?Types.Employee = null;
    let updated = employees.map(
      func((k, emp)) {
        if (k == id and emp.tenantId == tenantId and emp.workspaceId == workspaceId) {
          found := true;
          let newEmp : Types.Employee = { emp with isActive = false };
          result := ?newEmp;
          (k, newEmp);
        } else {
          (k, emp);
        };
      },
    );
    if (found) {
      switch (result) {
        case (?emp) { ?(emp, updated) };
        case null { null };
      };
    } else {
      null;
    };
  };

  // ── Payroll Processing ────────────────────────────────────────────────────────
  // Balance gating is enforced in payroll-api.mo and main.mo BEFORE calling this:
  // users/admins with zero treasury balance are blocked with:
  // "Insufficient treasury balance. Please fund the workspace treasury before processing payroll."
  //
  // Gross-to-net: grossPay = salary / payCyclesPerYear
  // taxDeduction = grossPay * (taxRate / 100)
  // otherDeductions = sum of active pre-tax deductions (perRun amounts + annual/cycles)
  // netPay = grossPay - taxDeduction - otherDeductions
  public func processPayroll(
    employees : [(Common.EntityId, Types.Employee)],
    records : [(Common.EntityId, Types.PayrollRecord)],
    deductions : [(Common.EntityId, Types.Deduction)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    employeeId : Common.EntityId,
    period : Text,
    recordId : Common.EntityId,
  ) : ?(Types.PayrollRecord, [(Common.EntityId, Types.PayrollRecord)]) {
    let empOpt = getEmployee(employees, tenantId, workspaceId, employeeId);
    switch (empOpt) {
      case null { null };
      case (?emp) {
        if (not emp.isActive) { return null };
        let now = Time.now();
        let cycles = payCyclesPerYear(emp.payFrequency);
        let grossPay = emp.salary.toFloat() / cycles;
        let taxDeduction = grossPay * (emp.taxRate.toFloat() / 100.0);
        // Sum active pre-tax deductions for this employee
        let empDeductions = deductions.filter(
          func((_, d)) {
            d.tenantId == tenantId and d.workspaceId == workspaceId and d.employeeId == employeeId and d.isActive and d.deductionType == #preTax
          },
        );
        let otherDeductions = empDeductions.foldLeft(
          0.0,
          func(acc : Float, (_, d) : (Common.EntityId, Types.Deduction)) : Float {
            let amt = switch (d.frequency) {
              case (#perRun) { d.amount };
              case (#annual) { d.amount / cycles };
            };
            acc + amt;
          },
        );
        let netPay = grossPay - taxDeduction - otherDeductions;
        let rec : Types.PayrollRecord = {
          id = recordId;
          tenantId;
          workspaceId;
          employeeId;
          amount = if (netPay > 0.0) { Int.abs(netPay.toInt()) } else { 0 };
          currency = emp.currency;
          period;
          status = #PendingApproval;
          processedAt = null;
          approvedBy = null;
          approvedAt = null;
          rejectionReason = null;
          netAmount = netPay;
          grossAmount = grossPay;
          taxAmount = taxDeduction;
          deductionAmount = otherDeductions;
          createdAt = now;
        };
        let updated = records.concat([(recordId, rec)]);
        ?(rec, updated);
      };
    };
  };

  public func listPayrollRecords(
    records : [(Common.EntityId, Types.PayrollRecord)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    employeeId : ?Common.EntityId,
  ) : [Types.PayrollRecord] {
    let filtered = records.filter(
      func((_, rec)) {
        if (rec.tenantId != tenantId or rec.workspaceId != workspaceId) { return false };
        switch (employeeId) {
          case null { true };
          case (?eid) { rec.employeeId == eid };
        };
      },
    );
    filtered.map<(Common.EntityId, Types.PayrollRecord), Types.PayrollRecord>(
      func((_, rec)) { rec },
    );
  };

  public func bulkApprovePayroll(
    records : [(Common.EntityId, Types.PayrollRecord)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    recordIds : [Common.EntityId],
    caller : Common.UserId,
  ) : [(Common.EntityId, Types.PayrollRecord)] {
    let now = Time.now();
    records.map(
      func((k, rec)) {
        if (rec.tenantId == tenantId and rec.workspaceId == workspaceId and rec.status == #PendingApproval and recordIds.find(func(rid) { rid == k }) != null) {
          (k, { rec with status = #Approved; approvedBy = ?caller; approvedAt = ?now });
        } else {
          (k, rec);
        };
      },
    );
  };

  public func rejectPayrollRecord(
    records : [(Common.EntityId, Types.PayrollRecord)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    recordId : Common.EntityId,
    caller : Common.UserId,
    reason : Text,
  ) : ?(Types.PayrollRecord, [(Common.EntityId, Types.PayrollRecord)]) {
    var found = false;
    var result : ?Types.PayrollRecord = null;
    let updated = records.map(
      func((k, rec)) {
        if (k == recordId and rec.tenantId == tenantId and rec.workspaceId == workspaceId) {
          found := true;
          let newRec : Types.PayrollRecord = {
            rec with
            status = #Rejected;
            rejectionReason = ?reason;
          };
          result := ?newRec;
          (k, newRec);
        } else {
          (k, rec);
        };
      },
    );
    if (found) {
      switch (result) {
        case (?rec) { ?(rec, updated) };
        case null { null };
      };
    } else {
      null;
    };
  };

  // ── Contractors ───────────────────────────────────────────────────────────────
  public func addContractor(
    contractors : [(Common.EntityId, Types.Contractor)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : Types.ContractorInput,
    id : Common.EntityId,
  ) : (Types.Contractor, [(Common.EntityId, Types.Contractor)]) {
    let now = Time.now();
    let c : Types.Contractor = {
      id;
      tenantId;
      workspaceId;
      name = input.name;
      email = input.email;
      taxId = input.taxId;
      rate = input.rate;
      currency = input.currency;
      isActive = true;
      createdAt = now;
    };
    (c, contractors.concat([(id, c)]));
  };

  public func getContractor(
    contractors : [(Common.EntityId, Types.Contractor)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : ?Types.Contractor {
    let found = contractors.find(func((k, c)) { k == id and c.tenantId == tenantId and c.workspaceId == workspaceId });
    switch (found) {
      case (?(_, c)) { ?c };
      case null { null };
    };
  };

  public func listContractors(
    contractors : [(Common.EntityId, Types.Contractor)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.Contractor] {
    contractors.filter(func((_, c)) { c.tenantId == tenantId and c.workspaceId == workspaceId })
      .map<(Common.EntityId, Types.Contractor), Types.Contractor>(func((_, c)) { c });
  };

  public func updateContractor(
    contractors : [(Common.EntityId, Types.Contractor)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    input : Types.ContractorInput,
  ) : ?(Types.Contractor, [(Common.EntityId, Types.Contractor)]) {
    var found = false;
    var result : ?Types.Contractor = null;
    let updated = contractors.map(
      func((k, c)) {
        if (k == id and c.tenantId == tenantId and c.workspaceId == workspaceId) {
          found := true;
          let newC : Types.Contractor = {
            c with
            name = input.name;
            email = input.email;
            taxId = input.taxId;
            rate = input.rate;
            currency = input.currency;
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

  public func addContractorPayment(
    payments : [(Common.EntityId, Types.ContractorPayment)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : Types.ContractorPaymentInput,
    id : Common.EntityId,
  ) : (Types.ContractorPayment, [(Common.EntityId, Types.ContractorPayment)]) {
    let now = Time.now();
    let p : Types.ContractorPayment = {
      id;
      tenantId;
      workspaceId;
      contractorId = input.contractorId;
      amount = input.amount;
      reason = input.reason;
      paymentDate = input.paymentDate;
      notes = input.notes;
      processedAt = null;
      status = #pending;
      createdAt = now;
    };
    (p, payments.concat([(id, p)]));
  };

  public func listContractorPayments(
    payments : [(Common.EntityId, Types.ContractorPayment)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    contractorId : ?Common.EntityId,
  ) : [Types.ContractorPayment] {
    payments.filter(
      func((_, p)) {
        if (p.tenantId != tenantId or p.workspaceId != workspaceId) { return false };
        switch (contractorId) {
          case null { true };
          case (?cid) { p.contractorId == cid };
        };
      },
    ).map<(Common.EntityId, Types.ContractorPayment), Types.ContractorPayment>(
      func((_, p)) { p },
    );
  };

  // ── Pay Schedules ─────────────────────────────────────────────────────────────
  public func addPaySchedule(
    schedules : [(Common.EntityId, Types.PaySchedule)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : Types.PayScheduleInput,
    id : Common.EntityId,
  ) : (Types.PaySchedule, [(Common.EntityId, Types.PaySchedule)]) {
    let now = Time.now();
    let s : Types.PaySchedule = {
      id;
      tenantId;
      workspaceId;
      name = input.name;
      frequency = input.frequency;
      description = input.description;
      isDefault = input.isDefault;
      createdAt = now;
    };
    (s, schedules.concat([(id, s)]));
  };

  public func listPaySchedules(
    schedules : [(Common.EntityId, Types.PaySchedule)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.PaySchedule] {
    schedules.filter(func((_, s)) { s.tenantId == tenantId and s.workspaceId == workspaceId })
      .map<(Common.EntityId, Types.PaySchedule), Types.PaySchedule>(func((_, s)) { s });
  };

  // ── Deductions ────────────────────────────────────────────────────────────────
  public func addDeduction(
    deductions : [(Common.EntityId, Types.Deduction)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : Types.DeductionInput,
    id : Common.EntityId,
  ) : (Types.Deduction, [(Common.EntityId, Types.Deduction)]) {
    let now = Time.now();
    let d : Types.Deduction = {
      id;
      tenantId;
      workspaceId;
      employeeId = input.employeeId;
      name = input.name;
      deductionType = input.deductionType;
      amount = input.amount;
      frequency = input.frequency;
      isActive = true;
      createdAt = now;
    };
    (d, deductions.concat([(id, d)]));
  };

  public func listDeductions(
    deductions : [(Common.EntityId, Types.Deduction)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    employeeId : ?Common.EntityId,
  ) : [Types.Deduction] {
    deductions.filter(
      func((_, d)) {
        if (d.tenantId != tenantId or d.workspaceId != workspaceId) { return false };
        switch (employeeId) {
          case null { true };
          case (?eid) { d.employeeId == eid };
        };
      },
    ).map<(Common.EntityId, Types.Deduction), Types.Deduction>(func((_, d)) { d });
  };

  public func updateDeduction(
    deductions : [(Common.EntityId, Types.Deduction)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    isActive : Bool,
    amount : Float,
  ) : ?(Types.Deduction, [(Common.EntityId, Types.Deduction)]) {
    var found = false;
    var result : ?Types.Deduction = null;
    let updated = deductions.map(
      func((k, d)) {
        if (k == id and d.tenantId == tenantId and d.workspaceId == workspaceId) {
          found := true;
          let newD : Types.Deduction = { d with isActive; amount };
          result := ?newD;
          (k, newD);
        } else {
          (k, d);
        };
      },
    );
    if (found) {
      switch (result) {
        case (?d) { ?(d, updated) };
        case null { null };
      };
    } else {
      null;
    };
  };

  // ── Benefits ──────────────────────────────────────────────────────────────────
  public func addBenefit(
    benefits : [(Common.EntityId, Types.Benefit)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : Types.BenefitInput,
    id : Common.EntityId,
  ) : (Types.Benefit, [(Common.EntityId, Types.Benefit)]) {
    let b : Types.Benefit = {
      id;
      tenantId;
      workspaceId;
      employeeId = input.employeeId;
      name = input.name;
      monthlyCost = input.monthlyCost;
      startDate = input.startDate;
      endDate = input.endDate;
      isActive = true;
    };
    (b, benefits.concat([(id, b)]));
  };

  public func listBenefits(
    benefits : [(Common.EntityId, Types.Benefit)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    employeeId : ?Common.EntityId,
  ) : [Types.Benefit] {
    benefits.filter(
      func((_, b)) {
        if (b.tenantId != tenantId or b.workspaceId != workspaceId) { return false };
        switch (employeeId) {
          case null { true };
          case (?eid) { b.employeeId == eid };
        };
      },
    ).map<(Common.EntityId, Types.Benefit), Types.Benefit>(func((_, b)) { b });
  };

  // ── Pay Stubs ─────────────────────────────────────────────────────────────────
  public func generatePayStub(
    stubs : [(Common.EntityId, Types.PayStub)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    record : Types.PayrollRecord,
    stubId : Common.EntityId,
  ) : (Types.PayStub, [(Common.EntityId, Types.PayStub)]) {
    let now = Time.now();
    let details = "{\"grossPay\":" # record.grossAmount.format(#exact)
      # ",\"taxDeductions\":" # record.taxAmount.format(#exact)
      # ",\"otherDeductions\":" # record.deductionAmount.format(#exact)
      # ",\"netPay\":" # record.netAmount.format(#exact)
      # ",\"period\":\"" # record.period # "\"}";
    let stub : Types.PayStub = {
      id = stubId;
      tenantId;
      workspaceId;
      employeeId = record.employeeId;
      payrollRecordId = record.id;
      grossPay = record.grossAmount;
      taxDeductions = record.taxAmount;
      otherDeductions = record.deductionAmount;
      netPay = record.netAmount;
      period = record.period;
      generatedAt = now;
      details;
    };
    (stub, stubs.concat([(stubId, stub)]));
  };

  public func listPayStubs(
    stubs : [(Common.EntityId, Types.PayStub)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    employeeId : ?Common.EntityId,
  ) : [Types.PayStub] {
    stubs.filter(
      func((_, s)) {
        if (s.tenantId != tenantId or s.workspaceId != workspaceId) { return false };
        switch (employeeId) {
          case null { true };
          case (?eid) { s.employeeId == eid };
        };
      },
    ).map<(Common.EntityId, Types.PayStub), Types.PayStub>(func((_, s)) { s });
  };

  // ── Off-Cycle Payments ────────────────────────────────────────────────────────
  public func addOffCyclePayment(
    payments : [(Common.EntityId, Types.OffCyclePayment)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    input : Types.OffCyclePaymentInput,
    id : Common.EntityId,
  ) : (Types.OffCyclePayment, [(Common.EntityId, Types.OffCyclePayment)]) {
    let now = Time.now();
    let p : Types.OffCyclePayment = {
      id;
      tenantId;
      workspaceId;
      employeeId = input.employeeId;
      amount = input.amount;
      reason = input.reason;
      processImmediately = input.processImmediately;
      notes = input.notes;
      status = if (input.processImmediately) { #processed } else { #pending };
      createdAt = now;
    };
    (p, payments.concat([(id, p)]));
  };

  public func listOffCyclePayments(
    payments : [(Common.EntityId, Types.OffCyclePayment)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    employeeId : ?Common.EntityId,
  ) : [Types.OffCyclePayment] {
    payments.filter(
      func((_, p)) {
        if (p.tenantId != tenantId or p.workspaceId != workspaceId) { return false };
        switch (employeeId) {
          case null { true };
          case (?eid) { p.employeeId == eid };
        };
      },
    ).map<(Common.EntityId, Types.OffCyclePayment), Types.OffCyclePayment>(func((_, p)) { p });
  };

  // ── Audit Log ─────────────────────────────────────────────────────────────────
  public func addAuditLogEntry(
    log : [(Common.EntityId, Types.AuditLogEntry)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    action : Text,
    entityType : Text,
    entityId : Common.EntityId,
    performedBy : Common.UserId,
    details : Text,
    id : Common.EntityId,
  ) : (Types.AuditLogEntry, [(Common.EntityId, Types.AuditLogEntry)]) {
    let now = Time.now();
    let entry : Types.AuditLogEntry = {
      id;
      tenantId;
      workspaceId;
      action;
      entityType;
      entityId;
      performedBy;
      details;
      timestamp = now;
    };
    (entry, log.concat([(id, entry)]));
  };

  public func listAuditLog(
    log : [(Common.EntityId, Types.AuditLogEntry)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    limit : Nat,
  ) : [Types.AuditLogEntry] {
    let filtered = log.filter(func((_, e)) { e.tenantId == tenantId and e.workspaceId == workspaceId })
      .map(func((_, e) : (Common.EntityId, Types.AuditLogEntry)) : Types.AuditLogEntry { e });
    let total = filtered.size();
    if (total <= limit) {
      filtered;
    } else {
      filtered.sliceToArray(total.toInt() - limit.toInt(), total.toInt());
    };
  };
};
