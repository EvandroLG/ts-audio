import { AudioCtx } from './AudioCtx'
import { defaultStates } from './states'
import { EventEmitter } from '../EventEmitter'
import { EventHandler } from '../EventHandler'
import { decodeAudioData } from './decodeAudioData'
import { initializeSource } from './initializeSource'
import { getBuffer, preloadFile } from './utils'

/**
 * Configuration options for creating an Audio instance.
 */
type AudioProp = {
  /** Path or URL to the audio file */
  file: string
  /** Initial volume level (0 to 1) */
  volume?: number
  /** Time in seconds to start playback */
  time?: number
  /** Whether to start playing automatically */
  autoPlay?: boolean
  /** Whether to loop the audio */
  loop?: boolean
  /** Whether to preload the audio file */
  preload?: boolean
}

/**
 * Valid event types that can be emitted by the Audio instance.
 */
type AudioEvent = 'ready' | 'start' | 'state' | 'end'

/**
 * If `AudioContext` is initialized before a user gesture on the page, its
 * state becomes `suspended` by default. Once `AudioContext.state` is `suspended`,
 * the only way to start it after a user gesture is executing the `resume` method.
 */
const start = (audioCtx: AudioContext, source: AudioBufferSourceNode, time: number) =>
  audioCtx.state === 'suspended'
    ? audioCtx.resume().then(() => source.start(0, time))
    : source.start(0, time)

/**
 * Audio player class that provides control over a single audio file.
 * Implements the AudioType interface for managing audio playback, volume, and events.
 */
export class AudioClass {
  /** @private Path or URL to the audio file */
  private _file: AudioProp['file']
  /** @private Initial volume level set during construction */
  private _initialVolume: number
  /** @private Initial time in seconds to start playback */
  private _initialTime: number
  /** @private Flag indicating if audio should play automatically */
  private _autoPlay: boolean
  /** @private Initial loop state set during construction */
  private _initialLoop: boolean
  /** @private Web Audio API context */
  private _audioCtx: AudioContext
  /** @private Internal state management object */
  private _states: typeof defaultStates
  /** @private Event emitter for handling audio events */
  private _emitter: EventEmitter
  /** @private Event handler for managing event subscriptions */
  private _eventHandler: EventHandler
  /** @private Track when playback started for currentTime calculation */
  private _startTime = 0
  /** @private Track pause position for accurate seeking */
  private _pauseTime = 0
  /** @private Flag to track if seeking occurred while audio was paused */
  private _hasSeekedWhilePaused = false

  /**
   * Creates an instance of Audio player.
   *
   * @param {AudioProp} config - The audio configuration object
   * @param {string} config.file - Path or URL to the audio file
   * @param {number} [config.volume=1] - Initial volume level (0 to 1)
   * @param {number} [config.time=0] - Time in seconds to start playback
   * @param {boolean} [config.autoPlay=false] - Whether to start playing automatically
   * @param {boolean} [config.loop=false] - Whether to loop the audio
   * @param {boolean} [config.preload=false] - Whether to preload the audio file
   */
  constructor({
    file,
    volume = 1,
    time = 0,
    autoPlay = false,
    loop = false,
    preload = false,
  }: AudioProp) {
    this._file = file
    this._initialVolume = volume
    this._initialTime = time
    this._autoPlay = autoPlay
    this._initialLoop = loop
    this._audioCtx = AudioCtx()
    this._states = { ...defaultStates }
    this._emitter = new EventEmitter()
    this._eventHandler = new EventHandler(this._emitter, this._audioCtx)

    if (preload) {
      preloadFile(file)
    }
  }

  /**
   * Recreates source and starts playback at specified time.
   * @private
   * @param {number} time - Time in seconds to start playback
   * @param {AudioBuffer} buffer - The audio buffer to use
   */
  private recreateAndStart(time: number, buffer: AudioBuffer): void {
    try {
      // Stop current source if playing
      if (this._states.source) {
        this._states.source.stop(0)
        this._states.source.onended = null
      }

      initializeSource({
        audioCtx: this._audioCtx,
        volume: this._states.gainNode?.gain.value ?? this._initialVolume,
        emitter: this._emitter,
        states: this._states,
      })

      const { source } = this._states

      if (source) {
        source.buffer = buffer
        source.loop = this._initialLoop

        start(this._audioCtx, source, time)
        this._startTime = this._audioCtx.currentTime
        this._pauseTime = time
        this._states.isPlaying = true
        this._states.hasStarted = true
      }
    } catch (error) {
      console.error('Failed to recreate audio source:', error)
      this._states.isPlaying = false
    }
  }

  /**
   * Fetches and decodes the audio buffer for the given source node.
   * @private
   * @param {AudioBufferSourceNode} source - The audio source node to load buffer into
   */
  private curryGetBuffer(source: AudioBufferSourceNode): void {
    this._states.isDecoded = false

    getBuffer(this._file)
      .then((arrayBuffer) => {
        decodeAudioData({
          audioCtx: this._audioCtx,
          source,
          arrayBuffer,
          autoPlay: this._autoPlay,
          loop: this._initialLoop,
          states: this._states,
          emitter: this._emitter,
        })
      })
      .catch(console.error)
  }

  /**
   * Starts or resumes audio playback.
   * If playback hasn't started, initializes audio source and begins playback.
   * If playback was paused, resumes from the current position.
   * If seeking occurred while paused, recreates the source at the new position.
   */
  public play(): void {
    if (this._states.hasStarted && !this._hasSeekedWhilePaused) {
      this._audioCtx.resume()
      this._startTime = this._audioCtx.currentTime
      this._states.isPlaying = true
      return
    }

    // If seeked while paused, recreate source at the new position
    if (this._hasSeekedWhilePaused && this._states.source?.buffer) {
      const audioBuffer = this._states.source.buffer
      this.recreateAndStart(this._pauseTime, audioBuffer)
      this._hasSeekedWhilePaused = false
      return
    }

    initializeSource({
      audioCtx: this._audioCtx,
      volume: this._initialVolume,
      emitter: this._emitter,
      states: this._states,
    })

    const { source } = this._states

    if (source) {
      this.curryGetBuffer(source)

      if (this._states.isDecoded) {
        start(this._audioCtx, source, this._pauseTime ?? this._initialTime)
        this._startTime = this._audioCtx.currentTime
      } else {
        this._emitter.listener('decoded', () => {
          start(this._audioCtx, source, this._pauseTime ?? this._initialTime)
          this._startTime = this._audioCtx.currentTime
        })
      }

      this._states.hasStarted = true
      this._states.isPlaying = true
      this._emitter.emit('start', { data: null })
    }
  }

  /**
   * Pauses audio playback by suspending the audio context.
   */
  public pause(): void {
    if (this._states.isPlaying) {
      this._pauseTime = this.currentTime
    }

    this._audioCtx.suspend()
    this._states.isPlaying = false
    this._hasSeekedWhilePaused = false
  }

  /**
   * Toggles between play and pause states.
   */
  public toggle(): void {
    this._states.isPlaying ? this.pause() : this.play()
  }

  /**
   * Stops audio playback completely.
   * Different from pause as it resets the playback position.
   */
  public stop(): void {
    if (this._states.hasStarted) {
      this._states.source?.stop(0)
      this._states.isPlaying = false
    }
  }

  /**
   * Subscribes to audio events.
   * @param {AudioEvent} eventType - Type of event to listen for
   * @param {Function} callback - Function to call when event occurs
   */
  public on(eventType: AudioEvent, callback: <T>(param: { [data: string]: T }) => void): void {
    this._eventHandler[eventType]?.(callback)
  }

  /**
   * Gets the current volume level.
   * @returns {number} Current volume value between 0 and 1
   */
  public get volume(): number {
    return this._states.gainNode?.gain.value ?? 0
  }

  /**
   * Sets the audio volume level.
   * @param {number} newVolume - New volume value between 0 and 1
   */
  public set volume(newVolume: number) {
    if (this._states.gainNode) {
      this._states.gainNode.gain.value = newVolume
    }
  }

  /**
   * Gets the current loop state.
   * @returns {boolean} Whether audio is set to loop
   */
  public get loop(): boolean {
    return this._states.source?.loop ?? false
  }

  /**
   * Sets the loop state.
   * @param {boolean} newLoop - Whether audio should loop
   */
  public set loop(newLoop: boolean) {
    if (this._states.source) {
      this._states.source.loop = newLoop
    }
  }

  /**
   * Gets the current state of the audio context.
   * @returns {AudioContextState} Current state of the audio context
   */
  public get state(): AudioContextState {
    return this._audioCtx.state
  }

  /**
   * Gets the current AudioContext instance.
   * @returns {AudioContext} The current AudioContext instance
   */
  public get audioCtx(): AudioContext {
    return this._audioCtx
  }

  /**
   * Gets the total duration of the loaded audio in seconds.
   * @returns {number} The duration of the audio if available; otherwise, returns 0.
   */
  public get duration(): number {
    return this._states.source?.buffer?.duration ?? 0
  }

  /**
   * Gets the current playback position in seconds.
   * @returns {number} The current playback position if available; otherwise, returns 0.
   */
  public get currentTime(): number {
    if (!this._states.hasStarted) {
      return 0
    }

    if (!this._states.isPlaying) {
      return this._pauseTime
    }

    return this._pauseTime + (this._audioCtx.currentTime - this._startTime)
  }

  /**
   * Seeks to a specific time position in the audio track.
   * @param {number} time - Time in seconds to seek to (0 ≤ time ≤ duration)
   */
  public seek(time: number): void {
    if (!this._states.source?.buffer || !this._states.isDecoded) {
      return
    }

    // Clamp time to valid bounds
    time = Math.max(0, Math.min(time, this.duration))

    const wasPlaying = this._states.isPlaying
    const audioBuffer = this._states.source.buffer

    // Stop current source if playing
    if (this._states.source && wasPlaying) {
      // Temporarily remove onended handler to prevent false "end" events during seek
      this._states.source.onended = null

      try {
        this._states.source.stop(0)
      } catch (error) {
        console.error('Error stopping audio source:', error)
      }
    }

    if (wasPlaying) {
      // Recreate source and start playing at new position
      this.recreateAndStart(time, audioBuffer)
    } else {
      // Just update pause position for paused audio
      this._pauseTime = time
      this._hasSeekedWhilePaused = true
    }
  }
}

/**
 * Factory function to create a new Audio instance.
 *
 * @param {AudioPropType} props - The audio configuration properties
 * @returns {AudioType} A new Audio instance
 */
export default (props: AudioProp): AudioClass => new AudioClass(props)
