import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, UserSettings } from '../types'

interface GameStore {
  currentProfileId: string | null
  profiles: Profile[]
  settings: UserSettings
  
  setCurrentProfile: (id: string | null) => void
  addProfile: (profile: Profile) => void
  updateProfile: (id: string, updates: Partial<Profile>) => void
  deleteProfile: (id: string) => void
  
  updateSettings: (settings: Partial<UserSettings>) => void
}

const defaultSettings: UserSettings = {
  soundEnabled: true,
  musicEnabled: true,
  keyboardLayout: 'QWERTY',
  theme: 'dark',
  fontSize: 'medium',
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      currentProfileId: null,
      profiles: [],
      settings: defaultSettings,
      
      setCurrentProfile: (id) => set({ currentProfileId: id }),
      
      addProfile: (profile) => set((state) => ({
        profiles: [...state.profiles, profile],
        currentProfileId: state.currentProfileId || profile.id,
      })),
      
      updateProfile: (id, updates) => set((state) => ({
        profiles: state.profiles.map(p => 
          p.id === id ? { ...p, ...updates } : p
        ),
      })),
      
      deleteProfile: (id) => set((state) => {
        const newProfiles = state.profiles.filter(p => p.id !== id)
        return {
          profiles: newProfiles,
          currentProfileId: state.currentProfileId === id 
            ? (newProfiles[0]?.id || null) 
            : state.currentProfileId,
        }
      }),
      
      updateSettings: (settings) => set((state) => ({
        settings: { ...state.settings, ...settings },
      })),
    }),
    {
      name: 'typing-game-storage',
    }
  )
)

export function useCurrentProfile() {
  const { currentProfileId, profiles } = useGameStore()
  return profiles.find(p => p.id === currentProfileId) || null
}
