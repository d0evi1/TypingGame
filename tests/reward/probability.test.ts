import { describe, it, expect } from 'bun:test'
import { drawReward, createInitialPity } from '../../src/utils/rewardLogic'
import type { Rarity } from '../../src/types/reward'

const EXPECTED_PROBABILITIES = {
  common: 0.60,
  rare: 0.25,
  epic: 0.10,
  legendary: 0.05,
}

const CHI_SQUARE_CRITICAL = 7.815

function calculateChiSquare(observed: Record<Rarity, number>, expected: Record<Rarity, number>): number {
  let chiSquare = 0
  const rarities: Rarity[] = ['common', 'rare', 'epic', 'legendary']
  
  for (const rarity of rarities) {
    const obs = observed[rarity]
    const exp = expected[rarity]
    
    if (exp > 0) {
      chiSquare += Math.pow(obs - exp, 2) / exp
    }
  }
  
  return chiSquare
}

describe('概率分布测试', () => {
  it('10,000次抽奖应符合预期分布', () => {
    const results: Record<Rarity, number> = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    }
    
    let pity = createInitialPity()
    const totalDraws = 10000
    
    for (let i = 0; i < totalDraws; i++) {
      const result = drawReward(pity)
      results[result.rarity]++
      pity = result.newPity
    }
    
    const expected: Record<Rarity, number> = {
      common: totalDraws * EXPECTED_PROBABILITIES.common,
      rare: totalDraws * EXPECTED_PROBABILITIES.rare,
      epic: totalDraws * EXPECTED_PROBABILITIES.epic,
      legendary: totalDraws * EXPECTED_PROBABILITIES.legendary,
    }
    
    const tolerance = totalDraws * 0.02
    
    expect(results.common).toBeGreaterThan(expected.common - tolerance)
    expect(results.common).toBeLessThan(expected.common + tolerance)
    expect(results.rare).toBeGreaterThan(expected.rare - tolerance)
    expect(results.rare).toBeLessThan(expected.rare + tolerance)
    expect(results.epic).toBeGreaterThan(expected.epic - tolerance)
    expect(results.epic).toBeLessThan(expected.epic + tolerance)
    expect(results.legendary).toBeGreaterThan(expected.legendary - tolerance)
    expect(results.legendary).toBeLessThan(expected.legendary + tolerance)
    
    const chiSquare = calculateChiSquare(results, expected)
    
    console.log('抽奖分布统计:')
    console.log(`  普通: ${results.common} (期望: ${expected.common.toFixed(0)} ± ${tolerance})`)
    console.log(`  稀有: ${results.rare} (期望: ${expected.rare.toFixed(0)} ± ${tolerance})`)
    console.log(`  史诗: ${results.epic} (期望: ${expected.epic.toFixed(0)} ± ${tolerance})`)
    console.log(`  传说: ${results.legendary} (期望: ${expected.legendary.toFixed(0)} ± ${tolerance})`)
    console.log(`  Chi-square: ${chiSquare.toFixed(2)} (临界值: ${CHI_SQUARE_CRITICAL})`)
    
    expect(chiSquare).toBeLessThan(CHI_SQUARE_CRITICAL)
  })
  
  it('保底机制应最终触发', () => {
    let pity = createInitialPity()
    
    let legendaryPityTriggered = false
    
    for (let i = 0; i < 100; i++) {
      const result = drawReward(pity)
      pity = result.newPity
      
      if (pity.legendaryCounter === 0) {
        legendaryPityTriggered = true
      }
    }
    
    expect(legendaryPityTriggered).toBe(true)
  })
  
  it('不应出现负数计数器', () => {
    let pity = createInitialPity()
    
    for (let i = 0; i < 100; i++) {
      const result = drawReward(pity)
      pity = result.newPity
      
      expect(pity.rareCounter).toBeGreaterThanOrEqual(0)
      expect(pity.epicCounter).toBeGreaterThanOrEqual(0)
      expect(pity.legendaryCounter).toBeGreaterThanOrEqual(0)
    }
  })
  
  it('保底触发后计数器应重置', () => {
    let pity = createInitialPity()
    
    for (let i = 0; i < 100; i++) {
      const result = drawReward(pity)
      pity = result.newPity
      
      expect(pity.rareCounter).toBeGreaterThanOrEqual(0)
      expect(pity.rareCounter).toBeLessThan(10)
      expect(pity.epicCounter).toBeGreaterThanOrEqual(0)
      expect(pity.epicCounter).toBeLessThan(50)
      expect(pity.legendaryCounter).toBeGreaterThanOrEqual(0)
      expect(pity.legendaryCounter).toBeLessThan(100)
    }
  })
  
  it('多次运行应保持分布稳定性', () => {
    const runs = 3
    const allResults: Array<Record<Rarity, number>> = []
    
    for (let run = 0; run < runs; run++) {
      const results: Record<Rarity, number> = {
        common: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
      }
      
      let pity = createInitialPity()
      
      for (let i = 0; i < 5000; i++) {
        const result = drawReward(pity)
        results[result.rarity]++
        pity = result.newPity
      }
      
      allResults.push(results)
    }
    
    for (const results of allResults) {
      const total = 5000
      const tolerance = total * 0.03
      
      const expected: Record<Rarity, number> = {
        common: total * EXPECTED_PROBABILITIES.common,
        rare: total * EXPECTED_PROBABILITIES.rare,
        epic: total * EXPECTED_PROBABILITIES.epic,
        legendary: total * EXPECTED_PROBABILITIES.legendary,
      }
      
      expect(results.common).toBeGreaterThan(expected.common - tolerance)
      expect(results.common).toBeLessThan(expected.common + tolerance)
      expect(results.rare).toBeGreaterThan(expected.rare - tolerance)
      expect(results.rare).toBeLessThan(expected.rare + tolerance)
      expect(results.epic).toBeGreaterThan(expected.epic - tolerance)
      expect(results.epic).toBeLessThan(expected.epic + tolerance)
      expect(results.legendary).toBeGreaterThan(expected.legendary - tolerance)
      expect(results.legendary).toBeLessThan(expected.legendary + tolerance)
    }
  })
})