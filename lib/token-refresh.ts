// lib/token-refresh.ts
class TokenRefresh {
    private isRefreshing = false
    private refreshSubscribers: ((token: string) => void)[] = []

    async refreshToken(): Promise<string | null> {
        if (this.isRefreshing) {
            // If already refreshing, wait for it to complete
            return new Promise((resolve) => {
                this.refreshSubscribers.push((token) => {
                    resolve(token)
                })
            })
        }

        this.isRefreshing = true

        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const data = await response.json()

                // Notify all subscribers
                this.refreshSubscribers.forEach((callback) => callback(data.accessToken))
                this.refreshSubscribers = []

                return data.accessToken
            } else {
                throw new Error('Token refresh failed')
            }
        } catch (error) {
            console.error('Token refresh error:', error)
            // Clear tokens and redirect to login
            this.clearTokens()
            window.location.href = '/login?error=session_expired'
            return null
        } finally {
            this.isRefreshing = false
        }
    }

    private clearTokens() {
        // Clear client-side storage
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        sessionStorage.clear()

        // Clear cookies by setting expired dates
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    }
}

export const tokenRefresh = new TokenRefresh()