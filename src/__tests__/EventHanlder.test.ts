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
})
