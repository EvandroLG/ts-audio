import { PlaylistPropType } from './types';
import EventEmitter, { EventType } from '../EventEmitter';
import Audio from '../audio/Audio';

const emmiter = EventEmitter();

const playAudio = (index: number, files: string[], volume?: number) => {
  const file = files[index];

  if (!file) {
    emmiter.emit('end', { data: null });
    return;
  }

  const audio = Audio({ file, volume });

  audio.on('start', e => emmiter.emit('start', e as EventType));
  audio.on('end', () => {
    playAudio(index + 1, files, volume);
  });

  audio.play();
};

const AudioPlaylist = ({ files, volume }: PlaylistPropType) => ({
  play() {
    playAudio(0, files, volume);
  },

  on(
    eventType: 'start' | 'end',
    callback: (param: { [data: string]: any }) => void
  ) {
    emmiter.listener(eventType, callback);
  },
});

export default AudioPlaylist;
