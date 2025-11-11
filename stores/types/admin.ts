import { ApiState } from './common'

export interface Case {
    id: string
    type: 'worker_report' | 'employer_report' | 'dispute'
    title: string
    description: string
    status: 'open' | 'in_progress' | 'resolved' | 'closed'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    reportedBy: string
    reportedByName: string
    assignedTo?: string
    assignedToName?: string
    createdAt: string
    updatedAt: string
    resolution?: string
}

export interface FinancialReport {
    id: string
    period: string
    revenue: number
    expenses: number
    profit: number
    transactions: number
    growth: number
    newUsers: number
    activeContracts: number
}

export interface SystemMetrics {
    totalUsers: number
    activeUsers: number
    totalJobs: number
    activeContracts: number
    revenue: number
    supportTickets: number
    pendingVerifications: number
    systemHealth: 'healthy' | 'degraded' | 'down'
}

export interface AdminUser {
    id: string
    name: string
    email: string
    role: 'employee' | 'employer' | 'admin'
    status: 'active' | 'suspended' | 'pending'
    verified: boolean
    createdAt: string
    lastLogin?: string
    profileCompleted: boolean
}

export interface AnalyticsData {
    userGrowth: { date: string; count: number }[]
    revenueTrends: { date: string; revenue: number }[]
    jobPostings: { date: string; count: number }[]
    platformUsage: { metric: string; value: number }[]
}

export interface AdminState {
    // Dashboard
    dashboardStats: SystemMetrics | null
    statsLoading: boolean

    // Cases
    cases: Case[]
    casesLoading: boolean
    casesPagination: Pagination | null

    // Users
    users: AdminUser[]
    usersLoading: boolean
    usersPagination: Pagination | null

    // Finance
    financialReports: FinancialReport[]
    financeLoading: boolean

    // Analytics
    analytics: Record<string, AnalyticsData>
    analyticsLoading: boolean

    // Actions
    fetchDashboardStats: () => Promise<void>
    fetchCases: (params?: any) => Promise<void>
    updateCase: (caseId: string, updates: Partial<Case>) => Promise<Case>
    assignCase: (caseId: string, adminId: string) => Promise<Case>
    fetchUsers: (params?: any) => Promise<void>
    updateUser: (userId: string, updates: any) => Promise<AdminUser>
    suspendUser: (userId: string) => Promise<void>
    fetchFinancialReports: (period?: string) => Promise<void>
    fetchAnalytics: (type: string, params?: any) => Promise<void>
    exportData: (type: string, params?: any) => Promise<void>
}