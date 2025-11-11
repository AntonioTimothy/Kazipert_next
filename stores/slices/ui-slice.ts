import { StateCreator } from 'zustand'
import { UIState } from '../types'

export const createUISlice: StateCreator<UIState> = (set) => ({
    currentTheme: null,
    loading: false,
    error: null,

    setTheme: (theme: any) => {
        set({ currentTheme: theme })
    },

    setLoading: (loading: boolean) => {
        set({ loading })
    },

    setError: (error: string | null) => {
        set({ error })
    },

    clearError: () => {
        set({ error: null })
    }
})