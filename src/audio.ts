import { getBuffer } from 'utils';

const play = (source: AudioBufferSourceNode) => {
  source.start(0);
};

const decodeAudioData = (
  audioContext: AudioContext,
  source: AudioBufferSourceNode,
  buffer: ArrayBuffer,
  volume: number,
  autoPlay: boolean,
  loop: boolean
) => {
  const onError = console.error;
  const onSuccess = (data: any) => {
    source.buffer = data;
    source.connect(audioContext.destination);
    source.loop = loop;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioContext.destination);

    if (autoPlay) {
      play(source);
    }
  };

  audioContext.decodeAudioData(buffer, onSuccess, onError);
};

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
