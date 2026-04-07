import C "common";

module {
  public type RecurrenceRule = {
    #None;
    #Daily;
    #Weekly;
    #Monthly;
    #Yearly;
  };

  public type Event = {
    id : C.EntityId;
    tenantId : C.TenantId;
    title : Text;
    description : Text;
    startTime : C.Timestamp;
    endTime : C.Timestamp;
    recurrence : RecurrenceRule;
    attendeeIds : [C.UserId];
    crossLinks : [C.CrossLink];
    createdBy : C.UserId;
    createdAt : C.Timestamp;
    updatedAt : C.Timestamp;
  };

  public type EventInput = {
    title : Text;
    description : Text;
    startTime : C.Timestamp;
    endTime : C.Timestamp;
    recurrence : RecurrenceRule;
    attendeeIds : [C.UserId];
    crossLinks : [C.CrossLink];
  };
};
