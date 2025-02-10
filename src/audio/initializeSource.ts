import type { EventEmitter } from '../EventEmitter'
import type { AudioState } from './states'

type InitializeSourceConfig = {
  audioCtx: AudioContext
  volume: number
  emitter: EventEmitter
  states: AudioState
}

/**
 * Initializes and configures an audio source node with gain control.
 * Sets up the audio processing chain and configures event handling for playback completion.
 *
 * @param {InitializeSourceConfig} config - Configuration object containing:
 *   - audioCtx: Web Audio API context
 *   - volume: Initial volume level (0 to 1)
 *   - emitter: Event emitter for broadcasting audio events
 *   - states: State management object for tracking audio state
 * @returns {void}
 * @emits {Event} 'end' - Emitted when audio playback completes
 */
export const initializeSource = ({
  audioCtx,
  volume,
  emitter,
  states,
}: InitializeSourceConfig): void => {
  const source = (states.source = audioCtx.createBufferSource())
  const gainNode = (states.gainNode = audioCtx.createGain())

  gainNode.gain.value = volume
  gainNode.connect(audioCtx.destination)
  source.connect(gainNode)

  source.onended = () => {
    states.hasStarted = false
    states.isPlaying = false
    emitter.emit('end', { data: null })
  }
}
