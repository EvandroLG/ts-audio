import { AudioPlaylist } from '../../../src';
import songOne from './1.mp3';
import songTwo from './2.mp3';
import songThree from './3.mp3';

const playlist = AudioPlaylist({
  files: [songOne, songTwo, songThree],
  volume: 0.7,
});

const buttonPlay = document.getElementById('bt-play');
const buttonPause = document.getElementById('bt-pause');

playlist.on('start', console.log);
playlist.on('end', () => buttonPlay.removeAttribute('disabled'));

buttonPlay.addEventListener('click', () => {
  playlist.play();
  buttonPlay.setAttribute('disabled', 'disabled');
  buttonPause.removeAttribute('disabled');
});

buttonPause.addEventListener('click', () => {
  playlist.pause();
  buttonPause.setAttribute('disabled', 'disabled');
  buttonPlay.removeAttribute('disabled');
});
