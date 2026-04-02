import api from './api';

// === Tipos baseados na API real /api/reengagements ===

export interface PersonalData {
    id: number;
    user_id: number;
    whatsapp_phone_code: string | null;
    whatsapp: string | null;
    phone_code: string | null;
    phone_number: string | null;
    email_secondary: string | null;
    gender: string | null;
    birth_date: string | null;
    avatar: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface ReengagementUser {
    id: number;
    login: string;
    name: string;
    email: string;
    created_at: string;
    country_code: string;
    total_orders: number;
    paid_orders: number;
    personal_data: PersonalData;
}

export interface ReengagementMetrics {
    totalInProgress: number;
    totalReactivated: number;
}

export interface ReengagementPagination {
    current_page: number;
    current_page_url: string;
    data: ReengagementUser[];
    first_page_url: string;
    from: number;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total?: number;
}

export interface ReengagementResponse {
    success: boolean;
    data: {
        users: ReengagementPagination;
        metrics: ReengagementMetrics;
    };
}

// === Tipos para detalhes do usuario (show) ===

export interface PersonalOrderItem {
    id: number;
    product_id: number;
    category_id: number;
    personal_order_id: number;
    combo_id: number | null;
    user_id: number;
    amount: number;
    unit_value: string;
    points: string;
    commission_value: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    internationalization: {
        id: number;
        product_id: number;
        product_name: string;
        description: string;
        category_id: number;
        subcategory_id: number;
        store_value: string;
        store_code: string;
        price: number;
        points: number;
        status: number;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

export interface PersonalOrder {
    id: number;
    code: number;
    user_id: number;
    value: string;
    payment_date: string | null;
    points?: string | null;
    status: number;
    delivery_status?: number | null;
    delivery_date: string | null;
    delivery_type?: number | null;
    created_at: string;
    updated_at: string;
    personal_order_items: PersonalOrderItem[];
    [key: string]: unknown;
}

export interface PersonalAddress {
    id: number;
    user_id: number;
    address_line: string;
    number: string;
    complement: string | null;
    district: string;
    zip_code: string;
    city: {
        id: number;
        name: string;
        state_id: number;
    };
    state: {
        id: number;
        name: string;
        uf: string;
    };
    [key: string]: unknown;
}

export interface UserDetail {
    id: number;
    uuid: string;
    name: string;
    login: string;
    email: string;
    phone_number: string;
    phone_code: string;
    country_code: string;
    classification: string;
    created_at: string;
    updated_at: string;
    personal_orders: PersonalOrder[] | null;
    personal_data: PersonalData;
    personal_address: PersonalAddress | null;
    [key: string]: unknown;
}

export interface ReengagementObservation {
    id: number;
    reengagement_id: number;
    observation: string;
    next_contact_date: string;
    created_at: string;
    updated_at: string;
}

export interface CustomerReengagement {
    id: number;
    user_id: number;
    recruiter_id: number;
    personal_order_id: number | null;
    status: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    observations: ReengagementObservation[];
}

export interface UserDetailResponse {
    success: boolean;
    data: {
        user: UserDetail;
        customerReengagement: CustomerReengagement;
        statusReengagements: Record<string, string>;
        statusOrderCollection: Record<string, string>;
    };
}

// === Tipos para meus atendimentos (personal) ===

export interface PersonalReengagement {
    id: number;
    user_id: number;
    recruiter_id: number;
    personal_order_id: number | null;
    status: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user: {
        id: number;
        uuid: string;
        name: string;
        login: string;
        email: string;
        phone_number: string;
        phone_code: string;
        country_code: string;
        classification: string;
        created_at: string;
        updated_at: string;
        [key: string]: unknown;
    };
    personal_order: PersonalOrder | null;
}

export interface PersonalReengagementPagination {
    current_page: number;
    current_page_url: string;
    data: PersonalReengagement[];
    first_page_url: string;
    from: number;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
}

export interface PersonalReengagementResponse {
    success: boolean;
    data: {
        customer_reengagement: PersonalReengagementPagination;
        start_date: string;
        end_date: string;
        status_recollection: Record<string, string>;
        total_attendances: number;
        total_reactivated: number;
        commissions_received: number;
        conversion_rate: number;
    };
}

// === Service ===

export const customerService = {
    /** Lista geral de clientes para reativação */
    getReengagements: async (params: Record<string, unknown> = {}) => {
        const response = await api.get<ReengagementResponse>('/api/reengagements', {
            params,
        });
        return response.data;
    },

    /** Ver detalhes / iniciar atendimento de um usuario */
    getUserDetail: async (userId: number) => {
        const response = await api.get<UserDetailResponse>(`/api/reengagements/user/${userId}`);
        return response.data;
    },

    /** Atualiza dados do usuário (email, data de nascimento) */
    updateUserData: async (userId: number, data: { email: string; birth_date: string, password?: string }) => {
        const response = await api.post(`/api/reengagements/user/${userId}/update-data`, data);
        return response.data;
    },

    /** Atualiza status do atendimento do usuário */
    updateUserStatus: async (userId: number, status: number) => {
        const response = await api.post(`/api/reengagements/user/${userId}/update-status`, { status });
        return response.data;
    },

    /** Obtém link de acesso à loja já logado pelo cliente */
    getAccessStoreLink: async (userId: number) => {
        const response = await api.get<{ success: boolean; data: { url: string; token: string } }>(`/api/reengagements/user/${userId}/access-store`);
        return response.data;
    },

    /** Registra observação e agenda próximo contato */
    addObservation: async (reengagementId: number, data: { observation: string; next_contact_date: string }) => {
        const response = await api.post(`/api/reengagements/${reengagementId}/observations`, data);
        return response.data;
    },

    /** Lista de clientes que EU estou atendendo */
    getPersonalReengagements: async (params: {
        page?: number;
        start_date?: string;
        end_date?: string;
        login?: string;
        order_id?: number;
        status?: number;
    } = {}) => {
        const response = await api.get<PersonalReengagementResponse>('/api/reengagements/personal', {
            params: {
                page: params.page ?? 1,
                ...(params.start_date && { start_date: params.start_date }),
                ...(params.end_date && { end_date: params.end_date }),
                ...(params.login && { login: params.login }),
                ...(params.order_id && { order_id: params.order_id }),
                ...(params.status !== undefined && { status: params.status }),
            },
        });
        return response.data;
    },
};
