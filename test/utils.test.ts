import { throwsError, shuffle, preloadFiles } from '../src/utils';

function compare(arr1: string[], arr2: string[]): boolean {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

function unique(arr: string[]): boolean {
  return arr.length === new Set(arr.map(item => item)).size;
}

describe('utils', () => {
  test('throwsError', () => {
    const error = 'sorry, something failed';
    expect(() => throwsError(error)).toThrowError(`\`ts-audio\`: ${error}`);
  });

  test('shuffle', () => {
    const files = [
      './file2.mp3',
      './file1.mp3',
      './file3.mp3',
      './file100.mp3',
      './file50.mp3',
    ];

    const shuffled = shuffle(files);

    expect(shuffled.length).toBe(files.length);
    expect(compare(shuffled, files)).toBeFalsy();
    expect(unique(shuffled)).toBeTruthy();
  });

  test('preload files', done => {
    const files = [
      './file2.mp3',
      './file1.mp3',
      './file3.mp3',
      './file4.mp3',
      './file5.mp3',
      './file6.mp3',
      './file7.mp3',
    ];

    let counter = 0;

    const api = () => {
      counter++;
      return Promise.resolve({} as Response);
    };

    preloadFiles(files, 3, api, () => {
      expect(counter).toBe(7);
      done();
    });
  });
});
