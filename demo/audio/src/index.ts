import Audio, { AudioType } from '../../../src';
import song from './song.mp3';

const getVolume = (element: HTMLInputElement) => Number(element.value) / 100;

const range = <HTMLInputElement>document.getElementById('range');
const buttonPlay = document.getElementById('bt-play');
const buttonPause = document.getElementById('bt-pause');
const buttonToggle = document.getElementById('bt-toggle');
const buttonStop = document.getElementById('bt-stop');
const audio: AudioType = Audio({
  file: song,
  loop: true,
  volume: getVolume(range),
  preload: true,
});

audio.on('end', () => {
  buttonPlay.removeAttribute('disabled');
  buttonPause.setAttribute('disabled', 'disabled');
  buttonStop.setAttribute('disabled', 'disabled');
});

setTimeout(() => {
  audio.loop = false;
}, 2000);

audio.on('ready', ({ data }) => console.log(data));
audio.on('start', () => console.log('start'));
audio.on('state', ({ data }) => console.log(data));

buttonPlay.addEventListener('click', () => {
  audio.play();
  buttonPlay.setAttribute('disabled', 'disabled');
  buttonPause.removeAttribute('disabled');
  buttonStop.removeAttribute('disabled');
});

buttonPause.addEventListener('click', () => {
  audio.pause();
  buttonPause.setAttribute('disabled', 'disabled');
  buttonStop.setAttribute('disabled', 'disabled');
  buttonPlay.removeAttribute('disabled');
});

buttonToggle.addEventListener('click', () => {
  audio.toggle();
});

buttonStop.addEventListener('click', () => {
  audio.stop();
  buttonPause.setAttribute('disabled', 'disabled');
  buttonStop.setAttribute('disabled', 'disabled');
});

range.addEventListener('change', (e: Event) => {
  const volume = getVolume(e.target as HTMLInputElement);
  audio.volume = volume;
});
