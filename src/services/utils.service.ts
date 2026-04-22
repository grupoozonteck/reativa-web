import api from './api';

export interface UtilityItem {
    id: number;
    name: string;
}

interface UtilityListResponse {
    success: boolean;
    data: UtilityItem[];
}

const CACHE_TTL_MS = 1000 * 60 * 60 * 12;

const memoryCache = new Map<string, { expiresAt: number; value: UtilityItem[] }>();

async function fetchCachedList(cacheKey: string, path: string): Promise<UtilityItem[]> {
    const cached = memoryCache.get(cacheKey);
    const now = Date.now();

    if (cached && cached.expiresAt > now) {
        return cached.value;
    }

    const response = await api.get<UtilityListResponse>(path);
    const value = Array.isArray(response.data?.data) ? response.data.data : [];

    memoryCache.set(cacheKey, {
        expiresAt: now + CACHE_TTL_MS,
        value,
    });

    return value;
}

function toRecord(items: UtilityItem[]): Record<string, string> {
    return items.reduce<Record<string, string>>((acc, item) => {
        acc[String(item.id)] = item.name;
        return acc;
    }, {});
}

export const utilsService = {
    getAttendantTypes: () => fetchCachedList('attendant-types', '/api/utils/attendants/types'),
    getAttendantGraduates: () => fetchCachedList('attendant-graduates', '/api/utils/attendants/graduates'),
    getAttendantStatus: () => fetchCachedList('attendant-status', '/api/utils/attendants/status'),
    getReengagementStatus: () => fetchCachedList('reengagement-status', '/api/utils/reengagements/status'),
    getOrderStatus: () => fetchCachedList('order-status', '/api/utils/orders/status'),

    getAttendantTypesMap: async () => toRecord(await utilsService.getAttendantTypes()),
    getAttendantGraduatesMap: async () => toRecord(await utilsService.getAttendantGraduates()),
    getAttendantStatusMap: async () => toRecord(await utilsService.getAttendantStatus()),
    getReengagementStatusMap: async () => toRecord(await utilsService.getReengagementStatus()),
    getOrderStatusMap: async () => toRecord(await utilsService.getOrderStatus()),
};
