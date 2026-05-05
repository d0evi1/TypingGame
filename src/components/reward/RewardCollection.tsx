import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Trophy, Filter } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { allRewards, getRewardsByCategory } from '../../data/rewards'
import { getRarityColor, getRarityName } from '../../utils/rewardLogic'
import type { Reward, RewardCategory, Rarity } from '../../types/reward'

const CATEGORIES: { key: RewardCategory | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: '全部', icon: '✨' },
  { key: 'sword', label: '圣剑', icon: '⚔️' },
  { key: 'staff', label: '权杖', icon: '🔮' },
  { key: 'armor', label: '盔甲', icon: '🛡️' },
  { key: 'mount', label: '坐骑', icon: '🐴' },
  { key: 'shield', label: '盾牌', icon: '🔰' },
]

const RARITIES: { key: Rarity | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'legendary', label: '传说' },
  { key: 'epic', label: '史诗' },
  { key: 'rare', label: '稀有' },
  { key: 'common', label: '普通' },
]

interface Props {
  onBack: () => void
}

function RewardIcon({ path, color }: { path: string; color: string }) {
  return (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke={color} strokeWidth="1.5">
      <path d={path} />
    </svg>
  )
}

function RewardCard({ 
  reward, 
  count, 
  owned 
}: { 
  reward: Reward
  count: number
  owned: boolean 
}) {
  const color = getRarityColor(reward.rarity)
  
  return (
    <motion.div
      className={`
        relative rounded-xl p-3 border-2 transition-all
        ${owned 
          ? 'bg-slate-800/60 border-slate-600' 
          : 'bg-slate-900/60 border-slate-800 opacity-50'
        }
      `}
      style={{ borderColor: owned ? color : undefined }}
      whileHover={owned ? { scale: 1.02 } : {}}
    >
      {count > 1 && (
        <div 
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {count}
        </div>
      )}
      
      <div className="flex items-center justify-center h-16 mb-2">
        {owned ? (
          <RewardIcon path={reward.icon} color={color} />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-500">
            ?
          </div>
        )}
      </div>
      
      <div className="text-center">
        <div className={`text-sm font-medium truncate ${owned ? 'text-white' : 'text-slate-600'}`}>
          {owned ? reward.name : '???'}
        </div>
        <div 
          className="text-xs mt-0.5"
          style={{ color: owned ? color : '#475569' }}
        >
          {owned ? getRarityName(reward.rarity) : '未获得'}
        </div>
      </div>
    </motion.div>
  )
}

export function RewardCollection({ onBack }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory | 'all'>('all')
  const [selectedRarity, setSelectedRarity] = useState<Rarity | 'all'>('all')
  const [showRarityFilter, setShowRarityFilter] = useState(false)
  
  const ownedRewards = useGameStore((s) => {
    const { currentProfileId, profiles } = s
    const profile = profiles.find((p) => p.id === currentProfileId)
    return profile?.rewards?.owned || []
  })
  
  const ownedCountMap = useMemo(() => {
    const map = new Map<string, number>()
    ownedRewards.forEach((r) => {
      map.set(r.id, (map.get(r.id) || 0) + 1)
    })
    return map
  }, [ownedRewards])
  
  const displayRewards = useMemo(() => {
    let rewards = selectedCategory === 'all' 
      ? allRewards 
      : getRewardsByCategory(selectedCategory)
    
    if (selectedRarity !== 'all') {
      rewards = rewards.filter((r) => r.rarity === selectedRarity)
    }
    
    return rewards
  }, [selectedCategory, selectedRarity])
  
  const stats = useMemo(() => {
    const owned = ownedRewards.length
    const unique = ownedCountMap.size
    const byRarity = {
      legendary: ownedRewards.filter((r) => r.rarity === 'legendary').length,
      epic: ownedRewards.filter((r) => r.rarity === 'epic').length,
      rare: ownedRewards.filter((r) => r.rarity === 'rare').length,
      common: ownedRewards.filter((r) => r.rarity === 'common').length,
    }
    return { owned, unique, byRarity }
  }, [ownedRewards, ownedCountMap])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>返回</span>
          </button>
          
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Trophy className="text-amber-400" size={24} />
            我的收藏
          </h1>
          
          <button
            onClick={() => setShowRarityFilter(!showRarityFilter)}
            className={`
              p-2 rounded-lg transition-colors
              ${showRarityFilter ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}
            `}
          >
            <Filter size={20} />
          </button>
        </div>
        
        <div className="bg-slate-800/40 rounded-2xl p-4 mb-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-amber-400">{stats.unique}</div>
              <div className="text-sm text-slate-400">已收集 / {allRewards.length} 种</div>
            </div>
            
            <div className="flex gap-3">
              {(['legendary', 'epic', 'rare'] as Rarity[]).map((rarity) => (
                <div key={rarity} className="text-center">
                  <div 
                    className="text-lg font-bold"
                    style={{ color: getRarityColor(rarity) }}
                  >
                    {stats.byRarity[rarity]}
                  </div>
                  <div className="text-xs text-slate-500">{getRarityName(rarity)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-lg whitespace-nowrap transition-all
                ${selectedCategory === cat.key 
                  ? 'bg-slate-700 text-white' 
                  : 'bg-slate-800/50 text-slate-400 hover:text-white'
                }
              `}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
        
        <AnimatePresence>
          {showRarityFilter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="flex gap-2 flex-wrap">
                {RARITIES.map((rarity) => (
                  <button
                    key={rarity.key}
                    onClick={() => setSelectedRarity(rarity.key)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm transition-all
                      ${selectedRarity === rarity.key 
                        ? 'bg-slate-700 text-white' 
                        : 'bg-slate-800/50 text-slate-400 hover:text-white'
                      }
                    `}
                    style={{ 
                      borderLeft: rarity.key !== 'all' ? `3px solid ${getRarityColor(rarity.key)}` : undefined 
                    }}
                  >
                    {rarity.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {displayRewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              count={ownedCountMap.get(reward.id) || 0}
              owned={ownedCountMap.has(reward.id)}
            />
          ))}
        </div>
        
        {displayRewards.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            暂无符合条件的奖品
          </div>
        )}
      </div>
    </div>
  )
}

export default RewardCollection
