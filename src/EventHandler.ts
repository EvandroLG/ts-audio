import { EventEmitterType } from './EventEmitter';

type callbackType = (param: { [data: string]: any }) => void;

const EventHandler = (emitter: EventEmitterType, audioCtx: AudioContext) => ({
  ready(callback: callbackType) {
    emitter.listener('decoded', callback);
  },

  start(callback: callbackType) {
    emitter.listener('start', callback);
  },

  state(callback: callbackType) {
    audioCtx.onstatechange = () => callback({ data: audioCtx.state });
  },
});

export default EventHandler;
