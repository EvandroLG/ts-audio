import { StatesType } from './types';
import { EventEmitterType } from '../EventEmitter';

const decodeAudioData = (
  audioCtx: AudioContext,
  source: AudioBufferSourceNode,
  arrayBuffer: ArrayBuffer,
  autoPlay: boolean,
  loop: boolean,
  states: StatesType,
  emitter: EventEmitterType
) => {
  const onSuccess = (buffer: any) => {
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
