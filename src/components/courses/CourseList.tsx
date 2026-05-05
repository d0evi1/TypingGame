import { motion } from 'framer-motion'
import { Star, Trophy, ChevronRight } from 'lucide-react'
import { courses, getCourseProgress } from '../../data/courses'
import type { Course } from '../../types'

interface CourseCardProps {
  course: Course
  progress: number
  onClick: () => void
}

function CourseCard({ course, progress, onClick }: CourseCardProps) {
  const difficultyStars = Array(course.difficulty).fill(null)
  
  return (
    <motion.div
      onClick={onClick}
      className="relative bg-slate-800/80 rounded-xl p-6 border border-slate-700 transition-all duration-300 cursor-pointer hover:border-indigo-500 hover:bg-slate-800"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{course.name}</h3>
          <p className="text-sm text-slate-400">{course.description}</p>
        </div>
        <div className="flex gap-1">
          {difficultyStars.map((_, i) => (
            <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-sm text-slate-400">
            {course.lessons.length} 课程
          </div>
          {progress > 0 && (
            <div className="flex items-center gap-1 text-sm text-green-400">
              <Trophy size={14} />
              {progress}%
            </div>
          )}
        </div>
        <ChevronRight size={20} className="text-slate-400" />
      </div>
      
      {progress > 0 && (
        <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
    </motion.div>
  )
}

interface CourseListProps {
  completedLessons: string[]
  onSelectCourse: (course: Course) => void
}

export function CourseList({ completedLessons, onSelectCourse }: CourseListProps) {
  const categoryLabels: Record<string, string> = {
    basics: '基础指法',
    speed: '速度提升',
    mastery: '精通练习',
    vocabulary: '词汇练习',
    article: '文章练习',
    programming: '编程打字',
  }
  
  const groupedCourses = courses.reduce((acc, course) => {
    const category = course.category
    if (!acc[category]) acc[category] = []
    acc[category].push(course)
    return acc
  }, {} as Record<string, Course[]>)
  
  return (
    <div className="space-y-8">
      {Object.entries(groupedCourses).map(([category, categoryCourses]) => (
        <div key={category}>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            {categoryLabels[category] || category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                progress={getCourseProgress(course.id, completedLessons)}
                onClick={() => onSelectCourse(course)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
