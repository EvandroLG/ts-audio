# ts-audio
`ts-audio` is an agnostic and easy-to-use library to work with the `AudioContext` API.

[![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

# Properties
* file: <code>String</code>
* volume?: <code>Number</code> (Range 0-1, <code>1</code> by default)
* autoPlay?: <code>Boolean</code> (<code>false</code> by default)
* loop?: <code>Boolean</code> (<code>false</code> by default)

## Methods
* audio.<code>play()</code>
* audio.<code>stop()</code>

## Quickstart
```js
import Audio from '../../src/';

const buttonPlay = document.getElementById('bt-play');
const audio = Audio({ file: './song.mp3', loop: true, volume: 0.2 });

buttonPlay.addEventListener('click', () => {
  audio.play();
  buttonPlay.setAttribute('disabled', 'disabled');
});
```
