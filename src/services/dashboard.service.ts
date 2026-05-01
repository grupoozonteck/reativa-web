import api from './api';

export interface DashboardStats {
    inactive_customers: number;
    monthly_revenue: number | string;
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
    revenue: number | string;
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

export interface DashboardFilters {
    start_date?: string;
    end_date?: string;
}

export const dashboardService = {
    getDashboard: async (filters: DashboardFilters = {}): Promise<DashboardData> => {
        const response = await api.get<{ data?: DashboardData } | DashboardData>('/api/dashboard', {
            params: {
                ...(filters.start_date && { start_date: filters.start_date }),
                ...(filters.end_date && { end_date: filters.end_date }),
            },
        });
        const payload = ('data' in response.data && response.data.data)
            ? response.data.data
            : response.data as DashboardData;

        return payload;
    },
};
