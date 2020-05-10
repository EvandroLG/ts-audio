import Audio from 'ts-audio';
import song from './song.mp3';

const buttonPlay = document.getElementById('bt-play');
const audio = Audio({ file: song, loop: true, volume: 0.2 });

buttonPlay.addEventListener('click', () => {
  audio.play();
  buttonPlay.setAttribute('disabled', 'disabled');
});
