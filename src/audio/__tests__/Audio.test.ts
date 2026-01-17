import { describe, it, expect, beforeEach, mock } from 'bun:test'

import Audio from '../Audio'
import { AudioCtx } from '../AudioCtx'

/** Test-only interface for accessing private Audio internals */
interface AudioTestInternals {
  _pauseTime: number
  _pendingSeekTime: number | null
}

mock.module('../AudioCtx', () => ({
  AudioCtx: mock(),
}))

mock.module('../initializeSource', () => ({
  initializeSource: mock(),
}))

describe('audio', () => {
  let audioCtxMock: AudioContext
  let mockCreateBufferSource: ReturnType<typeof mock>
  let mockCreateGain: ReturnType<typeof mock>
  let mockResume: ReturnType<typeof mock>
  let mockSuspend: ReturnType<typeof mock>

  beforeEach(() => {
    mockCreateBufferSource = mock(() => {})
    mockCreateGain = mock(() => {})
    mockResume = mock(() => {})
    mockSuspend = mock(() => {})

    audioCtxMock = {
      createBufferSource: mockCreateBufferSource,
      createGain: mockCreateGain,
      resume: mockResume,
      suspend: mockSuspend,
      state: 'running',
    } as unknown as AudioContext

    // Configure AudioCtx() to return our fake context
    ;(AudioCtx as unknown as ReturnType<typeof mock>).mockImplementation(() => audioCtxMock)

    // Reset mock implementations
    mockCreateBufferSource.mockReturnValue({
      buffer: null,
      loop: false,
      stop: mock(() => {}),
      start: mock(() => {}),
      context: audioCtxMock,
    })

    mockCreateGain.mockReturnValue({
      gain: { value: 0.8 },
      connect: mock(() => {}),
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
        stop: mock(() => {}),
        start: mock(() => {}),
        context: audioCtxMock,
      } as unknown as AudioBufferSourceNode

      mockGainNode = {
        gain: { value: 0.8 },
        connect: mock(() => {}),
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
      expect((audio as unknown as AudioTestInternals)._pauseTime).toBe(0)
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
      expect((audio as unknown as AudioTestInternals)._pauseTime).toBe(120)
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

    it('should accept seek before play() is called', () => {
      Object.defineProperty(audio, '_states', {
        value: {
          isDecoded: false,
          isPlaying: false,
          hasStarted: false,
          source: null,
          gainNode: null,
        },
        writable: true,
      })

      expect(() => audio.seek(30)).not.toThrow()
      expect((audio as unknown as AudioTestInternals)._pendingSeekTime).toBe(30)
    })

    it('should accept seek before audio is decoded', () => {
      Object.defineProperty(audio, '_states', {
        value: {
          isDecoded: false,
          isPlaying: false,
          hasStarted: false,
          source: mockSource,
          gainNode: mockGainNode,
        },
        writable: true,
      })

      expect(() => audio.seek(45)).not.toThrow()
      expect((audio as unknown as AudioTestInternals)._pendingSeekTime).toBe(45)
    })
  })

  describe('destroy method', () => {
    let audio: ReturnType<typeof Audio>
    let mockSource: AudioBufferSourceNode
    let mockGainNode: GainNode
    let mockStop: ReturnType<typeof mock>
    let mockSourceDisconnect: ReturnType<typeof mock>
    let mockGainDisconnect: ReturnType<typeof mock>

    beforeEach(() => {
      mockStop = mock(() => {})
      mockSourceDisconnect = mock(() => {})
      mockGainDisconnect = mock(() => {})

      mockSource = {
        buffer: null,
        loop: false,
        stop: mockStop,
        start: mock(() => {}),
        disconnect: mockSourceDisconnect,
        context: audioCtxMock,
        onended: null,
      } as unknown as AudioBufferSourceNode

      mockGainNode = {
        gain: { value: 0.8 },
        connect: mock(() => {}),
        disconnect: mockGainDisconnect,
      } as unknown as GainNode

      audio = Audio({ file: 'test.mp3' })
    })

    it('should properly cleanup resources when destroyed', () => {
      Object.defineProperty(audio, '_states', {
        value: {
          isDecoded: true,
          isPlaying: true,
          hasStarted: true,
          source: mockSource,
          gainNode: mockGainNode,
        },
        writable: true,
      })

      audio.destroy()

      expect(mockStop).toHaveBeenCalledWith(0)
      expect(mockSourceDisconnect).toHaveBeenCalled()
      expect(mockGainDisconnect).toHaveBeenCalled()
      expect(mockSource.onended).toBe(null)
    })

    it('should handle destroy with no active source', () => {
      Object.defineProperty(audio, '_states', {
        value: {
          isDecoded: false,
          isPlaying: false,
          hasStarted: false,
          source: null,
          gainNode: null,
        },
        writable: true,
      })

      expect(() => audio.destroy()).not.toThrow()
    })
  })
})
