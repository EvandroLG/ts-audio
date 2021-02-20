import { AudioPlaylist } from '../src/';
import * as Audio from '../src/audio/Audio';

const playMock = jest.fn();
const pauseMock = jest.fn();

const audioMock: any = jest.fn(() => ({
  play: playMock,
  pause: pauseMock,
}));

jest.spyOn(Audio, 'default').mockImplementation(audioMock);

describe('audio playlist', () => {
  describe('next', () => {
    const files = ['./audio1.mp3', './audio2.mp3', './audio3.mp3'];
    const playlist = AudioPlaylist({
      files,
    });

    const verifyPlayNext = (file: string) => {
      playlist.next();

      expect(audioMock).toHaveBeenCalledWith({
        file,
        volume: 1,
      });

      expect(playMock).toHaveBeenCalled();
    };

    it('should play the second file', () => {
      verifyPlayNext(files[1]);
      expect(pauseMock).not.toHaveBeenCalled();
    });

    it('should play the last file', () => {
      verifyPlayNext(files[2]);
      expect(pauseMock).toHaveBeenCalled();
    });

    it('should play the first file when the previous audio is the last one', () => {
      verifyPlayNext(files[0]);
      expect(pauseMock).toHaveBeenCalled();
    });
  });
});
