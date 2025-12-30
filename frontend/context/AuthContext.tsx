'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi, LoginCredentials, RegisterCredentials } from '@/lib/api';

interface AuthContextType {
    user: any | null;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterCredentials) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check for token on mount
        const isAuthenticated = authApi.isAuthenticated();
        if (isAuthenticated) {
            setUser({ authenticated: true }); // Simple user state for now
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            await authApi.login(credentials);
            setUser({ authenticated: true });
            router.push('/');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (data: RegisterCredentials) => {
        try {
            await authApi.register(data);
            // Auto login after register? Or redirect to login?
            // Let's redirect to login for clarity
            router.push('/login?registered=true');
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
        router.push('/login');
    };

    // Protect routes
    useEffect(() => {
        const publicRoutes = ['/login', '/register'];
        if (!isLoading && !user && !publicRoutes.includes(pathname)) {
            router.push('/login');
        }
    }, [user, isLoading, pathname, router]);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
