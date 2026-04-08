import Common "../types/common";
import FTypes "../types/forms";
import FormsLib "../lib/forms";

module {

  public func createForm(
    store : [(Common.EntityId, FTypes.Form)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : FTypes.FormInput,
  ) : { result : { #ok : FTypes.Form; #err : Text }; store : [(Common.EntityId, FTypes.Form)] } {
    let (form, newStore) = FormsLib.createForm(store, tenantId, workspaceId, caller, input);
    { result = #ok form; store = newStore }
  };

  public func updateForm(
    store : [(Common.EntityId, FTypes.Form)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : FTypes.FormInput,
  ) : { result : { #ok : FTypes.Form; #err : Text }; store : [(Common.EntityId, FTypes.Form)] } {
    let (opt, newStore) = FormsLib.updateForm(store, tenantId, workspaceId, id, caller, input);
    switch opt {
      case (?form) { { result = #ok form; store = newStore } };
      case null { { result = #err "Form not found"; store } };
    }
  };

  public func deleteForm(
    store : [(Common.EntityId, FTypes.Form)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { result : { #ok : Bool; #err : Text }; store : [(Common.EntityId, FTypes.Form)] } {
    let (ok, newStore) = FormsLib.deleteForm(store, tenantId, workspaceId, id, caller);
    if (ok) { { result = #ok true; store = newStore } } else {
      { result = #err "Form not found"; store }
    }
  };

  public func getForm(
    store : [(Common.EntityId, FTypes.Form)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { #ok : FTypes.Form; #err : Text } {
    switch (FormsLib.getForm(store, tenantId, workspaceId, id)) {
      case (?form) #ok form;
      case null #err "Form not found";
    }
  };

  public func listForms(
    store : [(Common.EntityId, FTypes.Form)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [FTypes.Form] {
    FormsLib.listForms(store, tenantId, workspaceId)
  };

  // Public — no workspaceId (unauthenticated access by public URL)
  public func getPublicForm(
    store : [(Common.EntityId, FTypes.Form)],
    publicUrl : Text,
  ) : ?FTypes.Form {
    FormsLib.getPublicForm(store, publicUrl)
  };

  // Public submission — no workspaceId required (derives it from the form).
  // Returns the submission result plus an optional TaskInput for auto-task creation.
  public func submitFormResponse(
    submissionStore : [(Common.EntityId, FTypes.FormSubmission)],
    formStore : [(Common.EntityId, FTypes.Form)],
    input : FTypes.FormSubmissionInput,
  ) : {
    result : { #ok : FTypes.FormSubmission; #err : Text };
    store : [(Common.EntityId, FTypes.FormSubmission)];
    taskInput : ?{ projectId : Text; title : Text; description : Text; assigneeId : ?Principal };
  } {
    let (submission, newStore, maybeTask) = FormsLib.submitFormResponse(submissionStore, formStore, input);
    let taskInfo = switch (maybeTask) {
      case null null;
      case (?t) ?{ projectId = t.projectId; title = t.title; description = t.description; assigneeId = t.assigneeId };
    };
    { result = #ok submission; store = newStore; taskInput = taskInfo }
  };

  public func listFormSubmissions(
    store : [(Common.EntityId, FTypes.FormSubmission)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    formId : Common.EntityId,
  ) : [FTypes.FormSubmission] {
    FormsLib.listFormSubmissions(store, tenantId, workspaceId, formId)
  };

  public func getFormAnalytics(
    formStore : [(Common.EntityId, FTypes.Form)],
    submissionStore : [(Common.EntityId, FTypes.FormSubmission)],
    formId : Common.EntityId,
    workspaceId : Common.WorkspaceId,
    tenantId : Common.TenantId,
  ) : FTypes.FormAnalytics {
    FormsLib.getFormAnalytics(formStore, submissionStore, formId, workspaceId, tenantId)
  };
};
