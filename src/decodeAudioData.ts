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
    source.connect(audioContext.destination);
    source.loop = loop;
    states.set('buffer', buffer);

    if (autoPlay) {
      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume;
      gainNode.connect(audioContext.destination);

      source.start(0);
    }
  };

  audioContext.decodeAudioData(arrayBuffer, onSuccess, console.error);
};

export default decodeAudioData;
