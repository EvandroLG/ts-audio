/**
 * Fetches an audio file and returns it as an ArrayBuffer.
 */
export const getBuffer = (file: string): Promise<ArrayBuffer> =>
  fetch(file).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error, status = ${response.status}`)
    }

    return response.arrayBuffer()
  })

/**
 * Throws a formatted error with the ts-audio prefix.
 */
export const throwsError = (value: string): void => {
  throw new Error(`\`ts-audio\`: ${value}`)
}

/**
 * Attempts to preload an audio file with automatic retry mechanism.
 * Will recursively retry loading the file up to the specified number of attempts.
 */
export const preloadFile = (file: string, attempts = 3, done?: () => void): void => {
  fetch(file)
    .then(done)
    .catch(() => {
      if (!attempts) {
        return
      }

      preloadFile(file, attempts - 1)
    })
}
