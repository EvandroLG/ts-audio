import type { PlaylistPropType, PlaylistEventType } from './types'

import { EventEmitter } from '../EventEmitter'
import playAudio from './playAudio'
import playNextAudio from './playNextAudio'
import playPrevAudio from './playPrevAudio'
import globalStates from './states'
import { shuffle as shuffleHelper, weightedFiles, preloadFiles } from './utils'

class AudioPlaylist {
  private emmiter: EventEmitter
  private states: typeof globalStates
  private copiedFiles: string[]
  private shouldLoop: boolean
  private curryPlayAudio: ReturnType<typeof playAudio>

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

  toggle(): void {
    this.states.isPlaying ? this.pause() : this.play()
  }

  pause(): void {
    this.states.audio?.pause()
    this.states.isPlaying = false
  }

  stop(): void {
    this.states.isPlaying = false
    this.states.isStopped = true
    this.states.audio?.stop()
  }

  next(): void {
    playNextAudio(this.states, this.copiedFiles)
  }

  prev(): void {
    playPrevAudio(this.states, this.copiedFiles)
  }

  on(eventType: PlaylistEventType, callback: (param: { [data: string]: unknown }) => void): void {
    this.emmiter.listener(eventType, callback)
  }

  get volume(): number {
    return this.states.volume
  }

  set volume(newVolume: number) {
    this.states.volume = newVolume

    if (this.states.audio) {
      this.states.audio.volume = newVolume
    }
  }

  get loop(): boolean {
    return this.states.loop
  }

  set loop(newLoop: boolean) {
    this.states.loop = newLoop
  }

  get audioCtx(): AudioContext | undefined {
    return this.states.audio?.audioCtx
  }
}

export default (params: PlaylistPropType) => new AudioPlaylist(params)
