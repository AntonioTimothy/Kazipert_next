// lib/auth.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';

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
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
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

// Add this to your .env file:
// JWT_SECRET=your-super-secret-key-change-in-production
// JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production


// old functions

