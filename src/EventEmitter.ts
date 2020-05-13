type EventType = {
  data: any;
};

const EventEmitter = () => {
  const events = {};

  return {
    addListener(keyEvent: string, callback: (param: EventType) => void) {
      events[keyEvent] = callback;
    },

    emit(keyEvent: string, param: EventType) {
      events[keyEvent]?.(param);
    },
  };
};

export default EventEmitter;
