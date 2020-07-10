import { PlaylistPropType } from './types';
import EventEmitter, { EventType } from '../EventEmitter';
import StateManager from '../StateManager';
import Audio from '../audio/Audio';

const emmiter = EventEmitter();
const state = StateManager();

const playAudio = (index: number, files: string[], volume?: number) => {
  const file = files[index];

  if (!file) {
    emmiter.emit('end', { data: null });
    return;
  }

  const audio = Audio({ file, volume });
  state.set('audio', audio);

  audio.on('start', e => emmiter.emit('start', e as EventType));
  audio.on('end', () => {
    if (state.get('isStopped')) return;
    playAudio(index + 1, files, volume);
  });

  audio.play();
};

const AudioPlaylist = ({ files, volume }: PlaylistPropType) => ({
  play() {
    const audio = state.get('audio');

    if (!audio || state.get('isStopped')) {
      playAudio(0, files, volume);
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
});

export default AudioPlaylist;
