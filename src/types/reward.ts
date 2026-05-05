/**
 * Reward system type definitions
 * This file augments the existing Profile interface via module augmentation
 * and exports core reward-related types for reuse across the codebase.
 */

/**
 * Rarity categories for rewards.
 */
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

/**
 * Categories of rewards that can be equipped or earned.
 */
export type RewardCategory = 'sword' | 'staff' | 'armor' | 'mount' | 'shield'

/**
 * Basic reward definition.
 */
export interface Reward {
  /** Unique identifier for the reward */
  id: string
  /** Display name for the reward */
  name: string
  /** Description of the reward */
  description: string
  /** Category this reward belongs to (e.g., sword, armor) */
  category: RewardCategory
  /** Rarity tier of the reward */
  rarity: Rarity
  /** Icon representation (SVG path or data URI) */
  icon: string
}

/**
 * Pity counters to guarantee rewards after a number of draws.
 */
export interface PityState {
  rareCounter: number
  epicCounter: number
  legendaryCounter: number
}

/**
 * A collection of rewards owned by a profile, and the currently equipped ones.
 */
export interface RewardCollection {
  /** Rewards currently owned by the profile */
  owned: Reward[]
  /** Currently equipped rewards by category */
  equipped: EquippedRewards
}

/**
 * Mapping of equipment slots to reward IDs.
 */
export interface EquippedRewards {
  sword?: string
  staff?: string
  armor?: string
  mount?: string
  shield?: string
}

/**
 * Extend the existing Profile interface with reward-related fields.
 * This uses module augmentation to avoid modifying the original index.ts directly.
 */
export {};
declare module './index' {
  interface Profile {
    coins: number
    totalCoinsEarned: number
    rewards: RewardCollection
    pityState: PityState
    lastDrawDate?: string
    dailyDrawCount?: number
  }
}

/**
 * Type export friends for external usage (kept explicit instead of re-exporting from index).
 */
export type { Reward as RewardType } // alias for external consumers if needed
