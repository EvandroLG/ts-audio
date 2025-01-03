import type { AudioPropType, AudioEventType, AudioType } from './types'

import AudioCtx from './AudioCtx'
import globalStates from './states'
import { EventEmitter } from '../EventEmitter'
import { EventHandler } from '../EventHandler'
import decodeAudioData from './decodeAudioData'
import initializeSource from './initializeSource'
import { getBuffer, preloadFile } from './utils'

// if audiocontext is initialized before a user gesture on the page, its
// state become `suspended` by default. once audiocontext.state is `suspended`
// the only way to start it after a user gesture is executing the `resume` method
const start = (audioCtx: AudioContext, source: AudioBufferSourceNode) =>
  audioCtx.state === 'suspended' ? audioCtx.resume().then(() => source.start(0)) : source.start(0)

const Audio = ({
  file,
  volume = 1,
  autoPlay = false,
  loop = false,
  preload = false,
}: AudioPropType): AudioType => {
  const audioCtx = AudioCtx()
  const states = { ...globalStates }
  const emitter = new EventEmitter()
  const eventHandler = new EventHandler(emitter, audioCtx)
  const curryGetBuffer = (source: AudioBufferSourceNode) => {
    states.isDecoded = false

    getBuffer(file)
      .then((buffer) => decodeAudioData(audioCtx, source, buffer, autoPlay, loop, states, emitter))
      .catch(console.error)
  }

  if (preload) {
    preloadFile(file)
  }

  const Player = {
    play() {
      if (states.hasStarted) {
        audioCtx.resume()
        states.isPlaying = true
        return
      }

      initializeSource(audioCtx, volume, emitter, states)
      const { source } = states

      if (source) {
        curryGetBuffer(source)

        states.isDecoded
          ? start(audioCtx, source)
          : emitter.listener('decoded', () => start(audioCtx, source))

        states.hasStarted = true
        states.isPlaying = true
        emitter.emit('start', { data: null })
      }
    },

    pause() {
      audioCtx.suspend()
      states.isPlaying = false
    },

    toggle() {
      states.isPlaying ? Player.pause() : Player.play()
    },

    stop() {
      if (states.hasStarted) {
        states.source?.stop(0)
        states.isPlaying = false
      }
    },

    on(eventType: AudioEventType, callback: <T>(param: { [data: string]: T }) => void) {
      eventHandler[eventType]?.(callback)
    },

    get volume() {
      return states.gainNode?.gain.value ?? 0
    },

    set volume(newVolume: number) {
      if (states.gainNode) {
        states.gainNode.gain.value = newVolume
      }
    },

    get loop() {
      return states.source?.loop ?? false
    },

    set loop(newLoop: boolean) {
      if (states.source) {
        states.source.loop = newLoop
      }
    },

    get state() {
      return audioCtx.state
    },

    get audioCtx() {
      return audioCtx
    },
  }

  return Player
}

export default Audio
