import api from './api';

export interface Reengagements {
    created_at: string;
    deleted_at: string | null;
    id: number;
    personal_order_id: number | null;
    recruiter_id: number;
    status: number;
    updated_at: string;
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

export interface SupervisorPerformanceSummary {
    total_revenue: number;
    total_sales: number;
    total_reengagements: number;
    conversion: number;
    xp: number;
    level: string;
}

export interface SupervisorPerformanceResponse {
    summary: SupervisorPerformanceSummary | null;
    members: TeamMemberPerformance[];
}

function normalizeSupervisorPerformanceResponse(payload: unknown): SupervisorPerformanceResponse {
    if (Array.isArray(payload)) {
        return {
            summary: null,
            members: payload as TeamMemberPerformance[],
        };
    }

    if (payload && typeof payload === 'object') {
        const candidate = payload as {
            data?: unknown;
            members?: unknown;
            attendants?: unknown;
            leaderboard?: unknown;
            supervisor?: {
                total_revenue?: number;
                total_sales?: number;
                total_reengagements?: number;
                conversion?: number;
                xp?: number;
                level?: string;
            };
        };

        const summary = candidate.supervisor
            ? {
                total_revenue: Number(candidate.supervisor.total_revenue ?? 0),
                total_sales: Number(candidate.supervisor.total_sales ?? 0),
                total_reengagements: Number(candidate.supervisor.total_reengagements ?? 0),
                conversion: Number(candidate.supervisor.conversion ?? 0),
                xp: Number(candidate.supervisor.xp ?? 0),
                level: candidate.supervisor.level ?? 'Nv.0',
            }
            : null;

        if (Array.isArray(candidate.data)) {
            return {
                summary,
                members: candidate.data as TeamMemberPerformance[],
            };
        }

        if (Array.isArray(candidate.members)) {
            return {
                summary,
                members: candidate.members as TeamMemberPerformance[],
            };
        }

        if (Array.isArray(candidate.attendants)) {
            return {
                summary,
                members: candidate.attendants as TeamMemberPerformance[],
            };
        }

        if (Array.isArray(candidate.leaderboard)) {
            return {
                summary,
                members: candidate.leaderboard as TeamMemberPerformance[],
            };
        }
    }

    return {
        summary: null,
        members: [],
    };
}

export interface SupervisorAttendant {
    id: number;
    user_id: number;
    parent_id: number | null;
    type: number;
    graduation: number;
    type_label: string;
    graduation_label: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    login: string;
    name: string;
}

export interface ICommissions {
    id: number;
    attendant_id?: number;
    order_value: number | string;
    value: number | string;
    status: string;
    created_at: string;
    updated_at?: string;
    deleted_at?: string | null;
    commission_percent?: number | string;
    min_sales?: number | string;
    max_sales?: number | string;
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
        };
    };
    reengagements: Reengagements[];
    commissions: ICommissions[];
    commissions_attendant?: ICommissions[];
}

export interface AttendantShowResponse {
    metrics: {
        commissions_received: number;
        conversion_rate: number;
        total_attendances: number;
        total_reactivated: number;
        total_sales: number;
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

export interface CreateAttendantRe {
    user_login: string;
    supervisor_id: number;
    type: number;
    graduation: number;
}

export interface UpdateAttendantPayload {
    type?: number;
    graduation?: number;
    parent_id?: number | null;
}

export interface CreateAttendantCommissionPayload {
    commission_percent: number;
    min_sales: number;
    max_sales: number;
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
        acronym: string;
        code: string;
        name: string;
    }[];
    gestors?: ManagerAttendant | null;
}

function normalizeAttendantsResponse(payload: AttendantsResponse): AttendantsResponse {
    const attendantsData = Array.isArray(payload.attendants?.data) ? payload.attendants.data : [];
    const gestorFromAttendants = attendantsData.find((attendant) => attendant.type === 1) ?? null;

    return {
        ...payload,
        gestors: payload.gestors ?? gestorFromAttendants,
    };
}

export const teamService = {
    getSupervisorPerformance: async (): Promise<SupervisorPerformanceResponse> => {
        const response = await api.get('/api/supervisor/performance');
        return normalizeSupervisorPerformanceResponse(response.data);
    },

    getManagerPerformance: async (): Promise<ManagerPerformanceResponse> => {
        const response = await api.get<ManagerPerformanceResponse>('/api/manager/performance');
        return response.data;
    },

    getAttendants: async (filters?: AttendantsFilters): Promise<AttendantsResponse> => {
        const response = await api.get<{ success: boolean; data: AttendantsResponse }>('/api/attendants', {
            params: filters,
        });

        return normalizeAttendantsResponse(response.data.data);
    },

    createAttendant: async (data: CreateAttendantRe) => {
        const response = await api.post('/api/attendants/create', data);
        return response.data;
    },

    getAttendantById: async (id: number): Promise<{ success: boolean; data: AttendantShowResponse }> => {
        const response = await api.get<{ success: boolean; data: AttendantShowResponse }>(`/api/attendants/${id}/show`);
        return response.data;
    },

    updateAttendant: async (id: number, data: UpdateAttendantPayload) => {
        const response = await api.post(`/api/attendants/${id}/update`, data);
        return response.data;
    },

    createAttendantCommission: async (id: number, data: CreateAttendantCommissionPayload) => {
        const response = await api.post(`/api/attendants/${id}/commissions/create`, data);
        return response.data;
    },
};
