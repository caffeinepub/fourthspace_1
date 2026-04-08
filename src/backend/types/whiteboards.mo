import C "common";

module {
  public type DrawingTool = {
    #Pen;
    #Line;
    #Rectangle;
    #Circle;
    #Text;
    #Eraser;
    #Sticky;
    #Image;
    #Connector;
  };

  public type WhiteboardElement = {
    id : C.EntityId;
    tool : DrawingTool;
    x : Float;
    y : Float;
    width : Float;
    height : Float;
    color : Text;
    strokeWidth : Float;
    text : Text;
    points : [Float];
    converted : Bool;
    linkedTaskId : ?Text;
    imageUrl : ?Text;
    connectorFrom : ?Text;
    connectorTo : ?Text;
  };

  public type WhiteboardTemplate = {
    id : Text;
    name : Text;
    description : Text;
    category : Text;
    definition : Text; // JSON definition for frontend rendering
  };

  public type Whiteboard = {
    id : C.EntityId;
    tenantId : C.TenantId;
    workspaceId : C.WorkspaceId;
    projectId : ?C.EntityId;
    title : Text;
    elements : [WhiteboardElement];
    createdBy : C.UserId;
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
    templateId : ?Text;
    templateName : ?Text;
  };

  public type WhiteboardInput = {
    projectId : ?C.EntityId;
    title : Text;
    templateId : ?Text;
    templateName : ?Text;
  };
};
