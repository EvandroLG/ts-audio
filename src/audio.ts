import { getBuffer } from './utils';
import decodeAudioData from './decodeAudioData';

const Audio = (
  file: string,
  volume: number = 1,
  autoPlay: boolean = false,
  loop: boolean = false
) => {
  const audioContext = new AudioContext();
  const source = audioContext.createBufferSource();

  getBuffer(file).then(buffer =>
    decodeAudioData(audioContext, source, buffer, volume, autoPlay, loop)
  );

  return {
    play: () => {},
    stop: () => source.stop(0),
  };
};

export default Audio;
