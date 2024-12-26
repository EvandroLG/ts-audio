import type { StatesPlaylistType } from './states'

import Audio from '../audio/Audio'

const playPrevAudio = (states: StatesPlaylistType, files: string[]): void => {
  const isFirstFile = states.audioIndex === 0
  states.audioIndex = isFirstFile ? files.length - 1 : states.audioIndex - 1

  states.audio?.pause()

  const file = files[states.audioIndex]
  const audio = Audio({ file, volume: states.volume })
  states.audio = audio
  audio.play()
}

export default playPrevAudio
