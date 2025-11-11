// stores/api/endpoints/employee-endpoints.ts
import { apiClient } from '../client'
import { EmployeeProfile, JobApplication, EmployeeContract, EmployeeWallet } from '../../types'

export const employeeEndpoints = {
    // Profile
    getProfile: () => apiClient.get<{ profile: EmployeeProfile }>('/employee/profile'),
    updateProfile: (updates: Partial<EmployeeProfile>) =>
        apiClient.patch<{ profile: EmployeeProfile }>('/employee/profile', updates),

    // Jobs
    getJobs: (params?: { page?: number; limit?: number; search?: string }) =>
        apiClient.get<{ jobs: any[]; pagination: any }>('/employee/jobs', { params }),

    applyToJob: (jobId: string, application: { coverLetter?: string }) =>
        apiClient.post<{ application: JobApplication }>(`/employee/jobs/${jobId}/apply`, application),

    // Contracts
    getContracts: () => apiClient.get<{ contracts: EmployeeContract[] }>('/employee/contracts'),
    getContract: (contractId: string) =>
        apiClient.get<{ contract: EmployeeContract }>(`/employee/contracts/${contractId}`),

    // Wallet
    getWallet: () => apiClient.get<{ wallet: EmployeeWallet }>('/employee/wallet'),
    requestPayout: (amount: number) =>
        apiClient.post<{ transaction: any }>('/employee/wallet/payout', { amount }),

    // Applications
    getApplications: () =>
        apiClient.get<{ applications: JobApplication[] }>('/employee/applications'),
}