import { AudioType } from '../audio/types';

export type PlaylistPropType = {
  files: string[];
  volume?: number;
  loop?: boolean;
};

export type StatesPlaylistType = {
  volume: number;
  loop: boolean;
  audio: AudioType | null;
  isStopped: boolean;
};

export type PlaylistEventType = 'start' | 'end';
