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

## Parameters
* file: <code>string</code>
* volume?: <code>number</code> (Range 0-1, <code>1</code> by default)
* autoPlay?: <code>boolean</code> (<code>false</code> by default)
* loop?: <code>boolean</code> (<code>false</code> by default)

## Properties
Both properties are `getter` and `setter`

* audio.<code>volume: number</code>
* audio.<code>loop: boolean</code>

## Methods
* audio.<code>play(): void</code><br>
Starts playing the video as soon as the audio is loaded. In case the audio was previously paused, it continues to play from the position that had been paused.

* audio.<code>pause(): void</code><br>
Pauses the audio and can be played again by calling the `play` method

* audio.<code>stop(): void</code><br>
Stops playback immediately.

## Events
To listen to an event, use the following method:

```js
audio.on(eventType: 'ready' | 'start' | 'state', callback: (param: { data: any }) => void)
```

### Event Types
* <code>ready</code><br>
Triggered after the audio file has been loaded and decoded.<br>
`data` returns a `AudioBuffer` with the following properties: `duration`, `length`, `numberOfChannels`, `sampleRate`

* <code>start</code><br>
Triggered as soon as the audio is played for the first time.

* <code>state</code></br>
Fires when the audio context's state changes.
`data` returns the possible values: `suspended`, `running`, `closed`.

## LICENSE
[MIT](https://github.com/EvandroLG/ts-audio/tree/master/LICENSE)
