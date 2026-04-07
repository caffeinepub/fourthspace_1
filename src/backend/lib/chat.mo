import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Types "../types/chat";
import Common "../types/common";

module {

  // ── Helpers ───────────────────────────────────────────────────────────────────

  func toChannelMap(store : [(Common.EntityId, Types.Channel)]) : Map.Map<Common.EntityId, Types.Channel> {
    Map.fromArray(store)
  };

  func toMessageMap(store : [(Common.EntityId, Types.Message)]) : Map.Map<Common.EntityId, Types.Message> {
    Map.fromArray(store)
  };

  func channelToStore(m : Map.Map<Common.EntityId, Types.Channel>) : [(Common.EntityId, Types.Channel)] {
    m.toArray()
  };

  func messageToStore(m : Map.Map<Common.EntityId, Types.Message>) : [(Common.EntityId, Types.Message)] {
    m.toArray()
  };

  func genId(salt : Text) : Common.EntityId {
    let ts = Time.now();
    ts.toText() # "-" # salt
  };

  func isMember(channel : Types.Channel, userId : Common.UserId) : Bool {
    channel.memberIds.any(func(id : Common.UserId) : Bool { Principal.equal(id, userId) })
  };

  // ── Channel Management ────────────────────────────────────────────────────────

  public func createChannel(
    channelStore : [(Common.EntityId, Types.Channel)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
    input : Types.ChannelInput,
  ) : (Types.Channel, [(Common.EntityId, Types.Channel)]) {
    let now = Time.now();
    let id = genId(caller.toText() # "ch");
    // Include caller in memberIds if not already present
    let members : [Common.UserId] = if (input.memberIds.any(func(id : Common.UserId) : Bool { Principal.equal(id, caller) })) {
      input.memberIds
    } else {
      input.memberIds.concat([caller])
    };
    let channel : Types.Channel = {
      id;
      tenantId;
      name = input.name;
      description = input.description;
      createdBy = caller;
      memberIds = members;
      isPublic = input.isPublic;
      createdAt = now;
    };
    let m = toChannelMap(channelStore);
    m.add(id, channel);
    (channel, channelToStore(m))
  };

  public func getChannel(
    channelStore : [(Common.EntityId, Types.Channel)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
  ) : ?Types.Channel {
    let m = toChannelMap(channelStore);
    switch (m.get(id)) {
      case (?ch) { if (ch.tenantId == tenantId) ?ch else null };
      case null null;
    }
  };

  public func listChannels(
    channelStore : [(Common.EntityId, Types.Channel)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
  ) : [Types.Channel] {
    let m = toChannelMap(channelStore);
    m.values().filter(
        func(ch : Types.Channel) : Bool {
          ch.tenantId == tenantId and (ch.isPublic or isMember(ch, caller))
        },
      ).toArray()
  };

  public func joinChannel(
    channelStore : [(Common.EntityId, Types.Channel)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : (?Types.Channel, [(Common.EntityId, Types.Channel)]) {
    let m = toChannelMap(channelStore);
    switch (m.get(id)) {
      case (?ch) {
        if (ch.tenantId != tenantId) return (null, channelStore);
        if (not ch.isPublic) return (null, channelStore); // private channels require invite
        if (isMember(ch, caller)) return (?ch, channelStore); // already a member
        let updated : Types.Channel = {
          ch with
          memberIds = ch.memberIds.concat([caller]);
        };
        m.add(id, updated);
        (?updated, channelToStore(m))
      };
      case null (null, channelStore);
    }
  };

  // ── Message Management ────────────────────────────────────────────────────────

  public func sendMessage(
    channelStore : [(Common.EntityId, Types.Channel)],
    messageStore : [(Common.EntityId, Types.Message)],
    tenantId : Common.TenantId,
    caller : Common.UserId,
    input : Types.MessageInput,
  ) : (?Types.Message, [(Common.EntityId, Types.Message)]) {
    // Access control: private channels require membership
    let chMap = toChannelMap(channelStore);
    switch (chMap.get(input.channelId)) {
      case (?ch) {
        if (ch.tenantId != tenantId) return (null, messageStore);
        if (not ch.isPublic and not isMember(ch, caller)) return (null, messageStore);
      };
      case null return (null, messageStore);
    };
    let now = Time.now();
    let id = genId(caller.toText() # "msg");
    let msg : Types.Message = {
      id;
      tenantId;
      channelId = input.channelId;
      senderId = caller;
      content = input.content;
      replyToId = input.replyToId;
      crossLinks = input.crossLinks;
      createdAt = now;
      updatedAt = now;
    };
    let mMap = toMessageMap(messageStore);
    mMap.add(id, msg);
    (?msg, messageToStore(mMap))
  };

  public func getMessages(
    messageStore : [(Common.EntityId, Types.Message)],
    tenantId : Common.TenantId,
    channelId : Common.EntityId,
    limit : Nat,
    before : ?Common.Timestamp,
  ) : [Types.Message] {
    let m = toMessageMap(messageStore);
    let filtered = m.values().filter(
        func(msg : Types.Message) : Bool {
          msg.tenantId == tenantId and
          msg.channelId == channelId and (
            switch (before) {
              case (?ts) msg.createdAt < ts;
              case null true;
            }
          )
        },
      ).toArray();
    // Sort by createdAt descending to get most recent first, then take limit
    let sorted = filtered.sort(func(a : Types.Message, b : Types.Message) : { #less; #equal; #greater } {
      if (a.createdAt > b.createdAt) #less
      else if (a.createdAt < b.createdAt) #greater
      else #equal
    });
    if (sorted.size() <= limit) sorted
    else sorted.sliceToArray(0, limit)
  };

  public func deleteMessage(
    messageStore : [(Common.EntityId, Types.Message)],
    tenantId : Common.TenantId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : (Bool, [(Common.EntityId, Types.Message)]) {
    let m = toMessageMap(messageStore);
    switch (m.get(id)) {
      case (?msg) {
        if (msg.tenantId != tenantId) return (false, messageStore);
        if (not Principal.equal(msg.senderId, caller)) return (false, messageStore);
        m.remove(id);
        (true, messageToStore(m))
      };
      case null (false, messageStore);
    }
  };
};
