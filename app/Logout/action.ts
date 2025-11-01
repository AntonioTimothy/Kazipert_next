// app/logout/action.ts
'use server'

import { clearAuthCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function logoutAction() {
    await clearAuthCookies();
    redirect('/login');
}