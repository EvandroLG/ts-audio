import type {
  AudioPlaylistType,
  PlaylistEventType,
  PlaylistPropType,
} from './types';

import EventEmitter from '../EventEmitter';
import playAudio from './playAudio';
import playNextAudio from './playNextAudio';
import playPrevAudio from './playPrevAudio';
import globalStates from './states';
import { preloadFiles, shuffle as shuffleHelper, weightedFiles } from './utils';

const AudioPlaylist = ({
  files,
  volume = 1,
  loop = false,
  shuffle = false,
  preload = false,
  preloadLimit = 3,
}: PlaylistPropType): AudioPlaylistType => {
  const emmiter = EventEmitter();
  const states = { ...globalStates, ...{ volume, loop } };
  const hasWeights = !Array.isArray(files);
  const shouldLoop = loop || hasWeights;
  const normalizedFiles: string[] = hasWeights
    ? weightedFiles(files as { [key: string]: number })
    : (files as string[]);
  const copiedFiles =
    shuffle || hasWeights
      ? shuffleHelper(normalizedFiles)
      : normalizedFiles.slice();
  const curryPlayAudio = playAudio(states, emmiter);

  if (preload) {
    preloadFiles(copiedFiles, preloadLimit);
  }

  const Player = {
    play() {
      const { audio } = states;
      states.isPlaying = true;

      if (!audio || states.isStopped) {
        curryPlayAudio(copiedFiles, shouldLoop);
        states.isStopped = false;

        return;
      }

      audio.play();
    },

    toggle() {
      states.isPlaying ? Player.pause() : Player.play();
    },

    pause() {
      states.audio?.pause();
      states.isPlaying = false;
    },

    stop() {
      states.isPlaying = false;
      states.isStopped = true;
      states.audio?.stop();
    },

    next() {
      playNextAudio(states, copiedFiles);
    },

    prev() {
      playPrevAudio(states, copiedFiles);
    },

    on(
      eventType: PlaylistEventType,
      callback: (param: { [data: string]: unknown }) => void
    ) {
      emmiter.listener(eventType, callback);
    },

    get volume() {
      return states.volume;
    },

    set volume(newVolume: number) {
      states.volume = newVolume;

      if (states.audio) {
        states.audio.volume = newVolume;
      }
    },

    get loop() {
      return states.loop;
    },

    get audioCtx() {
      return states.audio?.audioCtx;
    },

    set loop(newLoop: boolean) {
      states.loop = newLoop;
    },
  };

  return Player;
};

export default AudioPlaylist;
