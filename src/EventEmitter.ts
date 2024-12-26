export type Event = {
  data: unknown;
};

export class EventEmitter {
  private events: { [key: string]: (param: Event) => void };

  constructor() {
    this.events = {};
  }

  public listener(keyEvent: string, callback: (param: Event) => void) {
    this.events[keyEvent] = callback;
  }

  public emit(keyEvent: string, param: Event) {
    if (this.events[keyEvent]) {
      this.events[keyEvent](param);
    }
  }
}
