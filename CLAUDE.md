# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Bundle Size Critical

**CRITICAL CONSTRAINT**: This library must maintain bundle sizes under strict limits:

- Modern builds: **2.5KB max**
- UMD build: **2.5KB max**

Always run `bun run size` after any changes to verify bundle size compliance. Every line of code counts toward these limits.

## Common Commands

### Development

- `bun run build` - Build the library using microbundle (outputs to dist/)
- `bun test` - Run Bun tests
- `bun run lint` - Lint source code with ESLint
- `bun run lint:fix` - Fix linting issues automatically
- `bun run format` - Format code with Prettier
- `bun run format:check` - Check code formatting
- `bun run typecheck` - Run TypeScript type checking
- `bun run size` - Build and check bundle size limits
- `./scripts/build.sh` - Direct build script execution

### Testing

- `bun test` - Run all tests
- `bun test src/audio/__tests__/Audio.test.ts` - Run specific test file
- `bun test --coverage` - Run tests with coverage
- Tests use happy-dom for DOM-based audio testing

## Architecture

This is a TypeScript audio library that provides two main components:

### Core Components

1. **Audio** (`src/audio/Audio.ts`) - Single audio file player with AudioContext API
2. **AudioPlaylist** (`src/playlist/AudioPlaylist.ts`) - Multi-file playlist manager with shuffle/loop

### Key Architecture Patterns

- **Event-driven**: Both components use custom EventEmitter for state management
- **AudioContext abstraction**: AudioCtx class wraps browser AudioContext with singleton pattern
- **State management**: Centralized state objects (`states.ts`) track playback status
- **Functional utilities**: Helper functions for audio operations in `utils.ts` files

### File Structure

- `src/index.ts` - Main entry point exporting Audio and AudioPlaylist
- `src/audio/` - Single audio player implementation
- `src/playlist/` - Playlist functionality
- `src/EventEmitter.ts` & `src/EventHandler.ts` - Event system
- `__tests__/` directories - Bun tests co-located with source

### Build System

- Uses microbundle for bundling (ES, CJS, UMD outputs)
- TypeScript compilation with strict settings
- Size limits enforced: ~2.5KB for modern builds
- Husky pre-commit hooks run lint + test

### Demo Applications

- `demo/audio/` - Single audio player example (port 1234)
- `demo/playlist/` - Playlist example (port 1235)
- Both use Bun's built-in server with on-the-fly bundling

### Running Demos

```bash
# Audio demo
cd demo/audio
bun install
bun run dev

# Playlist demo
cd demo/playlist
bun install
bun run dev
```
