const getBuffer = (file: string) =>
  fetch(file).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error, status = ${response.status}`);
    }

    return response.arrayBuffer();
  });

const play = (source: AudioBufferSourceNode) => {
  source.start(0);
};

const decodeAudioData = (
  audioContext: AudioContext,
  source: AudioBufferSourceNode,
  buffer: ArrayBuffer,
  autoPlay: boolean,
  loop: boolean
) => {
  const onError = console.error;
  const onSuccess = (data: any) => {
    source.buffer = data;
    source.connect(audioContext.destination);
    source.loop = loop;

    if (autoPlay) {
      play(source);
    }
  };

  audioContext.decodeAudioData(buffer, onSuccess, onError);
};

const Audio = (
  file: string,
  volume?: number,
  autoPlay: boolean = false,
  loop: boolean = false
) => {
  const audioContext = new AudioContext();
  const source = audioContext.createBufferSource();

  getBuffer(file).then(buffer =>
    decodeAudioData(audioContext, source, buffer, autoPlay, loop)
  );

  return {
    play: () => {},
    stop: () => {},
  };
};

export default Audio;
