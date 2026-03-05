export interface LeaderboardUser {
    id: number;
    name: string;
    login: string;
    personal_data?: {
        avatar: string | null;
    };
}

export interface LeaderboardEntry {
    id: number;
    user_id: number;
    user: LeaderboardUser;
    sales: number;
    revenue: string | null;
    conversion: number;
    total_reengagements: number;
    xp: number;
    level: string;
    graduation: number;
    graduation_label: string;
    type: number;
    type_label: string;
    parent_id: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
