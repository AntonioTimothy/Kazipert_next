// Store utility functions

// Debounce function for search operations
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}

// Local storage utilities
export const storage = {
    get: <T>(key: string): T | null => {
        try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : null
        } catch {
            return null
        }
    },

    set: <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error('Error saving to localStorage:', error)
        }
    },

    remove: (key: string): void => {
        try {
            localStorage.removeItem(key)
        } catch (error) {
            console.error('Error removing from localStorage:', error)
        }
    },

    clear: (): void => {
        try {
            localStorage.clear()
        } catch (error) {
            console.error('Error clearing localStorage:', error)
        }
    }
}

// Store persistence
export const persistOptions = {
    name: 'app-store',
    version: 1,
    migrate: (persistedState: any, version: number) => {
        if (version === 0) {
            // Migrate from version 0 to 1
            return {
                ...persistedState,
                // Add migration logic here
            }
        }
        return persistedState
    }
}

// Selector utilities for optimized re-renders
export const createSelector = <T, R>(selector: (state: T) => R) => selector

// Error handling utility
export const handleStoreError = (error: any, defaultMessage: string) => {
    console.error('Store error:', error)
    return error?.message || defaultMessage
}

// Loading state management
export const withLoading = async <T>(
    setLoading: (loading: boolean) => void,
    operation: () => Promise<T>
): Promise<T> => {
    setLoading(true)
    try {
        const result = await operation()
        setLoading(false)
        return result
    } catch (error) {
        setLoading(false)
        throw error
    }
}