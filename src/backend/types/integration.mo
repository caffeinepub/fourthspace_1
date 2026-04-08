import C "common";

module {
  public type IntegrationProvider = {
    #Slack;
    #GitHub;
    #GoogleDrive;
  };

  public type IntegrationStatus = {
    #Connected;
    #Disconnected;
    #Error;
  };

  public type Integration = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    provider : IntegrationProvider;
    accessToken : Text;
    oauthToken : ?Text;
    config : Text;
    status : IntegrationStatus;
    lastSyncAt : ?C.Timestamp;
    syncStatus : ?Text;
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type IntegrationEvent = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    integrationId : C.EntityId;
    eventType : Text;
    payload : Text;
    triggerAction : ?Text;
    timestamp : C.Timestamp;
  };

  public type IntegrationInput = {
    provider : IntegrationProvider;
    accessToken : Text;
    config : Text;
    oauthToken : ?Text;
  };
};
