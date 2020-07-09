import { AudioPlaylist } from '../../../src';
import songOne from './1.mp3';
import songTwo from './2.mp3';
import songThree from './3.mp3';

const playlist = AudioPlaylist({
  files: [songOne, songTwo, songThree],
  volume: 0.7,
});

const buttonPlay = document.getElementById('bt-play');

playlist.on('end', () => buttonPlay.removeAttribute('disabled'));

buttonPlay.addEventListener('click', () => {
  playlist.play();
  buttonPlay.setAttribute('disabled', 'disabled');
});