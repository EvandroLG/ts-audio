import Audio from '../audio/Audio';
import { EventType, EventEmitterType } from '../EventEmitter';
import { StatesPlaylistType } from './states';

type playAudioType = (files: string[], loop: boolean) => void;

const playAudio = (
  states: StatesPlaylistType,
  emmiter: EventEmitterType
): playAudioType => {
  const playAudioHelper = (files: string[], loop: boolean) => {
    console.log('play audio helper was called...');
    const file = files[states.audioIndex];

    const audio = Audio({ file, volume: states.volume });
    audio.audioCtx.resume();
    states.audio = audio;

    audio.on('start', e => {
      console.log('audio start');
      emmiter.emit('start', e as EventType);
    });
    audio.on('end', () => {
      console.log('audio ended (file)');
      if (states.isStopped) return;

      if (files.length === states.audioIndex + 1) {
        console.log('audio ended (last file)');
        states.audio = null;
        states.audioIndex = 0;

        if (states.loop) {
          playAudioHelper(files, loop);
        } else {
          emmiter.emit('end', { data: null });
          states.isPlaying = false;
        }
      } else {
        states.audioIndex++;
        playAudioHelper(files, loop);
      }
    });

    audio.play();
  };

  return playAudioHelper;
};

export default playAudio;
