import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, Star, Target } from 'lucide-react'
import { getCourseById } from '../../data/courses'
import type { Lesson } from '../../types'

interface LessonCardProps {
  lesson: Lesson
  isCompleted: boolean
  onClick: () => void
}

function LessonCard({ lesson, isCompleted, onClick }: LessonCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className="flex items-center justify-between p-4 rounded-lg border bg-slate-800 border-slate-700 hover:border-indigo-500 cursor-pointer transition-all duration-200"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center gap-4">
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center
          ${isCompleted 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-indigo-500/20 text-indigo-400'}
        `}>
          {isCompleted ? (
            <CheckCircle size={20} />
          ) : (
            <span className="text-sm font-bold">{lesson.order}</span>
          )}
        </div>
        <div>
          <h4 className="text-white font-medium">{lesson.name}</h4>
          <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <Target size={14} />
              目标: {lesson.targetWPM} WPM
            </span>
            <span className="flex items-center gap-1">
              <Star size={14} />
              准确率: {lesson.targetAccuracy}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface LessonListProps {
  courseId: string
  completedLessons: string[]
  onSelectLesson: (lesson: Lesson) => void
  onBack: () => void
}

export function LessonList({ courseId, completedLessons, onSelectLesson, onBack }: LessonListProps) {
  const course = getCourseById(courseId)
  
  if (!course) {
    return (
      <div className="text-center text-slate-400">
        课程不存在
        <button onClick={onBack} className="mt-4 text-indigo-400 hover:text-indigo-300">
          返回课程列表
        </button>
      </div>
    )
  }
  
  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        返回课程列表
      </button>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">{course.name}</h1>
        <p className="text-slate-400">{course.description}</p>
      </div>
      
      <div className="space-y-3">
        {course.lessons.map((lesson) => {
          const isCompleted = completedLessons.includes(lesson.id)
          
          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              isCompleted={isCompleted}
              onClick={() => onSelectLesson(lesson)}
            />
          )
        })}
      </div>
    </div>
  )
}