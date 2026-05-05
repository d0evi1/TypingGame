import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Calendar, Clock } from 'lucide-react'
import { useCurrentProfile } from '../../store/gameStore'

interface StatsPageProps {
  onBack: () => void
}

export function StatsPage({ onBack }: StatsPageProps) {
  const profile = useCurrentProfile()
  
  if (!profile) return null
  
  const stats = [
    { label: '总练习时间', value: `${Math.floor(profile.totalPracticeTime / 60)}分钟`, icon: Clock },
    { label: '总击键次数', value: profile.totalKeystrokes.toLocaleString(), icon: BarChart3 },
    { label: '平均 WPM', value: profile.averageWPM, icon: TrendingUp },
    { label: '连续练习', value: `${profile.streak}天`, icon: Calendar },
  ]
  
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          ← 返回
        </button>
        
        <h1 className="text-2xl font-bold text-white mb-6">统计与成就</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-slate-800/50 rounded-xl p-4">
              <Icon size={24} className="text-indigo-400 mb-2" />
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-sm text-slate-400">{label}</div>
            </div>
          ))}
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">成就展示</h2>
          
          {profile.achievements.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              还没有获得成就，继续练习吧！
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {profile.achievements.map((id: string) => (
                <motion.div
                  key={id}
                  className="bg-slate-700/50 rounded-lg p-4 flex items-center gap-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <span className="text-2xl">🏆</span>
                  <span className="text-white">{id}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
