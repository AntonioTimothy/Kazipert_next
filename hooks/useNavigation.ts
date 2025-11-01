"use client"

import { usePathname } from "next/navigation"
import { getNavigationForRole, hasAccessToRoute, NavigationItem } from "@/lib/navigation"
import { useEffect, useState } from "react"

export function useNavigation() {
    const pathname = usePathname()
    const [navigation, setNavigation] = useState<NavigationItem[]>([])
    const [role, setRole] = useState<"worker" | "employer" | "admin">("worker")
    const [permissions, setPermissions] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // If you're using NextAuth, use this:
    // const { data: session } = useSession()

    useEffect(() => {
        const loadUserData = () => {
            if (typeof window === "undefined") {
                setNavigation([])
                setRole("worker")
                setPermissions([])
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)

                // Get user data from storage
                const userData = sessionStorage.getItem("user") || localStorage.getItem("user")

                if (userData) {
                    const user = JSON.parse(userData)
                    const userRole = user.role || "worker"
                    const userPermissions = user.permissions || []

                    setRole(userRole)
                    setPermissions(userPermissions)

                    // Get navigation for the user's role and permissions
                    const userNavigation = getNavigationForRole(userRole, userPermissions)
                    setNavigation(userNavigation)
                } else {
                    // Default to worker if no user data
                    setRole("worker")
                    setPermissions([])
                    setNavigation(getNavigationForRole("worker", []))
                }
            } catch (error) {
                console.error("Error loading user data:", error)
                // Fallback to worker role
                setRole("worker")
                setPermissions([])
                setNavigation(getNavigationForRole("worker", []))
            } finally {
                setIsLoading(false)
            }
        }

        loadUserData()

        // Listen for storage changes to update navigation in real-time
        const handleStorageChange = () => {
            loadUserData()
        }

        window.addEventListener('storage', handleStorageChange)

        // Cleanup
        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [pathname]) // Re-run when pathname changes

    const checkAccess = (path: string) => {
        return hasAccessToRoute(path, role, permissions)
    }

    const getBreadcrumbs = () => {
        if (isLoading || navigation.length === 0) {
            return [{ name: "Dashboard", href: "/" }]
        }

        const segments = pathname.split("/").filter(segment => segment)
        const breadcrumbs = []

        let currentPath = ""
        for (const segment of segments) {
            currentPath += `/${segment}`
            const navItem = navigation.find(item =>
                item.href === currentPath ||
                item.children?.some(child => child.href === currentPath)
            )

            if (navItem) {
                if (navItem.href === currentPath) {
                    breadcrumbs.push({ name: navItem.name, href: currentPath })
                } else {
                    const childItem = navItem.children?.find(child => child.href === currentPath)
                    if (childItem) {
                        breadcrumbs.push({ name: navItem.name, href: navItem.href })
                        breadcrumbs.push({ name: childItem.name, href: currentPath })
                    }
                }
            }
        }

        // If no breadcrumbs found, return default
        if (breadcrumbs.length === 0) {
            breadcrumbs.push({ name: "Dashboard", href: "/" })
        }

        return breadcrumbs
    }

    // Helper to get current route name
    const getCurrentRouteName = () => {
        if (isLoading || navigation.length === 0) return "Dashboard"

        const breadcrumbs = getBreadcrumbs()
        return breadcrumbs[breadcrumbs.length - 1]?.name || "Dashboard"
    }

    // Helper to get mobile navigation (top 5 items)
    const getMobileNavigation = () => {
        if (isLoading || navigation.length === 0) return []
        return navigation.slice(0, 5)
    }

    // Helper to check if current user has specific permission
    const hasPermission = (permission: string) => {
        return permissions.includes(permission)
    }

    // Helper to check if current user has specific role
    const hasRole = (checkRole: "worker" | "employer" | "admin") => {
        return role === checkRole
    }

    return {
        navigation,
        role,
        permissions,
        isLoading,
        checkAccess,
        getBreadcrumbs,
        getCurrentRouteName,
        getMobileNavigation,
        hasPermission,
        hasRole,
        currentPath: pathname
    }
}