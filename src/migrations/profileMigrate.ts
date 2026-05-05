export interface MigrationResult {
  [key: string]: any;
}

// Migrates a legacy Profile object to the new structure by adding default fields.
export function migrateProfile(oldProfile: any): MigrationResult {
  const migrated: any = { ...oldProfile };

  // Add new fields with default values if they don't exist
  if (!Object.prototype.hasOwnProperty.call(migrated, 'coins')) {
    migrated.coins = 0;
  }
  if (!Object.prototype.hasOwnProperty.call(migrated, 'totalCoinsEarned')) {
    migrated.totalCoinsEarned = 0;
  }
  if (!Object.prototype.hasOwnProperty.call(migrated, 'rewards')) {
    migrated.rewards = { owned: [], equipped: {} };
  }
  if (!Object.prototype.hasOwnProperty.call(migrated, 'pityState')) {
    migrated.pityState = { rareCounter: 0, epicCounter: 0, legendaryCounter: 0 };
  }
  if (!Object.prototype.hasOwnProperty.call(migrated, 'lastDrawDate')) {
    migrated.lastDrawDate = undefined;
  }
  return migrated;
}
