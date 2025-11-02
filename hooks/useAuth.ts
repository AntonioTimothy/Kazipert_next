// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me', {
                credentials: 'include'
            });

            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setUser(null);
            router.push('/login');
        }
    };

    return {
        user,
        loading,
        logout,
        isAuthenticated: !!user,
        isSuperAdmin: user?.role === 'SUPER_ADMIN',
        isAdmin: ['ADMIN', 'SUPER_ADMIN'].includes(user?.role || ''),
    };
}