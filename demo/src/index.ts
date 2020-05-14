import Audio from 'ts-audio';
import song from './song.mp3';

const getVolume = (element: HTMLInputElement) => Number(element.value) / 100;

const range = <HTMLInputElement>document.getElementById('range');
const buttonPlay = document.getElementById('bt-play');
const buttonPause = document.getElementById('bt-pause');
const audio = Audio({ file: song, loop: true, volume: 0.1 });

buttonPlay.addEventListener('click', () => {
  audio.play();

  buttonPlay.setAttribute('disabled', 'disabled');
  buttonPause.removeAttribute('disabled');
});

buttonPause.addEventListener('click', () => {
  audio.pause();
  buttonPause.setAttribute('disabled', 'disabled');
  buttonPlay.removeAttribute('disabled');
});

range.addEventListener('change', (e: Event) => {
  const volume = getVolume(e.target as HTMLInputElement);
  audio.setVolume(volume);
});
