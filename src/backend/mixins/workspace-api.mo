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
  ) : async { #ok : WTypes.Workspace; #err : Text } {
    if (caller.isAnonymous()) {
      return #err("Unauthorized: must be authenticated");
    };
    let (ws, updated) = WorkspaceLib.createWorkspace(workspaces.val, tenantId, caller, input);
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
