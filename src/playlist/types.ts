export type PlaylistPropType = {
  files: string[];
  volume?: number;
  loop?: boolean;
};

export type AudioPlaylistType = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  on: (
    eventType: PlaylistEventType,
    callback: (param: { [data: string]: any }) => void
  ) => void;
  volume: number;
  loop: boolean;
};

export type PlaylistEventType = 'start' | 'end';
