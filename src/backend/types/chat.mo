import C "common";

module {
  public type Channel = {
    id : C.EntityId;
    tenantId : C.TenantId;
    name : Text;
    description : Text;
    createdBy : C.UserId;
    memberIds : [C.UserId];
    isPublic : Bool;
    createdAt : C.Timestamp;
  };

  public type Message = {
    id : C.EntityId;
    tenantId : C.TenantId;
    channelId : C.EntityId;
    senderId : C.UserId;
    content : Text;
    replyToId : ?C.EntityId;
    crossLinks : [C.CrossLink];
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type ChannelInput = {
    name : Text;
    description : Text;
    isPublic : Bool;
    memberIds : [C.UserId];
  };

  public type MessageInput = {
    channelId : C.EntityId;
    content : Text;
    replyToId : ?C.EntityId;
    crossLinks : [C.CrossLink];
  };
};
