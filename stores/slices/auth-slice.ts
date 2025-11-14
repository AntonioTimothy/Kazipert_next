// stores/slices/auth-slice.ts
import { StateCreator } from 'zustand';
import { AuthState, User } from '../types';

export const createAuthSlice: StateCreator<
    AuthState,
    [],
    [],
    AuthState
> = (set, get) => ({
    // State
    user: null,
    isAuthenticated: false,
    token: null,
    refreshToken: null,
    loginLoading: false,
    registerLoading: false,
    logoutLoading: false,

    // ✅ ADD THIS: setUser function
    setUser: (user: User | null) => {
        console.log('Setting user in store:', user);
        set({
            user,
            isAuthenticated: !!user
        });

        // Optional: Also save to localStorage for persistence
        if (user) {
            localStorage.setItem('kazipert_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('kazipert_user');
        }
    },

    setToken: (token: string | null) => {
        set({ token });
        if (token) {
            localStorage.setItem('kazipert_token', token);
        } else {
            localStorage.removeItem('kazipert_token');
        }
    },

    setRefreshToken: (refreshToken: string | null) => {
        set({ refreshToken });
        if (refreshToken) {
            localStorage.setItem('kazipert_refresh_token', refreshToken);
        } else {
            localStorage.removeItem('kazipert_refresh_token');
        }
    },

    login: async (email: string, password: string, rememberMe: boolean = false) => {
        set({ loginLoading: true });

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, rememberMe }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Save user to store
            if (data.user) {
                set({
                    user: data.user,
                    isAuthenticated: true,
                    token: data.token,
                    refreshToken: data.refreshToken
                });

                // Save to localStorage for persistence
                localStorage.setItem('kazipert_user', JSON.stringify(data.user));
                if (data.token) {
                    localStorage.setItem('kazipert_token', data.token);
                }
                if (data.refreshToken) {
                    localStorage.setItem('kazipert_refresh_token', data.refreshToken);
                }
            }

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            set({ loginLoading: false });
        }
    },

    logout: async () => {
        set({ logoutLoading: true });

        try {
            // Call logout API
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${get().token}`,
                    'Content-Type': 'application/json'
                },
            });
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            // Clear store state
            set({
                user: null,
                isAuthenticated: false,
                token: null,
                refreshToken: null,
                logoutLoading: false
            });

            // Clear localStorage
            localStorage.removeItem('kazipert_user');
            localStorage.removeItem('kazipert_token');
            localStorage.removeItem('kazipert_refresh_token');
        }
    },

    register: async (userData: any) => {
        set({ registerLoading: true });

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally {
            set({ registerLoading: false });
        }
    },

    initializeAuth: async () => {
        try {
            // Check if user exists in localStorage
            const storedUser = localStorage.getItem('kazipert_user');
            const storedToken = localStorage.getItem('kazipert_token');

            if (storedUser && storedToken) {
                const user = JSON.parse(storedUser);
                set({
                    user,
                    isAuthenticated: true,
                    token: storedToken,
                    refreshToken: localStorage.getItem('kazipert_refresh_token')
                });

                // Optional: Validate token with backend
                try {
                    const response = await fetch('/api/auth/validate', {
                        headers: {
                            'Authorization': `Bearer ${storedToken}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Token validation failed');
                    }
                } catch (error) {
                    // Token is invalid, clear stored data
                    set({
                        user: null,
                        isAuthenticated: false,
                        token: null,
                        refreshToken: null
                    });
                    localStorage.removeItem('kazipert_user');
                    localStorage.removeItem('kazipert_token');
                    localStorage.removeItem('kazipert_refresh_token');
                }
            }
        } catch (error) {
            console.error('Auth initialization error:', error);
            // Clear invalid data
            set({
                user: null,
                isAuthenticated: false,
                token: null,
                refreshToken: null
            });
        }
    },

    refreshToken: async () => {
        const refreshToken = get().refreshToken;
        if (!refreshToken) throw new Error('No refresh token available');

        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Token refresh failed');
            }

            set({
                token: data.token,
                refreshToken: data.refreshToken
            });

            localStorage.setItem('kazipert_token', data.token);
            if (data.refreshToken) {
                localStorage.setItem('kazipert_refresh_token', data.refreshToken);
            }

            return data.token;
        } catch (error) {
            // Refresh failed, logout user
            get().logout();
            throw error;
        }
    },

    updateUserProfile: async (profileData: any) => {
        const { user, token } = get();
        if (!user || !token) throw new Error('Not authenticated');

        try {
            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Profile update failed');
            }

            // Update user in store
            if (data.user) {
                set({ user: data.user });
                localStorage.setItem('kazipert_user', JSON.stringify(data.user));
            }

            return data;
        } catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    },
});