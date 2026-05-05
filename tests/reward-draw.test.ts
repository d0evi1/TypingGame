import { describe, test, expect } from 'bun:test'
import { performDraw, selectRandomReward, updateProfileWithReward } from '../src/hooks/useRewardSystem'
import { createInitialPity } from '../src/utils/rewardLogic'
import type { Profile } from '../src/types'
import type { Reward, Rarity } from '../src/types/reward'

const createMockProfile = (coins: number, dailyDrawCount = 0): Profile => ({
  id: 'test-profile',
  name: 'Test User',
  avatar: 'avatar-1',
  createdAt: new Date(),
  totalPracticeTime: 0,
  totalKeystrokes: 0,
  averageWPM: 0,
  averageAccuracy: 0,
  highestWPM: 0,
  currentLevel: 1,
  experience: 0,
  unlockedCourses: [],
  achievements: [],
  streak: 0,
  lastPracticeDate: null,
  coins,
  totalCoinsEarned: coins,
  rewards: { owned: [], equipped: {} },
  pityState: createInitialPity(),
  lastDrawDate: new Date().toISOString(),
  dailyDrawCount,
})

describe('performDraw', () => {
  test('should reject draw when coins insufficient (30 coins)', () => {
    const profile = createMockProfile(30)
    const result = performDraw(profile)
    
    expect(result.success).toBe(false)
    expect(result.error).toContain('金币不足')
    expect(result.reward).toBeUndefined()
  })

  test('should accept draw with sufficient coins (100 coins)', () => {
    const profile = createMockProfile(100)
    const result = performDraw(profile)
    
    expect(result.success).toBe(true)
    expect(result.reward).toBeDefined()
    expect(result.newPity).toBeDefined()
  })

  test('should reject draw when daily limit reached (11th draw)', () => {
    const profile = createMockProfile(1000, 10)
    const result = performDraw(profile)
    
    expect(result.success).toBe(false)
    expect(result.error).toContain('今日抽奖次数已达上限')
  })
})

describe('selectRandomReward', () => {
  test('should return a reward of specified rarity', () => {
    const reward = selectRandomReward('common')
    expect(reward.rarity).toBe('common')
    
    const rareReward = selectRandomReward('rare')
    expect(rareReward.rarity).toBe('rare')
  })

  test('should return a reward of specified rarity and category', () => {
    const reward = selectRandomReward('epic', 'sword')
    expect(reward.rarity).toBe('epic')
    expect(reward.category).toBe('sword')
  })
})

describe('updateProfileWithReward', () => {
  test('should deduct 50 coins from profile', () => {
    const profile = createMockProfile(100)
    const reward: Reward = {
      id: 'sword-wood',
      name: '木剑',
      description: '初学者的木剑',
      category: 'sword',
      rarity: 'common',
      icon: 'test',
    }
    const newPity = createInitialPity()
    
    const updated = updateProfileWithReward(profile, reward, newPity)
    expect(updated.coins).toBe(50)
  })

  test('should add reward to owned collection', () => {
    const profile = createMockProfile(100)
    const reward: Reward = {
      id: 'sword-flame',
      name: '烈焰剑',
      description: '燃烧着永恒火焰的宝剑',
      category: 'sword',
      rarity: 'rare',
      icon: 'test',
    }
    const newPity = createInitialPity()
    
    const updated = updateProfileWithReward(profile, reward, newPity)
    expect(updated.rewards.owned.length).toBe(1)
    expect(updated.rewards.owned[0].id).toBe('sword-flame')
  })

  test('should update pity state', () => {
    const profile = createMockProfile(100)
    const reward: Reward = {
      id: 'sword-wood',
      name: '木剑',
      description: 'test',
      category: 'sword',
      rarity: 'common',
      icon: 'test',
    }
    const newPity = {
      rareCounter: 1,
      epicCounter: 1,
      legendaryCounter: 1,
    }
    
    const updated = updateProfileWithReward(profile, reward, newPity)
    expect(updated.pityState).toEqual(newPity)
  })

  test('should increment daily draw count', () => {
    const profile = createMockProfile(100, 5)
    const reward: Reward = {
      id: 'sword-wood',
      name: '木剑',
      description: 'test',
      category: 'sword',
      rarity: 'common',
      icon: 'test',
    }
    const newPity = createInitialPity()
    
    const updated = updateProfileWithReward(profile, reward, newPity)
    expect(updated.dailyDrawCount).toBe(6)
  })
})