import { StatesType } from './states';
import { EventEmitterType } from '../EventEmitter';

const decodeAudioData = (
  audioCtx: AudioContext,
  source: AudioBufferSourceNode,
  arrayBuffer: ArrayBuffer,
  autoPlay: boolean,
  loop: boolean,
  states: StatesType,
  emitter: EventEmitterType
): void => {
  const onSuccess = (buffer: AudioBuffer) => {
    source.buffer = buffer;
    source.loop = loop;

    states.isDecoded = true;
    emitter.emit('decoded', { data: buffer });

    if (autoPlay) {
      source.start(0);
    }
  };

  audioCtx.decodeAudioData(arrayBuffer, onSuccess, console.error);
};

export default decodeAudioData;
