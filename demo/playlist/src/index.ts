import { AudioPlaylist } from '../../../src';
import songOne from './1.mp3';
import songTwo from './2.mp3';
import songThree from './3.mp3';

const playlist = AudioPlaylist({
  files: [songOne, songTwo, songThree],
  volume: 0.7,
});

document.getElementById('bt-play').addEventListener('click', () => {
  playlist.play();
});
