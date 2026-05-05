import Dexie from 'dexie';
import type { Profile } from '../types';

/**
 * RewardDatabase - Dexie wrapper for storing user reward profiles
 * - Stores: profiles table with fields defined in Profile
 * - IndexedDB-based storage (not localStorage)
 * - Includes a storage quota check to prevent excessive usage
 */
class RewardDatabase extends Dexie {
  profiles!: Dexie.Table<Profile, string>;

  constructor() {
    super('TypingGameRewards');
    this.version(1).stores({
      profiles: 'id, name, createdAt'
    });
  }

  // Checks storage quota availability. Returns true if within quota or estimation unavailable.
  async checkStorageQuota(): Promise<boolean> {
    // Use the Storage Manager API if available
    try {
      const storageObj: any = (navigator as any).storage;
      if (storageObj && typeof storageObj.estimate === 'function') {
        const estimate = await storageObj.estimate();
        const usedMB = ((estimate.usage ?? 0) / 1024) / 1024;
        const quotaMB = ((estimate.quota ?? 0) / 1024) / 1024;
        if (quotaMB <= 0) return true;
        return (usedMB / quotaMB) < 0.8;
      }
    } catch {
      // If estimation fails for any reason, fall back to allowing storage
      // to avoid blocking the app unnecessarily.
      return true;
    }
    // If storage estimate is not supported, allow by default
    return true;
  }
}

// Export a singleton instance for convenience
const rewardDb = new RewardDatabase();

export { RewardDatabase, rewardDb };
export default rewardDb;
