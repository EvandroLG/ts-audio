# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Bundle Size Critical

**CRITICAL CONSTRAINT**: This library must maintain bundle sizes under strict limits:
- Modern builds: **1.6KB max**
- UMD build: **1.7KB max**

Always run `npm run size` after any changes to verify bundle size compliance. Every line of code counts toward these limits.

## Common Commands

### Development
- `npm run build` - Build the library using microbundle (outputs to dist/)
- `npm run test` - Run Jest tests
- `npm run lint` - Lint source code with ESLint
- `npm run lint:fix` - Fix linting issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run size` - Build and check bundle size limits
- `./scripts/build.sh` - Direct build script execution

### Testing
- `npm test` - Run all tests
- `jest src/audio/__tests__/Audio.test.ts` - Run specific test file
- Tests use jsdom environment for DOM-based audio testing

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
- `__tests__/` directories - Jest tests co-located with source

### Build System
- Uses microbundle for bundling (ES, CJS, UMD outputs)
- TypeScript compilation with strict settings
- Size limits enforced: ~1.6KB for modern builds
- Husky pre-commit hooks run lint + test

### Demo Applications
- `demo/audio/` - Single audio player example
- `demo/playlist/` - Playlist example
- Both use webpack for local development
