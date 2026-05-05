import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import type { Zombie, ZombieType } from '../../types/zombie'

interface Bullet {
  id: string
  startX: number
  startY: number
  endX: number
  endY: number
  createdAt: number
  duration: number
}

interface Explosion {
  id: string
  x: number
  y: number
  createdAt: number
}

interface BattleFieldProps {
  zombies: Zombie[]
  currentIndex: number
  combo: number
  defenseLineX?: number
  height?: number
}

const BATTLE_WIDTH = 800
const TURRET_X = 50
const BULLET_DURATION = 400

const ZOMBIE_STYLES: Record<ZombieType, { size: number; color: string; glow: string }> = {
  normal: { size: 40, color: 'text-slate-200', glow: 'rgba(148, 163, 184, 0.3)' },
  fast: { 
    size: 32, 
    color: 'text-yellow-300', 
    glow: 'rgba(253, 224, 71, 0.4)' 
  },
  strong: { 
    size: 56, 
    color: 'text-red-400', 
    glow: 'rgba(248, 113, 113, 0.5)' 
  },
}

const COMBO_THRESHOLD = 5

export function BattleField({ 
  zombies, 
  currentIndex,
  combo,
  defenseLineX = 50,
  height = 300 
}: BattleFieldProps) {
  const [bullets, setBullets] = useState<Bullet[]>([])
  const [explosions, setExplosions] = useState<Explosion[]>([])
  const previousIndexRef = useRef(currentIndex)

  const mapZombieX = (x: number) => {
    return x
  }

  const isDefenseLineInDanger = zombies.some(z => z.position.x <= defenseLineX + 80)

  useEffect(() => {
    const indexIncreased = currentIndex > previousIndexRef.current
    
    if (indexIncreased && zombies.length > 0) {
      const sortedZombies = [...zombies].sort((a, b) => a.position.x - b.position.x)
      const targetsCount = combo >= COMBO_THRESHOLD ? Math.min(3, zombies.length) : 1
      const targets = sortedZombies.slice(0, targetsCount)

      targets.forEach(target => {
        const targetScreenX = mapZombieX(target.position.x)
        const targetScreenY = target.position.y

        const bulletId = `bullet-${Date.now()}-${Math.random()}`
        setBullets(prev => [...prev, {
          id: bulletId,
          startX: TURRET_X,
          startY: height / 2,
          endX: targetScreenX,
          endY: targetScreenY,
          createdAt: Date.now(),
          duration: BULLET_DURATION,
        }])

        setTimeout(() => {
          setBullets(prev => prev.filter(b => b.id !== bulletId))
        }, BULLET_DURATION + 50)

        setTimeout(() => {
          setExplosions(prev => [...prev, {
            id: `exp-${Date.now()}-${Math.random()}`,
            x: targetScreenX,
            y: targetScreenY,
            createdAt: Date.now(),
          }])
        }, BULLET_DURATION)
      })
    }

    previousIndexRef.current = currentIndex
  }, [currentIndex, zombies, combo, height])

  useEffect(() => {
    const now = Date.now()
    setExplosions(prev => prev.filter(e => now - e.createdAt < 600))
  }, [explosions])

  return (
    <div 
      className="relative overflow-hidden rounded-xl border-2 border-slate-700"
      style={{ 
        width: BATTLE_WIDTH, 
        height,
        background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      }}
    >
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <motion.div
        className="absolute top-0 bottom-0 w-1"
        style={{ left: defenseLineX }}
        initial={{ opacity: 0.6 }}
        animate={isDefenseLineInDanger ? {
          opacity: [0.6, 1, 0.6],
          boxShadow: [
            '0 0 10px rgba(239, 68, 68, 0.5)',
            '0 0 30px rgba(239, 68, 68, 0.8)',
            '0 0 10px rgba(239, 68, 68, 0.5)',
          ],
        } : { opacity: 0.6 }}
        transition={{ duration: 0.5, repeat: isDefenseLineInDanger ? Infinity : 0 }}
      >
        <div className="absolute inset-0 bg-red-500" 
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(239, 68, 68, 0.8) 10px, rgba(239, 68, 68, 0.8) 20px)',
            opacity: isDefenseLineInDanger ? 1 : 0.5,
          }}
        />
        {isDefenseLineInDanger && (
          <motion.div
            className="absolute top-0 bottom-0 -right-4 left-0"
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(239, 68, 68, 0.4) 100%)',
            }}
          />
        )}
      </motion.div>

      <motion.div
        className="absolute"
        style={{ left: TURRET_X - 30, top: height / 2 - 40 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
          <rect x="10" y="40" width="40" height="35" rx="5" fill="#6366f1" />
          <rect x="15" y="45" width="30" height="25" rx="3" fill="#4f46e5" />
          <rect x="40" y="50" width="18" height="10" rx="2" fill="#8b5cf6" />
          <rect x="55" y="48" width="5" height="14" rx="1" fill="#a855f7" />
          <circle cx="30" cy="58" r="8" fill="url(#turretGlow)" />
          <defs>
            <radialGradient id="turretGlow" cx="30" cy="58" r="8">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      <AnimatePresence>
        {zombies.map((zombie, index) => {
          const style = ZOMBIE_STYLES[zombie.type]
          const screenX = mapZombieX(zombie.position.x)
          const screenY = zombie.position.y
          
          return (
            <motion.div
              key={zombie.id}
              className="absolute flex items-center justify-center"
              style={{ 
                left: screenX - style.size / 2,
                top: screenY - style.size / 2,
              }}
              initial={{ scale: 0, opacity: 0, x: -50 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                x: 0,
              }}
              exit={{ 
                scale: 1.5, 
                opacity: 0,
                transition: { duration: 0.15 }
              }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <motion.div
                className={`${style.color} drop-shadow-lg`}
                style={{ 
                  fontSize: style.size,
                  filter: `drop-shadow(0 0 10px ${style.glow})`,
                }}
                animate={zombie.type === 'fast' ? {
                  y: [0, -3, 0],
                } : {}}
                transition={{ duration: 0.3, repeat: Infinity }}
              >
                💀
              </motion.div>
              
              {zombie.type === 'strong' && zombie.health > 1 && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {Array.from({ length: zombie.health }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>

      <AnimatePresence>
        {bullets.map(bullet => {
          const elapsed = Date.now() - bullet.createdAt
          const progress = Math.min(elapsed / bullet.duration, 1)
          const currentX = bullet.startX + (bullet.endX - bullet.startX) * progress
          const currentY = bullet.startY + (bullet.endY - bullet.startY) * progress
          
          return (
            <motion.div
              key={bullet.id}
              className="absolute pointer-events-none"
              style={{
                left: currentX - 8,
                top: currentY - 8,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <div 
                className="w-4 h-4 rounded-full"
                style={{
                  background: 'radial-gradient(circle, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                  boxShadow: '0 0 15px rgba(251, 191, 36, 0.8), 0 0 30px rgba(245, 158, 11, 0.6)',
                }}
              />
              {progress < 0.7 && (
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-8 h-2"
                  style={{
                    left: -8,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(251, 191, 36, 0.6) 100%)',
                    borderRadius: '50%',
                  }}
                />
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>

      <AnimatePresence>
        {explosions.map(explosion => (
          <motion.div
            key={explosion.id}
            className="absolute pointer-events-none"
            style={{
              left: explosion.x - 32,
              top: explosion.y - 32,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div 
              className="w-16 h-16 rounded-full"
              style={{
                background: 'radial-gradient(circle, #fbbf24 0%, #f59e0b 40%, #ea580c 70%, transparent 100%)',
                boxShadow: '0 0 40px rgba(251, 191, 36, 0.9), 0 0 80px rgba(245, 158, 11, 0.7)',
              }}
            />
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-yellow-400"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ 
                  x: Math.cos(i * 45 * Math.PI / 180) * 50,
                  y: Math.sin(i * 45 * Math.PI / 180) * 50,
                  opacity: 0,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
