// stores/slices/auth-slice.ts
import { StateCreator } from 'zustand'
import { authEndpoints } from '../api/endpoints'
import { User, AuthState } from '../types'

export const createAuthSlice: StateCreator<AuthState> = (set, get) => ({
    user: null,
    isLoading: false,
    error: null,

    initializeAuth: async () => {
        set({ isLoading: true, error: null })
        try {
            const { user } = await authEndpoints.getCurrentUser()
            set({ user, isLoading: false })
            return user
        } catch (error) {
            set({ error: 'Failed to authenticate', isLoading: false })
            return null
        }
    },

    updateUser: (updates: Partial<User>) => {
        const { user } = get()
        if (user) {
            set({ user: { ...user, ...updates } })
        }
    },

    logout: async () => {
        try {
            await authEndpoints.logout()
        } catch (error) {
            console.error('Logout API call failed:', error)
        } finally {
            set({
                user: null,
                isLoading: false,
                error: null
            })
        }
    },
})