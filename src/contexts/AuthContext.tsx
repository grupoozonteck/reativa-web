import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { authService, type LoginCredentials, type User } from '../services/auth.service';
import { AuthContext } from './context';

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
    const attendant = useMemo(() => user?.attendants ?? null, [user]);
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
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                })
                .finally(() => setIsLoading(false));
        }
    }, [token, user]);

    const loginFunction = useCallback(async (credentials: LoginCredentials) => {
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
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
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
