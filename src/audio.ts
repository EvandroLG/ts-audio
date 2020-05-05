const getData = async (file: string) => {
  const request = new Request(file);
  const response = await fetch(request);
  const buffer = await response.arrayBuffer();

  return buffer;
};

const Audio = (
  file: string,
  autoPlay?: boolean,
  loop?: boolean,
  volume?: number
): void => {};

export default Audio;
