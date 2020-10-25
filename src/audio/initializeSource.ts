import { EventEmitterType } from '../EventEmitter';
import { StatesType } from './types';

const initializeSource = (
  audioCtx: any,
  volume: number,
  emitter: EventEmitterType,
  states: StatesType
) => {
  const source = (states.source = audioCtx.createBufferSource());
  const gainNode = (states.gainNode = audioCtx.createGain());

  gainNode.gain.value = volume;
  gainNode.connect(audioCtx.destination);
  source.connect(gainNode);

  source.onended = () => {
    states.hasStarted = false;
    emitter.emit('end', { data: null });
  };
};

export default initializeSource;
