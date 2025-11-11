import { ApiState } from './common'

export interface EmployerProfile {
    id: string
    userId: string
    companyName: string
    industry: string
    companySize: string
    website?: string
    description: string
    location: string
    foundedYear?: number
    contactEmail?: string
    phone?: string
    socialMedia?: {
        linkedin?: string
        twitter?: string
    }
}

export interface JobPost {
    id: string
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
    status: 'draft' | 'published' | 'closed'
    applications: number
    views: number
    createdAt: string
    updatedAt: string
    remote: boolean
    experienceLevel: 'entry' | 'mid' | 'senior'
}

export interface EmployerContract {
    id: string
    employeeId: string
    employeeName: string
    jobId: string
    jobTitle: string
    startDate: string
    endDate?: string
    status: 'active' | 'completed' | 'terminated'
    hourlyRate: number
    totalHours: number
    totalAmount: number
    nextPaymentDate?: string
    paymentStatus: 'pending' | 'paid' | 'overdue'
}

export interface Candidate {
    id: string
    name: string
    email: string
    avatar?: string
    skills: string[]
    experience: string
    education: string
    location: string
    appliedAt: string
    status: 'pending' | 'reviewed' | 'interviewed' | 'rejected' | 'accepted'
    coverLetter?: string
    resumeUrl?: string
}

export interface EmployerState {
    // Profile
    profile: EmployerProfile | null
    profileLoading: boolean

    // Jobs
    jobs: JobPost[]
    jobsLoading: boolean

    // Contracts
    contracts: EmployerContract[]
    contractsLoading: boolean

    // Candidates
    candidates: Candidate[]
    candidatesLoading: boolean
    selectedJobId?: string

    // Actions
    fetchProfile: () => Promise<void>
    updateProfile: (updates: Partial<EmployerProfile>) => Promise<void>
    fetchJobs: () => Promise<void>
    createJob: (jobData: Partial<JobPost>) => Promise<JobPost>
    updateJob: (jobId: string, updates: Partial<JobPost>) => Promise<JobPost>
    deleteJob: (jobId: string) => Promise<void>
    fetchContracts: () => Promise<void>
    createContract: (contractData: Partial<EmployerContract>) => Promise<EmployerContract>
    fetchCandidates: (jobId?: string) => Promise<void>
    updateCandidateStatus: (candidateId: string, status: string) => Promise<void>
}