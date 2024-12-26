import type { EventEmitter } from './EventEmitter'

type callbackType = <T>(param: { [data: string]: T }) => void

/**
 * EventHandler class to manage event listeners for an audio context.
 */
export class EventHandler {
  private emitter: EventEmitter
  private audioCtx: AudioContext | undefined

  /**
   * Creates an instance of EventHandler.
   * @param emitter - The event emitter instance to manage event listeners.
   * @param audioCtx - AudioContext instance to monitor state changes. Optional to facilitate testing.
   */
  constructor(emitter: EventEmitter, audioCtx?: AudioContext) {
    this.emitter = emitter
    this.audioCtx = audioCtx
  }

  /**
   * Registers a callback for the 'decoded' event.
   * @param callback - The callback to be invoked when the event occurs.
   */
  public ready(callback: callbackType) {
    this.emitter.listener('decoded', callback)
  }

  /**
   * Registers a callback for the 'start' event.
   * @param callback - The callback to be invoked when the event occurs.
   */
  public start(callback: callbackType) {
    this.emitter.listener('start', callback)
  }

  /**
   * Registers a callback for the 'end' event.
   * @param callback - The callback to be invoked when the event occurs.
   */
  public end(callback: callbackType) {
    this.emitter.listener('end', callback)
  }

  /**
   * Monitors the state changes of the AudioContext and invokes the callback.
   * @param callback - The callback to be invoked when the AudioContext state changes.
   */
  public state(callback: callbackType) {
    if (!this.audioCtx) return

    this.audioCtx.onstatechange = () => callback({ data: this.audioCtx?.state })
  }
}
