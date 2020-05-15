import AudioCtx from './AudioCtx';
import StateManager from './StateManager';
import EventEmitter from './EventEmitter';
import decodeAudioData from './decodeAudioData';
import { getBuffer } from './utils';

export type PropType = {
  file: string;
  volume?: number;
  autoPlay?: boolean;
  loop?: boolean;
};

// if audiocontext is initialized before a user gesture on the page, its
// state become `suspended` by default. once audiocontext.state is `suspended`
// the only way to start it after a user gesture is executing the `resume` method
const start = (audioContext: AudioContext, source: AudioBufferSourceNode) =>
  audioContext.state === 'suspended'
    ? audioContext.resume().then(() => source.start(0))
    : source.start(0);

const Audio = ({
  file,
  volume = 1,
  autoPlay = false,
  loop = false,
}: PropType) => {
  const audioContext = AudioCtx();
  const states = StateManager();
  const emitter = EventEmitter();
  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();

  gainNode.gain.value = volume;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  getBuffer(file)
    .then(buffer =>
      decodeAudioData(
        audioContext,
        source,
        buffer,
        autoPlay,
        loop,
        states,
        emitter
      )
    )
    .catch(console.error);

  return {
    play() {
      if (states.get('hasStarted')) {
        audioContext.resume();
        return;
      }

      states.get('isDecoded')
        ? start(audioContext, source)
        : emitter.listener('decoded', () => start(audioContext, source));

      states.set('hasStarted', true);
    },

    stop() {
      source.stop(0);
    },

    pause() {
      audioContext.suspend();
    },

    setVolume(newVolume: number) {
      gainNode.gain.value = newVolume;
    },
  };
};

export default Audio;
