import type { Course, Lesson } from '../types'

const lessons: Lesson[] = [
  {
    id: 'lesson-1-1',
    courseId: 'course-basics',
    name: '基准键位 左手',
    text: 'asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf',
    targetWPM: 15,
    targetAccuracy: 95,
    order: 1,
  },
  {
    id: 'lesson-1-2',
    courseId: 'course-basics',
    name: '基准键位 右手',
    text: 'jkl; jkl; jkl; jkl; jkl; jkl; jkl; jkl; jkl; jkl;',
    targetWPM: 15,
    targetAccuracy: 95,
    order: 2,
  },
  {
    id: 'lesson-1-3',
    courseId: 'course-basics',
    name: '基准键位 双手',
    text: 'asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl;',
    targetWPM: 20,
    targetAccuracy: 95,
    order: 3,
  },
  {
    id: 'lesson-1-4',
    courseId: 'course-basics',
    name: '基准键位综合',
    text: 'asdf jkl; asdf jkl; fdsa ;lkj fdsa ;lkj asdf jkl;',
    targetWPM: 25,
    targetAccuracy: 90,
    order: 4,
  },
  {
    id: 'lesson-1-5',
    courseId: 'course-basics',
    name: '上排键位 左手',
    text: 'qwer qwer qwer qwer qwer qwer qwer qwer qwer qwer',
    targetWPM: 15,
    targetAccuracy: 95,
    order: 5,
  },
  {
    id: 'lesson-1-6',
    courseId: 'course-basics',
    name: '上排键位 右手',
    text: 'uiop uiop uiop uiop uiop uiop uiop uiop uiop uiop',
    targetWPM: 15,
    targetAccuracy: 95,
    order: 6,
  },
  {
    id: 'lesson-1-7',
    courseId: 'course-basics',
    name: '上排键位综合',
    text: 'qwer uiop qwer uiop rewq poiu rewq poiu qwer uiop',
    targetWPM: 20,
    targetAccuracy: 90,
    order: 7,
  },
  {
    id: 'lesson-1-8',
    courseId: 'course-basics',
    name: '下排键位 左手',
    text: 'zxcv zxcv zxcv zxcv zxcv zxcv zxcv zxcv zxcv zxcv',
    targetWPM: 15,
    targetAccuracy: 95,
    order: 8,
  },
  {
    id: 'lesson-1-9',
    courseId: 'course-basics',
    name: '下排键位 右手',
    text: 'bnm, bnm, bnm, bnm, bnm, bnm, bnm, bnm, bnm, bnm,',
    targetWPM: 15,
    targetAccuracy: 95,
    order: 9,
  },
  {
    id: 'lesson-1-10',
    courseId: 'course-basics',
    name: '全部键位综合',
    text: 'asdf jkl; qwer uiop zxcv bnm, asdf jkl; qwer uiop',
    targetWPM: 25,
    targetAccuracy: 85,
    order: 10,
  },
]

const speedLessons: Lesson[] = [
  {
    id: 'lesson-2-1',
    courseId: 'course-speed',
    name: '常用单词练习',
    text: 'the and is are was were be been being have has had do does did will would shall should can could may might must',
    targetWPM: 30,
    targetAccuracy: 90,
    order: 1,
  },
  {
    id: 'lesson-2-2',
    courseId: 'course-speed',
    name: '简单短语',
    text: 'good morning hello world thank you very much nice to meet you see you later have a nice day best wishes',
    targetWPM: 35,
    targetAccuracy: 90,
    order: 2,
  },
  {
    id: 'lesson-2-3',
    courseId: 'course-speed',
    name: '日常句子',
    text: 'how are you today i am doing well what is your name my name is where are you going i am going to school',
    targetWPM: 40,
    targetAccuracy: 85,
    order: 3,
  },
]

const programmingLessons: Lesson[] = [
  {
    id: 'lesson-3-1',
    courseId: 'course-python',
    name: 'Python 基础',
    text: 'def function(): return value if condition: else: while loop: for item in list: print output import module',
    targetWPM: 25,
    targetAccuracy: 90,
    order: 1,
  },
  {
    id: 'lesson-3-2',
    courseId: 'course-python',
    name: 'Python 数据结构',
    text: 'list = [] dict = {} set = () tuple = () class Object: self.attr = value lambda x: x + 1 map filter reduce',
    targetWPM: 30,
    targetAccuracy: 85,
    order: 2,
  },
  {
    id: 'lesson-3-3',
    courseId: 'course-js',
    name: 'JavaScript 基础',
    text: 'function name() { return value; } const let var if (condition) { } else { } for (let i = 0; i < n; i++) { }',
    targetWPM: 25,
    targetAccuracy: 90,
    order: 1,
  },
  {
    id: 'lesson-3-4',
    courseId: 'course-js',
    name: 'JavaScript 现代语法',
    text: 'const arrow = () => {}; async function await promise; export import default; const { key } = object; array.map(x => x)',
    targetWPM: 30,
    targetAccuracy: 85,
    order: 2,
  },
]

export const courses: Course[] = [
  {
    id: 'course-basics',
    name: '键位指法入门',
    description: '学习正确的手指位置，掌握基准键位和全键盘操作',
    category: 'basics',
    lessons: lessons.slice(0, 10),
    difficulty: 1,
  },
  {
    id: 'course-speed',
    name: '打字速度提升',
    description: '通过常用单词和句子练习提升打字速度',
    category: 'speed',
    lessons: speedLessons,
    difficulty: 2,
    requiredCourseId: 'course-basics',
  },
  {
    id: 'course-python',
    name: 'Python 编程打字',
    description: '练习 Python 代码输入，为编程打下基础',
    category: 'programming',
    lessons: programmingLessons.slice(0, 2),
    difficulty: 3,
    requiredCourseId: 'course-speed',
  },
  {
    id: 'course-js',
    name: 'JavaScript 编程打字',
    description: '练习 JavaScript 代码输入，包括现代 ES6+ 语法',
    category: 'programming',
    lessons: programmingLessons.slice(2, 4),
    difficulty: 3,
    requiredCourseId: 'course-speed',
  },
]

export function getCourseById(id: string): Course | undefined {
  return courses.find(c => c.id === id)
}

export function getLessonById(id: string): Lesson | undefined {
  for (const course of courses) {
    const lesson = course.lessons.find(l => l.id === id)
    if (lesson) return lesson
  }
  return undefined
}

export function isCourseUnlocked(courseId: string, unlockedCourses: string[]): boolean {
  const course = getCourseById(courseId)
  if (!course) return false
  if (!course.requiredCourseId) return true
  return unlockedCourses.includes(course.requiredCourseId)
}

export function getCourseProgress(courseId: string, completedLessons: string[]): number {
  const course = getCourseById(courseId)
  if (!course) return 0
  
  const completed = course.lessons.filter(l => completedLessons.includes(l.id)).length
  return Math.round((completed / course.lessons.length) * 100)
}