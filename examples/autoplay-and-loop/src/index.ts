import Audio from '../../../src/';
import song from './song.mp3';

document.getElementById('bt-play').addEventListener('click', () => {
  Audio({ file: song, autoPlay: true, loop: true, volume: 0.2 });
});
