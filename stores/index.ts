import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import {
    createAuthSlice,
    createNavigationSlice,
    createNotificationSlice,
    createSocketSlice,
    createUISlice,
    createEmployeeSlice,
    createEmployerSlice,
    createAdminSlice
} from './slices'
import {
    AuthState,
    NavigationState,
    NotificationState,
    SocketState,
    UIState,
    EmployeeState,
    EmployerState,
    AdminState
} from './types'
import { persistOptions } from './utils/store-utils'

export type AppState =
    & AuthState
    & NavigationState
    & NotificationState
    & SocketState
    & UIState
    & EmployeeState
    & EmployerState
    & AdminState

export const useAppStore = create<AppState>()(
    devtools(
        persist(
            (...a) => ({
                ...createAuthSlice(...a),
                ...createNavigationSlice(...a),
                ...createNotificationSlice(...a),
                ...createSocketSlice(...a),
                ...createUISlice(...a),
                ...createEmployeeSlice(...a),
                ...createEmployerSlice(...a),
                ...createAdminSlice(...a),
            }),
            persistOptions
        ),
        {
            name: 'app-store',
        }
    )
)

// Hook selectors for better performance
export const useUser = () => useAppStore(state => state.user)
export const useNavigation = () => useAppStore(state => state.navigation)
export const useNotifications = () => useAppStore(state => ({
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    fetchNotifications: state.fetchNotifications,
    markNotificationAsRead: state.markNotificationAsRead,
    addNotification: state.addNotification,
}))

export const useSocket = () => useAppStore(state => ({
    socket: state.socket,
    connectSocket: state.connectSocket,
    disconnectSocket: state.disconnectSocket,
    sendSocketMessage: state.sendSocketMessage,
}))

export const useUI = () => useAppStore(state => ({
    currentTheme: state.currentTheme,
    loading: state.loading,
    error: state.error,
    setTheme: state.setTheme,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
}))

export const useEmployee = () => useAppStore(state => ({
    profile: state.profile,
    jobs: state.jobs,
    contracts: state.contracts,
    wallet: state.wallet,
    applications: state.applications,
    // Loading states
    profileLoading: state.profileLoading,
    jobsLoading: state.jobsLoading,
    contractsLoading: state.contractsLoading,
    walletLoading: state.walletLoading,
    // Actions
    fetchProfile: state.fetchProfile,
    fetchJobs: state.fetchJobs,
    fetchContracts: state.fetchContracts,
    fetchWallet: state.fetchWallet,
    applyToJob: state.applyToJob,
}))

export const useEmployer = () => useAppStore(state => ({
    profile: state.profile,
    jobs: state.jobs,
    contracts: state.contracts,
    candidates: state.candidates,
    // Loading states
    profileLoading: state.profileLoading,
    jobsLoading: state.jobsLoading,
    contractsLoading: state.contractsLoading,
    candidatesLoading: state.candidatesLoading,
    // Actions
    fetchProfile: state.fetchProfile,
    fetchJobs: state.fetchJobs,
    createJob: state.createJob,
    fetchContracts: state.fetchContracts,
    fetchCandidates: state.fetchCandidates,
}))

export const useAdmin = () => useAppStore(state => ({
    dashboardStats: state.dashboardStats,
    cases: state.cases,
    users: state.users,
    financialReports: state.financialReports,
    analytics: state.analytics,
    // Loading states
    statsLoading: state.statsLoading,
    casesLoading: state.casesLoading,
    usersLoading: state.usersLoading,
    financeLoading: state.financeLoading,
    analyticsLoading: state.analyticsLoading,
    // Actions
    fetchDashboardStats: state.fetchDashboardStats,
    fetchCases: state.fetchCases,
    updateCase: state.updateCase,
    fetchUsers: state.fetchUsers,
    fetchFinancialReports: state.fetchFinancialReports,
    fetchAnalytics: state.fetchAnalytics,
}))

// Initialize store on app start
export const initializeStore = async () => {
    const store = useAppStore.getState()

    // Initialize auth
    const user = await store.initializeAuth()

    if (user) {
        // Initialize navigation based on user role
        await store.fetchNavigation(user.role, user.permissions)

        // Initialize notifications
        await store.fetchNotifications()

        // Connect to socket
        store.connectSocket()

        // Load role-specific data
        if (user.role === 'employee') {
            await store.fetchProfile?.()
            await store.fetchJobs?.()
        } else if (user.role === 'employer') {
            await store.fetchProfile?.()
            await store.fetchJobs?.()
        } else if (user.role === 'admin') {
            await store.fetchDashboardStats?.()
            await store.fetchCases?.()
        }
    }

    return store
}