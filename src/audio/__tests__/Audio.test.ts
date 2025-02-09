import Audio from '../Audio'

const audioCtxMock = {} as AudioContext

jest.mock('../AudioCtx', () => ({
  AudioCtx: jest.fn().mockImplementation(() => audioCtxMock),
}))

describe('audio', () => {
  it('should audio object be defined', () => {
    expect(Audio).toBeDefined()
  })

  it('should export the audio context object as a read-only property', () => {
    const audio = Audio({ file: 'test.mp3' })
    expect(audio.audioCtx).toBeDefined()
    expect(audio.audioCtx).toBe(audioCtxMock)
  })
})
