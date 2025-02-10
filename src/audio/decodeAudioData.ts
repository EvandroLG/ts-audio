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

    if (autoPlay) {
      source.start(0)
      states.isPlaying = true
    }
  }

  audioCtx.decodeAudioData(arrayBuffer, onSuccess, console.error)
}
