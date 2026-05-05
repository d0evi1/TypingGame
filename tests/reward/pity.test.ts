import { describe, test, expect } from 'bun:test'
import { drawReward, PITY_THRESHOLDS, createInitialPity } from '../../src/utils/rewardLogic'
import type { PityState } from '../../src/types/reward'

describe('保底机制测试', () => {
  describe('稀有保底 (第10次)', () => {
    test('第10次必出稀有', () => {
      const pity: PityState = { 
        rareCounter: 9, 
        epicCounter: 5, 
        legendaryCounter: 3 
      }
      const result = drawReward(pity)
      
      expect(result.rarity).toBe('rare')
      // 稀有保底触发后: rareCounter重置为0, epicCounter和legendaryCounter各+1
      expect(result.newPity.rareCounter).toBe(0)
      expect(result.newPity.epicCounter).toBe(6)
      expect(result.newPity.legendaryCounter).toBe(4)
    })

    test('第9次抽取不会触发稀有保底', () => {
      const pity: PityState = { 
        rareCounter: 8, 
        epicCounter: 5, 
        legendaryCounter: 3 
      }
      // 使用mock确保随机抽到common来验证保底未触发
      const originalRandom = Math.random
      Math.random = () => 0.99 // 确保抽到common
      
      const result = drawReward(pity)
      
      // 由于未触发保底，应该按概率抽取
      // 抽到common时所有计数器+1
      expect(result.newPity.rareCounter).toBe(9)
      expect(result.newPity.epicCounter).toBe(6)
      expect(result.newPity.legendaryCounter).toBe(4)
      
      Math.random = originalRandom
    })

    test('稀有保底触发后计数器正确重置', () => {
      const pity: PityState = { 
        rareCounter: PITY_THRESHOLDS.rare - 1,
        epicCounter: 20, 
        legendaryCounter: 30 
      }
      const result = drawReward(pity)
      
      expect(result.rarity).toBe('rare')
      expect(result.newPity.rareCounter).toBe(0)
    })
  })

  describe('史诗保底 (第50次)', () => {
    test('第50次必出史诗', () => {
      const pity: PityState = { 
        rareCounter: 20, 
        epicCounter: 49, 
        legendaryCounter: 30 
      }
      const result = drawReward(pity)
      
      expect(result.rarity).toBe('epic')
      // 史诗保底触发后: rareCounter和epicCounter重置为0, legendaryCounter+1
      expect(result.newPity.rareCounter).toBe(0)
      expect(result.newPity.epicCounter).toBe(0)
      expect(result.newPity.legendaryCounter).toBe(31)
    })

    test('第49次抽取不会触发史诗保底', () => {
      const pity: PityState = { 
        rareCounter: 5, 
        epicCounter: 48, 
        legendaryCounter: 30 
      }
      const originalRandom = Math.random
      Math.random = () => 0.99 // 确保抽到common
      
      const result = drawReward(pity)
      
      expect(result.newPity.epicCounter).toBe(49)
      
      Math.random = originalRandom
    })

    test('史诗保底触发后计数器正确重置', () => {
      const pity: PityState = { 
        rareCounter: 25, 
        epicCounter: PITY_THRESHOLDS.epic - 1,
        legendaryCounter: 60 
      }
      const result = drawReward(pity)
      
      expect(result.rarity).toBe('epic')
      expect(result.newPity.epicCounter).toBe(0)
      expect(result.newPity.rareCounter).toBe(0)
    })
  })

  describe('传说保底 (第100次)', () => {
    test('第100次必出传说', () => {
      const pity: PityState = { 
        rareCounter: 99, 
        epicCounter: 99, 
        legendaryCounter: 99 
      }
      const result = drawReward(pity)
      
      expect(result.rarity).toBe('legendary')
      // 传说保底触发后: 所有计数器重置为0
      expect(result.newPity.rareCounter).toBe(0)
      expect(result.newPity.epicCounter).toBe(0)
      expect(result.newPity.legendaryCounter).toBe(0)
    })

    test('第99次抽取不会触发传说保底', () => {
      const pity: PityState = { 
        rareCounter: 5, 
        epicCounter: 10, 
        legendaryCounter: 98 
      }
      const originalRandom = Math.random
      Math.random = () => 0.99 // 确保抽到common
      
      const result = drawReward(pity)
      
      expect(result.newPity.legendaryCounter).toBe(99)
      
      Math.random = originalRandom
    })

    test('传说保底触发后计数器完全重置', () => {
      const pity: PityState = { 
        rareCounter: 50, 
        epicCounter: 80, 
        legendaryCounter: PITY_THRESHOLDS.legendary - 1
      }
      const result = drawReward(pity)
      
      expect(result.rarity).toBe('legendary')
      expect(result.newPity).toEqual(createInitialPity())
    })
  })

  describe('保底优先级测试', () => {
    test('传说保底优先级高于史诗和稀有', () => {
      // 当多个保底都满足时，传说优先
      const pity: PityState = { 
        rareCounter: 9, 
        epicCounter: 49, 
        legendaryCounter: 99 
      }
      const result = drawReward(pity)
      
      expect(result.rarity).toBe('legendary')
      expect(result.newPity).toEqual(createInitialPity())
    })

    test('史诗保底优先级高于稀有', () => {
      // 当史诗和稀有保底同时满足时，史诗优先
      const pity: PityState = { 
        rareCounter: 9, 
        epicCounter: 49, 
        legendaryCounter: 30 
      }
      const result = drawReward(pity)
      
      expect(result.rarity).toBe('epic')
      expect(result.newPity.rareCounter).toBe(0)
      expect(result.newPity.epicCounter).toBe(0)
    })
  })

  describe('保底阈值常量验证', () => {
    test('保底阈值应与设计一致', () => {
      expect(PITY_THRESHOLDS.rare).toBe(10)
      expect(PITY_THRESHOLDS.epic).toBe(50)
      expect(PITY_THRESHOLDS.legendary).toBe(100)
    })
  })

  describe('保底重置逻辑', () => {
    test('正常抽取common时计数器递增', () => {
      const pity: PityState = { 
        rareCounter: 0, 
        epicCounter: 0, 
        legendaryCounter: 0 
      }
      const originalRandom = Math.random
      Math.random = () => 0.99 // 确保抽到common (>40)
      
      const result = drawReward(pity)
      
      expect(result.rarity).toBe('common')
      expect(result.newPity.rareCounter).toBe(1)
      expect(result.newPity.epicCounter).toBe(1)
      expect(result.newPity.legendaryCounter).toBe(1)
      
      Math.random = originalRandom
    })

    test('随机抽到稀有时正确更新计数器', () => {
      const pity: PityState = { 
        rareCounter: 5, 
        epicCounter: 10, 
        legendaryCounter: 20 
      }
      const originalRandom = Math.random
      // 稀有概率: 15-40 (根据PROB_THRESHOLDS)
      Math.random = () => 0.25 // 在稀有范围内
      
      const result = drawReward(pity)
      
      expect(result.rarity).toBe('rare')
      expect(result.newPity.rareCounter).toBe(0)
      expect(result.newPity.epicCounter).toBe(11)
      expect(result.newPity.legendaryCounter).toBe(21)
      
      Math.random = originalRandom
    })

    test('随机抽到史诗时正确更新计数器', () => {
      const pity: PityState = { 
        rareCounter: 5, 
        epicCounter: 10, 
        legendaryCounter: 20 
      }
      const originalRandom = Math.random
      // 史诗概率: 5-15
      Math.random = () => 0.10 // 在史诗范围内
      
      const result = drawReward(pity)
      
      expect(result.rarity).toBe('epic')
      expect(result.newPity.rareCounter).toBe(0)
      expect(result.newPity.epicCounter).toBe(0)
      expect(result.newPity.legendaryCounter).toBe(21)
      
      Math.random = originalRandom
    })

    test('随机抽到传说时正确重置所有计数器', () => {
      const pity: PityState = { 
        rareCounter: 5, 
        epicCounter: 10, 
        legendaryCounter: 20 
      }
      const originalRandom = Math.random
      // 传说概率: 0-5
      Math.random = () => 0.01 // 在传说范围内
      
      const result = drawReward(pity)
      
      expect(result.rarity).toBe('legendary')
      expect(result.newPity).toEqual(createInitialPity())
      
      Math.random = originalRandom
    })
  })
})
