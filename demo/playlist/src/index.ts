import { AudioPlaylist } from 'ts-audio';
import songOne from './1.mp3';
import songTwo from './2.mp3';
import songThree from './3.mp3';

const getVolume = (value: string) => Number(value) / 100;

const buttonPlay = document.getElementById('bt-play');
const buttonPause = document.getElementById('bt-pause');
const buttonStop = document.getElementById('bt-stop');
const range = document.getElementById('range');

const playlist = AudioPlaylist({
  files: [songOne, songTwo, songThree],
  volume: getVolume((range as HTMLInputElement).value),
  loop: true,
});

playlist.on('start', console.log);
playlist.on('end', () => buttonPlay.removeAttribute('disabled'));

buttonPlay.addEventListener('click', () => {
  playlist.play();
  buttonPlay.setAttribute('disabled', 'disabled');
  buttonPause.removeAttribute('disabled');
  buttonStop.removeAttribute('disabled');
});

buttonPause.addEventListener('click', () => {
  playlist.pause();
  buttonPause.setAttribute('disabled', 'disabled');
  buttonStop.setAttribute('disabled', 'disabled');
  buttonPlay.removeAttribute('disabled');
});

buttonStop.addEventListener('click', () => {
  playlist.stop();
  buttonPause.setAttribute('disabled', 'disabled');
  buttonStop.setAttribute('disabled', 'disabled');
  buttonPlay.removeAttribute('disabled');
});

range.addEventListener('change', (e: Event) => {
  const volume = getVolume((e.target as HTMLInputElement).value);
  playlist.volume = volume;
});
