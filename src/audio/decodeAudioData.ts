import type { StatesType } from './states'
import type { EventEmitter } from '../EventEmitter'

const decodeAudioData = (
  audioCtx: AudioContext,
  source: AudioBufferSourceNode,
  arrayBuffer: ArrayBuffer,
  autoPlay: boolean,
  loop: boolean,
  states: StatesType,
  emitter: EventEmitter,
): void => {
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

export default decodeAudioData
