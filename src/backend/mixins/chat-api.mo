import Common "../types/common";
import CTypes "../types/chat";
import Chat "../lib/chat";

module {
  public type ChannelStore = [(Common.EntityId, CTypes.Channel)];
  public type MessageStore = [(Common.EntityId, CTypes.Message)];

  // ── Channel API ───────────────────────────────────────────────────────────────

  public func createChannel(
    channels : ChannelStore,
    tenantId : Common.TenantId,
    caller : Common.UserId,
    input : CTypes.ChannelInput,
  ) : ({ #ok : CTypes.Channel; #err : Text }, ChannelStore) {
    let (channel, newStore) = Chat.createChannel(channels, tenantId, caller, input);
    (#ok channel, newStore)
  };

  public func getChannel(
    channels : ChannelStore,
    tenantId : Common.TenantId,
    id : Common.EntityId,
  ) : { #ok : CTypes.Channel; #err : Text } {
    switch (Chat.getChannel(channels, tenantId, id)) {
      case (?ch) #ok ch;
      case null #err "Channel not found";
    }
  };

  public func listChannels(
    channels : ChannelStore,
    tenantId : Common.TenantId,
    caller : Common.UserId,
  ) : [CTypes.Channel] {
    Chat.listChannels(channels, tenantId, caller)
  };

  public func joinChannel(
    channels : ChannelStore,
    tenantId : Common.TenantId,
    caller : Common.UserId,
    id : Common.EntityId,
  ) : ({ #ok : CTypes.Channel; #err : Text }, ChannelStore) {
    let (result, newStore) = Chat.joinChannel(channels, tenantId, id, caller);
    switch (result) {
      case (?ch) (#ok ch, newStore);
      case null (#err "Channel not found or access denied", channels);
    }
  };

  // ── Message API ───────────────────────────────────────────────────────────────

  public func sendMessage(
    channels : ChannelStore,
    messages : MessageStore,
    tenantId : Common.TenantId,
    caller : Common.UserId,
    input : CTypes.MessageInput,
  ) : ({ #ok : CTypes.Message; #err : Text }, MessageStore) {
    let (result, newStore) = Chat.sendMessage(channels, messages, tenantId, caller, input);
    switch (result) {
      case (?msg) (#ok msg, newStore);
      case null (#err "Send failed: channel not found or access denied", messages);
    }
  };

  public func getMessages(
    messages : MessageStore,
    tenantId : Common.TenantId,
    channelId : Common.EntityId,
    limit : Nat,
    before : ?Common.Timestamp,
  ) : [CTypes.Message] {
    Chat.getMessages(messages, tenantId, channelId, limit, before)
  };

  public func deleteMessage(
    messages : MessageStore,
    tenantId : Common.TenantId,
    caller : Common.UserId,
    id : Common.EntityId,
  ) : ({ #ok : Bool; #err : Text }, MessageStore) {
    let (deleted, newStore) = Chat.deleteMessage(messages, tenantId, id, caller);
    if (deleted) (#ok true, newStore)
    else (#err "Message not found or not authorized", messages)
  };
};
