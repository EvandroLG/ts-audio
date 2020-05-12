import { throwsError } from '../src/utils';

describe('utils', () => {
  it('throwsError', () => {
    const error = 'sorry, something failed';
    expect(() => throwsError(error)).toThrowError(`\`ts-audio\`: ${error}`);
  });
});
