# ts-audio &middot; [![Build Status](https://travis-ci.org/EvandroLG/ts-audio.svg?branch=master)](https://travis-ci.org/ts-audio) [![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)
`ts-audio` is an agnostic and easy-to-use library to work with the `AudioContext` API.


## Installation
To install `ts-audio`, execute:

```sh
$ npm install ts-audio
```

or

```sh
$ yarn add ts-audio
```

## Parameters
* file: <code>string</code>
* volume?: <code>number</code> (Range 0-1, <code>1</code> by default)
* autoPlay?: <code>boolean</code> (<code>false</code> by default)
* loop?: <code>boolean</code> (<code>false</code> by default)

## Methods
* audio.<code>play(): void</code>
* audio.<code>stop(): void</code>
* audio.<code>setVolume(volume: number): void</code>

## Quickstart
- [Complete example](https://github.com/EvandroLG/ts-audio/tree/master/demo)

```js
import Audio from 'ts-audio';

const buttonPlay = document.getElementById('bt-play');
const audio = Audio({ file: './song.mp3', loop: true, volume: 0.2 });

buttonPlay.addEventListener('click', () => {
  audio.play();
  buttonPlay.setAttribute('disabled', 'disabled');
});
```

