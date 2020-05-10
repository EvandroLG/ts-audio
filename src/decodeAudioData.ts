import { StateManagerType } from 'StateManager';

const decodeAudioData = (
  audioContext: AudioContext,
  source: AudioBufferSourceNode,
  arrayBuffer: ArrayBuffer,
  volume: number,
  autoPlay: boolean,
  loop: boolean,
  states: StateManagerType
) => {
  const onSuccess = (buffer: any) => {
    source.buffer = buffer;
    source.loop = loop;

    const gainNode = audioContext.createGain();
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = volume;

    states.set('buffer', buffer);

    if (autoPlay) {
      source.start(0);
    }
  };

  audioContext.decodeAudioData(arrayBuffer, onSuccess, console.error);
};

export default decodeAudioData;
