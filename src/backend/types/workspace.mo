import C "common";

module {
  public type WorkspaceRole = {
    #Admin;
    #Manager;
    #TeamMember;
    #Guest;
  };

  public type WorkspaceMember = {
    workspaceId : C.WorkspaceId;
    userId : C.UserId;
    role : WorkspaceRole;
    joinedAt : C.Timestamp;
    displayName : Text;
    email : Text;
  };

  public type Workspace = {
    id : C.EntityId;
    tenantId : C.TenantId;
    name : Text;
    ownerId : C.UserId;
    createdAt : C.Timestamp;
    members : [(C.UserId, WorkspaceMember)];
  };

  public type UserProfile = {
    userId : C.UserId;
    tenantId : C.TenantId;
    displayName : Text;
    email : Text;
    role : C.Role;
    workspaceId : C.EntityId;
    createdAt : C.Timestamp;
  };

  public type WorkspaceInput = {
    name : Text;
  };

  public type UserProfileInput = {
    displayName : Text;
    email : Text;
    role : C.Role;
    workspaceId : C.EntityId;
  };
};
