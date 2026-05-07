import { queryClient } from './queryClient';

const AUTH_STORAGE_KEYS = ['token', 'user'];

export function clearClientState() {
    queryClient.clear();

    AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    sessionStorage.clear();
}
