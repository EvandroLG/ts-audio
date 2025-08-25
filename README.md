# <img alt="ts-audio" src="https://github.com/EvandroLG/ts-audio/blob/master/.github/logo.svg?sanitize=true" width="144"> &middot; [![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE) [![npm version](https://badgen.now.sh/npm/v/ts-audio)](https://www.npmjs.com/package/ts-audio)

`ts-audio` is a lightweight, agnostic, and easy-to-use TypeScript/JavaScript library that simplifies working with the Web Audio API (`AudioContext`) and provides powerful playlist management capabilities.

## ✨ Features

- **Simple API** - Abstracts the complexity of the Web Audio API
- **Cross-browser support** - Works in all modern browsers
- **Playlist management** - Create and manage audio playlists with advanced features
- **TypeScript support** - Full type definitions included
- **Zero dependencies** - Lightweight bundle
- **Event-driven** - Built-in event system for audio state changes
- **Advanced controls** - Volume, time, loop, shuffle, and more
- **Preloading support** - Optimize performance with audio preloading

## 📦 Installation

```bash
npm install ts-audio
```

```bash
yarn add ts-audio
```

```bash
pnpm add ts-audio
```

## 🚀 Quick Start

### Basic Audio Player

```typescript
import { Audio } from 'ts-audio';

const audio = Audio({
  file: './song.mp3',
  volume: 0.5,
  loop: true,
  preload: true
});

// Play the audio
audio.play();

// Pause
audio.pause();

// Stop and reset
audio.stop();
```

### Audio Playlist

```typescript
import { AudioPlaylist } from 'ts-audio';

const playlist = AudioPlaylist({
  files: ['./song1.mp3', './song2.mp3', './song3.mp3'],
  volume: 0.7,
  shuffle: true,
  loop: true
});

// Start the playlist
playlist.play();

// Next track
playlist.next();

// Previous track
playlist.previous();
```

## 📚 API Reference

### Audio Component

The `Audio` component provides control over a single audio file with full playback controls.

#### Configuration Options

```typescript
type AudioConfig = {
  file: string;           // Path or URL to the audio file
  volume?: number;        // Initial volume (0-1, default: 1)
  time?: number;          // Start time in seconds (default: 0)
  autoPlay?: boolean;     // Auto-play on creation (default: false)
  loop?: boolean;         // Loop the audio (default: false)
  preload?: boolean;      // Preload the audio file (default: false)
}
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `duration` | `number` | Total duration in seconds |
| `currentTime` | `number` | Current playback position in seconds |
| `volume` | `number` | Current volume level (0-1) |
| `loop` | `boolean` | Whether audio is looping |
| `isPlaying` | `boolean` | Current playback state |

#### Methods

| Method | Description |
|--------|-------------|
| `play()` | Start or resume playback |
| `pause()` | Pause playback |
| `stop()` | Stop playback and reset to beginning |
| `toggle()` | Toggle between play/pause |
| `seek(time: number)` | Seek to specific time in seconds |

#### Events

```typescript
// Listen to audio events
audio.on('ready', (data) => console.log('Audio loaded:', data));
audio.on('start', () => console.log('Playback started'));
audio.on('state', (data) => console.log('State changed:', data));
audio.on('end', () => console.log('Playback ended'));
```

### AudioPlaylist Component

The `AudioPlaylist` component manages multiple audio files with advanced playlist features.

#### Configuration Options

```typescript
type AudioPlaylistConfig = {
  files: string[] | { [key: string]: number };  // Array of files or weighted object
  volume?: number;        // Initial volume (0-1, default: 1)
  loop?: boolean;         // Loop the playlist (default: false)
  shuffle?: boolean;      // Shuffle playback order (default: false)
  preload?: boolean;      // Preload audio files (default: false)
  preloadLimit?: number;  // Number of files to preload (default: 3)
}
```

#### Methods

| Method | Description |
|--------|-------------|
| `play()` | Start or resume playlist |
| `pause()` | Pause playlist |
| `stop()` | Stop playlist and reset |
| `next()` | Play next track |
| `previous()` | Play previous track |
| `shuffle()` | Shuffle remaining tracks |

## 🎯 Advanced Examples

### Weighted Random Playlist

```typescript
const weightedPlaylist = AudioPlaylist({
  files: {
    './popular-song.mp3': 0.6,    // 60% chance
    './regular-song.mp3': 0.3,    // 30% chance
    './rare-song.mp3': 0.1        // 10% chance
  },
  shuffle: true
});
```

### Audio with Event Handling

```typescript
const audio = Audio({
  file: './background-music.mp3',
  volume: 0.3,
  loop: true
});

audio.on('ready', () => {
  console.log('Background music loaded');
  audio.play();
});

audio.on('end', () => {
  console.log('Track finished, looping...');
});
```

### Interactive Audio Controls

```typescript
const audio = Audio({
  file: './song.mp3',
  preload: true
});

// Volume control
document.getElementById('volume-slider').addEventListener('input', (e) => {
  audio.volume = e.target.value / 100;
});

// Time seeking
document.getElementById('time-slider').addEventListener('change', (e) => {
  const percent = e.target.value / 100;
  audio.currentTime = audio.duration * percent;
});

// Play/pause toggle
document.getElementById('play-button').addEventListener('click', () => {
  audio.toggle();
});
```

## 🔧 Browser Compatibility

- Chrome 14+
- Firefox 23+
- Safari 6+
- Edge 12+
- Opera 15+

## 📖 Demo Projects

- [Basic Audio Player](https://codesandbox.io/s/ts-audio-audio-m54u5)
- [Audio Playlist](https://codesandbox.io/s/ts-audio-playlist-ovynj)

## 🐛 Troubleshooting

### Common Issues

**Audio won't play:**
- Ensure user interaction before calling `play()` (browser autoplay policy)
- Check if audio file path is correct
- Verify audio file format is supported (MP3, WAV, OGG, etc.)

**Volume not working:**
- Volume range is 0-1 (0 = muted, 1 = full volume)
- Check if volume is being set after audio is loaded

**Events not firing:**
- Ensure event listeners are attached before calling `play()`
- Check browser console for errors

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/EvandroLG/ts-audio)
- [NPM Package](https://www.npmjs.com/package/ts-audio)
- [Issue Tracker](https://github.com/EvandroLG/ts-audio/issues)
- [Changelog](https://github.com/EvandroLG/ts-audio/releases)

---

Made with ❤️ by [EvandroLG](https://github.com/EvandroLG)
