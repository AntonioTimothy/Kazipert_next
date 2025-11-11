// stores/slices/employer-slice.ts
import { StateCreator } from 'zustand'
import { employerEndpoints } from '../api/endpoints'
import { EmployerProfile, JobPost, EmployerContract, EmployerState } from '../types'

export const createEmployerSlice: StateCreator<EmployerState> = (set, get) => ({
    // Profile
    profile: null,
    profileLoading: false,

    // Jobs
    jobs: [],
    jobsLoading: false,

    // Contracts
    contracts: [],
    contractsLoading: false,

    // Candidates
    candidates: [],
    candidatesLoading: false,

    // Actions
    fetchProfile: async () => {
        set({ profileLoading: true })
        try {
            const { profile } = await employerEndpoints.getProfile()
            set({ profile, profileLoading: false })
        } catch (error) {
            set({ profileLoading: false })
            throw error
        }
    },

    fetchJobs: async () => {
        set({ jobsLoading: true })
        try {
            const { jobs } = await employerEndpoints.getJobs()
            set({ jobs, jobsLoading: false })
        } catch (error) {
            set({ jobsLoading: false })
            throw error
        }
    },

    createJob: async (jobData: Partial<JobPost>) => {
        try {
            const { job } = await employerEndpoints.createJob(jobData)
            set(state => ({
                jobs: [...state.jobs, job]
            }))
            return job
        } catch (error) {
            throw error
        }
    },

    fetchContracts: async () => {
        set({ contractsLoading: true })
        try {
            const { contracts } = await employerEndpoints.getContracts()
            set({ contracts, contractsLoading: false })
        } catch (error) {
            set({ contractsLoading: false })
            throw error
        }
    },

    fetchCandidates: async (jobId?: string) => {
        set({ candidatesLoading: true })
        try {
            const { candidates } = await employerEndpoints.getCandidates(jobId)
            set({ candidates, candidatesLoading: false })
        } catch (error) {
            set({ candidatesLoading: false })
            throw error
        }
    },
})