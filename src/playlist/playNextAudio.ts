import type { AudioPlaylistState } from './states'

import Audio from '../audio/Audio'

const playNextAudio = (states: AudioPlaylistState, files: string[]): void => {
  const isLastFile = states.audioIndex === files.length - 1
  states.audioIndex = isLastFile ? 0 : states.audioIndex + 1

  states.audio?.pause()

  const file = files[states.audioIndex]
  const audio = Audio({ file, volume: states.volume })
  states.audio = audio
  audio.play()
}

export default playNextAudio
