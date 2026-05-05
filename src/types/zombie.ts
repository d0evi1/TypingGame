export type ZombieType = 'normal' | 'fast' | 'strong'

export interface Zombie {
  id: string
  type: ZombieType
  position: { x: number; y: number }
  health: number
  speed: number
}

export interface ZombieGameState {
  zombies: Zombie[]
  score: number
  combo: number
  isPlaying: boolean
}

export interface ZombieGameResult {
  roundsCompleted: number
  totalKills: number
  maxCombo: number
  coinsEarned: number
}
