import Audio from '../audio/Audio';
import { EventType, EventEmitterType } from '../EventEmitter';
import { StatesPlaylistType } from './types';

const playAudio = (states: StatesPlaylistType, emmiter: EventEmitterType) => {
  const _playAudio = (index: number, files: string[], loop: boolean) => {
    const file = files[index];

    const audio = Audio({ file, volume: states.volume });
    states.audio = audio;

    audio.on('start', e => emmiter.emit('start', e as EventType));
    audio.on('end', () => {
      if (states.isStopped) return;

      if (files.length === index + 1) {
        states.audio = null;
        states.loop
          ? _playAudio(0, files, loop)
          : emmiter.emit('end', { data: null });
      } else {
        _playAudio(index + 1, files, loop);
      }
    });

    audio.play();
  };

  return _playAudio;
};

export default playAudio;
