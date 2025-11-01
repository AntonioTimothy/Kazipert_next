// lib/auth.ts
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-change-in-production'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production'

const getJwtSecretKey = () => {
    return new TextEncoder().encode(JWT_SECRET)
}

const getJwtRefreshSecretKey = () => {
    return new TextEncoder().encode(JWT_REFRESH_SECRET)
}

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

// Password hashing function
export async function hashPassword(password: string): Promise<string> {
    try {
        const saltRounds = 12; // Good balance between security and performance
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Failed to hash password');
    }
}

// Password verification function
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        const isValid = await bcrypt.compare(password, hashedPassword);
        return isValid;
    } catch (error) {
        console.error('Error verifying password:', error);
        throw new Error('Failed to verify password');
    }
}

// Generate random password (useful for admin creation)
export function generateRandomPassword(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;
}

// Validate password strength
export function validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/(?=.*\d)/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export async function generateAccessToken(user: any): Promise<string> {
    const token = await new SignJWT({
        userId: user.id,
        email: user.email,
        role: user.role,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('15m')
        .sign(getJwtSecretKey())

    return token
}

export async function generateRefreshToken(user: any): Promise<string> {
    const token = await new SignJWT({
        userId: user.id,
        email: user.email,
        role: user.role,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(getJwtRefreshSecretKey())

    return token
}

export async function verifyToken(token: string): Promise<TokenPayload> {
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

export async function verifyRefreshToken(token: string): Promise<TokenPayload> {
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

// Cookie Management Functions
export async function setAuthCookies(user: any) {
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax' as const,
        path: '/',
    };

    // Set access token cookie (short-lived)
    cookies().set('accessToken', accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60, // 15 minutes
    });

    // Set refresh token cookie (long-lived, more secure)
    cookies().set('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return { accessToken, refreshToken };
}

export async function clearAuthCookies() {
    cookies().delete('accessToken');
    cookies().delete('refreshToken');
    cookies().delete('token'); // Clear legacy token if exists
}

export async function getAccessToken(): Promise<string | null> {
    try {
        const cookieStore = cookies();
        return cookieStore.get('accessToken')?.value || null;
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
}

export async function getRefreshToken(): Promise<string | null> {
    try {
        const cookieStore = cookies();
        return cookieStore.get('refreshToken')?.value || null;
    } catch (error) {
        console.error('Error getting refresh token:', error);
        return null;
    }
}

// Enhanced user verification with token refresh
export async function getCurrentUser() {
    try {
        let accessToken = await getAccessToken();

        // If no access token, try to use refresh token
        if (!accessToken) {
            console.log('No access token found, attempting refresh...');
            accessToken = await refreshAccessToken();
            if (!accessToken) {
                console.log('Token refresh failed, no user session');
                return null;
            }
        }

        // Verify the access token
        try {
            const payload = await verifyToken(accessToken);
            console.log('User authenticated successfully:', payload.email);
            return {
                id: payload.userId,
                email: payload.email,
                role: payload.role,
            };
        } catch (error) {
            if (error instanceof Error && error.message === 'Token expired') {
                console.log('Access token expired, attempting refresh...');
                // Token expired, try to refresh
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    const payload = await verifyToken(newAccessToken);
                    console.log('Token refreshed successfully for user:', payload.email);
                    return {
                        id: payload.userId,
                        email: payload.email,
                        role: payload.role,
                    };
                }
            }
            console.error('Token verification failed:', error);
            return null;
        }
    } catch (error) {
        console.error('Failed to get current user:', error);
        return null;
    }
}

// Token refresh functionality
export async function refreshAccessToken(): Promise<string | null> {
    try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
            console.log('No refresh token available for refresh');
            return null;
        }

        console.log('Attempting to refresh access token...');

        // Verify refresh token
        let payload: TokenPayload;
        try {
            payload = await verifyRefreshToken(refreshToken);
        } catch (error) {
            console.error('Refresh token verification failed:', error);
            await clearAuthCookies();
            return null;
        }

        // Generate new access token
        const user = {
            id: payload.userId,
            email: payload.email,
            role: payload.role,
        };

        const newAccessToken = await generateAccessToken(user);

        // Update access token cookie
        const isProduction = process.env.NODE_ENV === 'production';
        cookies().set('accessToken', newAccessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 15 * 60,
            path: '/',
        });

        console.log('Access token refreshed successfully for user:', user.email);
        return newAccessToken;
    } catch (error) {
        console.error('Token refresh failed:', error);
        await clearAuthCookies();
        return null;
    }
}

// Utility function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser();
    return !!user;
}

// Get user role for authorization
export async function getUserRole(): Promise<string | null> {
    const user = await getCurrentUser();
    return user?.role || null;
}

// Validate token without refreshing
export async function validateToken(token: string): Promise<{ valid: boolean; payload?: TokenPayload; error?: string }> {
    try {
        const payload = await verifyToken(token);
        return { valid: true, payload };
    } catch (error: any) {
        return { valid: false, error: error.message };
    }
}

// Validate refresh token
export async function validateRefreshToken(token: string): Promise<{ valid: boolean; payload?: TokenPayload; error?: string }> {
    try {
        const payload = await verifyRefreshToken(token);
        return { valid: true, payload };
    } catch (error: any) {
        return { valid: false, error: error.message };
    }
}

// Get user from token
export async function getUserFromToken(token: string): Promise<TokenPayload | null> {
    try {
        return await verifyToken(token);
    } catch (error) {
        console.error('Failed to get user from token:', error);
        return null;
    }
}

// Check if token is about to expire
export async function isTokenExpiringSoon(token: string, thresholdMinutes: number = 5): Promise<boolean> {
    try {
        const payload = await verifyToken(token);
        if (!payload.exp) return false;

        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = payload.exp - now;
        const thresholdSeconds = thresholdMinutes * 60;

        return timeUntilExpiry <= thresholdSeconds;
    } catch (error) {
        return true;
    }
}

// Debug function to check auth state
export async function debugAuthState(): Promise<{
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    user: any;
    accessTokenValid: boolean;
    refreshTokenValid: boolean;
}> {
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();
    const user = await getCurrentUser();

    let accessTokenValid = false;
    let refreshTokenValid = false;

    if (accessToken) {
        try {
            await verifyToken(accessToken);
            accessTokenValid = true;
        } catch (error) {
            accessTokenValid = false;
        }
    }

    if (refreshToken) {
        try {
            await verifyRefreshToken(refreshToken);
            refreshTokenValid = true;
        } catch (error) {
            refreshTokenValid = false;
        }
    }

    return {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        user,
        accessTokenValid,
        refreshTokenValid,
    };
}