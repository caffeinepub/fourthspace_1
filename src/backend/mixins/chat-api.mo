import Common "../types/common";
import CTypes "../types/chat";
import Chat "../lib/chat";

module {
  public type ChannelStore = [(Common.EntityId, CTypes.Channel)];
  public type MessageStore = [(Common.EntityId, CTypes.Message)];
  public type StatusStore = [(Text, CTypes.UserStatus)];
  public type NotifStore = [(Text, CTypes.ThreadNotification)];

  // ── Channel API ───────────────────────────────────────────────────────────────

  public func createChannel(
    channels : ChannelStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : CTypes.ChannelInput,
  ) : ({ #ok : CTypes.Channel; #err : Text }, ChannelStore) {
    let (ch, store) = Chat.createChannel(channels, tenantId, workspaceId, caller, input);
    (#ok ch, store)
  };

  public func getChannel(
    channels : ChannelStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : { #ok : CTypes.Channel; #err : Text } {
    switch (Chat.getChannel(channels, tenantId, workspaceId, id)) {
      case (?ch) #ok ch;
      case null #err "Channel not found";
    }
  };

  public func listChannels(
    channels : ChannelStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
  ) : [CTypes.Channel] {
    Chat.listChannels(channels, tenantId, workspaceId, caller)
  };

  public func joinChannel(
    channels : ChannelStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    id : Common.EntityId,
  ) : ({ #ok : CTypes.Channel; #err : Text }, ChannelStore) {
    switch (Chat.joinChannel(channels, tenantId, workspaceId, id, caller)) {
      case (?ch, store) (#ok ch, store);
      case (null, store) (#err "Channel not found or not public", store);
    }
  };

  public func leaveChannel(
    channels : ChannelStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    id : Common.EntityId,
  ) : ({ #ok : CTypes.Channel; #err : Text }, ChannelStore) {
    switch (Chat.leaveChannel(channels, tenantId, workspaceId, id, caller)) {
      case (?ch, store) (#ok ch, store);
      case (null, store) (#err "Channel not found", store);
    }
  };

  public func deleteChannel(
    channels : ChannelStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    id : Common.EntityId,
  ) : ({ #ok : Bool; #err : Text }, ChannelStore) {
    switch (Chat.deleteChannel(channels, tenantId, workspaceId, id, caller)) {
      case (true, store) (#ok true, store);
      case (false, store) (#err "Channel not found or unauthorized", store);
    }
  };

  public func updateChannelTopic(
    channels : ChannelStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    channelId : Common.EntityId,
    topic : Text,
  ) : ({ #ok : CTypes.Channel; #err : Text }, ChannelStore) {
    switch (Chat.updateChannelTopic(channels, tenantId, workspaceId, channelId, topic)) {
      case (?ch, store) (#ok ch, store);
      case (null, store) (#err "Channel not found", store);
    }
  };

  public func updateChannel(
    channels : ChannelStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    channelId : Common.EntityId,
    name : Text,
    description : Text,
    topic : Text,
  ) : ({ #ok : CTypes.Channel; #err : Text }, ChannelStore) {
    switch (Chat.updateChannel(channels, tenantId, workspaceId, channelId, name, description, topic)) {
      case (?ch, store) (#ok ch, store);
      case (null, store) (#err "Channel not found", store);
    }
  };

  public func createOrGetDMChannel(
    channels : ChannelStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    targetUserId : Common.UserId,
  ) : ({ #ok : CTypes.Channel; #err : Text }, ChannelStore) {
    switch (Chat.createOrGetDMChannel(channels, tenantId, workspaceId, caller, targetUserId)) {
      case (?ch, store) (#ok ch, store);
      case (null, store) (#err "Cannot create DM channel with yourself", store);
    }
  };

  // ── Message API ───────────────────────────────────────────────────────────────

  /// Send a message. Returns the message, updated message store, updated channel store (for unread counts), and updated notif store.
  public func sendMessage(
    channels : ChannelStore,
    messages : MessageStore,
    notifs : NotifStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : CTypes.MessageInput,
  ) : ({ #ok : CTypes.Message; #err : Text }, MessageStore, ChannelStore, NotifStore) {
    switch (Chat.sendMessage(channels, messages, tenantId, workspaceId, caller, input)) {
      case (?msg, msgStore, chStore) {
        // Notify thread participants when replying
        let notifStore : NotifStore = switch (input.replyToId) {
          case (?parentId) {
            let participants = Chat.getThreadParticipants(msgStore, tenantId, workspaceId, parentId);
            var ns = notifs;
            for (p in participants.values()) {
              if (not (p == caller)) {
                ns := Chat.addThreadNotification(ns, tenantId, workspaceId, msg.id, input.channelId, p, caller);
              };
            };
            ns
          };
          case null notifs;
        };
        (#ok msg, msgStore, chStore, notifStore)
      };
      case (null, msgStore, chStore) (#err "Cannot send message: channel not found or access denied", msgStore, chStore, notifs);
    }
  };

  public func getMessages(
    messages : MessageStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    channelId : Common.EntityId,
    limit : Nat,
    before : ?Common.Timestamp,
  ) : [CTypes.Message] {
    Chat.getMessages(messages, tenantId, workspaceId, channelId, limit, before)
  };

  public func listMessages(
    messages : MessageStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    channelId : Common.EntityId,
    limit : Nat,
    before : ?Common.Timestamp,
  ) : [CTypes.Message] {
    Chat.getMessages(messages, tenantId, workspaceId, channelId, limit, before)
  };

  public func deleteMessage(
    messages : MessageStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    id : Common.EntityId,
  ) : ({ #ok : Bool; #err : Text }, MessageStore) {
    let (ok, store) = Chat.deleteMessage(messages, tenantId, workspaceId, id, caller);
    if (ok) (#ok true, store)
    else (#err "Message not found or unauthorized", store)
  };

  public func getThreadMessages(
    messages : MessageStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    parentMessageId : Common.EntityId,
  ) : [CTypes.Message] {
    Chat.getThreadMessages(messages, tenantId, workspaceId, parentMessageId)
  };

  public func searchMessages(
    messages : MessageStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    searchQuery : Text,
    channelId : ?Common.EntityId,
    senderId : ?Principal,
    fromTime : ?Int,
    toTime : ?Int,
  ) : [CTypes.Message] {
    Chat.searchMessages(messages, tenantId, workspaceId, searchQuery, channelId, senderId, fromTime, toTime)
  };

  // ── Reaction API ──────────────────────────────────────────────────────────────

  public func addReaction(
    messages : MessageStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    messageId : Common.EntityId,
    emoji : Text,
    caller : Principal,
  ) : ({ #ok : CTypes.Message; #err : Text }, MessageStore) {
    switch (Chat.addReaction(messages, tenantId, workspaceId, messageId, emoji, caller)) {
      case (?msg, store) (#ok msg, store);
      case (null, store) (#err "Message not found", store);
    }
  };

  public func removeReaction(
    messages : MessageStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    messageId : Common.EntityId,
    emoji : Text,
    caller : Principal,
  ) : ({ #ok : CTypes.Message; #err : Text }, MessageStore) {
    switch (Chat.removeReaction(messages, tenantId, workspaceId, messageId, emoji, caller)) {
      case (?msg, store) (#ok msg, store);
      case (null, store) (#err "Message not found", store);
    }
  };

  // ── Pin API ───────────────────────────────────────────────────────────────────

  public func pinMessage(
    channels : ChannelStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    channelId : Common.EntityId,
    messageId : Text,
  ) : ({ #ok : CTypes.Channel; #err : Text }, ChannelStore) {
    switch (Chat.pinMessage(channels, tenantId, workspaceId, channelId, messageId)) {
      case (?ch, store) (#ok ch, store);
      case (null, store) (#err "Channel not found", store);
    }
  };

  public func unpinMessage(
    channels : ChannelStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    channelId : Common.EntityId,
    messageId : Text,
  ) : ({ #ok : CTypes.Channel; #err : Text }, ChannelStore) {
    switch (Chat.unpinMessage(channels, tenantId, workspaceId, channelId, messageId)) {
      case (?ch, store) (#ok ch, store);
      case (null, store) (#err "Channel not found", store);
    }
  };

  public func getPinnedMessages(
    channels : ChannelStore,
    messages : MessageStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    channelId : Common.EntityId,
  ) : [CTypes.Message] {
    Chat.getPinnedMessages(channels, messages, tenantId, workspaceId, channelId)
  };

  public func getChannelPins(
    channels : ChannelStore,
    messages : MessageStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    channelId : Common.EntityId,
  ) : [CTypes.Message] {
    Chat.getPinnedMessages(channels, messages, tenantId, workspaceId, channelId)
  };

  // ── User Status API ───────────────────────────────────────────────────────────

  public func setUserStatus(
    statusStore : StatusStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Principal,
    status : { #online; #away; #offline },
    customStatus : Text,
  ) : ({ #ok : CTypes.UserStatus; #err : Text }, StatusStore) {
    let (us, store) = Chat.setUserStatus(statusStore, tenantId, workspaceId, caller, status, customStatus);
    (#ok us, store)
  };

  public func updatePresence(
    statusStore : StatusStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Principal,
  ) : ({ #ok : CTypes.UserStatus; #err : Text }, StatusStore) {
    let (us, store) = Chat.updatePresence(statusStore, tenantId, workspaceId, caller);
    (#ok us, store)
  };

  public func getUserStatus(
    statusStore : StatusStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    userId : Principal,
  ) : ?CTypes.UserStatus {
    Chat.getUserStatus(statusStore, tenantId, workspaceId, userId)
  };

  public func listWorkspaceStatuses(
    statusStore : StatusStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [CTypes.UserStatus] {
    Chat.listWorkspaceStatuses(statusStore, tenantId, workspaceId)
  };

  // ── Unread API ────────────────────────────────────────────────────────────────

  public func markChannelRead(
    channels : ChannelStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    channelId : Common.EntityId,
    caller : Principal,
  ) : ({ #ok : Bool; #err : Text }, ChannelStore) {
    let (ok, store) = Chat.markChannelRead(channels, tenantId, workspaceId, channelId, caller);
    if (ok) (#ok true, store)
    else (#err "Channel not found", store)
  };

  public func getUnreadCounts(
    channels : ChannelStore,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Principal,
  ) : [(Text, Nat)] {
    Chat.getUnreadCounts(channels, tenantId, workspaceId, caller)
  };
};
