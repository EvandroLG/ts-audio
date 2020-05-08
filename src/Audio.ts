import StateManager from './StateManager';
import decodeAudioData from './decodeAudioData';
import { getBuffer } from './utils';

const Audio = (
  file: string,
  volume: number = 1,
  autoPlay: boolean = false,
  loop: boolean = false
) => {
  const audioContext = new AudioContext();
  const source = audioContext.createBufferSource();
  const states = StateManager();

  getBuffer(file).then(buffer => {
    decodeAudioData(audioContext, source, buffer, volume, autoPlay, loop);
    states.setState('buffer', buffer);
  });

  return {
    play() {
      const buffer = states.getState('buffer');

      if (states.getState('buffer')) {
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.loop = loop;

        const gainNode = audioContext.createGain();
        gainNode.gain.value = volume;
        gainNode.connect(audioContext.destination);

        source.start(0);
      }
    },

    stop() {
      source.stop(0);
    },
  };
};

export default Audio;
