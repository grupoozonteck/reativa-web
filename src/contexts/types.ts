import type {
    LoginCredentials,
    User,
    Attendant,
} from '../services/auth.service';

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    attendant: Attendant | null;
    userType: number | undefined;
    loginFunction: (credentials: LoginCredentials) => Promise<void>;
    logoutFunction: () => Promise<void>;
}
