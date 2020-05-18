import { EventEmitterType } from './EventEmitter';

type callbackType = (param: { [data: string]: any }) => void;

const EventHandler = (emitter: EventEmitterType) => ({
  ready(callback: callbackType) {
    emitter.listener('decoded', callback);
  },

  start(callback: callbackType) {
    emitter.listener('start', callback);
  },
});

export default EventHandler;
