type EventType = {
  data: any;
};

export type EventEmitterType = {
  listener: (keyEvent: string, callback: (param: EventType) => void) => void;
  emit: (keyEvent: string, param: EventType) => void;
};

const EventEmitter = (): EventEmitterType => {
  const events: { [key: string]: (param: EventType) => void } = {};

  return {
    listener(keyEvent: string, callback: (param: EventType) => void) {
      events[keyEvent] = callback;
    },

    emit(keyEvent: string, param: EventType) {
      events[keyEvent]?.(param);
    },
  };
};

export default EventEmitter;
