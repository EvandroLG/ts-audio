export const weightedFiles = (files: { [key: string]: number }): string[] => {
  const output = [] as string[];
  const entries = Object.entries(files);

  for (const [file, weight] of entries) {
    for (let i = 0; i < weight; i++) {
      output.push(file);
    }
  }

  return output;
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
  const queue: string[] = files.slice(limit).reverse();
  let isDone = false;

  const requestNext = () => {
    if (!queue.length) {
      if (!isDone) {
        done?.();
        isDone = true;
      }
    } else {
      request(queue.pop() as string);
    }
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
