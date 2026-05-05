/**
 * Reward system hook for managing draw operations
 * 
 * Implements the core draw logic including:
 * - Daily draw limits (10 per day)
 * - Coin cost (50 per draw)
 * - Pity system integration
 * - Profile updates with new rewards
 */

import type { Profile } from '../types'
import type { Reward, Rarity, RewardCategory, PityState } from '../types/reward'
import { drawReward, createInitialPity, PITY_THRESHOLDS } from '../utils/rewardLogic'
import { allRewards, getRewardsByRarity } from '../data/rewards'
import { useGameStore } from '../store/gameStore'

const DRAW_COST = 150
const DAILY_DRAW_LIMIT = 10

/**
 * Get the current date as ISO string (YYYY-MM-DD format)
 */
function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Count how many draws have been performed today for a profile
 */
function getDailyDrawCount(profile: Profile): number {
  if (!profile.lastDrawDate) {
    return 0
  }
  const lastDrawDateStr = profile.lastDrawDate.split('T')[0]
  const todayStr = getTodayDateString()
  return lastDrawDateStr === todayStr ? profile.dailyDrawCount || 0 : 0
}

/**
 * Select a random reward from the pool based on rarity and optional category
 * @param rarity - The rarity tier to select from
 * @param category - Optional category filter
 * @returns A random reward matching the criteria
 */
export function selectRandomReward(rarity: Rarity, category?: RewardCategory): Reward {
  let pool: Reward[]
  
  if (category) {
    // Filter by both rarity and category
    pool = allRewards.filter(
      (reward) => reward.rarity === rarity && reward.category === category
    )
  } else {
    // Filter only by rarity
    pool = getRewardsByRarity(rarity)
  }
  
  if (pool.length === 0) {
    // Fallback: if no rewards in category with rarity, get any reward with that rarity
    pool = getRewardsByRarity(rarity)
  }
  
  // Random selection
  const randomIndex = Math.floor(Math.random() * pool.length)
  return pool[randomIndex]
}

/**
 * Update profile after receiving a reward
 * @param profile - Current profile
 * @param reward - The reward received
 * @param newPity - Updated pity state
 * @returns Updated profile
 */
export function updateProfileWithReward(
  profile: Profile,
  reward: Reward,
  newPity: PityState
): Profile {
  // Initialize rewards collection if not present
  const currentRewards = profile.rewards || {
    owned: [],
    equipped: {},
  }
  
  // Check if reward already owned
  const alreadyOwned = currentRewards.owned.some((r) => r.id === reward.id)
  
  // Add reward if not already owned
  const updatedOwned = alreadyOwned
    ? currentRewards.owned
    : [...currentRewards.owned, reward]
  
  // Update daily draw count
  const todayStr = getTodayDateString()
  const lastDrawDateStr = profile.lastDrawDate?.split('T')[0]
  const isNewDay = lastDrawDateStr !== todayStr
  const newDailyDrawCount = isNewDay ? 1 : (profile.dailyDrawCount || 0) + 1
  
  return {
    ...profile,
    coins: profile.coins - DRAW_COST,
    rewards: {
      ...currentRewards,
      owned: updatedOwned,
    },
    pityState: newPity,
    lastDrawDate: new Date().toISOString(),
    dailyDrawCount: newDailyDrawCount,
  }
}

/**
 * Perform a reward draw operation
 * @param profile - The profile performing the draw
 * @returns Result object with success status, reward, or error message
 */
export function performDraw(profile: Profile): {
  success: boolean
  reward?: Reward
  newPity?: PityState
  error?: string
} {
  // Check coin balance
  if (profile.coins < DRAW_COST) {
    return {
      success: false,
      error: `金币不足，需要 ${DRAW_COST} 金币，当前只有 ${profile.coins} 金币`,
    }
  }
  
  // Check daily limit
  const dailyDrawCount = getDailyDrawCount(profile)
  if (dailyDrawCount >= DAILY_DRAW_LIMIT) {
    return {
      success: false,
      error: `今日抽奖次数已达上限 (${DAILY_DRAW_LIMIT} 次)`,
    }
  }
  
  // Initialize pity state if not present
  const currentPity = profile.pityState || createInitialPity()
  
  // Perform the draw
  const { rarity, newPity } = drawReward(currentPity)
  
  // Select a random reward from the pool
  const reward = selectRandomReward(rarity)
  
  return {
    success: true,
    reward,
    newPity,
  }
}

/**
 * Hook for using the reward system in components
 * Provides access to draw operations and state management
 */
export function useRewardSystem() {
  const updateProfile = useGameStore((s) => s.updateProfile)
  const currentProfile = useGameStore((s) => {
    const { currentProfileId, profiles } = s
    return profiles.find((p) => p.id === currentProfileId) || null
  })
  
  /**
   * Execute a draw and update the profile in the store
   */
  const executeDraw = (): {
    success: boolean
    reward?: Reward
    error?: string
  } => {
    if (!currentProfile) {
      return {
        success: false,
        error: '未选择用户',
      }
    }
    
    const result = performDraw(currentProfile)
    
    if (result.success && result.reward && result.newPity) {
      const updatedProfile = updateProfileWithReward(
        currentProfile,
        result.reward,
        result.newPity
      )
      updateProfile(currentProfile.id, {
        coins: updatedProfile.coins,
        rewards: updatedProfile.rewards,
        pityState: updatedProfile.pityState,
        lastDrawDate: updatedProfile.lastDrawDate,
        dailyDrawCount: updatedProfile.dailyDrawCount,
      })
    }
    
    return result
  }
  
  /**
   * Get remaining draws for today
   */
  const getRemainingDraws = (): number => {
    if (!currentProfile) return DAILY_DRAW_LIMIT
    const dailyDrawCount = getDailyDrawCount(currentProfile)
    return DAILY_DRAW_LIMIT - dailyDrawCount
  }
  
  /**
   * Check if profile can draw (has enough coins and draws remaining)
   */
  const canDraw = (): boolean => {
    if (!currentProfile) return false
    return (
      currentProfile.coins >= DRAW_COST &&
      getDailyDrawCount(currentProfile) < DAILY_DRAW_LIMIT
    )
  }
  
  /**
   * Get current pity progress
   */
  const getPityProgress = () => {
    if (!currentProfile?.pityState) {
      return {
        rare: { current: 0, target: PITY_THRESHOLDS.rare },
        epic: { current: 0, target: PITY_THRESHOLDS.epic },
        legendary: { current: 0, target: PITY_THRESHOLDS.legendary },
      }
    }
    return {
      rare: { current: currentProfile.pityState.rareCounter, target: PITY_THRESHOLDS.rare },
      epic: { current: currentProfile.pityState.epicCounter, target: PITY_THRESHOLDS.epic },
      legendary: { current: currentProfile.pityState.legendaryCounter, target: PITY_THRESHOLDS.legendary },
    }
  }
  
  return {
    executeDraw,
    getRemainingDraws,
    canDraw,
    getPityProgress,
    DRAW_COST,
    DAILY_DRAW_LIMIT,
  }
}
// Reward calculation system for Typing Game
export const calculatePracticeReward = (wpm: number, accuracy: number): number => {
  if (!Number.isFinite(wpm) || !Number.isFinite(accuracy)) return 0;
  // Simple formula: reward scales with speed and accuracy
  return Math.max(0, Math.floor((wpm * accuracy) / 100));
};

export const calculateStreakBonus = (combo: number): number => {
  if (!Number.isFinite(combo)) return 0;
  // Small bonus every 10 in a row
  const clean = Math.max(0, combo);
  return Math.floor(clean / 10);
};

export const calculatePuzzleBonus = (puzzlesCompleted: number): number => {
  if (!Number.isFinite(puzzlesCompleted)) return 0;
  // Placeholder bonus based on number of puzzles completed
  return Math.max(0, Math.floor(puzzlesCompleted * 0.5));
};
