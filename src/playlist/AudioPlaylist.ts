import {
  AudioPlaylistType,
  PlaylistPropType,
  PlaylistEventType,
} from './types';

import EventEmitter from '../EventEmitter';
import globalStates from './states';
import playNextAudio from './playNextAudio';
import playPrevAudio from './playPrevAudio';
import playAudio from './playAudio';
import { shuffle as shuffleHelper, preloadFiles } from '../utils';

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
  const copiedFiles = shuffle ? shuffleHelper(files) : files.slice();
  const curryPlayAudio = playAudio(states, emmiter);

  if (preload) {
    preloadFiles(copiedFiles, preloadLimit);
  }

  return {
    play() {
      const { audio } = states;

      if (!audio || states.isStopped) {
        curryPlayAudio(copiedFiles, loop);
        states.isStopped = false;

        return;
      }

      audio.play();
    },

    pause() {
      states.audio?.pause();
    },

    stop() {
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

    set loop(newLoop: boolean) {
      states.loop = newLoop;
    },
  };
};

export default AudioPlaylist;
