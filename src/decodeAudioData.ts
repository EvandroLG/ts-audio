import { StateManagerType } from './StateManager';

const decodeAudioData = (
  audioContext: AudioContext,
  source: AudioBufferSourceNode,
  arrayBuffer: ArrayBuffer,
  autoPlay: boolean,
  loop: boolean,
  states: StateManagerType
) => {
  const onSuccess = (buffer: any) => {
    source.buffer = buffer;
    source.loop = loop;

    states.set('isDecoded', true);

    if (autoPlay) {
      source.start(0);
    }
  };

  audioContext.decodeAudioData(arrayBuffer, onSuccess, console.error);
};

export default decodeAudioData;
