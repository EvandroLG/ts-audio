import { throwsError } from './utils';

const cached: { [key: string]: any } = {};

const AudioCtx = () => {
  if (cached['Context']) {
    return cached['Context'];
  }

  const Context = window.AudioContext || (window as any).webkitAudioContext;

  if (!Context) {
    throwsError(
      "Your browser doesn't support AudioContext - https://bit.ly/2YWmpnX"
    );
  }

  return (cached['Context'] = new Context());
};

export default AudioCtx;
