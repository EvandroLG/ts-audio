import type { AudioClass } from '../audio/Audio'

/**
 * Represents the global state for an audio playlist.
 */
export type AudioPlaylistState = {
  volume: number
  loop: boolean
  audio: AudioClass | null
  isStopped: boolean
  isPlaying: boolean
  audioIndex: number
}

/**
 * Default initial state for the audio playlist.
 */
const states: AudioPlaylistState = {
  volume: 1,
  loop: false,
  audio: null,
  isStopped: false,
  isPlaying: false,
  audioIndex: 0,
}

export default states
