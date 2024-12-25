import { EventHandler } from '../EventHandler';
import { EventEmitterType } from '../EventEmitter';

const EventEmitterMock = () =>
  ({
    listener: jest.fn(),
    emit: jest.fn(),
  } as EventEmitterType);

describe('EventHandler', () => {
  const emitter = EventEmitterMock();
  const eventHandler = new EventHandler(emitter);

  test('registers a callback for the "decoded" event', () => {
    const callback = jest.fn();
    eventHandler.ready(callback);

    expect(emitter.listener).toBeCalledWith('decoded', callback);
  });

  test('registers a callback for the "start" event', () => {
    const callback = jest.fn();
    eventHandler.start(callback);

    expect(emitter.listener).toBeCalledWith('start', callback);
  });

  test('registers a callback for the "end" event', () => {
    const callback = jest.fn();
    eventHandler.end(callback);

    expect(emitter.listener).toBeCalledWith('end', callback);
  });
});
