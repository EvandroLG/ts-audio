# ts-audio &middot; [![Build Status](https://travis-ci.org/EvandroLG/ts-audio.svg?branch=master)](https://travis-ci.org/ts-audio) [![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)
`ts-audio` is an agnostic and easy-to-use library to work with the `AudioContext` API.

## Features
* Simple API that abstracts the complexity of the AudioContext API
* Cross-browser support
* Works with any language that compiles to JavaScript
* Support to Types

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

- [Complete example](https://github.com/EvandroLG/ts-audio/tree/master/demo)

## Docs
* Audio
  * [Parameters](https://github.com/EvandroLG/ts-audio/wiki/Parameters)
  * [Properties](https://github.com/EvandroLG/ts-audio/wiki/Properties)
  * [Methods](https://github.com/EvandroLG/ts-audio/wiki/Methods)
  * [Events](https://github.com/EvandroLG/ts-audio/wiki/Events)

## License
[MIT](https://github.com/EvandroLG/ts-audio/tree/master/LICENSE)
