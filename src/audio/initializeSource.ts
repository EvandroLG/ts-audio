import { EventEmitterType } from '../EventEmitter';
import { StatesType } from './states';

const initializeSource = (
  audioCtx: AudioContext,
  volume: number,
  emitter: EventEmitterType,
  states: StatesType
): void => {
  const source = (states.source = audioCtx.createBufferSource());
  const gainNode = (states.gainNode = audioCtx.createGain());

  gainNode.gain.value = volume;
  gainNode.connect(audioCtx.destination);
  source.connect(gainNode);

  source.onended = () => {
    states.hasStarted = false;
    states.isPlaying = false;
    emitter.emit('end', { data: null });
  };
};

export default initializeSource;
