import api from "@/services/api.ts";


async function getStates() {
    try {
        const response = await api.get('/api/states')
        return response.data
    }
    catch (error) {
        console.error('Erro ao buscar estados:', error);
    }

    async function getCities() {
        try {
            const response = await api.get('/api/states')
            return response.data
        }
        catch (error) {
            console.error('Erro ao buscar estados:', error);
        }
    }

    async function getRegions() {
        try {
            const response = await api.get('/api/states')
            return response.data
        }
        catch (error) {
            console.error('Erro ao buscar estados:', error);
        }
    }
}