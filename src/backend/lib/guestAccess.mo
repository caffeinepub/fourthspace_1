import Common "../types/common";
import GATypes "../types/guestAccess";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Int "mo:core/Int";

module {

  func genId(prefix : Text, now : Int) : Common.EntityId {
    prefix # "-" # debug_show(now)
  };

  // Generate a 32-char pseudo-random token using LCG seeded by timestamp + email length
  func genToken(now : Int, email : Text) : Text {
    let charsArr : [Char] = [
      'a','b','c','d','e','f','g','h','i','j','k','l','m',
      'n','o','p','q','r','s','t','u','v','w','x','y','z',
      'A','B','C','D','E','F','G','H','I','J','K','L','M',
      'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
      '0','1','2','3','4','5','6','7','8','9',
    ];
    let charsSize = charsArr.size();
    var seed : Nat = Int.abs(now) + email.size() * 31337;
    let chars = Array.tabulate(32, func(_i) {
      seed := (seed * 1664525 + 1013904223) % 4294967296;
      charsArr[seed % charsSize]
    });
    chars.foldLeft<Char, Text>("", func(acc, c) { acc # Char.toText(c) })
  };

  public func createGuestInvitation(
    invitationStore : [(Common.EntityId, GATypes.GuestInvitation)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : GATypes.GuestInvitationInput,
  ) : (GATypes.GuestInvitation, [(Common.EntityId, GATypes.GuestInvitation)]) {
    let now = Time.now();
    let id = genId("ginv", now);
    let token = genToken(now, input.inviteeEmail);
    let invitation : GATypes.GuestInvitation = {
      id;
      tenantId;
      workspaceId;
      projectId = input.projectId;
      inviteeEmail = input.inviteeEmail;
      inviteToken = token;
      invitedBy = caller;
      expiresAt = input.expiresAt;
      accepted = false;
      createdAt = now;
    };
    (invitation, invitationStore.concat([(id, invitation)]))
  };

  public func acceptGuestInvitation(
    invitationStore : [(Common.EntityId, GATypes.GuestInvitation)],
    guestStore : [(Common.EntityId, GATypes.GuestUser)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    token : Text,
    acceptorPrincipal : Common.UserId,
  ) : (?GATypes.GuestUser, [(Common.EntityId, GATypes.GuestInvitation)], [(Common.EntityId, GATypes.GuestUser)]) {
    let now = Time.now();
    let found = invitationStore.find(
      func((_, inv)) {
        inv.inviteToken == token and inv.tenantId == tenantId and inv.workspaceId == workspaceId and not inv.accepted and inv.expiresAt > now
      },
    );
    switch found {
      case null (null, invitationStore, guestStore);
      case (?(invId, inv)) {
        let updatedInv : GATypes.GuestInvitation = {
          id = inv.id;
          tenantId = inv.tenantId;
          workspaceId = inv.workspaceId;
          projectId = inv.projectId;
          inviteeEmail = inv.inviteeEmail;
          inviteToken = inv.inviteToken;
          invitedBy = inv.invitedBy;
          expiresAt = inv.expiresAt;
          accepted = true;
          createdAt = inv.createdAt;
        };
        let newInvStore = invitationStore.map(
          func((k, v)) { if (k == invId) { (k, updatedInv) } else { (k, v) } },
        );
        let existingGuest = guestStore.find(
          func((_, g)) { g.email == inv.inviteeEmail and g.tenantId == tenantId and g.workspaceId == workspaceId },
        );
        switch existingGuest {
          case (?(gid, existing)) {
            let alreadyHas = existing.projectIds.find<Common.EntityId>(func(p) { p == inv.projectId }) != null;
            let newProjects = if alreadyHas { existing.projectIds } else {
              existing.projectIds.concat([inv.projectId])
            };
            let updated : GATypes.GuestUser = {
              id = existing.id;
              tenantId = existing.tenantId;
              workspaceId = existing.workspaceId;
              email = existing.email;
              principal = ?acceptorPrincipal;
              projectIds = newProjects;
              status = #Active;
              createdAt = existing.createdAt;
            };
            let newGuestStore = guestStore.map(
              func((k, v)) { if (k == gid) { (k, updated) } else { (k, v) } },
            );
            (?updated, newInvStore, newGuestStore)
          };
          case null {
            let guestId = genId("gu", now);
            let guest : GATypes.GuestUser = {
              id = guestId;
              tenantId;
              workspaceId;
              email = inv.inviteeEmail;
              principal = ?acceptorPrincipal;
              projectIds = [inv.projectId];
              status = #Active;
              createdAt = now;
            };
            (?guest, newInvStore, guestStore.concat([(guestId, guest)]))
          };
        }
      };
    }
  };

  public func listGuestUsers(
    store : [(Common.EntityId, GATypes.GuestUser)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [GATypes.GuestUser] {
    store.filter<(Common.EntityId, GATypes.GuestUser)>(func((_, g)) { g.tenantId == tenantId and g.workspaceId == workspaceId }).map<(Common.EntityId, GATypes.GuestUser), GATypes.GuestUser>(
      func((_, g)) { g },
    )
  };

  public func updateGuestStatus(
    store : [(Common.EntityId, GATypes.GuestUser)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    status : GATypes.GuestStatus,
    _caller : Common.UserId,
  ) : (?GATypes.GuestUser, [(Common.EntityId, GATypes.GuestUser)]) {
    let found = store.find(
      func((k, g)) { k == id and g.tenantId == tenantId and g.workspaceId == workspaceId },
    );
    switch found {
      case null (null, store);
      case (?(_, prev)) {
        let updated : GATypes.GuestUser = {
          id = prev.id;
          tenantId = prev.tenantId;
          workspaceId = prev.workspaceId;
          email = prev.email;
          principal = prev.principal;
          projectIds = prev.projectIds;
          status;
          createdAt = prev.createdAt;
        };
        let newStore = store.map(
          func((k, v)) { if (k == id) { (k, updated) } else { (k, v) } },
        );
        (?updated, newStore)
      };
    }
  };

  public func getGuestUser(
    store : [(Common.EntityId, GATypes.GuestUser)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : ?GATypes.GuestUser {
    switch (store.find<(Common.EntityId, GATypes.GuestUser)>(func((k, g)) { k == id and g.tenantId == tenantId and g.workspaceId == workspaceId })) {
      case (?(_, g)) ?g;
      case null null;
    }
  };
};
