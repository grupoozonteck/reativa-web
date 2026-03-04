import api from './api';

export interface LoginCredentials {
    login: string;
    password: string;
}

export interface Attendant {
    id: number;
    user_id: number;
    type: number;
    type_label: string;
    graduation_label: string | null;
}

export interface UserData {
    id: number;
    uuid: string;
    name: string;
    email: string;
    attendants: Attendant;
}

export interface User extends UserData {
    [key: string]: unknown;
}

export interface LoginResponse {
    token: string;
}

export const authService = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/api/login', credentials);
        return response.data;
    },

    logout: async (): Promise<void> => {
        try {
            await api.post('/api/logout');
        } catch {
            // Mesmo se falhar no servidor, limpamos no local no context
        }
    },

    getUser: async (): Promise<User> => {
        const response = await api.get<User>('/api/user');
        return response.data.user as unknown as User;
    },
};
