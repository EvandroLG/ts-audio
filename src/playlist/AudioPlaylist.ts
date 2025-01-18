/**
 * @fileoverview Audio playlist manager that handles playback of multiple audio files
 * with features like shuffle, loop, and weighted random selection.
 */

import type { PlaylistPropType, PlaylistEventType } from './types'

import { EventEmitter } from '../EventEmitter'
import playAudio from './playAudio'
import playNextAudio from './playNextAudio'
import playPrevAudio from './playPrevAudio'
import globalStates from './states'
import { shuffle as shuffleHelper, weightedFiles, preloadFiles } from './utils'

/**
 * Manages audio playlist functionality including playback control, file management,
 * and event handling.
 */
class AudioPlaylist {
  /** Event emitter for handling playlist events */
  private emmiter: EventEmitter
  /** Global state object containing audio playback states */
  private states: typeof globalStates
  /** Array of audio file paths to be played */
  private copiedFiles: string[]
  /** Flag indicating if playlist should loop */
  private shouldLoop: boolean
  /** Curried function for playing audio files */
  private curryPlayAudio: ReturnType<typeof playAudio>

  /**
   * Creates an instance of AudioPlaylist.
   * @param {Object} config - The playlist configuration
   * @param {(string[] | Record<string, number>)} config.files - Array of audio files or weighted object
   * @param {number} [config.volume=1] - Initial volume level (0-1)
   * @param {boolean} [config.loop=false] - Whether to loop the playlist
   * @param {boolean} [config.shuffle=false] - Whether to shuffle the playlist
   * @param {boolean} [config.preload=false] - Whether to preload audio files
   * @param {number} [config.preloadLimit=3] - Number of files to preload
   */
  constructor({
    files,
    volume = 1,
    loop = false,
    shuffle = false,
    preload = false,
    preloadLimit = 3,
  }: PlaylistPropType) {
    this.emmiter = new EventEmitter()
    this.states = { ...globalStates, ...{ volume, loop } }

    const hasWeights = !Array.isArray(files)
    this.shouldLoop = loop || hasWeights

    const normalizedFiles: string[] = hasWeights
      ? weightedFiles(files as { [key: string]: number })
      : (files as string[])

    this.copiedFiles =
      shuffle || hasWeights ? shuffleHelper(normalizedFiles) : normalizedFiles.slice()

    this.curryPlayAudio = playAudio(this.states, this.emmiter)

    if (preload) {
      preloadFiles(this.copiedFiles, preloadLimit)
    }
  }

  /**
   * Starts or resumes audio playback.
   * If no audio is playing or playback was stopped, starts from current position.
   */
  play(): void {
    const { audio } = this.states
    this.states.isPlaying = true

    if (!audio || this.states.isStopped) {
      this.curryPlayAudio(this.copiedFiles, this.shouldLoop)
      this.states.isStopped = false
      return
    }

    audio.play()
  }

  /**
   * Toggles between play and pause states.
   */
  toggle(): void {
    this.states.isPlaying ? this.pause() : this.play()
  }

  /**
   * Pauses the current audio playback.
   */
  pause(): void {
    this.states.audio?.pause()
    this.states.isPlaying = false
  }

  /**
   * Stops the current audio playback and resets the player.
   */
  stop(): void {
    this.states.isPlaying = false
    this.states.isStopped = true
    this.states.audio?.stop()
  }

  /**
   * Plays the next audio file in the playlist.
   */
  next(): void {
    playNextAudio(this.states, this.copiedFiles)
  }

  /**
   * Plays the previous audio file in the playlist.
   */
  prev(): void {
    playPrevAudio(this.states, this.copiedFiles)
  }

  /**
   * Registers an event listener for playlist events.
   * @param {PlaylistEventType} eventType - Type of event to listen for
   * @param {Function} callback - Callback function to execute when event occurs
   */
  on(eventType: PlaylistEventType, callback: (param: { [data: string]: unknown }) => void): void {
    this.emmiter.listener(eventType, callback)
  }

  /**
   * Gets the current volume level.
   * @returns {number} Current volume level (0-1)
   */
  get volume(): number {
    return this.states.volume
  }

  /**
   * Sets the volume level.
   * @param {number} newVolume - New volume level (0-1)
   */
  set volume(newVolume: number) {
    this.states.volume = newVolume

    if (this.states.audio) {
      this.states.audio.volume = newVolume
    }
  }

  /**
   * Gets the current loop state.
   * @returns {boolean} Whether playlist is set to loop
   */
  get loop(): boolean {
    return this.states.loop
  }

  /**
   * Sets the loop state.
   * @param {boolean} newLoop - New loop state
   */
  set loop(newLoop: boolean) {
    this.states.loop = newLoop
  }

  /**
   * Gets the current AudioContext instance.
   * @returns {(AudioContext | undefined)} Current AudioContext or undefined if not initialized
   */
  get audioCtx(): AudioContext | undefined {
    return this.states.audio?.audioCtx
  }
}

/**
 * Factory function to create a new AudioPlaylist instance.
 * @param {PlaylistPropType} params - Configuration parameters for the playlist
 */
export default (params: PlaylistPropType) => new AudioPlaylist(params)
