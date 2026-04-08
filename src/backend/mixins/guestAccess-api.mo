import Common "../types/common";
import GATypes "../types/guestAccess";
import GALib "../lib/guestAccess";

module {

  public func createGuestInvitation(
    invitationStore : [(Common.EntityId, GATypes.GuestInvitation)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : GATypes.GuestInvitationInput,
  ) : { result : { #ok : GATypes.GuestInvitation; #err : Text }; store : [(Common.EntityId, GATypes.GuestInvitation)] } {
    let (inv, newStore) = GALib.createGuestInvitation(invitationStore, tenantId, workspaceId, caller, input);
    { result = #ok inv; store = newStore }
  };

  public func acceptGuestInvitation(
    invitationStore : [(Common.EntityId, GATypes.GuestInvitation)],
    guestStore : [(Common.EntityId, GATypes.GuestUser)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    token : Text,
    caller : Common.UserId,
  ) : { result : { #ok : GATypes.GuestUser; #err : Text }; invitationStore : [(Common.EntityId, GATypes.GuestInvitation)]; guestStore : [(Common.EntityId, GATypes.GuestUser)] } {
    let (optGuest, newInvStore, newGuestStore) = GALib.acceptGuestInvitation(invitationStore, guestStore, tenantId, workspaceId, token, caller);
    switch optGuest {
      case (?guest) {
        { result = #ok guest; invitationStore = newInvStore; guestStore = newGuestStore }
      };
      case null {
        { result = #err "Invalid or expired invitation token"; invitationStore; guestStore }
      };
    }
  };

  public func listGuestUsers(
    store : [(Common.EntityId, GATypes.GuestUser)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [GATypes.GuestUser] {
    GALib.listGuestUsers(store, tenantId, workspaceId)
  };

  public func updateGuestStatus(
    store : [(Common.EntityId, GATypes.GuestUser)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    status : GATypes.GuestStatus,
    caller : Common.UserId,
  ) : { result : { #ok : GATypes.GuestUser; #err : Text }; store : [(Common.EntityId, GATypes.GuestUser)] } {
    let (opt, newStore) = GALib.updateGuestStatus(store, tenantId, workspaceId, id, status, caller);
    switch opt {
      case (?guest) { { result = #ok guest; store = newStore } };
      case null { { result = #err "Guest user not found"; store } };
    }
  };

  public func getGuestUser(
    store : [(Common.EntityId, GATypes.GuestUser)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : ?GATypes.GuestUser {
    GALib.getGuestUser(store, tenantId, workspaceId, id)
  };
};
