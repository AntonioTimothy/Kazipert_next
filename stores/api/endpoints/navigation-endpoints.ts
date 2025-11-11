// stores/api/endpoints/navigation-endpoints.ts
import { apiClient } from '../client'
import { NavigationItem } from '../../types'

export const navigationEndpoints = {
    getNavigation: (role: string) =>
        apiClient.get<{ navigation: NavigationItem[] }>(`/navigation?role=${role}`),
}