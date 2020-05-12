import StateManager from './StateManager';
import decodeAudioData from './decodeAudioData';
import { getBuffer, throwsError } from './utils';

export type PropType = {
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
  const Context = window.AudioContext || (window as any).webkitAudioContext;

  if (!Context) {
    throwsError(
      "Your browser doesn't support AudioContext - https://bit.ly/2YWmpnX"
    );
  }

  const audioContext = new Context();
  const states = StateManager();
  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();

  gainNode.gain.value = volume;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  getBuffer(file)
    .then(buffer =>
      decodeAudioData(audioContext, source, buffer, autoPlay, loop, states)
    )
    .catch(console.error);

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
