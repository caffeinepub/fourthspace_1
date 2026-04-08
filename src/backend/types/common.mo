import Time "mo:core/Time";

module {
  public type TenantId = Text;
  public type WorkspaceId = Text;
  public type UserId = Principal;
  public type EntityId = Text;
  public type Timestamp = Int;

  public type Role = {
    #Admin;
    #Manager;
    #TeamMember;
  };

  public type CrossLink = {
    entityType : Text;
    entityId : EntityId;
    tenantId : TenantId;
    linkLabel : Text;
  };

  public type PayFrequency = {
    #Weekly;
    #BiWeekly;
    #SemiMonthly;
    #Monthly;
    #Quarterly;
  };
};
