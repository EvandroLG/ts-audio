import { PlaylistPropType } from './types';
import Audio from './Audio';

const playAudio = (index: number, files: string[], volume?: number) => {
  const file = files[index];

  if (!file) {
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
  };
};

export default AudioPlaylist;
