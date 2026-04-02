import api from './api';
import type { LeaderboardResponse } from '@/components/ranking/types';

export const LeaderboardService = {
    getLeaderboard: async (): Promise<LeaderboardResponse> => {
        const response = await api.get<LeaderboardResponse>('/api/leaderboard');

        return {
            leaderboard: Array.isArray(response.data?.leaderboard) ? response.data.leaderboard : [],
            summary: response.data?.summary,
        };
    },
};