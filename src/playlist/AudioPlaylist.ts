import { PlaylistPropType, PlaylistEventType } from './types';
import EventEmitter from '../EventEmitter';
import globalStates from './states';
import playAudio from './playAudio';

const AudioPlaylist = ({
  files,
  volume = 1,
  loop = false,
}: PlaylistPropType) => {
  const emmiter = EventEmitter();
  const state = { ...globalStates };
  state.volume = volume;
  state.loop = loop;
  const curryPlayAudio = playAudio(state, emmiter);

  return {
    play() {
      const { audio } = state;

      if (!audio || state.isStopped) {
        curryPlayAudio(0, files, loop);
        state.isStopped = false;

        return;
      }

      audio.play();
    },

    pause() {
      state.audio?.pause();
    },

    stop() {
      state.isStopped = true;
      state.audio?.stop();
    },

    on(
      eventType: PlaylistEventType,
      callback: (param: { [data: string]: any }) => void
    ) {
      emmiter.listener(eventType, callback);
    },

    get volume() {
      return state.volume;
    },

    set volume(newVolume: number) {
      state.volume = newVolume;

      if (state.audio) {
        state.audio.volume = newVolume;
      }
    },

    get loop() {
      return state.loop;
    },

    set loop(newLoop: boolean) {
      state.loop = newLoop;
    },
  };
};

export default AudioPlaylist;
