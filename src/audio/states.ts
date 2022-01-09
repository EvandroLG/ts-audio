export type StatesType = {
  isDecoded: boolean;
  isPlaying: boolean;
  hasStarted: boolean;
  source: AudioBufferSourceNode | null;
  gainNode: GainNode | null;
};

const states: StatesType = {
  isDecoded: false,
  isPlaying: false,
  hasStarted: false,
  source: null,
  gainNode: null,
};

export default states;
