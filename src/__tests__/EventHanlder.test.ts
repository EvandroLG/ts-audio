import { describe, test, expect, beforeEach, mock } from 'bun:test'

mock.module('../EventEmitter', () => ({
  EventEmitter: class EventEmitter {
    listener = mock(() => {})
  },
}))

import { EventEmitter } from '../EventEmitter'
import { EventHandler } from '../EventHandler'

describe('EventHandler', () => {
  let mockEmitter: EventEmitter
  let eventHandler: EventHandler

  beforeEach(() => {
    mockEmitter = new EventEmitter()
    // if you want to ensure it's a fresh mock each test:
    mockEmitter.listener = mock(() => {})
    eventHandler = new EventHandler(mockEmitter)
  })

  test('registers a callback for the "decoded" event', () => {
    const callback = mock(() => {})
    eventHandler.ready(callback)

    expect(mockEmitter.listener).toHaveBeenCalledWith('decoded', callback)
  })

  test('registers a callback for the "start" event', () => {
    const callback = mock(() => {})
    eventHandler.start(callback)

    expect(mockEmitter.listener).toHaveBeenCalledWith('start', callback)
  })

  test('registers a callback for the "end" event', () => {
    const callback = mock(() => {})
    eventHandler.end(callback)

    expect(mockEmitter.listener).toHaveBeenCalledWith('end', callback)
  })

  describe('dispose', () => {
    test('removes onstatechange listener when audioCtx exists', () => {
      const mockAudioCtx = {
        onstatechange: mock(() => {}),
        state: 'running',
      } as unknown as AudioContext

      const eventHandlerWithCtx = new EventHandler(mockEmitter, mockAudioCtx)

      expect(mockAudioCtx.onstatechange).not.toBeNull()

      eventHandlerWithCtx.dispose()

      expect(mockAudioCtx.onstatechange).toBeNull()
    })

    test('does not throw error when audioCtx is undefined', () => {
      const eventHandlerNoCtx = new EventHandler(mockEmitter)
      expect(() => eventHandlerNoCtx.dispose()).not.toThrow()
    })
  })
})
