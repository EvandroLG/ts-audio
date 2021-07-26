export type PlaylistPropType = {
  files: string[];
  volume?: number;
  loop?: boolean;
  shuffle?: boolean;
};

export type AudioPlaylistType = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  on: (
    eventType: PlaylistEventType,
    callback: <T>(param: { [data: string]: T }) => void
  ) => void;
  volume: number;
  loop: boolean;
};

export type PlaylistEventType = 'start' | 'end';
