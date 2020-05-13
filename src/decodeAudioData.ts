import { StateManagerType } from './StateManager';
import { EventEmitterType } from './EventEmitter';

const decodeAudioData = (
  audioContext: AudioContext,
  source: AudioBufferSourceNode,
  arrayBuffer: ArrayBuffer,
  autoPlay: boolean,
  loop: boolean,
  states: StateManagerType,
  emitter: EventEmitterType
) => {
  const onSuccess = (buffer: any) => {
    source.buffer = buffer;
    source.loop = loop;

    states.set('isDecoded', true);
    emitter.emit('decoded', { data: true });

    if (autoPlay) {
      source.start(0);
    }
  };

  audioContext.decodeAudioData(arrayBuffer, onSuccess, console.error);
};

export default decodeAudioData;
