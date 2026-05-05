import { motion } from 'framer-motion'
import { qwertyLayout, getFingerColor } from '../../data/keyboardLayout'

interface VirtualKeyboardProps {
  currentChar: string
  lastCorrect: boolean | null
}

export function VirtualKeyboard({ currentChar, lastCorrect }: VirtualKeyboardProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        {qwertyLayout.rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key) => {
              const isTarget = currentChar.toLowerCase() === key.key.toLowerCase()
              const fingerColor = getFingerColor(key.finger)
              
              return (
                <motion.div
                  key={key.code}
                  className={`
                    flex items-center justify-center rounded-md font-mono text-sm
                    transition-colors duration-150
                    ${key.isSpecial ? 'text-xs' : 'text-base'}
                    ${isTarget 
                      ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-slate-900 z-10' 
                      : ''}
                    ${lastCorrect === false && isTarget
                      ? 'animate-shake bg-red-500'
                      : ''}
                  `}
                  style={{
                    width: `${(key.width || 1) * 44}px`,
                    height: '44px',
                    backgroundColor: isTarget 
                      ? lastCorrect === false 
                        ? '#ef4444' 
                        : '#fbbf24'
                      : '#1e293b',
                    color: isTarget ? '#000' : '#94a3b8',
                    boxShadow: isTarget 
                      ? `0 0 20px ${fingerColor}40` 
                      : 'none',
                  }}
                  initial={false}
                  animate={{
                    scale: isTarget ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.15 }}
                >
                  <span className="select-none">
                    {key.key.length > 1 ? key.key : key.key.toUpperCase()}
                  </span>
                </motion.div>
              )
            })}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-center gap-6 text-xs">
        {[
          { finger: 'left-pinky' as const, label: '小指' },
          { finger: 'left-ring' as const, label: '无名指' },
          { finger: 'left-middle' as const, label: '中指' },
          { finger: 'left-index' as const, label: '食指' },
          { finger: 'right-index' as const, label: '食指' },
          { finger: 'right-middle' as const, label: '中指' },
          { finger: 'right-ring' as const, label: '无名指' },
          { finger: 'right-pinky' as const, label: '小指' },
        ].map(({ finger, label }) => (
          <div key={finger} className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getFingerColor(finger) }}
            />
            <span className="text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}