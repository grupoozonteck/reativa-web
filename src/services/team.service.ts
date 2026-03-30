import api from './api';





export interface Reengagements {
    created_at: string
    deleted_at: string | null
    id: number
    personal_order_id: number | null
    recruiter_id: number
    status: number
    updated_at: string
}
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

export interface SupervisorAttendant {
    id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    login: string;
    name: string;
}

 export interface  ICommissions {
    id: number;
    order_value: number | string;
    value: number | string;
    status: string;
    created_at: string;
}


export interface ManagerAttendant {
    id: number;
    user_id: number;
    type: number;
    graduation: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    revenue: string | number | null;
    sales: number;
    total_reengagements: number;
    conversion: number;
    xp?: number;
    level: string;
    type_label: string;
    graduation_label: string;
    user: {
        id: number;
        name: string;
        login: string;
        personal_data?: {
            avatar: string;
            id: string;
            user_id: string;
        };
    };
    parent: {
        id: number;
        user_id: number;
        type: number;
        type_label: string;
        user: {
            id: number;
            name: string;
            login: string;
        }
    };
    reengagements: Reengagements[],
    commissions: ICommissions[]
   
}

export interface AttendantShowResponse {
    metrics: {
        commissionsReceived: number
        conversionRate: number
        totalAttendances: number
        totalReactivated: number
        TotalSales: number
    };
    attendant: ManagerAttendant;
    types: Record<string, string>;
    graduates: Record<string, string>;

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

export interface AttendantsFilters {
    search?: string;
    type?: number;
    country_code?: string;
    page?: number;
}

export interface AttendantsPaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface createAttendantRe {
    user_login: string;
    supervisor_id: number;
    type: number;
    graduation: number;
}

export interface AttendantsResponse {
    attendants: {
        data: ManagerAttendant[];
        links: AttendantsPaginationLinks;
        meta?: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    types: Record<string, string>;
    supervisors: SupervisorAttendant[];
    graduates: Record<string, string>;
    countries: {
        acronym: string; code: string; name: string
    }[];
}



export const teamService = {
    /** Desempenho da equipe do supervisor logado */
    getSupervisorPerformance: async (): Promise<TeamMemberPerformance[]> => {
        const response = await api.get<TeamMemberPerformance[]>('/api/supervisor/performance');
        return response.data;
    },

    /** Desempenho completo da equipe do gestor logado */
    getManagerPerformance: async (): Promise<ManagerPerformanceResponse> => {
        const response = await api.get<ManagerPerformanceResponse>('/api/manager/performance');
        return response.data;
    },

    /** Cria um novo atendente */

    /** Lista atendentes com filtros e paginação */
    getAttendants: async (filters?: AttendantsFilters): Promise<AttendantsResponse> => {
        const response = await api.get<{ success: boolean; data: AttendantsResponse }>('/api/attendants', {
            params: filters,
        });
        return response.data.data;
    },


    /** Cria um novo atendente */
    createAttendant: async (data: createAttendantRe) => {
        const response = await api.post('/api/attendants/create', data);
        return response.data;
    },

    /** Busca detalhes de um atendente pelo ID */
    getAttendantById: async (id: number): Promise<{ success: boolean; data: AttendantShowResponse }> => {
        const response = await api.get<{ success: boolean; data: AttendantShowResponse }>(`/api/attendants/${id}/show`);
        return response.data;},

};
