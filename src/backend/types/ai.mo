import C "common";

module {
  public type AIProvider = {
    #OpenAI;
    #Anthropic;
  };

  public type AIConfig = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    provider : AIProvider;
    apiKey : Text;
    model : Text;
    createdAt : C.Timestamp;
  };

  public type AIPromptType = {
    #Summarize;
    #Generate;
    #Analyze;
    #Translate;
    #Custom;
    #WorkspaceQA;
    #GenerateTasks;
    #MeetingSummary;
    #SuggestPriorities;
  };

  public type AIPrompt = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    userId : C.UserId;
    promptType : AIPromptType;
    content : Text;
    model : Text;
    createdAt : C.Timestamp;
  };

  public type AIResponse = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    promptId : C.EntityId;
    content : Text;
    model : Text;
    tokensUsed : Nat;
    createdAt : C.Timestamp;
  };

  public type AIConfigInput = {
    provider : AIProvider;
    apiKey : Text;
    model : Text;
  };

  public type AIPromptInput = {
    promptType : AIPromptType;
    content : Text;
    model : Text;
    contextEntityType : ?Text;
    contextEntityId : ?C.EntityId;
    contextData : ?Text;
  };
};
