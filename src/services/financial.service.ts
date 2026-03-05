import api from './api';

export interface CommissionFilters {
    search?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
}

export const financialService = {
    getCommissions: async (params: CommissionFilters = {}) => {
        const response = await api.get('/api/commissions', {
            params: {
                ...(params.search && { search: params.search }),
                ...(params.start_date && { start_date: params.start_date }),
                ...(params.end_date && { end_date: params.end_date }),
                ...(params.page && { page: params.page }),
            },
        });
        return response.data; 

    },
};
