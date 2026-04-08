import Common "../types/common";
import AITypes "../types/ai";
import AILib "../lib/ai";

module {

  public func saveAIConfig(
    store : [(Common.EntityId, AITypes.AIConfig)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : AITypes.AIConfigInput,
  ) : { result : { #ok : AITypes.AIConfig; #err : Text }; store : [(Common.EntityId, AITypes.AIConfig)] } {
    let (cfg, newStore) = AILib.saveAIConfig(store, tenantId, workspaceId, caller, input);
    { result = #ok cfg; store = newStore }
  };

  public func getAIConfig(
    store : [(Common.EntityId, AITypes.AIConfig)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : ?AITypes.AIConfig {
    AILib.getAIConfig(store, tenantId, workspaceId)
  };

  /// Store a prompt (sync, before making the HTTP call). Returns stored prompt + new store.
  public func storePrompt(
    promptStore : [(Common.EntityId, AITypes.AIPrompt)],
    configStore : [(Common.EntityId, AITypes.AIConfig)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : AITypes.AIPromptInput,
  ) : { prompt : AITypes.AIPrompt; promptStore : [(Common.EntityId, AITypes.AIPrompt)] } {
    let (prompt, newStore) = AILib.storePrompt(promptStore, configStore, tenantId, workspaceId, caller, input);
    { prompt; promptStore = newStore }
  };

  /// Store the AI response after receiving it from the HTTP call.
  public func storeResponse(
    responseStore : [(Common.EntityId, AITypes.AIResponse)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    promptId : Common.EntityId,
    responseText : Text,
    model : Text,
  ) : { response : AITypes.AIResponse; responseStore : [(Common.EntityId, AITypes.AIResponse)] } {
    let (response, newStore) = AILib.storeResponse(responseStore, tenantId, workspaceId, promptId, responseText, model);
    { response; responseStore = newStore }
  };

  public func buildPromptText(input : AITypes.AIPromptInput) : Text {
    AILib.buildPromptText(input)
  };

  public func getPromptHistory(
    promptStore : [(Common.EntityId, AITypes.AIPrompt)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    userId : ?Common.UserId,
    limit : Nat,
  ) : [AITypes.AIPrompt] {
    AILib.getPromptHistory(promptStore, tenantId, workspaceId, userId, limit)
  };

  public func getAIResponses(
    responseStore : [(Common.EntityId, AITypes.AIResponse)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    promptId : ?Common.EntityId,
    limit : Nat,
  ) : [AITypes.AIResponse] {
    AILib.getAIResponses(responseStore, tenantId, workspaceId, promptId, limit)
  };
};
