import api from './api';
import type { LeaderboardResponse } from '@/components/ranking/types';

export interface LeaderboardFilters {
    start_date?: string;
    end_date?: string;
}

export const LeaderboardService = {
    getLeaderboard: async (filters: LeaderboardFilters = {}): Promise<LeaderboardResponse> => {
        const response = await api.get<LeaderboardResponse>('/api/leaderboard', {
            params: {
                ...(filters.start_date && { start_date: filters.start_date }),
                ...(filters.end_date && { end_date: filters.end_date }),
            },
        });

        return {
            leaderboard: Array.isArray(response.data?.leaderboard) ? response.data.leaderboard : [],
            summary: response.data?.summary,
        };
    },
};
