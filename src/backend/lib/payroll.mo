import Time "mo:core/Time";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Types "../types/payroll";
import Common "../types/common";

module {

  // ── ID generation ────────────────────────────────────────────────────────────
  public func genId(counter : Nat) : Common.EntityId {
    "pay-" # counter.toText();
  };

  public func genRecordId(counter : Nat) : Common.EntityId {
    "prec-" # counter.toText();
  };

  // ── Employee CRUD ─────────────────────────────────────────────────────────────
  public func addEmployee(
    employees : [(Common.EntityId, Types.Employee)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
    input : Types.EmployeeInput,
    id : Common.EntityId,
  ) : (Types.Employee, [(Common.EntityId, Types.Employee)]) {
    let now = Time.now();
    let emp : Types.Employee = {
      id;
      tenantId;
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
      createdAt = now;
    };
    let updated = employees.concat([(id, emp)]);
    (emp, updated);
  };

  public func getEmployee(
    employees : [(Common.EntityId, Types.Employee)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
  ) : ?Types.Employee {
    let found = employees.find(
      func((k, v)) { k == id and v.tenantId == tenantId },
    );
    switch (found) {
      case (?(_, emp)) { ?emp };
      case null { null };
    };
  };

  public func listEmployees(
    employees : [(Common.EntityId, Types.Employee)],
    tenantId : Common.TenantId,
  ) : [Types.Employee] {
    let filtered = employees.filter(
      func((_, emp)) { emp.tenantId == tenantId },
    );
    filtered.map<(Common.EntityId, Types.Employee), Types.Employee>(
      func((_, emp)) { emp },
    );
  };

  public func updateEmployee(
    employees : [(Common.EntityId, Types.Employee)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : Types.EmployeeInput,
  ) : ?(Types.Employee, [(Common.EntityId, Types.Employee)]) {
    var found = false;
    var result : ?Types.Employee = null;
    let updated = employees.map(
      func((k, emp)) {
        if (k == id and emp.tenantId == tenantId) {
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
    id : Common.EntityId,
    caller : Common.UserId,
  ) : ?(Types.Employee, [(Common.EntityId, Types.Employee)]) {
    var found = false;
    var result : ?Types.Employee = null;
    let updated = employees.map(
      func((k, emp)) {
        if (k == id and emp.tenantId == tenantId) {
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
  public func processPayroll(
    employees : [(Common.EntityId, Types.Employee)],
    records : [(Common.EntityId, Types.PayrollRecord)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
    employeeId : Common.EntityId,
    period : Text,
    recordId : Common.EntityId,
  ) : ?(Types.PayrollRecord, [(Common.EntityId, Types.PayrollRecord)]) {
    let empOpt = getEmployee(employees, tenantId, employeeId);
    switch (empOpt) {
      case null { null };
      case (?emp) {
        if (not emp.isActive) { return null };
        let now = Time.now();
        // Net pay = salary - (salary * taxRate / 100)
        let taxAmount = emp.salary * emp.taxRate / 100;
        let netPay = emp.salary - taxAmount;
        let rec : Types.PayrollRecord = {
          id = recordId;
          tenantId;
          employeeId;
          amount = netPay;
          currency = emp.currency;
          period;
          status = #Completed;
          processedAt = ?now;
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
    employeeId : ?Common.EntityId,
  ) : [Types.PayrollRecord] {
    let filtered = records.filter(
      func((_, rec)) {
        if (rec.tenantId != tenantId) { return false };
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
};
