// stores/api/endpoints/admin-endpoints.ts
import { apiClient } from '../client'
import { Case, FinancialReport, SystemMetrics } from '../../types'

export const adminEndpoints = {
    // Dashboard
    getDashboardStats: () => apiClient.get<{ stats: SystemMetrics }>('/admin/dashboard/stats'),

    // Cases
    getCases: (params?: { type?: string; status?: string; page?: number }) =>
        apiClient.get<{ cases: Case[]; pagination: any }>('/admin/cases', { params }),

    updateCase: (caseId: string, updates: Partial<Case>) =>
        apiClient.patch<{ case: Case }>(`/admin/cases/${caseId}`, updates),

    // Users
    getUsers: (params?: { role?: string; status?: string; page?: number }) =>
        apiClient.get<{ users: any[]; pagination: any }>('/admin/users', { params }),

    updateUser: (userId: string, updates: any) =>
        apiClient.patch<{ user: any }>(`/admin/users/${userId}`, updates),

    // Finance
    getFinancialReports: (period?: string) =>
        apiClient.get<{ reports: FinancialReport[] }>(`/admin/finance/reports${period ? `?period=${period}` : ''}`),

    // Analytics
    getAnalytics: (type: string, params?: any) =>
        apiClient.get<{ data: any }>(`/admin/analytics/${type}`, { params }),
}