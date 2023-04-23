# <img alt="ts-audio" src="https://github.com/EvandroLG/ts-audio/blob/master/.github/logo.svg?sanitize=true" width="144"> &middot; [![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

`ts-audio` is an agnostic and easy-to-use library to work with the `AudioContext` API and create Playlists.

## Features

- Simple API that abstracts the complexity of the AudioContext API
- Cross-browser support
- Makes easy to create audio playlist
- Works with any language that compiles to JavaScript
- Supports to Types
- Zero-dependecy

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

`ts-audio` has two components at its core: `Audio` and `AudioPlaylist`. Both components are functions that you can call with certain parameters.<br><br>
Below is an example of how to use the `Audio`:

```js
import { Audio } from 'ts-audio';

const audio = Audio({
  file: './song.mp3',
  loop: true,
  volume: 0.2,
});

audio.play();
```

- [Complete example](https://codesandbox.io/s/ts-audio-audio-m54u5)

To use the `AudioPlaylist` component is also quite simple:

```js
import { AudioPlaylist } from 'ts-audio';

const playlist = AudioPlaylist({
  files: ['./songOne.mp3', './songTwo.mp3', './songThree.mp3'],
  volume: 0.7,
});

playlist.play();
```

- [Complete example](https://codesandbox.io/s/ts-audio-playlist-ovynj)

## Docs

- Audio

  - [Parameters](https://github.com/EvandroLG/ts-audio/wiki/Audio:-Parameters)
  - [Properties](https://github.com/EvandroLG/ts-audio/wiki/Audio:-Properties)
  - [Methods](https://github.com/EvandroLG/ts-audio/wiki/Audio:-Methods)
  - [Events](https://github.com/EvandroLG/ts-audio/wiki/Audio:-Events)

* AudioPlaylist
  - [Parameters](https://github.com/EvandroLG/ts-audio/wiki/AudioPlaylist:-Parameters)
  - [Properties](https://github.com/EvandroLG/ts-audio/wiki/AudioPlaylist:-Properties)
  - [Methods](https://github.com/EvandroLG/ts-audio/wiki/AudioPlaylist:-Methods)
  - [Events](https://github.com/EvandroLG/ts-audio/wiki/AudioPlaylist:-Events)

## License

[MIT](https://github.com/EvandroLG/ts-audio/tree/master/LICENSE)
