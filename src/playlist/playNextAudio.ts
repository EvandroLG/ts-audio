import Audio from '../audio/Audio';
import { StatesPlaylistType } from './types';

const playNextAudio = (states: StatesPlaylistType, files: string[]) => {
  states.audio?.pause();
  states.audioIndex++;

  const file = files[states.audioIndex];
  const audio = Audio({ file, volume: states.volume });
  states.audio = audio;
  audio.play();
};

export default playNextAudio;
