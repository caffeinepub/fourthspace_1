import Common "../types/common";
import PayTypes "../types/payroll";
import PayLib "../lib/payroll";

module {

  public func addEmployee(
    employees : [(Common.EntityId, PayTypes.Employee)],
    idCounter : Nat,
    tenantId : Common.TenantId,
    caller : Common.UserId,
    input : PayTypes.EmployeeInput,
  ) : { #ok : (PayTypes.Employee, [(Common.EntityId, PayTypes.Employee)], Nat); #err : Text } {
    let newCounter = idCounter + 1;
    let id = PayLib.genId(newCounter);
    let (emp, updated) = PayLib.addEmployee(employees, tenantId, caller, input, id);
    #ok((emp, updated, newCounter));
  };

  public func getEmployee(
    employees : [(Common.EntityId, PayTypes.Employee)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
  ) : { #ok : PayTypes.Employee; #err : Text } {
    switch (PayLib.getEmployee(employees, tenantId, id)) {
      case (?emp) { #ok(emp) };
      case null { #err("Employee not found") };
    };
  };

  public func listEmployees(
    employees : [(Common.EntityId, PayTypes.Employee)],
    tenantId : Common.TenantId,
  ) : [PayTypes.Employee] {
    PayLib.listEmployees(employees, tenantId);
  };

  public func updateEmployee(
    employees : [(Common.EntityId, PayTypes.Employee)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : PayTypes.EmployeeInput,
  ) : { #ok : (PayTypes.Employee, [(Common.EntityId, PayTypes.Employee)]); #err : Text } {
    switch (PayLib.updateEmployee(employees, tenantId, id, caller, input)) {
      case (?(emp, updated)) { #ok((emp, updated)) };
      case null { #err("Employee not found") };
    };
  };

  public func deactivateEmployee(
    employees : [(Common.EntityId, PayTypes.Employee)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { #ok : (PayTypes.Employee, [(Common.EntityId, PayTypes.Employee)]); #err : Text } {
    switch (PayLib.deactivateEmployee(employees, tenantId, id, caller)) {
      case (?(emp, updated)) { #ok((emp, updated)) };
      case null { #err("Employee not found") };
    };
  };

  public func processPayroll(
    employees : [(Common.EntityId, PayTypes.Employee)],
    payrollRecords : [(Common.EntityId, PayTypes.PayrollRecord)],
    idCounter : Nat,
    tenantId : Common.TenantId,
    caller : Common.UserId,
    employeeId : Common.EntityId,
    period : Text,
  ) : { #ok : (PayTypes.PayrollRecord, [(Common.EntityId, PayTypes.PayrollRecord)], Nat); #err : Text } {
    let newCounter = idCounter + 1;
    let recordId = PayLib.genRecordId(newCounter);
    switch (PayLib.processPayroll(employees, payrollRecords, tenantId, caller, employeeId, period, recordId)) {
      case (?(rec, updated)) { #ok((rec, updated, newCounter)) };
      case null { #err("Employee not found or inactive") };
    };
  };

  public func listPayrollRecords(
    payrollRecords : [(Common.EntityId, PayTypes.PayrollRecord)],
    tenantId : Common.TenantId,
    employeeId : ?Common.EntityId,
  ) : [PayTypes.PayrollRecord] {
    PayLib.listPayrollRecords(payrollRecords, tenantId, employeeId);
  };
};
