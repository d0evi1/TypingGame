import { useState, useCallback, useEffect, useRef } from 'react'
import type { PuzzleState, PuzzleMode } from '../types/puzzle'
import { calculateGridSize, calculateTimeLimit, createPuzzlePieces } from '../types/puzzle'
import { getRandomPuzzleImage } from '../data/puzzleImages'
import { courses } from '../data/courses'

function getRandomTextFromCourses(): string {
  const allLessons = courses.flatMap(c => c.lessons)
  const randomLesson = allLessons[Math.floor(Math.random() * allLessons.length)]
  return randomLesson.text
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const initialState: PuzzleState = {
  image: null,
  text: '',
  pieces: [],
  gridSize: 2,
  currentIndex: 0,
  correctChars: 0,
  wrongChars: 0,
  isStarted: false,
  isFinished: false,
  isShowingComplete: false,
  timeLimit: null,
  timeRemaining: null,
  startTime: null,
  endTime: null,
  revealOrder: [],
}

export function usePuzzleGame(mode: PuzzleMode) {
  const [state, setState] = useState<PuzzleState>(initialState)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isRunningRef = useRef(false)

  const initializeGame = useCallback(() => {
    const text = getRandomTextFromCourses()
    const gridSize = calculateGridSize(text.length)
    const pieces = createPuzzlePieces(gridSize)
    const image = getRandomPuzzleImage()
    const timeLimit = mode === 'timed' ? calculateTimeLimit(text.length) : null

    const pieceIds = pieces.map(p => p.id)
    const revealOrder = shuffleArray(pieceIds)

    setState({
      ...initialState,
      text,
      gridSize,
      pieces,
      image,
      timeLimit,
      timeRemaining: timeLimit,
      isShowingComplete: true,
      revealOrder,
    })

    setTimeout(() => {
      setState(prev => ({ ...prev, isShowingComplete: false }))
    }, 2000)
  }, [mode])

  const start = useCallback(() => {
    setState(prev => ({
      ...prev,
      isStarted: true,
      startTime: Date.now(),
    }))
    isRunningRef.current = true
  }, [])

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    isRunningRef.current = false
    setState(initialState)
  }, [])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isRunningRef.current) return

    setState(prev => {
      if (prev.isFinished || prev.currentIndex >= prev.text.length) return prev

      const currentChar = prev.text[prev.currentIndex]

      if (event.key === currentChar) {
        const newCorrectChars = prev.correctChars + 1
        const willFinish = prev.currentIndex + 1 >= prev.text.length
        const totalPieces = prev.pieces.length
        const textLength = prev.text.length
        
        const piecesToRevealCount = Math.floor((newCorrectChars * totalPieces) / textLength)
        const currentlyRevealed = prev.pieces.filter(p => p.isRevealed).length
        
        let newPieces = prev.pieces
        
        if (piecesToRevealCount > currentlyRevealed && prev.revealOrder.length > 0) {
          const revealOrder = prev.revealOrder
          newPieces = prev.pieces.map(p => {
            const pieceIndex = revealOrder.indexOf(p.id)
            const shouldReveal = pieceIndex >= 0 && pieceIndex < piecesToRevealCount
            if (shouldReveal && !p.isRevealed) {
              return { ...p, isRevealed: true, revealOrder: pieceIndex }
            }
            return p
          })
        }

        return {
          ...prev,
          currentIndex: prev.currentIndex + 1,
          correctChars: newCorrectChars,
          pieces: newPieces,
          isFinished: willFinish,
          endTime: willFinish ? Date.now() : prev.endTime,
        }
      } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        return {
          ...prev,
          wrongChars: prev.wrongChars + 1,
        }
      }

      return prev
    })
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (state.isStarted && state.timeRemaining !== null && state.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setState(prev => {
          if (prev.timeRemaining === null || prev.timeRemaining <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            return {
              ...prev,
              timeRemaining: 0,
              isFinished: true,
              endTime: Date.now(),
            }
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1,
          }
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [state.isStarted])

  const progress = state.text.length > 0 
    ? Math.round((state.currentIndex / state.text.length) * 100) 
    : 0

  const revealedCount = state.pieces.filter(p => p.isRevealed).length
  const totalPieces = state.pieces.length

  return {
    state,
    initializeGame,
    start,
    reset,
    progress,
    revealedCount,
    totalPieces,
  }
}