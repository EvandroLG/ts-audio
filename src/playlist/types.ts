export type PlaylistPropType = {
  files: string[] | { [key: string]: number }
  volume?: number
  loop?: boolean
  shuffle?: boolean
  preload?: boolean
  preloadLimit?: number
}

export type AudioPlaylistType = {
  play: () => void
  pause: () => void
  toggle: () => void
  stop: () => void
  next: () => void
  prev: () => void
  on: (eventType: PlaylistEventType, callback: <T>(param: { [data: string]: T }) => void) => void
  volume: number
  loop: boolean
  audioCtx?: AudioContext
}

export type PlaylistEventType = 'start' | 'end'
