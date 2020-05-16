import { throwsError } from '../src/utils';

describe('utils', () => {
  test('throwsError', () => {
    const error = 'sorry, something failed';
    expect(() => throwsError(error)).toThrowError(`\`ts-audio\`: ${error}`);
  });
});
