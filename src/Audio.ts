import AudioCtx from './AudioCtx';
import StateManager from './StateManager';
import EventEmitter from './EventEmitter';
import decodeAudioData from './decodeAudioData';
import { getBuffer } from './utils';

export type AudioPropType = {
  file: string;
  volume?: number;
  autoPlay?: boolean;
  loop?: boolean;
};

type AudioEventType = 'ready';

export type AudioType = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  on: (eventType: AudioEventType, callback: () => void) => void;
  volume: number;
  loop: boolean;
};

// if audiocontext is initialized before a user gesture on the page, its
// state become `suspended` by default. once audiocontext.state is `suspended`
// the only way to start it after a user gesture is executing the `resume` method
const start = (audioCtx: AudioContext, source: AudioBufferSourceNode) =>
  audioCtx.state === 'suspended'
    ? audioCtx.resume().then(() => source.start(0))
    : source.start(0);

const Audio = ({
  file,
  volume = 1,
  autoPlay = false,
  loop = false,
}: AudioPropType): AudioType => {
  const audioCtx = AudioCtx();
  const states = StateManager();
  const emitter = EventEmitter();
  const source = audioCtx.createBufferSource();
  const gainNode = audioCtx.createGain();

  gainNode.gain.value = volume;
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  getBuffer(file)
    .then(buffer =>
      decodeAudioData(audioCtx, source, buffer, autoPlay, loop, states, emitter)
    )
    .catch(console.error);

  return {
    play() {
      if (states.get('hasStarted')) {
        audioCtx.resume();
        return;
      }

      states.get('isDecoded')
        ? start(audioCtx, source)
        : emitter.listener('decoded', () => start(audioCtx, source));

      states.set('hasStarted', true);
    },

    pause() {
      audioCtx.suspend();
    },

    stop() {
      if (states.get('hasStarted')) {
        source.stop(0);
      }
    },

    on(eventType: AudioEventType, callback: () => void) {
      if (eventType === 'ready') {
        emitter.listener('decoded', callback);
        return;
      }
    },

    get volume() {
      return gainNode.gain.value;
    },

    set volume(newVolume: number) {
      gainNode.gain.value = newVolume;
    },

    get loop() {
      return source.loop;
    },

    set loop(newLoop: boolean) {
      source.loop = newLoop;
    },
  };
};

export default Audio;
