import C "common";

module {
  public type Note = {
    id : C.EntityId;
    tenantId : C.TenantId;
    title : Text;
    content : Text;
    tags : [Text];
    authorId : C.UserId;
    crossLinks : [C.CrossLink];
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type NoteInput = {
    title : Text;
    content : Text;
    tags : [Text];
    crossLinks : [C.CrossLink];
  };
};
