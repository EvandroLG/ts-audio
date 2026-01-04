import * as utils from '..//utils'
import * as Audio from '../../audio/Audio'
import AudioPlaylist from '../AudioPlaylist'

const playMock = jest.fn()
const pauseMock = jest.fn()
const stopMock = jest.fn()
const destroyMock = jest.fn()
const onMock = jest.fn()

interface AudioMock {
  play: jest.Mock
  pause: jest.Mock
  stop: jest.Mock
  destroy: jest.Mock
  on: jest.Mock
}

const audioMock = jest.fn(
  (): AudioMock => ({
    play: playMock,
    pause: pauseMock,
    stop: stopMock,
    destroy: destroyMock,
    on: onMock,
  }),
)

jest.spyOn(Audio, 'default').mockImplementation(audioMock)
jest.spyOn(utils, 'preloadFiles').mockImplementation()
jest.spyOn(utils, 'shuffle').mockImplementation()

describe('AudioPlaylist', () => {
  beforeEach(() => {
    pauseMock.mockClear()
    stopMock.mockClear()
    destroyMock.mockClear()
    onMock.mockClear()
  })

  const files = ['./audio1.mp3', './audio2.mp3', './audio3.mp3']

  describe('pause', () => {
    const playlist = AudioPlaylist({
      files,
    })

    test('invokes the pause method from audio', () => {
      playlist.pause()
      playlist.next()
      playlist.pause()
      expect(pauseMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('stop', () => {
    const playlist = AudioPlaylist({
      files,
    })

    it('invokes the stop method from audio', () => {
      playlist.stop()
      playlist.next()
      playlist.stop()
      expect(stopMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('next', () => {
    const playlist = AudioPlaylist({
      files,
    })

    const verifyPlayNext = (file: string) => {
      playlist.next()

      expect(audioMock).toHaveBeenCalledWith({
        file,
        volume: 1,
      })

      expect(playMock).toHaveBeenCalled()
    }

    test('plays the second file', () => {
      verifyPlayNext(files[1])
      expect(pauseMock).not.toHaveBeenCalled()
    })

    test('plays the last file', () => {
      verifyPlayNext(files[2])
      expect(pauseMock).toHaveBeenCalled()
    })

    test('plays the first file when the previous audio was the last one', () => {
      verifyPlayNext(files[0])
      expect(pauseMock).toHaveBeenCalled()
    })
  })

  describe('prev', () => {
    const playlist = AudioPlaylist({
      files,
    })

    const verifyPlayPrev = (file: string) => {
      playlist.prev()

      expect(audioMock).toHaveBeenCalledWith({
        file,
        volume: 1,
      })

      expect(playMock).toHaveBeenCalled()
    }

    test('plays the last file when the previous was the first one', () => {
      verifyPlayPrev(files[2])
      expect(pauseMock).not.toHaveBeenCalled()
    })

    test('plays the second file', () => {
      verifyPlayPrev(files[1])
      expect(pauseMock).toHaveBeenCalled()
    })

    test('plays the first file', () => {
      verifyPlayPrev(files[0])
      expect(pauseMock).toHaveBeenCalled()
    })
  })

  describe('preload', () => {
    beforeEach(() => {
      ;(utils.preloadFiles as jest.Mock).mockClear()
    })

    test('preloads files using the default limit', () => {
      AudioPlaylist({
        files,
        preload: true,
      })

      expect(utils.preloadFiles).toHaveBeenCalledWith(files, 3)
    })

    test('preloads files using specified limit', () => {
      AudioPlaylist({
        files,
        preload: true,
        preloadLimit: 2,
      })

      expect(utils.preloadFiles).toHaveBeenCalledWith(files, 2)
    })

    test('does not preload files', () => {
      AudioPlaylist({
        files,
      })

      expect(utils.preloadFiles).not.toHaveBeenCalled()
    })
  })

  describe('shuffle', () => {
    beforeEach(() => {
      ;(utils.shuffle as jest.Mock).mockClear()
    })

    test('shuffles the files', () => {
      AudioPlaylist({
        files,
        shuffle: true,
      })

      expect(utils.shuffle).toHaveBeenCalledWith(files)
    })

    test('does not shuffle the files', () => {
      AudioPlaylist({
        files,
      })

      expect(utils.shuffle).not.toHaveBeenCalled()
    })
  })

  describe('destroy', () => {
    test('stops playback and destroys current audio instance', () => {
      const playlist = AudioPlaylist({ files })
      playlist.play()
      playlist.destroy()

      expect(stopMock).toHaveBeenCalled()
      expect(destroyMock).toHaveBeenCalled()
    })

    test('is safe to call multiple times', () => {
      const playlist = AudioPlaylist({ files })
      playlist.play()

      playlist.destroy()
      playlist.destroy()
      playlist.destroy()

      expect(stopMock).toHaveBeenCalledTimes(1)
      expect(destroyMock).toHaveBeenCalledTimes(1)
    })

    test('prevents play() after destroy', () => {
      const playlist = AudioPlaylist({ files })
      playlist.destroy()
      playlist.play()

      expect(playMock).not.toHaveBeenCalled()
    })

    test('prevents pause() after destroy', () => {
      const playlist = AudioPlaylist({ files })
      playlist.play()
      playlist.destroy()

      pauseMock.mockClear()
      playlist.pause()

      expect(pauseMock).not.toHaveBeenCalled()
    })

    test('prevents toggle() after destroy', () => {
      const playlist = AudioPlaylist({ files })
      playlist.destroy()

      playlist.toggle()

      expect(playMock).not.toHaveBeenCalled()
    })

    test('prevents stop() after destroy', () => {
      const playlist = AudioPlaylist({ files })
      playlist.play()
      playlist.destroy()

      stopMock.mockClear()
      playlist.stop()

      expect(stopMock).not.toHaveBeenCalled()
    })

    test('prevents next() after destroy', () => {
      const playlist = AudioPlaylist({ files })
      playlist.play()
      playlist.destroy()

      audioMock.mockClear()
      playMock.mockClear()
      playlist.next()

      expect(audioMock).not.toHaveBeenCalled()
      expect(playMock).not.toHaveBeenCalled()
    })

    test('prevents prev() after destroy', () => {
      const playlist = AudioPlaylist({ files })
      playlist.play()
      playlist.destroy()

      audioMock.mockClear()
      playMock.mockClear()
      playlist.prev()

      expect(audioMock).not.toHaveBeenCalled()
      expect(playMock).not.toHaveBeenCalled()
    })

    test('prevents volume setter after destroy', () => {
      const playlist = AudioPlaylist({ files })
      playlist.play()
      const initialVolume = playlist.volume

      playlist.destroy()
      playlist.volume = 0.5

      expect(playlist.volume).toBe(initialVolume)
    })
  })
})
