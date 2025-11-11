// stores/slices/employee-slice.ts
import { StateCreator } from 'zustand'
import { employeeEndpoints } from '../api/endpoints'
import { EmployeeProfile, JobApplication, EmployeeContract, EmployeeWallet, EmployeeState } from '../types'

export const createEmployeeSlice: StateCreator<EmployeeState> = (set, get) => ({
  // Profile
  profile: null,
  profileLoading: false,

  // Jobs
  jobs: [],
  jobsLoading: false,
  jobsPagination: null,

  // Applications
  applications: [],
  applicationsLoading: false,

  // Contracts
  contracts: [],
  contractsLoading: false,

  // Wallet
  wallet: null,
  walletLoading: false,

  // Actions
  fetchProfile: async () => {
    set({ profileLoading: true })
    try {
      const { profile } = await employeeEndpoints.getProfile()
      set({ profile, profileLoading: false })
    } catch (error) {
      set({ profileLoading: false })
      throw error
    }
  },

  updateProfile: async (updates: Partial<EmployeeProfile>) => {
    try {
      const { profile } = await employeeEndpoints.updateProfile(updates)
      set({ profile })
    } catch (error) {
      throw error
    }
  },

  fetchJobs: async (params?: any) => {
    set({ jobsLoading: true })
    try {
      const { jobs, pagination } = await employeeEndpoints.getJobs(params)
      set({ jobs, jobsPagination: pagination, jobsLoading: false })
    } catch (error) {
      set({ jobsLoading: false })
      throw error
    }
  },

  fetchContracts: async () => {
    set({ contractsLoading: true })
    try {
      const { contracts } = await employeeEndpoints.getContracts()
      set({ contracts, contractsLoading: false })
    } catch (error) {
      set({ contractsLoading: false })
      throw error
    }
  },

  fetchWallet: async () => {
    set({ walletLoading: true })
    try {
      const { wallet } = await employeeEndpoints.getWallet()
      set({ wallet, walletLoading: false })
    } catch (error) {
      set({ walletLoading: false })
      throw error
    }
  },

  applyToJob: async (jobId: string, application: any) => {
    try {
      const { application: newApplication } = await employeeEndpoints.applyToJob(jobId, application)
      set(state => ({
        applications: [...state.applications, newApplication]
      }))
      return newApplication
    } catch (error) {
      throw error
    }
  },
})