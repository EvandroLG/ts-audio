import type { EventEmitterType } from '../EventEmitter';
import EventHandler from '../EventHandler';

const EventEmitterMock = () =>
  ({
    listener: jest.fn(),
    emit: jest.fn(),
  } as EventEmitterType);

describe('event listener', () => {
  const emitter = EventEmitterMock();
  const eventHandler = EventHandler(emitter);

  test('ready', () => {
    const callback = jest.fn();
    eventHandler.ready(callback);

    expect(emitter.listener).toBeCalledWith('decoded', callback);
  });

  test('start', () => {
    const callback = jest.fn();
    eventHandler.start(callback);

    expect(emitter.listener).toBeCalledWith('start', callback);
  });
});
