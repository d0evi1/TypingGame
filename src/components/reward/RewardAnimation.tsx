import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useMemo, useCallback } from 'react'
import type { Rarity, Reward } from '../../types/reward'
import { getRarityColor, getRarityName } from '../../utils/rewardLogic'
import { playSound } from '../../utils/sound'
import { Gift, Sparkles, Star, Crown } from 'lucide-react'

interface RewardAnimationProps {
  rarity: Rarity
  reward?: Reward
  isOpen: boolean
  onComplete: () => void
}

function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}

function Particle({ 
  delay, 
  color, 
  origin,
  seed 
}: { 
  delay: number
  color: string
  origin: { x: number; y: number }
  seed: number
}) {
  const angle = seed * Math.PI * 2
  const distance = 100 + (seed % 150)
  const x = Math.cos(angle) * distance
  const y = Math.sin(angle) * distance

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ 
        backgroundColor: color,
        left: `${origin.x}%`,
        top: `${origin.y}%`,
      }}
      initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
      animate={{ 
        scale: [0, 1.5, 0],
        opacity: [1, 1, 0],
        x,
        y,
      }}
      transition={{
        duration: 1.5,
        delay,
        ease: 'easeOut',
      }}
    />
  )
}

function FireworkBurst({ color, delay }: { color: string; delay: number }) {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    angle: (i / 12) * Math.PI * 2,
    delay: delay + (i % 5) * 0.04,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ 
            scale: 0,
            x: '-50%',
            y: '-50%',
          }}
          animate={{
            scale: [0, 1, 0],
            x: `calc(-50% + ${Math.cos(particle.angle) * 120}px)`,
            y: `calc(-50% + ${Math.sin(particle.angle) * 120}px)`,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 1,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

function GlowEffect({ 
  color, 
  intensity = 1,
  animated = true 
}: { 
  color: string
  intensity?: number
  animated?: boolean
}) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: `radial-gradient(circle at center, ${color}${Math.round(40 * intensity).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
      }}
      {...(animated && {
        animate: {
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        },
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      })}
    />
  )
}

function MysteryBox({ 
  isRevealing, 
  rarity 
}: { 
  isRevealing: boolean
  rarity: Rarity 
}) {
  const color = getRarityColor(rarity)
  
  return (
    <motion.div
      className="relative w-32 h-32"
      initial={{ rotateY: 0 }}
      animate={isRevealing ? { 
        rotateY: [0, 720],
        scale: [1, 1.1, 0],
      } : {}}
      transition={{
        duration: isRevealing ? 1.5 : 0,
        ease: 'easeInOut',
      }}
    >
      <div 
        className="w-full h-full rounded-2xl border-4 flex items-center justify-center text-5xl"
        style={{ 
          borderColor: color,
          backgroundColor: 'rgba(26, 26, 46, 0.9)',
          boxShadow: `0 0 30px ${color}40`,
        }}
      >
        <Gift 
          size={48} 
          style={{ color }}
        />
      </div>
      
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  )
}

function RewardDisplay({ 
  reward, 
  rarity,
  isVisible 
}: { 
  reward?: Reward
  rarity: Rarity
  isVisible: boolean
}) {
  const color = getRarityColor(rarity)
  const name = getRarityName(rarity)
  const Icon = rarity === 'legendary' ? Crown : rarity === 'epic' ? Star : Sparkles

  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ scale: 0, y: 50, opacity: 0 }}
      animate={isVisible ? { 
        scale: 1, 
        y: 0, 
        opacity: 1 
      } : {}}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      }}
    >
      <motion.div
        className="px-4 py-1.5 rounded-full text-sm font-bold"
        style={{ 
          backgroundColor: color,
          color: rarity === 'common' ? '#1a1a2e' : '#ffffff',
        }}
        initial={{ scale: 0 }}
        animate={isVisible ? { scale: 1 } : {}}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          delay: 0.4,
        }}
      >
        {name}
      </motion.div>

      <motion.div
        className="w-24 h-24 rounded-2xl border-4 flex items-center justify-center"
        style={{ 
          borderColor: color,
          backgroundColor: 'rgba(26, 26, 46, 0.9)',
          boxShadow: `0 0 40px ${color}60`,
        }}
        animate={{
          boxShadow: [
            `0 0 40px ${color}60`,
            `0 0 60px ${color}80`,
            `0 0 40px ${color}60`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {reward?.icon ? (
          <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1.5">
            <path d={reward.icon} />
          </svg>
        ) : (
          <Icon size={40} style={{ color }} />
        )}
      </motion.div>

      {reward && (
        <motion.p
          className="text-xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
        >
          {reward.name}
        </motion.p>
      )}

      <motion.button
        className="px-6 py-2.5 rounded-lg font-medium text-white transition-colors"
        style={{ backgroundColor: color }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        点击继续
      </motion.button>
    </motion.div>
  )
}

export function RewardAnimation({ 
  rarity, 
  reward, 
  isOpen, 
  onComplete 
}: RewardAnimationProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [phase, setPhase] = useState<'box' | 'reveal' | 'display'>('box')
  
  const color = getRarityColor(rarity)

  const particles = useMemo(() => {
    if (rarity === 'epic' || rarity === 'legendary') {
      return Array.from({ length: rarity === 'legendary' ? 20 : 10 }, (_, i) => ({
        id: i,
        delay: i * 0.05,
        color: rarity === 'legendary' ? '#F59E0B' : '#A855F7',
        seed: (i * 17 + (rarity === 'legendary' ? 42 : 23)) % 1000 / 1000,
      }))
    }
    return []
  }, [rarity])

  useEffect(() => {
    if (!isOpen) {
      setPhase('box')
      return
    }

    if (prefersReducedMotion) {
      setPhase('display')
      const timer = setTimeout(onComplete, 500)
      return () => clearTimeout(timer)
    }

    const boxDuration = rarity === 'common' ? 800 : 
                        rarity === 'rare' ? 1000 :
                        rarity === 'epic' ? 1200 : 1500

    const boxTimer = setTimeout(() => {
      setPhase('reveal')
    }, boxDuration)

    return () => clearTimeout(boxTimer)
  }, [isOpen, rarity, onComplete, prefersReducedMotion])

  useEffect(() => {
    if (phase === 'reveal') {
      playSound('reward_reveal')
      const revealDuration = 500
      const timer = setTimeout(() => {
        setPhase('display')
      }, revealDuration)
      return () => clearTimeout(timer)
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'display') {
      playSound(`reward_${rarity}` as const)
    }
  }, [phase, rarity])

  const handleClick = useCallback(() => {
    if (phase === 'display') {
      onComplete()
    }
  }, [phase, onComplete])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClick}
      >
        <motion.div
          className="absolute inset-0 bg-black/85"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center p-8">
          
          {rarity !== 'common' && phase !== 'box' && (
            <GlowEffect 
              color={color} 
              intensity={rarity === 'legendary' ? 1.5 : rarity === 'epic' ? 1.2 : 1}
            />
          )}

          {phase === 'reveal' && (rarity === 'epic' || rarity === 'legendary') && (
            <div className="absolute inset-0 pointer-events-none">
              {particles.map((p) => (
                <Particle 
                  key={p.id}
                  delay={p.delay}
                  color={p.color}
                  seed={p.seed}
                  origin={{ x: 50, y: 50 }}
                />
              ))}
            </div>
          )}

          {rarity === 'legendary' && phase === 'reveal' && (
            <>
              <FireworkBurst color="#F59E0B" delay={0} />
              <FireworkBurst color="#FBBF24" delay={0.3} />
            </>
          )}

          {phase === 'box' && (
            <MysteryBox isRevealing={false} rarity={rarity} />
          )}

          {phase === 'reveal' && (
            <MysteryBox isRevealing={true} rarity={rarity} />
          )}

          {phase === 'display' && (
            <RewardDisplay 
              reward={reward} 
              rarity={rarity} 
              isVisible={true}
            />
          )}

          {rarity === 'legendary' && phase === 'display' && (
            <motion.div
              className="absolute w-64 h-64 rounded-full border-4"
              style={{ borderColor: '#F59E0B' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.5],
                opacity: [0.8, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
