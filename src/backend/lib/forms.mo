import Common "../types/common";
import FTypes "../types/forms";
import PTypes "../types/projects";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";

module {

  func genId(prefix : Text, now : Int) : Common.EntityId {
    prefix # "-" # debug_show(now)
  };

  func genSlug(now : Int) : Text {
    "form-" # debug_show(Int.abs(now))
  };

  public func createForm(
    store : [(Common.EntityId, FTypes.Form)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : FTypes.FormInput,
  ) : (FTypes.Form, [(Common.EntityId, FTypes.Form)]) {
    let now = Time.now();
    let id = genId("frm", now);
    let publicUrl = genSlug(now);
    let form : FTypes.Form = {
      id;
      tenantId;
      workspaceId;
      title = input.title;
      description = input.description;
      fields = input.fields;
      status = #Draft;
      publicUrl;
      createdBy = caller;
      createdAt = now;
      updatedAt = now;
      branding = input.branding;
      formTemplateId = input.formTemplateId;
      autoCreateTask = input.autoCreateTask;
    };
    (form, store.concat([(id, form)]))
  };

  public func updateForm(
    store : [(Common.EntityId, FTypes.Form)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
    input : FTypes.FormInput,
  ) : (?FTypes.Form, [(Common.EntityId, FTypes.Form)]) {
    let now = Time.now();
    let found = store.find(
      func((k, f)) { k == id and f.tenantId == tenantId and f.workspaceId == workspaceId and f.createdBy == caller },
    );
    switch found {
      case null (null, store);
      case (?(_, prev)) {
        let updated : FTypes.Form = {
          prev with
          title = input.title;
          description = input.description;
          fields = input.fields;
          updatedAt = now;
          branding = input.branding;
          formTemplateId = input.formTemplateId;
          autoCreateTask = input.autoCreateTask;
        };
        let newStore = store.map(
          func((k, v)) { if (k == id) { (k, updated) } else { (k, v) } },
        );
        (?updated, newStore)
      };
    }
  };

  public func deleteForm(
    store : [(Common.EntityId, FTypes.Form)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : (Bool, [(Common.EntityId, FTypes.Form)]) {
    let found = store.find(
      func((k, f)) { k == id and f.tenantId == tenantId and f.workspaceId == workspaceId and f.createdBy == caller },
    );
    switch found {
      case null (false, store);
      case (?(_, _)) {
        (true, store.filter<(Common.EntityId, FTypes.Form)>(func((k, _)) { k != id }))
      };
    }
  };

  public func getForm(
    store : [(Common.EntityId, FTypes.Form)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : ?FTypes.Form {
    switch (store.find<(Common.EntityId, FTypes.Form)>(func((k, f)) { k == id and f.tenantId == tenantId and f.workspaceId == workspaceId })) {
      case (?(_, f)) ?f;
      case null null;
    }
  };

  public func listForms(
    store : [(Common.EntityId, FTypes.Form)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [FTypes.Form] {
    store.filter<(Common.EntityId, FTypes.Form)>(func((_, f)) { f.tenantId == tenantId and f.workspaceId == workspaceId }).map<(Common.EntityId, FTypes.Form), FTypes.Form>(
      func((_, f)) { f },
    )
  };

  // Public — no tenantId/workspaceId filter (unauthenticated access by public URL)
  public func getPublicForm(
    store : [(Common.EntityId, FTypes.Form)],
    publicUrl : Text,
  ) : ?FTypes.Form {
    switch (store.find<(Common.EntityId, FTypes.Form)>(func((_, f)) { f.publicUrl == publicUrl and f.status == #Published })) {
      case (?(_, f)) ?f;
      case null null;
    }
  };

  // Public submission — derives tenantId from the form record.
  // Returns the submission plus updated submission store, plus an optional TaskInput to be created by caller.
  public func submitFormResponse(
    submissionStore : [(Common.EntityId, FTypes.FormSubmission)],
    formStore : [(Common.EntityId, FTypes.Form)],
    input : FTypes.FormSubmissionInput,
  ) : (FTypes.FormSubmission, [(Common.EntityId, FTypes.FormSubmission)], ?PTypes.TaskInput) {
    let now = Time.now();
    let id = genId("fsub", now);
    let found = formStore.find(func((k, _)) { k == input.formId });
    let (tenantId, workspaceId) = switch found {
      case (?(_, f)) (f.tenantId, f.workspaceId);
      case null ("", "");
    };
    let submission : FTypes.FormSubmission = {
      id;
      tenantId;
      workspaceId;
      formId = input.formId;
      data = input.data;
      submittedAt = now;
      submitterEmail = input.submitterEmail;
    };
    // Build optional auto-create task input if form has autoCreateTask config
    let taskInput : ?PTypes.TaskInput = switch found {
      case (?(_, f)) {
        switch (f.autoCreateTask) {
          case null null;
          case (?cfg) {
            // Build a description from submission data
            let dataText = input.data.foldLeft(
              "",
              func(acc : Text, (k, v) : (Text, Text)) : Text {
                if (acc == "") { k # ": " # v } else { acc # "\n" # k # ": " # v }
              },
            );
            ?{
              projectId = cfg.projectId;
              title = cfg.taskTitle;
              description = "Form submission from " # input.submitterEmail # "\n" # dataText;
              priority = #Medium;
              assigneeId = cfg.assigneeId;
              dueDate = null;
              tags = [];
              crossLinks = [];
            }
          };
        }
      };
      case null null;
    };
    (submission, submissionStore.concat([(id, submission)]), taskInput)
  };

  public func listFormSubmissions(
    store : [(Common.EntityId, FTypes.FormSubmission)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    formId : Common.EntityId,
  ) : [FTypes.FormSubmission] {
    store.filter(
      func((_, s)) { s.tenantId == tenantId and s.workspaceId == workspaceId and s.formId == formId },
    ).map(func((_, s)) { s })
  };

  public func getFormAnalytics(
    formStore : [(Common.EntityId, FTypes.Form)],
    submissionStore : [(Common.EntityId, FTypes.FormSubmission)],
    formId : Common.EntityId,
    workspaceId : Common.WorkspaceId,
    tenantId : Common.TenantId,
  ) : FTypes.FormAnalytics {
    let allSubs = submissionStore.filter(
      func((_, s)) { s.formId == formId and s.tenantId == tenantId and s.workspaceId == workspaceId },
    ).map(func((_, s) : (Common.EntityId, FTypes.FormSubmission)) : FTypes.FormSubmission { s });

    let submissionCount = allSubs.size();

    // Compute field completion rates from the form's fields
    let fieldRates : [FTypes.FieldCompletionRate] = switch (formStore.find<(Common.EntityId, FTypes.Form)>(func((k, _)) { k == formId })) {
      case null [];
      case (?(_, form)) {
        form.fields.map<FTypes.FormField, FTypes.FieldCompletionRate>(
          func(field) {
            if (submissionCount == 0) {
              { fieldId = field.id; completionRate = 0.0 }
            } else {
              let filled = allSubs.filter(
                func(s) {
                  s.data.find(func((k, v)) { k == field.id and v != "" }) != null
                },
              ).size();
              {
                fieldId = field.id;
                completionRate = filled.toFloat() / submissionCount.toFloat() * 100.0;
              }
            }
          },
        )
      };
    };

    // Return up to 10 most recent submissions
    let recentCount = if (submissionCount > 10) { 10 } else { submissionCount };
    let startIdx : Int = (submissionCount - recentCount : Nat).toInt();
    let endIdx : Int = submissionCount.toInt();
    let recentSubs = allSubs.sliceToArray(startIdx, endIdx).reverse();

    {
      submissionCount;
      fieldCompletionRates = fieldRates;
      recentSubmissions = recentSubs;
    }
  };
};
