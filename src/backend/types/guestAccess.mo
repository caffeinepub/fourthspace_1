import C "common";

module {
  public type GuestStatus = {
    #Pending;
    #Active;
    #Revoked;
  };

  public type GuestUser = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    email : Text;
    principal : ?C.UserId;
    projectIds : [C.EntityId];
    status : GuestStatus;
    createdAt : C.Timestamp;
  };

  public type GuestInvitation = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    projectId : C.EntityId;
    inviteeEmail : Text;
    inviteToken : Text;
    invitedBy : C.UserId;
    expiresAt : C.Timestamp;
    accepted : Bool;
    createdAt : C.Timestamp;
  };

  public type GuestInvitationInput = {
    projectId : C.EntityId;
    inviteeEmail : Text;
    expiresAt : C.Timestamp;
  };
};
