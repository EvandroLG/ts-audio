import type { EventEmitterType } from './EventEmitter';

type callbackType = <T>(param: { [data: string]: T }) => void;

type EventHandlerType = {
  ready: (callback: callbackType) => void;
  start: (callback: callbackType) => void;
  end: (callback: callbackType) => void;
  state: (callback: callbackType) => void;
};

const EventHandler = (
  emitter: EventEmitterType,
  audioCtx?: AudioContext
): EventHandlerType => ({
  ready(callback: callbackType) {
    emitter.listener('decoded', callback);
  },

  start(callback: callbackType) {
    emitter.listener('start', callback);
  },

  end(callback: callbackType) {
    emitter.listener('end', callback);
  },

  state(callback: callbackType) {
    if (audioCtx) {
      audioCtx.onstatechange = () => callback({ data: audioCtx.state });
    }
  },
});

export default EventHandler;
