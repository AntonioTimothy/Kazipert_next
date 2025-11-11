// stores/slices/navigation-slice.ts
import { StateCreator } from 'zustand'
import { navigationEndpoints } from '../api/endpoints'
import { NavigationItem, NavigationState } from '../types'
import { getNavigationForRole } from '@/lib/navigation-config'

export const createNavigationSlice: StateCreator<NavigationState> = (set, get) => ({
    navigation: [],
    activePath: '/portals',
    sidebarCollapsed: false,
    mobileMenuOpen: false,

    setActivePath: (path: string) => {
        set({ activePath: path })
    },

    setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed })
    },

    setMobileMenuOpen: (open: boolean) => {
        set({ mobileMenuOpen: open })
    },

    fetchNavigation: async (userRole: string, userPermissions: string[] = []) => {
        try {
            // Use client-side navigation config
            const navigation = getNavigationForRole(userRole as any, userPermissions)
            set({ navigation })
        } catch (error) {
            console.error('Failed to fetch navigation:', error)
            // Fallback to client-side config
            const navigation = getNavigationForRole(userRole as any, userPermissions)
            set({ navigation })
        }
    },

    getCurrentRouteName: () => {
        const { navigation, activePath } = get()

        const findInNavigation = (items: NavigationItem[]): string | null => {
            for (const item of items) {
                if (item.href === activePath) return item.name
                if (item.children) {
                    const childResult = findInNavigation(item.children)
                    if (childResult) return childResult
                }
            }
            return null
        }

        return findInNavigation(navigation) || 'Dashboard'
    },
})