/**
 * Reward definitions for the typing game.
 * Contains 55 rewards across 5 categories with varying rarities.
 */

import type { Reward, Rarity, RewardCategory } from '../types/reward'

// ============================================================================
// 圣剑类 (Swords) - 12 items: 5 common, 3 rare, 2 epic, 2 legendary
// ============================================================================

const swords: Reward[] = [
  // 普通 (5)
  {
    id: 'sword-wood',
    name: '木剑',
    description: '初学者的木剑，手感轻盈',
    category: 'sword',
    rarity: 'common',
    icon: 'M12 2L4 10l1 1 7-7 7 7 1-1L12 2z M11 10v10h2V10z',
  },
  {
    id: 'sword-iron',
    name: '铁剑',
    description: '坚固的铁制长剑',
    category: 'sword',
    rarity: 'common',
    icon: 'M12 2L3 11l9 9 9-9L12 2z M11 11v9h2v-9z',
  },
  {
    id: 'sword-bronze',
    name: '青铜剑',
    description: '古老的青铜短剑',
    category: 'sword',
    rarity: 'common',
    icon: 'M12 3L5 10l7 7 7-7L12 3z M11 10v8h2v-8z',
  },
  {
    id: 'sword-steel',
    name: '钢剑',
    description: '精钢锻造的利剑',
    category: 'sword',
    rarity: 'common',
    icon: 'M12 1L2 11l10 10 10-10L12 1z M11 11v10h2V11z',
  },
  {
    id: 'sword-training',
    name: '练习剑',
    description: '用于练习的钝剑',
    category: 'sword',
    rarity: 'common',
    icon: 'M12 4L6 10l6 6 6-6L12 4z M11 10v6h2v-6z',
  },
  // 稀有 (3)
  {
    id: 'sword-flame',
    name: '烈焰剑',
    description: '燃烧着永恒火焰的宝剑',
    category: 'sword',
    rarity: 'rare',
    icon: 'M12 1L2 11l10 10 10-10L12 1z M11 11v10h2V11z M7 7l2-2M15 5l2 2M9 17l2 2M15 17l-2 2',
  },
  {
    id: 'sword-frost',
    name: '冰霜剑',
    description: '散发着寒气的冰晶之剑',
    category: 'sword',
    rarity: 'rare',
    icon: 'M12 2L3 11l9 9 9-9L12 2z M11 11v9h2v-9z M8 6l4-2M16 6l-4-2',
  },
  {
    id: 'sword-thunder',
    name: '雷鸣剑',
    description: '蕴含雷电之力的神剑',
    category: 'sword',
    rarity: 'rare',
    icon: 'M12 2L4 10l8 8 8-8L12 2z M11 10v8h2v-8z M12 0v4M12 18v4',
  },
  // 史诗 (2)
  {
    id: 'sword-dragon',
    name: '龙牙剑',
    description: '用远古巨龙之牙铸造的传奇武器',
    category: 'sword',
    rarity: 'epic',
    icon: 'M12 1L2 11l10 10 10-10L12 1z M11 11v10h2V11z M8 8c2-2 6-2 8 0M8 14c2 2 6 2 8 0',
  },
  {
    id: 'sword-phoenix',
    name: '凤羽剑',
    description: '凤凰涅槃后留下的神剑',
    category: 'sword',
    rarity: 'epic',
    icon: 'M12 2L3 11l9 9 9-9L12 2z M11 11v9h2v-9z M6 4l2 3M18 4l-2 3M6 18l2-3M18 18l-2-3',
  },
  // 传说 (2)
  {
    id: 'sword-excalibur',
    name: '王者之剑',
    description: '传说中的圣剑，只有真正的勇者才能驾驭',
    category: 'sword',
    rarity: 'legendary',
    icon: 'M12 0L1 11l11 11 11-11L12 0z M11 11v11h2V11z M12 4l-3 3M12 4l3 3 M5 5h2M17 5h2M5 17h2M17 17h2',
  },
  {
    id: 'sword-void',
    name: '虚空之剑',
    description: '来自异次元的神秘之剑，可以撕裂空间',
    category: 'sword',
    rarity: 'legendary',
    icon: 'M12 2L2 12l10 10 10-10L12 2z M11 11v10h2V11z M12 0v4M0 12h4M20 12h4M12 20v4',
  },
]

// ============================================================================
// 权杖类 (Staffs) - 11 items: 4 common, 3 rare, 2 epic, 2 legendary
// ============================================================================

const staffs: Reward[] = [
  // 普通 (4)
  {
    id: 'staff-oak',
    name: '橡木杖',
    description: '用古老橡木制成的法杖',
    category: 'staff',
    rarity: 'common',
    icon: 'M12 2v18M10 20h4M8 6h8M6 10h12',
  },
  {
    id: 'staff-crystal',
    name: '水晶杖',
    description: '顶端镶嵌水晶的魔法杖',
    category: 'staff',
    rarity: 'common',
    icon: 'M12 4v14M10 18h4M12 2l-2 2h4l-2-2z',
  },
  {
    id: 'staff-apprentice',
    name: '学徒杖',
    description: '魔法学徒的标准装备',
    category: 'staff',
    rarity: 'common',
    icon: 'M12 3v15M10 18h4M8 8h8M6 12h12',
  },
  {
    id: 'staff-elder',
    name: '长老杖',
    description: '村庄长老使用的法杖',
    category: 'staff',
    rarity: 'common',
    icon: 'M12 2v16M10 18h4M10 6h4M8 10h8',
  },
  // 稀有 (3)
  {
    id: 'staff-moonlight',
    name: '月光杖',
    description: '沐浴满月光芒的法杖',
    category: 'staff',
    rarity: 'rare',
    icon: 'M12 2v16M10 18h4M12 4c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4z',
  },
  {
    id: 'staff-storm',
    name: '风暴杖',
    description: '掌控风暴之力的法杖',
    category: 'staff',
    rarity: 'rare',
    icon: 'M12 2v16M10 18h4M8 4l8 8M16 4l-8 8',
  },
  {
    id: 'staff-nature',
    name: '自然杖',
    description: '蕴含大自然力量的法杖',
    category: 'staff',
    rarity: 'rare',
    icon: 'M12 2v16M10 18h4M8 6c4 2 8 2 8-2M6 10c6 2 12 2 12-2',
  },
  // 史诗 (2)
  {
    id: 'staff-archmage',
    name: '大法师杖',
    description: '大法师专属的传奇法杖',
    category: 'staff',
    rarity: 'epic',
    icon: 'M12 2v16M10 18h4M12 0l-3 3h6l-3-3zM8 6h8M6 10h12M4 14h16',
  },
  {
    id: 'staff-dragon',
    name: '龙骨杖',
    description: '用远古巨龙骨骼制成的法杖',
    category: 'staff',
    rarity: 'epic',
    icon: 'M12 2v16M10 18h4M12 0v2M6 8l3 3-3 3M18 8l-3 3 3 3',
  },
  // 传说 (2)
  {
    id: 'staff-eternity',
    name: '永恒之杖',
    description: '蕴含时间之力的不朽法杖',
    category: 'staff',
    rarity: 'legendary',
    icon: 'M12 2v16M10 18h4M12 0l-2 2h4l-2-2z M12 8m-6 0a6 6 0 1 0 12 0 6 6 0 1 0-12 0z M12 8m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0z',
  },
  {
    id: 'staff-cosmos',
    name: '宇宙之杖',
    description: '可以操控星辰之力的至高法杖',
    category: 'staff',
    rarity: 'legendary',
    icon: 'M12 2v16M10 18h4M12 4m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0z M6 6l2 2M18 6l-2 2M6 14l2-2M18 14l-2-2',
  },
]

// ============================================================================
// 盔甲类 (Armors) - 11 items: 4 common, 3 rare, 2 epic, 2 legendary
// ============================================================================

const armors: Reward[] = [
  // 普通 (4)
  {
    id: 'armor-leather',
    name: '皮甲',
    description: '轻便的皮革护甲',
    category: 'armor',
    rarity: 'common',
    icon: 'M12 2L6 6v8l6 4 6-4V6l-6-4z M8 8h8v4H8z',
  },
  {
    id: 'armor-chain',
    name: '锁子甲',
    description: '用铁环编织的护甲',
    category: 'armor',
    rarity: 'common',
    icon: 'M12 3L5 7v8l7 4 7-4V7l-7-4z M7 9h10M7 13h10',
  },
  {
    id: 'armor-iron',
    name: '铁甲',
    description: '坚固的铁制护甲',
    category: 'armor',
    rarity: 'common',
    icon: 'M12 2L4 7v8l8 5 8-5V7l-8-5z M8 9h8v4H8z',
  },
  {
    id: 'armor-cloth',
    name: '布甲',
    description: '魔法师常穿的轻便护甲',
    category: 'armor',
    rarity: 'common',
    icon: 'M12 4L6 8v6l6 4 6-4V8l-6-4z M10 10h4v2h-4z',
  },
  // 稀有 (3)
  {
    id: 'armor-mithril',
    name: '秘银甲',
    description: '用传说中的秘银锻造的轻甲',
    category: 'armor',
    rarity: 'rare',
    icon: 'M12 2L4 7v8l8 5 8-5V7l-8-5z M8 8h8v4H8z M12 8v6',
  },
  {
    id: 'armor-flame',
    name: '烈焰甲',
    description: '可以抵御火焰的护甲',
    category: 'armor',
    rarity: 'rare',
    icon: 'M12 2L4 7v8l8 5 8-5V7l-8-5z M8 8h8v4H8z M6 10l2 2M18 10l-2 2',
  },
  {
    id: 'armor-frost',
    name: '冰霜甲',
    description: '散发着寒气的护甲',
    category: 'armor',
    rarity: 'rare',
    icon: 'M12 3L5 8v6l7 5 7-5V8l-7-5z M8 10h8M8 12h8',
  },
  // 史诗 (2)
  {
    id: 'armor-dragon',
    name: '龙鳞甲',
    description: '用龙鳞制成的坚不可摧的护甲',
    category: 'armor',
    rarity: 'epic',
    icon: 'M12 2L3 8v8l9 4 9-4V8l-9-6z M6 10h12v2H6z M8 13h8M10 7h4',
  },
  {
    id: 'armor-titan',
    name: '泰坦甲',
    description: '远古泰坦留下的神甲',
    category: 'armor',
    rarity: 'epic',
    icon: 'M12 1L2 8v8l10 5 10-5V8L12 1z M6 9h12v4H6z M8 13h8M10 5h4',
  },
  // 传说 (2)
  {
    id: 'armor-divine',
    name: '神圣之甲',
    description: '众神赐予的神圣护甲',
    category: 'armor',
    rarity: 'legendary',
    icon: 'M12 0L2 8v8l10 6 10-6V8L12 0z M6 9h12v4H6z M8 13h8M10 5h4 M12 0v4',
  },
  {
    id: 'armor-void',
    name: '虚空之甲',
    description: '可以扭曲空间的神秘护甲',
    category: 'armor',
    rarity: 'legendary',
    icon: 'M12 2L1 9v6l11 7 11-7V9L12 2z M5 10h14v2H5z M7 13h10M10 6h4',
  },
]

// ============================================================================
// 坐骑类 (Mounts) - 11 items: 4 common, 3 rare, 2 epic, 2 legendary
// ============================================================================

const mounts: Reward[] = [
  // 普通 (4)
  {
    id: 'mount-pony',
    name: '小马',
    description: '温顺的小马驹',
    category: 'mount',
    rarity: 'common',
    icon: 'M4 12c0-4 4-8 8-8s8 4 8 8M6 16h12M8 20h8M10 12v4M14 12v4',
  },
  {
    id: 'mount-donkey',
    name: '毛驴',
    description: '勤劳的毛驴',
    category: 'mount',
    rarity: 'common',
    icon: 'M6 14c0-4 3-6 6-6s6 2 6 6M8 18h8M10 22h4M12 14v4',
  },
  {
    id: 'mount-ox',
    name: '老牛',
    description: '力气很大的老黄牛',
    category: 'mount',
    rarity: 'common',
    icon: 'M4 14c0-4 4-6 8-6s8 2 8 6M6 18h12M10 22h4M12 14v4M8 10l-2-2M16 10l2-2',
  },
  {
    id: 'mount-goat',
    name: '山羊',
    description: '擅长攀岩的山羊',
    category: 'mount',
    rarity: 'common',
    icon: 'M6 14c0-4 3-6 6-6s6 2 6 6M8 18h8M10 22h4M12 14v4M8 10l2 2M16 10l-2 2',
  },
  // 稀有 (3)
  {
    id: 'mount-unicorn',
    name: '独角兽',
    description: '传说中的神奇生物',
    category: 'mount',
    rarity: 'rare',
    icon: 'M4 12c0-4 4-8 8-8s8 4 8 8M6 16h12M10 20h4M12 12v4M12 4l-2-4M10 2h4',
  },
  {
    id: 'mount-wolf',
    name: '战狼',
    description: '凶猛的战狼坐骑',
    category: 'mount',
    rarity: 'rare',
    icon: 'M2 14l4-2 6 2 6-2 4 2M6 18h12M10 22h4M8 12l-2-4M16 12l2-4',
  },
  {
    id: 'mount-eagle',
    name: '巨鹰',
    description: '可以飞行的巨鹰',
    category: 'mount',
    rarity: 'rare',
    icon: 'M12 8L4 16h6l2 4 2-4h6L12 8z M12 16v4M8 12l-4 4M16 12l4 4',
  },
  // 史诗 (2)
  {
    id: 'mount-dragon',
    name: '飞龙',
    description: '传说中的龙族坐骑',
    category: 'mount',
    rarity: 'epic',
    icon: 'M12 6L2 14l10 4 10-4L12 6z M12 14v6M6 12l-4 2M18 12l4 2M10 4l2 2 2-2',
  },
  {
    id: 'mount-phoenix',
    name: '凤凰',
    description: '浴火重生的神鸟',
    category: 'mount',
    rarity: 'epic',
    icon: 'M12 8L4 16h16L12 8z M12 14v6M8 12l-4 4M16 12l4 4M12 2l-2 4M12 2l2 4',
  },
  // 传说 (2)
  {
    id: 'mount-pegasus',
    name: '天马',
    description: '拥有翅膀的神马',
    category: 'mount',
    rarity: 'legendary',
    icon: 'M4 12c0-4 4-8 8-8s8 4 8 8M6 16h12M10 20h4M12 12v4M4 8l4 4M20 8l-4 4M2 6l4 2M22 6l-4 2',
  },
  {
    id: 'mount-nightmare',
    name: '梦魇兽',
    description: '来自异界的黑暗坐骑',
    category: 'mount',
    rarity: 'legendary',
    icon: 'M2 14l6-4 4 4 4-4 6 4M8 18h8M12 18v4M6 10l-2-6M18 10l2-6M10 6l2-4M14 6l-2-4',
  },
]

// ============================================================================
// 盾牌类 (Shields) - 10 items: 4 common, 2 rare, 2 epic, 2 legendary
// ============================================================================

const shields: Reward[] = [
  // 普通 (4)
  {
    id: 'shield-wood',
    name: '木盾',
    description: '简单的木制盾牌',
    category: 'shield',
    rarity: 'common',
    icon: 'M12 3L4 8v8l8 5 8-5V8l-8-5z',
  },
  {
    id: 'shield-iron',
    name: '铁盾',
    description: '坚固的铁制盾牌',
    category: 'shield',
    rarity: 'common',
    icon: 'M12 2L3 8v8l9 6 9-6V8l-9-6z M8 10h8v4H8z',
  },
  {
    id: 'shield-round',
    name: '圆盾',
    description: '轻便的圆形盾牌',
    category: 'shield',
    rarity: 'common',
    icon: 'M12 4m-8 0a8 8 0 1 0 16 0 8 8 0 1 0-16 0z M12 4m-4 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0z',
  },
  {
    id: 'shield-buckler',
    name: '小圆盾',
    description: '用于格挡的小盾牌',
    category: 'shield',
    rarity: 'common',
    icon: 'M12 6m-6 0a6 6 0 1 0 12 0 6 6 0 1 0-12 0z M12 6m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0z',
  },
  // 稀有 (2)
  {
    id: 'shield-kite',
    name: '鸢盾',
    description: '骑士专用的鸢形盾牌',
    category: 'shield',
    rarity: 'rare',
    icon: 'M12 2L4 6v10l8 6 8-6V6l-8-4z M8 8h8v6H8z',
  },
  {
    id: 'shield-tower',
    name: '塔盾',
    description: '可以提供全身防护的巨型盾牌',
    category: 'shield',
    rarity: 'rare',
    icon: 'M12 1L3 6v12l9 5 9-5V6l-9-5z M6 9h12v8H6z',
  },
  // 史诗 (2)
  {
    id: 'shield-dragon',
    name: '龙鳞盾',
    description: '用龙鳞制成的坚固盾牌',
    category: 'shield',
    rarity: 'epic',
    icon: 'M12 2L2 8v8l10 6 10-6V8L12 2z M6 10h12v4H6z M10 12v4M14 12v4',
  },
  {
    id: 'shield-runic',
    name: '符文盾',
    description: '刻有神秘符文的魔法盾牌',
    category: 'shield',
    rarity: 'epic',
    icon: 'M12 2L3 8v8l9 6 9-6V8l-9-6z M8 10h8v4H8z M10 8v8M14 8v8',
  },
  // 传说 (2)
  {
    id: 'shield-aegis',
    name: '神盾埃癸斯',
    description: '众神之王赐予的神圣盾牌',
    category: 'shield',
    rarity: 'legendary',
    icon: 'M12 0L1 8v8l11 8 11-8V8L12 0z M6 10h12v4H6z M12 4v16M6 12h12',
  },
  {
    id: 'shield-void',
    name: '虚空之盾',
    description: '可以吸收一切攻击的神秘盾牌',
    category: 'shield',
    rarity: 'legendary',
    icon: 'M12 1L2 9v6l10 8 10-8V9L12 1z M6 11h12v2H6z M12 1v22M2 12h20',
  },
]

// ============================================================================
// Export all rewards and helper functions
// ============================================================================

/**
 * All rewards in the game (55 total)
 */
export const allRewards: Reward[] = [...swords, ...staffs, ...armors, ...mounts, ...shields]

/**
 * Get rewards filtered by category
 */
export function getRewardsByCategory(category: RewardCategory): Reward[] {
  return allRewards.filter((reward) => reward.category === category)
}

/**
 * Get rewards filtered by rarity
 */
export function getRewardsByRarity(rarity: Rarity): Reward[] {
  return allRewards.filter((reward) => reward.rarity === rarity)
}

/**
 * Get a reward by its ID
 */
export function getRewardById(id: string): Reward | undefined {
  return allRewards.find((reward) => reward.id === id)
}

/**
 * Get reward count by category and rarity
 */
export function getRewardCount(category?: RewardCategory, rarity?: Rarity): number {
  return allRewards.filter((reward) => {
    const categoryMatch = !category || reward.category === category
    const rarityMatch = !rarity || reward.rarity === rarity
    return categoryMatch && rarityMatch
  }).length
}
