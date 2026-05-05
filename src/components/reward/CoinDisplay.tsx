import { motion, AnimatePresence } from 'framer-motion'
import { Coins } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CoinDisplayProps {
  coins: number
  showAnimation?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CoinDisplay({ 
  coins, 
  showAnimation = false, 
  size = 'md',
  className = ''
}: CoinDisplayProps) {
  const [displayCoins, setDisplayCoins] = useState(coins)
  const [isAnimating, setIsAnimating] = useState(false)

  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (showAnimation && coins !== displayCoins) {
      setIsAnimating(true)
      setDisplayCoins(coins)
      const timer = setTimeout(() => setIsAnimating(false), 600)
      return () => clearTimeout(timer)
    }
    setDisplayCoins(coins)
  }, [coins, showAnimation, displayCoins])

  const formattedCoins = displayCoins.toLocaleString('zh-CN')

  const SIZE_CONFIG = {
    sm: {
      icon: 16,
      text: 'text-sm',
      gap: 'gap-1.5',
      padding: 'px-2.5 py-1',
      iconSize: 'w-4 h-4'
    },
    md: {
      icon: 20,
      text: 'text-base',
      gap: 'gap-2',
      padding: 'px-3 py-1.5',
      iconSize: 'w-5 h-5'
    },
    lg: {
      icon: 24,
      text: 'text-lg',
      gap: 'gap-2.5',
      padding: 'px-4 py-2',
      iconSize: 'w-6 h-6'
    }
  }

  const config = SIZE_CONFIG[size]

  const animationConfig = prefersReducedMotion ? {} : {
    scale: isAnimating ? [1, 1.15, 1] : 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const
    }
  }

  return (
    <motion.div
      className={`
        inline-flex items-center ${config.gap} ${config.padding}
        bg-gradient-to-r from-amber-500/20 to-yellow-500/20
        border border-amber-500/30
        rounded-full
        ${className}
      `}
      animate={animationConfig}
      role="status"
      aria-label={`金币: ${formattedCoins}`}
    >
      <motion.div
        animate={isAnimating && !prefersReducedMotion ? {
          rotate: [0, -15, 15, -10, 10, 0],
          scale: [1, 1.2, 1]
        } : {}}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center"
      >
        <Coins 
          size={config.icon} 
          className={`${config.iconSize} text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]`}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.span
          key={displayCoins}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className={`
            ${config.text}
            font-semibold
            text-amber-300
            tabular-nums
            tracking-tight
          `}
        >
          {formattedCoins}
        </motion.span>
      </AnimatePresence>

      <AnimatePresence>
        {isAnimating && !prefersReducedMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default CoinDisplay
