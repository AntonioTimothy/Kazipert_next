// stores/slices/admin-slice.ts
import { StateCreator } from 'zustand'
import { adminEndpoints } from '../api/endpoints'
import { Case, FinancialReport, SystemMetrics, AdminState } from '../types'

export const createAdminSlice: StateCreator<AdminState> = (set, get) => ({
    // Dashboard
    dashboardStats: null,
    statsLoading: false,

    // Cases
    cases: [],
    casesLoading: false,
    casesPagination: null,

    // Users
    users: [],
    usersLoading: false,
    usersPagination: null,

    // Finance
    financialReports: [],
    financeLoading: false,

    // Analytics
    analytics: {},
    analyticsLoading: false,

    // Actions
    fetchDashboardStats: async () => {
        set({ statsLoading: true })
        try {
            const { stats } = await adminEndpoints.getDashboardStats()
            set({ dashboardStats: stats, statsLoading: false })
        } catch (error) {
            set({ statsLoading: false })
            throw error
        }
    },

    fetchCases: async (params?: any) => {
        set({ casesLoading: true })
        try {
            const { cases, pagination } = await adminEndpoints.getCases(params)
            set({ cases, casesPagination: pagination, casesLoading: false })
        } catch (error) {
            set({ casesLoading: false })
            throw error
        }
    },

    updateCase: async (caseId: string, updates: Partial<Case>) => {
        try {
            const { case: updatedCase } = await adminEndpoints.updateCase(caseId, updates)
            set(state => ({
                cases: state.cases.map(c => c.id === caseId ? updatedCase : c)
            }))
            return updatedCase
        } catch (error) {
            throw error
        }
    },

    fetchUsers: async (params?: any) => {
        set({ usersLoading: true })
        try {
            const { users, pagination } = await adminEndpoints.getUsers(params)
            set({ users, usersPagination: pagination, usersLoading: false })
        } catch (error) {
            set({ usersLoading: false })
            throw error
        }
    },

    fetchFinancialReports: async (period?: string) => {
        set({ financeLoading: true })
        try {
            const { reports } = await adminEndpoints.getFinancialReports(period)
            set({ financialReports: reports, financeLoading: false })
        } catch (error) {
            set({ financeLoading: false })
            throw error
        }
    },

    fetchAnalytics: async (type: string, params?: any) => {
        set({ analyticsLoading: true })
        try {
            const { data } = await adminEndpoints.getAnalytics(type, params)
            set(state => ({
                analytics: { ...state.analytics, [type]: data },
                analyticsLoading: false
            }))
        } catch (error) {
            set({ analyticsLoading: false })
            throw error
        }
    },
})