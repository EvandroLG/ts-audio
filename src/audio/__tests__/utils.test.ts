import { throwsError } from '../utils'

describe('utils', () => {
  describe('throwsError', () => {
    it('should throw an error using the message passed by parameter', () => {
      const error = 'sorry, something failed'
      expect(() => throwsError(error)).toThrowError(`\`ts-audio\`: ${error}`)
    })
  })
})
