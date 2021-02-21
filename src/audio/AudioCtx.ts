import { throwsError } from '../utils';

const AudioCtx = (): AudioContext => {
  const Context = window.AudioContext || (window as any).webkitAudioContext;

  if (!Context) {
    throwsError(
      "Your browser doesn't support AudioContext - https://bit.ly/2YWmpnX"
    );
  }

  return new Context();
};

export default AudioCtx;
