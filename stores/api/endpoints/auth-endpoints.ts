// stores/api/endpoints/auth-endpoints.ts
import { apiClient } from '../client'
import { User } from '../../types'

export const authEndpoints = {
    getCurrentUser: () => apiClient.get<{ user: User }>('/auth/me'),

    login: (credentials: { email: string; password: string }) =>
        apiClient.post<{ user: User; token: string }>('/auth/login', credentials),

    logout: () => apiClient.post('/auth/logout'),

    updateProfile: (updates: Partial<User>) =>
        apiClient.patch<{ user: User }>('/auth/profile', updates),
}