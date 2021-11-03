export type AudioPropType = {
  file: string;
  volume?: number;
  autoPlay?: boolean;
  loop?: boolean;
  preload?: boolean;
};

export type AudioEventType = 'ready' | 'start' | 'state' | 'end';

export type AudioType = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  on: (
    eventType: AudioEventType,
    callback: <T>(param: { [data: string]: T }) => void
  ) => void;
  volume: number;
  loop: boolean;
  state: AudioContextState;
};
