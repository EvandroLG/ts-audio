import { PlaylistPropType } from './types';
import EventEmitter from './EventEmitter';
import Audio from './Audio';

const emmiter = EventEmitter();

const playAudio = (index: number, files: string[], volume?: number) => {
  const file = files[index];

  if (!file) {
    emmiter.emit('end', { data: null });
    return;
  }

  const audio = Audio({ file, volume });
  audio.play();

  audio.on('end', () => {
    playAudio(index + 1, files, volume);
  });
};

const AudioPlaylist = ({ files, volume }: PlaylistPropType) => {
  return {
    play() {
      playAudio(0, files, volume);
    },

    on(eventType: 'end', callback: (param: { [data: string]: any }) => void) {
      emmiter.listener(eventType, callback);
    },
  };
};

export default AudioPlaylist;
