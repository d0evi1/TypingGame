import type { PuzzleImage } from '../types/puzzle'

export const puzzleImages: PuzzleImage[] = [
  {
    id: 'puzzle-1',
    name: '可爱小猫',
    src: '/images/puzzles/cat.svg',
    category: 'animal',
  },
  {
    id: 'puzzle-2',
    name: '快乐小狗',
    src: '/images/puzzles/dog.svg',
    category: 'animal',
  },
  {
    id: 'puzzle-3',
    name: '聪明机器人',
    src: '/images/puzzles/robot.svg',
    category: 'character',
  },
  {
    id: 'puzzle-4',
    name: '太空火箭',
    src: '/images/puzzles/rocket.svg',
    category: 'object',
  },
  {
    id: 'puzzle-5',
    name: '小熊猫',
    src: '/images/puzzles/panda.svg',
    category: 'animal',
  },
  {
    id: 'puzzle-6',
    name: '小兔子',
    src: '/images/puzzles/rabbit.svg',
    category: 'animal',
  },
]

export function getRandomPuzzleImage(): PuzzleImage {
  return puzzleImages[Math.floor(Math.random() * puzzleImages.length)]
}
