// hooks/useAuth.ts
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
    user: any | null
    setUser: (user: any) => void
    clearUser: () => void
    syncWithSessionStorage: () => void
}

export const useAuth = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            setUser: (user) => {
                set({ user })
                // Sync with sessionStorage for client-side persistence
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('user', JSON.stringify(user))
                }
            },
            clearUser: () => {
                set({ user: null })
                if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('user')
                }
            },
            syncWithSessionStorage: () => {
                if (typeof window !== 'undefined') {
                    const storedUser = sessionStorage.getItem('user')
                    if (storedUser) {
                        set({ user: JSON.parse(storedUser) })
                    }
                }
            }
        }),
        {
            name: 'auth-storage',
        }
    )
)