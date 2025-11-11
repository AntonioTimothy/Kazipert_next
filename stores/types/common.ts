export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    role: 'employee' | 'employer' | 'admin'
    verified: boolean
    onboardingCompleted: boolean
    permissions: string[]
    subscription?: string
    createdAt: string
}

export interface NavigationItem {
    name: string
    href: string
    icon: string
    roles: ("employee" | "employer" | "admin")[]
    permissions?: string[]
    badge?: string
    children?: NavigationItem[]
}

export interface Notification {
    id: string
    title: string
    message: string
    type: 'info' | 'warning' | 'success' | 'error'
    read: boolean
    createdAt: string
    metadata?: Record<string, any>
}

export interface SocketState {
    isConnected: boolean
    lastMessage: any
    onlineUsers: string[]
    connectionId?: string
}

export interface ApiState<T = any> {
    data: T | null
    loading: boolean
    error: string | null
    lastFetched: number | null
}

export interface Pagination {
    page: number
    limit: number
    total: number
    totalPages: number
}

// Base state interfaces for slices
export interface AuthState {
    user: User | null
    isLoading: boolean
    error: string | null
    initializeAuth: () => Promise<User | null>
    updateUser: (updates: Partial<User>) => void
    logout: () => Promise<void>
}

export interface NavigationState {
    navigation: NavigationItem[]
    activePath: string
    sidebarCollapsed: boolean
    mobileMenuOpen: boolean
    setActivePath: (path: string) => void
    setSidebarCollapsed: (collapsed: boolean) => void
    setMobileMenuOpen: (open: boolean) => void
    fetchNavigation: (userRole: string, userPermissions?: string[]) => Promise<void>
    getCurrentRouteName: () => string | null
}

export interface NotificationState {
    notifications: Notification[]
    unreadCount: number
    fetchNotifications: () => Promise<void>
    markNotificationAsRead: (notificationId: string) => Promise<void>
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
    clearNotifications: () => void
}

export interface SocketState {
    socket: {
        isConnected: boolean
        lastMessage: any
        onlineUsers: string[]
        connectionId?: string
    }
    connectSocket: () => void
    disconnectSocket: () => void
    sendSocketMessage: (message: any) => void
}

export interface UIState {
    currentTheme: any
    loading: boolean
    error: string | null
    setTheme: (theme: any) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    clearError: () => void
}