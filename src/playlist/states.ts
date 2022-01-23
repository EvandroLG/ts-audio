import { AudioType } from '../audio/types';

export type StatesPlaylistType = {
  volume: number;
  loop: boolean;
  audio: AudioType | null;
  isStopped: boolean;
  isPlaying: boolean;
  audioIndex: number;
};

const states: StatesPlaylistType = {
  volume: 1,
  loop: false,
  audio: null,
  isStopped: false,
  isPlaying: false,
  audioIndex: 0,
};

export default states;
