// lib/auth-utils.ts
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken, verifyRefreshToken, generateAccessToken } from './auth'

export async function getServerSession() {
    try {
        const cookieStore = cookies()
        const accessToken = cookieStore.get('accessToken')?.value
        const refreshToken = cookieStore.get('refreshToken')?.value

        if (!accessToken && !refreshToken) {
            return null
        }

        // Try to use access token first
        if (accessToken) {
            try {
                const payload = verifyToken(accessToken)
                return {
                    user: {
                        id: payload.userId,
                        email: payload.email,
                        role: payload.role,
                    },
                    expires: new Date(payload.exp! * 1000),
                }
            } catch (error) {
                // Access token expired, try to refresh
                if (refreshToken) {
                    try {
                        const newSession = await refreshServerSession(refreshToken)
                        return newSession
                    } catch (refreshError) {
                        console.error('Refresh failed:', refreshError)
                        return null
                    }
                }
                return null
            }
        }

        return null
    } catch (error) {
        console.error('Session error:', error)
        return null
    }
}

async function refreshServerSession(refreshToken: string) {
    try {
        const payload = verifyRefreshToken(refreshToken)

        // Generate new access token
        const newAccessToken = generateAccessToken({
            id: payload.userId,
            email: payload.email,
            role: payload.role,
        })

        // Update the cookie
        const cookieStore = cookies()
        cookieStore.set('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60, // 15 minutes
            path: '/',
        })

        return {
            user: {
                id: payload.userId,
                email: payload.email,
                role: payload.role,
            },
            expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        }
    } catch (error) {
        throw new Error('Failed to refresh session')
    }
}

export async function requireAuth(returnPath?: string) {
    const session = await getServerSession()

    if (!session) {
        const loginUrl = `/login${returnPath ? `?callbackUrl=${encodeURIComponent(returnPath)}` : ''}`
        redirect(loginUrl)
    }

    return session
}

export async function redirectIfAuthenticated() {
    const session = await getServerSession()

    if (session) {
        redirect('/worker/dashboard')
    }
}