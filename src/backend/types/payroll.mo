import C "common";

module {
  public type PayrollStatus = {
    #Active;
    #Paused;
    #Completed;
  };

  public type Employee = {
    id : C.EntityId;
    tenantId : C.TenantId;
    userId : C.UserId;
    firstName : Text;
    lastName : Text;
    email : Text;
    salary : Nat;
    currency : Text;
    payFrequency : C.PayFrequency;
    taxRate : Nat;
    startDate : C.Timestamp;
    isActive : Bool;
    createdAt : C.Timestamp;
  };

  public type PayrollRecord = {
    id : C.EntityId;
    tenantId : C.TenantId;
    employeeId : C.EntityId;
    amount : Nat;
    currency : Text;
    period : Text;
    status : PayrollStatus;
    processedAt : ?C.Timestamp;
    createdAt : C.Timestamp;
  };

  public type EmployeeInput = {
    userId : C.UserId;
    firstName : Text;
    lastName : Text;
    email : Text;
    salary : Nat;
    currency : Text;
    payFrequency : C.PayFrequency;
    taxRate : Nat;
    startDate : C.Timestamp;
  };
};
