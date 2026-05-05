/**
 * Reward drawing logic with pity system
 * 
 * Probability distribution:
 * - Common: 60%
 * - Rare: 25%
 * - Epic: 10%
 * - Legendary: 5%
 * 
 * Pity thresholds (guaranteed rewards):
 * - Rare: 10 draws
 * - Epic: 50 draws
 * - Legendary: 100 draws
 */

import type { PityState, Rarity } from '../types/reward'

export const PITY_THRESHOLDS = {
  rare: 10,
  epic: 50,
  legendary: 100,
} as const

const PROB_THRESHOLDS = {
  legendary: 5,
  epic: 15,
  rare: 40,
} as const

export function createInitialPity(): PityState {
  return {
    rareCounter: 0,
    epicCounter: 0,
    legendaryCounter: 0,
  }
}

function resetAll(): PityState {
  return createInitialPity()
}

function updateForEpic(pity: PityState): PityState {
  return {
    rareCounter: 0,
    epicCounter: 0,
    legendaryCounter: pity.legendaryCounter + 1,
  }
}

function updateForRare(pity: PityState): PityState {
  return {
    rareCounter: 0,
    epicCounter: pity.epicCounter + 1,
    legendaryCounter: pity.legendaryCounter + 1,
  }
}

function updateForCommon(pity: PityState): PityState {
  return {
    rareCounter: pity.rareCounter + 1,
    epicCounter: pity.epicCounter + 1,
    legendaryCounter: pity.legendaryCounter + 1,
  }
}

export function drawReward(pity: PityState): { rarity: Rarity; newPity: PityState } {
  if (pity.legendaryCounter >= PITY_THRESHOLDS.legendary - 1) {
    return { rarity: 'legendary', newPity: resetAll() }
  }
  
  if (pity.epicCounter >= PITY_THRESHOLDS.epic - 1) {
    return { rarity: 'epic', newPity: updateForEpic(pity) }
  }
  
  if (pity.rareCounter >= PITY_THRESHOLDS.rare - 1) {
    return { rarity: 'rare', newPity: updateForRare(pity) }
  }
  
  const roll = Math.random() * 100
  
  if (roll < PROB_THRESHOLDS.legendary) {
    return { rarity: 'legendary', newPity: resetAll() }
  }
  
  if (roll < PROB_THRESHOLDS.epic) {
    return { rarity: 'epic', newPity: updateForEpic(pity) }
  }
  
  if (roll < PROB_THRESHOLDS.rare) {
    return { rarity: 'rare', newPity: updateForRare(pity) }
  }
  
  return { rarity: 'common', newPity: updateForCommon(pity) }
}

export function getRarityColor(rarity: Rarity): string {
  const colors: Record<Rarity, string> = {
    common: '#9CA3AF',
    rare: '#3B82F6',
    epic: '#A855F7',
    legendary: '#F59E0B',
  }
  return colors[rarity]
}

export function getRarityName(rarity: Rarity): string {
  const names: Record<Rarity, string> = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说',
  }
  return names[rarity]
}

export function getPityProgress(pity: PityState): {
  rare: { current: number; target: number }
  epic: { current: number; target: number }
  legendary: { current: number; target: number }
} {
  return {
    rare: { current: pity.rareCounter, target: PITY_THRESHOLDS.rare },
    epic: { current: pity.epicCounter, target: PITY_THRESHOLDS.epic },
    legendary: { current: pity.legendaryCounter, target: PITY_THRESHOLDS.legendary },
  }
}
