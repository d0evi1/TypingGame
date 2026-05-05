import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Coins, Gift, Sparkles, Info } from 'lucide-react'
import { useRewardSystem } from '../../hooks/useRewardSystem'
import { useGameStore } from '../../store/gameStore'
import { RewardAnimation } from './RewardAnimation'
import { getRarityColor, getRarityName, PITY_THRESHOLDS } from '../../utils/rewardLogic'
import type { Reward, Rarity } from '../../types/reward'

const PROBABILITY_INFO = [
  { rarity: 'legendary' as Rarity, percent: 5, color: getRarityColor('legendary') },
  { rarity: 'epic' as Rarity, percent: 10, color: getRarityColor('epic') },
  { rarity: 'rare' as Rarity, percent: 25, color: getRarityColor('rare') },
  { rarity: 'common' as Rarity, percent: 60, color: getRarityColor('common') },
]

const CATEGORY_NAMES: Record<string, string> = {
  sword: '圣剑',
  staff: '权杖',
  armor: '盔甲',
  mount: '坐骑',
  shield: '盾牌',
}

interface Props {
  onBack: () => void
}

export function RewardShop({ onBack }: Props) {
  const [isDrawing, setIsDrawing] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [lastReward, setLastReward] = useState<{ reward: Reward; rarity: Rarity } | null>(null)
  const [showProbInfo, setShowProbInfo] = useState(false)
  
  const coins = useGameStore((s) => {
    const { currentProfileId, profiles } = s
    const profile = profiles.find((p) => p.id === currentProfileId)
    return profile?.coins || 0
  })
  
  const { executeDraw, getRemainingDraws, canDraw, getPityProgress, DRAW_COST, DAILY_DRAW_LIMIT } = useRewardSystem()
  
  const pityProgress = getPityProgress()
  const remainingDraws = getRemainingDraws()
  const canDrawNow = canDraw() && !isDrawing
  
  const handleDraw = useCallback(() => {
    if (!canDrawNow) return
    
    setIsDrawing(true)
    const result = executeDraw()
    
    if (result.success && result.reward) {
      setLastReward({ reward: result.reward, rarity: result.reward.rarity })
      setTimeout(() => {
        setShowAnimation(true)
        setIsDrawing(false)
      }, 100)
    } else {
      setIsDrawing(false)
      alert(result.error || '抽奖失败')
    }
  }, [canDrawNow, executeDraw])
  
  const handleAnimationComplete = useCallback(() => {
    setShowAnimation(false)
    setLastReward(null)
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>返回</span>
          </button>
          
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Gift className="text-amber-400" size={24} />
            兑换商店
          </h1>
          
          <div className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-full">
            <Coins className="text-amber-400" size={18} />
            <span className="font-bold text-amber-400">{coins}</span>
          </div>
        </div>
        
        <div className="bg-slate-800/40 rounded-2xl p-6 sm:p-8 mb-6 border border-slate-700/50">
          <div className="flex flex-col items-center gap-6">
            <motion.div
              className="w-32 h-32 rounded-2xl border-4 border-amber-400/50 bg-slate-800 flex items-center justify-center relative overflow-hidden"
              animate={isDrawing ? { rotate: [0, 360] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Gift size={48} className="text-amber-400" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            
            <button
              onClick={handleDraw}
              disabled={!canDrawNow}
              className={`
                px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-3
                ${canDrawNow 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/25' 
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              <Sparkles size={20} />
              抽奖 ({DRAW_COST} 金币)
            </button>
            
            <div className="text-sm text-slate-400">
              今日剩余次数: <span className={`font-bold ${remainingDraws > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{remainingDraws}</span> / {DAILY_DRAW_LIMIT}
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/40 rounded-2xl p-5 mb-6 border border-slate-700/50">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="text-amber-400">⚡</span>
            保底进度
          </h2>
          
          <div className="space-y-4">
            {[
              { key: 'legendary', label: '传说', target: PITY_THRESHOLDS.legendary },
              { key: 'epic', label: '史诗', target: PITY_THRESHOLDS.epic },
              { key: 'rare', label: '稀有', target: PITY_THRESHOLDS.rare },
            ].map(({ key, label, target }) => {
              const current = pityProgress[key as keyof typeof pityProgress].current
              const progress = Math.min(current / target, 1)
              const color = getRarityColor(key as Rarity)
              
              return (
                <div key={key} className="flex items-center gap-3">
                  <div 
                    className="w-16 text-sm font-medium"
                    style={{ color }}
                  >
                    {label}
                  </div>
                  <div className="flex-1 h-3 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="w-12 text-sm text-slate-400 text-right">
                    {current}/{target}
                  </div>
                </div>
              )
            })}
          </div>
          
          <p className="mt-4 text-xs text-slate-500 text-center">
            达到保底次数后，下次抽奖必定获得对应稀有度奖励
          </p>
        </div>
        
        <div className="bg-slate-800/40 rounded-2xl p-5 border border-slate-700/50">
          <button
            onClick={() => setShowProbInfo(!showProbInfo)}
            className="w-full flex items-center justify-between text-lg font-bold"
          >
            <span className="flex items-center gap-2">
              <Info size={18} className="text-blue-400" />
              概率说明
            </span>
            <motion.span
              animate={{ rotate: showProbInfo ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.span>
          </button>
          
          <AnimatePresence>
            {showProbInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-2">
                  {PROBABILITY_INFO.map(({ rarity, percent, color }) => (
                    <div key={rarity} className="flex items-center justify-between text-sm">
                      <span style={{ color }}>{getRarityName(rarity)}</span>
                      <span className="text-slate-300">{percent}%</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-700/50 text-xs text-slate-500 space-y-1">
                  <p>• 55种奖品，分布在5大类别中</p>
                  <p>• 类别: {Object.values(CATEGORY_NAMES).join('、')}</p>
                  <p>• 重复获得的奖品会显示数量</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {lastReward && (
        <RewardAnimation
          rarity={lastReward.rarity}
          reward={lastReward.reward}
          isOpen={showAnimation}
          onComplete={handleAnimationComplete}
        />
      )}
    </div>
  )
}

export default RewardShop
