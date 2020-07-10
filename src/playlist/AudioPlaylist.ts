import { PlaylistPropType } from './types';
import EventEmitter from '../EventEmitter';
import StateManager from '../StateManager';
import playAudio from './playAudio';

const AudioPlaylist = ({ files, volume }: PlaylistPropType) => {
  const emmiter = EventEmitter();
  const state = StateManager();
  const _playAudio = playAudio(state, emmiter);

  return {
    play() {
      const audio = state.get('audio');

      if (!audio || state.get('isStopped')) {
        _playAudio(0, files, volume);
        state.set('isStopped', false);
        return;
      }

      audio.play();
    },

    pause() {
      state.get('audio')?.pause();
    },

    stop() {
      state.set('isStopped', true);
      state.get('audio')?.stop();
    },

    on(
      eventType: 'start' | 'end',
      callback: (param: { [data: string]: any }) => void
    ) {
      emmiter.listener(eventType, callback);
    },
  };
};

export default AudioPlaylist;
