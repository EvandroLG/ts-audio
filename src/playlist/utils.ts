/**
 * Converts an object of weighted file paths into an array where each file appears
 * multiple times based on its weight.
 *
 * @example
 * weightedFiles({ 'song1.mp3': 2, 'song2.mp3': 1 })
 * // returns ['song1.mp3', 'song1.mp3', 'song2.mp3']
 *
 * @param {Object.<string, number>} files - Object with file paths as keys and weights as values
 * @returns {string[]} Array of file paths repeated according to their weights
 */
export const weightedFiles = (files: { [key: string]: number }): string[] => {
  return Object.entries(files).flatMap(([file, weight]) => Array(Math.floor(weight)).fill(file))
}

/**
 * Shuffles an array of strings using the Fisher-Yates algorithm.
 * Creates a new array instead of modifying the original.
 *
 * @example
 * shuffle(['a', 'b', 'c'])
 * // might return ['b', 'c', 'a']
 *
 * @param {string[]} list - Array of strings to shuffle
 * @returns {string[]} New array with shuffled elements
 */
export const shuffle = (list: string[]): string[] => {
  const result = list.slice()
  let index = list.length - 1

  while (index >= 0) {
    const randomIdx = Math.floor(Math.random() * index + 1)
    const tmp = result[index]
    result[index] = result[randomIdx]
    result[randomIdx] = tmp

    index--
  }

  return result
}

/**
 * Preloads audio files in batches with a specified limit.
 * Uses a queue system to load files sequentially after the initial batch.
 *
 * @param {string[]} files - Array of file URLs to preload
 * @param {number} limit - Maximum number of files to load simultaneously
 * @param {Function} [api=fetch] - Function to use for fetching files
 * @param {Function} [done] - Callback function to execute when all files are loaded
 */
export const preloadFiles = (
  files: string[],
  limit: number,
  api: (input: string, init?: RequestInit | undefined) => Promise<Response> = fetch,
  done?: () => void,
): void => {
  const queue: string[] = files.slice(limit).reverse()
  let isDone = false

  /**
   * Processes the next item in the queue or calls the done callback if queue is empty
   */
  const requestNext = () => {
    if (!queue.length) {
      if (!isDone) {
        done?.()
        isDone = true
      }
    } else {
      request(queue.pop() as string)
    }
  }

  const request = (fileName: string) => {
    api(fileName).then(requestNext).catch(requestNext)
  }

  for (let i = 0; i < limit; i++) {
    request(files[i])
  }
}
