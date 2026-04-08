import Common "../types/common";
import ITypes "../types/integration";
import Time "mo:core/Time";

module {

  func genId(prefix : Text, now : Int) : Common.EntityId {
    prefix # "-" # debug_show(now)
  };

  public func saveIntegration(
    store : [(Common.EntityId, ITypes.Integration)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : ITypes.IntegrationInput,
  ) : (ITypes.Integration, [(Common.EntityId, ITypes.Integration)]) {
    let now = Time.now();
    let existing = store.find(
      func((_, i)) { i.tenantId == tenantId and i.workspaceId == workspaceId and i.provider == input.provider },
    );
    switch existing {
      case (?(id, prev)) {
        let updated : ITypes.Integration = {
          id;
          tenantId;
          workspaceId;
          provider = input.provider;
          accessToken = input.accessToken;
          oauthToken = input.oauthToken;
          config = input.config;
          status = #Connected;
          lastSyncAt = prev.lastSyncAt;
          syncStatus = prev.syncStatus;
          createdAt = prev.createdAt;
          updatedAt = now;
        };
        let newStore = store.map(
          func((k, v)) { if (k == id) { (k, updated) } else { (k, v) } },
        );
        (updated, newStore)
      };
      case null {
        let id = genId("int", now);
        let integration : ITypes.Integration = {
          id;
          tenantId;
          workspaceId;
          provider = input.provider;
          accessToken = input.accessToken;
          oauthToken = input.oauthToken;
          config = input.config;
          status = #Connected;
          lastSyncAt = null;
          syncStatus = null;
          createdAt = now;
          updatedAt = now;
        };
        (integration, store.concat([(id, integration)]))
      };
    }
  };

  public func getIntegrations(
    store : [(Common.EntityId, ITypes.Integration)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [ITypes.Integration] {
    store.filter<(Common.EntityId, ITypes.Integration)>(func((_, i)) { i.tenantId == tenantId and i.workspaceId == workspaceId }).map<(Common.EntityId, ITypes.Integration), ITypes.Integration>(
      func((_, i)) { i },
    )
  };

  public func deleteIntegration(
    store : [(Common.EntityId, ITypes.Integration)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    _caller : Common.UserId,
  ) : (Bool, [(Common.EntityId, ITypes.Integration)]) {
    let found = store.find(func((k, i)) { k == id and i.tenantId == tenantId and i.workspaceId == workspaceId });
    switch found {
      case null (false, store);
      case (?(_, _)) {
        let newStore = store.filter(func((k, _)) { k != id });
        (true, newStore)
      };
    }
  };

  public func updateIntegrationSyncStatus(
    store : [(Common.EntityId, ITypes.Integration)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    status : Text,
    timestamp : Common.Timestamp,
  ) : (Bool, [(Common.EntityId, ITypes.Integration)]) {
    let found = store.find(func((k, i)) { k == id and i.tenantId == tenantId and i.workspaceId == workspaceId });
    switch found {
      case null (false, store);
      case (?(_, prev)) {
        let updated : ITypes.Integration = {
          prev with
          syncStatus = ?status;
          lastSyncAt = ?timestamp;
          updatedAt = timestamp;
        };
        let newStore = store.map(func((k, v)) { if (k == id) { (k, updated) } else { (k, v) } });
        (true, newStore)
      };
    }
  };

  public func addIntegrationEvent(
    store : [(Common.EntityId, ITypes.IntegrationEvent)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    integrationId : Common.EntityId,
    eventType : Text,
    payload : Text,
  ) : (ITypes.IntegrationEvent, [(Common.EntityId, ITypes.IntegrationEvent)]) {
    let now = Time.now();
    let id = genId("iev", now);
    let event : ITypes.IntegrationEvent = {
      id;
      tenantId;
      workspaceId;
      integrationId;
      eventType;
      payload;
      triggerAction = null;
      timestamp = now;
    };
    (event, store.concat([(id, event)]))
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
  ) : (ITypes.IntegrationEvent, [(Common.EntityId, ITypes.IntegrationEvent)]) {
    let now = Time.now();
    let id = genId("iev", now);
    // Find the integration for this provider in this workspace
    let integrationId = switch (integrationStore.find(func((_, i)) { i.tenantId == tenantId and i.workspaceId == workspaceId and i.provider == provider })) {
      case (?(iid, _)) iid;
      case null genId("unknown", now);
    };
    let event : ITypes.IntegrationEvent = {
      id;
      tenantId;
      workspaceId;
      integrationId;
      eventType;
      payload;
      triggerAction = ?triggerAction;
      timestamp = now;
    };
    (event, eventStore.concat([(id, event)]))
  };

  public func getIntegrationEvents(
    store : [(Common.EntityId, ITypes.IntegrationEvent)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    integrationId : Common.EntityId,
    limit : Nat,
  ) : [ITypes.IntegrationEvent] {
    let filtered = store.filter(
      func((_, e)) { e.tenantId == tenantId and e.workspaceId == workspaceId and e.integrationId == integrationId },
    ).map(func((_, e)) { e });
    let total = filtered.size();
    if (total <= limit) { filtered } else {
      filtered.sliceToArray(total - limit, total)
    }
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
    // Build set of integration IDs matching the provider filter
    let matchingIds : [Common.EntityId] = switch provider {
      case null [];
      case (?prov) {
        integrationStore
          .filter(func((_, i)) { i.tenantId == tenantId and i.workspaceId == workspaceId and i.provider == prov })
          .map(func((k, _)) { k })
      };
    };

    let filtered = store.filter(func((_, e)) {
      if (e.tenantId != tenantId or e.workspaceId != workspaceId) return false;
      // Provider filter: if provider specified, event's integrationId must be in matchingIds
      let providerMatch : Bool = switch provider {
        case null true;
        case (?_) matchingIds.find(func(id) { id == e.integrationId }) != null;
      };
      if (not providerMatch) return false;
      // Date range filter
      let fromMatch = switch fromDate {
        case null true;
        case (?fd) e.timestamp >= fd;
      };
      let toMatch = switch toDate {
        case null true;
        case (?td) e.timestamp <= td;
      };
      fromMatch and toMatch
    }).map(func((_, e)) { e });

    let total = filtered.size();
    if (total <= limit) { filtered } else {
      filtered.sliceToArray(total - limit, total)
    }
  };
};
