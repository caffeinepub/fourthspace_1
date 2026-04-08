import C "common";

module {
  public type FormFieldType = {
    #Text;
    #Email;
    #Textarea;
    #Dropdown;
    #Checkbox;
    #Date;
  };

  public type ConditionalLogic = {
    fieldId : Text;
    operator : Text; // "equals" | "notEquals" | "contains" | "greaterThan" | "lessThan"
    value : Text;
  };

  public type FormField = {
    id : C.EntityId;
    fieldLabel : Text;
    fieldType : FormFieldType;
    required : Bool;
    options : [Text];
    conditionalLogic : ?ConditionalLogic;
  };

  public type FormBranding = {
    logoUrl : ?Text;
    primaryColor : ?Text;
    backgroundColor : ?Text;
  };

  public type AutoCreateTaskConfig = {
    projectId : Text;
    taskTitle : Text;
    assigneeId : ?Principal;
  };

  public type FormStatus = {
    #Draft;
    #Published;
  };

  public type Form = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    title : Text;
    description : Text;
    fields : [FormField];
    status : FormStatus;
    publicUrl : Text;
    createdBy : C.UserId;
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
    branding : ?FormBranding;
    formTemplateId : ?Text;
    autoCreateTask : ?AutoCreateTaskConfig;
  };

  public type FormSubmission = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    formId : C.EntityId;
    data : [(Text, Text)];
    submittedAt : C.Timestamp;
    submitterEmail : Text;
  };

  public type FieldCompletionRate = {
    fieldId : Text;
    completionRate : Float;
  };

  public type FormAnalytics = {
    submissionCount : Nat;
    fieldCompletionRates : [FieldCompletionRate];
    recentSubmissions : [FormSubmission];
  };

  public type FormInput = {
    title : Text;
    description : Text;
    fields : [FormField];
    branding : ?FormBranding;
    formTemplateId : ?Text;
    autoCreateTask : ?AutoCreateTaskConfig;
  };

  public type FormSubmissionInput = {
    formId : C.EntityId;
    data : [(Text, Text)];
    submitterEmail : Text;
  };
};
