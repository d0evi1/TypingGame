import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { usePuzzleGame } from '../../hooks/usePuzzleGame'
import { Play, RotateCcw, Home, Clock, Timer, TimerOff, Coins } from 'lucide-react'
import type { PuzzleMode } from '../../types/puzzle'

interface PuzzleGameProps {
  onExit: () => void
  onComplete: (result: { completed: boolean; pieces: number; coinsEarned?: number }) => void
}

export function PuzzleGame({ onExit, onComplete }: PuzzleGameProps) {
  const [mode, setMode] = useState<PuzzleMode>('untimed')
  const [hasStarted, setHasStarted] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [showCompleteImage, setShowCompleteImage] = useState(false)
  const [coinsEarned, setCoinsEarned] = useState(0)
  const hasHandledCompletion = useRef(false)
  
  const {
    state,
    initializeGame,
    start,
    reset,
    progress,
    revealedCount,
    totalPieces,
  } = usePuzzleGame(mode)

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  useEffect(() => {
    if (state.isFinished && state.endTime && !hasHandledCompletion.current) {
      hasHandledCompletion.current = true
      const completed = revealedCount === totalPieces
      
      if (completed) {
        const reward = Math.floor(Math.random() * 51) + 20
        setCoinsEarned(reward)
        setShowCompleteImage(true)
        const timer = setTimeout(() => {
          setShowCompleteImage(false)
          setShowResult(true)
          onComplete({ completed, pieces: revealedCount, coinsEarned: reward })
        }, 1000)
        return () => clearTimeout(timer)
      } else {
        setShowResult(true)
        onComplete({ completed, pieces: revealedCount })
      }
    }
  }, [state.isFinished, state.endTime, revealedCount, totalPieces, onComplete])

  const handleStart = () => {
    setHasStarted(true)
    start()
  }

  const handleRestart = () => {
    hasHandledCompletion.current = false
    setHasStarted(false)
    setShowResult(false)
    setShowCompleteImage(false)
    setCoinsEarned(0)
    reset()
    initializeGame()
  }

  const handleModeChange = (newMode: PuzzleMode) => {
    if (!hasStarted) {
      setMode(newMode)
      reset()
      initializeGame()
    }
  }

  if (!state.image) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    )
  }

  const gridSize = state.gridSize

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onExit}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <Home size={20} />
            <span>返回</span>
          </button>
          
          <h1 className="text-2xl font-bold text-white">拼图游戏</h1>
          
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">进度: {progress}%</span>
            {state.timeRemaining !== null && (
              <span className={`flex items-center gap-1 ${
                state.timeRemaining <= 10 ? 'text-red-400' : 'text-yellow-400'
              }`}>
                <Clock size={16} />
                {state.timeRemaining}s
              </span>
            )}
          </div>
        </div>

        <div className="mb-4 h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-teal-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <div className="flex gap-8 mb-6 justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-400">
              {revealedCount}/{totalPieces}
            </div>
            <div className="text-sm text-slate-400">拼图碎片</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">
              {state.correctChars}
            </div>
            <div className="text-sm text-slate-400">正确</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">
              {state.wrongChars}
            </div>
            <div className="text-sm text-slate-400">错误</div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
          <div className="typing-font text-xl leading-relaxed text-center select-none">
            <span className="text-green-400">{state.text.slice(0, state.currentIndex)}</span>
            {!state.isFinished && (
              <motion.span
                className="inline-block px-1 bg-yellow-400/30 text-yellow-300 border-b-2 border-yellow-400"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {state.text[state.currentIndex] || ''}
              </motion.span>
            )}
            <span className="text-slate-500">{state.text.slice(state.currentIndex + 1)}</span>
          </div>
        </div>

        <div className="relative w-64 h-64 mx-auto mb-6 rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-900">
          {state.isShowingComplete || showCompleteImage ? (
            <motion.img
              src={state.image.src}
              alt={state.image.name}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <div 
              className="w-full h-full grid"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`,
              }}
            >
              {state.pieces.map((piece) => (
                <motion.div
                  key={piece.id}
                  className="relative overflow-hidden"
                  style={{
                    gridRow: piece.row + 1,
                    gridColumn: piece.col + 1,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: piece.isRevealed ? 1 : 0.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {piece.isRevealed ? (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: `url(${state.image!.src})`,
                        backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                        backgroundPosition: `${(piece.col / (gridSize - 1)) * 100}% ${(piece.row / (gridSize - 1)) * 100}%`,
                        backgroundRepeat: 'no-repeat',
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                      <span className="text-slate-500 text-2xl">?</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {!hasStarted && !state.isFinished && (
          <div className="space-y-4">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleModeChange('untimed')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  mode === 'untimed' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <TimerOff size={18} />
                不限时
              </button>
              <button
                onClick={() => handleModeChange('timed')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  mode === 'timed' 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Timer size={18} />
                限时 ({state.timeLimit}s)
              </button>
            </div>

            <div className="flex justify-center">
              <motion.button
                onClick={handleStart}
                className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={20} />
                开始游戏
              </motion.button>
            </div>
          </div>
        )}

        {hasStarted && !state.isFinished && (
          <div className="flex justify-center gap-4">
            <motion.button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw size={20} />
              重新开始
            </motion.button>
          </div>
        )}
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
              <h2 className="text-2xl font-bold text-white mb-2 text-center">
                {revealedCount === totalPieces ? '🎉 拼图完成!' : '⏰ 时间到!'}
              </h2>
              <p className="text-slate-400 text-center mb-6">
                {state.image.name}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {revealedCount}/{totalPieces}
                  </div>
                  <div className="text-sm text-slate-400">拼图碎片</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-indigo-400">
                    {state.correctChars}
                  </div>
                  <div className="text-sm text-slate-400">正确输入</div>
                </div>
              </div>

              {revealedCount === totalPieces && (
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Coins className="text-yellow-400" size={24} />
                    <span className="text-2xl font-bold text-yellow-400">+{coinsEarned}</span>
                  </div>
                  <div className="text-sm text-slate-400 text-center">获得金币</div>
                </div>
              )}

              <div className="flex gap-3">
                <motion.button
                  onClick={handleRestart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium transition-colors"
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
