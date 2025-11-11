// stores/api/endpoints/employer-endpoints.ts
import { apiClient } from '../client'
import { EmployerProfile, JobPost, EmployerContract } from '../../types'

export const employerEndpoints = {
    // Profile
    getProfile: () => apiClient.get<{ profile: EmployerProfile }>('/employer/profile'),
    updateProfile: (updates: Partial<EmployerProfile>) =>
        apiClient.patch<{ profile: EmployerProfile }>('/employer/profile', updates),

    // Jobs
    getJobs: () => apiClient.get<{ jobs: JobPost[] }>('/employer/jobs'),
    createJob: (jobData: Partial<JobPost>) =>
        apiClient.post<{ job: JobPost }>('/employer/jobs', jobData),
    updateJob: (jobId: string, updates: Partial<JobPost>) =>
        apiClient.patch<{ job: JobPost }>(`/employer/jobs/${jobId}`, updates),

    // Contracts
    getContracts: () => apiClient.get<{ contracts: EmployerContract[] }>('/employer/contracts'),
    createContract: (contractData: Partial<EmployerContract>) =>
        apiClient.post<{ contract: EmployerContract }>('/employer/contracts', contractData),

    // Candidates
    getCandidates: (jobId?: string) =>
        apiClient.get<{ candidates: any[] }>(`/employer/candidates${jobId ? `?jobId=${jobId}` : ''}`),
}