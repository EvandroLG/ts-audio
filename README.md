# ts-audio &middot; [![Build Status](https://travis-ci.org/EvandroLG/ts-audio.svg?branch=master)](https://travis-ci.org/ts-audio) [![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)
`ts-audio` is an agnostic and easy-to-use library to work with the `AudioContext` API.

## Features
* Simple API that abstracts the complexity of the AudioContext API
* Cross-browser support
* Makes easy to create audio playlist
* Works with any language that compiles to JavaScript
* Supports to Types

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
`ts-audio` has two components at its core: `Audio` and `AudioPlaylist`. Both components are functions that you can call with certain parameters.
Below is an example of how to use the `Audio`:

```js
import Audio from 'ts-audio';

const audio = Audio({
  file: './song.mp3',
  loop: true,
  volume: 0.2
});

document.getElementById('bt-play').addEventListener('click', () => {
  audio.play()
});
```

- [Complete example](https://github.com/EvandroLG/ts-audio/tree/master/demo/audio)

To use the `AudioPlaylist` component is also quite simple:

```js
import { AudioPlaylist } from 'ts-audio';

const playlist = AudioPlaylist({
  files: ['./songOne.mp3', './songTwo.mp3', './songThree.mp3'],
  volume: 0.7,
});

document.getElementById('bt-play').addEventListener('click', () => {
  playlist.play();
});
```

- [Complete example](https://github.com/EvandroLG/ts-audio/tree/master/demo/playlist)

## Docs
* Audio
  * [Parameters](https://github.com/EvandroLG/ts-audio/wiki/Audio:-Parameters)
  * [Properties](https://github.com/EvandroLG/ts-audio/wiki/Audio:-Properties)
  * [Methods](https://github.com/EvandroLG/ts-audio/wiki/Audio:-Methods)
  * [Events](https://github.com/EvandroLG/ts-audio/wiki/Audio:-Events)

* AudioPlaylist
  * [Parameters](https://github.com/EvandroLG/ts-audio/wiki/AudioPlaylist:-Parameters)
  * [Methods](https://github.com/EvandroLG/ts-audio/wiki/AudioPlaylist:-Methods)
  * [Events](https://github.com/EvandroLG/ts-audio/wiki/AudioPlaylist:-Events)

## License
[MIT](https://github.com/EvandroLG/ts-audio/tree/master/LICENSE)
