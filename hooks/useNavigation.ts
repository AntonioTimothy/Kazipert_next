"use client"

import { usePathname } from "next/navigation"
import { getNavigationForRole, hasAccessToRoute, NavigationItem } from "@/lib/navigation"
import { useEffect, useState } from "react"

export function useNavigation() {
    const pathname = usePathname()
    const [navigation, setNavigation] = useState<NavigationItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const loadUserAndNavigation = async () => {
            try {
                setIsLoading(true)

                // Check if we have user data in sessionStorage (from login)
                const storedUser = sessionStorage.getItem("user")

                console.log("🌐 Loading user and navigation...FOUND>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", storedUser)

                if (storedUser) {
                    const userData = JSON.parse(storedUser)
                    setUser(userData)
                    setIsAuthenticated(true)

                    console.log(`🔧 Loading navigation from sessionStorage for role: ${userData.role}`, {
                        permissions: userData.permissions,
                        user: userData
                    })

                    // Get navigation for the user's role and permissions
                    const userNavigation = getNavigationForRole(
                        userData.role?.toLowerCase() || "employee",
                        userData.permissions || []
                    )
                    setNavigation(userNavigation)

                    console.log(`📋 Final navigation items:`, userNavigation.map(item => item.name))
                } else {
                    // If no sessionStorage, try to get user from API
                    try {
                        const res = await fetch('/api/auth/me', {
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })

                        if (res.ok) {
                            const data = await res.json()
                            if (data.user) {
                                setUser(data.user)
                                setIsAuthenticated(true)

                                // Store in sessionStorage for future use
                                sessionStorage.setItem("user", JSON.stringify(data.user))

                                console.log(`🔧 Loading navigation from API for role: ${data.user.role}`, {
                                    permissions: data.user.permissions,
                                    user: data.user
                                })

                                const userNavigation = getNavigationForRole(
                                    data.user.role?.toLowerCase() || "worker",
                                    data.user.permissions || []
                                )
                                setNavigation(userNavigation)

                                console.log(`📋 Final navigation items:`, userNavigation.map(item => item.name))
                            } else {
                                // No user found
                                setIsAuthenticated(false)
                                setNavigation([])
                                console.log("🚫 No user found, showing empty navigation")
                            }
                        } else {
                            // API call failed
                            setIsAuthenticated(false)
                            setNavigation([])
                            console.log("🚫 Auth check failed, showing empty navigation")
                        }
                    } catch (apiError) {
                        console.error("API auth check failed:", apiError)
                        setIsAuthenticated(false)
                        setNavigation([])
                    }
                }
            } catch (error) {
                console.error("Error loading navigation:", error)
                // Fallback to empty navigation
                setIsAuthenticated(false)
                setNavigation([])
            } finally {
                setIsLoading(false)
            }
        }

        loadUserAndNavigation()

        // Listen for storage changes (in case user logs out in another tab)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "user" && e.newValue === null) {
                // User was removed (logged out)
                setUser(null)
                setIsAuthenticated(false)
                setNavigation([])
            } else if (e.key === "user" && e.newValue) {
                // User was updated
                try {
                    const userData = JSON.parse(e.newValue)
                    setUser(userData)
                    setIsAuthenticated(true)
                    const userNavigation = getNavigationForRole(
                        userData.role?.toLowerCase() || "worker",
                        userData.permissions || []
                    )
                    setNavigation(userNavigation)
                } catch (error) {
                    console.error("Error parsing updated user data:", error)
                }
            }
        }

        window.addEventListener('storage', handleStorageChange)

        // Cleanup
        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [pathname])

    const checkAccess = (path: string) => {
        if (!isAuthenticated || !user) return false

        return hasAccessToRoute(
            path,
            user.role?.toLowerCase() || "worker",
            user.permissions || []
        )
    }

    const getBreadcrumbs = () => {
        if (isLoading || navigation.length === 0 || !isAuthenticated) {
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
        if (isLoading || navigation.length === 0 || !isAuthenticated) return "Dashboard"

        const breadcrumbs = getBreadcrumbs()
        return breadcrumbs[breadcrumbs.length - 1]?.name || "Dashboard"
    }

    // Helper to get mobile navigation (top 5 items)
    const getMobileNavigation = () => {
        if (isLoading || navigation.length === 0 || !isAuthenticated) return []
        return navigation.slice(0, 5)
    }

    // Helper to check if current user has specific permission
    const hasPermission = (permission: string) => {
        return user?.permissions?.includes(permission) || false
    }

    // Helper to check if current user has specific role
    const hasRole = (checkRole: "worker" | "employer" | "admin") => {
        return user?.role?.toLowerCase() === checkRole
    }

    // Helper to refresh user data from API
    const refreshUser = async () => {
        try {
            const res = await fetch('/api/auth/me', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (res.ok) {
                const data = await res.json()
                if (data.user) {
                    setUser(data.user)
                    setIsAuthenticated(true)
                    sessionStorage.setItem("user", JSON.stringify(data.user))

                    // Update navigation with new user data
                    const userNavigation = getNavigationForRole(
                        data.user.role?.toLowerCase() || "worker",
                        data.user.permissions || []
                    )
                    setNavigation(userNavigation)
                }
            }
        } catch (error) {
            console.error("Error refreshing user data:", error)
        }
    }

    // Helper to logout (clear local state and storage)
    const logout = () => {
        setUser(null)
        setIsAuthenticated(false)
        setNavigation([])
        sessionStorage.removeItem("user")
    }

    return {
        navigation,
        role: user?.role?.toLowerCase() || "worker",
        permissions: user?.permissions || [],
        isLoading,
        isAuthenticated,
        user,
        checkAccess,
        getBreadcrumbs,
        getCurrentRouteName,
        getMobileNavigation,
        hasPermission,
        hasRole,
        refreshUser,
        logout,
        currentPath: pathname
    }
}