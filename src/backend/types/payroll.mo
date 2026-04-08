import C "common";

module {
  // ── Status types ───────────────────────────────────────────────────────────────
  public type PayrollStatus = {
    #Active;
    #Paused;
    #Completed;
    #PendingApproval;
    #Approved;
    #Rejected;
    #Processed;
  };

  public type DeductionType = {
    #preTax;
    #postTax;
  };

  public type DeductionFrequency = {
    #perRun;
    #annual;
  };

  public type ContractorPaymentReason = {
    #freelanceInvoice;
    #projectMilestone;
    #reimbursement;
    #other;
  };

  public type ContractorPaymentStatus = {
    #pending;
    #processed;
  };

  public type OffCycleReason = {
    #bonus;
    #reimbursement;
    #adjustment;
  };

  public type OffCycleStatus = {
    #pending;
    #processed;
  };

  // ── Core types ─────────────────────────────────────────────────────────────────
  public type Deduction = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    employeeId : C.EntityId;
    name : Text;
    deductionType : DeductionType;
    amount : Float;
    frequency : DeductionFrequency;
    isActive : Bool;
    createdAt : C.Timestamp;
  };

  public type Benefit = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    employeeId : C.EntityId;
    name : Text;
    monthlyCost : Float;
    startDate : Text;
    endDate : ?Text;
    isActive : Bool;
  };

  public type Employee = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
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
    contractorFlag : Bool;
    payScheduleId : Text;
    timeZone : Text;
    createdAt : C.Timestamp;
  };

  public type Contractor = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    name : Text;
    email : Text;
    taxId : Text;
    rate : Float;
    currency : Text;
    isActive : Bool;
    createdAt : C.Timestamp;
  };

  public type ContractorPayment = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    contractorId : C.EntityId;
    amount : Float;
    reason : ContractorPaymentReason;
    paymentDate : Text;
    notes : Text;
    processedAt : ?C.Timestamp;
    status : ContractorPaymentStatus;
    createdAt : C.Timestamp;
  };

  public type PaySchedule = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    name : Text;
    frequency : C.PayFrequency;
    description : Text;
    isDefault : Bool;
    createdAt : C.Timestamp;
  };

  public type PayrollRecord = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    employeeId : C.EntityId;
    amount : Nat;
    currency : Text;
    period : Text;
    status : PayrollStatus;
    processedAt : ?C.Timestamp;
    approvedBy : ?C.UserId;
    approvedAt : ?C.Timestamp;
    rejectionReason : ?Text;
    netAmount : Float;
    grossAmount : Float;
    taxAmount : Float;
    deductionAmount : Float;
    createdAt : C.Timestamp;
  };

  public type PayStub = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    employeeId : C.EntityId;
    payrollRecordId : C.EntityId;
    grossPay : Float;
    taxDeductions : Float;
    otherDeductions : Float;
    netPay : Float;
    period : Text;
    generatedAt : C.Timestamp;
    details : Text;
  };

  public type OffCyclePayment = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    employeeId : C.EntityId;
    amount : Float;
    reason : OffCycleReason;
    processImmediately : Bool;
    notes : Text;
    status : OffCycleStatus;
    createdAt : C.Timestamp;
  };

  public type AuditLogEntry = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    action : Text;
    entityType : Text;
    entityId : C.EntityId;
    performedBy : C.UserId;
    details : Text;
    timestamp : C.Timestamp;
  };

  // ── Input types ────────────────────────────────────────────────────────────────
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
    contractorFlag : Bool;
    payScheduleId : Text;
    timeZone : Text;
  };

  public type ContractorInput = {
    name : Text;
    email : Text;
    taxId : Text;
    rate : Float;
    currency : Text;
  };

  public type ContractorPaymentInput = {
    contractorId : C.EntityId;
    amount : Float;
    reason : ContractorPaymentReason;
    paymentDate : Text;
    notes : Text;
  };

  public type PayScheduleInput = {
    name : Text;
    frequency : C.PayFrequency;
    description : Text;
    isDefault : Bool;
  };

  public type DeductionInput = {
    employeeId : C.EntityId;
    name : Text;
    deductionType : DeductionType;
    amount : Float;
    frequency : DeductionFrequency;
  };

  public type BenefitInput = {
    employeeId : C.EntityId;
    name : Text;
    monthlyCost : Float;
    startDate : Text;
    endDate : ?Text;
  };

  public type OffCyclePaymentInput = {
    employeeId : C.EntityId;
    amount : Float;
    reason : OffCycleReason;
    processImmediately : Bool;
    notes : Text;
  };
};
