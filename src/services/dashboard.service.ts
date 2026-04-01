import api from './api';

export interface DashboardStats {
    inactive_customers: number;
    monthly_revenue: number;
    active_attendants: number;
    conversion_rate: number;
}

export interface DashboardTopAttendant {
    id?: number;
    user_id?: number;
    type?: number;
    user: {
        name: string;
        personal_data?: {
            avatar: string | null;
        };
    };
    revenue: number;
    sales: number;
    conversion: number;
}

export interface InactiveClientsSummary {
    never_bought: number;
    plus_90_days: number;
    already_assigned: number;
}

export interface RecentSale {
    attendant_name: string;
    customer_name: string;
    value: number;
    type: string;
    created_at?: string;
}

export interface DashboardData {
    stats: DashboardStats;
    top_attendants: DashboardTopAttendant[];
    inactive_clients_summary: InactiveClientsSummary;
    recent_sales: RecentSale[];
}

interface DashboardResponseWrapper {
    data?: DashboardData;
}

function toNumber(value: unknown): number {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
}

function normalizeTopAttendant(item: unknown): DashboardTopAttendant {
    const obj = (item ?? {}) as Record<string, unknown>;
    const userObj = (obj.user ?? {}) as Record<string, unknown>;
    const userName = typeof userObj.name === 'string' && userObj.name.trim() ? userObj.name : 'Atendente';

    return {
        id: toNumber(obj.id),
        user_id: toNumber(obj.user_id),
        type: toNumber(obj.type),
        user: {
            name: userName,
            personal_data: (userObj.personal_data as { avatar: string | null } | undefined) ?? undefined,
        },
        revenue: toNumber(obj.revenue),
        sales: toNumber(obj.sales),
        conversion: toNumber(obj.conversion),
    };
}

function normalizeRecentSale(item: unknown): RecentSale {
    const obj = (item ?? {}) as Record<string, unknown>;

    return {
        attendant_name: typeof obj.attendant_name === 'string' ? obj.attendant_name : 'Atendente',
        customer_name: typeof obj.customer_name === 'string' ? obj.customer_name : 'Cliente',
        value: toNumber(obj.value),
        type: typeof obj.type === 'string' ? obj.type : 'Venda',
        created_at: typeof obj.created_at === 'string' ? obj.created_at : undefined,
    };
}

export const dashboardService = {
    getDashboard: async (): Promise<DashboardData> => {
        const response = await api.get<DashboardData | DashboardResponseWrapper>('/api/dashboard');
        const dataOrWrapper = response.data as DashboardData | DashboardResponseWrapper;
        const payload: Partial<DashboardData> = 'stats' in dataOrWrapper
            ? (dataOrWrapper as DashboardData)
            : ((dataOrWrapper as DashboardResponseWrapper).data ?? {});

        return {
            stats: {
                inactive_customers: toNumber(payload.stats?.inactive_customers),
                monthly_revenue: toNumber(payload.stats?.monthly_revenue),
                active_attendants: toNumber(payload.stats?.active_attendants),
                conversion_rate: toNumber(payload.stats?.conversion_rate),
            },
            top_attendants: Array.isArray(payload.top_attendants)
                ? payload.top_attendants.map(normalizeTopAttendant)
                : [],
            inactive_clients_summary: {
                never_bought: toNumber(payload.inactive_clients_summary?.never_bought),
                plus_90_days: toNumber(payload.inactive_clients_summary?.plus_90_days),
                already_assigned: toNumber(payload.inactive_clients_summary?.already_assigned),
            },
            recent_sales: Array.isArray(payload.recent_sales)
                ? payload.recent_sales.map(normalizeRecentSale)
                : [],
        };
    },


};
