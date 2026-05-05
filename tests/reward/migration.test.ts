import { migrateProfile } from '../../src/migrations/profileMigrate';
import { test, expect } from 'bun:test';

// Test migration from old Profile structure (without coins, rewards, pityState, etc.)
test('migrate old Profile to new structure with default values', () => {
  const oldProfile: any = {
    id: 'profile-123',
    name: 'Test User',
    avatar: '🚀',
    createdAt: new Date(),
    totalPracticeTime: 100,
    totalKeystrokes: 1000,
    averageWPM: 50,
    averageAccuracy: 85,
    highestWPM: 80,
    currentLevel: 5,
    experience: 450,
    unlockedCourses: ['course-basics'],
    achievements: [],
    streak: 3,
    lastPracticeDate: null
  };

  const migrated = migrateProfile(oldProfile);

  // New fields should be present with default values
  expect(migrated).toHaveProperty('coins', 0);
  expect(migrated).toHaveProperty('totalCoinsEarned', 0);
  expect(migrated).toHaveProperty('rewards');
  expect(migrated).toHaveProperty('pityState');
  expect(migrated).toHaveProperty('lastDrawDate');

  // Old fields should remain unchanged
  expect(migrated.id).toBe(oldProfile.id);
  expect(migrated.name).toBe(oldProfile.name);
  expect(migrated.avatar).toBe(oldProfile.avatar);
  expect(migrated.totalPracticeTime).toBe(oldProfile.totalPracticeTime);
  expect(migrated.totalKeystrokes).toBe(oldProfile.totalKeystrokes);
  expect(migrated.experience).toBe(oldProfile.experience);
  expect(migrated.unlockedCourses).toEqual(oldProfile.unlockedCourses);
  expect(migrated.achievements).toEqual(oldProfile.achievements);
  expect(migrated.streak).toBe(oldProfile.streak);
  expect(migrated.lastPracticeDate).toBe(oldProfile.lastPracticeDate);
});
