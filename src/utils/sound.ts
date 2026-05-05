import { Howl } from 'howler'

type SoundType = 'correct' | 'wrong' | 'combo' | 'complete' | 'fail' | 'click' | 'reward_reveal' | 'reward_common' | 'reward_rare' | 'reward_epic' | 'reward_legendary'

const soundFiles: Record<SoundType, string> = {
  correct: '/sounds/correct.mp3',
  wrong: '/sounds/wrong.mp3',
  combo: '/sounds/combo.mp3',
  complete: '/sounds/complete.mp3',
  fail: '/sounds/fail.mp3',
  click: '/sounds/click.mp3',
  reward_reveal: '/sounds/reward_reveal.mp3',
  reward_common: '/sounds/reward_common.mp3',
  reward_rare: '/sounds/reward_rare.mp3',
  reward_epic: '/sounds/reward_epic.mp3',
  reward_legendary: '/sounds/reward_legendary.mp3',
}

const sounds: Record<SoundType, Howl | null> = {
  correct: null,
  wrong: null,
  combo: null,
  complete: null,
  fail: null,
  click: null,
  reward_reveal: null,
  reward_common: null,
  reward_rare: null,
  reward_epic: null,
  reward_legendary: null,
}

let soundEnabled = true
let volume = 0.5

function initSounds() {
  Object.entries(soundFiles).forEach(([type, path]) => {
    sounds[type as SoundType] = new Howl({
      src: [path],
      volume: volume,
      preload: true,
    })
  })
}

export function playSound(type: SoundType) {
  if (!soundEnabled) return
  
  const sound = sounds[type]
  if (sound) {
    sound.play()
  }
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled
}

export function setVolume(newVolume: number) {
  volume = Math.max(0, Math.min(1, newVolume))
  Object.values(sounds).forEach(sound => {
    if (sound) {
      sound.volume(volume)
    }
  })
}

export function getSoundEnabled() {
  return soundEnabled
}

export function getVolume() {
  return volume
}

initSounds()