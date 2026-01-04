import { EventEmitter } from '../EventEmitter'
import { EventHandler } from '../EventHandler'

jest.mock('../EventEmitter')

describe('EventHandler', () => {
  let mockEmitter: jest.Mocked<EventEmitter>
  let eventHandler: EventHandler

  beforeEach(() => {
    mockEmitter = new EventEmitter() as jest.Mocked<EventEmitter>
    mockEmitter.listener = jest.fn()
    eventHandler = new EventHandler(mockEmitter)
  })

  test('registers a callback for the "decoded" event', () => {
    const callback = jest.fn()
    eventHandler.ready(callback)

    expect(mockEmitter.listener).toBeCalledWith('decoded', callback)
  })

  test('registers a callback for the "start" event', () => {
    const callback = jest.fn()
    eventHandler.start(callback)

    expect(mockEmitter.listener).toBeCalledWith('start', callback)
  })

  test('registers a callback for the "end" event', () => {
    const callback = jest.fn()
    eventHandler.end(callback)

    expect(mockEmitter.listener).toBeCalledWith('end', callback)
  })

  describe('dispose', () => {
    test('removes onstatechange listener when audioCtx exists', () => {
      const mockAudioCtx = {
        onstatechange: jest.fn(),
        state: 'running',
      } as unknown as AudioContext

      const eventHandlerWithCtx = new EventHandler(mockEmitter, mockAudioCtx)

      mockAudioCtx.onstatechange = jest.fn()
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
