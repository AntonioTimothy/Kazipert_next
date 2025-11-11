// Common API response types
export interface ApiResponse<T = any> {
    success: boolean
    data: T
    message?: string
    error?: string
    pagination?: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export interface PaginatedResponse<T = any> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

// Auth API types
export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    user: any
    token: string
    refreshToken: string
}

export interface RegisterRequest {
    name: string
    email: string
    password: string
    role: 'employee' | 'employer'
}

// Navigation API types
export interface NavigationResponse {
    navigation: any[]
}

// Employee API types
export interface EmployeeProfileResponse {
    profile: any
}

export interface JobsResponse {
    jobs: any[]
    pagination: any
}

export interface JobApplicationRequest {
    coverLetter?: string
    salaryExpectation?: number
}

// Employer API types
export interface CreateJobRequest {
    title: string
    description: string
    requirements: string[]
    skills: string[]
    location: string
    type: 'full-time' | 'part-time' | 'contract'
    salaryRange: {
        min: number
        max: number
        currency: string
    }
    remote: boolean
    experienceLevel: 'entry' | 'mid' | 'senior'
}

// Admin API types
export interface DashboardStatsResponse {
    stats: any
}

export interface CasesResponse {
    cases: any[]
    pagination: any
}

export interface UsersResponse {
    users: any[]
    pagination: any
}

// Socket message types
export interface SocketMessage {
    type: string
    payload: any
    timestamp: number
    from?: string
}

export interface NotificationMessage {
    type: 'info' | 'warning' | 'success' | 'error'
    title: string
    message: string
    action?: {
        label: string
        url: string
    }
}