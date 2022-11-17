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

export const preloadFile = (
  file: string,
  attempts = 3,
  done?: () => void
): void => {
  fetch(file)
    .then(done)
    .catch(() => {
      if (!attempts) {
        return;
      }

      preloadFile(file, attempts - 1);
    });
};
