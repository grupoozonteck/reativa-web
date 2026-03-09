import api from './api';

export interface TeamMemberPerformance {
    id: number;
    user_id: number;
    type: number;
    graduation: number;
    parent_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    revenue: number | null;
    sales: number;
    total_reengagements: number;
    conversion: number;
    xp: number;
    level: string;
    type_label: string;
    graduation_label: string;
    user: {
        id: number;
        name: string;
        login: string;
    };
}

export interface ManagerAttendant {
    id: number;
    user_id: number;
    type: number;
    graduation: number;
    parent_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    revenue: string | number | null;
    sales: number;
    total_reengagements: number;
    conversion: number;
    xp: number;
    level: string;
    type_label: string;
    graduation_label: string;
    user: {
        id: number;
        name: string;
        login: string;
    };
}

export interface ManagerSupervisor {
    id: number;
    user_id: number;
    type: number;
    graduation: number;
    parent_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    revenue: number | null;
    sales: number;
    total_reengagements: number;
    conversion: number;
    xp: number;
    level: string;
    type_label: string;
    graduation_label: string;
    user: {
        id: number;
        name: string;
        login: string;
    };
    attendants: ManagerAttendant[];
}

export interface ManagerPerformanceResponse {
    summary: {
        total_revenue: number;
        total_sales: number;
        total_reengagements: number;
        total_conversion: number;
    };
    supervisors: ManagerSupervisor[];
}

export const teamService = {
    /** Desempenho da equipe do supervisor logado */
    getSupervisorPerformance: async (): Promise<TeamMemberPerformance[]> => {
        const response = await api.get<TeamMemberPerformance[]>('/api/supervisor/performance');
        console.log('Supervisor Performance Response:', response);
        return response.data;
    },

    /** Desempenho completo da equipe do gestor logado */
    getManagerPerformance: async (): Promise<ManagerPerformanceResponse> => {
        const response = await api.get<ManagerPerformanceResponse>('/api/manager/performance');
        return response.data;
    },
};
