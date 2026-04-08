import Common "../types/common";
import ITypes "../types/integration";
import IntLib "../lib/integration";

module {

  public func saveIntegration(
    store : [(Common.EntityId, ITypes.Integration)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : ITypes.IntegrationInput,
  ) : { result : { #ok : ITypes.Integration; #err : Text }; store : [(Common.EntityId, ITypes.Integration)] } {
    let (integration, newStore) = IntLib.saveIntegration(store, tenantId, workspaceId, caller, input);
    { result = #ok integration; store = newStore }
  };

  public func getIntegrations(
    store : [(Common.EntityId, ITypes.Integration)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [ITypes.Integration] {
    IntLib.getIntegrations(store, tenantId, workspaceId)
  };

  public func deleteIntegration(
    store : [(Common.EntityId, ITypes.Integration)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : { result : { #ok : Bool; #err : Text }; store : [(Common.EntityId, ITypes.Integration)] } {
    let (ok, newStore) = IntLib.deleteIntegration(store, tenantId, workspaceId, id, caller);
    if (ok) { { result = #ok true; store = newStore } } else {
      { result = #err "Integration not found"; store }
    }
  };

  public func updateIntegrationSyncStatus(
    store : [(Common.EntityId, ITypes.Integration)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    status : Text,
    timestamp : Common.Timestamp,
  ) : { result : { #ok : Bool; #err : Text }; store : [(Common.EntityId, ITypes.Integration)] } {
    let (ok, newStore) = IntLib.updateIntegrationSyncStatus(store, tenantId, workspaceId, id, status, timestamp);
    if (ok) { { result = #ok true; store = newStore } } else {
      { result = #err "Integration not found"; store }
    }
  };

  public func addIntegrationEvent(
    store : [(Common.EntityId, ITypes.IntegrationEvent)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    integrationId : Common.EntityId,
    eventType : Text,
    payload : Text,
  ) : { result : { #ok : ITypes.IntegrationEvent; #err : Text }; store : [(Common.EntityId, ITypes.IntegrationEvent)] } {
    let (event, newStore) = IntLib.addIntegrationEvent(store, tenantId, workspaceId, integrationId, eventType, payload);
    { result = #ok event; store = newStore }
  };

  public func processIntegrationTrigger(
    integrationStore : [(Common.EntityId, ITypes.Integration)],
    eventStore : [(Common.EntityId, ITypes.IntegrationEvent)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    provider : ITypes.IntegrationProvider,
    eventType : Text,
    payload : Text,
    triggerAction : Text,
  ) : { result : { #ok : ITypes.IntegrationEvent; #err : Text }; store : [(Common.EntityId, ITypes.IntegrationEvent)] } {
    let (event, newStore) = IntLib.processIntegrationTrigger(integrationStore, eventStore, tenantId, workspaceId, provider, eventType, payload, triggerAction);
    { result = #ok event; store = newStore }
  };

  public func getIntegrationEvents(
    store : [(Common.EntityId, ITypes.IntegrationEvent)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    integrationId : Common.EntityId,
    limit : Nat,
  ) : [ITypes.IntegrationEvent] {
    IntLib.getIntegrationEvents(store, tenantId, workspaceId, integrationId, limit)
  };

  public func getIntegrationActivityLog(
    store : [(Common.EntityId, ITypes.IntegrationEvent)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    provider : ?ITypes.IntegrationProvider,
    integrationStore : [(Common.EntityId, ITypes.Integration)],
    fromDate : ?Common.Timestamp,
    toDate : ?Common.Timestamp,
    limit : Nat,
  ) : [ITypes.IntegrationEvent] {
    IntLib.getIntegrationActivityLog(store, tenantId, workspaceId, provider, integrationStore, fromDate, toDate, limit)
  };
};
