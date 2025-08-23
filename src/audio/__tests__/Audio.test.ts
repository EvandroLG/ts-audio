import Audio from '../Audio'
import { AudioCtx } from '../AudioCtx'

jest.mock('../AudioCtx', () => ({
  AudioCtx: jest.fn(),
}))

jest.mock('../initializeSource', () => ({
  initializeSource: jest.fn(),
}))

describe('audio', () => {
  let audioCtxMock: AudioContext
  let mockCreateBufferSource: jest.Mock
  let mockCreateGain: jest.Mock
  let mockResume: jest.Mock
  let mockSuspend: jest.Mock

  beforeEach(() => {
    // Create mock functions
    mockCreateBufferSource = jest.fn()
    mockCreateGain = jest.fn()
    mockResume = jest.fn()
    mockSuspend = jest.fn()

    // Create mock AudioContext
    audioCtxMock = {
      createBufferSource: mockCreateBufferSource,
      createGain: mockCreateGain,
      resume: mockResume,
      suspend: mockSuspend,
      state: 'running',
    } as unknown as AudioContext

    // Set up the mock implementation
    ;(AudioCtx as unknown as jest.Mock).mockImplementation(() => audioCtxMock)

    // Reset mock implementations
    mockCreateBufferSource.mockReturnValue({
      buffer: null,
      loop: false,
      stop: jest.fn(),
      start: jest.fn(),
      context: audioCtxMock,
    })

    mockCreateGain.mockReturnValue({
      gain: { value: 0.8 },
      connect: jest.fn(),
    })
  })

  it('should audio object be defined', () => {
    expect(Audio).toBeDefined()
  })

  it('should export the audio context object as a read-only property', () => {
    const audio = Audio({ file: 'test.mp3' })
    expect(audio.audioCtx).toBeDefined()
    expect(audio.audioCtx).toBe(audioCtxMock)
  })

  describe('seek method', () => {
    let audio: ReturnType<typeof Audio>
    let mockSource: AudioBufferSourceNode
    let mockGainNode: GainNode

    beforeEach(() => {
      mockSource = {
        buffer: null,
        loop: false,
        stop: jest.fn(),
        start: jest.fn(),
        context: audioCtxMock,
      } as unknown as AudioBufferSourceNode

      mockGainNode = {
        gain: {
          value: 0.8,
        },
        connect: jest.fn(),
      } as unknown as GainNode

      audio = Audio({ file: 'test.mp3' })
    })

    it('should seek to a valid time position', () => {
      Object.defineProperty(audio, '_states', {
        value: {
          isDecoded: true,
          isPlaying: false,
          hasStarted: true,
          source: mockSource,
          gainNode: mockGainNode,
        },
        writable: true,
      })

      Object.defineProperty(audio, 'duration', {
        get: () => 120,
        configurable: true,
      })

      expect(() => audio.seek(60)).not.toThrow()
    })

    it('should clamp negative time to 0', () => {
      mockSource.buffer = { duration: 120 } as AudioBuffer

      Object.defineProperty(audio, '_states', {
        value: {
          isDecoded: true,
          isPlaying: false,
          hasStarted: true,
          source: mockSource,
          gainNode: mockGainNode,
        },
        writable: true,
      })

      expect(() => audio.seek(-10)).not.toThrow()
      expect(audio['_pauseTime']).toBe(0)
    })

    it('should clamp time beyond duration to duration', () => {
      mockSource.buffer = { duration: 120 } as AudioBuffer

      Object.defineProperty(audio, '_states', {
        value: {
          isDecoded: true,
          isPlaying: false,
          hasStarted: true,
          source: mockSource,
          gainNode: mockGainNode,
        },
        writable: true,
      })

      expect(() => audio.seek(150)).not.toThrow()
      expect(audio['_pauseTime']).toBe(120)
    })

    it('should seek to boundary values correctly', () => {
      Object.defineProperty(audio, '_states', {
        value: {
          isDecoded: true,
          isPlaying: false,
          hasStarted: true,
          source: mockSource,
          gainNode: mockGainNode,
        },
        writable: true,
      })

      Object.defineProperty(audio, 'duration', {
        get: () => 120,
        configurable: true,
      })

      expect(() => audio.seek(0)).not.toThrow()
      expect(() => audio.seek(130)).not.toThrow()
    })
  })
})
