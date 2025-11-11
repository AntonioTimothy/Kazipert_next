import { ApiState } from './common'

export interface EmployeeProfile {
    id: string
    userId: string
    skills: string[]
    experience: string
    education: string
    hourlyRate: number
    availability: 'full-time' | 'part-time' | 'contract'
    location: string
    bio: string
    resumeUrl?: string
    portfolio?: string[]
    languages?: string[]
    certifications?: string[]
}

export interface JobApplication {
    id: string
    jobId: string
    jobTitle: string
    employerName: string
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
    appliedAt: string
    coverLetter?: string
    salaryExpectation?: number
}

export interface EmployeeContract {
    id: string
    employerId: string
    employerName: string
    jobId: string
    jobTitle: string
    startDate: string
    endDate?: string
    status: 'active' | 'completed' | 'terminated'
    hourlyRate: number
    totalHours: number
    totalEarned: number
    paymentStatus: 'pending' | 'paid' | 'overdue'
    nextPaymentDate?: string
}

export interface EmployeeWallet {
    balance: number
    pending: number
    totalEarned: number
    transactions: WalletTransaction[]
}

export interface WalletTransaction {
    id: string
    amount: number
    type: 'credit' | 'debit'
    description: string
    date: string
    status: 'completed' | 'pending' | 'failed'
    reference?: string
}

export interface JobListing {
    id: string
    title: string
    description: string
    employer: string
    location: string
    salary: {
        min: number
        max: number
        currency: string
    }
    type: 'full-time' | 'part-time' | 'contract'
    skills: string[]
    postedAt: string
    applicationDeadline?: string
    remote: boolean
}

export interface EmployeeState {
    // Profile
    profile: EmployeeProfile | null
    profileLoading: boolean

    // Jobs
    jobs: JobListing[]
    jobsLoading: boolean
    jobsPagination: Pagination | null

    // Applications
    applications: JobApplication[]
    applicationsLoading: boolean

    // Contracts
    contracts: EmployeeContract[]
    contractsLoading: boolean

    // Wallet
    wallet: EmployeeWallet | null
    walletLoading: boolean

    // Actions
    fetchProfile: () => Promise<void>
    updateProfile: (updates: Partial<EmployeeProfile>) => Promise<void>
    fetchJobs: (params?: any) => Promise<void>
    fetchApplications: () => Promise<void>
    applyToJob: (jobId: string, application: any) => Promise<JobApplication>
    fetchContracts: () => Promise<void>
    fetchWallet: () => Promise<void>
    requestPayout: (amount: number) => Promise<void>
}