import { AudioPlaylist } from '../src/';
import * as Audio from '../src/audio/Audio';
import * as utils from '../src/utils';

const playMock = jest.fn();
const pauseMock = jest.fn();
const stopMock = jest.fn();

const audioMock: any = jest.fn(() => ({
  play: playMock,
  pause: pauseMock,
  stop: stopMock,
}));

jest.spyOn(Audio, 'default').mockImplementation(audioMock);
jest.spyOn(utils, 'preloadFiles').mockImplementation();

describe('audio playlist', () => {
  beforeEach(() => {
    pauseMock.mockClear();
    stopMock.mockClear();
  });

  const files = ['./audio1.mp3', './audio2.mp3', './audio3.mp3'];

  describe('pause', () => {
    const playlist = AudioPlaylist({
      files,
    });

    it('should invoke pause method from audio', () => {
      playlist.pause();
      playlist.next();
      playlist.pause();
      expect(pauseMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('stop', () => {
    const playlist = AudioPlaylist({
      files,
    });

    it('should invoke stop method from audio', () => {
      playlist.stop();
      playlist.next();
      playlist.stop();
      expect(stopMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('next', () => {
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

    it('should play the first file when the previous audio was the last one', () => {
      verifyPlayNext(files[0]);
      expect(pauseMock).toHaveBeenCalled();
    });
  });

  describe('prev', () => {
    const playlist = AudioPlaylist({
      files,
    });

    const verifyPlayPrev = (file: string) => {
      playlist.prev();

      expect(audioMock).toHaveBeenCalledWith({
        file,
        volume: 1,
      });

      expect(playMock).toHaveBeenCalled();
    };

    it('should play the last file when the previous was the first one', () => {
      verifyPlayPrev(files[2]);
      expect(pauseMock).not.toHaveBeenCalled();
    });

    it('should play the second file', () => {
      verifyPlayPrev(files[1]);
      expect(pauseMock).toHaveBeenCalled();
    });

    it('should play the first file', () => {
      verifyPlayPrev(files[0]);
      expect(pauseMock).toHaveBeenCalled();
    });
  });

  describe('preload', () => {
    beforeEach(() => {
      (utils.preloadFiles as jest.Mock).mockClear();
    });

    it('should preload files using the default limit', () => {
      AudioPlaylist({
        files,
        preload: true,
      });

      expect(utils.preloadFiles).toHaveBeenCalledWith(files, 3);
    });

    it('should preload files using specified limit', () => {
      AudioPlaylist({
        files,
        preload: true,
        preloadLimit: 2,
      });

      expect(utils.preloadFiles).toHaveBeenCalledWith(files, 2);
    });

    it('should not preload files', () => {
      AudioPlaylist({
        files,
      });

      expect(utils.preloadFiles).not.toHaveBeenCalled();
    });
  });
});
