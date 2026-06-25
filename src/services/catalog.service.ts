import api from './api';

export interface Category {
    id: number;
    uuid: string | null;
    name: string;
    lang_key: string;
    slug: string;
    active: number;
    type: string;
    parent_id: number | null;
}

export interface Product {
    name: string;
    code: string;
    price: string;
    store_value: string;
    points: number;
    description: string;
    category_id: number;
    category: string;
    is_promotional: boolean;
    is_release: boolean;
    media: string[];
}

export interface CatalogResponse {
    categories: Record<string, Category>;
    currency: string;
    products: Record<string, Product>;
}

export const catalogService = {
    getCatalog: async (): Promise<CatalogResponse> => {
        const response = await api.get<CatalogResponse>('/api/catalog');
        return response.data;
    },
};
