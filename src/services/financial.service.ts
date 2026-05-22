import api from './api';

export interface CommissionFilters {
    login?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    without_leader?: boolean;
}

export const financialService = {
    getCommissions: async (params: CommissionFilters = {}) => {
        const response = await api.get('/api/commissions', {
            params: {
                ...(params.login && { login: params.login }),
                ...(params.start_date && { start_date: params.start_date }),
                ...(params.end_date && { end_date: params.end_date }),
                ...(params.page && { page: params.page }),
                ...(params.without_leader && { without_leader: true }),
            },
        });
        return response.data;
    },
};
