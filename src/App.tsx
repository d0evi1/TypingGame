import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGameStore, useCurrentProfile } from './store/gameStore'
import { ProfileSelect, HomePage } from './components/profile/ProfileSelect'
import { RewardShop } from './components/reward/RewardShop'
import { RewardCollection } from './components/reward/RewardCollection'
import { calculatePracticeReward, calculateStreakBonus } from './hooks/useRewardSystem'
import { CourseList } from './components/courses/CourseList'
import { LessonList } from './components/courses/LessonList'
import { TypingPractice } from './components/game/TypingPractice'
import { PuzzleGame } from './components/game/PuzzleGame'
import { ZombieGame } from './components/game/ZombieGame'
import { StatsPage } from './components/game/StatsPage'
import { DevTools } from './components/dev/DevTools'
import type { Course, Lesson } from './types'

type Page = 'home' | 'practice' | 'courses' | 'lessons' | 'puzzle' | 'stats' | 'shop' | 'collection' | 'dev' | 'zombie'

const sampleTexts = [
  'the quick brown fox jumps over the lazy dog',
  'asdf jkl; asdf jkl; fdsa ;lkj fdsa ;lkj',
  'hello world welcome to typing game practice makes perfect',
  'programming is fun javascript python react typescript',
]

function App() {
  const [page, setPage] = useState<Page>('home')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [quickPracticeText] = useState(() => 
    sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
  )
  const [puzzlePoints, setPuzzlePoints] = useState(0)
  console.debug('Puzzle points:', puzzlePoints)
  
  const currentProfileId = useGameStore((s) => s.currentProfileId)
  const profile = useCurrentProfile()
  const updateProfile = useGameStore((s) => s.updateProfile)
  
  const handleSelectCourse = useCallback((course: Course) => {
    setSelectedCourse(course)
    setPage('lessons')
  }, [])
  
  const handleSelectLesson = useCallback((lesson: Lesson) => {
    setSelectedLesson(lesson)
    setPage('practice')
  }, [])
  
  const handlePracticeComplete = useCallback((result: {
    wpm: number
    accuracy: number
    duration: number
    correctChars: number
    wrongChars: number
    maxCombo: number
  }) => {
    if (!profile) return
    
    const expGain = Math.floor(result.wpm * result.accuracy / 100)
    // Reward calculation
    let totalReward = 0
    try {
      const practiceReward = calculatePracticeReward(result.wpm, result.accuracy)
      const streakBonus = calculateStreakBonus(result.maxCombo)
      totalReward = practiceReward + streakBonus
    } catch {
      // if reward system fails, ignore without breaking game flow
    }
    
    updateProfile(profile.id, {
      totalPracticeTime: profile.totalPracticeTime + result.duration,
      totalKeystrokes: profile.totalKeystrokes + result.correctChars + result.wrongChars,
      highestWPM: Math.max(profile.highestWPM, result.wpm),
      averageWPM: Math.round((profile.averageWPM + result.wpm) / 2),
      averageAccuracy: Math.round((profile.averageAccuracy + result.accuracy) / 2),
      coins: (profile.coins || 0) + totalReward,
      experience: profile.experience + expGain,
      currentLevel: Math.floor((profile.experience + expGain) / 100) + 1,
      lastPracticeDate: new Date(),
    })
  }, [profile, updateProfile])

  const handlePuzzleComplete = useCallback((result: { completed: boolean; pieces: number; coinsEarned?: number }) => {
    if (result.completed && result.coinsEarned && profile) {
      updateProfile(profile.id, {
        coins: (profile.coins || 0) + result.coinsEarned,
        totalCoinsEarned: (profile.totalCoinsEarned || 0) + result.coinsEarned,
      })
      setPuzzlePoints(prev => prev + 1)
    }
  }, [profile, updateProfile])

  const handleZombieComplete = useCallback((result: { completed: boolean; score?: number; coinsEarned?: number }) => {
    if (result.completed && result.coinsEarned && profile) {
      updateProfile(profile.id, {
        coins: (profile.coins || 0) + (result.coinsEarned || 0),
        totalCoinsEarned: (profile.totalCoinsEarned || 0) + (result.coinsEarned || 0),
      })
    }
  }, [profile, updateProfile])

  const handleOpenShop = () => setPage('shop')
  const handleOpenCollection = () => setPage('collection')
  const handleBack = () => setPage('home')
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        setPage(prev => prev === 'dev' ? 'home' : 'dev')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  if (!currentProfileId || !profile) {
    return <ProfileSelect onSelect={() => {}} />
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <AnimatePresence mode="wait">
        {page === 'home' && (
          <HomePage
            onStartPractice={() => setPage('practice')}
            onSelectCourse={() => setPage('courses')}
            onStartPuzzle={() => setPage('puzzle')}
            onStartZombie={() => setPage('zombie')}
            onViewStats={() => setPage('stats')}
            onOpenShop={handleOpenShop}
            onOpenCollection={handleOpenCollection}
            coins={profile?.coins || 0}
          />
        )}

        {page === 'shop' && <RewardShop onBack={handleBack} />}
        {page === 'collection' && <RewardCollection onBack={handleBack} />}
        
        {page === 'courses' && (
          <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => setPage('home')}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
              >
                ← 返回
              </button>
              <h1 className="text-2xl font-bold text-white mb-6">选择课程</h1>
              <CourseList
                completedLessons={[]}
                onSelectCourse={handleSelectCourse}
              />
            </div>
          </div>
        )}
        
        {page === 'lessons' && selectedCourse && (
          <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
              <LessonList
                courseId={selectedCourse.id}
                completedLessons={[]}
                onSelectLesson={handleSelectLesson}
                onBack={() => setPage('courses')}
              />
            </div>
          </div>
        )}
        
        {page === 'practice' && (
          <TypingPractice
            text={selectedLesson?.text || quickPracticeText}
            title={selectedLesson?.name || '快速练习'}
            onComplete={handlePracticeComplete}
            onExit={() => {
              setSelectedLesson(null)
              setPage(selectedCourse ? 'lessons' : 'home')
            }}
          />
        )}
        
        {page === 'puzzle' && (
          <PuzzleGame
            onExit={() => setPage('home')}
            onComplete={handlePuzzleComplete}
          />
        )}
        {page === 'zombie' && (
          <ZombieGame onExit={() => setPage('home')} onComplete={handleZombieComplete} />
        )}
        
        {page === 'stats' && (
          <StatsPage onBack={() => setPage('home')} />
        )}
        
        {page === 'dev' && (
          <DevTools onBack={() => setPage('home')} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
