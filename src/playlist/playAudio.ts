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

    // Safari workaround: Multiple event handlers to ensure end is captured
    const handlePlaybackEnd = () => {
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
    }

    // Use the standard event listener
    audio.on('end', handlePlaybackEnd)
    
    // For Safari: Add a manual check after the expected duration
    if (audio.audioCtx && audio.audioCtx.state !== 'closed') {
      // Create a manual duration checker if the end event doesn't fire
      const checkDuration = () => {
        // If the audio has been stopped or the end event fired normally, this won't execute
        if (states.audio === audio && states.isPlaying) {
          handlePlaybackEnd() 
        }
      }
      
      // Get the file duration and add a safety margin
      setTimeout(checkDuration, 30000) // Fallback of 30 seconds in case we can't determine duration
    }

    audio.play()
  }

  return playAudioHelper
}

export default playAudio
