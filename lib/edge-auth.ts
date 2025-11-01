// lib/edge-auth.ts
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-change-in-production'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production'

const getJwtSecretKey = () => {
    const secret = new TextEncoder().encode(JWT_SECRET)
    if (secret.length === 0) {
        throw new Error('JWT_SECRET is not set')
    }
    return secret
}

const getJwtRefreshSecretKey = () => {
    const secret = new TextEncoder().encode(JWT_REFRESH_SECRET)
    if (secret.length === 0) {
        throw new Error('JWT_REFRESH_SECRET is not set')
    }
    return secret
}

export async function verifyTokenEdge(token: string) {
    try {
        const { payload } = await jwtVerify(token, getJwtSecretKey())
        return {
            userId: payload.userId as string,
            email: payload.email as string,
            role: payload.role as string,
            iat: payload.iat as number,
            exp: payload.exp as number,
        }
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('expired')) {
                throw new Error('Token expired')
            }
            throw new Error('Invalid token')
        }
        throw error
    }
}

export async function verifyRefreshTokenEdge(token: string) {
    try {
        const { payload } = await jwtVerify(token, getJwtRefreshSecretKey())
        return {
            userId: payload.userId as string,
            email: payload.email as string,
            role: payload.role as string,
            iat: payload.iat as number,
            exp: payload.exp as number,
        }
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('expired')) {
                throw new Error('Refresh token expired')
            }
            throw new Error('Invalid refresh token')
        }
        throw error
    }
}

export async function validateTokenForMiddleware(token: string): Promise<{ valid: boolean; error?: string }> {
    if (!token) {
        return { valid: false, error: 'No token provided' }
    }

    // Basic JWT format validation
    const parts = token.split('.')
    if (parts.length !== 3) {
        return { valid: false, error: 'Invalid token format' }
    }

    try {
        await verifyTokenEdge(token)
        return { valid: true }
    } catch (error: any) {
        return { valid: false, error: error.message }
    }
}

export async function validateRefreshTokenForMiddleware(token: string): Promise<{ valid: boolean; error?: string }> {
    if (!token) {
        return { valid: false, error: 'No refresh token provided' }
    }

    const parts = token.split('.')
    if (parts.length !== 3) {
        return { valid: false, error: 'Invalid refresh token format' }
    }

    try {
        await verifyRefreshTokenEdge(token)
        return { valid: true }
    } catch (error: any) {
        return { valid: false, error: error.message }
    }
}