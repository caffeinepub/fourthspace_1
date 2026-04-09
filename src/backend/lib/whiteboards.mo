import Common "../types/common";
import WBTypes "../types/whiteboards";
import PTypes "../types/projects";
import Time "mo:core/Time";

module {

  func genId(prefix : Text, now : Int) : Common.EntityId {
    prefix # "-" # debug_show(now)
  };

  // Built-in whiteboard templates (stored as JSON strings for frontend rendering)
  let builtInTemplates : [WBTypes.WhiteboardTemplate] = [
    {
      id = "tpl-brainstorm";
      name = "Brainstorm";
      description = "Open canvas for free-form ideation with sticky notes";
      category = "Ideation";
      definition = "{\"elements\":[{\"tool\":\"Sticky\",\"x\":100,\"y\":100,\"text\":\"Idea 1\",\"color\":\"#FFF176\"},{\"tool\":\"Sticky\",\"x\":300,\"y\":100,\"text\":\"Idea 2\",\"color\":\"#AED581\"},{\"tool\":\"Sticky\",\"x\":500,\"y\":100,\"text\":\"Idea 3\",\"color\":\"#81D4FA\"}]}";
    },
    {
      id = "tpl-flowchart";
      name = "Flow Chart";
      description = "Process flow with decision diamonds and connectors";
      category = "Process";
      definition = "{\"elements\":[{\"tool\":\"Rectangle\",\"x\":200,\"y\":50,\"width\":160,\"height\":60,\"text\":\"Start\",\"color\":\"#4CAF50\"},{\"tool\":\"Connector\",\"x\":280,\"y\":110,\"connectorFrom\":\"start\",\"connectorTo\":\"process\"},{\"tool\":\"Rectangle\",\"x\":200,\"y\":200,\"width\":160,\"height\":60,\"text\":\"Process\",\"color\":\"#2196F3\"},{\"tool\":\"Rectangle\",\"x\":200,\"y\":350,\"width\":160,\"height\":60,\"text\":\"End\",\"color\":\"#F44336\"}]}";
    },
    {
      id = "tpl-retro";
      name = "Retro Board";
      description = "Sprint retrospective with went well, improve, and action columns";
      category = "Agile";
      definition = "{\"columns\":[{\"label\":\"Went Well\",\"color\":\"#C8E6C9\"},{\"label\":\"To Improve\",\"color\":\"#FFCCBC\"},{\"label\":\"Action Items\",\"color\":\"#BBDEFB\"}],\"elements\":[{\"tool\":\"Sticky\",\"x\":80,\"y\":150,\"text\":\"Add your wins here\",\"color\":\"#C8E6C9\"},{\"tool\":\"Sticky\",\"x\":320,\"y\":150,\"text\":\"Add improvements here\",\"color\":\"#FFCCBC\"},{\"tool\":\"Sticky\",\"x\":560,\"y\":150,\"text\":\"Add actions here\",\"color\":\"#BBDEFB\"}]}";
    },
    {
      id = "tpl-mindmap";
      name = "Mind Map";
      description = "Central topic with radiating branches for exploration";
      category = "Ideation";
      definition = "{\"elements\":[{\"tool\":\"Circle\",\"x\":300,\"y\":250,\"width\":120,\"height\":60,\"text\":\"Central Topic\",\"color\":\"#7C4DFF\"},{\"tool\":\"Sticky\",\"x\":100,\"y\":100,\"text\":\"Branch 1\",\"color\":\"#FF6D00\"},{\"tool\":\"Sticky\",\"x\":500,\"y\":100,\"text\":\"Branch 2\",\"color\":\"#00BCD4\"},{\"tool\":\"Sticky\",\"x\":100,\"y\":380,\"text\":\"Branch 3\",\"color\":\"#43A047\"},{\"tool\":\"Sticky\",\"x\":500,\"y\":380,\"text\":\"Branch 4\",\"color\":\"#E91E63\"}]}";
    },
    {
      id = "tpl-kanban";
      name = "Kanban Planning";
      description = "Visual task board with To Do, In Progress, and Done columns";
      category = "Agile";
      definition = "{\"columns\":[{\"label\":\"To Do\",\"color\":\"#EEE\"},{\"label\":\"In Progress\",\"color\":\"#E3F2FD\"},{\"label\":\"Done\",\"color\":\"#E8F5E9\"}],\"elements\":[{\"tool\":\"Sticky\",\"x\":60,\"y\":120,\"text\":\"Task 1\",\"color\":\"#FFF9C4\"},{\"tool\":\"Sticky\",\"x\":300,\"y\":120,\"text\":\"Task 2\",\"color\":\"#B3E5FC\"},{\"tool\":\"Sticky\",\"x\":540,\"y\":120,\"text\":\"Task 3\",\"color\":\"#DCEDC8\"}]}";
    },
  ];

  public func listWhiteboardTemplates() : [WBTypes.WhiteboardTemplate] {
    builtInTemplates
  };

  public func createWhiteboard(
    store : [(Common.EntityId, WBTypes.Whiteboard)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    caller : Common.UserId,
    input : WBTypes.WhiteboardInput,
  ) : (WBTypes.Whiteboard, [(Common.EntityId, WBTypes.Whiteboard)]) {
    let now = Time.now();
    let id = genId("wb", now);
    let whiteboard : WBTypes.Whiteboard = {
      id;
      tenantId;
      workspaceId;
      projectId = input.projectId;
      title = input.title;
      elements = [];
      createdBy = caller;
      createdAt = now;
      updatedAt = now;
      templateId = input.templateId;
      templateName = input.templateName;
    };
    (whiteboard, store.concat([(id, whiteboard)]))
  };

  public func updateWhiteboardElements(
    store : [(Common.EntityId, WBTypes.Whiteboard)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    _caller : Common.UserId,
    elements : [WBTypes.WhiteboardElement],
  ) : (?WBTypes.Whiteboard, [(Common.EntityId, WBTypes.Whiteboard)]) {
    let now = Time.now();
    let found = store.find(
      func((k, w)) { k == id and w.tenantId == tenantId and w.workspaceId == workspaceId },
    );
    switch found {
      case null (null, store);
      case (?(_, prev)) {
        let updated : WBTypes.Whiteboard = {
          prev with
          elements;
          updatedAt = now;
        };
        let newStore = store.map(
          func((k, v)) { if (k == id) { (k, updated) } else { (k, v) } },
        );
        (?updated, newStore)
      };
    }
  };

  public func getWhiteboard(
    store : [(Common.EntityId, WBTypes.Whiteboard)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
  ) : ?WBTypes.Whiteboard {
    switch (store.find<(Common.EntityId, WBTypes.Whiteboard)>(func((k, w)) { k == id and w.tenantId == tenantId and w.workspaceId == workspaceId })) {
      case (?(_, w)) ?w;
      case null null;
    }
  };

  public func listWhiteboards(
    store : [(Common.EntityId, WBTypes.Whiteboard)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [WBTypes.Whiteboard] {
    store.filter<(Common.EntityId, WBTypes.Whiteboard)>(func((_, w)) { w.tenantId == tenantId and w.workspaceId == workspaceId }).map<(Common.EntityId, WBTypes.Whiteboard), WBTypes.Whiteboard>(
      func((_, w)) { w },
    )
  };

  public func deleteWhiteboard(
    store : [(Common.EntityId, WBTypes.Whiteboard)],
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
    id : Common.EntityId,
    _caller : Common.UserId,
  ) : (Bool, [(Common.EntityId, WBTypes.Whiteboard)]) {
    let found = store.find(
      func((k, w)) { k == id and w.tenantId == tenantId and w.workspaceId == workspaceId },
    );
    switch found {
      case null (false, store);
      case (?(_, _)) {
        (true, store.filter<(Common.EntityId, WBTypes.Whiteboard)>(func((k, _)) { k != id }))
      };
    }
  };

  // Converts a sticky note element to a task. Returns the updated whiteboard store
  // and a TaskInput to be created by the caller (main.mo) since cross-module task creation
  // must happen in the actor context.
  public func convertWhiteboardElementToTask(
    store : [(Common.EntityId, WBTypes.Whiteboard)],
    whiteboardId : Common.EntityId,
    elementId : Common.EntityId,
    projectId : Common.EntityId,
    workspaceId : Common.WorkspaceId,
    tenantId : Common.TenantId,
  ) : { result : { #ok : (WBTypes.Whiteboard, PTypes.TaskInput); #err : Text }; store : [(Common.EntityId, WBTypes.Whiteboard)] } {
    let found = store.find(
      func((k, w)) { k == whiteboardId and w.tenantId == tenantId and w.workspaceId == workspaceId },
    );
    switch found {
      case null { { result = #err "Whiteboard not found"; store } };
      case (?(_, wb)) {
        let elemFound = wb.elements.find(func(e) { e.id == elementId });
        switch elemFound {
          case null { { result = #err "Element not found"; store } };
          case (?elem) {
            if (elem.tool != #Sticky) {
              { result = #err "Only Sticky note elements can be converted to tasks"; store }
            } else if (elem.converted) {
              { result = #err "Element already converted to a task"; store }
            } else {
              let taskInput : PTypes.TaskInput = {
                projectId;
                title = if (elem.text == "") { "Untitled sticky note" } else { elem.text };
                description = "Converted from whiteboard: " # wb.title;
                priority = #Medium;
                assigneeId = null;
                dueDate = null;
                tags = [];
                crossLinks = [];
              };
              // Mark element as converted (linkedTaskId will be set by caller after task creation)
              let updatedElements = wb.elements.map(
                func(e : WBTypes.WhiteboardElement) : WBTypes.WhiteboardElement {
                  if (e.id == elementId) { { e with converted = true } } else { e }
                },
              );
              let now = Time.now();
              let updatedWb : WBTypes.Whiteboard = {
                wb with
                elements = updatedElements;
                updatedAt = now;
              };
              let newStore = store.map(
                func((k, v)) { if (k == whiteboardId) { (k, updatedWb) } else { (k, v) } },
              );
              { result = #ok(updatedWb, taskInput); store = newStore }
            }
          };
        }
      };
    }
  };

  // Update a single element's linkedTaskId after task creation
  public func linkElementToTask(
    store : [(Common.EntityId, WBTypes.Whiteboard)],
    whiteboardId : Common.EntityId,
    elementId : Common.EntityId,
    taskId : Text,
    tenantId : Common.TenantId,
    workspaceId : Common.WorkspaceId,
  ) : [(Common.EntityId, WBTypes.Whiteboard)] {
    let found = store.find(func((k, w)) { k == whiteboardId and w.tenantId == tenantId and w.workspaceId == workspaceId });
    switch found {
      case null store;
      case (?(_, wb)) {
        let updatedElements = wb.elements.map(
          func(e : WBTypes.WhiteboardElement) : WBTypes.WhiteboardElement {
            if (e.id == elementId) { { e with linkedTaskId = ?taskId } } else { e }
          },
        );
        let now = Time.now();
        let updatedWb : WBTypes.Whiteboard = { wb with elements = updatedElements; updatedAt = now };
        store.map(func((k, v)) { if (k == whiteboardId) { (k, updatedWb) } else { (k, v) } })
      };
    }
  };
};
