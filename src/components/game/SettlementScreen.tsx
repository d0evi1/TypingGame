import { motion } from 'framer-motion'
import { RotateCcw, Home, Coins, Zap, Target, Timer, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface SettlementScreenProps {
  wpm: number
  accuracy: number
  duration: number
  maxCombo: number
  coinsEarned: number
  baseReward: number
  comboBonus: number
  onRetry: () => void
  onExit: () => void
}

export function SettlementScreen({
  wpm,
  accuracy,
  duration,
  maxCombo,
  coinsEarned,
  baseReward,
  comboBonus,
  onRetry,
  onExit,
}: SettlementScreenProps) {
  const [displayCoins, setDisplayCoins] = useState(0)
  const [showBreakdown, setShowBreakdown] = useState(false)

  useEffect(() => {
    const duration = 1500
    const steps = 30
    const increment = coinsEarned / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= coinsEarned) {
        setDisplayCoins(coinsEarned)
        clearInterval(timer)
        setTimeout(() => setShowBreakdown(true), 300)
      } else {
        setDisplayCoins(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [coinsEarned])

  const getPerformanceRating = () => {
    const score = wpm * (accuracy / 100)
    if (score >= 50) return { text: '完美!', color: 'text-yellow-400', emoji: '⭐' }
    if (score >= 35) return { text: '优秀!', color: 'text-green-400', emoji: '🌟' }
    if (score >= 20) return { text: '不错!', color: 'text-blue-400', emoji: '✨' }
    return { text: '继续加油!', color: 'text-slate-400', emoji: '💪' }
  }

  const rating = getPerformanceRating()

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-slate-900/95 via-indigo-950/95 to-slate-900/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 max-w-lg w-full border border-slate-700/50 shadow-2xl"
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
            className="text-5xl mb-3"
          >
            {rating.emoji}
          </motion.div>
          <h2 className={`text-3xl font-bold ${rating.color} mb-1`}>
            {rating.text}
          </h2>
          <p className="text-slate-400">练习完成</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <TrendingUp size={16} />
              <span>速度</span>
            </div>
            <div className="text-2xl font-bold text-indigo-400">{wpm} <span className="text-sm text-slate-500">WPM</span></div>
          </div>
          
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Target size={16} />
              <span>准确率</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{accuracy}<span className="text-sm text-slate-500">%</span></div>
          </div>
          
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Zap size={16} />
              <span>最高连击</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{maxCombo}</div>
          </div>
          
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Timer size={16} />
              <span>用时</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">{duration}<span className="text-sm text-slate-500">秒</span></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 rounded-2xl p-5 mb-6 border border-yellow-500/20"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Coins className="text-yellow-400" size={24} />
              <span className="text-lg text-slate-300">获得金币</span>
            </div>
            <motion.div
              key={displayCoins}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-yellow-400"
            >
              +{displayCoins}
            </motion.div>
          </div>

          {showBreakdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="space-y-2 text-sm border-t border-slate-700/50 pt-3"
            >
              <div className="flex justify-between text-slate-400">
                <span>基础奖励</span>
                <span className="text-slate-300">+{baseReward}</span>
              </div>
              {comboBonus > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-between text-slate-400"
                >
                  <span>连击奖励</span>
                  <span className="text-yellow-400">+{comboBonus}</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex gap-3"
        >
          <motion.button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl text-white font-medium transition-all shadow-lg shadow-indigo-500/25"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw size={20} />
            再来一局
          </motion.button>
          <motion.button
            onClick={onExit}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors border border-slate-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Home size={20} />
            返回首页
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
