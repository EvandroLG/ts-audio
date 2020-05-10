import Audio from '../../src/';
import song from './song.mp3';

const getById = (value: string) => document.getElementById(value);

let audio;

getById('bt-play').addEventListener('click', () => {
  audio = Audio({ file: song, autoPlay: true, loop: true, volume: 0.2 });
  getById('bt-stop').removeAttribute('disabled');
});

getById('bt-stop').addEventListener('click', () => audio.stop());
