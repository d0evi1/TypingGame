import { motion } from 'framer-motion'
import { useState } from 'react'
import { BookOpen, Trophy, User, Play, Gamepad2, Skull } from 'lucide-react'
import { useGameStore, useCurrentProfile } from '../../store/gameStore'
import type { Profile } from '../../types'

function generateId(): string {
  return `profile-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const avatars = ['🚀', '⭐', '🎮', '🎯', '🏆', '💎', '🌟', '🔥', '⚡', '🎪']

function CreateProfileModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(avatars[0])
  const addProfile = useGameStore((s) => s.addProfile)
  
  const handleCreate = () => {
    if (!name.trim()) return
    
    const profile: Profile = {
      id: generateId(),
      name: name.trim(),
      avatar,
      createdAt: new Date(),
      totalPracticeTime: 0,
      totalKeystrokes: 0,
      averageWPM: 0,
      averageAccuracy: 0,
      highestWPM: 0,
      currentLevel: 1,
      experience: 0,
      unlockedCourses: ['course-basics'],
      achievements: [],
      streak: 0,
      lastPracticeDate: null,
      coins: 0,
      totalCoinsEarned: 0,
      rewards: {
        owned: [],
        equipped: {}
      },
      pityState: {
        rareCounter: 0,
        epicCounter: 0,
        legendaryCounter: 0
      }
    }
    
    addProfile(profile)
    onClose()
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-700"
      >
        <h2 className="text-xl font-bold text-white mb-6">创建新档案</h2>
        
        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-2">选择头像</label>
          <div className="flex flex-wrap gap-2">
            {avatars.map(a => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className={`
                  w-12 h-12 rounded-lg text-2xl flex items-center justify-center
                  ${avatar === a ? 'bg-indigo-600' : 'bg-slate-800 hover:bg-slate-700'}
                `}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-2">输入名字</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="你的名字"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            maxLength={20}
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-white transition-colors"
          >
            创建
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ProfileSelect({ onSelect }: { onSelect: () => void }) {
  const profiles = useGameStore((s) => s.profiles)
  const setCurrentProfile = useGameStore((s) => s.setCurrentProfile)
  const [showCreate, setShowCreate] = useState(false)
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          打字星球
        </h1>
        <p className="text-slate-400 text-center mb-8">
          选择或创建你的角色
        </p>
        
        <div className="space-y-3 mb-6">
          {profiles.map((profile) => (
            <motion.button
              key={profile.id}
              onClick={() => {
                setCurrentProfile(profile.id)
                onSelect()
              }}
              className="w-full flex items-center gap-4 p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-4xl">{profile.avatar}</span>
              <div className="text-left">
                <div className="text-white font-medium">{profile.name}</div>
                <div className="text-sm text-slate-400">
                  Lv.{profile.currentLevel} · WPM 最高: {profile.highestWPM}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
        
        <button
          onClick={() => setShowCreate(true)}
          className="w-full flex items-center justify-center gap-2 p-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition-colors"
        >
          <User size={20} />
          创建新角色
        </button>
      </div>
      
      {showCreate && <CreateProfileModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}

interface HomePageProps {
  onStartPractice: () => void
  onSelectCourse: () => void
  onStartPuzzle: () => void
  onViewStats: () => void
  onStartZombie?: () => void
  onOpenShop?: () => void
  onOpenCollection?: () => void
  coins?: number
}

function HomePage({ onStartPractice, onSelectCourse, onStartPuzzle, onViewStats, onStartZombie, onOpenShop, onOpenCollection, coins = 0 }: HomePageProps) {
  const profile = useCurrentProfile()
  const setCurrentProfile = useGameStore((s) => s.setCurrentProfile)
  
  if (!profile) return null
  
  const expForNextLevel = profile.currentLevel * 100
  const expProgress = (profile.experience % expForNextLevel) / expForNextLevel * 100
  
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
          <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{profile.avatar}</span>
            <div>
              <h1 className="text-xl font-bold text-white">{profile.name}</h1>
              <div className="flex items-center gap-2">
                <span className="text-indigo-400">Lv.{profile.currentLevel}</span>
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${expProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {coins !== undefined && (
              <span className="text-sm text-slate-300">金币: {coins}</span>
            )}
          </div>
          <button
            onClick={() => setCurrentProfile(null)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <User size={24} />
          </button>
          </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.button
            onClick={onStartPractice}
            className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play size={32} className="text-white mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">快速练习</h2>
            <p className="text-indigo-200 text-sm">开始一段随机练习</p>
          </motion.button>
          
          <motion.button
            onClick={onSelectCourse}
            className="bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl p-6 text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BookOpen size={32} className="text-white mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">课程学习</h2>
            <p className="text-green-200 text-sm">循序渐进的课程体系</p>
          </motion.button>
          
          <motion.button
            onClick={onStartPuzzle}
            className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-2xl p-6 text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Gamepad2 size={32} className="text-white mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">游戏模式</h2>
            <p className="text-pink-200 text-sm">字母拼图小游戏</p>
          </motion.button>
          
          <motion.button
            onClick={onViewStats}
            className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-6 text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Trophy size={32} className="text-white mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">统计成就</h2>
            <p className="text-orange-200 text-sm">查看你的进步</p>
          </motion.button>

          {/* 5th button: Zombie Defense */}
          <motion.button
            onClick={() => onStartZombie?.()}
            className="bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-6 text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Skull size={32} className="text-white mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">僵尸防御</h2>
            <p className="text-red-200 text-sm">抵御来袭的僵尸</p>
          </motion.button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{profile.highestWPM}</div>
            <div className="text-sm text-slate-400">最高 WPM</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{profile.averageAccuracy}%</div>
            <div className="text-sm text-slate-400">平均准确率</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{profile.streak}</div>
            <div className="text-sm text-slate-400">连续天数</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{profile.achievements.length}</div>
            <div className="text-sm text-slate-400">成就数</div>
          </div>
        </div>
        <div className="flex gap-4 justify-center mt-4">
          {onOpenShop && (
            <button onClick={onOpenShop} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">兑换商店</button>
          )}
          {onOpenCollection && (
            <button onClick={onOpenCollection} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">我的收藏</button>
          )}
        </div>
        <div className="flex justify-end mt-2 text-white pr-2">
          <span>金币: {coins}</span>
        </div>
      </div>
    </div>
  )
}

export { ProfileSelect, HomePage }
