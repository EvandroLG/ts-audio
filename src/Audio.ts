import StateManager from './StateManager';
import decodeAudioData from './decodeAudioData';
import { getBuffer } from './utils';

type PropType = {
  file: string;
  volume?: number;
  autoPlay?: boolean;
  loop?: boolean;
};

const Audio = ({
  file,
  volume = 1,
  autoPlay = false,
  loop = false,
}: PropType) => {
  const audioContext = new AudioContext();
  const source = audioContext.createBufferSource();
  const states = StateManager();

  getBuffer(file).then(buffer =>
    decodeAudioData(
      audioContext,
      source,
      buffer,
      volume,
      autoPlay,
      loop,
      states
    )
  );

  return {
    play() {
      const buffer = states.get('buffer');

      if (buffer) {
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
