/**
 * Type definition for the audio player's internal state.
 */
export type AudioState = {
  isDecoded: boolean
  isPlaying: boolean
  hasStarted: boolean
  source: AudioBufferSourceNode | null
  gainNode: GainNode | null
}

/**
 * Default initial state for audio decoding and playback.
 */
export const defaultStates: AudioState = {
  isDecoded: false,
  isPlaying: false,
  hasStarted: false,
  source: null,
  gainNode: null,
}
