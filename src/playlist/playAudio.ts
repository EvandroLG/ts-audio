import Audio from '../audio/Audio';
import { EventType, EventEmitterType } from '../EventEmitter';
import { StateManagerType } from '../StateManager';

const playAudio = (state: StateManagerType, emmiter: EventEmitterType) => {
  const _playAudio = (index: number, files: string[], loop: boolean) => {
    const file = files[index];

    if (!file) {
      emmiter.emit('end', { data: null });
      return;
    }

    const audio = Audio({ file, volume: state.get('volume') });
    state.set('audio', audio);

    audio.on('start', e => emmiter.emit('start', e as EventType));
    audio.on('end', () => {
      if (state.get('isStopped')) return;

      files.length === index + 1 && loop
        ? _playAudio(0, files, loop)
        : _playAudio(index + 1, files, loop);
    });

    audio.play();
  };

  return _playAudio;
};

export default playAudio;
