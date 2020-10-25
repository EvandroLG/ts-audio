import Audio from '../audio/Audio';
import { EventType, EventEmitterType } from '../EventEmitter';
import { StatesType } from './types';

const playAudio = (state: StatesType, emmiter: EventEmitterType) => {
  const _playAudio = (index: number, files: string[], loop: boolean) => {
    const file = files[index];

    if (!file) {
      emmiter.emit('end', { data: null });
      return;
    }

    const audio = Audio({ file, volume: state.volume });
    state.audio = audio;

    audio.on('start', e => emmiter.emit('start', e as EventType));
    audio.on('end', () => {
      if (state.isStopped) return;

      files.length === index + 1 && state.loop
        ? _playAudio(0, files, loop)
        : _playAudio(index + 1, files, loop);
    });

    audio.play();
  };

  return _playAudio;
};

export default playAudio;
