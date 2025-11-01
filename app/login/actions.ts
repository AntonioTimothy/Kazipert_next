// app/login/actions.ts
'use server'

import { setAuthCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        // Validate credentials with your backend
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const user = await response.json();

        // Set auth cookies
        await setAuthCookies(user);

        // Redirect to onboarding
        redirect('/worker-onboarding');
    } catch (error) {
        console.error('Login error:', error);
        return { error: 'Invalid credentials' };
    }
}