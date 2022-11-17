import { throwsError } from './utils';

declare global {
  interface Window {
    webkitAudioContext: typeof window.AudioContext;
  }
}

const AudioCtx = (): AudioContext => {
  const Context = window.AudioContext || window.webkitAudioContext;

  if (!Context) {
    throwsError(
      "Your browser doesn't support AudioContext - https://bit.ly/2YWmpnX"
    );
  }

  return new Context();
};

export default AudioCtx;
