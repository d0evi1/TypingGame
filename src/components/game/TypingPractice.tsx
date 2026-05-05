import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback, useRef } from 'react'
import { VirtualKeyboard } from '../keyboard/VirtualKeyboard'
import { useTypingGame } from '../../hooks/useTypingGame'
import { Play, RotateCcw, Home } from 'lucide-react'
import { calculatePracticeReward, calculateStreakBonus } from '../../hooks/useRewardSystem'

interface TypingPracticeProps {
  text: string
  title: string
  onComplete?: (result: {
    wpm: number
    accuracy: number
    duration: number
    correctChars: number
    wrongChars: number
    maxCombo: number
  }) => void
  onExit?: () => void
}

export function TypingPractice({ text, title, onComplete, onExit }: TypingPracticeProps) {
  const {
    state,
    start,
    reset,
    calculateResult,
    progress,
    currentChar,
    previousChars,
    remainingChars,
  } = useTypingGame(text)
  
  const [showResult, setShowResult] = useState(false)
  const [resultData, setResultData] = useState<{
    wpm: number
    accuracy: number
    duration: number
    maxCombo: number
    coinsEarned: number
    baseReward: number
    comboBonus: number
  } | null>(null)
  
  // Track if we've already processed completion to prevent infinite loops
  const hasProcessedCompletionRef = useRef(false)

  useEffect(() => {
    if (state.isFinished && state.endTime && !hasProcessedCompletionRef.current) {
      hasProcessedCompletionRef.current = true
      const result = calculateResult()
      const baseReward = calculatePracticeReward(result.wpm, result.accuracy)
      const comboBonus = calculateStreakBonus(result.maxCombo)
      const coinsEarned = baseReward + comboBonus
      
      setResultData({
        wpm: result.wpm,
        accuracy: result.accuracy,
        duration: result.duration,
        maxCombo: result.maxCombo,
        coinsEarned,
        baseReward,
        comboBonus,
      })
      setShowResult(true)
      onComplete?.(result)
    }
  }, [state.isFinished, state.endTime])

  const handleStart = useCallback(() => {
    reset()
    setShowResult(false)
    setResultData(null)
    hasProcessedCompletionRef.current = false
    start()
  }, [reset, start])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !state.isStarted && !showResult) {
      handleStart()
    }
  }

  const currentWPM = state.startTime && state.correctChars > 0
    ? Math.round((state.correctChars / 5) / ((Date.now() - state.startTime) / 60000))
    : 0

  const accuracy = state.correctChars + state.wrongChars > 0
    ? Math.round((state.correctChars / (state.correctChars + state.wrongChars)) * 100)
    : 100

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-8"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onExit}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <Home size={20} />
            <span>返回</span>
          </button>
          
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">进度: {progress}%</span>
            <span className="text-slate-400">连击: {state.combo}</span>
          </div>
        </div>

        <div className="mb-4 h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex gap-8 mb-8 justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-400">
              {state.isStarted ? currentWPM : '--'}
            </div>
            <div className="text-sm text-slate-400">WPM</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">
              {state.isStarted ? `${accuracy}%` : '--'}
            </div>
            <div className="text-sm text-slate-400">准确率</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {state.maxCombo}
            </div>
            <div className="text-sm text-slate-400">最高连击</div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-8 mb-8">
          <div className="typing-font text-2xl leading-relaxed text-left select-none">
            <span className="text-green-400">{previousChars}</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={state.currentIndex}
                className={`inline-block px-0.5 ${
                  state.isStarted && !state.isFinished 
                    ? 'bg-yellow-400/30 text-yellow-300 border-b-2 border-yellow-400' 
                    : 'text-slate-300'
                }`}
                initial={{ scale: 1 }}
                animate={{ scale: 1 }}
              >
                {currentChar}
              </motion.span>
            </AnimatePresence>
            <span className="text-slate-500">{remainingChars.slice(1)}</span>
          </div>
        </div>

        <VirtualKeyboard 
          currentChar={currentChar} 
          lastCorrect={null} 
        />

        <div className="mt-8 flex justify-center gap-4">
          {!state.isStarted && !showResult && (
            <motion.button
              onClick={handleStart}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={20} />
              开始练习 (按 Enter)
            </motion.button>
          )}

          {state.isStarted && !state.isFinished && (
            <motion.button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={20} />
              重新开始
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                练习完成!
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-indigo-400">
                    {resultData?.wpm}
                  </div>
                  <div className="text-sm text-slate-400">WPM</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {resultData?.accuracy}%
                  </div>
                  <div className="text-sm text-slate-400">准确率</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {resultData?.maxCombo}
                  </div>
                  <div className="text-sm text-slate-400">最高连击</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {resultData?.duration}s
                  </div>
                  <div className="text-sm text-slate-400">用时</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 mb-6 text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  +{resultData?.coinsEarned} 金币
                </div>
                <div className="text-sm text-slate-400">
                  基础: {resultData?.baseReward} + 连击: {resultData?.comboBonus}
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={handleStart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw size={20} />
                  再来一局
                </motion.button>
                <motion.button
                  onClick={onExit}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Home size={20} />
                  返回
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
