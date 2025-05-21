import type { AudioState } from './states'
import type { EventEmitter } from '../EventEmitter'

/**
 * Configuration options for audio decoding
 */
type DecodeAudioDataConfig = {
  /** The Web Audio API context */
  audioCtx: AudioContext
  /** The audio source node to configure */
  source: AudioBufferSourceNode
  /** The raw audio data to decode */
  arrayBuffer: ArrayBuffer
  /** Whether to start playback immediately after decoding */
  autoPlay: boolean
  /** Whether the audio should loop when playing */
  loop: boolean
  /** State object to track decoding and playback status */
  states: AudioState
  /** Event emitter to broadcast decode completion */
  emitter: EventEmitter
}

/**
 * Decodes audio data from an ArrayBuffer and configures the audio source node.
 * On successful decode, sets up the audio buffer, configures looping, and optionally starts playback.
 *
 * @param {DecodeAudioDataConfig} config - Configuration object containing all necessary parameters
 * @returns {void}
 * @emits {Event} 'decoded' - Emitted when audio data is successfully decoded, includes the AudioBuffer
 */
export const decodeAudioData = ({
  audioCtx,
  source,
  arrayBuffer,
  autoPlay,
  loop,
  states,
  emitter,
}: DecodeAudioDataConfig): void => {
  const onSuccess = (buffer: AudioBuffer) => {
    source.buffer = buffer
    source.loop = loop

    states.isDecoded = true
    emitter.emit('decoded', { data: buffer })
    emitter.emit('ready', { data: null })

    if (autoPlay) {
      const start = () =>
        audioCtx.state === 'suspended' ? audioCtx.resume().then(() => source.start(0)) : source.start(0)

      start()
      states.hasStarted = true
      states.isPlaying = true
      emitter.emit('start', { data: null })
      
      // For Safari compatibility: Set up the timer-based fallback for ended event
      if (!loop) {
        const duration = buffer.duration * 1000
        const fallbackTimer = setTimeout(() => {
          // Only emit if playback hasn't been explicitly stopped
          if (states.hasStarted && states.isPlaying) {
            states.hasStarted = false
            states.isPlaying = false
            emitter.emit('end', { data: null })
          }
        }, duration + 300) // Add buffer time to ensure regular event has time to fire
        
        // Store the timer in the source for cleanup if stopped early
        source._fallbackTimer = fallbackTimer
      }
    }
  }

  audioCtx.decodeAudioData(arrayBuffer, onSuccess, console.error)
}
