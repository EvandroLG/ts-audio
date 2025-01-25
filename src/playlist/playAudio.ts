import type { Event, EventEmitter } from '../EventEmitter'
import type { AudioPlaylistState } from './states'

import Audio from '../audio/Audio'

/**
 * Creates an audio playback controller function that manages playlist state and events.
 *
 * @param {AudioPlaylistState} states - Global state object containing audio playback states
 * @param {EventEmitter} emmiter - Event emitter for handling playlist events
 * @returns {(files: string[], loop: boolean) => void} A function that handles audio playback
 */
const playAudio = (
  states: AudioPlaylistState,
  emmiter: EventEmitter,
): ((files: string[], loop: boolean) => void) => {
  const playAudioHelper = (files: string[], loop: boolean) => {
    const file = files[states.audioIndex]
    const audio = Audio({ file, volume: states.volume })
    states.audio = audio

    audio.on('start', (e) => {
      emmiter.emit('start', e as Event)
    })

    audio.on('end', () => {
      if (states.isStopped) return

      if (files.length === states.audioIndex + 1) {
        states.audio = null
        states.audioIndex = 0

        if (states.loop) {
          playAudioHelper(files, loop)
        } else {
          emmiter.emit('end', { data: null })
          states.isPlaying = false
        }
      } else {
        states.audioIndex++
        playAudioHelper(files, loop)
      }
    })

    audio.play()
  }

  return playAudioHelper
}

export default playAudio
