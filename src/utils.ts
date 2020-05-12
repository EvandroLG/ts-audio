export const getBuffer = (file: string) =>
  fetch(file).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error, status = ${response.status}`);
    }

    return response.arrayBuffer();
  });

export const throwsError = (value: string) => {
  throw new Error(`\`ts-audio\`: ${value}`);
};
