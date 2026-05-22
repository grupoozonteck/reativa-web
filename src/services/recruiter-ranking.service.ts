import api from './api';

export interface RecruiterRankingFilters {
    start_date?: string;
    end_date?: string;
    ranking_type?: 0 | 1;
}

export interface RecruiterRankingEntry {
    recruiter_quantity: number;
    total_sale: number;
    name: string;
    avatar: string | null;
    login: string;
    last_recruiter: string | null;
}

function normalizeRecruiterRankingEntry(
    payload: unknown,
): RecruiterRankingEntry | null {
    if (!payload || typeof payload !== 'object') return null;

    const candidate = payload as Record<string, unknown>;
    const name =
        typeof candidate.name === 'string' ? candidate.name.trim() : '';
    const login =
        typeof candidate.login === 'string' ? candidate.login.trim() : '';

    if (!name || !login) return null;

    return {
        recruiter_quantity: Number(candidate.recruiter_quantity ?? 0),
        total_sale: Number(candidate.total_sale ?? 0),
        name,
        avatar:
            typeof candidate.avatar === 'string' && candidate.avatar.length > 0
                ? candidate.avatar
                : null,
        login,
        last_recruiter:
            typeof candidate.last_recruiter === 'string' &&
            candidate.last_recruiter.length > 0
                ? candidate.last_recruiter
                : null,
    };
}

function normalizeRecruiterRankingResponse(payload: unknown) {
    const rawList = Array.isArray(payload)
        ? payload
        : Array.isArray((payload as { data?: unknown[] })?.data)
          ? ((payload as { data: unknown[] }).data ?? [])
          : Array.isArray((payload as { recruiters?: unknown[] })?.recruiters)
            ? ((payload as { recruiters: unknown[] }).recruiters ?? [])
            : [];

    return rawList
        .map(normalizeRecruiterRankingEntry)
        .filter((entry): entry is RecruiterRankingEntry => entry !== null);
}

export const recruiterRankingService = {
    getRanking: async (
        filters: RecruiterRankingFilters = {},
    ): Promise<RecruiterRankingEntry[]> => {
        const response = await api.get('/api/top-leaders', {
            params: {
                ...(filters.start_date && { start_date: filters.start_date }),
                ...(filters.end_date && { end_date: filters.end_date }),
                ...(filters.ranking_type !== undefined && {
                    ranking_type: filters.ranking_type,
                }),
            },
        });

        return normalizeRecruiterRankingResponse(response.data);
    },
};
