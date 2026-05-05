export interface PuzzleImage {
  id: string
  name: string
  src: string
  category: 'animal' | 'character' | 'object'
}

export interface PuzzlePiece {
  id: number
  row: number
  col: number
  isRevealed: boolean
  revealOrder: number
}

export interface PuzzleState {
  image: PuzzleImage | null
  text: string
  pieces: PuzzlePiece[]
  gridSize: number
  currentIndex: number
  correctChars: number
  wrongChars: number
  isStarted: boolean
  isFinished: boolean
  isShowingComplete: boolean
  timeLimit: number | null
  timeRemaining: number | null
  startTime: number | null
  endTime: number | null
  revealOrder: number[]
}

export interface PuzzleResult {
  completed: boolean
  correctChars: number
  wrongChars: number
  duration: number
  timeRemaining: number | null
}

export type PuzzleMode = 'timed' | 'untimed'

export function calculateGridSize(textLength: number): number {
  if (textLength < 20) return 2
  if (textLength <= 50) return 3
  return 4
}

export function calculateTimeLimit(textLength: number): number {
  return textLength * 3
}

export function createPuzzlePieces(gridSize: number): PuzzlePiece[] {
  const pieces: PuzzlePiece[] = []
  let id = 0
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      pieces.push({
        id,
        row,
        col,
        isRevealed: false,
        revealOrder: -1,
      })
      id++
    }
  }
  return pieces
}
