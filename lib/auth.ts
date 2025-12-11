// lib/auth.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

export function generateAccessToken(user: any): string {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '1d' }
    );
}

export function generateRefreshToken(user: any): string {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
        },
        JWT_REFRESH_SECRET,
        { expiresIn: '30d' }
    );
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

export function generateSessionToken(): string {
    return jwt.sign(
        {
            timestamp: Date.now(),
            random: Math.random().toString(36).substring(2)
        },
        JWT_SECRET,
        { expiresIn: '10m' }
    );
}

export function verifyAccessToken(token: string): any {
    try {
        // Debug logging
        // console.log('Verifying token with secret starting with:', JWT_SECRET.substring(0, 5));
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error('Token verification failed in verifyAccessToken:', error);
        return null;
    }
}

export function verifyRefreshToken(token: string): any {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (error) {
        return null;
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

// Cookie Management Functions
export async function setAuthCookies(user: any) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax' as const,
        path: '/',
    };

    // Set access token cookie (short-lived)
    cookies().set('access_token', accessToken, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60, // 1 day
    });

    // Set refresh token cookie (long-lived, more secure)
    cookies().set('refresh_token', refreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return { accessToken, refreshToken };
}

export async function clearAuthCookies() {
    cookies().delete('access_token');
    cookies().delete('refresh_token');
    cookies().delete('token'); // Clear legacy token if exists
}

export async function getAccessToken(): Promise<string | null> {
    try {
        const cookieStore = cookies();
        return cookieStore.get('access_token')?.value || null;
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
}

export async function getRefreshToken(): Promise<string | null> {
    try {
        const cookieStore = cookies();
        return cookieStore.get('refresh_token')?.value || null;
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
            const payload = verifyAccessToken(accessToken);
            if (!payload) {
                throw new Error('Invalid token');
            }
            console.log('User authenticated successfully:', payload.email);
            return {
                id: payload.userId,
                email: payload.email,
                role: payload.role,
            };
        } catch (error) {
            if (error instanceof Error && error.message.includes('expired')) {
                console.log('Access token expired, attempting refresh...');
                // Token expired, try to refresh
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    const payload = verifyAccessToken(newAccessToken);
                    if (payload) {
                        console.log('Token refreshed successfully for user:', payload.email);
                        return {
                            id: payload.userId,
                            email: payload.email,
                            role: payload.role,
                        };
                    }
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
        let payload: any;
        try {
            payload = verifyRefreshToken(refreshToken);
            if (!payload) {
                throw new Error('Invalid refresh token');
            }
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

        const newAccessToken = generateAccessToken(user);

        // Update access token cookie
        const isProduction = process.env.NODE_ENV === 'production';
        cookies().set('access_token', newAccessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60, // 1 day
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
export async function validateToken(token: string): Promise<{ valid: boolean; payload?: any; error?: string }> {
    try {
        const payload = verifyAccessToken(token);
        if (!payload) {
            return { valid: false, error: 'Invalid token' };
        }
        return { valid: true, payload };
    } catch (error: any) {
        return { valid: false, error: error.message };
    }
}

// Validate refresh token
export async function validateRefreshToken(token: string): Promise<{ valid: boolean; payload?: any; error?: string }> {
    try {
        const payload = verifyRefreshToken(token);
        if (!payload) {
            return { valid: false, error: 'Invalid refresh token' };
        }
        return { valid: true, payload };
    } catch (error: any) {
        return { valid: false, error: error.message };
    }
}

// Get user from token
export async function getUserFromToken(token: string): Promise<any | null> {
    try {
        return verifyAccessToken(token);
    } catch (error) {
        console.error('Failed to get user from token:', error);
        return null;
    }
}

// Check if token is about to expire
export async function isTokenExpiringSoon(token: string, thresholdMinutes: number = 5): Promise<boolean> {
    try {
        const payload = verifyAccessToken(token);
        if (!payload || !payload.exp) return false;

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
            const payload = verifyAccessToken(accessToken);
            accessTokenValid = !!payload;
        } catch (error) {
            accessTokenValid = false;
        }
    }

    if (refreshToken) {
        try {
            const payload = verifyRefreshToken(refreshToken);
            refreshTokenValid = !!payload;
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

// Add this to your .env file:
// JWT_SECRET=your-super-secret-key-change-in-production
// JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production