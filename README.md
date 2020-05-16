# ts-audio &middot; [![Build Status](https://travis-ci.org/EvandroLG/ts-audio.svg?branch=master)](https://travis-ci.org/ts-audio) [![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)
`ts-audio` is an agnostic and easy-to-use library to work with the `AudioContext` API.

## Features
* Simple API that abstracts the complexity of the AudioContext API
* Cross-browser support
* Works with any language that compiles to JavaScript

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
* audio.<code>play(): void</code><br>
Starts playing the video as soon as the audio is loaded. In case the audio was previously paused, it continues to play from the position that had been paused.

* audio.<code>pause(): void</code><br>
Pauses the audio and can be played again by calling the `play` method

* audio.<code>stop(): void</code><br>
Stops playback immediately.

* audio.<code>setVolume(volume: number): void</code><br>
Allows volume to be updated at any time during audio playback.

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

## LICENSE
[MIT](https://github.com/EvandroLG/ts-audio/tree/master/LICENSE)
