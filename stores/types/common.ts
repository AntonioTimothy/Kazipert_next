export interface LoadingState {
    isLoading: boolean;
    loadingCount: number;
    startLoading: () => void;
    stopLoading: () => void;
    setLoading: (loading: boolean) => void;
    resetLoading: () => void;
}


export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
    permissions: string[];
    isSuperAdmin: boolean;
    onboardingCompleted: boolean;
    kycVerified: boolean;
    profile?: any;
    preferences?: any;
    lastLogin?: string;
    createdAt?: string;
    updatedAt?: string;
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
    // State
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
    refreshToken: string | null;
    loginLoading: boolean;
    registerLoading: boolean;
    logoutLoading: boolean;

    // Actions - ✅ MAKE SURE setUser IS INCLUDED HERE
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setRefreshToken: (refreshToken: string | null) => void;
    login: (email: string, password: string, rememberMe?: boolean) => Promise<any>;
    logout: () => Promise<void>;
    register: (userData: any) => Promise<any>;
    initializeAuth: () => Promise<void>;
    refreshToken: () => Promise<string>;
    updateUserProfile: (profileData: any) => Promise<any>;
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

// Common types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface WebSocketMessage {
    type: string;
    payload: any;
    timestamp: Date;
}


export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: string;
    verified: boolean;
    onboardingCompleted: boolean;
    permissions: string[];
    lastLogin?: Date;
    createdAt: Date;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    token: string | null;
    refreshToken: string | null;
}

export interface LoginResponse {
    success: boolean;
    user: User;
    token: string;
    refreshToken: string;
}

// Navigation types
export interface NavigationItem {
    id: string;
    name: string;
    href: string;
    icon: string;
    roles: string[];
    permissions?: string[];
    badge?: string;
    children?: NavigationItem[];
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface NavigationState {
    items: NavigationItem[];
    loading: boolean;
    error: string | null;
    lastUpdated: Date | null;
}

export interface NavigationApiResponse {
    success: boolean;
    data: NavigationItem[];
    message?: string;
}

// Notification types
export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: Date;
    actionUrl?: string;
    metadata?: Record<string, any>;
}

export interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
}

export interface NotificationApiResponse {
    success: boolean;
    data: Notification[];
    unreadCount: number;
}

// Socket types
export interface SocketState {
    isConnected: boolean;
    isConnecting: boolean;
    lastMessage: any;
    error: string | null;
}

// UI types
export interface UIState {
    sidebarOpen: boolean;
    sidebarCollapsed: boolean;
    theme: string;
    modal: {
        open: boolean;
        type: string;
        data: any;
    };
}