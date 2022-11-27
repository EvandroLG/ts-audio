import EventEmitter from '../EventEmitter';

describe('event emitter', () => {
  test('emit', () => {
    const emitter = EventEmitter();
    const keyEvent = 'decoded';
    const callback = jest.fn();
    const param = { data: true };

    emitter.listener(keyEvent, callback);
    emitter.emit(keyEvent, { data: true });

    expect(callback).toBeCalledWith(param);
  });
});
