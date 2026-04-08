import C "common";

module {
  // ── Reaction ──────────────────────────────────────────────────────────────────
  public type Reaction = {
    emoji : Text;
    userIds : [Principal];
  };

  // ── Message ───────────────────────────────────────────────────────────────────
  public type Message = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    channelId : C.EntityId;
    senderId : C.UserId;
    content : Text;
    replyToId : ?C.EntityId;
    crossLinks : [C.CrossLink];
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
    // Extended fields
    reactions : ?[Reaction];
    threadCount : ?Nat;
    isThreadReply : ?Bool;
  };

  // ── Channel ───────────────────────────────────────────────────────────────────
  public type UnreadEntry = {
    userId : Principal;
    count : Nat;
  };

  public type MentionEntry = {
    userId : Principal;
    hasMention : Bool;
  };

  public type Channel = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    name : Text;
    description : Text;
    createdBy : C.UserId;
    memberIds : [C.UserId];
    isPublic : Bool;
    createdAt : C.Timestamp;
    // Extended fields
    pinnedMessageIds : ?[Text];
    topic : ?Text;
    unreadCounts : ?[UnreadEntry];
    mentionFlags : ?[MentionEntry];
  };

  // ── UserStatus ────────────────────────────────────────────────────────────────
  public type UserStatus = {
    id : Principal;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    status : { #online; #away; #offline };
    customStatus : Text;
    lastSeen : Int;
  };

  // ── ThreadNotification ────────────────────────────────────────────────────────
  public type ThreadNotification = {
    id : Text;
    tenantId : C.TenantId;
    messageId : Text;
    channelId : Text;
    recipientId : Principal;
    senderId : Principal;
    createdAt : Int;
  };

  // ── Input Types ───────────────────────────────────────────────────────────────
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
