const getBuffer = (file: string) =>
  fetch(file).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error, status = ${response.status}`);
    }

    return response.arrayBuffer();
  });

const decodeAudioData = (
  audioContext: AudioContext,
  source: AudioBufferSourceNode,
  buffer: ArrayBuffer,
  loop: boolean
) => {
  const onError = console.error;
  const onSuccess = (data: any) => {
    source.buffer = data;
    source.connect(audioContext.destination);
    source.loop = loop;
  };

  audioContext.decodeAudioData(buffer, onSuccess, onError);
};

const Audio = (
  file: string,
  autoPlay?: boolean,
  loop: boolean = false,
  volume?: number
): void => {
  const audioContext = new AudioContext();
  const source = audioContext.createBufferSource();

  getBuffer(file).then(buffer =>
    decodeAudioData(audioContext, source, buffer, loop)
  );
};

export default Audio;
