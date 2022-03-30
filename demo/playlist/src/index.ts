import { AudioPlaylist } from '../../../src';
import songOne from './1.mp3';
import songTwo from './2.mp3';
import songThree from './3.mp3';

const getVolume = (element: HTMLInputElement) => Number(element.value) / 100;
const range = <HTMLInputElement>document.getElementById('range');

const playlist = AudioPlaylist({
  files: [songOne, songTwo, songThree],
  volume: getVolume(range),
  loop: true,
  shuffle: true,
  preload: true,
});

const buttonPlay = document.getElementById('bt-play');
const buttonPause = document.getElementById('bt-pause');
const buttonStop = document.getElementById('bt-stop');
const buttonNext = document.getElementById('bt-next');
const buttonPrev = document.getElementById('bt-prev');
const buttonToggle = document.getElementById('bt-toggle');

playlist.on('start', console.log);
playlist.on('end', () => {
  buttonPlay.removeAttribute('disabled');
  buttonPause.setAttribute('disabled', 'disabled');
  buttonStop.setAttribute('disabled', 'disabled');
});

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

buttonNext.addEventListener('click', () => {
  playlist.next();
  buttonPlay.setAttribute('disabled', 'disabled');
  buttonPause.removeAttribute('disabled');
  buttonStop.removeAttribute('disabled');
});

buttonPrev.addEventListener('click', () => {
  playlist.prev();
  buttonPlay.setAttribute('disabled', 'disabled');
  buttonPause.removeAttribute('disabled');
  buttonStop.removeAttribute('disabled');
});

buttonToggle.addEventListener('click', () => {
  playlist.toggle();
});

range.addEventListener('change', (e: Event) => {
  const volume = getVolume(e.target as HTMLInputElement);
  playlist.volume = volume;
});
