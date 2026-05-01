import api from './api';

export interface Reengagements {
    created_at: string;
    deleted_at: string | null;
    id: number;
    user_id: number;
    leader_id: number | null;
    personal_order_id: number | null;
    recruiter_id: number;
    status: number;
    updated_at: string;
    user?: {
        id: number;
        login: string;
        name: string;
        email: string;
    };
    recruiter?: {
        id: number;
        name: string;
        login: string;
    };
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

export interface PerformanceFilters {
    start_date?: string;
    end_date?: string;
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

export interface AttendantLeaderOption {
    id: number;
    user_id: number;
    type?: number;
    graduation?: number;
    type_label?: string;
    graduation_label?: string;
    name: string;
    login: string;
    user: {
        id: number;
        name: string;
        login: string;
        status?: number | null;
    };
    status?: number | null;
}

export interface ICommissions {
    id: number;
    user_id?: number;
    attendant_id?: number;
    order_id?: number | null;
    order_value: number | string;
    value: number | string;
    status: string;
    created_at: string;
    updated_at?: string;
    deleted_at?: string | null;
    description_extra?: string;
    commission_percent?: number | string;
    min_sales?: number | string;
    max_sales?: number | string;
}

export interface AttendantDetailFilters {
    start_date?: string;
    end_date?: string;
}

export interface ManagerAttendant {
    id: number;
    user_id: number;
    status?: number | null;
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
        status?: number | null;
        personal_data?: {
            avatar: string;
            id: string;
            user_id: string;
        };
    };
    parent: {
        id: number;
        user_id: number;
        status?: number | null;
        type: number;
        type_label: string;
        user: {
            id: number;
            name: string;
            login: string;
            status?: number | null;
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
        total_orders: number;
        total_order_value: number;
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
        status?: number | null;
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
    status?: number | null;
    type?: number;
    graduation?: number;
    parent_id?: number | null;
}

export interface CreateAttendantCommissionPayload {
    commission_percent: number;
    min_sales: number;
    max_sales: number;
}

export interface UpdateAttendantCommissionPayload {
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
}

function extractListFromResponse(payload: unknown): unknown[] {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (payload && typeof payload === 'object') {
        const candidate = payload as {
            data?: unknown;
            supervisors?: unknown;
            managers?: unknown;
            attendants?: unknown;
        };

        if (Array.isArray(candidate.data)) return candidate.data;
        if (Array.isArray(candidate.supervisors)) return candidate.supervisors;
        if (Array.isArray(candidate.managers)) return candidate.managers;
        if (Array.isArray(candidate.attendants)) return candidate.attendants;
    }

    return [];
}

function normalizeLeaderOption(payload: unknown): AttendantLeaderOption | null {
    if (!payload || typeof payload !== 'object') {
        return null;
    }

    const candidate = payload as {
        id?: number | string;
        user_id?: number | string;
        type?: number;
        graduation?: number;
        type_label?: string;
        graduation_label?: string;
        name?: string;
        login?: string;
        user?: {
            id?: number | string;
            name?: string;
            login?: string;
            status?: number | null;
        };
        status?: number | null;
    };

    const rawId = candidate.id ?? candidate.user_id ?? candidate.user?.id;
    const numericId = Number(rawId);
    const rawUserId = candidate.user_id ?? candidate.user?.id ?? candidate.id;
    const numericUserId = Number(rawUserId);
    const name = candidate.name ?? candidate.user?.name ?? '';
    const login = candidate.login ?? candidate.user?.login ?? '';
    const status = typeof candidate.status === 'number' ? candidate.status : null;

    if (Number.isNaN(numericId) || !name || !login) {
        return null;
    }

    return {
        id: numericId,
        user_id: Number.isNaN(numericUserId) ? numericId : numericUserId,
        type: candidate.type,
        graduation: candidate.graduation,
        type_label: candidate.type_label,
        graduation_label: candidate.graduation_label,
        name,
        login,
        status,
        user: {
            id: Number.isNaN(Number(candidate.user?.id)) ? (Number.isNaN(numericUserId) ? numericId : numericUserId) : Number(candidate.user?.id),
            name,
            login,
            status,
        },
    };
}

function normalizeLeaderOptions(payload: unknown): AttendantLeaderOption[] {
    return extractListFromResponse(payload)
        .map(normalizeLeaderOption)
        .filter((leader): leader is AttendantLeaderOption => leader !== null);
}

export const teamService = {
    getSupervisorPerformance: async (filters: PerformanceFilters = {}): Promise<SupervisorPerformanceResponse> => {
        const response = await api.get('/api/supervisor/performance', {
            params: {
                ...(filters.start_date && { start_date: filters.start_date }),
                ...(filters.end_date && { end_date: filters.end_date }),
            },
        });
        return normalizeSupervisorPerformanceResponse(response.data);
    },

    getManagerPerformance: async (filters: PerformanceFilters = {}): Promise<ManagerPerformanceResponse> => {
        const response = await api.get<ManagerPerformanceResponse>('/api/manager/performance', {
            params: {
                ...(filters.start_date && { start_date: filters.start_date }),
                ...(filters.end_date && { end_date: filters.end_date }),
            },
        });
        return response.data;
    },

    getAttendants: async (filters?: AttendantsFilters): Promise<AttendantsResponse> => {
        const response = await api.get<{ success: boolean; data: AttendantsResponse }>('/api/attendants', {
            params: filters,
        });

        return response.data.data;
    },

    getAttendantSupervisors: async (): Promise<AttendantLeaderOption[]> => {
        const response = await api.get('/api/attendants/supervisors');
        return normalizeLeaderOptions(response.data?.data ?? response.data);
    },

    getAttendantManagers: async (): Promise<AttendantLeaderOption[]> => {
        const response = await api.get('/api/attendants/managers');
        return normalizeLeaderOptions(response.data?.data ?? response.data);
    },

    getAttendantFormSupport: async (): Promise<{
        supervisors: AttendantLeaderOption[];
        gestor: AttendantLeaderOption | null;
    }> => {
        const [supervisors, managers] = await Promise.all([
            teamService.getAttendantSupervisors(),
            teamService.getAttendantManagers(),
        ]);

        return {
            supervisors,
            gestor: managers[0] ?? null,
        };
    },

    createAttendant: async (data: CreateAttendantRe) => {
        const response = await api.post('/api/attendants/create', data);
        return response.data;
    },

    getAttendantById: async (id: number, filters: AttendantDetailFilters = {}): Promise<{ success: boolean; data: AttendantShowResponse }> => {
        const response = await api.get<{ success: boolean; data: AttendantShowResponse }>(`/api/attendants/${id}/show`, {
            params: {
                ...(filters.start_date && { start_date: filters.start_date }),
                ...(filters.end_date && { end_date: filters.end_date }),
            },
        });
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

    updateAttendantCommission: async (commissionId: number, data: UpdateAttendantCommissionPayload) => {
        const response = await api.post(`/api/commissions/${commissionId}/update`, data);
        return response.data;
    },

    deleteAttendantCommission: async (commissionId: number) => {
        const response = await api.post(`/api/commissions/${commissionId}/delete`);
        return response.data;
    },
};
