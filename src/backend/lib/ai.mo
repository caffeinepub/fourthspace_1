import Common "../types/common";
import AITypes "../types/ai";
import Time "mo:core/Time";

module {

  func genId(prefix : Text, now : Int) : Common.EntityId {
    prefix # "-" # debug_show(now)
  };

  public func saveAIConfig(
    store : [(Common.EntityId, AITypes.AIConfig)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : AITypes.AIConfigInput,
  ) : (AITypes.AIConfig, [(Common.EntityId, AITypes.AIConfig)]) {
    let now = Time.now();
    let existing = store.find(
      func((_, c)) { c.tenantId == tenantId and c.workspaceId == workspaceId },
    );
    switch existing {
      case (?(id, _)) {
        let updated : AITypes.AIConfig = {
          id;
          tenantId;
          workspaceId;
          provider = input.provider;
          apiKey = input.apiKey;
          model = input.model;
          createdAt = now;
        };
        let newStore = store.map(
          func((k, v)) { if (k == id) { (k, updated) } else { (k, v) } },
        );
        (updated, newStore)
      };
      case null {
        let id = genId("aic", now);
        let config : AITypes.AIConfig = {
          id;
          tenantId;
          workspaceId;
          provider = input.provider;
          apiKey = input.apiKey;
          model = input.model;
          createdAt = now;
        };
        (config, store.concat([(id, config)]))
      };
    }
  };

  public func getAIConfig(
    store : [(Common.EntityId, AITypes.AIConfig)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : ?AITypes.AIConfig {
    switch (store.find<(Common.EntityId, AITypes.AIConfig)>(func((_, c)) { c.tenantId == tenantId and c.workspaceId == workspaceId })) {
      case (?(_, c)) ?c;
      case null null;
    }
  };

  /// Store a prompt record (before HTTP call). Returns new store.
  public func storePrompt(
    promptStore : [(Common.EntityId, AITypes.AIPrompt)],
    configStore : [(Common.EntityId, AITypes.AIConfig)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : AITypes.AIPromptInput,
  ) : (AITypes.AIPrompt, [(Common.EntityId, AITypes.AIPrompt)]) {
    let now = Time.now();
    let id = genId("aip", now);
    let model = switch (configStore.find(func((_, c)) { c.tenantId == tenantId and c.workspaceId == workspaceId })) {
      case (?(_, cfg)) cfg.model;
      case null input.model;
    };
    let prompt : AITypes.AIPrompt = {
      id;
      tenantId;
      workspaceId;
      userId = caller;
      promptType = input.promptType;
      content = input.content;
      model;
      createdAt = now;
    };
    (prompt, promptStore.concat([(id, prompt)]))
  };

  /// Store an AI response record after a successful HTTP call.
  public func storeResponse(
    responseStore : [(Common.EntityId, AITypes.AIResponse)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    promptId : Common.EntityId,
    responseText : Text,
    model : Text,
  ) : (AITypes.AIResponse, [(Common.EntityId, AITypes.AIResponse)]) {
    let now = Time.now();
    let id = genId("air", now);
    let response : AITypes.AIResponse = {
      id;
      tenantId;
      workspaceId;
      promptId;
      content = responseText;
      model;
      tokensUsed = 0;
      createdAt = now;
    };
    (response, responseStore.concat([(id, response)]))
  };

  /// Build the prompt text for a given prompt type, enriching with context.
  public func buildPromptText(input : AITypes.AIPromptInput) : Text {
    let prefix = switch (input.promptType) {
      case (#Summarize) "Please summarize the following:\n\n";
      case (#Generate) "Please generate content for the following:\n\n";
      case (#Analyze) "Please analyze the following:\n\n";
      case (#Translate) "Please translate the following:\n\n";
      case (#WorkspaceQA) "You are a workspace assistant. Answer the question using the provided workspace context.\n\nContext:\n";
      case (#GenerateTasks) "Generate a detailed task list with subtasks for the following goal or description. Format as a numbered list:\n\n";
      case (#MeetingSummary) "Summarize the following meeting notes into key decisions, action items, and next steps:\n\n";
      case (#SuggestPriorities) "Based on the following task descriptions and context, suggest priorities (High/Medium/Low) with brief reasoning for each:\n\n";
      case (#Custom) "";
    };
    let contextSection = switch (input.contextData) {
      case null "";
      case (?ctx) "\n\nContext data:\n" # ctx # "\n\n";
    };
    prefix # contextSection # input.content
  };

  public func getPromptHistory(
    promptStore : [(Common.EntityId, AITypes.AIPrompt)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    userId : ?Common.UserId,
    limit : Nat,
  ) : [AITypes.AIPrompt] {
    let filtered = promptStore.filter(
      func((_, p)) {
        p.tenantId == tenantId and p.workspaceId == workspaceId and (
          switch userId {
            case null true;
            case (?uid) p.userId == uid;
          }
        )
      },
    ).map(func((_, p)) { p });
    let total = filtered.size();
    if (total <= limit) { filtered } else {
      filtered.sliceToArray(total - limit, total)
    }
  };

  public func getAIResponses(
    responseStore : [(Common.EntityId, AITypes.AIResponse)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    promptId : ?Common.EntityId,
    limit : Nat,
  ) : [AITypes.AIResponse] {
    let filtered = responseStore.filter(
      func((_, r)) {
        r.tenantId == tenantId and r.workspaceId == workspaceId and (
          switch promptId {
            case null true;
            case (?pid) r.promptId == pid;
          }
        )
      },
    ).map(func((_, r)) { r });
    let total = filtered.size();
    if (total <= limit) { filtered } else {
      filtered.sliceToArray(total - limit, total)
    }
  };
};
