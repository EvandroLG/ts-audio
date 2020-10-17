import AudioCtx from './AudioCtx';
import StateManager from '../StateManager';
import EventEmitter from '../EventEmitter';
import EventHandler from '../EventHandler';
import initializeSource from './initializeSource';
import decodeAudioData from './decodeAudioData';
import { AudioPropType, AudioEventType, AudioType } from './types';
import { getBuffer } from '../utils';

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
  const eventHandler = EventHandler(emitter, audioCtx);
  const curryGetBuffer = (source: any) =>
    getBuffer(file)
      .then(buffer =>
        decodeAudioData(
          audioCtx,
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
        audioCtx.resume();
        return;
      }

      initializeSource(audioCtx, volume, emitter, states);
      const source = states.get('source');
      curryGetBuffer(source);

      states.get('isDecoded')
        ? start(audioCtx, source)
        : emitter.listener('decoded', () => start(audioCtx, source));

      states.set('hasStarted', true);
      emitter.emit('start', { data: null });
    },

    pause() {
      audioCtx.suspend();
    },

    stop() {
      if (states.get('hasStarted')) {
        states.get('source').stop(0);
      }
    },

    on(
      eventType: AudioEventType,
      callback: (param: { [data: string]: any }) => void
    ) {
      eventHandler[eventType]?.(callback);
    },

    get volume() {
      return states.get('gainNode').gain.value;
    },

    set volume(newVolume: number) {
      states.get('gainNode').gain.value = newVolume;
    },

    get loop() {
      return states.get('source').loop;
    },

    set loop(newLoop: boolean) {
      states.get('source').loop = newLoop;
    },

    get state() {
      return audioCtx.state;
    },
  };
};

export default Audio;
