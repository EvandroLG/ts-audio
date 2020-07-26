export type PlaylistPropType = {
  files: string[];
  volume?: number;
  loop?: boolean;
};

export type PlaylistEventType = 'start' | 'end';
