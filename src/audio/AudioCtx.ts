import { throwsError } from './utils'

declare global {
  interface Window {
    webkitAudioContext: typeof window.AudioContext
  }
}

/**
 * Creates and returns a new AudioContext instance with cross-browser support.
 * Attempts to use standard AudioContext first, falls back to webkitAudioContext for older browsers.
 *
 * @returns {AudioContext} A new AudioContext instance
 * @throws {Error} If the browser doesn't support AudioContext
 */
export const AudioCtx = (): AudioContext => {
  const Context = window.AudioContext || window.webkitAudioContext

  if (!Context) {
    throwsError("Your browser doesn't support AudioContext - https://bit.ly/2YWmpnX")
  }

  return new Context()
}
