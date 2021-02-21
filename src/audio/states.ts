export type StatesType = {
  isDecoded: boolean;
  hasStarted: boolean;
  source: AudioBufferSourceNode | null;
  gainNode: GainNode | null;
};

const states: StatesType = {
  isDecoded: false,
  hasStarted: false,
  source: null,
  gainNode: null,
};

export default states;
