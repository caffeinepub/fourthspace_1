import Principal "mo:core/Principal";
import Time "mo:core/Time";
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
    ownerDisplayName : Text,
    ownerEmail : Text,
  ) : (Types.Workspace, [(Common.EntityId, Types.Workspace)]) {
    let id = generateId(caller);
    let ownerMember : Types.WorkspaceMember = {
      workspaceId = id;
      userId = caller;
      role = #Admin;
      joinedAt = Time.now();
      displayName = ownerDisplayName;
      email = ownerEmail;
    };
    let ws : Types.Workspace = {
      id;
      tenantId;
      name = input.name;
      ownerId = caller;
      createdAt = Time.now();
      members = [(caller, ownerMember)];
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

  public func updateWorkspace(
    workspaces : [(Common.EntityId, Types.Workspace)],
    tenantId : Common.TenantId,
    workspaceId : Common.EntityId,
    caller : Common.UserId,
    name : Text,
  ) : ({ #ok : Types.Workspace; #err : Text }, [(Common.EntityId, Types.Workspace)]) {
    switch (getWorkspace(workspaces, tenantId, workspaceId)) {
      case null (#err("Workspace not found"), workspaces);
      case (?ws) {
        if (not Principal.equal(ws.ownerId, caller)) {
          return (#err("Unauthorized: only workspace owner can update"), workspaces);
        };
        let updated : Types.Workspace = { ws with name };
        let others = workspaces.filter(func(pair : (Common.EntityId, Types.Workspace)) : Bool {
          pair.0 != workspaceId
        });
        let newWorkspaces = others.concat([(workspaceId, updated)]);
        (#ok(updated), newWorkspaces)
      };
    }
  };

  // ── Workspace Members ─────────────────────────────────────────────────────────

  public func addWorkspaceMember(
    workspaces : [(Common.EntityId, Types.Workspace)],
    tenantId : Common.TenantId,
    workspaceId : Common.EntityId,
    userId : Common.UserId,
    role : Types.WorkspaceRole,
    displayName : Text,
    email : Text,
  ) : ({ #ok : Types.WorkspaceMember; #err : Text }, [(Common.EntityId, Types.Workspace)]) {
    switch (getWorkspace(workspaces, tenantId, workspaceId)) {
      case null (#err("Workspace not found"), workspaces);
      case (?ws) {
        let member : Types.WorkspaceMember = {
          workspaceId;
          userId;
          role;
          joinedAt = Time.now();
          displayName;
          email;
        };
        // Remove any existing entry for this user, then add new
        let filteredMembers = ws.members.filter(func(pair : (Common.UserId, Types.WorkspaceMember)) : Bool {
          not Principal.equal(pair.0, userId)
        });
        let newMembers = filteredMembers.concat([(userId, member)]);
        let updatedWs : Types.Workspace = { ws with members = newMembers };
        let others = workspaces.filter(func(pair : (Common.EntityId, Types.Workspace)) : Bool {
          pair.0 != workspaceId
        });
        let newWorkspaces = others.concat([(workspaceId, updatedWs)]);
        (#ok(member), newWorkspaces)
      };
    }
  };

  public func removeWorkspaceMember(
    workspaces : [(Common.EntityId, Types.Workspace)],
    tenantId : Common.TenantId,
    workspaceId : Common.EntityId,
    caller : Common.UserId,
    targetUserId : Common.UserId,
  ) : ({ #ok; #err : Text }, [(Common.EntityId, Types.Workspace)]) {
    switch (getWorkspace(workspaces, tenantId, workspaceId)) {
      case null (#err("Workspace not found"), workspaces);
      case (?ws) {
        // Caller must be Admin
        let callerMember = ws.members.find(func(pair : (Common.UserId, Types.WorkspaceMember)) : Bool {
          Principal.equal(pair.0, caller)
        });
        switch (callerMember) {
          case null (#err("Unauthorized: caller is not a workspace member"), workspaces);
          case (?(_, cm)) {
            if (cm.role != #Admin) {
              return (#err("Unauthorized: only Admins can remove members"), workspaces);
            };
            let newMembers = ws.members.filter(func(pair : (Common.UserId, Types.WorkspaceMember)) : Bool {
              not Principal.equal(pair.0, targetUserId)
            });
            let updatedWs : Types.Workspace = { ws with members = newMembers };
            let others = workspaces.filter(func(pair : (Common.EntityId, Types.Workspace)) : Bool {
              pair.0 != workspaceId
            });
            let newWorkspaces = others.concat([(workspaceId, updatedWs)]);
            (#ok, newWorkspaces)
          };
        }
      };
    }
  };

  public func updateWorkspaceMemberRole(
    workspaces : [(Common.EntityId, Types.Workspace)],
    tenantId : Common.TenantId,
    workspaceId : Common.EntityId,
    caller : Common.UserId,
    targetUserId : Common.UserId,
    newRole : Types.WorkspaceRole,
  ) : ({ #ok : Types.WorkspaceMember; #err : Text }, [(Common.EntityId, Types.Workspace)]) {
    switch (getWorkspace(workspaces, tenantId, workspaceId)) {
      case null (#err("Workspace not found"), workspaces);
      case (?ws) {
        // Caller must be Admin or Manager
        let callerMember = ws.members.find(func(pair : (Common.UserId, Types.WorkspaceMember)) : Bool {
          Principal.equal(pair.0, caller)
        });
        switch (callerMember) {
          case null (#err("Unauthorized: caller is not a workspace member"), workspaces);
          case (?(_, cm)) {
            if (cm.role != #Admin and cm.role != #Manager) {
              return (#err("Unauthorized: only Admins or Managers can update member roles"), workspaces);
            };
            let targetEntry = ws.members.find(func(pair : (Common.UserId, Types.WorkspaceMember)) : Bool {
              Principal.equal(pair.0, targetUserId)
            });
            switch (targetEntry) {
              case null (#err("Member not found"), workspaces);
              case (?(_, tm)) {
                let updatedMember : Types.WorkspaceMember = { tm with role = newRole };
                let filteredMembers = ws.members.filter(func(pair : (Common.UserId, Types.WorkspaceMember)) : Bool {
                  not Principal.equal(pair.0, targetUserId)
                });
                let newMembers = filteredMembers.concat([(targetUserId, updatedMember)]);
                let updatedWs : Types.Workspace = { ws with members = newMembers };
                let others = workspaces.filter(func(pair : (Common.EntityId, Types.Workspace)) : Bool {
                  pair.0 != workspaceId
                });
                let newWorkspaces = others.concat([(workspaceId, updatedWs)]);
                (#ok(updatedMember), newWorkspaces)
              };
            }
          };
        }
      };
    }
  };

  public func listWorkspaceMembers(
    workspaces : [(Common.EntityId, Types.Workspace)],
    tenantId : Common.TenantId,
    workspaceId : Common.EntityId,
  ) : [Types.WorkspaceMember] {
    switch (getWorkspace(workspaces, tenantId, workspaceId)) {
      case null [];
      case (?ws) {
        ws.members.map<(Common.UserId, Types.WorkspaceMember), Types.WorkspaceMember>(func(pair) { pair.1 })
      };
    }
  };

  public func getWorkspaceMember(
    workspaces : [(Common.EntityId, Types.Workspace)],
    tenantId : Common.TenantId,
    workspaceId : Common.EntityId,
    userId : Common.UserId,
  ) : ?Types.WorkspaceMember {
    switch (getWorkspace(workspaces, tenantId, workspaceId)) {
      case null null;
      case (?ws) {
        let entry = ws.members.find(func(pair : (Common.UserId, Types.WorkspaceMember)) : Bool {
          Principal.equal(pair.0, userId)
        });
        switch (entry) {
          case (?(_, m)) ?m;
          case null null;
        }
      };
    }
  };

  public func isWorkspaceMember(
    workspaces : [(Common.EntityId, Types.Workspace)],
    tenantId : Common.TenantId,
    workspaceId : Common.EntityId,
    userId : Common.UserId,
  ) : Bool {
    switch (getWorkspaceMember(workspaces, tenantId, workspaceId, userId)) {
      case (?_) true;
      case null false;
    }
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
