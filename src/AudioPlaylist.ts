import { PlaylistPropType } from './types';
import StateManager, { StateManagerType } from './StateManager';
import Audio from './Audio';

const playAudio = (
  state: StateManagerType,
  files: string[],
  volume?: number
) => {
  const file = files[state.get('filePosition')];

  if (!file) {
    return;
  }

  const audio = Audio({ file, volume });
  audio.play();

  audio.on('end', () => {
    state.set('filePosition', state.get('filePosition') + 1);
    playAudio(state, files, volume);
  });
};

const AudioPlaylist = ({ files, volume }: PlaylistPropType) => {
  const state = StateManager();

  return {
    play() {
      state.set('filePosition', 0);
      playAudio(state, files, volume);
    },
  };
};

export default AudioPlaylist;
