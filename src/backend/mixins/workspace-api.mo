import Principal "mo:core/Principal";
import Common "../types/common";
import WTypes "../types/workspace";
import WorkspaceLib "../lib/workspace";

mixin (
  workspaces : { var val : [(Common.EntityId, WTypes.Workspace)] },
  profiles : { var val : [(Common.UserId, WTypes.UserProfile)] },
) {

  public shared ({ caller }) func createWorkspace(
    tenantId : Common.TenantId,
    input : WTypes.WorkspaceInput,
    ownerDisplayName : Text,
    ownerEmail : Text,
  ) : async { #ok : WTypes.Workspace; #err : Text } {
    if (caller.isAnonymous()) {
      return #err("Unauthorized: must be authenticated");
    };
    let (ws, updated) = WorkspaceLib.createWorkspace(workspaces.val, tenantId, caller, input, ownerDisplayName, ownerEmail);
    workspaces.val := updated;
    #ok(ws)
  };

  public query ({ caller }) func getWorkspace(
    tenantId : Common.TenantId,
    id : Common.EntityId,
  ) : async { #ok : WTypes.Workspace; #err : Text } {
    switch (WorkspaceLib.getWorkspace(workspaces.val, tenantId, id)) {
      case (?ws) #ok(ws);
      case null #err("Workspace not found");
    }
  };

  public query ({ caller }) func listWorkspaces(
    tenantId : Common.TenantId,
  ) : async [WTypes.Workspace] {
    WorkspaceLib.listWorkspaces(workspaces.val, tenantId)
  };

  public shared ({ caller }) func updateWorkspace(
    tenantId : Common.TenantId,
    workspaceId : Common.EntityId,
    name : Text,
  ) : async { #ok : WTypes.Workspace; #err : Text } {
    if (caller.isAnonymous()) {
      return #err("Unauthorized: must be authenticated");
    };
    let (result, updated) = WorkspaceLib.updateWorkspace(workspaces.val, tenantId, workspaceId, caller, name);
    switch (result) {
      case (#ok(ws)) {
        workspaces.val := updated;
        #ok(ws)
      };
      case (#err(msg)) #err(msg);
    }
  };

  public shared ({ caller }) func addWorkspaceMember(
    tenantId : Common.TenantId,
    workspaceId : Common.EntityId,
    userId : Common.UserId,
    role : WTypes.WorkspaceRole,
    displayName : Text,
    email : Text,
  ) : async { #ok : WTypes.WorkspaceMember; #err : Text } {
    if (caller.isAnonymous()) {
      return #err("Unauthorized: must be authenticated");
    };
    let (result, updated) = WorkspaceLib.addWorkspaceMember(workspaces.val, tenantId, workspaceId, userId, role, displayName, email);
    switch (result) {
      case (#ok(member)) {
        workspaces.val := updated;
        #ok(member)
      };
      case (#err(msg)) #err(msg);
    }
  };

  public shared ({ caller }) func removeWorkspaceMember(
    tenantId : Common.TenantId,
    workspaceId : Common.EntityId,
    targetUserId : Common.UserId,
  ) : async { #ok; #err : Text } {
    if (caller.isAnonymous()) {
      return #err("Unauthorized: must be authenticated");
    };
    let (result, updated) = WorkspaceLib.removeWorkspaceMember(workspaces.val, tenantId, workspaceId, caller, targetUserId);
    switch (result) {
      case (#ok) {
        workspaces.val := updated;
        #ok
      };
      case (#err(msg)) #err(msg);
    }
  };

  public shared ({ caller }) func updateWorkspaceMemberRole(
    tenantId : Common.TenantId,
    workspaceId : Common.EntityId,
    targetUserId : Common.UserId,
    newRole : WTypes.WorkspaceRole,
  ) : async { #ok : WTypes.WorkspaceMember; #err : Text } {
    if (caller.isAnonymous()) {
      return #err("Unauthorized: must be authenticated");
    };
    let (result, updated) = WorkspaceLib.updateWorkspaceMemberRole(workspaces.val, tenantId, workspaceId, caller, targetUserId, newRole);
    switch (result) {
      case (#ok(member)) {
        workspaces.val := updated;
        #ok(member)
      };
      case (#err(msg)) #err(msg);
    }
  };

  public query ({ caller }) func listWorkspaceMembers(
    tenantId : Common.TenantId,
    workspaceId : Common.EntityId,
  ) : async [WTypes.WorkspaceMember] {
    WorkspaceLib.listWorkspaceMembers(workspaces.val, tenantId, workspaceId)
  };

  public query ({ caller }) func getWorkspaceMember(
    tenantId : Common.TenantId,
    workspaceId : Common.EntityId,
    userId : Common.UserId,
  ) : async ?WTypes.WorkspaceMember {
    WorkspaceLib.getWorkspaceMember(workspaces.val, tenantId, workspaceId, userId)
  };

  public query ({ caller }) func getMyProfile(
    tenantId : Common.TenantId,
  ) : async ?WTypes.UserProfile {
    switch (WorkspaceLib.getProfile(profiles.val, caller)) {
      case (?p) {
        if (p.tenantId == tenantId) ?p else null
      };
      case null null;
    }
  };

  public shared ({ caller }) func upsertProfile(
    tenantId : Common.TenantId,
    input : WTypes.UserProfileInput,
  ) : async { #ok : WTypes.UserProfile; #err : Text } {
    if (caller.isAnonymous()) {
      return #err("Unauthorized: must be authenticated");
    };
    let (profile, updated) = WorkspaceLib.createProfile(profiles.val, tenantId, caller, input);
    profiles.val := updated;
    #ok(profile)
  };

  public query ({ caller }) func listProfiles(
    tenantId : Common.TenantId,
  ) : async [WTypes.UserProfile] {
    WorkspaceLib.listProfiles(profiles.val, tenantId)
  };

};
