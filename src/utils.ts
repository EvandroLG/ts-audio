export const getBuffer = (file: string): Promise<ArrayBuffer> =>
  fetch(file).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error, status = ${response.status}`);
    }

    return response.arrayBuffer();
  });

export const throwsError = (value: string): void => {
  throw new Error(`\`ts-audio\`: ${value}`);
};

export const shuffle = (list: string[]): string[] => {
  const result = list.slice();
  let index = list.length - 1;

  while (index >= 0) {
    const randomIdx = Math.floor(Math.random() * index + 1);
    const tmp = result[index];
    result[index] = result[randomIdx];
    result[randomIdx] = tmp;

    index--;
  }

  return result;
};

export const preloadFiles = (
  files: string[],
  limit: number,
  api: (
    input: string,
    init?: RequestInit | undefined
  ) => Promise<Response> = fetch,
  done?: () => void
): void => {
  const queue: string[] = files.slice(limit);

  const requestNext = () => {
    if (!queue.length) {
      done?.();
      return;
    }

    request(queue.shift() as string);
  };

  const request = (fileName: string) => {
    api(fileName)
      .then(requestNext)
      .catch(requestNext);
  };

  for (let i = 0; i < limit; i++) {
    request(files[i]);
  }
};
