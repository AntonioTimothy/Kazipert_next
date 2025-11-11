import { NavigationItem } from '../types'

// Navigation helper functions
export const filterNavigationByRole = (
    navigation: NavigationItem[],
    role: string,
    permissions: string[] = []
): NavigationItem[] => {
    return navigation.filter(item => {
        // Check if item is for current role
        if (!item.roles.includes(role as any)) {
            return false
        }

        // Check permissions if specified
        if (item.permissions && item.permissions.length > 0) {
            return item.permissions.some(permission => permissions.includes(permission))
        }

        return true
    }).map(item => ({
        ...item,
        children: item.children
            ? filterNavigationByRole(item.children, role, permissions)
            : undefined
    }))
}

export const findActiveNavigationItem = (
    navigation: NavigationItem[],
    currentPath: string
): NavigationItem | null => {
    for (const item of navigation) {
        if (item.href === currentPath) {
            return item
        }
        if (item.children) {
            const childItem = findActiveNavigationItem(item.children, currentPath)
            if (childItem) {
                return childItem
            }
        }
    }
    return null
}

export const getBreadcrumbs = (
    navigation: NavigationItem[],
    currentPath: string
): { name: string; href: string }[] => {
    const breadcrumbs: { name: string; href: string }[] = []

    const findPath = (items: NavigationItem[], path: string): boolean => {
        for (const item of items) {
            if (item.href === path) {
                breadcrumbs.unshift({ name: item.name, href: item.href })
                return true
            }
            if (item.children) {
                if (findPath(item.children, path)) {
                    breadcrumbs.unshift({ name: item.name, href: item.href })
                    return true
                }
            }
        }
        return false
    }

    findPath(navigation, currentPath)
    return breadcrumbs
}

export const flattenNavigation = (navigation: NavigationItem[]): NavigationItem[] => {
    const flat: NavigationItem[] = []

    navigation.forEach(item => {
        flat.push(item)
        if (item.children) {
            flat.push(...flattenNavigation(item.children))
        }
    })

    return flat
}

export const hasAccessToRoute = (
    navigation: NavigationItem[],
    path: string,
    role: string,
    permissions: string[] = []
): boolean => {
    const flatNav = flattenNavigation(navigation)
    const route = flatNav.find(item => item.href === path)

    if (!route) return false
    if (!route.roles.includes(role as any)) return false
    if (route.permissions && route.permissions.length > 0) {
        return route.permissions.some(permission => permissions.includes(permission))
    }

    return true
}

// Mobile navigation helpers
export const getMobileNavigation = (
    navigation: NavigationItem[],
    maxItems: number = 5
): NavigationItem[] => {
    const flatNav = flattenNavigation(navigation)
    return flatNav
        .filter(item => item.href !== '#') // Remove placeholder items
        .slice(0, maxItems)
}

// Badge counter utilities
export const calculateTotalBadges = (navigation: NavigationItem[]): number => {
    let total = 0

    const countBadges = (items: NavigationItem[]) => {
        items.forEach(item => {
            if (item.badge && !isNaN(Number(item.badge))) {
                total += Number(item.badge)
            }
            if (item.children) {
                countBadges(item.children)
            }
        })
    }

    countBadges(navigation)
    return total
}