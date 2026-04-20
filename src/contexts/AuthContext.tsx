import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { authService, type LoginCredentials, type User } from '../services/auth.service';
import { AuthContext } from './context';
import { queryClient } from '../lib/queryClient';

async function clearSessionCache() {
    await queryClient.cancelQueries();
    queryClient.clear();
}

function clearStoredSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(() => {
        const t = localStorage.getItem('token');
        const u = localStorage.getItem('user');
        return !!t && !u;
    });

    const isAuthenticated = !!token && !!user;

    // Dados do attendant derivados do user
    const attendant = useMemo(() => user?.attendant ?? null, [user]);
    const userType = useMemo(() => attendant?.type, [attendant]);

    useEffect(() => {
        if (token && !user) {
            authService
                .getUser()
                .then((userData) => {
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                })
                .catch(() => {
                    setToken(null);
                    setUser(null);
                    clearStoredSession();
                    void clearSessionCache();
                })
                .finally(() => setIsLoading(false));
        }
    }, [token, user]);

    const loginFunction = useCallback(async (credentials: LoginCredentials) => {
        await clearSessionCache();

        const response = await authService.login(credentials);

        // Salva o token primeiro
        setToken(response.token);
        localStorage.setItem('token', response.token);

        // Busca dados do usuário com o token
        const userData = await authService.getUser();

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    }, []);

    const logoutFunction = useCallback(async () => {
        try {
            await authService.logout();
        } finally {
            await clearSessionCache();
            setToken(null);
            setUser(null);
            clearStoredSession();
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                isLoading,
                attendant,
                userType,
                loginFunction,
                logoutFunction,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
