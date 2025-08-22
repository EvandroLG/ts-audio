import * as utils from '..//utils'
import * as Audio from '../../audio/Audio'
import AudioPlaylist from '../AudioPlaylist'

const playMock = jest.fn()
const pauseMock = jest.fn()
const stopMock = jest.fn()

interface AudioMock {
  play: jest.Mock
  pause: jest.Mock
  stop: jest.Mock
}

const audioMock = jest.fn(
  (): AudioMock => ({
    play: playMock,
    pause: pauseMock,
    stop: stopMock,
  }),
)

jest.spyOn(Audio, 'default').mockImplementation(audioMock)
jest.spyOn(utils, 'preloadFiles').mockImplementation()
jest.spyOn(utils, 'shuffle').mockImplementation()

describe('AudioPlaylist', () => {
  beforeEach(() => {
    pauseMock.mockClear()
    stopMock.mockClear()
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
})
