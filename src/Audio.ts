import StateManager from './StateManager';
import decodeAudioData from './decodeAudioData';
import { getBuffer } from './utils';

export type PropType = {
  file: string;
  volume?: number;
  autoPlay?: boolean;
  loop?: boolean;
};

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

const Audio = ({
  file,
  volume = 1,
  autoPlay = false,
  loop = false,
}: PropType) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const states = StateManager();
  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();

  gainNode.gain.value = volume;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  getBuffer(file).then(buffer =>
    decodeAudioData(audioContext, source, buffer, autoPlay, loop, states)
  );

  return {
    play() {
      if (states.get('isDecoded')) {
        source.start(0);
      }
    },

    stop() {
      source.stop(0);
    },

    setVolume(newVolume: number) {
      gainNode.gain.value = newVolume;
    },
  };
};

export default Audio;
