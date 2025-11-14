// stores/index.ts
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
    createAdminSlice,
    createLoadingSlice
} from './slices'
import {
    AuthState,
    NavigationState,
    NotificationState,
    SocketState,
    UIState,
    EmployeeState,
    EmployerState,
    AdminState,
    LoadingState
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
    & LoadingState

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
                ...createLoadingSlice(...a),
            }),
            persistOptions
        ),
        {
            name: 'app-store',
        }
    )
)

// Individual hook selectors for optimal performance - NO COMPOSITE HOOKS
export const useUser = () => useAppStore(state => state.user)

// Navigation hooks
export const useNavigation = () => useAppStore(state => state.navigation)
export const useCurrentPath = () => useAppStore(state => state.currentPath)
export const useBreadcrumbs = () => useAppStore(state => state.breadcrumbs)

// Notification hooks
export const useNotifications = () => useAppStore(state => state.notifications)
export const useUnreadCount = () => useAppStore(state => state.unreadCount)

// Socket hooks
export const useSocket = () => useAppStore(state => state.socket)

// UI hooks
export const useCurrentTheme = () => useAppStore(state => state.currentTheme)
export const useUIError = () => useAppStore(state => state.error)

// ✅ FIXED: Individual loading state and actions
export const useIsLoading = () => useAppStore(state => state.isLoading)
export const useLoadingCount = () => useAppStore(state => state.loadingCount)
export const useStartLoading = () => useAppStore(state => state.startLoading)
export const useStopLoading = () => useAppStore(state => state.stopLoading)
export const useSetLoading = () => useAppStore(state => state.setLoading)
export const useResetLoading = () => useAppStore(state => state.resetLoading)

// Employee hooks
export const useEmployeeProfile = () => useAppStore(state => state.profile)
export const useEmployeeJobs = () => useAppStore(state => state.jobs)
export const useEmployeeContracts = () => useAppStore(state => state.contracts)
export const useEmployeeWallet = () => useAppStore(state => state.wallet)
export const useEmployeeApplications = () => useAppStore(state => state.applications)

// Employer hooks
export const useEmployerProfile = () => useAppStore(state => state.profile)
export const useEmployerJobs = () => useAppStore(state => state.jobs)
export const useEmployerContracts = () => useAppStore(state => state.contracts)
export const useEmployerCandidates = () => useAppStore(state => state.candidates)

// Admin hooks
export const useDashboardStats = () => useAppStore(state => state.dashboardStats)
export const useAdminCases = () => useAppStore(state => state.cases)
export const useAdminUsers = () => useAppStore(state => state.users)
export const useFinancialReports = () => useAppStore(state => state.financialReports)
export const useAnalytics = () => useAppStore(state => state.analytics)

// Action hooks (individual actions to avoid object creation)
export const useFetchNavigation = () => useAppStore(state => state.fetchNavigation)
export const useSetCurrentPath = () => useAppStore(state => state.setCurrentPath)
export const useFetchNotifications = () => useAppStore(state => state.fetchNotifications)
export const useMarkNotificationAsRead = () => useAppStore(state => state.markNotificationAsRead)
export const useConnectSocket = () => useAppStore(state => state.connectSocket)
export const useSetTheme = () => useAppStore(state => state.setTheme)

// Employee actions
export const useFetchEmployeeProfile = () => useAppStore(state => state.fetchProfile)
export const useFetchEmployeeJobs = () => useAppStore(state => state.fetchJobs)
export const useFetchEmployeeContracts = () => useAppStore(state => state.fetchContracts)

// Employer actions
export const useFetchEmployerProfile = () => useAppStore(state => state.fetchProfile)
export const useFetchEmployerJobs = () => useAppStore(state => state.fetchJobs)
export const useCreateJob = () => useAppStore(state => state.createJob)

// Admin actions
export const useFetchDashboardStats = () => useAppStore(state => state.fetchDashboardStats)
export const useFetchCases = () => useAppStore(state => state.fetchCases)

// Auth actions
export const useInitializeAuth = () => useAppStore(state => state.initializeAuth)
export const useLogin = () => useAppStore(state => state.login)
export const useLogout = () => useAppStore(state => state.logout)
export const useSetUser = () => useAppStore(state => state.setUser);


// Initialize store on app start
export const initializeStore = async () => {
    const store = useAppStore.getState()

    // Start initial loading
    store.startLoading()

    try {
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
    } finally {
        // Ensure loading stops even if there's an error
        store.resetLoading()
    }
}

// Utility function for API calls with loading state
export const withLoading = async <T>(
    operation: Promise<T>,
    store = useAppStore.getState()
): Promise<T> => {
    store.startLoading()
    try {
        const result = await operation
        return result
    } finally {
        store.stopLoading()
    }
}

// Batch operations with single loading state
export const withBatchLoading = async <T>(
    operations: Promise<T>[],
    store = useAppStore.getState()
): Promise<T[]> => {
    store.startLoading()
    try {
        const results = await Promise.all(operations)
        return results
    } finally {
        store.stopLoading()
    }
}

// REMOVED: All composite hooks that cause infinite loops
// export const useLoadingActions = () => useAppStore(state => ({ ... }))
// export const useLoading = () => useAppStore(state => ({ ... }))
// export const useEmployee = () => useAppStore(state => ({ ... }))
// etc...