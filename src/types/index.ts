export interface Profile {
  id: string
  name: string
  avatar: string
  createdAt: Date
  totalPracticeTime: number
  totalKeystrokes: number
  averageWPM: number
  averageAccuracy: number
  highestWPM: number
  currentLevel: number
  experience: number
  unlockedCourses: string[]
  achievements: string[]
  streak: number
  lastPracticeDate: Date | null
}

export interface UserSettings {
  soundEnabled: boolean
  musicEnabled: boolean
  keyboardLayout: 'QWERTY' | 'DVORAK'
  theme: 'light' | 'dark' | 'auto'
  fontSize: 'small' | 'medium' | 'large'
}

export interface Course {
  id: string
  name: string
  description: string
  category: CourseCategory
  lessons: Lesson[]
  difficulty: number
  requiredCourseId?: string
}

export type CourseCategory = 
  | 'basics'
  | 'speed'
  | 'mastery'
  | 'vocabulary'
  | 'article'
  | 'programming'

export interface Lesson {
  id: string
  courseId: string
  name: string
  text: string
  targetWPM: number
  targetAccuracy: number
  order: number
}

export interface PracticeRecord {
  id: string
  profileId: string
  date: Date
  lessonId: string
  lessonName: string
  courseId: string
  mode: 'course' | 'free' | 'challenge'
  duration: number
  wpm: number
  accuracy: number
  correctChars: number
  wrongChars: number
  mistakes: MistakeRecord[]
}

export interface MistakeRecord {
  expected: string
  actual: string
  count: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'milestone' | 'skill' | 'hidden'
  condition: AchievementCondition
}

export interface AchievementCondition {
  type: 'wpm' | 'accuracy' | 'streak' | 'practice_count' | 'level' | 'time'
  value: number
  comparison: 'gte' | 'lte' | 'eq'
}

export interface DailyTask {
  id: string
  name: string
  description: string
  reward: number
  condition: {
    type: 'practice_count' | 'accuracy' | 'duration' | 'course_complete'
    value: number
  }
  completed: boolean
}

export interface TypingState {
  currentIndex: number
  correctChars: number
  wrongChars: number
  startTime: number | null
  endTime: number | null
  isFinished: boolean
  isStarted: boolean
  combo: number
  maxCombo: number
  mistakes: Map<string, number>
}

export interface TypingResult {
  wpm: number
  accuracy: number
  duration: number
  correctChars: number
  wrongChars: number
  maxCombo: number
  mistakes: MistakeRecord[]
}

export interface KeyboardKey {
  key: string
  code: string
  finger: Finger
  row: number
  column: number
  isSpecial?: boolean
  width?: number
}

export type Finger = 
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky'
  | 'thumb'

export interface GameStore {
  currentProfile: Profile | null
  profiles: Profile[]
  settings: UserSettings
  currentCourse: Course | null
  currentLesson: Lesson | null
  typingState: TypingState
}