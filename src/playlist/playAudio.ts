import Audio from '../audio/Audio';
import { EventType, EventEmitterType } from '../EventEmitter';
import { StatesPlaylistType } from './states';

type playAudioType = (files: string[], loop: boolean) => void;

const playAudio = (
  states: StatesPlaylistType,
  emmiter: EventEmitterType
): playAudioType => {
  const playAudioHelper = (files: string[], loop: boolean) => {
    const file = files[states.audioIndex];

    const audio = Audio({ file, volume: states.volume });
    states.audio = audio;

    audio.on('start', e => emmiter.emit('start', e as EventType));
    audio.on('end', () => {
      if (states.isStopped) return;

      if (files.length === states.audioIndex + 1) {
        states.audio = null;
        states.audioIndex = 0;

        if (states.loop) {
          playAudioHelper(files, loop);
        } else {
          emmiter.emit('end', { data: null });
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
