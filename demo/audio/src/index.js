import { Audio } from 'ts-audio'

const song = './song.mp3'

const getVolume = (element) => Number(element.value) / 100

const volume = document.getElementById('volume')
const duration = document.getElementById('duration')
const buttonPlay = document.getElementById('bt-play')
const buttonPause = document.getElementById('bt-pause')
const buttonToggle = document.getElementById('bt-toggle')
const buttonStop = document.getElementById('bt-stop')

const audio = Audio({
  file: song,
  loop: true,
  volume: getVolume(volume),
  preload: true,
})

let intervalDurationId

audio.on('end', () => {
  console.log('end')
  buttonPlay.removeAttribute('disabled')
  buttonPause.setAttribute('disabled', 'disabled')
  buttonStop.setAttribute('disabled', 'disabled')
  clearInterval(intervalDurationId)
})

setTimeout(() => {
  audio.loop = false
}, 2000)

audio.on('ready', ({ data }) => {
  console.log('ready event data:', data)
})

audio.on('start', () => {
  console.log('start')

  if (intervalDurationId) {
    clearInterval(intervalDurationId)
  }

  intervalDurationId = setInterval(() => {
    duration.max = audio.duration
    duration.value = audio.currentTime
  }, 1000 / 60) // 60fps
})

audio.on('state', ({ data }) => console.log(data))

buttonPlay.addEventListener('click', () => {
  audio.play()
  buttonPlay.setAttribute('disabled', 'disabled')
  buttonPause.removeAttribute('disabled')
  buttonStop.removeAttribute('disabled')
})

buttonPause.addEventListener('click', () => {
  audio.pause()
  buttonPause.setAttribute('disabled', 'disabled')
  buttonStop.setAttribute('disabled', 'disabled')
  buttonPlay.removeAttribute('disabled')
  clearInterval(intervalDurationId)
})

buttonToggle.addEventListener('click', () => {
  audio.toggle()
})

buttonStop.addEventListener('click', () => {
  audio.stop()
  buttonPause.setAttribute('disabled', 'disabled')
  buttonStop.setAttribute('disabled', 'disabled')
  clearInterval(intervalDurationId)
})

volume.addEventListener('change', (e) => {
  const volume = getVolume(e.target)
  audio.volume = volume
})

duration.addEventListener('input', (e) => {
  audio.seek(Number(e.target.value))
})
