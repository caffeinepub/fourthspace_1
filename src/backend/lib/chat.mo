import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
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

  func toStatusMap(store : [(Text, Types.UserStatus)]) : Map.Map<Text, Types.UserStatus> {
    Map.fromArray(store)
  };

  func toNotifMap(store : [(Text, Types.ThreadNotification)]) : Map.Map<Text, Types.ThreadNotification> {
    Map.fromArray(store)
  };

  func channelToStore(m : Map.Map<Common.EntityId, Types.Channel>) : [(Common.EntityId, Types.Channel)] {
    m.toArray()
  };

  func messageToStore(m : Map.Map<Common.EntityId, Types.Message>) : [(Common.EntityId, Types.Message)] {
    m.toArray()
  };

  func statusToStore(m : Map.Map<Text, Types.UserStatus>) : [(Text, Types.UserStatus)] {
    m.toArray()
  };

  func notifToStore(m : Map.Map<Text, Types.ThreadNotification>) : [(Text, Types.ThreadNotification)] {
    m.toArray()
  };

  func genId(salt : Text) : Common.EntityId {
    let ts = Time.now();
    ts.toText() # "-" # salt
  };

  func statusKey(tenantId : Common.TenantId, workspaceId : Common.WorkspaceId, userId : Principal) : Text {
    tenantId # ":" # workspaceId # ":" # userId.toText()
  };

  func isMember(channel : Types.Channel, userId : Common.UserId) : Bool {
    channel.memberIds.any(func(id : Common.UserId) : Bool { Principal.equal(id, userId) })
  };

  // Increment unread count for all channel members except the sender.
  func incrementUnreadForMembers(ch : Types.Channel, sender : Common.UserId) : Types.Channel {
    let counts : [Types.UnreadEntry] = switch (ch.unreadCounts) { case (?uc) uc; case null [] };
    // Build a set of member IDs for whom an entry already exists
    var updatedCounts = counts.map(func(e : Types.UnreadEntry) : Types.UnreadEntry {
      if (Principal.equal(e.userId, sender)) e
      else ({ e with count = e.count + 1 })
    });
    // Add entries for members who have no unread entry yet (except sender)
    for (memberId in ch.memberIds.values()) {
      if (not Principal.equal(memberId, sender)) {
        let hasEntry = updatedCounts.any(func(e : Types.UnreadEntry) : Bool { Principal.equal(e.userId, memberId) });
        if (not hasEntry) {
          updatedCounts := updatedCounts.concat([{ userId = memberId; count = 1 }]);
        };
      };
    };
    { ch with unreadCounts = ?updatedCounts }
  };

  // ── Channel Management ────────────────────────────────────────────────────────

  public func createChannel(
    channelStore : [(Common.EntityId, Types.Channel)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : Types.ChannelInput,
  ) : (Types.Channel, [(Common.EntityId, Types.Channel)]) {
    let now = Time.now();
    let id = genId(caller.toText() # "ch");
    let members : [Common.UserId] = if (input.memberIds.any(func(uid : Common.UserId) : Bool { Principal.equal(uid, caller) })) {
      input.memberIds
    } else {
      input.memberIds.concat([caller])
    };
    let channel : Types.Channel = {
      id;
      tenantId;
      workspaceId;
      name = input.name;
      description = input.description;
      createdBy = caller;
      memberIds = members;
      isPublic = input.isPublic;
      createdAt = now;
      pinnedMessageIds = ?[];
      topic = ?"";
      unreadCounts = ?[];
      mentionFlags = ?[];
    };
    let m = toChannelMap(channelStore);
    m.add(id, channel);
    (channel, channelToStore(m))
  };

  public func getChannel(
    channelStore : [(Common.EntityId, Types.Channel)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : ?Types.Channel {
    let m = toChannelMap(channelStore);
    switch (m.get(id)) {
      case (?ch) { if (ch.tenantId == tenantId and ch.workspaceId == workspaceId) ?ch else null };
      case null null;
    }
  };

  public func listChannels(
    channelStore : [(Common.EntityId, Types.Channel)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
  ) : [Types.Channel] {
    let m = toChannelMap(channelStore);
    m.values().filter(
        func(ch : Types.Channel) : Bool {
          ch.tenantId == tenantId and ch.workspaceId == workspaceId and (ch.isPublic or isMember(ch, caller))
        },
      ).toArray()
  };

  public func joinChannel(
    channelStore : [(Common.EntityId, Types.Channel)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : (?Types.Channel, [(Common.EntityId, Types.Channel)]) {
    let m = toChannelMap(channelStore);
    switch (m.get(id)) {
      case (?ch) {
        if (ch.tenantId != tenantId or ch.workspaceId != workspaceId) return (null, channelStore);
        if (not ch.isPublic) return (null, channelStore);
        if (isMember(ch, caller)) return (?ch, channelStore);
        let updated : Types.Channel = { ch with memberIds = ch.memberIds.concat([caller]) };
        m.add(id, updated);
        (?updated, channelToStore(m))
      };
      case null (null, channelStore);
    }
  };

  public func updateChannelTopic(
    channelStore : [(Common.EntityId, Types.Channel)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    channelId : Common.EntityId,
    topic : Text,
  ) : (?Types.Channel, [(Common.EntityId, Types.Channel)]) {
    let m = toChannelMap(channelStore);
    switch (m.get(channelId)) {
      case (?ch) {
        if (ch.tenantId != tenantId or ch.workspaceId != workspaceId) return (null, channelStore);
        let updated : Types.Channel = { ch with topic = ?topic };
        m.add(channelId, updated);
        (?updated, channelToStore(m))
      };
      case null (null, channelStore);
    }
  };

  public func leaveChannel(
    channelStore : [(Common.EntityId, Types.Channel)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : (?Types.Channel, [(Common.EntityId, Types.Channel)]) {
    let m = toChannelMap(channelStore);
    switch (m.get(id)) {
      case (?ch) {
        if (ch.tenantId != tenantId or ch.workspaceId != workspaceId) return (null, channelStore);
        let updated : Types.Channel = { ch with memberIds = ch.memberIds.filter(func(uid : Common.UserId) : Bool { not Principal.equal(uid, caller) }) };
        m.add(id, updated);
        (?updated, channelToStore(m))
      };
      case null (null, channelStore);
    }
  };

  public func deleteChannel(
    channelStore : [(Common.EntityId, Types.Channel)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : (Bool, [(Common.EntityId, Types.Channel)]) {
    let m = toChannelMap(channelStore);
    switch (m.get(id)) {
      case (?ch) {
        if (ch.tenantId != tenantId or ch.workspaceId != workspaceId) return (false, channelStore);
        if (not Principal.equal(ch.createdBy, caller)) return (false, channelStore);
        m.remove(id);
        (true, channelToStore(m))
      };
      case null (false, channelStore);
    }
  };

  public func updateChannel(
    channelStore : [(Common.EntityId, Types.Channel)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    channelId : Common.EntityId,
    name : Text,
    description : Text,
    topic : Text,
  ) : (?Types.Channel, [(Common.EntityId, Types.Channel)]) {
    let m = toChannelMap(channelStore);
    switch (m.get(channelId)) {
      case (?ch) {
        if (ch.tenantId != tenantId or ch.workspaceId != workspaceId) return (null, channelStore);
        let updated : Types.Channel = { ch with name; description; topic = ?topic };
        m.add(channelId, updated);
        (?updated, channelToStore(m))
      };
      case null (null, channelStore);
    }
  };

  // ── DM (Direct Message) Channel ────────────────────────────────────────────────

  /// Create or find an existing DM channel between two users.
  /// DM channels are private (isPublic=false) with exactly 2 members.
  /// The name is derived deterministically from the two principals (sorted).
  /// A user cannot create a DM channel with themselves.
  public func createOrGetDMChannel(
    channelStore : [(Common.EntityId, Types.Channel)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    targetUserId : Common.UserId,
  ) : (?Types.Channel, [(Common.EntityId, Types.Channel)]) {
    // Prevent self-DM
    if (Principal.equal(caller, targetUserId)) {
      return (null, channelStore);
    };
    let callerText = caller.toText();
    let targetText = targetUserId.toText();
    // Deterministic DM name so both participants find the same channel
    let dmName = if (callerText < targetText) {
      "dm:" # callerText # ":" # targetText
    } else {
      "dm:" # targetText # ":" # callerText
    };
    let m = toChannelMap(channelStore);
    // Search for an existing DM channel with this exact name in this workspace
    switch (m.values().find(func(ch : Types.Channel) : Bool {
      ch.tenantId == tenantId and ch.workspaceId == workspaceId and ch.name == dmName
    })) {
      case (?existing) (?existing, channelStore);
      case null {
        let now = Time.now();
        let id = genId(dmName);
        let channel : Types.Channel = {
          id;
          tenantId;
          workspaceId;
          name = dmName;
          description = "";
          createdBy = caller;
          memberIds = [caller, targetUserId];
          isPublic = false;
          createdAt = now;
          pinnedMessageIds = ?[];
          topic = ?"";
          unreadCounts = ?[];
          mentionFlags = ?[];
        };
        m.add(id, channel);
        (?channel, channelToStore(m))
      };
    }
  };

  // ── Message Management ────────────────────────────────────────────────────────

  /// Send a message, persist it, and increment unread counts for all other channel members.
  /// Returns the new message, the updated message store, and the updated channel store.
  public func sendMessage(
    channelStore : [(Common.EntityId, Types.Channel)],
    messageStore : [(Common.EntityId, Types.Message)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : Types.MessageInput,
  ) : (?Types.Message, [(Common.EntityId, Types.Message)], [(Common.EntityId, Types.Channel)]) {
    let chMap = toChannelMap(channelStore);
    switch (chMap.get(input.channelId)) {
      case (?ch) {
        if (ch.tenantId != tenantId or ch.workspaceId != workspaceId) return (null, messageStore, channelStore);
        if (not ch.isPublic and not isMember(ch, caller)) return (null, messageStore, channelStore);
        // Increment unread counts for all members except the sender
        let updatedCh = incrementUnreadForMembers(ch, caller);
        chMap.add(input.channelId, updatedCh);
      };
      case null return (null, messageStore, channelStore);
    };
    let now = Time.now();
    let id = genId(caller.toText() # "msg");
    let isThread : ?Bool = switch (input.replyToId) {
      case (?_) ?true;
      case null null;
    };
    let msg : Types.Message = {
      id;
      tenantId;
      workspaceId;
      channelId = input.channelId;
      senderId = caller;
      content = input.content;
      replyToId = input.replyToId;
      crossLinks = input.crossLinks;
      createdAt = now;
      updatedAt = now;
      reactions = ?[];
      threadCount = ?0;
      isThreadReply = isThread;
    };
    let mMap = toMessageMap(messageStore);
    mMap.add(id, msg);
    // Bump parent threadCount if this is a thread reply
    switch (input.replyToId) {
      case (?parentId) {
        switch (mMap.get(parentId)) {
          case (?parent) {
            let count = switch (parent.threadCount) { case (?n) n; case null 0 };
            let updatedParent : Types.Message = { parent with threadCount = ?(count + 1) };
            mMap.add(parentId, updatedParent);
          };
          case null {};
        };
      };
      case null {};
    };
    (?msg, messageToStore(mMap), channelToStore(chMap))
  };

  public func getMessages(
    messageStore : [(Common.EntityId, Types.Message)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    channelId : Common.EntityId,
    limit : Nat,
    before : ?Common.Timestamp,
  ) : [Types.Message] {
    let m = toMessageMap(messageStore);
    let filtered = m.values().filter(
        func(msg : Types.Message) : Bool {
          msg.tenantId == tenantId and
          msg.workspaceId == workspaceId and
          msg.channelId == channelId and
          msg.isThreadReply != ?true and (
            switch (before) {
              case (?ts) msg.createdAt < ts;
              case null true;
            }
          )
        },
      ).toArray();
    // Sort ascending by timestamp (oldest first — chronological order for chat)
    let sorted = filtered.sort(func(a : Types.Message, b : Types.Message) : { #less; #equal; #greater } {
      if (a.createdAt < b.createdAt) #less
      else if (a.createdAt > b.createdAt) #greater
      else #equal
    });
    if (sorted.size() <= limit) sorted
    else sorted.sliceToArray(sorted.size() - limit, sorted.size())
  };

  public func deleteMessage(
    messageStore : [(Common.EntityId, Types.Message)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    caller : Common.UserId,
  ) : (Bool, [(Common.EntityId, Types.Message)]) {
    let m = toMessageMap(messageStore);
    switch (m.get(id)) {
      case (?msg) {
        if (msg.tenantId != tenantId or msg.workspaceId != workspaceId) return (false, messageStore);
        if (not Principal.equal(msg.senderId, caller)) return (false, messageStore);
        m.remove(id);
        (true, messageToStore(m))
      };
      case null (false, messageStore);
    }
  };

  public func getThreadMessages(
    messageStore : [(Common.EntityId, Types.Message)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    parentMessageId : Common.EntityId,
  ) : [Types.Message] {
    let m = toMessageMap(messageStore);
    m.values().filter(
        func(msg : Types.Message) : Bool {
          msg.tenantId == tenantId and
          msg.workspaceId == workspaceId and
          msg.replyToId == ?parentMessageId
        },
      ).toArray()
      .sort(func(a : Types.Message, b : Types.Message) : { #less; #equal; #greater } {
        if (a.createdAt < b.createdAt) #less
        else if (a.createdAt > b.createdAt) #greater
        else #equal
      })
  };

  public func searchMessages(
    messageStore : [(Common.EntityId, Types.Message)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    searchQuery : Text,
    channelId : ?Common.EntityId,
    senderId : ?Principal,
    fromTime : ?Int,
    toTime : ?Int,
  ) : [Types.Message] {
    let m = toMessageMap(messageStore);
    let lq = searchQuery.toLower();
    m.values().filter(
        func(msg : Types.Message) : Bool {
          if (msg.tenantId != tenantId or msg.workspaceId != workspaceId) return false;
          if (not msg.content.toLower().contains(#text lq)) return false;
          switch (channelId) {
            case (?cid) { if (msg.channelId != cid) return false };
            case null {};
          };
          switch (senderId) {
            case (?sid) { if (not Principal.equal(msg.senderId, sid)) return false };
            case null {};
          };
          switch (fromTime) {
            case (?ft) { if (msg.createdAt < ft) return false };
            case null {};
          };
          switch (toTime) {
            case (?tt) { if (msg.createdAt > tt) return false };
            case null {};
          };
          true
        },
      ).toArray()
  };

  // ── Reactions ─────────────────────────────────────────────────────────────────

  public func addReaction(
    messageStore : [(Common.EntityId, Types.Message)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    messageId : Common.EntityId,
    emoji : Text,
    caller : Principal,
  ) : (?Types.Message, [(Common.EntityId, Types.Message)]) {
    let m = toMessageMap(messageStore);
    switch (m.get(messageId)) {
      case (?msg) {
        if (msg.tenantId != tenantId or msg.workspaceId != workspaceId) return (null, messageStore);
        let existing : [Types.Reaction] = switch (msg.reactions) { case (?r) r; case null [] };
        // Find if emoji already exists
        let updated : [Types.Reaction] = switch (existing.findIndex(func(r : Types.Reaction) : Bool { r.emoji == emoji })) {
          case (?idx) {
            let reaction = existing[idx];
            if (reaction.userIds.any(func(uid : Principal) : Bool { Principal.equal(uid, caller) })) {
              // Already reacted — no change
              existing
            } else {
              existing.mapEntries(func(r : Types.Reaction, i : Nat) : Types.Reaction {
                if (i == idx) { { r with userIds = r.userIds.concat([caller]) } }
                else r
              })
            }
          };
          case null {
            existing.concat([{ emoji; userIds = [caller] }])
          };
        };
        let updatedMsg : Types.Message = { msg with reactions = ?updated };
        m.add(messageId, updatedMsg);
        (?updatedMsg, messageToStore(m))
      };
      case null (null, messageStore);
    }
  };

  public func removeReaction(
    messageStore : [(Common.EntityId, Types.Message)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    messageId : Common.EntityId,
    emoji : Text,
    caller : Principal,
  ) : (?Types.Message, [(Common.EntityId, Types.Message)]) {
    let m = toMessageMap(messageStore);
    switch (m.get(messageId)) {
      case (?msg) {
        if (msg.tenantId != tenantId or msg.workspaceId != workspaceId) return (null, messageStore);
        let existing : [Types.Reaction] = switch (msg.reactions) { case (?r) r; case null [] };
        let updated : [Types.Reaction] = existing
          .map(func(r : Types.Reaction) : Types.Reaction {
            if (r.emoji == emoji) {
              { r with userIds = r.userIds.filter(func(uid : Principal) : Bool { not Principal.equal(uid, caller) }) }
            } else r
          })
          .filter(func(r : Types.Reaction) : Bool { r.userIds.size() > 0 });
        let updatedMsg : Types.Message = { msg with reactions = ?updated };
        m.add(messageId, updatedMsg);
        (?updatedMsg, messageToStore(m))
      };
      case null (null, messageStore);
    }
  };

  // ── Pinned Messages ───────────────────────────────────────────────────────────

  public func pinMessage(
    channelStore : [(Common.EntityId, Types.Channel)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    channelId : Common.EntityId,
    messageId : Text,
  ) : (?Types.Channel, [(Common.EntityId, Types.Channel)]) {
    let m = toChannelMap(channelStore);
    switch (m.get(channelId)) {
      case (?ch) {
        if (ch.tenantId != tenantId or ch.workspaceId != workspaceId) return (null, channelStore);
        let pins : [Text] = switch (ch.pinnedMessageIds) { case (?p) p; case null [] };
        let alreadyPinned = pins.any(func(id : Text) : Bool { id == messageId });
        let updatedPins = if (alreadyPinned) pins else pins.concat([messageId]);
        let updated : Types.Channel = { ch with pinnedMessageIds = ?updatedPins };
        m.add(channelId, updated);
        (?updated, channelToStore(m))
      };
      case null (null, channelStore);
    }
  };

  public func unpinMessage(
    channelStore : [(Common.EntityId, Types.Channel)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    channelId : Common.EntityId,
    messageId : Text,
  ) : (?Types.Channel, [(Common.EntityId, Types.Channel)]) {
    let m = toChannelMap(channelStore);
    switch (m.get(channelId)) {
      case (?ch) {
        if (ch.tenantId != tenantId or ch.workspaceId != workspaceId) return (null, channelStore);
        let pins : [Text] = switch (ch.pinnedMessageIds) { case (?p) p; case null [] };
        let updated : Types.Channel = { ch with pinnedMessageIds = ?pins.filter(func(id : Text) : Bool { id != messageId }) };
        m.add(channelId, updated);
        (?updated, channelToStore(m))
      };
      case null (null, channelStore);
    }
  };

  public func getPinnedMessages(
    channelStore : [(Common.EntityId, Types.Channel)],
    messageStore : [(Common.EntityId, Types.Message)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    channelId : Common.EntityId,
  ) : [Types.Message] {
    let chMap = toChannelMap(channelStore);
    switch (chMap.get(channelId)) {
      case (?ch) {
        if (ch.tenantId != tenantId or ch.workspaceId != workspaceId) return [];
        let pins : [Text] = switch (ch.pinnedMessageIds) { case (?p) p; case null [] };
        let mMap = toMessageMap(messageStore);
        pins.filterMap<Text, Types.Message>(func(pid : Text) : ?Types.Message { mMap.get(pid) })
      };
      case null [];
    }
  };

  // ── User Status & Presence ────────────────────────────────────────────────────

  public func setUserStatus(
    statusStore : [(Text, Types.UserStatus)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Principal,
    status : { #online; #away; #offline },
    customStatus : Text,
  ) : (Types.UserStatus, [(Text, Types.UserStatus)]) {
    let m = toStatusMap(statusStore);
    let key = statusKey(tenantId, workspaceId, caller);
    let now = Time.now();
    let userStatus : Types.UserStatus = {
      id = caller;
      tenantId;
      workspaceId;
      status;
      customStatus;
      lastSeen = now;
    };
    m.add(key, userStatus);
    (userStatus, statusToStore(m))
  };

  /// Update presence (heartbeat). Sets status to #online and refreshes lastSeen.
  public func updatePresence(
    statusStore : [(Text, Types.UserStatus)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Principal,
  ) : (Types.UserStatus, [(Text, Types.UserStatus)]) {
    let m = toStatusMap(statusStore);
    let key = statusKey(tenantId, workspaceId, caller);
    let now = Time.now();
    let existing : ?Types.UserStatus = m.get(key);
    let customStatus = switch (existing) { case (?us) us.customStatus; case null "" };
    let userStatus : Types.UserStatus = {
      id = caller;
      tenantId;
      workspaceId;
      status = #online;
      customStatus;
      lastSeen = now;
    };
    m.add(key, userStatus);
    (userStatus, statusToStore(m))
  };

  public func getUserStatus(
    statusStore : [(Text, Types.UserStatus)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    userId : Principal,
  ) : ?Types.UserStatus {
    let m = toStatusMap(statusStore);
    m.get(statusKey(tenantId, workspaceId, userId))
  };

  public func listWorkspaceStatuses(
    statusStore : [(Text, Types.UserStatus)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [Types.UserStatus] {
    let m = toStatusMap(statusStore);
    m.values().filter(func(us : Types.UserStatus) : Bool {
      us.tenantId == tenantId and us.workspaceId == workspaceId
    }).toArray()
  };

  // ── Unread Counts ─────────────────────────────────────────────────────────────

  public func markChannelRead(
    channelStore : [(Common.EntityId, Types.Channel)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    channelId : Common.EntityId,
    caller : Principal,
  ) : (Bool, [(Common.EntityId, Types.Channel)]) {
    let m = toChannelMap(channelStore);
    switch (m.get(channelId)) {
      case (?ch) {
        if (ch.tenantId != tenantId or ch.workspaceId != workspaceId) return (false, channelStore);
        let counts : [Types.UnreadEntry] = switch (ch.unreadCounts) { case (?uc) uc; case null [] };
        let updatedCounts = counts.map(func(e : Types.UnreadEntry) : Types.UnreadEntry {
          if (Principal.equal(e.userId, caller)) { { e with count = 0 } } else e
        });
        let mentions : [Types.MentionEntry] = switch (ch.mentionFlags) { case (?mf) mf; case null [] };
        let updatedMentions = mentions.map(func(e : Types.MentionEntry) : Types.MentionEntry {
          if (Principal.equal(e.userId, caller)) { { e with hasMention = false } } else e
        });
        let updated : Types.Channel = { ch with unreadCounts = ?updatedCounts; mentionFlags = ?updatedMentions };
        m.add(channelId, updated);
        (true, channelToStore(m))
      };
      case null (false, channelStore);
    }
  };

  public func getUnreadCounts(
    channelStore : [(Common.EntityId, Types.Channel)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Principal,
  ) : [(Text, Nat)] {
    let m = toChannelMap(channelStore);
    m.values()
      .filter(func(ch : Types.Channel) : Bool { ch.tenantId == tenantId and ch.workspaceId == workspaceId and isMember(ch, caller) })
      .toArray()
      .filterMap<Types.Channel, (Text, Nat)>(func(ch : Types.Channel) : ?(Text, Nat) {
        switch (ch.unreadCounts) {
          case (?counts) {
            switch (counts.find(func(e : Types.UnreadEntry) : Bool { Principal.equal(e.userId, caller) })) {
              case (?entry) ?(ch.id, entry.count);
              case null ?(ch.id, 0);
            }
          };
          case null ?(ch.id, 0);
        }
      })
  };

  // ── Thread Notifications ──────────────────────────────────────────────────────

  public func addThreadNotification(
    notifStore : [(Text, Types.ThreadNotification)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    messageId : Text,
    channelId : Text,
    recipientId : Principal,
    senderId : Principal,
  ) : [(Text, Types.ThreadNotification)] {
    let m = toNotifMap(notifStore);
    let id = genId(recipientId.toText() # "notif");
    let notif : Types.ThreadNotification = {
      id;
      tenantId;
      messageId;
      channelId;
      recipientId;
      senderId;
      createdAt = Time.now();
    };
    m.add(id, notif);
    notifToStore(m)
  };

  public func getThreadParticipants(
    messageStore : [(Common.EntityId, Types.Message)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    parentMessageId : Common.EntityId,
  ) : [Principal] {
    let m = toMessageMap(messageStore);
    let participants : [Principal] = m.values()
      .filter(func(msg : Types.Message) : Bool {
        msg.tenantId == tenantId and msg.workspaceId == workspaceId and msg.replyToId == ?parentMessageId
      })
      .toArray()
      .map<Types.Message, Principal>(func(msg : Types.Message) : Principal { msg.senderId });
    // Deduplicate via fold
    participants.foldLeft<Principal, [Principal]>([], func(acc : [Principal], p : Principal) : [Principal] {
      if (acc.any(func(ep : Principal) : Bool { Principal.equal(ep, p) })) acc
      else acc.concat([p])
    })
  };
};
