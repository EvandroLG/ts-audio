/**
 * Represents an event with associated data.
 */
export type Event = {
  /**
   * The data associated with the event. The type of data is unknown.
   */
  data: unknown
}

/**
 * Event emitter class that allows registering event listeners and emitting events.
 */
export class EventEmitter {
  /**
   * A map of event keys to their respective callback functions.
   * @private
   */
  private events: { [key: string]: (param: Event) => void }

  /**
   * Initializes a new instance of the EventEmitter class.
   */
  constructor() {
    this.events = {}
  }

  /**
   * Registers a listener for a specific event key.
   *
   * @param {string} keyEvent - The key of the event to listen for.
   * @param {(param: Event) => void} callback - The callback function to be invoked when the event is emitted.
   */
  public listener(keyEvent: string, callback: (param: Event) => void): void {
    this.events[keyEvent] = callback
  }

  /**
   * Emits an event, invoking the corresponding listener with the provided parameter.
   *
   * @param {string} keyEvent - The key of the event to emit.
   * @param {Event} param - The parameter to pass to the event's callback function.
   */
  public emit(keyEvent: string, param: Event): void {
    if (this.events[keyEvent]) {
      this.events[keyEvent](param)
    }
  }
}
