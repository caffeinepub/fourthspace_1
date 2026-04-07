import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Types "../types/workspace";
import Common "../types/common";

module {

  // ── ID Generation ─────────────────────────────────────────────────────────────

  public func generateId(caller : Common.UserId) : Common.EntityId {
    caller.toText() # "_" # Time.now().toText()
  };

  // ── Workspace ─────────────────────────────────────────────────────────────────

  public func createWorkspace(
    workspaces : [(Common.EntityId, Types.Workspace)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
    input : Types.WorkspaceInput,
  ) : (Types.Workspace, [(Common.EntityId, Types.Workspace)]) {
    let id = generateId(caller);
    let ws : Types.Workspace = {
      id;
      tenantId;
      name = input.name;
      ownerId = caller;
      createdAt = Time.now();
    };
    let updated = workspaces.concat([(id, ws)]);
    (ws, updated)
  };

  public func getWorkspace(
    workspaces : [(Common.EntityId, Types.Workspace)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
  ) : ?Types.Workspace {
    let entry = workspaces.find(func(pair : (Common.EntityId, Types.Workspace)) : Bool {
      pair.0 == id and pair.1.tenantId == tenantId
    });
    switch (entry) {
      case (?(_, ws)) ?ws;
      case null null;
    }
  };

  public func listWorkspaces(
    workspaces : [(Common.EntityId, Types.Workspace)],
    tenantId : Common.TenantId,
  ) : [Types.Workspace] {
    let filtered = workspaces.filter(func(pair : (Common.EntityId, Types.Workspace)) : Bool {
      pair.1.tenantId == tenantId
    });
    filtered.map<(Common.EntityId, Types.Workspace), Types.Workspace>(func(pair) { pair.1 })
  };

  // ── User Profile ──────────────────────────────────────────────────────────────

  public func createProfile(
    profiles : [(Common.UserId, Types.UserProfile)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
    input : Types.UserProfileInput,
  ) : (Types.UserProfile, [(Common.UserId, Types.UserProfile)]) {
    let profile : Types.UserProfile = {
      userId = caller;
      tenantId;
      displayName = input.displayName;
      email = input.email;
      role = input.role;
      workspaceId = input.workspaceId;
      createdAt = Time.now();
    };
    // Remove existing entry for caller (upsert semantics)
    let filtered = profiles.filter(func(pair : (Common.UserId, Types.UserProfile)) : Bool {
      not Principal.equal(pair.0, caller)
    });
    let updated = filtered.concat([(caller, profile)]);
    (profile, updated)
  };

  public func getProfile(
    profiles : [(Common.UserId, Types.UserProfile)],
    userId : Common.UserId,
  ) : ?Types.UserProfile {
    let entry = profiles.find(func(pair : (Common.UserId, Types.UserProfile)) : Bool {
      Principal.equal(pair.0, userId)
    });
    switch (entry) {
      case (?(_, p)) ?p;
      case null null;
    }
  };

  public func updateProfile(
    profiles : [(Common.UserId, Types.UserProfile)],
    userId : Common.UserId,
    input : Types.UserProfileInput,
  ) : (?Types.UserProfile, [(Common.UserId, Types.UserProfile)]) {
    let existing = getProfile(profiles, userId);
    switch (existing) {
      case null (null, profiles);
      case (?prev) {
        let updated : Types.UserProfile = {
          prev with
          displayName = input.displayName;
          email = input.email;
          role = input.role;
          workspaceId = input.workspaceId;
        };
        let filtered = profiles.filter(func(pair : (Common.UserId, Types.UserProfile)) : Bool {
          not Principal.equal(pair.0, userId)
        });
        let newProfiles = filtered.concat([(userId, updated)]);
        (?updated, newProfiles)
      };
    }
  };

  public func listProfiles(
    profiles : [(Common.UserId, Types.UserProfile)],
    tenantId : Common.TenantId,
  ) : [Types.UserProfile] {
    let filtered = profiles.filter(func(pair : (Common.UserId, Types.UserProfile)) : Bool {
      pair.1.tenantId == tenantId
    });
    filtered.map<(Common.UserId, Types.UserProfile), Types.UserProfile>(func(pair) { pair.1 })
  };

};
