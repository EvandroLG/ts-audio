import EventListener from '../src/EventListener';
import { EventEmitterType } from '../src/EventEmitter';

const EventEmitterMock = () =>
  ({
    listener: jest.fn(),
    emit: jest.fn(),
  } as EventEmitterType);

describe('event listener', () => {
  const emitter = EventEmitterMock();
  const eventListener = EventListener(emitter);

  test('ready', () => {
    const callback = jest.fn();
    eventListener.ready(callback);

    expect(emitter.listener).toBeCalledWith('decoded', callback);
  });

  test('start', () => {
    const callback = jest.fn();
    eventListener.start(callback);

    expect(emitter.listener).toBeCalledWith('start', callback);
  });
});
