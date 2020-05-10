# ts-audio
`ts-audio` is an agnostic and easy-to-use library to work with the `AudioContext` API.

[![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

## Installation
To install `ts-audio`, execute:

```sh
$ npm install ts-audio
```

or

```sh
$ yarn add ts-audio
```

# Properties
* file: <code>String</code>
* volume?: <code>Number</code> (Range 0-1, <code>1</code> by default)
* autoPlay?: <code>Boolean</code> (<code>false</code> by default)
* loop?: <code>Boolean</code> (<code>false</code> by default)

## Methods
* audio.<code>play()</code>
* audio.<code>stop()</code>

## Quickstart
- [Complete example](https://github.com/EvandroLG/ts-audio/tree/master/example)

```js
import Audio from 'ts-audio';

const buttonPlay = document.getElementById('bt-play');
const audio = Audio({ file: './song.mp3', loop: true, volume: 0.2 });

buttonPlay.addEventListener('click', () => {
  audio.play();
  buttonPlay.setAttribute('disabled', 'disabled');
});
```

