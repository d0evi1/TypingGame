import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import useZombieGame from '../../hooks/useZombieGame'
import { BattleField } from './BattleField'
import { Play, RotateCcw, Home, Skull, Zap, Swords, Target, Coins } from 'lucide-react'

interface ZombieGameProps {
  onExit: () => void
  onComplete: (result: { completed: boolean; score?: number; coinsEarned?: number }) => void
}

const COMBO_THRESHOLD = 5

export function ZombieGame({ onExit, onComplete }: ZombieGameProps) {
  const {
    state,
    currentChar,
    currentText,
    initializeGame,
    startGame,
    resetGame,
    continueGame,
    defenseLineX,
  } = useZombieGame()

  const [hasStarted, setHasStarted] = useState(false)
  const [showRoundComplete, setShowRoundComplete] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const [showComboEffect, setShowComboEffect] = useState(false)
  const [coinsEarned, setCoinsEarned] = useState(0)
  const previousComboRef = useRef(0)

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  useEffect(() => {
    if (state.roundComplete && !showGameOver && !showRoundComplete) {
      const coins = Math.floor(Math.random() * 51) + 20
      setCoinsEarned(coins)
      setShowRoundComplete(true)
    }
  }, [state.roundComplete, showGameOver, showRoundComplete])

  useEffect(() => {
    if (state.isGameOver) {
      setShowGameOver(true)
    }
  }, [state.isGameOver])

  useEffect(() => {
    if (state.combo >= COMBO_THRESHOLD && previousComboRef.current < COMBO_THRESHOLD) {
      setShowComboEffect(true)
      const timer = setTimeout(() => setShowComboEffect(false), 800)
      return () => clearTimeout(timer)
    }
    previousComboRef.current = state.combo
  }, [state.combo])

  const handleStart = () => {
    setHasStarted(true)
    startGame()
  }

  const handleRestart = () => {
    setHasStarted(false)
    setShowRoundComplete(false)
    setShowGameOver(false)
    resetGame()
  }

  const handleContinue = () => {
    setShowRoundComplete(false)
    continueGame()
  }

  const handleReturnHome = () => {
    onComplete({ completed: false, score: state.score, coinsEarned })
  }

  const isComboActive = state.combo >= COMBO_THRESHOLD

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-950 to-slate-900">
      <AnimatePresence>
        {showComboEffect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.15 }}
              className="text-6xl font-bold text-yellow-400"
              style={{
                textShadow: '0 0 30px rgba(250, 204, 21, 0.8), 0 0 60px rgba(250, 204, 21, 0.6)',
              }}
            >
              COMBO x{state.combo}!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-between mb-6">
          <button
            onClick={onExit}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <Home size={20} />
            <span>返回</span>
          </button>

          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Skull className="text-red-500" size={28} />
            僵尸防御
          </h1>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-indigo-400">回合: {state.roundsCompleted}</span>
          </div>
        </div>

        <div className="flex gap-8 mb-6 justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">
              {state.zombiesKilled}
            </div>
            <div className="text-sm text-slate-400">击杀僵尸</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">
              {state.currentIndex}
            </div>
            <div className="text-sm text-slate-400">正确输入</div>
          </div>

          <motion.div
            className="text-center relative"
            animate={isComboActive ? {
              scale: [1, 1.1, 1],
            } : {}}
            transition={{ duration: 0.3, repeat: isComboActive ? Infinity : 0, repeatDelay: 0.5 }}
          >
            <motion.div
              className={`text-3xl font-bold ${isComboActive ? 'text-yellow-400' : 'text-slate-400'}`}
              animate={isComboActive ? {
                textShadow: [
                  '0 0 10px rgba(250, 204, 21, 0.5)',
                  '0 0 30px rgba(250, 204, 21, 0.8)',
                  '0 0 10px rgba(250, 204, 21, 0.5)',
                ],
              } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {state.combo}
            </motion.div>
            <div className="text-sm text-slate-400 flex items-center justify-center gap-1">
              {isComboActive && <Zap className="text-yellow-400" size={14} />}
              连击
              {isComboActive && <Zap className="text-yellow-400" size={14} />}
            </div>

            {isComboActive && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-yellow-400 whitespace-nowrap"
                style={{
                  textShadow: '0 0 10px rgba(250, 204, 21, 0.6)',
                }}
              >
                <Zap size={12} className="inline mr-1" />
                三连击!
              </motion.div>
            )}
          </motion.div>

          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-400">
              {state.score}
            </div>
            <div className="text-sm text-slate-400">得分</div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-8 mb-6 min-h-[400px] flex flex-col items-center justify-center border border-slate-700">
          {hasStarted && !state.roundComplete && !state.isGameOver ? (
            <>
              <div className="text-center mb-4">
                <div className="text-slate-400 text-sm mb-2">当前目标</div>
                <div className="typing-font text-4xl text-white">
                  <span className="text-green-400">
                    {currentText.slice(0, state.currentIndex)}
                  </span>
                  <motion.span
                    className="inline-block px-2 bg-yellow-400/30 text-yellow-300 border-b-2 border-yellow-400"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    {currentChar}
                  </motion.span>
                  <span className="text-slate-500">
                    {currentText.slice(state.currentIndex + 1)}
                  </span>
                </div>
              </div>

              {isComboActive && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center mb-4"
                >
                  <span
                    className="text-lg font-bold text-yellow-400 px-4 py-2 rounded-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.2), rgba(245, 158, 11, 0.3))',
                      boxShadow: '0 0 20px rgba(250, 204, 21, 0.3)',
                    }}
                  >
                    <Zap className="inline mr-2" size={18} />
                    COMBO ACTIVE - x3 Damage!
                  </span>
                </motion.div>
              )}

              <div className="w-full flex justify-center">
                <BattleField 
                  zombies={state.zombies} 
                  currentIndex={state.currentIndex}
                  combo={state.combo}
                  defenseLineX={defenseLineX} 
                  height={300} 
                />
              </div>

              <div className="text-center text-slate-400 mt-4">
                僵尸数量: {state.zombies.length}
              </div>
            </>
          ) : (
            <div className="text-slate-500 text-lg">
              游戏区域占位符
            </div>
          )}
        </div>

        {!hasStarted && !showGameOver && !showRoundComplete && (
          <div className="flex justify-center">
            <motion.button
              onClick={handleStart}
              className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-500 rounded-lg text-white font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={20} />
              开始游戏
            </motion.button>
          </div>
        )}

        {hasStarted && !showGameOver && !showRoundComplete && (
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
        {showRoundComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-slate-900/95 via-indigo-950/20 to-slate-900/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 max-w-lg w-full border border-indigo-500/30 shadow-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="inline-block mb-4"
                >
                  <Coins className="text-yellow-400" size={64} />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  🎉 回合完成!
                </h2>
                <p className="text-indigo-400">
                  打字任务完成
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-3 mb-6"
              >
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Swords size={16} />
                    <span>击杀总数</span>
                  </div>
                  <div className="text-2xl font-bold text-red-400">{state.zombiesKilled}</div>
                </div>
                
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Zap size={16} />
                    <span>最高连击</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">{state.maxCombo}</div>
                </div>
                
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Target size={16} />
                    <span>当前得分</span>
                  </div>
                  <div className="text-2xl font-bold text-indigo-400">{state.score}</div>
                </div>
                
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Skull size={16} />
                    <span>完成回合</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">{state.roundsCompleted}</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 rounded-2xl p-5 mb-6 border border-yellow-500/30"
              >
                <div className="flex items-center justify-center gap-3">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-3xl"
                  >
                    🪙
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: 'spring' }}
                    className="text-3xl font-bold text-yellow-400"
                  >
                    +{coinsEarned}
                  </motion.div>
                </div>
                <div className="text-sm text-slate-400 text-center mt-2">获得金币</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex gap-3"
              >
                <motion.button
                  onClick={handleContinue}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-white font-medium transition-all shadow-lg shadow-green-500/25"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play size={20} />
                  继续游戏
                </motion.button>
                <motion.button
                  onClick={handleReturnHome}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors border border-slate-600"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Home size={20} />
                  返回主页
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-slate-900/95 via-red-950/20 to-slate-900/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 max-w-lg w-full border border-red-500/30 shadow-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="inline-block mb-4"
                >
                  <Skull className="text-red-400" size={64} />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  💀 游戏结束
                </h2>
                <p className="text-red-400">
                  僵尸突破了防线...
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-3 mb-6"
              >
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Swords size={16} />
                    <span>完成回合</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-400">{state.roundsCompleted}</div>
                </div>
                
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Target size={16} />
                    <span>击杀总数</span>
                  </div>
                  <div className="text-2xl font-bold text-red-400">{state.zombiesKilled}</div>
                </div>
                
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Zap size={16} />
                    <span>最高连击</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">{state.maxCombo}</div>
                </div>
                
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Skull size={16} />
                    <span>最终得分</span>
                  </div>
                  <div className="text-2xl font-bold text-indigo-400">{state.score}</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-3"
              >
                <motion.button
                  onClick={handleRestart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-xl text-white font-medium transition-all shadow-lg shadow-red-500/25"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw size={20} />
                  再来一局
                </motion.button>
                <motion.button
                  onClick={handleReturnHome}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors border border-slate-600"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Home size={20} />
                  返回主页
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
