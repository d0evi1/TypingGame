import { useState, useCallback, useEffect, useRef } from 'react'
import type { TypingState, TypingResult, MistakeRecord } from '../types'

const initialState: TypingState = {
  currentIndex: 0,
  correctChars: 0,
  wrongChars: 0,
  startTime: null,
  endTime: null,
  isFinished: false,
  isStarted: false,
  combo: 0,
  maxCombo: 0,
  mistakes: new Map(),
}

export function useTypingGame(text: string) {
  const [state, setState] = useState<TypingState>(initialState)
  const inputRef = useRef<HTMLInputElement>(null)
  const isRunningRef = useRef(false)

  const reset = useCallback(() => {
    setState(initialState)
    isRunningRef.current = false
  }, [])

  const start = useCallback(() => {
    setState(prev => ({
      ...prev,
      isStarted: true,
      startTime: Date.now(),
    }))
    isRunningRef.current = true
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isRunningRef.current) return

    const currentIndex = state.currentIndex
    if (currentIndex >= text.length) return

    const currentChar = text[currentIndex]
    
    if (event.key === currentChar) {
      const willFinish = currentIndex + 1 >= text.length
      setState(prev => {
        const newCombo = prev.combo + 1
        const newMaxCombo = Math.max(prev.maxCombo, newCombo)
        return {
          ...prev,
          currentIndex: prev.currentIndex + 1,
          correctChars: prev.correctChars + 1,
          combo: newCombo,
          maxCombo: newMaxCombo,
          isFinished: willFinish,
          endTime: willFinish ? Date.now() : prev.endTime,
        }
      })
      if (willFinish) {
        isRunningRef.current = false
      }
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      setState(prev => {
        const newMistakes = new Map(prev.mistakes)
        const mistakeKey = `${currentChar}->${event.key}`
        newMistakes.set(mistakeKey, (newMistakes.get(mistakeKey) || 0) + 1)
        
        return {
          ...prev,
          wrongChars: prev.wrongChars + 1,
          combo: 0,
          mistakes: newMistakes,
        }
      })
    }
  }, [text, state.currentIndex])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const calculateResult = useCallback((): TypingResult => {
    if (!state.startTime || !state.endTime) {
      return {
        wpm: 0,
        accuracy: 0,
        duration: 0,
        correctChars: 0,
        wrongChars: 0,
        maxCombo: 0,
        mistakes: [],
      }
    }

    const durationMs = state.endTime - state.startTime
    const durationMinutes = durationMs / 60000
    const safeDurationMinutes = Math.max(0.001, durationMinutes)
    const totalChars = state.correctChars + state.wrongChars
    const wpm = totalChars === 0 ? 0 : Math.round((state.correctChars / 5) / safeDurationMinutes)
    const accuracy = totalChars === 0 ? 100 : Math.round((state.correctChars / totalChars) * 100)

    const mistakes: MistakeRecord[] = []
    state.mistakes.forEach((count, key) => {
      const [expected, actual] = key.split('->')
      mistakes.push({ expected, actual, count })
    })

    return {
      wpm: Math.max(0, Math.min(200, wpm)),
      accuracy: Math.max(0, Math.min(100, accuracy)),
      duration: Math.round(durationMs / 1000),
      correctChars: state.correctChars,
      wrongChars: state.wrongChars,
      maxCombo: state.maxCombo,
      mistakes,
    }
  }, [state])

  const progress = Math.round((state.currentIndex / text.length) * 100)
  const currentChar = text[state.currentIndex] || ''
  const previousChars = text.slice(0, state.currentIndex)
  const remainingChars = text.slice(state.currentIndex)

  return {
    state,
    start,
    reset,
    calculateResult,
    progress,
    currentChar,
    previousChars,
    remainingChars,
    inputRef,
  }
}