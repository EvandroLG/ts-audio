import { shuffle, weightedFiles, preloadFiles } from '../utils'

function compare(arr1: string[], arr2: string[]): boolean {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }

  return true
}

function unique(arr: string[]): boolean {
  return arr.length === new Set(arr.map((item) => item)).size
}

describe('utils', () => {
  describe('shuffle', () => {
    test('shuffles the elements of a given array', () => {
      const files = ['./file2.mp3', './file1.mp3', './file3.mp3', './file100.mp3', './file50.mp3']
      const shuffled = shuffle(files)

      expect(shuffled.length).toBe(files.length)
      expect(compare(shuffled, files)).toBeFalsy()
      expect(unique(shuffled)).toBeTruthy()
    })
  })

  describe('preload files', () => {
    const files = [
      './file2.mp3',
      './file1.mp3',
      './file3.mp3',
      './file4.mp3',
      './file5.mp3',
      './file6.mp3',
      './file7.mp3',
    ]

    test('requests up to 3 files concurrently', (done) => {
      let counter = 0

      const api = () => {
        counter++
        return Promise.resolve({} as Response)
      }

      preloadFiles(files, 3, api, () => {
        expect(counter).toBe(7)
        done()
      })
    })

    test('requests next file from the queue if a request fails', (done) => {
      let counter = 0

      const api = (file: string) => {
        counter++

        if (['./file3.mp3', './file7.mp3'].includes(file)) {
          return Promise.reject({} as Response)
        }

        return Promise.resolve({} as Response)
      }

      preloadFiles(files, 3, api, () => {
        expect(counter).toBe(7)
        done()
      })
    })
  })

  describe('weightedFiles', () => {
    test('builds a new array based on the weight of each file', () => {
      const map = {
        'file1.mp3': 2,
        'file2.mp3': 4,
        'file3.mp3': 10,
      }

      const result = weightedFiles(map)
      result.sort((a, b) => a.localeCompare(b))

      expect(result).toStrictEqual([
        'file1.mp3',
        'file1.mp3',
        'file2.mp3',
        'file2.mp3',
        'file2.mp3',
        'file2.mp3',
        'file3.mp3',
        'file3.mp3',
        'file3.mp3',
        'file3.mp3',
        'file3.mp3',
        'file3.mp3',
        'file3.mp3',
        'file3.mp3',
        'file3.mp3',
        'file3.mp3',
      ])
    })
  })
})
