import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, Save, RotateCcw, Trash2, RefreshCw, Database, Coins } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'

interface DevToolsProps {
  onBack: () => void
}

export function DevTools({ onBack }: DevToolsProps) {
  const profiles = useGameStore((s) => s.profiles)
  const updateProfile = useGameStore((s) => s.updateProfile)
  const deleteProfile = useGameStore((s) => s.deleteProfile)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [editingProfile, setEditingProfile] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, number>>({})
  
  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleEditCoins = (profileId: string, currentCoins: number) => {
    setEditingProfile(profileId)
    setEditValues(prev => ({ ...prev, [profileId]: currentCoins }))
  }
  
  const handleSaveCoins = (profileId: string) => {
    const newCoins = editValues[profileId]
    if (newCoins !== undefined) {
      updateProfile(profileId, { coins: newCoins })
    }
    setEditingProfile(null)
  }
  
  const handleResetCoins = (profileId: string) => {
    updateProfile(profileId, { coins: 100 })
    setEditValues(prev => ({ ...prev, [profileId]: 100 }))
  }
  
  const handleDeleteProfile = (profileId: string, profileName: string) => {
    if (confirm(`确定要删除用户 "${profileName}" 吗？此操作不可撤销。`)) {
      deleteProfile(profileId)
    }
  }
  
  const handleExportData = () => {
    const data = localStorage.getItem('typing-game-storage')
    if (data) {
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `typing-game-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }
  
  const handleImportData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string)
            localStorage.setItem('typing-game-storage', JSON.stringify(data))
            if (confirm('数据已导入，需要刷新页面才能生效。是否现在刷新？')) {
              window.location.reload()
            }
          } catch {
            alert('导入失败：无效的JSON文件')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }
  
  const handleClearAllData = () => {
    if (confirm('确定要清除所有数据吗？这将删除所有用户和进度，此操作不可撤销！')) {
      if (confirm('再次确认：真的要删除所有数据吗？')) {
        localStorage.removeItem('typing-game-storage')
        window.location.reload()
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              返回
            </button>
            <div className="flex items-center gap-2 ml-4">
              <Database className="text-indigo-400" size={24} />
              <h1 className="text-2xl font-bold text-white">开发者工具</h1>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
            Ctrl+Shift+D 关闭
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="搜索用户..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
              >
                <RefreshCw size={16} />
                导出数据
              </button>
              <button
                onClick={handleImportData}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
              >
                <Database size={16} />
                导入数据
              </button>
              <button
                onClick={handleClearAllData}
                className="flex items-center gap-2 px-4 py-2 bg-red-900/50 hover:bg-red-800 rounded-lg text-red-300 transition-colors"
              >
                <Trash2 size={16} />
                清除所有数据
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-3xl font-bold text-white">{profiles.length}</div>
            <div className="text-sm text-slate-400">用户总数</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-3xl font-bold text-amber-400">
              {profiles.reduce((sum, p) => sum + (p.coins || 0), 0)}
            </div>
            <div className="text-sm text-slate-400">金币总量</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-3xl font-bold text-indigo-400">
              {profiles.filter(p => p.coins !== undefined).length}
            </div>
            <div className="text-sm text-slate-400">有金币数据</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-3xl font-bold text-green-400">
              {Math.round(profiles.reduce((sum, p) => sum + (p.coins || 0), 0) / Math.max(profiles.length, 1))}
            </div>
            <div className="text-sm text-slate-400">平均金币</div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700">
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">用户</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">等级</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">金币</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">最高WPM</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">创建时间</th>
                  <th className="text-right px-4 py-3 text-slate-400 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      {searchQuery ? '未找到匹配的用户' : '暂无用户数据'}
                    </td>
                  </tr>
                ) : (
                  filteredProfiles.map((profile) => (
                    <tr 
                      key={profile.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{profile.avatar}</span>
                          <div>
                            <div className="text-white font-medium">{profile.name}</div>
                            <div className="text-xs text-slate-500 font-mono">{profile.id.slice(0, 16)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-indigo-400">Lv.{profile.currentLevel}</span>
                      </td>
                      <td className="px-4 py-3">
                        {editingProfile === profile.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editValues[profile.id] ?? profile.coins ?? 0}
                              onChange={e => setEditValues(prev => ({ 
                                ...prev, 
                                [profile.id]: parseInt(e.target.value) || 0 
                              }))}
                              className="w-24 px-2 py-1 bg-slate-900 border border-indigo-500 rounded text-white text-right focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveCoins(profile.id)}
                              className="p-1 text-green-400 hover:bg-green-900/50 rounded"
                            >
                              <Save size={16} />
                            </button>
                          </div>
                        ) : (
                          <div 
                            className="flex items-center gap-2 cursor-pointer hover:bg-slate-700/50 px-2 py-1 rounded -mx-2"
                            onClick={() => handleEditCoins(profile.id, profile.coins ?? 0)}
                          >
                            <Coins className="text-amber-400" size={16} />
                            <span className="text-amber-300 font-mono">{profile.coins ?? 0}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-300">{profile.highestWPM}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-400 text-sm">
                          {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('zh-CN') : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleResetCoins(profile.id)}
                            className="p-2 text-amber-400 hover:bg-amber-900/50 rounded transition-colors"
                            title="重置金币为100"
                          >
                            <RotateCcw size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProfile(profile.id, profile.name)}
                            className="p-2 text-red-400 hover:bg-red-900/50 rounded transition-colors"
                            title="删除用户"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <details className="mt-6">
          <summary className="text-slate-400 cursor-pointer hover:text-white transition-colors">
            查看原始数据 (JSON)
          </summary>
          <pre className="mt-4 p-4 bg-slate-900 rounded-lg text-xs text-slate-300 overflow-auto max-h-96 border border-slate-700">
            {JSON.stringify(profiles, null, 2)}
          </pre>
        </details>
      </div>
    </motion.div>
  )
}
